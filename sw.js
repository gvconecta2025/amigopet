self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));
self.addEventListener('fetch', (e) => {
    // Deixe vazio, mas a presença deste evento é OBRIGATÓRIA para o Chrome aceitar a instalação PWA
});
