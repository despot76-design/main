const products=[
{id:'a',name:'샘플 노트북 A',brand:'SAMPLE',cpu:'CPU Alpha 7',cpuYear:'2026',cpuGen:'최신',cpuSingle:92,cpuMulti:88,cpuScore:90,gpu:'내장 GPU A',gpuScore:84,npu:'지원',ram:'32GB',ramType:'LPDDR5X',ramExpand:'불가',ssd:'1TB',ssdExpand:'가능',display:'14.0 OLED',resolution:'2880×1800',brightness:'500 nit',refresh:'120Hz',color:'DCI-P3 100%',weight:1.23,battery:76,ports:'USB-C 2 / USB-A 1 / HDMI',wifi:'Wi-Fi 7',os:'Windows 11',wow:1379000,normal:1499000,avg30:1510000,low30:1349000,value:96,performance:91,portability:94,displayScore:95,verdict:'지금 사도 좋음',use:'업무 · 휴대 · 콘텐츠'},
{id:'b',name:'샘플 노트북 B',brand:'SAMPLE',cpu:'CPU Beta 7',cpuYear:'2026',cpuGen:'최신',cpuSingle:90,cpuMulti:95,cpuScore:93,gpu:'내장 GPU B',gpuScore:81,npu:'지원',ram:'32GB',ramType:'LPDDR5X',ramExpand:'불가',ssd:'1TB',ssdExpand:'가능',display:'16.0 IPS',resolution:'2560×1600',brightness:'400 nit',refresh:'144Hz',color:'sRGB 100%',weight:1.19,battery:80,ports:'USB-C 2 / USB-A 2 / HDMI',wifi:'Wi-Fi 7',os:'Windows 11',wow:1599000,normal:1699000,avg30:1650000,low30:1549000,value:91,performance:94,portability:97,displayScore:89,verdict:'가격 양호',use:'업무 · 대화면 · 휴대'},
{id:'c',name:'샘플 노트북 C',brand:'SAMPLE',cpu:'CPU Gamma AI 9',cpuYear:'2026',cpuGen:'최신',cpuSingle:94,cpuMulti:96,cpuScore:96,gpu:'내장 GPU C',gpuScore:93,npu:'지원',ram:'32GB',ramType:'LPDDR5X',ramExpand:'불가',ssd:'1TB',ssdExpand:'가능',display:'14.5 OLED',resolution:'2880×1800',brightness:'500 nit',refresh:'120Hz',color:'DCI-P3 100%',weight:1.39,battery:70,ports:'USB-C 2 / USB-A 1 / HDMI',wifi:'Wi-Fi 7',os:'Windows 11',wow:1299000,normal:1399000,avg30:1450000,low30:1279000,value:98,performance:97,portability:88,displayScore:95,verdict:'강력 추천',use:'개발 · 영상 · 고성능'},
{id:'d',name:'샘플 노트북 D',brand:'SAMPLE',cpu:'CPU Delta 5',cpuYear:'2026',cpuGen:'최신',cpuSingle:86,cpuMulti:82,cpuScore:84,gpu:'내장 GPU D',gpuScore:78,npu:'지원',ram:'16GB',ramType:'DDR5',ramExpand:'가능',ssd:'512GB',ssdExpand:'가능',display:'15.6 OLED',resolution:'1920×1080',brightness:'400 nit',refresh:'60Hz',color:'DCI-P3 100%',weight:1.50,battery:63,ports:'USB-C 1 / USB-A 2 / HDMI',wifi:'Wi-Fi 6E',os:'Windows 11',wow:899000,normal:969000,avg30:1010000,low30:889000,value:97,performance:84,portability:83,displayScore:86,verdict:'강력 추천',use:'대학생 · 사무 · 일상'},
{id:'e',name:'샘플 노트북 E',brand:'SAMPLE',cpu:'CPU Epsilon 7',cpuYear:'2025',cpuGen:'1세대 전',cpuSingle:82,cpuMulti:89,cpuScore:86,gpu:'내장 GPU E',gpuScore:85,npu:'지원',ram:'16GB',ramType:'DDR5',ramExpand:'가능',ssd:'512GB',ssdExpand:'가능',display:'16.0 IPS',resolution:'1920×1200',brightness:'300 nit',refresh:'60Hz',color:'sRGB 100%',weight:1.82,battery:57,ports:'USB-C 1 / USB-A 2 / HDMI / SD',wifi:'Wi-Fi 6',os:'Windows 11',wow:779000,normal:839000,avg30:865000,low30:759000,value:94,performance:88,portability:67,displayScore:78,verdict:'가성비 좋음',use:'사무 · 가정 · 대화면'},
{id:'f',name:'샘플 노트북 F',brand:'SAMPLE',cpu:'CPU Zeta 7',cpuYear:'2025',cpuGen:'1세대 전',cpuSingle:84,cpuMulti:87,cpuScore:85,gpu:'내장 GPU F',gpuScore:80,npu:'지원',ram:'16GB',ramType:'LPDDR5X',ramExpand:'불가',ssd:'1TB',ssdExpand:'가능',display:'14.0 OLED',resolution:'2880×1800',brightness:'400 nit',refresh:'90Hz',color:'DCI-P3 100%',weight:1.32,battery:65,ports:'USB-C 2 / USB-A 2 / HDMI',wifi:'Wi-Fi 6E',os:'Windows 11',wow:929000,normal:999000,avg30:1030000,low30:909000,value:95,performance:86,portability:90,displayScore:93,verdict:'추천',use:'대학생 · 휴대 · 업무'}
];

