const products=[
{name:'Galaxy Book5 Pro 14',cpu:'Intel Core Ultra 7 258V',gen:'최신급',score:96,price:1379000,normal:1499000,ram:'32GB',ssd:'1TB',weight:'1.23kg'},
{name:'LG gram 16',cpu:'Intel Core Ultra 7 255H',gen:'최신급',score:93,price:1599000,normal:1699000,ram:'32GB',ssd:'1TB',weight:'1.19kg'},
{name:'Yoga Slim 7 14',cpu:'AMD Ryzen AI 9 365',gen:'최신급',score:95,price:1299000,normal:1399000,ram:'32GB',ssd:'1TB',weight:'1.39kg'},
{name:'Vivobook S 15',cpu:'Intel Core Ultra 5 225H',gen:'최신급',score:94,price:899000,normal:969000,ram:'16GB',ssd:'512GB',weight:'1.50kg'},
{name:'IdeaPad Slim 5 16',cpu:'AMD Ryzen 7 8845HS',gen:'1세대 전',score:92,price:779000,normal:839000,ram:'16GB',ssd:'512GB',weight:'1.82kg'},
{name:'Swift Go 14',cpu:'Intel Core Ultra 7 155H',gen:'1세대 전',score:90,price:929000,normal:999000,ram:'16GB',ssd:'1TB',weight:'1.32kg'}
];
let wow=true;
const fmt=n=>new Intl.NumberFormat('ko-KR').format(n)+'원';
function draw(){
 const sorted=[...products].sort((a,b)=>b.score-a.score);
 rankingCards.innerHTML=sorted.slice(0,6).map((p,i)=>`<article class="rank-card"><div class="rank">#${i+1} · ${p.score}점</div><h3>${p.name}</h3><div class="cpu">${p.cpu} · ${p.gen}</div><div class="price"><strong>${fmt(wow?p.price:p.normal)}</strong><span class="score">${p.score}점</span></div></article>`).join('');
 heroWinner.textContent=sorted[0].name; heroPrice.textContent=fmt(wow?sorted[0].price:sorted[0].normal); heroScore.textContent=sorted[0].score+'점';
 productPicker.innerHTML=products.map(p=>`<span class="pick-chip active">✓ ${p.name}</span>`).join(''); compareCount.textContent=products.length;
 const rows=[['오늘 가격',p=>fmt(wow?p.price:p.normal)],['가성비 점수',p=>p.score+'점'],['CPU 모델',p=>p.cpu],['CPU 최신성',p=>p.gen],['RAM',p=>p.ram],['SSD',p=>p.ssd],['무게',p=>p.weight]];
 compareTable.innerHTML='<thead><tr><th>비교 항목</th>'+products.map(p=>'<th>'+p.name+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr><td>'+r[0]+'</td>'+products.map(p=>'<td>'+r[1](p)+'</td>').join('')+'</tr>').join('')+'</tbody>';
 emptyCompare.style.display='none';
}
wowBtn.addEventListener('click',()=>{wow=true;wowBtn.classList.add('active');normalBtn.classList.remove('active');draw()});
normalBtn.addEventListener('click',()=>{wow=false;normalBtn.classList.add('active');wowBtn.classList.remove('active');draw()});
draw();