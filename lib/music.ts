// Generativ ambient fon musiqisi — Web Audio ilə sintez olunur, heç bir fayl yüklənmir.
// Yumşaq akkordlar (Cmaj7 → Am7 → Fmaj7 → G6) bir-birinə yavaş keçir.

const CHORDS = [
  [261.63, 329.63, 392.0, 493.88], // Cmaj7
  [220.0, 261.63, 329.63, 392.0], // Am7
  [174.61, 220.0, 261.63, 329.63], // Fmaj7
  [196.0, 246.94, 293.66, 329.63], // G6
];
const CHORD_SECONDS = 8;
export const MUSIC_EVENT = "music-change";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let step = 0;
let playing = false;

export const isMusicOn = () => playing;

function notify() {
  window.dispatchEvent(new Event(MUSIC_EVENT));
}

// Bir akkord: hər nota iki az fərqli kökləmədə osilyator — "canlı", geniş səs
function playChord(freqs: number[]) {
  if (!ctx || !master) return;
  const t = ctx.currentTime;
  const end = t + CHORD_SECONDS + 3;
  freqs.forEach((f, i) => {
    [-6, 6].forEach((cents) => {
      const osc = ctx!.createOscillator();
      const g = ctx!.createGain();
      osc.type = i === 0 ? "sine" : "triangle";
      osc.frequency.value = (i === 0 ? f / 2 : f) * Math.pow(2, cents / 1200);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(i === 0 ? 0.22 : 0.1, t + 2.5); // yavaş giriş
      g.gain.setValueAtTime(i === 0 ? 0.22 : 0.1, t + CHORD_SECONDS);
      g.gain.exponentialRampToValueAtTime(0.0001, end); // növbəti akkordla üst-üstə düşən çıxış
      osc.connect(g).connect(master!);
      osc.start(t);
      osc.stop(end + 0.1);
    });
  });
}

function loop() {
  playChord(CHORDS[step % CHORDS.length]);
  step++;
  timer = setTimeout(loop, CHORD_SECONDS * 1000);
}

export function startMusic() {
  if (playing || typeof window === "undefined") return;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1100;
  filter.Q.value = 0.4;
  // Filtrin tezliyi yavaş "nəfəs alır"
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.05;
  lfoGain.gain.value = 350;
  lfo.connect(lfoGain).connect(filter.frequency);
  lfo.start();
  master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, ctx.currentTime);
  master.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 3);
  master.connect(filter).connect(ctx.destination);
  playing = true;
  loop();
  notify();
}

export function stopMusic() {
  if (!playing || !ctx || !master) return;
  if (timer) clearTimeout(timer);
  const c = ctx;
  master.gain.cancelScheduledValues(c.currentTime);
  master.gain.setValueAtTime(master.gain.value, c.currentTime);
  master.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 1.2);
  setTimeout(() => c.close(), 1400);
  ctx = null;
  master = null;
  playing = false;
  notify();
}

export const toggleMusic = () => (playing ? stopMusic() : startMusic());

// Başqa tab-a keçəndə musiqi dayanır (arxa planda səs çalmasın)
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopMusic();
  });
}
