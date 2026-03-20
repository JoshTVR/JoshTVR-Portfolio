'use client'

import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, Center, Html } from '@react-three/drei'
import * as THREE from 'three'

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow    = true
      child.receiveShadow = true
    }
  })
  return (
    <Center>
      <primitive object={scene} dispose={null} />
    </Center>
  )
}

function Loader() {
  return (
    <Html center>
      <div style={{
        color: 'var(--accent)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <div style={{
          width: '16px', height: '16px',
          border: '2px solid rgba(250,204,21,0.3)',
          borderTopColor: '#facc15',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        Loading model…
      </div>
    </Html>
  )
}

interface ModelViewerProps {
  /** URL of the .glb or .gltf file (put in /public) */
  url: string
  height?: number
  autoRotate?: boolean
  className?: string
}

export function ModelViewer({ url, height = 420, autoRotate = true, className }: ModelViewerProps) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: `${height}px`,
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'var(--glass-bg)',
        border: 'var(--glass-border)',
        backdropFilter: 'blur(14px)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        shadows
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
        <pointLight position={[-5, 4, 4]} intensity={0.6} color="#facc15" />

        <Suspense fallback={<Loader />}>
          <Model url={url} />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={2.5}
          enableZoom
          enablePan={false}
          minDistance={1.5}
          maxDistance={10}
        />
      </Canvas>
    </div>
  )
}
