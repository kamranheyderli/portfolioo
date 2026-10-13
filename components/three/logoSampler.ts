// Loqoları hissəcik buludlarına çevirir. Həm Web Worker-də (OffscreenCanvas), həm də əsas thread-də işləyir.
import { ICONS } from "./icons";

type Ctx = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;
type Shape = { draw: (ctx: Ctx) => void; color: (u: number, v: number) => [number, number, number] };

const RES = 512; // nümunə götürmə çözünürlüyü
const SIZE = 4; // loqonun dünya ölçüsü
const EDGE_SHARE = 0.32; // hissəciklərin nə qədəri kənarlara düşür — konturlar kəskin görünsün

const hex = (h: string): [number, number, number] => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const mix = (a: number[], b: number[], t: number) => a.map((x, i) => x + (b[i] - x) * t) as [number, number, number];

// 24×24 rəsmi vektoru kətanın ortasına yerləşdirir
const icon = (path: string) => (ctx: Ctx) => {
  const s = (RES * 0.9) / 24;
  ctx.translate(RES * 0.05, RES * 0.05);
  ctx.scale(s, s);
  ctx.fill(new Path2D(path));
};

// Rəsmi HTML5 / CSS3 loqolarında qalxanın sağ yarısı açıq rəngdədir
const shield = (dark: string, light: string) => {
  const d = hex(dark), l = hex(light);
  return (u: number) => (u > 0.5 ? l : d);
};

const SHAPES: Shape[] = [
  { draw: icon(ICONS.react.path), color: () => hex(ICONS.react.color) },
  { draw: icon(ICONS.html.path), color: shield(ICONS.html.color, "#F16529") },
  { draw: icon(ICONS.css.path), color: shield(ICONS.css.color, "#33A9DC") },
  { draw: icon(ICONS.typescript.path), color: () => hex(ICONS.typescript.color) },
  { draw: icon(ICONS.javascript.path), color: () => hex(ICONS.javascript.color) },
  // </> — saytın öz qradiyenti ilə
  {
    draw: (ctx) => {
      ctx.lineWidth = RES * 0.075;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(RES * 0.3, RES * 0.24); ctx.lineTo(RES * 0.08, RES * 0.5); ctx.lineTo(RES * 0.3, RES * 0.76);
      ctx.moveTo(RES * 0.7, RES * 0.24); ctx.lineTo(RES * 0.92, RES * 0.5); ctx.lineTo(RES * 0.7, RES * 0.76);
      ctx.moveTo(RES * 0.58, RES * 0.16); ctx.lineTo(RES * 0.42, RES * 0.84);
      ctx.stroke();
    },
    color: (u) => (u < 0.5 ? mix(hex("#00d4ff"), hex("#7c5cff"), u * 2) : mix(hex("#7c5cff"), hex("#ff4d8d"), (u - 0.5) * 2)),
  },
];

export type LogoSet = { positions: Float32Array[]; colors: Float32Array[] };

function sample(shape: Shape, count: number, makeCtx: () => Ctx) {
  const ctx = makeCtx();
  ctx.clearRect(0, 0, RES, RES);
  ctx.save();
  ctx.fillStyle = ctx.strokeStyle = "#fff";
  shape.draw(ctx);
  ctx.restore();
  const { data } = ctx.getImageData(0, 0, RES, RES);

  const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < RES && y < RES && data[(y * RES + x) * 4 + 3] > 128;
  const fill: number[] = [];
  const edge: number[] = [];
  for (let y = 0; y < RES; y++) {
    for (let x = 0; x < RES; x++) {
      if (!inside(x, y)) continue;
      const i = y * RES + x;
      if (!inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1)) edge.push(i);
      else fill.push(i);
    }
  }

  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const edgeCount = Math.round(count * EDGE_SHARE);
  for (let i = 0; i < count; i++) {
    const pool = i < edgeCount || fill.length === 0 ? edge : fill;
    const idx = pool[(Math.random() * pool.length) | 0];
    const u = ((idx % RES) + Math.random()) / RES;
    const v = (Math.floor(idx / RES) + Math.random()) / RES;
    pos[i * 3] = (u - 0.5) * SIZE;
    pos[i * 3 + 1] = -(v - 0.5) * SIZE;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
    // Yüngül parlaqlıq fərqi — loqo düz rəngli "trafaret" kimi görünməsin
    const shade = 0.88 + Math.random() * 0.24;
    const c = shape.color(u, v);
    col[i * 3] = Math.min(1, c[0] * shade);
    col[i * 3 + 1] = Math.min(1, c[1] * shade);
    col[i * 3 + 2] = Math.min(1, c[2] * shade);
  }
  return { pos, col };
}

export function sampleLogos(count: number, makeCtx: () => Ctx): LogoSet {
  const positions: Float32Array[] = [];
  const colors: Float32Array[] = [];
  for (const shape of SHAPES) {
    const { pos, col } = sample(shape, count, makeCtx);
    positions.push(pos);
    colors.push(col);
  }
  return { positions, colors };
}

export const LOGO_COUNT = SHAPES.length;
export const LOGO_RES = RES;
