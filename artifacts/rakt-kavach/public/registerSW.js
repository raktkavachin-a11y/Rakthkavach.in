/* Rakt Kavach install worker: cache only the app shell and never cache authenticated API responses. */
const CACHE = 'rakt-kavach-shell-v1';
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(['/','/manifest.webmanifest','/favicon.svg']))));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => { if (event.request.method !== 'GET' || event.request.url.includes('/rest/v1/') || event.request.url.includes('/auth/')) return; event.respondWith(fetch(event.request).catch(() => caches.match(event.request))); });
