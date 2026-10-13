"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { play } from "@/lib/sound";
import * as THREE from "three";
import { getSectionProgress } from "./scroll";
import { isLight } from "./theme";
import Rings from "./Rings";
import { LOGO_RES, sampleLogos, type LogoSet } from "./logoSampler";

// Daha çox, amma daha kiçik hissəcik — konturlar kəskin görünsün. Mobildə yarısı.
const COUNT = typeof window !== "undefined" && window.innerWidth < 768 ? 5000 : 14000;

// Toxunma ekranında Lenis yoxdur: scroll barmağın hər hərəkətini birbaşa ötürür.
// Loqonun keçidini orada daha güclü yumşaldırıq ki, morph sıçrayışla yox, hamar getsin.
// (1 saniyədə qalan fərq: desktop 0.2%, toxunma 6% — yəni ~0.16 s və ~0.36 s zaman sabiti)
const TOUCH = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
const SMOOTHING = TOUCH ? 0.06 : 0.002;

// Loqolar Web Worker-də hazırlanır; dəstəklənmirsə, brauzer boş olanda əsas thread-də
function loadLogos(count: number): Promise<LogoSet> {
  if (typeof Worker !== "undefined" && typeof OffscreenCanvas !== "undefined") {
    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL("./logoWorker.ts", import.meta.url));
      worker.onmessage = (e: MessageEvent<LogoSet>) => {
        resolve(e.data);
        worker.terminate();
      };
      worker.onerror = (err) => {
        worker.terminate();
        reject(err);
      };
      worker.postMessage({ count });
    }).catch(() => loadOnMainThread(count)) as Promise<LogoSet>;
  }
  return loadOnMainThread(count);
}

function loadOnMainThread(count: number): Promise<LogoSet> {
  return new Promise((resolve) => {
    const run = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = LOGO_RES;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      resolve(sampleLogos(count, () => ctx));
    };
    if ("requestIdleCallback" in window) requestIdleCallback(run, { timeout: 1500 });
    else setTimeout(run, 200);
  });
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  uniform vec3 uMouse;
  uniform float uReveal;
  uniform float uBurst;
  uniform vec3 uBurstAt;
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
    // İlk görünüşdə hissəciklər dağınıq vəziyyətdən yığılır
    float scatter = morph + (1.0 - uReveal) * 1.6;
    p += aRandom * scatter * 2.2;
    // Klik: hissəciklər klik nöqtəsindən kənara partlayır və yenidən yığılır
    vec3 away = p - uBurstAt;
    float near = 1.0 / (1.0 + dot(away.xy, away.xy) * 0.6);
    p += (normalize(away + 1e-4) * (0.8 + near * 1.6) + aRandom * 2.5) * uBurst;
    p += vec3(
      sin(uTime * 1.3 + aRandom.x * 20.0),
      cos(uTime * 1.1 + aRandom.y * 20.0),
      sin(uTime * 0.9 + aRandom.z * 20.0)
    ) * (0.012 + morph * 0.25);

    // Maus hissəcikləri itələyir
    vec2 diff = p.xy - uMouse.xy;
    float d = length(diff);
    p.xy += normalize(diff + 1e-4) * smoothstep(0.9, 0.0, d) * 0.55;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (0.75 + aRandom.x * 0.3 + morph * 0.9) * 17.0 * uPixelRatio / -mv.z;
    vAlpha = (0.8 - morph * 0.35) * uReveal;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uLight;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    // Kəskin, amma yumşaq kənarlı dairə
    float a = smoothstep(0.5, 0.32, d);
    // Light rejimdə rənglər bir az tündləşir ki, ağ fonda görünsün
    vec3 col = mix(vColor * 1.08, vColor * 0.78, uLight);
    gl_FragColor = vec4(col, a * vAlpha * (1.0 + uLight * 0.15));
  }
