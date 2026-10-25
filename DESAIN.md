# TEMPLATE 4: portofolio bergaya Davin (video dpi1n), isi CV Hafizah

Dibuat 2026-10-25 atas permintaan "langsung kerjakan" setelah analisis video `Downloads/dpi1n_video_no_watermark.mp4` (portofolio Davin Yoga Ardiyansyah). Pemilik melewati tanya-jawab, jadi semua keputusan di bawah adalah **pilihan saya** dan boleh diubah.

## Tujuan
Template portofolio berstruktur seperti milik Davin (sistem, bukan salinan visual/teks): Next.js App Router, konten terpusat di satu file data, halaman detail per pengalaman, SEO lengkap, layar loading, progress scroll, transisi halaman, kartu ID bergantung yang bisa diseret. Isi = CV Hafizah (sama seperti TEMPLATE 2/3), ID/EN.

## Dari analisis video (terbaca) → keputusan
| Di video | Di TEMPLATE 4 |
|---|---|
| Next.js App Router + TypeScript + Tailwind + Framer Motion | sama |
| `lib/data.ts` + `types.ts` + `utils.ts` | `lib/content.ts` (data ID/EN), `lib/types.ts`, `lib/utils.ts` |
| Hero: kartu ID 3D di tali (dugaan: three.js + fisika) | **Kartu ID 2D** dengan fisika ayunan Framer Motion (ringan di HP) |
| LoadingScreen, ScrollProgress, CustomCursor, PageTransition | semua ada; kursor khusus hanya di perangkat dengan mouse |
| Projects + halaman detail `projects/[slug]` (Overview, Problem, Features, Stack, Process, Challenges, Result) | Pengalaman magang + `pengalaman/[slug]` berisi hanya yang ada di CV (peran, instansi, periode, kegiatan); **tidak mengarang** Problem/Challenges/Result |
| Filter chip pada Skills | Filter chip kategori pada Pengalaman (Rumah Sakit, Apotek, Puskesmas, Regulatori, Industri, Akademik; klasifikasi dari nama instansi, pilihan saya) |
| Journey Timeline | Timeline organisasi |
| Certificates grid + modal | sama; foto sertifikat asli belum ada → placeholder |
| Form kontak (simulasi di sumbernya) | Form membuka `mailto:` berisi pesan (bukan simulasi palsu) |
| SEO: metadata, OG, sitemap.ts, robots.ts, not-found | sama |

## Bukan tujuan / anti-tujuan
- Bukan menyalin teks, foto, warna persis, atau kode Davin. Hanya arsitektur dan jenis fitur.
- Tidak menambah tombol Download CV (menerbitkan PDF CV yang kontaknya disamarkan adalah keputusan pemilik).
- Tidak mengarang isi CV. Email dan LinkedIn memakai data TEMPLATE 2 (belum diverifikasi pemilik).
- Tidak deploy ke Vercel dan tidak push ke GitHub tanpa izin.

## Batasan
- Folder: `TEMPLATE/TEMPLATE 4/` (berdiri sendiri, `npm install` lalu `npm run dev`).
- Hormati `prefers-reduced-motion` untuk gerak berlebih (loading, kursor, ayunan idle).
- Nyaman di 360 px; tanpa scroll horizontal.
- URL situs lewat `NEXT_PUBLIC_SITE_URL` (default placeholder lokal) untuk metadata, sitemap, robots.

## Diserahkan ke pembuat
Palet detail, ukuran/jarak, teks mikro (tombol, label), urutan bagian, detail animasi.
