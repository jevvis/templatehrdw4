# TEMPLATE 4 Implementation Plan

> Dikerjakan inline (native). Spec: `DESAIN.md`. Bukan repo git → progres di `PROGRES.md`.

**Goal:** Portofolio Next.js bergaya Davin, isi CV Hafizah (ID/EN).
**Tech:** Next.js 14 (App Router), React 18, TypeScript, Tailwind 3, Framer Motion 11.

## Tugas
1. **Scaffold + data:** `package.json`, config, `lib/types.ts`, `lib/content.ts` (dibangkitkan dari `TEMPLATE 3/hasil/data.js`, bukan diketik ulang), `lib/utils.ts` (slug, kategori, varian animasi), aset ke `public/`. Cek: skrip `cek/cek-konten.mjs` (paritas ID/EN, slug unik, file gambar ada).
2. **Kerangka:** `app/layout.tsx` (metadata, font), `globals.css` (token), `LanguageProvider`, `LoadingScreen`, `ScrollProgress`, `CustomCursor`, `Navbar` (+menu HP, tombol bahasa), `template.tsx` (transisi), `Footer`, `not-found`, `sitemap`, `robots`.
3. **Bagian halaman:** Hero + `LanyardCard`, About, Education, Experience (filter chip + kartu → detail), Organization (timeline), Certificates (+modal), Skills (+logo software), Contact (mailto).
4. **Halaman detail:** `app/pengalaman/[slug]/page.tsx` (+`generateStaticParams`, `generateMetadata`), prev/next.
5. **Verifikasi:** `tsc --noEmit`, `next build`, jalankan dev, uji di browser (bagian ada, bahasa, filter, detail, modal, kartu ID, tanpa overflow 360 px), review akhir oleh reviewer terpisah, perbaiki temuan penting.
