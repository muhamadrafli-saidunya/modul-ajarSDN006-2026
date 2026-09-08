import React from 'react';
import { useApp } from '../../context/AppContext';
import { KPICard } from './KPICard';
import { AnalyticsCharts } from './AnalyticsCharts';
import { RecentModulesList } from './RecentModulesList';
import { GradeDistributionCard } from './GradeDistributionCard';
import {
  BookOpen,
  CheckCircle2,
  Download,
  Award,
  Sparkles,
  Plus,
  Compass,
  FileCheck,
  GraduationCap,
  FileQuestion
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    modules,
    userProfile,
    setCurrentView,
    setIsFormModalOpen,
    setEditingModule
  } = useApp();

  const totalModules = modules.length;
  const publishedModules = modules.filter(
    m => m.status === 'Diterbitkan' || m.status === 'Terverifikasi'
  ).length;
  const totalDownloads = modules.reduce((acc, m) => acc + (m.downloadsCount || 0), 0);
  const averageRating = (
    modules.reduce((acc, m) => acc + (m.rating || 5), 0) / (modules.length || 1)
  ).toFixed(1);

  const handleCreateModule = () => {
    setEditingModule(null);
    setIsFormModalOpen(true);
  };

  return (
    <div id="dashboard-view-content" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Metric Grid matching Theme: grid grid-cols-4 gap-6 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          id="kpi-total-modules"
          title="Total Modul"
          value={totalModules}
          change="+12%"
          isPositive={true}
          subtitle="Modul, ATP & CP"
          icon={BookOpen}
          badgeText="Lengkap"
          accentColor="blue"
        />

        <KPICard
          id="kpi-published-modules"
          title="Modul Aktif"
          value={publishedModules}
          change="+5%"
          isPositive={true}
          subtitle="Siap ajar di kelas"
          icon={CheckCircle2}
          badgeText="Tervalidasi"
          accentColor="emerald"
        />

        <KPICard
          id="kpi-total-downloads"
          title="Total Pemanfaatan"
          value={`${totalDownloads}x`}
          change="+18%"
          isPositive={true}
          subtitle="Unduh & cetak guru"
          icon={Download}
          badgeText="Populer"
          accentColor="orange"
        />

        <KPICard
          id="kpi-rating-eval"
          title="Indeks Kualitas"
          value={`${averageRating}`}
          change="Sangat Baik"
          isPositive={true}
          subtitle="Standar BSKAP"
          icon={Award}
          badgeText="Akreditasi A"
          accentColor="purple"
        />
      </div>

      {/* 2. Content Grid matching Theme: col-span-2 (Modul Ajar Terbaru) + col-span-1 (Distribusi Jenjang Kelas) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <RecentModulesList />
        </div>
        <div className="lg:col-span-1">
          <GradeDistributionCard />
        </div>
      </div>

      {/* 3. School Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#002D62] via-[#004B99] to-[#00529C] text-white p-6 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-100 mb-2">
              <GraduationCap className="w-4 h-4 text-[#FF7300]" />
              <span>Sistem Perangkat Ajar Kurikulum Merdeka</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {userProfile.school}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Semester {userProfile.activeSemester} TA {userProfile.academicYear}.
              Semua modul disusun sesuai standar Capaian Pembelajaran BSKAP Kemendikbudristek.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="btn-banner-generator"
              onClick={() => setCurrentView('generator')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold backdrop-blur-md border border-white/20 transition active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#FF7300]" />
              <span>Generator AI</span>
            </button>

            <button
              id="btn-banner-quiz"
              onClick={() => setCurrentView('buat-soal')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/80 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow-md transition active:scale-95"
            >
              <FileQuestion className="w-4 h-4 text-emerald-100" />
              <span>Buat Soal AI</span>
            </button>

            <button
              id="btn-banner-create"
              onClick={handleCreateModule}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#FF7300] hover:bg-orange-600 text-white text-xs sm:text-sm font-extrabold shadow-md transition active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Buat Perangkat</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Fast Navigation Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => setCurrentView('modules')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#00529C] dark:hover:border-blue-500 hover:shadow-md transition text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#00529C] dark:text-blue-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">Katalog Modul</p>
          <p className="text-[11px] text-slate-400">Filter kelas & mapel</p>
        </button>

        <button
          onClick={() => setCurrentView('generator')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#FF7300] dark:hover:border-orange-500 hover:shadow-md transition text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-[#FF7300] dark:text-orange-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">Generator Ajar</p>
          <p className="text-[11px] text-slate-400">Susun 3 langkah praktis</p>
        </button>

        <button
          onClick={() => setCurrentView('curriculum')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">Panduan CP & ATP</p>
          <p className="text-[11px] text-slate-400">Fase A, B, dan C SD</p>
        </button>

        <button
          onClick={() => setCurrentView('assessment')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <FileCheck className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">Bank Asesmen</p>
          <p className="text-[11px] text-slate-400">Formatif & sumatif</p>
        </button>
      </div>

      {/* 5. Visual Analytics & Charts Section */}
      <AnalyticsCharts />
    </div>
  );
};
