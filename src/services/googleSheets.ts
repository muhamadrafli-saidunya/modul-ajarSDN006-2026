import { GeneratedExam, QuestionItem, TeachingModule } from '../types';

export interface DriveSpreadsheetFile {
  id: string;
  name: string;
  webViewLink: string;
  modifiedTime: string;
  createdTime?: string;
}

/**
 * Creates a complete Kurikulum Merdeka Exam Spreadsheet in Google Sheets
 * Contains 3 structured tabs:
 * 1. Butir Soal & Kunci Jawaban
 * 2. Kisi-Kisi Asesmen
 * 3. Format Rekap Nilai Siswa
 */
export async function createExamSpreadsheet(
  accessToken: string,
  exam: GeneratedExam
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const spreadsheetTitle = `[Asesmen SD] ${exam.subject} - Kelas ${exam.grade} (${exam.topic || 'Kurikulum Merdeka'})`;

  // 1. Create Spreadsheet with initial 3 sheets
  const createPayload = {
    properties: {
      title: spreadsheetTitle,
      locale: 'id_ID',
      timeZone: 'Asia/Jakarta',
    },
    sheets: [
      { properties: { title: '1. Butir Soal & Kunci', gridProperties: { frozenRowCount: 3 } } },
      { properties: { title: '2. Kisi-Kisi Asesmen', gridProperties: { frozenRowCount: 3 } } },
      { properties: { title: '3. Format Rekap Nilai Siswa', gridProperties: { frozenRowCount: 3 } } },
    ],
  };

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createPayload),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gagal membuat Google Spreadsheet: HTTP ${createRes.status}`);
  }

  const createdData = await createRes.json();
  const spreadsheetId: string = createdData.spreadsheetId;
  const spreadsheetUrl: string = createdData.spreadsheetUrl;

  // 2. Prepare Data for Sheet 1: Butir Soal & Kunci
  const sheet1Values: (string | number)[][] = [
    [
      `NASKAH DAN KUNCI ASESMEN: ${exam.subject.toUpperCase()}`,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
    [
      `Kelas: ${exam.grade} | Fase: ${exam.fase} | Semester: ${exam.semester} | TP: ${exam.tp}`,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
    [
      'No',
      'Bentuk Soal',
      'Level Kognitif',
      'Indikator Soal',
      'Pola / Karakter',
      'Stimulus Soal',
      'Butir Pertanyaan',
      'Pilihan A',
      'Pilihan B',
      'Pilihan C',
      'Pilihan D',
      'Kunci Jawaban',
      'Pembahasan & Rubrik',
      'Bobot Skor',
    ],
  ];

  exam.questions.forEach((q, idx) => {
    let optA = '';
    let optB = '';
    let optC = '';
    let optD = '';

    if (q.options && q.options.length > 0) {
      q.options.forEach((opt) => {
        const cleaned = opt.trim();
        if (/^A[\.\)]/i.test(cleaned)) optA = cleaned.replace(/^A[\.\)]\s*/i, '');
        else if (/^B[\.\)]/i.test(cleaned)) optB = cleaned.replace(/^B[\.\)]\s*/i, '');
        else if (/^C[\.\)]/i.test(cleaned)) optC = cleaned.replace(/^C[\.\)]\s*/i, '');
        else if (/^D[\.\)]/i.test(cleaned)) optD = cleaned.replace(/^D[\.\)]\s*/i, '');
        else if (!optA) optA = cleaned;
        else if (!optB) optB = cleaned;
        else if (!optC) optC = cleaned;
        else if (!optD) optD = cleaned;
      });
    }

    sheet1Values.push([
      idx + 1,
      q.type,
      `Level ${q.cognitiveLevel}`,
      q.indicator || '-',
      q.pattern || '-',
      q.stimulus || '-',
      q.question,
      optA,
      optB,
      optC,
      optD,
      q.correctAnswer,
      q.discussion || '-',
      q.score || 1,
    ]);
  });

  // 3. Prepare Data for Sheet 2: Kisi-Kisi Asesmen
  const sheet2Values: (string | number)[][] = [
    [
      `KISI-KISI ASESMEN KURIKULUM MERDEKA: ${exam.subject.toUpperCase()}`,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
    [
      `Satuan: ${exam.kopConfig?.schoolName || 'Sekolah Dasar'} | Tahun Pelajaran: ${exam.academicYear} | Waktu: ${exam.durationMinutes} Menit`,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
    [
      'No',
      'Mata Pelajaran',
      'Kelas / Fase',
      'Topik / Materi Pokok',
      'Tujuan Pembelajaran (TP)',
      'Indikator Ketercapaian Soal',
      'Level Bloom',
      'Bentuk Soal',
      'No Soal',
      'Bobot',
    ],
  ];

  exam.questions.forEach((q, idx) => {
    sheet2Values.push([
      idx + 1,
      exam.subject,
      `Kelas ${exam.grade} (${exam.fase})`,
      q.topicRef || exam.topic || '-',
      q.tpRef || exam.tp,
      q.indicator || `Menguji pemahaman topik ${q.topicRef || exam.topic}`,
      `Level ${q.cognitiveLevel}`,
      q.type,
      idx + 1,
      q.score || 1,
    ]);
  });

  // 4. Prepare Data for Sheet 3: Format Rekap Nilai Siswa
  const sheet3Values: (string | number)[][] = [
    [
      `FORMAT REKAPITULASI NILAI ASESMEN: ${exam.subject.toUpperCase()}`,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
    [
      `Kelas: ${exam.grade} | Materi: ${exam.topic || '-'} | Guru: ${exam.kopConfig?.teacherName || 'Guru Kelas'}`,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
    [
      'No',
      'NISN',
      'Nama Lengkap Siswa',
      'L/P',
      'Skor Pilihan Ganda',
      'Skor Isian',
      'Skor Uraian',
      'Total Nilai',
      'Ketercapaian KKTP',
      'Tindak Lanjut',
    ],
  ];

  // Dummy 10 sample student rows with formulas
  const sampleNames = [
    'Ahmad Zaky Pratama',
    'Bunga Citra Lestari',
    'Chandra Arya Wibawa',
    'Dinda Ayu Permatasari',
    'Eko Prasetyo',
    'Fatimah Azzahra',
    'Gilang Ramadhan',
    'Hanifah Nuraini',
    'Iqbal Maulana',
    'Jasmine Anindya',
  ];

  sampleNames.forEach((name, i) => {
    const rowNum = 4 + i;
    sheet3Values.push([
      i + 1,
      `00${i + 1}28394${i}`,
      name,
      i % 2 === 0 ? 'L' : 'P',
      '',
      '',
      '',
      `=SUM(E${rowNum}:G${rowNum})`,
      `=IF(H${rowNum}>=75; "Tuntas"; "Perlu Bimbingan")`,
      '',
    ]);
  });

  // 5. Write Data via batchUpdate values
  const writePayload = {
    valueInputOption: 'USER_ENTERED',
    data: [
      {
        range: "'1. Butir Soal & Kunci'!A1",
        values: sheet1Values,
      },
      {
        range: "'2. Kisi-Kisi Asesmen'!A1",
        values: sheet2Values,
      },
      {
        range: "'3. Format Rekap Nilai Siswa'!A1",
        values: sheet3Values,
      },
    ],
  };

  const writeRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(writePayload),
    }
  );

  if (!writeRes.ok) {
    console.warn('Gagal menulis data nilai ke spreadsheet, namun file telah terbuat');
  }

  // 6. Format headers with professional styling
  try {
    await applySpreadsheetStyles(accessToken, spreadsheetId, createdData.sheets);
  } catch (styleErr) {
    console.warn('Gagal memformat tampilan sheet, tetapi data berhasil tersimpan:', styleErr);
  }

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * Apply styling: Professional theme (blue header, bold text, frozen row)
 */
async function applySpreadsheetStyles(
  accessToken: string,
  spreadsheetId: string,
  sheets: any[]
) {
  const requests: any[] = [];

  sheets.forEach((sheet) => {
    const sheetId = sheet.properties.sheetId;

    // Title Row 1 styling (Bold, 12pt, deep navy)
    requests.push({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 0,
          endRowIndex: 1,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.93, green: 0.95, blue: 0.98 },
            textFormat: {
              bold: true,
              fontSize: 12,
              foregroundColor: { red: 0.0, green: 0.25, blue: 0.55 },
            },
          },
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat)',
      },
    });

    // Subtitle Row 2 styling (Italic, 10pt)
    requests.push({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 2,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.97, green: 0.98, blue: 0.99 },
            textFormat: {
              italic: true,
              fontSize: 10,
              foregroundColor: { red: 0.3, green: 0.35, blue: 0.4 },
            },
          },
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat)',
      },
    });

    // Header Table Row 3 styling (Navy Blue #00529C, white text, bold, centered)
    requests.push({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 2,
          endRowIndex: 3,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.0, green: 0.32, blue: 0.61 }, // #00529C
            horizontalAlignment: 'CENTER',
            verticalAlignment: 'MIDDLE',
            textFormat: {
              bold: true,
              fontSize: 10,
              foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
            },
            wrapStrategy: 'WRAP',
          },
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)',
      },
    });

    // Auto-resize first few columns
    requests.push({
      autoResizeDimensions: {
        dimensions: {
          sheetId,
          dimension: 'COLUMNS',
          startIndex: 0,
          endIndex: 4,
        },
      },
    });
  });

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ requests }),
  });
}

/**
 * Lists user's Google Spreadsheets from Google Drive
 */
export async function listDriveSpreadsheets(
  accessToken: string,
  maxResults = 20
): Promise<DriveSpreadsheetFile[]> {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
  const fields = encodeURIComponent('files(id, name, webViewLink, modifiedTime, createdTime)');
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=modifiedTime desc&pageSize=${maxResults}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gagal mengambil daftar spreadsheet dari Google Drive: HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Imports Question Items from a Google Sheet
 */
export async function importQuestionsFromSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  range = "'1. Butir Soal & Kunci'!A3:N100"
): Promise<QuestionItem[]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    // If specific sheet name not found, try default A3:Z100
    const fallbackUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A3:N100`;
    const fallbackRes = await fetch(fallbackUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!fallbackRes.ok) {
      throw new Error('Gagal membaca data dari Google Spreadsheet tersebut. Pastikan format tabel sesuai.');
    }
    const fallbackData = await fallbackRes.json();
    return parseQuestionRows(fallbackData.values || []);
  }

  const data = await res.json();
  return parseQuestionRows(data.values || []);
}

