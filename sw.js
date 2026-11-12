// 네트워크 우선(항상 서버에 새 버전 확인), 오프라인이면 저장본 사용. 파일을 바꿔 올리면 바로 반영됨.
// 배포할 때 scripts/bump.py 로 index.html 의 ?v= 값과 아래 V 를 함께 올린다.
const V='planner-20261111c',SHELL=['./','index.html','app.css','js/core.js','js/home.js','js/promo.js','js/sales.js','js/goal.js','js/settings.js','js/sync.js','js/events.js','js/main.js','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png','favicon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!='GET'||/supabase\.co/.test(r.url))return;
e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{if(res&&(res.ok||res.type=='opaque')){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))))});
