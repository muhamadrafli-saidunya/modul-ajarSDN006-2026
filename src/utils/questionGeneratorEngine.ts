import { GeneratedExam, QuestionItem, QuestionType, KopConfig } from '../types';
import { generateKopSuratHtml, generateSignatureBlockHtml } from './moduleGeneratorEngine';

// Database Rekomendasi Tujuan Pembelajaran (TP) Standar Kemendikdasmen RI
export const RECOMMENDED_TPS: Record<string, { topic: string; tpList: string[] }[]> = {
  'IPAS': [
    {
      topic: 'Bagian Tubuh Tumbuhan & Fotosintesis',
      tpList: [
        'Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada tumbuhan (akar, batang, daun, bunga).',
        'Peserta didik mengidentifikasi proses fotosintesis dan mengaitkan peran pentingnya bagi kelangsungan makhluk hidup di bumi.',
        'Peserta didik melakukan penyelidikan sederhana mengenai faktor-faktor yang memengaruhi fotosintesis (cahaya, air, klorofil).',
      ],
    },
    {
      topic: 'Wujud Zat dan Perubahannya',
      tpList: [
        'Peserta didik mendeskripsikan karakteristik wujud zat (padat, cair, dan gas) berdasarkan sifat dan susunan partikelnya.',
        'Peserta didik mengidentifikasi berbagai perubahan wujud zat dalam kehidupan sehari-hari (mencair, membeku, menguap, mengembun, menyublim).',
        'Peserta didik menganalisis peristiwa perpindahan kalor dan dampaknya pada perubahan wujud benda di lingkungan sekitar.',
      ],
    },
    {
      topic: 'Gaya dan Gerak di Sekitar Kita',
      tpList: [
        'Peserta didik mengidentifikasi ragam gaya yang terlibat dalam aktivitas sehari-hari (gaya otot, gesek, magnet, pegas, dan gravitasi).',
        'Peserta didik menganalisis pengaruh gaya terhadap bentuk, arah, dan kecepatan gerak suatu benda.',
        'Peserta didik memanfaatkan prinsip gaya gesek dan gaya magnet untuk memecahkan masalah sederhana dalam kehidupan.',
      ],
    },
    {
      topic: 'Ekosistem dan Rantai Makanan',
      tpList: [
        'Peserta didik menganalisis hubungan antarmakhluk hidup dalam jaring-jaring makanan pada suatu ekosistem.',
        'Peserta didik memprediksi dampak kepunahan salah satu komponen rantai makanan terhadap keseimbangan lingkungan.',
        'Peserta didik merancang upaya pelestarian keanekaragaman hayati di lingkungan terdekat.',
      ],
    },
    {
      topic: 'Peta dan Bentang Alam Daerahku',
      tpList: [
        'Peserta didik membaca dan menafsirkan komponen-komponen utama pada peta lingkungan setempat.',
        'Peserta didik mengidentifikasi bentang alam permukaan bumi dan pengaruhnya terhadap mata pencaharian masyarakat.',
        'Peserta didik menjelaskan kearifan lokal masyarakat dalam memanfaatkan kekayaan alam secara berkelanjutan.',
      ],
    },
  ],
  'Matematika': [
    {
      topic: 'Bilangan Cacah Besar & Operasi Hitung',
      tpList: [
        'Peserta didik dapat membaca, menulis, menentukan nilai tempat, dan membandingkan bilangan cacah sampai 10.000.',
        'Peserta didik dapat melakukan operasi penjumlahan dan pengurangan bilangan cacah besar dengan teknik bersusun dan nalar kritis.',
        'Peserta didik dapat menyelesaikan masalah kontekstual sehari-hari yang melibatkan perkalian dan pembagian bilangan cacah.',
      ],
    },
    {
      topic: 'Pecahan Senilai & Operasi Pecahan',
      tpList: [
        'Peserta didik dapat menyajikan dan membandingkan pecahan senilai menggunakan representasi gambar dan benda konkret.',
        'Peserta didik dapat mengubah bentuk pecahan biasa ke bentuk desimal dan persen atau sebaliknya.',
        'Peserta didik dapat menyelesaikan soal cerita yang melibatkan penjumlahan dan pengurangan pecahan berpenyebut sama.',
      ],
    },
    {
      topic: 'Geometri: Bangun Datar & Sudut',
      tpList: [
        'Peserta didik dapat mengidentifikasi ciri-ciri berbagai jenis segitiga dan segi empat berdasarkan sisi dan sudutnya.',
        'Peserta didik dapat mengukur besar sudut menggunakan busur derajat serta mengklasifikasikan jenis sudut (lancip, siku-siku, tumpul).',
        'Peserta didik dapat menghitung keliling dan luas bangun datar (persegi dan persegi panjang) dalam pemecahan masalah nyata.',
      ],
    },
    {
      topic: 'Pengukuran Panjang, Berat, & Waktu',
      tpList: [
        'Peserta didik dapat mengonversi satuan baku panjang (km, m, cm) dan berat (kg, g) dalam situasi praktis.',
        'Peserta didik dapat menghitung durasi waktu suatu kegiatan dengan menggunakan satuan jam dan menit.',
      ],
    },
    {
      topic: 'Analisis Data & Diagram Batang',
      tpList: [
        'Peserta didik dapat mengumpulkan, mengurutkan, dan menyajikan data frekuensi dalam bentuk tabel dan diagram batang.',
        'Peserta didik dapat menafsirkan informasi penting serta menarik simpulan dari data diagram batang.',
      ],
    },
  ],
  'Bahasa Indonesia': [
    {
      topic: 'Teks Eksplanasi & Ide Pokok',
      tpList: [
        'Peserta didik mampu mengidentifikasi ide pokok dan ide pendukung dalam setiap paragraf teks eksplanasi ilmiah.',
        'Peserta didik mampu menemukan arti kosakata baru berdasarkan konteks kalimat dan penggunaan Kamus Besar Bahasa Indonesia (KBBI).',
        'Peserta didik dapat menyimpulkan informasi tersirat dalam teks bacaan faktual dengan bahasa sendiri.',
      ],
    },
    {
      topic: 'Teks Prosedur & Petunjuk Kerja',
      tpList: [
        'Peserta didik dapat mengidentifikasi struktur teks prosedur (tujuan, alat/bahan, dan langkah-langkah kerja urut).',
        'Peserta didik dapat menulis teks prosedur membuat atau melakukan sesuatu dengan kalimat imperatif yang jelas dan efektif.',
      ],
    },
    {
      topic: 'Teks Cerita Narasi & Karakter Tokoh',
      tpList: [
        'Peserta didik dapat menganalisis unsur intrinsik cerita (tema, tokoh, latar, alur, dan amanat moral) dari teks fabel/cerpen.',
        'Peserta didik dapat membedakan kalimat langsung dan tidak langsung serta menulis dialog yang sesuai kaidah PUEBI/EYD.',
      ],
    },
    {
      topic: 'Fakta dan Opini & Surat Pribadi',
      tpList: [
        'Peserta didik dapat membedakan antara kalimat fakta dan opini dalam berbagai artikel atau berita anak.',
        'Peserta didik mampu menulis surat pribadi kepada teman atau guru dengan format dan pilihan kata yang santun.',
      ],
    },
  ],
  'Pendidikan Pancasila': [
    {
      topic: 'Penerapan Nilai-Nilai Pancasila',
      tpList: [
        'Peserta didik dapat mengidentifikasi makna sila-sila Pancasila dan simbol Garuda Pancasila secara utuh.',
        'Peserta didik dapat memberikan contoh penerapan nilai ketuhanan, kemanusiaan, persatuan, kerakyatan, dan keadilan di lingkungan sekolah.',
        'Peserta didik dapat membiasakan sikap musyawarah untuk mencapai mufakat dalam pengambilan keputusan kelas.',
      ],
    },
    {
      topic: 'Norma, Hak, dan Kewajiban',
      tpList: [
        'Peserta didik dapat membedakan antara hak dan kewajiban sebagai anak di rumah serta sebagai peserta didik di sekolah.',
        'Peserta didik dapat menjelaskan pentingnya mematuhi norma dan tata tertib yang berlaku di masyarakat.',
      ],
    },
    {
      topic: 'Keragaman Budaya Nusantara (Bhinneka Tunggal Ika)',
      tpList: [
        'Peserta didik dapat menghargai keragaman suku bangsa, bahasa daerah, pakaian adat, dan agama di Indonesia.',
        'Peserta didik dapat menunjukkan perilaku toleransi dan gotong royong dalam kehidupan bermasyarakat yang majemuk.',
      ],
    },
  ],
  'Pendidikan Agama Islam': [
    {
      topic: "Al-Qur'an dan Hadis (Surat Pendek Pilihan)",
      tpList: [
        "Peserta didik dapat membaca dan menghafal Surat At-Tin / Al-Ma'un dengan makhraj dan tajwid yang tartil.",
        "Peserta didik dapat menjelaskan pesan pokok dan kandungan ayat Surat At-Tin dalam membangun pribadi yang bersyukur.",
      ],
    },
    {
      topic: 'Asmaul Husna & Keimanan',
      tpList: [
        'Peserta didik dapat menjelaskan makna Asmaul Husna (Al-Malik, Al-Quddus, As-Salam, Al-Mu’min, Al-Aziz) beserta contoh perilakunya.',
        'Peserta didik dapat meneladani sifat Asmaul Husna dalam menjaga kedamaian dan kebersihan lingkungan.',
      ],
    },
    {
      topic: 'Akhlak Terpuji & Adab Islami',
      tpList: [
        'Peserta didik dapat mempraktikkan adab santun kepada orang tua, guru, dan teman sebaya sesuai tuntunan Rasulullah SAW.',
        'Peserta didik dapat mengidentifikasi hikmah perilaku jujur, amanah, dan menghargai perbedaan keyakinan.',
      ],
    },
  ],
  'Bahasa Inggris': [
    {
      topic: 'Daily Routines and Activities',
      tpList: [
        'Students can identify and express daily activities using simple present tense verbs correctly.',
        'Students can tell the time and schedule of their daily routines in English with good pronunciation.',
      ],
    },
    {
      topic: 'Food, Drinks, and Preferences',
      tpList: [
        'Students can ask and respond to questions about likes and dislikes regarding foods and beverages.',
        'Students can describe tastes and qualities of food (sweet, sour, salty, spicy) in simple English sentences.',
      ],
    },
  ],
  'PJOK': [
    {
      topic: 'Kombinasi Gerak Dasar Permainan Bola',
      tpList: [
        'Peserta didik mempraktikkan variasi dan kombinasi pola gerak dasar lokomotor, nonlokomotor, dan manipulatif dalam permainan bola besar.',
        'Peserta didik menunjukkan sikap sportivitas, kerja sama regu, dan mematuhi aturan keselamatan saat berolahraga.',
      ],
    },
  ],
  'Seni Rupa': [
    {
      topic: 'Eksplorasi Unsur Rupa dan Komposisi',
      tpList: [
        'Peserta didik dapat menganalisis unsur rupa (garis, bidang, bentuk, warna primer/sekunder, tekstur) pada karya seni dua dimensi.',
        'Peserta didik dapat menciptakan motif hias tradisional dengan prinsip keseimbangan dan irama yang harmonis.',
      ],
    },
  ],
};

// Generic generator for questions when Gemini API is offline or returns fallback
export function generateOfflineQuestions(
  subject: string,
  grade: string,
  tp: string,
  topic: string,
  questionType: QuestionType,
  count: number,
  cognitiveLevel: string
): QuestionItem[] {
  const safeCount = Math.max(1, Math.min(40, count));
  const questions: QuestionItem[] = [];

  // Deterministic seed topics based on subject & TP
  const effectiveTopic = topic || (tp.length > 30 ? tp.slice(0, 30) + '...' : tp) || subject;

  for (let i = 1; i <= safeCount; i++) {
    let type: QuestionItem['type'] = 'Pilihan Ganda';

    if (questionType === 'Campuran') {
      if (i <= Math.ceil(safeCount * 0.6)) {
        type = 'Pilihan Ganda';
      } else if (i <= Math.ceil(safeCount * 0.85)) {
        type = 'Isian Singkat';
      } else {
        type = 'Uraian';
      }
    } else if (questionType === 'Pilihan Ganda') {
      type = 'Pilihan Ganda';
    } else if (questionType === 'Pilihan Ganda Kompleks') {
      type = 'Pilihan Ganda Kompleks';
    } else if (questionType === 'Isian Singkat') {
      type = 'Isian Singkat';
    } else if (questionType === 'Uraian') {
      type = 'Uraian';
    } else if (questionType === 'Menjodohkan') {
      type = 'Menjodohkan';
    } else if (questionType === 'Benar/Salah') {
      type = 'Benar/Salah';
    }

    const isPalingMudah =
      cognitiveLevel.includes('C1') ||
      cognitiveLevel.toLowerCase().includes('paling mudah') ||
      cognitiveLevel.toLowerCase().includes('mengingat');
    const isMudah = cognitiveLevel.includes('C2') && !cognitiveLevel.includes('C1-C2');
    const isLots = cognitiveLevel.includes('LOTS') || cognitiveLevel.includes('C1-C2');
    const isMots = cognitiveLevel.includes('MOTS') || cognitiveLevel.includes('C3');
    const isHots = cognitiveLevel.includes('HOTS') || cognitiveLevel.includes('C4');

    let cognLevel: QuestionItem['cognitiveLevel'] = 'C3';
    if (isPalingMudah) {
      cognLevel = 'C1';
    } else if (isMudah) {
      cognLevel = 'C2';
    } else if (isLots) {
      cognLevel = i % 2 === 0 ? 'C1' : 'C2';
    } else if (isMots) {
      cognLevel = 'C3';
    } else if (isHots) {
      cognLevel = i % 3 === 0 ? 'C5' : 'C4';
    } else {
      // Proporsional / Campuran seimbang
      cognLevel = i % 5 === 1 ? 'C1' : i % 5 === 2 ? 'C2' : i % 5 === 3 ? 'C3' : i % 5 === 4 ? 'C4' : 'C5';
    }

    let qItem: QuestionItem;

    if (type === 'Pilihan Ganda') {
      qItem = generateSamplePG(i, subject, grade, effectiveTopic, tp, cognLevel);
    } else if (type === 'Pilihan Ganda Kompleks') {
      qItem = generateSamplePGK(i, subject, grade, effectiveTopic, tp, cognLevel);
    } else if (type === 'Isian Singkat') {
      qItem = generateSampleIsian(i, subject, grade, effectiveTopic, tp, cognLevel);
    } else if (type === 'Uraian') {
      qItem = generateSampleUraian(i, subject, grade, effectiveTopic, tp, cognLevel);
    } else if (type === 'Menjodohkan') {
      qItem = generateSampleMenjodohkan(i, subject, grade, effectiveTopic, tp, cognLevel);
    } else {
      qItem = generateSampleBenarSalah(i, subject, grade, effectiveTopic, tp, cognLevel);
    }

    questions.push(qItem);
  }

  return questions.map(q => ({
    ...q,
    tpRef: q.tpRef || tp,
    topicRef: q.topicRef || effectiveTopic,
  }));
}

// Helper to format options with rotated correct answer position
function buildRotatedOptions(
  correctText: string,
  distractors: [string, string, string],
  positionIndex: number
): { options: string[]; correctAnswer: string } {
  const letters = ['A', 'B', 'C', 'D'];
  const pos = Math.abs(positionIndex) % 4; // 0: A, 1: B, 2: C, 3: D
  const items: string[] = [];

  let dIdx = 0;
  for (let i = 0; i < 4; i++) {
    if (i === pos) {
      items.push(correctText);
    } else {
      items.push(distractors[dIdx] || 'Pilihan lainnya');
      dIdx++;
    }
  }

  const options = items.map((text, i) => `${letters[i]}. ${text}`);
  const correctAnswer = `${letters[pos]}. ${correctText}`;

  return { options, correctAnswer };
}