function parseQuestionRows(rows: any[][]): QuestionItem[] {
  if (rows.length < 2) {
    throw new Error('Tabel spreadsheet tidak memiliki baris data soal.');
  }

  // First row is headers
  const dataRows = rows.slice(1);
  const questions: QuestionItem[] = [];

  dataRows.forEach((row, i) => {
    if (!row[6] && !row[5]) return; // empty question text

    const num = Number(row[0]) || i + 1;
    const type = (row[1] || 'Pilihan Ganda') as QuestionItem['type'];
    const cognLevelRaw = (row[2] || 'C2').toString().toUpperCase();
    let cognLevel: QuestionItem['cognitiveLevel'] = 'C2';
    if (cognLevelRaw.includes('C1')) cognLevel = 'C1';
    else if (cognLevelRaw.includes('C3')) cognLevel = 'C3';
    else if (cognLevelRaw.includes('C4')) cognLevel = 'C4';
    else if (cognLevelRaw.includes('C5')) cognLevel = 'C5';
    else if (cognLevelRaw.includes('C6')) cognLevel = 'C6';

    const indicator = row[3] || '';
    const pattern = row[4] || '';
    const stimulus = row[5] || '';
    const questionText = row[6] || row[5] || `Pertanyaan nomor ${num}`;

    // Options A, B, C, D in cols 7, 8, 9, 10
    const options: string[] = [];
    if (row[7]) options.push(`A. ${row[7]}`);
    if (row[8]) options.push(`B. ${row[8]}`);
    if (row[9]) options.push(`C. ${row[9]}`);
    if (row[10]) options.push(`D. ${row[10]}`);

    const correctAnswer = row[11] || 'A';
    const discussion = row[12] || '';
    const score = Number(row[13]) || (type === 'Uraian' ? 5 : 1);

    questions.push({
      id: `imported-q-${num}-${Date.now()}`,
      number: num,
      type,
      cognitiveLevel: cognLevel,
      indicator,
      pattern,
      stimulus,
      question: questionText,
      options: options.length > 0 ? options : undefined,
      correctAnswer,
      discussion,
      score,
    });
  });

  return questions;
}

