// ============================================================
// MANAJEMEN KANTOR HUKUM - Google Apps Script (Lengkap v2)
// ============================================================
// Jalankan setupSemuaSheet() pertama kali setelah install
// ============================================================

var CONFIG = {
  SHEETS: {
    KLIEN: 'Data Klien',
    LAWAN: 'Data Lawan',
    KASUS: 'Data Kasus',
    KEUANGAN: 'Keuangan',
    JADWAL: 'Jadwal',
    DOKUMEN: 'Dokumen',
    TAGIHAN: 'Tagihan',
    CATATAN: 'Catatan Kasus',
    NOMOR_SURAT: 'Nomor Surat',
    DASHBOARD: 'Dashboard',
    ADMIN: 'Admin'
  },
  PREFIX: {
    KLIEN: 'KL-',
    LAWAN: 'LW-',
    KASUS: 'KKS-',
    KEUANGAN: 'TR-',
    JADWAL: 'JD-',
    DOKUMEN: 'DK-',
    TAGIHAN: 'TG-',
    CATATAN: 'CT-'
  }
};

var KANTOR = {
  nama: 'Mif Lawyer & Partners',
  pengacara1: 'Muhammad Ihsan Fauzi, S.H., M.H.',
  pengacara2: 'Rudi Kurniawan, S.H.',
  alamat: 'Panorama Hegarmanah, Kabupaten Bandung, Jawa Barat',
  kontak: '085759977665',
  web: 'https://miflawandpatners.my.id',
  email: 'ihsanfauzia@gmail.com'
};

var BULAN_ROMAWI = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
var NAMA_BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

// ============================================================
// MIGRATE HEADERS (Jalankan sekali saja untuk update header lama)
// ============================================================
function migrateHeaders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // --- Data Klien ---
  var klien = ss.getSheetByName(CONFIG.SHEETS.KLIEN);
  if (klien) {
    var h = klien.getRange(1, 1, 1, klien.getLastColumn()).getValues()[0];
    // Cek apakah sudah ada "Nama Ayah"
    if (h.indexOf('Nama Ayah') === -1) {
      // Insert 2 kolom setelah kolom 2 (Nama)
      klien.insertColumns(3, 2);
      klien.getRange(1, 3).setValue('Nama Ayah');
      klien.getRange(1, 4).setValue('Jenis Kelamin');
    }
    // Cek apakah sudah ada "Tempat Lahir"
    h = klien.getRange(1, 1, 1, klien.getLastColumn()).getValues()[0];
    if (h.indexOf('Tempat Lahir') === -1) {
      // Insert 1 kolom setelah kolom 7 (Email)
      klien.insertColumns(8, 1);
      klien.getRange(1, 8).setValue('Tempat Lahir');
    }
    // Format header
    klien.getRange(1, 1, 1, klien.getLastColumn()).setFontWeight('bold').setBackground('#1a5276').setFontColor('white');
  }

  // --- Data Lawan ---
  var lawan = ss.getSheetByName(CONFIG.SHEETS.LAWAN);
  if (lawan) {
    var h = lawan.getRange(1, 1, 1, lawan.getLastColumn()).getValues()[0];
    // Cek apakah sudah ada "Nama Ayah"
    if (h.indexOf('Nama Ayah') === -1) {
      // Insert 2 kolom setelah kolom 3 (Nama)
      lawan.insertColumns(4, 2);
      lawan.getRange(1, 4).setValue('Nama Ayah');
      lawan.getRange(1, 5).setValue('Jenis Kelamin');
    }
    // Cek apakah sudah ada "Tempat Lahir"
    h = lawan.getRange(1, 1, 1, lawan.getLastColumn()).getValues()[0];
    if (h.indexOf('Tempat Lahir') === -1) {
      // Insert 1 kolom setelah kolom 7 (No HP → jadi kolom 7 setelah insert)
      lawan.insertColumns(8, 1);
      lawan.getRange(1, 8).setValue('Tempat Lahir');
    }
    // Format header
    lawan.getRange(1, 1, 1, lawan.getLastColumn()).setFontWeight('bold').setBackground('#1a5276').setFontColor('white');
  }

  // --- Buat sheet Nomor Surat jika belum ada ---
  var nomorSurat = ss.getSheetByName(CONFIG.SHEETS.NOMOR_SURAT);
  if (!nomorSurat) {
    nomorSurat = ss.insertSheet(CONFIG.SHEETS.NOMOR_SURAT);
    var nsHeaders = ['ID','Tipe Surat','Kode Surat','Kategori','Nomor Urut','Tahun','Bulan','Nomor Lengkap','Tanggal Generate'];
    nomorSurat.getRange(1, 1, 1, nsHeaders.length).setValues([nsHeaders]);
    nomorSurat.getRange(1, 1, 1, nsHeaders.length).setFontWeight('bold').setBackground('#1a5276').setFontColor('white');
    nomorSurat.setFrozenRows(1);
  }

  SpreadsheetApp.getUi().alert('Header berhasil di-update!\n\nSilakan cek sheet Data Klien dan Data Lawan.');
}

// ============================================================
// 1. SETUP SEMUA SHEET
// ============================================================
function setupSemuaSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var sheets = [
    { name: CONFIG.SHEETS.KLIEN, headers: ['ID','Nama','Nama Ayah','Jenis Kelamin','No KTP','No HP','Email','Tempat Lahir','Tgl Lahir','Usia','Pekerjaan','Alamat','Status Kawin','Agama','Pendidikan','Penghasilan','Sumber','Tgl Daftar','Keterangan'] },
    { name: CONFIG.SHEETS.LAWAN, headers: ['ID','ID Klien','Nama','Nama Ayah','Jenis Kelamin','No KTP','No HP','Tempat Lahir','Tgl Lahir','Usia','Pekerjaan','Alamat','Status Kawin','Agama','Penghasilan','Hubungan','Keterangan'] },
    { name: CONFIG.SHEETS.KASUS, headers: ['ID','ID Klien','ID Lawan','Tipe Kasus','Status Kasus','Tgl Daftar','No Perkara','Status Perkara','Tahun Perkara','Pengadilan','No Register','Hakim Ketua','Hakim Anggota','Mediator','Panitera','Estimasi Selesai','Biaya Total','Biaya Bayar','Sisa Tagihan','Keterangan'] },
    { name: CONFIG.SHEETS.KEUANGAN, headers: ['ID','ID Kasus','Tipe','Deskripsi','Jumlah','Metode Bayar','Tanggal','Keterangan'] },
    { name: CONFIG.SHEETS.JADWAL, headers: ['ID','ID Kasus','Tipe Jadwal','Tanggal','Waktu','Lokasi','Status','Keterangan'] },
    { name: CONFIG.SHEETS.DOKUMEN, headers: ['ID','ID Kasus','Nama Dokumen','Tipe Dokumen','Link Drive','Tgl Upload','Keterangan'] },
    { name: CONFIG.SHEETS.TAGIHAN, headers: ['ID','ID Kasus','No Invoice','Item','Jumlah','Status Bayar','Jatuh Tempo','Tgl Bayar','Keterangan'] },
    { name: CONFIG.SHEETS.CATATAN, headers: ['ID','ID Kasus','Tanggal','Judul','Isi Catatan','Tipe','Oleh'] },
    { name: CONFIG.SHEETS.NOMOR_SURAT, headers: ['ID','Tipe Surat','Kode Surat','Kategori','Nomor Urut','Tahun','Bulan','Nomor Lengkap','Tanggal Generate'] }
  ];

  for (var s = 0; s < sheets.length; s++) {
    var sheet = ss.getSheetByName(sheets[s].name);
    if (!sheet) {
      sheet = ss.insertSheet(sheets[s].name);
    }
    var headers = sheets[s].headers;
    var existingHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    var hasHeaders = false;
    for (var h = 0; h < existingHeaders.length; h++) {
      if (existingHeaders[h] === headers[0]) { hasHeaders = true; break; }
    }
    if (!hasHeaders) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1a5276').setFontColor('white');
      sheet.setFrozenRows(1);
      for (var c = 1; c <= headers.length; c++) {
        sheet.autoResizeColumn(c);
      }
    }
  }

  setupDashboard();
  setupAdminSheet();
}

