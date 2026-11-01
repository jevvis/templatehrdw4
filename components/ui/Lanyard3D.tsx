'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, useGLTF } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint, type RapierRigidBody } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'

extend({ MeshLineGeometry, MeshLineMaterial })

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any
      meshLineMaterial: any
    }
  }
}

export interface Lanyard3DProps {
  name: string
  role: string
  school: string
  gpa: string
  year: string
  photo: string
  hint: string
  label: string
  /** mode tenang (kurangi gerak): rantai mulai lurus, tanpa ayunan masuk */
  calm?: boolean
}

/**
 * Model dan struktur fisika mengikuti proyek 3D_CARD milik pemilik: kartu.glb (bagian card, clip, clamp) digantung
 * pada rantai tiga benda fisik bersendi tali; pita digambar mengikuti rantai dengan meshline.
 * Yang diganti hanya isi: sisi depan kartu (foto + data Hafizah) dan tulisan pita.
 */
const GLTF_PATH = '/assets/lanyard/kartu.glb'
useGLTF.preload(GLTF_PATH)

/**
 * Perbaikan ujung pita (kedip/terpotong di dekat kartu). Shader meshline membandingkan `previous == position` (float, persis)
 * di titik pertama dan `next == position` di titik terakhir, padahal `position` ikut dikali `aspect` sedangkan `previous`/`next`
 * tidak, sehingga hasil perbandingannya bergantung pada pembulatan dan berubah-ubah saat posisi bergerak. Bila salah, arah
 * ujung dihitung dari selisih noise: ujung miring/runcing atau ruas pertama hilang. Di sini `previous` titik pertama dan `next`
 * titik terakhir diisi titik ekstrapolasi searah garis, jadi cabang rapuh itu tidak pernah terpakai.
 */
function fixLineEnds(g: MeshLineGeometry) {
  const pos = g.attributes.position.array as Float32Array
  const prev = g.attributes.previous.array as Float32Array
  const next = g.attributes.next.array as Float32Array
  const n = pos.length / 6
  if (n < 2) return
  for (let k = 0; k < 6; k++) {
    const c = k % 3
    prev[k] = 2 * pos[c] - pos[6 + c] // titik pertama: p0 - (p1 - p0)
    next[(n - 1) * 6 + k] = 2 * pos[(n - 1) * 6 + c] - pos[(n - 2) * 6 + c] // titik terakhir: pN + (pN - pN-1)
  }
  g.attributes.previous.needsUpdate = true
  g.attributes.next.needsUpdate = true
}

/** panjang satu ulangan tulisan pada pita (satuan dunia) */
const TILE_LEN = 0.8

const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 } as const

// ───── tekstur yang digambar dari kode ─────
function useDrawnTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void | Promise<void>, deps: unknown[], flipY = true) {
  const tex = useMemo(() => {
    const cv = document.createElement('canvas')
    cv.width = w
    cv.height = h
    const t = new THREE.CanvasTexture(cv)
    t.colorSpace = THREE.SRGBColorSpace
    t.flipY = flipY // tekstur glTF tidak dibalik (flipY = false)
    t.anisotropy = 16
    return t
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, h, flipY])
  useEffect(() => {
    let off = false
    const ctx = (tex.image as HTMLCanvasElement).getContext('2d')!
    Promise.resolve(document.fonts?.ready)
      .then(() => draw(ctx, w, h))
      .then(() => {
        if (!off) tex.needsUpdate = true
      })
    return () => {
      off = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tex, ...deps])
  useEffect(() => () => tex.dispose(), [tex])
  return tex
}

const rr = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

/** Desain sisi depan kartu pada kanvas logis 640×900. */
function drawFrontDesign(ctx: CanvasRenderingContext2D, w: number, h: number, p: Lanyard3DProps, img: HTMLImageElement | null) {
  const photoH = h * 0.58
  const g = ctx.createLinearGradient(0, 0, 0, photoH)
  g.addColorStop(0, '#1d6fa5')
  g.addColorStop(0.55, '#1f4f9a')
  g.addColorStop(1, '#18214a')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, photoH)
  if (img) {
    const ph = photoH * 0.84 // ruang kosong di atas untuk penjepit pada model
    const pw = (img.width / img.height) * ph
    ctx.drawImage(img, (w - pw) / 2, photoH - ph, pw, ph)
  }
  const b = ctx.createLinearGradient(0, photoH, 0, h)
  b.addColorStop(0, '#12183a')
  b.addColorStop(1, '#090d20')
  ctx.fillStyle = b
  ctx.fillRect(0, photoH, w, h - photoH)
  const pad = 44
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#fff'
  ctx.font = '800 66px Inter, system-ui, sans-serif'
  ctx.fillText(p.name, pad, photoH + 92)
  ctx.fillStyle = '#2dd4bf'
  ctx.font = '700 26px Inter, system-ui, sans-serif'
  ;(ctx as any).letterSpacing = '6px'
  ctx.fillText(p.role.toUpperCase(), pad, photoH + 138)
  ;(ctx as any).letterSpacing = '0px'
  ctx.fillStyle = '#98a2c8'
  let size = 26
  do {
    ctx.font = `500 ${size}px Inter, system-ui, sans-serif`
    size -= 1
  } while (ctx.measureText(p.school).width > w - pad * 2 && size > 15)
  ctx.fillText(p.school, pad, photoH + 184)
  ctx.font = '600 26px Inter, system-ui, sans-serif'
  const cw = ctx.measureText(p.gpa).width + 44
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  rr(ctx, pad, h - 108, cw, 50, 25)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.fillStyle = '#fff'
  ctx.fillText(p.gpa, pad + 22, h - 73)
  ctx.fillStyle = '#98a2c8'
  ctx.font = '500 22px Inter, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(p.year, w - pad, h - 73)
  ctx.textAlign = 'left'
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

/**
 * Atlas tekstur kartu 1024×1024. Dari pemetaan UV pada kartu.glb: sisi depan memakai kotak kiri
 * (u 0–0,5; v 0–0,755) dan sisi belakang kotak kanan (motif aslinya dipertahankan).
 * Sisi depan digambar proporsional kartu (716×1000) lalu dipetakan ke kotaknya (±510×769).
 */
async function drawAtlas(ctx: CanvasRenderingContext2D, w: number, h: number, base: CanvasImageSource | null, p: Lanyard3DProps) {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, w, h)
  if (base) ctx.drawImage(base, 0, 0, w, h)
  // sisi belakang polos: timpa seluruh kotak kanan atlas (motif kartu remi bawaan model dibuang)
  const back = ctx.createLinearGradient(w / 2, 0, w, 780)
  back.addColorStop(0, '#1b87e6')
  back.addColorStop(1, '#0a4f9c')
  ctx.fillStyle = back
  ctx.fillRect(w / 2, 0, w / 2, 780)
  const img = await loadImage(p.photo)
  const fc = document.createElement('canvas')
  fc.width = 716
  fc.height = 1000
  const f = fc.getContext('2d')!
  f.scale(716 / 640, 1000 / 900)
  drawFrontDesign(f, 640, 900, p, img)
  ctx.drawImage(fc, 0, 4, 510, 769)
}

