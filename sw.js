const VERSION='epo-tablettes-v4-personnels';
const CACHE=VERSION+'-'+self.registration.scope;
const SHELL=['./','./index.html','./manifest.webmanifest','./install.js','./ssuap.js','./ssuap.css','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
const LIBS=[
 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js',
 'https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js'
];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 await cache.addAll(SHELL);
 // These optional libraries must not block shell installation if a CDN is down.
 await Promise.allSettled(LIBS.map(async url=>{const response=await fetch(url,{mode:'cors'});if(response.ok)await cache.put(url,response);}));
 // No skipWaiting: apply updates after all existing app windows are closed.
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(k=>k.startsWith('epo-tablettes-')&&k.endsWith('-'+self.registration.scope)&&k!==CACHE).map(k=>caches.delete(k)));
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 const isShell=url.origin===self.location.origin&&SHELL.some(path=>new URL(path,self.registration.scope).href===url.href);
 const isLib=LIBS.includes(url.href);
 if(!isShell&&!isLib)return; // Never intercept or cache evaluation API requests.
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const saved=await cache.match(req);if(saved)return saved;
  const response=await fetch(req);if(response.ok)await cache.put(req,response.clone());return response;
 })());
});

