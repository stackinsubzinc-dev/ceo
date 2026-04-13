const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

(async () => {
  const page = await get('https://frontend-one-ashen-16.vercel.app/signup');
  const match = page.data.match(/\/static\/js\/main\.[^\"]+\.js/);
  console.log('PAGE_STATUS', page.status);
  console.log('MAIN_JS', match ? match[0] : 'NOT_FOUND');
  if (!match) return;
  const bundle = await get(`https://frontend-one-ashen-16.vercel.app${match[0]}`);
  console.log('BUNDLE_STATUS', bundle.status);
  console.log('HAS_OLD_RENDER', bundle.data.includes('ceo-1-34jx.onrender.com'));
  console.log('HAS_RAILWAY', bundle.data.includes('adequate-respect-production-7ef0.up.railway.app'));
})();