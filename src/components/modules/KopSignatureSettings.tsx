import React from 'react';
import { KopConfig } from '../../types';
import { LogoUploadBox } from '../common/LogoUploadBox';
import { DEFAULT_TUT_WURI_LOGO, DEFAULT_SCHOOL_LOGO } from '../../data/defaultLogos';
import {
  FileText,
  PenTool,
  CheckCircle2,
  Building,
  Calendar,
  User,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Eye,
  Info
} from 'lucide-react';

interface KopSignatureSettingsProps {
  config: KopConfig;
  onChange: (updated: Partial<KopConfig>) => void;
  onSaveDefault?: () => void;
  simplified?: boolean;
}

export const KopSignatureSettings: React.FC<KopSignatureSettingsProps> = ({
  config,
  onChange,
  onSaveDefault,
  simplified = true,
}) => {
  return (
    <div className="space-y-6">
      {/* SECTION 1: TOGGLE STATUS KOP & TANDA TANGAN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Toggle KOP */}
        <label
          htmlFor="toggle-kop-active"
          className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
            config.showKop
              ? 'bg-blue-50/70 dark:bg-blue-950/40 border-[#00529C] text-[#002D62] dark:text-blue-300'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                config.showKop
                  ? 'bg-[#00529C] text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
              }`}
            >
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider">KOP Surat Resmi</p>
              <p className="text-[11px] opacity-80">
                {config.showKop ? 'Aktif dicetak di bagian atas kertas' : 'Dinonaktifkan'}
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            id="toggle-kop-active"
            checked={config.showKop}
            onChange={(e) => onChange({ showKop: e.target.checked })}
            className="w-4 h-4 accent-[#00529C] rounded cursor-pointer"
          />
        </label>

        {/* Toggle Tanda Tangan */}
        <label
          htmlFor="toggle-signature-active"
          className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
            config.showSignature
              ? 'bg-blue-50/70 dark:bg-blue-950/40 border-[#00529C] text-[#002D62] dark:text-blue-300'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                config.showSignature
                  ? 'bg-[#00529C] text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
              }`}
            >
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider">Lembar Tanda Tangan</p>
              <p className="text-[11px] opacity-80">
                {config.showSignature ? 'Pengesahan Kepala Sekolah & Guru' : 'Dinonaktifkan'}
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            id="toggle-signature-active"
            checked={config.showSignature}
            onChange={(e) => onChange({ showSignature: e.target.checked })}
            className="w-4 h-4 accent-[#00529C] rounded cursor-pointer"
          />
        </label>
      </div>

      {/* SECTION 2: UPLOAD LOGO SEKOLAH (KIRI & KANAN) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#FF7300] text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Upload Logo KOP Surat (Kiri & Kanan)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Letakkan lambang resmi Kemendikbudristek/Pemda di kiri dan lambang sekolah di kanan
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onChange({
                leftLogoUrl: DEFAULT_TUT_WURI_LOGO,
                rightLogoUrl: DEFAULT_SCHOOL_LOGO,
                leftLogoSize: 72,
                rightLogoSize: 72,
              })
            }
            className="flex items-center gap-1 text-[11px] font-bold text-[#00529C] hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Dua Logo
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Logo Kiri */}
          <LogoUploadBox
            id="upload-left-logo"
            label="Logo Kiri (Dinas / Pemda / Kemendikbud)"
            sublabel="Umumnya Logo Tut Wuri Handayani atau Lambang Pemerintah Kota/Kabupaten"
            logoUrl={config.leftLogoUrl}
            logoSize={config.leftLogoSize}
            onLogoChange={(url) => onChange({ leftLogoUrl: url })}
            onSizeChange={(size) => onChange({ leftLogoSize: size })}
            onResetDefault={() => onChange({ leftLogoUrl: DEFAULT_TUT_WURI_LOGO })}
            defaultLabel="Tut Wuri Handayani"
          />

          {/* Logo Kanan */}
          <LogoUploadBox
            id="upload-right-logo"
            label="Logo Kanan (Sekolah Dasar / Yayasan)"
            sublabel="Lambang resmi Satuan Pendidikan, Madrasah, atau Yayasan Pengelola"
            logoUrl={config.rightLogoUrl}
            logoSize={config.rightLogoSize}
            onLogoChange={(url) => onChange({ rightLogoUrl: url })}
            onSizeChange={(size) => onChange({ rightLogoSize: size })}
            onResetDefault={() => onChange({ rightLogoUrl: DEFAULT_SCHOOL_LOGO })}
            defaultLabel="Emblem SD Bawaan"
          />
        </div>
      </div>

      {/* SECTION 3: EDIT TEKS KOP SURAT (HANYA BARIS KHUSUS DINAS) */}
      {config.showKop && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-6 h-6 rounded-lg bg-[#00529C] text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Teks Naskah Dinas KOP Surat
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Nama Sekolah, Alamat, dan NPSN otomatis diambil dari Profil Sekolah di atas
              </p>
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
            <Info className="w-4 h-4 text-[#00529C] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Bebas Pengulangan Isian:</strong> Nama Sekolah (<strong>{config.schoolName || 'SD'}</strong>), Alamat Lengkap, dan NPSN diambil langsung dari profil sekolah tanpa perlu diketik ulang. Anda cukup mengisi nama instansi dinas di bawah ini.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Baris 1: Pemerintah Daerah / Provinsi / Kota
              </label>
              <input
                type="text"
                value={config.governmentHeader}
                onChange={(e) => onChange({ governmentHeader: e.target.value })}
                placeholder="Contoh: PEMERINTAH PROVINSI DKI JAKARTA"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Baris 2: Dinas Pendidikan & Kebudayaan
              </label>
              <input
                type="text"
                value={config.departmentHeader}
                onChange={(e) => onChange({ departmentHeader: e.target.value })}
                placeholder="Contoh: DINAS PENDIDIKAN DAN KEBUDAYAAN"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: EDIT TANDA TANGAN & PENGESAHAN */}
      {config.showSignature && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-6 h-6 rounded-lg bg-[#002D62] text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Pengesahan & Tanggal Penetapan
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Nama Kepala Sekolah & Guru otomatis tersinkron dari identitas sekolah di atas
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tanggal Dokumen (Kosongkan untuk otomatis tanggal hari cetak)
              </label>
              <input
                type="text"
                value={config.signatureDate}
                onChange={(e) => onChange({ signatureDate: e.target.value })}
                placeholder="Contoh: 15 Juli 2024 atau biarkan otomatis hari ini"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sebutan Jabatan Kepala Sekolah
              </label>
              <input
                type="text"
                value={config.headmasterTitle}
                onChange={(e) => onChange({ headmasterTitle: e.target.value })}
                placeholder="Contoh: Kepala Sekolah / Plt. Kepala Sekolah"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: PRATINJAU LANGSUNG (LIVE PREVIEW) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#00529C]" />
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white">
              Pratinjau Nyata KOP & Lembar Tanda Tangan
            </h4>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300">
            Tampilan Dokumen Cetak
          </span>
        </div>

        {/* Paper Simulation */}
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm text-slate-900 dark:text-white">
          {config.showKop ? (
            <div className="pb-3 mb-4" style={{ borderBottom: '3px double #334155' }}>
              <div className="flex items-center justify-between gap-3">
                {/* Logo Kiri */}
                {config.leftLogoUrl ? (
                  <div
                    className="shrink-0 flex items-center justify-center"
                    style={{ width: `${Math.min(config.leftLogoSize, 60)}px` }}
                  >
                    <img
                      src={config.leftLogoUrl}
                      alt="Logo Kiri"
                      style={{
                        width: `${Math.min(config.leftLogoSize, 60)}px`,
                        maxHeight: `${Math.min(config.leftLogoSize, 60)}px`,
                      }}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-10 shrink-0" />
                )}

                {/* Teks KOP Tengah */}
                <div className="flex-1 text-center font-sans">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300 leading-tight">
                    {config.governmentHeader || 'PEMERINTAH DAERAH'}
                  </p>
                  <p className="text-[11px] uppercase font-bold tracking-wide text-slate-700 dark:text-slate-300 leading-tight">
                    {config.departmentHeader || 'DINAS PENDIDIKAN'}
                  </p>
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-tight text-slate-950 dark:text-white my-0.5">
                    {config.schoolName || 'SD NEGERI 01 MENTENG JAYA'}
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-600 dark:text-slate-400 leading-snug">
                    {config.schoolAddress || 'Alamat Sekolah Terpadu'}
                  </p>
                  <p className="text-[8px] sm:text-[9px] text-slate-500 dark:text-slate-400 leading-snug">
                    {config.schoolContact || 'Kontak & NPSN Sekolah'}
                  </p>
                </div>

                {/* Logo Kanan */}
                {config.rightLogoUrl ? (
                  <div
                    className="shrink-0 flex items-center justify-center"
                    style={{ width: `${Math.min(config.rightLogoSize, 60)}px` }}
                  >
                    <img
                      src={config.rightLogoUrl}
                      alt="Logo Kanan"
                      style={{
                        width: `${Math.min(config.rightLogoSize, 60)}px`,
                        maxHeight: `${Math.min(config.rightLogoSize, 60)}px`,
                      }}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-10 shrink-0" />
                )}
              </div>
            </div>
          ) : (
            <div className="p-3 text-center text-xs text-slate-400 italic border border-dashed rounded-lg mb-4">
              KOP Surat dinonaktifkan
            </div>
          )}

          {/* Dummy Module Body snippet */}
          <div className="py-2 text-center border-b border-dashed border-slate-200 dark:border-slate-800 text-[10px] text-slate-400">
            [... Isi Dokumen Perangkat Ajar / Modul Ajar ...]
          </div>

          {/* Signature Snippet */}
          {config.showSignature ? (
            <div className="pt-4 grid grid-cols-2 gap-4 text-center text-[10px] sm:text-xs font-sans">
              <div>
                <p className="text-slate-500">Mengetahui,</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {config.headmasterTitle || 'Kepala Sekolah'}
                </p>
                <div className="h-10 sm:h-12 flex items-center justify-center text-[9px] text-slate-400 italic">
                  (Tanda Tangan & Stempel)
                </div>
                <p className="font-black text-slate-900 dark:text-white underline">
                  {config.headmasterName || 'Nama Kepala Sekolah'}
                </p>
                <p className="text-slate-500 text-[9px]">
                  NIP. {config.headmasterNip || '-'}
                </p>
              </div>

              <div>
                <p className="text-slate-500">
                  {config.signaturePlace || 'Kota'}, {config.signatureDate || new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date())}
                </p>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {config.teacherTitle || 'Guru Kelas / Penyusun'}
                </p>
                <div className="h-10 sm:h-12 flex items-center justify-center text-[9px] text-slate-400 italic">
                  (Tanda Tangan Guru)
                </div>
                <p className="font-black text-slate-900 dark:text-white underline">
                  {config.teacherName || 'Nama Guru'}
                </p>
                <p className="text-slate-500 text-[9px]">
                  NIP. {config.teacherNip || '-'}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-2 text-center text-xs text-slate-400 italic border border-dashed rounded-lg mt-3">
              Lembar tanda tangan dinonaktifkan
            </div>
          )}
        </div>
      </div>

      {/* Save button if requested */}
      {onSaveDefault && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onSaveDefault}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00529C] hover:bg-[#003e75] text-white font-bold text-xs shadow-md transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simpan sebagai Pengaturan Utama</span>
          </button>
        </div>
      )}
    </div>
  );
};
