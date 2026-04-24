// Amigo Pet — Service Worker
// Versão incrementada para forçar atualização nos usuários que já abriram o app antes.
const CACHE_NAME = 'amigopet-cache-v2';
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
      // addAll falha tudo se um item falhar; usamos add individual com catch para ser tolerante
      return Promise.all(
        ASSETS_TO_CACHE.map((url) =>
          cache.add(url).catch((err) => console.warn('SW: falhou cachear', url, err))
        )
      );
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
  const url = event.request.url;

  // Só cacheamos GET — nunca POST/PUT/DELETE (que é como o Firestore escreve)
  if (event.request.method !== 'GET') return;

  // Ignora TODOS os pedidos do Firebase/Google para não interferir com auth, tokens e base de dados.
  // Em especial: securetoken (renovação de token) e identitytoolkit (login/logout).
  if (
    url.includes('firestore.googleapis.com') ||
    url.includes('identitytoolkit') ||
    url.includes('securetoken.googleapis.com') ||
    url.includes('firebaseinstallations.googleapis.com') ||
    url.includes('firebaseio.com') ||
    url.includes('googleapis.com') ||
    url.includes('gstatic.com') ||
    url.includes('firebaseapp.com')
  ) return;

  // Também ignora placeholders externos e imagens de CDN de terceiros — deixa o navegador cuidar.
  if (url.includes('placehold.co') || url.includes('placeholder.com')) return;

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
