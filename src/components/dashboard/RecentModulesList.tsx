import React from 'react';
import { useApp } from '../../context/AppContext';
import { TeachingModule } from '../../types';
import {
  FileText,
  Eye,
  Edit,
  Printer,
  Copy,
  Trash2,
  Plus
} from 'lucide-react';

export const RecentModulesList: React.FC = () => {
  const {
    modules,
    setCurrentView,
    setSelectedModule,
    setIsDetailOpen,
    setEditingModule,
    setIsFormModalOpen,
    setPrintModule,
    setIsPrintPreviewOpen,
    duplicateModule,
    setModuleToDelete,
    setIsDeleteConfirmOpen,
    incrementDownload
  } = useApp();

  const recent = modules.slice(0, 5);

  const getStatusBadge = (status: TeachingModule['status']) => {
    switch (status) {
      case 'Diterbitkan':
      case 'Terverifikasi':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300';
      case 'Review':
      case 'Draft':
      default:
        return 'bg-orange-100 text-orange-700 dark:bg-orange-950/80 dark:text-orange-300';
    }
  };

  const handleView = (mod: TeachingModule) => {
    setSelectedModule(mod);
    setIsDetailOpen(true);
  };

  const handleEdit = (mod: TeachingModule) => {
    setEditingModule(mod);
    setIsFormModalOpen(true);
  };

  const handlePrint = (mod: TeachingModule) => {
    incrementDownload(mod.id);
    setPrintModule(mod);
    setIsPrintPreviewOpen(true);
  };

  const handleDelete = (mod: TeachingModule) => {
    setModuleToDelete(mod);
    setIsDeleteConfirmOpen(true);
  };

  const handleCreateNew = () => {
    setEditingModule(null);
    setIsFormModalOpen(true);
  };

  return (
    <section
      id="recent-modules-container"
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col"
    >
      {/* Table Header matching Design Theme */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-700 dark:text-slate-200">
            Modul Ajar Terbaru
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar modul pembelajaran aktif yang siap diajarkan di kelas
          </p>
        </div>
        <button
          id="btn-view-all-modules"
          onClick={() => setCurrentView('modules')}
          className="text-xs font-bold text-[#00529C] dark:text-blue-400 hover:underline uppercase tracking-tight"
        >
          Lihat Semua
        </button>
      </div>

      {/* Table matching Design Theme */}
      <div className="flex-1 overflow-x-auto p-2">
        <table className="w-full text-left">
          <thead className="text-xs text-slate-400 uppercase font-bold border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3">Mata Pelajaran</th>
              <th className="px-4 py-3">Kelas</th>
              <th className="px-4 py-3 hidden sm:table-cell">Kurikulum</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {recent.map(mod => (
              <tr
                key={mod.id}
                id={`recent-row-${mod.id}`}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-50 dark:border-slate-800/60 transition-colors"
              >
                {/* Mata Pelajaran & Title */}
                <td className="px-4 py-3.5">
                  <span
                    onClick={() => handleView(mod)}
                    className="font-bold text-slate-800 dark:text-white hover:text-[#00529C] dark:hover:text-blue-400 cursor-pointer block truncate max-w-xs"
                    title={mod.title}
                  >
                    {mod.title}
                  </span>
                  <span className="text-[11px] text-slate-400 block truncate">
                    {mod.subject} • {mod.code} • {mod.author}
                  </span>
                </td>

                {/* Kelas */}
                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                  {mod.grade === 1 ? 'I (Satu)' :
                   mod.grade === 2 ? 'II (Dua)' :
                   mod.grade === 3 ? 'III (Tiga)' :
                   mod.grade === 4 ? 'IV (Empat)' :
                   mod.grade === 5 ? 'V (Lima)' :
                   mod.grade === 6 ? 'VI (Enam)' : `Kelas ${mod.grade}`}
                </td>

                {/* Kurikulum */}
                <td className="px-4 py-3.5 hidden sm:table-cell text-slate-600 dark:text-slate-300">
                  {(mod as any).curriculum || (mod.tags?.some(t => t?.toLowerCase().includes('k13')) ? 'K13' : 'Merdeka')}
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${getStatusBadge(
                      mod.status
                    )}`}
                  >
                    {mod.status === 'Diterbitkan' || mod.status === 'Terverifikasi' ? 'AKTIF' : 'DRAFT'}
                  </span>
                </td>

                {/* Aksi */}
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleEdit(mod)}
                      className="text-[#00529C] dark:text-blue-400 font-bold hover:underline text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleView(mod)}
                      title="Lihat Rincian"
                      className="p-1 rounded text-slate-400 hover:text-[#00529C] transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handlePrint(mod)}
                      title="Cetak Format Resmi"
                      className="p-1 rounded text-slate-400 hover:text-orange-500 transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => duplicateModule(mod.id)}
                      title="Duplikasi"
                      className="p-1 rounded text-slate-400 hover:text-indigo-600 transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(mod)}
                      title="Hapus"
                      className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
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

      {/* Table Footer matching Design Theme */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl border-t border-slate-100 dark:border-slate-800 flex items-center justify-center">
        <button
          onClick={handleCreateNew}
          className="bg-[#00529C] hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md flex items-center gap-2 active:scale-95 transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Buat Modul Baru</span>
        </button>
      </div>
    </section>
  );
};
