import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileUp,
  Link as LinkIcon,
  HelpCircle,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useGoogleAuth } from '../../context/GoogleAuthContext';
import { useApp } from '../../context/AppContext';
import { GoogleSignInButton } from './GoogleSignInButton';
import { deleteSpreadsheetFile } from '../../services/googleSheets';

interface GoogleSheetsModalProps {
  onImportQuestions?: (questions: any[]) => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({ onImportQuestions }) => {
  const {
    user,
    isConnected,
    isSheetsModalOpen,
    setIsSheetsModalOpen,
    signIn,
    signOut,
    driveFiles,
    fetchDriveFiles,
    isLoadingDrive,
    importExamFromSheets,
    accessToken,
    lastExportedUrl,
  } = useGoogleAuth();

  const { showToast, setCurrentView } = useApp();

  const [activeTab, setActiveTab] = useState<'drive' | 'import_url' | 'guide'>('drive');
  const [manualUrl, setManualUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isSheetsModalOpen && isConnected) {
      fetchDriveFiles();
    }
  }, [isSheetsModalOpen, isConnected]);

  if (!isSheetsModalOpen) return null;

  // Extract Spreadsheet ID from standard URL or direct ID
  const extractSpreadsheetId = (urlOrId: string): string => {
    const trimmed = urlOrId.trim();
    const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) return match[1];
    return trimmed;
  };

  const handleManualImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;

    const id = extractSpreadsheetId(manualUrl);
    if (!id) {
      showToast('URL atau ID Google Spreadsheet tidak valid', 'error');
      return;
    }

    try {
      setIsImporting(true);
      const imported = await importExamFromSheets(id);
      if (imported && imported.length > 0) {
        showToast(`Berhasil mengimpor ${imported.length} butir soal dari Google Sheets!`, 'success');
        if (onImportQuestions) {
          onImportQuestions(imported);
        }
        setIsSheetsModalOpen(false);
        setCurrentView('buat-soal');
      } else {
        showToast('Tidak ada data soal yang ditemukan pada spreadsheet tersebut.', 'warning');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengimpor dari Google Sheets', 'error');
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportFromFile = async (fileId: string, fileName: string) => {
    try {
      setIsImporting(true);
      const imported = await importExamFromSheets(fileId);
      if (imported && imported.length > 0) {
        showToast(`Berhasil mengimpor ${imported.length} soal dari "${fileName}"!`, 'success');
        if (onImportQuestions) {
          onImportQuestions(imported);
        }
        setIsSheetsModalOpen(false);
        setCurrentView('buat-soal');
      } else {
        showToast('Tidak ada data soal yang sesuai format pada spreadsheet tersebut.', 'warning');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal membaca isi spreadsheet.', 'error');
    } finally {
      setIsImporting(false);
    }
  };

  const confirmDeleteFile = async () => {
    if (!fileToDelete || !accessToken) return;

    try {
      setIsDeleting(true);
      await deleteSpreadsheetFile(accessToken, fileToDelete.id);
      showToast(`Spreadsheet "${fileToDelete.name}" berhasil dihapus dari Google Drive.`, 'success');
      setFileToDelete(null);
      await fetchDriveFiles();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus file dari Google Drive.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                Google Sheets & Drive Integrasi
                <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                  Resmi
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ekspor naskah soal, kisi-kisi asesmen & rekap nilai ke Google Spreadsheet
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSheetsModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* 1. GOOGLE ACCOUNT STATUS / LOGIN BANNER */}
          {!isConnected ? (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800/50 text-center space-y-4">
              <div className="inline-flex p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-emerald-100 dark:border-emerald-900/40">
                <FileSpreadsheet className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
                  Hubungkan ke Akun Google Anda
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  Sinkronkan asesmen Kurikulum Merdeka langsung ke Google Drive. Hasil generator soal dapat dibuka, diedit bersama, dan dicetak dari Google Sheets.
                </p>
              </div>

              <div className="pt-1 flex justify-center">
                <GoogleSignInButton
                  onClick={async () => {
                    try {
                      await signIn();
                      showToast('Berhasil terhubung dengan Google Sheets & Drive!', 'success');
                    } catch (e: any) {
                      showToast(e.message || 'Gagal masuk dengan Google', 'error');
                    }
                  }}
                  text="Sign in with Google"
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-emerald-100 dark:border-emerald-900/40">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Otomatis 3 Tab (Soal, Kisi-Kisi, Nilai)
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tersimpan aman di Drive pribadi
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Rumus nilai otomatis
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google User'}
                    className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                    {user?.displayName ? user.displayName.charAt(0) : 'G'}
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <span>{user?.displayName || 'Pengguna Google'}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Aktif
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {user?.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    showToast('Akun Google berhasil diputuskan.', 'info');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900 transition"
                  title="Keluar dari Akun Google"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Putuskan</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. RECENT EXPORT LINK IF AVAILABLE */}
          {lastExportedUrl && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-emerald-800 dark:text-emerald-200">
                    Spreadsheet terakhir berhasil dibuat!
                  </span>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    File telah tersimpan di Google Drive Anda.
                  </p>
                </div>
              </div>
              <a
                href={lastExportedUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
              >
                <span>Buka di Google Sheets</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* 3. TABS NAVIGATION */}
          <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab('drive')}
              className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition ${
                activeTab === 'drive'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Spreadsheet di Google Drive ({driveFiles.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('import_url')}
              className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition ${
                activeTab === 'import_url'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>Impor dari Link Spreadsheet</span>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition ${
                activeTab === 'guide'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Struktur 3 Tab Asesmen</span>
            </button>
          </div>

          {/* TAB CONTENT: DRIVE SPREADSHEETS */}
          {activeTab === 'drive' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Daftar Spreadsheet Asesmen & Soal di Drive
                </span>
                <button
                  onClick={fetchDriveFiles}
                  disabled={isLoadingDrive || !isConnected}
                  className="flex items-center gap-1 text-slate-500 hover:text-emerald-600 transition disabled:opacity-40"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDrive ? 'animate-spin' : ''}`} />
                  <span>Segarkan</span>
                </button>
              </div>

              {!isConnected ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Silakan masuk dengan Akun Google di atas untuk melihat spreadsheet di Google Drive Anda.
                </div>
              ) : isLoadingDrive ? (
                <div className="py-8 text-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
                  <p className="text-xs text-slate-500">Memuat spreadsheet dari Google Drive...</p>
                </div>
              ) : driveFiles.length === 0 ? (
                <div className="py-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-6 space-y-2">
                  <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Belum ada spreadsheet terdeteksi di Google Drive Anda
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    Buat soal baru di menu "Buat Soal AI", lalu klik tombol "Export ke Google Sheets" untuk menyimpan otomatis.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  {driveFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center shrink-0">
                          <FileSpreadsheet className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Diubah: {new Date(file.modifiedTime).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
                          title="Buka di Google Sheets"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => handleImportFromFile(file.id, file.name)}
                          disabled={isImporting}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 transition disabled:opacity-50"
                          title="Impor soal dari file ini ke Bank Soal"
                        >
                          <FileUp className="w-3.5 h-3.5" />
                          <span>Impor</span>
                        </button>

                        <button
                          onClick={() => setFileToDelete({ id: file.id, name: file.name })}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                          title="Hapus Spreadsheet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: IMPORT VIA URL */}
          {activeTab === 'import_url' && (
            <form onSubmit={handleManualImport} className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tempel URL Google Spreadsheet:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualUrl}
                    onChange={(e) => setManualUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/1a2b3c4d.../edit"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={isImporting || !manualUrl.trim()}
                    className="px-4 py-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isImporting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Membaca...</span>
                      </>
                    ) : (
                      <>
                        <FileUp className="w-3.5 h-3.5" />
                        <span>Impor Soal</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Pastikan akun Google Anda memiliki hak akses melihat/mengedit spreadsheet tersebut.
                </p>
              </div>
            </form>
          )}

          {/* TAB CONTENT: GUIDE & COLUMN SPECIFICATION */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2 text-slate-700 dark:text-slate-300">
                <h4 className="font-bold text-[#00529C] dark:text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Format Standar 3 Lembar Kerja Asesmen:
                </h4>
                <ol className="list-decimal pl-5 space-y-1 text-[11.5px] leading-relaxed">
                  <li>
                    <strong>Lembar 1 (Butir Soal & Kunci):</strong> Memuat Nomor, Bentuk Soal, Level Bloom (C1-C6), Indikator TP, Pola Karakter, Stimulus Teks/Tabel, Pertanyaan, Opsi A/B/C/D, Kunci Jawaban, Pembahasan/Rubrik, dan Skor.
                  </li>
                  <li>
                    <strong>Lembar 2 (Kisi-Kisi Asesmen):</strong> Pemetaan kompetensi Capaian Pembelajaran, Alur Tujuan Pembelajaran (ATP), dan distribusi tingkat kognitif.
                  </li>
                  <li>
                    <strong>Lembar 3 (Format Rekap Nilai Siswa):</strong> Kolom NISN, Nama Siswa, Skor PG, Skor Uraian, Total Nilai dengan formula penjumlahan otomatis (`=SUM(...)`), serta Kriteria Ketercapaian Tujuan Pembelajaran (`=IF(...)`).
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-800/20">
          <button
            type="button"
            onClick={() => setIsSheetsModalOpen(false)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* CONFIRMATION DIALOG FOR DELETING SPREADSHEET (MANDATORY REQUIREMENT) */}
      {fileToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/60">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Konfirmasi Hapus Spreadsheet
                </h3>
                <p className="text-xs text-slate-500">Aksi ini akan menghapus file dari Google Drive.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus spreadsheet <strong>"{fileToDelete.name}"</strong> dari Google Drive Anda? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setFileToDelete(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteFile}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus File</span>
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
