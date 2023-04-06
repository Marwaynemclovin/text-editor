const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// Cache JS, CSS, and worker files with a StaleWhileRevalidate strategy
registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination), // Filter requests for JS, CSS, and worker files
  new StaleWhileRevalidate({ // Use a StaleWhileRevalidate strategy to cache responses
    cacheName: 'asset-cache', // Name of the cache storage
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Cache responses with these statuses
      }),
      new ExpirationPlugin({
        maxEntries: 60, // Maximum number of entries to cache
        maxAgeSeconds: 30 * 24 * 60 * 60, // Maximum age of cached entries (30 days)
      })
    ],
  })
);