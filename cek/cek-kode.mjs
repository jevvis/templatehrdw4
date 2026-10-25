// Pemeriksa kode: menjaga perbaikan hasil review akhir agar tidak hilang. Jalankan: node cek/cek-kode.mjs
import fs from 'node:fs'
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
ok('menu di halaman detail memakai next/link (tanpa muat ulang)', /<Link href=\{href\(id\)\}/.test(nav))
ok('modal sertifikat: fokus terkunci (Tab) dan tombol bisa membungkus', /e\.key === 'Tab'/.test(modal) && /flex flex-wrap items-center justify-between/.test(modal))
ok('judul Keahlian tidak lagi merangkai tiga "&"', !/sections\[4\]\.title \+ ' & '/.test(skills))
ok('OG halaman detail membawa siteName/locale', /siteName/.test(detail) && /locale/.test(detail))
ok('lanyard: pita lebar bercetak teks berulang, susunan V, gesper hitam, ujung pita', /strap-text/.test(lanyard) && /\[-1, 1\]\.map/.test(lanyard) && /Gesper/.test(lanyard) && /strap-tip/.test(lanyard) && /\.strap \{/.test(css))
const exists = (p) => fs.existsSync(path.join(root, p))
const l3d = exists('components/ui/Lanyard3D.tsx') ? read('components/ui/Lanyard3D.tsx') : ''
const pkg = read('package.json'), chooser = read('components/ui/LanyardCard.tsx')
ok('lanyard 3D: paket three, fiber, drei, rapier, meshline terpasang', ['"three"', '"@react-three/fiber"', '"@react-three/drei"', '"@react-three/rapier"', '"meshline"'].every((k) => pkg.includes(k)))
ok('lanyard 3D: fisika (Physics, RigidBody, rope & spherical joint) + pita meshline', ['Physics', 'RigidBody', 'useRopeJoint', 'useSphericalJoint', 'MeshLineGeometry', 'gravity'].every((k) => l3d.includes(k)))
ok('lanyard 3D: pita V, gesper, tekstur cetak, seret kartu, pause saat di luar layar', ['armL', 'armR', 'Gesper', 'CanvasTexture', 'setNextKinematicTranslation', 'frameloop', 'onPointerCancel', "'pointercancel'"].every((k) => l3d.includes(k)))
ok('LanyardCard memilih 3D dengan cadangan 2D (WebGL, reduced-motion, perangkat lemah)', /dynamic\(/.test(chooser) && /Lanyard3D/.test(chooser) && /Lanyard2D/.test(chooser) && /webgl/i.test(chooser) && /deviceMemory/.test(chooser) && /useReducedMotion/.test(chooser))
console.log(bad ? 'GAGAL (' + bad + ')' : 'OK')
process.exit(bad ? 1 : 0)
