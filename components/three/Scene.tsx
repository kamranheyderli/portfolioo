"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useState } from "react";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import LogoMorph from "./LogoMorph";
import Particles from "./Particles";
import { getScrollProgress } from "./scroll";

function CameraRig() {
  useFrame((state) => {
    const p = getScrollProgress();
    const target = new THREE.Vector3(state.pointer.x * 0.4, state.pointer.y * 0.3 - p * 0.5, 6);
    state.camera.position.lerp(target, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Scene() {
  const mobile = useMemo(() => window.innerWidth < 768, []);
  // Retina ekranda 2x əvəzinə 1.5x — fərq gözə çarpmır, çəkilən piksel sayı ~45% azalır.
  // Cihaz kadrları çatdıra bilməsə, çözünürlük avtomatik 1x-ə enir.
  const maxDpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5);
  const [dpr, setDpr] = useState(maxDpr);
  return (
    <div className="canvas-wrap" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={dpr}
        // Səhnədə yalnız hissəciklər və nazik xətlər var — MSAA antialiasing lazım deyil
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        // Production-da shader yoxlamasını söndürürük: o, kompilyasiyanı sinxron gözləyir və açılışı bloklayır
        onCreated={({ gl }) => {
          gl.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
        }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(maxDpr)} flipflops={3} onFallback={() => setDpr(1)} />
        <Suspense fallback={null}>
          <LogoMorph />
          <Particles count={mobile ? 1200 : 2500} />
          <CameraRig />
        </Suspense>
      </Canvas>
    </div>
  );
}
