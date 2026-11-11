/* home.js — 홈 탭: 일정 수집(evs)·오늘 목록·빠른 입력(parseQ/qa)·체크(tg)·캘린더(vCal)·할 일 폼(nt/et) (로드 순서 2/8) */
function evs(day){const r=[];S.promos.forEach(p=>{if(p.status=='탈락')return;const c=pc(p.platform),l=p.platform+' '+p.title;
if(p.applyStart==day)r.push({t:'신청 시작 · '+l,c,k:'pen',pid:p.id});if(p.applyEnd==day)r.push({t:'신청 마감 · '+l,c,k:'clock',pid:p.id});if(p.authorDue==day)r.push({t:'작가 전달 · '+l,c,k:'send',pid:p.id});
if(p.start&&p.end&&day>=p.start&&day<=p.end)r.push({t:'진행 · '+l+(day==p.start?' (시작)':day==p.end?' (종료)':''),c,bar:1,k:'play',pid:p.id,mid:day!=p.start&&day!=p.end})});
S.tasks.filter(t=>t.due==day).forEach(t=>r.push({t:t.title,c:'#868e96',task:t}));return r}
const row=t=>{const p=t.promoId&&pr(t.promoId),od=!t.done&&diff(t.due)<0;return`<div class="r ${t.done?'dn':''} ${od?'od':''}"><input type=checkbox ${t.done?'checked':''} onchange="tg(${t.id})"><div class=g tabindex=0 role=button onclick="et(${t.id})"><b>${esc(t.title)}</b><small>${t.cat}${t.pri=='높음'?' · 중요':''}${t.repeat&&t.repeat!='없음'?' · '+t.repeat+' 반복':''} · ${t.due.slice(5)} ${t.done?'':dl(t.due)}${p?' · '+esc(p.platform+' '+p.title):''}</small></div></div>`};
const evr=x=>x.task?row(x.task):`<div class=r style="border-left:4px solid ${x.c}"${x.pid?` tabindex=0 role=button onclick="ep(${x.pid})"`:''}><div class=g><b>${x.k?ico(x.k,15)+' ':''}${esc(x.t)}</b>${x.d?`<small>${x.d}</small>`:''}</div></div>`;
function vToday(){const t0=today(),open=S.tasks.filter(t=>!t.done),od=open.filter(t=>t.due<t0).sort((a,b)=>a.due<b.due?-1:1),wk=open.filter(t=>t.due>t0&&t.due<=add(t0,7)).sort((a,b)=>a.due<b.due?-1:1),tdn=open.filter(t=>t.due==t0).length;
let hero='',hk='',ms=[];for(let i=0;i<=60&&!hero;i++){const d=add(t0,i),e=evs(d).find(x=>x.k=='clock'||x.k=='send');if(e)hk=d+'|'+e.t,hero=`<div class=hero tabindex=0 role=button onclick="ep(${e.pid})" style="border-left:4px solid ${e.c}"><b class="dd ${i<=3?'hot':''}">${dl(d)}</b><div class=g><b>${esc(e.t)}</b><small>${d.slice(5).replace('-','/')} (${WD[pd(d).getDay()]})</small></div></div>`}
for(let i=1;i<=14;i++){const d=add(t0,i);evs(d).filter(e=>!e.task&&!e.bar&&d+'|'+e.t!=hk).forEach(e=>ms.push(evr({...e,d:d.slice(5).replace('-','/')+' ('+WD[pd(d).getDay()]+') '+dl(d)})))}
const kk=x=>x.task?(x.task.done?2:0):1,tl=evs(t0).sort((a,b)=>kk(a)-kk(b)||(a.task&&b.task?(b.task.pri=='높음')-(a.task.pri=='높음'):0));
return`<div class=hd><h2>${t0.slice(5).replace('-','월 ')}일 (${WD[new Date().getDay()]})</h2>${sybH()}</div>${hero}<div class=st><span class="${od.length?'rd':''}">지연 <b>${od.length}</b>건</span><span>오늘 <b>${tdn}</b>건</span></div>
<div class=qa><input id=qi placeholder="예: 내일 정산 확인 · 11/20 표지 시안" enterkeyhint=done autocomplete=off oninput="qp()" onkeydown="if(event.key=='Enter'&&!event.isComposing)qa()"><button onclick="qa()">${ico('plus',18)} 추가</button></div><small id=qp></small>
${bkn()}${od.length?`<h3 style="color:var(--rd)">지연 ${od.length}건</h3>`+od.map(row).join(''):''}<h3>오늘</h3>${tl.map(evr).join('')||'<p class=mu>오늘 예정된 일이 없습니다. 위 입력창에 한 줄로 추가해 보세요.</p>'}
${vCal()}<h3>앞으로 14일 프로모션 일정</h3>${ms.join('')||'<p class=mu>프로모션 탭에서 프로모션을 등록하면 여기에 표시됩니다.</p>'}<h3>이번 주 남은 할 일</h3>${wk.map(row).join('')||'<p class=mu>이번 주 남은 할 일이 없습니다.</p>'}`}
const DOW={'일':0,'월':1,'화':2,'수':3,'목':4,'금':5,'토':6},CATK=[['정산','정산'],['세금|세무|원천|부가세|지급명세|신고|계산서','세무'],['계약|인세','계약'],['표지|시안|교정|교열|편집|제작|인쇄|이펍|epub|원고','제작'],['홍보|광고|마케팅|sns|보도자료|서평','마케팅'],['프로모션|기획전|이벤트|신청','프로모션']];
function parseQ(v,t0){t0=t0||today();const ok=(y,mo,d)=>{const x=new Date(y,mo-1,d);return x.getMonth()==mo-1&&x.getDate()==d},mon=add(t0,-((pd(t0).getDay()+6)%7));let due=t0,hit='',m,x=v;
if(m=x.match(/(\d{1,3})\s*일\s*(?:뒤|후)/)){due=add(t0,+m[1]);hit=m[0]}
else if(/모레/.test(x)){due=add(t0,2);hit='모레'}else if(/내일/.test(x)){due=add(t0,1);hit='내일'}else if(/오늘/.test(x))hit='오늘';
else if((m=x.match(/(\d{4})[-.\/](\d{1,2})[-.\/](\d{1,2})/))&&ok(+m[1],+m[2],+m[3])){due=m[1]+'-'+pad(m[2])+'-'+pad(m[3]);hit=m[0]}
else if((m=x.match(/(\d{1,2})\s*[\/월.]\s*(\d{1,2})\s*일?/))&&ok(+t0.slice(0,4),+m[1],+m[2])){due=t0.slice(0,4)+'-'+pad(m[1])+'-'+pad(m[2]);hit=m[0]}
else if(m=x.match(/(다음\s*주|담주|이번\s*주)?\s*([일월화수목금토])요일/)){const o=(DOW[m[2]]+6)%7;if(m[1]){due=add(mon,o+(/이번/.test(m[1])?0:7))}else{const n=(DOW[m[2]]-pd(t0).getDay()+7)%7;due=add(t0,n||7)}hit=m[0]}
else if(m=x.match(/(^|[^\d])(\d{1,2})\s*일(?!\s*(?:뒤|후|간|째|마다))/)){const d=+m[2],y=+t0.slice(0,4),mo=+t0.slice(5,7);if(d>=1&&d<=31){let cy=y,cm2=mo;if(d<+t0.slice(8)){cm2++;if(cm2>12){cm2=1;cy++}}if(ok(cy,cm2,d)){due=cy+'-'+pad(cm2)+'-'+pad(d);hit=m[0].slice(m[1].length)}}}
if(hit)x=x.replace(hit,' ');let pri='보통';if(/[!！]/.test(x)||/(^|\s)(급|중요)(?=\s|$)/.test(x)){pri='높음';x=x.replace(/[!！]/g,' ').replace(/(^|\s)(급|중요)(?=\s|$)/g,' ')}
const title=x.replace(/\s+/g,' ').trim()||v.replace(/[!！]/g,'').trim()||'할 일';let cat='행정';for(const[p,c]of CATK)if(new RegExp(p,'i').test(title)){cat=c;break}
return{title,due,cat,pri,hit}}
const qd=r=>r.due.slice(5).replace('-','/')+' ('+WD[pd(r.due).getDay()]+') · '+r.cat+(r.pri=='높음'?' · 중요':'');
function qp(){const e=$('#qp'),i=$('#qi');if(!e||!i)return;const v=i.value.trim();e.textContent=v?qd(parseQ(v)):''}
function qa(){const el=$('#qi'),v=el.value.trim();if(!v)return;const r=parseQ(v),id=nid();el.value='';S.tasks.push({id,title:r.title,due:r.due,cat:r.cat,pri:r.pri,repeat:'없음',done:0});save();R();const n=$('#qi');if(n)n.focus();toast(qd(r)+' 추가했습니다',()=>{S.tasks=S.tasks.filter(t=>t.id!=id);save();R()})}
function tg(id){const t=S.tasks.find(x=>x.id==id);t.done=t.done?0:1;if(t.done&&t.repeat&&t.repeat!='없음'){let n;if(t.repeat=='매주')n=add(t.due,7);else{const d=pd(t.due);if(t.repeat=='매년')d.setFullYear(d.getFullYear()+1);else d.setMonth(d.getMonth()+1);n=t.eom?ds(new Date(pd(t.due).getFullYear(),pd(t.due).getMonth()+2,0)):ds(d)}S.tasks.push({...t,id:nid(),due:n,done:0})}save();R()}
const dots=(k,e)=>{const a=e.filter(x=>!(x.task&&x.task.done)&&!(x.bar&&x.mid)),g=e.filter(x=>x.bar&&x.mid).slice(0,1),all=[...a.map(x=>[x,0]),...g.map(x=>[x,1])],sh=all.slice(0,3),t0=today();
return sh.map(([x,r])=>`<u class="${r?'rg':''}" style="--d:${x.task?(k<t0?'var(--rd)':'var(--mu)'):x.c}"></u>`).join('')+(all.length>3?'<i>+'+(all.length-3)+'</i>':'')};
function vCal(){const t0=today(),y=cm.getFullYear(),mo=cm.getMonth(),wk=cv=='week';let days;
if(wk){const st=add(sel,-pd(sel).getDay());days=[...Array(7)].map((_,i)=>add(st,i))}else{const f=new Date(y,mo,1).getDay(),n=new Date(y,mo+1,0).getDate();days=[...Array(f).fill(''),...[...Array(n)].map((_,i)=>y+'-'+pad(mo+1)+'-'+pad(i+1))]}
const hy=wk?pd(sel).getFullYear():y,hm=wk?pd(sel).getMonth():mo,now=new Date(),away=sel!=t0||(!wk&&(y!=now.getFullYear()||mo!=now.getMonth()));
let h=`<div class=hd><button class=sc aria-label="${wk?'이전 주':'이전 달'}" onclick="mv(-1)">${ico('chev-l')}</button><h2>${hy}년 ${hm+1}월</h2><button class=sc aria-label="${wk?'다음 주':'다음 달'}" onclick="mv(1)">${ico('chev-r')}</button></div>
<div class=cvt><button class="sm ${wk?'sc':''}" onclick="setcv('month')">월</button><button class="sm ${wk?'':'sc'}" onclick="setcv('week')">주</button>${away?`<button class="sm sc" style="margin-left:auto" onclick="goT()">오늘</button>`:''}</div><div class=cg>`+[...WD].map(x=>`<i class=w>${x}</i>`).join('');
days.forEach(k=>{if(!k){h+='<i></i>';return}const e=evs(k),d=+k.slice(8);h+=`<div class="c ${k==t0?'t':''} ${k==sel?'s':''}" tabindex=0 role=button aria-label="${+k.slice(5,7)}월 ${d}일 일정 ${e.length}건" onclick="sd('${k}')"><span>${d}</span><div class=dt>${dots(k,e)}</div>${e.slice(0,3).map(x=>`<em class=ct style="border-left:3px solid ${x.c}">${esc(x.t)}</em>`).join('')}</div>`});
h+='</div>';if(sel!=t0){const e=evs(sel);h+=`<h3>${sel.slice(5).replace('-','/')} (${WD[pd(sel).getDay()]})</h3>`+(e.map(evr).join('')||'<p class=mu>이 날은 일정이 없습니다.</p>')+`<button class="bt sc" onclick="nt('${sel}')">${ico('plus',18)} 이 날짜에 할 일 추가</button>`}
return h}
let cv=(()=>{try{return localStorage.getItem('pp_cv')=='week'?'week':'month'}catch(e){return'month'}})();
const sync=()=>{const d=pd(sel);cm=new Date(d.getFullYear(),d.getMonth(),1)},setcv=v=>{cv=v;try{localStorage.setItem('pp_cv',v)}catch(e){}sync();R()},goT=()=>{sel=today();sync();R()};
const mv=n=>{if(cv=='week'){sel=add(sel,7*n);sync()}else cm.setMonth(cm.getMonth()+n);R()},sd=k=>{sel=k;R()};
let _tx=null,_ty=0;
$('#m').addEventListener('touchstart',e=>{_tx=e.target.closest('.cg')?e.touches[0].clientX:null;_ty=e.touches[0].clientY},{passive:true});
$('#m').addEventListener('touchend',e=>{if(_tx==null)return;const dx=e.changedTouches[0].clientX-_tx,dy=Math.abs(e.changedTouches[0].clientY-_ty);_tx=null;if(Math.abs(dx)>60&&dy<40)mv(dx<0?1:-1)},{passive:true});
const TF=[['title','할 일','text',null,'req'],['due','마감일','date',null,'req'],['cat','분류','sel',()=>['프로모션','계약','정산','제작','마케팅','세무','행정'],'half'],['pri','우선순위','sel',()=>['보통','높음'],'half'],['repeat','반복','sel',()=>['없음','매주','매월','매년']]];
const nt=d=>form('할 일 추가',TF,{due:d||today(),cat:'행정',pri:'보통',repeat:'없음'},v=>{if(!v.title||!v.due)return 0;S.tasks.push({id:nid(),...v,done:0});save();R();return 1});
function et(id){const t=S.tasks.find(x=>x.id==id);form('할 일 수정',TF,t,v=>{if(!v.title||!v.due)return 0;Object.assign(t,v);save();R();return 1},()=>{S.tasks=S.tasks.filter(x=>x.id!=id);save();R()})}