`;

// Hər bölmə üçün mövqe və ölçü — sıra main-dəki bölmələrin sırası ilə eyni olmalıdır
const stops = [
  { x: 2.35, y: -0.05, s: 0.72 }, // hero
  { x: 0.4, y: 1.45, s: 0.32 }, // about
  { x: -2.5, y: 0, s: 0.62 },   // experience
  { x: 2.65, y: 1.3, s: 0.38 },  // skills
  { x: -2.6, y: -0.6, s: 0.36 }, // contact (formanın solunda)
];

const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const hit = new THREE.Vector3();
const clickHit = new THREE.Vector3();
const ndc = new THREE.Vector2();
const target = new THREE.Vector3();

export default function LogoMorph() {
  const group = useRef<THREE.Group>(null!);
  const material = useRef<THREE.ShaderMaterial>(null!);

  const [logos, setLogos] = useState<LogoSet | null>(null);
  useEffect(() => {
    let alive = true;
    loadLogos(COUNT).then((set) => alive && setLogos(set));
    return () => {
      alive = false;
    };
  }, []);

  const geometry = useMemo(() => {
    if (!logos) return null;
    const g = new THREE.BufferGeometry();
    logos.positions.forEach((pos, i) => {
      g.setAttribute(i === 0 ? "position" : `aPos${i}`, new THREE.BufferAttribute(pos, 3));
      g.setAttribute(`aCol${i}`, new THREE.BufferAttribute(logos.colors[i], 3));
    });
    const rnd = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT * 3; i++) rnd[i] = Math.random() - 0.5;
    g.setAttribute("aRandom", new THREE.BufferAttribute(rnd, 3));
    return g;
  }, [logos]);
  useEffect(() => () => geometry?.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uMouse: { value: new THREE.Vector3(99, 99, 0) },
      uLight: { value: 0 },
      uReveal: { value: 0 },
      uBurst: { value: 0 },
      uBurstAt: { value: new THREE.Vector3() },
    }),
    []
  );

  // Loqoya klik — "click" istifadə olunur ki, telefonda scroll başlayanda təsadüfən partlamasın
  const { gl, camera, raycaster } = useThree();
  useEffect(() => {
    const el = gl.domElement;
    const onClick = (e: MouseEvent) => {
      const mat = material.current;
      if (!mat || !group.current) return;
      const rect = el.getBoundingClientRect();
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      plane.constant = -group.current.position.z;
      if (!raycaster.ray.intersectPlane(plane, clickHit)) return;
      group.current.worldToLocal(clickHit);
      // Yalnız loqonun özünə (lokal koordinatda ~2 radius) klik sayılır
      if (Math.hypot(clickHit.x, clickHit.y) > 2.1) return;
      mat.uniforms.uBurstAt.value.copy(clickHit);
      mat.uniforms.uBurst.value = 1;
      play("burst");
    };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [gl, camera, raycaster]);

  useFrame((state, delta) => {
    const p = Math.min(getSectionProgress(), stops.length - 1);
    const i = Math.min(Math.floor(p), stops.length - 2);
    const f = THREE.MathUtils.smoothstep(p - i, 0, 1);
    const from = stops[i];
    const to = stops[i + 1];
    const lerp = THREE.MathUtils.lerp;
    const k = 1 - Math.pow(SMOOTHING, delta);

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

    // Material loqolar hazır olandan sonra yaranır; mövqe isə ondan əvvəl də hesablanır ki, sıçrayış olmasın
    const mat = material.current;
    if (!mat) return;
    // Materialın öz uniform-larını yeniləyirik (StrictMode useMemo-nu iki dəfə çağıra bilər)
    const u = mat.uniforms;
    u.uReveal.value = Math.min(1, u.uReveal.value + delta * 0.7);
    // Partlayış ~1 saniyəyə sönür
    u.uBurst.value *= Math.pow(0.015, delta);

    const light = isLight();
    u.uLight.value = lerp(u.uLight.value, light ? 1 : 0, k);
    // Ağ fonda additive qarışdırma görünmür, adi qarışdırmaya keçirik
    mat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    u.uTime.value = t;
    // Nöqtə ölçüsü səhnənin real çözünürlüyünə uyğun olsun (adaptiv DPR dəyişəndə də)
    u.uPixelRatio.value = state.gl.getPixelRatio();
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
      {geometry && (
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
      )}
      <Rings />
    </group>
  );
}
