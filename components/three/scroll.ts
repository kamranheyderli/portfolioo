// Scroll irəliləyişi — useFrame içində hər kadrda oxunur, re-render yoxdur.
// Bölmələrin mövqeyi keşlənir və yalnız səhifənin ölçüsü dəyişəndə yenidən ölçülür,
// yoxsa hər kadrda querySelectorAll + offsetTop brauzeri layout hesablamağa məcbur edir.

let tops: number[] | null = null;
let maxScroll = 0;
let watching = false;

function invalidate() {
  tops = null;
}

function measure() {
  if (!watching) {
    watching = true;
    window.addEventListener("resize", invalidate, { passive: true });
    // Şriftlər, şəkillər və ya dil dəyişəndə səhifənin hündürlüyü dəyişir
    new ResizeObserver(invalidate).observe(document.body);
  }
  tops = Array.from(document.querySelectorAll<HTMLElement>("main > section"), (s) => s.offsetTop);
  maxScroll = document.documentElement.scrollHeight - window.innerHeight;
}

// Səhifənin scroll irəliləyişi (0..1)
export function getScrollProgress() {
  if (typeof window === "undefined") return 0;
  if (!tops) measure();
  return maxScroll > 0 ? window.scrollY / maxScroll : 0;
}

// Bölmə sərhədlərinə görə irəliləyiş: 0 = hero, 1 = ikinci bölmə və s.
// Keçid yalnız sərhədin ətrafında (ekranın ~70%-i boyunca) baş verir.
export function getSectionProgress() {
  if (typeof window === "undefined") return 0;
  if (!tops) measure();
  const mid = window.scrollY + window.innerHeight * 0.5;
  const zone = window.innerHeight * 0.35;
  let p = 0;
  for (let i = 1; i < tops!.length; i++) {
    p += Math.min(Math.max((mid - (tops![i] - zone)) / (2 * zone), 0), 1);
  }
  return p;
}
