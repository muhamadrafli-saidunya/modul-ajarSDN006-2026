import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      geminiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch {
      geminiClient = null;
    }
  }
  return geminiClient;
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Server-side AI Generation Endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const input = req.body;
    const {
      topic,
      mapel,
      curriculum = 'merdeka',
      documentType = 'modul_ajar',
      satuanPendidikan = 'sd',
      kelas = '4',
      fase = 'Fase B',
      tahunAjaran = '2025/2026',
      semester = 1,
      namaSekolah = 'SD Negeri 006',
      namaPenyusun = 'Guru Pengampu',
      jumlahPertemuan = 2,
      jpPerPertemuan = 2,
      durasiJP = 35,
      learningModel = 'deep-learning',
      dpl8Selected = [],
      kbcTemaSelected = [],
      sesSelected = [],
      generateSupplementary = {}
    } = input;

    const totalJP = jumlahPertemuan * jpPerPertemuan;
    const totalMenit = totalJP * durasiJP;
    const ai = getGemini();

    let aiGeneratedHtml = '';

    if (ai) {
      const isRPP = documentType === 'rpp';
      const isKBC = curriculum === 'kbc' || curriculum === 'hybrid';
      const docName = isRPP ? 'RPP' : 'Modul Ajar';

      const prompt = `Anda adalah konsultan kurikulum ahli Kemendikdasmen RI dan Kemenag RI.
Buatkan ${docName} lengkap dalam format HTML murni (gunakan tag-tag semantik div, h3, h4, table, p, ul, ol, strong, em dengan class Tailwind CSS yang elegan, rapi, dan berlatar putih bersih).

PARAMETER:
- Satuan Pendidikan: ${satuanPendidikan.toUpperCase()} (${namaSekolah})
- Jenjang & Kelas: Kelas ${kelas} (${fase})
- Mata Pelajaran: ${mapel}
- Topik Materi Pokok: ${topic}
- Alokasi Waktu: ${jumlahPertemuan} Pertemuan (${totalJP} JP, ${durasiJP} menit/JP, Total ${totalMenit} menit)
- Model Pembelajaran: ${learningModel}
- Pendekatan Kurikulum: ${curriculum.toUpperCase()}
${curriculum === 'merdeka' || curriculum === 'hybrid' ? `Dasar Regulasi: Permendikdasmen No. 1/2026 & Kerangka 8334 Deep Learning (Berkesadaran/Mindful, Bermakna/Meaningful, Menggembirakan/Joyful). Fokus 8 Dimensi Profil Kelulusan: ${dpl8Selected.join(', ') || 'Keimanan, Nalar Kritis, Kolaborasi'}.` : ''}
${isKBC ? `Dasar Regulasi: Kemenag RI Kepdirjen Pendis No. 6077/2025 Kurikulum Berbasis Cinta (KBC). Panca Cinta: ${kbcTemaSelected.join(', ') || 'Cinta Allah & Rasul, Cinta Ilmu, Cinta Sesama'}. SES Prioritas: ${sesSelected.join(', ') || 'Empati, Tanggung Jawab'}. Metode: FIDS (Feel, Imagine, Do, Share). Sertakan dalil Al-Qur'an dan Hadits relevan, Hikmah & Ibrah, serta Jurnal Muhasabah.` : ''}

STRUKTUR WAJIB DOKUMEN:
1. HEADER & IDENTITAS MODUL
2. ${isKBC ? "DALIL AL-QUR'AN & HADITS TERKAIT" : "CAPAIAN PEMBELAJARAN & ELEMEN CP"}
3. ALUR TUJUAN PEMBELAJARAN (ATP) & TUJUAN PEMBELAJARAN (TP)
4. PEMAHAMAN BERMAKNA (HIKMAH/IBRAH) & PERTANYAAN PEMANTIK (TADABBUR)
5. PROFIL KELULUSAN (8 DIMENSI KERANGKA 8334 / PANCA CINTA & SES)
6. 4 KERANGKA UTAMA PEMBELAJARAN (Praktik Pedagogis, Lingkungan Belajar, Pemanfaatan Digital, Kemitraan)
7. SKENARIO KEGIATAN PEMBELAJARAN PER PERTEMUAN (Rinci pembagian menit: Pendahuluan, Kegiatan Inti merinci aktivitas guru & aktivitas siswa, Penutup Refleksi)
8. ASESMEN HOLISTIK (Diagnostik, Formatif Rubrik Sikap/Kinerja, Sumatif Kisi-kisi Soal HOTS)
9. PENGAYAAN DAN REMEDIAL
10. REFLEKSI GURU & LEMBAR KERJA
11. KOLOM TANDA TANGAN RESMI (Kepala Sekolah & Guru Penyusun)

Keluarkan HANYA kode HTML bersih (tanpa bungkus markdown \`\`\`html).`;

      const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt
          });
          if (response?.text) {
            aiGeneratedHtml = response.text.replace(/```html/gi, '').replace(/```/g, '').trim();
            break;
          }
        } catch {
          // If a model is temporarily unavailable (e.g. 503 high demand), proceed seamlessly to next candidate
          await new Promise((r) => setTimeout(r, 400));
        }
      }
    }

    res.json({
      success: true,
      hasAiContent: !!aiGeneratedHtml,
      aiHtml: aiGeneratedHtml || null
    });
  } catch (error: any) {
    res.json({
      success: true,
      hasAiContent: false,
      aiHtml: null,
      message: 'Local curriculum generator active'
    });
  }
});

