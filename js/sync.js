/* sync.js — Supabase 로그인·동기화·병합(sbInit/askLogin/stamp/mergeS/push/adopt)·상태 칩(sys/syc/sybH) (로드 순서 7/9) */
const ld=u=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=u;s.onload=ok;s.onerror=no;document.head.appendChild(s)});
function askLogin(sb){return new Promise(res=>{const o=document.createElement('div');o.style.cssText='position:fixed;inset:0;z-index:50;background:var(--bg);color:var(--tx);display:flex;align-items:center;justify-content:center;padding:20px';
o.innerHTML='<div class=lgw><h2>'+ico('book',22)+' 출판사 플래너</h2><p class=mu>로그인하면 PC와 아이폰의 데이터가 자동으로 같아집니다.</p><input id=lge type=email placeholder="이메일" autocomplete=username><input id=lgp type=password placeholder="비밀번호" autocomplete=current-password class=mt8><button class=bt id=lgb>로그인</button><small id=lgm class="rdc mt8"></small><button class="bt sc" id=lgs>로그인 없이 이 기기에서만 사용</button></div>';
document.body.appendChild(o);const q=s=>o.querySelector(s);
const go=async()=>{q('#lgm').textContent='';const{data,error}=await sb.auth.signInWithPassword({email:q('#lge').value.trim(),password:q('#lgp').value});if(error){q('#lgm').textContent='로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.';return}o.remove();res(data.session)};
q('#lgb').onclick=go;q('#lgp').onkeydown=e=>{if(e.key=='Enter')go()};q('#lgs').onclick=()=>{o.remove();res(null)}})}
async function sbInit(){const c=window.PLANNER_CFG;if(!c||!c.url||!c.key)return null;
try{if(!window.supabase)await ld('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/dist/umd/supabase.min.js');
const sb=window.SB=supabase.createClient(c.url,c.key);let{data:{session}}=await sb.auth.getSession();if(!session)session=await askLogin(sb);if(!session){sys('로그인하지 않아 이 기기에만 저장 중');return null}
const uid=session.user.id;
return{set:async o=>{const{error}=await sb.from('planner_state').upsert({user_id:uid,json:o.json,rev:o.rev,updated_at:new Date().toISOString()});if(error)throw error},
onSnapshot:(cb,eb)=>{const f=async()=>{const{data,error}=await sb.from('planner_state').select('json,rev').eq('user_id',uid).maybeSingle();if(error){eb&&eb(error);return}cb({exists:!!data,data:()=>data&&{json:data.json,rev:+data.rev},fromCache:false,hasPendingWrites:false})};
f();document.addEventListener('visibilitychange',()=>{if(!document.hidden)f()});try{sb.channel('ps').on('postgres_changes',{event:'*',schema:'public',table:'planner_state',filter:'user_id=eq.'+uid},f).subscribe()}catch(e){}}}}
catch(e){sys('동기화 서버에 연결하지 못했습니다 · 이 기기에만 저장 중');return null}}
async function sbout(){try{await window.SB.auth.signOut()}catch(e){}location.reload()}
let SG={};
const sig=x=>JSON.stringify({...x,u:0}),CL=[['promos','p'],['tasks','t'],['goals','g']];
function sigAll(){SG={};CL.forEach(([c,k])=>(S[c]||[]).forEach(x=>SG[k+x.id]=sig(x)))}
function stamp(){const now=Date.now(),cur={};CL.forEach(([c,k])=>(S[c]||[]).forEach(x=>{const key=k+x.id,s=sig(x);cur[key]=1;if(SG[key]!==s){x.u=now;SG[key]=s}}));S.del=S.del||{};Object.keys(SG).forEach(k=>{if(!cur[k]){S.del[k]=now;delete SG[k]}})}
function mergeS(L,R){const del={...(R.del||{})};for(const k in(L.del||{}))del[k]=Math.max(del[k]||0,L.del[k]);const now=Date.now();for(const k in del)if(now-del[k]>9e9)delete del[k];const M={...R,del,v:SCHEMA};
CL.forEach(([c,k])=>{const mp=new Map();[...(R[c]||[]),...(L[c]||[])].forEach(x=>{const o=mp.get(x.id);if(!o||(x.u||0)>=(o.u||0))mp.set(x.id,x)});M[c]=[...mp.values()].filter(x=>!(del[k+x.id]>(x.u||0))).sort((a,b)=>a.id-b.id)});
const pm=new Map();[...(R.platforms||[]),...(L.platforms||[])].forEach(p=>pm.set(p.n,p));M.platforms=[...pm.values()];
const nw=(L.rev||0)>=(R.rev||0)?L:R,od=nw===L?R:L,dm=(a,b)=>{const o={};for(const k of new Set([...Object.keys(a||{}),...Object.keys(b||{})])){const x=a&&a[k],y=b&&b[k];o[k]=x&&y&&typeof x=='object'&&typeof y=='object'?dm(x,y):(y!==undefined?y:x)}return o};
['sales','pub','tpl'].forEach(k=>M[k]=dm(od[k],nw[k]));M.lastBackup=[L.lastBackup,R.lastBackup].filter(Boolean).sort().pop();M.id=Math.max(L.id||1,R.id||1);return M}
sigAll();
const sys=t=>{SYS=t;const e=$('#sys');if(e)e.textContent=t;sybU()};
const syc=()=>{const t=SYS||'';return/새로운 버전/.test(t)?['err','새로고침 필요']:/실패|오류|연결하지 못/.test(t)?['err',/연결하지 못/.test(t)?'연결 안 됨':'동기화 실패']:/오프라인/.test(t)?['off','오프라인']:/연결 중|동기화 중/.test(t)?['busy','동기화 중']:/동기화됨|켜짐/.test(t)?['ok',t.length<=12?t:'동기화됨']:['off','이 기기에만 저장']};
const sybH=()=>{const[c,l]=syc();return`<button id=syb class="syb ${c}" aria-label="동기화 상태: ${l}" data-a="sycl"><i></i>${l}</button>`},
sybU=()=>{const b=$('#syb');if(!b)return;const[c,l]=syc();b.className='syb '+c;b.innerHTML='<i></i>'+l;b.setAttribute('aria-label','동기화 상태: '+l)},
sycl=()=>{if(syc()[0]=='err'&&SY){sys('동기화 중…');push();toast('다시 동기화합니다')}else{tab='set';scrollTo(0,0);R()}};
addEventListener('offline',()=>{if(SY)sys('오프라인 · 이 기기에 저장 중')});
addEventListener('online',()=>{if(SY){sys('동기화 중…');push()}});
function push(){if(!SY||SBLOCK)return;sys('동기화 중…');clearTimeout(syTm);syTm=setTimeout(async()=>{try{await SY.set({json:JSON.stringify(S),rev:S.rev});sys('동기화됨 '+new Date().toTimeString().slice(0,5))}catch(e){sys('동기화 실패 · 이 기기에는 저장됨')}},1500)}
function adopt(r,rep){try{if(SBLOCK)return;const o0=JSON.parse(r.json);if((+o0.v||0)>SCHEMA){SBLOCK=1;sys('서버 데이터가 더 새로운 버전입니다 · 앱을 새로고침해 주세요');return}const o=migrate(o0),m=rep?o:mergeS(S,o),f=x=>[x.promos,x.tasks,x.goals,x.sales,x.pub,x.tpl,x.platforms,x.del].map(a=>JSON.stringify(a||null)).join('|'),ch=!rep&&f(m)!=f(o);m.rev=Math.max(r.rev,S.rev||0);S=m;sigAll();if(ch)S.rev=Date.now();try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}if(ch)push();else sys('동기화됨 '+new Date().toTimeString().slice(0,5));if(!$('#ov').classList.contains('on'))R()}catch(e){console.error('adopt 실패',e);sys('동기화 실패 · 서버 데이터를 처리하지 못했습니다')}}