function generateSampleC1PG(
  num: number,
  subject: string,
  grade: string,
  topic: string,
  tp: string,
  targetPos: number
): QuestionItem {
  const subjLower = subject.toLowerCase();
  const variant = (num - 1) % 6;

  // MATEMATIKA (C1 - Paling Mudah: Mengingat Simbol, Nilai Tempat, Rumus & Bilangan Dasar)
  if (subjLower.includes('matematika')) {
    if (variant === 0) {
      const opt = buildRotatedOptions('950', ['905', '590', '955'], targetPos);
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Mengingat Lambang Bilangan',
        stimulus: 'Bilangan cacah dipelajari dalam kehidupan sehari-hari.',
        question: 'Lambang bilangan dari "sembilan ratus lima puluh" adalah...',
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: 'Sembilan ratus lima puluh ditulis dengan lambang bilangan 950.',
        cognitiveLevel: 'C1',
        indicator: 'Disajikan nama bilangan, peserta didik dapat mengingat dan menentukan lambang bilangannya dengan tepat.',
        score: 1,
      };
    } else if (variant === 1) {
      const opt = buildRotatedOptions('Segitiga', ['Persegi', 'Lingkaran', 'Trapesium'], targetPos);
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Pengenalan Bangun Datar',
        stimulus: 'Bangun datar dibatasi oleh ruas garis lurus.',
        question: 'Nama bangun datar yang memiliki tepat 3 buah sisi dan 3 titik sudut adalah...',
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: 'Segitiga adalah bangun datar bersisi tiga dengan tiga titik sudut.',
        cognitiveLevel: 'C1',
        indicator: 'Disajikan ciri bangun datar bersisi tiga, peserta didik dapat menyebutkan nama bangunnya.',
        score: 1,
      };
    } else if (variant === 2) {
      const opt = buildRotatedOptions('42', ['36', '48', '40'], targetPos);
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Hafalan Perkalian Dasar',
        stimulus: 'Fakta perkalian dasar sebagai dasar operasi hitung matematika.',
        question: 'Hasil dari 6 × 7 adalah...',
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: '6 × 7 = 42.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat mengingat fakta perkalian bilangan dasar satu angka.',
        score: 1,
      };
    } else if (variant === 3) {
      const opt = buildRotatedOptions('Sudut siku-siku', ['Sudut lancip', 'Sudut tumpul', 'Sudut lurus'], targetPos);
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Pengenalan Jenis Sudut',
        stimulus: 'Besar sudut diukur dalam satuan derajat (°).',
        question: 'Nama sudut yang besarnya tepat 90° adalah...',
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: 'Sudut yang berukuran 90 derajat dinamakan sudut siku-siku.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat menyebutkan nama sudut siku-siku berukuran 90°.',
        score: 1,
      };
    } else if (variant === 4) {
      const opt = buildRotatedOptions('1.000 gram', ['100 gram', '500 gram', '10.000 gram'], targetPos);
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Mengingat Satuan Baku',
        stimulus: 'Satuan berat standar digunakan dalam penimbangan barang.',
        question: 'Berat 1 kilogram (kg) setara dengan...',
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: '1 kilogram setara dengan 1.000 gram.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat mengingat kesetaraan satuan berat kilogram ke gram.',
        score: 1,
      };
    } else {
      const opt = buildRotatedOptions('Ratusan', ['Ribuan', 'Puluhan', 'Satuan'], targetPos);
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Mengingat Nilai Tempat',
        stimulus: 'Bilangan 4.825 tersusun dari ribuan, ratusan, puluhan, dan satuan.',
        question: 'Pada bilangan 4.825, angka 8 menempati nilai tempat...',
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: 'Angka 4 menempati ribuan, 8 ratusan, 2 puluhan, dan 5 satuan.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat menyebutkan nilai tempat suatu angka pada bilangan cacah.',
        score: 1,
      };
    }
  }

  // BAHASA INDONESIA (C1 - Paling Mudah: Mengingat Tanda Baca, Kata Tanya, Istilah Dasar)
  if (subjLower.includes('bahasa') || subjLower.includes('indonesia')) {
    if (variant === 0) {
      const opt = buildRotatedOptions('Titik (.)', ['Tanya (?)', 'Seru (!)', 'Koma (,)'], targetPos);
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Mengingat Tanda Baca Dasar',
        stimulus: 'Kalimat berita menyampaikan informasi kepada pembaca.',
        question: 'Tanda baca yang digunakan untuk mengakhiri kalimat berita adalah tanda...',
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: 'Kalimat berita secara baku diakhiri dengan tanda baca titik (.).',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat mengingat tanda baca pengakhir kalimat berita.',
        score: 1,
      };
    } else if (variant === 1) {
      const opt = buildRotatedOptions('Di mana', ['Kapan', 'Siapa', 'Mengapa'], targetPos);
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Mengingat Kata Tanya',
        stimulus: 'Kata tanya digunakan untuk menggali informasi dari suatu teks bacaan.',
        question: 'Kata tanya yang digunakan untuk menanyakan tempat terjadinya suatu peristiwa adalah...',
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: 'Kata tanya "Di mana" digunakan khusus untuk menanyakan keterangan tempat.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat menyebutkan kata tanya untuk menanyakan tempat.',
        score: 1,
      };
    } else if (variant === 2) {
      const opt = buildRotatedOptions('Fabel', ['Legenda', 'Mite', 'Sage'], targetPos);
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Mengingat Jenis Cerita Fiksi',
        stimulus: 'Cerita rakyat dan dongeng memiliki beragam jenis sesuai perwatakan tokohnya.',
        question: 'Cerita fiksi yang tokoh-tokohnya diperankan oleh binatang dan dapat berbicara dinamakan...',
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: 'Fabel adalah dongeng tentang hewan/binatang yang berperilaku seperti manusia.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat mengingat istilah cerita fiksi binatang (fabel).',
        score: 1,
      };
    } else if (variant === 3) {
      const opt = buildRotatedOptions('Malas', ['Pintar', 'Pandai', 'Tertib'], targetPos);
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Mengingat Antonim Kata',
        stimulus: 'Antonim adalah kata-kata yang maknanya saling berlawanan.',
        question: 'Lawan kata (antonim) dari kata "rajin" adalah...',
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: 'Lawan kata dari rajin adalah malas.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat menyebutkan lawan kata dari kata sifat dasar.',
        score: 1,
      };
    } else if (variant === 4) {
      const opt = buildRotatedOptions('Baca', ['Membaca', 'Membacakan', 'Pembaca'], targetPos);
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Mengingat Kata Dasar',
        stimulus: 'Kata berimbuhan dibentuk dari kata dasar.',
        question: 'Kata dasar dari kata berimbuhan "membaca" adalah...',
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: 'Kata dasar dari membaca adalah baca.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat menyebutkan kata dasar suatu kata kerja.',
        score: 1,
      };
    } else {
      const opt = buildRotatedOptions('Huruf Kapital', ['Huruf Miring', 'Huruf Tebal', 'Huruf Kecil'], targetPos);
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Mengingat Kaidah Ejaan',
        stimulus: 'Ejaan bahasa Indonesia mengatur penulisan huruf awal pada nama orang.',
        question: 'Huruf yang digunakan pada awal penulisan nama orang dan kota adalah...',
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: 'Huruf kapital (huruf besar) wajib digunakan pada huruf pertama nama orang dan kota.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat mengingat kaidah penggunaan huruf kapital.',
        score: 1,
      };
    }
  }

  // PENDIDIKAN PANCASILA / PKn (C1 - Paling Mudah: Mengingat Lambang Sila, Simbol Negara, Semboyan)
  if (subjLower.includes('pancasila') || subjLower.includes('pkn')) {
    if (variant === 0) {
      const opt = buildRotatedOptions('Bintang', ['Rantai', 'Pohon Beringin', 'Kepala Banteng'], targetPos);
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Mengingat Simbol Sila',
        stimulus: 'Perisai burung Garuda memuat lambang lima sila Pancasila.',
        question: 'Lambang sila pertama Pancasila, "Ketuhanan Yang Maha Esa" adalah...',
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: 'Sila pertama dilambangkan dengan Bintang emas bersudut lima.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat mengingat lambang sila pertama Pancasila.',
        score: 1,
      };
    } else if (variant === 1) {
      const opt = buildRotatedOptions('Pohon Beringin', ['Bintang', 'Rantai', 'Padi dan Kapas'], targetPos);
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Mengingat Simbol Sila',
        stimulus: 'Sila ketiga Pancasila menegaskan kebulatan persatuan seluruh rakyat Indonesia.',
        question: 'Lambang sila ketiga Pancasila pada perisai Garuda adalah...',
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: 'Sila ketiga dilambangkan dengan Pohon Beringin.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat menyebutkan lambang sila ketiga Pancasila.',
        score: 1,
      };
    } else if (variant === 2) {
      const opt = buildRotatedOptions('Bhinneka Tunggal Ika', ['Tut Wuri Handayani', 'Bersatu Kita Teguh', 'Garuda Pancasila'], targetPos);
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Mengingat Semboyan Bangsa',
        stimulus: 'Kaki burung Garuda mencengkeram pita putih bertuliskan semboyan persatuan bangsa.',
        question: 'Semboyan bangsa Indonesia yang tertulis pada pita burung Garuda adalah...',
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: 'Semboyan bangsa Indonesia adalah Bhinneka Tunggal Ika.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat mengingat semboyan persatuan bangsa Indonesia.',
        score: 1,
      };
    } else if (variant === 3) {
      const opt = buildRotatedOptions('Merah dan Putih', ['Merah dan Kuning', 'Putih dan Hijau', 'Merah dan Biru'], targetPos);
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Mengingat Identitas Nasional',
        stimulus: 'Bendera negara adalah simbol kedaulatan bangsa Indonesia.',
        question: 'Warna bendera kebangsaan Negara Kesatuan Republik Indonesia adalah...',
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: 'Bendera negara Indonesia berwarna Merah dan Putih.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat mengingat warna bendera kebangsaan Indonesia.',
        score: 1,
      };
    } else if (variant === 4) {
      const opt = buildRotatedOptions('Indonesia Raya', ['Garuda Pancasila', 'Satu Nusa Satu Bangsa', 'Maju Tak Gentar'], targetPos);
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Mengingat Lagu Kebangsaan',
        stimulus: 'Lagu kebangsaan dikumandangkan pada upacara resmi kenegaraan.',
        question: 'Lagu kebangsaan negara Republik Indonesia berjudul...',
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: 'Lagu kebangsaan Indonesia berjudul Indonesia Raya.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat mengingat judul lagu kebangsaan Indonesia.',
        score: 1,
      };
    } else {
      const opt = buildRotatedOptions('Pancasila', ['UUD 1945', 'Bhinneka Tunggal Ika', 'Kitab Sutasoma'], targetPos);
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Mengingat Dasar Negara',
        stimulus: 'Negara Indonesia memiliki dasar negara sebagai landasan hukum dan moral bangsa.',
        question: 'Dasar negara Republik Indonesia adalah...',
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: 'Pancasila adalah dasar negara Republik Indonesia.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat menyebutkan dasar negara Republik Indonesia.',
        score: 1,
      };
    }
  }

  // DEFAULT: IPAS / SAINS (C1 - Paling Mudah: Mengingat Organ, Zat Tumbuhan, Sumber Energi & Wujud Benda)
  if (variant === 0) {
    const opt = buildRotatedOptions('Klorofil', ['Stomata', 'Xilem', 'Floem'], targetPos);
    return {
      id: `q-${num}`,
      number: num,
      type: 'Pilihan Ganda',
      pattern: 'Mengingat Istilah Sains Dasar',
      stimulus: 'Daun tumbuhan pada umumnya berwarna hijau karena memiliki zat warna alami.',
      question: 'Zat hijau daun yang berfungsi menyerap energi cahaya matahari disebut...',
      options: opt.options,
      correctAnswer: opt.correctAnswer,
      discussion: 'Klorofil adalah zat hijau daun yang menyerap sinar matahari untuk proses fotosintesis.',
      cognitiveLevel: 'C1',
      indicator: 'Peserta didik dapat mengingat nama zat hijau daun (klorofil).',
      score: 1,
    };
  } else if (variant === 1) {
    const opt = buildRotatedOptions('Akar', ['Batang', 'Bunga', 'Buah'], targetPos);
    return {
      id: `q-${num}`,
      number: num,
      type: 'Pilihan Ganda',
      pattern: 'Mengingat Bagian Tumbuhan',
      stimulus: 'Tumbuhan memiliki organ penting yang menopang kehidupan di dalam tanah.',
      question: 'Bagian tubuh tumbuhan yang bertugas menyerap air dan zat hara dari dalam tanah adalah...',
      options: opt.options,
      correctAnswer: opt.correctAnswer,
      discussion: 'Akar berfungsi menyerap air dan unsur hara mineral dari dalam tanah.',
      cognitiveLevel: 'C1',
      indicator: 'Peserta didik dapat menyebutkan organ tumbuhan penyerap air tanah.',
      score: 1,
    };
  } else if (variant === 2) {
    const opt = buildRotatedOptions('Herbivora', ['Karnivora', 'Omnivora', 'Insektivora'], targetPos);
    return {
      id: `q-${num}`,
      number: num,
      type: 'Pilihan Ganda',
      pattern: 'Mengingat Penggolongan Hewan',
      stimulus: 'Hewan digolongkan berdasarkan jenis makanan utamanya.',
      question: 'Hewan yang makanan utamanya berupa tumbuhan (rumput dan dedaunan) dinamakan...',
      options: opt.options,
      correctAnswer: opt.correctAnswer,
      discussion: 'Herbivora adalah sebutan untuk hewan pemakan tumbuhan.',
      cognitiveLevel: 'C1',
      indicator: 'Peserta didik dapat mengingat istilah penggolongan hewan pemakan tumbuhan.',
      score: 1,
    };
  } else if (variant === 3) {
    const opt = buildRotatedOptions('Matahari', ['Bulan', 'Bintang', 'Lampu'], targetPos);
    return {
      id: `q-${num}`,
      number: num,
      type: 'Pilihan Ganda',
      pattern: 'Mengingat Sumber Energi Alami',
      stimulus: 'Bumi menerima limpahan energi alam yang menghangatkan suasana siang hari.',
      question: 'Sumber energi panas dan cahaya terbesar bagi kehidupan di bumi adalah...',
      options: opt.options,
      correctAnswer: opt.correctAnswer,
      discussion: 'Matahari adalah sumber energi panas dan cahaya terbesar di tata surya bagi bumi.',
      cognitiveLevel: 'C1',
      indicator: 'Peserta didik dapat mengingat sumber energi panas dan cahaya utama bumi.',
      score: 1,
    };
  } else if (variant === 4) {
    const opt = buildRotatedOptions('Membeku', ['Mencair', 'Menguap', 'Mengembun'], targetPos);
    return {
      id: `q-${num}`,
      number: num,
      type: 'Pilihan Ganda',
      pattern: 'Mengingat Perubahan Wujud Zat',
      stimulus: 'Air murni yang dimasukkan ke dalam ruang pembeku es akan berubah menjadi bongkahan es.',
      question: 'Perubahan wujud benda dari zat cair menjadi padat disebut...',
      options: opt.options,
      correctAnswer: opt.correctAnswer,
      discussion: 'Membeku adalah proses perubahan wujud zat dari cair menjadi padat.',
      cognitiveLevel: 'C1',
      indicator: 'Peserta didik dapat menyebutkan nama proses perubahan wujud cair menjadi padat.',
      score: 1,
    };
  } else {
    const opt = buildRotatedOptions('Jantung', ['Paru-paru', 'Lambung', 'Ginjal'], targetPos);
    return {
      id: `q-${num}`,
      number: num,
      type: 'Pilihan Ganda',
      pattern: 'Mengingat Organ Tubuh Manusia',
      stimulus: 'Sistem sirkulasi tubuh manusia didukung oleh organ berotot kuat di dalam dada.',
      question: 'Organ tubuh manusia yang berfungsi utama untuk memompa darah ke seluruh tubuh adalah...',
      options: opt.options,
      correctAnswer: opt.correctAnswer,
      discussion: 'Jantung berfungsi memompa darah ke seluruh bagian tubuh.',
      cognitiveLevel: 'C1',
      indicator: 'Peserta didik dapat menyebutkan nama organ pemompa darah pada manusia.',
      score: 1,
    };
  }
}

