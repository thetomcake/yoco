//if ('serviceWorker' in navigator) {
//  window.addEventListener('load', function() {
//    navigator.serviceWorker.register('/serviceworker.js', {scope: '/'}).then(function(registration) {
//        
//        if (navigator.serviceWorker.controller) {
//            // already active and controlling this page
//            return navigator.serviceWorker;
//        }
//
//        // wait for a new service worker to control this page
//        return new Promise(function (resolve) {
//          function onControllerChange() {
//            navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
//            resolve(navigator.serviceWorker);
//          }
//          navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
//        });
//        
//       
//    }).then(function() {
//        //Service worker registered and controlling page
//        console.log('ServiceWorker activated.');
//    
//    }).catch(function(err) {
//      // registration failed :(
//      console.log('ServiceWorker registration failed');
//    });
//  });
//}