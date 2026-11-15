# SkorKita V3 — Urut Tanggal

Berbasis SkorKita FIX DATA V2 dengan koneksi ESPN yang sama.

- Kartu liga dan tabel Jadwal & Hasil diurutkan menurut kickoff kronologis (awal ke akhir), bukan status LIVE → mendatang → selesai.
- Hasil yang sudah lebih dari 48 jam tidak dimasukkan dalam kartu dan tabel utama, mengikuti aturan pada kode MASKERTOTO yang dikirim.
- Jam ditampilkan dalam WIB; pengurutan memakai timestamp ISO ESPN sehingga tidak bergeser lintas zona waktu.
- Jika kickoff sama, urutkan berdasarkan liga lalu ID pertandingan agar stabil.
- Hero unggulan masih mengikuti prioritas sebelumnya.
- Tanda status bawah: `V3 URUT`.

## Pasang
Ganti HANYA `index.html` di folder GitHub `SkorKita_ESPN_Starter`, commit, tunggu Published. Tidak perlu mengubah Functions maupun Build Settings. Perlu diuji pada Netlify.

Catatan: urutan bisa berbeda dari MASKERTOTO jika waktu pemuatan, kumpulan liga, rentang request, atau filter tidak sama persis.


## Logo resmi SkorKita V4
- `skorkita-logo-resmi.png`: logo shield berwarna biru-emas dengan latar transparan.
- `favicon.png` dan `apple-touch-icon.png`: ikon berbasis logo.
- `index.html` diubah hanya pada bagian branding dan ukuran header, tidak mengubah ESPN atau fungsi jadwal.
- Upload seluruh isi paket ini ke direktori repository GitHub `SkorKita_ESPN_Starter/`, mengganti file sama nama dan menambah 3 gambar PNG. Jangan menaruh folder pembungkus V4 di dalam direktori proyek.


## SkorKita Blue Black Edition
Tema dark gradasi biru-hitam. Featured Match menampilkan hingga 50 pertandingan dari data ESPN yang berhasil tersedia, navigasi panah dan slider otomatis. Jika jumlah laga tersedia kurang dari 50, angka ditampilkan sesuai data aktual; tidak membuat pertandingan palsu. File HTML kedua yang diberikan adalah kode halaman OneDrive, bukan tampilan referensi situs.

## Pembaruan: indikator API disembunyikan
Widget status API di sudut bawah telah dihapus dari halaman publik. Pencatatan kegagalan request tetap tersedia melalui console browser.
