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
    event.respondWith(onFetch(event));
});

function onFetch(event) {
    return new Promise(function(accept, reject) {
        if (event.request.method === 'GET') {
            caches.open(CACHE_NAME).then(function(cache) {
                cache.match(event.request).then(function(response) {
                    let fetchAndCachePromise = fetchAndCache(event.request);
                    return accept(response || fetchAndCachePromise);
                }).catch(function() {
                    return accept(getErrorResponse());
                });
            });
        } else {
            return fetch(event.request).then(function(response) {
                return accept(response);
            });
        }
    });
}

function fetchAndCache(request) {
    return fetch(request).then(function(response) {
        console.log('running fetch for ' + request.url);
        var cacheResponse = response.clone();
        
        if (response.type === "basic") {
            caches.open(CACHE_NAME).then(function(cache) {
                return cache.put(request, cacheResponse);
            });
        }
        
        return response;
    }).catch(function() {
        return getErrorResponse();
    });
}

function getErrorResponse() {
    return new Response('Sorry, an error occurred while trying to load this page');
}