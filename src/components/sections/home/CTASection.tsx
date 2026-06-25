'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './CTASection.module.css';
import { useLanguage } from '@/i18n/LanguageContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CTASection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );

      gsap.fromTo(
        actionsRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} id="cta">
      {/* Faded Gold Map in Background */}
      <div className={styles.mapBg} aria-hidden="true">
        <svg width="600" height="400" viewBox="0 0 600 400" fill="none" className={styles.mapSvg}>
          {/* Faded abstract connections mapping the world */}
          <circle cx="150" cy="180" r="2" fill="rgba(139,90,60,0.15)" />
          <circle cx="200" cy="160" r="3" fill="rgba(139,90,60,0.15)" />
          <circle cx="280" cy="190" r="2.5" fill="rgba(139,90,60,0.15)" />
          <circle cx="340" cy="120" r="3.5" fill="rgba(139,90,60,0.15)" />
          <circle cx="420" cy="240" r="2" fill="rgba(139,90,60,0.15)" />
          <circle cx="480" cy="150" r="4" fill="rgba(139,90,60,0.15)" />
          <circle cx="510" cy="200" r="2.5" fill="rgba(139,90,60,0.15)" />
          <circle cx="550" cy="250" r="3" fill="rgba(139,90,60,0.15)" />

          <path d="M150 180 Q200 160 280 190" stroke="rgba(139,90,60,0.06)" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M280 190 Q340 120 480 150" stroke="rgba(139,90,60,0.06)" strokeWidth="1.2" strokeDasharray="3 3" />
          <path d="M480 150 Q510 200 550 250" stroke="rgba(139,90,60,0.06)" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M280 190 Q420 240 550 250" stroke="rgba(139,90,60,0.06)" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Title */}
          <h2 ref={titleRef} className={styles.heading}>
            {t('cta.heading')}
          </h2>

          {/* Action Buttons */}
          <div ref={actionsRef} className={styles.actions}>
            <Link href="/contact" className={styles.btnPrimary}>
              {t('cta.btnPrimary')}
              <span className={styles.btnArrow}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </Link>

            <a href={`mailto:${t('contactPage.email')}`} className={styles.btnSecondary}>
              {t('cta.btnSecondary')}
              <span className={styles.btnArrow}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
