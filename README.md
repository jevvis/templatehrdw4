# TEMPLATE 4: portofolio Next.js (isi CV Hafizah, ID/EN)

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion. Strukturnya terinspirasi sistem portofolio di video referensi (konten terpusat di satu file, halaman detail per pengalaman, SEO lengkap), tanpa menyalin teks, foto, atau kodenya.

## Menjalankan
```bash
npm install
npm run dev        # http://localhost:3000   (tambahkan ?lang=en untuk bahasa Inggris)
npm run build && npm run start
npm run cek        # periksa data: paritas ID/EN, slug, gambar
node cek/cek-kode.mjs   # penjaga perbaikan hasil review (opsional)
```
`?loading=1` menampilkan lagi layar loading (biasanya hanya sekali per sesi).

## Lanyard 3D
`components/ui/Lanyard3D.tsx`: three.js + `@react-three/fiber` + `@react-three/drei` + `@react-three/rapier` (mesin fisika, WebAssembly) + `meshline` (pita). Struktur mengikuti proyek `3D_CARD` milik pemilik: `public/assets/lanyard/kartu.glb` (bagian `card`, `clip`, `clamp`) digantung pada rantai benda fisik bersendi tali, kartu menempel lewat sendi bola. Sisi depan kartu (foto, nama, IPK) dan tulisan pita digambar dari kode ke atlas tekstur; sisi belakang tetap motif asli model. Pemetaan UV: sisi depan = kotak kiri atlas (u 0-0,5, v 0-0,755), belakang = kotak kanan. Untuk memakai pita asli ("3D CARD"), ganti `drawBand` dengan `useTexture('/assets/lanyard/bandd.png')`. Paketnya dimuat lazy (sekitar 0,9 MB terkompresi) dan render berhenti saat keluar layar.
- `LanyardCard.tsx` memilih 3D bila WebGL tersedia dan perangkat memadai (memori ≥ 4 GB, CPU ≥ 4 inti); jika tidak, memakai `Lanyard2D.tsx`.
- `?lanyard=2d` / `?lanyard=3d` memaksa salah satunya.
- Pengguna dengan pengaturan "kurangi gerak" tetap mendapat 3D, tetapi tenang: rantai mulai lurus dan hanya bergerak saat diseret (`?motion=1` mengembalikan ayunan masuk).
- Atur gravitasi di `<Physics gravity>`, panjang tali di `ROPE`, lebar pita di `STRAP_W`, tulisan pita di `drawBand`.

## Fitur
Layar loading · progress scroll · kursor khusus (hanya perangkat dengan mouse) · navbar dengan scrollspy + menu HP · transisi halaman · hero dengan **lanyard 3D berfisika** (model `kartu.glb` milik pemilik: pita hitam bertulisan, kartu ID yang bisa diseret dan berayun karena gravitasi; cadangan 2D untuk perangkat tanpa WebGL/lemah) · statistik berhitung naik · filter kategori pengalaman · halaman detail `/pengalaman/[slug]` · timeline organisasi · sertifikat dengan modal · logo software · form kontak (membuka `mailto:`) · halaman 404 · `sitemap.xml` + `robots.txt` + metadata Open Graph.

## Struktur
```
app/            layout, page, template (transisi), pengalaman/[slug], sitemap, robots, not-found, globals.css
components/     layout/ (Navbar, Footer, LoadingScreen, ScrollProgress, CustomCursor)
                sections/ (Hero, About, Education, Experience, Organization, Certificates, Skills, Contact, ExperienceDetail)
                ui/ (LanyardCard, CertificateModal, SectionHeading, Reveal, Counter)  providers/ (LanguageProvider)
lib/            content.ts (SEMUA isi CV ID/EN), types.ts, strings.ts (teks antarmuka), utils.ts, meta.json (slug & kategori)
public/         assets/ (foto, sertifikat)  logos/ (Word, Excel, Canva)
```
Design token ada di `tailwind.config.ts` dan `app/globals.css` (variabel `--primary`, `--secondary`, `--accent`, dst).

## Yang perlu diganti sebelum publish
| Apa | Di mana |
|---|---|
| Alamat situs (sitemap, robots, Open Graph) | file `.env.local`: `NEXT_PUBLIC_SITE_URL=https://domain-kamu` |
| Isi CV, email, LinkedIn | `lib/content.ts` (email/LinkedIn belum diverifikasi, diambil dari TEMPLATE 2) |
| Foto sertifikat asli (BNSP, STR, Kompetensi) | `public/assets/sertifikat/cert-bnsp.jpg`, `cert-str.jpg`, `cert-kompetensi.jpg` (sekarang placeholder) |
| Gambar Open Graph (sekarang foto profil transparan) | `app/layout.tsx` → `openGraph.images` (sebaiknya 1200×630 berlatar solid) |
| Slug/kategori pengalaman baru | `lib/meta.json` (urutan sama dengan `internships` di `content.ts`) |
| Form kontak yang mengirim langsung dari situs | `components/sections/Contact.tsx` (sambungkan ke API route / Formspree / EmailJS) |

## Catatan
- Tombol Download CV sengaja tidak ada (menerbitkan PDF CV adalah keputusan pemilik).
- Kategori pengalaman (Rumah Sakit, Apotek, dst.) adalah klasifikasi dari nama instansi, bukan data CV.
- Berkas ini dan `DESAIN.md`, `RENCANA.md`, `PROGRES.md` adalah dokumentasi proses; boleh dihapus sebelum deploy.
