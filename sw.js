/* ===== SERVICE WORKER — Beast Mode 90 ===== */
const CACHE_NAME = 'bm90-v3';
const ASSETS = [
  './',
  './index.html',
  './css/main.css',
  './css/components.css',
  './css/animations.css',
  './js/data.js',
  './js/habits.js',
  './js/dashboard.js',
  './js/body.js',
  './js/money.js',
  './js/mind.js',
  './js/weekly.js',
  './js/progress.js',
  './js/settings.js',
  './js/app.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (!resp || resp.status !== 200 || resp.type === 'opaque') return resp;
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return resp;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
