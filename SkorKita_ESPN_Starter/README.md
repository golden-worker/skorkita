# SkorKita FIX DATA V2

Masalah yang diperbaiki:
- Versi lama memanggil rentang 59 hari dulu, lalu hanya fallback bila hasilnya kosong; bila server melempar HTTP error fallback dilewati.
- V2 mengambil scoreboard default terlebih dahulu (seperti JSON yang sudah berhasil Anda buka).
- Untuk 10 liga utama menambah range -7/+21 hari; error range tak menghapus hasil default.
- Menampilkan status V2 dan jumlah liga berhasil di kanan bawah sehingga bisa memastikan versi yang deploy.
- Featured match mengutamakan LIVE, jadwal dekat, lalu hasil terbaru.
- Mengurangi concurrency menjadi 4.

### Upload ke repo GitHub
Di repository Anda, buka folder SkorKita_ESPN_Starter lalu **ganti `index.html` dengan `index.html` dalam ZIP ini**. Folder Netlify Functions dan konfigurasi tidak perlu diubah karena endpoint sudah berhasil memberi JSON. Commit lalu pastikan deploy Netlify Published. Refresh paksa halaman.

**Verifikasi wajib**: di pojok kanan bawah harus muncul `V2`. Jika tidak ada, halaman yang dibuka masih versi sebelumnya. Jika V2 terlihat tetapi kosong, kirim teks status dan Console error.

Endpoint ESPN yang dipakai adalah tidak resmi; tidak ada jaminan cakupan liga dan ketersediaan layanan.
