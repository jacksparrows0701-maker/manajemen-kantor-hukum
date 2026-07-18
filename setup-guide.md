# Manajemen Kantor Hukum - Google Sheets

Program manajemen untuk kantor hukum solo practitioner.
Mengelola kasus, klien, keuangan, jadwal, dan dokumen dalam satu Google Sheets.

## Cara Setup

### Langkah 1: Buat Google Sheets Baru
1. Buka https://sheets.google.com
2. Klik **Blank spreadsheet**
3. Beri nama: **Manajemen Kantor Hukum**

### Langkah 2: Buat 6 Sheet (Tab)
Buat 6 sheet dengan nama berikut:
1. **Dashboard**
2. **Data Kasus**
3. **Data Klien**
4. **Keuangan**
5. **Jadwal**
6. **Dokumen**

### Langkah 3: Isi Kolom Setiap Sheet

#### Sheet 1: Data Kasus
| Kolom | Isi |
|-------|-----|
| A: ID Kasus | KKS-001, KKS-002, dst |
| B: Nama Klien | Nama lengkap |
| C: No. HP | 08xxx |
| D: Tipe Kasus | Cerai Gugat / Cerai Talak / Waris / Isbat Nikah / Hak Asuh Anak / Harta Gono-Gini |
| E: Status | Baru / Dalam Proses / Sidang / Putusan / Selesai |
| F: Tanggal Daftar | 2026-07-17 |
| G: Estimasi Selesai | 2026-10-17 |
| H: Pengadilan | PA Bandung / PA Cimahi / PA Soreang |
| I: No. Perkara | Nomor perkara |
| J: Biaya Total | Rp0 |
| K: Biaya Terbayar | Rp0 |
| L: Sisa Tagihan | =J2-K2 |
| M: Keterangan | Catatan tambahan |

#### Sheet 2: Data Klien
| Kolom | Isi |
|-------|-----|
| A: ID Klien | KL-001, KL-002, dst |
| B: Nama Lengkap | Nama klien |
| C: No. HP | 08xxx |
| D: Email | email@gmail.com |
| E: Alamat | Alamat lengkap |
| F: Sumber Klien | Google / WhatsApp / Referensi / Media Sosial |
| G: Tanggal Daftar | 2026-07-17 |
| H: Keterangan | Catatan |

#### Sheet 3: Keuangan
| Kolom | Isi |
|-------|-----|
| A: ID Transaksi | TR-001, TR-002, dst |
| B: Tanggal | 2026-07-17 |
| C: Tipe | Masuk / Keluar |
| D: Deskripsi | Biaya pendaftaran / Jasa pengacara / Transport, dll |
| E: Jumlah | Rp500.000 |
| F: ID Kasus Terkait | KKS-001 |
| G: Metode Bayar | Tunai / Transfer / QRIS |
| Keterangan | Catatan |

#### Sheet 4: Jadwal
| Kolom | Isi |
|-------|-----|
| A: ID Jadwal | JD-001, JD-002, dst |
| B: Tanggal | 2026-07-20 |
| C: Waktu | 09:00 |
| D: Tipe | Sidang / Meeting / Konsultasi / Deadline |
| E: Kasus Terkait | KKS-001 |
| F: Klien | Nama klien |
| G: Lokasi | PA Bandung / Kantor / Online |
| H: Status | Terjadwal / Selesai / Dibatalkan |
| I: Keterangan | Catatan |

#### Sheet 5: Dokumen
| Kolom | Isi |
|-------|-----|
| A: ID Dokumen | DK-001, DK-002, dst |
| B: Kasus Terkait | KKS-001 |
| C: Nama Dokumen | Surat Nikah / KTP / KK / Surat Gugatan |
| D: Status | Belum / Dalam Proses / Sudah |
| E: Deadline | 2026-07-20 |
| F: Keterangan | Catatan |

#### Sheet 6: Dashboard
Dashboard akan diisi otomatis oleh Apps Script.

### Langkah 4: Setup Google Forms
1. Buka https://forms.google.com
2. Buat form baru: **Form Klien Baru**
3. Tambahkan field:
   - Nama Lengkap (Text)
   - No. HP (Text)
   - Email (Text)
   - Alamat (Paragraph)
   - Tipe Kasus (Dropdown: Cerai Gugat, Cerai Talak, Waris, Isbat Nikah, Hak Asuh Anak, Harta Gono-Gini)
   - Keterangan (Paragraph)
4. Klik **Settings** > **Responses** > **Select response destination** > Pilih spreadsheet Manajemen Kantor Hukum

### Langkah 5: Install Apps Script
1. Buka spreadsheet Manajemen Kantor Hukum
2. Klik **Extensions** > **Apps Script**
3. Hapus kode default, copy-paste kode dari file `apps-script.js`
4. Klik **Save**
5. Jalankan fungsi `setupDashboard()` pertama kali

## File
- `apps-script.js` — Kode otomasi (dashboard, notifikasi, form)
- `setup-guide.md` — Dokumentasi lengkap

## Fitur
- Dashboard otomatis (ringkasan kasus, keuangan)
- Form input klien baru via Google Forms
- Notifikasi jadwal sidang mendekat
- Laporan bulanan otomatis
- Tracking dokumen per kasus