// ============================================================
// 2. AUTO NUMBERING
// ============================================================
function getLatestId(sheetName, prefix) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() <= 1) return prefix + '001';
  var lastRow = sheet.getLastRow();
  var lastId = sheet.getRange(lastRow, 1).getValue();
  if (!lastId || lastId === '') return prefix + '001';
  var num = parseInt(lastId.replace(prefix, '')) + 1;
  return prefix + (num < 10 ? '00' : num < 100 ? '0' : '') + num;
}

// ============================================================
// 3. HITUNG USIA
// ============================================================
function hitungUsia(tglLahir) {
  if (!tglLahir) return '';
  var lahir = new Date(tglLahir);
  var now = new Date();
  var usia = now.getFullYear() - lahir.getFullYear();
  if (now.getMonth() < lahir.getMonth() || (now.getMonth() === lahir.getMonth() && now.getDate() < lahir.getDate())) {
    usia--;
  }
  return usia + ' tahun';
}

// ============================================================
// 4. FORMAT BIN/BINTI
// ============================================================
function formatBinBinti(jenisKelamin, namaAyah) {
  if (!namaAyah) return '';
  if (jenisKelamin === 'Laki-laki') return 'bin ' + namaAyah;
  if (jenisKelamin === 'Perempuan') return 'binti ' + namaAyah;
  return '';
}

// ============================================================
// 5. GET NOMOR SURAT
// ============================================================
function getNomorSurat(tipeSurat, kategori) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.NOMOR_SURAT);
  if (!sheet) {
    setupSemuaSheet();
    sheet = ss.getSheetByName(CONFIG.SHEETS.NOMOR_SURAT);
  }

  var now = new Date();
  var bulan = BULAN_ROMAWI[now.getMonth()];
  var tahun = now.getFullYear();
  var kodeSurat = tipeSurat === 'Surat Kuasa' ? 'SK' : tipeSurat === 'Domisili' ? 'SD' : 'SE';

  var nomorUrut = 1;
  if (sheet.getLastRow() > 1) {
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][1] === tipeSurat && data[i][3] === kategori && data[i][6] === bulan && data[i][5] === tahun) {
        nomorUrut = data[i][4] + 1;
      }
    }
  }

  var nomorFormatted = nomorUrut < 10 ? '0' + nomorUrut : '' + nomorUrut;
  var nomorLengkap = nomorFormatted + '/' + kodeSurat + '/' + kategori + '/MIFLAW/' + bulan + '/' + tahun;

  var id = getLatestId(CONFIG.SHEETS.NOMOR_SURAT, 'NS-');
  sheet.appendRow([
    id, tipeSurat, kodeSurat, kategori, nomorUrut, tahun, bulan, nomorLengkap, now
  ]);

  return nomorLengkap;
}

// ============================================================
// 6. GET DATA KLIEN
// ============================================================
function getDataKlien(idKlien) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.KLIEN);
  if (!sheet) return null;
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === idKlien) {
      return {
        nama: data[i][1],
        namaAyah: data[i][2],
        jenisKelamin: data[i][3],
        ktp: data[i][4],
        hp: data[i][5],
        email: data[i][6],
        tempatLahir: data[i][7],
        tglLahir: data[i][8],
        usia: data[i][9],
        pekerjaan: data[i][10],
        alamat: data[i][11],
        statusKawin: data[i][12],
        agama: data[i][13],
        pendidikan: data[i][14]
      };
    }
  }
  return null;
}

// ============================================================
// 7. GET DATA LAWAN
// ============================================================
function getDataLawan(idLawan) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.LAWAN);
  if (!sheet) return null;
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === idLawan) {
      return {
        nama: data[i][2],
        namaAyah: data[i][3],
        jenisKelamin: data[i][4],
        ktp: data[i][5],
        hp: data[i][6],
        tempatLahir: data[i][7],
        tglLahir: data[i][8],
        usia: data[i][9],
        pekerjaan: data[i][10],
        alamat: data[i][11],
        agama: data[i][13]
      };
    }
  }
  return null;
}

// ============================================================
// 8. GET DATA KASUS
// ============================================================
function getDataKasus(idKasus) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.KASUS);
  if (!sheet) return null;
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === idKasus) {
      return {
        idKlien: data[i][1],
        idLawan: data[i][2],
        tipeKasus: data[i][3],
        statusKasus: data[i][4],
        noPerkara: data[i][6],
        pengadilan: data[i][9]
      };
    }
  }
  return null;
}

