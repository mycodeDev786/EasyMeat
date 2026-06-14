'use client';
import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function MeatCut() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} castShadow scale={1.5}>
        <torusGeometry args={[1, 0.45, 64, 64]} />
        <MeshDistortMaterial color="#8B2020" roughness={0.3} metalness={0.2} distort={0.25} speed={2} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} scale={2.3}>
        <torusGeometry args={[1, 0.018, 16, 100]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.6} />
      </mesh>
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const r = 2.6 + (i % 3) * 0.2;
        return (
          <Sphere key={i} position={[Math.cos(a) * r, Math.sin(i * 0.9) * 0.8, Math.sin(a) * r]} args={[0.025, 8, 8]}>
            <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={1.2} />
          </Sphere>
        );
      })}
    </group>
  );
}

function Particles() {
  return (
    <group>
      {Array.from({ length: 60 }).map((_, i) => (
        <Sphere
          key={i}
          position={[(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12]}
          args={[0.012, 4, 4]}
        >
          <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.8} />
        </Sphere>
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#D4AF37" />
          <pointLight position={[-10, -10, -10]} intensity={0.6} color="#8B2020" />
          <spotLight position={[0, 12, 0]} angle={0.3} penumbra={1} intensity={2} />
          <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
            <MeatCut />
          </Float>
          <Particles />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
