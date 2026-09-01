// 캐시 이름은 개정마다 올린다 (옛 캐시 정리 트리거)
const CACHE = 'bible-v5.0';
const ASSETS = [
  '/claude-code-bible/',
  '/claude-code-bible/index.html',
  '/claude-code-bible/icon.png',
  '/claude-code-bible/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// HTML은 network-first: 캐시 이름 올리는 걸 잊어도 최신이 뜬다.
// (구 cache-first는 캐시에 있으면 네트워크를 아예 안 봐서 v3.1 캐시가 v4.0을 계속 보여줬다)
// 나머지 정적 자산은 cache-first — 오프라인 지원은 양쪽 다 캐시 폴백으로 유지된다.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const isHTML = req.mode === 'navigate' ||
                 (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('/claude-code-bible/index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(r => r || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }))
  );
});