// ============================================================
// 9. GENERATE SURAT KUASA (Google Docs - bisa diedit)
// ============================================================
function generateSuratKuasa(idKlien, idLawan, idKasus) {
  var klien = getDataKlien(idKlien);
  var lawan = getDataLawan(idLawan);
  var kasus = getDataKasus(idKasus);

  if (!klien) return { success: false, message: 'Klien tidak ditemukan' };
  if (!lawan) return { success: false, message: 'Lawan tidak ditemukan' };
  if (!kasus) return { success: false, message: 'Kasus tidak ditemukan' };

  var kategori = kasus.tipeKasus === 'Cerai Gugat' ? 'PDTG' : 'PDTT';
  var nomorSurat = getNomorSurat('Surat Kuasa', kategori);
  var binBintiKlien = formatBinBinti(klien.jenisKelamin, klien.namaAyah);
  var binBintiLawan = formatBinBinti(lawan.jenisKelamin, lawan.namaAyah);
  var pihakLawan = kasus.tipeKasus === 'Cerai Gugat' ? 'Tergugat' : 'Termohon';
  var pihakKlien = kasus.tipeKasus === 'Cerai Gugat' ? 'Penggugat' : 'Pemohon';
  var tglLahirKlien = klien.tempatLahir + ', ' + Utilities.formatDate(new Date(klien.tglLahir), 'Asia/Jakarta', 'dd/MM/yyyy');
  var tglLahirLawan = lawan.tempatLahir + ', ' + Utilities.formatDate(new Date(lawan.tglLahir), 'Asia/Jakarta', 'dd/MM/yyyy');
  var tanggalSurat = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd MMMM yyyy');

  var doc = DocumentApp.create('Surat Kuasa - ' + klien.nama);
  var body = doc.getBody();
  body.clear();

  var style = {};
  style[DocumentApp.Attribute.FONT_FAMILY] = 'Times New Roman';
  style[DocumentApp.Attribute.FONT_SIZE] = 12;
  style[DocumentApp.Attribute.LINE_SPACING] = 1.5;

  var title = body.appendParagraph('SURAT KUASA');
  title.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  title.setBold(true);
  title.setFontSize(14);
  title.setSpacingAfter(6);

  var nomor = body.appendParagraph('Nomor: ' + nomorSurat);
  nomor.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  nomor.setSpacingAfter(12);

  body.appendParagraph('Yang bertanda tangan dibawah ini:').setSpacingAfter(6);

  var pemberi = body.appendParagraph(
    klien.nama + ' ' + binBintiKlien + ', NIK ' + klien.ktp +
    ', Tempat/Tgl Lahir di ' + tglLahirKlien + ' (umur ' + klien.usia + ')' +
    ', Agama ' + klien.agama + ', Pendidikan ' + klien.pendidikan +
    ', Pekerjaan ' + klien.pekerjaan + ' Alamat ' + klien.alamat +
    '. Email: ' + klien.email
  );
  pemberi.setSpacingAfter(6);

  body.appendParagraph('Selanjutnya disebut sebagai PEMBERI KUASA.').setSpacingAfter(12);

  body.appendParagraph('Dengan ini menerangkan memberi kuasa kepada:').setSpacingAfter(6);

  var penerima = body.appendParagraph(
    KANTOR.pengacara1 + ', & ' + KANTOR.pengacara2 + '\n' +
    'Para Advokat, Pengacara dan Penasihat Hukum yang berkantor di Kantor Advokat Pengacara dan Penasihat Hukum ' +
    KANTOR.nama + ', yang berkantor di ' + KANTOR.alamat + ', Kontak ' + KANTOR.kontak +
    ', Web. ' + KANTOR.web + ' Email: ' + KANTOR.email
  );
  penerima.setSpacingAfter(6);

  body.appendParagraph('Selanjutnya disebut PENERIMA KUASA.').setSpacingAfter(12);

  body.appendParagraph('KHUSUS').setBold(true).setSpacingAfter(6);

  var isiKuasa = body.appendParagraph(
    'Untuk mewakili kepentingan Pemberi Kuasa/' + pihakKlien + ' dapat bertindak bersama-sama ataupun sendiri-sendiri ' +
    'untuk mengajukan Perkara ' + kasus.tipeKasus + ' di ' + (kasus.pengadilan || 'Pengadilan Agama ...') + ' terhadap:'
  );
  isiKuasa.setSpacingAfter(6);

  var lawanText = body.appendParagraph(
    lawan.nama + ' ' + binBintiLawan + ', NIK. ' + lawan.ktp +
    ', Tempat/Tgl Lahir di ' + tglLahirLawan + ' (umur ' + lawan.usia + ')' +
    ', Agama ' + lawan.agama + ', Pendidikan ' + (lawan.pendidikan || '-') +
    ', Pekerjaan ' + (lawan.pekerjaan || '-') + ', Alamat ' + lawan.alamat +
    '. Selanjutnya disebut sebagai ' + pihakLawan + '.'
  );
  lawanText.setSpacingAfter(12);

  var hakKuasa = body.appendParagraph(
    'Untuk yang diberi kuasa berhak mewakili Pemberi Kuasa untuk membuat, menandatangani, serta mendaftarkan ' +
    'perkara ' + kasus.tipeKasus + ' melalui sistem manual ataupun sistem ecourt Mahkamah Agung. ' +
    'Hadir setiap acara persidangan, memperbaiki gugatan beserta petitumnya, membuat replik, menerima duplik ' +
    'mengajukan bukti serta saksi dan menolak serta mengajukan keberatan atas bukti yang dihadirkan ' + pihakLawan + ' dalam persidangan ' +
    'baik itu tertulis maupun saksi, mengajukan kesimpulan, mengajukan upaya hukum yang dianggap penting dan perlu serta berguna ' +
    'untuk kepentingan perkara ini, sehubungan menjalankan perkara ini, dikuasakan pula mencabut gugatan, ' +
    'dikuasakan untuk mengambil dan menambah panjar perkara dan mengambil Putusan/menerima Akta Cerai. ' +
    'Melakukan teguran atau upaya perdamaian dengan pihak ' + pihakLawan + ' dan upaya-upaya lainnya yang berguna ' +
    'baik secara Litigasi maupun Non Litigasi untuk kepentingan pemberi kuasa. ' +
    'Kuasa ini diberikan dengan Hak Subsitusi dan Hak Retensi.'
  );
  hakKuasa.setSpacingAfter(24);

  var ttdSection = body.appendParagraph('');
  ttdSection.appendInlineContainer(DocumentApp.createParagraph('').getText() + '\n\n\n');
  ttdSection.appendInlineContainer('MUHAMMAD IHSAN FAUZI, S.H., M.H');
  ttdSection.setSpacingAfter(6);

  var ttdPemberi = body.appendParagraph('');
  ttdPemberi.appendInlineContainer('Bandung, ' + tanggalSurat);
  ttdPemberi.appendInlineContainer('\n\n');
  ttdPemberi.appendInlineContainer('PENERIMA KUASA');
  ttdPemberi.appendInlineContainer('\n\n');
  ttdPemberi.appendInlineContainer('PEMBERI KUASA');
  ttdPemberi.appendInlineContainer('\n\n\n\n');
  ttdPemberi.appendInlineContainer(klien.nama.toUpperCase());
  ttdPemberi.setSpacingAfter(6);

  var ttd2 = body.appendParagraph('');
  ttd2.appendInlineContainer('RUDI KURNIAWAN, S.H.');
  ttd2.setSpacingAfter(24);

  // E-Court Section
  body.appendParagraph('PERSETUJUAN PIHAK').setBold(true).setAlignment(DocumentApp.HorizontalAlignment.CENTER).setSpacingAfter(2);
  body.appendParagraph('BERACARA SECARA ELEKTRONIK (E-COURT)').setBold(true).setAlignment(DocumentApp.HorizontalAlignment.CENTER).setSpacingAfter(2);
  body.appendParagraph('DI ' + (kasus.pengadilan || 'PENGADILAN AGAMA ...').toUpperCase()).setBold(true).setAlignment(DocumentApp.HorizontalAlignment.CENTER).setSpacingAfter(12);

  body.appendParagraph('Saya yang bertanda-tangan dibawah ini:').setSpacingAfter(6);

  body.appendParagraph(
    klien.nama + ' ' + binBintiKlien + ', NIK ' + klien.ktp +
    ', Tempat/Tgl Lahir di ' + tglLahirKlien + ' (umur ' + klien.usia + ')' +
    ', Agama ' + klien.agama + ', Pendidikan ' + klien.pendidikan +
    ', Pekerjaan ' + klien.pekerjaan + ' Alamat ' + klien.alamat +
    '. Email: ' + klien.email
  ).setSpacingAfter(6);

  body.appendParagraph(
    'Selanjutnya disebut Penggugat/Pemohon sebagai Pengguna Terdaftar perkara perdata/permohonan yang terdaftar pada Aplikasi E-Court Sistem Informasi Pengadilan pada ' + (kasus.pengadilan || 'Pengadilan Agama') + '. ' +
    'Berdasarkan Peraturan Mahkamah Agung Republik Indonesia Nomor 3 Tahun 2018, Tentang Administrasi Perkara di Pengadilan Secara Elektronik, para pihak tersebut diatas menyatakan:'
  ).setSpacingAfter(6);

  body.appendParagraph('Mengikuti Proses Acara Persidangan secara Elektronik, yang dimulai dari acara Mediasi, Jawaban, Replik, Duplik dan Kesimpulan;').setSpacingAfter(3);
  body.appendParagraph('Melaksanakan sidang pembuktian sesuai dengan hukum acara yang berlaku;').setSpacingAfter(3);
  body.appendParagraph('Menerima panggilan sidang dan pemberitahuan putusan perkara perdata/permohonan secara elektronik;').setSpacingAfter(6);

  body.appendParagraph(
    'Demikian surat persetujuan ini dibuat untuk Beracara Secara Elektronik di ' + (kasus.pengadilan || 'Pengadilan Agama') +
    ' yang harus dipenuhi oleh para pihak dihadapan Panitera Pengadilan tersebut.'
  ).setSpacingAfter(12);

  body.appendParagraph('Bandung, ' + tanggalSurat).setSpacingAfter(6);
  body.appendParagraph('Hormat Saya,').setSpacingAfter(30);
  body.appendParagraph(klien.nama.toUpperCase()).setBold(true);

  doc.saveAndClose();

  var link = 'https://docs.google.com/document/d/' + doc.getId() + '/edit';
  return { success: true, link: link, message: 'Surat Kuasa berhasil digenerate', nomor: nomorSurat };
}

