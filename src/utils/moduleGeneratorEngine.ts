import {
  TeachingModule,
  CurriculumApproach,
  DocumentCategory,
  SatuanPendidikan,
  FaseType,
  SubjectType,
  SupplementaryDocuments,
  KopConfig
} from '../types';
import { DEFAULT_TUT_WURI_LOGO, DEFAULT_SCHOOL_LOGO } from '../data/defaultLogos';
import { initialKopConfig } from '../data/mockData';

export interface ModuleGenerationInput {
  satuanPendidikan: SatuanPendidikan;
  documentType: DocumentCategory; // 'modul_ajar' | 'rpp' | 'paud' | 'slb'
  curriculum: CurriculumApproach; // 'merdeka' | 'kbc' | 'hybrid' | 'k13'
  jenjangLabel: string;
  kelas: string;
  fase: FaseType;
  mapel: SubjectType;
  topic: string;
  tahunAjaran: string;
  semester: 1 | 2;
  namaSekolah: string;
  namaPenyusun: string;
  nipPenyusun?: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah?: string;
  targetPesertaDidik: string;
  capaianPembelajaran?: string;
  dpl8Selected: string[];
  kbcTemaSelected: string[];
  sesSelected: string[];
  jumlahPertemuan: number;
  jpPerPertemuan: number;
  durasiJP: number;
  learningModel: string;
  selectedMetode: string[];
  kekhususanABK?: string;
  kopConfig?: KopConfig;
}

// Helper to safely resolve logo data URI (supporting user custom logos, defaults, and migrating legacy svgs)
function resolveKopLogo(logoUrl: string | undefined, defaultLogo: string): string {
  if (logoUrl === '') return '';
  if (!logoUrl || logoUrl.startsWith('data:image/svg+xml;utf8')) return defaultLogo;
  return logoUrl;
}

// Generate Official Indonesian School Letterhead (KOP SURAT RESMI)
export function generateKopSuratHtml(config?: Partial<KopConfig>, schoolFallback?: string): string {
  const c = { ...initialKopConfig, ...(config || {}) };
  if (c.showKop === false) return '';

  const school = c.schoolName || schoolFallback || 'SD NEGERI 01 MENTENG JAYA';
  const gov = c.governmentHeader || 'PEMERINTAH PROVINSI DKI JAKARTA';
  const dept = c.departmentHeader || 'DINAS PENDIDIKAN DAN KEBUDAYAAN';
  const addr = c.schoolAddress || 'Jl. Menteng Raya No. 10, RT.01/RW.02, Kec. Menteng, Kota Jakarta Pusat 10340';
  const contact = c.schoolContact || 'Telp: (021) 3192849 • Posel: sdn01menteng@sekolah.belajar.id';
  const leftLogo = resolveKopLogo(c.leftLogoUrl, DEFAULT_TUT_WURI_LOGO);
  const rightLogo = resolveKopLogo(c.rightLogoUrl, DEFAULT_SCHOOL_LOGO);
  const leftSize = c.leftLogoSize || 70;
  const rightSize = c.rightLogoSize || 70;

  return `<!-- KOP_SURAT_START -->
  <div class="kop-surat-official pb-3 mb-6" style="border-bottom: 3px double #000000; font-family: 'Times New Roman', 'Liberation Serif', serif; color: #000000; width: 100%;">
    <table class="kop-table" style="width: 100%; border-collapse: collapse; border: none; margin: 0; padding: 0;">
      <tbody>
        <tr style="border: none;">
          ${leftLogo ? `
          <td style="width: ${leftSize}px; text-align: center; vertical-align: middle; border: none; padding: 0 10px 0 0;">
            <img src="${leftLogo}" alt="Logo Instansi Kiri" style="width: ${leftSize}px; max-height: ${leftSize}px; object-fit: contain; display: block; margin: 0 auto;" />
          </td>
          ` : `
          <td style="width: ${rightSize}px; border: none; padding: 0;"></td>
          `}
          <td style="text-align: center; vertical-align: middle; border: none; padding: 0 8px;">
            ${gov ? `<div style="font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.25; color: #111;">${gov}</div>` : ''}
            ${dept ? `<div style="font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.25; margin-top: 1px; color: #111;">${dept}</div>` : ''}
            <div style="font-size: 14pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.25; margin-top: 3px; color: #000;">${school}</div>
            ${addr ? `<div style="font-size: 9pt; font-family: Arial, sans-serif; line-height: 1.3; margin-top: 2px; color: #333;">${addr}</div>` : ''}
            ${contact ? `<div style="font-size: 8.5pt; font-family: Arial, sans-serif; line-height: 1.3; margin-top: 1px; color: #444;">${contact}</div>` : ''}
          </td>
          ${rightLogo ? `
          <td style="width: ${rightSize}px; text-align: center; vertical-align: middle; border: none; padding: 0 0 0 10px;">
            <img src="${rightLogo}" alt="Logo Sekolah Kanan" style="width: ${rightSize}px; max-height: ${rightSize}px; object-fit: contain; display: block; margin: 0 auto;" />
          </td>
          ` : `
          <td style="width: ${leftSize}px; border: none; padding: 0;"></td>
          `}
        </tr>
      </tbody>
    </table>
    <div style="border-bottom: 2.5px solid #000; margin-top: 6px;"></div>
    <div style="border-bottom: 1px solid #000; margin-top: 1.5px;"></div>
  </div>
  <!-- KOP_SURAT_END -->`;
}

// Generate Official Signatures Block (Pengesahan Kepala Sekolah & Guru)
export function generateSignatureBlockHtml(config?: Partial<KopConfig>, schoolFallback?: string): string {
  const c = { ...initialKopConfig, ...(config || {}) };
  if (c.showSignature === false) return '';

  const school = c.schoolName || schoolFallback || 'SD Negeri';
  const today = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date());
  const place = c.signaturePlace || 'Jakarta Pusat';
  const dateStr = c.signatureDate || today;
  const headTitle = c.headmasterTitle || `Kepala ${school}`;
  const headName = c.headmasterName || 'Dra. Hj. Siti Rohmah, M.Pd.';
  const headNip = c.headmasterNip || '19720315 199603 2 003';
  const teacherTitle = c.teacherTitle || 'Guru Kelas / Penyusun Modul';
  const teacherName = c.teacherName || 'Budi Santoso, S.Pd.SD';
  const teacherNip = c.teacherNip || '19850412 201001 1 014';

  return `<!-- SIGNATURE_BLOCK_START -->
  <div class="mt-8 pt-4 signature-section" style="page-break-inside: avoid; break-inside: avoid; border-top: 1px solid #cbd5e1; font-family: 'Times New Roman', 'Liberation Serif', serif; font-size: 10pt; color: #000;">
    <table class="signature-table" style="width: 100%; border-collapse: collapse; border: none;">
      <tbody>
        <tr>
          <td style="width: 48%; text-align: center; vertical-align: top; border: none; padding: 4px;">
            <p style="margin: 0; font-size: 9.5pt;">Mengetahui,</p>
            <p style="margin: 2px 0 0 0; font-weight: bold;">${headTitle}</p>
            <div style="height: 64px;"></div>
            <p style="margin: 0; font-weight: bold; text-decoration: underline;">${headName}</p>
            <p style="margin: 2px 0 0 0; font-size: 9pt; color: #475569;">NIP. ${headNip}</p>
          </td>
          <td style="width: 4%; border: none;"></td>
          <td style="width: 48%; text-align: center; vertical-align: top; border: none; padding: 4px;">
            <p style="margin: 0; font-size: 9.5pt;">${place}, ${dateStr}</p>
            <p style="margin: 2px 0 0 0; font-weight: bold;">${teacherTitle}</p>
            <div style="height: 64px;"></div>
            <p style="margin: 0; font-weight: bold; text-decoration: underline;">${teacherName}</p>
            <p style="margin: 2px 0 0 0; font-size: 9pt; color: #475569;">NIP. ${teacherNip}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- SIGNATURE_BLOCK_END -->`;
}

