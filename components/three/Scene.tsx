"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
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
  return (
    <div className="canvas-wrap" aria-hidden>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, mobile ? 1.5 : 2]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <LogoMorph />
          <Particles count={mobile ? 1200 : 2500} />
          <CameraRig />
        </Suspense>
      </Canvas>
    </div>
  );
}