// Helper to classify or infer question pattern
function inferQuestionPattern(qText: string, stimText: string = '', index: number): string {
  const combined = (qText + ' ' + stimText).toLowerCase();
  if (combined.includes('tabel') || combined.includes('data') || combined.includes('hasil pengamatan') || combined.includes('diagram') || combined.includes('catatan percobaan')) {
    return 'Analisis Data & Tabel Pengamatan';
  }
  if (combined.includes('jika') || combined.includes('mengapa') || combined.includes('akibat') || combined.includes('dampak') || combined.includes('penyebab') || combined.includes('terjadi jika')) {
    return 'Hubungan Sebab-Akibat & Prediksi';
  }
  if (combined.includes('perbedaan') || combined.includes('persamaan') || combined.includes('membedakan') || combined.includes('dibandingkan') || combined.includes('pasangan yang tepat')) {
    return 'Komparasi & Pengelompokan';
  }
  if (combined.includes('langkah') || combined.includes('solusi') || combined.includes('tindakan yang tepat') || combined.includes('seharusnya') || combined.includes('cara mengatasi')) {
    return 'Studi Kasus & Pemecahan Masalah';
  }
  if (combined.includes('pernyataan berikut') || combined.includes('(1)') || combined.includes('nomor berapakah') || combined.includes('pernyataan yang benar')) {
    return 'Analisis Pernyataan Kritis';
  }
  if (combined.includes('kata') && (combined.includes(':') || combined.includes('berkata') || combined.includes('berpendapat'))) {
    return 'Penalaran Dialog & Diskusi';
  }
  if (combined.includes('urutan') || combined.includes('tahapan') || combined.includes('proses pembuatan') || combined.includes('prosedur')) {
    return 'Urutan Logis & Prosedural';
  }
  if (combined.includes('sikap') || combined.includes('musyawarah') || combined.includes('kebiasaan') || combined.includes('moral') || combined.includes('menghargai')) {
    return 'Pengambilan Sikap & Refleksi Nilai';
  }
  const defaultPatterns = [
    'Studi Kasus Kontekstual',
    'Analisis Data & Pengamatan',
    'Hubungan Sebab-Akibat',
    'Aplikasi Konsep Sehari-hari',
    'Komparasi & Karakteristik',
    'Pemecahan Masalah Nyata',
    'Analisis Pernyataan Kritis',
    'Penalaran Dialog Siswa'
  ];
  return defaultPatterns[index % defaultPatterns.length];
}

