// Mikro səs effektləri — Web Audio API ilə sintez olunur, heç bir audio fayl yüklənmir.
// Brauzer qaydasına görə səs yalnız istifadəçinin ilk toxunuşundan sonra başlayır.

export const SOUND_KEY = "sound";

export type SoundName = "click" | "key" | "enter" | "error" | "open" | "close" | "toggle" | "success" | "eat" | "gameover" | "powerup" | "powerdown";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled: boolean | null = null;
let retro = false;

// Retro rejimdə klik səsləri 8-bit (kvadrat dalğa) olur
export function setRetroSound(on: boolean) {
  retro = on;
}
const listeners = new Set<() => void>();

function readPref() {
  try {
    return localStorage.getItem(SOUND_KEY) !== "off";
  } catch {
    return true;
  }
}

export function isSoundOn() {
  if (enabled === null) enabled = typeof window !== "undefined" && readPref();
  return enabled;
}

export function setSoundOn(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(SOUND_KEY, on ? "on" : "off");
  } catch {}
  listeners.forEach((l) => l());
}

export function subscribeSound(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.18;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

// Qısa ton: tezlik başlanğıcdan sona sürüşür, səs sürətlə sönür
function tone(
  ac: AudioContext,
  { from, to = from, dur, type = "sine", gain = 1, at = 0 }:
  { from: number; to?: number; dur: number; type?: OscillatorType; gain?: number; at?: number },
) {
  const t = ac.currentTime + at;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(master!);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

// Klaviatura "tıqqıltısı" üçün qısa süzülmüş səs-küy
function noise(ac: AudioContext, { dur, freq, gain = 1 }: { dur: number; freq: number; gain?: number }) {
  const t = ac.currentTime;
  const buf = ac.createBuffer(1, Math.ceil(ac.sampleRate * dur), ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 3;
  const src = ac.createBufferSource();
  src.buffer = buf;
  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = freq;
  bp.Q.value = 1.2;
  const g = ac.createGain();
  g.gain.value = gain;
  src.connect(bp).connect(g).connect(master!);
  src.start(t);
}

export function play(name: SoundName, { force = false } = {}) {
  if (typeof window === "undefined" || (!force && !isSoundOn())) return;
  const ac = audio();
  if (!ac || !master) return;

  switch (name) {
    case "click":
      if (retro) tone(ac, { from: 880, to: 440, dur: 0.06, type: "square", gain: 0.12 });
      else tone(ac, { from: 1400, to: 700, dur: 0.05, type: "triangle", gain: 0.5 });
      break;
    case "powerup":
      [262, 330, 392, 523, 659, 784, 1047].forEach((f, i) =>
        tone(ac, { from: f, dur: 0.09, type: "square", gain: 0.13, at: i * 0.06 }),
      );
      break;
    case "powerdown":
      [784, 523, 392, 262].forEach((f, i) =>
        tone(ac, { from: f, dur: 0.1, type: "square", gain: 0.13, at: i * 0.07 }),
      );
      break;
    case "key":
      // Hər düymə bir az fərqli səslənsin
      noise(ac, { dur: 0.03, freq: 2600 + Math.random() * 1400, gain: 0.9 });
      break;
    case "enter":
      noise(ac, { dur: 0.05, freq: 1400, gain: 1 });
      tone(ac, { from: 420, to: 240, dur: 0.08, type: "sine", gain: 0.6 });
      break;
    case "error":
      tone(ac, { from: 190, to: 150, dur: 0.16, type: "square", gain: 0.12 });
      tone(ac, { from: 180, to: 140, dur: 0.16, type: "square", gain: 0.12, at: 0.12 });
      break;
    case "open":
      tone(ac, { from: 300, to: 900, dur: 0.18, type: "sine", gain: 0.35 });
      break;
    case "close":
      tone(ac, { from: 900, to: 280, dur: 0.16, type: "sine", gain: 0.3 });
      break;
    case "toggle":
      tone(ac, { from: 660, dur: 0.07, type: "triangle", gain: 0.45 });
      tone(ac, { from: 990, dur: 0.09, type: "triangle", gain: 0.45, at: 0.07 });
      break;
    case "eat":
      tone(ac, { from: 880, to: 1760, dur: 0.08, type: "square", gain: 0.12 });
      break;
    case "gameover":
      [392, 330, 262, 196].forEach((f, i) =>
        tone(ac, { from: f, to: f * 0.97, dur: 0.18, type: "triangle", gain: 0.4, at: i * 0.13 }),
      );
      break;
    case "success":
      // C5 – E5 – G5 – C6 arpeciosu
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        tone(ac, { from: f, dur: 0.35, type: "sine", gain: 0.4, at: i * 0.09 }),
      );
      break;
  }
}