function generateSamplePG(
  num: number,
  subject: string,
  grade: string,
  topic: string,
  tp: string,
  cognLevel: QuestionItem['cognitiveLevel']
): QuestionItem {
  const patternIndex = (num - 1) % 8;
  const targetPos = (num * 3 + 1) % 4; // Cycles through B, A, D, C, etc.

  // Jika target level adalah C1 (Paling Mudah), gunakan bank soal mengingat dasar
  if (cognLevel === 'C1') {
    return generateSampleC1PG(num, subject, grade, topic, tp, targetPos);
  }

  // 1. MATEMATIKA
  if (subject.toLowerCase().includes('matematika')) {
    if (patternIndex === 0) {
      // Studi Kasus & Pemecahan Masalah
      const tabunganHarian = 3000 + (num % 5) * 500;
      const hari = 12 + (num % 4);
      const total = tabunganHarian * hari;
      const hargaBuku = total - 5000;
      const sisa = total - hargaBuku;
      const opt = buildRotatedOptions(
        `Rp${sisa.toLocaleString('id-ID')}`,
        [`Rp${(sisa + 2000).toLocaleString('id-ID')}`, `Rp${(sisa + 5000).toLocaleString('id-ID')}`, `Rp${Math.max(1000, sisa - 2000).toLocaleString('id-ID')}`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Studi Kasus & Pemecahan Masalah',
        stimulus: `Siti menabung uang saku sebesar Rp${tabunganHarian.toLocaleString('id-ID')} setiap hari selama ${hari} hari. Kemudian, Siti menggunakan uang tersebut untuk membeli buku ensiklopedia seharga Rp${hargaBuku.toLocaleString('id-ID')}.`,
        question: `Berdasarkan cerita di atas, berapa sisa uang tabungan Siti sekarang?`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Total tabungan = ${hari} × Rp${tabunganHarian.toLocaleString('id-ID')} = Rp${total.toLocaleString('id-ID')}. Sisa tabungan = Rp${total.toLocaleString('id-ID')} - Rp${hargaBuku.toLocaleString('id-ID')} = Rp${sisa.toLocaleString('id-ID')}.`,
        cognitiveLevel: 'C3',
        indicator: `Disajikan soal cerita kontekstual tabungan, peserta didik dapat menyelesaikan operasi hitung campuran dengan tepat.`,
        score: 1,
      };
    } else if (patternIndex === 1) {
      // Analisis Data & Tabel
      const dataSiswa = [
        { hari: 'Senin', jml: 24 + num },
        { hari: 'Selasa', jml: 30 + num },
        { hari: 'Rabu', jml: 18 + num },
        { hari: 'Kamis', jml: 28 + num },
        { hari: 'Jumat', jml: 35 + num },
      ];
      const selisih = 35 + num - (18 + num);
      const opt = buildRotatedOptions(
        `${selisih} orang`,
        [`${selisih + 5} orang`, `${selisih - 3} orang`, `${selisih + 8} orang`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Analisis Data & Tabel Pengamatan',
        stimulus: `Berikut adalah data catatan kunjungan siswa ke perpustakaan sekolah selama satu minggu:\n• Senin: ${dataSiswa[0].jml} siswa\n• Selasa: ${dataSiswa[1].jml} siswa\n• Rabu: ${dataSiswa[2].jml} siswa\n• Kamis: ${dataSiswa[3].jml} siswa\n• Jumat: ${dataSiswa[4].jml} siswa`,
        question: `Berdasarkan data tabel di atas, selisih antara jumlah pengunjung terbanyak dan tersedikit adalah...`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Pengunjung terbanyak terjadi pada hari Jumat (${35 + num} siswa) dan tersedikit hari Rabu (${18 + num} siswa). Selisihnya = ${35 + num} - ${18 + num} = ${selisih} orang.`,
        cognitiveLevel: 'C4',
        indicator: `Disajikan tabel data frekuensi, peserta didik dapat menganalisis dan menghitung selisih nilai ekstrem.`,
        score: 1,
      };
    } else if (patternIndex === 2) {
      // Komparasi & Pecahan
      const opt = buildRotatedOptions(
        `3/4 lebih besar daripada 2/3`,
        [`2/3 lebih besar daripada 3/4`, `3/4 senilai dengan 2/3`, `3/4 dan 2/3 sama dengan 1`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Komparasi & Pengelompokan',
        stimulus: `Edo memiliki seutas tali sepanjang 3/4 meter, sedangkan Made memiliki tali sepanjang 2/3 meter untuk membuat simpul pramuka.`,
        question: `Perbandingan panjang tali yang dimiliki Edo dan Made yang benar adalah...`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Menyamakan penyebut: 3/4 = 9/12 dan 2/3 = 8/12. Karena 9/12 > 8/12, maka tali Edo (3/4) lebih panjang/besar daripada tali Made (2/3).`,
        cognitiveLevel: 'C3',
        indicator: `Disajikan dua nilai pecahan kontekstual, peserta didik dapat membandingkan besar nilainya dengan tepat.`,
        score: 1,
      };
    } else if (patternIndex === 3) {
      // Geometri & Pengukuran Luas / Keliling
      const p = 12 + (num % 5);
      const l = 8 + (num % 3);
      const luas = p * l;
      const keliling = 2 * (p + l);
      const opt = buildRotatedOptions(
        `Luas = ${luas} m² dan Keliling = ${keliling} m`,
        [`Luas = ${luas + 10} m² dan Keliling = ${keliling - 4} m`, `Luas = ${keliling} m² dan Keliling = ${luas} m`, `Luas = ${luas - 12} m² dan Keliling = ${keliling + 6} m`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Aplikasi Konsep Sehari-hari',
        stimulus: `Pak Rahmat memiliki sebidang kebun toga berbentuk persegi panjang dengan ukuran panjang ${p} meter dan lebar ${l} meter di belakang sekolah.`,
        question: `Berapakah luas dan keliling kebun toga Pak Rahmat tersebut?`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Luas = panjang × lebar = ${p} × ${l} = ${luas} m². Keliling = 2 × (panjang + lebar) = 2 × (${p} + ${l}) = ${keliling} m.`,
        cognitiveLevel: 'C3',
        indicator: `Disajikan masalah kontekstual bangun datar, peserta didik dapat menghitung luas dan keliling secara tepat.`,
        score: 1,
      };
    } else if (patternIndex === 4) {
      // Hubungan Sebab-Akibat / Waktu Jarak
      const kecepatan = 40;
      const jarak = 80;
      const waktuJam = jarak / kecepatan;
      const opt = buildRotatedOptions(
        `09.00 WIB`,
        [`08.30 WIB`, `09.30 WIB`, `10.00 WIB`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Hubungan Sebab-Akibat & Prediksi',
        stimulus: `Rombongan bus sekolah berangkat dari sekolah pukul 07.00 WIB menuju tempat museum edukasi dengan jarak ${jarak} km. Bus melaju dengan kecepatan rata-rata konstan ${kecepatan} km/jam tanpa berhenti.`,
        question: `Pukul berapa rombongan bus sekolah tersebut diperkirakan akan tiba di museum?`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Waktu tempuh = Jarak : Kecepatan = ${jarak} km : ${kecepatan} km/jam = ${waktuJam} jam. Tiba = 07.00 + 2 jam = 09.00 WIB.`,
        cognitiveLevel: 'C4',
        indicator: `Disajikan waktu keberangkatan dan kecepatan rata-rata, peserta didik dapat memprediksi waktu tiba di tujuan.`,
        score: 1,
      };
    } else if (patternIndex === 5) {
      // Analisis Pernyataan Kritis
      const opt = buildRotatedOptions(
        `(1) dan (3)`,
        [`(1) dan (2)`, `(2) dan (4)`, `(3) dan (4)`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Analisis Pernyataan Kritis',
        stimulus: `Perhatikan beberapa sifat bangun datar berikut!\n(1) Memiliki 4 sisi yang sama panjang\n(2) Memiliki 2 pasang sisi sejajar yang tidak sama panjang\n(3) Memiliki 4 sudut siku-siku (90°)\n(4) Tidak memiliki simetri lipat`,
        question: `Sifat-sifat yang dimiliki oleh bangun persegi (bujur sangkar) ditunjukkan oleh nomor...`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Persegi memiliki 4 sisi sama panjang (1) dan 4 sudut siku-siku (3), serta memiliki 4 simetri lipat. Nomor (2) dan (4) salah.`,
        cognitiveLevel: 'C4',
        indicator: `Disajikan beberapa pernyataan sifat geometri, peserta didik dapat menyeleksi karakteristik bangun datar tertentu.`,
        score: 1,
      };
    } else if (patternIndex === 6) {
      // Penalaran Dialog Siswa
      const opt = buildRotatedOptions(
        `Pendapat Dayu benar, karena kelipatan persekutuan terkecil (KPK) dari 4 dan 6 adalah 12`,
        [`Pendapat Dayu salah, karena 4 + 6 = 10 hari lagi`, `Pendapat Beni benar, karena mereka akan bertemu setiap 24 hari`, `Kedua pendapat salah, mereka tidak akan pernah berlatih bersama`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Penalaran Dialog & Diskusi',
        stimulus: `Edo dan Beni sedang berdiskusi di perpustakaan. Edo berlatih renang setiap 4 hari sekali, sedangkan Beni berlatih setiap 6 hari sekali. Dayu berpendapat bahwa mereka akan berlatih bersama lagi pada hari ke-12.`,
        question: `Bagaimanakah penilaian ilmiah yang paling tepat terhadap pendapat Dayu?`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Untuk menentukan waktu bersamaan digunakan KPK dari 4 dan 6. Faktorisasi: 4 = 2², 6 = 2 × 3. KPK = 2² × 3 = 12. Jadi pendapat Dayu tepat.`,
        cognitiveLevel: 'C5',
        indicator: `Disajikan dialog dua siswa tentang jadwal berkala, peserta didik dapat mengevaluasi argumen menggunakan konsep KPK.`,
        score: 1,
      };
    } else {
      // Urutan Prosedural
      const opt = buildRotatedOptions(
        `Mengubah pecahan campuran menjadi pecahan biasa terlebih dahulu`,
        [`Langsung mengalikan pembilang dengan penyebut tanpa menyamakan bentuk`, `Menghapus bilangan bulat di depan pecahan`, `Menjumlahkan penyebut secara langsung`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Urutan Logis & Prosedural',
        stimulus: `Dalam menyelesaikan operasi hitung perkalian pecahan campuran: 2 1/2 × 3/4, terdapat urutan langkah pengerjaan yang benar.`,
        question: `Langkah awal yang paling tepat untuk menyelesaikan soal hitung perkalian tersebut adalah...`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Langkah pertama yang benar adalah mengubah pecahan campuran (2 1/2) menjadi pecahan biasa (5/2), baru kemudian pembilang dikalikan pembilang dan penyebut dikalikan penyebut.`,
        cognitiveLevel: 'C3',
        indicator: `Disajikan prosedur operasi matematika, peserta didik dapat menentukan urutan tahapan penyelesaian yang logis.`,
        score: 1,
      };
    }
  }

  // 2. BAHASA INDONESIA
  if (subject.toLowerCase().includes('bahasa') || subject.toLowerCase().includes('indonesia')) {
    if (patternIndex === 0) {
      // Ide Pokok
      const opt = buildRotatedOptions(
        `Manfaat dan keistimewaan tanaman lidah buaya bagi kesehatan serta perawatan tubuh`,
        [`Kandungan air dan gel bening yang terdapat pada tanaman berduri`, `Cara menanam lidah buaya di pekarangan rumah agar subur`, `Bahaya penggunaan getah tanaman liar tanpa petunjuk dokter`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Studi Kasus & Pemecahan Masalah',
        stimulus: `"Tanaman lidah buaya memiliki beragam manfaat luar biasa bagi tubuh manusia. Gel bening yang terkandung di dalam daunnya dapat dimanfaatkan untuk menyuburkan rambut, menenangkan kulit yang terbakar sinar matahari, dan mempercepat penyembuhan luka ringan. Selain itu, olahan minuman lidah buaya juga baik untuk menjaga kesehatan saluran pencernaan."`,
        question: `Gagasan utama (ide pokok) dari kutipan teks deskripsi di atas adalah...`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Kalimat utama berada di awal paragraf mengenai ragam manfaat lidah buaya, yang diperjelas oleh rincian manfaat untuk rambut, kulit, luka, dan pencernaan.`,
        cognitiveLevel: 'C3',
        indicator: `Disajikan paragraf bacaan tentang ${topic}, peserta didik dapat menyimpulkan ide pokok teks dengan tepat.`,
        score: 1,
      };
    } else if (patternIndex === 1) {
      // Makna Kata Kontekstual
      const opt = buildRotatedOptions(
        `Pengikisan atau kerusakan lapisan tanah pesisir akibat hantaman ombak laut`,
        [`Pembersihan sampah laut oleh para nelayan tradisional`, `Penanaman kembali bibit pohon kelapa di sepanjang pesisir`, `Kenaikan permukaan air laut pada saat pasang purnama`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Komparasi & Pengelompokan',
        stimulus: `"Pemerintah daerah menggalakkan program penanaman 1.000 bibit pohon mangrove untuk mencegah meluasnya abrasi di garis pantai Pulau Harapan."`,
        question: `Makna istilah ilmiah 'abrasi' pada kalimat berita di atas adalah...`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Menurut KBBI dan istilah geografi, abrasi adalah proses pengikisan pantai oleh tenaga gelombang laut dan arus laut yang bersifat merusak.`,
        cognitiveLevel: 'C2',
        indicator: `Disajikan kalimat berkonteks lingkungan, peserta didik dapat menafsirkan makna istilah khusus dengan benar.`,
        score: 1,
      };
    } else if (patternIndex === 2) {
      // Sebab-Akibat Eksplanasi
      const opt = buildRotatedOptions(
        `Tumpukan sampah plastik menyumbat saluran drainase sehingga air hujan tidak dapat mengalir lancar`,
        [`Anak-anak sekolah bermain air hujan di pinggir lapangan`, `Warga menanam pohon peneduh di tepi jalan desa`, `Toko dan pasar tutup lebih awal saat hujan lebat`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Hubungan Sebab-Akibat & Prediksi',
        stimulus: `"Setiap kali hujan deras turun selama lebih dari dua jam, jalan utama di Desa Sukamaju selalu tergenang air setinggi lutut orang dewasa. Petugas kebersihan menemukan banyak kantong plastik, botol bekas, dan ranting kayu yang menumpuk di mulut gorong-gorong pembuangan air."`,
        question: `Berdasarkan teks eksplanasi di atas, apa faktor penyebab utama timbulnya genangan air tersebut?`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Hubungan sebab-akibat: penumpukan sampah plastik dan limbah padat di gorong-gorong menyebabkan tersumbatnya aliran air hujan menuju sungai.`,
        cognitiveLevel: 'C4',
        indicator: `Disajikan teks eksplanasi fenomena sosial/lingkungan, peserta didik dapat menelaah hubungan sebab-akibat kejadian.`,
        score: 1,
      };
    } else if (patternIndex === 3) {
      // Analisis Data Tabel Bacaan
      const opt = buildRotatedOptions(
        `Warga RT 03 mengumpulkan volume sampah anorganik terbanyak untuk didaur ulang`,
        [`Warga RT 01 mengumpulkan sampah lebih banyak daripada RT 03`, `Total sampah yang terkumpul paling sedikit berasal dari RT 04`, `Partisipasi warga RT 02 adalah yang paling tinggi di antara semua RT`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Analisis Data & Tabel Pengamatan',
        stimulus: `Perhatikan catatan data hasil pengumpulan sampah botol plastik di 4 RT Desa Mandiri berikut:\n• RT 01: 45 kg\n• RT 02: 60 kg\n• RT 03: 95 kg\n• RT 04: 50 kg`,
        question: `Pernyataan simpulan yang paling tepat berdasarkan data catatan di atas adalah...`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `RT 03 mengumpulkan 95 kg yang merupakan jumlah tertinggi di antara semua RT. Pilihan lainnya bertentangan dengan data numerik.`,
        cognitiveLevel: 'C4',
        indicator: `Disajikan tabel data ringkas, peserta didik dapat menginterpretasikan informasi teks dengan benar.`,
        score: 1,
      };
    } else if (patternIndex === 4) {
      // Analisis Pernyataan Kritis
      const opt = buildRotatedOptions(
        `(1) dan (3)`,
        [`(1) dan (2)`, `(2) dan (4)`, `(3) dan (4)`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Analisis Pernyataan Kritis',
        stimulus: `Perhatikan beberapa kalimat berikut!\n(1) Kereta api Argo Bromo tiba di Stasiun Gambir tepat pukul 06.30 WIB.\n(2) Sepertinya pemandangan matahari terbit di puncak bukit itu sangat memesona.\n(3) Luas wilayah Indonesia membentang dari Sabang hingga Merauke.\n(4) Masakan sup buntut buatan warung pojok adalah yang paling lezat di dunia.`,
        question: `Kalimat yang merupakan FAKTA (dapat dibuktikan kebenarannya secara nyata) ditunjukkan oleh nomor...`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Kalimat (1) dan (3) adalah kalimat fakta karena memuat data nyata dan dapat diverifikasi. Kalimat (2) dan (4) mengandung kata opini ('sepertinya', 'paling lezat di dunia').`,
        cognitiveLevel: 'C4',
        indicator: `Disajikan beberapa kalimat ragam teks, peserta didik dapat membedakan kalimat fakta dan opini secara cermat.`,
        score: 1,
      };
    } else if (patternIndex === 5) {
      // Penalaran Dialog
      const opt = buildRotatedOptions(
        `"Bolehkah saya meminjam kamus Bahasa Indonesia milikmu sebentar untuk mencari arti kata sulit, Lani?"`,
        [`"Lani, beri aku kamusmu sekarang juga karena aku sedang butuh!"`, `"Jangan pakai kamus itu, Lani, biar aku saja yang membawanya pulang!"`, `"Kamusmu jelek sekali Lani, tapi tetap akan kupakai!"`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Penalaran Dialog & Diskusi',
        stimulus: `Siti ingin meminjam kamus bahasa yang sedang dibaca oleh temannya, Lani, di pojok baca kelas.`,
        question: `Ungkapan kalimat permintaan izin yang paling santun dan sesuai etika berbahasa adalah...`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Bahasa santun ditandai penggunaan kata 'bolehkah saya', nada ramah, alasan jelas, dan menyebut nama teman dengan hormat tanpa nada memaksa.`,
        cognitiveLevel: 'C3',
        indicator: `Disajikan situasi interaksi antarsiswa, peserta didik dapat menentukan kalimat santun meminta bantuan/izin.`,
        score: 1,
      };
    } else if (patternIndex === 6) {
      // Teks Prosedur / Urutan Logis
      const opt = buildRotatedOptions(
        `(2) - (4) - (1) - (3)`,
        [`(1) - (2) - (3) - (4)`, `(2) - (1) - (4) - (3)`, `(4) - (2) - (1) - (3)`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Urutan Logis & Prosedural',
        stimulus: `Perhatikan petunjuk acak cara mencuci tangan pakai sabun berikut:\n(1) Gosok punggung tangan, sela-sela jari, dan bawah kuku secara merata\n(2) Basahi seluruh tangan dengan air bersih yang mengalir\n(3) Bilas tangan hingga bersih dan keringkan dengan handuk bersih\n(4) Tuangkan sabun cair secukupnya pada telapak tangan`,
        question: `Urutan langkah mencuci tangan yang benar dan runtut adalah...`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Urutan higienis standar: basahi tangan (2) -> tuang sabun (4) -> gosok sela-sela jari (1) -> bilas dan keringkan (3).`,
        cognitiveLevel: 'C3',
        indicator: `Disajikan tahapan acak teks petunjuk, peserta didik dapat menyusun urutan kerja yang logis.`,
        score: 1,
      };
    } else {
      // Amanat / Nilai Moral
      const opt = buildRotatedOptions(
        `Kita harus bersikap jujur dan mengakui kesalahan secara kesatria`,
        [`Jangan pernah bermain bola bersama teman di sore hari`, `Sebaiknya menyembunyikan kesalahan agar tidak dimarahi orang tua`, `Menyalahkan orang lain adalah cara cepat terbebas dari masalah`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Pengambilan Sikap & Refleksi Nilai',
        stimulus: `"Saat menendang bola di halaman, bola tendangan Budi tidak sengaja mengenai pot bunga kesayangan tetangganya hingga pecah. Teman-temannya menyuruh Budi segera lari sembunyi. Namun, Budi memberanikan diri mengetuk pintu rumah tetangga dan meminta maaf serta berjanji akan mengganti pot tersebut."`,
        question: `Amanat atau pesan moral yang terkandung dalam cuplikan cerita di atas adalah...`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Tindakan Budi mencerminkan integritas moral tinggi: berani bertanggung jawab atas kesalahan dan jujur daripada melarikan diri dari masalah.`,
        cognitiveLevel: 'C4',
        indicator: `Disajikan kutipan cerita anak, peserta didik dapat menemukan pesan moral yang tersirat.`,
        score: 1,
      };
    }
  }

  // 3. PENDIDIKAN PANCASILA
  if (subject.toLowerCase().includes('pancasila') || subject.toLowerCase().includes('pkn')) {
    if (patternIndex === 0) {
      const opt = buildRotatedOptions(
        `Menghargai perbedaan pendapat dan melaksanakan keputusan musyawarah dengan penuh tanggung jawab`,
        [`Memaksakan kehendak pribadi agar usulannya disetujui teman-teman`, `Meninggalkan ruangan kelas karena pendapatnya tidak dipilih`, `Memusuhi teman yang berbeda pilihan saat pemungutan suara`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Studi Kasus & Pemecahan Masalah',
        stimulus: `Kelas ${grade} sedang mengadakan musyawarah untuk menentukan ketua regu piket kebersihan. Siti dan Made memiliki usulan yang berbeda tentang susunan jadwal harian.`,
        question: `Sikap yang paling mencerminkan pengamalan nilai sila ke-4 Pancasila dalam musyawarah adalah...`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Sila ke-4 mengamanatkan musyawarah mufakat, menghargai keberagaman pandangan, serta tunduk pada keputusan bersama secara bertanggung jawab.`,
        cognitiveLevel: 'C3',
        indicator: `Disajikan studi kasus musyawarah kelas, peserta didik dapat menentukan perilaku berakar nilai sila ke-4.`,
        score: 1,
      };
    } else if (patternIndex === 1) {
      const opt = buildRotatedOptions(
        `Hak: Membaca dan meminjam buku; Kewajiban: Menjaga buku agar tidak robek dan mengembalikannya tepat waktu`,
        [`Hak: Mencoret-coret halaman buku; Kewajiban: Membayar denda`, `Hak: Membawa pulang buku tanpa izin; Kewajiban: Membersihkan meja`, `Hak: Mengunci perpustakaan; Kewajiban: Merapikan rak`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Komparasi & Pengelompokan',
        stimulus: `Setiap siswa di sekolah memiliki hak untuk menikmati fasilitas yang tersedia, sekaligus kewajiban moral dan aturan yang harus dipatuhi saat berada di perpustakaan sekolah.`,
        question: `Pasangan hak dan kewajiban yang seimbang saat berada di perpustakaan sekolah adalah...`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Hak siswa adalah memanfaatkan fasilitas buku untuk belajar. Kewajiban yang menyertainya adalah memelihara keutuhan buku dan mematuhi batas waktu pinjam.`,
        cognitiveLevel: 'C4',
        indicator: `Disajikan konteks fasilitas umum sekolah, peserta didik dapat membedakan hak dan kewajiban secara selaras.`,
        score: 1,
      };
    } else if (patternIndex === 2) {
      const opt = buildRotatedOptions(
        `Menjaga ketenangan dan tidak membuat kegaduhan di sekitar rumah I Gede`,
        [`Menyalakan petasan dan musik kencang di depan gang rumahnya`, `Memaksa I Gede untuk ikut bermain sepak bola di lapangan`, `Mengabaikan dan tidak mau menyapa I Gede lagi`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Hubungan Sebab-Akibat & Prediksi',
        stimulus: `Tetangga baru di samping rumah Udin bernama I Gede yang berasal dari Bali. Hari ini keluarga I Gede sedang melaksanakan ibadah Hari Raya Nyepi di rumahnya dengan khidmat.`,
        question: `Tindakan yang paling mencerminkan toleransi antarumat beragama sesuai sila ke-1 Pancasila adalah...`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Toleransi beragama diwujudkan dengan saling menghormati kekhusyukan ibadah sesama warga, menjaga ketertiban, dan tidak mengganggu peribadatan tetangga.`,
        cognitiveLevel: 'C3',
        indicator: `Disajikan situasi keragaman agama di lingkungan sekitar, peserta didik dapat memilih tindakan toleran yang tepat.`,
        score: 1,
      };
    } else if (patternIndex === 3) {
      const opt = buildRotatedOptions(
        `Pohon Beringin (Persatuan Indonesia)`,
        [`Bintang Emas (Ketuhanan Yang Maha Esa)`, `Rantai Emas (Kemanusiaan yang Adil dan Beradab)`, `Padi dan Kapas (Keadilan Sosial)`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Aplikasi Konsep Sehari-hari',
        stimulus: `Seluruh warga kampung bergotong royong membersihkan selokan desa menjelang musim hujan tanpa memandang perbedaan suku, ras, maupun latar belakang asal-usul keluarga.`,
        question: `Kegiatan gotong royong warga tersebut merupakan wujud nyata pengamalan lambang sila Pancasila yaitu...`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Gotong royong merawat persatuan dan kebersamaan bangsa merupakan esensi Sila ke-3 (Persatuan Indonesia) yang dilambangkan oleh Pohon Beringin.`,
        cognitiveLevel: 'C3',
        indicator: `Disajikan fenomena gotong royong warga, peserta didik dapat mengaitkannya dengan lambang sila Pancasila.`,
        score: 1,
      };
    } else if (patternIndex === 4) {
      const opt = buildRotatedOptions(
        `(1) dan (4)`,
        [`(1) dan (2)`, `(2) dan (3)`, `(3) dan (4)`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Analisis Pernyataan Kritis',
        stimulus: `Perhatikan pernyataan-pernyataan berikut!\n(1) Menghormati teman yang sedang berpuasa\n(2) Memilih-milih teman hanya yang satu daerah asal\n(3) Mengejek logat bahasa daerah teman sekelas\n(4) Mengenakan pakaian adat daerah pada peringatan Hari Kartini dengan bangga`,
        question: `Sikap yang menunjukkan penghargaan terhadap keragaman budaya bangsa ditunjukkan oleh nomor...`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Pernyataan (1) dan (4) menunjukkan sikap inklusif dan apresiasi terhadap keragaman budaya/agama. Pernyataan (2) dan (3) adalah sikap diskriminatif yang dilarang.`,
        cognitiveLevel: 'C4',
        indicator: `Disajikan ragam perilaku sosial, peserta didik dapat menganalisis sikap yang mendukung integrasi nasional.`,
        score: 1,
      };
    } else if (patternIndex === 5) {
      const opt = buildRotatedOptions(
        `Mendengarkan keluhan kedua teman secara netral dan mengajak mereka saling memaafkan`,
        [`Membela teman yang lebih dekat dan memusuhi teman yang lain`, `Ikut memperkeruh suasana dengan berteriak di depan kelas`, `Membiarkan mereka berkelahi sampai ada yang menang`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Penalaran Dialog & Diskusi',
        stimulus: `Dua orang teman sekelasmu, Beni dan Edo, berselisih paham saat bermain kasti hingga keduanya saling menyalahkan dan tidak mau bertegur sapa.`,
        question: `Sebagai teman yang mengamalkan nilai perdamaian dan keadilan, apa yang sebaiknya kamu lakukan?`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Sebagai mediator sebaya, sikap bijak adalah mendengarkan secara objektif, menenangkan emosi, dan memfasilitasi rekonsiliasi damai tanpa memihak.`,
        cognitiveLevel: 'C5',
        indicator: `Disajikan konflik antarteman di sekolah, peserta didik dapat menentukan resolusi konflik damai.`,
        score: 1,
      };
    } else if (patternIndex === 6) {
      const opt = buildRotatedOptions(
        `Menyeberang jalan melalui zebra cross atau jembatan penyeberangan orang (JPO)`,
        [`Menyeberang sambil berlari di tikungan jalan yang ramai kendaraan`, `Menerobos lampu merah saat jalanan terlihat sepi`, `Berjalan di tengah jalan raya bersama teman-teman`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Urutan Logis & Prosedural',
        stimulus: `Setiap pagi, anak-anak sekolah harus menyeberangi jalan raya yang ramai di depan gerbang sekolah untuk menuju kelas.`,
        question: `Penerapan norma hukum dan keselamatan lalu lintas yang benar saat menyeberang jalan adalah...`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Fasilitas zebra cross dan JPO disediakan undang-undang lalu lintas demi keselamatan pejalan kaki saat menyeberangi jalan ramai.`,
        cognitiveLevel: 'C3',
        indicator: `Disajikan situasi lalu lintas di sekitar sekolah, peserta didik dapat mengidentifikasi penerapan norma keselamatan jalan.`,
        score: 1,
      };
    } else {
      const opt = buildRotatedOptions(
        `Membagi tugas membersihkan ruangan secara adil tanpa membeda-bedakan jenis kelamin`,
        [`Menyerahkan seluruh pekerjaan berat hanya kepada siswa laki-laki`, `Membiarkan teman yang pendiam bekerja sendirian membersihkan lantai`, `Hanya bekerja jika diperhatikan langsung oleh wali kelas`],
        targetPos
      );
      return {
        id: `q-${num}`,
        number: num,
        type: 'Pilihan Ganda',
        pattern: 'Pengambilan Sikap & Refleksi Nilai',
        stimulus: `Dalam pembagian tugas regu piket kelas, setiap anggota diharapkan berkontribusi secara nyata demi kenyamanan bersama.`,
        question: `Tindakan yang paling mencerminkan prinsip keadilan sosial (Sila ke-5) dalam pembagian piket kelas adalah...`,
        options: opt.options,
        correctAnswer: opt.correctAnswer,
        discussion: `Keadilan sosial tercermin dalam perlakuan yang setara, pembagian beban tugas yang seimbang, dan penghargaan terhadap hak setiap orang.`,
        cognitiveLevel: 'C4',
        indicator: `Disajikan kegiatan kelompok kelas, peserta didik dapat merefleksikan nilai keadilan sosial Pancasila.`,
        score: 1,
      };
    }
  }

  // 4. DEFAULT: IPAS / SAINS UMUM
  if (patternIndex === 0) {
    // Studi Kasus & Pemecahan Masalah
    const opt = buildRotatedOptions(
      `Memindahkan pot tanaman ke tempat yang cukup memperoleh sinar matahari dan menyiramnya secara teratur`,
      [`Menutup tanaman dengan kardus rapat agar tidak kepanasan`, `Memberikan pupuk kimia dalam jumlah sangat banyak sekaligus`, `Memotong seluruh daun tanaman hingga hanya tersisa batangnya`],
      targetPos
    );
    return {
      id: `q-${num}`,
      number: num,
      type: 'Pilihan Ganda',
      pattern: 'Studi Kasus & Pemecahan Masalah',
      stimulus: `Edo mengamati tanaman hias di sudut ruangan kelasnya tampak layu, daunnya berwarna pucat kekuningan, dan batangnya lemah karena sudah dua minggu berada di ruangan gelap tanpa cahaya matahari.`,
      question: `Langkah pemecahan masalah yang paling tepat agar tanaman hias Edo kembali segar dan sehat adalah...`,
      options: opt.options,
      correctAnswer: opt.correctAnswer,
      discussion: `Cahaya matahari adalah energi esensial untuk mengaktifkan klorofil dalam fotosintesis. Memindahkan ke tempat terang dan menyiram dengan takaran pas akan memulihkan metabolisme tumbuhan.`,
      cognitiveLevel: 'C4',
      indicator: `Disajikan studi kasus kondisi tanaman layu, peserta didik dapat menentukan solusi perawatan berbasis fotosintesis.`,
      score: 1,
    };
  } else if (patternIndex === 1) {
    // Analisis Data & Tabel Pengamatan
    const opt = buildRotatedOptions(
      `Semakin lama waktu pemanasan, suhu air akan semakin meningkat karena menyerap kalor`,
      [`Suhu air tidak dipengaruhi oleh lama waktu pemanasan api`, `Setelah menit ke-6 air akan berubah wujud menjadi benda padat`, `Air melepaskan kalor ke udara sehingga suhunya terus turun`],
      targetPos
    );
    return {
      id: `q-${num}`,
      number: num,
      type: 'Pilihan Ganda',
      pattern: 'Analisis Data & Tabel Pengamatan',
      stimulus: `Perhatikan tabel hasil pengukuran suhu air saat dipanaskan di atas kompor berikut:\n• Menit ke-0: 25°C\n• Menit ke-2: 45°C\n• Menit ke-4: 65°C\n• Menit ke-6: 85°C\n• Menit ke-8: 100°C`,
      question: `Berdasarkan data tabel hasil pengamatan di atas, simpulan ilmiah yang paling tepat adalah...`,
      options: opt.options,
      correctAnswer: opt.correctAnswer,
      discussion: `Pemberian energi panas (kalor) secara berkesinambungan menyebabkan kenaikan suhu benda secara teratur hingga mencapai titik didih (100°C).`,
      cognitiveLevel: 'C4',
      indicator: `Disajikan tabel data perubahan suhu akibat pemanasan, peserta didik dapat menarik simpulan relasi kalor dan suhu.`,
      score: 1,
    };
  } else if (patternIndex === 2) {
    // Hubungan Sebab-Akibat & Prediksi Dampak
    const opt = buildRotatedOptions(
      `Populasi tikus sawah meningkat pesat sehingga merusak tanaman padi milik petani`,
      [`Hasil panen padi petani menjadi berlipat ganda`, `Populasi elang pemangsa meningkat tajam karena tidak ada saingan`, `Tanah sawah menjadi semakin subur tanpa perlu dipupuk`],
      targetPos
    );
    return {
      id: `q-${num}`,
      number: num,
      type: 'Pilihan Ganda',
      pattern: 'Hubungan Sebab-Akibat & Prediksi',
      stimulus: `Dalam rantai makanan ekosistem sawah terdapat jaring-jaring kehidupan: Padi -> Tikus -> Ular Sawah -> Burung Elang. Baru-baru ini, terjadi perburuan liar ular sawah secara besar-besaran oleh sekelompok orang.`,
      question: `Prediksi dampak yang paling mungkin terjadi pada ekosistem sawah akibat hilangnya ular sawah adalah...`,
      options: opt.options,
      correctAnswer: opt.correctAnswer,
      discussion: `Ular adalah predator pengendali tikus. Jika populasi ular musnah, populasi tikus akan meledak (outbreak) dan menyebabkan gagal panen bagi tanaman padi petani.`,
      cognitiveLevel: 'C4',
      indicator: `Disajikan rantai makanan terganggu, peserta didik dapat memprediksi dampak perubahan populasi makhluk hidup.`,
      score: 1,
    };
  } else if (patternIndex === 3) {
    // Komparasi & Karakteristik
    const opt = buildRotatedOptions(
      `Benda padat memiliki bentuk dan volume tetap, sedangkan benda gas bentuk dan volumenya berubah-ubah`,
      [`Benda padat bentuknya selalu berubah mengikuti bentuk wadahnya`, `Benda cair tidak memiliki massa maupun volume`, `Benda gas susunan partikelnya sangat rapat dan tidak dapat bergerak`],
      targetPos
    );
    return {
      id: `q-${num}`,
      number: num,
      type: 'Pilihan Ganda',
      pattern: 'Komparasi & Pengelompokan',
      stimulus: `Di sekitar kita terdapat berbagai wujud zat materi, seperti batu kerikil (padat), minyak goreng (cair), dan udara di dalam balon (gas).`,
      question: `Perbedaan karakteristik mendasar antara benda padat dan benda gas yang tepat adalah...`,
      options: opt.options,
      correctAnswer: opt.correctAnswer,
      discussion: `Partikel benda padat sangat rapat dan terikat kuat sehingga bentuk dan volume konstan. Sebaliknya, partikel gas sangat renggang dan bebas bergerak sehingga bentuk serta volumenya berubah sesuai ruang.`,
      cognitiveLevel: 'C4',
      indicator: `Disajikan wujud materi alamiah, peserta didik dapat mengomparasi sifat fisik zat padat dan gas.`,
      score: 1,
    };
  } else if (patternIndex === 4) {
    // Analisis Pernyataan Kritis
    const opt = buildRotatedOptions(
      `(2) dan (3)`,
      [`(1) dan (2)`, `(1) dan (4)`, `(3) dan (4)`],
      targetPos
    );
    return {
      id: `q-${num}`,
      number: num,
      type: 'Pilihan Ganda',
      pattern: 'Analisis Pernyataan Kritis',
      stimulus: `Perhatikan beberapa peristiwa perubahan wujud benda berikut!\n(1) Air yang dimasukkan ke dalam freezer membeku menjadi es batu\n(2) Baju basah yang dijemur di bawah terik matahari menjadi kering\n(3) Mentega meleleh saat dimasukkan ke dalam wajan panas di atas kompor\n(4) Titik-titik air terbentuk pada tutup cangkir teh panas yang ditutup`,
      question: `Peristiwa perubahan wujud zat yang MEMBUTUHKAN atau MENYERAP kalor (energi panas) ditunjukkan oleh nomor...`,
      options: opt.options,
      correctAnswer: opt.correctAnswer,
      discussion: `Menguap (2) dan mencair (3) membutuhkan kalor dari lingkungan. Membeku (1) dan mengembun (4) melepaskan kalor ke lingkungan.`,
      cognitiveLevel: 'C4',
      indicator: `Disajikan sekumpulan peristiwa perubahan wujud zat, peserta didik dapat menyeleksi proses yang membutuhkan energi kalor.`,
      score: 1,
    };
  } else if (patternIndex === 5) {
    // Penalaran Percakapan Murid
    const opt = buildRotatedOptions(
      `"Pendapat Siti benar, karena bayangan terjadi karena cahaya matahari merambat lurus dan terhalang tubuh kita."`,
      [`"Pendapat Dayu benar, karena bayangan tercipta oleh hembusan angin sepoi-sepoi."`, `"Kedua pendapat salah, bayangan adalah zat cair yang keluar dari pori-pori tanah."`, `"Bayangan hanya bisa muncul jika kita memakai baju berwarna hitam pekat."`],
      targetPos
    );
    return {
      id: `q-${num}`,
      number: num,
      type: 'Pilihan Ganda',
      pattern: 'Penalaran Dialog & Diskusi',
      stimulus: `Saat bermain di lapangan sekolah pada siang hari yang terik, Siti dan Dayu mengamati bayangan tubuh mereka di tanah. Siti berpendapat bayangan terbentuk karena tubuh mereka menghalangi cahaya matahari yang merambat lurus. Dayu mengira bayangan disebabkan oleh angin yang berhembus.`,
      question: `Pernyataan ilmiah yang paling tepat untuk mengevaluasi dialog di atas adalah...`,
      options: opt.options,
      correctAnswer: opt.correctAnswer,
      discussion: `Cahaya memiliki sifat merambat lurus. Apabila berkas cahaya terhalang oleh benda gelap (tidak tembus cahaya seperti tubuh manusia), maka di belakang benda terbentuk daerah gelap yang disebut bayangan.`,
      cognitiveLevel: 'C5',
      indicator: `Disajikan dialog dua siswa tentang sifat cahaya, peserta didik dapat mengevaluasi penjelasan fenomena optik sederhana.`,
      score: 1,
    };
  } else if (patternIndex === 6) {
    // Aplikasi Konsep Sehari-hari
    const opt = buildRotatedOptions(
      `Aluminium adalah konduktor panas yang baik agar masakan cepat matang, sedangkan ebonit adalah isolator panas agar tangan aman saat memegang panci`,
      [`Aluminium menyerap bau masakan, sedangkan ebonit membuat panci menjadi sangat berat`, `Aluminium adalah bahan isolator dan ebonit adalah bahan konduktor`, `Keduanya dipilih semata-mata agar warna panci terlihat menarik`],
      targetPos
    );
    return {
      id: `q-${num}`,
      number: num,
      type: 'Pilihan Ganda',
      pattern: 'Aplikasi Konsep Sehari-hari',
      stimulus: `Ibu menggunakan panci masak di dapur untuk merebus air. Bagian dasar panci terbuat dari bahan logam aluminium, sedangkan pegangan atau gagang panci dilapisi plastik tebal atau kayu (ebonit).`,
      question: `Alasan ilmiah pemilihan bahan pembuatan bagian-bagian panci masak tersebut adalah...`,
      options: opt.options,
      correctAnswer: opt.correctAnswer,
      discussion: `Logam aluminium menghantarkan kalor secara cepat (konduktor), sementara ebonit menahan perambatan kalor (isolator) sehingga tangan pengguna tidak melepuh karena panas.`,
      cognitiveLevel: 'C4',
      indicator: `Disajikan alat dapur sehari-hari, peserta didik dapat menganalisis fungsi bahan konduktor dan isolator kalor.`,
      score: 1,
    };
  } else {
    // Urutan Prosedural & Tahapan Alami
    const opt = buildRotatedOptions(
      `Telur -> Ulat (Larva) -> Kepompong (Pupa) -> Kupu-kupu Dewasa (Imago)`,
      [`Telur -> Kepompong -> Ulat -> Kupu-kupu Dewasa`, `Ulat -> Telur -> Kepompong -> Kupu-kupu Dewasa`, `Kepompong -> Ulat -> Telur -> Kupu-kupu Dewasa`],
      targetPos
    );
    return {
      id: `q-${num}`,
      number: num,
      type: 'Pilihan Ganda',
      pattern: 'Urutan Logis & Prosedural',
      stimulus: `Kupu-kupu merupakan salah satu serangga yang mengalami daur hidup metamorfosis sempurna dengan perubahan bentuk tubuh yang sangat berbeda pada setiap fasenya.`,
      question: `Urutan tahapan metamorfosis sempurna pada kupu-kupu yang benar adalah...`,
      options: opt.options,
      correctAnswer: opt.correctAnswer,
      discussion: `Daur metamorfosis sempurna serangga: dimulai dari stadium telur, menetas menjadi larva/ulat yang aktif makan daun, membentuk pupa/kepompong masa istirahat, lalu keluar menjadi imago (kupu-kupu dewasa).`,
      cognitiveLevel: 'C3',
      indicator: `Disajikan daur hidup hewan, peserta didik dapat mengurutkan tahapan metamorfosis sempurna secara runtut.`,
      score: 1,
    };
  }
}

function generateSamplePGK(
  num: number,
  subject: string,
  grade: string,
  topic: string,
  tp: string,
  cognLevel: QuestionItem['cognitiveLevel']
): QuestionItem {
  const variant = (num - 1) % 4;
  if (variant === 0) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Pilihan Ganda Kompleks',
      pattern: 'Analisis Pernyataan Kompleks',
      stimulus: `Perhatikan beberapa pernyataan ilmiah terkait energi dan perubahannya dalam kehidupan sehari-hari berikut ini!`,
      question: `Pilihlah DUA pernyataan yang BENAR dengan memberi tanda centang (✓) pada kotak yang tersedia!`,
      options: [
        `[ ] A. Panel surya mengubah energi cahaya matahari menjadi energi listrik`,
        `[ ] B. Kipas angin yang berputar mengubah energi gerak menjadi energi panas murni`,
        `[ ] C. Setrika listrik memanfaatkan perubahan energi listrik menjadi energi kalor`,
        `[ ] D. Energi dapat dimusnahkan dan dihilangkan sepenuhnya oleh mesin`,
      ],
      correctAnswer: `Pernyataan A dan C Benar`,
      discussion: `Pernyataan A benar (efek fotovoltaik) dan C benar (elemen pemanas setrika). Pernyataan B salah (listrik jadi gerak) dan D salah (Hukum Kekekalan Energi menyatakan energi tidak dapat dimusnahkan).`,
      cognitiveLevel: 'C4',
      indicator: `Disajikan beberapa pernyataan konversi energi, peserta didik dapat memvalidasi pernyataan yang benar secara mandiri.`,
      score: 2,
    };
  } else if (variant === 1) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Pilihan Ganda Kompleks',
      pattern: 'Analisis Pernyataan Kompleks',
      stimulus: `Sekelompok siswa sedang mengidentifikasi ciri-ciri khusus makhluk hidup dan lingkungannya di taman sekolah.`,
      question: `Manakah DUA adaptasi morfologi tumbuhan yang hidup di tempat kering (kaktus/xerofit)? Beri tanda centang (✓)!`,
      options: [
        `[ ] A. Daun tereduksi menyerupai duri untuk mengurangi penguapan air`,
        `[ ] B. Daun sangat lebar dan tipis untuk mempercepat penguapan air`,
        `[ ] C. Batang tebal dan berlapis lilin untuk menyimpan cadangan air`,
        `[ ] D. Akar sangat pendek dan mengapung bebas di permukaan air`,
      ],
      correctAnswer: `Pernyataan A dan C Benar`,
      discussion: `Kaktus beradaptasi dengan daun berbentuk duri (A) dan batang sukulen tebal berlapis lilin (C). Daun lebar (B) adalah ciri hidrofit seperti teratai, akar mengapung (D) adalah ciri eceng gondok.`,
      cognitiveLevel: 'C4',
      indicator: `Disajikan ragam adaptasi makhluk hidup, peserta didik dapat memilih karakteristik tumbuhan xerofit dengan tepat.`,
      score: 2,
    };
  } else if (variant === 2) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Pilihan Ganda Kompleks',
      pattern: 'Analisis Pernyataan Kompleks',
      stimulus: `Perhatikan beberapa sifat magnet alami dan buatan yang diamati saat percobaan sains di laboratorium!`,
      question: `Pilihlah DUA sifat kemagnetan yang BENAR dengan memberi tanda centang (✓)!`,
      options: [
        `[ ] A. Kutub magnet yang senama (U-U atau S-S) akan tolak-menolak jika didekatkan`,
        `[ ] B. Kutub magnet yang berlainan nama (U-S) akan tolak-menolak dengan kuat`,
        `[ ] C. Gaya magnet terbesar terletak pada bagian kedua ujung kutubnya`,
        `[ ] D. Magnet dapat menarik semua jenis benda termasuk plastik dan kaca`,
      ],
      correctAnswer: `Pernyataan A dan C Benar`,
      discussion: `Hukum dasar magnet: kutub senama tolak-menolak (A) dan kutub tidak senama tarik-menarik. Bagian kutub memiliki medan magnet paling kuat (C). Plastik dan kaca adalah non-magnetis (D salah).`,
      cognitiveLevel: 'C4',
      indicator: `Disajikan konsep kemagnetan, peserta didik dapat mengidentifikasi karakteristik medan dan kutub magnet.`,
      score: 2,
    };
  } else {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Pilihan Ganda Kompleks',
      pattern: 'Analisis Pernyataan Kompleks',
      stimulus: `Dalam sebuah negara kesatuan yang beragam, terdapat berbagai bentuk partisipasi warga negara dalam memelihara persatuan.`,
      question: `Pilihlah DUA tindakan nyata siswa di sekolah yang memperkuat semangat gotong royong dan persatuan!`,
      options: [
        `[ ] A. Bersama-sama membersihkan lingkungan sekolah saat kerja bakti Jumat Bersih`,
        `[ ] B. Mengutamakan berteman hanya dengan teman yang memiliki suku sama`,
        `[ ] C. Membantu menjelaskan materi pelajaran kepada teman yang kesulitan belajar`,
        `[ ] D. Membiarkan teman piket bekerja sendirian tanpa bantuan`,
      ],
      correctAnswer: `Pernyataan A dan C Benar`,
      discussion: `Tindakan gotong royong dan solidaritas ditunjukkan lewat kerja bakti bersama (A) dan saling berbagi ilmu (C). Menolak berteman karena suku (B) dan abai tugas (D) melanggar nilai kebersamaan.`,
      cognitiveLevel: 'C4',
      indicator: `Disajikan ragam perilaku sosial di sekolah, peserta didik dapat memilih tindakan yang memupuk persatuan.`,
      score: 2,
    };
  }
}

function generateSampleC1Isian(
  num: number,
  subject: string,
  grade: string,
  topic: string,
  tp: string
): QuestionItem {
  const subjLower = subject.toLowerCase();
  const variant = (num - 1) % 4;

  if (subjLower.includes('matematika')) {
    if (variant === 0) {
      return {
        id: `q-${num}`,
        number: num,
        type: 'Isian Singkat',
        pattern: 'Hafalan Perkalian Dasar',
        stimulus: 'Fakta dasar perkalian bilangan satu angka.',
        question: 'Hasil perkalian dari 8 × 5 adalah ....................................................',
        correctAnswer: '40',
        discussion: '8 × 5 = 40.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat mengingat dan menuliskan hasil perkalian bilangan dasar.',
        score: 2,
      };
    } else if (variant === 1) {
      return {
        id: `q-${num}`,
        number: num,
        type: 'Isian Singkat',
        pattern: 'Pengenalan Bangun Datar',
        stimulus: 'Bangun datar yang dibatasi oleh tiga garis lurus.',
        question: 'Bangun datar yang memiliki 3 buah sisi dan 3 titik sudut disebut ....................................................',
        correctAnswer: 'Segitiga',
        discussion: 'Segitiga adalah bangun datar dengan tiga sisi dan tiga sudut.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat menyebutkan nama bangun datar bersisi tiga.',
        score: 2,
      };
    } else if (variant === 2) {
      return {
        id: `q-${num}`,
        number: num,
        type: 'Isian Singkat',
        pattern: 'Pengenalan Jenis Sudut',
        stimulus: 'Sudut berukuran tegak lurus.',
        question: 'Sudut yang besarnya tepat 90 derajat dinamakan sudut ....................................................',
        correctAnswer: 'Siku-siku',
        discussion: 'Sudut 90 derajat dinamakan sudut siku-siku.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat mengingat nama sudut siku-siku.',
        score: 2,
      };
    } else {
      return {
        id: `q-${num}`,
        number: num,
        type: 'Isian Singkat',
        pattern: 'Kesetaraan Satuan Baku',
        stimulus: 'Satuan panjang baku dalam meter dan sentimeter.',
        question: 'Panjang 1 meter setara dengan ............................ sentimeter (cm).',
        correctAnswer: '100 cm',
        discussion: '1 meter = 100 sentimeter.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat mengingat konversi satuan panjang meter ke sentimeter.',
        score: 2,
      };
    }
  }

  if (subjLower.includes('pancasila') || subjLower.includes('pkn')) {
    if (variant === 0) {
      return {
        id: `q-${num}`,
        number: num,
        type: 'Isian Singkat',
        pattern: 'Mengingat Dasar Negara',
        stimulus: 'Landasan falsafah bangsa Indonesia.',
        question: 'Dasar negara Republik Indonesia yang memiliki lima sila adalah ....................................................',
        correctAnswer: 'Pancasila',
        discussion: 'Pancasila adalah dasar dan ideologi negara Indonesia.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat menyebutkan dasar negara Republik Indonesia.',
        score: 2,
      };
    } else if (variant === 1) {
      return {
        id: `q-${num}`,
        number: num,
        type: 'Isian Singkat',
        pattern: 'Mengingat Simbol Sila',
        stimulus: 'Lambang sila pertama pada perisai burung Garuda.',
        question: 'Lambang sila pertama Pancasila, "Ketuhanan Yang Maha Esa" adalah ....................................................',
        correctAnswer: 'Bintang (atau Bintang Emas)',
        discussion: 'Sila pertama dilambangkan dengan Bintang emas bersudut lima.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat mengingat simbol sila pertama Pancasila.',
        score: 2,
      };
    } else if (variant === 2) {
      return {
        id: `q-${num}`,
        number: num,
        type: 'Isian Singkat',
        pattern: 'Mengingat Semboyan Negara',
        stimulus: 'Semboyan persatuan pada pita burung Garuda.',
        question: 'Semboyan persatuan bangsa Indonesia yang tertulis pada pita burung Garuda adalah ....................................................',
        correctAnswer: 'Bhinneka Tunggal Ika',
        discussion: 'Bhinneka Tunggal Ika berarti berbeda-beda tetapi tetap satu jua.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat mengingat semboyan persatuan bangsa Indonesia.',
        score: 2,
      };
    } else {
      return {
        id: `q-${num}`,
        number: num,
        type: 'Isian Singkat',
        pattern: 'Mengingat Lagu Kebangsaan',
        stimulus: 'Lagu kebangsaan resmi Indonesia.',
        question: 'Lagu kebangsaan Republik Indonesia berjudul ....................................................',
        correctAnswer: 'Indonesia Raya',
        discussion: 'Lagu kebangsaan Indonesia berjudul Indonesia Raya ciptaan W.R. Soepratman.',
        cognitiveLevel: 'C1',
        indicator: 'Peserta didik dapat menuliskan judul lagu kebangsaan Indonesia.',
        score: 2,
      };
    }
  }

  // DEFAULT: IPAS / SAINS
  if (variant === 0) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Isian Singkat',
      pattern: 'Mengingat Istilah Sains Dasar',
      stimulus: 'Zat warna hijau alami pada daun.',
      question: 'Zat hijau pada daun tumbuhan yang berfungsi menyerap cahaya matahari disebut ....................................................',
      correctAnswer: 'Klorofil',
      discussion: 'Klorofil adalah zat hijau daun yang berperan vital menyerap energi matahari.',
      cognitiveLevel: 'C1',
      indicator: 'Peserta didik dapat menyebutkan istilah zat hijau daun (klorofil).',
      score: 2,
    };
  } else if (variant === 1) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Isian Singkat',
      pattern: 'Mengingat Organ Tumbuhan',
      stimulus: 'Bagian tumbuhan di dalam tanah.',
      question: 'Bagian tumbuhan yang bertugas menyerap air dan zat hara dari dalam tanah adalah ....................................................',
      correctAnswer: 'Akar',
      discussion: 'Akar berfungsi utama menyerap air dan hara dari dalam tanah.',
      cognitiveLevel: 'C1',
      indicator: 'Peserta didik dapat menyebutkan nama organ tumbuhan penyerap air.',
      score: 2,
    };
  } else if (variant === 2) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Isian Singkat',
      pattern: 'Mengingat Sumber Energi',
      stimulus: 'Pusat tata surya penghasil cahaya bumi.',
      question: 'Sumber energi panas dan cahaya terbesar bagi bumi adalah ....................................................',
      correctAnswer: 'Matahari',
      discussion: 'Matahari adalah sumber energi panas dan cahaya terbesar bagi bumi.',
      cognitiveLevel: 'C1',
      indicator: 'Peserta didik dapat mengingat sumber energi panas dan cahaya utama bumi.',
      score: 2,
    };
  } else {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Isian Singkat',
      pattern: 'Mengingat Penggolongan Hewan',
      stimulus: 'Hewan pemakan rumput dan daun.',
      question: 'Hewan yang makanan utamanya berupa tumbuhan dinamakan kelompok ....................................................',
      correctAnswer: 'Herbivora',
      discussion: 'Herbivora adalah sebutan untuk hewan pemakan tumbuhan.',
      cognitiveLevel: 'C1',
      indicator: 'Peserta didik dapat mengingat istilah hewan pemakan tumbuhan.',
      score: 2,
    };
  }
}