/**
 * Exports Perangkat Ajar list to a Google Spreadsheet
 */
export async function createModulesSpreadsheet(
  accessToken: string,
  modules: TeachingModule[]
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const spreadsheetTitle = `[Katalog Perangkat Ajar] SD Kurikulum Merdeka (${new Date().toLocaleDateString('id-ID')})`;

  const createPayload = {
    properties: {
      title: spreadsheetTitle,
      locale: 'id_ID',
    },
    sheets: [
      { properties: { title: 'Daftar Perangkat Ajar', gridProperties: { frozenRowCount: 3 } } },
    ],
  };

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createPayload),
  });

  if (!createRes.ok) {
    throw new Error('Gagal membuat Google Spreadsheet untuk Perangkat Ajar.');
  }

  const createdData = await createRes.json();
  const spreadsheetId: string = createdData.spreadsheetId;
  const spreadsheetUrl: string = createdData.spreadsheetUrl;

  const headerRows = [
    ['KATALOG PERANGKAT AJAR DAN MODUL GURU SEKOLAH DASAR', '', '', '', '', '', '', ''],
    [`Tanggal Ekspor: ${new Date().toLocaleString('id-ID')} | Total Dokumen: ${modules.length}`, '', '', '', '', '', '', ''],
    ['No', 'Kode Modul', 'Judul Perangkat Ajar', 'Jenis Dokumen', 'Mata Pelajaran', 'Fase', 'Kelas', 'Semester', 'Status Verifikasi'],
  ];

  const dataRows = modules.map((m, idx) => [
    idx + 1,
    m.code || '-',
    m.title,
    m.type,
    m.subject,
    m.fase,
    m.grade,
    m.semester,
    m.status,
  ]);

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [...headerRows, ...dataRows] }),
  });

  try {
    await applySpreadsheetStyles(accessToken, spreadsheetId, createdData.sheets);
  } catch (e) {
    console.warn(e);
  }

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * Deletes or trashes a spreadsheet file from Google Drive
 * Requires explicit user confirmation dialog before calling!
 */
export async function deleteSpreadsheetFile(accessToken: string, fileId: string): Promise<void> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Gagal menghapus file dari Google Drive: HTTP ${res.status}`);
  }
}
