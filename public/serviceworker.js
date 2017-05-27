const CACHE_NAME = 'yoco_cache';

self.addEventListener('install', function(event) {
    //Install stuff
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        self.clients.claim().then(function() {
            return caches.open(CACHE_NAME).then(function(cache) {
                return cache.addAll(['/']);
            });
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
            return fetch(event.request).then(function(response) {
                var cacheResponse = response.clone();
                
                caches.open(CACHE_NAME).then(function(cache) {
                    return cache.put(event.request, cacheResponse);
                });
                
                return response;
            })
            .catch(function() {
                return new Response('Sorry, this page is not available');
            });
        }).catch(function() {
            return new Response('Sorry, an error occurred while trying to load this page');
        })
    );
});