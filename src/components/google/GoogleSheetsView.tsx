import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Plus,
  RefreshCw,
  ExternalLink,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  Layers,
  Sparkles,
  BookOpen,
  ArrowRight,
  AlertCircle,
  FolderOpen
} from 'lucide-react';
import { useGoogleAuth } from '../../context/GoogleAuthContext';
import { useApp } from '../../context/AppContext';
import { GoogleSignInButton } from './GoogleSignInButton';
import { createExamSpreadsheet, createModulesSpreadsheet, deleteSpreadsheetFile } from '../../services/googleSheets';
import { generateOfflineQuestions } from '../../utils/questionGeneratorEngine';
import { GeneratedExam } from '../../types';
import { initialKopConfig } from '../../data/mockData';

export const GoogleSheetsView: React.FC = () => {
  const {
    user,
    isConnected,
    signIn,
    signOut,
    driveFiles,
    fetchDriveFiles,
    isLoadingDrive,
    accessToken,
    lastExportedUrl,
    importExamFromSheets
  } = useGoogleAuth();

  const { modules, showToast, setCurrentView, userProfile } = useApp();

  const [isExporting, setIsExporting] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isConnected) {
      fetchDriveFiles();
    }
  }, [isConnected]);

  // Handle creating a fresh sample assessment spreadsheet
  const handleCreateSampleExamSpreadsheet = async () => {
    if (!accessToken) {
      await signIn();
    }
    try {
      setIsExporting(true);
      const sampleQuestions = generateOfflineQuestions(
        'IPAS',
        userProfile.gradeAssigned ? String(userProfile.gradeAssigned) : '4',
        'Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada tumbuhan (akar, batang, daun, bunga).',
        'Bagian Tubuh Tumbuhan & Fotosintesis',
        'Pilihan Ganda',
        5,
        'HOTS (C4-C6)'
      );
      const sampleExam: GeneratedExam = {
        id: `exam-sample-${Date.now()}`,
        title: `Asesmen Sumatif IPAS Kelas ${userProfile.gradeAssigned || 4}`,
        subject: 'IPAS',
        grade: userProfile.gradeAssigned ? String(userProfile.gradeAssigned) : '4',
        fase: 'Fase B',
        semester: userProfile.activeSemester || 1,
        academicYear: userProfile.academicYear || '2024/2025',
        topic: 'Bagian Tubuh Tumbuhan & Fotosintesis',
        tp: 'Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada tumbuhan (akar, batang, daun, bunga).',
        questionType: 'Pilihan Ganda',
        questionCount: sampleQuestions.length,
        cognitiveLevel: 'HOTS (C4-C6)',
        durationMinutes: 60,
        questions: sampleQuestions,
        kopConfig: userProfile.kopConfig || initialKopConfig,
        createdAt: new Date().toISOString(),
      };
      await createExamSpreadsheet(accessToken!, sampleExam);
      showToast('Spreadsheet asesmen baru berhasil dibuat di Google Drive!', 'success');
      await fetchDriveFiles();
    } catch (err: any) {
      showToast(err.message || 'Gagal membuat spreadsheet', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle exporting teaching modules catalog
  const handleExportModules = async () => {
    if (!accessToken) {
      await signIn();
    }
    try {
      setIsExporting(true);
      const res = await createModulesSpreadsheet(accessToken!, modules);
      showToast('Katalog perangkat ajar berhasil diekspor ke Google Sheets!', 'success');
      await fetchDriveFiles();
    } catch (err: any) {
      showToast(err.message || 'Gagal mengekspor katalog modul', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const confirmDeleteFile = async () => {
    if (!fileToDelete || !accessToken) return;
    try {
      setIsDeleting(true);
      await deleteSpreadsheetFile(accessToken, fileToDelete.id);
      showToast(`Spreadsheet "${fileToDelete.name}" berhasil dihapus.`, 'success');
      setFileToDelete(null);
      await fetchDriveFiles();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus file dari Google Drive.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredFiles = driveFiles.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-[#00529C] text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-bold uppercase tracking-wider">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Google Workspace Cloud Sync</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Pusat Integrasi Google Sheets & Drive
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Otomatisasi pengarsipan bank soal, kisi-kisi asesmen, dan rekapitulasi nilai siswa SD langsung ke akun Google Drive sekolah Anda dengan format resmi 3 lembar kerja.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            {!isConnected ? (
              <GoogleSignInButton
                onClick={async () => {
                  try {
                    await signIn();
                    showToast('Berhasil terhubung dengan Google Sheets!', 'success');
                  } catch (e: any) {
                    showToast(e.message || 'Gagal masuk akun Google', 'error');
                  }
                }}
                text="Hubungkan Akun Google"
                className="shadow-lg hover:shadow-xl text-slate-800"
              />
            ) : (
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex items-center gap-3">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google'}
                    className="w-10 h-10 rounded-full border border-white/40"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center">
                    {user?.displayName ? user.displayName.charAt(0) : 'G'}
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{user?.displayName}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="text-[11px] text-emerald-200">{user?.email}</div>
                </div>
                <button
                  onClick={async () => {
                    await signOut();
                    showToast('Akun Google diputuskan.', 'info');
                  }}
                  className="ml-2 px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ACTION 1: BUAT SOAL KE SPREADSHEET */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Buat Naskah Soal & Ekspor ke Sheets
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Gunakan generator AI untuk menyusun soal pilihan ganda, isian, dan uraian HOTS/C1-C6, lalu simpan otomatis ke Google Spreadsheet.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('buat-soal')}
            className="w-full py-2 px-3 rounded-xl bg-[#00529C] hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <span>Buka Generator Soal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ACTION 2: TEMPLATE 3 LEMBAR KERJA ASESMEN */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Template Asesmen Lengkap 3 Tab
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Buat lembar kerja baru di Google Drive berisi tab Butir Soal, Kisi-Kisi Soal, dan Format Rekap Nilai Siswa berumus otomatis.
            </p>
          </div>
          <button
            onClick={handleCreateSampleExamSpreadsheet}
            disabled={isExporting}
            className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isExporting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            <span>Buat Template di Google Drive</span>
          </button>
        </div>

        {/* ACTION 3: EKSPOR DAFTAR PERANGKAT AJAR */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-[#00529C] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5 text-[#00529C]" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Ekspor Katalog Modul ({modules.length} Dokumen)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Cadangkan seluruh daftar perangkat ajar, ATP, CP, dan LKPD ke Google Spreadsheet untuk pelaporan pengawas & kepala sekolah.
            </p>
          </div>
          <button
            onClick={handleExportModules}
            disabled={isExporting}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 text-xs font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Katalog ke Sheets</span>
          </button>
        </div>
      </div>

      {/* SPREADSHEETS EXPLORER / DRIVE FILES TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-emerald-600" />
              Spreadsheet Asesmen di Google Drive Anda
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              File yang tersinkronisasi otomatis dengan akun Google Workspace / Gmail Anda
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari file spreadsheet..."
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500 w-48 sm:w-60"
            />
            <button
              onClick={fetchDriveFiles}
              disabled={isLoadingDrive || !isConnected}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-40"
              title="Segarkan daftar file"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingDrive ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* DRIVE FILES LIST */}
        {!isConnected ? (
          <div className="p-12 text-center space-y-3">
            <FileSpreadsheet className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Akun Google Belum Terhubung
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Silakan login dengan Akun Google di bagian atas untuk mengakses dan mengelola spreadsheet Anda langsung dari aplikasi.
            </p>
          </div>
        ) : isLoadingDrive ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Menghubungi Google Drive API...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileSpreadsheet className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Belum Ada File Ditemukan
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Klik tombol "Buat Template di Google Drive" atau lakukan ekspor soal dari menu "Buat Soal AI".
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-6">Nama File Google Spreadsheet</th>
                  <th className="py-3 px-6 hidden sm:table-cell">Terakhir Diubah</th>
                  <th className="py-3 px-6 text-right">Aksi Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredFiles.map((file) => (
                  <tr
                    key={file.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <td className="py-3.5 px-6 font-semibold flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <span className="truncate max-w-md">{file.name}</span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 hidden sm:table-cell">
                      {new Date(file.modifiedTime).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 font-bold text-xs transition"
                          title="Buka Spreadsheet di Tab Baru"
                        >
                          <span>Buka</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => setFileToDelete({ id: file.id, name: file.name })}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                          title="Hapus dari Google Drive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CONFIRMATION DIALOG FOR DELETION (EXPLICIT USER CONFIRMATION REQUIRED) */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/60">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Konfirmasi Hapus Spreadsheet
                </h3>
                <p className="text-xs text-slate-500">Pemberitahuan Google Drive</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus file <strong>"{fileToDelete.name}"</strong> dari Google Drive Anda? Tindakan ini permanen.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteFile}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Permanen</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
