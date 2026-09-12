// Service Worker בסיסי לכספת — מאפשר התקנה כ-PWA ועבודה אופליין בסיסית.
// כל הנתונים עצמם (הכספת המוצפנת) חיים ב-localStorage של הדפדפן ולא כאן.

const CACHE_NAME = 'kaspa-vault-cache-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first עבור הקבצים הסטטיים של האפליקציה; הכל אחר עובר לרשת כרגיל.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => cached);
    })
  );
});
