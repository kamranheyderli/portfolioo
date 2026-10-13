"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { damp } from "./damp";
import { ACCENT_EVENT } from "@/lib/accent";

// Loqonun ətrafında fırlanan nazik orbit halqaları
export default function Rings() {
  const group = useRef<THREE.Group>(null!);
  const mats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  // Halqalar saytın seçilmiş rəng palitrasını (--c1, --c2) izləyir
  useEffect(() => {
    const apply = () => {
      const css = getComputedStyle(document.documentElement);
      ["--c1", "--c2"].forEach((v, i) => mats.current[i]?.color.set(css.getPropertyValue(v).trim() || "#7c5cff"));
    };
    apply();
    const mo = new MutationObserver(apply); // tema dəyişəndə (data-theme)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-accent"] });
    addEventListener(ACCENT_EVENT, apply);
    return () => {
      mo.disconnect();
      removeEventListener(ACCENT_EVENT, apply);
    };
  }, []);

  useFrame((state, delta) => {
    group.current.rotation.z += delta * 0.05;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 1.1 + state.pointer.y * 0.2, damp(0.05, delta));
  });

  return (
    <group ref={group}>
      {[2.55, 2.95].map((r, i) => (
        <Float key={r} speed={1 + i * 0.5} rotationIntensity={0.4} floatIntensity={0.3}>
          <mesh rotation={[0, i * 0.4, i * 0.3]}>
            <torusGeometry args={[r, 0.008, 8, 160]} />
            <meshBasicMaterial ref={(m) => { mats.current[i] = m; }} color={["#7c5cff", "#00d4ff"][i]} transparent opacity={0.3} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}
