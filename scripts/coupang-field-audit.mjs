import fs from 'node:fs/promises';

const urls = process.argv.slice(2);
if (!urls.length) {
  console.error('사용법: node scripts/coupang-field-audit.mjs <쿠팡 상품 URL> ...');
  process.exit(1);
}

const fields = {
  productName: /<h1[^>]*>([\s\S]*?)<\/h1>/i,
  productNumber: /쿠팡상품번호\s*[:：]?\s*([0-9]+\s*-\s*[0-9]+)/i,
  modelNumber: /(?:Manufacturer Part Number|가전 모델|모델명)\s*[:：]?\s*([^<\n]+)/i,
  cpu: /CPU\s*모델명\s*[:：]?\s*([^<\n]+)/i,
  cpuBrand: /CPU브랜드\s*[:：]?\s*([^<\n]+)/i,
  storage: /저장장치\s*[:：]?\s*([^<\n]+)/i,
  resolution: /해상도(?:\s*\([^)]*\))?\s*[:：]?\s*([^<\n]+)/i,
  panel: /패널\s*[:：]?\s*([^<\n]+)/i,
  screenSize: /화면크기\s*[:：]?\s*([^<\n]+)/i,
  releaseDate: /출시년월\s*[:：]?\s*([^<\n]+)/i,
  wowPrice: /와우(?:쿠폰)?할인가[\s\S]{0,250}?([0-9][0-9,]{3,})\s*원/i,
  normalPrice: /일반할인가[\s\S]{0,200}?([0-9][0-9,]{3,})\s*원/i,
};

const strip = (s='') => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; NotePickAudit/0.1; +https://github.com/despot76-design/main)',
      'accept-language': 'ko-KR,ko;q=0.9,en;q=0.8',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return await res.text();
}

function extract(html) {
  const out = {};
  for (const [key, re] of Object.entries(fields)) {
    const m = html.match(re);
    out[key] = m ? strip(m[1]) : null;
  }
  return out;
}

const rows = [];
for (const url of urls) {
  try {
    const html = await fetchHtml(url);
    rows.push({ url, ok: true, ...extract(html) });
  } catch (error) {
    rows.push({ url, ok: false, error: String(error?.message || error) });
  }
}

const keys = Object.keys(fields);
const successful = rows.filter(r => r.ok);
const coverage = Object.fromEntries(keys.map(key => {
  const hit = successful.filter(r => r[key] !== null && r[key] !== '').length;
  return [key, {
    hits: hit,
    total: successful.length,
    pct: successful.length ? Math.round(hit / successful.length * 1000) / 10 : 0,
  }];
}));

const result = {
  generatedAt: new Date().toISOString(),
  requested: urls.length,
  fetched: successful.length,
  coverage,
  rows,
};

await fs.mkdir('data', { recursive: true });
await fs.writeFile('data/coupang-field-audit.json', JSON.stringify(result, null, 2), 'utf8');
console.log(JSON.stringify(result, null, 2));