// Dynamically refresh or synchronize KOP and Signatures inside existing document HTML
export function updateDocumentKopAndSignature(
  html: string,
  newKopConfig: KopConfig,
  schoolName?: string
): string {
  if (!html) return html;
  const newKopHtml = generateKopSuratHtml(newKopConfig, schoolName);
  const newSignatureHtml = generateSignatureBlockHtml(newKopConfig, schoolName);

  let updated = html;
  // Replace KOP if markers exist
  if (updated.includes('<!-- KOP_SURAT_START -->')) {
    updated = updated.replace(
      /<!-- KOP_SURAT_START -->[\s\S]*?<!-- KOP_SURAT_END -->/,
      newKopHtml
    );
  } else if (updated.includes('kop-surat-official')) {
    // Fallback: replace kop-surat-official element
    updated = updated.replace(
      /<div class="kop-surat-official[\s\S]*?<\/table>[\s\S]*?<\/div>\s*<\/div>/i,
      newKopHtml
    );
  }

  // Replace signature if markers exist
  if (updated.includes('<!-- SIGNATURE_BLOCK_START -->')) {
    updated = updated.replace(
      /<!-- SIGNATURE_BLOCK_START -->[\s\S]*?<!-- SIGNATURE_BLOCK_END -->/,
      newSignatureHtml
    );
  }

  return updated;
}

export const DPL8_LABELS: Record<string, string> = {
  keimanan: 'Keimanan & Ketakwaan',
  kewargaan: 'Kewargaan',
  'penalaran-kritis': 'Penalaran Kritis',
  kreativitas: 'Kreativitas',
  kolaborasi: 'Kolaborasi',
  kemandirian: 'Kemandirian',
  kesehatan: 'Kesehatan',
  komunikasi: 'Komunikasi'
};

export const KBC_TEMA_LABELS: Record<string, string> = {
  'cinta-allah-dan-rasulnya': 'Cinta Allah Swt. dan Rasul-Nya',
  'cinta-ilmu': 'Cinta Ilmu',
  'cinta-lingkungan': 'Cinta Lingkungan',
  'cinta-diri-dan-sesama': 'Cinta Diri dan Sesama Manusia',
  'cinta-tanah-air': 'Cinta Tanah Air'
};

export const SES_LABELS: Record<string, string> = {
  'kontrol-diri': 'Kontrol Diri',
  'tanggung-jawab': 'Tanggung Jawab',
  gigih: 'Gigih',
  optimisme: 'Optimisme',
  empati: 'Empati',
  toleransi: 'Toleransi',
  'mudah-bergaul': 'Mudah Bergaul'
};

export const MODEL_LABELS: Record<string, string> = {
  'deep-learning': 'Deep Learning (6E) - Berkesadaran, Bermakna, Menggembirakan',
  fids: 'FIDS (Feel, Imagine, Do, Share) - Kurikulum Berbasis Cinta',
  pbl: 'Problem-Based Learning (PBL) - Pemecahan Masalah Kontekstual',
  pjbl: 'Project-Based Learning (PjBL) - Pembelajaran Berbasis Proyek',
  discovery: 'Discovery Learning - Penemuan Konsep Mandiri & Terbimbing',
  inquiry: 'Inquiry-Based Learning - Pembelajaran Berbasis Penyelidikan',
  cooperative: 'Cooperative Learning - Kolaborasi & Kerja Sama Tim',
  differentiated: 'Differentiated Learning - Pembelajaran Berdiferensiasi',
  arka: 'ARKA (Aktivitas, Refleksi, Konseptualisasi, Aplikasi)',
  contextual: 'Contextual Teaching and Learning (CTL)'
};

