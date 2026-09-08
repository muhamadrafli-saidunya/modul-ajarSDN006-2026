import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Sun,
  Moon,
  Plus,
  Sparkles,
  Search,
  RotateCcw,
  ChevronRight,
  Database
} from 'lucide-react';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const {
    currentView,
    setCurrentView,
    darkMode,
    toggleDarkMode,
    setIsFormModalOpen,
    setEditingModule,
    userProfile,
    resetToDefaultData,
    setSearchQuery,
    setIsBackupModalOpen
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (setSearchQuery) {
      setSearchQuery(localSearch);
    }
    if (currentView !== 'modules') {
      setCurrentView('modules');
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return { title: 'Dashboard Ringkasan', subtitle: 'Monitoring & Analisis Kelengkapan Administrasi Guru' };
      case 'modules':
        return { title: 'Modul Ajar', subtitle: 'Katalog Modul Ajar, ATP, CP, LKPD, dan RPP Merdeka' };
      case 'generator':
        return { title: 'Generator Modul AI', subtitle: 'Penyusunan Perangkat Ajar Berbasis Kurikulum Terkini' };
      case 'curriculum':
        return { title: 'Kurikulum & ATP', subtitle: 'Rujukan Regulasi BSKAP Fase A (Kelas 1-2), B (3-4), C (5-6)' };
      case 'assessment':
        return { title: 'Bank Asesmen & Rubrik', subtitle: 'Evaluasi Diagnostik Awal, Formatif, dan Sumatif Akhir' };
      case 'protapromes':
        return { title: 'Prota & Promes', subtitle: 'Pemetaan Jam Pelajaran Efektif Berdasarkan Kalender Pendidikan' };
      case 'profile':
        return { title: 'Daftar Guru & Profil', subtitle: 'Informasi Resmi Pengesahan Administrasi Pengawas & Kepala Sekolah' };
      default:
        return { title: 'Dashboard Ringkasan', subtitle: 'Sistem Perangkat Ajar' };
    }
  };

  const pageInfo = getPageTitle();

  const handleCreateNew = () => {
    setEditingModule(null);
    setIsFormModalOpen(true);
  };

  return (
    <header
      id="app-topbar"
      className="h-16 shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 transition-colors"
    >
      {/* Left Side: Mobile Hamburger & Breadcrumbs from Theme */}
      <div className="flex items-center gap-3 sm:gap-4 text-slate-500 dark:text-slate-400">
        <button
          id="btn-sidebar-toggle"
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 -ml-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition"
          aria-label="Buka Menu Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm font-medium">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="hover:text-[#00529C] dark:hover:text-blue-400 transition"
          >
            Beranda
          </button>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-[#00529C] dark:text-blue-400 font-semibold truncate max-w-[180px] sm:max-w-none">
            {pageInfo.title}
          </span>
        </div>
      </div>

      {/* Right Side: Search bar, Quick Actions, Profile */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Search Bar matching Design Theme */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Cari modul..."
            className="bg-slate-100 dark:bg-slate-800 border-none rounded-full pl-9 pr-4 py-1.5 text-sm w-52 lg:w-64 focus:ring-2 focus:ring-[#00529C] dark:focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2 pointer-events-none" />
        </form>

        {/* Create New Module Button */}
        <button
          id="btn-topbar-create-module"
          type="button"
          onClick={handleCreateNew}
          className="bg-[#00529C] hover:bg-blue-800 text-white px-3.5 sm:px-5 py-2 rounded-lg font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 active:scale-95 transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Buat Modul Baru</span>
          <span className="sm:hidden">Buat</span>
        </button>

        {/* Quick Generator Button */}
        <button
          id="btn-quick-generator"
          onClick={() => setCurrentView('generator')}
          title="Generator Modul AI"
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Sparkles className="w-4 h-4 text-orange-500" />
        </button>

        {/* Database Backup & Restore Menu */}
        <button
          id="btn-topbar-database-backup"
          type="button"
          onClick={() => setIsBackupModalOpen(true)}
          title="Database Pengaturan: Simpan & Restore (Cadangan JSON & Snapshot)"
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#00529C] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
        >
          <Database className="w-4 h-4 text-[#FF7300]" />
          <span className="hidden xl:inline text-xs font-bold text-slate-700 dark:text-slate-200">Database</span>
        </button>

        {/* Reset Demo Data */}
        <button
          id="btn-reset-demo"
          onClick={resetToDefaultData}
          title="Kembalikan Data Contoh Kurikulum Bawaan"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Dark Mode Toggle */}
        <button
          id="btn-toggle-theme"
          onClick={toggleDarkMode}
          title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* User Profile matching Design Theme */}
        <div
          id="btn-topbar-profile"
          onClick={() => setCurrentView('profile')}
          className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800 cursor-pointer group select-none"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#00529C] dark:group-hover:text-blue-400 transition leading-tight truncate max-w-[130px]">
              {userProfile.name.split(',')[0]}
            </p>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider truncate max-w-[130px]">
              Admin Sekolah
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center font-bold text-xs text-[#00529C] dark:text-blue-300 shadow-xs group-hover:ring-2 group-hover:ring-[#00529C] transition">
            {userProfile.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};
