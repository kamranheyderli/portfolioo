"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getSectionProgress } from "./scroll";
import { isLight } from "./theme";
import Rings from "./Rings";

// Mobil cihazlarda daha az hissəcik
const COUNT = typeof window !== "undefined" && window.innerWidth < 768 ? 5500 : 9000;
const RES = 400; // nümunə götürmək üçün canvas ölçüsü
const SIZE = 4; // loqonun dünya ölçüsü

type Draw = (ctx: CanvasRenderingContext2D) => void;

const shield = (ctx: CanvasRenderingContext2D, dark: string, light: string, digit: string) => {
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.moveTo(71, 460); ctx.lineTo(30, 0); ctx.lineTo(481, 0); ctx.lineTo(440, 460); ctx.lineTo(256, 512);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = light;
  ctx.beginPath();
  ctx.moveTo(256, 472); ctx.lineTo(405, 431); ctx.lineTo(440, 37); ctx.lineTo(256, 37);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 330px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(digit, 256, 270);
};

// Hər bölmə üçün bir loqo (sıra scroll sırasıdır): hero, about, experience, lab, skills, contact
const logos: Draw[] = [
  // React
  (ctx) => {
    ctx.strokeStyle = "#61dafb";
    ctx.fillStyle = "#61dafb";
    ctx.lineWidth = 18;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.ellipse(256, 256, 236, 90, (i * Math.PI) / 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(256, 256, 44, 0, Math.PI * 2); ctx.fill();
  },
  // HTML5
  (ctx) => shield(ctx, "#e34f26", "#ff7a45", "5"),
  // CSS3
  (ctx) => shield(ctx, "#1572b6", "#33a9dc", "3"),
  // TypeScript
  (ctx) => {
    ctx.fillStyle = "#3178c6";
    ctx.fillRect(40, 40, 432, 432);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 210px Arial, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("TS", 450, 440);
  },
  // JavaScript — çərçivə və hərflər
  (ctx) => {
    ctx.strokeStyle = "#f7df1e";
    ctx.fillStyle = "#f7df1e";
    ctx.lineWidth = 28;
    ctx.strokeRect(54, 54, 404, 404);
    ctx.font = "900 230px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("JS", 256, 270);
  },
  // </>
  (ctx) => {
    const g = ctx.createLinearGradient(40, 0, 472, 0);
    g.addColorStop(0, "#00d4ff");
    g.addColorStop(0.5, "#7c5cff");
    g.addColorStop(1, "#ff4d8d");
    ctx.fillStyle = g;
    ctx.font = "900 250px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("</>", 256, 266, 470);
  },
];

function sampleLogo(draw: Draw) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = RES;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.save();
  ctx.scale(RES / 512, RES / 512);
  ctx.translate(256, 256);
  ctx.scale(0.88, 0.88);
  ctx.translate(-256, -256);
  draw(ctx);
  ctx.restore();

  const { data } = ctx.getImageData(0, 0, RES, RES);
  const filled: number[] = [];
  for (let i = 0; i < RES * RES; i++) {
    const o = i * 4;
    const lum = data[o] * 0.3 + data[o + 1] * 0.59 + data[o + 2] * 0.11;
    if (data[o + 3] > 128 && lum > 40) {
      filled.push(i);
      // Ağ hissələr (rəqəmlər) daha sıx olsun ki, oxunsun
      const white = data[o] > 220 && data[o + 1] > 220 && data[o + 2] > 220;
      if (white) filled.push(i, i, i);
    }
  }

  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const idx = filled[(Math.random() * filled.length) | 0];
    const px = (idx % RES) + Math.random();
    const py = Math.floor(idx / RES) + Math.random();
    pos[i * 3] = (px / RES - 0.5) * SIZE;
    pos[i * 3 + 1] = -(py / RES - 0.5) * SIZE;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    col[i * 3] = data[idx * 4] / 255;
    col[i * 3 + 1] = data[idx * 4 + 1] / 255;
    col[i * 3 + 2] = data[idx * 4 + 2] / 255;
  }
  return { pos, col };
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  uniform vec3 uMouse;
  attribute vec3 aPos1; attribute vec3 aPos2; attribute vec3 aPos3; attribute vec3 aPos4; attribute vec3 aPos5;
  attribute vec3 aCol0; attribute vec3 aCol1; attribute vec3 aCol2; attribute vec3 aCol3; attribute vec3 aCol4; attribute vec3 aCol5;
  attribute vec3 aRandom;
  varying vec3 vColor;
  varying float vAlpha;

  float w(float k) { return max(0.0, 1.0 - abs(uProgress - k)); }

  void main() {
    float w0 = w(0.0), w1 = w(1.0), w2 = w(2.0), w3 = w(3.0), w4 = w(4.0), w5 = w(5.0);
    vec3 p = position * w0 + aPos1 * w1 + aPos2 * w2 + aPos3 * w3 + aPos4 * w4 + aPos5 * w5;
    vColor = aCol0 * w0 + aCol1 * w1 + aCol2 * w2 + aCol3 * w3 + aCol4 * w4 + aCol5 * w5;

    // Keçid zamanı hissəciklər partlayıb yenidən yığılır
    float morph = sin(fract(uProgress) * 3.14159);
    p += aRandom * morph * 2.2;
    p += vec3(
      sin(uTime * 1.3 + aRandom.x * 20.0),
      cos(uTime * 1.1 + aRandom.y * 20.0),
      sin(uTime * 0.9 + aRandom.z * 20.0)
    ) * (0.02 + morph * 0.25);

    // Maus hissəcikləri itələyir
    vec2 diff = p.xy - uMouse.xy;
    float d = length(diff);
    p.xy += normalize(diff + 1e-4) * smoothstep(0.9, 0.0, d) * 0.55;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (0.9 + aRandom.x * 0.5 + morph) * 26.0 * uPixelRatio / -mv.z;
    vAlpha = 0.85 - morph * 0.35;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uLight;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.1, d);
    // Light rejimdə rənglər tündləşir, ağ hissələr (rəqəmlər) tünd olur
    float white = smoothstep(0.8, 0.95, min(vColor.r, min(vColor.g, vColor.b)));
    vec3 lightCol = mix(vColor * 0.72, vec3(0.12, 0.11, 0.2), white);
    vec3 col = mix(vColor * 1.15, lightCol, uLight);
    gl_FragColor = vec4(col, a * vAlpha * (1.0 + uLight * 0.15));
  }
