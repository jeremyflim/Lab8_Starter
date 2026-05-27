// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-8-starter';
const RECIPE_URLS = [
  'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
];
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './assets/styles/main.css',
  './assets/scripts/main.js',
  './assets/scripts/RecipeCard.js',
  './assets/images/icons/icon-192x192.png',
  './assets/images/icons/icon-256x256.png',
  './assets/images/icons/icon-384x384.png',
  './assets/images/icons/icon-512x512.png',
  './assets/images/icons/0-star.svg',
  './assets/images/icons/1-star.svg',
  './assets/images/icons/2-star.svg',
  './assets/images/icons/3-star.svg',
  './assets/images/icons/4-star.svg',
  './assets/images/icons/5-star.svg',
];
const IMAGE_URLS = [
  'https://cdn.loveandlemons.com/wp-content/uploads/2019/11/thanksgiving-side-dishes-580x580.jpg',
  'https://www.budgetbytes.com/wp-content/uploads/2021/11/5-Turkey-and-Stuffing-Pasted-500x500.jpg',
  'https://my100yearoldhome.com/wp-content/uploads/2020/04/cornbrread-stuffing.jpg',
  'https://www.brit.co/media-library/thanksgiving-side-dishes.jpg?id=21587970&width=1200&height=1200',
  'https://thecleaneatingcouple.com/wp-content/uploads/2021/10/healthy-thanksgiving-recipes.png',
  'https://www.tasteofhome.com/wp-content/uploads/2018/01/Thanksgiving-in-a-Pan_EXPS_TGBZ22_19232_P2_MD_04_15_7b-1.jpg?fit=700,700',
];

// Installs the service worker. Feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // B6. TODO - Add all of the URLs from RECIPE_URLs here so that they are
      //            added to the cache when the ServiceWorker is installed
      return cache.addAll([...APP_SHELL, ...RECIPE_URLS]).then(function () {
        return Promise.all(
          IMAGE_URLS.map(function (url) {
            const request = new Request(url, { mode: 'no-cors' });
            return fetch(request)
              .then(function (response) {
                return cache.put(request, response);
              })
              .catch(function (err) {
                console.warn('Image cache failed', url, err);
              });
          })
        );
      });
    })
  );
});

// Activates the service worker
self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Intercept fetch requests and cache them
self.addEventListener('fetch', function (event) {
  // We added some known URLs to the cache above, but tracking down every
  // subsequent network request URL and adding it manually would be very taxing.
  // We will be adding all of the resources not specified in the intiial cache
  // list to the cache as they come in.
  /*******************************/
  // This article from Google will help with this portion. Before asking ANY
  // questions about this section, read this article.
  // NOTE: In the article's code REPLACE fetch(event.request.url) with
  //       fetch(event.request)
  // https://developer.chrome.com/docs/workbox/caching-strategies-overview/
  /*******************************/
  // B7. TODO - Respond to the event by opening the cache using the name we gave
  //            above (CACHE_NAME)
  // B8. TODO - If the request is in the cache, return with the cached version.
  //            Otherwise fetch the resource, add it to the cache, and return
  //            network response.
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(event.request).then(function (cachedResponse) {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then(function (networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
