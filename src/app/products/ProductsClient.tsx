'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductsPage.module.css';
import { useLanguage } from '@/i18n/LanguageContext';

const CATALOG_PRODUCTS = [
  { id: 'jyothi-matta', image: '/images/product-bag-nobg.png' },
  { id: 'uma-matta', image: '/images/product-bag-nobg.png' },
  { id: 'kanjana-matta', image: '/images/product-bag-nobg.png' },
  { id: 'chitteni-matta', image: '/images/product-bag-nobg.png' },
  { id: 'matta-rice', image: '/images/product-bag-nobg.png' },
  { id: 'kuruva-rice', image: '/images/product-bag-nobg.png' },
  { id: 'aromatic-rice', image: '/images/product-bag-nobg.png' },
  { id: 'biryani-rice', image: '/images/product-bag-nobg.png' },
  { id: 'navara-rice', image: '/images/product-bag-nobg.png' },
  { id: 'gandhakasala-rice', image: '/images/product-bag-nobg.png' },
  { id: 'ast-white-rice', image: '/images/white-rice.jpeg' },
  { id: 'puttu-podi', image: '/images/product-bag-nobg.png' },
  { id: 'idiyappam-podi', image: '/images/product-bag-nobg.png' },
  { id: 'pathiri-podi', image: '/images/product-bag-nobg.png' },
  { id: 'kondattam', image: '/images/product-bag-nobg.png' },
  { id: 'ari-kondattam', image: '/images/product-bag-nobg.png' },
  { id: 'mulaku-kondattam', image: '/images/product-bag-nobg.png' },
  { id: 'pavakka-kondattam', image: '/images/product-bag-nobg.png' },
  { id: 'payar-kondattam', image: '/images/product-bag-nobg.png' },
];



export default function ProductsPage() {
  const { t, currentTranslations, dbProductsRaw } = useLanguage();

  const displayProducts = dbProductsRaw && dbProductsRaw.length > 0
    ? dbProductsRaw.map((p: any) => ({ id: p.id, image: p.image_url }))
    : CATALOG_PRODUCTS;

  // Build list with category info
  const productsWithCategory = displayProducts.map((prod) => {
    const locProd = currentTranslations.productsData[prod.id] || {
      name: prod.id,
      category: 'Kerala Heritage',
      tagline: '',
    };
    return { ...prod, locProd };
  });

  // Group by category
  const grouped: Record<string, typeof productsWithCategory> = {};
  productsWithCategory.forEach((prod) => {
    const cat = prod.locProd.category || 'Kerala Heritage';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(prod);
  });

  // Dynamic category grouping config — order matters for display
  const categoriesString = currentTranslations?.global?.productCategories || 'Kerala Heritage,Premium Grade,Aromatic Collection,Medicinal & Heritage,Specialty Aromatic,Rice Powders,Kondattams';
  const CATEGORY_GROUPS = categoriesString.split(',').map((c: string) => c.trim()).filter(Boolean).map((cat: string) => ({
    key: cat,
    label: cat
  }));

  // Only show groups that have products, in preferred order
  const orderedGroups = CATEGORY_GROUPS
    .filter((g: { key: string; label: string }) => grouped[g.key] && grouped[g.key].length > 0)
    .map((g: { key: string; label: string }) => ({ label: g.label, products: grouped[g.key] }));

  // Add any remaining categories not in CATEGORY_GROUPS
  Object.keys(grouped).forEach(cat => {
    if (!CATEGORY_GROUPS.find((g: { key: string; label: string }) => g.key === cat)) {
      orderedGroups.push({ label: cat, products: grouped[cat] });
    }
  });

  const renderProductCard = (prod: { id: string; image: string; locProd: any }) => (
    <Link key={prod.id} href={`/products/${prod.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <div className={styles.bagWrapper}>
          <Image
            src={prod.image}
            alt={prod.locProd.name}
            width={280}
            height={360}
            className={styles.riceBag}
            priority
          />
        </div>
        <div className={styles.shadow} />
      </div>
      <div className={styles.info}>
        <span className={styles.cardCategory}>{prod.locProd.category}</span>
        <h2 className={styles.cardTitle}>{prod.locProd.name}</h2>
        <p className={styles.cardTagline}>{prod.locProd.tagline}</p>
        <span className={styles.viewDetails}>
          {t('productsPage.viewSpecs')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </div>
    </Link>
  );

  return (
    <main className={styles.main}>
      {/* ── HERO HEADER ────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>{t('productsPage.heroLabel')}</span>
          <h1 className={styles.title}>{t('productsPage.heroTitle')}</h1>
          <p className={styles.subtitle}>
            {t('productsPage.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* ── CATALOG GROUPED SECTIONS ─────────────────────── */}
      <section className={styles.catalogSection}>
        <div className={styles.container}>
          {orderedGroups.map(({ label, products }) => (
            <div key={label} className={styles.categoryGroup}>
              <div className={styles.categoryHeader}>
                <h2 className={styles.categoryTitle}>{label}</h2>
                <div className={styles.categoryDivider} />
              </div>
              <div className={styles.grid}>
                {products.map(renderProductCard)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