// Generate Full HTML for Teaching Module / RPP
export function generateModuleHtml(input: ModuleGenerationInput): string {
  const {
    documentType,
    curriculum,
    satuanPendidikan,
    kelas,
    fase,
    mapel,
    topic,
    tahunAjaran,
    semester,
    namaSekolah,
    namaPenyusun,
    nipPenyusun,
    namaKepalaSekolah,
    nipKepalaSekolah,
    targetPesertaDidik,
    jumlahPertemuan,
    jpPerPertemuan,
    durasiJP,
    learningModel,
    selectedMetode,
    dpl8Selected,
    kbcTemaSelected,
    sesSelected,
    kekhususanABK
  } = input;

  const totalJP = jumlahPertemuan * jpPerPertemuan;
  const totalMenit = totalJP * durasiJP;
  const menitPerPertemuan = jpPerPertemuan * durasiJP;
  const isKBC = curriculum === 'kbc' || curriculum === 'hybrid';
  const isMerdeka = curriculum === 'merdeka' || curriculum === 'hybrid';
  const isRPP = documentType === 'rpp';
  const isPAUD = documentType === 'paud' || satuanPendidikan === 'paud';
  const isSLB = documentType === 'slb' || satuanPendidikan === 'slb';

  const docTitle = isRPP
    ? 'PERENCANAAN PEMBELAJARAN MENDALAM (RPP 1-LEMBAR DETAIL)'
    : isPAUD
    ? 'MODUL AJAR PAUD / FASE FONDASI'
    : isSLB
    ? 'MODUL AJAR PENDIDIKAN KHUSUS (SLB / INKLUSI)'
    : isKBC
    ? 'MODUL AJAR KURIKULUM BERBASIS CINTA (KBC)'
    : 'MODUL AJAR KURIKULUM MERDEKA';

  const regText = isKBC
    ? 'Keputusan Dirjen Pendidikan Islam No. 6077/2025 (Kemenag RI) & Permendikdasmen No. 1/2026'
    : 'Permendikdasmen No. 1 Tahun 2026 & Kepka BSKAP No. 020 Tahun 2026 (Kerangka 8334 Deep Learning)';

  // Build Meetings HTML
  const meetingsHtml = Array.from({ length: jumlahPertemuan }, (_, idx) => {
    const pertNum = idx + 1;
    const menitAwal = isPAUD ? 30 : Math.round(menitPerPertemuan * 0.2);
    const menitAkhir = isPAUD ? 30 : Math.round(menitPerPertemuan * 0.15);
    const menitInti = menitPerPertemuan - menitAwal - menitAkhir;

    if (isKBC) {
      return `
      <div class="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2 pb-2 border-b border-slate-200">
          <span class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">${pertNum}</span>
          PERTEMUAN ${pertNum} (${jpPerPertemuan} JP &times; ${durasiJP} menit = ${menitPerPertemuan} menit)
        </h4>

        <!-- Pembukaan Spiritual -->
        <div class="mt-3">
          <p class="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
            🟢 PEMBUKAAN SPIRITUAL (Berkesadaran / Mindful &plusmn;${menitAwal} menit)
          </p>
          <ul class="text-xs text-slate-700 mt-1 space-y-1 list-disc pl-5">
            <li>Guru menyapa dengan senyum kasih sayang dan salam hangat, mengajak siswa berdoa bersama dengan penghayatan makna.</li>
            <li><strong>Tadabbur Singkat:</strong> Guru mengajak murid mengamati keindahan ciptaan Allah dan nikmat sehat terkait topik <em>${topic}</em>.</li>
            <li>Guru membangun iklim kelas aman, nyaman, dan bebas intimidasi, serta menyampaikan tujuan pembelajaran dengan menggembirakan.</li>
          </ul>
        </div>

        <!-- Kegiatan Inti FIDS -->
        <div class="mt-4">
          <p class="text-xs font-bold text-blue-800 flex items-center gap-1.5">
            🔵 KEGIATAN INTI - METODE FIDS & PEMBELAJARAN MENDALAM (&plusmn;${menitInti} menit)
          </p>
          <div class="mt-2 space-y-2 text-xs">
            <div class="p-2.5 rounded-lg bg-white border border-blue-100">
              <strong class="text-blue-900">1. FEEL (Merasakan & Empati):</strong>
              <p class="text-slate-700 mt-0.5">Siswa diajak mengamati fenomena kontekstual mengenai <strong>${topic}</strong>, merasakan tantangan yang dihadapi sesama, serta menyadari pentingnya empati dan kasih sayang.</p>
            </div>
            <div class="p-2.5 rounded-lg bg-white border border-blue-100">
              <strong class="text-blue-900">2. IMAGINE (Membayangkan Solusi):</strong>
              <p class="text-slate-700 mt-0.5">Dalam kelompok kecil, siswa berdiskusi menuangkan ide-ide solutif, menghubungkan konsep pengetahuan dengan nilai cinta ilmu dan cinta sesama.</p>
            </div>
            <div class="p-2.5 rounded-lg bg-white border border-blue-100">
              <strong class="text-blue-900">3. DO (Melakukan Aksi Nyata):</strong>
              <p class="text-slate-700 mt-0.5">Siswa secara aktif mempraktikkan tugas eksplorasi/eksperimen pada LKPD Pertemuan ${pertNum}, bekerja sama dengan gotong royong dan saling menguatkan.</p>
            </div>
            <div class="p-2.5 rounded-lg bg-white border border-blue-100">
              <strong class="text-blue-900">4. SHARE (Membagikan & Menginspirasi):</strong>
              <p class="text-slate-700 mt-0.5">Setiap kelompok mempresentasikan karyanya dengan bahasa santun, saling memberikan umpan balik apresiatif (Cinta Diri & Sesama).</p>
            </div>
          </div>
        </div>

        <!-- Penutup Muhasabah -->
        <div class="mt-4">
          <p class="text-xs font-bold text-amber-800 flex items-center gap-1.5">
            🟡 PENUTUP - MUHASABAH & DOA (&plusmn;${menitAkhir} menit)
          </p>
          <ul class="text-xs text-slate-700 mt-1 space-y-1 list-disc pl-5">
            <li><strong>Muhasabah Belajar:</strong> Siswa menuliskan satu hikmah kebaikan yang didapat hari ini pada Jurnal Muhasabah pribadi.</li>
            <li>Guru memberikan penguatan nilai tauhid, apresiasi kejujuran, dan kehangatan ucapan terima kasih kepada seluruh murid.</li>
            <li>Menutup pembelajaran dengan doa penutup majelis dan saling mendoakan keselamatan.</li>
          </ul>
        </div>
      </div>`;
    }

    if (isRPP) {
      return `
      <div class="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div class="flex items-center justify-between pb-2 border-b border-slate-200">
          <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">${pertNum}</span>
            PERTEMUAN KE-${pertNum} dari ${jumlahPertemuan}
          </h4>
          <span class="text-xs font-mono font-bold text-slate-500">${jpPerPertemuan} JP &times; ${durasiJP} menit = ${menitPerPertemuan} menit</span>
        </div>

        <div class="mt-3 overflow-x-auto">
          <table class="w-full text-xs text-slate-700 border-collapse border border-slate-300">
            <thead>
              <tr class="bg-slate-100 text-slate-800">
                <th class="border border-slate-300 p-2 text-left w-36">Tahap / Waktu</th>
                <th class="border border-slate-300 p-2 text-left">Aktivitas Guru (Instruksi & Fasilitasi)</th>
                <th class="border border-slate-300 p-2 text-left">Aktivitas Siswa (Pusat Pembelajaran)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-slate-300 p-2 align-top font-bold text-emerald-700">
                  Pendahuluan<br><span class="font-normal text-slate-500">(&plusmn;${menitAwal} menit)</span>
                </td>
                <td class="border border-slate-300 p-2 align-top">
                  1. Membuka kelas dengan salam ceria, presensi, dan ice breaking kesadaran (Mindful Moment).<br>
                  2. Apersepsi: Menampilkan gambar/masalah pemantik terkait <em>${topic}</em>.<br>
                  3. Menyampaikan tujuan pembelajaran dan kesepakatan kelas.
                </td>
                <td class="border border-slate-300 p-2 align-top">
                  1. Menjawab salam, berdoa khidmat, dan memfokuskan perhatian pada kegiatan awal.<br>
                  2. Mengamati stimulus dan merespons pertanyaan pemantik secara antusias.<br>
                  3. Memahami target pencapaian belajar pertemuan ini.
                </td>
              </tr>
              <tr class="bg-blue-50/40">
                <td class="border border-slate-300 p-2 align-top font-bold text-blue-700">
                  Kegiatan Inti<br><span class="font-normal text-slate-500">(&plusmn;${menitInti} menit)</span><br>
                  <span class="text-[10px] text-blue-800">${MODEL_LABELS[learningModel] || learningModel}</span>
                </td>
                <td class="border border-slate-300 p-2 align-top">
                  <strong>1. Memahami (Meaningful):</strong> Memandu siswa mengidentifikasi masalah esensial terkait ${topic}.<br>
                  <strong>2. Mengaplikasi (Active):</strong> Membagikan LKPD Pertemuan ${pertNum}, memfasilitasi diferensiasi konten & proses kelompok.<br>
                  <strong>3. Supervisi Terbimbing:</strong> Memberikan scaffolding pada kelompok yang membutuhkan bimbingan intensif.
                </td>
                <td class="border border-slate-300 p-2 align-top">
                  <strong>1. Eksplorasi:</strong> Membaca sumber belajar, mendiskusikan studi kasus dalam kelompok heterogen.<br>
                  <strong>2. Investigasi & Karya:</strong> Mengerjakan lembar kerja, mengolah data, dan menyusun laporan/produk kreatif.<br>
                  <strong>3. Presentasi:</strong> Menyajikan hasil di hadapan kelas dan menanggapi umpan balik teman.
                </td>
              </tr>
              <tr>
                <td class="border border-slate-300 p-2 align-top font-bold text-amber-700">
                  Penutup<br><span class="font-normal text-slate-500">(&plusmn;${menitAkhir} menit)</span>
                </td>
                <td class="border border-slate-300 p-2 align-top">
                  1. Memandu siswa menyimpulkan poin inti konsep pembelajaran.<br>
                  2. Melakukan evaluasi formatif kilat (exit ticket / kuis 2 soal).<br>
                  3. Memberikan umpan balik positif dan doa penutup.
                </td>
                <td class="border border-slate-300 p-2 align-top">
                  1. Bersama-sama merumuskan kesimpulan materi ${topic}.<br>
                  2. Menjawab lembar refleksi diri (apa yang sudah dipahami & disukai).<br>
                  3. Mengucapkan syukur dan berdoa bersama.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>`;
    }

    // Standard Kurikulum Merdeka (Deep Learning 8334)
    return `
    <div class="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
      <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2 pb-2 border-b border-slate-200">
        <span class="w-6 h-6 rounded-full bg-[#00529B] text-white flex items-center justify-center text-xs">${pertNum}</span>
        PERTEMUAN ${pertNum} (${jpPerPertemuan} JP &times; ${durasiJP} menit = ${menitPerPertemuan} menit)
      </h4>

      <div class="mt-3 space-y-3 text-xs">
        <div>
          <p class="font-bold text-emerald-800">🟢 1. PENDAHULUAN (Berkesadaran / Mindful &plusmn;${menitAwal} menit)</p>
          <ul class="text-slate-700 mt-1 space-y-1 list-disc pl-5">
            <li>Guru membuka pelajaran dengan salam hangat, doa bersama, dan mengecek kehadiran murid dengan ceria.</li>
            <li><strong>Apersepsi Bermakna:</strong> Guru menghadirkan fenomena lingkungan nyata terkait topik <em>${topic}</em> untuk mengaktifkan skemata awal murid.</li>
            <li>Guru menyampaikan tujuan pembelajaran, alur aktivitas, dan kriteria ketercapaian secara transparan.</li>
          </ul>
        </div>

        <div>
          <p class="font-bold text-blue-800">🔵 2. KEGIATAN INTI - 3 PENGALAMAN BELAJAR (Deep Learning &plusmn;${menitInti} menit)</p>
          <div class="mt-2 space-y-2">
            <div class="p-2.5 rounded-lg bg-white border border-blue-100">
              <strong class="text-blue-900">A. Memahami (Konstruksi Konsep):</strong>
              <p class="text-slate-700 mt-0.5">Murid mengeksplorasi bahan bacaan, video edukatif, atau alat peraga peraga mengenai ${topic}. Murid berdiskusi menjawab pertanyaan pemantik dalam kelompok.</p>
            </div>
            <div class="p-2.5 rounded-lg bg-white border border-blue-100">
              <strong class="text-blue-900">B. Mengaplikasi (Praktik Kolaboratif):</strong>
              <p class="text-slate-700 mt-0.5">Murid mengerjakan Lembar Kerja Peserta Didik (LKPD Pertemuan ${pertNum}) menggunakan model ${MODEL_LABELS[learningModel] || learningModel}. Guru melakukan pendampingan berdiferensiasi.</p>
            </div>
            <div class="p-2.5 rounded-lg bg-white border border-blue-100">
              <strong class="text-blue-900">C. Merefleksi (Evaluasi & Galeri Belajar):</strong>
              <p class="text-slate-700 mt-0.5">Kelompok mendemonstrasikan hasil penyelidikan di depan kelas atau melalui mini gallery walk. Teman sejawat memberikan tanggapan apresiatif konstruktif.</p>
            </div>
          </div>
        </div>

        <div>
          <p class="font-bold text-amber-800">🟡 3. PENUTUP (Menggembirakan / Joyful &plusmn;${menitAkhir} menit)</p>
          <ul class="text-slate-700 mt-1 space-y-1 list-disc pl-5">
            <li>Murid bersama guru merangkum simpulan komprehensif atas materi ${topic}.</li>
            <li>Refleksi 3-2-1: 3 hal baru yang dipahami, 2 hal yang paling menarik, 1 hal yang ingin didalami lebih lanjut.</li>
            <li>Apresiasi kinerja murid, informasi materi pertemuan selanjutnya, dan doa penutup.</li>
          </ul>
        </div>
      </div>
    </div>`;
  }).join('');

  return `
  <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 text-slate-900 space-y-6 max-w-4xl mx-auto font-sans leading-relaxed">
    
    <!-- KOP SURAT RESMI -->
    ${generateKopSuratHtml(input.kopConfig, input.namaSekolah)}

    <!-- HEADER RESMI -->
    <div class="text-center pb-4 border-b-2 border-slate-800">
      <h2 class="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">${docTitle}</h2>
      <p class="text-xs font-semibold text-slate-600 mt-1">Dasar Hukum: ${regText}</p>
      <div class="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
        <span>Tahun Ajaran ${tahunAjaran}</span> • <span>Semester ${semester === 1 ? '1 (Ganjil)' : '2 (Genap)'}</span>
      </div>
    </div>

    <!-- BAGIAN 1: INFORMASI UMUM -->
    <div>
      <h3 class="text-sm font-extrabold text-blue-900 uppercase tracking-wide pb-1 border-b border-blue-200 flex items-center gap-2">
        <span>BAGIAN 1: INFORMASI UMUM</span>
      </h3>
      <table class="w-full mt-3 text-xs border-collapse">
        <tbody>
          <tr class="border-b border-slate-100"><td class="py-1.5 font-bold text-slate-600 w-44">Nama Satuan Pendidikan</td><td class="py-1.5 font-semibold text-slate-800">: ${namaSekolah}</td></tr>
          <tr class="border-b border-slate-100"><td class="py-1.5 font-bold text-slate-600">Penyusun / Guru Pengampu</td><td class="py-1.5 font-semibold text-slate-800">: ${namaPenyusun} ${nipPenyusun ? `(NIP: ${nipPenyusun})` : ''}</td></tr>
          <tr class="border-b border-slate-100"><td class="py-1.5 font-bold text-slate-600">Mata Pelajaran</td><td class="py-1.5 font-semibold text-slate-800">: ${mapel}</td></tr>
          <tr class="border-b border-slate-100"><td class="py-1.5 font-bold text-slate-600">Fase / Kelas</td><td class="py-1.5 font-semibold text-slate-800">: ${fase} / Kelas ${kelas} ${satuanPendidikan.toUpperCase()}</td></tr>
          <tr class="border-b border-slate-100"><td class="py-1.5 font-bold text-slate-600">Topik / Lingkup Materi</td><td class="py-1.5 font-extrabold text-blue-700">: ${topic}</td></tr>
          <tr class="border-b border-slate-100"><td class="py-1.5 font-bold text-slate-600">Alokasi Waktu</td><td class="py-1.5 font-semibold text-slate-800">: ${jumlahPertemuan} Pertemuan (${totalJP} JP &times; ${durasiJP} menit = ${totalMenit} menit)</td></tr>
          <tr class="border-b border-slate-100"><td class="py-1.5 font-bold text-slate-600">Target Peserta Didik</td><td class="py-1.5 font-semibold text-slate-800">: ${targetPesertaDidik}</td></tr>
          <tr class="border-b border-slate-100"><td class="py-1.5 font-bold text-slate-600">Model Pembelajaran</td><td class="py-1.5 font-semibold text-slate-800">: ${MODEL_LABELS[learningModel] || learningModel}</td></tr>
          ${selectedMetode && selectedMetode.length > 0 ? `<tr class="border-b border-slate-100"><td class="py-1.5 font-bold text-slate-600">Metode Pembelajaran</td><td class="py-1.5 font-semibold text-slate-800">: ${selectedMetode.join(', ')}</td></tr>` : ''}
          ${isSLB && kekhususanABK ? `<tr class="border-b border-slate-100"><td class="py-1.5 font-bold text-rose-700">Kekhususan ABK</td><td class="py-1.5 font-bold text-rose-700">: ${kekhususanABK}</td></tr>` : ''}
        </tbody>
      </table>
    </div>

    ${isKBC ? `
    <!-- BAGIAN DALIL TERKAIT (KBC) -->
    <div class="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
      <h3 class="text-xs font-extrabold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
        📖 DALIL AL-QUR'AN & HADITS TERKAIT
      </h3>
      <div class="mt-2 space-y-2 text-xs text-emerald-950">
        <p><strong>QS. Ar-Rahman [55]: 1-4:</strong> <em>"Allah Yang Maha Pengasih, Yang telah mengajarkan Al-Qur'an. Dia menciptakan manusia, mengajarnya pandai berbicara."</em></p>
        <p><strong>Hadits Riwayat Muslim:</strong> <em>"Perumpamaan orang-orang yang beriman dalam hal saling mencintai, menyayangi, dan mengasihi adalah bagaikan satu tubuh. Apabila satu anggota tubuh sakit, maka seluruh tubuh ikut merasakannya."</em></p>
      </div>
    </div>` : ''}

    <!-- BAGIAN 2: CAPAIAN & TUJUAN PEMBELAJARAN -->
    <div>
      <h3 class="text-sm font-extrabold text-blue-900 uppercase tracking-wide pb-1 border-b border-blue-200">
        BAGIAN 2: CAPAIAN PEMBELAJARAN & TUJUAN PEMBELAJARAN
      </h3>
      <div class="mt-3 space-y-3 text-xs">
        <div>
          <strong class="text-slate-800 font-bold block">A. Capaian Pembelajaran (CP) ${fase}:</strong>
          <p class="text-slate-700 mt-1 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
            Peserta didik mampu memahami dan menganalisis secara mendalam konsep esensial mengenai <strong>${topic}</strong>, menghubungkannya dengan konteks kehidupan sehari-hari, serta mendemonstrasikan keterampilan berpikir kritis, kolaboratif, dan solutif yang berkesadaran.
          </p>
        </div>
        <div>
          <strong class="text-slate-800 font-bold block">B. Alur Tujuan Pembelajaran (ATP) & Tujuan Pembelajaran (TP):</strong>
          <ul class="text-slate-700 mt-1 space-y-1.5 list-disc pl-5">
            <li><strong>TP 1 (Memahami):</strong> Peserta didik dapat mengidentifikasi fakta, prinsip dasar, dan karakteristik penting dari <em>${topic}</em> dengan tepat.</li>
            <li><strong>TP 2 (Mengaplikasi):</strong> Peserta didik mampu menganalisis hubungan sebab-akibat, memecahkan masalah kontekstual, dan menyelesaikan penugasan LKPD secara kolaboratif.</li>
            <li><strong>TP 3 (Merefleksi):</strong> Peserta didik dapat menyajikan simpulan karya serta merefleksikan nilai-nilai karakter dalam kehidupan pribadi dan sosial.</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- BAGIAN 3: PEMAHAMAN BERMAKNA & PERTANYAAN PEMANTIK -->
    <div>
      <h3 class="text-sm font-extrabold text-blue-900 uppercase tracking-wide pb-1 border-b border-blue-200">
        BAGIAN 3: PEMAHAMAN BERMAKNA (DEEP LEARNING) & PERTANYAAN PEMANTIK
      </h3>
      <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100">
          <strong class="text-blue-900 block mb-1">🌟 Pemahaman Bermakna (Hikmah & 'Ibrah):</strong>
          <p class="text-slate-700">
            Materi <em>${topic}</em> bukan sekadar hafalan teoritis, melainkan bekal pemahaman untuk menumbuhkan rasa syukur, menjaga keharmonisan lingkungan, dan menyelesaikan persoalan riil secara arif dan bijaksana.
          </p>
        </div>
        <div class="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100">
          <strong class="text-amber-900 block mb-1">❓ Pertanyaan Pemantik (Tadabbur):</strong>
          <ul class="text-slate-700 space-y-1 list-disc pl-4">
            <li>Bagaimana konsep <em>${topic}</em> dapat kita jumpai dalam kegiatan kita setiap hari?</li>
            <li>Apa yang akan terjadi jika kita mengabaikan prinsip-prinsip ini di sekitar kita?</li>
            <li>Langkah nyata apa yang bisa kita ambil mulai hari ini untuk menebarkan manfaat?</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- BAGIAN 4: DIMENSI PROFIL LULUSAN & KARAKTER -->
    <div>
      <h3 class="text-sm font-extrabold text-blue-900 uppercase tracking-wide pb-1 border-b border-blue-200">
        BAGIAN 4: DIMENSI PROFIL LULUSAN & NILAI KARAKTER
      </h3>
      <div class="mt-3 text-xs space-y-2">
        ${dpl8Selected && dpl8Selected.length > 0 ? `
        <div class="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <strong class="text-slate-800">📌 8 Dimensi Profil Kelulusan (Kerangka 8334 Permendikdasmen 1/2026):</strong>
          <div class="flex flex-wrap gap-1.5 mt-1.5">
            ${dpl8Selected.map(d => `<span class="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-semibold">${DPL8_LABELS[d] || d}</span>`).join('')}
          </div>
        </div>` : ''}

        ${isKBC && kbcTemaSelected && kbcTemaSelected.length > 0 ? `
        <div class="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <strong class="text-emerald-900">💚 Panca Cinta Kurikulum Berbasis Cinta (KBC Kemenag):</strong>
          <div class="flex flex-wrap gap-1.5 mt-1.5">
            ${kbcTemaSelected.map(t => `<span class="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 font-semibold">${KBC_TEMA_LABELS[t] || t}</span>`).join('')}
          </div>
        </div>` : ''}

        ${isKBC && sesSelected && sesSelected.length > 0 ? `
        <div class="p-3 rounded-lg bg-purple-50 border border-purple-200">
          <strong class="text-purple-900">💜 Prioritas Social Emotional Skills (SES):</strong>
          <div class="flex flex-wrap gap-1.5 mt-1.5">
            ${sesSelected.map(s => `<span class="px-2 py-0.5 rounded-md bg-purple-200 text-purple-900 font-semibold">${SES_LABELS[s] || s}</span>`).join('')}
          </div>
        </div>` : ''}
      </div>
    </div>

    <!-- BAGIAN 5: 4 KERANGKA UTAMA DEEP LEARNING (PERMENDIKDASMEN 1/2026) -->
    <div>
      <h3 class="text-sm font-extrabold text-blue-900 uppercase tracking-wide pb-1 border-b border-blue-200">
        BAGIAN 5: 4 KERANGKA UTAMA PEMBELAJARAN (Deep Learning)
      </h3>
      <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div class="p-3 rounded-lg border border-slate-200 bg-slate-50">
          <strong class="text-blue-900">1. Praktik Pedagogis:</strong>
          <p class="text-slate-600 mt-0.5">Menerapkan pendekatan mindful, inquiry terbimbing, serta scaffolding bertahap sesuai kesiapan murid.</p>
        </div>
        <div class="p-3 rounded-lg border border-slate-200 bg-slate-50">
          <strong class="text-blue-900">2. Lingkungan Belajar:</strong>
          <p class="text-slate-600 mt-0.5">Menciptakan ruang kelas yang inklusif, aman secara psikologis, apresiatif, dan bebas perundungan.</p>
        </div>
        <div class="p-3 rounded-lg border border-slate-200 bg-slate-50">
          <strong class="text-blue-900">3. Pemanfaatan Digital:</strong>
          <p class="text-slate-600 mt-0.5">Integrasi media audio-visual interaktif, simulasi digital, dan platform refleksi belajar daring.</p>
        </div>
        <div class="p-3 rounded-lg border border-slate-200 bg-slate-50">
          <strong class="text-blue-900">4. Kemitraan:</strong>
          <p class="text-slate-600 mt-0.5">Melibatkan orang tua dalam lembar observasi kebiasaan baik murid di rumah dan lingkungan sekitar.</p>
        </div>
      </div>
    </div>

    <!-- BAGIAN 6: SKENARIO KEGIATAN PEMBELAJARAN RINCI -->
    <div>
      <h3 class="text-sm font-extrabold text-blue-900 uppercase tracking-wide pb-1 border-b border-blue-200">
        BAGIAN 6: SKENARIO KEGIATAN PEMBELAJARAN PER PERTEMUAN
      </h3>
      ${meetingsHtml}
    </div>

    <!-- BAGIAN 7: ASESMEN HOLISTIK -->
    <div>
      <h3 class="text-sm font-extrabold text-blue-900 uppercase tracking-wide pb-1 border-b border-blue-200">
        BAGIAN 7: ASESMEN PEMBELAJARAN (HOLISTIK)
      </h3>
      <div class="mt-3 space-y-3 text-xs">
        <div class="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <strong class="text-slate-800">A. Asesmen Diagnostik (Awal Pembelajaran):</strong>
          <p class="text-slate-600 mt-0.5">Pertanyaan lisan apersepsi dan angket minat/gaya belajar siswa untuk memetakan kesiapan awal.</p>
        </div>
        <div class="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <strong class="text-slate-800">B. Asesmen Formatif (Selama Proses):</strong>
          <p class="text-slate-600 mt-0.5">Rubrik observasi keaktifan diskusi, penilaian unjuk kerja pada LKPD, dan catatan anekdot guru.</p>
        </div>
        <div class="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <strong class="text-slate-800">C. Asesmen Sumatif (Akhir Lingkup Materi):</strong>
          <p class="text-slate-600 mt-0.5">Tes tertulis objektif (Pilihan Ganda & Uraian Berpikir Tingkat Tinggi / HOTS) dan penilaian portofolio karya.</p>
        </div>
      </div>
    </div>

    <!-- BAGIAN 8: PENGAYAAN & REMEDIAL -->
    <div>
      <h3 class="text-sm font-extrabold text-blue-900 uppercase tracking-wide pb-1 border-b border-blue-200">
        BAGIAN 8: PENGAYAAN DAN REMEDIAL
      </h3>
      <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div class="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200">
          <strong class="text-emerald-900 block mb-1">✨ Program Pengayaan:</strong>
          <p class="text-slate-700">Diberikan kepada murid yang mencapai ketuntasan lebih cepat berupa proyek studi kasus mendalam atau peran sebagai tutor sebaya.</p>
        </div>
        <div class="p-3 rounded-lg bg-orange-50/50 border border-orange-200">
          <strong class="text-orange-900 block mb-1">🔧 Program Remedial:</strong>
          <p class="text-slate-700">Diberikan bimbingan terarah individual atau kelompok kecil pada indikator yang belum tuntas dengan modifikasi pendekatan visual/taktil.</p>
        </div>
      </div>
    </div>

    <!-- BAGIAN 9: PENGESAHAN TANDA TANGAN RESMI -->
    ${generateSignatureBlockHtml(input.kopConfig, input.namaSekolah)}

  </div>`;
}

