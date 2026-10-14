/* Static-only caching. No patient data, files, API responses or localStorage. */
const VERSION='rh-static-20261014-v1';
const APP=['./','./index.html','./manifest.webmanifest','./app-icon.svg'];
const REACT=['https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js','https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js'];
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(VERSION);
    await Promise.all(APP.map(url=>cache.add(url).catch(()=>{})));
    await Promise.all(REACT.map(async url=>{
      try{const response=await fetch(url,{mode:'no-cors'});await cache.put(url,response);}catch(err){}
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('rh-static-')&&key!==VERSION).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(req.mode==='navigate'&&url.origin===self.location.origin&&url.pathname.startsWith(new URL('./',self.registration.scope).pathname)){
    event.respondWith((async()=>{
      try{return await fetch(req,{cache:'no-store'});}
      catch(error){const cached=await caches.match('./index.html');return cached||Response.error();}
    })());
    return;
  }
  const allowed=REACT.includes(url.href)||(url.origin===self.location.origin&&APP.some(x=>new URL(x,self.registration.scope).href===url.href));
  if(!allowed)return;
  event.respondWith((async()=>{
    const cached=await caches.match(req);
    if(cached)return cached;
    try{
      const resp=await fetch(req);
      if(resp.ok||resp.type==='opaque'){const cache=await caches.open(VERSION);await cache.put(req,resp.clone());}
      return resp;
    }catch(e){return Response.error();}
  })());
});
