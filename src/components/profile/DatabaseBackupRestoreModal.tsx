import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  X,
  FileJson,
  Copy,
  Clock,
  Trash2,
  School,
  User,
  ShieldCheck,
  FileText,
  Save,
  Check,
  HelpCircle,
  HardDrive
} from 'lucide-react';
import { SettingsBackupPayload } from '../../types';

export const DatabaseBackupRestoreModal: React.FC = () => {
  const {
    isBackupModalOpen,
    setIsBackupModalOpen,
    exportSettingsBackup,
    restoreSettingsBackup,
    snapshots,
    saveSnapshot,
    deleteSnapshot,
    restoreSnapshot,
    resetToDefaultData,
    showToast,
    userProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'backup' | 'restore' | 'snapshots'>('backup');
  const [includeModulesInExport, setIncludeModulesInExport] = useState(false);
  const [snapshotName, setSnapshotName] = useState('');
  const [copied, setCopied] = useState(false);

  // Restore State
  const [importedData, setImportedData] = useState<SettingsBackupPayload | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const [manualJsonText, setManualJsonText] = useState('');
  const [showManualJson, setShowManualJson] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isBackupModalOpen) return null;

  const handleDownloadBackup = () => {
    const backupData = exportSettingsBackup(includeModulesInExport);
    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const safeSchoolName = (userProfile.school || 'sekolah')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .substring(0, 25);
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `cadangan_pengaturan_${safeSchoolName}_${dateStr}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Berkas cadangan "${filename}" berhasil diunduh!`, 'success');
  };

  const handleCopyJson = () => {
    const backupData = exportSettingsBackup(includeModulesInExport);
    const jsonString = JSON.stringify(backupData, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      showToast('Data cadangan JSON disalin ke clipboard!', 'info');
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = snapshotName.trim() || `Cadangan ${userProfile.school || 'SD'} - ${new Date().toLocaleDateString('id-ID')}`;
    saveSnapshot(finalName, includeModulesInExport ? 'full_database' : 'settings_only');
    setSnapshotName('');
    setActiveTab('snapshots');
  };

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processBackupFile(file);
  };

  const processBackupFile = (file: File) => {
    setImportError(null);
    setRestoreSuccess(false);

    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setImportError('Silakan pilih berkas cadangan dengan ekstensi .json');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        // Validation check
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Format isi berkas tidak sesuai.');
        }

        if (!parsed.userProfile && !parsed.kopConfig) {
          throw new Error('Berkas cadangan tidak memiliki struktur data profil atau KOP surat sekolah.');
        }

        setImportedData(parsed);
      } catch (err: any) {
        setImportError(`Gagal membaca berkas: ${err?.message || 'Format JSON tidak valid'}`);
        setImportedData(null);
      }
    };
    reader.onerror = () => {
      setImportError('Terjadi kesalahan saat membaca berkas.');
    };
    reader.readAsText(file);
  };

  const handleParseManualJson = () => {
    setImportError(null);
    if (!manualJsonText.trim()) {
      setImportError('Tempelkan teks JSON cadangan terlebih dahulu.');
      return;
    }

    try {
      const parsed = JSON.parse(manualJsonText.trim());
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Format JSON tidak valid.');
      }
      setImportedData(parsed);
      setShowManualJson(false);
    } catch (err: any) {
      setImportError(`Gagal mengurai teks JSON: ${err?.message || 'Format salah'}`);
    }
  };

  const handleExecuteRestore = () => {
    if (!importedData) return;
    const res = restoreSettingsBackup(importedData);
    if (res.success) {
      setRestoreSuccess(true);
      setTimeout(() => {
        setImportedData(null);
        setIsBackupModalOpen(false);
      }, 2500);
    }
  };

  return (
    <div
      id="database-backup-restore-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsBackupModalOpen(false);
      }}
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#00529C] to-[#002D62] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-orange-400 shadow-inner">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  Simpan & Restore Database Pengaturan
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-orange-500 text-white">
                  JSON Backup
                </span>
              </div>
              <p className="text-xs text-blue-100/90 mt-0.5">
                Cadangkan seluruh profil sekolah, logo KOP, dan identitas pengesahan atau pulihkan data kapan saja.
              </p>
            </div>
          </div>

          <button
            id="btn-close-backup-modal"
            type="button"
            onClick={() => setIsBackupModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            aria-label="Tutup Dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'backup'
                ? 'border-[#00529C] text-[#00529C] dark:text-blue-400 dark:border-blue-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Simpan / Ekspor Cadangan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('restore')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'restore'
                ? 'border-[#00529C] text-[#00529C] dark:text-blue-400 dark:border-blue-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Restore / Pulihkan Data</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('snapshots')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'snapshots'
                ? 'border-[#00529C] text-[#00529C] dark:text-blue-400 dark:border-blue-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Snapshot Browser ({snapshots.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BACKUP / SIMPAN */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              {/* Opsi Ekspor */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <FileJson className="w-5 h-5 text-[#00529C] dark:text-blue-400" />
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      1. Ekspor Berkas Cadangan (.JSON)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Simpan file cadangan ke komputer atau laptop Anda untuk dipindahkan ke perangkat lain.
                    </p>
                  </div>
                </div>

                {/* Pilih Cakupan */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Cakupan Cadangan:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIncludeModulesInExport(false)}
                      className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        !includeModulesInExport
                          ? 'border-[#00529C] bg-blue-50/70 dark:bg-blue-950/30 text-slate-900 dark:text-white ring-2 ring-[#00529C]/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                        !includeModulesInExport ? 'border-[#00529C] bg-[#00529C]' : 'border-slate-400'
                      }`}>
                        {!includeModulesInExport && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="text-xs font-black">Database Pengaturan & KOP Saja</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Profil Sekolah, Guru, Kepala Sekolah, Naskah Dinas, dan Logo Kiri & Kanan (Ukuran ringan ~50KB).
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIncludeModulesInExport(true)}
                      className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        includeModulesInExport
                          ? 'border-[#00529C] bg-blue-50/70 dark:bg-blue-950/30 text-slate-900 dark:text-white ring-2 ring-[#00529C]/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                        includeModulesInExport ? 'border-[#00529C] bg-[#00529C]' : 'border-slate-400'
                      }`}>
                        {includeModulesInExport && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="text-xs font-black">Cadangan Lengkap (Full Database)</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Semua Pengaturan Profil + Seluruh Bank Modul Pembelajaran / RPP yang telah dibuat.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Ringkasan Data yang Akan Diekspor */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Satuan Pendidikan:</span>
                    <strong className="text-slate-900 dark:text-white">{userProfile.school || 'Belum diatur'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>NPSN / Wilayah:</span>
                    <strong className="text-slate-900 dark:text-white">{userProfile.npsn || '-'} ({userProfile.city || '-'})</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Pejabat Mengetahui:</span>
                    <strong className="text-slate-900 dark:text-white">{userProfile.headmasterName || 'Kepala Sekolah'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Status Logo KOP:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {userProfile.kopConfig?.leftLogoUrl && userProfile.kopConfig?.rightLogoUrl
                        ? '✓ Logo Kiri & Logo Kanan Siap'
                        : '✓ Logo Bawaan Siap'}
                    </span>
                  </div>
                </div>

                {/* Tombol Aksi Ekspor */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadBackup}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#00529C] hover:bg-blue-800 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Berkas JSON (.json)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-600">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin JSON</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Snapshot Cepat ke Browser */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <HardDrive className="w-5 h-5 text-[#FF7300]" />
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      2. Simpan Snapshot Cepat di Browser
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Simpan cadangan langsung ke memori peramban tanpa perlu mengunduh berkas.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleCreateSnapshot} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={snapshotName}
                    onChange={(e) => setSnapshotName(e.target.value)}
                    placeholder="Contoh: Pengaturan Awal Semester Ganjil 2024"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Snapshot</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: RESTORE / PULIHKAN */}
          {activeTab === 'restore' && (
            <div className="space-y-6">
              {/* Alert Peringatan Restore */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-amber-900 dark:text-amber-200 text-xs">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="block font-bold mb-0.5">Perhatian Pemulihan Data:</strong>
                  Memulihkan database cadangan akan memperbarui nama sekolah, data guru, kepala sekolah, dan konfigurasi logo KOP yang sedang aktif. Data yang dipulihkan akan langsung otomatis disimpan permanen.
                </div>
              </div>

              {/* Area Upload File */}
              {!importedData ? (
                <div className="space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#00529C] dark:hover:border-blue-500 rounded-3xl bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center text-center cursor-pointer transition group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-[#00529C] dark:text-blue-300 flex items-center justify-center group-hover:scale-110 transition shadow-xs mb-3">
                      <Upload className="w-7 h-7" />
                    </div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white">
                      Pilih atau Seret Berkas Cadangan (.JSON)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                      Pilih berkas cadangan yang sebelumnya diunduh melalui tombol "Unduh Berkas JSON".
                    </p>
                    <button
                      type="button"
                      className="mt-4 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-200 group-hover:bg-slate-100 dark:group-hover:bg-slate-700 shadow-xs transition"
                    >
                      Jelajahi Berkas Komputer
                    </button>
                  </div>

                  {importError && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
                      <X className="w-4 h-4 shrink-0" />
                      <span>{importError}</span>
                    </div>
                  )}

                  {/* Manual Paste JSON Option */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowManualJson(!showManualJson)}
                      className="text-xs font-bold text-[#00529C] dark:text-blue-400 hover:underline flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Atau tempelkan kode teks JSON secara manual</span>
                    </button>

                    {showManualJson && (
                      <div className="mt-3 space-y-3">
                        <textarea
                          rows={6}
                          value={manualJsonText}
                          onChange={(e) => setManualJsonText(e.target.value)}
                          placeholder="Tempelkan isi teks file JSON cadangan Anda di sini..."
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={handleParseManualJson}
                          className="px-4 py-2 rounded-xl bg-[#00529C] text-white font-bold text-xs shadow-md"
                        >
                          Verifikasi Kode JSON
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Pratinjau Berkas Sebelum Dipulihkan */
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-[#00529C] dark:border-blue-500 shadow-lg space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white">
                        Berkas Cadangan Terverifikasi
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#00529C]">
                      Versi {importedData.version || '2.4.0'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
                        <School className="w-3.5 h-3.5 text-[#00529C]" />
                        Satuan Pendidikan:
                      </span>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {importedData.userProfile?.school || importedData.metadata?.schoolName || '-'}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        NPSN: {importedData.userProfile?.npsn || importedData.metadata?.npsn || '-'} • Kota: {importedData.userProfile?.city || '-'}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#FF7300]" />
                        Pejabat Pengesahan:
                      </span>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {importedData.userProfile?.headmasterName || importedData.kopConfig?.headmasterName || '-'}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Guru: {importedData.userProfile?.name || importedData.kopConfig?.teacherName || '-'}
                      </p>
                    </div>
                  </div>

                  {/* KOP & Logos verification */}
                  <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Konfigurasi Logo KOP Surat:</span>
                      <span className="font-bold text-emerald-600">
                        {importedData.kopConfig?.leftLogoUrl || importedData.userProfile?.kopConfig?.leftLogoUrl
                          ? '✓ Logo Kiri & Kanan Tersedia'
                          : '✓ Menggunakan Format Baku'}
                      </span>
                    </div>
                    {importedData.modules && (
                      <div className="flex items-center justify-between pt-1 border-t border-blue-100 dark:border-blue-900/40">
                        <span className="text-slate-600 dark:text-slate-300">Bank Modul Pembelajaran:</span>
                        <span className="font-bold text-[#00529C] dark:text-blue-300">
                          {importedData.modules.length} Perangkat Ajar Siap Dipulihkan
                        </span>
                      </div>
                    )}
                  </div>

                  {restoreSuccess ? (
                    <div className="p-4 bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-900 dark:text-emerald-100 text-center font-bold text-sm flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Database Pengaturan Berhasil Dipulihkan! Menutup dialog...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleExecuteRestore}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg active:scale-95 transition"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Pulihkan Pengaturan Sekarang</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setImportedData(null);
                          setImportError(null);
                        }}
                        className="px-4 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                      >
                        Batal
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SNAPSHOT BROWSER */}
          {activeTab === 'snapshots' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Daftar Snapshot Pengaturan di Browser
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pulihkan seketika dengan satu klik tanpa perlu mencari file cadangan.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const name = prompt('Masukkan nama snapshot cadangan baru:');
                    if (name) saveSnapshot(name);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#00529C] hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Buat Snapshot Baru</span>
                </button>
              </div>

              {snapshots.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-2">
                  <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Belum ada snapshot pengaturan yang disimpan
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Gunakan tab "Simpan / Ekspor Cadangan" untuk membuat snapshot cepat pertama Anda.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {snapshots.map((snap) => (
                    <div
                      key={snap.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs hover:border-blue-300 transition"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                            {snap.name}
                          </p>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {snap.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {snap.data.userProfile?.school || 'Sekolah'} • {snap.data.userProfile?.headmasterName || 'Kepala Sekolah'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Pulihkan pengaturan dari snapshot "${snap.name}"?`)) {
                              restoreSnapshot(snap.id);
                              setIsBackupModalOpen(false);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Terapkan</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteSnapshot(snap.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                          title="Hapus Snapshot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reset to Factory Defaults Option */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Kembalikan ke Pengaturan Standar Pabrik
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Mereset data sekolah dan modul ke contoh kurikulum awal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Apakah Anda yakin ingin mengembalikan seluruh data ke standar kurikulum bawaan pabrik?')) {
                      resetToDefaultData();
                      setIsBackupModalOpen(false);
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-red-300 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-bold text-xs transition"
                >
                  Reset Standar Pabrik
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Format Backup Standar: JSON UTF-8 (Kompatibel antar Komputer)</span>
          </div>

          <button
            type="button"
            onClick={() => setIsBackupModalOpen(false)}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
