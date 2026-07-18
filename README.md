# Manajemen Kantor Hukum

Sistem manajemen data untuk kantor hukum keluarga. Input data via form web, otomatis masuk Google Sheets.

## Fitur

- **8 Form Input** — Klien, Lawan, Kasus, Keuangan, Jadwal, Dokumen, Tagihan, Catatan
- **Dashboard Otomatis** — Ringkasan kasus, keuangan, jadwal, tagihan
- **Auto Numbering** — ID otomatis untuk semua data
- **Notifikasi Email** — Reminder jadwal & tagihan jatuh tempo
- **Laporan Bulanan** — Ringkasan otomatis via email
- **Akses Multi Device** — Buka dari HP/laptop mana saja

## File

| File | Fungsi |
|------|--------|
| `index.html` | Menu utama |
| `form-klien.html` | Input data klien |
| `form-lawan.html` | Input data lawan/psiak |
| `form-kasus.html` | Input data kasus |
| `form-keuangan.html` | Input transaksi keuangan |
| `form-jadwal.html` | Input jadwal sidang/konsultasi |
| `form-dokumen.html` | Upload dokumen |
| `form-tagihan.html` | Buat tagihan/invoice |
| `form-catatan.html` | Tulis catatan perkembangan |
| `apps-script.js` | Backend Google Apps Script |

## Setup

Lihat `panduan-deploy.md` untuk instruksi lengkap.

### Cepat:
1. Buat Google Sheets baru
2. Buka Apps Script, paste `apps-script.js`
3. Jalankan `setupSemuaSheet()`
4. Deploy sebagai Web App
5. Copy URL ke semua form HTML
6. Buka `index.html` di browser

## No. Perkara Format

```
1234/Pdt.G/2026/PA.Bdg
```
- 1234 = Nomor urut
- Pdt.G = Pidana Gugatan (Pdt.G = Gugatan, Pdt.P = Perlawanan)
- 2026 = Tahun
- PA.Bdg = Pengadilan Agama Bandung

## Status Perkara

1. Diajukan
2. Pemeriksaan
3. Sidang Pertama
4. Sidang Kedua
5. Sidang Ketiga
6. Putusan
7. Banding
8. Kasasi
9. Berkekuatan Hukum Tetap

## Teknologi

- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **Deployment**: GitHub Pages (opsional)