// Generate Supplementary: LKPD
export function generateLKPDHtml(input: ModuleGenerationInput): string {
  const { topic, mapel, kelas, fase, namaSekolah, jumlahPertemuan } = input;
  
  const lkpdSections = Array.from({ length: Math.min(jumlahPertemuan, 3) }, (_, i) => {
    const pNum = i + 1;
    return `
    <div class="mt-6 p-4 rounded-xl border border-slate-300 bg-white space-y-4">
      <div class="border-b border-slate-200 pb-2 flex justify-between items-center">
        <h4 class="font-extrabold text-blue-900 text-sm">📋 LEMBAR KERJA PESERTA DIDIK (LKPD) - PERTEMUAN ${pNum}</h4>
        <span class="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">Waktu: 40 Menit</span>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
        <div>Nama Kelompok / Siswa: .......................................</div>
        <div>Kelas / No. Absen: ${kelas} / ..........</div>
      </div>

      <div class="text-xs space-y-3">
        <div>
          <strong class="text-slate-900 font-bold">A. Tujuan Aktivitas:</strong>
          <p class="text-slate-700">Melalui kegiatan eksplorasi terbimbing, peserta didik dapat membuktikan dan menganalisis konsep <em>${topic}</em> secara tepat.</p>
        </div>

        <div>
          <strong class="text-slate-900 font-bold">B. Petunjuk Kerja:</strong>
          <ol class="list-decimal pl-5 space-y-0.5 text-slate-700">
            <li>Bacalah instruksi kerja dan materi singkat dengan teliti.</li>
            <li>Bekerjasamalah secara aktif dengan anggota kelompokmu dengan saling menghargai pendapat.</li>
            <li>Lakukan penyelidikan dan catat hasil temuanmu pada tabel kerja di bawah ini.</li>
          </ol>
        </div>

        <div>
          <strong class="text-slate-900 font-bold">C. Tabel Lembar Observasi & Kerja Siswa:</strong>
          <table class="w-full mt-2 border-collapse border border-slate-300 text-slate-700">
            <thead>
              <tr class="bg-slate-100 text-center">
                <th class="border border-slate-300 p-2 w-12">No</th>
                <th class="border border-slate-300 p-2">Aspek Pengamatan / Langkah Percobaan</th>
                <th class="border border-slate-300 p-2">Hasil Pengamatan</th>
                <th class="border border-slate-300 p-2">Analisis & Alasan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-slate-300 p-2 text-center">1</td>
                <td class="border border-slate-300 p-2">Pengamatan awal karakteristik ${topic}</td>
                <td class="border border-slate-300 p-2 text-slate-400 italic">................................................</td>
                <td class="border border-slate-300 p-2 text-slate-400 italic">................................................</td>
              </tr>
              <tr>
                <td class="border border-slate-300 p-2 text-center">2</td>
                <td class="border border-slate-300 p-2">Hubungan variabel dalam studi kasus</td>
                <td class="border border-slate-300 p-2 text-slate-400 italic">................................................</td>
                <td class="border border-slate-300 p-2 text-slate-400 italic">................................................</td>
              </tr>
              <tr>
                <td class="border border-slate-300 p-2 text-center">3</td>
                <td class="border border-slate-300 p-2">Solusi konkret yang diusulkan kelompok</td>
                <td class="border border-slate-300 p-2 text-slate-400 italic">................................................</td>
                <td class="border border-slate-300 p-2 text-slate-400 italic">................................................</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <strong class="text-slate-900 font-bold">D. Pertanyaan Refleksi Siswa:</strong>
          <ul class="list-disc pl-5 space-y-1 text-slate-700">
            <li>Apa hal paling menyenangkan dan bermanfaat yang kamu pelajari hari ini?</li>
            <li>Bagaimana cara kelompokmu membagi tugas sehingga tugas ini selesai dengan baik?</li>
          </ul>
        </div>
      </div>
    </div>`;
  }).join('');

  return `
  <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 text-slate-900 space-y-6 max-w-4xl mx-auto font-sans leading-relaxed">
    <!-- KOP SURAT RESMI -->
    ${generateKopSuratHtml(input.kopConfig, input.namaSekolah)}

    <div class="text-center pb-4 border-b-2 border-slate-800">
      <h2 class="text-xl sm:text-2xl font-black uppercase text-slate-900">LEMBAR KERJA PESERTA DIDIK (LKPD)</h2>
      <p class="text-xs font-semibold text-slate-600 mt-1">${namaSekolah} • Mata Pelajaran: ${mapel} (${fase} / Kelas ${kelas})</p>
      <p class="text-sm font-extrabold text-blue-700 mt-1">Topik: ${topic}</p>
    </div>

    ${lkpdSections}

    <!-- PENGESAHAN TANDA TANGAN -->
    ${generateSignatureBlockHtml(input.kopConfig, input.namaSekolah)}
  </div>`;
}

