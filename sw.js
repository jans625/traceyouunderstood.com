// TRACE service worker.
// Scope note: this file sits at the site root, so its scope covers every page.
// It must therefore only ever answer requests for the app's own files. Anything
// else (the website, the brand documents) is left entirely to the network, so
// those pages are never served stale from cache.
const CACHE = "trace-v3";
const ASSETS = [
  "trace-app.html",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "favicon.svg"
];

const OWNED = ASSETS.map((a) => new URL(a, self.registration.scope).href);

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = e.request.url.split("?")[0];
  if (!OWNED.includes(url)) return; // not ours: go straight to the network

  e.respondWith(
    caches.match(e.request).then((hit) =>
      hit || fetch(e.request).then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
    )
  );
});
