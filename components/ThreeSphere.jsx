'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere, Environment } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedSphere() {
  const meshRef = useRef()
  const matRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2
    meshRef.current.rotation.y = t * 0.15
    meshRef.current.rotation.z = Math.cos(t * 0.2) * 0.1
    if (matRef.current) {
      matRef.current.distort = 0.3 + Math.sin(t * 0.5) * 0.15
    }
    // Mouse parallax
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      state.mouse.x * 0.4,
      0.05
    )
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      state.mouse.y * 0.3,
      0.05
    )
  })

  return (
    <Sphere ref={meshRef} args={[1.6, 128, 128]}>
      <MeshDistortMaterial
        ref={matRef}
        color="#8B5E3C"
        envMapIntensity={2}
        clearcoat={1}
        clearcoatRoughness={0}
        metalness={0.1}
        roughness={0.1}
        distort={0.3}
        speed={1.5}
      />
    </Sphere>
  )
}

function Particles() {
  const count = 120
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  const pointsRef = useRef()
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.elapsedTime * 0.04
      pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.03) * 0.1
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#C9A96E"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

export default function ThreeSphere() {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 4.5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#C9A96E" />
      <directionalLight position={[-5, -3, -5]} intensity={0.4} color="#D4847A" />
      <pointLight position={[0, 3, 2]} intensity={0.8} color="#F0ECE3" />
      <AnimatedSphere />
      <Particles />
      <Environment preset="city" />
    </Canvas>
  )
}
