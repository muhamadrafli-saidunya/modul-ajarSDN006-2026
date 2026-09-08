import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const DeleteConfirmModal: React.FC = () => {
  const { isDeleteConfirmOpen, setIsDeleteConfirmOpen, moduleToDelete, setModuleToDelete, deleteModule } = useApp();

  if (!isDeleteConfirmOpen || !moduleToDelete) return null;

  const handleConfirm = () => {
    deleteModule(moduleToDelete.id);
    setIsDeleteConfirmOpen(false);
    setModuleToDelete(null);
  };

  const handleClose = () => {
    setIsDeleteConfirmOpen(false);
    setModuleToDelete(null);
  };

  return (
    <div
      id="delete-confirm-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity"
    >
      <div
        id="delete-confirm-modal"
        className="relative w-full max-w-md p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200"
      >
        <button
          id="btn-close-delete-modal"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          aria-label="Tutup dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Hapus Perangkat Ajar?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>

        <div className="p-3 mb-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/50">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
            {moduleToDelete.title}
          </p>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span>{moduleToDelete.code}</span>
            <span>•</span>
            <span>{moduleToDelete.subject} - Kelas {moduleToDelete.grade}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            id="btn-cancel-delete"
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            Batal
          </button>
          <button
            id="btn-confirm-delete"
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-md transition"
          >
            <Trash2 className="w-4 h-4" />
            Ya, Hapus Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};
