# Panduan Google Forms - Manajemen Kantor Hukum
## 4 Form untuk Input Data Otomatis

---

## FORM 1: DATA KLIEN BARU

### Buka: https://forms.google.com
1. Klik **+ Blank form**
2. Judul: **Data Klien Baru**
3. Deskripsi: **Form input data klien baru - Otomatis masuk sistem**

### Field yang Dibuat:

| # | Field | Tipe | Required | Opsi |
|---|-------|------|----------|------|
| 1 | Nama Lengkap | Short answer | ✓ | - |
| 2 | No. HP | Short answer | ✓ | - |
| 3 | Email | Short answer | - | - |
| 4 | Alamat | Paragraph | - | - |
| 5 | Tipe Kasus | Dropdown | ✓ | Cerai Gugat, Cerai Talak, Waris, Isbat Nikah, Hak Asuh Anak, Harta Gono-Gini |
| 6 | Sumber Klien | Dropdown | - | Google, Instagram, Facebook, Referensi, Iklan, Lainnya |
| 7 | Keterangan | Paragraph | - | - |

### Cara Membuat Field:
1. Klik **+** di sebelah kiri untuk tambah field baru
2. Pilih tipe field (Short answer / Paragraph / Dropdown)
3. Isi judul field
4. Toggle **Required** jika wajib diisi

### Setup ke Spreadsheet:
1. Klik **Settings** (⚙️) di atas
2. Tab **Responses**
3. Klik **Select response destination**
4. Pilih **Select existing spreadsheet**
5. Pilih **Manajemen Kantor Hukum**
6. Klik **Select**

### Copy Link Form:
1. Klik **Send** (ikon pesawat kertas)
2. Klik ikon link (🔗)
3. Copy link pendek
4. Simpan link ini untuk diakses saat ada klien baru

---

## FORM 2: DATA KASUS BARU

### Buka: https://forms.google.com
1. Klik **+ Blank form**
2. Judul: **Data Kasus Baru**
3. Deskripsi: **Form input kasus baru**

### Field yang Dibuat:

| # | Field | Tipe | Required | Opsi |
|---|-------|------|----------|------|
| 1 | Nama Klien | Short answer | ✓ | - |
| 2 | No. HP Klien | Short answer | ✓ | - |
| 3 | Tipe Kasus | Dropdown | ✓ | Cerai Gugat, Cerai Talak, Waris, Isbat Nikah, Hak Asuh Anak, Harta Gono-Gini |
| 4 | Pengadilan | Short answer | - | - |
| 5 | No. Perkara | Short answer | - | - |
| 6 | Estimasi Selesai | Date | - | - |
| 7 | Biaya Total | Short answer | - | - |
| 8 | Keterangan | Paragraph | - | - |

### Setup ke Spreadsheet:
1. Klik **Settings** → **Responses**
2. **Select response destination** → pilih **Manajemen Kantor Hukum**
3. Pilih **Create a new sheet** atau **Select existing** (pilih tab Data Kasus)

---

## FORM 3: INPUT KEUANGAN

### Buka: https://forms.google.com
1. Klik **+ Blank form**
2. Judul: **Input Keuangan**
3. Deskripsi: **Form input pemasukan/pengeluaran**

### Field yang Dibuat:

| # | Field | Tipe | Required | Opsi |
|---|-------|------|----------|------|
| 1 | Tipe | Dropdown | ✓ | Masuk, Keluar |
| 2 | Deskripsi | Short answer | ✓ | - |
| 3 | Jumlah | Short answer | ✓ | - |
| 4 | ID Kasus | Short answer | - | - |
| 5 | Metode Bayar | Dropdown | ✓ | Tunai, Transfer, Kartu Kredit, GoPay, OVO, Lainnya |
| 6 | Keterangan | Paragraph | - | - |

---

## FORM 4: JADWAL SIDANG/KONSULTASI

### Buka: https://forms.google.com
1. Klik **+ Blank form**
2. Judul: **Jadwal Sidang/Konsultasi**
3. Deskripsi: **Form input jadwal**

### Field yang Dibuat:

| # | Field | Tipe | Required | Opsi |
|---|-------|------|----------|------|
| 1 | Tipe Jadwal | Dropdown | ✓ | Sidang, Konsultasi, Mediasi, Meeting, Lainnya |
| 2 | Tanggal | Date | ✓ | - |
| 3 | Waktu | Short answer | ✓ | - |
| 4 | Nama Klien | Short answer | ✓ | - |
| 5 | Lokasi | Short answer | ✓ | - |
| 6 | ID Kasus | Short answer | - | - |
| 7 | Keterangan | Paragraph | - | - |

---

## SETELAH SEMUA FORM JADI

### Buat Link Pendek untuk Akses Cepat:
1. Buka **bit.ly** atau **tinyurl.com**
2. Paste link form
3. Buat link pendek (misal: bit.ly/form-klien)
4. Simpan di HP atau desktop

### Cara Pakai Sehari-hari:
- Klien baru → buka **Form Klien** → isi → submit
- Kasus baru → buka **Form Kasus** → isi → submit
- Bayar/Bayar kasus → buka **Form Keuangan** → isi → submit
- Jadwal sidang → buka **Form Jadwal** → isi → submit
- Data otomatis masuk Google Sheets

### Setup Trigger di Apps Script:
1. Buka spreadsheet → **Ekstensi** → **Apps Script**
2. Klik **Triggers** (jam di sidebar)
3. Klik **+ Add Trigger** untuk setiap form:
   - Function: **onFormSubmit**
   - Event source: **From form**
   - Event type: **On form submit**

---

## TIPS

### Untuk Akses Cepat dari HP:
1. Buka form di Chrome HP
2. Klik **⋮** (titik tiga) → **Add to Home Screen**
3. Form muncul sebagai icon di home screen HP
4. Tinggal klik icon, langsung isi form

### Untuk Share ke Staff:
1. Buka form
2. Klik **Send** → **Email** atau **Copy link**
3. Kirim link ke staff
4. Mereka bisa langsung isi dari HP masing-masing
