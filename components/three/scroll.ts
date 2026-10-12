// Səhifənin scroll irəliləyişi (0..1) — useFrame içində oxunur, re-render yoxdur.
export function getScrollProgress() {
  if (typeof window === "undefined") return 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? window.scrollY / max : 0;
}

// Bölmə sərhədlərinə görə irəliləyiş: 0 = hero, 1 = ikinci bölmə və s.
// Keçid yalnız sərhədin ətrafında (ekranın ~70%-i boyunca) baş verir.
export function getSectionProgress() {
  if (typeof window === "undefined") return 0;
  const sections = document.querySelectorAll<HTMLElement>("main > section");
  const mid = window.scrollY + window.innerHeight * 0.5;
  const zone = window.innerHeight * 0.35;
  let p = 0;
  for (let i = 1; i < sections.length; i++) {
    const top = sections[i].offsetTop;
    p += Math.min(Math.max((mid - (top - zone)) / (2 * zone), 0), 1);
  }
  return p;
}
