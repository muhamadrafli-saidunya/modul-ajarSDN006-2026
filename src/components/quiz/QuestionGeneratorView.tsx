import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Printer,
  Download,
  FileQuestion,
  HelpCircle,
  CheckCircle,
  Copy,
  Layers,
  ListOrdered,
  BookOpen,
  GraduationCap,
  Settings2,
  RefreshCw,
  Plus,
  Minus,
  Trash2,
  Edit3,
  Eye,
  CheckSquare,
  ArrowRight,
  School,
  FileText,
  Sliders,
  ExternalLink,
  ChevronRight,
  FileSpreadsheet,
  Check,
  CheckCheck,
  Filter,
  Search,
  X,
  AlertCircle,
} from 'lucide-react';
import { useGoogleAuth } from '../../context/GoogleAuthContext';
import {
  GeneratedExam,
  QuestionItem,
  QuestionType,
  KopConfig,
  TeachingModule,
  MultiTpItemConfig,
} from '../../types';
import {
  RECOMMENDED_TPS,
  generateOfflineQuestions,
  generateExamPaperHtml,
  generateAnswerKeyHtml,
  generateKisiKisiHtml,
  generateStudentAnswerSheetHtml,
  downloadExamWordDoc
} from '../../utils/questionGeneratorEngine';

const SUBJECTS_LIST = [
  'IPAS',
  'Matematika',
  'Bahasa Indonesia',
  'Pendidikan Pancasila',
  'Pendidikan Agama Islam',
  'PJOK',
  'Seni Rupa',
  'Seni Musik',
  'Seni Tari',
  'Seni Teater',
  'Bahasa Inggris',
  'Koding & Kecerdasan Artifisial',
  'Bahasa Arab',
  'Muatan Lokal / Bahasa Daerah',
];

const QUESTION_TYPES: { type: QuestionType; label: string; desc: string; icon: string }[] = [
  {
    type: 'Pilihan Ganda',
    label: 'Pilihan Ganda (PG)',
    desc: 'Pilihan 4 opsi (A, B, C, D) dengan satu kunci jawaban mutlak',
    icon: '🔘',
  },
  {
    type: 'Campuran',
    label: 'Kombinasi / Campuran',
    desc: 'Proporsional: 60% Pilihan Ganda, 25% Isian Singkat, 15% Uraian HOTS',
    icon: '📑',
  },
  {
    type: 'Isian Singkat',
    label: 'Isian Singkat',
    desc: 'Melengkapi kalimat atau istilah konsep sains/fakta yang tepat',
    icon: '✏️',
  },
  {
    type: 'Uraian',
    label: 'Uraian / Esai Kasus',
    desc: 'Pertanyaan nalar kritis, analisis sebab-akibat, dan studi kasus',
    icon: '📝',
  },
  {
    type: 'Pilihan Ganda Kompleks',
    label: 'Pilihan Ganda Kompleks',
    desc: 'Memilih lebih dari satu opsi yang benar dengan tanda centang (✓)',
    icon: '☑️',
  },
  {
    type: 'Menjodohkan',
    label: 'Menjodohkan',
    desc: 'Menghubungkan konsep pada Kolom A dengan definisi pada Kolom B',
    icon: '🔗',
  },
  {
    type: 'Benar/Salah',
    label: 'Benar / Salah (B-S)',
    desc: 'Mengevaluasi kebenaran pernyataan ilmiah atau logika fakta',
    icon: '⚖️',
  },
];

// Helper to construct full TP list with configurable question counts for any subject
function buildDefaultMultiTps(subj: string): MultiTpItemConfig[] {
  const presets = RECOMMENDED_TPS[subj] || [];
  if (presets.length > 0) {
    const list: MultiTpItemConfig[] = [];
    let counter = 1;
    presets.forEach((group) => {
      group.tpList.forEach((tpText) => {
        list.push({
          id: `tp-cfg-${counter++}`,
          topic: group.topic,
          tp: tpText,
          count: 2, // Alokasi default 2 butir soal per TP
          enabled: true,
        });
      });
    });
    return list;
  }
  return [
    {
      id: 'tp-cfg-1',
      topic: `Materi Awal ${subj}`,
      tp: `Peserta didik memahami konsep esensial dan terminologi dasar pada mata pelajaran ${subj}.`,
      count: 2,
      enabled: true,
    },
    {
      id: 'tp-cfg-2',
      topic: `Penerapan Konsep ${subj}`,
      tp: `Peserta didik menerapkan prinsip dan prosedur untuk memecahkan masalah kontekstual pada mata pelajaran ${subj}.`,
      count: 2,
      enabled: true,
    },
    {
      id: 'tp-cfg-3',
      topic: `Nalar Kritis & Analisis ${subj}`,
      tp: `Peserta didik menganalisis hubungan sebab-akibat, membandingkan data, dan mengevaluasi solusi pada materi ${subj}.`,
      count: 3,
      enabled: true,
    },
  ];
}

