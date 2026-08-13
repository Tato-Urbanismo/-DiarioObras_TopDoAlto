// So forca "sempre buscar fresco" nos arquivos do proprio app (mesma origem).
// Bibliotecas externas (Firebase, PDF, Google) seguem o comportamento normal do navegador,
// que pode usar cache - isso acelera bastante o carregamento em conexoes lentas.
self.addEventListener('install', function(e){
  self.skipWaiting();
});
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});
self.addEventListener('fetch', function(e){
  var mesmaOrigem = new URL(e.request.url).origin === self.location.origin;
  if(!mesmaOrigem){
    // biblioteca externa (CDN) - nao intercepta, deixa o navegador cuidar do cache normalmente
    return;
  }
  e.respondWith(fetch(e.request).catch(function(){
    return new Response('Sem conexão', {status:503});
  }));
});
