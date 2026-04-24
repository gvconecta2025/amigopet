const CACHE_NAME = 'amigopet-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/image_322ea4.png'
];

// Instala o Service Worker e armazena os ficheiros vitais
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Limpa caches antigas na atualização
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    })
  );
});

// Estratégia Stale-While-Revalidate (Super Rápida)
self.addEventListener('fetch', (event) => {
  // Deixar que o SDK do Firebase trate dos pedidos à base de dados (que já está a usar enableIndexedDbPersistence)
  if (event.request.url.includes('firestore.googleapis.com') || event.request.url.includes('identitytoolkit')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Atualiza a cache silenciosamente em segundo plano
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      }).catch(() => cachedResponse); // Em caso de falha de rede total, retorna o cache
      
      // Retorna logo a cache se existir (rápido), caso contrário aguarda a internet
      return cachedResponse || fetchPromise;
    })
  );
});