`;

// Hər bölmə üçün mövqe və ölçü
const stops = [
  { x: 2.35, y: -0.05, s: 0.72 }, // hero
  { x: 0.4, y: 1.45, s: 0.32 }, // about
  { x: -2.5, y: 0, s: 0.62 },   // experience
  { x: 2.75, y: 1.4, s: 0.3 },  // lab
  { x: 2.65, y: 1.3, s: 0.38 },  // skills
  { x: -2.6, y: -0.6, s: 0.36 }, // contact (formanın solunda)
];

const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const hit = new THREE.Vector3();
const target = new THREE.Vector3();

export default function LogoMorph() {
  const group = useRef<THREE.Group>(null!);
  const material = useRef<THREE.ShaderMaterial>(null!);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const sets = logos.map(sampleLogo);
    sets.forEach((s, i) => {
      g.setAttribute(i === 0 ? "position" : `aPos${i}`, new THREE.BufferAttribute(s.pos, 3));
      g.setAttribute(`aCol${i}`, new THREE.BufferAttribute(s.col, 3));
    });
    const rnd = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT * 3; i++) rnd[i] = Math.random() - 0.5;
    g.setAttribute("aRandom", new THREE.BufferAttribute(rnd, 3));
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uMouse: { value: new THREE.Vector3(99, 99, 0) },
      uLight: { value: 0 },
    }),
    []
  );

  useFrame((state, delta) => {
    // Materialın öz uniform-larını yeniləyirik (StrictMode useMemo-nu iki dəfə çağıra bilər)
    const u = material.current.uniforms;
    const p = Math.min(getSectionProgress(), stops.length - 1);
    const i = Math.min(Math.floor(p), stops.length - 2);
    const f = THREE.MathUtils.smoothstep(p - i, 0, 1);
    const from = stops[i];
    const to = stops[i + 1];
    const lerp = THREE.MathUtils.lerp;
    const k = 1 - Math.pow(0.002, delta);

    const mobile = state.viewport.width < 7;
    // Mobildə hero-da loqo mərkəzdə, sonrakı bölmələrdə yüngül yana sürüşür
    const xScale = mobile ? 0.25 * Math.min(p, 1) : 1;
    const back = mobile ? Math.min(p, 1) : 0;
    // Mobil hero-da loqo yuxarıda, mətn aşağıda olur
    const lift = mobile ? (1 - Math.min(p, 1)) * 1.2 : 0;
    target.set(lerp(from.x, to.x, f) * xScale, lerp(from.y, to.y, f) + lift, -back * 3);
    group.current.position.lerp(target, k);
    const s = lerp(from.s, to.s, f) * (mobile ? 0.7 : 1);
    group.current.scale.setScalar(lerp(group.current.scale.x, s, k));

    const t = state.clock.elapsedTime;
    group.current.rotation.y = lerp(group.current.rotation.y, Math.sin(t * 0.5) * 0.35 + state.pointer.x * 0.4, k);
    group.current.rotation.x = lerp(group.current.rotation.x, -state.pointer.y * 0.25, k);

    const light = isLight();
    u.uLight.value = lerp(u.uLight.value, light ? 1 : 0, k);
    // Ağ fonda additive qarışdırma görünmür, adi qarışdırmaya keçirik
    material.current.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    u.uTime.value = t;
    u.uProgress.value = lerp(u.uProgress.value, i + f, k);

    // Mausun loqo müstəvisindəki yeri (lokal koordinatda)
    plane.constant = -group.current.position.z;
    state.raycaster.setFromCamera(state.pointer, state.camera);
    if (state.raycaster.ray.intersectPlane(plane, hit)) {
      group.current.worldToLocal(hit);
      u.uMouse.value.lerp(hit, 0.2);
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
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
      <Rings />
    </group>
  );
}
