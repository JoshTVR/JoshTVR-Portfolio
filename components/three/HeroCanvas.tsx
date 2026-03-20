'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

const MAT_PROPS = {
  color: new THREE.Color('#facc15'),
  metalness: 0.88,
  roughness: 0.10,
  envMapIntensity: 1.8,
}

function Ring({
  radius, tube, axis, speed, offset = 0,
}: {
  radius: number; tube: number; axis: 'x' | 'y' | 'z'; speed: number; offset?: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation[axis] = clock.getElapsedTime() * speed + offset
  })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, tube, 32, 160]} />
      <meshStandardMaterial {...MAT_PROPS} />
    </mesh>
  )
}

function Gyroscope() {
  const group = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!group.current) return
    group.current.rotation.y = clock.getElapsedTime() * 0.07
    group.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.14) * 0.18
  })
  return (
    <group ref={group}>
      {/* Outer ring — horizontal plane */}
      <Ring radius={1.45} tube={0.055} axis="y" speed={0.30} />
      {/* Mid ring — vertical plane */}
      <Ring radius={1.15} tube={0.052} axis="x" speed={-0.42} offset={0.5} />
      {/* Inner ring — diagonal plane */}
      <Ring radius={0.82} tube={0.050} axis="z" speed={0.58} offset={1.1} />
      {/* Core */}
      <mesh>
        <sphereGeometry args={[0.19, 32, 32]} />
        <meshStandardMaterial color="#facc15" metalness={0.95} roughness={0.04} envMapIntensity={2.5} />
      </mesh>
    </group>
  )
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.8], fov: 44 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.12} />
      {/* Key light — bright white from top-right */}
      <directionalLight position={[4, 6, 3]}  intensity={2.2} color="#ffffff" />
      {/* Fill light — subtle yellow from left */}
      <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#facc15" />
      {/* Rim light — from behind */}
      <pointLight position={[0, -3, -4]} intensity={1.0} color="#facc15" />

      <Gyroscope />

      {/* Studio env for clean PBR reflections */}
      <Environment preset="studio" />
    </Canvas>
  )
}