// Generate Supplementary: Bahan Ajar
export function generateBahanAjarHtml(input: ModuleGenerationInput): string {
  const { topic, mapel, kelas, fase, namaSekolah } = input;

  return `
  <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 text-slate-900 space-y-6 max-w-4xl mx-auto font-sans leading-relaxed">
    <!-- KOP SURAT RESMI -->
    ${generateKopSuratHtml(input.kopConfig, input.namaSekolah)}

    <div class="text-center pb-4 border-b-2 border-slate-800">
      <h2 class="text-xl sm:text-2xl font-black uppercase text-slate-900">BUKU PENDAMPING & BAHAN AJAR SISWA</h2>
      <p class="text-xs font-semibold text-slate-600 mt-1">${namaSekolah} • Kelas ${kelas} (${fase}) • ${mapel}</p>
      <p class="text-base font-extrabold text-blue-700 mt-1">Materi Pokok: ${topic}</p>
    </div>

    <!-- PETA KONSEP -->
    <div class="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
      <h3 class="text-xs font-extrabold text-blue-950 uppercase tracking-wide">🗺️ PETA KONSEP & STRUKTUR MATERI</h3>
      <div class="mt-2 text-xs text-slate-700 space-y-1">
        <p>• <strong>Sub-Topik 1:</strong> Pengenalan Fakta, Karakteristik Dasar & Relevansi ${topic}.</p>
        <p>• <strong>Sub-Topik 2:</strong> Analisis Hubungan Sebab-Akibat dan Dinamika Kontekstual.</p>
        <p>• <strong>Sub-Topik 3:</strong> Penerapan Nyata, Etika, dan Praktik Pemecahan Masalah.</p>
      </div>
    </div>

    <!-- MATERI INTI -->
    <div class="space-y-4 text-xs">
      <div>
        <h4 class="font-extrabold text-slate-900 text-sm pb-1 border-b border-slate-200">1. Pengantar dan Konsep Dasar</h4>
        <p class="text-slate-700 mt-2 leading-relaxed">
          Dalam kehidupan kita sehari-hari, kita tidak pernah terlepas dari fenomena <strong>${topic}</strong>. Mempelajari materi ini memberikan kita kacamata baru untuk memahami bagaimana lingkungan dan diri kita berinteraksi secara harmonis. Pengetahuan ini melatih daya nalar kritis sekaligus kepekaan budi pekerti.
        </p>
      </div>

      <div>
        <h4 class="font-extrabold text-slate-900 text-sm pb-1 border-b border-slate-200">2. Prinsip Kerja dan Fakta Esensial</h4>
        <p class="text-slate-700 mt-2 leading-relaxed">
          Setiap bagian dalam <em>${topic}</em> memiliki peran yang saling melengkapi. Ketika salah satu elemen mengalami gangguan, dampaknya akan terasa ke bagian lainnya. Oleh karena itu, kita diajak untuk selalu menjaga keseimbangan dan mempraktikkan kebiasaan positif dalam aktivitas harian.
        </p>
      </div>
    </div>

    <!-- CONTOH SOAL HOTS & PEMBAHASAN -->
    <div>
      <h3 class="text-xs font-extrabold text-blue-900 uppercase tracking-wide pb-1 border-b border-blue-200">
        📝 CONTOH SOAL HOTS & PEMBAHASAN LENGKAP
      </h3>
      <div class="mt-3 space-y-3 text-xs">
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <p class="font-bold text-slate-900">Soal 1 (Penalaran Kritis):</p>
          <p class="text-slate-700">Seorang siswa mengamati bahwa dalam situasi tertentu, penerapan <em>${topic}</em> tidak berjalan dengan baik. Apa langkah pertama yang paling efektif untuk mengatasi persoalan tersebut?</p>
          <div class="p-2.5 rounded-lg bg-white border border-emerald-200 text-emerald-900">
            <strong>Pembahasan:</strong> Langkah pertama adalah mengidentifikasi akar penyebab melalui observasi data nyata, kemudian merumuskan alternatif solusi kolaboratif yang terukur dan berdampak positif bagi lingkungan.
          </div>
        </div>
      </div>
    </div>

    <!-- LATIHAN SOAL -->
    <div>
      <h3 class="text-xs font-extrabold text-blue-900 uppercase tracking-wide pb-1 border-b border-blue-200">
        🎯 LATIHAN MANDIRI SISWA (5 Pilihan Ganda & 2 Uraian)
      </h3>
      <div class="mt-3 space-y-3 text-xs text-slate-700">
        <div>
          <p><strong>1.</strong> Manakah pernyataan berikut yang paling tepat mengenai ${topic}?</p>
          <p class="pl-4">A. Berlangsung tanpa memerlukan keterlibatan lingkungan sekitar<br>B. Memerlukan keterpaduan antara pengetahuan, kesadaran, dan tindakan nyata<br>C. Hanya berlaku pada waktu-waktu tertentu saja<br>D. Tidak berkaitan dengan kesejahteraan bersama</p>
        </div>
        <div>
          <p><strong>2.</strong> Sikap gotong royong dalam mendalami ${topic} ditunjukkan melalui tindakan...</p>
          <p class="pl-4">A. Menyelesaikan semua tugas sendirian tanpa membagi peran<br>B. Berbagi peran secara adil dan saling membantu saat menemukan kendala<br>C. Menunggu teman lain selesai bekerja<br>D. Menghindari diskusi kelompok</p>
        </div>
      </div>
    </div>

    <!-- GLOSARIUM -->
    <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
      <h3 class="text-xs font-extrabold text-slate-800 uppercase tracking-wide">📚 GLOSARIUM KATA KUNCI</h3>
      <div class="mt-2 text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>• <strong>Eksplorasi:</strong> Penyelidikan mendalam untuk menemukan pengetahuan baru.</div>
        <div>• <strong>Kolaborasi:</strong> Bekerja sama secara sinergis untuk mencapai tujuan bersama.</div>
        <div>• <strong>Refleksi:</strong> Pengendapan dan evaluasi diri atas pengalaman yang telah dialami.</div>
        <div>• <strong>Integritas:</strong> Kesesuaian antara perkataan, niat baik, dan tindakan nyata.</div>
      </div>
    </div>

    <!-- PENGESAHAN TANDA TANGAN -->
    ${generateSignatureBlockHtml(input.kopConfig, input.namaSekolah)}
  </div>`;
}

