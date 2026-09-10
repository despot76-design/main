export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.authorization;

  if (secret && auth !== `Bearer ${secret}`) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  // v1 scaffold: connect the real Coupang/product-price collector here.
  // The UI currently uses DEMO data and must stay labeled as such until
  // this endpoint writes verified product, price and CPU records to storage.
  return res.status(200).json({
    ok: true,
    mode: 'scaffold',
    scheduledFor: '05:00 Asia/Seoul',
    message: 'Refresh endpoint is ready; real data collector is not connected yet.'
  });
}
