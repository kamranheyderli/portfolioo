// Sadə service worker: sayt offline da açılsın.
// HTML həmişə əvvəlcə şəbəkədən gəlir (yeni deploy dərhal görünsün), şəbəkə yoxdursa keşdən.
// /_next/static faylları hash-lidir və dəyişmir — onlar keşdən verilir.
const CACHE = "kh-v1";
const PRECACHE = ["/", "/cv"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match("/"))),
    );
    return;
  }

  const immutable = url.pathname.startsWith("/_next/static/") || /\.(?:jpg|png|webp|svg|woff2?)$/.test(url.pathname) || url.pathname.startsWith("/icons/");
  if (immutable) {
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          }),
      ),
    );
  }
});
