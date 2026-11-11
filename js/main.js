/* main.js — 시작: 렌더(R)·동기화 부팅·서비스 워커 등록. 반드시 마지막에 로드 (로드 순서 9/9) */
function R(){const ch=tab!==R.t;R.t=tab;const m=$('#m'),y=scrollY,ae=document.activeElement,FQ='button,input,select,textarea,[tabindex="0"],summary',keep={};let fi=-1,fc=0;
if(!ch){['qi','pq'].forEach(id=>{const e=$('#'+id);if(e)keep[id]=[e.value,e===ae,e.selectionStart,e.selectionEnd]});if(ae&&m.contains(ae)&&!ae.id){const L=[...m.querySelectorAll(FQ)];fi=L.indexOf(ae);fc=L.length}}
m.className=ch?'in':'';m.innerHTML=({today:vToday,cal:vCal,promo:vPromo,sales:vSales,goal:vGoal,set:vSet})[tab]();
if(!ch){for(const id in keep){const e=$('#'+id);if(!e)continue;e.value=keep[id][0];if(keep[id][1]){e.focus({preventScroll:true});try{e.setSelectionRange(keep[id][2],keep[id][3])}catch(_){}}}
if(fi>=0){const L=[...m.querySelectorAll(FQ)];if(L.length==fc&&L[fi])L[fi].focus({preventScroll:true})}
if($('#qi'))qp();scrollTo(0,y)}
if(ch||!$('#nv').children.length)$('#nv').innerHTML=[['today','홈'],['promo','프로모션'],['sales','매출'],['goal','목표'],['set','설정']].map(([k,l])=>`<button class="${k==tab?'on':''}" ${k==tab?'aria-current=page':''} data-a="tab" data-v="${k}">${ico(k,22)}<span>${l}</span></button>`).join('')}
(async()=>{try{const sbd=await sbInit();if(sbd)SY=sbd;else{if(typeof claude=='undefined')return;const[db,u]=await Promise.all([claude.use('db'),claude.use('user')]);if(!db||!u)return;const id=await u.id();if(!id)return;SY=db.doc('data/users/'+id+'/planner')}sys('클라우드 연결 중…');let first=1;const tm=setTimeout(()=>{if(first)sys('클라우드에 연결하지 못했습니다 · 이 기기에만 저장 중')},10000);
SY.onSnapshot(s=>{if(s.fromCache&&first)return;const r=s.exists?s.data():null;
if(first){first=0;clearTimeout(tm);const has=S.promos.length+S.tasks.length+S.goals.length>0;
if(!r){if(has||S.rev)push();sys('동기화 켜짐')}else if(!S.rev&&has){ask('클라우드에 저장된 데이터가 있습니다. 어느 쪽을 사용할까요?','클라우드 데이터 사용','이 기기 데이터로 덮어쓰기').then(ok=>ok?adopt(r,1):push())}else if(r.rev!=S.rev)adopt(r);else sys('동기화됨')}
else if(r&&r.rev>(S.rev||0)&&!s.hasPendingWrites)adopt(r)},e=>sys('동기화 오류 · 이 기기에는 저장됨'))}catch(e){}})();
R();
if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))addEventListener('load',()=>{try{navigator.serviceWorker.register('sw.js').catch(()=>{})}catch(e){}});
