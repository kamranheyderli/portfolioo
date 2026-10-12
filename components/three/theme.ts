// Cari temanı birbaşa <html data-theme>-dən oxuyur (useFrame içində, re-render yoxdur)
export function isLight() {
  return typeof document !== "undefined" && document.documentElement.dataset.theme === "light";
}
