'use client';
import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function MeatCut() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
  });

  return (
    <group>
      {/* Main meat shape - distorted torus as abstract premium cut */}
      <mesh ref={meshRef} castShadow position={[0, 0, 0]} scale={1.5}>
        <torusGeometry args={[1, 0.5, 64, 64]} />
        <MeshDistortMaterial
          color="#8B2020"
          roughness={0.3}
          metalness={0.1}
          distort={0.3}
          speed={2}
        />
      </mesh>

      {/* Gold ring effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={2.2}>
        <torusGeometry args={[1, 0.02, 16, 100]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.5} />
      </mesh>

      {/* Particles around the meat */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 2.5 + Math.random() * 0.5;
        return (
          <Sphere
            key={i}
            position={[
              Math.cos(angle) * radius,
              (Math.random() - 0.5) * 2,
              Math.sin(angle) * radius,
            ]}
            args={[0.03, 8, 8]}
          >
            <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={1} />
          </Sphere>
        );
      })}
    </group>
  );
}

function FloatingParticles() {
  const count = 50;
  const positions = Array.from({ length: count }, () => [
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
  ]);

  return (
    <group>
      {positions.map((pos, i) => (
        <Sphere key={i} position={pos as [number, number, number]} args={[0.015, 4, 4]}>
          <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.8} />
        </Sphere>
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        shadows
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#D4AF37" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B2020" />
          <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={2} castShadow />

          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <MeatCut />
          </Float>

          <FloatingParticles />

          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
