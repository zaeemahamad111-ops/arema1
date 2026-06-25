const dns = require('dns');
if (dns.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) env[parts[0].trim()] = parts.slice(1).join('=').trim();
});

const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL'];
const ANON_KEY = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

const headers = {
  'apikey': ANON_KEY,
  'Authorization': `Bearer ${ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal'
};

const products = [
  { id: 'matta-rice', image_url: '/images/product-bag-nobg.png' },
  { id: 'kuruva-rice', image_url: '/images/product-bag-nobg.png' },
  { id: 'aromatic-rice', image_url: '/images/product-bag-nobg.png' },
  { id: 'biryani-rice', image_url: '/images/product-bag-nobg.png' },
  { id: 'navara-rice', image_url: '/images/product-bag-nobg.png' },
  { id: 'gandhakasala-rice', image_url: '/images/product-bag-nobg.png' },
  { id: 'jyothi-matta', image_url: '/images/product-bag-nobg.png' },
  { id: 'uma-matta', image_url: '/images/product-bag-nobg.png' },
  { id: 'kanjana-matta', image_url: '/images/product-bag-nobg.png' },
  { id: 'chitteni-matta', image_url: '/images/product-bag-nobg.png' },
  { id: 'ast-white-rice', image_url: '/images/white-rice.jpeg' },
  { id: 'puttu-podi', image_url: '/images/product-bag-nobg.png' },
  { id: 'idiyappam-podi', image_url: '/images/product-bag-nobg.png' },
  { id: 'pathiri-podi', image_url: '/images/product-bag-nobg.png' },
  { id: 'kondattam', image_url: '/images/product-bag-nobg.png' },
  { id: 'ari-kondattam', image_url: '/images/product-bag-nobg.png' },
  { id: 'mulaku-kondattam', image_url: '/images/product-bag-nobg.png' },
  { id: 'pavakka-kondattam', image_url: '/images/product-bag-nobg.png' },
  { id: 'payar-kondattam', image_url: '/images/product-bag-nobg.png' },
];

async function run() {
  // Upsert products
  const r1 = await fetch(`${SUPABASE_URL}/rest/v1/products?on_conflict=id`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(products)
  });
  console.log('Upsert products:', r1.status, await r1.text());

  // Check what columns exist
  const r2 = await fetch(`${SUPABASE_URL}/rest/v1/products?limit=1`, { headers });
  const data = await r2.json();
  console.log('Sample product:', JSON.stringify(data[0]));
}

run().catch(console.error);
