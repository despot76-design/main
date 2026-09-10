import crypto from 'node:crypto';
import fs from 'node:fs/promises';

const ACCESS_KEY = process.env.COUPANG_ACCESS_KEY;
const SECRET_KEY = process.env.COUPANG_SECRET_KEY;
const DOMAIN = 'https://api-gateway.coupang.com';
const SEARCH_PATH = process.env.COUPANG_PARTNERS_SEARCH_PATH || '/v2/providers/affiliate_open_api/apis/openapi/products/search';

if (!ACCESS_KEY || !SECRET_KEY) {
  console.error('Missing COUPANG_ACCESS_KEY / COUPANG_SECRET_KEY');
  process.exit(1);
}

function signedDate() {
  const d = new Date();
  const yy = String(d.getUTCFullYear()).slice(-2);
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mi = String(d.getUTCMinutes()).padStart(2, '0');
  const ss = String(d.getUTCSeconds()).padStart(2, '0');
  return `${yy}${mm}${dd}T${hh}${mi}${ss}Z`;
}

function authorization(method, path, query) {
  const datetime = signedDate();
  const message = datetime + method + path + query;
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(message)
    .digest('hex');
  return `CEA algorithm=HmacSHA256, access-key=${ACCESS_KEY}, signed-date=${datetime}, signature=${signature}`;
}

async function search(keyword, limit = 10) {
  const params = new URLSearchParams({ keyword, limit: String(Math.min(limit, 10)) });
  const query = params.toString();
  const url = `${DOMAIN}${SEARCH_PATH}?${query}`;
  const res = await fetch(url, {
    headers: {
      Authorization: authorization('GET', SEARCH_PATH, query),
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });

  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = { raw: text }; }
  if (!res.ok) {
    throw new Error(`Coupang API ${res.status}: ${JSON.stringify(body)}`);
  }
  const rows = body?.data?.productData ?? body?.data ?? [];
  return Array.isArray(rows) ? rows : [];
}

function normalize(p, keyword) {
  return {
    source: 'coupang_partners',
    keyword,
    product_id: String(p.productId ?? ''),
    product_name: p.productName ?? '',
    current_price: Number(p.productPrice ?? 0) || null,
    image_url: p.productImage ?? null,
    affiliate_url: p.productUrl ?? null,
    is_rocket: Boolean(p.isRocket),
    is_free_shipping: p.isFreeShipping ?? null,
    raw: p,
    collected_at: new Date().toISOString(),
  };
}

function looksLikeLaptop(name = '') {
  const s = name.toLowerCase();
  const include = ['노트북', '랩탑', 'laptop', 'gram', '갤럭시북', 'vivobook', 'zenbook', 'ideapad', 'thinkpad', 'yoga', 'victus', 'omen', 'legion'];
  const exclude = ['거치대', '파우치', '가방', '충전기', '어댑터', '키스킨', '필름', '쿨러', '쿨링', '스탠드', '마우스', '키보드', '케이블', '액정 보호'];
  return include.some(x => s.includes(x)) && !exclude.some(x => s.includes(x));
}

const keywords = [
  '노트북',
  '삼성 노트북',
  'LG 그램',
  '레노버 노트북',
  'ASUS 노트북',
  'HP 노트북',
  '게이밍 노트북',
  '대학생 노트북',
];

const all = [];
for (const keyword of keywords) {
  try {
    const rows = await search(keyword, 10);
    all.push(...rows.map(p => normalize(p, keyword)).filter(p => looksLikeLaptop(p.product_name)));
  } catch (e) {
    console.error(`[${keyword}] ${e.message}`);
  }
}

const deduped = [...new Map(all.filter(x => x.product_id).map(x => [x.product_id, x])).values()];
await fs.mkdir('data', { recursive: true });
await fs.writeFile('data/coupang-products.json', JSON.stringify({ count: deduped.length, items: deduped }, null, 2));
console.log(`Saved ${deduped.length} unique laptop candidates to data/coupang-products.json`);
