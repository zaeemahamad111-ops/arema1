'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ProductsSection.module.css';
import { useLanguage } from '@/i18n/LanguageContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const RECOMMENDED_PRODUCTS = [
  {
    id: 'jyothi-matta',
    name: 'Jyothi Matta Rice (Short Grain)',
    category: 'Kerala Heritage',
    tagline: 'The Nutrition King - high fiber, red bran, and diabetic-friendly.',
    image: '/images/product-bag-nobg.png',
  },
  {
    id: 'uma-matta',
    name: 'Uma Matta Rice (Long Grain)',
    category: 'Kerala Heritage',
    tagline: 'Easy Digest - light on stomach, quick cooking, and kid-friendly.',
    image: '/images/product-bag-nobg.png',
  },
  {
    id: 'kanjana-matta',
    name: 'Kanjana Matta (Vadi Matta)',
    category: 'Kerala Heritage',
    tagline: 'Golden Premium - golden-red, aromatic long grains for festive dining.',
    image: '/images/product-bag-nobg.png',
  },
];

export default function ProductsSection() {
  const { t, currentTranslations } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      const cards = gridRef.current?.children;
      if (cards) {
        gsap.fromTo(
          Array.from(cards),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} id="products">
      <div className={styles.container}>
        {/* Header Section */}
        <div ref={headerRef} className={styles.header}>
          <span className={styles.eyebrow}>{t('products.eyebrow')}</span>
          <h2 className={styles.heading}>{t('products.heading')}</h2>
          <p className={styles.body}>
            {t('products.body')}
          </p>
        </div>

        {/* 3-Column Grid */}
        <div ref={gridRef} className={styles.grid}>
          {RECOMMENDED_PRODUCTS.map((prod) => {
            const locProd = currentTranslations.productsData[prod.id] || prod;
            const imageUrl = (locProd as any).image_url || prod.image;
            return (
              <Link key={prod.id} href={`/products/${prod.id}`} className={styles.card}>
                <div className={styles.imageContainer}>
                  {/* Radial Spotlight Light Glow */}
                  <div className={styles.spotlight} />
                  {/* Floating Rice Bag */}
                  <div className={styles.bagWrapper}>
                    <Image
                      src={imageUrl}
                      alt={locProd.name}
                      width={300}
                      height={390}
                      className={styles.riceBag}
                      priority
                    />
                  </div>
                  {/* Shadow underneath to enhance float effect */}
                  <div className={styles.shadow} />
                </div>
                <div className={styles.info}>
                  <span className={styles.cardCategory}>{locProd.category}</span>
                  <h3 className={styles.cardTitle}>{locProd.name}</h3>
                  <p className={styles.cardTagline}>{locProd.tagline}</p>
                  <span className={styles.viewDetails}>
                    {t('products.viewDetails')}
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

        {/* Explore More CTA */}
        <div className={styles.ctaWrapper}>
          <Link href="/products" className="btn btn--primary">
            {t('products.viewMore')}
          </Link>
        </div>
      </div>
    </section>
  );
}
