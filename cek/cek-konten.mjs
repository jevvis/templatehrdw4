// Pemeriksa data: paritas kunci ID/EN, slug unik & cocok jumlah pengalaman, semua gambar ada di public/.
import fs from 'node:fs'
import path from 'node:path'
const root = path.resolve(import.meta.dirname, '..')
let bad = 0; const fail = (m) => { console.log('GAGAL:', m); bad++ }
const src = fs.readFileSync(path.join(root, 'lib/content.ts'), 'utf8')
const json = src.slice(src.indexOf('= {') + 2).trim()
const C = JSON.parse(json)
const meta = JSON.parse(fs.readFileSync(path.join(root, 'lib/meta.json'), 'utf8'))
const keys = (o, p = '') => Array.isArray(o) ? o.flatMap((v, i) => keys(v, p + '[' + i + ']')).concat(p + '.length=' + o.length) : o && typeof o === 'object' ? Object.keys(o).flatMap((k) => keys(o[k], p + '.' + k)) : [p]
const a = keys(C.id), b = new Set(keys(C.en))
a.filter((k) => !b.has(k)).forEach((k) => fail('kunci ID tanpa EN: ' + k)); [...b].filter((k) => !a.includes(k)).forEach((k) => fail('kunci EN tanpa ID: ' + k))
if (new Set(meta.slugs).size !== meta.slugs.length) fail('slug tidak unik')
if (meta.slugs.length !== C.id.internships.length) fail('jumlah slug ' + meta.slugs.length + ' != pengalaman ' + C.id.internships.length)
if (meta.categories.length !== C.id.internships.length) fail('jumlah kategori != pengalaman')
meta.categories.forEach((c) => { if (!meta.categoryLabels.id[c] || !meta.categoryLabels.en[c]) fail('label kategori hilang: ' + c) })
const imgs = [C.id.photo, C.id.photo2, ...C.id.edu.map((e) => e.img), ...C.id.internships.map((e) => e.img), ...C.id.orgs.map((e) => e.img)]
imgs.forEach((p) => { if (!p.startsWith('/')) fail('jalur gambar bukan absolut: ' + p); else if (!fs.existsSync(path.join(root, 'public', p))) fail('gambar tidak ada: ' + p) })
C.id.certs.forEach((c) => { if (!fs.existsSync(path.join(root, 'public', c.imgSrc))) console.log('peringatan: foto sertifikat belum ada:', c.imgSrc) })
;['word', 'excel', 'canva'].forEach((l) => { if (!fs.existsSync(path.join(root, 'public/logos', l + '.svg'))) fail('logo hilang: ' + l) })
console.log(bad ? 'GAGAL (' + bad + ')' : 'OK'); process.exit(bad ? 1 : 0)
