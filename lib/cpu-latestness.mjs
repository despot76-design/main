const RULES = [
  {vendor:'Intel', test:/Core\s+Ultra\s+(?:X?[579])?\s*(3\d{2})/i, family:'Core Ultra Series 3', gen:3},
  {vendor:'Intel', test:/Core\s+Ultra\s+(?:X?[579])?\s*(2\d{2})/i, family:'Core Ultra Series 2', gen:2},
  {vendor:'Intel', test:/Core\s+Ultra\s+(?:X?[579])?\s*(1\d{2})/i, family:'Core Ultra Series 1', gen:1},
  {vendor:'Intel', test:/Core\s+(?:[735])\s*(3\d{2})/i, family:'Core Series 3', gen:3},

  {vendor:'AMD', test:/Ryzen\s+AI\s+(?:9\s+HX|9|7|5)\s*4\d{2}/i, family:'Ryzen AI 400 Series', gen:4},
  {vendor:'AMD', test:/Ryzen\s+AI\s+(?:9\s+HX|9|7|5)\s*3\d{2}/i, family:'Ryzen AI 300 Series', gen:3},
  {vendor:'AMD', test:/Ryzen\s+(?:9|7|5|3)\s*8\d{3}/i, family:'Ryzen 8000 Mobile', gen:2},

  {vendor:'Qualcomm', test:/Snapdragon\s+X2\s+(?:Elite\s+Extreme|Elite|Plus)/i, family:'Snapdragon X2 Series', gen:2},
  {vendor:'Qualcomm', test:/Snapdragon\s+X\s+(?:Elite|Plus)?/i, family:'Snapdragon X Series', gen:1},

  {vendor:'Apple', test:/Apple\s+M5(?:\s+(?:Pro|Max))?/i, family:'Apple M5 family', gen:5},
  {vendor:'Apple', test:/Apple\s+M4(?:\s+(?:Pro|Max))?/i, family:'Apple M4 family', gen:4},
  {vendor:'Apple', test:/Apple\s+M3(?:\s+(?:Pro|Max))?/i, family:'Apple M3 family', gen:3}
];

const LATEST = { Intel:3, AMD:4, Qualcomm:2, Apple:5 };

export function identifyCpuFamily(cpuName='') {
  const name = String(cpuName).trim();
  const rule = RULES.find(r => r.test.test(name));
  if (!rule) return { matched:false, vendor:null, family:null, generation:null, confidence:'low' };
  return { matched:true, vendor:rule.vendor, family:rule.family, generation:rule.gen, confidence:'rule' };
}

export function latestness(cpuName='') {
  const found = identifyCpuFamily(cpuName);
  if (!found.matched) {
    return { ...found, gap:null, label:'확인 필요', score:null, reason:'정확한 CPU 모델 또는 계보를 확인하지 못했습니다.' };
  }
  const latest = LATEST[found.vendor];
  const gap = Math.max(0, latest - found.generation);
  let label='최신';
  let score=100;
  if (gap===1) { label='1세대 전'; score=82; }
  else if (gap===2) { label='2세대 전'; score=64; }
  else if (gap>=3) { label=`${gap}세대 이상 전`; score=Math.max(30, 64-(gap-2)*12); }
  return { ...found, gap, label, score, reason:`${found.vendor} 노트북 CPU 계보 기준 ${label}` };
}

export function latestFamilyFor(vendor) {
  const generation = LATEST[vendor];
  if (generation == null) return null;
  return { vendor, generation };
}