// ============================================================
// 10. GENERATE SURAT DOMISILI (Google Docs - bisa diedit)
// ============================================================
function generateDomisili(idKlien) {
  var klien = getDataKlien(idKlien);
  if (!klien) return { success: false, message: 'Klien tidak ditemukan' };

  var binBintiKlien = formatBinBinti(klien.jenisKelamin, klien.namaAyah);
  var tglLahirKlien = klien.tempatLahir + ', ' + Utilities.formatDate(new Date(klien.tglLahir), 'Asia/Jakarta', 'dd/MM/yyyy');
  var tanggalSurat = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd MMMM yyyy');
  var nomorSurat = getNomorSurat('Domisili', 'SD');

  var doc = DocumentApp.create('Surat Domisili - ' + klien.nama);
  var body = doc.getBody();
  body.clear();

  var title = body.appendParagraph('SURAT PERNYATAAN DOMISILI TEMPAT TINGGAL');
  title.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  title.setBold(true);
  title.setFontSize(14);
  title.setSpacingAfter(12);

  body.appendParagraph('Saya yang bertanda tangan di bawah ini:').setSpacingAfter(6);

  body.appendParagraph(
    klien.nama + ' ' + binBintiKlien + ', NIK ' + klien.ktp +
    ', Tempat/Tgl Lahir di ' + tglLahirKlien + ' (umur ' + klien.usia + ')' +
    ', Agama ' + klien.agama + ', Pendidikan ' + klien.pendidikan +
    ', Pekerjaan ' + klien.pekerjaan + ' Alamat ' + klien.alamat +
    '. Email: ' + klien.email
  ).setSpacingAfter(12);

  body.appendParagraph(
    'Demikian Surat Pernyataan ini saya buat untuk keperluan pengajuan gugatan di ' + (kasus.pengadilan || 'Pengadilan Agama Bandung') +
    '. Apabila di kemudian hari terbukti bahwa Surat Pernyataan ini tidak benar, maka saya bersedia bertanggung jawab sesuai peraturan perundang-undangan yang berlaku.'
  ).setSpacingAfter(24);

  body.appendParagraph('Bandung, ' + tanggalSurat).setSpacingAfter(6);
  body.appendParagraph('Yang Membuat Pernyataan').setSpacingAfter(40);
  body.appendParagraph(klien.nama.toUpperCase()).setBold(true);

  doc.saveAndClose();

  var link = 'https://docs.google.com/document/d/' + doc.getId() + '/edit';
  return { success: true, link: link, message: 'Surat Domisili berhasil digenerate', nomor: nomorSurat };
}

// ============================================================
// 11. GENERATE SURAT E-COURT (Google Docs - bisa diedit)
// ============================================================
function generateSuratECourt(idKlien, idKasus) {
  var klien = getDataKlien(idKlien);
  var kasus = getDataKasus(idKasus);
  if (!klien) return { success: false, message: 'Klien tidak ditemukan' };
  if (!kasus) return { success: false, message: 'Kasus tidak ditemukan' };

  var binBintiKlien = formatBinBinti(klien.jenisKelamin, klien.namaAyah);
  var tglLahirKlien = klien.tempatLahir + ', ' + Utilities.formatDate(new Date(klien.tglLahir), 'Asia/Jakarta', 'dd/MM/yyyy');
  var tanggalSurat = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd MMMM yyyy');
  var nomorSurat = getNomorSurat('E-Court', 'SE');

  var doc = DocumentApp.create('Surat E-Court - ' + klien.nama);
  var body = doc.getBody();
  body.clear();

  var title = body.appendParagraph('PERSETUJUAN PIHAK');
  title.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  title.setBold(true);
  title.setFontSize(14);
  title.setSpacingAfter(2);

  body.appendParagraph('BERACARA SECARA ELEKTRONIK (E-COURT)').setBold(true).setAlignment(DocumentApp.HorizontalAlignment.CENTER).setSpacingAfter(2);
  body.appendParagraph('DI ' + (kasus.pengadilan || 'PENGADILAN AGAMA ...').toUpperCase()).setBold(true).setAlignment(DocumentApp.HorizontalAlignment.CENTER).setSpacingAfter(12);

  body.appendParagraph('Saya yang bertanda-tangan dibawah ini:').setSpacingAfter(6);

  body.appendParagraph(
    klien.nama + ' ' + binBintiKlien + ', NIK ' + klien.ktp +
    ', Tempat/Tgl Lahir di ' + tglLahirKlien + ' (umur ' + klien.usia + ')' +
    ', Agama ' + klien.agama + ', Pendidikan ' + klien.pendidikan +
    ', Pekerjaan ' + klien.pekerjaan + ' Alamat ' + klien.alamat +
    '. Email: ' + klien.email
  ).setSpacingAfter(6);

  body.appendParagraph(
    'Selanjutnya disebut Penggugat/Pemohon sebagai Pengguna Terdaftar perkara perdata/permohonan yang terdaftar pada Aplikasi E-Court Sistem Informasi Pengadilan pada ' + (kasus.pengadilan || 'Pengadilan Agama') + '. ' +
    'Berdasarkan Peraturan Mahkamah Agung Republik Indonesia Nomor 3 Tahun 2018, Tentang Administrasi Perkara di Pengadilan Secara Elektronik, para pihak tersebut diatas menyatakan:'
  ).setSpacingAfter(6);

  body.appendParagraph('Mengikuti Proses Acara Persidangan secara Elektronik, yang dimulai dari acara Mediasi, Jawaban, Replik, Duplik dan Kesimpulan;').setSpacingAfter(3);
  body.appendParagraph('Melaksanakan sidang pembuktian sesuai dengan hukum acara yang berlaku;').setSpacingAfter(3);
  body.appendParagraph('Menerima panggilan sidang dan pemberitahuan putusan perkara perdata/permohonan secara elektronik;').setSpacingAfter(6);

  body.appendParagraph(
    'Demikian surat persetujuan ini dibuat untuk Beracara Secara Elektronik di ' + (kasus.pengadilan || 'Pengadilan Agama') +
    ' yang harus dipenuhi oleh para pihak dihadapan Panitera Pengadilan tersebut.'
  ).setSpacingAfter(24);

  body.appendParagraph('Bandung, ' + tanggalSurat).setSpacingAfter(6);
  body.appendParagraph('Hormat Saya,').setSpacingAfter(40);
  body.appendParagraph(klien.nama.toUpperCase()).setBold(true);

  doc.saveAndClose();

  var link = 'https://docs.google.com/document/d/' + doc.getId() + '/edit';
  return { success: true, link: link, message: 'Surat E-Court berhasil digenerate', nomor: nomorSurat };
}

// ============================================================
// 12. GENERATE SEMUA SURAT SEKALIGUS
// ============================================================
function generateSemuaSurat(idKlien, idLawan, idKasus) {
  var results = {};

  var suratKuasa = generateSuratKuasa(idKlien, idLawan, idKasus);
  results.suratKuasa = suratKuasa;

  var domisili = generateDomisili(idKlien);
  results.domisili = domisili;

  var eCourt = generateSuratECourt(idKlien, idKasus);
  results.eCourt = eCourt;

  return results;
}

