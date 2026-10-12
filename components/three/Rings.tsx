"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// Loqonun ətrafında fırlanan nazik orbit halqaları
export default function Rings() {
  const group = useRef<THREE.Group>(null!);
  useFrame((state, delta) => {
    group.current.rotation.z += delta * 0.05;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 1.1 + state.pointer.y * 0.2, 0.05);
  });

  return (
    <group ref={group}>
      {[2.55, 2.95].map((r, i) => (
        <Float key={r} speed={1 + i * 0.5} rotationIntensity={0.4} floatIntensity={0.3}>
          <mesh rotation={[0, i * 0.4, i * 0.3]}>
            <torusGeometry args={[r, 0.008, 8, 160]} />
            <meshBasicMaterial color={["#7c5cff", "#00d4ff"][i]} transparent opacity={0.3} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}