function generateSampleC1Uraian(
  num: number,
  subject: string,
  grade: string,
  topic: string,
  tp: string
): QuestionItem {
  const subjLower = subject.toLowerCase();
  const variant = (num - 1) % 3;

  if (subjLower.includes('pancasila') || subjLower.includes('pkn')) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Uraian',
      pattern: 'Menyebutkan Lambang Sila Pancasila',
      stimulus: 'Perisai burung Garuda memuat lima simbol sila dasar negara Indonesia.',
      question: 'Sebutkan secara berurutan lambang dari sila pertama sampai sila kelima Pancasila!',
      correctAnswer: 'Kunci Jawaban / Rubrik Penskoran:\n1. Sila ke-1: Bintang\n2. Sila ke-2: Rantai Emas\n3. Sila ke-3: Pohon Beringin\n4. Sila ke-4: Kepala Banteng\n5. Sila ke-5: Padi dan Kapas\n(Masing-masing berbobot skor 1; Total Skor 5)',
      discussion: 'Menguji daya ingat peserta didik terhadap kelima lambang sila Pancasila.',
      cognitiveLevel: 'C1',
      indicator: 'Peserta didik dapat menyebutkan lima lambang sila Pancasila secara berurutan.',
      score: 5,
    };
  }

  if (subjLower.includes('matematika')) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Uraian',
      pattern: 'Menyebutkan Nama Bangun Datar',
      stimulus: 'Bangun datar memiliki beragam bentuk dalam geometri dasar.',
      question: 'Sebutkan 4 (empat) contoh nama bangun datar yang kamu ketahui!',
      correctAnswer: 'Kunci Jawaban / Rubrik Penskoran:\nSiswa menyebutkan 4 nama bangun datar dengan benar, misalnya: Persegi, Persegi Panjang, Segitiga, Lingkaran, Jajar Genjang, atau Trapesium (Skor masing-masing 1,25; Total Skor 5).',
      discussion: 'Menguji ingatan dasar nama-nama bangun datar sederhana.',
      cognitiveLevel: 'C1',
      indicator: 'Peserta didik dapat menyebutkan 4 contoh nama bangun datar.',
      score: 5,
    };
  }

  // DEFAULT: IPAS / SAINS
  if (variant === 0) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Uraian',
      pattern: 'Menyebutkan Bagian Tubuh Tumbuhan',
      stimulus: 'Tumbuhan tersusun atas beberapa organ tubuh yang dapat diamati secara langsung.',
      question: 'Sebutkan 4 (empat) bagian utama pada tubuh tumbuhan!',
      correctAnswer: 'Kunci Jawaban / Rubrik Penskoran:\nSiswa menyebutkan 4 bagian tumbuhan berikut:\n1. Akar\n2. Batang\n3. Daun\n4. Bunga / Buah / Biji\n(Masing-masing bernilai skor 1,25; Total Skor 5)',
      discussion: 'Menguji recall ingatan organ dasar tumbuhan.',
      cognitiveLevel: 'C1',
      indicator: 'Peserta didik dapat menyebutkan 4 bagian tubuh utama tumbuhan.',
      score: 5,
    };
  } else if (variant === 1) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Uraian',
      pattern: 'Menyebutkan Wujud Benda',
      stimulus: 'Benda di alam semesta dikelompokkan ke dalam tiga jenis wujud.',
      question: 'Sebutkan 3 (tiga) macam wujud benda dan berikan masing-masing 1 (satu) contoh bendanya yang ada di kelas!',
      correctAnswer: 'Kunci Jawaban / Rubrik Penskoran:\n1. Benda Padat (contoh: meja, kursi, buku) (Skor 2)\n2. Benda Cair (contoh: air minum, tinta spidol) (Skor 2)\n3. Benda Gas (contoh: udara di dalam ruangan) (Skor 1)',
      discussion: 'Menguji ingatan terhadap tiga wujud benda dan contohnya.',
      cognitiveLevel: 'C1',
      indicator: 'Peserta didik dapat menyebutkan tiga wujud zat dan contohnya.',
      score: 5,
    };
  } else {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Uraian',
      pattern: 'Menyebutkan Panca Indra Manusia',
      stimulus: 'Manusia memiliki lima alat indra untuk mengenali lingkungan sekitar.',
      question: 'Sebutkan 5 (lima) alat panca indra pada tubuh manusia!',
      correctAnswer: 'Kunci Jawaban / Rubrik Penskoran:\n1. Mata (penglihatan)\n2. Telinga (pendengaran)\n3. Hidung (penciuman/pembau)\n4. Lidah (pengecap)\n5. Kulit (peraba)\n(Masing-masing bernilai skor 1; Total Skor 5)',
      discussion: 'Menguji ingatan mengenai kelima organ panca indra manusia.',
      cognitiveLevel: 'C1',
      indicator: 'Peserta didik dapat menyebutkan kelima panca indra manusia.',
      score: 5,
    };
  }
}

