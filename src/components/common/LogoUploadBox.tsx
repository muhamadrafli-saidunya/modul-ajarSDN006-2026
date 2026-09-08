import React, { useRef, useState } from 'react';
import { Upload, X, RotateCcw, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

interface LogoUploadBoxProps {
  id: string;
  label: string;
  sublabel: string;
  logoUrl: string;
  logoSize: number;
  onLogoChange: (url: string) => void;
  onSizeChange: (size: number) => void;
  onResetDefault: () => void;
  defaultLabel?: string;
}

export const LogoUploadBox: React.FC<LogoUploadBoxProps> = ({
  id,
  label,
  sublabel,
  logoUrl,
  logoSize,
  onLogoChange,
  onSizeChange,
  onResetDefault,
  defaultLabel = 'Gunakan Bawaan',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Hanya berkas gambar (PNG, JPG, SVG, WebP) yang diperbolehkan.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran gambar maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        onLogoChange(result);
      }
    };
    reader.onerror = () => {
      setUploadError('Gagal membaca berkas gambar.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {label}
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {sublabel}
          </p>
        </div>
        {logoUrl && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Aktif
          </span>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        id={id}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Zone & Preview */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Preview box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative group cursor-pointer w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-2 text-center transition-all shrink-0 ${
            isDragging
              ? 'border-[#00529C] bg-blue-50 dark:bg-blue-950/40'
              : logoUrl
              ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-[#00529C]'
              : 'border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900 hover:border-slate-400'
          }`}
          title="Klik atau seret gambar ke sini untuk mengganti logo"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={label}
              className="max-h-full max-w-full object-contain filter drop-shadow-xs"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400">
              <Upload className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold">Pilih Logo</span>
            </div>
          )}

          {/* Hover overlay hint */}
          <div className="absolute inset-0 bg-slate-900/60 text-white rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-[10px] font-bold p-1">
            <Upload className="w-4 h-4 mb-0.5" />
            <span>Ganti Logo</span>
          </div>
        </div>

        {/* Action Controls & Slider */}
        <div className="flex-1 min-w-0 w-full space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#00529C] text-slate-700 dark:text-slate-200 shadow-xs transition"
            >
              <Upload className="w-3.5 h-3.5 text-[#00529C]" />
              <span>Unggah Gambar</span>
            </button>

            <button
              type="button"
              onClick={onResetDefault}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
              title="Kembalikan ke logo standar"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{defaultLabel}</span>
            </button>

            {logoUrl && (
              <button
                type="button"
                onClick={() => onLogoChange('')}
                className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                title="Hapus logo"
              >
                <X className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-400">
            Format: PNG, JPG, SVG, WebP (Maks. 5MB). Mendukung seret & lepas (drag and drop).
          </p>

          {/* Size slider */}
          {logoUrl && (
            <div className="pt-1 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                <span>Ukuran Cetak Logo:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {logoSize}px
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={110}
                step={2}
                value={logoSize}
                onChange={(e) => onSizeChange(Number(e.target.value))}
                className="w-full accent-[#00529C] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          )}

          {uploadError && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
              {uploadError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
