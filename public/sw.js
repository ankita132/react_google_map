"use strict";

var cacheName = 'v2.3';
var filesToCache = [
  '/',
  'index.html',
  'favicon.ico',
  'offline.html',
  'react-app.png',
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker %s] Installed at ',cacheName,new Date().toLocaleTimeString());
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate',function(e){
    console.log('[ServiceWorker %s] Activated at ',cacheName,new Date().toLocaleTimeString());
    e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch',function(event){
  //console.log('[Service worker] fetch ',event.request);
  event.respondWith(fetch(event.request).catch(function(err){
    console.log('Fetch failed; returning offline page instead');
    return caches.match('offline.html');
  }));
});