/** Pita hitam bertulisan putih lebar (gaya sumber). Untuk memakai gambar asli, ganti dengan useTexture('/assets/lanyard/bandd.png'). */
function drawBand(ctx: CanvasRenderingContext2D, w: number, h: number, p: Lanyard3DProps) {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#fff'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  ;(ctx as any).letterSpacing = '22px'
  let size = 150
  const text = p.name.toUpperCase()
  do {
    ctx.font = `800 ${size}px Inter, system-ui, sans-serif`
    size -= 4
  } while (ctx.measureText(text).width > w * 0.78 && size > 30)
  ctx.fillText(text, w / 2 + 11, h / 2 + 6)
  ;(ctx as any).letterSpacing = '0px'
  ctx.textAlign = 'left'
}

// ───── rantai tali + kartu (struktur sumber) ─────
function Band({ maxSpeed = 50, minSpeed = 10, ...props }: Lanyard3DProps & { maxSpeed?: number; minSpeed?: number }) {
  const { nodes, materials } = useGLTF(GLTF_PATH) as any
  const atlas = useDrawnTexture(1024, 1024, (c, w, h) => drawAtlas(c, w, h, materials.base?.map?.image ?? null, props), [props.name, props.role, props.school, props.gpa, props.year, props.photo], false)
  const bandTex = useDrawnTexture(1024, 248, (c, w, h) => drawBand(c, w, h, props), [props.name], true)
  useMemo(() => {
    bandTex.wrapS = bandTex.wrapT = THREE.RepeatWrapping
  }, [bandTex])

  const band = useRef<any>(null)
  const fixed = useRef<RapierRigidBody>(null)
  const j1 = useRef<any>(null)
  const j2 = useRef<any>(null)
  const j3 = useRef<RapierRigidBody>(null)
  const card = useRef<RapierRigidBody>(null)
  const { width, height } = useThree((s) => s.size)
  const tmp = useMemo(() => ({ vec: new THREE.Vector3(), dir: new THREE.Vector3(), ang: new THREE.Vector3(), rot: new THREE.Vector3() }), [])
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]))
  const [dragged, drag] = useState<false | THREE.Vector3>(false)
  const [hovered, hover] = useState(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

  // jaring pengaman: apa pun yang mengakhiri sentuhan/klik (juga di luar kartu) melepaskan kartu
  useEffect(() => {
    if (!dragged) return
    const release = () => drag(false)
    addEventListener('pointerup', release)
    addEventListener('pointercancel', release)
    return () => {
      removeEventListener('pointerup', release)
      removeEventListener('pointercancel', release)
    }
  }, [dragged])

  useEffect(() => {
    if (!hovered) return
    document.body.style.cursor = dragged ? 'grabbing' : 'grab'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (dragged && card.current) {
      const { vec, dir } = tmp
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    }
    if (fixed.current && j1.current && j2.current && j3.current && card.current && band.current) {
      ;[j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        const clamped = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
        // jeda frame dibatasi: setelah tab kembali dari latar belakang delta bisa sangat besar dan faktor lerp > 1 melempar titik tali keluar
        const t = Math.min(1, Math.min(delta, 0.05) * (minSpeed + clamped * (maxSpeed - minSpeed)))
        ref.current.lerped.lerp(ref.current.translation(), t)
      })
      curve.points[0].copy(j3.current.translation() as THREE.Vector3)
      curve.points[1].copy(j2.current.lerped)
      curve.points[2].copy(j1.current.lerped)
      curve.points[3].copy(fixed.current.translation() as THREE.Vector3)
      // titik dibagi rata menurut panjang busur dan tile tekstur berpanjang tetap dihitung dari ujung kartu,
      // supaya tulisan tidak merayap/berkedip saat tali melengkung (pemetaan lama: nomor titik, bukan panjang)
      curve.updateArcLengths()
      band.current.geometry.setPoints(curve.getSpacedPoints(width < 640 ? 20 : 32))
      fixLineEnds(band.current.geometry)
      band.current.material.uniforms.repeat.value.set(-curve.getLength() / TILE_LEN, 1)
      tmp.ang.copy(card.current.angvel() as THREE.Vector3)
      tmp.rot.copy(card.current.rotation() as unknown as THREE.Vector3)
      card.current.setAngvel({ x: tmp.ang.x, y: tmp.ang.y - tmp.rot.y * 0.25, z: tmp.ang.z }, true)
    }
  })

  curve.curveType = 'chordal'
  const calm = !!props.calm

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={calm ? [0, -1, 0] : [0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={calm ? [0, -2, 0] : [1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={calm ? [0, -3, 0] : [1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={calm ? [0, -3 - 1.45, 0] : [2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(e.pointerId)
              drag(false)
            }}
            // peramban membatalkan sentuhan saat berubah jadi scroll halaman: lepaskan kartu agar tidak menempel
            onPointerCancel={() => drag(false)}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId)
              drag(new THREE.Vector3().copy(e.point).sub(tmp.vec.copy(card.current!.translation() as THREE.Vector3)))
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial map={atlas} map-anisotropy={16} clearcoat={1} clearcoatRoughness={0.15} roughness={0.3} metalness={0.5} />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial color="white" depthTest={false} resolution={[width, height]} useMap map={bandTex} repeat={[-4, 1]} lineWidth={1} />
      </mesh>
    </>
  )
}

/**
 * Lanyard 3D dengan fisika sungguhan (Rapier lewat WebAssembly): tali berupa rantai benda fisik, kartu menempel lewat
 * sendi bola sehingga berputar dan berayun bebas; gravitasi diatur di <Physics gravity>. Render berhenti saat keluar layar.
 */
export default function Lanyard3D(props: Lanyard3DProps) {
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Tarikan ke atas (-mt) hanya di layar lebar yang dua kolom; di HP/tablet satu kolom, pita harus mulai di bawah tombol, bukan menimpanya.
  return (
    <div ref={wrap} className="lanyard-fade relative mx-auto mt-2 h-[700px] w-full max-w-[460px] select-none sm:mt-4 sm:h-[780px] lg:-mt-32 lg:translate-x-14" style={{ touchAction: 'pan-y' }} role="img" aria-label={props.label}>
      {/* Kanvas WebGL memotong apa pun di luar kotaknya. Kanvas dibuat selebar layar (maks 1400 px) dan berpusat pada kolom,
          sedangkan interaksi tetap hanya di kolom lewat eventSource, sehingga kartu dan pita bebas berayun ke kiri/kanan tanpa terpotong
          dan tidak menutupi tombol/teks di sebelahnya. */}
      <Canvas
        eventSource={wrap as React.MutableRefObject<HTMLElement>}
        camera={{ position: [0, 0, 11.2], fov: 25 }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true }}
        frameloop={visible ? 'always' : 'never'}
        onCreated={({ gl, setEvents }) => {
          gl.setClearColor(new THREE.Color(0x000000), 0)
          // eventSource = kolom sempit, kanvas lebih lebar dan bergeser: koordinat pointer harus relatif terhadap kanvas
          // (opsi prefiks bawaan R3F memakai clientX mentah sehingga raycast meleset)
          setEvents({
            compute: (event, state) => {
              const r = gl.domElement.getBoundingClientRect()
              state.pointer.set(((event.clientX - r.left) / r.width) * 2 - 1, -((event.clientY - r.top) / r.height) * 2 + 1)
              state.raycaster.setFromCamera(state.pointer, state.camera)
            },
          })
        }}
        style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 'min(100vw, 1400px)', transform: 'translateX(-50%)', pointerEvents: 'none', touchAction: 'pan-y' }}
      >
        <ambientLight intensity={Math.PI} />
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60} paused={!visible}>
          <Band {...props} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
      <p className="pointer-events-none absolute bottom-0 left-0 right-0 text-center text-[11px] tracking-[0.25em] text-text-secondary">{props.hint}</p>
    </div>
  )
}