// Generate Supplementary: Silabus / ATP
export function generateSilabusHtml(input: ModuleGenerationInput): string {
  const { topic, mapel, kelas, fase, semester, tahunAjaran, namaSekolah, jumlahPertemuan, jpPerPertemuan } = input;
  const totalJP = jumlahPertemuan * jpPerPertemuan;

  return `
  <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 text-slate-900 space-y-6 max-w-4xl mx-auto font-sans leading-relaxed">
    <!-- KOP SURAT RESMI -->
    ${generateKopSuratHtml(input.kopConfig, input.namaSekolah)}

    <div class="text-center pb-4 border-b-2 border-slate-800">
      <h2 class="text-xl sm:text-2xl font-black uppercase text-slate-900">ALUR TUJUAN PEMBELAJARAN (ATP) / SILABUS SEMESTER</h2>
      <p class="text-xs font-semibold text-slate-600 mt-1">${namaSekolah} • Tahun Ajaran ${tahunAjaran} • Semester ${semester === 1 ? '1 (Ganjil)' : '2 (Genap)'}</p>
      <p class="text-sm font-extrabold text-blue-700 mt-1">Mata Pelajaran: ${mapel} (${fase} / Kelas ${kelas})</p>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-xs text-slate-700 border-collapse border border-slate-300">
        <thead>
          <tr class="bg-slate-100 text-slate-800">
            <th class="border border-slate-300 p-2 w-12 text-center">No</th>
            <th class="border border-slate-300 p-2">Elemen / CP</th>
            <th class="border border-slate-300 p-2">Alur Tujuan Pembelajaran (ATP)</th>
            <th class="border border-slate-300 p-2 w-28">Lingkup Materi</th>
            <th class="border border-slate-300 p-2 w-16 text-center">Alokasi</th>
            <th class="border border-slate-300 p-2">Rencana Asesmen</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-slate-300 p-2 text-center font-bold">1</td>
            <td class="border border-slate-300 p-2 align-top">
              <strong>Pemahaman Konseptual:</strong> Mampu mendeskripsikan fenomena dan hubungan sebab-akibat kontekstual.
            </td>
            <td class="border border-slate-300 p-2 align-top">
              1.1 Mengidentifikasi konsep esensial topik.<br>
              1.2 Menganalisis peran dan fungsi komponen.
            </td>
            <td class="border border-slate-300 p-2 align-top font-semibold text-blue-800">
              ${topic} (Bagian 1)
            </td>
            <td class="border border-slate-300 p-2 text-center align-top font-mono font-bold">
              ${Math.round(totalJP / 2)} JP
            </td>
            <td class="border border-slate-300 p-2 align-top">
              • Formatif: Tanya Jawab & Observasi<br>
              • LKPD Kinerja 1
            </td>
          </tr>
          <tr class="bg-slate-50/50">
            <td class="border border-slate-300 p-2 text-center font-bold">2</td>
            <td class="border border-slate-300 p-2 align-top">
              <strong>Keterampilan Proses:</strong> Mampu merancang solusi, menguji hipotesis, dan mempresentasikan karya.
            </td>
            <td class="border border-slate-300 p-2 align-top">
              2.1 Melakukan investigasi kelompok terbimbing.<br>
              2.2 Mempresentasikan simpulan karya di depan kelas.
            </td>
            <td class="border border-slate-300 p-2 align-top font-semibold text-blue-800">
              ${topic} (Aplikasi & Karya)
            </td>
            <td class="border border-slate-300 p-2 text-center align-top font-mono font-bold">
              ${totalJP - Math.round(totalJP / 2)} JP
            </td>
            <td class="border border-slate-300 p-2 align-top">
              • Sumatif: Tes Tulis HOTS<br>
              • Portofolio Hasil Karya
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PENGESAHAN TANDA TANGAN -->
    ${generateSignatureBlockHtml(input.kopConfig, input.namaSekolah)}
  </div>`;
}

