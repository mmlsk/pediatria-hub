/* Service Worker dla Pediatria V Hub */
const CACHE_NAME = 'pediatria-hub-v14';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/hub.css',
  './js/meta.js',
  './js/questions.js',
  './js/app.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',

  // Moduł 1: Ból brzucha
  './atlasy/atlas-bol-brzucha/index.html',
  './atlasy/atlas-bol-brzucha/app.js',
  './atlasy/atlas-bol-brzucha/style.css',

  // Moduł 2: Zakażenia u dzieci
  './atlasy/modul-2-zakazenia/index.html',
  './atlasy/modul-2-zakazenia/app.js',
  './atlasy/modul-2-zakazenia/data.js',
  './atlasy/modul-2-zakazenia/style.css',

  // Moduł 11: Nowotwory krwiotwórcze i chłonne
  './atlasy/modul-11-hemato-onko/index.html',
  './atlasy/modul-11-hemato-onko/app.js',
  './atlasy/modul-11-hemato-onko/style.css',

  // Moduł 12-13: Skazy, niedokrwistości, odporność
  './atlasy/modul-12-13-skazy-niedokrwistosci-odpornosc/index.html',
  './atlasy/modul-12-13-skazy-niedokrwistosci-odpornosc/app.js',
  './atlasy/modul-12-13-skazy-niedokrwistosci-odpornosc/style.css',
  './atlasy/modul-12-13-skazy-niedokrwistosci-odpornosc/tasks.js',

  // Moduł 3, 6, 7, 8: Gastro i alergie
  './atlasy/modul-3-6-7-8-gastro-alergologia/index.html',
  './atlasy/modul-3-6-7-8-gastro-alergologia/app.js',
  './atlasy/modul-3-6-7-8-gastro-alergologia/data.js',
  './atlasy/modul-3-6-7-8-gastro-alergologia/style.css',

  // Moduł 4, 14, 15: Nefrologia
  './atlasy/modul-4-14-15-nefrologia/index.html',
  './atlasy/modul-4-14-15-nefrologia/app.js',
  './atlasy/modul-4-14-15-nefrologia/data.js',
  './atlasy/modul-4-14-15-nefrologia/style.css',

  // Moduł 5: Stany nagłe
  './atlasy/modul-5-stany-nagle/index.html',
  './atlasy/modul-5-stany-nagle/app.js',
  './atlasy/modul-5-stany-nagle/data.js',
  './atlasy/modul-5-stany-nagle/style.css',

  // Moduł 9: Guzy mózgu
  './atlasy/modul-9-guzy-mozgu/index.html',
  './atlasy/modul-9-guzy-mozgu/app.js',
  './atlasy/modul-9-guzy-mozgu/data.js',
  './atlasy/modul-9-guzy-mozgu/style.css',

  // Moduł 10: Nowotwory lite
  './atlasy/nowotwory-lite-modul-10/index.html',
  './atlasy/nowotwory-lite-modul-10/app.js',
  './atlasy/nowotwory-lite-modul-10/style.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Zasoby lokalne oraz czcionki Fontshare/Google Fonts
  const isSameOrigin = url.origin === self.location.origin;
  const isFont = url.hostname.includes('fontshare.com') || url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com');

  if (isSameOrigin || isFont) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        // Stale-While-Revalidate dla zasobów lokalnych i czcionek
        const fetchPromise = fetch(request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // W przypadku błędu sieci (offline) i braku w cache nawigacji - fallback do index.html
          if (request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });

        return cachedResponse || fetchPromise;
      })
    );
  }
});
