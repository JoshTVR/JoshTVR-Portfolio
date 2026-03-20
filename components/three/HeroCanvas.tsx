'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

/* ── Central wireframe: TorusKnot (methodical + explosive) ── */
function Core() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.x = clock.getElapsedTime() * 0.14
    ref.current.rotation.y = clock.getElapsedTime() * 0.21
    ref.current.rotation.z = clock.getElapsedTime() * 0.07
  })
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1.1, 0.38, 220, 20, 3, 7]} />
      <meshStandardMaterial
        color="#facc15"
        wireframe
        emissive="#facc15"
        emissiveIntensity={3}
      />
    </mesh>
  )
}

/* ── Orbiting geometry satellites ── */
function Satellite({
  radius, speed, offset, children,
}: {
  radius: number
  speed: number
  offset: number
  children: React.ReactNode
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * speed + offset
    ref.current.position.x = Math.cos(t) * radius
    ref.current.position.z = Math.sin(t) * radius
    ref.current.position.y = Math.sin(t * 1.4) * radius * 0.4
    ref.current.rotation.x = t * 1.8
    ref.current.rotation.z = t * 0.9
  })
  return (
    <mesh ref={ref}>
      {children}
      <meshStandardMaterial
        color="#facc15"
        emissive="#facc15"
        emissiveIntensity={2}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

/* ── Explosive particle cloud ── */
function Particles({ count = 4500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Explosive burst distribution: denser near center, sparser outward
      const r = 3.5 + Math.pow(Math.random(), 0.6) * 11
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)

      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)

      // Yellow-to-white fade: outer particles whiter
      const t = Math.random()
      col[i * 3]     = 1.0               // R
      col[i * 3 + 1] = 0.8 + t * 0.2    // G
      col[i * 3 + 2] = t * 0.15         // B
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))
    return geo
  }, [count])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.022
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.08) * 0.12
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/* ── Camera follows mouse for parallax ── */
function CameraParallax() {
  const { camera, mouse } = useThree()
  useFrame(() => {
    camera.position.x += (mouse.x * 1.8 - camera.position.x) * 0.025
    camera.position.y += (mouse.y * 1.2 - camera.position.y) * 0.025
    camera.lookAt(0, 0, 0)
  })
  return null
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.04} />
      <pointLight position={[0, 0, 0]}   intensity={6}  color="#facc15" distance={18} />
      <pointLight position={[10, 5, -8]} intensity={0.8} color="#ffffff" distance={25} />

      {/* Core structure */}
      <Core />

      {/* Orbital satellites — different speeds, geometries, radii */}
      <Float speed={1.5} floatIntensity={0.4}>
        <Satellite radius={2.7} speed={0.50} offset={0.0}>
          <icosahedronGeometry args={[0.30, 1]} />
        </Satellite>
      </Float>

      <Satellite radius={3.8} speed={0.30} offset={2.1}>
        <octahedronGeometry args={[0.38]} />
      </Satellite>

      <Float speed={2} floatIntensity={0.3}>
        <Satellite radius={2.2} speed={0.72} offset={4.2}>
          <tetrahedronGeometry args={[0.28]} />
        </Satellite>
      </Float>

      <Satellite radius={4.6} speed={0.18} offset={1.0}>
        <dodecahedronGeometry args={[0.42, 0]} />
      </Satellite>

      <Float speed={1.2} floatIntensity={0.5}>
        <Satellite radius={3.3} speed={0.44} offset={3.3}>
          <icosahedronGeometry args={[0.22, 0]} />
        </Satellite>
      </Float>

      {/* Particle explosion */}
      <Particles />

      {/* Mouse parallax */}
      <CameraParallax />

      {/* Bloom glow */}
      <EffectComposer>
        <Bloom
          intensity={2.2}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 58 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <Scene />
    </Canvas>
  )
}
