'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, RoundedBox } from '@react-three/drei'
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

// ───── ukuran dunia (satuan three.js) ─────
const ANCHOR_Y = 1.9 // tinggi gesper
const ROPE = 0.5 // panjang tiap ruas rantai
const CARD_W = 1.6
const CARD_H = 2.25
const JOINT_UP = 1.45 // titik sambung tali, di atas pusat kartu
const STRAP_W = 2.2

const segment = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 } as const

// ───── tekstur yang digambar dari kode (tanpa file model/gambar tambahan) ─────
function useDrawnTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void | Promise<void>, deps: unknown[]) {
  const tex = useMemo(() => {
    const cv = document.createElement('canvas')
    cv.width = w
    cv.height = h
    const t = new THREE.CanvasTexture(cv)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    return t
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, h])
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

function drawFront(ctx: CanvasRenderingContext2D, w: number, h: number, p: Lanyard3DProps) {
  return new Promise<void>((resolve) => {
    const img = new Image()
    const finish = (ok: boolean) => {
      const photoH = h * 0.58
      const g = ctx.createLinearGradient(0, 0, 0, photoH)
      g.addColorStop(0, '#1d6fa5')
      g.addColorStop(0.55, '#1f4f9a')
      g.addColorStop(1, '#18214a')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, photoH)
      if (ok) {
        const ph = photoH * 0.98
        const pw = (img.width / img.height) * ph
        ctx.drawImage(img, (w - pw) / 2, photoH - ph, pw, ph)
      }
      const b = ctx.createLinearGradient(0, photoH, 0, h)
      b.addColorStop(0, '#12183a')
      b.addColorStop(1, '#090d20')
      ctx.fillStyle = b
      ctx.fillRect(0, photoH, w, h - photoH)
      // lubang gantungan
      ctx.fillStyle = 'rgba(0,0,0,0.45)'
      rr(ctx, w / 2 - 44, 26, 88, 14, 7)
      ctx.fill()
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
      // chip IPK + tahun
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
      resolve()
    }
    img.onload = () => finish(true)
    img.onerror = () => finish(false)
    img.src = p.photo
  })
}

function drawBack(ctx: CanvasRenderingContext2D, w: number, h: number, p: Lanyard3DProps) {
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#2a1f78')
  g.addColorStop(0.5, '#3a56d4')
  g.addColorStop(1, '#14204f')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = 'rgba(0,0,0,0.4)'
  rr(ctx, w / 2 - 44, 26, 88, 14, 7)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.font = '800 150px Inter, system-ui, sans-serif'
  ctx.fillText(p.name.charAt(0) + '.', w / 2, h / 2 + 30)
  ctx.font = '700 28px Inter, system-ui, sans-serif'
  ;(ctx as any).letterSpacing = '8px'
  ctx.fillStyle = '#ffd84d'
  ctx.fillText(p.role.toUpperCase(), w / 2, h / 2 + 100)
  ctx.textAlign = 'left'
  ;(ctx as any).letterSpacing = '0px'
}

function drawBand(ctx: CanvasRenderingContext2D, w: number, h: number, p: Lanyard3DProps) {
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, '#1e1658')
  g.addColorStop(0.3, '#4b2fb8')
  g.addColorStop(0.7, '#2f6fe0')
  g.addColorStop(1, '#1e1658')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = 'rgba(255,255,255,0.28)'
  ctx.lineWidth = 3
  ctx.setLineDash([14, 10])
  for (const y of [12, h - 12]) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }
  ctx.setLineDash([])
  // satu pengulangan teks memenuhi lebar tekstur
  const a = p.name.toUpperCase()
  const b = p.role.toUpperCase()
  const dot = '  •  '
  let size = 80
  ctx.textBaseline = 'middle'
  ;(ctx as any).letterSpacing = '6px'
  do {
    ctx.font = `800 ${size}px Inter, system-ui, sans-serif`
    size -= 2
  } while (ctx.measureText(a + dot + b + dot).width > w - 24 && size > 20)
  let x = 12
  const parts: [string, string][] = [
    [a, '#ffffff'],
    [dot, 'rgba(255,255,255,0.55)'],
    [b, '#ffd84d'],
    [dot, 'rgba(255,255,255,0.55)'],
  ]
  for (const [t, c] of parts) {
    ctx.fillStyle = c
    ctx.fillText(t, x, h / 2 + 3)
    x += ctx.measureText(t).width
  }
  ;(ctx as any).letterSpacing = '0px'
}

