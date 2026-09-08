import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  CheckCircle,
  HelpCircle,
  Award,
  Printer,
  Download,
  Plus,
  Search,
  Check
} from 'lucide-react';

interface QuestionItem {
  id: string;
  type: 'Pilihan Ganda' | 'Isian Singkat' | 'Uraian Kasus';
  question: string;
  options?: string[];
  correctAnswer: string;
  discussion: string;
  kktpTarget: string;
}

export const AssessmentBankView: React.FC = () => {
  const { showToast, setIsFormModalOpen, setEditingModule } = useApp();
  const [activeTab, setActiveTab] = useState<'formatif' | 'sumatif' | 'diagnostik'>('sumatif');
  const [selectedSubject, setSelectedSubject] = useState('IPAS');

  const questions: QuestionItem[] = [
    {
      id: 'q1',
      type: 'Pilihan Ganda',
      question: 'Bagian tumbuhan yang berfungsi menyerap air dan zat hara dari dalam tanah serta memperkokoh berdirinya batang adalah...',
      options: ['A. Daun', 'B. Akar', 'C. Bunga', 'D. Buah'],
      correctAnswer: 'B. Akar',
      discussion: 'Akar memiliki rambut-rambut akar untuk menyerap air dan mineral tanah menuju pembuluh xilem.',
      kktpTarget: 'Mengenali fungsi organ utama tumbuhan (Skor 1)',
    },
    {
      id: 'q2',
      type: 'Pilihan Ganda',
      question: 'Gas yang diserap oleh daun tumbuhan saat melakukan fotosintesis di siang hari adalah...',
      options: ['A. Oksigen', 'B. Nitrogen', 'C. Karbon Dioksida', 'D. Helium'],
      correctAnswer: 'C. Karbon Dioksida',
      discussion: 'Tumbuhan menyerap karbon dioksida (CO2) dan melepaskan oksigen (O2) sebagai hasil sampingan fotosintesis.',
      kktpTarget: 'Menjelaskan proses pertukaran zat fotosintesis (Skor 1)',
    },
    {
      id: 'q3',
      type: 'Isian Singkat',
      question: 'Zat hijau daun yang berfungsi menangkap energi cahaya matahari dalam proses fotosintesis disebut...',
      correctAnswer: 'Klorofil',
      discussion: 'Klorofil berada di kloroplas sel daun tumbuhan hijau.',
      kktpTarget: 'Menyebutkan istilah ilmiah organ tumbuhan (Skor 2)',
    },
    {
      id: 'q4',
      type: 'Uraian Kasus',
      question: 'Rani meletakkan dua pot tanaman pacar air. Pot A ditaruh di halaman yang terkena sinar matahari cukup dan disiram setiap hari. Pot B ditaruh di dalam lemari gelap tanpa cahaya. Apa yang akan terjadi pada kedua tanaman setelah 7 hari? Jelaskan alasan ilmiahmu!',
      correctAnswer: 'Pot A akan tumbuh subur dan hijau karena mendapat cahaya matahari dan air untuk fotosintesis. Pot B akan pucat, layu, atau mati karena tidak terjadi fotosintesis tanpa energi cahaya.',
      discussion: 'Soal penalaran HOTS menguji pemahaman peran mutlak sinar matahari bagi kehidupan tumbuhan.',
      kktpTarget: 'Menganalisis sebab-akibat fenomena alam (Skor 4)',
    },
  ];

  const handlePrintAssessment = () => {
    window.print();
    showToast('Naskah asesmen siap dicetak!', 'info');
  };

  return (
    <div id="assessment-bank-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold text-xs">
              Instrumen Penilaian Autentik SD
            </span>
            <span className="text-xs text-slate-400">• KKTP Terstandar</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Bank Asesmen & Instrumen Evaluasi SD
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Kumpulan instrumen asesmen diagnostik, formatif proses belajar, dan sumatif akhir lingkup materi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintAssessment}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Printer className="w-4 h-4 text-[#FF7300]" />
            <span>Cetak Lembar Soal</span>
          </button>

          <button
            onClick={() => {
              setEditingModule(null);
              setIsFormModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-[#00529B] hover:bg-[#003B7A] text-white shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Asesmen Baru</span>
          </button>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 text-xs sm:text-sm font-bold">
        {[
          { id: 'sumatif', label: 'Asesmen Sumatif (Lingkup Materi & Akhir)' },
          { id: 'formatif', label: 'Asesmen Formatif (Rubrik Kinerja & LKPD)' },
          { id: 'diagnostik', label: 'Asesmen Diagnostik (Awal Pembelajaran)' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === t.id
                ? 'border-[#00529B] text-[#00529B] dark:border-blue-400 dark:text-blue-300'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content depending on Tab */}
      {activeTab === 'sumatif' ? (
        <div className="space-y-4">
          {/* Header Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-[#00529B] dark:text-blue-400">
                KISI-KISI & SOAL SUMATIF SD-4-01
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                Sumatif Lingkup Materi Bab 1 IPAS: Bagian Tumbuhan & Fotosintesis
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Kriteria Ketercapaian Tujuan Pembelajaran (KKTP): Minimal skor 75 / 100
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs shrink-0">
              4 Contoh Soal HOTS
            </span>
          </div>

          {/* Question List Cards */}
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#00529B] text-white flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {q.type}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {q.kktpTarget}
                  </span>
                </div>

                <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">
                  {q.question}
                </p>

                {/* Multiple choice options */}
                {q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map(opt => (
                      <div
                        key={opt}
                        className={`p-2.5 rounded-xl border text-xs font-medium ${
                          opt === q.correctAnswer
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {opt} {opt === q.correctAnswer && '✓ (Kunci Jawaban)'}
                      </div>
                    ))}
                  </div>
                )}

                {/* Explanation / Rubric Key */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-[#00529B] dark:text-blue-400 block mb-0.5">
                    Kunci Jawaban & Rubrik Penskoran:
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{q.correctAnswer}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{q.discussion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'formatif' ? (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Rubrik Asesmen Formatif: Keterampilan Penyelidikan & Kinerja Kelompok
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Digunakan oleh guru selama kegiatan eksperimen berlangsung di kelas.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                    <th className="p-3">Aspek Penilaian</th>
                    <th className="p-3">Sangat Mahir (4)</th>
                    <th className="p-3">Cakap (3)</th>
                    <th className="p-3">Mulai Berkembang (2)</th>
                    <th className="p-3">Perlu Bimbingan (1)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="p-3 font-bold">1. Ketelitian Praktikum</td>
                    <td className="p-3">Melakukan observasi runtut tanpa kesalahan prosedur.</td>
                    <td className="p-3">Melakukan observasi mandiri dengan sedikit panduan.</td>
                    <td className="p-3">Memerlukan beberapa kali pengingat prosedur kerja.</td>
                    <td className="p-3">Belum mampu melakukan langkah praktikum tanpa guru.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">2. Kolaborasi Kelompok</td>
                    <td className="p-3">Berbagi tugas aktif, menghargai saran seluruh teman.</td>
                    <td className="p-3">Aktif terlibat dan membantu rekan kelompok.</td>
                    <td className="p-3">Cenderung pasif namun tetap menyelesaikan tugasnya.</td>
                    <td className="p-3">Kurang bekerjasama dan mengganggu konsentrasi teman.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">3. Pengisian LKPD</td>
                    <td className="p-3">Data lengkap, rapi, dan simpulan logis analitis.</td>
                    <td className="p-3">Data lengkap dengan simpulan tepat.</td>
                    <td className="p-3">Data sebagian terisi, kesimpulan belum lengkap.</td>
                    <td className="p-3">LKPD tidak terisi dengan benar.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Pedoman Asesmen Diagnostik Awal Tahun Pelajaran
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Instrumen pemetaan gaya belajar (Visual, Auditori, Kinestetik) dan kesiapan numerasi-literasi awal.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
                <h4 className="font-bold text-xs text-[#00529B] dark:text-blue-300 uppercase mb-1">
                  1. Diagnostik Non-Kognitif
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Mengetahui kondisi psikologis, minat hobi, serta latar belakang dukungan belajar siswa di rumah.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-orange-50/60 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/50">
                <h4 className="font-bold text-xs text-[#FF7300] dark:text-orange-300 uppercase mb-1">
                  2. Diagnostik Kognitif Awal
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Menguji prasyarat materi prasyarat dari fase sebelumnya sebelum memulai bab baru.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
