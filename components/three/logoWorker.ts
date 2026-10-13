// Loqo hissəciklərini əsas thread-i bloklamadan hazırlayır
import { LOGO_RES, sampleLogos } from "./logoSampler";

self.onmessage = (e: MessageEvent<{ count: number }>) => {
  const canvas = new OffscreenCanvas(LOGO_RES, LOGO_RES);
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const set = sampleLogos(e.data.count, () => ctx);
  const buffers = [...set.positions, ...set.colors].map((a) => a.buffer);
  (self as unknown as Worker).postMessage(set, buffers);
};