// ───── pita (meshline) ─────
function Strap({ points, map, width, height }: { points: number[]; map: THREE.Texture; width: number; height: number }) {
  const geometry = useMemo(() => {
    const g = new MeshLineGeometry()
    g.setPoints(points)
    return g
  }, [points])
  return (
    <mesh geometry={geometry} renderOrder={1}>
      <meshLineMaterial color="white" depthTest={false} resolution={[width, height]} useMap map={map} repeat={[-2, 1]} lineWidth={STRAP_W} />
    </mesh>
  )
}

// ───── rantai tali + kartu ─────
function Rig(props: Lanyard3DProps & { bandTex: THREE.Texture }) {
  const { bandTex } = props
  const front = useDrawnTexture(640, 900, (c, w, h) => drawFront(c, w, h, props), [props.name, props.role, props.school, props.gpa, props.year, props.photo])
  const back = useDrawnTexture(640, 900, (c, w, h) => drawBack(c, w, h, props), [props.name, props.role])

  const band = useRef<any>(null)
  const fixed = useRef<RapierRigidBody>(null)
  const j1 = useRef<RapierRigidBody>(null)
  const j2 = useRef<RapierRigidBody>(null)
  const j3 = useRef<RapierRigidBody>(null)
  const card = useRef<RapierRigidBody>(null)
  const { size } = useThree()

  const tmp = useMemo(() => ({ vec: new THREE.Vector3(), dir: new THREE.Vector3(), ang: new THREE.Vector3(), rot: new THREE.Vector3() }), [])
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]))
  const [dragged, drag] = useState<false | THREE.Vector3>(false)
  const [hovered, hover] = useState(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ROPE])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ROPE])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ROPE])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, JOINT_UP, 0]])

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

  // dua pita atas membentuk V, bertemu di gesper
  const armL = useMemo(() => [-2.3, ANCHOR_Y + 3.9, 0, 0, ANCHOR_Y, 0], [])
  const armR = useMemo(() => [2.3, ANCHOR_Y + 3.9, 0, 0, ANCHOR_Y, 0], [])

  useFrame((state) => {
    if (dragged && card.current) {
      const { vec, dir } = tmp
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp())
      card.current.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    }
    if (fixed.current && j1.current && j2.current && j3.current && card.current && band.current) {
      curve.points[0].copy(j3.current.translation() as THREE.Vector3)
      curve.points[1].copy(j2.current.translation() as THREE.Vector3)
      curve.points[2].copy(j1.current.translation() as THREE.Vector3)
      curve.points[3].copy(fixed.current.translation() as THREE.Vector3)
      band.current.geometry.setPoints(curve.getPoints(size.width < 640 ? 20 : 36))
      // jaga kartu tetap menghadap depan
      tmp.ang.copy(card.current.angvel() as THREE.Vector3)
      tmp.rot.copy(card.current.rotation() as unknown as THREE.Vector3)
      card.current.setAngvel({ x: tmp.ang.x, y: tmp.ang.y - tmp.rot.y * 0.25, z: tmp.ang.z }, true)
    }
  })

  curve.curveType = 'chordal'

  return (
    <>
      <group position={[0, ANCHOR_Y, 0]}>
        <RigidBody ref={fixed} {...segment} type="fixed" />
        <RigidBody position={props.calm ? [0, -ROPE, 0] : [ROPE * 0.5, 0, 0]} ref={j1} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={props.calm ? [0, -ROPE * 2, 0] : [ROPE, 0, 0]} ref={j2} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={props.calm ? [0, -ROPE * 3, 0] : [ROPE * 1.5, 0, 0]} ref={j3} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={props.calm ? [0, -ROPE * 3 - JOINT_UP, 0] : [ROPE * 2 + 0.4, 0, 0]} ref={card} {...segment} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[CARD_W / 2, CARD_H / 2, 0.02]} />
          <group
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
            <RoundedBox args={[CARD_W, CARD_H, 0.06]} radius={0.09} smoothness={4}>
              <meshPhysicalMaterial color="#0b1129" roughness={0.4} metalness={0.25} clearcoat={1} clearcoatRoughness={0.15} />
            </RoundedBox>
            <mesh position={[0, 0, 0.031]}>
              <planeGeometry args={[CARD_W - 0.08, CARD_H - 0.08]} />
              <meshPhysicalMaterial map={front} roughness={0.35} clearcoat={0.7} clearcoatRoughness={0.2} />
            </mesh>
            <mesh position={[0, 0, -0.031]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[CARD_W - 0.08, CARD_H - 0.08]} />
              <meshPhysicalMaterial map={back} roughness={0.35} clearcoat={0.7} clearcoatRoughness={0.2} />
            </mesh>
            {/* klip logam + ujung pita hitam */}
            <RoundedBox args={[0.4, 0.3, 0.09]} radius={0.05} smoothness={3} position={[0, CARD_H / 2 + 0.06, 0]}>
              <meshStandardMaterial color="#d3d8e2" metalness={1} roughness={0.22} />
            </RoundedBox>
            <RoundedBox args={[0.3, 0.2, 0.05]} radius={0.04} smoothness={3} position={[0, CARD_H / 2 + 0.28, 0]}>
              <meshStandardMaterial color="#05060a" roughness={0.6} />
            </RoundedBox>
          </group>
        </RigidBody>
      </group>

      {/* pita V */}
      <Strap points={armL} map={bandTex} width={size.width} height={size.height} />
      <Strap points={armR} map={bandTex} width={size.width} height={size.height} />
      {/* pita utama mengikuti rantai */}
      <mesh ref={band} renderOrder={2}>
        <meshLineGeometry />
        <meshLineMaterial color="white" depthTest={false} resolution={[size.width, size.height]} useMap map={bandTex} repeat={[-2, 1]} lineWidth={STRAP_W} />
      </mesh>
      {/* Gesper pengaman hitam di titik temu */}
      <group position={[0, ANCHOR_Y - 0.1, 0.12]} renderOrder={5}>
        <RoundedBox args={[0.62, 0.74, 0.22]} radius={0.1} smoothness={4} renderOrder={5}>
          <meshPhysicalMaterial color="#0d0f16" roughness={0.35} metalness={0.3} clearcoat={0.8} depthTest={false} />
        </RoundedBox>
        <mesh position={[0, 0.1, 0.115]} renderOrder={6}>
          <planeGeometry args={[0.38, 0.12]} />
          <meshBasicMaterial color="#000" depthTest={false} />
        </mesh>
        <mesh position={[0, -0.12, 0.115]} renderOrder={6}>
          <planeGeometry args={[0.24, 0.06]} />
          <meshBasicMaterial color="#1b1f2c" depthTest={false} />
        </mesh>
      </group>
    </>
  )
}