// Generate Supplementary: Prota
export function generateProtaHtml(input: ModuleGenerationInput): string {
  const { mapel, kelas, fase, tahunAjaran, namaSekolah, topic } = input;

  return `
  <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 text-slate-900 space-y-6 max-w-4xl mx-auto font-sans leading-relaxed">
    <!-- KOP SURAT RESMI -->
    ${generateKopSuratHtml(input.kopConfig, input.namaSekolah)}

    <div class="text-center pb-4 border-b-2 border-slate-800">
      <h2 class="text-xl sm:text-2xl font-black uppercase text-slate-900">PROGRAM TAHUNAN (PROTA)</h2>
      <p class="text-xs font-semibold text-slate-600 mt-1">${namaSekolah} • Tahun Ajaran ${tahunAjaran}</p>
      <p class="text-sm font-extrabold text-blue-700 mt-1">Mata Pelajaran: ${mapel} (${fase} / Kelas ${kelas})</p>
    </div>

    <!-- SEMESTER GANJIL -->
    <div>
      <h4 class="font-extrabold text-blue-900 text-xs uppercase pb-1 border-b border-blue-200">SEMESTER 1 (GANJIL)</h4>
      <table class="w-full mt-2 text-xs border-collapse border border-slate-300">
        <thead>
          <tr class="bg-slate-100"><th class="border border-slate-300 p-2 w-12 text-center">No</th><th class="border border-slate-300 p-2">Tujuan Pembelajaran / Lingkup Materi Pokok</th><th class="border border-slate-300 p-2 w-24 text-center">Alokasi Waktu</th></tr>
        </thead>
        <tbody>
          <tr><td class="border border-slate-300 p-2 text-center">1</td><td class="border border-slate-300 p-2 font-semibold text-blue-800">${topic}</td><td class="border border-slate-300 p-2 text-center font-mono font-bold">18 JP</td></tr>
          <tr><td class="border border-slate-300 p-2 text-center">2</td><td class="border border-slate-300 p-2">Karakteristik Lingkungan Sosial dan Keberagaman Masyarakat</td><td class="border border-slate-300 p-2 text-center font-mono font-bold">18 JP</td></tr>
          <tr><td class="border border-slate-300 p-2 text-center">3</td><td class="border border-slate-300 p-2">Sumatif Tengah Semester (STS) & Sumatif Akhir Semester (SAS)</td><td class="border border-slate-300 p-2 text-center font-mono font-bold">8 JP</td></tr>
          <tr class="bg-blue-50/60 font-bold"><td class="border border-slate-300 p-2 text-center" colspan="2">TOTAL JAM PELAJARAN SEMESTER GANJIL</td><td class="border border-slate-300 p-2 text-center font-mono">44 JP</td></tr>
        </tbody>
      </table>
    </div>

    <!-- SEMESTER GENAP -->
    <div>
      <h4 class="font-extrabold text-blue-900 text-xs uppercase pb-1 border-b border-blue-200">SEMESTER 2 (GENAP)</h4>
      <table class="w-full mt-2 text-xs border-collapse border border-slate-300">
        <thead>
          <tr class="bg-slate-100"><th class="border border-slate-300 p-2 w-12 text-center">No</th><th class="border border-slate-300 p-2">Tujuan Pembelajaran / Lingkup Materi Pokok</th><th class="border border-slate-300 p-2 w-24 text-center">Alokasi Waktu</th></tr>
        </thead>
        <tbody>
          <tr><td class="border border-slate-300 p-2 text-center">4</td><td class="border border-slate-300 p-2">Daya Cipta Energi dan Pelestarian Sumber Daya Alam</td><td class="border border-slate-300 p-2 text-center font-mono font-bold">18 JP</td></tr>
          <tr><td class="border border-slate-300 p-2 text-center">5</td><td class="border border-slate-300 p-2">Pemanfaatan Teknologi Sederhana dan Kearifan Lokal</td><td class="border border-slate-300 p-2 text-center font-mono font-bold">16 JP</td></tr>
          <tr><td class="border border-slate-300 p-2 text-center">6</td><td class="border border-slate-300 p-2">Sumatif Tengah Semester (STS) & Asesmen Akhir Tahun (AAT)</td><td class="border border-slate-300 p-2 text-center font-mono font-bold">8 JP</td></tr>
          <tr class="bg-blue-50/60 font-bold"><td class="border border-slate-300 p-2 text-center" colspan="2">TOTAL JAM PELAJARAN SEMESTER GENAP</td><td class="border border-slate-300 p-2 text-center font-mono">42 JP</td></tr>
        </tbody>
      </table>
    </div>

    <!-- PENGESAHAN TANDA TANGAN -->
    ${generateSignatureBlockHtml(input.kopConfig, input.namaSekolah)}
  </div>`;
}

