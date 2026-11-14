# SkorKita — ESPN Ramai Edition

Kode dasar mempertahankan desain Full ESPN, dengan perubahan:
- 14 hari hasil sebelumnya + 45 hari jadwal ke depan
- Fallback ke scoreboard default ESPN jika suatu liga kosong pada rentang tanggal
- Memuat multi-liga tanpa membuang jadwal yang lebih dari 17 hari
- Refresh data selama halaman aktif tiap 60 detik (pertimbangkan beban API pada traffic tinggi)
- Pesan kesalahan API kini lebih terperinci

## GitHub + Netlify
Ganti file dalam folder SkorKita_ESPN_Starter di repository GitHub dengan isi ZIP ini.
Folder harus berisi index.html, netlify.toml, skorkita-logo.svg, dan netlify/functions/espn.js.
Jangan menaruh ZIP utuh sebagai satu file.
Di Netlify, jika Base directory kosong: Publish directory = SkorKita_ESPN_Starter; Functions directory = SkorKita_ESPN_Starter/netlify/functions.
Tes endpoint: /.netlify/functions/espn?league=eng.1&path=scoreboard
Catatan: Tidak semua liga tersedia di ESPN, dan jeda kompetisi bisa menyebabkan tanggal tertentu kosong. Penggunaan endpoint ESPN untuk produksi perlu meninjau ketentuan dan keandalannya.
