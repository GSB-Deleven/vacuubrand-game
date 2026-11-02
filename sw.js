'use strict';
// Service Worker: macht die Online-Version offline-fähig (z. B. Tablet am Stand ohne WLAN).
// Bei jeder neuen Version VERSION erhöhen, damit Tablets die neuen Dateien holen.
// Hinweis: Der Cache-Name behält absichtlich den alten Namen "vakuumus" (Professor heisst jetzt Vacuumus).
// Nur die Nummer hochzählen, damit installierte Tablets sauber aktualisieren.
const VERSION = 'vakuumus-v13';
const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'js/lib/qrcode.js',
  'js/config.js',
  'js/i18n.js',
  'js/util.js',
  'js/font.js',
  'js/sprites.js',
  'js/sound.js',
  'js/input.js',
  'js/touch.js',
  'js/storage.js',
  'js/level.js',
  'js/entities.js',
  'js/game.js',
  'js/scenes.js',
  'js/referenzdaten.js',
  'js/ui.js',
  'js/main.js',
  'assets/vacuubrand-logo.png',
  'assets/icon-192.png',
  'assets/icon-512.png',
];

self.addEventListener('install', e => {
  // cache: 'reload' holt jede Datei frisch vom Server. Sonst könnte der Browser-Zwischenspeicher
  // (GitHub Pages: 10 Minuten) alte Dateien in den neuen Cache legen.
  e.waitUntil(caches.open(VERSION)
    .then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Zuerst aus dem Cache (schnell, offline), im Hintergrund aktualisieren
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(VERSION).then(cache =>
    cache.match(e.request, { ignoreSearch: true }).then(hit => {
      const net = fetch(e.request.url, { cache: 'no-cache' }).then(res => {
        if (res && res.ok) cache.put(e.request, res.clone());
        return res;
      }).catch(() => hit);
      return hit || net;
    })));
});
