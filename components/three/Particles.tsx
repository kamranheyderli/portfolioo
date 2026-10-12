"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { isLight } from "./theme";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aScale;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.5 + position.x * 2.0) * 0.08;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * 18.0 * uPixelRatio / -mv.z;
    vAlpha = smoothstep(18.0, 2.0, -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uLight;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    vec3 col = mix(vec3(0.85, 0.88, 1.0), vec3(0.4, 0.33, 0.75), uLight);
    gl_FragColor = vec4(col, a * vAlpha * mix(0.8, 0.55, uLight));
  }
`;

export default function Particles({ count = 2500 }: { count?: number }) {
  const points = useRef<THREE.Points>(null!);
  const material = useRef<THREE.ShaderMaterial>(null!);

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) - 4;
      sc[i] = Math.random() * 0.8 + 0.2;
    }
    return [pos, sc];
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLight: { value: 0 },
      uPixelRatio: { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1 },
    }),
    []
  );

  useFrame((state, delta) => {
    const u = material.current.uniforms;
    u.uTime.value += delta;
    const light = isLight();
    u.uLight.value = THREE.MathUtils.lerp(u.uLight.value, light ? 1 : 0, 0.1);
    material.current.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    points.current.rotation.y += delta * 0.02;
    points.current.rotation.x = THREE.MathUtils.lerp(points.current.rotation.x, state.pointer.y * 0.1, 0.05);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