export const QuestionGeneratorView: React.FC = () => {
  const {
    userProfile,
    setModules,
    showToast,
    setCurrentView,
    setCurriculumInitialTab,
    setCurriculumTargetSubject,
    setCurriculumTargetFase,
    selectedTpPayload,
    setSelectedTpPayload,
  } = useApp();

  // Google Sheets Integration
  const {
    isConnected: isGoogleConnected,
    signIn: signInGoogle,
    exportExamToSheets,
    setIsSheetsModalOpen,
  } = useGoogleAuth();
  const [isExportingSheets, setIsExportingSheets] = useState<boolean>(false);
  const [showSheetsConfirmModal, setShowSheetsConfirmModal] = useState<boolean>(false);
  const [exportedSheetsUrl, setExportedSheetsUrl] = useState<string | null>(null);

  // Form Configuration State
  const [subject, setSubject] = useState<string>('IPAS');
  const [customSubject, setCustomSubject] = useState<string>('');
  const [grade, setGrade] = useState<string>(userProfile.gradeAssigned ? String(userProfile.gradeAssigned) : '4');
  const [fase, setFase] = useState<string>('Fase B');
  const [semester, setSemester] = useState<number>(userProfile.activeSemester || 1);
  const [academicYear, setAcademicYear] = useState<string>(userProfile.academicYear || '2024/2025');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);

  // Exam Generation Mode: 'multi_tp' (Seluruh TP Gabungan) or 'single_tp' (Satu TP saja)
  const [examMode, setExamMode] = useState<'multi_tp' | 'single_tp'>('multi_tp');
  const [multiTpConfigs, setMultiTpConfigs] = useState<MultiTpItemConfig[]>(() =>
    buildDefaultMultiTps('IPAS')
  );

  // Custom TP modal state & search filter
  const [showAddCustomTpModal, setShowAddCustomTpModal] = useState<boolean>(false);
  const [newCustomTpText, setNewCustomTpText] = useState<string>('');
  const [newCustomTpTopic, setNewCustomTpTopic] = useState<string>('');
  const [newCustomTpCount, setNewCustomTpCount] = useState<number>(3);
  const [filterTpSearch, setFilterTpSearch] = useState<string>('');

  // Single TP Mode fallback states
  const [tp, setTp] = useState<string>(
    'Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada tumbuhan (akar, batang, daun, bunga).'
  );
  const [topic, setTopic] = useState<string>('Bagian Tubuh Tumbuhan & Fotosintesis');

  // Question Parameters & Variety Style
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [questionType, setQuestionType] = useState<QuestionType>('Pilihan Ganda');
  const [cognitiveLevel, setCognitiveLevel] = useState<string>('HOTS (C4-C6)');
  const [questionStyle, setQuestionStyle] = useState<string>(
    'Bervariasi Penuh (Kasus, Tabel Data, Sebab-Akibat, Solusi & Komparasi)'
  );

  // Sync multiTpConfigs when subject changes
  useEffect(() => {
    setMultiTpConfigs(buildDefaultMultiTps(subject));
  }, [subject]);

  // Synchronize when TP is selected from Curriculum Guide
  useEffect(() => {
    if (selectedTpPayload) {
      if (selectedTpPayload.tp) setTp(selectedTpPayload.tp);
      if (selectedTpPayload.topic) setTopic(selectedTpPayload.topic);
      if (selectedTpPayload.subject) setSubject(selectedTpPayload.subject);
      if (selectedTpPayload.grade) setGrade(selectedTpPayload.grade);
      setSelectedTpPayload(null);
    }
  }, [selectedTpPayload, setSelectedTpPayload]);

  // Computed Multi-TP stats
  const activeMultiTps = useMemo(() => {
    return multiTpConfigs.filter(it => it.enabled && it.count > 0);
  }, [multiTpConfigs]);

  const totalMultiQuestions = useMemo(() => {
    return activeMultiTps.reduce((acc, it) => acc + (Number(it.count) || 0), 0);
  }, [activeMultiTps]);

  const filteredMultiTps = useMemo(() => {
    if (!filterTpSearch.trim()) return multiTpConfigs;
    const q = filterTpSearch.toLowerCase();
    return multiTpConfigs.filter(
      it => it.topic.toLowerCase().includes(q) || it.tp.toLowerCase().includes(q)
    );
  }, [multiTpConfigs, filterTpSearch]);

  // Multi-TP interactive actions
  const handleToggleTpItem = (id: string) => {
    setMultiTpConfigs(prev =>
      prev.map(it => (it.id === id ? { ...it, enabled: !it.enabled } : it))
    );
  };

  const handleUpdateTpCount = (id: string, count: number) => {
    const val = Math.max(1, Math.min(25, count));
    setMultiTpConfigs(prev =>
      prev.map(it => (it.id === id ? { ...it, count: val } : it))
    );
  };

  const handleToggleAllTps = (selectAll: boolean) => {
    setMultiTpConfigs(prev => prev.map(it => ({ ...it, enabled: selectAll })));
    showToast(selectAll ? 'Semua TP berhasil diaktifkan!' : 'Pilihan semua TP dibatalkan.', 'info');
  };

  const handleSetUniformCount = (count: number) => {
    setMultiTpConfigs(prev => prev.map(it => ({ ...it, count })));
    showToast(`Alokasi butir soal semua TP diseragamkan menjadi ${count} butir!`, 'info');
  };

  const handleAddCustomTp = () => {
    if (!newCustomTpText.trim()) {
      showToast('Teks Tujuan Pembelajaran (TP) tidak boleh kosong!', 'error');
      return;
    }
    const newItem: MultiTpItemConfig = {
      id: `custom-tp-${Date.now()}`,
      topic: newCustomTpTopic.trim() || `Topik Tambahan ${subject}`,
      tp: newCustomTpText.trim(),
      count: Math.max(1, newCustomTpCount || 3),
      enabled: true,
    };
    setMultiTpConfigs(prev => [newItem, ...prev]);
    setNewCustomTpText('');
    setNewCustomTpTopic('');
    setShowAddCustomTpModal(false);
    showToast('Tujuan Pembelajaran tambahan berhasil dimasukkan ke daftar!', 'success');
  };

  const handleRemoveCustomTp = (id: string) => {
    setMultiTpConfigs(prev => prev.filter(it => it.id !== id));
    showToast('TP berhasil dihapus dari daftar pilihan.', 'info');
  };

  // Navigate to Curriculum & TP Settings
  const handleNavigateToTpSettings = () => {
    if (setCurriculumInitialTab) setCurriculumInitialTab('cp');
    if (setCurriculumTargetSubject) setCurriculumTargetSubject(subject);
    const faseLetter = (fase.replace('Fase ', '').trim() || 'B') as 'A' | 'B' | 'C';
    if (setCurriculumTargetFase) setCurriculumTargetFase(faseLetter);
    setCurrentView('curriculum');
    showToast('Membuka Panduan & Pengaturan Capaian Pembelajaran (CP) dan Alur Tujuan Pembelajaran (ATP/TP)...', 'info');
  };

  // Generation & Results State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStepText, setGenerationStepText] = useState<string>('');
  const [generatedExam, setGeneratedExam] = useState<GeneratedExam | null>(() => {
    // Sedia instrumen asesmen lengkap sejak awal saat dibuka di webapp
    const initSubject = 'IPAS';
    const initGrade = '4';
    const initFase = 'Fase B';
    const initTp = 'Peserta didik menganalisis proses fotosintesis pada tumbuhan serta mengidentifikasi faktor-faktor yang mempengaruhinya.';
    const initTopic = 'Fotosintesis & Bagian Tumbuhan';
    const initQuestions = generateOfflineQuestions(
      initSubject,
      initGrade,
      initTp,
      initTopic,
      'Pilihan Ganda',
      5,
      'HOTS (C4-C6)'
    );

    return {
      id: `exam-sample-ready`,
      title: `Asesmen Sumatif ${initSubject} Kelas ${initGrade}`,
      subject: initSubject,
      grade: initGrade,
      fase: initFase,
      semester: 'Semester 1 (Ganjil)',
      academicYear: '2025/2026',
      tp: initTp,
      topic: initTopic,
      questionType: 'Pilihan Ganda',
      questionCount: initQuestions.length,
      cognitiveLevel: 'HOTS (C4-C6)',
      questionStyle: 'Bervariasi Penuh (Kasus, Tabel Data, Sebab-Akibat, Solusi & Komparasi)',
      durationMinutes: 60,
      kopConfig: {
        showKop: true,
        showSignature: false,
        leftLogoUrl: '',
        rightLogoUrl: '',
        leftLogoSize: 72,
        rightLogoSize: 72,
        governmentHeader: 'PEMERINTAH KABUPATEN / KOTA',
        departmentHeader: 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
        schoolName: 'SD NEGERI 01 MENTENG JAYA',
        schoolAddress: 'Jl. Pendidikan No. 12',
        schoolContact: 'Telp: (021) 1234567 • NPSN: 20108392',
        signaturePlace: 'Jakarta',
        signatureDate: '',
        headmasterTitle: 'Kepala Sekolah',
        headmasterName: 'Dra. Hj. Siti Rohmah, M.Pd.',
        headmasterNip: '19720315 199603 2 003',
        teacherTitle: 'Guru Pengampu / Penyusun',
        teacherName: 'Budi Santoso, S.Pd.',
        teacherNip: '19850412 201001 1 014',
        showDigitalSignature: false,
      },
      questions: initQuestions,
      createdAt: new Date().toISOString(),
    };
  });
  const [activeTab, setActiveTab] = useState<'naskah' | 'kunci' | 'kisi-kisi' | 'ljk'>('naskah');
  const [showAnswerInExam, setShowAnswerInExam] = useState<boolean>(false);

  // Editing single question modal
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);

  // Calculate Fase automatically when grade changes
  useEffect(() => {
    const g = Number(grade);
    if (g === 1 || g === 2) setFase('Fase A');
    else if (g === 3 || g === 4) setFase('Fase B');
    else if (g === 5 || g === 6) setFase('Fase C');
  }, [grade]);

  // Handle Preset TP Selection for Single TP mode
  const handleSelectPresetTp = (selectedTopic: string, selectedTp: string) => {
    setTopic(selectedTopic);
    setTp(selectedTp);
    showToast(`TP & Topik '${selectedTopic}' berhasil diterapkan!`, 'info');
  };

  // Main Generator Function (Handles both Seluruh TP Gabungan and Single TP)
  const handleGenerateQuestions = async () => {
    const effectiveSubject = subject === 'Lainnya' ? customSubject.trim() || 'Mata Pelajaran Umum' : subject;

    if (examMode === 'single_tp' && !tp.trim()) {
      showToast('Mohon masukkan Tujuan Pembelajaran (TP) terlebih dahulu!', 'error');
      return;
    }

    if (examMode === 'multi_tp' && (activeMultiTps.length === 0 || totalMultiQuestions === 0)) {
      showToast('Pilih minimal 1 Tujuan Pembelajaran (TP) dengan alokasi butir soal > 0!', 'error');
      return;
    }

    setIsGenerating(true);

    const baseKop = userProfile.kopConfig || {
      showKop: true,
      showSignature: false,
      leftLogoUrl: '',
      rightLogoUrl: '',
      leftLogoSize: 72,
      rightLogoSize: 72,
      governmentHeader: 'PEMERINTAH KABUPATEN / KOTA',
      departmentHeader: 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
      schoolName: userProfile.school || 'SD NEGERI 01 MENTENG JAYA',
      schoolAddress: 'Jl. Pendidikan No. 12',
      schoolContact: 'Telp: (021) 1234567 • NPSN: ' + (userProfile.npsn || '20108392'),
      signaturePlace: userProfile.city || 'Jakarta',
      signatureDate: '',
      headmasterTitle: 'Kepala Sekolah',
      headmasterName: userProfile.headmasterName || 'Dra. Hj. Siti Rohmah, M.Pd.',
      headmasterNip: userProfile.headmasterNip || '19720315 199603 2 003',
      teacherTitle: 'Guru Pengampu / Penyusun',
      teacherName: userProfile.name || 'Budi Santoso, S.Pd.',
      teacherNip: userProfile.nip || '19850412 201001 1 014',
      showDigitalSignature: false,
    };

    const kopConfigToUse: KopConfig = {
      ...baseKop,
      showSignature: false,
    };

    try {
      let finalQuestions: QuestionItem[] = [];

      if (examMode === 'multi_tp') {
        setGenerationStepText(
          `Mempersiapkan pembuatan soal gabungan dari ${activeMultiTps.length} Tujuan Pembelajaran (${totalMultiQuestions} butir)...`
        );

        // 1. Attempt AI generation with multiTpItems
        try {
          const response = await fetch('/api/generate-questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subject: effectiveSubject,
              grade,
              fase,
              tp: activeMultiTps.map(it => it.tp).join(' | '),
              topic: activeMultiTps.map(it => it.topic).filter((v, i, a) => a.indexOf(v) === i).join(', '),
              multiTpItems: activeMultiTps.map(it => ({
                tp: it.tp,
                topic: it.topic,
                count: it.count,
              })),
              questionCount: totalMultiQuestions,
              questionType,
              cognitiveLevel,
              questionStyle,
              semester,
              academicYear,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.hasAi && Array.isArray(data.questions) && data.questions.length > 0) {
              finalQuestions = data.questions;
            }
          }
        } catch {
          // AI failed, fallback to local engine
        }

        // 2. Fallback to deterministic curriculum generator per TP
        if (!finalQuestions || finalQuestions.length === 0) {
          setGenerationStepText('Menyusun butir soal via mesin kurikulum terstandar untuk setiap Tujuan Pembelajaran...');
          const combinedList: QuestionItem[] = [];
          activeMultiTps.forEach(item => {
            const subList = generateOfflineQuestions(
              effectiveSubject,
              grade,
              item.tp,
              item.topic,
              questionType,
              item.count,
              cognitiveLevel
            );
            subList.forEach(q => {
              combinedList.push({
                ...q,
                tpRef: item.tp,
                topicRef: item.topic,
              });
            });
          });
          finalQuestions = combinedList;
        }

        // 3. Consecutive numbering 1 to total questions
        finalQuestions = finalQuestions.map((q, idx) => ({
          ...q,
          number: idx + 1,
        }));

        const uniqueTopics = Array.from(new Set(activeMultiTps.map(it => it.topic))).join(', ');
        const examTitle = `Asesmen Sumatif Komprehensif ${effectiveSubject} Kelas ${grade} (Seluruh TP)`;

        const newExam: GeneratedExam = {
          id: `exam-multi-${Date.now()}`,
          title: examTitle,
          subject: effectiveSubject,
          grade,
          fase,
          semester,
          academicYear,
          tp: `Asesmen Gabungan ${activeMultiTps.length} Tujuan Pembelajaran (TP Kurikulum Merdeka)`,
          topic: `Seluruh Lingkup Materi (${uniqueTopics})`,
          isMultiTp: true,
          multiTpConfigs: activeMultiTps,
          questionType,
          questionCount: finalQuestions.length,
          cognitiveLevel,
          questionStyle,
          durationMinutes,
          kopConfig: kopConfigToUse,
          questions: finalQuestions,
          createdAt: new Date().toISOString(),
        };

        setGeneratedExam(newExam);
        showToast(
          `Berhasil menggabungkan ${finalQuestions.length} butir soal dari ${activeMultiTps.length} TP menjadi 1 hasil kerja terpadu!`,
          'success'
        );
      } else {
        // Single TP Mode
        setGenerationStepText('Menghubungkan ke Gemini AI & menganalisis Tujuan Pembelajaran...');
        const response = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: effectiveSubject,
            grade,
            fase,
            tp,
            topic,
            questionCount,
            questionType,
            cognitiveLevel,
            questionStyle,
            semester,
            academicYear,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.hasAi && Array.isArray(data.questions) && data.questions.length > 0) {
            finalQuestions = data.questions;
          }
        }

        if (!finalQuestions || finalQuestions.length === 0) {
          setGenerationStepText('Menyusun butir soal via mesin kurikulum terstandar...');
          finalQuestions = generateOfflineQuestions(
            effectiveSubject,
            grade,
            tp,
            topic,
            questionType,
            questionCount,
            cognitiveLevel
          );
        }

        finalQuestions = finalQuestions.slice(0, questionCount).map((q, i) => ({
          ...q,
          number: i + 1,
        }));

        const newExam: GeneratedExam = {
          id: `exam-${Date.now()}`,
          title: `Asesmen Sumatif ${effectiveSubject} Kelas ${grade}`,
          subject: effectiveSubject,
          grade,
          fase,
          semester,
          academicYear,
          tp,
          topic: topic || tp,
          isMultiTp: false,
          questionType,
          questionCount: finalQuestions.length,
          cognitiveLevel,
          questionStyle,
          durationMinutes,
          kopConfig: kopConfigToUse,
          questions: finalQuestions,
          createdAt: new Date().toISOString(),
        };

        setGeneratedExam(newExam);
        showToast(`Berhasil menyusun ${finalQuestions.length} butir soal dengan variasi pola & kunci jawaban!`, 'success');
      }

      setTimeout(() => {
        const target = document.getElementById('exam-preview-panel');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 120);
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses soal, silakan coba kembali.', 'error');
    } finally {
      setIsGenerating(false);
      setGenerationStepText('');
    }
  };

  // Print Active Tab
  const handlePrint = () => {
    window.print();
  };

  // Download Word Document (.doc)
  const handleDownloadWord = () => {
    if (!generatedExam) return;
    let htmlContent = '';
    let suffix = 'Naskah_Soal';

    if (activeTab === 'naskah') {
      htmlContent = generateExamPaperHtml(generatedExam, { showAnswers: showAnswerInExam });
      suffix = showAnswerInExam ? 'Naskah_dan_Kunci' : 'Naskah_Siswa';
    } else if (activeTab === 'kunci') {
      htmlContent = generateAnswerKeyHtml(generatedExam);
      suffix = 'Kunci_dan_Rubrik';
    } else if (activeTab === 'kisi-kisi') {
      htmlContent = generateKisiKisiHtml(generatedExam);
      suffix = 'Kisi_Kisi_Soal';
    } else {
      htmlContent = generateStudentAnswerSheetHtml(generatedExam);
      suffix = 'Lembar_Jawaban_LJK';
    }

    downloadExamWordDoc(generatedExam, htmlContent, suffix);
    showToast(`Naskah ${suffix.replace(/_/g, ' ')} berhasil diunduh ke format Word (.doc)!`, 'success');
  };

  // Copy Plain Text Content
  const handleCopyText = () => {
    if (!generatedExam) return;
    let textToCopy = `=== ${generatedExam.title.toUpperCase()} ===\n`;
    textToCopy += `Mata Pelajaran: ${generatedExam.subject}\n`;
    textToCopy += `Kelas / Semester: Kelas ${generatedExam.grade} / Semester ${generatedExam.semester}\n`;
    textToCopy += `TP: ${generatedExam.tp}\n`;
    textToCopy += `Waktu: ${generatedExam.durationMinutes} Menit\n\n`;

    generatedExam.questions.forEach((q, idx) => {
      textToCopy += `${idx + 1}. ${q.stimulus ? `[Stimulus: ${q.stimulus}] ` : ''}${q.question}\n`;
      if (q.options && q.options.length > 0) {
        q.options.forEach(opt => {
          textToCopy += `   ${opt}\n`;
        });
      }
      textToCopy += `\n`;
    });

    if (showAnswerInExam || activeTab === 'kunci') {
      textToCopy += `\n=== KUNCI JAWABAN & PEMBAHASAN ===\n`;
      generatedExam.questions.forEach((q, idx) => {
        textToCopy += `${idx + 1}. Kunci: ${q.correctAnswer} (${q.type} - ${q.cognitiveLevel})\n   Pembahasan: ${q.discussion}\n\n`;
      });
    }

    navigator.clipboard.writeText(textToCopy);
    showToast('Teks soal dan kunci berhasil disalin ke clipboard!', 'success');
  };

  // Save Exam to App Context Modules
  const handleSaveToAssessmentBank = () => {
    if (!generatedExam) return;
    const effectiveSubject = generatedExam.subject;

    const newModule: TeachingModule = {
      id: `mod-exam-${Date.now()}`,
      code: `EXAM-${effectiveSubject.slice(0, 3).toUpperCase()}-${generatedExam.grade}-${Date.now().toString().slice(-4)}`,
      title: `${generatedExam.title} (${generatedExam.questions.length} Butir Soal)`,
      type: 'Asesmen & Rubrik',
      fase: generatedExam.fase as any,
      grade: Number(generatedExam.grade) || 4,
      subject: effectiveSubject,
      semester: generatedExam.semester as 1 | 2,
      academicYear: generatedExam.academicYear,
      author: userProfile.name || 'Guru Pengampu',
      nipAuthor: userProfile.nip || '-',
      school: userProfile.school || 'SD Negeri 01 Menteng Jaya',
      headmaster: userProfile.headmasterName,
      nipHeadmaster: userProfile.headmasterNip,
      kopConfig: generatedExam.kopConfig,
      status: 'Terverifikasi',
      allocatedHours: `${generatedExam.durationMinutes} Menit`,
      curriculumApproach: 'merdeka',
      documentCategory: 'modul_ajar',
      satuanPendidikan: 'sd',
      targetStudents: 'Reguler (28 Siswa)',
      profilPancasila: ['Bernalar Kritis', 'Mandiri', 'Kreatif'],
      modelPembelajaran: 'Penilaian Otentik Berbasis HOTS',
      saranaPrasarana: ['Lembar Naskah Soal Ber-KOP', 'Lembar Jawab Siswa (LJK)', 'Rubrik Penskoran'],
      langkahKegiatan: {
        pendahuluan: ['Doa bersama dan pembacaan tata tertib pengerjaan soal', 'Pengecekan kelengkapan naskah soal siswa'],
        inti: ['Pengerjaan soal secara mandiri, jujur, dan berkesadaran', 'Pengawasan pelaksanaan asesmen sumatif'],
        penutup: ['Pengumpulan naskah dan lembar jawab siswa', 'Refleksi singkat kesulitan soal bersama guru']
      },
      asesmenDesc: `Asesmen Sumatif Lingkup Materi ${generatedExam.topic} (${generatedExam.questions.length} Butir Soal)`,
      lampiran: {
        lkpd: 'Lembar Soal Siswa Siap Cetak',
        materiSingkat: 'Kunci Jawaban & Rubrik Penskoran Lengkap',
        rubrikPenilaian: 'Kisi-kisi Penulisan Soal',
        remedialPengayaan: 'Petunjuk Penilaian & KKTP'
      },
      capaianPembelajaran: `Tujuan Pembelajaran: ${generatedExam.tp}`,
      tujuanPembelajaran: [generatedExam.tp],
      pemahamanBermakna: `Asesmen sumatif untuk mengukur ketercapaian TP materi ${generatedExam.topic}.`,
      pertanyaanPemantik: [
        'Bagaimana siswa menunjukkan pemahaman konsep secara terintegrasi?',
        'Apa bukti autentik bahwa siswa telah mencapai tujuan pembelajaran?',
      ],
      fullDocumentHtml: generateExamPaperHtml(generatedExam, { showAnswers: true }),
      supplementaryDocs: {
        lkpdHtml: generateExamPaperHtml(generatedExam, { showAnswers: false }),
        bahanAjarHtml: generateAnswerKeyHtml(generatedExam),
        silabusHtml: generateKisiKisiHtml(generatedExam),
      },
      downloadsCount: 0,
      rating: 5.0,
      tags: ['Asesmen Sumatif', effectiveSubject, `Kelas ${generatedExam.grade}`, 'Soal AI', 'Kisi-kisi'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setModules(prev => [newModule, ...prev]);
    showToast('Instrumen soal dan kisi-kisi berhasil disimpan ke Bank Perangkat Ajar!', 'success');
  };

  // Update a single question
  const handleSaveEditedQuestion = () => {
    if (!editingQuestion || !generatedExam) return;
    setGeneratedExam({
      ...generatedExam,
      questions: generatedExam.questions.map(q =>
        q.id === editingQuestion.id ? editingQuestion : q
      ),
    });
    setEditingQuestion(null);
    showToast('Perubahan butir soal berhasil disimpan!', 'success');
  };

  // Google Sheets Export confirmation and execute
  const handleConfirmExportToSheets = async () => {
    if (!generatedExam) return;
    try {
      setIsExportingSheets(true);
      const res = await exportExamToSheets(generatedExam);
      setExportedSheetsUrl(res.spreadsheetUrl);
      setShowSheetsConfirmModal(false);
      showToast('Naskah soal, kisi-kisi, dan format nilai berhasil diekspor ke Google Sheets!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengekspor ke Google Sheets', 'error');
    } finally {
      setIsExportingSheets(false);
    }
  };

  const activeTpPresets = RECOMMENDED_TPS[subject] || [];

  return (
    <div id="question-generator-page" className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* HEADER BANNER */}
      <div
        id="question-generator-banner"
        className="bg-gradient-to-r from-[#00529C] via-[#0066C0] to-[#FF7300] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generator Soal & Asesmen Kurikulum Merdeka • AI Engine 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Penyusun Soal, Kunci Jawaban & Kisi-Kisi
          </h1>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            Hasilkan instrumen asesmen bermakna sesuai <strong>Tujuan Pembelajaran (TP)</strong> dan <strong>Mata Pelajaran</strong> Anda. Lengkap dengan KOP Surat resmi sekolah, stimulus kontekstual, kunci jawaban terperinci, rubrik penskoran, serta kisi-kisi penulisan soal siap cetak A4.
          </p>
        </div>

        <div className="relative z-10 shrink-0 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSheetsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md backdrop-blur-md transition active:scale-95"
            title="Kelola Integrasi Google Sheets & Drive"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Google Sheets & Drive</span>
          </button>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE: CONFIG ON LEFT / TOP, PREVIEW ON RIGHT / BOTTOM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: PARAMETERS CARD */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-[#FF7300]">
                  <FileQuestion className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Parameter Soal
                  </h3>
                  <p className="text-xs text-slate-500">Tentukan mapel, TP, jenis dan jumlah butir</p>
                </div>
              </div>
            </div>

            {/* 1. Mata Pelajaran & Kelas */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Mata Pelajaran <span className="text-rose-500">*</span>
                </label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#00529C] focus:outline-hidden transition"
                >
                  {SUBJECTS_LIST.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                  <option value="Lainnya">Lainnya / Mata Pelajaran Kustom</option>
                </select>

                {subject === 'Lainnya' && (
                  <input
                    type="text"
                    placeholder="Ketikkan nama mata pelajaran..."
                    value={customSubject}
                    onChange={e => setCustomSubject(e.target.value)}
                    className="mt-2 w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#00529C]"
                  />
                )}
              </div>

              {/* Kelas, Fase, Semester */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Kelas & Fase
                  </label>
                  <select
                    value={grade}
                    onChange={e => setGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#00529C]"
                  >
                    <option value="1">Kelas 1 (Fase A)</option>
                    <option value="2">Kelas 2 (Fase A)</option>
                    <option value="3">Kelas 3 (Fase B)</option>
                    <option value="4">Kelas 4 (Fase B)</option>
                    <option value="5">Kelas 5 (Fase C)</option>
                    <option value="6">Kelas 6 (Fase C)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Semester
                  </label>
                  <select
                    value={semester}
                    onChange={e => setSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#00529C]"
                  >
                    <option value={1}>Semester 1 (Ganjil)</option>
                    <option value={2}>Semester 2 (Genap)</option>
                  </select>
                </div>
              </div>

              {/* MODE SELECTION: SELURUH TP VS SATU TP */}
              <div className="bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1 pb-1 flex items-center justify-between">
                  <span>Cakupan Asesmen:</span>
                  <span className="text-[10px] font-mono text-[#00529C] dark:text-blue-400 font-bold">Kurikulum Merdeka</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    id="mode-multi-tp-btn"
                    onClick={() => setExamMode('multi_tp')}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      examMode === 'multi_tp'
                        ? 'bg-[#00529C] text-white shadow-xs'
                        : 'bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                    }`}
                  >
                    <Layers className="w-4 h-4 shrink-0 text-amber-300" />
                    <div className="text-left min-w-0">
                      <div className="leading-tight font-black truncate">Seluruh TP (Gabung 1 Naskah)</div>
                      <div className="text-[9.5px] font-normal opacity-90 hidden sm:block truncate">Sumatif / STS / SAS Terpadu</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    id="mode-single-tp-btn"
                    onClick={() => setExamMode('single_tp')}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      examMode === 'single_tp'
                        ? 'bg-[#00529C] text-white shadow-xs'
                        : 'bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                    }`}
                  >
                    <FileText className="w-4 h-4 shrink-0 text-sky-300" />
                    <div className="text-left min-w-0">
                      <div className="leading-tight font-black truncate">Satu TP Saja</div>
                      <div className="text-[9.5px] font-normal opacity-90 hidden sm:block truncate">Formatif / Ulangan Harian</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* KONTEN BERDASARKAN MODE */}
              {examMode === 'multi_tp' ? (
                /* MODE: SELURUH TP DENGAN ALOKASI BUTIR SOAL PER TP */
                <div className="space-y-3">
                  {/* Summary Header & Batch Operations Bar */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#00529C] text-white flex items-center justify-center font-bold text-xs">
                          {activeMultiTps.length}
                        </div>
                        <div>
                          <span className="text-xs font-black text-[#00529C] dark:text-blue-300">
                            {activeMultiTps.length} TP Terpilih
                          </span>
                          <span className="text-slate-400 mx-1.5">•</span>
                          <span className="text-xs font-black text-[#FF7300]">
                            Total {totalMultiQuestions} Butir Soal Gabungan
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        id="btn-add-custom-tp"
                        onClick={() => setShowAddCustomTpModal(true)}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-[#00529C] dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-bold hover:bg-blue-50 flex items-center gap-1 transition shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah TP Kustom</span>
                      </button>
                    </div>

                    {/* Batch Actions Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-blue-100 dark:border-blue-900/40 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleAllTps(true)}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold hover:text-[#00529C] flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCheck className="w-3 h-3 text-emerald-600" />
                          <span>Pilih Semua</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleAllTps(false)}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold hover:text-rose-600 cursor-pointer"
                        >
                          <span>Kosongkan</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 dark:text-slate-400 text-[10.5px]">Set Seragam:</span>
                        {[1, 2, 3, 5].map(cnt => (
                          <button
                            key={cnt}
                            type="button"
                            onClick={() => handleSetUniformCount(cnt)}
                            className="px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold text-[10.5px] hover:border-[#FF7300] hover:text-[#FF7300] cursor-pointer"
                          >
                            {cnt} Soal
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Filter / Search within TP */}
                  {multiTpConfigs.length > 3 && (
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Cari topik atau kata kunci TP..."
                        value={filterTpSearch}
                        onChange={e => setFilterTpSearch(e.target.value)}
                        className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#00529C]"
                      />
                      {filterTpSearch && (
                        <button
                          type="button"
                          onClick={() => setFilterTpSearch('')}
                          className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* TP Cards List with Checkboxes and Count Steppers */}
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {filteredMultiTps.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className={`p-3 rounded-xl border transition-all ${
                          item.enabled
                            ? 'bg-white dark:bg-slate-800/90 border-blue-200 dark:border-blue-800/60 shadow-2xs'
                            : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={item.enabled}
                            onChange={() => handleToggleTpItem(item.id)}
                            className="mt-1 w-4 h-4 rounded text-[#00529C] focus:ring-[#00529C] cursor-pointer"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                              <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/70 text-[#00529C] dark:text-blue-300 font-black text-[10px] tracking-wide uppercase">
                                {item.topic}
                              </span>

                              {item.id.startsWith('custom-tp-') && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCustomTp(item.id)}
                                  className="text-slate-400 hover:text-rose-500 p-0.5 transition cursor-pointer"
                                  title="Hapus TP Kustom"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>

                            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                              {item.tp}
                            </p>

                            {/* Question Count Stepper for This TP */}
                            {item.enabled && (
                              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                                  Alokasi Jumlah Soal TP ini:
                                </span>

                                <div className="flex items-center gap-2">
                                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateTpCount(item.id, (item.count || 1) - 1)}
                                      className="px-2 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold cursor-pointer"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <input
                                      type="number"
                                      min={1}
                                      max={25}
                                      value={item.count}
                                      onChange={e => handleUpdateTpCount(item.id, Number(e.target.value) || 1)}
                                      className="w-10 text-center text-xs font-black text-[#FF7300] bg-transparent border-x border-slate-200 dark:border-slate-700 py-1"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateTpCount(item.id, (item.count || 1) + 1)}
                                      className="px-2 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold cursor-pointer"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>

                                  {/* Quick Chips */}
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 5].map(cnt => (
                                      <button
                                        key={cnt}
                                        type="button"
                                        onClick={() => handleUpdateTpCount(item.id, cnt)}
                                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                                          item.count === cnt
                                            ? 'bg-[#FF7300] text-white'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                                        }`}
                                      >
                                        {cnt}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* MODE: SATU TP SAJA DENGAN SLIDER JUMLAH SOAL */
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Tujuan Pembelajaran (TP) <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">Bisa diedit</span>
                    </div>
                    <textarea
                      rows={3}
                      value={tp}
                      onChange={e => setTp(e.target.value)}
                      placeholder="Masukkan Tujuan Pembelajaran (TP) yang ingin diukur..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs leading-relaxed text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#00529C] focus:outline-hidden"
                    />

                    {/* Lingkup Materi */}
                    <div className="mt-2">
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Lingkup Materi / Topik Pokok
                      </label>
                      <input
                        type="text"
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        placeholder="Contoh: Fotosintesis & Bagian Tumbuhan"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    {/* Rekomendasi TP Cepat */}
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <button
                          type="button"
                          id="btn-nav-tp-settings"
                          onClick={handleNavigateToTpSettings}
                          title="Klik untuk membuka Pengaturan & Panduan Tujuan Pembelajaran (TP) resmi Kurikulum Merdeka"
                          className="group text-[11px] font-bold text-[#00529C] dark:text-blue-400 hover:text-[#FF7300] dark:hover:text-amber-400 flex items-center gap-1.5 transition text-left cursor-pointer p-0.5 -ml-0.5 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#00529C]/30"
                        >
                          <BookOpen className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-[#00529C] dark:text-blue-400 group-hover:text-[#FF7300]" />
                          <span className="group-hover:underline underline-offset-2">
                            Pilihan TP Standar Kurikulum ({subject}):
                          </span>
                          <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </button>

                        <button
                          type="button"
                          onClick={handleNavigateToTpSettings}
                          className="text-[10px] font-bold text-slate-500 hover:text-[#00529C] dark:text-slate-400 dark:hover:text-blue-300 flex items-center gap-0.5 px-2 py-0.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40 transition shrink-0 cursor-pointer"
                        >
                          <span>Pengaturan TP</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      {activeTpPresets.length > 0 ? (
                        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                          {activeTpPresets.map((preset, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl text-xs space-y-1">
                              <div className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                                {preset.topic}
                              </div>
                              {preset.tpList.map((item, tIdx) => (
                                <button
                                  key={tIdx}
                                  type="button"
                                  onClick={() => handleSelectPresetTp(preset.topic, item)}
                                  className="text-left w-full p-1 rounded-md text-[10.5px] text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-[#00529C] dark:hover:text-blue-300 transition flex items-start gap-1"
                                >
                                  <span className="text-[#00529C] font-bold shrink-0">•</span>
                                  <span className="line-clamp-2">{item}</span>
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center">
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Belum ada preset lokal untuk mata pelajaran {subject}.
                          </p>
                          <button
                            type="button"
                            onClick={handleNavigateToTpSettings}
                            className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-[#00529C] dark:text-blue-400 hover:underline cursor-pointer"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>Buka Panduan & Pengaturan TP Lengkap ↗</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Jumlah Soal untuk Single TP */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Jumlah Soal yang Digenerate <span className="text-rose-500">*</span>
                      </label>
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-[#FF7300] font-black text-xs font-mono">
                        {questionCount} Butir Soal
                      </span>
                    </div>

                    {/* Quick selection pills */}
                    <div className="grid grid-cols-6 gap-1.5 mb-2">
                      {[5, 10, 15, 20, 25, 30].map(cnt => (
                        <button
                          key={cnt}
                          type="button"
                          onClick={() => setQuestionCount(cnt)}
                          className={`py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                            questionCount === cnt
                              ? 'bg-[#FF7300] text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {cnt}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={1}
                        max={40}
                        value={questionCount}
                        onChange={e => setQuestionCount(Number(e.target.value))}
                        className="flex-1 accent-[#FF7300]"
                      />
                      <input
                        type="number"
                        min={1}
                        max={40}
                        value={questionCount}
                        onChange={e => setQuestionCount(Math.max(1, Math.min(40, Number(e.target.value) || 1)))}
                        className="w-16 px-2 py-1 text-center font-bold text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Jenis Soal */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Jenis / Bentuk Soal <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {QUESTION_TYPES.map(item => (
                    <label
                      key={item.type}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                        questionType === item.type
                          ? 'bg-blue-50/70 dark:bg-blue-950/40 border-[#00529C] dark:border-blue-500'
                          : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="questionType"
                        checked={questionType === item.type}
                        onChange={() => setQuestionType(item.type)}
                        className="mt-0.5 text-[#00529C] focus:ring-[#00529C]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 5. Level Kognitif & Waktu */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Level Kognitif
                  </label>
                  <select
                    value={cognitiveLevel}
                    onChange={e => setCognitiveLevel(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100"
                  >
                    <option value="Paling Mudah (C1 Mengingat)">🟢 Paling Mudah: C1 Mengingat (Fakta, Definisi & Hafalan)</option>
                    <option value="Mudah (C2 Memahami)">🟡 Mudah: C2 Memahami (Konsep, Ciri & Contoh Dasar)</option>
                    <option value="LOTS (C1-C2)">📋 LOTS: C1-C2 (Mengingat & Pemahaman)</option>
                    <option value="MOTS (C3)">🔵 MOTS: C3 (Penerapan & Aplikasi)</option>
                    <option value="HOTS (C4-C6)">🟣 HOTS: C4-C6 (Nalar Kritis & Analisis)</option>
                    <option value="Proporsional (Campuran)">⚪ Proporsional (Campuran Seimbang C1 s.d C5)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Alokasi Waktu
                  </label>
                  <select
                    value={durationMinutes}
                    onChange={e => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100"
                  >
                    <option value={45}>45 Menit</option>
                    <option value={60}>60 Menit (Standar)</option>
                    <option value={70}>70 Menit (2 JP)</option>
                    <option value={90}>90 Menit</option>
                  </select>
                </div>
              </div>

              {/* 6. Variasi Pola Pertanyaan */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Variasi Pola Pertanyaan
                  </label>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    ✨ Anti-Monoton
                  </span>
                </div>
                <select
                  value={questionStyle}
                  onChange={e => setQuestionStyle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#00529C]"
                >
                  <option value="Bervariasi Penuh (Kasus, Tabel Data, Sebab-Akibat, Solusi & Komparasi)">
                    Bervariasi Penuh (Kasus, Tabel Data, Sebab-Akibat, Solusi & Komparasi) [Default]
                  </option>
                  <option value="Berbasis Studi Kasus & Pemecahan Masalah Kontekstual">
                    Fokus Studi Kasus & Pemecahan Masalah Kontekstual
                  </option>
                  <option value="Berbasis Analisis Data, Tabel Pengamatan & Percobaan">
                    Fokus Analisis Data, Tabel Pengamatan & Hasil Percobaan
                  </option>
                  <option value="Berbasis Hubungan Sebab-Akibat & Prediksi Dampak HOTS">
                    Fokus Hubungan Sebab-Akibat & Prediksi Nalar Kritis
                  </option>
                  <option value="Berbasis Refleksi Karakter, Nilai & Sikap Sosial">
                    Fokus Refleksi Karakter, Nilai & Pengambilan Sikap Bijak
                  </option>
                </select>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1">
                  AI akan merotasi stimulus cerita, tabel data, dialog percakapan, dan kunci jawaban agar bervariasi.
                </p>
              </div>
            </div>

            {/* GENERATE BUTTON */}
            <button
              id="btn-generate-questions"
              type="button"
              onClick={handleGenerateQuestions}
              disabled={isGenerating || (examMode === 'multi_tp' && (activeMultiTps.length === 0 || totalMultiQuestions === 0))}
              className="w-full py-3.5 px-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#FF7300] to-[#E65100] hover:from-[#E65100] hover:to-[#D84315] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>
                    {examMode === 'multi_tp'
                      ? `Menyusun ${totalMultiQuestions} Butir Soal Seluruh TP...`
                      : `Menyusun ${questionCount} Butir Soal...`}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    {examMode === 'multi_tp'
                      ? `Buat Soal Gabungan Seluruh TP (${totalMultiQuestions} Soal)`
                      : `Generate ${questionCount} Soal AI Sekarang`}
                  </span>
                </>
              )}
            </button>

            {isGenerating && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl border border-blue-200 dark:border-blue-900 text-center animate-pulse">
                <p className="text-xs font-bold text-[#00529C] dark:text-blue-300">
                  {generationStepText}
                </p>
              </div>
            )}
          </div>

          {/* QUICK SHORTCUT TO PROFILE / KOP */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <School className="w-5 h-5 text-[#00529C]" />
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {userProfile.school || 'SD Negeri 01 Menteng Jaya'}
                </div>
                <div className="text-[11px] text-slate-500">
                  KOP Surat & Logo Sekolah aktif
                </div>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('profile')}
              className="text-xs font-bold text-[#FF7300] hover:underline"
            >
              Ubah KOP
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: GENERATED EXAM PREVIEW & ACTIONS */}
        <div id="exam-preview-panel" className="lg:col-span-7 space-y-4">
          {generatedExam ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
              {/* ACTION TOOLBAR */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                {/* TABS */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-700/80 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('naskah')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      activeTab === 'naskah'
                        ? 'bg-white dark:bg-slate-800 text-[#00529C] dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-black'
                    }`}
                  >
                    📄 Naskah Soal ({generatedExam.questions.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('kunci')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      activeTab === 'kunci'
                        ? 'bg-white dark:bg-slate-800 text-[#00529C] dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-black'
                    }`}
                  >
                    🔑 Kunci & Rubrik
                  </button>
                  <button
                    onClick={() => setActiveTab('kisi-kisi')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      activeTab === 'kisi-kisi'
                        ? 'bg-white dark:bg-slate-800 text-[#00529C] dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-black'
                    }`}
                  >
                    📊 Kisi-Kisi Soal
                  </button>
                  <button
                    onClick={() => setActiveTab('ljk')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      activeTab === 'ljk'
                        ? 'bg-white dark:bg-slate-800 text-[#00529C] dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-black'
                    }`}
                  >
                    ✏️ LJK Siswa
                  </button>
                </div>

                {/* ACTION BUTTONS (PRINT, WORD, SAVE) */}
                <div className="flex items-center gap-2">
                  {activeTab === 'naskah' && (
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mr-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showAnswerInExam}
                        onChange={e => setShowAnswerInExam(e.target.checked)}
                        className="rounded-sm text-[#00529C]"
                      />
                      <span>Tampilkan Kunci</span>
                    </label>
                  )}

                  {/* CETAK SESUAI JUMLAH YANG DIGENERATE */}
                  <button
                    id="btn-print-exam"
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs bg-[#FF7300] hover:bg-[#E65100] text-white shadow-xs transition"
                    title="Cetak A4 sesuai jumlah butir soal yang digenerate"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak {generatedExam.questions.length} Soal</span>
                  </button>

                  <button
                    onClick={handleDownloadWord}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-[#00529C] hover:bg-[#003E75] text-white shadow-xs transition"
                    title="Unduh file Microsoft Word (.doc) lengkap KOP dan format resmi"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Unduh Word</span>
                  </button>

                  <button
                    onClick={handleCopyText}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition"
                    title="Salin Teks Soal"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleSaveToAssessmentBank}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs border border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition"
                    title="Simpan dokumen ini ke Bank Asesmen"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Simpan</span>
                  </button>

                  {/* GOOGLE SHEETS EXPORT BUTTON */}
                  <button
                    id="btn-export-google-sheets"
                    onClick={() => setShowSheetsConfirmModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition cursor-pointer"
                    title="Ekspor ke Google Sheets (Daftar Soal, Kisi-Kisi, dan Format Nilai)"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Google Sheets</span>
                  </button>
                </div>
              </div>

              {/* MULTI-TP SUMMARY BANNER */}
              {generatedExam.isMultiTp && (
                <div className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/60 dark:to-indigo-950/60 border-b border-blue-200 dark:border-blue-900/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#00529C] text-white font-black text-[10.5px]">
                      Gabungan Seluruh TP
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {generatedExam.multiTpBreakdown?.length || 'Semua'} Tujuan Pembelajaran
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-bold text-[#FF7300]">
                      {generatedExam.questions.length} Butir Soal Terpadu
                    </span>
                  </div>

                  {generatedExam.multiTpBreakdown && generatedExam.multiTpBreakdown.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {generatedExam.multiTpBreakdown.map((b, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-800 border border-blue-100 dark:border-blue-800 text-[10.5px] font-semibold text-slate-700 dark:text-slate-300"
                          title={b.tp}
                        >
                          {b.topic}: <strong className="text-[#00529C] dark:text-blue-400">{b.count} Soal</strong>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUCCESS NOTIFICATION FOR SPREADSHEET */}
              {exportedSheetsUrl && (
                <div className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-semibold">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Spreadsheet asesmen berhasil dibuat di Google Drive!</span>
                  </div>
                  <a
                    href={exportedSheetsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                  >
                    <span>Buka di Google Sheets</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* PRINTABLE PREVIEW CONTAINER */}
              <div
                id="exam-printable-content"
                className="p-4 sm:p-8 bg-slate-100 dark:bg-slate-950/60 overflow-y-auto max-h-[75vh]"
              >
                {/* Paper sheet effect */}
                <div className="bg-white text-slate-900 shadow-md border border-slate-200 rounded-sm mx-auto overflow-hidden">
                  {activeTab === 'naskah' && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateExamPaperHtml(generatedExam, {
                          showAnswers: showAnswerInExam,
                        }),
                      }}
                    />
                  )}
                  {activeTab === 'kunci' && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateAnswerKeyHtml(generatedExam),
                      }}
                    />
                  )}
                  {activeTab === 'kisi-kisi' && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateKisiKisiHtml(generatedExam),
                      }}
                    />
                  )}
                  {activeTab === 'ljk' && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateStudentAnswerSheetHtml(generatedExam),
                      }}
                    />
                  )}
                </div>
              </div>

              {/* VARIETY PATTERN DISTRIBUTION BANNER */}
              <div className="px-4 py-2.5 bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-indigo-50/90 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-800 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF7300]" />
                  <span>Variasi Pola Soal:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {Array.from(new Set(generatedExam.questions.map(q => q.pattern || 'Studi Kasus'))).map(p => {
                    const count = generatedExam.questions.filter(q => (q.pattern || 'Studi Kasus') === p).length;
                    return (
                      <span
                        key={p}
                        className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 font-medium text-[10.5px] flex items-center gap-1 shadow-2xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00529C] dark:bg-blue-400"></span>
                        <span>{p}</span>
                        <span className="font-black text-[#FF7300] dark:text-orange-400">({count})</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* LIST OF QUESTIONS WITH QUICK EDIT BUTTONS */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                    Daftar {generatedExam.questions.length} Butir Soal (Klik untuk Edit)
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Total Skor: {generatedExam.questions.reduce((s, q) => s + (q.score || 1), 0)}
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {generatedExam.questions.map(q => (
                    <div
                      key={q.id}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#00529C] dark:text-blue-300 font-bold flex items-center justify-center shrink-0">
                          {q.number}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                            {q.question}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 flex flex-wrap items-center gap-1.5">
                            {q.pattern && (
                              <span className="px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800/40 text-[9.5px]">
                                🎯 {q.pattern}
                              </span>
                            )}
                            <span>{q.type}</span>
                            <span>•</span>
                            <span
                              className={`px-1.5 py-0.5 rounded-md font-bold text-[9px] border ${
                                q.cognitiveLevel === 'C1'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                                  : q.cognitiveLevel === 'C2'
                                  ? 'bg-teal-50 text-teal-700 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800'
                                  : q.cognitiveLevel === 'C3'
                                  ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                                  : 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800'
                              }`}
                            >
                              Level {q.cognitiveLevel} {q.cognitiveLevel === 'C1' ? '(Paling Mudah)' : q.cognitiveLevel === 'C2' ? '(Mudah)' : q.cognitiveLevel === 'C3' ? '(Sedang)' : '(Tinggi)'}
                            </span>
                            <span>•</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                              Kunci: {q.correctAnswer}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setEditingQuestion({ ...q })}
                        className="p-1 rounded-md text-slate-500 hover:text-[#00529C] hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        title="Edit Teks & Kunci Soal"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* EMPTY STATE BEFORE GENERATION */
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/50 text-[#FF7300] flex items-center justify-center mx-auto">
                <FileQuestion className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Belum Ada Soal yang Digenerate
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Pilih mata pelajaran, isi Tujuan Pembelajaran (TP), tentukan jenis dan jumlah butir soal pada panel di sebelah kiri, kemudian klik tombol <strong>Generate Soal AI</strong>.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  ✨ Ber-KOP Resmi & Logo
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  📄 Naskah Siswa
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  🔑 Kunci & Rubrik
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  📊 Kisi-kisi Matriks
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  🖨️ Cetak Siap Pakai A4
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EDIT QUESTION MODAL */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Edit Soal Nomor {editingQuestion.number}
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Stimulus Bacaan / Konteks (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={editingQuestion.stimulus || ''}
                  onChange={e =>
                    setEditingQuestion({ ...editingQuestion, stimulus: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Teks Pertanyaan / Instruksi
                </label>
                <textarea
                  rows={2}
                  value={editingQuestion.question}
                  onChange={e =>
                    setEditingQuestion({ ...editingQuestion, question: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              {editingQuestion.options && editingQuestion.options.length > 0 && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Opsi Pilihan Ganda (Satu per baris)
                  </label>
                  <textarea
                    rows={4}
                    value={editingQuestion.options.join('\n')}
                    onChange={e =>
                      setEditingQuestion({
                        ...editingQuestion,
                        options: e.target.value.split('\n').filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kunci Jawaban yang Benar
                </label>
                <input
                  type="text"
                  value={editingQuestion.correctAnswer}
                  onChange={e =>
                    setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Level Kognitif (Bloom)
                  </label>
                  <select
                    value={editingQuestion.cognitiveLevel}
                    onChange={e =>
                      setEditingQuestion({
                        ...editingQuestion,
                        cognitiveLevel: e.target.value as QuestionItem['cognitiveLevel'],
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100"
                  >
                    <option value="C1">🟢 C1 - Mengingat (Paling Mudah)</option>
                    <option value="C2">🟡 C2 - Memahami (Mudah)</option>
                    <option value="C3">🔵 C3 - Menerapkan (Sedang)</option>
                    <option value="C4">🟣 C4 - Menganalisis (HOTS)</option>
                    <option value="C5">🟣 C5 - Mengevaluasi (HOTS)</option>
                    <option value="C6">🟣 C6 - Mencipta (HOTS)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bobot Skor Soal
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingQuestion.score}
                    onChange={e =>
                      setEditingQuestion({ ...editingQuestion, score: Number(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pembahasan / Rubrik Penskoran
                </label>
                <textarea
                  rows={2}
                  value={editingQuestion.discussion}
                  onChange={e =>
                    setEditingQuestion({ ...editingQuestion, discussion: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveEditedQuestion}
                className="px-4 py-2 rounded-xl bg-[#00529C] text-xs font-bold text-white shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT TO GOOGLE SHEETS CONFIRMATION MODAL */}
      {showSheetsConfirmModal && generatedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shadow-xs">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                  Konfirmasi Ekspor ke Google Sheets
                </h3>
                <p className="text-xs text-slate-500">
                  Membuat spreadsheet baru di Google Drive Anda
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Judul Spreadsheet:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-right truncate max-w-[240px]">
                  [Asesmen SD] {generatedExam.subject} - Kelas {generatedExam.grade}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jumlah Butir Soal:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {generatedExam.questions.length} Butir Soal
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Struktur Lembar Kerja:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  3 Tab Otomatis
                </span>
              </div>
              <ul className="list-disc pl-5 text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 pt-1">
                <li>1. Butir Soal & Kunci (Soal, Opsi A-D, Kunci, Bobot)</li>
                <li>2. Kisi-Kisi Asesmen (Pemetaan TP & Level Bloom)</li>
                <li>3. Format Rekap Nilai Siswa (Rumus Nilai & KKTP)</li>
              </ul>
            </div>

            {!isGoogleConnected && (
              <p className="text-[11.5px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-900/60">
                Catatan: Anda akan diminta memilih Akun Google untuk otorisasi penyimpanan file ke Google Drive Anda.
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                disabled={isExportingSheets}
                onClick={() => setShowSheetsConfirmModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isExportingSheets}
                onClick={handleConfirmExportToSheets}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition active:scale-95 disabled:opacity-60"
              >
                {isExportingSheets ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan ke Google Drive...</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Buat Spreadsheet Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH TP KUSTOM */}
      {showAddCustomTpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#00529C] dark:text-blue-300 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                    Tambah TP (Tujuan Pembelajaran) Baru
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Masukkan rumusan TP khusus atau materi tambahan guru
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCustomTpModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lingkup Materi / Topik Pokok <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Operasi Bilangan Pecahan, Ekosistem Sawah..."
                  value={newCustomTpTopic}
                  onChange={e => setNewCustomTpTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Rumusan Tujuan Pembelajaran (TP) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Peserta didik mampu menganalisis hubungan antar makhluk hidup dalam jaring-jaring makanan..."
                  value={newCustomTpText}
                  onChange={e => setNewCustomTpText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 leading-relaxed font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alokasi Jumlah Butir Soal untuk TP Ini
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newCustomTpCount}
                    onChange={e => setNewCustomTpCount(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
                    className="w-20 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-black text-[#FF7300]"
                  />
                  <span className="text-slate-500 text-xs">butir soal</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddCustomTpModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAddCustomTp}
                className="px-4 py-2 rounded-xl bg-[#00529C] hover:bg-blue-800 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambahkan ke Daftar TP</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
