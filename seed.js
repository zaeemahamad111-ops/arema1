const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Load env variables from .env.local
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error("Please create .env.local file first");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const env = envContent.split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length > 0) {
    acc[key.trim()] = val.join('=').trim();
  }
  return acc;
}, {});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseAnonKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase URL or Anon Key in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const localesDir = path.join(__dirname, 'src/i18n/locales');
const codes = ['en', 'ar', 'de', 'es', 'fr', 'it', 'nl', 'ru', 'zh', 'ja', 'ko', 'ta', 'hi'];

function loadLocale(code) {
  const filePath = path.join(localesDir, `${code}.ts`);
  if (!fs.existsSync(filePath)) {
    console.error(`File ${code}.ts not found`);
    return null;
  }
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/import\s+.*?;/g, '');
  content = content.replace(/export\s+const\s+\w+\s*:\s*\w+\s*=\s*/, 'const obj = ');
  content = content.trim();
  if (content.endsWith(';')) {
    content = content.slice(0, -1);
  }
  content += '\nmodule.exports = obj;';
  
  const tempFile = path.join(__dirname, `temp_seed_${code}.js`);
  fs.writeFileSync(tempFile, content, 'utf-8');
  let data = null;
  try {
    data = require(tempFile);
  } catch (e) {
    console.error(`Failed to parse ${code}.ts:`, e.message);
  } finally {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    delete require.cache[require.resolve(tempFile)];
  }
  return data;
}

// Helper to flatten nested objects into dot-notation keys
function flattenObject(obj, prefix = '') {
  let results = {};
  for (const k in obj) {
    // Skip productsData and blogData, they go to their own tables
    if (prefix === '' && (k === 'productsData' || k === 'blogData')) {
      continue;
    }
    
    const key = prefix ? `${prefix}.${k}` : k;
    const val = obj[k];
    
    if (Array.isArray(val)) {
      // Store arrays (like whyArema.pillars) as stringified JSON
      results[key] = JSON.stringify(val);
    } else if (typeof val === 'object' && val !== null) {
      Object.assign(results, flattenObject(val, key));
    } else {
      results[key] = String(val);
    }
  }
  return results;
}