// Server-side AI Question Generator Endpoint
app.post('/api/generate-questions', async (req, res) => {
  try {
    const {
      subject = 'IPAS',
      grade = '4',
      fase = 'Fase B',
      tp = '',
      topic = '',
      questionCount = 10,
      questionType = 'Pilihan Ganda',
      cognitiveLevel = 'HOTS (C4-C6)',
      questionStyle = 'Bervariasi Penuh',
      semester = 1,
      academicYear = '2024/2025'
    } = req.body;

    const count = Math.max(1, Math.min(40, Number(questionCount) || 10));
    const ai = getGemini();

    if (ai) {
      const systemInstruction = `Anda adalah Tim Pengembang Asesmen Standar Kemendikdasmen RI & Pusmendik yang ahli dalam instrumen evaluasi pembelajaran mendalam (Deep Learning) dan AKM/PISA tingkat Sekolah Dasar.
PRINSIP UTAMA PENYUSUNAN SOAL:
1. DILARANG KERAS MEMBUAT POLA PERTANYAAN YANG MONOTON ATAU SERAGAM!
   - Jangan membuat kalimat tanya yang selalu diawali kata sama (seperti "Berdasarkan teks di atas...", "Manakah...", atau berakhiran "...adalah").
   - Jangan membuat semua stimulus berupa narasi cerita panjang yang berulang.
2. ROTASIKAN GAYA & POLA PERTANYAAN SECARA KREATIF DI SETIAP BUTIR:
   - Pola Studi Kasus & Pemecahan Masalah (Problem Solving nyata anak/sekolah/rumah).
   - Pola Analisis Data / Tabel Mini Pengamatan / Catatan Percobaan Sains.
   - Pola Hubungan Sebab-Akibat & Prediksi Dampak (Cause & Effect / What-If).
   - Pola Komparasi / Perbandingan Karakteristik Dua Hal / Objek / Peristiwa.
   - Pola Analisis Pernyataan Kritis (Multi-Statement (1), (2), (3), (4)).
   - Pola Penalaran Percakapan / Dialog Diskusi Antarmurid.
   - Pola Aplikasi Konsep Kontekstual Sehari-hari (di dapur, kebun, pasar, jalan, alam sekitar).
   - Pola Urutan Prosedural & Tahapan Kerja Ilmiah.
   - Pola Refleksi Karakter & Pengambilan Keputusan Bijak.
3. KUNCI JAWABAN HARUS TERSEBAR MERATA & BERIMBANG:
   - Kunci jawaban Pilihan Ganda WAJIB tersebar acak merata antara opsi A, B, C, dan D (tidak boleh didominasi satu huruf tertentu).
   - Opsi pengecoh (distractor) harus logis, realistis, dan mendidik nalar anak.
   - Panjang kalimat tiap opsi A, B, C, D dibuat seimbang agar tidak mudah ditebak.
4. SESUAIKAN DENGAN TINGKAT PERKEMBANGAN KELAS ${grade} SD (${fase}):
   - Kalimat jelas, tidak ambigu, dan membangkitkan rasa ingin tahu anak.`;

      const prompt = `Susun PERSIS ${count} BUTIR SOAL evaluasi untuk:
- Mata Pelajaran: ${subject}
- Kelas: Kelas ${grade} (${fase})
- Semester: Semester ${semester} (Tahun Ajaran ${academicYear})
- Tujuan Pembelajaran (TP): ${tp || 'Mendalami materi esensial secara menyeluruh'}
- Topik / Materi Pokok: ${topic || tp || subject}
- Bentuk Soal: ${questionType} (Jika 'Campuran', buatlah proporsi PG 60%, Isian Singkat 25%, Uraian 15%)
- Target Level Kognitif: ${cognitiveLevel}
- Preferensi Gaya: ${questionStyle}

PANDUAN VARIASI BUTIR SOAL (Wajib berbeda sudut pandang antar nomor):
- Setiap butir soal menguji indikator/sub-konsep yang berbeda dari topik ${topic || subject}.
- Variasikan jenis stimulus: sebagian kasus cerita anak (tokoh berganti-ganti: Siti, Made, Edo, Dayu, Lani, Udin, Beni), sebagian tabel data sederhana / hasil observasi, sebagian dialog antarsiswa, sebagian deskripsi eksperimen, dan ada butir soal pemahaman langsung tanpa stimulus panjang.
- Variasikan kata tanya di setiap nomor: "Bagaimana cara...", "Mengapa hal tersebut...", "Jika kondisi diubah menjadi ..., apakah akibatnya...", "Solusi apa yang paling tepat...", "Manakah kelompok yang...", "Urutan yang benar adalah...", "Simpulan apa yang dapat diambil dari data...".

FORMAT RESPONSE WAJIB:
Hasilkan HANYA JSON Array murni yang valid diawali dengan [ dan diakhiri dengan ], TANPA backticks markdown dan TANPA kata pengantar.

Format setiap objek dalam JSON array:
[
  {
    "number": 1,
    "pattern": "Studi Kasus / Analisis Data & Tabel / Sebab-Akibat / Komparasi / Dialog Murid / Solusi Masalah / Pernyataan Kritis / Prosedural",
    "type": "${questionType === 'Campuran' ? 'Pilihan Ganda' : questionType}",
    "stimulus": "Teks pengantar atau kasus cerita atau data tabel sederhana (bervariasi antar nomor)...",
    "question": "Kalimat pertanyaan yang bervariasi pola tanyanya...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correctAnswer": "B. ... (sebar merata A, B, C, D)",
    "discussion": "Penjelasan detail konsep ilmiah dan alasan jawaban benar...",
    "cognitiveLevel": "C3 / C4 / C5",
    "indicator": "Disajikan ..., peserta didik dapat ...",
    "score": 1
  }
]`;

      const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction,
              temperature: 0.85,
            }
          });
          if (response?.text) {
            const rawText = response.text
              .replace(/```json/gi, '')
              .replace(/```/g, '')
              .trim();
            const parsed = JSON.parse(rawText);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const formattedQuestions = parsed.map((item: any, idx: number) => {
                const itemType = item.type || (questionType === 'Campuran'
                  ? (idx < Math.ceil(count * 0.6) ? 'Pilihan Ganda' : idx < Math.ceil(count * 0.85) ? 'Isian Singkat' : 'Uraian')
                  : questionType);

                return {
                  id: `ai-q-${idx + 1}-${Date.now()}`,
                  number: idx + 1,
                  type: itemType,
                  pattern: item.pattern || inferQuestionPattern(item.question || '', item.stimulus || '', idx),
                  stimulus: item.stimulus || '',
                  question: item.question || `Pertanyaan butir nomor ${idx + 1}`,
                  options: Array.isArray(item.options) ? item.options : [],
                  correctAnswer: item.correctAnswer || item.answer || 'Kunci jawaban terlampir',
                  discussion: item.discussion || item.explanation || 'Pembahasan materi terkait konsep esensial kurikulum.',
                  cognitiveLevel: item.cognitiveLevel || (idx % 3 === 0 ? 'C4' : idx % 3 === 1 ? 'C3' : 'C2'),
                  indicator: item.indicator || `Mengukur pemahaman konsep ${topic || subject}`,
                  score: item.score || (itemType === 'Uraian' ? 5 : itemType === 'Isian Singkat' ? 2 : 1)
                };
              });

              return res.json({
                success: true,
                hasAi: true,
                questions: formattedQuestions.slice(0, count)
              });
            }
          }
        } catch {
          await new Promise((r) => setTimeout(r, 400));
        }
      }
    }

    // If Gemini offline or not configured, return signal to use local generator
    res.json({
      success: true,
      hasAi: false,
      questions: null,
      message: 'Using offline curriculum generator engine'
    });
  } catch (error: any) {
    res.json({
      success: true,
      hasAi: false,
      questions: null,
      message: error?.message || 'Fallback to client'
    });
  }
});

// Setup Vite development server or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server ready on http://0.0.0.0:${PORT}`);
  });
}

startServer();
