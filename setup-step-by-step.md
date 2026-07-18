# Setup Manual - Manajemen Kantor Hukum
## Ikuti Langkah-langkah Ini di Browser

### Langkah 1: Buat Google Sheets
1. Buka **https://sheets.google.com**
2. Klik **+ Blank spreadsheet**
3. Rename jadi: **Manajemen Kantor Hukum**

### Langkah 2: Rename Sheet (Tab)
Klik kanan pada tab sheet di bagian bawah, rename:
- Tab 1 → **Data Kasus**
- Tab 2 → **Data Klien**
- Tab 3 → **Keuangan**
- Tab 4 → **Jadwal**
- Tab 5 → **Dokumen**
- Tab 6 → **Dashboard** (buatan Apps Script nanti)

### Langkah 3: Import CSV ke Setiap Sheet
Untuk setiap sheet, lakukan:
1. Klik sheet yang mau diisi (misal: Data Kasus)
2. Klik **File** → **Import** → **Upload**
3. Pilih file CSV yang sesuai
4. Pilih **Replace current sheet**
5. Klik **Import data**

File CSV yang sudah dibuat:
- `template-kasus.csv` → import ke sheet "Data Kasus"
- `template-klien.csv` → import ke sheet "Data Klien"
- `template-keuangan.csv` → import ke sheet "Keuangan"
- `template-jadwal.csv` → import ke sheet "Jadwal"
- `template-dokumen.csv` → import ke sheet "Dokumen"

### Langkah 4: Install Apps Script
1. Klik **Extensions** → **Apps Script**
2. Hapus semua kode yang ada di editor
3. Buka file `apps-script.js` yang sudah dibuat
4. Copy semua isi file, paste ke editor Apps Script
5. Klik **Save** (icon disk)
6. Beri nama project: **Manajemen Kantor Hukum**

### Langkah 5: Jalankan Setup Pertama kali
1. Di Apps Script editor, klik dropdown fungsi
2. Pilih **setupDashboard**
3. Klik **Run** (icon play)
4. Jika muncul pop-up izin, klik **Review Permissions**
5. Pilih akun Google Anda
6. Klik **Advanced** → **Go to Manajemen Kantor Hukum (unsafe)**
7. Klik **Allow**
8. Kembali ke spreadsheet, sheet "Dashboard" sudah terisi otomatis

### Langkah 6: Setup Auto-Trigger (Notifikasi Harian)
1. Di Apps Script editor, klik jam di sidebar kiri (Triggers)
2. Klik **+ Add Trigger**
3. Pilih:
   - Function: **cekJadwalMendekat**
   - Event source: **Time-driven**
   - Type: **Day timer**
   - Time: **07:00**
4. Klik **Save**

### Langkah 7: Buat Google Forms (Input Klien)
1. Buka **https://forms.google.com**
2. Klik **Blank form**
3. Buat form dengan field:
   - **Nama Lengkap** (Short answer, required)
   - **No. HP** (Short answer, required)
   - **Email** (Short answer)
   - **Alamat** (Paragraph)
   - **Tipe Kasus** (Dropdown: Cerai Gugat, Cerai Talak, Waris, Isbat Nikah, Hak Asuh Anak, Harta Gono-Gini)
   - **Keterangan** (Paragraph)
4. Klik **Settings** (icon gear)
5. Tab **Responses** → **Select response destination** → **Select existing spreadsheet** → pilih "Manajemen Kantor Hukum"
6. Klik **Select**

### Langkah 8: Buat Trigger Form
1. Kembali ke Apps Script editor
2. Klik **Triggers** (jam di sidebar)
3. Klik **+ Add Trigger**
4. Pilih:
   - Function: **onFormSubmit**
   - Event source: **From form**
   - Event type: **On form submit**
5. Klik **Save**

### Selesai!
Sekarang Anda bisa:
- Buka Google Forms untuk input klien baru → otomatis masuk sheet
- Buka Google Sheets untuk lihat dashboard
- Cek menu "Manajemen Hukum" di menu bar spreadsheet
- Notifikasi email otomatis untuk jadwal sidang
