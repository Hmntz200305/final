// service-worker.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = "pwabuilder-page";
const OFFLINE_PAGE = "offline.html";

workbox.routing.registerRoute(
  new RegExp('/.*'),
  new workbox.strategies.NetworkFirst({
    cacheName: CACHE,
  })
);

self.addEventListener('install', (event) => {
  const preCache = async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll([OFFLINE_PAGE]);
    await self.skipWaiting();
  };

  event.waitUntil(preCache());
});

self.addEventListener('activate', (event) => {
  const cleanUp = async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((name) => name !== CACHE)
        .map((name) => caches.delete(name))
    );
    await self.clients.claim();
  };

  event.waitUntil(cleanUp());
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse;

          if (preloadResp) {
            return preloadResp;
          }

          const networkResp = await fetch(event.request);

          // Check if the request scheme is not 'chrome-extension'
          if (event.request.url.startsWith('chrome-extension://')) {
            return networkResp;
          }

          // Continue with caching logic for other requests
          const cache = await caches.open(CACHE);
          cache.put(event.request, networkResp.clone());

          // Check if the network response was successful
          if (networkResp.ok) {
            return networkResp;
          } else {
            // If not successful, serve the cached offline page
            const cachedResp = await cache.match(OFFLINE_PAGE);
            return cachedResp;
          }
        } catch (error) {
          // Handle fetch errors, and serve the cached offline page
          const cache = await caches.open(CACHE);
          const cachedResp = await cache.match(OFFLINE_PAGE);
          return cachedResp;
        }
      })()
    );
  }
});