// ============================================================
// 13. SETUP DASHBOARD
// ============================================================
function setupDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dashboard = ss.getSheetByName(CONFIG.SHEETS.DASHBOARD);

  if (!dashboard) {
    dashboard = ss.insertSheet(CONFIG.SHEETS.DASHBOARD);
  }
  dashboard.clear();

  dashboard.getRange('A1').setValue('DASHBOARD MANAJEMEN KANTOR HUKUM');
  dashboard.getRange('A1').setFontWeight('bold').setFontSize(16);
  dashboard.getRange('A1:F1').merge().setBackground('#1a5276').setFontColor('white');

  dashboard.getRange('A2').setValue('Terakhir diperbarui: ' + Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd MMMM yyyy HH:mm'));
  dashboard.getRange('A2').setFontColor('#666666');

  var kasus = ss.getSheetByName(CONFIG.SHEETS.KASUS);
  dashboard.getRange('A4').setValue('RINGKASAN KASUS');
  dashboard.getRange('A4').setFontWeight('bold').setFontSize(12).setBackground('#eaf2f8');

  if (kasus && kasus.getLastRow() > 1) {
    var data = kasus.getDataRange().getValues();
    var counts = { 'Baru': 0, 'Dalam Proses': 0, 'Sidang': 0, 'Putusan': 0, 'Selesai': 0 };
    for (var i = 1; i < data.length; i++) {
      var status = data[i][4];
      if (counts.hasOwnProperty(status)) counts[status]++;
    }
    var row = 5;
    dashboard.getRange('A' + row).setValue('Total Kasus');
    dashboard.getRange('B' + row).setValue(data.length - 1);
    for (var s in counts) {
      row++;
      dashboard.getRange('A' + row).setValue(s);
      dashboard.getRange('B' + row).setValue(counts[s]);
    }
  } else {
    dashboard.getRange('A5').setValue('Belum ada data kasus');
  }

  var keuangan = ss.getSheetByName(CONFIG.SHEETS.KEUANGAN);
  row = 12;
  dashboard.getRange('A' + row).setValue('RINGKASAN KEUANGAN');
  dashboard.getRange('A' + row).setFontWeight('bold').setFontSize(12).setBackground('#eaf2f8');

  if (keuangan && keuangan.getLastRow() > 1) {
    var dataK = keuangan.getDataRange().getValues();
    var bulanIni = new Date().getMonth();
    var tahunIni = new Date().getFullYear();
    var totalMasuk = 0, totalKeluar = 0;
    for (var i = 1; i < dataK.length; i++) {
      var tgl = new Date(dataK[i][6]);
      if (tgl.getMonth() === bulanIni && tgl.getFullYear() === tahunIni) {
        if (dataK[i][2] === 'Masuk') totalMasuk += dataK[i][4];
        else totalKeluar += dataK[i][4];
      }
    }
    dashboard.getRange('A' + (row + 1)).setValue('Pemasukan Bulan Ini');
    dashboard.getRange('B' + (row + 1)).setValue(totalMasuk).setNumberFormat('Rp#,##0');
    dashboard.getRange('A' + (row + 2)).setValue('Pengeluaran Bulan Ini');
    dashboard.getRange('B' + (row + 2)).setValue(totalKeluar).setNumberFormat('Rp#,##0');
    dashboard.getRange('A' + (row + 3)).setValue('Laba Bulan Ini');
    dashboard.getRange('B' + (row + 3)).setValue(totalMasuk - totalKeluar).setNumberFormat('Rp#,##0');
    dashboard.getRange('B' + (row + 3)).setFontWeight('bold');
  } else {
    dashboard.getRange('A' + (row + 1)).setValue('Belum ada data keuangan');
  }

  row = 18;
  dashboard.getRange('A' + row).setValue('JADWAL 7 HARI KEDEPAN');
  dashboard.getRange('A' + row).setFontWeight('bold').setFontSize(12).setBackground('#eaf2f8');

  var jadwal = ss.getSheetByName(CONFIG.SHEETS.JADWAL);
  if (jadwal && jadwal.getLastRow() > 1) {
    var dataJ = jadwal.getDataRange().getValues();
    var now = new Date();
    var mingguDepan = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    row++;
    dashboard.getRange('A' + row).setValue('Tanggal');
    dashboard.getRange('B' + row).setValue('Waktu');
    dashboard.getRange('C' + row).setValue('Tipe');
    dashboard.getRange('D' + row).setValue('Lokasi');
    dashboard.getRange('E' + row).setValue('Status');
    dashboard.getRange('A' + row + ':E' + row).setFontWeight('bold').setBackground('#d5e8d4');
    row++;
    var count = 0;
    for (var i = 1; i < dataJ.length; i++) {
      var tgl = new Date(dataJ[i][3]);
      if (tgl >= now && tgl <= mingguDepan && dataJ[i][6] !== 'Dibatalkan') {
        dashboard.getRange('A' + row).setValue(Utilities.formatDate(tgl, 'Asia/Jakarta', 'dd/MM/yyyy'));
        dashboard.getRange('B' + row).setValue(dataJ[i][4]);
        dashboard.getRange('C' + row).setValue(dataJ[i][2]);
        dashboard.getRange('D' + row).setValue(dataJ[i][5]);
        dashboard.getRange('E' + row).setValue(dataJ[i][6]);
        row++;
        count++;
      }
    }
    if (count === 0) {
      dashboard.getRange('A' + row).setValue('Tidak ada jadwal minggu ini');
    }
  } else {
    dashboard.getRange('A' + (row + 1)).setValue('Belum ada jadwal');
  }

  row = 28;
  dashboard.getRange('A' + row).setValue('TAGIHAN JATUH TEMPO');
  dashboard.getRange('A' + row).setFontWeight('bold').setFontSize(12).setBackground('#fdecea');

  var tagihan = ss.getSheetByName(CONFIG.SHEETS.TAGIHAN);
  if (tagihan && tagihan.getLastRow() > 1) {
    var dataT = tagihan.getDataRange().getValues();
    var now2 = new Date();
    var mingguDepan2 = new Date(now2.getTime() + 7 * 24 * 60 * 60 * 1000);
    row++;
    dashboard.getRange('A' + row).setValue('No Invoice');
    dashboard.getRange('B' + row).setValue('Item');
    dashboard.getRange('C' + row).setValue('Jumlah');
    dashboard.getRange('D' + row).setValue('Jatuh Tempo');
    dashboard.getRange('E' + row).setValue('Status');
    dashboard.getRange('A' + row + ':E' + row).setFontWeight('bold').setBackground('#f5b7b1');
    row++;
    var countT = 0;
    for (var i = 1; i < dataT.length; i++) {
      var tglT = new Date(dataT[i][6]);
      if (tglT >= now2 && tglT <= mingguDepan2 && dataT[i][5] !== 'Lunas') {
        dashboard.getRange('A' + row).setValue(dataT[i][2]);
        dashboard.getRange('B' + row).setValue(dataT[i][3]);
        dashboard.getRange('C' + row).setValue(dataT[i][4]).setNumberFormat('Rp#,##0');
        dashboard.getRange('D' + row).setValue(Utilities.formatDate(tglT, 'Asia/Jakarta', 'dd/MM/yyyy'));
        dashboard.getRange('E' + row).setValue(dataT[i][5]);
        row++;
        countT++;
      }
    }
    if (countT === 0) {
      dashboard.getRange('A' + row).setValue('Tidak ada tagihan jatuh tempo');
    }
  } else {
    dashboard.getRange('A' + (row + 1)).setValue('Belum ada tagihan');
  }

  dashboard.setColumnWidth(1, 200);
  dashboard.setColumnWidth(2, 200);
  dashboard.setColumnWidth(3, 150);
  dashboard.setColumnWidth(4, 200);
  dashboard.setColumnWidth(5, 150);

  SpreadsheetApp.flush();
}

// ============================================================
// 14. AUTO-UPDATE SISA TAGIHAN
// ============================================================
function updateSisaTagihan() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var kasus = ss.getSheetByName(CONFIG.SHEETS.KASUS);
  if (!kasus || kasus.getLastRow() <= 1) return;
  for (var i = 2; i <= kasus.getLastRow(); i++) {
    var biayaTotal = kasus.getRange(i, 17).getValue() || 0;
    var biayaBayar = kasus.getRange(i, 18).getValue() || 0;
    kasus.getRange(i, 19).setValue(biayaTotal - biayaBayar);
  }
}

