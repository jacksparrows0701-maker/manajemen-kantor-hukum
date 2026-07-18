# Panduan Deploy - Manajemen Kantor Hukum

## Langkah 1: Buat Google Sheets

1. Buka **https://sheets.google.com**
2. Klik **+ Blank spreadsheet**
3. Rename: **Manajemen Kantor Hukum**
4. Catat URL spreadsheet (nanti dibutuhkan)

## Langkah 2: Install Apps Script

1. Di spreadsheet, klik **Ekstensi** → **Apps Script**
2. Hapus semua kode yang ada
3. Buka file `apps-script.js`
4. Copy **SEMUA ISI**, paste ke editor Apps Script
5. Klik **Save** (icon disk)
6. Beri nama: **Manajemen Kantor Hukum**

## Langkah 3: Setup Sheet

1. Di Apps Script editor, pilih fungsi **setupSemuaSheet**
2. Klik **Run** (icon play)
3. Jika muncul izin, klik **Review Permissions**
4. Pilih akun Google
5. Klik **Advanced** → **Go to Manajemen Kantor Hukum (unsafe)**
6. Klik **Allow**
7. Kembali ke spreadsheet — 8 sheet sudah terisi header

## Langkah 4: Deploy sebagai Web App

1. Di Apps Script editor, klik **Deploy** → **New deployment**
2. Klik ikon gear → **Web app**
3. Isi:
   - **Description**: Manajemen Kantor Hukum API
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Klik **Deploy**
5. Copy **Web app URL** (bentuk: `https://script.google.com/macros/s/xxx/exec`)
6. **SIMPAN URL INI** — akan dimasukkan ke semua form HTML

## Langkah 5: Hubungkan Form ke Web App

Untuk setiap file form HTML (`form-klien.html`, `form-lawan.html`, dll):

1. Buka file dengan text editor (Notepad, VS Code, dll)
2. Cari baris: `var WEB_APP_URL = 'PASTE_WEB_APP_URL_DISINI';`
3. Ganti dengan URL Web App yang sudah di-copy
4. Simpan

Contoh:
```javascript
var WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxxx.../exec';
```

## Langkah 6: Buka Form

### Cara 1: Buka langsung di browser
- Buka file `index.html` di browser
- Klik menu form yang diinginkan

### Cara 2: Deploy ke GitHub Pages (Opsional)
1. Push semua file HTML ke repository GitHub
2. Aktifkan GitHub Pages
3. Buka dari HP/laptop mana saja

## Langkah 7: Setup Trigger Otomatis (Notifikasi Email)

1. Di Apps Script editor, klik **Triggers** (jam di sidebar)
2. Klik **+ Add Trigger**
3. Buat trigger berikut:

### Trigger 1: Cek Jadwal
- Function: **cekJadwalMendekat**
- Event source: **Time-driven**
- Type: **Day timer**
- Time: **07:00 to 08:00**

### Trigger 2: Cek Tagihan
- Function: **cekTagihanJatuhTempo**
- Event source: **Time-driven**
- Type: **Day timer**
- Time: **07:00 to 08:00**

### Trigger 3: Update Tagihan
- Function: **updateSisaTagihan**
- Event source: **Time-driven**
- Type: **Week timer**
- Day: **Every Monday**
- Time: **07:00 to 08:00**

## Selesai!

Sekarang Anda bisa:
- Buka form dari HP/laptop untuk input data
- Data otomatis masuk Google Sheets
- Dashboard otomatis update
- Notifikasi email otomatis

## Troubleshooting

### Error "Script not authorized"
- Jalankan **setupSemuaSheet()** ulang
- Berikan izin akses saat diminta

### Data tidak masuk spreadsheet
- Pastikan URL Web App sudah benar
- Pastikan URL Web App diakhiri dengan `/exec`

### Dashboard tidak update
- Klik **Manajemen Hukum** → **Refresh Dashboard**

### Notifikasi email tidak jalan
- Cek Triggers di Apps Script editor
- Pastikan trigger sudah aktif
