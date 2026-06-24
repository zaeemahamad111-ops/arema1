'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import styles from './page.module.css';
import CertificatesGallery from './CertificatesGallery';

export default function CertificatesPage() {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = `${t('certsPage.eyebrow')} — Arema Foods International`;
  }, [t]);

  return (
    <main style={{ paddingTop: 'var(--nav-height)' }}>
      {/* ── HEADER ───────────────────────────────────── */}
      <section style={{ padding: 'var(--space-12) 0 var(--space-8)', background: 'var(--pale-sand-20)' }}>
        <div className="container">
          <span className="eyebrow" style={{ display: 'block', marginBottom: 'var(--space-5)' }}>
            {t('certsPage.eyebrow')}
          </span>
          <h1 className="display-xl" style={{ color: 'var(--dark-text)', maxWidth: '16ch' }}>
            {t('certsPage.heading')}<br />
            <em style={{ fontStyle: 'italic', color: 'var(--arema-brown)' }}>{t('certsPage.headingEm')}</em>
          </h1>
          <p className="body-lg" style={{ color: 'var(--charcoal)', maxWidth: '60ch', marginTop: 'var(--space-5)' }}>
            {t('certsPage.desc')}
          </p>
        </div>
      </section>

      {/* ── GALLERY ───────────────────────────────────── */}
      <section className={styles.gallerySection}>
        <div className="container">
          <CertificatesGallery />
        </div>
      </section>
    </main>
  );
}
