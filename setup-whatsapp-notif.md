# Setup WhatsApp Notifikasi Sidang

## Langkah 1: Daftar Fonnte

1. Buka **https://fonnte.com**
2. Klik **Register** → isi email & password
3. Login → klik menu **Token** (di pojok kanan atas)
4. Copy **API Token** (contoh: `abc123xyz...`)

## Langkah 2: Connect WhatsApp

1. Buka WhatsApp di HP
2. Kirim pesan ke nomor yang tertera di halaman Fonnte
3. Pesan: **"connect"** (otomatis dari Fonnte)
4. Tunggu sampai ada balasan **"Connected"**

## Langkah 3: Isi API Key di Apps Script

1. Buka **script.google.com** → buka project Manajemen Kantor Hukum
2. Cari baris ini di `apps-script.js`:

```javascript
var WHATSAPP_CONFIG = {
  API_KEY: 'FONNTE_API_KEY_HERE',
  NOMOR_PENGACARA: '6285759977665'
};
```

3. Ganti `FONNTE_API_KEY_HERE` dengan API Token dari Fonnte
4. Ganti nomor WhatsApp jika perlu (format: `62xxx`)
5. Klik **Save** (Ctrl+S)

## Langkah 4: Setup Trigger Otomatis

1. Di Apps Script → klik menu **Run** → jalankan function **`setupTriggerNotif`**
2. Tunggu sampai selesai
3. Cek di menu **Triggers** (jam di pojok kiri) → harusnya ada trigger "cekJadwalDanKirimNotif" setiap hari jam 07:00

## Langkah 5: Test

1. Jalankan function **`testNotifWhatsApp`**
2. Cek HP → harusnya ada pesan masuk dari WhatsApp
3. Kalau berhasil, notifikasi sidang sudah aktif!

## Cara Kerja

Setiap hari jam 07:00 pagi, sistem otomatis:
- Cek sheet **Jadwal** untuk sidang yang 3 hari lagi, 1 hari lagi, atau hari ini
- Kirim pesan WhatsApp ke nomor pengacara

### Contoh Pesan:

```
📋 PENGINGAT SIDANG

🔴 HARI INI
📅 Tanggal: 19 Juli 2026
⏰ Waktu: 09:00
📍 Lokasi: PA Garut
⚖️ Kasus: Cerai Gugat
👤 Klien: Marwati
👤 Lawan: Agus Ramdan
📌 Status: Terjadwal

🏢 Mif Lawyer & Partners
```

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Pesan tidak masuk | Cek API Key sudah benar |
| "Unauthorized" | Token Fonnte expired → login ulang → copy token baru |
| Nomor salah | Pastikan format `62xxx` (bukan `08xxx`) |
| Tidak ada notif | Cek di Triggers, pastikan trigger sudah ada |
