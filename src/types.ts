export type ModuleType =
  | 'Modul Ajar'
  | 'RPP Mendalam'
  | 'Modul Ajar PAUD'
  | 'Modul Ajar Inklusi / SLB'
  | 'Alur Tujuan Pembelajaran (ATP)'
  | 'Capaian Pembelajaran (CP)'
  | 'Program Tahunan (Prota)'
  | 'Program Semester (Promes)'
  | 'Asesmen & Rubrik'
  | 'Bahan Ajar & LKPD';

export type CurriculumApproach = 'merdeka' | 'kbc' | 'hybrid' | 'k13';
export type DocumentCategory = 'modul_ajar' | 'rpp' | 'paud' | 'slb';
export type SatuanPendidikan = 'sd' | 'mi' | 'paud' | 'slb' | 'smp' | 'sma';

export type FaseType = 'Fase Fondasi' | 'Fase A' | 'Fase B' | 'Fase C' | 'Fase D' | 'Fase E' | 'Fase F';

export type StatusType = 'Draft' | 'Review' | 'Terverifikasi' | 'Diterbitkan';

export type SubjectType =
  | 'Bahasa Indonesia'
  | 'Matematika'
  | 'IPAS'
  | 'Pendidikan Pancasila'
  | 'Pendidikan Agama Islam'
  | 'PJOK'
  | 'Seni Rupa'
  | 'Seni Musik'
  | 'Seni Tari'
  | 'Seni Teater'
  | 'Bahasa Inggris'
  | 'Koding & Kecerdasan Artifisial'
  | "Al-Qur'an Hadis"
  | 'Akidah Akhlak'
  | 'Fikih'
  | 'Sejarah Kebudayaan Islam (SKI)'
  | 'Bahasa Arab'
  | 'Muatan Lokal / Bahasa Daerah'
  | string;

export interface LessonSteps {
  pendahuluan: string[];
  inti: string[];
  penutup: string[];
}

export interface SupplementaryDocuments {
  lkpdHtml?: string;
  bahanAjarHtml?: string;
  silabusHtml?: string;
  protaHtml?: string;
  prosemHtml?: string;
}