// Generate Supplementary: Prosem
export function generateProsemHtml(input: ModuleGenerationInput): string {
  const { mapel, kelas, fase, semester, tahunAjaran, namaSekolah, topic } = input;
  const bulanList = semester === 1
    ? ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    : ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];

  return `
  <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 text-slate-900 space-y-6 max-w-4xl mx-auto font-sans leading-relaxed">
    <!-- KOP SURAT RESMI -->
    ${generateKopSuratHtml(input.kopConfig, input.namaSekolah)}

    <div class="text-center pb-4 border-b-2 border-slate-800">
      <h2 class="text-xl sm:text-2xl font-black uppercase text-slate-900">PROGRAM SEMESTER (PROSEM)</h2>
      <p class="text-xs font-semibold text-slate-600 mt-1">${namaSekolah} • Tahun Ajaran ${tahunAjaran} • Semester ${semester === 1 ? '1 (Ganjil)' : '2 (Genap)'}</p>
      <p class="text-sm font-extrabold text-blue-700 mt-1">Mata Pelajaran: ${mapel} (${fase} / Kelas ${kelas})</p>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-[11px] text-slate-700 border-collapse border border-slate-300">
        <thead>
          <tr class="bg-slate-100 text-center">
            <th class="border border-slate-300 p-1.5 w-8" rowspan="2">No</th>
            <th class="border border-slate-300 p-1.5" rowspan="2">Lingkup Materi / Topik Pembelajaran</th>
            <th class="border border-slate-300 p-1.5 w-12" rowspan="2">Jml JP</th>
            ${bulanList.map(b => `<th class="border border-slate-300 p-1" colspan="4">${b}</th>`).join('')}
          </tr>
          <tr class="bg-slate-50 text-center text-[9px]">
            ${bulanList.flatMap(() => [1, 2, 3, 4].map(w => `<th class="border border-slate-300 p-0.5 w-5">${w}</th>`)).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-slate-300 p-1.5 text-center font-bold">1</td>
            <td class="border border-slate-300 p-1.5 font-semibold text-blue-800">${topic}</td>
            <td class="border border-slate-300 p-1.5 text-center font-mono font-bold">15</td>
            <!-- Month 1 -->
            <td class="border border-slate-300 p-0.5 text-center bg-blue-100 font-bold">5</td>
            <td class="border border-slate-300 p-0.5 text-center bg-blue-100 font-bold">5</td>
            <td class="border border-slate-300 p-0.5 text-center bg-blue-100 font-bold">5</td>
            <td class="border border-slate-300 p-0.5 text-center bg-slate-50">-</td>
            <!-- Month 2-6 padding -->
            ${Array.from({ length: 20 }, () => '<td class="border border-slate-300 p-0.5 text-center text-slate-300">-</td>').join('')}
          </tr>
          <tr class="bg-slate-50/50">
            <td class="border border-slate-300 p-1.5 text-center font-bold">2</td>
            <td class="border border-slate-300 p-1.5">Materi Pokok Lanjutan Semester Berjalan</td>
            <td class="border border-slate-300 p-1.5 text-center font-mono font-bold">20</td>
            ${Array.from({ length: 3 }, () => '<td class="border border-slate-300 p-0.5 text-center text-slate-300">-</td>').join('')}
            <td class="border border-slate-300 p-0.5 text-center bg-blue-100 font-bold">5</td>
            <td class="border border-slate-300 p-0.5 text-center bg-blue-100 font-bold">5</td>
            <td class="border border-slate-300 p-0.5 text-center bg-blue-100 font-bold">5</td>
            <td class="border border-slate-300 p-0.5 text-center bg-blue-100 font-bold">5</td>
            ${Array.from({ length: 16 }, () => '<td class="border border-slate-300 p-0.5 text-center text-slate-300">-</td>').join('')}
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PENGESAHAN TANDA TANGAN -->
    ${generateSignatureBlockHtml(input.kopConfig, input.namaSekolah)}
  </div>`;
}
