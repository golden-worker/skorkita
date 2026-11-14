# SkorKita Full — ESPN API

Versi rebranding dari kode HTML yang kamu berikan; menggunakan kartu pertandingan, logo klub, detail pertandingan, filter liga, skor langsung, dan statistik.

## Cara deploy
1. Upload ZIP ini menggunakan Netlify (pilih *Import project* dari repo bila ingin otomatis mengaktifkan Functions), atau deploy folder sumber lewat Netlify CLI (`netlify deploy --prod --dir . --functions netlify/functions`).
2. Pastikan Netlify mendeteksi `netlify/functions/espn.js` sebagai Function. Untuk upload manual via Netlify Drop, Functions biasanya **tidak** ikut terdeploy; gunakan Git atau CLI.
3. Tes URL `https://DOMAIN-ANDA.netlify.app/.netlify/functions/espn?league=eng.1&path=scoreboard`. Jika tampil JSON, koneksi backend berhasil.
4. Buka website dan tekan Perbarui Pertandingan.

## Catatan
- Tidak ada API key; endpoint ESPN ini bersifat publik tetapi tidak resmi, dapat berubah dan tidak ada jaminan izin penggunaan komersial.
- Kode mencoba rentang 2 hari ke belakang hingga 16 hari ke depan supaya jeda kompetisi tidak membuat tampilan kosong.
- Jika dibuka langsung sebagai file lokal, fungsi proxy tidak berjalan dan koneksi ESPN bisa mengalami CORS. Gunakan `netlify dev` untuk tes local end-to-end.
- Fitur prediksi adalah simulasi sederhana dari nama tim. Tidak akurat secara ilmiah, bukan AI dan bukan odds resmi.
- Branding MASKERTOTO, link promosi, widget Zendesk, dan skrip pengunci shortcut telah dihapus.
- Tidak ada pertandingan palsu yang dibuat sebagai fallback. Jika sumber gagal, tampil error.
