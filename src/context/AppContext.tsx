import React, { createContext, useContext, useState, useEffect } from 'react';
import { TeachingModule, UserProfile, ModuleType, SubjectType, FaseType, KopConfig, SettingsBackupPayload, BackupSnapshot } from '../types';
import { initialModules, initialUserProfile, initialKopConfig } from '../data/mockData';
import { DEFAULT_TUT_WURI_LOGO, DEFAULT_SCHOOL_LOGO } from '../data/defaultLogos';

interface ToastInfo {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

interface AppContextType {
  modules: TeachingModule[];
  setModules: React.Dispatch<React.SetStateAction<TeachingModule[]>>;
  userProfile: UserProfile;
  darkMode: boolean;
  currentView: string;
  setCurrentView: (view: string) => void;
  toggleDarkMode: () => void;
  // Detail Modal
  selectedModule: TeachingModule | null;
  setSelectedModule: (mod: TeachingModule | null) => void;
  isDetailOpen: boolean;
  setIsDetailOpen: (open: boolean) => void;
  // Form Modal (Add / Edit)
  isFormModalOpen: boolean;
  setIsFormModalOpen: (open: boolean) => void;
  editingModule: TeachingModule | null;
  setEditingModule: (mod: TeachingModule | null) => void;
  // Print Preview Modal
  isPrintPreviewOpen: boolean;
  setIsPrintPreviewOpen: (open: boolean) => void;
  printModule: TeachingModule | null;
  setPrintModule: (mod: TeachingModule | null) => void;
  // Delete Dialog
  isDeleteConfirmOpen: boolean;
  setIsDeleteConfirmOpen: (open: boolean) => void;
  moduleToDelete: TeachingModule | null;
  setModuleToDelete: (mod: TeachingModule | null) => void;
  // Backup & Restore Modal
  isBackupModalOpen: boolean;
  setIsBackupModalOpen: (open: boolean) => void;
  exportSettingsBackup: (includeModules?: boolean) => SettingsBackupPayload;
  restoreSettingsBackup: (data: SettingsBackupPayload) => { success: boolean; message: string };
  snapshots: BackupSnapshot[];
  saveSnapshot: (name: string, type?: 'settings_only' | 'full_database') => void;
  deleteSnapshot: (id: string) => void;
  restoreSnapshot: (id: string) => void;
  // Actions
  addModule: (data: Partial<TeachingModule>) => TeachingModule;
  updateModule: (id: string, data: Partial<TeachingModule>) => void;
  deleteModule: (id: string) => void;
  duplicateModule: (id: string) => void;
  incrementDownload: (id: string) => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  updateKopConfig: (data: Partial<KopConfig>) => void;
  resetToDefaultData: () => void;
  toast: ToastInfo | null;
  showToast: (text: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_MODULES = 'sd_modul_pembelajaran_data_v1';
const LOCAL_STORAGE_KEY_PROFILE = 'sd_modul_pembelajaran_profile_v1';
const LOCAL_STORAGE_KEY_THEME = 'sd_modul_pembelajaran_theme_v1';
const LOCAL_STORAGE_KEY_SNAPSHOTS = 'sd_modul_pembelajaran_snapshots_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<TeachingModule[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_MODULES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved modules', e);
    }
    return initialModules;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        const rawKop = parsed.kopConfig || {};
        // Auto-migrate old broken unencoded SVG strings if present
        const leftLogo =
          !rawKop.leftLogoUrl || rawKop.leftLogoUrl.startsWith('data:image/svg+xml;utf8')
            ? DEFAULT_TUT_WURI_LOGO
            : rawKop.leftLogoUrl;
        const rightLogo =
          !rawKop.rightLogoUrl || rawKop.rightLogoUrl.startsWith('data:image/svg+xml;utf8')
            ? DEFAULT_SCHOOL_LOGO
            : rawKop.rightLogoUrl;

