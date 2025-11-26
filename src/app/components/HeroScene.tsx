"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Função auxiliar para gerar pontos aleatórios em uma esfera (Substitui o maath)
function generateSpherePositions(count: number, radius: number) {
  const positions = new Float32Array(count * 3); // x, y, z para cada ponto

  for (let i = 0; i < count; i++) {
    // Algoritmo para distribuição uniforme dentro da esfera
    const r = radius * Math.cbrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  return positions;
}

function Particles(props: object) {
  const ref = useRef<THREE.Points>(null);

  // useMemo garante que o cálculo só rode uma vez e não trave a renderização
  const sphere = useMemo(() => generateSpherePositions(3000, 1.3), []);

  useFrame((state, delta) => {
    if (ref.current) {
      // Rotação suave contínua
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#4CAF9A" // Sua cor --primary-strong
          size={0.004} // Tamanho da partícula
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

interface HeroSceneProps {
  className?: string;
}

export default function HeroScene({ className }: HeroSceneProps) {
  return (
    <div className={`absolute inset-0 z-0 sm:relative sm:h-[500px] sm:w-full h-[300px] ${className || ""}`}>
      <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <Particles />
      </Canvas>
    </div>
  );
}