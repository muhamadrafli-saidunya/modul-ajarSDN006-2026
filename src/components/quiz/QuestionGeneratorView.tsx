import React, { useState, useEffect } from 'react';
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
  Trash2,
  Edit3,
  Eye,
  CheckSquare,
  ArrowRight,
  School,
  FileText,
  Sliders
} from 'lucide-react';
import { GeneratedExam, QuestionItem, QuestionType, KopConfig, TeachingModule } from '../../types';
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

export const QuestionGeneratorView: React.FC = () => {
  const { userProfile, setModules, showToast, setCurrentView } = useApp();

  // Form Configuration State
  const [subject, setSubject] = useState<string>('IPAS');
  const [customSubject, setCustomSubject] = useState<string>('');
  const [grade, setGrade] = useState<string>(userProfile.gradeAssigned ? String(userProfile.gradeAssigned) : '4');
  const [fase, setFase] = useState<string>('Fase B');
  const [semester, setSemester] = useState<number>(userProfile.activeSemester || 1);
  const [academicYear, setAcademicYear] = useState<string>(userProfile.academicYear || '2024/2025');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);

  // TP and Topic
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

  // Handle Preset TP Selection
  const handleSelectPresetTp = (selectedTopic: string, selectedTp: string) => {
    setTopic(selectedTopic);
    setTp(selectedTp);
    showToast(`TP & Topik '${selectedTopic}' berhasil diterapkan!`, 'info');
  };

  // Main Generator Function
  const handleGenerateQuestions = async () => {
    if (!tp.trim()) {
      showToast('Mohon masukkan Tujuan Pembelajaran (TP) terlebih dahulu!', 'error');
      return;
    }

    const effectiveSubject = subject === 'Lainnya' ? customSubject.trim() || 'Mata Pelajaran Umum' : subject;
    setIsGenerating(true);
    setGenerationStepText('Menghubungkan ke Gemini AI & menganalisis Tujuan Pembelajaran...');

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
      showSignature: false, // Menghilangkan tampilan tanda tangan dan nama di lembar soal hasil generate
    };

    try {
      // 1. Attempt AI generation via server endpoint
      setGenerationStepText('Merumuskan stimulus cerita, butir pertanyaan, dan kunci jawaban bervariasi...');
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

      let finalQuestions: QuestionItem[] = [];

      if (response.ok) {
        const data = await response.json();
        if (data.hasAi && Array.isArray(data.questions) && data.questions.length > 0) {
          finalQuestions = data.questions;
        }
      }

      // 2. Fallback to local deterministic curriculum engine if AI did not return full results
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

      // Ensure exact count and consecutive numbering
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
      setTimeout(() => {
        const target = document.getElementById('exam-preview-panel');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 120);
    } catch (err) {
      // Local fallback on any network failure
      const finalQuestions = generateOfflineQuestions(
        effectiveSubject,
        grade,
        tp,
        topic,
        questionType,
        questionCount,
        cognitiveLevel
      );
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
      showToast(`Berhasil menyusun ${finalQuestions.length} butir soal bervariasi!`, 'success');
      setTimeout(() => {
        const target = document.getElementById('exam-preview-panel');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 120);
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

  const activeTpPresets = RECOMMENDED_TPS[subject] || [];

  return (
    <div id="question-generator-page" className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* HEADER BANNER */}
      <div
        id="question-generator-banner"
        className="bg-gradient-to-r from-[#00529C] via-[#0066C0] to-[#FF7300] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden"
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

              {/* 2. Tujuan Pembelajaran (TP) */}
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
                {activeTpPresets.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-[#00529C] dark:text-blue-400 flex items-center gap-1 mb-2">
                      <BookOpen className="w-3.5 h-3.5" />
                      Pilihan TP Standar Kurikulum ({subject}):
                    </span>
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
                  </div>
                )}
              </div>

              {/* 3. Jumlah Soal */}
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
                      className={`py-1.5 text-xs font-bold rounded-xl transition ${
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
                    <option value="HOTS (C4-C6)">HOTS (C4-C6 Nalar Kritis)</option>
                    <option value="Proporsional (Campuran)">Proporsional (LOTS+MOTS+HOTS)</option>
                    <option value="MOTS (C3)">MOTS (C3 Penerapan)</option>
                    <option value="LOTS (C1-C2)">LOTS (C1-C2 Pemahaman)</option>
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
              disabled={isGenerating}
              className="w-full py-3.5 px-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#FF7300] to-[#E65100] hover:from-[#E65100] hover:to-[#D84315] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Menyusun {questionCount} Butir Soal...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate {questionCount} Soal AI Sekarang</span>
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
                </div>
              </div>

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
                            <span>Level {q.cognitiveLevel}</span>
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
    </div>
  );
};