export interface TeachingModule {
  id: string;
  code: string;
  title: string;
  type: ModuleType;
  curriculumApproach?: CurriculumApproach;
  documentCategory?: DocumentCategory;
  satuanPendidikan?: SatuanPendidikan;
  kekhususanABK?: string;
  fase: FaseType;
  grade: number; // 1 - 6
  subject: SubjectType;
  semester: 1 | 2;
  academicYear: string;
  author: string;
  nipAuthor?: string;
  school: string;
  headmaster?: string;
  nipHeadmaster?: string;
  kopConfig?: KopConfig;
  status: StatusType;
  allocatedHours: string;
  jumlahPertemuan?: number;
  jpPerPertemuan?: number;
  durasiJP?: number;
  totalJP?: number;
  targetStudents: string;
  profilPancasila: string[];
  dpl8Selected?: string[];
  kbcTemaSelected?: string[];
  sesSelected?: string[];
  capaianPembelajaran: string;
  tujuanPembelajaran: string[];
  pemahamanBermakna: string;
  pertanyaanPemantik: string[];
  modelPembelajaran: string;
  metodePembelajaran?: string[];
  saranaPrasarana: string[];
  langkahKegiatan: LessonSteps;
  asesmenDesc: string;
  fullDocumentHtml?: string;
  supplementaryDocs?: SupplementaryDocuments;
  lampiran: {
    lkpd: string;
    materiSingkat: string;
    rubrikPenilaian: string;
    remedialPengayaan: string;
  };
  downloadsCount: number;
  rating: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface KPIMetric {
  id: string;
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  subtitle: string;
  iconName: string;
}

export interface SubjectStats {
  subject: string;
  count: number;
  percentage: number;
  color: string;
}

export interface MonthlyTrend {
  month: string;
  created: number;
  downloaded: number;
}

export interface KopConfig {
  showKop: boolean;
  showSignature: boolean;
  leftLogoUrl: string; // Base64 data URL or image path (Logo Kiri: Dinas/Pemda/Tut Wuri)
  rightLogoUrl: string; // Base64 data URL or image path (Logo Kanan: Sekolah)
  leftLogoSize: number; // e.g. 70 (in px)
  rightLogoSize: number; // e.g. 70 (in px)
  governmentHeader: string;
  departmentHeader: string;
  schoolName: string;
  schoolAddress: string;
  schoolContact: string;
  signaturePlace: string;
  signatureDate: string;
  headmasterTitle: string;
  headmasterName: string;
  headmasterNip: string;
  teacherTitle: string;
  teacherName: string;
  teacherNip: string;
  headmasterSignatureUrl?: string;
  teacherSignatureUrl?: string;
  showDigitalSignature: boolean;
}

export interface UserProfile {
  name: string;
  nip: string;
  role: string;
  school: string;
  npsn: string;
  city: string;
  province: string;
  gradeAssigned: number;
  phone: string;
  email: string;
  activeSemester: 1 | 2;
  academicYear: string;
  headmasterName: string;
  headmasterNip: string;
  kopConfig?: KopConfig;
}

export interface SettingsBackupPayload {
  version: string;
  exportedAt: string;
  appName: string;
  type: 'settings_only' | 'full_database';
  userProfile: UserProfile;
  kopConfig: KopConfig;
  modules?: TeachingModule[];
  metadata?: {
    schoolName: string;
    teacherName: string;
    headmasterName: string;
    npsn: string;
    academicYear: string;
    hasLeftLogo: boolean;
    hasRightLogo: boolean;
    modulesCount?: number;
  };
}

export type QuestionType =
  | 'Pilihan Ganda'
  | 'Pilihan Ganda Kompleks'
  | 'Isian Singkat'
  | 'Uraian'
  | 'Menjodohkan'
  | 'Benar/Salah'
  | 'Campuran';

export type CognitiveLevel =
  | 'Paling Mudah (C1 Mengingat)'
  | 'Mudah (C2 Memahami)'
  | 'LOTS (C1-C2)'
  | 'MOTS (C3)'
  | 'HOTS (C4-C6)'
  | 'Proporsional (Campuran)';

export interface QuestionItem {
  id: string;
  number: number;
  type: 'Pilihan Ganda' | 'Pilihan Ganda Kompleks' | 'Isian Singkat' | 'Uraian' | 'Menjodohkan' | 'Benar/Salah';
  question: string;
  stimulus?: string;
  options?: string[]; // e.g. ["A. ...", "B. ...", "C. ...", "D. ..."]
  correctAnswer: string;
  discussion: string;
  cognitiveLevel: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'HOTS' | 'MOTS' | 'LOTS';
  indicator: string;
  score: number;
  pattern?: string; // Pola variasi: "Studi Kasus", "Analisis Data/Tabel", "Sebab-Akibat", "Pemecahan Masalah", "Komparasi", "Dialog Murid", dll.
  tpRef?: string; // Tujuan Pembelajaran spesifik untuk butir soal ini (berguna pada asesmen gabungan seluruh TP)
  topicRef?: string; // Lingkup materi spesifik untuk butir soal ini
}

export interface MultiTpItemConfig {
  id: string;
  tp: string;
  topic: string;
  count: number;
  enabled: boolean;
}

export interface GeneratedExam {
  id: string;
  title: string;
  subject: string;
  grade: string;
  fase: string;
  semester: number | string;
  academicYear: string;
  tp: string;
  topic: string;
  multiTpConfigs?: MultiTpItemConfig[]; // Konfigurasi detail jika dibuat dari seluruh TP
  isMultiTp?: boolean;
  questionType: QuestionType;
  questionCount: number;
  cognitiveLevel: string;
  questionStyle?: string;
  durationMinutes: number;
  kopConfig: KopConfig;
  questions: QuestionItem[];
  createdAt: string;
}

export interface BackupSnapshot {
  id: string;
  name: string;
  timestamp: string;
  type: 'settings_only' | 'full_database';
  data: SettingsBackupPayload;
}
