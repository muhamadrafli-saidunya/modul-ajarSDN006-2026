import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TeachingModule, ModuleType, FaseType, StatusType, SubjectType } from '../../types';
import {
  Search,
  Filter,
  Plus,
  Grid,
  List,
  Eye,
  Edit,
  Trash2,
  Copy,
  Printer,
  Download,
  Calendar,
  Sparkles,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  Layers,
  Award
} from 'lucide-react';

export const ModuleCatalog: React.FC = () => {
  const {
    modules,
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

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFase, setSelectedFase] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'popular' | 'rating'>('newest');

  // View Mode: grid or list table
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filtered & Sorted Modules
  const filteredModules = useMemo(() => {
    return modules
      .filter(item => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchCode = item.code.toLowerCase().includes(q);
          const matchAuthor = item.author.toLowerCase().includes(q);
          const matchSubject = item.subject.toLowerCase().includes(q);
          const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
          if (!matchTitle && !matchCode && !matchAuthor && !matchSubject && !matchTags) {
            return false;
          }
        }

        // Fase
        if (selectedFase !== 'all' && item.fase !== selectedFase) {
          return false;
        }

        // Grade
        if (selectedGrade !== 'all' && item.grade.toString() !== selectedGrade) {
          return false;
        }

        // Subject
        if (selectedSubject !== 'all' && item.subject !== selectedSubject) {
          return false;
        }

        // Type
        if (selectedType !== 'all' && item.type !== selectedType) {
          return false;
        }

        // Status
        if (selectedStatus !== 'all' && item.status !== selectedStatus) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'popular') {
          return (b.downloadsCount || 0) - (a.downloadsCount || 0);
        }
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        return 0;
      });
  }, [
    modules,
    searchQuery,
    selectedFase,
    selectedGrade,
    selectedSubject,
    selectedType,
    selectedStatus,
    sortBy,
  ]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredModules.length / itemsPerPage) || 1;
  const paginatedModules = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredModules.slice(start, start + itemsPerPage);
  }, [filteredModules, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedFase('all');
    setSelectedGrade('all');
    setSelectedSubject('all');
    setSelectedType('all');
    setSelectedStatus('all');
    setSortBy('newest');
    setCurrentPage(1);
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

  const getStatusBadge = (status: TeachingModule['status']) => {
    switch (status) {
      case 'Diterbitkan':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Terverifikasi':
        return 'bg-blue-100 text-[#00529B] dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Review':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Draft':
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div id="module-catalog-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Bank Perangkat Ajar SD
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Koleksi perangkat ajar Kurikulum Merdeka Fase A (Kelas 1-2), B (Kelas 3-4), dan C (Kelas 5-6)
          </p>
        </div>

        <button
          id="btn-catalog-create-new"
          onClick={() => {
            setEditingModule(null);
            setIsFormModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7300] to-[#E65100] hover:from-[#f56f00] hover:to-[#d84a00] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Perangkat Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
        {/* Top Search Input & View Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="input-catalog-search"
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari berdasarkan judul materi, kode modul, topik, atau nama penyusun..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00529B] dark:focus:ring-blue-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                id="btn-view-grid"
                onClick={() => setViewMode('grid')}
                title="Tampilan Kartu"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-[#00529B] dark:text-blue-300 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                id="btn-view-table"
                onClick={() => setViewMode('table')}
                title="Tampilan Tabel"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-[#00529B] dark:text-blue-300 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Reset Filters */}
            <button
              id="btn-reset-filters"
              onClick={handleResetFilters}
              title="Reset Semua Filter"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Filter</span>
            </button>
          </div>
        </div>

        {/* Multi-dimension Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* 1. Fase */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Fase SD
            </label>
            <select
              id="filter-select-fase"
              value={selectedFase}
              onChange={e => {
                setSelectedFase(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-[#00529B]"
            >
              <option value="all">Semua Fase (A, B, C)</option>
              <option value="Fase A">Fase A (Kls 1 - 2)</option>
              <option value="Fase B">Fase B (Kls 3 - 4)</option>
              <option value="Fase C">Fase C (Kls 5 - 6)</option>
            </select>
          </div>

          {/* 2. Kelas */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Kelas
            </label>
            <select
              id="filter-select-grade"
              value={selectedGrade}
              onChange={e => {
                setSelectedGrade(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-[#00529B]"
            >
              <option value="all">Semua Kelas</option>
              <option value="1">Kelas 1</option>
              <option value="2">Kelas 2</option>
              <option value="3">Kelas 3</option>
              <option value="4">Kelas 4</option>
              <option value="5">Kelas 5</option>
              <option value="6">Kelas 6</option>
            </select>
          </div>

          {/* 3. Mapel */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Mata Pelajaran
            </label>
            <select
              id="filter-select-subject"
              value={selectedSubject}
              onChange={e => {
                setSelectedSubject(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-[#00529B]"
            >
              <option value="all">Semua Mapel</option>
              <option value="IPAS">IPAS</option>
              <option value="Matematika">Matematika</option>
              <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
              <option value="PJOK">PJOK</option>
              <option value="Pendidikan Agama Islam">PAI-BP</option>
              <option value="Seni Rupa">Seni Rupa</option>
              <option value="Bahasa Inggris">Bahasa Inggris</option>
            </select>
          </div>

          {/* 4. Jenis Perangkat */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Jenis Dokumen
            </label>
            <select
              id="filter-select-type"
              value={selectedType}
              onChange={e => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-[#00529B]"
            >
              <option value="all">Semua Jenis</option>
              <option value="Modul Ajar">Modul Ajar</option>
              <option value="Alur Tujuan Pembelajaran (ATP)">ATP</option>
              <option value="Capaian Pembelajaran (CP)">CP</option>
              <option value="Program Tahunan (Prota)">Prota</option>
              <option value="Program Semester (Promes)">Promes</option>
              <option value="Asesmen & Rubrik">Asesmen & Rubrik</option>
              <option value="Bahan Ajar & LKPD">LKPD / Bahan Ajar</option>
            </select>
          </div>

          {/* 5. Status */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Status Validasi
            </label>
            <select
              id="filter-select-status"
              value={selectedStatus}
              onChange={e => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-[#00529B]"
            >
              <option value="all">Semua Status</option>
              <option value="Diterbitkan">Diterbitkan</option>
              <option value="Terverifikasi">Terverifikasi</option>
              <option value="Review">Sedang Review</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* 6. Sorting */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Urutkan
            </label>
            <select
              id="filter-select-sort"
              value={sortBy}
              onChange={e => {
                setSortBy(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-[#00529B]"
            >
              <option value="newest">Terbaru Diperbarui</option>
              <option value="oldest">Paling Awal</option>
              <option value="popular">Unduhan Terbanyak</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="title">Judul (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Status Quick Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-slate-400 mr-1">Filter Status Cepat:</span>
          {['all', 'Diterbitkan', 'Terverifikasi', 'Review', 'Draft'].map(st => (
            <button
              key={st}
              onClick={() => {
                setSelectedStatus(st);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedStatus === st
                  ? 'bg-[#00529B] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'Semua Status' : st}
            </button>
          ))}
          <span className="text-xs text-slate-400 ml-auto font-medium">
            Ditemukan: <strong className="text-slate-800 dark:text-slate-200">{filteredModules.length}</strong> perangkat
          </span>
        </div>
      </div>

      {/* Main Content Area: Grid or Table View */}
      {filteredModules.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <BookOpen className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Tidak ada perangkat ajar yang cocok
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Coba ubah kata kunci pencarian atau sesuaikan pilihan filter Fase, Kelas, dan Mata Pelajaran.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-bold text-white bg-[#00529B] hover:bg-[#003B7A] rounded-xl transition"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedModules.map(mod => (
            <div
              key={mod.id}
              id={`module-card-${mod.id}`}
              className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-lg transition-all duration-200 group"
            >
              <div>
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-blue-50 dark:bg-blue-950/80 text-[#00529B] dark:text-blue-300">
                      {mod.subject}
                    </span>
                    <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Kelas {mod.grade} ({mod.fase})
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-full border ${getStatusBadge(
                      mod.status
                    )}`}
                  >
                    {mod.status}
                  </span>
                </div>

                {/* Title */}
                <h3
                  onClick={() => handleView(mod)}
                  className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-[#00529B] dark:group-hover:text-blue-400 transition cursor-pointer line-clamp-2"
                  title={mod.title}
                >
                  {mod.title}
                </h3>

                {/* Subtitle / CP Summary */}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {mod.capaianPembelajaran}
                </p>

                {/* Profil Pelajar Pancasila Tags */}
                {mod.profilPancasila && mod.profilPancasila.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {mod.profilPancasila.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/50 text-[#FF7300] dark:text-orange-300 border border-orange-200/50 dark:border-orange-800/50"
                      >
                        {tag}
                      </span>
                    ))}
                    {mod.profilPancasila.length > 3 && (
                      <span className="text-[10px] text-slate-400 px-1 py-0.5">
                        +{mod.profilPancasila.length - 3} lagi
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Meta & Actions */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{mod.author}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-bold shrink-0">
                    <Award className="w-3.5 h-3.5" />
                    <span>{mod.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => handleView(mod)}
                    title="Lihat Rincian Modul"
                    className="flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold text-[#00529B] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detail</span>
                  </button>

                  <button
                    onClick={() => handlePrint(mod)}
                    title="Cetak Format Resmi Sekolah"
                    className="flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 hover:bg-orange-100 dark:hover:bg-orange-900/60 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak</span>
                  </button>

                  <button
                    onClick={() => handleEdit(mod)}
                    title="Sunting Perangkat"
                    className="flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(mod)}
                    title="Hapus Modul"
                    className="flex items-center justify-center py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Kode & Judul Perangkat</th>
                  <th className="py-3 px-3">Mata Pelajaran</th>
                  <th className="py-3 px-3">Jenjang</th>
                  <th className="py-3 px-3">Penyusun</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {paginatedModules.map(mod => (
                  <tr
                    key={mod.id}
                    className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 mb-0.5">
                        <span>{mod.code}</span>
                        <span>•</span>
                        <span className="text-[#00529B] dark:text-blue-300 font-semibold">{mod.type}</span>
                      </div>
                      <p
                        onClick={() => handleView(mod)}
                        className="font-bold text-slate-900 dark:text-white group-hover:text-[#00529B] dark:group-hover:text-blue-400 transition cursor-pointer line-clamp-1"
                      >
                        {mod.title}
                      </p>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {mod.subject}
                    </td>

                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                      <div>Kelas {mod.grade} SD</div>
                      <span className="text-[11px] text-slate-400">{mod.fase}</span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400 truncate max-w-[150px]">
                      {mod.author}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${getStatusBadge(
                          mod.status
                        )}`}
                      >
                        {mod.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleView(mod)}
                          title="Detail"
                          className="p-1.5 rounded-lg text-[#00529B] hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-slate-800 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePrint(mod)}
                          title="Cetak Resmi"
                          className="p-1.5 rounded-lg text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-slate-800 transition"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(mod)}
                          title="Sunting"
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => duplicateModule(mod.id)}
                          title="Duplikasi"
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(mod)}
                          title="Hapus"
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-slate-800 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Menampilkan{' '}
            <strong className="text-slate-800 dark:text-slate-200">
              {(currentPage - 1) * itemsPerPage + 1}
            </strong>{' '}
            hingga{' '}
            <strong className="text-slate-800 dark:text-slate-200">
              {Math.min(currentPage * itemsPerPage, filteredModules.length)}
            </strong>{' '}
            dari{' '}
            <strong className="text-slate-800 dark:text-slate-200">
              {filteredModules.length}
            </strong>{' '}
            perangkat
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                  currentPage === page
                    ? 'bg-[#00529B] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