// ============================================================
// 15. NOTIFIKASI JADWAL
// ============================================================
function cekJadwalMendekat() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var jadwal = ss.getSheetByName(CONFIG.SHEETS.JADWAL);
  if (!jadwal || jadwal.getLastRow() <= 1) return;

  var data = jadwal.getDataRange().getValues();
  var now = new Date();
  var besok = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  var lusa = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  var pesan = [];

  for (var i = 1; i < data.length; i++) {
    var tgl = new Date(data[i][3]);
    var status = data[i][6];
    if (status === 'Terjadwal') {
      var tglJadwal = Utilities.formatDate(tgl, 'Asia/Jakarta', 'yyyy-MM-dd');
      var tglBesok = Utilities.formatDate(besok, 'Asia/Jakarta', 'yyyy-MM-dd');
      var tglLusa = Utilities.formatDate(lusa, 'Asia/Jakarta', 'yyyy-MM-dd');
      if (tglJadwal === tglBesok) {
        pesan.push('BESOK: ' + data[i][2] + ' jam ' + data[i][4] + ' di ' + data[i][5]);
      } else if (tglJadwal === tglLusa) {
        pesan.push('LUSA: ' + data[i][2] + ' jam ' + data[i][4] + ' di ' + data[i][5]);
      }
    }
  }

  if (pesan.length > 0) {
    var body = 'JADWAL HALAL BIL HALAL:\n\n' + pesan.join('\n') + '\n\n---\nManajemen Kantor Hukum';
    MailApp.sendEmail(Session.getActiveUser().getEmail(), 'Jadwal Sidang/Konsultasi', body);
  }
}

// ============================================================
// 16. NOTIFIKASI TAGIHAN JATUH TEMPO
// ============================================================
function cekTagihanJatuhTempo() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tagihan = ss.getSheetByName(CONFIG.SHEETS.TAGIHAN);
  if (!tagihan || tagihan.getLastRow() <= 1) return;

  var data = tagihan.getDataRange().getValues();
  var now = new Date();
  var besok = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  var pesan = [];

  for (var i = 1; i < data.length; i++) {
    var tgl = new Date(data[i][6]);
    var status = data[i][5];
    if (status !== 'Lunas') {
      var tglJatuh = Utilities.formatDate(tgl, 'Asia/Jakarta', 'yyyy-MM-dd');
      var tglBesok = Utilities.formatDate(besok, 'Asia/Jakarta', 'yyyy-MM-dd');
      if (tglJatuh === tglBesok) {
        pesan.push('BESOK: Invoice ' + data[i][2] + ' - ' + data[i][3] + ' (Rp' + data[i][4].toLocaleString('id-ID') + ')');
      }
    }
  }

  if (pesan.length > 0) {
    var body = 'TAGIHAN JATUH TEMPO BESOK:\n\n' + pesan.join('\n') + '\n\n---\nManajemen Kantor Hukum';
    MailApp.sendEmail(Session.getActiveUser().getEmail(), 'Tagihan Jatuh Tempo', body);
  }
}

// ============================================================
// 17. LAPORAN BULANAN
// ============================================================
function buatLaporanBulanan() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var keuangan = ss.getSheetByName(CONFIG.SHEETS.KEUANGAN);
  var kasus = ss.getSheetByName(CONFIG.SHEETS.KASUS);

  var bulanIni = new Date().getMonth();
  var tahunIni = new Date().getFullYear();

  var totalMasuk = 0, totalKeluar = 0;
  if (keuangan && keuangan.getLastRow() > 1) {
    var dataK = keuangan.getDataRange().getValues();
    for (var i = 1; i < dataK.length; i++) {
      var tgl = new Date(dataK[i][6]);
      if (tgl.getMonth() === bulanIni && tgl.getFullYear() === tahunIni) {
        if (dataK[i][2] === 'Masuk') totalMasuk += dataK[i][4];
        else totalKeluar += dataK[i][4];
      }
    }
  }

  var totalKasus = 0, kasusBaru = 0, kasusSelesai = 0;
  if (kasus && kasus.getLastRow() > 1) {
    var dataKs = kasus.getDataRange().getValues();
    for (var i = 1; i < dataKs.length; i++) {
      var tgl = new Date(dataKs[i][5]);
      if (tgl.getMonth() === bulanIni && tgl.getFullYear() === tahunIni) kasusBaru++;
      if (dataKs[i][4] === 'Selesai' || dataKs[i][4] === 'Putusan') kasusSelesai++;
      totalKasus++;
    }
  }

  var laporan = 'LAPORAN BULANAN - ' + NAMA_BULAN[bulanIni] + ' ' + tahunIni + '\n';
  laporan += '========================================\n\n';
  laporan += 'KEUANGAN:\n';
  laporan += '- Pemasukan: Rp' + totalMasuk.toLocaleString('id-ID') + '\n';
  laporan += '- Pengeluaran: Rp' + totalKeluar.toLocaleString('id-ID') + '\n';
  laporan += '- Laba: Rp' + (totalMasuk - totalKeluar).toLocaleString('id-ID') + '\n\n';
  laporan += 'KASUS:\n';
  laporan += '- Total Aktif: ' + totalKasus + '\n';
  laporan += '- Baru Bulan Ini: ' + kasusBaru + '\n';
  laporan += '- Selesai: ' + kasusSelesai + '\n';

  MailApp.sendEmail(Session.getActiveUser().getEmail(), 'Laporan Bulanan - ' + NAMA_BULAN[bulanIni], laporan);
  return laporan;
}

// ============================================================
// 18. SETUP ADMIN SHEET
// ============================================================
function setupAdminSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.ADMIN);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEETS.ADMIN);
  }
  var headers = ['Username', 'Password', 'Nama Lengkap', 'Role', 'Terakhir Login'];
  var existingHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  if (existingHeaders[0] !== 'Username') {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1a5276').setFontColor('white');
    sheet.setFrozenRows(1);
    // Default admin account
    sheet.appendRow(['admin', 'admin123', 'Administrator', 'admin', '']);
  }
}

// ============================================================
// 19. VERIFY LOGIN
// ============================================================
function verifyLogin(username, password) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.ADMIN);
  if (!sheet) {
    setupAdminSheet();
    sheet = ss.getSheetByName(CONFIG.SHEETS.ADMIN);
  }
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === username && data[i][1] === password) {
      // Update last login
      sheet.getRange(i + 1, 5).setValue(new Date());
      return {
        success: true,
        message: 'Login berhasil',
        nama: data[i][2],
        role: data[i][3]
      };
    }
  }
  return { success: false, message: 'Username atau password salah' };
}

// ============================================================
// 19b. CHANGE PASSWORD
// ============================================================
function changePassword(username, oldPassword, newPassword) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.ADMIN);
  if (!sheet) return { success: false, message: 'Sheet Admin tidak ditemukan' };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === username && data[i][1] === oldPassword) {
      sheet.getRange(i + 1, 2).setValue(newPassword);
      return { success: true, message: 'Password berhasil diganti' };
    }
  }
  return { success: false, message: 'Username atau password lama salah' };
}

