// AURIS Service Worker v1.9.4
const CACHE = 'auris-v1.9.4';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network first — keeps AURIS always atualizado
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
