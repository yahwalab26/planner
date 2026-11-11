/* events.js — 화면의 모든 클릭·입력·키 연결표 (로드 순서 8/9). 마크업은 data-a(클릭)·data-ch(change)·data-in(input)·data-en(Enter)로 동작 이름만 적고,
   실제 연결은 여기 한 곳에서 한다. 새 버튼을 만들 때: 마크업에 data-a="이름" data-v="값" → 아래 CLK 에 이름 추가. HTML 속성으로 직접 이벤트 코드를 쓰지 않는다. */
const toN=v=>/^-?\d+$/.test(v)?+v:v;
const CLK={
  tab:v=>{tab=v;scrollTo(0,0);R()},
  /* 폼·시트 */ cl:()=>cl(),save:()=>window._s(),del2:()=>del2(),
  /* 홈 */ qa:()=>qa(),tg:v=>tg(toN(v)),et:v=>et(toN(v)),nt:v=>nt(v),sd:v=>sd(v),mv:v=>mv(+v),goT:()=>goT(),setcv:v=>setcv(v),
  /* 프로모션 */ np:()=>np(),ep:v=>ep(toN(v)),stsheet:v=>stsheet(toN(v)),pfs:v=>pfs(+v),pdo:(v,el)=>{pdo=!el.parentNode.open},pv:v=>{pv=v;R()},gm:v=>gm(+v),gr:v=>{gr=v;R()},
  /* 매출 */ es:v=>es(...v.split('-').map(Number)),sk:v=>{sk=v;R()},sy:v=>{sy+=+v;R()},spp:()=>spp(),
  /* 목표 */ ng:()=>ng(),eg:v=>eg(toN(v)),gp:v=>gp(toN(v)),
  /* 설정 */ etp:v=>etp(+v),npf:()=>npf(),tx:()=>tx(),xl:()=>xl(),ics:()=>ics(),ex:()=>ex(),im:()=>im(),sbout:()=>sbout(),
  /* 동기화 칩 */ sycl:()=>sycl()
},
CHG={tg:v=>tg(toN(v)),xi:(v,el)=>xi(el)},
INP={qp:()=>qp(),pfl:()=>pfl()},
ENT={qa:()=>qa()};
const run=(T,k,el,e)=>{const f=T[k];if(f)f(el.dataset.v,el,e);else console.warn('연결되지 않은 동작:',k)};
document.addEventListener('click',e=>{const el=e.target.closest('[data-a]');if(el)run(CLK,el.dataset.a,el,e)});
document.addEventListener('change',e=>{const el=e.target.closest('[data-ch]');if(el)run(CHG,el.dataset.ch,el,e)});
document.addEventListener('input',e=>{const el=e.target.closest('[data-in]');if(el)run(INP,el.dataset.in,el,e)});
document.addEventListener('keydown',e=>{if(e.key!='Enter'||e.isComposing)return;const el=e.target.closest('[data-en]');if(el)run(ENT,el.dataset.en,el,e)});
