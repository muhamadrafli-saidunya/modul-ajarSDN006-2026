import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockMonthlyTrends } from '../../data/mockData';
import { BarChart3, TrendingUp, PieChart as PieIcon, CheckCircle2, Sparkles } from 'lucide-react';

export const AnalyticsCharts: React.FC = () => {
  const { modules } = useApp();
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [trendMetric, setTrendMetric] = useState<'both' | 'created' | 'downloaded'>('both');

  // Compute mapel counts
  const subjectCounts: Record<string, number> = {};
  modules.forEach(m => {
    subjectCounts[m.subject] = (subjectCounts[m.subject] || 0) + 1;
  });

  const subjectsList = [
    { name: 'IPAS', color: '#00529B' },
    { name: 'Matematika', color: '#FF7300' },
    { name: 'Bahasa Indonesia', color: '#0284C7' },
    { name: 'Pendidikan Pancasila', color: '#E11D48' },
    { name: 'PJOK', color: '#16A34A' },
    { name: 'Pendidikan Agama Islam', color: '#059669' },
    { name: 'Seni Rupa', color: '#9333EA' },
    { name: 'Bahasa Inggris', color: '#EA580C' },
  ];

  const maxSubjectCount = Math.max(...subjectsList.map(s => subjectCounts[s.name] || 0), 4);

  // Compute Fase counts
  const faseCounts = {
    'Fase A (Kls 1-2)': modules.filter(m => m.fase === 'Fase A').length,
    'Fase B (Kls 3-4)': modules.filter(m => m.fase === 'Fase B').length,
    'Fase C (Kls 5-6)': modules.filter(m => m.fase === 'Fase C').length,
  };
  const totalFaseCount = modules.length || 1;

  // Monthly trend calculations
  const maxTrend = Math.max(...mockMonthlyTrends.map(t => Math.max(t.created, t.downloaded / 10)), 50);

  // Kurikulum Merdeka 7 Components Checklist
  const hasType = (t: string) => modules.some(m => m.type.toLowerCase().includes(t.toLowerCase()));
  const componentsChecklist = [
    { label: 'Capaian Pembelajaran (CP)', done: hasType('Capaian'), target: 'Wajib' },
    { label: 'Alur Tujuan Pembelajaran (ATP)', done: hasType('Alur Tujuan'), target: 'Wajib' },
    { label: 'Modul Ajar / RPP+', done: hasType('Modul Ajar'), target: 'Wajib' },
    { label: 'Program Tahunan (Prota)', done: hasType('Program Tahunan'), target: 'Administrasi' },
    { label: 'Program Semester (Promes)', done: hasType('Program Semester'), target: 'Administrasi' },
    { label: 'Instrumen Asesmen & Rubrik', done: hasType('Asesmen'), target: 'Evaluasi' },
    { label: 'Bahan Ajar & LKPD Siswa', done: hasType('Bahan Ajar'), target: 'Media' },
  ];
  const completedComponents = componentsChecklist.filter(c => c.done).length;
  const completenessPercent = Math.round((completedComponents / componentsChecklist.length) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Bar Chart: Distribusi per Mata Pelajaran (7 cols) */}
      <div
        id="chart-subject-distribution"
        className="lg:col-span-7 p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#00529B] dark:text-blue-400" />
              <span>Distribusi Perangkat per Mata Pelajaran</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sebaran modul pembelajaran aktif dalam database
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#00529B] dark:text-blue-300">
            {modules.length} Total Modul
          </span>
        </div>

        {/* Custom Modern Bar Chart */}
        <div className="space-y-3 pt-2">
          {subjectsList.map(subj => {
            const count = subjectCounts[subj.name] || 0;
            const percentage = Math.round((count / maxSubjectCount) * 100);
            const isHovered = hoveredBar === subj.name;

            return (
              <div
                key={subj.name}
                onMouseEnter={() => setHoveredBar(subj.name)}
                onMouseLeave={() => setHoveredBar(null)}
                className="group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-semibold transition-colors ${
                    isHovered ? 'text-[#00529B] dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {subj.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {count} Modul
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({Math.round((count / (modules.length || 1)) * 100)}%)
                    </span>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.max(percentage, 4)}%`,
                      backgroundColor: isHovered ? '#FF7300' : subj.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Donut / Breakdown per Fase & Target Siswa (5 cols) */}
      <div
        id="chart-fase-breakdown"
        className="lg:col-span-5 p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-[#FF7300]" />
                <span>Proporsi per Jenjang Fase SD</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Keseimbangan fase fondasi hingga lanjutan
              </p>
            </div>
          </div>

          {/* Fase Breakdown Visual Blocks */}
          <div className="space-y-3.5 my-4">
            {[
              {
                fase: 'Fase A (Kelas 1 - 2)',
                count: faseCounts['Fase A (Kls 1-2)'],
                color: 'bg-[#00529B]',
                desc: 'Fondasi literasi awal & numerasi konkret',
              },
              {
                fase: 'Fase B (Kelas 3 - 4)',
                count: faseCounts['Fase B (Kls 3-4)'],
                color: 'bg-[#FF7300]',
                desc: 'Pengembangan konsep & observasi kontekstual',
              },
              {
                fase: 'Fase C (Kelas 5 - 6)',
                count: faseCounts['Fase C (Kls 5-6)'],
                color: 'bg-emerald-600',
                desc: 'Penalaran analitis & kesiapan ke jenjang SMP',
              },
            ].map(item => {
              const pct = Math.round((item.count / totalFaseCount) * 100);
              return (
                <div
                  key={item.fase}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-md ${item.color}`} />
                      <span className="font-bold text-slate-800 dark:text-slate-200">{item.fase}</span>
                    </div>
                    <span className="font-black text-slate-900 dark:text-white">
                      {item.count} Perangkat ({pct}%)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-5 mb-2">
                    {item.desc}
                  </p>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Completeness Indicator */}
        <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 mt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#002D62] dark:text-blue-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Kelengkapan Kurikulum Merdeka
            </span>
            <span className="font-black text-[#00529B] dark:text-blue-200">
              {completenessPercent}% ({completedComponents}/7 Komponen)
            </span>
          </div>
          <div className="h-2 w-full bg-blue-200/50 dark:bg-blue-900/50 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-[#00529B] to-[#FF7300] transition-all duration-500 rounded-full"
              style={{ width: `${completenessPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Monthly Trends Interactive Chart (12 cols) */}
      <div
        id="chart-monthly-trends"
        className="lg:col-span-12 p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Aktivitas Penyusunan & Pemanfaatan Perangkat Ajar</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tren pertumbuhan perangkat baru vs jumlah pengunduhan/cetak oleh rekan pendidik
            </p>
          </div>

          {/* Metric Selector Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTrendMetric('both')}
              className={`px-3 py-1.5 rounded-lg transition ${
                trendMetric === 'both'
                  ? 'bg-white dark:bg-slate-700 text-[#00529B] dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Semua Metrik
            </button>
            <button
              onClick={() => setTrendMetric('created')}
              className={`px-3 py-1.5 rounded-lg transition ${
                trendMetric === 'created'
                  ? 'bg-[#00529B] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Modul Dibuat
            </button>
            <button
              onClick={() => setTrendMetric('downloaded')}
              className={`px-3 py-1.5 rounded-lg transition ${
                trendMetric === 'downloaded'
                  ? 'bg-[#FF7300] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Unduhan Guru
            </button>
          </div>
        </div>

        {/* Responsive Trend Bars / Heights */}
        <div className="grid grid-cols-8 gap-2 sm:gap-4 items-end h-44 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
          {mockMonthlyTrends.map(item => {
            const createdHeight = Math.min(Math.round((item.created / maxTrend) * 100), 100);
            const downloadedHeight = Math.min(Math.round((item.downloaded / 1250) * 100), 100);

            return (
              <div key={item.month} className="flex flex-col items-center h-full justify-end group">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-24 bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-lg pointer-events-none z-10 whitespace-nowrap">
                  <p className="font-bold border-b border-slate-700 pb-1 mb-1">{item.month} 2024</p>
                  <p className="text-blue-300">Modul: {item.created}</p>
                  <p className="text-orange-300">Unduh: {item.downloaded}x</p>
                </div>

                <div className="flex items-end gap-1 sm:gap-2 h-full w-full justify-center">
                  {(trendMetric === 'both' || trendMetric === 'created') && (
                    <div
                      className="w-2.5 sm:w-5 bg-[#00529B] hover:bg-[#003B7A] rounded-t-md transition-all duration-300 group-hover:scale-y-105 origin-bottom"
                      style={{ height: `${Math.max(createdHeight, 10)}%` }}
                    />
                  )}
                  {(trendMetric === 'both' || trendMetric === 'downloaded') && (
                    <div
                      className="w-2.5 sm:w-5 bg-gradient-to-t from-[#E65100] to-[#FF7300] hover:brightness-110 rounded-t-md transition-all duration-300 group-hover:scale-y-105 origin-bottom"
                      style={{ height: `${Math.max(downloadedHeight, 10)}%` }}
                    />
                  )}
                </div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-2">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#00529B]" />
            <span>Modul Baru Disusun</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#FF7300]" />
            <span>Diunduh / Dimanfaatkan Rekan Pendidik</span>
          </div>
        </div>
      </div>
    </div>
  );
};