let wow=true;
let selected=new Set(['a','c','d','e']);
let detailLevel='basic';
const fmt=n=>new Intl.NumberFormat('ko-KR').format(n)+'원';
const pct=(price,base)=>Math.round((1-price/base)*1000)/10;

const rowDefs=[
{group:'구매 판단',label:'오늘 가격',key:'price',level:'simple',value:p=>wow?p.wow:p.normal,type:'min',format:v=>fmt(v)},
{group:'구매 판단',label:'30일 평균가 대비',key:'discount30',level:'basic',value:p=>pct(wow?p.wow:p.normal,p.avg30),type:'max',format:v=>(v>=0?'−':'＋')+Math.abs(v)+'%'},
{group:'구매 판단',label:'30일 최저가',key:'low30',level:'basic',value:p=>p.low30,type:'min',format:fmt},
{group:'구매 판단',label:'가성비 점수',key:'value',level:'simple',value:p=>p.value,type:'max',format:v=>v+'점'},
{group:'구매 판단',label:'현재 가격 판정',key:'verdict',level:'simple',value:p=>p.verdict,format:v=>v},
{group:'구매 판단',label:'추천 용도',key:'use',level:'basic',value:p=>p.use,format:v=>v},

{group:'CPU',label:'CPU 모델',key:'cpu',level:'simple',value:p=>p.cpu,format:v=>v},
{group:'CPU',label:'CPU 출시연도',key:'cpuYear',level:'basic',value:p=>p.cpuYear,format:v=>v},
{group:'CPU',label:'CPU 최신성',key:'cpuGen',level:'simple',value:p=>p.cpuGen,format:v=>v},
{group:'CPU',label:'CPU 종합성능',key:'cpuScore',level:'simple',value:p=>p.cpuScore,type:'max',format:v=>v+'점'},
{group:'CPU',label:'싱글코어 성능',key:'cpuSingle',level:'basic',value:p=>p.cpuSingle,type:'max',format:v=>v+'점'},
{group:'CPU',label:'멀티코어 성능',key:'cpuMulti',level:'basic',value:p=>p.cpuMulti,type:'max',format:v=>v+'점'},
{group:'CPU',label:'NPU / AI',key:'npu',level:'basic',value:p=>p.npu,format:v=>v},

{group:'그래픽',label:'GPU',key:'gpu',level:'simple',value:p=>p.gpu,format:v=>v},
{group:'그래픽',label:'그래픽 성능',key:'gpuScore',level:'basic',value:p=>p.gpuScore,type:'max',format:v=>v+'점'},

{group:'메모리·저장장치',label:'RAM',key:'ram',level:'simple',value:p=>p.ram,format:v=>v},
{group:'메모리·저장장치',label:'RAM 규격',key:'ramType',level:'expert',value:p=>p.ramType,format:v=>v},
{group:'메모리·저장장치',label:'RAM 확장',key:'ramExpand',level:'basic',value:p=>p.ramExpand,format:v=>v},
{group:'메모리·저장장치',label:'SSD',key:'ssd',level:'simple',value:p=>p.ssd,format:v=>v},
{group:'메모리·저장장치',label:'SSD 추가/교체',key:'ssdExpand',level:'basic',value:p=>p.ssdExpand,format:v=>v},

{group:'화면',label:'패널 / 크기',key:'display',level:'simple',value:p=>p.display,format:v=>v},
{group:'화면',label:'해상도',key:'resolution',level:'basic',value:p=>p.resolution,format:v=>v},
{group:'화면',label:'밝기',key:'brightness',level:'expert',value:p=>p.brightness,format:v=>v},
{group:'화면',label:'주사율',key:'refresh',level:'basic',value:p=>p.refresh,format:v=>v},
{group:'화면',label:'색재현율',key:'color',level:'expert',value:p=>p.color,format:v=>v},
{group:'화면',label:'화면 평가',key:'displayScore',level:'basic',value:p=>p.displayScore,type:'max',format:v=>v+'점'},

{group:'휴대성',label:'무게',key:'weight',level:'simple',value:p=>p.weight,type:'min',format:v=>v.toFixed(2)+'kg'},
{group:'휴대성',label:'배터리',key:'battery',level:'basic',value:p=>p.battery,type:'max',format:v=>v+'Wh'},
{group:'휴대성',label:'휴대성 점수',key:'portability',level:'basic',value:p=>p.portability,type:'max',format:v=>v+'점'},

{group:'연결·기타',label:'포트',key:'ports',level:'expert',value:p=>p.ports,format:v=>v},
{group:'연결·기타',label:'무선랜',key:'wifi',level:'expert',value:p=>p.wifi,format:v=>v},
{group:'연결·기타',label:'운영체제',key:'os',level:'expert',value:p=>p.os,format:v=>v},
{group:'종합',label:'전체 성능점수',key:'performance',level:'simple',value:p=>p.performance,type:'max',format:v=>v+'점'}
];