async function seed() {
  console.log("Starting Supabase database seeding...");
  
  const allLocales = {};
  for (const code of codes) {
    const data = loadLocale(code);
    if (data) {
      allLocales[code] = data;
    }
  }
  
  const enData = allLocales['en'];
  if (!enData) {
    console.error("Failed to load reference English translations. Aborting.");
    return;
  }
  
  // ── 1. Seed Site Translations ─────────────────────────────────────────────
  console.log("Seeding site translations...");
  const flatTranslations = [];
  
  for (const code of codes) {
    const localeData = allLocales[code];
    if (!localeData) continue;
    
    const flat = flattenObject(localeData);
    for (const key in flat) {
      flatTranslations.push({
        key,
        lang: code,
        value: flat[key]
      });
    }
  }
  
  // Upsert in batches of 100
  const batchSize = 100;
  for (let i = 0; i < flatTranslations.length; i += batchSize) {
    const batch = flatTranslations.slice(i, i + batchSize);
    const { error } = await supabase.from('site_translations').upsert(batch, { onConflict: 'key,lang' });
    if (error) {
      console.error(`Error seeding translations batch:`, error.message);
    }
  }
  console.log(`Seeded ${flatTranslations.length} site translations.`);
  
  // ── 2. Seed Products ──────────────────────────────────────────────────────
  console.log("Seeding products...");
  const products = [
    { id: 'matta-rice', image_url: '/images/product-bag-nobg.png', order_index: 0 },
    { id: 'kuruva-rice', image_url: '/images/product-bag-nobg.png', order_index: 1 },
    { id: 'aromatic-rice', image_url: '/images/product-bag-nobg.png', order_index: 2 },
    { id: 'biryani-rice', image_url: '/images/product-bag-nobg.png', order_index: 3 },
    { id: 'navara-rice', image_url: '/images/product-bag-nobg.png', order_index: 4 },
    { id: 'gandhakasala-rice', image_url: '/images/product-bag-nobg.png', order_index: 5 },
    { id: 'jyothi-matta', image_url: '/images/product-bag-nobg.png', order_index: 6 },
    { id: 'uma-matta', image_url: '/images/product-bag-nobg.png', order_index: 7 },
    { id: 'kanjana-matta', image_url: '/images/product-bag-nobg.png', order_index: 8 },
    { id: 'chitteni-matta', image_url: '/images/product-bag-nobg.png', order_index: 9 },
    { id: 'ast-white-rice', image_url: '/images/white-rice.jpeg', order_index: 10 },
    { id: 'puttu-podi', image_url: '/images/product-bag-nobg.png', order_index: 11 },
    { id: 'idiyappam-podi', image_url: '/images/product-bag-nobg.png', order_index: 12 },
    { id: 'pathiri-podi', image_url: '/images/product-bag-nobg.png', order_index: 13 },
    { id: 'kondattam', image_url: '/images/product-bag-nobg.png', order_index: 14 },
    { id: 'ari-kondattam', image_url: '/images/product-bag-nobg.png', order_index: 15 },
    { id: 'mulaku-kondattam', image_url: '/images/product-bag-nobg.png', order_index: 16 },
    { id: 'pavakka-kondattam', image_url: '/images/product-bag-nobg.png', order_index: 17 },
    { id: 'payar-kondattam', image_url: '/images/product-bag-nobg.png', order_index: 18 },
  ];
  
  // Upsert base products
  const { error: prodErr } = await supabase.from('products').upsert(products, { onConflict: 'id' });
  if (prodErr) {
    console.error("Error seeding products:", prodErr.message);
  } else {
    console.log(`Seeded ${products.length} products.`);
  }
  
  // Seed product translations
  const productTranslations = [];
  for (const code of codes) {
    const localeData = allLocales[code];
    if (!localeData || !localeData.productsData) continue;
    
    for (const prodId in localeData.productsData) {
      const prod = localeData.productsData[prodId];
      productTranslations.push({
        product_id: prodId,
        lang: code,
        name: prod.name || '',
        category: prod.category || '',
        tagline: prod.tagline || '',
        description: prod.description || '',
        highlights: prod.highlights || [],
        specs: prod.specs || []
      });
    }
  }
  
  const { error: prodTransErr } = await supabase.from('product_translations').upsert(productTranslations, { onConflict: 'product_id,lang' });
  if (prodTransErr) {
    console.error("Error seeding product translations:", prodTransErr.message);
  } else {
    console.log(`Seeded ${productTranslations.length} product translations.`);
  }

  // ── 3. Seed Blogs ─────────────────────────────────────────────────────────
  console.log("Seeding blogs...");
  const blogs = [
    { id: 'matta-rice-world-stage', image_url: '/images/blog-matta.jpg' },
    { id: 'palakkad-farmers', image_url: '/images/blog-farmers.jpg' },
    { id: 'export-standards', image_url: '/images/blog-quality.jpg' },
    { id: 'global-rice-markets', image_url: '/images/blog-trade.jpg' },
    { id: 'parboiling-process', image_url: '/images/blog-science.jpg' }
  ];
  
  const { error: blogErr } = await supabase.from('blogs').upsert(blogs, { onConflict: 'id' });
  if (blogErr) {
    console.error("Error seeding blogs:", blogErr.message);
  } else {
    console.log(`Seeded ${blogs.length} blogs.`);
  }
  
  // Seed blog translations
  const blogTranslations = [];
  for (const code of codes) {
    const localeData = allLocales[code];
    if (!localeData || !localeData.blogData) continue;
    
    for (const blogId in localeData.blogData) {
      const blog = localeData.blogData[blogId];
      blogTranslations.push({
        blog_id: blogId,
        lang: code,
        category: blog.category || '',
        readTime: blog.readTime || '',
        date: blog.date || '',
        title: blog.title || '',
        excerpt: blog.excerpt || '',
        body: blog.body || []
      });
    }
  }
  
  const { error: blogTransErr } = await supabase.from('blog_translations').upsert(blogTranslations, { onConflict: 'blog_id,lang' });
  if (blogTransErr) {
    console.error("Error seeding blog translations:", blogTransErr.message);
  } else {
    console.log(`Seeded ${blogTranslations.length} blog translations.`);
  }

  // ── 4. Seed Default Image Overrides ───────────────────────────────────────
  console.log("Seeding default image overrides...");
  const defaultImages = [
    { key: 'logo', url: '/images/logo.png' },
    { key: 'founder_video', url: '/videos/founder-story-compressed.mp4' },
    { key: 'whatsapp_number', url: '9778339292' } // can use settings too
  ];
  const { error: imgErr } = await supabase.from('image_overrides').upsert(defaultImages, { onConflict: 'key' });
  if (imgErr) {
    console.error("Error seeding image overrides:", imgErr.message);
  } else {
    console.log("Seeded default image overrides.");
  }
  
  console.log("Seeding completed successfully!");
}

seed();
