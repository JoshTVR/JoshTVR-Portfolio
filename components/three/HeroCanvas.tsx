'use client'

import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshDistortMaterial, Float, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

function CameraController() {
  const { camera, mouse } = useThree()
  useFrame(() => {
    camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.035
    camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.035
    camera.lookAt(0, 0, 0)
  })
  return null
}

function MainBlob() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.10
    ref.current.rotation.z = clock.getElapsedTime() * 0.07
  })
  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
      <mesh ref={ref}>
        <sphereGeometry args={[1.7, 128, 128]} />
        <MeshDistortMaterial
          color="#facc15"
          distort={0.42}
          speed={2.2}
          roughness={0.03}
          metalness={0.95}
          envMapIntensity={3}
        />
      </mesh>
    </Float>
  )
}

function OrbitBlob() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.position.x = Math.cos(t * 0.38) * 2.4
    ref.current.position.y = Math.sin(t * 0.55) * 1.3
    ref.current.position.z = Math.cos(t * 0.25) * 0.9 - 0.5
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.38, 64, 64]} />
      <MeshDistortMaterial
        color="#fde047"
        distort={0.65}
        speed={3.5}
        roughness={0.08}
        metalness={0.75}
        transparent
        opacity={0.82}
        envMapIntensity={2}
      />
    </mesh>
  )
}

function SmallBlob() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.position.x = Math.sin(t * 0.5 + 2) * 1.8
    ref.current.position.y = Math.cos(t * 0.35 + 1) * 2.0
    ref.current.position.z = Math.sin(t * 0.45) * 0.6
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.18, 32, 32]} />
      <MeshDistortMaterial
        color="#facc15"
        distort={0.8}
        speed={4}
        roughness={0.05}
        metalness={0.9}
        envMapIntensity={2}
      />
    </mesh>
  )
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 48 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.04} />
      <directionalLight position={[6, 5, 4]}  intensity={2.5} color="#ffffff" />
      <directionalLight position={[-4, -3, -4]} intensity={0.7} color="#facc15" />
      <pointLight position={[2, 3, 2]} intensity={3} color="#facc15" distance={9} />
      <pointLight position={[-3, 0, 1]} intensity={1} color="#fff8dc" distance={7} />

      <MainBlob />
      <OrbitBlob />
      <SmallBlob />
      <CameraController />

      <Environment preset="warehouse" />

      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.55}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  )
}
