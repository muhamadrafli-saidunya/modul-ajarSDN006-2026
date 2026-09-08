import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Printer,
  Edit,
  Download,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Calendar,
  Clock,
  User,
  School,
  FileText,
  Tag,
  Award
} from 'lucide-react';

export const ModuleDetailModal: React.FC = () => {
  const {
    isDetailOpen,
    setIsDetailOpen,
    selectedModule,
    setEditingModule,
    setIsFormModalOpen,
    setPrintModule,
    setIsPrintPreviewOpen,
    incrementDownload,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = React.useState<'overview' | 'full' | 'lkpd' | 'bahan' | 'silabus' | 'prota' | 'prosem'>('overview');

  if (!isDetailOpen || !selectedModule) return null;

  const handleEdit = () => {
    setIsDetailOpen(false);
    setEditingModule(selectedModule);
    setIsFormModalOpen(true);
  };

  const handlePrint = () => {
    incrementDownload(selectedModule.id);
    setPrintModule(selectedModule);
    setIsPrintPreviewOpen(true);
  };

  const handleDownloadWord = (contentHtml: string, titleSuffix: string) => {
    const filename = `${selectedModule.code}_${titleSuffix.replace(/\s+/g, '_')}`;
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

  return (
    <div
      id="module-detail-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="module-detail-modal"
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 shrink-0 bg-slate-50/50 dark:bg-slate-800/40 rounded-t-3xl">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-lg bg-[#00529B] text-white">
                {selectedModule.code}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-lg bg-blue-100 dark:bg-blue-950 text-[#00529B] dark:text-blue-300">
                {selectedModule.type}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {selectedModule.subject} • Kelas {selectedModule.grade} ({selectedModule.fase})
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {selectedModule.status}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              {selectedModule.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Penyusun: <strong className="text-slate-700 dark:text-slate-200">{selectedModule.author}</strong>
              </span>
              <span className="flex items-center gap-1">
                <School className="w-3.5 h-3.5 text-slate-400" />
                {selectedModule.school}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                TA {selectedModule.academicYear} (Semester {selectedModule.semester})
              </span>
            </div>
          </div>

          <button
            id="btn-close-detail-modal"
            onClick={() => setIsDetailOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
            aria-label="Tutup"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation if full HTML or supplementary docs exist */}
        {(selectedModule.fullDocumentHtml || selectedModule.supplementaryDocs) && (
          <div className="px-6 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-850 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                  activeTab === 'overview'
                    ? 'bg-white dark:bg-slate-900 text-[#00529B] dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Ringkasan Kurikulum
              </button>
              {selectedModule.fullDocumentHtml && (
                <button
                  type="button"
                  onClick={() => setActiveTab('full')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                    activeTab === 'full'
                      ? 'bg-white dark:bg-slate-900 text-[#00529B] dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Naskah Lengkap Resmi
                </button>
              )}
              {selectedModule.supplementaryDocs?.lkpdHtml && (
                <button
                  type="button"
                  onClick={() => setActiveTab('lkpd')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                    activeTab === 'lkpd'
                      ? 'bg-white dark:bg-slate-900 text-[#00529B] dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  LKPD Siswa
                </button>
              )}
              {selectedModule.supplementaryDocs?.bahanAjarHtml && (
                <button
                  type="button"
                  onClick={() => setActiveTab('bahan')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                    activeTab === 'bahan'
                      ? 'bg-white dark:bg-slate-900 text-[#00529B] dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Bahan Ajar
                </button>
              )}
              {selectedModule.supplementaryDocs?.silabusHtml && (
                <button
                  type="button"
                  onClick={() => setActiveTab('silabus')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                    activeTab === 'silabus'
                      ? 'bg-white dark:bg-slate-900 text-[#00529B] dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Silabus / ATP
                </button>
              )}
              {selectedModule.supplementaryDocs?.protaHtml && (
                <button
                  type="button"
                  onClick={() => setActiveTab('prota')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                    activeTab === 'prota'
                      ? 'bg-white dark:bg-slate-900 text-[#00529B] dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Prota
                </button>
              )}
              {selectedModule.supplementaryDocs?.prosemHtml && (
                <button
                  type="button"
                  onClick={() => setActiveTab('prosem')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                    activeTab === 'prosem'
                      ? 'bg-white dark:bg-slate-900 text-[#00529B] dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Prosem
                </button>
              )}
            </div>

            {/* Word Download for active tab */}
            {activeTab !== 'overview' && (
              <button
                type="button"
                onClick={() => {
                  let html = '';
                  if (activeTab === 'full') html = selectedModule.fullDocumentHtml || '';
                  else if (activeTab === 'lkpd') html = selectedModule.supplementaryDocs?.lkpdHtml || '';
                  else if (activeTab === 'bahan') html = selectedModule.supplementaryDocs?.bahanAjarHtml || '';
                  else if (activeTab === 'silabus') html = selectedModule.supplementaryDocs?.silabusHtml || '';
                  else if (activeTab === 'prota') html = selectedModule.supplementaryDocs?.protaHtml || '';
                  else if (activeTab === 'prosem') html = selectedModule.supplementaryDocs?.prosemHtml || '';
                  handleDownloadWord(html, activeTab.toUpperCase());
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#00529B] dark:text-blue-300 font-bold text-xs hover:bg-blue-100"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Word (.doc)</span>
              </button>
            )}
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-sm">
          {activeTab !== 'overview' ? (
            <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    activeTab === 'full'
                      ? selectedModule.fullDocumentHtml || ''
                      : activeTab === 'lkpd'
                      ? selectedModule.supplementaryDocs?.lkpdHtml || ''
                      : activeTab === 'bahan'
                      ? selectedModule.supplementaryDocs?.bahanAjarHtml || ''
                      : activeTab === 'silabus'
                      ? selectedModule.supplementaryDocs?.silabusHtml || ''
                      : activeTab === 'prota'
                      ? selectedModule.supplementaryDocs?.protaHtml || ''
                      : selectedModule.supplementaryDocs?.prosemHtml || ''
                }}
              />
            </div>
          ) : (
            <>
          {/* 1. Informasi Umum Perangkat Ajar */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold tracking-wider text-[#00529B] dark:text-blue-400 uppercase flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>A. Informasi Umum Perangkat</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Alokasi Waktu</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedModule.allocatedHours}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Target Siswa</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedModule.targetStudents}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Model Pembelajaran</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedModule.modelPembelajaran}</p>
              </div>
            </div>
          </section>

          {/* 2. Dimensi Profil Pelajar Pancasila */}
          {selectedModule.profilPancasila && selectedModule.profilPancasila.length > 0 && (
            <section className="space-y-2.5">
              <h3 className="text-sm font-bold tracking-wider text-[#00529B] dark:text-blue-400 uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF7300]" />
                <span>B. Dimensi Profil Pelajar Pancasila</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedModule.profilPancasila.map(dimensi => (
                  <span
                    key={dimensi}
                    className="px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-[#FF7300] dark:text-orange-300 font-bold text-xs border border-orange-200 dark:border-orange-800/60"
                  >
                    ★ {dimensi}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* 3. Komponen Inti: CP & Tujuan Pembelajaran */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-[#00529B] dark:text-blue-400 uppercase flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>C. Komponen Inti Pembelajaran</span>
            </h3>

            {/* Capaian Pembelajaran */}
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
              <h4 className="text-xs font-bold text-[#002D62] dark:text-blue-300 uppercase tracking-wider mb-1">
                Capaian Pembelajaran (CP)
              </h4>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {selectedModule.capaianPembelajaran}
              </p>
            </div>

            {/* Tujuan Pembelajaran */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Tujuan Pembelajaran (TP)
              </h4>
              <ul className="space-y-2">
                {selectedModule.tujuanPembelajaran.map((tp, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{tp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pemahaman Bermakna & Pertanyaan Pemantik */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Pemahaman Bermakna
                </h4>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                  {selectedModule.pemahamanBermakna}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Pertanyaan Pemantik
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                  {selectedModule.pertanyaanPemantik.map((q, idx) => (
                    <li key={idx} className="leading-relaxed">{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Langkah-Langkah Kegiatan Pembelajaran */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold tracking-wider text-[#00529B] dark:text-blue-400 uppercase flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>D. Langkah-Langkah Kegiatan Pembelajaran</span>
            </h3>

            {/* Pendahuluan */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h4 className="text-xs font-bold text-[#00529B] dark:text-blue-400 uppercase tracking-wider mb-2">
                1. Kegiatan Pendahuluan (15 Menit)
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700 dark:text-slate-300">
                {selectedModule.langkahKegiatan.pendahuluan.map((step, idx) => (
                  <li key={idx} className="leading-relaxed pl-1">{step}</li>
                ))}
              </ol>
            </div>

            {/* Inti */}
            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/20">
              <h4 className="text-xs font-bold text-[#FF7300] dark:text-orange-400 uppercase tracking-wider mb-2">
                2. Kegiatan Inti (45 Menit)
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-800 dark:text-slate-200 font-medium">
                {selectedModule.langkahKegiatan.inti.map((step, idx) => (
                  <li key={idx} className="leading-relaxed pl-1">{step}</li>
                ))}
              </ol>
            </div>

            {/* Penutup */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h4 className="text-xs font-bold text-[#00529B] dark:text-blue-400 uppercase tracking-wider mb-2">
                3. Kegiatan Penutup (10 Menit)
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700 dark:text-slate-300">
                {selectedModule.langkahKegiatan.penutup.map((step, idx) => (
                  <li key={idx} className="leading-relaxed pl-1">{step}</li>
                ))}
              </ol>
            </div>
          </section>

          {/* 5. Asesmen, LKPD & Rubrik */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold tracking-wider text-[#00529B] dark:text-blue-400 uppercase flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>E. Asesmen, LKPD, & Bahan Lampiran</span>
            </h3>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                  Metode Asesmen:
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">
                  {selectedModule.asesmenDesc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                  Lembar Kerja Peserta Didik (LKPD):
                </span>
                <p className="text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedModule.lampiran.lkpd}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                  Rubrik Penilaian:
                </span>
                <p className="text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedModule.lampiran.rubrikPenilaian}
                </p>
              </div>
            </div>
          </section>
          </>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 rounded-b-3xl flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Diperbarui: {selectedModule.updatedAt} • Telah diunduh {selectedModule.downloadsCount} kali
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDetailOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Tutup
            </button>

            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xl transition"
            >
              <Edit className="w-4 h-4" />
              <span>Sunting</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#FF7300] to-[#E65100] hover:from-[#f56f00] hover:to-[#d84a00] rounded-xl shadow-md shadow-orange-500/20 active:scale-95 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Ekspor PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
