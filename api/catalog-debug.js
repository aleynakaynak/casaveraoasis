export default async function handler(req, res) {
  const urls = [
    'https://fliphtml5.com/check/kfpdr/casavera_dijital_1_agu_26/',
    'https://fliphtml5.com/kfpdr/casavera_dijital_1_agu_26/basic',
    'https://online.fliphtml5.com/kfpdr/casavera_dijital_1_agu_26/mobile/javascript/config.js'
  ];
  const out = [];
  for (const url of urls) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' }, redirect: 'follow' });
      const text = await r.text();
      const matches = [...text.matchAll(/(?:href|src)=["']([^"']+)["']/gi)]
        .map(m => m[1])
        .filter(x => /download|pdf|config\.js|javascript|book|original/i.test(x));
      const context = [...text.matchAll(/.{0,300}(?:DownloadPanel|download|\.pdf|originalFile|original|downloadUrl|62728631).{0,700}/gi)]
        .slice(0, 60)
        .map(m => m[0]);
      out.push({ url, status: r.status, finalUrl: r.url, contentType: r.headers.get('content-type'), length: text.length, matches: [...new Set(matches)].slice(0,180), context, full: text.length < 10000 ? text : undefined });
    } catch (e) {
      out.push({ url, error: String(e) });
    }
  }
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(out);
}
