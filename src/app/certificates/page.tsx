import type { Metadata } from 'next';
import styles from './page.module.css';
import CertificatesGallery from './CertificatesGallery';

export const metadata: Metadata = {
  title: 'Certificates — Arema Foods International',
  description: 'View our official certifications, GI tags, and quality assurance documents.',
};

export default function CertificatesPage() {
  return (
    <main style={{ paddingTop: 'var(--nav-height)' }}>
      {/* ── HEADER ───────────────────────────────────── */}
      <section style={{ padding: 'var(--space-12) 0 var(--space-8)', background: 'var(--pale-sand-20)' }}>
        <div className="container">
          <span className="eyebrow" style={{ display: 'block', marginBottom: 'var(--space-5)' }}>Our Certifications</span>
          <h1 className="display-xl" style={{ color: 'var(--dark-text)', maxWidth: '16ch' }}>
            Proof of<br />
            <em style={{ fontStyle: 'italic', color: 'var(--arema-brown)' }}>Authenticity</em>
          </h1>
          <p className="body-lg" style={{ color: 'var(--charcoal)', maxWidth: '60ch', marginTop: 'var(--space-5)' }}>
            We do not just claim authenticity; we prove it. Below are our official certifications, 
            GI tags, and quality assurance documents that guarantee the purity of Arema Foods.
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
