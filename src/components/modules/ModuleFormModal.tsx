import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TeachingModule, ModuleType, FaseType, StatusType, SubjectType } from '../../types';
import {
  X,
  Save,
  Plus,
  Trash2,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  User,
  School,
  Check
} from 'lucide-react';

export const ModuleFormModal: React.FC = () => {
  const {
    isFormModalOpen,
    setIsFormModalOpen,
    editingModule,
    addModule,
    updateModule,
    userProfile
  } = useApp();

  // Tab navigation in form for pristine UX: 'umum' | 'tujuan' | 'langkah' | 'lampiran'
  const [activeTab, setActiveTab] = useState<'umum' | 'tujuan' | 'langkah' | 'lampiran'>('umum');

  // Form states
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState<ModuleType>('Modul Ajar');
  const [fase, setFase] = useState<FaseType>('Fase B');
  const [grade, setGrade] = useState<number>(4);
  const [subject, setSubject] = useState<SubjectType>('IPAS');
  const [semester, setSemester] = useState<1 | 2>(1);
  const [academicYear, setAcademicYear] = useState('2024/2025');
  const [status, setStatus] = useState<StatusType>('Draft');
  const [allocatedHours, setAllocatedHours] = useState('4 JP (4 x 35 Menit)');
  const [targetStudents, setTargetStudents] = useState('Reguler / Heterogen (28 Siswa)');
  const [modelPembelajaran, setModelPembelajaran] = useState('Problem Based Learning (PBL)');
  const [author, setAuthor] = useState('');
  const [nipAuthor, setNipAuthor] = useState('');
  const [school, setSchool] = useState('');

  // Profil Pelajar Pancasila
  const allProfilOptions = [
    'Beriman & Bertakwa kepada Tuhan YME',
    'Berkebinekaan Global',
    'Bergotong Royong',
    'Mandiri',
    'Bernalar Kritis',
    'Kreatif',
  ];
  const [profilPancasila, setProfilPancasila] = useState<string[]>(['Mandiri', 'Bernalar Kritis']);

  // CP & TP
  const [capaianPembelajaran, setCapaianPembelajaran] = useState('');
  const [tujuanList, setTujuanList] = useState<string[]>(['']);
  const [pemahamanBermakna, setPemahamanBermakna] = useState('');
  const [pertanyaanList, setPertanyaanList] = useState<string[]>(['']);

  // Langkah Pembelajaran
  const [pendahuluanSteps, setPendahuluanSteps] = useState<string[]>(['']);
  const [intiSteps, setIntiSteps] = useState<string[]>(['']);
  const [penutupSteps, setPenutupSteps] = useState<string[]>(['']);

  // Lampiran
  const [asesmenDesc, setAsesmenDesc] = useState('');
  const [lkpd, setLkpd] = useState('');
  const [rubrikPenilaian, setRubrikPenilaian] = useState('');
  const [remedialPengayaan, setRemedialPengayaan] = useState('');

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate when editing or reset when adding
  useEffect(() => {
    if (editingModule) {
      setTitle(editingModule.title);
      setCode(editingModule.code);
      setType(editingModule.type);
      setFase(editingModule.fase);
      setGrade(editingModule.grade);
      setSubject(editingModule.subject);
      setSemester(editingModule.semester);
      setAcademicYear(editingModule.academicYear);
      setStatus(editingModule.status);
      setAllocatedHours(editingModule.allocatedHours);
      setTargetStudents(editingModule.targetStudents);
      setModelPembelajaran(editingModule.modelPembelajaran);
      setAuthor(editingModule.author);
      setNipAuthor(editingModule.nipAuthor || '');
      setSchool(editingModule.school);
      setProfilPancasila(editingModule.profilPancasila || []);
      setCapaianPembelajaran(editingModule.capaianPembelajaran);
      setTujuanList(editingModule.tujuanPembelajaran?.length ? editingModule.tujuanPembelajaran : ['']);
      setPemahamanBermakna(editingModule.pemahamanBermakna || '');
      setPertanyaanList(editingModule.pertanyaanPemantik?.length ? editingModule.pertanyaanPemantik : ['']);
      setPendahuluanSteps(editingModule.langkahKegiatan?.pendahuluan?.length ? editingModule.langkahKegiatan.pendahuluan : ['']);
      setIntiSteps(editingModule.langkahKegiatan?.inti?.length ? editingModule.langkahKegiatan.inti : ['']);
      setPenutupSteps(editingModule.langkahKegiatan?.penutup?.length ? editingModule.langkahKegiatan.penutup : ['']);
      setAsesmenDesc(editingModule.asesmenDesc || '');
      setLkpd(editingModule.lampiran?.lkpd || '');
      setRubrikPenilaian(editingModule.lampiran?.rubrikPenilaian || '');
      setRemedialPengayaan(editingModule.lampiran?.remedialPengayaan || '');
    } else {
      // Default new module
      setTitle('');
      setCode(`MOD-SD-${Date.now().toString().slice(-4)}`);
      setType('Modul Ajar');
      setFase('Fase B');
      setGrade(4);
      setSubject('IPAS');
      setSemester(userProfile.activeSemester || 1);
      setAcademicYear(userProfile.academicYear || '2024/2025');
      setStatus('Draft');
      setAllocatedHours('4 JP (4 x 35 Menit)');
      setTargetStudents('Reguler (28 Siswa)');
      setModelPembelajaran('Problem Based Learning (PBL)');
      setAuthor(userProfile.name);
      setNipAuthor(userProfile.nip);
      setSchool(userProfile.school);
      setProfilPancasila(['Bernalar Kritis', 'Mandiri']);
      setCapaianPembelajaran('Peserta didik mampu memahami dan menganalisis materi secara kontekstual.');
      setTujuanList(['Mengidentifikasi konsep dasar materi.', 'Menerapkan penyelesaian masalah dalam diskusi kelompok.']);
      setPemahamanBermakna('Pembelajaran ini melatih daya nalar siswa dalam menyelesaikan persoalan nyata.');
      setPertanyaanList(['Bagaimana hal ini berhubungan dengan kehidupanmu di rumah?']);
      setPendahuluanSteps([
        'Guru menyapa siswa, memimpin doa, dan mengecek kehadiran.',
        'Apersepsi dan penyampaian tujuan pembelajaran hari ini.',
      ]);
      setIntiSteps([
        'Penyajian orientasi masalah kontekstual oleh guru.',
        'Pengerjaan LKPD secara berkelompok berkolaborasi.',
        'Presentasi hasil diskusi dan tanggapan kelompok lain.',
      ]);
      setPenutupSteps([
        'Peserta didik bersama guru menyimpulkan inti pembelajaran.',
        'Refleksi singkat dan doa penutup.',
      ]);
      setAsesmenDesc('Asesmen Formatif (Rubrik keaktifan kelompok & pengerjaan LKPD) dan Asesmen Sumatif (Tes tertulis 10 soal).');
      setLkpd('Lembar Kerja Peserta Didik (LKPD): Lembar observasi dan studi kasus.');
      setRubrikPenilaian('Rubrik Penilaian: Skor 4 (Sangat Mahir), Skor 3 (Cakap), Skor 2 (Mulai Berkembang), Skor 1 (Perlu Bimbingan).');
      setRemedialPengayaan('Remedial: Pendampingan tutor sebaya. Pengayaan: Tugas analisis proyek mandiri.');
    }
    setErrors({});
    setActiveTab('umum');
  }, [editingModule, isFormModalOpen, userProfile]);

  // Adjust Fase automatically when grade changes
  const handleGradeChange = (g: number) => {
    setGrade(g);
    if (g === 1 || g === 2) setFase('Fase A');
    else if (g === 3 || g === 4) setFase('Fase B');
    else setFase('Fase C');
  };

  const toggleProfil = (item: string) => {
    setProfilPancasila(prev =>
      prev.includes(item) ? prev.filter(p => p !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const err: Record<string, string> = {};
    if (!title.trim()) err.title = 'Judul modul perangkat ajar wajib diisi';
    if (!subject) err.subject = 'Mata pelajaran wajib dipilih';
    if (!capaianPembelajaran.trim()) err.capaianPembelajaran = 'Capaian Pembelajaran wajib diisi';

    if (Object.keys(err).length > 0) {
      setErrors(err);
      setActiveTab('umum');
      return;
    }

    const payload: Partial<TeachingModule> = {
      title: title.trim(),
      code: code.trim() || `MOD-${grade}-${Date.now().toString().slice(-4)}`,
      type,
      fase,
      grade,
      subject,
      semester,
      academicYear,
      status,
      allocatedHours,
      targetStudents,
      modelPembelajaran,
      author: author.trim() || userProfile.name,
      nipAuthor: nipAuthor.trim() || userProfile.nip,
      school: school.trim() || userProfile.school,
      profilPancasila,
      capaianPembelajaran: capaianPembelajaran.trim(),
      tujuanPembelajaran: tujuanList.filter(t => t.trim()),
      pemahamanBermakna: pemahamanBermakna.trim(),
      pertanyaanPemantik: pertanyaanList.filter(p => p.trim()),
      langkahKegiatan: {
        pendahuluan: pendahuluanSteps.filter(s => s.trim()),
        inti: intiSteps.filter(s => s.trim()),
        penutup: penutupSteps.filter(s => s.trim()),
      },
      asesmenDesc: asesmenDesc.trim(),
      lampiran: {
        lkpd: lkpd.trim(),
        materiSingkat: 'Materi pokok pembelajaran sesuai kurikulum.',
        rubrikPenilaian: rubrikPenilaian.trim(),
        remedialPengayaan: remedialPengayaan.trim(),
      },
    };

    if (editingModule) {
      updateModule(editingModule.id, payload);
    } else {
      addModule(payload);
    }

    setIsFormModalOpen(false);
  };

  if (!isFormModalOpen) return null;

  return (
    <div
      id="module-form-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="module-form-modal"
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0 bg-slate-50/50 dark:bg-slate-800/40 rounded-t-3xl">
          <div>
            <span className="text-xs font-bold text-[#00529B] dark:text-blue-400 uppercase tracking-wider">
              {editingModule ? 'Sunting Perangkat Ajar' : 'Penyusunan Perangkat Ajar Baru'}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {editingModule ? editingModule.title : 'Formulir Standar Kurikulum Merdeka'}
            </h2>
          </div>

          <button
            id="btn-close-form-modal"
            type="button"
            onClick={() => setIsFormModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation in Form */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 sm:px-6 bg-slate-50/30 dark:bg-slate-800/20 text-xs font-bold overflow-x-auto">
          {[
            { id: 'umum', label: '1. Informasi Umum' },
            { id: 'tujuan', label: '2. CP, TP & Profil Pancasila' },
            { id: 'langkah', label: '3. Langkah Pembelajaran' },
            { id: 'lampiran', label: '4. Asesmen & LKPD' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 border-b-2 whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'border-[#00529B] text-[#00529B] dark:border-blue-400 dark:text-blue-300'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-xs sm:text-sm">
          {/* TAB 1: INFORMASI UMUM */}
          {activeTab === 'umum' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Judul Modul */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Modul / Perangkat Ajar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Contoh: Modul Ajar IPAS: Tumbuhan Sumber Kehidupan di Bumi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#00529B]"
                />
                {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
              </div>

              {/* Grid: Jenis Perangkat, Mapel, Kelas, Fase */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jenis Perangkat
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as ModuleType)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <option value="Modul Ajar">Modul Ajar</option>
                    <option value="Alur Tujuan Pembelajaran (ATP)">ATP</option>
                    <option value="Capaian Pembelajaran (CP)">CP</option>
                    <option value="Program Tahunan (Prota)">Prota</option>
                    <option value="Program Semester (Promes)">Promes</option>
                    <option value="Asesmen & Rubrik">Asesmen & Rubrik</option>
                    <option value="Bahan Ajar & LKPD">Bahan Ajar & LKPD</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mata Pelajaran <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value as SubjectType)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <option value="IPAS">IPAS</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
                    <option value="PJOK">PJOK</option>
                    <option value="Pendidikan Agama Islam">PAI-BP</option>
                    <option value="Seni Rupa">Seni Rupa</option>
                    <option value="Bahasa Inggris">Bahasa Inggris</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kelas SD
                  </label>
                  <select
                    value={grade}
                    onChange={e => handleGradeChange(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6].map(g => (
                      <option key={g} value={g}>Kelas {g} SD</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fase Kurikulum
                  </label>
                  <input
                    type="text"
                    disabled
                    value={fase}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-bold"
                  />
                </div>
              </div>

              {/* Grid: Semester, Tahun Ajaran, Alokasi Waktu, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Semester
                  </label>
                  <select
                    value={semester}
                    onChange={e => setSemester(Number(e.target.value) as 1 | 2)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <option value={1}>Semester 1 (Ganjil)</option>
                    <option value={2}>Semester 2 (Genap)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tahun Ajaran
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={e => setAcademicYear(e.target.value)}
                    placeholder="2024/2025"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Alokasi Waktu
                  </label>
                  <input
                    type="text"
                    value={allocatedHours}
                    onChange={e => setAllocatedHours(e.target.value)}
                    placeholder="4 JP (4 x 35 Menit)"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Status Dokumen
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as StatusType)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Review">Review</option>
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Diterbitkan">Diterbitkan</option>
                  </select>
                </div>
              </div>

              {/* Penyusun & Sekolah */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Guru Penyusun
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NIP Guru
                  </label>
                  <input
                    type="text"
                    value={nipAuthor}
                    onChange={e => setNipAuthor(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Satuan Pendidikan (SD)
                  </label>
                  <input
                    type="text"
                    value={school}
                    onChange={e => setSchool(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CP, TP & PROFIL PANCASILA */}
          {activeTab === 'tujuan' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Profil Pelajar Pancasila Badges Selector */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Dimensi Profil Pelajar Pancasila (Pilih yang ditargetkan)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {allProfilOptions.map(option => {
                    const isSelected = profilPancasila.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleProfil(option)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-semibold transition ${
                          isSelected
                            ? 'bg-orange-50 dark:bg-orange-950/60 border-[#FF7300] text-[#FF7300] dark:text-orange-300'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                            isSelected ? 'bg-[#FF7300] text-white' : 'border border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Capaian Pembelajaran */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Capaian Pembelajaran (CP) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={capaianPembelajaran}
                  onChange={e => setCapaianPembelajaran(e.target.value)}
                  placeholder="Rumusan CP resmi sesuai panduan BSKAP Kemendikbud..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#00529B]"
                />
                {errors.capaianPembelajaran && (
                  <p className="text-xs text-rose-500 mt-1">{errors.capaianPembelajaran}</p>
                )}
              </div>

              {/* Dynamic Tujuan Pembelajaran (TP) List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Tujuan Pembelajaran (TP)
                  </label>
                  <button
                    type="button"
                    onClick={() => setTujuanList(prev => [...prev, ''])}
                    className="flex items-center gap-1 text-xs font-bold text-[#00529B] dark:text-blue-400 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Tujuan</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {tujuanList.map((tp, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                      <input
                        type="text"
                        value={tp}
                        onChange={e => {
                          const val = e.target.value;
                          setTujuanList(prev => {
                            const copy = [...prev];
                            copy[idx] = val;
                            return copy;
                          });
                        }}
                        placeholder={`Tujuan Pembelajaran ${idx + 1}`}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                      />
                      {tujuanList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setTujuanList(prev => prev.filter((_, i) => i !== idx))}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pemahaman Bermakna & Pertanyaan Pemantik */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pemahaman Bermakna
                  </label>
                  <textarea
                    rows={2}
                    value={pemahamanBermakna}
                    onChange={e => setPemahamanBermakna(e.target.value)}
                    placeholder="Manfaat nyata yang didapatkan anak setelah mempelajari materi..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pertanyaan Pemantik
                  </label>
                  <textarea
                    rows={2}
                    value={pertanyaanList.join('\n')}
                    onChange={e => setPertanyaanList(e.target.value.split('\n'))}
                    placeholder="Satu baris satu pertanyaan pemantik..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LANGKAH PEMBELAJARAN */}
          {activeTab === 'langkah' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Pendahuluan */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-bold text-slate-800 dark:text-slate-200">
                    1. Langkah Pendahuluan (15 Menit)
                  </label>
                  <button
                    type="button"
                    onClick={() => setPendahuluanSteps(prev => [...prev, ''])}
                    className="text-xs font-bold text-[#00529B] dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Langkah
                  </button>
                </div>
                <div className="space-y-2">
                  {pendahuluanSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                      <input
                        type="text"
                        value={step}
                        onChange={e => {
                          const val = e.target.value;
                          setPendahuluanSteps(prev => {
                            const c = [...prev];
                            c[idx] = val;
                            return c;
                          });
                        }}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                      {pendahuluanSteps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setPendahuluanSteps(prev => prev.filter((_, i) => i !== idx))}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Inti */}
              <div className="p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50">
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-bold text-[#002D62] dark:text-blue-300">
                    2. Langkah Kegiatan Inti (45 Menit)
                  </label>
                  <button
                    type="button"
                    onClick={() => setIntiSteps(prev => [...prev, ''])}
                    className="text-xs font-bold text-[#FF7300] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Kegiatan
                  </button>
                </div>
                <div className="space-y-2">
                  {intiSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                      <input
                        type="text"
                        value={step}
                        onChange={e => {
                          const val = e.target.value;
                          setIntiSteps(prev => {
                            const c = [...prev];
                            c[idx] = val;
                            return c;
                          });
                        }}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                      {intiSteps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setIntiSteps(prev => prev.filter((_, i) => i !== idx))}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Penutup */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-bold text-slate-800 dark:text-slate-200">
                    3. Langkah Penutup (10 Menit)
                  </label>
                  <button
                    type="button"
                    onClick={() => setPenutupSteps(prev => [...prev, ''])}
                    className="text-xs font-bold text-[#00529B] dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Penutup
                  </button>
                </div>
                <div className="space-y-2">
                  {penutupSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                      <input
                        type="text"
                        value={step}
                        onChange={e => {
                          const val = e.target.value;
                          setPenutupSteps(prev => {
                            const c = [...prev];
                            c[idx] = val;
                            return c;
                          });
                        }}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                      {penutupSteps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setPenutupSteps(prev => prev.filter((_, i) => i !== idx))}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ASESMEN & LKPD */}
          {activeTab === 'lampiran' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Asesmen (Formatif & Sumatif)
                </label>
                <textarea
                  rows={2}
                  value={asesmenDesc}
                  onChange={e => setAsesmenDesc(e.target.value)}
                  placeholder="Bentuk evaluasi (misal: pengamatan sikap, rubrik unjuk kerja, dan kuis tertulis)..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lembar Kerja Peserta Didik (LKPD)
                </label>
                <textarea
                  rows={3}
                  value={lkpd}
                  onChange={e => setLkpd(e.target.value)}
                  placeholder="Deskripsi kegiatan atau lembar penugasan LKPD siswa..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Rubrik Penilaian & Kriteria Ketercapaian (KKTP)
                </label>
                <textarea
                  rows={3}
                  value={rubrikPenilaian}
                  onChange={e => setRubrikPenilaian(e.target.value)}
                  placeholder="Kriteria skor 1-4 atau indikator KKTP..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Program Remedial & Pengayaan
                </label>
                <textarea
                  rows={2}
                  value={remedialPengayaan}
                  onChange={e => setRemedialPengayaan(e.target.value)}
                  placeholder="Tindak lanjut untuk siswa yang belum tuntas dan pengayaan bagi siswa mahir..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Batal
            </button>

            <div className="flex items-center gap-2">
              {activeTab !== 'lampiran' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'umum') setActiveTab('tujuan');
                    else if (activeTab === 'tujuan') setActiveTab('langkah');
                    else if (activeTab === 'langkah') setActiveTab('lampiran');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-200"
                >
                  Lanjut ke Bagian Berikutnya →
                </button>
              ) : null}

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7300] to-[#E65100] hover:from-[#f56f00] hover:to-[#d84a00] text-white font-extrabold shadow-md shadow-orange-500/20 active:scale-95 transition"
              >
                <Save className="w-4 h-4" />
                <span>{editingModule ? 'Simpan Perubahan' : 'Terbitkan Perangkat'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
