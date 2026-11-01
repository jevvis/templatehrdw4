// Pemeriksa kode: menjaga perbaikan hasil review akhir agar tidak hilang. Jalankan: node cek/cek-kode.mjs
import fs from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'
const root = path.resolve(import.meta.dirname, '..')
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8')
let bad = 0
const ok = (n, c) => { console.log((c ? 'LULUS ' : 'GAGAL ') + n); if (!c) bad++ }

const strings = read('lib/strings.ts'), layout = read('app/layout.tsx'), lanyard = read('components/ui/Lanyard2D.tsx')
const loading = read('components/layout/LoadingScreen.tsx'), css = read('app/globals.css'), nav = read('components/layout/Navbar.tsx')
const modal = read('components/ui/CertificateModal.tsx'), skills = read('components/sections/Skills.tsx'), detail = read('app/pengalaman/[slug]/page.tsx')

ok('gelar mengikuti CV: role/card_role bukan "Klinis"/"Clinical Pharmacist"', !/(role|card_role): '(Apoteker Klinis|Clinical Pharmacist)'/.test(strings))
ok('judul halaman/OG tidak menyebut "Apoteker Klinis"', !/Apoteker Klinis/.test(layout))
ok('kartu ID: drag sumbu-x di layar sentuh, tanpa touchAction yang ditimpa Framer', /drag=\{coarse \? 'x' : true\}/.test(lanyard) && !/touchAction/.test(lanyard))
ok('kartu ID: reduced-motion tanpa pantulan', /reduce \? \{ bounceStiffness/.test(lanyard))
ok('layar loading bertanda data-loader + jaring pengaman CSS + noscript', /data-loader/.test(loading) && /loaderFailsafe/.test(css) && /noscript/.test(layout))
ok('menu di halaman detail memakai next/link (tanpa muat ulang)', /<Link href=\{href\} className=\{className\}/.test(nav))
ok('modal sertifikat: fokus terkunci (Tab) dan tombol bisa membungkus', /e\.key === 'Tab'/.test(modal) && /flex flex-wrap items-center justify-between/.test(modal))
ok('judul Keahlian tidak lagi merangkai tiga "&"', !/sections\[4\]\.title \+ ' & '/.test(skills))
ok('OG halaman detail membawa siteName/locale', /siteName/.test(detail) && /locale/.test(detail))
ok('lanyard: pita lebar bercetak teks berulang, susunan V, gesper hitam, ujung pita', /strap-text/.test(lanyard) && /\[-1, 1\]\.map/.test(lanyard) && /Gesper/.test(lanyard) && /strap-tip/.test(lanyard) && /\.strap \{/.test(css))
const exists = (p) => fs.existsSync(path.join(root, p))
const l3d = exists('components/ui/Lanyard3D.tsx') ? read('components/ui/Lanyard3D.tsx') : ''
const pkg = read('package.json'), chooser = read('components/ui/LanyardCard.tsx')
ok('lanyard 3D: paket three, fiber, drei, rapier, meshline terpasang', ['"three"', '"@react-three/fiber"', '"@react-three/drei"', '"@react-three/rapier"', '"meshline"'].every((k) => pkg.includes(k)))
ok('lanyard 3D: fisika (Physics, RigidBody, rope & spherical joint) + pita meshline', ['Physics', 'RigidBody', 'useRopeJoint', 'useSphericalJoint', 'MeshLineGeometry', 'gravity'].every((k) => l3d.includes(k)))
ok('lanyard 3D: memakai model GLB buatan pemilik (card, clip, clamp) + pita bertekstur', ['useGLTF', '/assets/lanyard/kartu.glb', 'nodes.card', 'nodes.clip', 'nodes.clamp', 'materials.metal', 'materials.base', 'CanvasTexture'].every((k) => l3d.includes(k)) && exists('public/assets/lanyard/kartu.glb') && exists('public/assets/lanyard/bandd.png'))
ok('lanyard 3D: seret kartu, pause di luar layar, sentuhan dibatalkan', ['setNextKinematicTranslation', 'frameloop', 'onPointerCancel', "'pointercancel'"].every((k) => l3d.includes(k)))
ok('lanyard 3D: lerp tali dibatasi (delta besar tidak melempar pita)', /Math\.min\(delta, 0\.05\)/.test(l3d) && /Math\.min\(1,/.test(l3d))
const endFixOk = (src) => /function fixLineEnds/.test(src) && /fixLineEnds\(band\.current\.geometry\)/.test(src) && /getSpacedPoints/.test(src) && /TILE_LEN/.test(src)
ok('lanyard 3D: ujung pita tidak bergantung pada perbandingan float meshline (fixLineEnds) + titik rata panjang busur', endFixOk(l3d) && !/__lan/.test(l3d))
ok('penjaga ujung pita memang gagal pada kode sebelum perbaikan (git d27d351)', (() => { try { const old = execSync('git show d27d351:components/ui/Lanyard3D.tsx', { cwd: root }).toString(); return !endFixOk(old) } catch { return true } })())
ok('lanyard 3D: tanpa pita V/gesper buatan sendiri (mengikuti sumber)', !/armL|Gesper/.test(l3d))
ok('LanyardCard memilih 3D dengan cadangan 2D (WebGL, reduced-motion, perangkat lemah)', /dynamic\(/.test(chooser) && /Lanyard3D/.test(chooser) && /Lanyard2D/.test(chooser) && /webgl/i.test(chooser) && /deviceMemory/.test(chooser) && /useReducedMotion/.test(chooser))
const hero = read('components/sections/Hero.tsx'), heading = read('components/ui/SectionHeading.tsx'), tpl = read('app/template.tsx'), reveal = read('components/ui/Reveal.tsx'), utils = read('lib/utils.ts')
const ready = exists('lib/ready.ts') ? read('lib/ready.ts') : ''
ok('animasi: hero menunggu layar loading (useReady) dan loader memberi sinyal (setReady)', /useReady/.test(hero) && /setReady/.test(loading) && /export const useReady/.test(ready) && /export const setReady/.test(ready))
ok('animasi: pil menu aktif bergeser (layoutId) dan NavLink berada di luar komponen (identitas stabil)', /layoutId="nav-pill"/.test(nav) && /^function NavLink/m.test(nav))
ok('animasi: garis judul bagian tumbuh (scaleX) saat masuk layar', /scaleX/.test(heading))
ok('animasi: easing dan durasi dipusatkan (EASE, DUR) dan dipakai transisi halaman + reveal', /export const EASE/.test(utils) && /export const DUR/.test(utils) && /EASE/.test(tpl) && /EASE|fadeUp/.test(reveal))
ok('lanyard 3D: kanvas lebih lebar dari kolom (kartu tidak terpotong) tetapi interaksi tetap di kolom (eventSource)', /eventSource=\{wrap/.test(l3d) && /width: 'min\(100vw/.test(l3d) && /pointerEvents: 'none'/.test(l3d) && !/eventPrefix/.test(l3d) && /r\.left/.test(l3d))
ok('lanyard 3D: sisi belakang kartu polos (kotak kanan atlas ditimpa warna)', /fillRect\(w \/ 2, 0, w \/ 2, 780\)/.test(l3d))
ok('tema: latar biru LinkedIn (#0a66c2) di token Tailwind dan CSS', /background: '#0a66c2'/.test(read('tailwind.config.ts')) && /--background: #0a66c2/.test(css) && /themeColor: '#0a66c2'/.test(layout))
ok('tema/lanyard: html menahan overflow-x (kanvas lebar tidak membuat halaman bisa digeser ke samping)', /html \{[^}]*overflow-x: clip/s.test(css))
console.log(bad ? 'GAGAL (' + bad + ')' : 'OK')
process.exit(bad ? 1 : 0)