function levelAllowed(row){
 if(detailLevel==='expert') return true;
 if(detailLevel==='basic') return row.level!=='expert';
 return row.level==='simple';
}
function uniqueValues(row,list){return new Set(list.map(p=>String(row.value(p)))).size;}
function bestValue(row,list){
 if(!row.type||!list.length) return null;
 const vals=list.map(p=>row.value(p)).filter(v=>typeof v==='number'&&!Number.isNaN(v));
 if(!vals.length) return null;
 return row.type==='max'?Math.max(...vals):Math.min(...vals);
}
function drawRanking(){
 const sorted=[...products].sort((a,b)=>b.value-a.value);
 rankingCards.innerHTML=sorted.map((p,i)=>`<article class="rank-card"><div class="rank">#${i+1} · 가성비 ${p.value}점</div><h3>${p.name}</h3><div class="cpu">${p.cpu} · ${p.cpuGen}</div><div class="price"><strong>${fmt(wow?p.wow:p.normal)}</strong><span class="score">성능 ${p.performance}</span></div><button class="rank-add ${selected.has(p.id)?'selected':''}" data-id="${p.id}">${selected.has(p.id)?'✓ 비교함에 담김':'＋ 비교함 담기'}</button></article>`).join('');
 const top=sorted[0];
 heroWinner.textContent=top.name; heroPrice.textContent=fmt(wow?top.wow:top.normal); heroScore.textContent=top.value+'점';
}
function drawPicker(){
 productPicker.innerHTML=products.map(p=>`<button class="pick-chip ${selected.has(p.id)?'active':''}" data-id="${p.id}">${selected.has(p.id)?'✓':'＋'} ${p.name}</button>`).join('');
 compareCount.textContent=selected.size;
}
function drawTable(){
 const list=products.filter(p=>selected.has(p.id));
 if(!list.length){compareTable.innerHTML='';emptyCompare.style.display='block';return;}
 emptyCompare.style.display='none';
 const diff=document.getElementById('diffOnly').checked;
 let rows=rowDefs.filter(levelAllowed).filter(r=>!diff||uniqueValues(r,list)>1);
 let html='<thead><tr><th>비교 항목</th>'+list.map(p=>`<th><div class="table-product"><b>${p.name}</b><small>${p.cpu}</small><button class="remove-btn" data-id="${p.id}">비교에서 빼기</button></div></th>`).join('')+'</tr></thead><tbody>';
 let lastGroup='';
 for(const row of rows){
   if(row.group!==lastGroup){html+=`<tr class="group-row"><td colspan="${list.length+1}">${row.group}</td></tr>`;lastGroup=row.group;}
   const best=bestValue(row,list);
   html+=`<tr><td>${row.label}</td>`+list.map(p=>{const raw=row.value(p);const cls=best!==null&&raw===best?'best':'';return `<td class="${cls}">${row.format(raw)}${cls?' <span class="best-tag">BEST</span>':''}</td>`}).join('')+'</tr>';
 }
 compareTable.innerHTML=html+'</tbody>';
}
function redraw(){drawRanking();drawPicker();drawTable();}
function toggle(id){
 if(selected.has(id)) selected.delete(id);
 else if(selected.size<8) selected.add(id);
 else alert('한 번에 최대 8대까지 비교할 수 있습니다.');
 redraw();
}

document.addEventListener('click',e=>{
 const chip=e.target.closest('.pick-chip,.rank-add'); if(chip){toggle(chip.dataset.id);return;}
 const rem=e.target.closest('.remove-btn'); if(rem){selected.delete(rem.dataset.id);redraw();return;}
 const detail=e.target.closest('.detail-btn'); if(detail){document.querySelectorAll('.detail-btn').forEach(b=>b.classList.remove('active'));detail.classList.add('active');detailLevel=detail.dataset.level;drawTable();}
});
document.getElementById('diffOnly').addEventListener('change',drawTable);
wowBtn.addEventListener('click',()=>{wow=true;wowBtn.classList.add('active');normalBtn.classList.remove('active');redraw()});
normalBtn.addEventListener('click',()=>{wow=false;normalBtn.classList.add('active');wowBtn.classList.remove('active');redraw()});
redraw();