/* core.js — 상태(S)·저장·날짜 유틸·아이콘(IC/ico)·토스트/확인 시트·입력 폼 엔진(form) (로드 순서 1/9) */
const $=s=>document.querySelector(s),K='pubplanner1',pad=n=>String(n).padStart(2,'0'),WD='일월화수목금토',ST=['준비','신청','선정','자료전달','진행중','종료','정산','탈락'];
/* 데이터 형식 버전. 저장 형식을 바꿀 때: ① SCHEMA +1 ② MIG 맨 끝에 "이전 버전 → 새 버전" 변환 함수 추가(순수 함수, 입력 복사본을 고쳐 반환)
   ③ scripts/unit.js 의 J 그룹에 옛 형식 샘플 추가. 구버전 앱은 더 높은 버전의 데이터를 읽거나 서버에 덮어쓰지 않는다(SBLOCK). */
const SCHEMA=1,DP=[{n:'리디',c:'#1f8ce6'},{n:'교보문고',c:'#2f9e44'},{n:'알라딘',c:'#f08c00'},{n:'예스24',c:'#e03131'},{n:'북큐브',c:'#7048e8'}],
MIG=[o=>{/* v0 → v1: 버전 표시가 없던 옛 데이터의 빠진 값·형식 정리 */
const A=k=>Array.isArray(o[k])?o[k]:(o[k]=[]),O=k=>o[k]&&typeof o[k]=='object'&&!Array.isArray(o[k])?o[k]:(o[k]={}),id=x=>{if(typeof x.id=='string'&&/^\d+$/.test(x.id))x.id=+x.id};
o.platforms=(Array.isArray(o.platforms)?o.platforms:[]).filter(p=>p&&p.n).map(p=>({...p,c:p.c||'#868e96'}));if(!o.platforms.length)o.platforms=DP.map(p=>({...p}));
A('promos').forEach(p=>{id(p);p.platform=p.platform||'';p.title=p.title||'';if(!ST.includes(p.status))p.status='준비'});
A('tasks').forEach(t=>{id(t);t.title=t.title||'';t.cat=t.cat||'행정';t.pri=t.pri||'보통';t.repeat=t.repeat||'없음';t.done=t.done?1:0});
A('goals').forEach(g=>{id(g);g.target=+g.target||0;g.current=+g.current||0;g.period=g.period||'연간'});
O('sales');O('pub');O('tpl');O('del');o.id=+o.id||1;o.rev=+o.rev||0;return o}];
function migrate(o){o=JSON.parse(JSON.stringify(o));let v=+o.v||0;if(v>SCHEMA)return o;while(v<SCHEMA){o=MIG[v](o);v++;o.v=v}return o}
let S,SBLOCK=0,_raw=null;
try{_raw=localStorage.getItem(K);S=JSON.parse(_raw)}catch(e){if(_raw){try{localStorage.setItem(K+'.bad',_raw)}catch(_){}window.__badLoad=1}}
if(!S||typeof S!='object'||Array.isArray(S))S={platforms:DP.map(p=>({...p})),promos:[],tasks:[],goals:[],id:1};
if((+S.v||0)>SCHEMA)SBLOCK=1;else S=migrate(S);
let _n=Math.floor(Math.random()*100),SY=null,SYS='이 화면에서는 동기화를 쓸 수 없습니다 (이 기기에만 저장)',syTm;
const save=()=>{stamp();S.rev=Date.now();try{localStorage.setItem(K,JSON.stringify(S))}catch(e){if(!window.__qw){window.__qw=1;toast('이 기기에 저장하지 못했습니다(저장 공간 부족). 엑셀로 백업해 두세요.')}}push()},nid=()=>Date.now()*100+(_n++%100),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ds=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()),pd=s=>{const[a,b,c]=s.split('-');return new Date(a,b-1,c)},add=(s,n)=>{const d=pd(s);d.setDate(d.getDate()+n);return ds(d)},today=()=>ds(new Date()),diff=s=>Math.round((pd(s)-pd(today()))/864e5),dl=s=>{const n=diff(s);return n==0?'D-day':n>0?'D-'+n:'D+'+-n};
const pc=n=>(S.platforms.find(p=>p.n==n)||{c:'#868e96'}).c,pr=id=>S.promos.find(p=>p.id==id);
let tab='today',cm=new Date(),sel=today();
cm.setDate(1);
let _tt;
function toast(m,undo){clearTimeout(_tt);const t=$('#ts');t.innerHTML='<span>'+esc(m)+'</span>'+(undo?'<button id=tu>되돌리기</button>':'');t.className='on';if(undo)$('#tu').onclick=()=>{t.className='';undo()};_tt=setTimeout(()=>t.className='',undo?6000:Math.max(2800,String(m).length*110))}
function ask(m,ok,no){return new Promise(res=>{const o=document.createElement('div');o.className='ak';o.innerHTML='<div role=alertdialog aria-modal=true class=akb><p>'+esc(m)+'</p><div class=row><button class=sc data-r=0>'+esc(no||'취소')+'</button><button data-r=1>'+esc(ok||'확인')+'</button></div></div>';document.body.appendChild(o);const done=v=>{o.remove();res(v)};o.onclick=e=>{const b=e.target.closest('button');if(b)done(b.dataset.r=='1');else if(e.target==o)done(false)};o.onkeydown=e=>{if(e.key=='Escape')done(false)};o.querySelector('button[data-r="1"]').focus()})}
function del2(){const sn=JSON.stringify([S.promos,S.tasks,S.goals]);window._d();cl();toast('삭제했습니다',()=>{const o=JSON.parse(sn);S.promos=o[0];S.tasks=o[1];S.goals=o[2];save();R()})}
document.addEventListener('keydown',e=>{const t=e.target;if((e.key=='Enter'||e.key==' ')&&t.matches&&t.matches('[tabindex="0"]')&&!t.matches('input,select,textarea,button')){e.preventDefault();t.click()}});
const IC={today:'<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',promo:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',sales:'<path d="M5 20V11M12 20V4M19 20v-7"/>',goal:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/>',set:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
'chev-l':'<path d="M14.5 5.5L8 12l6.5 6.5"/>','chev-r':'<path d="M9.5 5.5L16 12l-6.5 6.5"/>',plus:'<path d="M12 5v14M5 12h14"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/>',
pen:'<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 013 3L8 19l-4 1z"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',send:'<path d="M21 3L10 14M21 3l-7 18-4-7-7-4 18-7z"/>',play:'<path d="M7 4.5v15l12-7.5-12-7.5z"/>',
book:'<path d="M6 3h11a1 1 0 011 1v16H7a2 2 0 01-2-2V4a1 1 0 011-1z"/><path d="M5 18a2 2 0 012-2h11"/>',trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',repeat:'<path d="M4 11V9a3 3 0 013-3h11M15 3l3 3-3 3M20 13v2a3 3 0 01-3 3H6M9 21l-3-3 3-3"/>'};
const ico=(n,z=20)=>`<svg class=ik width=${z} height=${z} viewBox="0 0 24 24" fill=none stroke=currentColor stroke-width=1.75 stroke-linecap=round stroke-linejoin=round aria-hidden=true>${IC[n]||(console.warn('아이콘 없음',n),'')}</svg>`;
function form(title,F,val,ok,del){const G=[];let g={t:'',f:[],fold:0};G.push(g);F.forEach(e=>{if(e[2]=='sec'){g={t:e[1],f:[],fold:e[3]=='fold'};G.push(g)}else g.f.push(e)});
const has=(e,f)=>(e[4]||'').includes(f),fld=e=>{const[k,l,t,o]=e,v=val[k]??'',rq=has(e,'req');if(t=='chk')return`<label class=ck><input type=checkbox id=f_${k} ${v?'checked':''}> ${l}</label>`;
return`<div class=fd><label for=f_${k}>${l}${rq?'<span class=rq>필수</span>':''}</label>`+(t=='sel'?`<select id=f_${k}>${o().map(x=>`<option ${x==v?'selected':''}>${esc(x)}</option>`).join('')}</select>`:t=='area'?`<textarea id=f_${k} rows=3>${esc(v)}</textarea>`:`<input id=f_${k} type="${t=='text'?'text':t=='num'?'number':t}" value="${esc(v)}"${rq?' aria-required=true':''}>`)+'</div>'};
const body=f=>{let h='',two=0;f.forEach(e=>{const hf=has(e,'half');if(hf&&!two){h+='<div class=two>';two=1}else if(!hf&&two){h+='</div>';two=0}h+=fld(e)});return h+(two?'</div>':'')};
let h=`<h2>${title}</h2>`;G.forEach(g=>{if(!g.f.length)return;if(!g.t){h+=body(g.f);return}const op=g.f.some(e=>e[2]!='chk'&&val[e[0]]);h+=g.fold?`<details class=fs ${op?'open':''}><summary>${g.t}${ico('chev-r',16)}</summary>${body(g.f)}</details>`:`<section class=fs><h4>${g.t}</h4>${body(g.f)}</section>`});
h+=`<div class=row><button class=sc data-a="cl">취소</button>${del?`<button class=dg data-a="del2">삭제</button>`:''}<button data-a="save">저장</button></div>`;
$('#fm').innerHTML=h;$('#fm').scrollTop=0;$('#ov').classList.add('on');vf();window._d=del;
window._s=()=>{const v={};let bad=null;document.querySelectorAll('#fm .err').forEach(x=>x.classList.remove('err'));F.forEach(e=>{if(e[2]=='sec')return;const[k,l,t]=e,x=$('#f_'+k);v[k]=t=='chk'?x.checked:t=='num'?+x.value||0:x.value.trim();if(has(e,'req')&&!v[k]&&!bad)bad=[x,l]});
if(bad){bad[0].classList.add('err');bad[0].focus();toast(bad[1].split(' (')[0]+'을(를) 입력하세요');return}if(ok(v))cl()};
[['applyStart','applyEnd'],['start','end']].forEach(([a,b])=>{const A=$('#f_'+a),B=$('#f_'+b);if(!A||!B)return;if(A.value)B.min=A.value;A.addEventListener('change',()=>{if(!A.value)return;B.min=A.value;if(!B.value||B.value<A.value)B.value=A.value})})}
function vf(){const o=$('#ov'),v=window.visualViewport;if(!v)return;if(o.classList.contains('on')){o.style.top=v.offsetTop+'px';o.style.height=v.height+'px';o.style.bottom='auto'}else{o.style.top=o.style.height=o.style.bottom=''}}
if(window.visualViewport){visualViewport.addEventListener('resize',vf);visualViewport.addEventListener('scroll',vf)}
document.addEventListener('keydown',e=>{if(e.key=='Escape'&&$('#ov').classList.contains('on')&&!document.querySelector('.ak'))cl()});
const cl=()=>{$('#ov').classList.remove('on');vf();if(window.__stale){window.__stale=0;R()}};
