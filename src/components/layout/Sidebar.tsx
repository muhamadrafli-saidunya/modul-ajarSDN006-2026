import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  Compass,
  FileCheck2,
  CalendarDays,
  UserCheck,
  GraduationCap,
  ChevronRight,
  School,
  ExternalLink,
  FileQuestion
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentView, setCurrentView, modules, userProfile } = useApp();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Utama',
      icon: LayoutDashboard,
      badge: null,
      description: 'Ringkasan & Metrik',
    },
    {
      id: 'modules',
      label: 'Bank Perangkat Ajar',
      icon: BookOpen,
      badge: modules.length.toString(),
      description: 'Modul, RPP, & LKPD',
    },
    {
      id: 'generator',
      label: 'Generator Modul AI',
      icon: Sparkles,
      badge: 'PRO',
      badgeColor: 'bg-[#FF7300] text-white',
      description: 'Susun Modul 1-Klik',
    },
    {
      id: 'buat-soal',
      label: 'Buat Soal AI',
      icon: FileQuestion,
      badge: 'BARU',
      badgeColor: 'bg-emerald-500 text-white',
      description: 'Naskah, Kisi-Kisi & Cetak',
    },
    {
      id: 'curriculum',
      label: 'Capaian & ATP SD',
      icon: Compass,
      badge: 'Merdeka',
      badgeColor: 'bg-blue-100 text-[#00529B] dark:bg-blue-950 dark:text-blue-300',
      description: 'Fase A, B, dan C',
    },
    {
      id: 'assessment',
      label: 'Bank Asesmen & Rubrik',
      icon: FileCheck2,
      badge: null,
      description: 'Diagnostik & Sumatif',
    },
    {
      id: 'prota-promes',
      label: 'Prota & Promes',
      icon: CalendarDays,
      badge: null,
      description: 'Kalender & Jam Efektif',
    },
    {
      id: 'profile',
      label: 'Profil Pendidik & SD',
      icon: UserCheck,
      badge: null,
      description: 'Data Sekolah & SK',
    },
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          id="sidebar-backdrop"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 bg-[#00529C] text-white flex flex-col shadow-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3 border-b border-blue-800/50">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-md shrink-0">
            M
          </div>
          <span className="font-bold text-lg leading-tight tracking-tight text-white">
            MODUL SD
            <br />
            <span className="text-[10px] uppercase font-light text-blue-200 tracking-wider">
              Sistem Perangkat Ajar
            </span>
          </span>
        </div>

        {/* User Quick Info Card in Sidebar */}
        <div className="px-4 py-2.5 mx-3 mt-3 rounded-lg bg-blue-900/40 border border-blue-800/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {userProfile.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate leading-tight">
                {userProfile.name}
              </p>
              <p className="text-[10px] text-blue-200 truncate">
                {userProfile.school}
              </p>
            </div>
          </div>
          <div className="mt-1.5 pt-1.5 border-t border-blue-800/40 flex items-center justify-between text-[10px] text-blue-100">
            <span>Kelas {userProfile.gradeAssigned} SD</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
              Sem. {userProfile.activeSemester} Aktif
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-150 ${
                  isActive
                    ? 'bg-white/10 text-white font-medium border-l-4 border-orange-400 shadow-xs'
                    : 'text-blue-100 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.badgeColor ||
                      (isActive
                        ? 'bg-orange-500 text-white'
                        : 'bg-white/20 text-blue-100')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Cloud Storage Widget from Theme */}
        <div className="p-4 m-3 bg-blue-900/50 rounded-xl border border-blue-800/50">
          <div className="flex justify-between items-center text-xs text-blue-200 mb-2">
            <span className="font-medium">Penyimpanan Cloud</span>
            <span className="text-[11px] font-bold text-orange-300">75%</span>
          </div>
          <div className="w-full bg-blue-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-orange-400 h-full w-3/4 rounded-full"></div>
          </div>
          <p className="text-[10px] mt-2 text-blue-300">75% terpakai (1.5 GB / 2 GB)</p>
        </div>
      </aside>
    </>
  );
};
