/* Poultry Khata service worker: keeps the app shell available offline. Data lives in IndexedDB, not here. */
const CACHE = "poultry-khata-v0.2.0";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png", "./fonts/fonts-local.css", "./fonts/RrQKbpV-9Dd1b1OAGA6M9PkyDuVBeN2DHV20Lg.woff2", "./fonts/RrQKbpV-9Dd1b1OAGA6M9PkyDuVBeN2GHV0.woff2", "./fonts/RrQKbpV-9Dd1b1OAGA6M9PkyDuVBeN2IHV20Lg.woff2", "./fonts/RrQKbpV-9Dd1b1OAGA6M9PkyDuVBeN36HV20Lg.woff2", "./fonts/RrQKbpV-9Dd1b1OAGA6M9PkyDuVBeN3oHV20Lg.woff2", "./fonts/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5a3du2ui.woff2", "./fonts/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5a7duw.woff2", "./fonts/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5aDdu2ui.woff2", "./fonts/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5aHdu2ui.woff2", "./fonts/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5aLdu2ui.woff2", "./fonts/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5aPdu2ui.woff2", "./fonts/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5a_du2ui.woff2", "./fonts/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5ardu2ui.woff2"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const req = e.request; if(req.method !== "GET") return;
  const url = new URL(req.url); if(url.origin !== location.origin) return;
  // navigations: cached shell first, refreshed in the background
  if(req.mode === "navigate"){ e.respondWith(caches.match("./index.html").then(cached => { const net = fetch(req).then(res => { if(res.ok) caches.open(CACHE).then(c => c.put("./index.html", res.clone())); return res; }).catch(() => cached); return cached || net; })); return; }
  e.respondWith(caches.match(req).then(cached => { const net = fetch(req).then(res => { if(res.ok) caches.open(CACHE).then(c => c.put(req, res.clone())); return res; }).catch(() => cached); return cached || net; }));
});