function generateSampleIsian(
  num: number,
  subject: string,
  grade: string,
  topic: string,
  tp: string,
  cognLevel: QuestionItem['cognitiveLevel']
): QuestionItem {
  if (cognLevel === 'C1') {
    return generateSampleC1Isian(num, subject, grade, topic, tp);
  }
  const variant = (num - 1) % 5;
  if (variant === 0) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Isian Singkat',
      pattern: 'Kelengkapan Istilah Ilmiah',
      stimulus: `Pada proses daur air (siklus hidrologi), air laut dan sungai mengalami penguapan menjadi uap air akibat panas matahari.`,
      question: `Peristiwa penguapan air permukaan bumi ke atmosfer tersebut secara ilmiah disebut dengan istilah ....................................................`,
      correctAnswer: `Evaporasi (atau Penguapan)`,
      discussion: `Evaporasi adalah proses perubahan air dari wujud cair menjadi gas (uap air) akibat pemanasan energi surya.`,
      cognitiveLevel: 'C2',
      indicator: `Disajikan deskripsi daur hidrologi, peserta didik dapat menyebutkan istilah ilmiah penguapan dengan tepat.`,
      score: 2,
    };
  } else if (variant === 1) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Isian Singkat',
      pattern: 'Kelengkapan Hubungan Konsep',
      stimulus: `Tumbuhan hijau membutuhkan gas dari udara untuk melakukan proses fotosintesis dan menghasilkan gas yang dihirup manusia untuk bernapas.`,
      question: `Gas yang diserap tumbuhan untuk fotosintesis adalah gas ............................, sedangkan gas yang dilepaskan ke udara adalah gas ............................`,
      correctAnswer: `Karbon Dioksida (CO₂) dan Oksigen (O₂)`,
      discussion: `Bahan anorganik fotosintesis adalah CO₂ dan H₂O. Produk yang dihasilkan adalah glukosa (karbohidrat) dan gas O₂ (oksigen).`,
      cognitiveLevel: 'C3',
      indicator: `Disajikan konsep fotosintesis, peserta didik dapat melengkapi pertukaran gas pada tumbuhan.`,
      score: 2,
    };
  } else if (variant === 2) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Isian Singkat',
      pattern: 'Aplikasi Nilai & Norma',
      stimulus: `Musyawarah merupakan ciri khas bangsa Indonesia dalam mengambil keputusan bersama untuk mencapai suatu kesepakatan bulat.`,
      question: `Keputusan bersama yang dicapai melalui musyawarah secara bulat dan disetujui bersama disebut dengan istilah ....................................................`,
      correctAnswer: `Mufakat (atau Kesepakatan Mufakat)`,
      discussion: `Musyawarah untuk mufakat merupakan amanat Sila ke-4 Pancasila dalam menyelesaikan masalah bersama secara kekeluargaan.`,
      cognitiveLevel: 'C2',
      indicator: `Disajikan deskripsi proses pengambilan keputusan, peserta didik dapat melengkapi istilah mufakat.`,
      score: 2,
    };
  } else if (variant === 3) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Isian Singkat',
      pattern: 'Perhitungan Konseptual Singkat',
      stimulus: `Pak Made memiliki sebidang tanah berbentuk persegi dengan panjang sisi 15 meter di depan rumahnya.`,
      question: `Keliling tanah milik Pak Made tersebut adalah ............................ meter.`,
      correctAnswer: `60 meter`,
      discussion: `Keliling persegi = 4 × sisi = 4 × 15 m = 60 meter.`,
      cognitiveLevel: 'C3',
      indicator: `Disajikan ukuran sisi persegi, peserta didik dapat menghitung kelilingnya dengan teliti.`,
      score: 2,
    };
  } else {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Isian Singkat',
      pattern: 'Fungsi Organ & Komponen',
      stimulus: `Akar tumbuhan memiliki bagian-bagian yang menjalankan fungsi khusus dalam menopang kehidupan tanaman di dalam tanah.`,
      question: `Bagian akar yang bertugas menyerap air dan zat hara mineral dari dalam tanah secara optimal adalah ....................................................`,
      correctAnswer: `Rambut Akar (atau Bulu-bulu Akar)`,
      discussion: `Rambut akar memperluas bidang penyerapan air dan zat hara tanah secara kapiler masuk ke jaringan xilem akar.`,
      cognitiveLevel: 'C2',
      indicator: `Disajikan bagian tubuh tumbuhan, peserta didik dapat melengkapi organ penyerapan hara tanah.`,
      score: 2,
    };
  }
}