// ============================================================
// 20. WEB APP - doGet (via URL params - no CORS)
// ============================================================
function doGet(e) {
  var action = e.parameter.action;
  if (!action) return ContentService.createTextOutput('OK');
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result = { success: true, message: '' };
  try {
    switch (action) {
      case 'login':
        result = verifyLogin(e.parameter.username, e.parameter.password);
        break;
      case 'addKlien':
        var id = getLatestId(CONFIG.SHEETS.KLIEN, CONFIG.PREFIX.KLIEN);
        var d = JSON.parse(e.parameter.data);
        ss.getSheetByName(CONFIG.SHEETS.KLIEN).appendRow([id, d.nama, d.namaAyah, d.jenisKelamin, d.ktp, d.hp, d.email, d.tempatLahir, d.tglLahir, hitungUsia(d.tglLahir), d.pekerjaan, d.alamat, d.statusKawin, d.agama, d.pendidikan, d.penghasilan || 0, d.sumber, d.tglDaftar || new Date().toISOString().split('T')[0], d.keterangan]);
        result.id = id; result.message = 'Klien tersimpan';
        break;
      case 'addLawan':
        var id = getLatestId(CONFIG.SHEETS.LAWAN, CONFIG.PREFIX.LAWAN);
        var d = JSON.parse(e.parameter.data);
        ss.getSheetByName(CONFIG.SHEETS.LAWAN).appendRow([id, d.idKlien, d.nama, d.namaAyah, d.jenisKelamin, d.ktp, d.hp, d.tempatLahir, d.tglLahir, hitungUsia(d.tglLahir), d.pekerjaan, d.alamat, d.statusKawin, d.agama, d.penghasilan || 0, d.hubungan, d.keterangan]);
        result.id = id; result.message = 'Lawan tersimpan';
        break;
      case 'addKasus':
        var id = getLatestId(CONFIG.SHEETS.KASUS, CONFIG.PREFIX.KASUS);
        var d = JSON.parse(e.parameter.data);
        var bt = parseFloat(d.biayaTotal) || 0, bb = parseFloat(d.biayaBayar) || 0;
        ss.getSheetByName(CONFIG.SHEETS.KASUS).appendRow([id, d.idKlien, d.idLawan, d.tipeKasus, d.statusKasus, d.tglDaftar, d.noPerkara, d.statusPerkara, d.tahunPerkara, d.pengadilan, d.noRegister, d.hakimKetua, d.hakimAnggota, d.mediator, d.panitera, d.estimasiSelesai, bt, bb, bt - bb, d.keterangan]);
        result.id = id; result.message = 'Kasus tersimpan';
        break;
      case 'addKeuangan':
        var id = getLatestId(CONFIG.SHEETS.KEUANGAN, CONFIG.PREFIX.KEUANGAN);
        var d = JSON.parse(e.parameter.data);
        ss.getSheetByName(CONFIG.SHEETS.KEUANGAN).appendRow([id, d.idKasus, d.tipe, d.deskripsi, parseFloat(d.jumlah), d.metodeBayar, d.tanggal, d.keterangan]);
        result.id = id; result.message = 'Keuangan tersimpan';
        break;
      case 'addJadwal':
        var id = getLatestId(CONFIG.SHEETS.JADWAL, CONFIG.PREFIX.JADWAL);
        var d = JSON.parse(e.parameter.data);
        ss.getSheetByName(CONFIG.SHEETS.JADWAL).appendRow([id, d.idKasus, d.tipeJadwal, d.tanggal, d.waktu, d.lokasi, d.status, d.keterangan]);
        result.id = id; result.message = 'Jadwal tersimpan';
        break;
      case 'addDokumen':
        var id = getLatestId(CONFIG.SHEETS.DOKUMEN, CONFIG.PREFIX.DOKUMEN);
        var d = JSON.parse(e.parameter.data);
        ss.getSheetByName(CONFIG.SHEETS.DOKUMEN).appendRow([id, d.idKasus, d.namaDokumen, d.tipeDokumen, d.linkDrive, d.tglUpload, d.keterangan]);
        result.id = id; result.message = 'Dokumen tersimpan';
        break;
      case 'addTagihan':
        var id = getLatestId(CONFIG.SHEETS.TAGIHAN, CONFIG.PREFIX.TAGIHAN);
        var d = JSON.parse(e.parameter.data);
        ss.getSheetByName(CONFIG.SHEETS.TAGIHAN).appendRow([id, d.idKasus, d.noInvoice, d.item, parseFloat(d.jumlah), d.statusBayar, d.jatuhTempo, d.tglBayar, d.keterangan]);
        result.id = id; result.message = 'Tagihan tersimpan';
        break;
      case 'addCatatan':
        var id = getLatestId(CONFIG.SHEETS.CATATAN, CONFIG.PREFIX.CATATAN);
        var d = JSON.parse(e.parameter.data);
        ss.getSheetByName(CONFIG.SHEETS.CATATAN).appendRow([id, d.idKasus, d.tanggal, d.judul, d.isi, d.tipe, d.oleh]);
        result.id = id; result.message = 'Catatan tersimpan';
        break;
      case 'getData':
        var sheet = ss.getSheetByName(e.parameter.sheet);
        if (!sheet || sheet.getLastRow() <= 1) { result.data = []; break; }
        var allData = sheet.getDataRange().getValues();
        var headers = allData[0];
        var rows = [];
        for (var i = 1; i < allData.length; i++) {
          var row = {};
          for (var h = 0; h < headers.length; h++) { row[headers[h]] = allData[i][h]; }
          rows.push(row);
        }
        result.data = rows;
        break;
      default:
        result.success = false;
        result.message = 'Action tidak dikenali: ' + action;
    }
  } catch(err) {
    result.success = false;
    result.message = err.message;
  }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// 21. WEB APP - doPost
// ============================================================
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var result = { success: true, message: '' };

    switch (action) {
      case 'login':
        result = verifyLogin(data.username, data.password);
        break;

      case 'changePassword':
        result = changePassword(data.username, data.oldPassword, data.newPassword);
        break;

      case 'generateSuratKuasa':
        var r = generateSuratKuasa(data.idKlien, data.idLawan, data.idKasus);
        result = r;
        break;

      case 'generateDomisili':
        var r = generateDomisili(data.idKlien);
        result = r;
        break;

      case 'generateSuratECourt':
        var r = generateSuratECourt(data.idKlien, data.idKasus);
        result = r;
        break;

      case 'generateSemuaSurat':
        var r = generateSemuaSurat(data.idKlien, data.idLawan, data.idKasus);
        result.results = r;
        result.message = 'Semua surat berhasil digenerate';
        break;

      case 'generateInvoice':
        var r = generateInvoicePDF(data.idTagihan);
        result.link = r;
        result.message = 'Invoice berhasil digenerate';
        break;

      case 'addKlien':
        var id = getLatestId(CONFIG.SHEETS.KLIEN, CONFIG.PREFIX.KLIEN);
        var sheet = ss.getSheetByName(CONFIG.SHEETS.KLIEN);
        sheet.appendRow([
          id, data.nama, data.namaAyah, data.jenisKelamin, data.ktp, data.hp,
          data.email, data.tempatLahir, data.tglLahir, hitungUsia(data.tglLahir),
          data.pekerjaan, data.alamat, data.statusKawin, data.agama, data.pendidikan,
          data.penghasilan, data.sumber, data.tglDaftar, data.keterangan
        ]);
        result.id = id;
        result.message = 'Klien berhasil disimpan';
        break;

      case 'addLawan':
        var id = getLatestId(CONFIG.SHEETS.LAWAN, CONFIG.PREFIX.LAWAN);
        var sheet = ss.getSheetByName(CONFIG.SHEETS.LAWAN);
        sheet.appendRow([
          id, data.idKlien, data.nama, data.namaAyah, data.jenisKelamin,
          data.ktp, data.hp, data.tempatLahir, data.tglLahir, hitungUsia(data.tglLahir),
          data.pekerjaan, data.alamat, data.statusKawin, data.agama,
          data.penghasilan, data.hubungan, data.keterangan
        ]);
        result.id = id;
        result.message = 'Data lawan berhasil disimpan';
        break;

      case 'addKasus':
        var id = getLatestId(CONFIG.SHEETS.KASUS, CONFIG.PREFIX.KASUS);
        var sheet = ss.getSheetByName(CONFIG.SHEETS.KASUS);
        var biayaTotal = parseFloat(data.biayaTotal) || 0;
        var biayaBayar = parseFloat(data.biayaBayar) || 0;
        sheet.appendRow([
          id, data.idKlien, data.idLawan, data.tipeKasus,
          data.statusKasus, data.tglDaftar, data.noPerkara,
          data.statusPerkara, data.tahunPerkara, data.pengadilan,
          data.noRegister, data.hakimKetua, data.hakimAnggota,
          data.mediator, data.panitera, data.estimasiSelesai,
          biayaTotal, biayaBayar, biayaTotal - biayaBayar,
          data.keterangan
        ]);
        result.id = id;
        result.message = 'Kasus berhasil disimpan';
        break;

      case 'addKeuangan':
        var id = getLatestId(CONFIG.SHEETS.KEUANGAN, CONFIG.PREFIX.KEUANGAN);
        var sheet = ss.getSheetByName(CONFIG.SHEETS.KEUANGAN);
        sheet.appendRow([
          id, data.idKasus, data.tipe, data.deskripsi,
          parseFloat(data.jumlah), data.metodeBayar,
          data.tanggal, data.keterangan
        ]);
        result.id = id;
        result.message = 'Transaksi berhasil dicatat';
        updateSisaTagihan();
        break;

      case 'addJadwal':
        var id = getLatestId(CONFIG.SHEETS.JADWAL, CONFIG.PREFIX.JADWAL);
        var sheet = ss.getSheetByName(CONFIG.SHEETS.JADWAL);
        sheet.appendRow([
          id, data.idKasus, data.tipeJadwal, data.tanggal,
          data.waktu, data.lokasi, data.status, data.keterangan
        ]);
        result.id = id;
        result.message = 'Jadwal berhasil dicatat';
        break;

      case 'addDokumen':
        var id = getLatestId(CONFIG.SHEETS.DOKUMEN, CONFIG.PREFIX.DOKUMEN);
        var sheet = ss.getSheetByName(CONFIG.SHEETS.DOKUMEN);
        sheet.appendRow([
          id, data.idKasus, data.namaDokumen, data.tipeDokumen,
          data.linkDrive, data.tglUpload, data.keterangan
        ]);
        result.id = id;
        result.message = 'Dokumen berhasil dicatat';
        break;

      case 'addTagihan':
        var id = getLatestId(CONFIG.SHEETS.TAGIHAN, CONFIG.PREFIX.TAGIHAN);
        var sheet = ss.getSheetByName(CONFIG.SHEETS.TAGIHAN);
        sheet.appendRow([
          id, data.idKasus, data.noInvoice, data.item,
          parseFloat(data.jumlah), data.statusBayar,
          data.jatuhTempo, data.tglBayar, data.keterangan
        ]);
        result.id = id;
        result.message = 'Tagihan berhasil dicatat';
        break;

      case 'addCatatan':
        var id = getLatestId(CONFIG.SHEETS.CATATAN, CONFIG.PREFIX.CATATAN);
        var sheet = ss.getSheetByName(CONFIG.SHEETS.CATATAN);
        sheet.appendRow([
          id, data.idKasus, data.tanggal, data.judul,
          data.isi, data.tipe, data.oleh
        ]);
        result.id = id;
        result.message = 'Catatan berhasil dicatat';
        break;

      default:
        result.success = false;
        result.message = 'Action tidak dikenali: ' + action;
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
// 19. MENU CUSTOM
// ============================================================
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Manajemen Hukum')
    .addItem('Setup Semua Sheet', 'setupSemuaSheet')
    .addItem('Setup Admin Sheet', 'setupAdminSheet')
    .addItem('MIGRATE Headers (Jalankan 1x)', 'migrateHeaders')
    .addItem('Refresh Dashboard', 'setupDashboard')
    .addItem('Update Sisa Tagihan', 'updateSisaTagihan')
    .addSeparator()
    .addItem('Cek Jadwal Besok', 'cekJadwalMendekat')
    .addItem('Cek Tagihan Jatuh Tempo', 'cekTagihanJatuhTempo')
    .addItem('Buat Laporan Bulanan', 'buatLaporanBulanan')
    .addSeparator()
    .addItem('Generate Semua Surat (pilih ID)', 'generateSemuaSuratFromSheet')
    .addItem('Generate Invoice (pilih ID)', 'generateInvoiceFromSheet')
    .addSeparator()
    .addItem('Lihat Ringkasan', 'lihatRingkasan')
    .addToUi();
}

// ============================================================
// 20. GENERATE DARI MENU SPREADSHEET
// ============================================================
function generateSemuaSuratFromSheet() {
  var ui = SpreadsheetApp.getUi();
  var idKlien = ui.prompt('Generate Semua Surat', 'Masukkan ID Klien (KL-001):', ui.ButtonSet.OK_CANCEL);
  if (idKlien.getSelectedButton() !== ui.Button.OK) return;

  var idLawan = ui.prompt('Generate Semua Surat', 'Masukkan ID Lawan (LW-001):', ui.ButtonSet.OK_CANCEL);
  if (idLawan.getSelectedButton() !== ui.Button.OK) return;

  var idKasus = ui.prompt('Generate Semua Surat', 'Masukkan ID Kasus (KKS-001):', ui.ButtonSet.OK_CANCEL);
  if (idKasus.getSelectedButton() !== ui.Button.OK) return;

  var results = generateSemuaSurat(idKlien.getResponseText(), idLawan.getResponseText(), idKasus.getResponseText());

  var msg = 'SURAT BERHASIL DIGENERATE!\n\n';
  if (results.suratKuasa.success) msg += 'Surat Kuasa: ' + results.suratKuasa.link + '\n';
  if (results.domisili.success) msg += 'Surat Domisili: ' + results.domisili.link + '\n';
  if (results.eCourt.success) msg += 'Surat E-Court: ' + results.eCourt.link + '\n';

  ui.alert('Selesai!', msg, ui.ButtonSet.OK);
}

function generateInvoiceFromSheet() {
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt('Generate Invoice', 'Masukkan ID Tagihan (TG-001):', ui.ButtonSet.OK_CANCEL);
  if (result.getSelectedButton() === ui.Button.OK) {
    var link = generateInvoicePDF(result.getResponseText());
    ui.alert('Invoice selesai!', 'Link: ' + link, ui.ButtonSet.OK);
  }
}

// ============================================================
// 21. RINGKASAN CEPAT
// ============================================================
function lihatRingkasan() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var kasus = ss.getSheetByName(CONFIG.SHEETS.KASUS);
  var keuangan = ss.getSheetByName(CONFIG.SHEETS.KEUANGAN);
  var jadwal = ss.getSheetByName(CONFIG.SHEETS.JADWAL);
  var tagihan = ss.getSheetByName(CONFIG.SHEETS.TAGIHAN);

  var msg = '=== RINGKASAN ===\n\n';

  if (kasus && kasus.getLastRow() > 1) {
    msg += 'Kasus Aktif: ' + (kasus.getLastRow() - 1) + '\n';
  } else {
    msg += 'Kasus: 0\n';
  }

  if (keuangan && keuangan.getLastRow() > 1) {
    var dataK = keuangan.getDataRange().getValues();
    var bulanIni = new Date().getMonth();
    var tahunIni = new Date().getFullYear();
    var masuk = 0;
    for (var i = 1; i < dataK.length; i++) {
      var tgl = new Date(dataK[i][6]);
      if (tgl.getMonth() === bulanIni && tgl.getFullYear() === tahunIni && dataK[i][2] === 'Masuk') {
        masuk += dataK[i][4];
      }
    }
    msg += 'Pemasukan Bulan Ini: Rp' + masuk.toLocaleString('id-ID') + '\n';
  }

  if (jadwal && jadwal.getLastRow() > 1) {
    var dataJ = jadwal.getDataRange().getValues();
    var now = new Date();
    var mingguDepan = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    var jml = 0;
    for (var i = 1; i < dataJ.length; i++) {
      var tgl = new Date(dataJ[i][3]);
      if (tgl >= now && tgl <= mingguDepan) jml++;
    }
    msg += 'Jadwal 7 Hari ke Depan: ' + jml + '\n';
  }

  if (tagihan && tagihan.getLastRow() > 1) {
    var dataT = tagihan.getDataRange().getValues();
    var belumBayar = 0;
    for (var i = 1; i < dataT.length; i++) {
      if (dataT[i][5] !== 'Lunas') belumBayar++;
    }
    msg += 'Tagihan Belum Lunas: ' + belumBayar + '\n';
  }

  SpreadsheetApp.getUi().alert(msg);
}