function Scene(props: Lanyard3DProps) {
  const bandTex = useDrawnTexture(1024, 128, (c, w, h) => drawBand(c, w, h, props), [props.name, props.role])
  useMemo(() => {
    bandTex.wrapS = bandTex.wrapT = THREE.RepeatWrapping
  }, [bandTex])
  return (
    <>
      <ambientLight intensity={Math.PI} />
      <Rig {...props} bandTex={bandTex} />
      <Environment blur={0.75}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </>
  )
}

/**
 * Lanyard 3D dengan fisika sungguhan: tali berupa rantai benda fisik (Rapier, lewat WebAssembly) dengan sendi tali,
 * kartu menempel lewat sendi bola sehingga bisa berputar dan berayun bebas, gravitasi diatur di <Physics gravity>.
 * Pita digambar ulang tiap frame mengikuti rantai (meshline). Kartu dan pita memakai tekstur yang digambar dari kode.
 * Render berhenti saat komponen keluar dari layar.
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

  return (
    <div ref={wrap} className="relative -mt-28 mx-auto h-[700px] w-full max-w-[460px] select-none sm:-mt-32 sm:h-[780px]" style={{ touchAction: 'pan-y' }} role="img" aria-label={props.label}>
      <Canvas
        camera={{ position: [0, 0, 17], fov: 22 }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true }}
        frameloop={visible ? 'always' : 'never'}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), 0)}
        style={{ touchAction: 'pan-y' }}
      >
        <Physics gravity={[0, -40, 0]} timeStep={1 / 60} paused={!visible}>
          <Scene {...props} />
        </Physics>
      </Canvas>
      <p className="pointer-events-none absolute bottom-0 left-0 right-0 text-center text-[11px] tracking-[0.25em] text-text-secondary">{props.hint}</p>
    </div>
  )
}