function generateSampleUraian(
  num: number,
  subject: string,
  grade: string,
  topic: string,
  tp: string,
  cognLevel: QuestionItem['cognitiveLevel']
): QuestionItem {
  if (cognLevel === 'C1') {
    return generateSampleC1Uraian(num, subject, grade, topic, tp);
  }
  const variant = (num - 1) % 4;
  if (variant === 0) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Uraian',
      pattern: 'Studi Eksperimen & Pembuktian Ilmiah',
      stimulus: `Siti melakukan percobaan menanam dua pot bibit cabai sejenis di halaman rumahnya. Pot A ditaruh di tempat terbuka yang mendapat sinar matahari penuh, sedangkan Pot B diletakkan di dalam kardus tertutup yang gelap. Kedua pot disiram air dalam takaran yang sama setiap pagi.`,
      question: `Berdasarkan percobaan sains yang dilakukan Siti di atas:\na. Prediksikan kondisi fisik daun dan batang kedua tanaman tersebut setelah 2 minggu!\nb. Jelaskan alasan ilmiah mengapa perbedaan tersebut dapat terjadi mengaitkannya dengan fungsi sinar matahari!`,
      correctAnswer: `Rubrik Penskoran Jawaban:\na. Prediksi: Tanaman Pot A daunnya tumbuh hijau segar, lebat, dan batangnya kuat/tegak. Tanaman Pot B daunnya pucat kekuningan, layu, dan batangnya memanjang lemah (etiolasi) (Skor 2).\nb. Penjelasan: Sinar matahari adalah energi utama dalam proses fotosintesis. Klorofil di Pot A menyerap cahaya matahari untuk memproduksi makanan, sehingga tumbuhan tumbuh sehat. Pot B tidak berfotosintesis sehingga kehabisan cadangan makanan (Skor 3).`,
      discussion: `Pertanyaan analisis tingkat tinggi (HOTS C4-C5) menguji keterampilan inkuiri sains: membaca variabel perlakuan (cahaya) dan memprediksi dampak metabolisme tumbuhan.`,
      cognitiveLevel: 'C4',
      indicator: `Disajikan skenario eksperimen tanaman, peserta didik dapat memprediksi hasil dan menjelaskan alasan ilmiahnya.`,
      score: 5,
    };
  } else if (variant === 1) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Uraian',
      pattern: 'Solusi Masalah Lingkungan & Karakter',
      stimulus: `Di lingkungan sekitar sekolah terdapat tumpukan sampah botol plastik dan kantong plastik bekas jajan siswa yang berserakan di saluran air hingga menyebabkan bau tidak sedap.`,
      question: `Sebagai siswa yang berjiwa profil pelajar Pancasila dan peduli lingkungan:\na. Tuliskan 2 (dua) bahaya yang dapat ditimbulkan jika sampah plastik tersebut terus dibiarkan menumpuk!\nb. Berikan 3 (tiga) tindakan nyata/solusi kreatif yang dapat dilakukan siswa untuk mengatasi masalah sampah plastik tersebut!`,
      correctAnswer: `Rubrik Penskoran:\na. Bahaya: Menimbulkan banjir saat musim hujan karena saluran mampet; menjadi sarang nyamuk/penyakit; mencemari air dan tanah (Skor 2).\nb. Solusi: Mengadakan kerja bakti pembersihan berkala; mendaur ulang botol plastik menjadi pot tanaman/kerajinan; membiasakan membawa tempat makan dan tumbler sendiri dari rumah (Skor 3).`,
      discussion: `Menguji nalar analitis mengenai isu ekologis dan solusi aplikatif berlandaskan kemandirian dan gotong royong.`,
      cognitiveLevel: 'C5',
      indicator: `Disajikan permasalahan sampah lingkungan, peserta didik dapat merumuskan dampak dan solusi penanganannya.`,
      score: 5,
    };
  } else if (variant === 2) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Uraian',
      pattern: 'Analisis Fenomena Termal & Perubahan Zat',
      stimulus: `Saat memasak sup ayam panas di dapur, Ibu menutup panci dengan tutup kaca. Beberapa menit kemudian, di permukaan dalam tutup kaca terlihat butiran-butiran tetesan air.`,
      question: `Berdasarkan peristiwa di atas:\na. Mengapa butiran-butiran air dapat terbentuk pada bagian dalam tutup panci yang awalnya kering?\nb. Sebutkan nama perubahan wujud zat yang terjadi serta perubahan energi kalor yang menyertainya!`,
      correctAnswer: `Rubrik Penskoran:\na. Alasan: Air sup yang mendidih berubah menjadi uap air panas yang naik ke atas. Ketika uap air menyentuh permukaan tutup panci yang lebih dingin, uap air melepaskan kalor dan mengembun menjadi butiran air (Skor 3).\nb. Nama proses: Mengembun (kondensasi). Perubahan energi kalor: Melepaskan kalor ke lingkungan sekitar (Skor 2).`,
      discussion: `Menguji pemahaman konsep perubahan wujud gas ke cair dan arah perpindahan kalor pada siklus termal sederhana.`,
      cognitiveLevel: 'C4',
      indicator: `Disajikan fenomena memasak di dapur, peserta didik dapat menjelaskan peristiwa pengembunan dan perpindahan kalor.`,
      score: 5,
    };
  } else {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Uraian',
      pattern: 'Studi Kasus Hak & Kewajiban Berkehidupan',
      stimulus: `Dalam kegiatan belajar di kelas, setiap siswa berhak mendapatkan bimbingan guru dan menggunakan fasilitas buku pelajaran yang disediakan oleh sekolah.`,
      question: `Jelaskan:\na. Mengapa pelaksanaan hak harus selalu diimbangi dengan pemenuhan kewajiban secara bertanggung jawab?\nb. Tuliskan 3 (tiga) contoh kewajiban siswa saat menggunakan buku perpustakaan sekolah!`,
      correctAnswer: `Rubrik Penskoran:\na. Alasan: Karena hak seseorang dibatasi oleh hak orang lain. Jika kewajiban tidak ditunaikan, ketertiban akan rusak dan hak orang lain untuk menikmati fasilitas juga akan terganggu (Skor 2).\nb. Contoh kewajiban: Menjaga kebersihan buku (tidak dicoret-coret); tidak merobek halaman buku; mengembalikan buku tepat waktu sesuai batas peminjaman (Skor 3).`,
      discussion: `Menguji pemahaman etika kewarganegaraan mengenai keharmonisan hak dan kewajiban dalam kehidupan sosial.`,
      cognitiveLevel: 'C4',
      indicator: `Disajikan konsep hak dan kewajiban, peserta didik dapat menganalisis pentingnya keseimbangan keduanya dalam kehidupan sekolah.`,
      score: 5,
    };
  }
}

