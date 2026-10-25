Task 1: scaffold+data selesai (cek OK)
Task 2-4: kode ditulis (kerangka, bagian, detail)
Task 2-5: complete — tsc bersih; next build OK (12 halaman statis: /, 6 detail, _not-found, sitemap, robots); cek-konten OK; server prod di 3014.
Uji browser: bagian lengkap; filter (Industri → 1 kartu); EN/ID; modal sertifikat (buka, panah, Esc); kartu ID diseret (miring + tali memanjang) lalu kembali saat dilepas; menu hamburger; tanpa elemen keluar layar di 375 & 320 px; /pengalaman/<slug> 200, slug ngawur 404 (halaman 404 khusus).
Catatan uji: browser otomatis tidak menggambar frame animasi sendiri, jadi animasi (exit AnimatePresence, pegas kartu) diverifikasi dengan memaksa frame lewat screenshot, bukan polling nilai.
Ruling: kartu ID 2D (Framer Motion), bukan three.js — alasan: ringan di HP; biaya jika salah: kurang "3D" dibanding sumber.
Ruling: tombol Download CV tidak dibuat — menerbitkan PDF CV (kontak disamarkan) adalah keputusan pemilik.
Ruling: sitemap/robots/OG memakai NEXT_PUBLIC_SITE_URL (default http://localhost:3000) — wajib diisi sebelum publish.
Final: review akhir oleh reviewer terpisah (opus). Perbaikan satu putaran (cek/cek-kode.mjs 9 RED → 9 GREEN; tsc bersih; next build 12 halaman OK):
Final: fixed kartu ID memblokir scroll vertikal di HP (Framer menimpa touch-action) — drag sumbu-x di layar sentuh; reduced-motion tanpa pantulan
Final: fixed gelar "Apoteker Klinis" tak didukung CV — jadi "Apoteker" / "Licensed Pharmacist" (headline CV tetap memuat "Aspiring Clinical Pharmacist")
Final: fixed layar loading menutup selamanya bila JS gagal — noscript + jaring pengaman CSS 6 detik
Final: fixed menu di halaman detail memuat ulang halaman dan memunculkan loader — next/link (terbukti: penanda halaman bertahan, loader tidak muncul)
Final: fixed modal sertifikat: fokus terkunci (Tab/Shift+Tab terbukti), tombol navigasi bisa membungkus (320px)
Final: fixed judul Keahlian janggal, tahun footer (suppressHydrationWarning), OG halaman detail (siteName/locale)
Final: minor (deferred): aria-label menu/navigasi hanya berbahasa Indonesia
Final: minor (deferred): loader role=status/aria-live mengumumkan persen tiap frame
Final: minor (deferred): menu HP tanpa Esc/fokus awal; tautan di belakang overlay masih bisa di-Tab
Final: minor (deferred): GPA tampil 0.00 di HTML server / tanpa JS; bahasa Inggris berkedip dari Indonesia tanpa loader
Final: minor (deferred): cincin kursor di belakang modal; kartu sertifikat sempat menampilkan ikon gambar rusak sebelum placeholder
Catatan: sentuh/geser kartu ID di HP dan efek 'pointer: coarse' belum diuji di HP sungguhan (hanya dari logika kode + sumber Framer).
Lanyard didesain ulang (permintaan pemilik, referensi: pita cetak 3D CARD + lanyard V dengan gesper hitam MEDLABSCI): dua pita V bercetak 'HAFIZAH • APOTEKER •', gesper hitam, pita utama mengikuti kartu, ujung pita hitam. cek-kode 10/10; tsc bersih; diuji seret + HP 375/320 tanpa overflow.
Lanyard 3D (permintaan pemilik: 'ganti versi 3d'): Lanyard3D.tsx — rantai 3 ruas bersendi tali + sendi bola ke kartu (Rapier), pita V dari meshline bertekstur cetak, gesper hitam, kartu dari RoundedBox + tekstur kanvas (foto, nama, IPK; sisi belakang), cahaya Environment+Lightformer (tanpa jaringan), render berhenti di luar layar. LanyardCard.tsx memilih 3D/2D; Lanyard2D.tsx cadangan.
Uji: tsc bersih; cek-kode 11/11; build OK (home 157 kB, paket 3D lazy ~0,9 MB gzip); di browser: 3D tampil (375/320 px, EN/ID tekstur ikut berganti), hover kartu -> kursor grab (raycast benar), dorongan fisik membuat kartu berayun dan pita melengkung, ?lanyard=2d memunculkan cadangan.
Temuan saat uji: pengguna 'kurangi gerak' awalnya dialihkan ke 2D — diganti mode tenang 3D. Pita meshline: lebar dalam satuan layar (STRAP_W 2.2 setara ~27% lebar kartu).
Ruling: seret dengan mouse/jari sungguhan belum bisa diuji otomatis (browser uji hanya menggambar frame saat screenshot, event sintetis tidak lolos raycast); diverifikasi lewat hover nyata (kursor grab) + dorongan fisik. Perlu dicoba manual di browser dan HP.
Ruling: mode cadangan 2D dipakai bila deviceMemory < 4 atau hardwareConcurrency < 4 atau tanpa WebGL — angka ambang pilihan saya.
Lanyard dari proyek pemilik (Downloads/3D_CARD-main): kartu.glb + bandd.png disalin ke public/assets/lanyard/. Bongkar GLB: node card/clip/clamp; UV depan u 0-0,5 v 0-0,755 (selaras x, v terbalik), belakang u 0,5-1 (cermin) -> atlas 1024x1024 digambar: motif asli + depan Hafizah (716x1000 dipetakan ke 510x769). Lanyard3D.tsx ditulis ulang mengikuti App.js sumber (rantai 3 ruas, lerp tali, kamera fov 25).
Temuan: lerp tali pada kode sumber (delta*kecepatan) > 1 saat jeda frame besar -> pita meluncur melintasi kartu; dibatasi (delta<=0,05, t<=1). Penjepit model menutupi kepala di foto -> foto diturunkan (84% tinggi area).
Uji: cek-kode 12/12, tsc bersih, build OK; 3D tampil di desktop/375/320, EN berganti, 2D cadangan, hover nyata -> grab.
Ruling: pita memakai teks 'HAFIZAH' (digambar), bukan '3D CARD' bawaan; bandd.png asli tetap disertakan. Biaya jika salah: ganti satu fungsi.
Ruling: sisi belakang kartu tetap motif kartu remi bawaan model (belum dilihat langsung di layar, hanya dari atlas).
