import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Layers,
  BookOpen,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  FileText,
  Copy,
  Download,
  Printer,
  ChevronRight,
  ChevronLeft,
  Zap,
  Eye,
  Heart,
  Brain,
  Smile,
  Info,
  Check,
  Building,
  GraduationCap,
  Sliders
} from 'lucide-react';
import {
  TeachingModule,
  CurriculumApproach,
  DocumentCategory,
  SatuanPendidikan,
  FaseType,
  SubjectType,
  SupplementaryDocuments,
  KopConfig
} from '../../types';
import { initialKopConfig } from '../../data/mockData';
import {
  generateModuleHtml,
  generateLKPDHtml,
  generateBahanAjarHtml,
  generateSilabusHtml,
  generateProtaHtml,
  generateProsemHtml,
  generateKopSuratHtml,
  generateSignatureBlockHtml,
  updateDocumentKopAndSignature,
  DPL8_LABELS,
  KBC_TEMA_LABELS,
  SES_LABELS,
  MODEL_LABELS
} from '../../utils/moduleGeneratorEngine';

export const ModuleGeneratorWizard: React.FC = () => {
  const {
    setModules,
    showToast,
    userProfile,
    setSelectedModule,
    setIsDetailOpen,
    setCurrentView,
    setPrintModule,
    setIsPrintPreviewOpen
  } = useApp();

  // Wizard Steps: 1 = Form Konfigurasi, 2 = Hasil Multi-Tab
  const [step, setStep] = useState<1 | 2>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState<'modul' | 'lkpd' | 'bahan' | 'silabus' | 'prota' | 'prosem'>('modul');

  // FORM STATES (Matching BantuGuru / Kerangka 8334 / KBC)
  const [documentType, setDocumentType] = useState<DocumentCategory>('modul_ajar');
  const [curriculum, setCurriculum] = useState<CurriculumApproach>('merdeka');
  const [satuanPendidikan, setSatuanPendidikan] = useState<SatuanPendidikan>('sd');
  const [kekhususanABK, setKekhususanABK] = useState<string>('Autis / Spektrum Autisme');

  const [kelas, setKelas] = useState<string>(userProfile.gradeAssigned ? String(userProfile.gradeAssigned) : '4');
  const [fase, setFase] = useState<FaseType>('Fase B');
  const [mapel, setMapel] = useState<SubjectType>('IPAS');
  const [customMapel, setCustomMapel] = useState<string>('');
  const [isCustomMapel, setIsCustomMapel] = useState<boolean>(false);

  const [topic, setTopic] = useState<string>('Wujud Zat dan Perubahannya');
  const [targetPesertaDidik, setTargetPesertaDidik] = useState<string>('Peserta Didik Reguler / Tipikal');
  const [tahunAjaran, setTahunAjaran] = useState<string>(userProfile.academicYear || '2025/2026');
  const [semester, setSemester] = useState<1 | 2>(1);

  // Alokasi Waktu Fleksibel
  const [jumlahPertemuan, setJumlahPertemuan] = useState<number>(2);
  const [jpPerPertemuan, setJpPerPertemuan] = useState<number>(2);
  const [durasiJP, setDurasiJP] = useState<number>(35);

  // Profil Kelulusan & Karakter
  const [dpl8Selected, setDpl8Selected] = useState<string[]>([
    'keimanan',
    'penalaran-kritis',
    'kolaborasi',
    'kreativitas'
  ]);
  const [kbcTemaSelected, setKbcTemaSelected] = useState<string[]>([
    'cinta-allah-dan-rasulnya',
    'cinta-ilmu',
    'cinta-lingkungan'
  ]);
  const [sesSelected, setSesSelected] = useState<string[]>([
    'kontrol-diri',
    'empati',
    'tanggung-jawab'
  ]);

  // Model & Metode
  const [learningModel, setLearningModel] = useState<string>('deep-learning');
  const [selectedMetode, setSelectedMetode] = useState<string[]>([
    'Diskusi Kelompok',
    'Tanya Jawab',
    'Demonstrasi / Eksperimen'
  ]);

  // Dokumen Pendukung Batching
  const [genSupplements, setGenSupplements] = useState({
    lkpd: true,
    bahanAjar: true,
    silabus: true,
    prota: true,
    prosem: true
  });

  // Generated Package State
  const [generatedModule, setGeneratedModule] = useState<TeachingModule | null>(null);
  const [generatedHtmls, setGeneratedHtmls] = useState<{
    modulHtml: string;
    lkpdHtml: string;
    bahanAjarHtml: string;
    silabusHtml: string;
    protaHtml: string;
    prosemHtml: string;
  } | null>(null);

  // Synchronize active preview and generatedModule whenever user updates KOP or logos in Profile Settings
  useEffect(() => {
    if (!generatedHtmls || !userProfile.kopConfig) return;
    const currentKop = userProfile.kopConfig;
    const schoolName = currentKop.schoolName || userProfile.school || 'SD NEGERI 01 MENTENG JAYA';

    setGeneratedHtmls(prev => {
      if (!prev) return prev;
      return {
        modulHtml: updateDocumentKopAndSignature(prev.modulHtml, currentKop, schoolName),
        lkpdHtml: updateDocumentKopAndSignature(prev.lkpdHtml, currentKop, schoolName),
        bahanAjarHtml: updateDocumentKopAndSignature(prev.bahanAjarHtml, currentKop, schoolName),
        silabusHtml: updateDocumentKopAndSignature(prev.silabusHtml, currentKop, schoolName),
        protaHtml: updateDocumentKopAndSignature(prev.protaHtml, currentKop, schoolName),
        prosemHtml: updateDocumentKopAndSignature(prev.prosemHtml, currentKop, schoolName),
      };
    });

    setGeneratedModule(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        kopConfig: {
          ...(prev.kopConfig || {}),
          ...currentKop,
        },
        school: currentKop.schoolName || prev.school,
        headmaster: currentKop.headmasterName || prev.headmaster,
        nipHeadmaster: currentKop.headmasterNip || prev.nipHeadmaster,
        author: currentKop.teacherName || prev.author,
        nipAuthor: currentKop.teacherNip || prev.nipAuthor,
      };
    });
  }, [userProfile.kopConfig]);

  // Dynamic Fase calculation based on Kelas & Satuan
  const handleKelasChange = (newKelas: string) => {
    setKelas(newKelas);
    if (satuanPendidikan === 'paud') {
      setFase('Fase Fondasi');
    } else if (newKelas === '1' || newKelas === '2') {
      setFase('Fase A');
    } else if (newKelas === '3' || newKelas === '4') {
      setFase('Fase B');
    } else if (newKelas === '5' || newKelas === '6') {
      setFase('Fase C');
    } else if (['7', '8', '9'].includes(newKelas)) {
      setFase('Fase D');
    } else if (newKelas === '10') {
      setFase('Fase E');
    } else {
      setFase('Fase F');
    }
  };

  const handleSatuanChange = (newSatuan: SatuanPendidikan) => {
    setSatuanPendidikan(newSatuan);
    if (newSatuan === 'paud') {
      setDocumentType('paud');
      setFase('Fase Fondasi');
      setKelas('TK-B');
    } else if (newSatuan === 'slb') {
      setDocumentType('slb');
    } else if (newSatuan === 'sd' || newSatuan === 'mi') {
      if (documentType === 'paud') setDocumentType('modul_ajar');
      setKelas('4');
      setFase('Fase B');
    }
  };

  const toggleDpl8 = (key: string) => {
    setDpl8Selected(prev =>
      prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key]
    );
  };

  const toggleKbcTema = (key: string) => {
    setKbcTemaSelected(prev =>
      prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key]
    );
  };

  const toggleSes = (key: string) => {
    setSesSelected(prev =>
      prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key]
    );
  };

  const toggleMetode = (metode: string) => {
    setSelectedMetode(prev =>
      prev.includes(metode) ? prev.filter(m => m !== metode) : [...prev, metode]
    );
  };

  const effectiveMapel = isCustomMapel && customMapel.trim() ? customMapel.trim() : mapel;

  // GENERATE ACTION
  const handleGenerate = async () => {
    if (!topic.trim()) {
      showToast('Harap masukkan topik pembelajaran!', 'error');
      return;
    }

    setIsGenerating(true);

    const effectiveKopConfig: KopConfig = {
      ...(userProfile.kopConfig || initialKopConfig),
      schoolName: userProfile.kopConfig?.schoolName || userProfile.school || 'SD NEGERI 01 MENTENG JAYA',
      schoolAddress: userProfile.kopConfig?.schoolAddress || (userProfile as any).schoolAddress || 'Jl. Menteng Raya No. 10, RT.01/RW.02, Kec. Menteng, Kota Jakarta Pusat 10340',
      schoolContact: userProfile.kopConfig?.schoolContact || '',
      headmasterName: userProfile.kopConfig?.headmasterName || userProfile.headmasterName || 'Dra. Hj. Siti Rohmah, M.Pd.',
      headmasterNip: userProfile.kopConfig?.headmasterNip || userProfile.headmasterNip || '',
      teacherName: userProfile.kopConfig?.teacherName || userProfile.name || 'Guru Pengampu, S.Pd.',
      teacherNip: userProfile.kopConfig?.teacherNip || userProfile.nip || '',
      leftLogoUrl: userProfile.kopConfig?.leftLogoUrl !== undefined ? userProfile.kopConfig.leftLogoUrl : initialKopConfig.leftLogoUrl,
      rightLogoUrl: userProfile.kopConfig?.rightLogoUrl !== undefined ? userProfile.kopConfig.rightLogoUrl : initialKopConfig.rightLogoUrl,
      leftLogoSize: userProfile.kopConfig?.leftLogoSize || initialKopConfig.leftLogoSize || 70,
      rightLogoSize: userProfile.kopConfig?.rightLogoSize || initialKopConfig.rightLogoSize || 70,
    };

    const inputData = {
      satuanPendidikan,
      documentType,
      curriculum,
      jenjangLabel: satuanPendidikan.toUpperCase(),
      kelas,
      fase,
      mapel: effectiveMapel,
      topic: topic.trim(),
      tahunAjaran,
      semester,
      namaSekolah: effectiveKopConfig.schoolName || userProfile.school || 'SD Negeri 006',
      namaPenyusun: effectiveKopConfig.teacherName || userProfile.name || 'Guru Pengampu',
      nipPenyusun: effectiveKopConfig.teacherNip || userProfile.nip || '',
      namaKepalaSekolah: effectiveKopConfig.headmasterName || userProfile.headmasterName || 'Kepala Sekolah, M.Pd.',
      nipKepalaSekolah: effectiveKopConfig.headmasterNip || userProfile.headmasterNip || '',
      kopConfig: effectiveKopConfig,
      targetPesertaDidik,
      dpl8Selected,
      kbcTemaSelected,
      sesSelected,
      jumlahPertemuan,
      jpPerPertemuan,
      durasiJP,
      learningModel,
      selectedMetode,
      kekhususanABK: documentType === 'slb' ? kekhususanABK : undefined
    };

    let fullDocHtml = '';

    // First attempt server-side Gemini generation via /api/generate
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.aiHtml) {
          let processedAiHtml = data.aiHtml;
          if (!processedAiHtml.includes('kop-surat-official')) {
            const kopHtml = generateKopSuratHtml(effectiveKopConfig, inputData.namaSekolah);
            const signatureHtml = generateSignatureBlockHtml(effectiveKopConfig, inputData.namaSekolah);
            processedAiHtml = `
            <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 text-slate-900 space-y-6 max-w-4xl mx-auto font-sans leading-relaxed">
              ${kopHtml}
              ${processedAiHtml}
              ${!processedAiHtml.includes('signature-section') ? signatureHtml : ''}
            </div>`;
          }
          fullDocHtml = processedAiHtml;
        }
      }
    } catch (apiErr) {
      console.warn('Server generation failed, using local engine:', apiErr);
    }

    // If Gemini was offline or response was empty, generate using our high-craft engine
    if (!fullDocHtml) {
      fullDocHtml = generateModuleHtml(inputData);
    }

    // Generate supplementary documents
    const lkpdHtml = genSupplements.lkpd ? generateLKPDHtml(inputData) : '';
    const bahanAjarHtml = genSupplements.bahanAjar ? generateBahanAjarHtml(inputData) : '';
    const silabusHtml = genSupplements.silabus ? generateSilabusHtml(inputData) : '';
    const protaHtml = genSupplements.prota ? generateProtaHtml(inputData) : '';
    const prosemHtml = genSupplements.prosem ? generateProsemHtml(inputData) : '';

    const newModuleId = `MOD-${Date.now()}`;
    const codePrefix = curriculum === 'kbc' ? 'KBC' : curriculum === 'hybrid' ? 'HYB' : 'MOD';
    const newCode = `${codePrefix}-${fase.replace('Fase ', '')}-${kelas}-0${Math.floor(Math.random() * 90 + 10)}`;

    const supplementaryDocs: SupplementaryDocuments = {
      lkpdHtml,
      bahanAjarHtml,
      silabusHtml,
      protaHtml,
      prosemHtml
    };

    const newModule: TeachingModule = {
      id: newModuleId,
      code: newCode,
      title: `${documentType === 'rpp' ? 'RPP' : 'Modul Ajar'} ${effectiveMapel}: ${topic.trim()}`,
      type: documentType === 'rpp'
        ? 'RPP Mendalam'
        : documentType === 'paud'
        ? 'Modul Ajar PAUD'
        : documentType === 'slb'
        ? 'Modul Ajar Inklusi / SLB'
        : 'Modul Ajar',
      curriculumApproach: curriculum,
      documentCategory: documentType,
      satuanPendidikan,
      kekhususanABK: documentType === 'slb' ? kekhususanABK : undefined,
      fase,
      grade: parseInt(kelas, 10) || 4,
      subject: effectiveMapel,
      semester,
      academicYear: tahunAjaran,
      author: effectiveKopConfig.teacherName || userProfile.name || 'Guru Pengampu',
      nipAuthor: effectiveKopConfig.teacherNip || userProfile.nip || '',
      school: effectiveKopConfig.schoolName || userProfile.school || 'SD Negeri 01 Menteng Jaya',
      headmaster: effectiveKopConfig.headmasterName || userProfile.headmasterName || 'Kepala Sekolah, M.Pd.',
      nipHeadmaster: effectiveKopConfig.headmasterNip || userProfile.headmasterNip || '',
      kopConfig: effectiveKopConfig,
      status: 'Terverifikasi',
      allocatedHours: `${jumlahPertemuan} Pertemuan (${jumlahPertemuan * jpPerPertemuan} JP)`,
      jumlahPertemuan,
      jpPerPertemuan,
      durasiJP,
      totalJP: jumlahPertemuan * jpPerPertemuan,
      targetStudents: targetPesertaDidik,
      profilPancasila: dpl8Selected.map(d => DPL8_LABELS[d] || d),
      dpl8Selected,
      kbcTemaSelected,
      sesSelected,
      capaianPembelajaran: `Peserta didik mampu memahami dan mendalami konsep ${topic.trim()} dalam konteks nyata.`,
      tujuanPembelajaran: [
        `Peserta didik dapat mengidentifikasi konsep esensial ${topic.trim()} dengan teliti.`,
        `Peserta didik mampu memecahkan masalah kontekstual melalui investigasi kelompok pada LKPD.`,
        `Peserta didik dapat merefleksikan nilai karakter dan hikmah kebaikan dalam kehidupan.`
      ],
      pemahamanBermakna: `Materi ${topic.trim()} menghubungkan ilmu pengetahuan dengan penghayatan kesadaran dan kepedulian lingkungan hidup.`,
      pertanyaanPemantik: [
        `Bagaimana fenomena ${topic.trim()} kita temui di kehidupan sekitar?`,
        `Mengapa penting bagi kita untuk memahami materi ini secara mendalam?`
      ],
      modelPembelajaran: MODEL_LABELS[learningModel] || learningModel,
      metodePembelajaran: selectedMetode,
      saranaPrasarana: ['Buku Teks Pendamping', 'Proyektor LCD / Layar Digital', 'LKPD Berbasis Aktivitas', 'Media Konkret'],
      langkahKegiatan: {
        pendahuluan: ['Salam hangat, doa bersama, presensi ceria', 'Apersepsi kontekstual dan pertanyaan pemantik', 'Penyampaian tujuan dan alur belajar'],
        inti: ['Fasilitasi pemahaman mendalam konsep esensial', 'Pemberian penugasan kolaboratif dengan lembar kerja', 'Presentasi dan apresiasi karya antar kelompok'],
        penutup: ['Simpulan bersama materi esensial', 'Refleksi pengalaman belajar', 'Doa penutup dan penguatan karakter']
      },
      asesmenDesc: 'Asesmen Formatif (Observasi Sikap & Unjuk Kerja LKPD) dan Asesmen Sumatif (Tes Tertulis HOTS)',
      fullDocumentHtml: fullDocHtml,
      supplementaryDocs,
      lampiran: {
        lkpd: `LKPD Terstruktur Materi ${topic.trim()}`,
        materiSingkat: `Bahan Ajar Ringkas & Peta Konsep ${topic.trim()}`,
        rubrikPenilaian: 'Rubrik Penilaian Holistik Skala Sikap & Kinerja',
        remedialPengayaan: 'Panduan Bimbingan Khusus & Proyek Tutor Sebaya'
      },
      downloadsCount: 0,
      rating: 5.0,
      tags: [curriculum.toUpperCase(), effectiveMapel, `Kelas ${kelas}`, 'Deep Learning', '8334'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save module into App Context
    setModules(prev => [newModule, ...prev]);

    setGeneratedModule(newModule);
    setGeneratedHtmls({
      modulHtml: fullDocHtml,
      lkpdHtml,
      bahanAjarHtml,
      silabusHtml,
      protaHtml,
      prosemHtml
    });

    setIsGenerating(false);
    setStep(2);
    showToast('Perangkat Ajar & Dokumen Pendukung Berhasil Dibuat!', 'success');
  };

  // Export to Word Document (.doc)
  const handleDownloadWord = (contentHtml: string, titleSuffix: string) => {
    const filename = `${generatedModule?.code || 'DOKUMEN'}_${titleSuffix.replace(/\s+/g, '_')}`;
    const styledHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${filename}</title>
          <style>
            body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; color: #111; margin: 2cm; }
            h2, h3, h4 { color: #003366; }
            table { border-collapse: collapse; width: 100%; margin: 12px 0; }
            th, td { border: 1px solid #666; padding: 6px 8px; text-align: left; font-size: 10pt; }
            th { background-color: #f0f4f8; font-weight: bold; }
            .bg-slate-50, .bg-blue-50, .bg-emerald-50 { background-color: #f8fafc; padding: 8px; }
          </style>
        </head>
        <body>
          ${contentHtml}
        </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + styledHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Dokumen Word (${filename}.doc) berhasil diunduh!`, 'success');
  };

  // Copy Active Tab Content to Clipboard
  const handleCopyContent = (htmlContent: string) => {
    // Clean html tags to plain text for easy pasting
    const tempEl = document.createElement('div');
    tempEl.innerHTML = htmlContent;
    const plainText = tempEl.innerText || tempEl.textContent || '';
    navigator.clipboard.writeText(plainText).then(() => {
      showToast('Teks berhasil disalin ke clipboard!', 'success');
    });
  };

  // Print Active Tab
  const handlePrintActive = () => {
    window.print();
  };

  const getActiveTabContent = () => {
    if (!generatedHtmls) return '';
    switch (activeResultTab) {
      case 'modul':
        return generatedHtmls.modulHtml;
      case 'lkpd':
        return generatedHtmls.lkpdHtml;
      case 'bahan':
        return generatedHtmls.bahanAjarHtml;
      case 'silabus':
        return generatedHtmls.silabusHtml;
      case 'prota':
        return generatedHtmls.protaHtml;
      case 'prosem':
        return generatedHtmls.prosemHtml;
      default:
        return generatedHtmls.modulHtml;
    }
  };

  return (
    <div id="module-generator-wizard" className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* HEADER BANNER */}
      <div id="module-generator-wizard-header" className="bg-gradient-to-r from-[#00529B] via-[#0066c0] to-[#E65100] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generator Perangkat Ajar Terpadu • Versi 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Penyusun Modul Ajar & RPP Mendalam
          </h1>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            Menyelaraskan standar <strong>Permendikdasmen No. 1/2026</strong> (Kerangka 8334 Deep Learning: Berkesadaran, Bermakna, Menggembirakan) serta <strong>Kurikulum Berbasis Cinta (KBC Kepdirjen Pendis 6077/2025)</strong> dengan dukungan otomatis LKPD, Bahan Ajar, Silabus/ATP, Prota, dan Prosem.
          </p>
        </div>

        {/* Floating Badges */}
        <div className="absolute -right-8 -bottom-8 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* WIZARD CONTAINER */}
      <div id="module-generator-container" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
        
        {/* STEP 1: FORM KONFIGURASI */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in-50 duration-200">
            
            {/* 1. PILIHAN JENIS DOKUMEN */}
            <div className="space-y-3">
              <label className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00529B] dark:text-blue-400" />
                <span>1. Jenis Dokumen Pembelajaran</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'modul_ajar', title: 'Modul Ajar', sub: 'Format Lengkap Permendikdasmen / KBC', icon: BookOpen },
                  { id: 'rpp', title: 'RPP Mendalam', sub: 'Detail Menit Skenario Guru-Siswa', icon: Clock },
                  { id: 'paud', title: 'Modul PAUD', sub: 'Fase Fondasi Bermain Bermakna', icon: Smile },
                  { id: 'slb', title: 'Modul Inklusi / SLB', sub: 'Akomodasi Kekhususan ABK', icon: Heart }
                ].map(item => {
                  const IconComp = item.icon;
                  const isSelected = documentType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDocumentType(item.id as DocumentCategory)}
                      className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#00529B] bg-blue-50/60 dark:bg-blue-950/40 text-[#00529B] dark:text-blue-300 ring-2 ring-[#00529B]/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                      }`}
                    >
                      <IconComp className={`w-5 h-5 mb-2 ${isSelected ? 'text-[#00529B]' : 'text-slate-500'}`} />
                      <div>
                        <div className="font-extrabold text-xs sm:text-sm">{item.title}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{item.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. PENDEKATAN KURIKULUM */}
            <div className="space-y-3">
              <label className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#FF7300]" />
                <span>2. Pendekatan Kurikulum</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'merdeka',
                    title: 'Kurikulum Merdeka',
                    desc: 'Permendikdasmen No. 1/2026 • Kerangka 8334 Deep Learning (Berkesadaran, Bermakna, Menggembirakan)',
                    tag: 'Regulasi Resmi 2026',
                    tagColor: 'bg-blue-100 text-blue-800'
                  },
                  {
                    id: 'kbc',
                    title: 'Kurikulum Berbasis Cinta (KBC)',
                    desc: 'Kemenag RI Kepdirjen Pendis No. 6077/2025 • Panca Cinta, Metode FIDS, SES, dan Jurnal Muhasabah',
                    tag: 'Kemenag RI 2025/2026',
                    tagColor: 'bg-emerald-100 text-emerald-800'
                  },
                  {
                    id: 'hybrid',
                    title: 'Hybrid (Merdeka + KBC)',
                    desc: 'Integrasi struktur Kerangka 8334 dengan nilai spiritualitas Panca Cinta & SES',
                    tag: 'Pendekatan Terpadu',
                    tagColor: 'bg-purple-100 text-purple-800'
                  }
                ].map(item => {
                  const isSelected = curriculum === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCurriculum(item.id as CurriculumApproach)}
                      className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#FF7300] bg-orange-50/50 dark:bg-orange-950/30 text-[#FF7300] ring-2 ring-orange-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                      }`}
                    >
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.tagColor}`}>
                          {item.tag}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-2">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. SATUAN PENDIDIKAN, JENJANG, DAN MAPEL */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              {/* Satuan Pendidikan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Satuan Pendidikan
                </label>
                <select
                  value={satuanPendidikan}
                  onChange={e => handleSatuanChange(e.target.value as SatuanPendidikan)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="sd">Sekolah Dasar (SD)</option>
                  <option value="mi">Madrasah Ibtidaiyah (MI)</option>
                  <option value="paud">PAUD / TK / RA</option>
                  <option value="slb">SLB / Sekolah Inklusi</option>
                  <option value="smp">SMP / MTs</option>
                  <option value="sma">SMA / MA / SMK</option>
                </select>
              </div>

              {/* Kelas & Fase */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tingkat Kelas & Fase
                </label>
                <select
                  value={kelas}
                  onChange={e => handleKelasChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs font-semibold"
                >
                  {satuanPendidikan === 'paud' ? (
                    <>
                      <option value="TK-A">Kelompok A (Usia 4-5 Th) - Fase Fondasi</option>
                      <option value="TK-B">Kelompok B (Usia 5-6 Th) - Fase Fondasi</option>
                    </>
                  ) : (
                    <>
                      <option value="1">Kelas 1 - Fase A</option>
                      <option value="2">Kelas 2 - Fase A</option>
                      <option value="3">Kelas 3 - Fase B</option>
                      <option value="4">Kelas 4 - Fase B</option>
                      <option value="5">Kelas 5 - Fase C</option>
                      <option value="6">Kelas 6 - Fase C</option>
                    </>
                  )}
                </select>
              </div>

              {/* Mata Pelajaran */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Mata Pelajaran</span>
                  <button
                    type="button"
                    onClick={() => setIsCustomMapel(!isCustomMapel)}
                    className="text-[10px] text-blue-600 dark:text-blue-400 underline font-semibold"
                  >
                    {isCustomMapel ? 'Pilih dari List' : '+ Ketik Mapel Lain'}
                  </button>
                </label>
                {isCustomMapel ? (
                  <input
                    type="text"
                    value={customMapel}
                    onChange={e => setCustomMapel(e.target.value)}
                    placeholder="Contoh: Bahasa Sunda / Robotik"
                    className="w-full px-3 py-2.5 rounded-xl border border-blue-400 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <select
                    value={mapel}
                    onChange={e => setMapel(e.target.value as SubjectType)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    <option value="IPAS">IPAS (Ilmu Pengetahuan Alam & Sosial)</option>
                    <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
                    <option value="Pendidikan Agama Islam">PAI & Budi Pekerti</option>
                    <option value="PJOK">PJOK</option>
                    <option value="Seni Rupa">Seni Rupa</option>
                    <option value="Seni Musik">Seni Musik</option>
                    <option value="Seni Tari">Seni Tari</option>
                    <option value="Seni Teater">Seni Teater</option>
                    <option value="Bahasa Inggris">Bahasa Inggris</option>
                    <option value="Koding & Kecerdasan Artifisial">Koding & Kecerdasan Artifisial (2026)</option>
                    <option value="Al-Qur'an Hadis">Al-Qur'an Hadis (Kemenag/MI)</option>
                    <option value="Akidah Akhlak">Akidah Akhlak (Kemenag/MI)</option>
                    <option value="Fikih">Fikih (Kemenag/MI)</option>
                    <option value="Sejarah Kebudayaan Islam (SKI)">Sejarah Kebudayaan Islam (SKI)</option>
                    <option value="Bahasa Arab">Bahasa Arab</option>
                    <option value="Muatan Lokal / Bahasa Daerah">Bahasa Daerah / Mulok</option>
                  </select>
                )}
              </div>
            </div>

            {/* OPSI KEKHUSUSAN ABK (JIKA SLB) */}
            {documentType === 'slb' && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-2">
                <label className="text-xs font-bold text-rose-800 dark:text-rose-300">
                  Kekhususan Anak Berkebutuhan Khusus (ABK):
                </label>
                <select
                  value={kekhususanABK}
                  onChange={e => setKekhususanABK(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-white dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="Autis / Spektrum Autisme">Autis (Spektrum Autisme)</option>
                  <option value="Tunanetra / Hambatan Penglihatan">Tunanetra (Hambatan Penglihatan)</option>
                  <option value="Tunarungu / Hambatan Pendengaran">Tunarungu (Hambatan Pendengaran)</option>
                  <option value="Tunagrahita / Hambatan Intelektual">Tunagrahita (Hambatan Intelektual)</option>
                  <option value="Tunadaksa / Hambatan Motorik">Tunadaksa (Hambatan Motorik)</option>
                  <option value="Kesulitan Belajar Spesifik (Disleksia/Diskalkulia)">Kesulitan Belajar Spesifik</option>
                </select>
              </div>
            )}

            {/* 4. TOPIK MATERI POKOK */}
            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>3. Topik / Lingkup Materi Pokok</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Contoh: Wujud Zat dan Perubahannya / Siklus Hidup Hewan / Operasi Pecahan"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-sm font-semibold focus:border-[#00529B] focus:ring-2 focus:ring-[#00529B]/20 outline-none"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400">Contoh Cepat:</span>
                {[
                  'Wujud Zat dan Perubahannya',
                  'Fotosintesis & Bagian Tumbuhan',
                  'Gaya dan Gerak di Sekitar Kita',
                  'Pecahan Senilai dan Operasi Hitung',
                  'Kearifan Lokal & Keberagaman Budaya'
                ].map(ex => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setTopic(ex)}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  >
                    + {ex}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. ALOKASI WAKTU FLEKSIBEL (TOTAL MENIT & JP) */}
            <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-extrabold text-[#00529B] dark:text-blue-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Alokasi Waktu Pembelajaran</span>
                </label>
                <div className="px-3 py-1 rounded-full bg-[#00529B] text-white text-xs font-mono font-bold">
                  Total: {jumlahPertemuan * jpPerPertemuan} JP ({jumlahPertemuan * jpPerPertemuan * durasiJP} Menit)
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">
                    Jumlah Pertemuan:
                  </span>
                  <select
                    value={jumlahPertemuan}
                    onChange={e => setJumlahPertemuan(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                  >
                    {[1, 2, 3, 4, 5, 6, 8].map(n => (
                      <option key={n} value={n}>
                        {n} Pertemuan
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">
                    JP per Pertemuan:
                  </span>
                  <select
                    value={jpPerPertemuan}
                    onChange={e => setJpPerPertemuan(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>
                        {n} JP / Pertemuan
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">
                    Durasi Menit per JP:
                  </span>
                  <select
                    value={durasiJP}
                    onChange={e => setDurasiJP(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                  >
                    <option value={30}>30 Menit (PAUD/TK)</option>
                    <option value={35}>35 Menit (Standar SD/MI)</option>
                    <option value={40}>40 Menit (SMP/MTs)</option>
                    <option value={45}>45 Menit (SMA/MA/SMK)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 6. PROFIL KELULUSAN & KARAKTER (8 DIMENSI 8334 / KBC PANCA CINTA & SES) */}
            <div className="space-y-4">
              <label className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span>4. Dimensi Profil Kelulusan & Nilai Karakter</span>
              </label>

              {/* 8 Dimensi Profil Kelulusan (Kerangka 8334) */}
              {(curriculum === 'merdeka' || curriculum === 'hybrid') && (
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      8 Dimensi Profil Kelulusan (Kerangka 8334 Permendikdasmen 1/2026):
                    </span>
                    <span className="text-[10px] text-blue-600 font-bold">
                      {dpl8Selected.length} Terpilih
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {Object.entries(DPL8_LABELS).map(([key, label]) => {
                      const active = dpl8Selected.includes(key);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggleDpl8(key)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between border ${
                            active
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <span className="truncate">{label}</span>
                          {active && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Panca Cinta KBC */}
              {(curriculum === 'kbc' || curriculum === 'hybrid') && (
                <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                      Panca Cinta (Kurikulum Berbasis Cinta Kemenag):
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      {kbcTemaSelected.length} Terpilih
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {Object.entries(KBC_TEMA_LABELS).map(([key, label]) => {
                      const active = kbcTemaSelected.includes(key);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggleKbcTema(key)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between border ${
                            active
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          <span className="truncate">{label}</span>
                          {active && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SES (Social Emotional Skills) */}
              {(curriculum === 'kbc' || curriculum === 'hybrid') && (
                <div className="p-4 rounded-2xl border border-purple-200 dark:border-purple-900 bg-purple-50/40 dark:bg-purple-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-900 dark:text-purple-300">
                      Prioritas Social Emotional Skills (SES KBC):
                    </span>
                    <span className="text-[10px] text-purple-700 font-bold">
                      {sesSelected.length} Terpilih
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {Object.entries(SES_LABELS).map(([key, label]) => {
                      const active = sesSelected.includes(key);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggleSes(key)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between border ${
                            active
                              ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-purple-200 dark:border-purple-800'
                          }`}
                        >
                          <span className="truncate">{label}</span>
                          {active && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 7. MODEL DAN METODE PEMBELAJARAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Model */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Model Pembelajaran:
                </label>
                <select
                  value={learningModel}
                  onChange={e => setLearningModel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="deep-learning">Deep Learning (6E) - Mindful, Meaningful, Joyful</option>
                  <option value="fids">FIDS (Feel, Imagine, Do, Share) - KBC</option>
                  <option value="pbl">Problem-Based Learning (PBL)</option>
                  <option value="pjbl">Project-Based Learning (PjBL)</option>
                  <option value="discovery">Discovery Learning</option>
                  <option value="inquiry">Inquiry-Based Learning</option>
                  <option value="cooperative">Cooperative Learning</option>
                  <option value="differentiated">Pembelajaran Berdiferensiasi</option>
                  <option value="arka">ARKA (Experiential Learning)</option>
                  <option value="contextual">Contextual Teaching & Learning</option>
                </select>
              </div>

              {/* Metode Multi-Select */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Metode Pembelajaran:
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1">
                  {[
                    'Diskusi Kelompok',
                    'Tanya Jawab',
                    'Demonstrasi / Eksperimen',
                    'Penugasan Proyek',
                    'Simulasi / Role Play',
                    'Think-Pair-Share',
                    'Gallery Walk',
                    'Tadabbur Alam'
                  ].map(met => {
                    const isSel = selectedMetode.includes(met);
                    return (
                      <button
                        key={met}
                        type="button"
                        onClick={() => toggleMetode(met)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition ${
                          isSel
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent'
                        }`}
                      >
                        {isSel ? '✓ ' : '+ '}
                        {met}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 8. DOKUMEN PENDUKUNG OTOMATIS (BATCHING) */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#00529B]" />
                  Dokumen Pendukung yang Sekaligus Disusun (Batch Generation):
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">Tersimpan dalam 1 paket</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-xs">
                {[
                  { id: 'lkpd', label: 'LKPD Siswa' },
                  { id: 'bahanAjar', label: 'Bahan Ajar' },
                  { id: 'silabus', label: 'Silabus / ATP' },
                  { id: 'prota', label: 'Prota (Tahunan)' },
                  { id: 'prosem', label: 'Prosem (Semester)' }
                ].map(doc => {
                  const checked = (genSupplements as any)[doc.id];
                  return (
                    <label
                      key={doc.id}
                      className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer select-none transition ${
                        checked
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 text-blue-900 dark:text-blue-300 font-bold'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={e =>
                          setGenSupplements(prev => ({ ...prev, [doc.id]: e.target.checked }))
                        }
                        className="rounded text-blue-600"
                      />
                      <span>{doc.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF7300] to-[#E65100] hover:from-[#f56f00] text-white text-sm font-extrabold shadow-lg shadow-orange-500/25 active:scale-98 transition"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyusun Dokumen Lengkap (AI & Template)...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Generate Modul & Dokumen Pendukung Sekarang</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* STEP 2: HASIL LENGKAP DENGAN TAB SWITCHER (BANTUGURU MULTI-TAB) */}
        {step === 2 && generatedModule && generatedHtmls && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Ubah Konfigurasi</span>
                </button>
                <div className="text-xs font-mono font-bold text-[#00529B] dark:text-blue-400">
                  {generatedModule.code}
                </div>
              </div>

              {/* Action Buttons: Copy, Word, Print, KOP Settings, Catalog */}
              <div id="generator-top-actions" className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyContent(getActiveTabContent())}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
                  title="Salin isi tab aktif ke clipboard"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Teks</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadWord(getActiveTabContent(), activeResultTab.toUpperCase())}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#00529B] dark:text-blue-300 hover:bg-blue-100 text-xs font-extrabold transition"
                  title="Unduh file Word (.doc) lengkap kop surat, tabel, & tanda tangan"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Word (.doc)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPrintModule(generatedModule);
                    setIsPrintPreviewOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 text-xs font-bold transition"
                  title="Sesuaikan logo, teks kop surat, nama kepala sekolah, dan pratinjau cetak"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>KOP & Pengesahan</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintActive}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition"
                  title="Cetak langsung atau simpan sebagai PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-600" />
                  <span>Cetak / PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedModule(generatedModule);
                    setIsDetailOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF7300] to-[#E65100] text-white text-xs font-extrabold shadow-md transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat di Modal Katalog</span>
                </button>
              </div>
            </div>

            {/* TAB SELECTOR (Matching BantuGuru / Multi-Dokumen) */}
            <div id="generator-tabs-bar" className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
              {[
                { id: 'modul', label: generatedModule.type, icon: BookOpen },
                ...(generatedHtmls.lkpdHtml ? [{ id: 'lkpd', label: 'Lembar Kerja (LKPD)', icon: FileText }] : []),
                ...(generatedHtmls.bahanAjarHtml ? [{ id: 'bahan', label: 'Bahan Ajar & Latihan', icon: BookOpen }] : []),
                ...(generatedHtmls.silabusHtml ? [{ id: 'silabus', label: 'Silabus / ATP', icon: Layers }] : []),
                ...(generatedHtmls.protaHtml ? [{ id: 'prota', label: 'Program Tahunan', icon: Calendar }] : []),
                ...(generatedHtmls.prosemHtml ? [{ id: 'prosem', label: 'Program Semester', icon: Calendar }] : [])
              ].map(tab => {
                const Icon = tab.icon;
                const active = activeResultTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveResultTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                      active
                        ? 'bg-white dark:bg-slate-900 text-[#00529B] dark:text-blue-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ACTIVE TAB DOCUMENT PREVIEW CANVAS */}
            <div id="printable-generated-content-wrapper" className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 p-4 sm:p-6 shadow-inner max-h-[720px] overflow-y-auto">
              <div
                id="printable-generated-content"
                dangerouslySetInnerHTML={{ __html: getActiveTabContent() }}
              />
            </div>

            {/* FOOTER ACTIONS */}
            <div id="generator-footer-bar" className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-500">
                Dokumen telah tersimpan otomatis ke database lokal aplikasi.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('modules');
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#00529B] dark:text-blue-300 text-xs font-bold hover:bg-blue-100"
                >
                  Buka Bank Perangkat Ajar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setGeneratedModule(null);
                    setGeneratedHtmls(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100"
                >
                  Buat Dokumen Lainnya
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
