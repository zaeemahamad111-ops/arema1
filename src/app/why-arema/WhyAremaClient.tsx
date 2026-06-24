'use client';

import Image from 'next/image';
import styles from './WhyArema.module.css';
import { useLanguage } from '@/i18n/LanguageContext';

export default function WhyAremaPage() {
  const { t, currentTranslations, getImage } = useLanguage();
  const pillars = currentTranslations.whyAremaPage.pillars || [];
  const featureList = currentTranslations.whyAremaPage.featureList || [];

  return (
    <main>
      
      {/* ══════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════ */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>{t('whyAremaPage.heroLabel')}</span>
          <h1 className={styles.heroTitle}>
            {t('whyAremaPage.heroTitle')}
            <br />
            <em className={styles.heroTitleEm}>{t('whyAremaPage.heroTitleEm')}</em>
          </h1>
          <p className={styles.heroDesc}>
            {t('whyAremaPage.heroDesc')}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ACCENT IMAGE STRIP
      ══════════════════════════════════════════════ */}
      <div className={styles.heroImageStrip}>
        <Image 
          src={getImage('whyarema_strip', '/images/tl-02.png')}
          alt="Palakkadan paddy fields" 
          fill 
          sizes="100vw"
        />
      </div>

      {/* ══════════════════════════════════════════════
          THE 5 PILLARS
      ══════════════════════════════════════════════ */}
      <section className={styles.pillars}>
        <div className={styles.pillarsInner}>
          {/* Left Column - Sticky Header */}
          <div className={styles.pillarsSticky}>
            <span className={styles.pillarsLabel}>{t('whyAremaPage.valuesLabel')}</span>
            <h2 className={styles.pillarsHeading}>
              {t('whyAremaPage.valuesHeading')}
              <br />
              <em className={styles.pillarsHeadingEm}>{t('whyAremaPage.valuesHeadingEm')}</em>
            </h2>
          </div>

          {/* Right Column - Editorial List */}
          <div className={styles.pillarsList}>
            {pillars.map((pillar, index) => (
              <div key={pillar.title} className={styles.pillarItem}>
                <span className={styles.pillarIndex}>0{index + 1}</span>
                <div className={styles.pillarContent}>
                  <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                  <p className={pillar.body ? styles.pillarBody : styles.pillarDesc}>{pillar.body || (pillar as any).desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURE SPLIT
      ══════════════════════════════════════════════ */}
      <section className={styles.feature}>
        <div className={styles.featureInner}>
          <div className={styles.featureImageWrap}>
            <Image 
              src={getImage('whyarema_split', '/images/tl-04.png')}
              alt="Hands holding pure Palakkadan Matta rice" 
              fill 
              sizes="50vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={styles.featureContent}>
            <h2 className={styles.featureTitle}>
              {t('whyAremaPage.featureTitle')}
              <br />
              <em className={styles.featureTitleEm}>{t('whyAremaPage.featureTitleEm')}</em>
            </h2>
            <p className={styles.featureBody}>
              {t('whyAremaPage.featureBody')}
            </p>
            <div className={styles.featureList}>
              {featureList.map(item => (
                <div key={item} className={styles.featureListItem}>
                  <span className={styles.featureListDot} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
