// 코드·화면 파일은 네트워크 우선(항상 서버에 새 버전 확인), 오프라인이면 저장본 사용. 파일을 바꿔 올리면 바로 반영됨.
// 글꼴(fonts/*.woff2)은 거의 안 바뀌므로 캐시 우선 + 별도 캐시(FV) — 배포할 때마다 다시 받지 않는다. 글꼴을 바꾸면 FV 의 숫자를 올린다.
// 배포할 때 scripts/bump.py 로 index.html 의 ?v= 값과 아래 V 를 함께 올린다.
const V='planner-20261113a',FV='planner-fonts-1',FONT='fonts/PlannerSans.woff2',SHELL=['./','index.html','app.css','js/core.js','js/home.js','js/promo.js','js/sales.js','js/goal.js','js/settings.js','js/sync.js','js/events.js','js/main.js','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png','favicon.svg'];
self.addEventListener('install',e=>{e.waitUntil(Promise.all([caches.open(V).then(c=>c.addAll(SHELL)),caches.open(FV).then(c=>c.match(FONT).then(m=>m||c.add(FONT)))]).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V&&x!=FV).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!='GET'||/supabase\.co/.test(r.url))return;
if(/\/fonts\/[^/?]+\.woff2/.test(r.url)){e.respondWith(caches.open(FV).then(c=>c.match(r.url).then(m=>m||fetch(r).then(res=>{if(res.ok)c.put(r.url,res.clone());return res}))));return}
e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{if(res&&(res.ok||res.type=='opaque')){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))))});
