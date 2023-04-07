const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
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

const assetCache = new StaleWhileRevalidate({
  cacheName: 'asset-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxEntries: 60,
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
    })
  ],
});

// Use the offlineFallback recipe to provide a fallback response when a network request fails
// const offlineStrategy = offlineFallback({
//   cacheName: 'offline-cache',
//   plugins: [
//     new CacheableResponsePlugin({
//       statuses: [0, 200],
//     }),
//     new ExpirationPlugin({
//       maxEntries: 60,
//       maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
//     })
//   ],
//   request: new Request('/offline.html'), // The HTML to show when a request fails
// });

// Cache JS, CSS, and worker files with a StaleWhileRevalidate strategy
registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      // This plugin will cache responses with these headers to a maximum-age of 15 days
      new CacheableResponsePlugin({
        statuses: [0, 200], // Cache responses with these statuses
      }),
      new ExpirationPlugin({
        maxEntries: 60, // Maximum number of entries to cache
        maxAgeSeconds: 15 * 24 * 60 * 60, // Maximum age of cached entries (15 days)
      })
    ],
  })
);