        return {
          ...initialUserProfile,
          ...parsed,
          kopConfig: {
            ...initialKopConfig,
            ...rawKop,
            leftLogoUrl: leftLogo,
            rightLogoUrl: rightLogo,
          },
        };
      }
    } catch (e) {
      console.error('Failed to parse saved user profile', e);
    }
    return initialUserProfile;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_THEME);
      return saved === 'dark';
    } catch {
      return false;
    }
  });

  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedModule, setSelectedModule] = useState<TeachingModule | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<TeachingModule | null>(null);

  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [printModule, setPrintModule] = useState<TeachingModule | null>(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<TeachingModule | null>(null);

  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Snapshots stored in localStorage
  const [snapshots, setSnapshots] = useState<BackupSnapshot[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SNAPSHOTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved snapshots', e);
    }
    return [];
  });

  // Save snapshots to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SNAPSHOTS, JSON.stringify(snapshots));
    } catch (e) {
      console.error('Failed to store snapshots', e);
    }
  }, [snapshots]);

  const [toast, setToast] = useState<ToastInfo | null>(null);

  // Sync dark mode with document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(LOCAL_STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(LOCAL_STORAGE_KEY_THEME, 'light');
    }
  }, [darkMode]);

  // Sync modules with local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_MODULES, JSON.stringify(modules));
    } catch (e) {
      console.error('Failed to store modules', e);
    }
  }, [modules]);

  // Sync profile with local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(userProfile));
    } catch (e) {
      console.error('Failed to store user profile', e);
    }
  }, [userProfile]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const showToast = (text: string, type: 'success' | 'info' | 'error' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, text, type });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 3500);
  };

  const addModule = (data: Partial<TeachingModule>): TeachingModule => {
    const today = new Date().toISOString().split('T')[0];
    const generatedCode = `MOD-${(data.subject || 'SD').substring(0, 3).toUpperCase()}-K${data.grade || 4}-${Math.floor(100 + Math.random() * 900)}`;

    const newModule: TeachingModule = {
      id: `mod-${Date.now()}`,
      code: data.code || generatedCode,
      title: data.title || 'Modul Pembelajaran Baru SD',
      type: data.type || ('Modul Ajar' as ModuleType),
      fase: data.fase || ('Fase B' as FaseType),
      grade: data.grade || 4,
      subject: data.subject || ('IPAS' as SubjectType),
      semester: data.semester || 1,
      academicYear: data.academicYear || userProfile.academicYear,
      author: data.author || userProfile.name,
      nipAuthor: data.nipAuthor || userProfile.nip,
      school: data.school || userProfile.school,
      headmaster: data.headmaster || userProfile.headmasterName,
      nipHeadmaster: data.nipHeadmaster || userProfile.headmasterNip,
      status: data.status || 'Draft',
      allocatedHours: data.allocatedHours || '4 JP (4 x 35 Menit)',
      targetStudents: data.targetStudents || 'Reguler / Heterogen (28 Peserta Didik)',
      profilPancasila: data.profilPancasila || ['Bernalar Kritis', 'Mandiri'],
      capaianPembelajaran: data.capaianPembelajaran || 'Peserta didik menguasai kompetensi dasar materi.',
      tujuanPembelajaran: data.tujuanPembelajaran && data.tujuanPembelajaran.length > 0 
        ? data.tujuanPembelajaran 
        : ['Memahami konsep dasar materi.', 'Menerapkan dalam kegiatan pemecahan masalah.'],
      pemahamanBermakna: data.pemahamanBermakna || 'Materi ini bermanfaat dalam kehidupan sehari-hari anak.',
      pertanyaanPemantik: data.pertanyaanPemantik || ['Apa yang kamu ketahui tentang topik ini?'],
      modelPembelajaran: data.modelPembelajaran || 'Problem Based Learning (PBL)',
      saranaPrasarana: data.saranaPrasarana || ['Buku Siswa', 'Lembar Kerja', 'Papan Tulis / Proyektor'],
      langkahKegiatan: data.langkahKegiatan || {
        pendahuluan: ['Membuka pembelajaran dengan salam dan doa.', 'Apersepsi dan penyampaian tujuan pembelajaran.'],
        inti: ['Orientasi siswa pada masalah.', 'Penyelidikan mandiri dan kelompok.', 'Penyajian hasil karya.'],
        penutup: ['Refleksi dan kesimpulan bersama.', 'Doa dan salam penutup.'],
      },
      asesmenDesc: data.asesmenDesc || 'Asesmen Formatif (Keaktifan dan LKPD) & Asesmen Sumatif (Kuis akhir bab).',
      lampiran: data.lampiran || {
        lkpd: 'Lembar Kerja Peserta Didik Terlampir.',
        materiSingkat: 'Ringkasan materi inti pembelajaran.',
        rubrikPenilaian: 'Rubrik penilaian sikap, pengetahuan, dan keterampilan.',
        remedialPengayaan: 'Bimbingan khusus untuk remedial dan tantangan proyek pengayaan.',
      },
      downloadsCount: 0,
      rating: 5.0,
      tags: data.tags || ['Kurikulum Merdeka', 'SD', 'Perangkat Ajar'],
      createdAt: today,
      updatedAt: today,
    };

    setModules(prev => [newModule, ...prev]);
    showToast(`Perangkat ajar "${newModule.title}" berhasil dibuat!`, 'success');
    return newModule;
  };

  const updateModule = (id: string, data: Partial<TeachingModule>) => {
    const today = new Date().toISOString().split('T')[0];
    setModules(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            ...data,
            updatedAt: today,
          };
        }
        return item;
      })
    );

    // If currently viewed or print module is updated, sync it
    if (selectedModule?.id === id) {
      setSelectedModule(prev => (prev ? { ...prev, ...data, updatedAt: today } : null));
    }
    if (printModule?.id === id) {
      setPrintModule(prev => (prev ? { ...prev, ...data, updatedAt: today } : null));
    }

    showToast('Perubahan perangkat ajar berhasil disimpan!', 'success');
  };

  const deleteModule = (id: string) => {
    const target = modules.find(m => m.id === id);
    setModules(prev => prev.filter(item => item.id !== id));
    if (selectedModule?.id === id) {
      setSelectedModule(null);
      setIsDetailOpen(false);
    }
    showToast(`Perangkat "${target?.title || id}" telah dihapus`, 'info');
  };

  const duplicateModule = (id: string) => {
    const source = modules.find(m => m.id === id);
    if (!source) return;

    const today = new Date().toISOString().split('T')[0];
    const clone: TeachingModule = {
      ...source,
      id: `mod-${Date.now()}`,
      code: `${source.code}-SALINAN`,
      title: `${source.title} (Salinan)`,
      status: 'Draft',
      downloadsCount: 0,
      createdAt: today,
      updatedAt: today,
    };

    setModules(prev => [clone, ...prev]);
    showToast(`Berhasil menduplikasi "${source.title}"!`, 'success');
  };

  const incrementDownload = (id: string) => {
    setModules(prev =>
      prev.map(item => {
        if (item.id === id) {
          return { ...item, downloadsCount: item.downloadsCount + 1 };
        }
        return item;
      })
    );
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...data }));
    showToast('Profil Pendidik & Sekolah berhasil diperbarui!', 'success');
  };

  const updateKopConfig = (data: Partial<KopConfig>) => {
    setUserProfile(prev => {
      const updatedKop: KopConfig = {
        ...(prev.kopConfig || initialKopConfig),
        ...data,
      };
      return {
        ...prev,
        kopConfig: updatedKop,
      };
    });
    showToast('Pengaturan KOP & Tanda Tangan berhasil disimpan!', 'success');
  };

  const exportSettingsBackup = (includeModules = false): SettingsBackupPayload => {
    const today = new Date().toISOString();
    const effectiveKop = userProfile.kopConfig || initialKopConfig;

    const payload: SettingsBackupPayload = {
      version: '2.4.0',
      exportedAt: today,
      appName: 'Modul Pembelajaran SD',
      type: includeModules ? 'full_database' : 'settings_only',
      userProfile: {
        ...userProfile,
        kopConfig: effectiveKop,
      },
      kopConfig: effectiveKop,
      modules: includeModules ? modules : undefined,
      metadata: {
        schoolName: userProfile.school || 'Sekolah Dasar',
        teacherName: userProfile.name || 'Guru',
        headmasterName: userProfile.headmasterName || 'Kepala Sekolah',
        npsn: userProfile.npsn || '-',
        academicYear: userProfile.academicYear || '2024/2025',
        hasLeftLogo: !!effectiveKop.leftLogoUrl,
        hasRightLogo: !!effectiveKop.rightLogoUrl,
        modulesCount: includeModules ? modules.length : undefined,
      },
    };

    return payload;
  };

  const restoreSettingsBackup = (data: SettingsBackupPayload): { success: boolean; message: string } => {
    try {
      if (!data || typeof data !== 'object') {
        throw new Error('Format berkas tidak valid.');
      }

      if (!data.userProfile && !data.kopConfig) {
        throw new Error('Berkas cadangan tidak memiliki data profil atau KOP surat.');
      }

      // Restore userProfile & KOP
      const restoredKop: KopConfig = {
        ...initialKopConfig,
        ...(data.kopConfig || {}),
        ...(data.userProfile?.kopConfig || {}),
      };

      const restoredProfile: UserProfile = {
        ...initialUserProfile,
        ...(data.userProfile || {}),
        kopConfig: restoredKop,
      };

      setUserProfile(restoredProfile);

      // Restore modules if provided
      if (data.modules && Array.isArray(data.modules) && data.modules.length > 0) {
        setModules(data.modules);
      }

      // Sync to localStorage immediately
      localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(restoredProfile));
      if (data.modules && Array.isArray(data.modules)) {
        localStorage.setItem(LOCAL_STORAGE_KEY_MODULES, JSON.stringify(data.modules));
      }

      const formattedTime = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date());

      localStorage.setItem('PROFILE_LAST_SAVED_TIME', formattedTime);

      showToast('Database pengaturan berhasil dipulihkan!', 'success');
      return { success: true, message: 'Database pengaturan berhasil dipulihkan!' };
    } catch (err: any) {
      console.error('Error restoring backup:', err);
      const errMsg = err?.message || 'Gagal memulihkan database.';
      showToast(errMsg, 'error');
      return { success: false, message: errMsg };
    }
  };

  const saveSnapshot = (name: string, type: 'settings_only' | 'full_database' = 'settings_only') => {
    const backupData = exportSettingsBackup(type === 'full_database');
    const newSnapshot: BackupSnapshot = {
      id: `snap-${Date.now()}`,
      name: name || `Snapshot ${new Date().toLocaleDateString('id-ID')}`,
      timestamp: new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date()),
      type,
      data: backupData,
    };

    setSnapshots(prev => [newSnapshot, ...prev.slice(0, 9)]); // keep up to 10 snapshots
    showToast(`Snapshot "${newSnapshot.name}" berhasil disimpan ke peramban!`, 'success');
  };

  const deleteSnapshot = (id: string) => {
    setSnapshots(prev => prev.filter(s => s.id !== id));
    showToast('Snapshot telah dihapus.', 'info');
  };

  const restoreSnapshot = (id: string) => {
    const target = snapshots.find(s => s.id === id);
    if (!target) {
      showToast('Snapshot tidak ditemukan.', 'error');
      return;
    }
    restoreSettingsBackup(target.data);
    showToast(`Snapshot "${target.name}" berhasil dipulihkan!`, 'success');
  };

  const resetToDefaultData = () => {
    setModules(initialModules);
    setUserProfile(initialUserProfile);
    showToast('Data berhasil di-reset ke data bawaan kurikulum!', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        modules,
        setModules,
        userProfile,
        darkMode,
        currentView,
        setCurrentView,
        toggleDarkMode,
        selectedModule,
        setSelectedModule,
        isDetailOpen,
        setIsDetailOpen,
        isFormModalOpen,
        setIsFormModalOpen,
        editingModule,
        setEditingModule,
        isPrintPreviewOpen,
        setIsPrintPreviewOpen,
        printModule,
        setPrintModule,
        isDeleteConfirmOpen,
        setIsDeleteConfirmOpen,
        moduleToDelete,
        setModuleToDelete,
        isBackupModalOpen,
        setIsBackupModalOpen,
        exportSettingsBackup,
        restoreSettingsBackup,
        snapshots,
        saveSnapshot,
        deleteSnapshot,
        restoreSnapshot,
        addModule,
        updateModule,
        deleteModule,
        duplicateModule,
        incrementDownload,
        updateUserProfile,
        updateProfile: updateUserProfile,
        updateKopConfig,
        resetToDefaultData,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
