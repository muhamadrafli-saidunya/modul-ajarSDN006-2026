import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  School,
  FileSpreadsheet
} from 'lucide-react';

export const ProtaPromesView: React.FC = () => {
  const { userProfile, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'prota' | 'promes'>('promes');
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);

  const monthsSem1 = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const monthsSem2 = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];

  const distributionList = [
    {
      no: 1,
      bab: 'Bab 1: Tumbuhan Sumber Kehidupan di Bumi',
      tp: 'Menganalisis bagian tubuh tumbuhan dan proses fotosintesis',
      alokasi: '16 JP',
      weeksSem1: [4, 4, 4, 4, 0, 0],
    },
    {
      no: 2,
      bab: 'Bab 2: Wujud Zat dan Perubahannya',
      tp: 'Mendeskripsikan karakteristik wujud zat padat, cair, gas',
      alokasi: '18 JP',
      weeksSem1: [0, 0, 0, 2, 4, 4],
    },
    {
      no: 3,
      bab: 'Bab 3: Gaya di Sekitar Kita',
      tp: 'Mengidentifikasi jenis-jenis gaya dan penerapannya',
      alokasi: '16 JP',
      weeksSem1: [0, 0, 0, 0, 4, 4],
    },
    {
      no: 4,
      bab: 'Cadangan & Asesmen Sumatif Akhir Semester',
      tp: 'Remedial, Pengayaan, dan Sumatif Akhir Semester (SAS)',
      alokasi: '8 JP',
      weeksSem1: [0, 0, 0, 0, 0, 4],
    },
  ];

  const handlePrint = () => {
    window.print();
    showToast('Tampilan Program Semester siap dicetak!', 'info');
  };

  return (
    <div id="prota-promes-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#00529B] dark:text-blue-300 font-bold text-xs">
              Kalender Pendidikan 2024/2025
            </span>
            <span className="text-xs text-slate-400">• Distribusi Jam Efektif</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Program Tahunan (Prota) & Program Semester (Promes)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Perhitungan alokasi waktu dan distribusi minggu belajar efektif jenjang Sekolah Dasar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 transition"
          >
            <Printer className="w-4 h-4 text-[#FF7300]" />
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Minggu Kalender</p>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">26 Minggu</p>
          <span className="text-[11px] text-slate-400">Semester 1 Ganjil</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Minggu Tidak Efektif</p>
          <p className="text-xl font-black text-amber-600 mt-1">7 Minggu</p>
          <span className="text-[11px] text-slate-400">Libur, MPLS & Asesmen</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Minggu Efektif Belajar</p>
          <p className="text-xl font-black text-emerald-600 mt-1">19 Minggu</p>
          <span className="text-[11px] text-slate-400">Tatap Muka & Praktikum</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total Jam Pelajaran</p>
          <p className="text-xl font-black text-[#00529B] dark:text-blue-400 mt-1">95 JP</p>
          <span className="text-[11px] text-slate-400">5 JP / Minggu (IPAS)</span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold gap-3">
        <button
          onClick={() => setActiveTab('promes')}
          className={`py-3 px-4 border-b-2 transition ${
            activeTab === 'promes'
              ? 'border-[#00529B] text-[#00529B] dark:border-blue-400 dark:text-blue-300'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Program Semester (Promes) Matriks Mingguan
        </button>
        <button
          onClick={() => setActiveTab('prota')}
          className={`py-3 px-4 border-b-2 transition ${
            activeTab === 'prota'
              ? 'border-[#00529B] text-[#00529B] dark:border-blue-400 dark:text-blue-300'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Program Tahunan (Prota) Alokasi JP
        </button>
      </div>

      {/* Promes Matrix Table */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              Matriks Program Semester 1 (Ganjil) 2024/2025
            </h3>
            <p className="text-xs text-slate-500">Mata Pelajaran: IPAS Kelas 4 SD ({userProfile.school})</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedSemester(1)}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                selectedSemester === 1 ? 'bg-[#00529B] text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Semester 1
            </button>
            <button
              onClick={() => setSelectedSemester(2)}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                selectedSemester === 2 ? 'bg-[#00529B] text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Semester 2
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                <th className="p-3 w-10 text-center">No</th>
                <th className="p-3">Lingkup Materi & Tujuan Pembelajaran</th>
                <th className="p-3 w-20 text-center">Alokasi</th>
                {monthsSem1.map(m => (
                  <th key={m} className="p-3 text-center border-l border-slate-200 dark:border-slate-700">
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {distributionList.map(item => (
                <tr key={item.no} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="p-3 text-center font-bold">{item.no}</td>
                  <td className="p-3">
                    <p className="font-bold text-slate-900 dark:text-white">{item.bab}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.tp}</p>
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-[#00529B] dark:text-blue-300">
                    {item.alokasi}
                  </td>
                  {item.weeksSem1.map((w, i) => (
                    <td
                      key={i}
                      className="p-3 text-center border-l border-slate-100 dark:border-slate-800 font-bold"
                    >
                      {w > 0 ? (
                        <span className="inline-block px-2 py-1 rounded bg-blue-100 dark:bg-blue-950 text-[#00529B] dark:text-blue-300 font-mono">
                          {w} JP
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-700">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
