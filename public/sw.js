const CACHE = "checkpoint-desk-v3";
const SHELL = [
  "/",
  "/index.html",
  "/privacy",
  "/terms",
  "/demo",
  "/404",
  "/404.html",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/assets/checkpoint-cassette-768.avif",
  "/assets/checkpoint-cassette-1280.avif",
  "/assets/checkpoint-cassette-768.webp",
  "/assets/checkpoint-cassette-1280.webp",
  "/assets/checkpoint-cassette-1280.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (response.ok && new URL(event.request.url).origin === self.location.origin) {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => event.request.mode === "navigate" ? caches.match("/index.html") : undefined))
  );
});
