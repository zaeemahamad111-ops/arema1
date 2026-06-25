'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './OurStory.module.css';
import { useLanguage } from '@/i18n/LanguageContext';

export default function OurStoryPage() {
  const { t, currentTranslations, getImage } = useLanguage();

  const beliefs = currentTranslations.ourStoryPage.beliefs || [];
  
  const stats = [
    { value: 'GI', label: t('ourStoryPage.stat1Label'), desc: t('ourStoryPage.stat1Desc') },
    { value: '100%', label: t('ourStoryPage.stat2Label'), desc: t('ourStoryPage.stat2Desc') },
    { value: '0', label: t('ourStoryPage.stat3Label'), desc: t('ourStoryPage.stat3Desc') },
    { value: '∞', label: t('ourStoryPage.stat4Label'), desc: t('ourStoryPage.stat4Desc') },
  ];

  const routes = [
    { code: t('ourStoryPage.route1Code'), region: t('ourStoryPage.route1Region'), ports: t('ourStoryPage.route1Ports'), status: t('ourStoryPage.routeStatus') },
    { code: t('ourStoryPage.route2Code'), region: t('ourStoryPage.route2Region'), ports: t('ourStoryPage.route2Ports'), status: t('ourStoryPage.routeStatus') },
    { code: t('ourStoryPage.route3Code'), region: t('ourStoryPage.route3Region'), ports: t('ourStoryPage.route3Ports'), status: t('ourStoryPage.routeStatus') },
    { code: t('ourStoryPage.route4Code') || 'ROUTE / 04', region: t('ourStoryPage.route4Region') || 'Australia & Africa', ports: t('ourStoryPage.route4Ports') || '', status: t('ourStoryPage.routeStatus') },
  ];

  const imageStrip = [
    { src: '/images/tl-02.png', cap: t('ourStoryPage.stripCap1') },
    { src: '/images/matta-grain-hands.png', cap: t('ourStoryPage.stripCap2') },
    { src: '/images/tl-01.png', cap: t('ourStoryPage.stripCap3') },
  ];

  return (
    <main>

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className={styles.hero}>
        <Image
          src={getImage('ourstory_hero', '/images/hero.png')}
          alt="Palakkad paddy fields at golden hour"
          fill
          className={styles.heroBg}
          priority
          sizes="100vw"
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.heroLabel}>
            <span className={styles.heroLabelLine} />
            <span className={styles.heroLabelText}>{t('ourStoryPage.heroLabel')}</span>
          </div>
          <h1 className={styles.heroHeadline}>
            {t('ourStoryPage.heroHeadline').split('Palakkad.')[0]}
            <em className={styles.heroHeadlineEm}>{t('ourStoryPage.heroHeadlineEm')}</em>
          </h1>
          <div className={styles.heroBottom}>
            <p className={styles.heroDesc}>
              {t('ourStoryPage.heroDesc')}
            </p>
            <div className={styles.heroScroll}>
              <div className={styles.heroScrollCircle}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(216,201,174,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                </svg>
              </div>
              <span className={styles.heroScrollText}>{t('ourStoryPage.heroScroll')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          OPENING STATEMENT
      ══════════════════════════════════════════════ */}
      <section className={styles.statement}>
        <div className={styles.statementInner}>
          <div className={styles.statementSide}>
            <span className={styles.statementSideLabel}>{t('ourStoryPage.aboutUs')}</span>
            <span className={styles.statementSideLine} />
          </div>
          <div className={styles.statementBody}>
            <h2 className={styles.statementLead}>
              {t('ourStoryPage.statementLead')}
              <em className={styles.statementLeadEm}>{t('ourStoryPage.statementLeadEm')}</em>
            </h2>
            <p className={styles.statementText}>
              {t('ourStoryPage.statementText1')}
            </p>
            <p className={styles.statementText}>
              {t('ourStoryPage.statementText2')}
            </p>
            <div className={styles.certBadges}>
              {[
                { val: 'GI', label: t('ourStoryPage.badgeGI') },
                { val: 'FSSAI', label: t('ourStoryPage.badgeFSSAI') },
                { val: 'APEDA', label: t('ourStoryPage.badgeAPEDA') },
                { val: '100%', label: t('ourStoryPage.badgeTraceable') },
              ].map(b => (
                <div key={b.val} className={styles.certBadge}>
                  <span className={styles.certBadgeVal}>{b.val}</span>
                  <span className={styles.certBadgeLabel}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOUNDER — The Man Behind Arema
      ══════════════════════════════════════════════ */}
      <section className={styles.founder}>
        <div className={styles.founderInner}>
          {/* Left — Photo */}
          <div className={styles.founderImageWrap}>
            <div className={styles.founderImageFrame}>
              <Image
                src={getImage('ourstory_founder', '/images/founder.jpg')}
                alt="Nibeesh J B — Founder, Arema Foods International"
                fill
                className={styles.founderImage}
                sizes="(max-width: 1024px) 90vw, 45vw"
                priority
              />
            </div>
            <div className={styles.founderBadge}>
              <span className={styles.founderBadgeLabel}>{t('ourStoryPage.founderBadgeCertified')}</span>
              <span className={styles.founderBadgeName}>Nibeesh J B</span>
            </div>
          </div>

          {/* Right — Story */}
          <div className={styles.founderContent}>
            <span className={styles.founderEyebrow}>{t('ourStoryPage.founderEyebrow')}</span>
            <h2 className={styles.founderHeading}>
              {t('ourStoryPage.founderHeading')}
              <em className={styles.founderHeadingEm}>{t('ourStoryPage.founderHeadingEm')}</em>
            </h2>
            <div className={styles.founderBody}>
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--charcoal)', fontSize: '1.1rem' }}>{t('ourStoryPage.founderTitle')}</p>
                <p style={{ margin: '0.4rem 0', fontSize: '0.95rem', color: 'var(--dark-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  {t('ourStoryPage.founderDegree')}
                </p>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>
                  <a href={`mailto:${t('contactPage.email')}`} style={{ color: 'var(--arema-brown)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    {t('contactPage.email')}
                  </a>
                </p>
              </div>
              <p>{t('ourStoryPage.founderPara1')}</p>
              <p>{t('ourStoryPage.founderPara2')}</p>
              <p>{t('ourStoryPage.founderPara3')}</p>
            </div>
            <div className={styles.founderQuote}>
              <span className={styles.founderQuoteMark}>&ldquo;</span>
              <p className={styles.founderQuoteText}>
                {t('ourStoryPage.founderQuote')}
              </p>
            </div>
            <div className={styles.founderCerts}>
              <div className={styles.founderCert}>
                <span className={styles.founderCertVal}>2025</span>
                <span className={styles.founderCertLabel}>{t('ourStoryPage.founderBadgeFounded')}</span>
              </div>
              <div className={styles.founderCert}>
                <span className={styles.founderCertVal}>GI</span>
                <span className={styles.founderCertLabel}>{t('ourStoryPage.founderBadgeCertified')}</span>
              </div>
              <div className={styles.founderCert}>
                <span className={styles.founderCertVal}>APEDA</span>
                <span className={styles.founderCertLabel}>{t('ourStoryPage.founderBadgeAPEDA')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3-PANEL IMAGE STRIP
      ══════════════════════════════════════════════ */}
      <div className={styles.imageStrip}>
        <div className={styles.imageStripGrid}>
          {imageStrip.map((img) => (
            <div key={img.src} className={styles.imageStripItem}>
              <Image src={img.src} alt={img.cap} fill style={{ objectFit: 'cover', objectPosition: 'center' }} sizes="34vw" />
              <div className={styles.imageStripOverlay} />
              <span className={styles.imageStripCaption}>{img.cap}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          VISION & MISSION
      ══════════════════════════════════════════════ */}
      <section className={styles.vm}>
        <div className={styles.vmInner}>
          <div className={styles.vmHeader}>
            <h2 className={styles.vmHeaderTitle}>
              {t('ourStoryPage.visionMissionTitle')}
              <em className={styles.vmHeaderTitleEm}>{t('ourStoryPage.visionMissionTitleEm')}</em>
            </h2>
            <p className={styles.vmHeaderNote}>
              {t('ourStoryPage.visionMissionNote')}
            </p>
          </div>
          <div className={styles.vmCols}>
            <div className={styles.vmCol}>
              <span className={styles.vmColTag}>{t('ourStoryPage.visionTitle')}</span>
              <h3 className={styles.vmColHeading}>
                {t('ourStoryPage.visionHeading')}
              </h3>
              <p className={styles.vmColBody}>
                {t('ourStoryPage.visionBody')}
              </p>
            </div>
            <div className={styles.vmDivider} />
            <div className={styles.vmCol}>
              <span className={styles.vmColTag}>{t('ourStoryPage.missionTitle')}</span>
              <h3 className={styles.vmColHeading}>
                {t('ourStoryPage.missionHeading')}
              </h3>
              <p className={styles.vmColBody}>
                {t('ourStoryPage.missionBody')}
              </p>
              <p className={styles.vmColHighlight}>
                {t('ourStoryPage.missionHighlight')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FULL BLEED QUOTE
      ══════════════════════════════════════════════ */}
      <section className={styles.fieldQuote}>
        <Image
          src={getImage('ourstory_quote_bg', '/images/tl-01.png')}
          alt="Farmer and son in the Palakkad paddy fields"
          fill
          className={styles.fieldQuoteBg}
          sizes="100vw"
        />
        <div className={styles.fieldQuoteOverlay} />
        <div className={styles.fieldQuoteContent}>
          <div className={styles.fieldQuoteBlock}>
            <span className={styles.fieldQuoteMark}>&ldquo;</span>
            <p className={styles.fieldQuoteText}>
              {t('ourStoryPage.fieldQuote')}
            </p>
            <span className={styles.fieldQuoteAttr}>
              {t('ourStoryPage.fieldQuoteAttr')}
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WHAT WE BELIEVE
      ══════════════════════════════════════════════ */}
      <section className={styles.beliefs}>
        <div className={styles.beliefsInner}>
          <div className={styles.beliefsHeader}>
            <span className={styles.beliefsHeaderLabel}>{t('ourStoryPage.beliefsTitle')}</span>
            <h2 className={styles.beliefsHeaderTitle}>
              {t('ourStoryPage.beliefsHeading')}
              <em className={styles.beliefsHeaderTitleEm}>{t('ourStoryPage.beliefsHeadingEm')}</em>
            </h2>
          </div>
          <div className={styles.beliefsList}>
            {beliefs.map((b, i) => (
              <div key={i} className={styles.beliefItem}>
                <span className={styles.beliefNum}>0{i + 1}</span>
                <div className={styles.beliefContent}>
                  <h3 className={styles.beliefTitle}>{b.title}</h3>
                  <p className={styles.beliefBody}>{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS BAND
      ══════════════════════════════════════════════ */}
      <section className={styles.statsBand}>
        <div className={styles.statsBandInner}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
              <p className={styles.statDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          GLOBAL REACH — EXPORT LEDGER
      ══════════════════════════════════════════════════════ */}
      <section className={styles.reach}>
        <div className={styles.reachHeader}>
          <span className={styles.reachLabel}>{t('ourStoryPage.reachLabel')}</span>
          <h2 className={styles.reachTitle}>
            {t('ourStoryPage.reachTitle').split('to the world')[0]}
            <em className={styles.reachTitleEm}>{t('ourStoryPage.reachTitleEm')}</em>
          </h2>
          <p className={styles.reachBody}>
            {t('ourStoryPage.reachBody')}
          </p>
        </div>

        {/* Infinite scrolling marquee of cities */}
        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeContent}>
            {[...Array(2)].map((_, i) => (
              <div key={i} className={styles.marqueeItem}>
                <span className={styles.marqueeText}>Dubai</span>
                <span className={styles.marqueeDot} />
                <span className={styles.marqueeText}>London</span>
                <span className={styles.marqueeDot} />
                <span className={styles.marqueeText}>Doha</span>
                <span className={styles.marqueeDot} />
                <span className={styles.marqueeText}>Amsterdam</span>
                <span className={styles.marqueeDot} />
                <span className={styles.marqueeText}>Toronto</span>
                <span className={styles.marqueeDot} />
                <span className={styles.marqueeText}>New York</span>
                <span className={styles.marqueeDot} />
              </div>
            ))}
          </div>
        </div>

        {/* Ledger Grid */}
        <div className={styles.ledgerContainer}>
          <div className={styles.ledgerGrid}>
            {routes.map((route, idx) => (
              <div key={idx} className={styles.ledgerCard}>
                <span className={styles.ledgerCode}>{route.code}</span>
                <h3 className={styles.ledgerRegion}>{route.region}</h3>
                <p className={styles.ledgerPorts}>{route.ports}</p>
                <div className={styles.ledgerStatus}>
                  <span className={styles.ledgerStatusDot} />
                  {route.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CLOSING
      ══════════════════════════════════════════════ */}
      <section className={styles.closing}>
        <Image
          src="/images/tl-05.png"
          alt="Arema export — cargo ship at sunset"
          fill
          className={styles.closingBg}
          sizes="100vw"
        />
        <div className={styles.closingOverlay} />
        <div className={styles.closingInner}>
          <p className={styles.closingQuote}>
            &ldquo;{t('ourStoryPage.closingQuote')}&rdquo;
          </p>
          <div className={styles.closingRight}>
            <span className={styles.closingAttr}>{t('ourStoryPage.closingAttr')}</span>
            <Link href="/products" className={styles.closingCta}>
              {t('ourStoryPage.closingCta')}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
