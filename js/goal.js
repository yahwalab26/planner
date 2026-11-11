/* goal.js — 목표 탭: 사업 목표(vGoal/GF/ng/eg/gp) (로드 순서 5/8) */
const U={'매출':'원','출판사 몫':'원','신간 수':'권','계약 수':'건','프로모션 참여':'건','기타':''};
const GF=[['title','목표 이름 (예: 4분기 신간 5권)','text',null,'req'],['period','구분','sel',()=>['연간','분기','월'],'half'],['metric','지표','sel',()=>['매출','출판사 몫','신간 수','계약 수','프로모션 참여','기타'],'half'],['label','기간 (2026 / 2026 Q4 / 2026-11)','text'],
['','수치','sec'],['target','목표값','num',null,'half'],['current','현재 실적','num',null,'half'],['unit','단위 (원, 권, 건)','text'],['auto','지표 매출=플랫폼 정산액, 출판사 몫=출판사 순수익 합계로 자동 계산','chk'],
['','메모','sec','fold'],['note','점검 메모','area']];
function vGoal(){let h=`<div class=hd><h2>사업 목표</h2><button onclick="ng()">${ico('plus',18)} 목표</button></div>`;
['연간','분기','월'].forEach(k=>{const l=S.goals.filter(g=>g.period==k);if(!l.length)return;h+=`<h3>${k}</h3>`+l.map(g=>{const p=g.target?Math.min(100,Math.round(gcur(g)/g.target*100)):0,n=S.promos.filter(x=>x.goal==g.title).length;return`<div class=cd tabindex=0 role=button onclick="eg(${g.id})"><b>${esc(g.title)}</b> <span class=tag>${esc(g.metric||'')} ${esc(g.label||'')}</span> <button class=sc onclick="event.stopPropagation();gp(${g.id})" style="padding:3px 10px;float:right">+1</button><div class=pb><i style="width:${p}%"></i></div><small>${gcur(g).toLocaleString()} / ${(+g.target).toLocaleString()} ${esc(g.unit||'')} · ${p}%${n?' · 연결 프로모션 '+n+'건':''}</small>${g.note?`<small>${esc(g.note)}</small>`:''}</div>`}).join('')});
return h+(S.goals.length?'':`<div class=em><p>아직 등록한 목표가 없습니다. 연간·분기·월 목표를 등록하고 실적을 갱신하며 점검해 보세요. 프로모션도 목표에 연결할 수 있습니다.</p><button onclick="ng()">${ico('plus',18)} 목표 등록</button></div>`)}
const gp=id=>{const g=S.goals.find(x=>x.id==id);g.current=(+g.current||0)+1;save();R()};
const ng=()=>form('목표 등록',GF,{period:'연간',current:0},v=>{if(!v.title)return 0;v.unit=v.unit||U[v.metric];S.goals.push({id:nid(),...v});save();R();return 1});
function eg(id){const g=S.goals.find(x=>x.id==id);form('목표 수정·실적 갱신',GF,g,v=>{if(!v.title)return 0;v.unit=v.unit||U[v.metric];Object.assign(g,v);save();R();return 1},()=>{S.goals=S.goals.filter(x=>x.id!=id);save();R()})}
