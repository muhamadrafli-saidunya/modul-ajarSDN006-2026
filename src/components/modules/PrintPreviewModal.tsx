import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Printer,
  Download,
  Copy,
  CheckCircle2,
  School,
  FileText,
  Sliders,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  PenTool
} from 'lucide-react';
import { KopSignatureSettings } from './KopSignatureSettings';
import { KopConfig } from '../../types';
import { initialKopConfig } from '../../data/mockData';

export const PrintPreviewModal: React.FC = () => {
  const {
    isPrintPreviewOpen,
    setIsPrintPreviewOpen,
    printModule,
    showToast,
    userProfile,
    updateKopConfig
  } = useApp();

  const printAreaRef = useRef<HTMLDivElement>(null);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  // Local kopConfig state initialized with profile preferences or module details
  const [kopConfig, setKopConfig] = useState<KopConfig>(() => {
    const base = userProfile.kopConfig || initialKopConfig;
    const moduleKop = printModule?.kopConfig;
    return {
      ...base,
      ...(moduleKop || {}),
      schoolName: moduleKop?.schoolName || base.schoolName || printModule?.school || userProfile.school,
      headmasterName: moduleKop?.headmasterName || base.headmasterName || printModule?.headmaster || userProfile.headmasterName,
      headmasterNip: moduleKop?.headmasterNip || base.headmasterNip || printModule?.nipHeadmaster || userProfile.headmasterNip,
      teacherName: moduleKop?.teacherName || printModule?.author || base.teacherName || userProfile.name,
      teacherNip: moduleKop?.teacherNip || printModule?.nipAuthor || base.teacherNip || userProfile.nip,
      // Left and right logos from school profile settings always take priority
      leftLogoUrl: userProfile.kopConfig?.leftLogoUrl !== undefined ? userProfile.kopConfig.leftLogoUrl : (moduleKop?.leftLogoUrl || initialKopConfig.leftLogoUrl),
      rightLogoUrl: userProfile.kopConfig?.rightLogoUrl !== undefined ? userProfile.kopConfig.rightLogoUrl : (moduleKop?.rightLogoUrl || initialKopConfig.rightLogoUrl),
      leftLogoSize: userProfile.kopConfig?.leftLogoSize || moduleKop?.leftLogoSize || initialKopConfig.leftLogoSize,
      rightLogoSize: userProfile.kopConfig?.rightLogoSize || moduleKop?.rightLogoSize || initialKopConfig.rightLogoSize,
    };
  });

  // Keep synced if printModule changes
  useEffect(() => {
    if (printModule) {
      const base = userProfile.kopConfig || initialKopConfig;
      const moduleKop = printModule.kopConfig;
      setKopConfig({
        ...base,
        ...(moduleKop || {}),
        schoolName: moduleKop?.schoolName || base.schoolName || printModule.school || userProfile.school,
        headmasterName: moduleKop?.headmasterName || base.headmasterName || printModule.headmaster || userProfile.headmasterName,
        headmasterNip: moduleKop?.headmasterNip || base.headmasterNip || printModule.nipHeadmaster || userProfile.headmasterNip,
        teacherName: moduleKop?.teacherName || printModule.author || base.teacherName || userProfile.name,
        teacherNip: moduleKop?.teacherNip || printModule.nipAuthor || base.teacherNip || userProfile.nip,
        leftLogoUrl: userProfile.kopConfig?.leftLogoUrl !== undefined ? userProfile.kopConfig.leftLogoUrl : (moduleKop?.leftLogoUrl || initialKopConfig.leftLogoUrl),
        rightLogoUrl: userProfile.kopConfig?.rightLogoUrl !== undefined ? userProfile.kopConfig.rightLogoUrl : (moduleKop?.rightLogoUrl || initialKopConfig.rightLogoUrl),
        leftLogoSize: userProfile.kopConfig?.leftLogoSize || moduleKop?.leftLogoSize || initialKopConfig.leftLogoSize,
        rightLogoSize: userProfile.kopConfig?.rightLogoSize || moduleKop?.rightLogoSize || initialKopConfig.rightLogoSize,
      });
    }
  }, [printModule, userProfile]);

  if (!isPrintPreviewOpen || !printModule) return null;

  const handleUpdateConfig = (updated: Partial<KopConfig>) => {
    setKopConfig(prev => ({ ...prev, ...updated }));
  };

  const handleSaveAsDefault = () => {
    updateKopConfig(kopConfig);
    showToast('Pengaturan KOP & Logo berhasil disimpan sebagai format utama!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    if (!printAreaRef.current) return;
    navigator.clipboard.writeText(printAreaRef.current.innerText);
    showToast('Teks naskah perangkat ajar berhasil disalin ke clipboard!', 'success');
  };

  const handleDownloadTxt = () => {
    if (!printAreaRef.current) return;
    const content = printAreaRef.current.innerText;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${printModule.code}_${printModule.title.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Berkas dokumen berhasil diunduh!', 'success');
  };

  const todayFormatted = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date());

  return (
    <div
      id="print-preview-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-900/75 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="print-preview-modal"
        className="relative w-full max-w-4xl max-h-[95vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200"
      >
        {/* Top Floating Control Bar */}
        <div
          id="print-controls-bar"
          className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 bg-slate-50 dark:bg-slate-800/90 rounded-t-3xl no-print"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF7300] text-white flex items-center justify-center font-bold shadow-xs">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Pratinjau Dokumen Resmi Cetak
                </h3>
                {kopConfig.showKop && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#00529C] dark:text-blue-300">
                    <CheckCircle2 className="w-3 h-3" /> KOP Aktif
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Format baku Kemendikbudristek dengan KOP Logo Kanan-Kiri & Lembar Pengesahan
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle KOP & Signature Settings Drawer */}
            <button
              id="btn-toggle-kop-settings"
              onClick={() => setShowSettingsDrawer(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition ${
                showSettingsDrawer
                  ? 'bg-[#00529C] text-white border-[#00529C] shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#00529C]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Atur KOP & Tanda Tangan</span>
              {showSettingsDrawer ? (
                <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              )}
            </button>

            <button
              id="btn-copy-doc-text"
              onClick={handleCopyText}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin</span>
            </button>

            <button
              id="btn-download-txt"
              onClick={handleDownloadTxt}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh .txt</span>
            </button>

            <button
              id="btn-do-print"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-black rounded-xl bg-gradient-to-r from-[#FF7300] to-[#E65100] hover:from-[#f56f00] text-white shadow-md active:scale-95 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={() => setIsPrintPreviewOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Collapsible Settings Drawer (no-print) */}
        {showSettingsDrawer && (
          <div
            id="print-settings-drawer"
            className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/95 border-b border-slate-200 dark:border-slate-700 max-h-[60vh] overflow-y-auto no-print space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-inner"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#00529C]" />
                  <span>Kustomisasi KOP Surat & Tanda Tangan Cetak</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ubah atau unggah logo sekolah (kiri & kanan), atur teks kop, atau ubah pejabat penandatangan. Perubahan langsung tercermin di lembar cetak bawah.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsDrawer(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Tutup Panel
              </button>
            </div>

            <KopSignatureSettings
              config={kopConfig}
              onChange={handleUpdateConfig}
              onSaveDefault={handleSaveAsDefault}
            />
          </div>
        )}

        {/* Document Body (Simulating Real A4 Paper) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 dark:bg-slate-950/50">
          <div
            ref={printAreaRef}
            id="print-document-paper"
            className="max-w-3xl mx-auto p-8 sm:p-12 bg-white text-slate-900 shadow-xl rounded-xl border border-slate-200 font-serif leading-relaxed text-xs sm:text-sm"
          >
            {/* KOP SURAT RESMI SEKOLAH DASAR */}
            {kopConfig.showKop && (
              <div className="pb-3 mb-6" style={{ borderBottom: '4px double #0f172a' }}>
                <div className="flex items-center justify-between gap-4">
                  {/* LOGO KIRI (Dinas / Pemda / Tut Wuri Handayani) */}
                  {kopConfig.leftLogoUrl ? (
                    <div
                      className="shrink-0 flex items-center justify-center"
                      style={{ width: `${kopConfig.leftLogoSize}px` }}
                    >
                      <img
                        src={kopConfig.leftLogoUrl}
                        alt="Logo Kiri KOP"
                        style={{
                          width: `${kopConfig.leftLogoSize}px`,
                          maxHeight: `${kopConfig.leftLogoSize}px`,
                        }}
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div
                      style={{ width: `${kopConfig.rightLogoSize || 70}px` }}
                      className="shrink-0"
                    />
                  )}

                  {/* TEKS RESMI KOP SURAT */}
                  <div className="flex-1 text-center font-sans">
                    {kopConfig.governmentHeader && (
                      <p className="text-xs uppercase font-bold tracking-widest text-slate-800 leading-tight">
                        {kopConfig.governmentHeader}
                      </p>
                    )}
                    {kopConfig.departmentHeader && (
                      <p className="text-xs uppercase font-bold tracking-wider text-slate-800 leading-tight mt-0.5">
                        {kopConfig.departmentHeader}
                      </p>
                    )}
                    <h2 className="text-base sm:text-lg font-black uppercase text-slate-950 tracking-tight mt-1 leading-tight">
                      {kopConfig.schoolName || printModule.school}
                    </h2>
                    {kopConfig.schoolAddress && (
                      <p className="text-[11px] text-slate-700 mt-0.5 leading-snug">
                        {kopConfig.schoolAddress}
                      </p>
                    )}
                    {kopConfig.schoolContact && (
                      <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">
                        {kopConfig.schoolContact}
                      </p>
                    )}
                  </div>

                  {/* LOGO KANAN (Sekolah Dasar / Yayasan) */}
                  {kopConfig.rightLogoUrl ? (
                    <div
                      className="shrink-0 flex items-center justify-center"
                      style={{ width: `${kopConfig.rightLogoSize}px` }}
                    >
                      <img
                        src={kopConfig.rightLogoUrl}
                        alt="Logo Kanan KOP"
                        style={{
                          width: `${kopConfig.rightLogoSize}px`,
                          maxHeight: `${kopConfig.rightLogoSize}px`,
                        }}
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div
                      style={{ width: `${kopConfig.leftLogoSize || 70}px` }}
                      className="shrink-0"
                    />
                  )}
                </div>
              </div>
            )}

            {/* DOCUMENT TITLE */}
            <div className="text-center my-6">
              <h1 className="text-base sm:text-lg font-black uppercase tracking-wide underline font-sans">
                {printModule.type.toUpperCase()}
              </h1>
              <p className="text-xs font-bold font-sans mt-1 text-slate-800">
                {printModule.title}
              </p>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                Nomor Registrasi: {printModule.code} • Kurikulum Merdeka
              </p>
            </div>

            {/* I. INFORMASI UMUM */}
            <div className="mb-6">
              <h3 className="font-bold text-xs uppercase font-sans tracking-wider border-b border-slate-300 pb-1 mb-3 text-slate-800">
                I. INFORMASI UMUM
              </h3>
              <table className="w-full text-xs font-sans">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 w-44 font-semibold text-slate-600">Satuan Pendidikan</td>
                    <td className="py-1 w-4">:</td>
                    <td className="py-1 font-bold text-slate-900">{printModule.school}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 font-semibold text-slate-600">Mata Pelajaran</td>
                    <td className="py-1">:</td>
                    <td className="py-1 font-bold text-slate-900">{printModule.subject}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 font-semibold text-slate-600">Fase / Kelas</td>
                    <td className="py-1">:</td>
                    <td className="py-1 text-slate-900">{printModule.fase} / Kelas {printModule.grade} SD</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 font-semibold text-slate-600">Semester / Tahun Ajaran</td>
                    <td className="py-1">:</td>
                    <td className="py-1 text-slate-900">Semester {printModule.semester} (Ganjil) / {printModule.academicYear}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 font-semibold text-slate-600">Alokasi Waktu</td>
                    <td className="py-1">:</td>
                    <td className="py-1 text-slate-900">{printModule.allocatedHours}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 font-semibold text-slate-600">Target Peserta Didik</td>
                    <td className="py-1">:</td>
                    <td className="py-1 text-slate-900">{printModule.targetStudents}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 font-semibold text-slate-600">Model Pembelajaran</td>
                    <td className="py-1">:</td>
                    <td className="py-1 text-slate-900">{printModule.modelPembelajaran}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold text-slate-600">Profil Pelajar Pancasila</td>
                    <td className="py-1">:</td>
                    <td className="py-1 text-slate-900 font-medium">
                      {printModule.profilPancasila.join(', ')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* II. KOMPONEN INTI */}
            <div className="mb-6 space-y-4">
              <h3 className="font-bold text-xs uppercase font-sans tracking-wider border-b border-slate-300 pb-1 text-slate-800">
                II. KOMPONEN INTI
              </h3>

              <div>
                <p className="font-bold text-xs font-sans text-slate-800">A. Capaian Pembelajaran (CP):</p>
                <p className="text-xs text-slate-800 mt-1 pl-4 italic">
                  "{printModule.capaianPembelajaran}"
                </p>
              </div>

              <div>
                <p className="font-bold text-xs font-sans text-slate-800">B. Tujuan Pembelajaran (TP):</p>
                <ol className="list-decimal list-inside pl-4 text-xs space-y-1 mt-1 text-slate-800">
                  {printModule.tujuanPembelajaran.map((tp, i) => (
                    <li key={i}>{tp}</li>
                  ))}
                </ol>
              </div>

              <div>
                <p className="font-bold text-xs font-sans text-slate-800">C. Pemahaman Bermakna:</p>
                <p className="text-xs text-slate-800 mt-1 pl-4">
                  {printModule.pemahamanBermakna}
                </p>
              </div>

              <div>
                <p className="font-bold text-xs font-sans text-slate-800">D. Pertanyaan Pemantik:</p>
                <ul className="list-disc list-inside pl-4 text-xs space-y-1 mt-1 text-slate-800">
                  {printModule.pertanyaanPemantik.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* III. LANGKAH-LANGKAH PEMBELAJARAN */}
            <div className="mb-6 space-y-3">
              <h3 className="font-bold text-xs uppercase font-sans tracking-wider border-b border-slate-300 pb-1 text-slate-800">
                III. LANGKAH-LANGKAH KEGIATAN PEMBELAJARAN
              </h3>

              <div className="pl-2">
                <p className="font-bold text-xs font-sans text-slate-800">1. Kegiatan Pendahuluan (15 Menit):</p>
                <ol className="list-decimal list-inside pl-4 text-xs space-y-1 text-slate-700 mt-1">
                  {printModule.langkahKegiatan.pendahuluan.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>

              <div className="pl-2">
                <p className="font-bold text-xs font-sans text-slate-800">2. Kegiatan Inti (45 Menit):</p>
                <ol className="list-decimal list-inside pl-4 text-xs space-y-1 text-slate-700 mt-1">
                  {printModule.langkahKegiatan.inti.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>

              <div className="pl-2">
                <p className="font-bold text-xs font-sans text-slate-800">3. Kegiatan Penutup (10 Menit):</p>
                <ol className="list-decimal list-inside pl-4 text-xs space-y-1 text-slate-700 mt-1">
                  {printModule.langkahKegiatan.penutup.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* IV. ASESMEN & LAMPIRAN */}
            <div className="mb-8 space-y-2">
              <h3 className="font-bold text-xs uppercase font-sans tracking-wider border-b border-slate-300 pb-1 text-slate-800">
                IV. ASESMEN DAN LAMPIRAN
              </h3>
              <p className="text-xs pl-2 text-slate-800">
                <strong>Metode Asesmen:</strong> {printModule.asesmenDesc}
              </p>
              <p className="text-xs pl-2 text-slate-800">
                <strong>Lembar Kerja Peserta Didik (LKPD):</strong> {printModule.lampiran.lkpd}
              </p>
              <p className="text-xs pl-2 text-slate-800">
                <strong>Rubrik Penskoran:</strong> {printModule.lampiran.rubrikPenilaian}
              </p>
            </div>

            {/* PENGESAHAN DOKUMEN / LEMBAR TANDA TANGAN */}
            {kopConfig.showSignature && (
              <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs font-sans">
                {/* Kolom Mengetahui: Kepala Sekolah */}
                <div>
                  <p className="text-slate-600">Mengetahui,</p>
                  <p className="font-bold text-slate-900">
                    {kopConfig.headmasterTitle || `Kepala ${printModule.school}`}
                  </p>
                  <div className="h-20 flex items-center justify-center">
                    {/* Ruang tanda tangan basah & stempel resmi */}
                  </div>
                  <p className="font-black text-slate-900 underline">
                    {kopConfig.headmasterName || printModule.headmaster || userProfile.headmasterName}
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    NIP. {kopConfig.headmasterNip || printModule.nipHeadmaster || userProfile.headmasterNip}
                  </p>
                </div>

                {/* Kolom Penyusun: Guru Kelas / Mapel */}
                <div>
                  <p className="text-slate-600">
                    {kopConfig.signaturePlace || userProfile.city},{' '}
                    {kopConfig.signatureDate || todayFormatted}
                  </p>
                  <p className="font-bold text-slate-900">
                    {kopConfig.teacherTitle || 'Guru Kelas / Penyusun'}
                  </p>
                  <div className="h-20 flex items-center justify-center">
                    {/* Ruang tanda tangan basah */}
                  </div>
                  <p className="font-black text-slate-900 underline">
                    {kopConfig.teacherName || printModule.author}
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    NIP. {kopConfig.teacherNip || printModule.nipAuthor || userProfile.nip}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
