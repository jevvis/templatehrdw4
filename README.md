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

## Fitur
Layar loading · progress scroll · kursor khusus (hanya perangkat dengan mouse) · navbar dengan scrollspy + menu HP · transisi halaman · hero dengan kartu ID bergantung yang bisa diseret (fisika pegas 2D) · statistik berhitung naik · filter kategori pengalaman · halaman detail `/pengalaman/[slug]` · timeline organisasi · sertifikat dengan modal · logo software · form kontak (membuka `mailto:`) · halaman 404 · `sitemap.xml` + `robots.txt` + metadata Open Graph.

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