function generateSampleMenjodohkan(
  num: number,
  subject: string,
  grade: string,
  topic: string,
  tp: string,
  cognLevel: QuestionItem['cognitiveLevel']
): QuestionItem {
  const variant = (num - 1) % 3;
  if (variant === 0) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Menjodohkan',
      pattern: 'Pasangan Konsep & Fungsi Organel',
      stimulus: `Pasangkanlah istilah bagian tubuh tumbuhan pada Kolom A dengan fungsi utamanya pada Kolom B secara tepat!`,
      question: `Tuliskan huruf pasangan yang sesuai di dalam tanda kurung!`,
      options: [
        `1. Klorofil   ( ... )  -->  a. Pembuluh pengangkut air dan mineral dari akar ke daun`,
        `2. Stomata    ( ... )  -->  b. Pigmen zat hijau daun penyerap energi cahaya matahari`,
        `3. Xilem      ( ... )  -->  c. Pori-pori daun tempat pertukaran gas pernapasan`,
        `4. Floem      ( ... )  -->  d. Pembuluh pengedar hasil makanan fotosintesis ke seluruh tubuh`,
      ],
      correctAnswer: `1 - b, 2 - c, 3 - a, 4 - d`,
      discussion: `Klorofil menyerap cahaya (b), Stomata pertukaran gas (c), Xilem angkut air dari tanah (a), Floem edarkan hasil fotosintesis (d).`,
      cognitiveLevel: 'C3',
      indicator: `Disajikan konsep organel tumbuhan, peserta didik dapat menjodohkan istilah dengan fungsi biologisnya.`,
      score: 4,
    };
  } else if (variant === 1) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Menjodohkan',
      pattern: 'Pasangan Simbol & Makna Sila',
      stimulus: `Pasangkanlah lambang sila Pancasila pada Kolom A dengan nilai/makna sila yang tepat pada Kolom B!`,
      question: `Tuliskan huruf pasangan yang sesuai di dalam tanda kurung!`,
      options: [
        `1. Bintang Emas        ( ... )  -->  a. Kemanusiaan yang adil dan beradab`,
        `2. Rantai Emas         ( ... )  -->  b. Kerakyatan yang dipimpin oleh hikmat kebijaksanaan`,
        `3. Kepala Banteng      ( ... )  -->  c. Ketuhanan Yang Maha Esa`,
        `4. Padi dan Kapas      ( ... )  -->  d. Keadilan sosial bagi seluruh rakyat Indonesia`,
      ],
      correctAnswer: `1 - c, 2 - a, 3 - b, 4 - d`,
      discussion: `Bintang Emas (Sila 1 - c), Rantai Emas (Sila 2 - a), Kepala Banteng (Sila 4 - b), Padi dan Kapas (Sila 5 - d).`,
      cognitiveLevel: 'C2',
      indicator: `Disajikan lambang Garuda Pancasila, peserta didik dapat menjodohkan simbol dengan bunyi nilai silanya.`,
      score: 4,
    };
  } else {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Menjodohkan',
      pattern: 'Pasangan Perubahan Wujud Zat',
      stimulus: `Pasangkanlah nama proses perubahan wujud zat pada Kolom A dengan contoh peristiwanya pada Kolom B!`,
      question: `Tuliskan huruf pasangan yang sesuai di dalam tanda kurung!`,
      options: [
        `1. Mencair      ( ... )  -->  a. Terbentuknya titik-titik air pada dinding luar gelas berisi es`,
        `2. Membeku      ( ... )  -->  b. Es krim yang dibiarkan di udara terbuka berubah menjadi cair`,
        `3. Menguap      ( ... )  -->  c. Air yang ditaruh di freezer kulkas berubah menjadi bongkahan es`,
        `4. Mengembun    ( ... )  -->  d. Air rebusan di panci yang terus memanas berkurang volumenya`,
      ],
      correctAnswer: `1 - b, 2 - c, 3 - d, 4 - a`,
      discussion: `Mencair (b), Membeku (c), Menguap (d), Mengembun (a).`,
      cognitiveLevel: 'C3',
      indicator: `Disajikan nama proses perubahan wujud zat, peserta didik dapat menjodohkannya dengan contoh kontekstual sehari-hari.`,
      score: 4,
    };
  }
}

function generateSampleBenarSalah(
  num: number,
  subject: string,
  grade: string,
  topic: string,
  tp: string,
  cognLevel: QuestionItem['cognitiveLevel']
): QuestionItem {
  const variant = (num - 1) % 4;
  if (variant === 0) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Benar/Salah',
      pattern: 'Evaluasi Konsep Sains',
      stimulus: `Tentukan apakah pernyataan ilmiah berikut BENAR (B) atau SALAH (S) dengan melingkari huruf B atau S!`,
      question: `"Oksigen adalah gas utama yang diserap oleh tumbuhan hijau untuk bahan baku proses fotosintesis."  ( B  /  S )`,
      correctAnswer: `SALAH (S)`,
      discussion: `Salah. Bahan baku yang diserap tumbuhan untuk fotosintesis adalah gas Karbon Dioksida (CO₂) dan air (H₂O). Gas Oksigen (O₂) adalah zat hasil (produk) fotosintesis yang dikeluarkan ke udara.`,
      cognitiveLevel: 'C3',
      indicator: `Disajikan pernyataan ilmiah tentang fotosintesis, peserta didik dapat mengevaluasi kebenaran konsep.`,
      score: 1,
    };
  } else if (variant === 1) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Benar/Salah',
      pattern: 'Evaluasi Konsep Perpindahan Panas',
      stimulus: `Tentukan apakah pernyataan berikut BENAR (B) atau SALAH (S) dengan melingkari huruf B atau S!`,
      question: `"Panas api unggun yang terasa hangat di badan kita tanpa melalui zat perantara adalah contoh peristiwa perpindahan kalor secara radiasi."  ( B  /  S )`,
      correctAnswer: `BENAR (B)`,
      discussion: `Benar. Radiasi adalah perpindahan panas secara pancaran gelombang elektromagnetik tanpa memerlukan zat perantara (medium).`,
      cognitiveLevel: 'C3',
      indicator: `Disajikan fenomena radiasi panas, peserta didik dapat memvalidasi kebenaran konsep perpindahan kalor.`,
      score: 1,
    };
  } else if (variant === 2) {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Benar/Salah',
      pattern: 'Evaluasi Hak dan Kewajiban',
      stimulus: `Tentukan apakah pernyataan berikut BENAR (B) atau SALAH (S) dengan melingkari huruf B atau S!`,
      question: `"Siswa berhak menuntut nilai ujian yang baik kepada guru tanpa perlu melaksanakan kewajiban belajar dan mengerjakan tugas."  ( B  /  S )`,
      correctAnswer: `SALAH (S)`,
      discussion: `Salah. Hak untuk memperoleh hasil belajar yang baik harus didahului oleh pemenuhan kewajiban berupa belajar sungguh-sungguh dan disiplin mengerjakan tugas.`,
      cognitiveLevel: 'C3',
      indicator: `Disajikan pernyataan hak dan kewajiban, peserta didik dapat menilai kelayakan perilaku sosial.`,
      score: 1,
    };
  } else {
    return {
      id: `q-${num}`,
      number: num,
      type: 'Benar/Salah',
      pattern: 'Evaluasi Sifat Bangun Datar',
      stimulus: `Tentukan apakah pernyataan matematika berikut BENAR (B) atau SALAH (S) dengan melingkari huruf B atau S!`,
      question: `"Bangun segitiga sama sisi memiliki 3 sisi sama panjang dan ketiga sudutnya sama besar yaitu masing-masing 60°."  ( B  /  S )`,
      correctAnswer: `BENAR (B)`,
      discussion: `Benar. Segitiga sama sisi memiliki 3 sisi identik dan jumlah ketiga sudutnya adalah 180° sehingga tiap sudut bernilai 180° : 3 = 60°.`,
      cognitiveLevel: 'C3',
      indicator: `Disajikan sifat geometri segitiga, peserta didik dapat menguji kebenaran karakteristik bangun datar.`,
      score: 1,
    };
  }
}

