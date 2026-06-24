'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductsPage.module.css';
import { useLanguage } from '@/i18n/LanguageContext';

const CATALOG_PRODUCTS = [
  { id: 'matta-rice', image: '/images/product-bag-nobg.png' },
  { id: 'kuruva-rice', image: '/images/product-bag-nobg.png' },
  { id: 'aromatic-rice', image: '/images/product-bag-nobg.png' },
  { id: 'biryani-rice', image: '/images/product-bag-nobg.png' },
  { id: 'navara-rice', image: '/images/product-bag-nobg.png' },
  { id: 'gandhakasala-rice', image: '/images/product-bag-nobg.png' },
  { id: 'jyothi-matta', image: '/images/product-bag-nobg.png' },
  { id: 'uma-matta', image: '/images/product-bag-nobg.png' },
  { id: 'kanjana-matta', image: '/images/product-bag-nobg.png' },
  { id: 'chitteni-matta', image: '/images/product-bag-nobg.png' },
  { id: 'ast-white-rice', image: '/images/product-bag-nobg.png' },
  { id: 'puttu-podi', image: '/images/product-bag-nobg.png' },
  { id: 'idiyappam-podi', image: '/images/product-bag-nobg.png' },
  { id: 'pathiri-podi', image: '/images/product-bag-nobg.png' },
  { id: 'kondattam', image: '/images/product-bag-nobg.png' },
];

export default function ProductsPage() {
  const { t, currentTranslations, dbProductsRaw } = useLanguage();

  const displayProducts = dbProductsRaw && dbProductsRaw.length > 0
    ? dbProductsRaw.map((p: any) => ({ id: p.id, image: p.image_url }))
    : CATALOG_PRODUCTS;

  return (
    <main className={styles.main}>
      <div style={{ background: '#fff9e6', border: '1px solid #ffe0b2', padding: '12px', margin: '20px auto', maxWidth: '1200px', borderRadius: '8px', color: '#b78103', fontSize: '13px', fontFamily: 'monospace' }}>
        Debug: dbProductsRaw length = {dbProductsRaw?.length || 0}. 
        IDs: {JSON.stringify(dbProductsRaw?.map((p: any) => p.id))}. 
        displayProducts length = {displayProducts.length}
      </div>
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

      {/* ── CATALOG GRID SECTION ──────────────────────────── */}
      <section className={styles.catalogSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {displayProducts.map((prod) => {
              const locProd = currentTranslations.productsData[prod.id] || {
                name: prod.id,
                category: 'Rice',
                tagline: '',
              };
              return (
                <Link key={prod.id} href={`/products/${prod.id}`} className={styles.card}>
                  <div className={styles.imageContainer}>
                    {/* Floating Rice Bag */}
                    <div className={styles.bagWrapper}>
                      <Image
                        src={prod.image}
                        alt={locProd.name}
                        width={280}
                        height={360}
                        className={styles.riceBag}
                        priority
                      />
                    </div>
                    {/* Shadow underneath to enhance float effect */}
                    <div className={styles.shadow} />
                  </div>
                  <div className={styles.info}>
                    <span className={styles.cardCategory}>{locProd.category}</span>
                    <h2 className={styles.cardTitle}>{locProd.name}</h2>
                    <p className={styles.cardTagline}>{locProd.tagline}</p>
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
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