// Generate Official Exam Paper HTML for printing / Word download
export function generateExamPaperHtml(
  exam: GeneratedExam,
  options: { showAnswers?: boolean; title?: string; showSignature?: boolean } = {}
): string {
  const { showAnswers = false, title, showSignature = false } = options;
  const kopHtml = generateKopSuratHtml(exam.kopConfig, exam.kopConfig.schoolName);
  const signatureHtml = showSignature
    ? generateSignatureBlockHtml(exam.kopConfig, exam.kopConfig.schoolName)
    : '';

  const examHeading = title || `ASESMEN SUMATIF / PENILAIAN LINGKUP MATERI`;

  return `
  <div class="exam-paper-container bg-white p-4 sm:p-8 font-serif text-black leading-relaxed" style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; color: #000; width: 100%; max-width: 800px; margin: 0 auto;">
    ${kopHtml}

    <!-- JUDUL DAN IDENTITAS UJIAN -->
    <div style="text-align: center; margin-bottom: 18px;">
      <h3 style="margin: 0; font-size: 13pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; text-decoration: underline;">
        ${examHeading}
      </h3>
      <div style="font-size: 10.5pt; font-weight: 600; margin-top: 3px;">
        TAHUN AJARAN ${exam.academicYear} • SEMESTER ${exam.semester === 1 ? '1 (GANJIL)' : '2 (GENAP)'}
      </div>
    </div>

    <!-- TABEL IDENTITAS SISWA & MATA PELAJARAN -->
    <table class="no-border" style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 10pt; border: 1px solid #000; padding: 6px;">
      <tbody>
        <tr>
          <td style="width: 18%; padding: 4px 6px; font-weight: bold; border: none;">Mata Pelajaran</td>
          <td style="width: 32%; padding: 4px 6px; border: none;">: <strong>${exam.subject}</strong></td>
          <td style="width: 18%; padding: 4px 6px; font-weight: bold; border: none;">Nama Siswa</td>
          <td style="width: 32%; padding: 4px 6px; border: none;">: ....................................................</td>
        </tr>
        <tr>
          <td style="padding: 4px 6px; font-weight: bold; border: none;">Kelas / Fase</td>
          <td style="padding: 4px 6px; border: none;">: Kelas ${exam.grade} (${exam.fase})</td>
          <td style="padding: 4px 6px; font-weight: bold; border: none;">Nomor Absen</td>
          <td style="padding: 4px 6px; border: none;">: ....................................................</td>
        </tr>
        <tr>
          <td style="padding: 4px 6px; font-weight: bold; border: none;">Alokasi Waktu</td>
          <td style="padding: 4px 6px; border: none;">: ${exam.durationMinutes || 60} Menit</td>
          <td style="padding: 4px 6px; font-weight: bold; border: none;">Hari / Tanggal</td>
          <td style="padding: 4px 6px; border: none;">: ....................................................</td>
        </tr>
        <tr>
          <td style="padding: 4px 6px; font-weight: bold; border: none;">Lingkup Materi</td>
          <td style="padding: 4px 6px; border: none;" colspan="3">: <em>${exam.topic || exam.tp}</em></td>
        </tr>
      </tbody>
    </table>

    <!-- PETUNJUK UMUM -->
    <div style="background-color: #f8fafc; border: 1px dashed #64748b; padding: 8px 12px; margin-bottom: 20px; font-size: 9.5pt;">
      <strong>Petunjuk Pengerjaan:</strong>
      <ol style="margin: 3px 0 0 18px; padding: 0;">
        <li>Berdoalah sebelum memulai mengerjakan soal.</li>
        <li>Tuliskan nama lengkap, nomor absen, dan kelas pada kolom lembar identitas yang telah disediakan.</li>
        <li>Bacalah setiap stimulus bacaan dan butir pertanyaan dengan saksama sebelum menjawab.</li>
        <li>Kerjakan soal yang kamu anggap paling mudah terlebih dahulu secara mandiri dan jujur.</li>
        <li>Periksa kembali seluruh jawabanmu dengan teliti sebelum diserahkan kepada Bapak/Ibu Guru.</li>
      </ol>
    </div>

    <!-- BUTIR-BUTIR SOAL RESMI -->
    <div class="questions-list space-y-5" style="margin-top: 10px;">
      ${exam.questions
        .map((q, idx) => {
          // Check if all options are short for 2-column rendering
          const isShortOptions = q.options && q.options.length > 0 && q.options.every(opt => (opt || '').length <= 32);
          const isCheckboxes = q.type === 'Pilihan Ganda Kompleks';

          return `
          <div class="question-block" style="margin-bottom: 20px; page-break-inside: avoid;">
            <table style="width: 100%; border-collapse: collapse; border: none;">
              <tbody>
                <tr>
                  <td style="width: 28px; vertical-align: top; font-weight: bold; border: none; padding: 0; font-size: 10.5pt;">
                    ${idx + 1}.
                  </td>
                  <td style="vertical-align: top; border: none; padding: 0;">
                    ${
                      q.stimulus
                        ? `<div style="font-style: normal; background-color: #f8fafc; padding: 8px 12px; border: 1px solid #e2e8f0; border-left: 3.5px solid #00529C; border-radius: 4px; margin-bottom: 8px; font-size: 10pt; line-height: 1.55; white-space: pre-line; color: #1e293b;">
                            ${q.stimulus}
                          </div>`
                        : ''
                    }
                    <div style="font-size: 10.5pt; font-weight: 600; line-height: 1.55; color: #0f172a; white-space: pre-line;">
                      ${q.question}
                    </div>

                    ${
                      isCheckboxes
                        ? `<div style="font-size: 8.5pt; color: #64748b; font-style: italic; margin-top: 3px; margin-bottom: 4px;">*(Pilihlah lebih dari satu jawaban yang benar dengan memberi tanda centang [✓])*</div>`
                        : ''
                    }

                    ${
                      q.options && q.options.length > 0 && q.type !== 'Menjodohkan'
                        ? `
                      <div class="options-grid" style="margin-top: 8px; margin-left: 2px; display: grid; grid-template-columns: ${isShortOptions ? 'repeat(2, 1fr)' : '1fr'}; gap: 4px 16px;">
                        ${q.options
                          .map((opt, oIdx) => {
                            const defaultLetter = String.fromCharCode(65 + oIdx);
                            let optLetter = `${defaultLetter}.`;
                            let optText = opt;
                            const match = opt.match(/^([A-Da-d][\.\)])\s*(.*)$/);
                            if (match) {
                              optLetter = match[1].toUpperCase();
                              optText = match[2];
                            }

                            if (isCheckboxes) {
                              return `
                                <div style="display: flex; align-items: flex-start; gap: 6px; font-size: 10pt; line-height: 1.45; padding: 2px 0;">
                                  <span style="display: inline-block; width: 14px; height: 14px; border: 1.5px solid #334155; border-radius: 2px; margin-top: 2px; flex-shrink: 0;"></span>
                                  <span><strong style="color: #0f172a;">${optLetter}</strong> <span style="color: #1e293b;">${optText}</span></span>
                                </div>
                              `;
                            }

                            return `
                              <div style="display: flex; align-items: flex-start; gap: 6px; font-size: 10pt; line-height: 1.45; padding: 2px 0;">
                                <span style="font-weight: bold; min-width: 20px; color: #0f172a; flex-shrink: 0;">${optLetter}</span>
                                <span style="color: #1e293b;">${optText}</span>
                              </div>
                            `;
                          })
                          .join('')}
                      </div>
                    `
                        : ''
                    }

                    ${
                      q.type === 'Menjodohkan' && q.options && q.options.length > 0
                        ? `
                      <div style="margin-top: 8px; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px;">
                        <div style="font-size: 9pt; font-weight: bold; color: #00529C; margin-bottom: 6px;">Pasangkan Kolom A dan Kolom B berikut secara tepat:</div>
                        ${q.options.map(opt => `<div style="padding: 3px 0; font-size: 9.5pt; border-bottom: 1px dashed #e2e8f0; font-family: monospace; white-space: pre-line;">${opt}</div>`).join('')}
                      </div>
                    `
                        : ''
                    }

                    ${
                      q.type === 'Benar/Salah'
                        ? `
                      <div style="margin-top: 8px; display: inline-flex; align-items: center; gap: 8px; font-size: 9.5pt; font-weight: bold; background-color: #f1f5f9; padding: 4px 10px; border-radius: 6px; border: 1px solid #cbd5e1;">
                        <span style="color: #334155;">Pilihan Jawaban:</span>
                        <span style="padding: 1px 6px; border: 1.5px solid #00529C; border-radius: 4px; color: #00529C;">[  BENAR  ]</span>
                        <span style="color: #94a3b8;">/</span>
                        <span style="padding: 1px 6px; border: 1.5px solid #dc2626; border-radius: 4px; color: #dc2626;">[  SALAH  ]</span>
                      </div>
                    `
                        : ''
                    }

                    ${
                      q.type === 'Isian Singkat'
                        ? `
                      <div style="margin-top: 10px; font-size: 10pt;">
                        <strong>Jawaban:</strong> ........................................................................................................................................................
                      </div>
                    `
                        : ''
                    }

                    ${
                      q.type === 'Uraian'
                        ? `
                      <div style="margin-top: 12px; font-size: 10pt;">
                        <strong>Ruang Jawaban:</strong>
                        <div style="border-bottom: 1px dotted #94a3b8; height: 26px; margin-top: 2px;"></div>
                        <div style="border-bottom: 1px dotted #94a3b8; height: 26px;"></div>
                        <div style="border-bottom: 1px dotted #94a3b8; height: 26px;"></div>
                      </div>
                    `
                        : ''
                    }

                    ${
                      showAnswers
                        ? `
                      <div style="margin-top: 10px; padding: 8px 12px; background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 6px; font-size: 9.5pt; line-height: 1.5; white-space: pre-line;">
                        <div style="font-weight: bold; color: #065f46; margin-bottom: 3px;">
                          ✓ Kunci Jawaban: <span style="font-weight: 600; color: #047857;">${q.correctAnswer}</span>
                        </div>
                        <div style="color: #065f46;">
                          <strong>Pembahasan:</strong> ${q.discussion}
                        </div>
                      </div>
                    `
                        : ''
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        `;
        })
        .join('')}
    </div>

    ${
      showSignature && signatureHtml
        ? `
    <!-- TANDA TANGAN PENGESAHAN GURU & KEPALA SEKOLAH -->
    <div style="margin-top: 30px;">
      ${signatureHtml}
    </div>
    `
        : ''
    }
  </div>
  `;
}

// Generate Kunci Jawaban & Rubrik Penilaian HTML
export function generateAnswerKeyHtml(exam: GeneratedExam): string {
  const kopHtml = generateKopSuratHtml(exam.kopConfig, exam.kopConfig.schoolName);
  const totalScore = exam.questions.reduce((sum, q) => sum + (q.score || 1), 0);

  return `
  <div class="answer-key-container bg-white p-4 sm:p-8 font-serif text-black leading-relaxed" style="font-family: 'Times New Roman', Times, serif; font-size: 10pt; color: #000; width: 100%; max-width: 800px; margin: 0 auto;">
    ${kopHtml}

    <div style="text-align: center; margin-bottom: 16px;">
      <h3 style="margin: 0; font-size: 12.5pt; font-weight: bold; text-transform: uppercase; text-decoration: underline;">
        KUNCI JAWABAN, PEDOMAN PENSKORAN & PEMBAHASAN
      </h3>
      <div style="font-size: 10.5pt; font-weight: 600; margin-top: 3px;">
        MATA PELAJARAN: ${exam.subject.toUpperCase()} • KELAS ${exam.grade} (${exam.fase})
      </div>
      <div style="font-size: 9.5pt; color: #334155; margin-top: 2px;">
        TP: ${exam.tp}
      </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 9.5pt; border: 1px solid #333;">
      <thead>
        <tr style="background-color: #f1f5f9; text-align: center;">
          <th style="border: 1px solid #333; padding: 6px 4px; width: 35px;">No</th>
          <th style="border: 1px solid #333; padding: 6px 6px; width: 100px;">Bentuk Soal</th>
          <th style="border: 1px solid #333; padding: 6px 8px; width: 180px;">Kunci Jawaban</th>
          <th style="border: 1px solid #333; padding: 6px 8px;">Pembahasan / Rubrik Penilaian</th>
          <th style="border: 1px solid #333; padding: 6px 4px; width: 45px;">Skor</th>
        </tr>
      </thead>
      <tbody>
        ${exam.questions
          .map(
            q => `
          <tr>
            <td style="border: 1px solid #333; padding: 6px 4px; text-align: center; font-weight: bold;">
              ${q.number}
            </td>
            <td style="border: 1px solid #333; padding: 6px 6px; font-size: 9pt;">
              ${q.type}<br/>
              <span style="color: #64748b; font-size: 8.5pt;">(${q.cognitiveLevel})</span>
            </td>
            <td style="border: 1px solid #333; padding: 6px 8px; font-weight: bold; color: #047857; white-space: pre-line;">
              ${q.correctAnswer}
            </td>
            <td style="border: 1px solid #333; padding: 6px 8px; line-height: 1.5; white-space: pre-line;">
              ${q.discussion}
            </td>
            <td style="border: 1px solid #333; padding: 6px 4px; text-align: center; font-weight: bold;">
              ${q.score || 1}
            </td>
          </tr>
        `
          )
          .join('')}
        <tr style="background-color: #f8fafc; font-weight: bold;">
          <td colspan="4" style="border: 1px solid #333; padding: 6px 8px; text-align: right;">
            TOTAL SKOR MAKSIMAL:
          </td>
          <td style="border: 1px solid #333; padding: 6px 4px; text-align: center; color: #00529C; font-size: 11pt;">
            ${totalScore}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- RUMUS PENGHITUNGAN NILAI -->
    <div style="margin-top: 16px; padding: 10px; border: 1px solid #cbd5e1; background-color: #f8fafc; font-size: 9.5pt;">
      <strong>Rumus Konversi Nilai Akhir (Skala 100):</strong>
      <div style="margin-top: 4px; font-family: monospace; font-size: 10pt; color: #003366;">
        Nilai Akhir = (Total Skor Perolehan Siswa / ${totalScore}) × 100
      </div>
      <div style="margin-top: 4px; color: #475569; font-size: 8.5pt;">
        Kriteria Ketercapaian Tujuan Pembelajaran (KKTP): Tuntas minimal skor ≥ 75.
      </div>
    </div>
  </div>
  `;
}

// Generate Matriks Kisi-Kisi Soal Resmi HTML
export function generateKisiKisiHtml(exam: GeneratedExam): string {
  const kopHtml = generateKopSuratHtml(exam.kopConfig, exam.kopConfig.schoolName);
  const signatureHtml = generateSignatureBlockHtml(exam.kopConfig, exam.kopConfig.schoolName);

  return `
  <div class="kisi-kisi-container bg-white p-4 sm:p-8 font-serif text-black leading-relaxed" style="font-family: 'Times New Roman', Times, serif; font-size: 9.5pt; color: #000; width: 100%; max-width: 850px; margin: 0 auto;">
    ${kopHtml}

    <div style="text-align: center; margin-bottom: 16px;">
      <h3 style="margin: 0; font-size: 12pt; font-weight: bold; text-transform: uppercase; text-decoration: underline;">
        KISI-KISI PENULISAN SOAL ASESMEN SUMATIF
      </h3>
      <div style="font-size: 10pt; font-weight: bold; margin-top: 2px;">
        MATA PELAJARAN: ${exam.subject.toUpperCase()} • KELAS ${exam.grade} • TAHUN AJARAN ${exam.academicYear}
      </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid #000; font-size: 8.5pt;">
      <thead>
        <tr style="background-color: #f1f5f9; text-align: center; font-weight: bold;">
          <th style="border: 1px solid #000; padding: 6px 3px; width: 28px;">No</th>
          <th style="border: 1px solid #000; padding: 6px 6px; width: 170px;">Capaian / Tujuan Pembelajaran (TP)</th>
          <th style="border: 1px solid #000; padding: 6px 6px; width: 120px;">Lingkup Materi</th>
          <th style="border: 1px solid #000; padding: 6px 6px;">Indikator Soal</th>
          <th style="border: 1px solid #000; padding: 6px 5px; width: 105px;">Pola / Ragam Soal</th>
          <th style="border: 1px solid #000; padding: 6px 4px; width: 60px;">Level</th>
          <th style="border: 1px solid #000; padding: 6px 4px; width: 70px;">Bentuk</th>
          <th style="border: 1px solid #000; padding: 6px 3px; width: 32px;">No.</th>
        </tr>
      </thead>
      <tbody>
        ${exam.questions
          .map(
            q => `
          <tr>
            <td style="border: 1px solid #000; padding: 5px 3px; text-align: center;">
              ${q.number}
            </td>
            <td style="border: 1px solid #000; padding: 5px 6px; line-height: 1.35;">
              ${q.tpRef || exam.tp}
            </td>
            <td style="border: 1px solid #000; padding: 5px 6px; line-height: 1.35;">
              ${q.topicRef || exam.topic || exam.subject}
            </td>
            <td style="border: 1px solid #000; padding: 5px 6px; line-height: 1.35;">
              ${q.indicator || `Disajikan pertanyaan tentang ${q.topicRef || exam.topic || exam.subject}, peserta didik dapat menjawab dengan benar.`}
            </td>
            <td style="border: 1px solid #000; padding: 5px 4px; text-align: center; font-size: 8pt; color: #1e293b; background-color: #fafafa;">
              ${q.pattern || 'Studi Kasus Kontekstual'}
            </td>
            <td style="border: 1px solid #000; padding: 5px 4px; text-align: center; font-weight: bold;">
              ${q.cognitiveLevel}
            </td>
            <td style="border: 1px solid #000; padding: 5px 4px; text-align: center;">
              ${q.type}
            </td>
            <td style="border: 1px solid #000; padding: 5px 3px; text-align: center; font-weight: bold;">
              ${q.number}
            </td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <div style="margin-top: 24px;">
      ${signatureHtml}
    </div>
  </div>
  `;
}

// Generate Lembar Jawaban Siswa (LJK Sederhana) HTML
export function generateStudentAnswerSheetHtml(exam: GeneratedExam): string {
  const kopHtml = generateKopSuratHtml(exam.kopConfig, exam.kopConfig.schoolName);

  return `
  <div class="answer-sheet-container bg-white p-4 sm:p-8 font-serif text-black leading-relaxed" style="font-family: 'Times New Roman', Times, serif; font-size: 10pt; color: #000; width: 100%; max-width: 800px; margin: 0 auto;">
    ${kopHtml}

    <div style="text-align: center; margin-bottom: 16px;">
      <h3 style="margin: 0; font-size: 13pt; font-weight: bold; text-transform: uppercase; text-decoration: underline;">
        LEMBAR JAWABAN ASESMEN SISWA (LJK)
      </h3>
      <div style="font-size: 10pt; font-weight: bold; margin-top: 2px;">
        MATA PELAJARAN: ${exam.subject.toUpperCase()} • KELAS ${exam.grade}
      </div>
    </div>

    <!-- KOLOM IDENTITAS SISWA -->
    <div style="border: 1px solid #000; padding: 8px 12px; margin-bottom: 18px;">
      <table style="width: 100%; border-collapse: collapse; border: none; font-size: 10pt;">
        <tbody>
          <tr>
            <td style="width: 15%; padding: 3px; border: none; font-weight: bold;">Nama Lengkap</td>
            <td style="width: 45%; padding: 3px; border: none;">: ....................................................</td>
            <td style="width: 15%; padding: 3px; border: none; font-weight: bold;">Nilai Perolehan</td>
            <td style="width: 25%; padding: 3px; border: none; text-align: center;" rowspan="2">
              <div style="border: 2px solid #000; width: 80px; height: 48px; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 18pt; font-weight: bold;">
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 3px; border: none; font-weight: bold;">Nomor Absen</td>
            <td style="padding: 3px; border: none;">: ....................................................</td>
            <td style="padding: 3px; border: none; font-weight: bold;">Paraf Guru</td>
          </tr>
          <tr>
            <td style="padding: 3px; border: none; font-weight: bold;">Hari / Tanggal</td>
            <td style="padding: 3px; border: none;">: ....................................................</td>
            <td style="padding: 3px; border: none; font-weight: bold;">Catatan Guru</td>
            <td style="padding: 3px; border: none;">: ...................................</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- LEMBAR PILIHAN GANDA -->
    <h4 style="font-size: 11pt; font-weight: bold; margin: 0 0 6px 0;">I. Jawaban Pilihan Ganda (Berilah tanda silang X pada huruf pilihan yang benar):</h4>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px;">
      ${Array.from({ length: Math.ceil(exam.questions.length / 2) })
        .map((_, rowIdx) => {
          const leftQ = exam.questions[rowIdx];
          const rightQ = exam.questions[rowIdx + Math.ceil(exam.questions.length / 2)];

          return `
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${
              leftQ
                ? `
              <div style="display: flex; align-items: center; gap: 10px; font-size: 10pt; border-bottom: 1px dotted #cbd5e1; padding-bottom: 2px;">
                <span style="width: 28px; font-weight: bold;">${leftQ.number}.</span>
                <span>[ A ]</span>
                <span>[ B ]</span>
                <span>[ C ]</span>
                <span>[ D ]</span>
              </div>
            `
                : ''
            }
            ${
              rightQ
                ? `
              <div style="display: flex; align-items: center; gap: 10px; font-size: 10pt; border-bottom: 1px dotted #cbd5e1; padding-bottom: 2px;">
                <span style="width: 28px; font-weight: bold;">${rightQ.number}.</span>
                <span>[ A ]</span>
                <span>[ B ]</span>
                <span>[ C ]</span>
                <span>[ D ]</span>
              </div>
            `
                : ''
            }
          </div>
        `;
        })
        .join('')}
    </div>

    <!-- LEMBAR ISIAN & URAIAN -->
    <h4 style="font-size: 11pt; font-weight: bold; margin: 16px 0 6px 0;">II. Jawaban Isian & Uraian:</h4>
    <div style="display: flex; flex-direction: column; gap: 14px;">
      <div style="font-size: 9.5pt;">
        <strong>Nomor ..... :</strong> .................................................................................................................................................................................
      </div>
      <div style="font-size: 9.5pt;">
        <strong>Nomor ..... :</strong> .................................................................................................................................................................................
      </div>
      <div style="font-size: 9.5pt;">
        <strong>Nomor ..... :</strong> .................................................................................................................................................................................
      </div>
    </div>
  </div>
  `;
}

// Download Word Document (.doc) for Exam
export function downloadExamWordDoc(
  exam: GeneratedExam,
  htmlContent: string,
  titleSuffix: string = 'Naskah_Soal'
) {
  const cleanSubject = exam.subject.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `SOAL_${cleanSubject}_Kelas${exam.grade}_${exam.questions.length}Butir_${titleSuffix}`;

  const styledHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${filename}</title>
        <style>
          body { font-family: 'Times New Roman', 'Arial', sans-serif; font-size: 11pt; line-height: 1.45; color: #111; margin: 2cm; }
          h2, h3, h4 { color: #000; text-align: center; }
          table { border-collapse: collapse; width: 100%; margin: 8px 0; }
          th, td { padding: 4px 6px; text-align: left; font-size: 10pt; }
          .no-border, .no-border td { border: none !important; }
          .kop-surat-official table, .kop-surat-official td { border: none !important; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + styledHtml], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
