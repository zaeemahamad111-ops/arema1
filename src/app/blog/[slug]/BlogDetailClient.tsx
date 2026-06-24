'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';

interface Article {
  id: string;
  category: string;
  readTime: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  body: string[];
  author: string;
  authorRole: string;
}

export default function BlogDetailClient({ article }: { article: Article }) {
  const { currentTranslations, t } = useLanguage();

  const trans = currentTranslations.blogData?.[article.id];
  const translatedArticle = {
    ...article,
    category: trans?.category || article.category,
    readTime: trans?.readTime || article.readTime,
    date: trans?.date || article.date,
    title: trans?.title || article.title,
    excerpt: trans?.excerpt || article.excerpt,
    body: trans?.body || article.body,
    image: (trans as any)?.image_url || article.image,
  };

  useEffect(() => {
    document.title = `${translatedArticle.title} — Arema Foods`;
  }, [translatedArticle.title]);

  return (
    <main style={{ paddingTop: 'var(--nav-height)', background: 'var(--light-surface)' }}>
      {/* ── HERO IMAGE ─────────────────────────────── */}
      <div style={{ position: 'relative', width: '100%', height: '480px', overflow: 'hidden' }}>
        <Image
          src={translatedArticle.image}
          alt={translatedArticle.title}
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(26,20,14,0.3) 0%, rgba(26,20,14,0.85) 100%)',
          }}
        />
        {/* Overlay content */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 'var(--space-6) 40px',
            maxWidth: 'calc(var(--container-narrow) + 80px)',
            margin: '0 auto',
          }}
        >
          <Link
            href="/blog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-2xs)',
              fontWeight: 600,
              letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase',
              color: 'rgba(250,248,245,0.70)',
              textDecoration: 'none',
              marginBottom: 'var(--space-3)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            {t('blogPage.eyebrow')}
          </Link>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-2xs)',
              fontWeight: 600,
              letterSpacing: 'var(--tracking-widest)',
              textTransform: 'uppercase',
              color: 'var(--pale-sand)',
            }}>{translatedArticle.category}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(250,248,245,0.4)' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-2xs)', color: 'rgba(250,248,245,0.55)' }}>{translatedArticle.readTime}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(250,248,245,0.4)' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-2xs)', color: 'rgba(250,248,245,0.55)' }}>{translatedArticle.date}</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'var(--light-surface)',
            lineHeight: 'var(--leading-snug)',
            letterSpacing: 'var(--tracking-snug)',
            maxWidth: '22ch',
            margin: 0,
          }}>{translatedArticle.title}</h1>
        </div>
      </div>

      {/* ── ARTICLE BODY ───────────────────────────── */}
      <article style={{
        maxWidth: 'var(--container-narrow)',
        margin: '0 auto',
        padding: 'var(--space-8) 40px var(--space-10)',
      }}>
        {/* Byline */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          paddingBottom: 'var(--space-5)',
          marginBottom: 'var(--space-5)',
          borderBottom: '1px solid var(--pale-sand-40)',
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'var(--grad-sand-brown)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(250,248,245,0.8)" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--dark-text)', margin: 0 }}>{translatedArticle.author}</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-2xs)', color: 'var(--charcoal-60)', margin: 0 }}>{translatedArticle.authorRole}</p>
          </div>
        </div>

        {/* Lead */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-base)',
          fontWeight: 500,
          color: 'var(--dark-text)',
          lineHeight: 'var(--leading-relaxed)',
          marginBottom: 'var(--space-5)',
          borderLeft: '3px solid var(--arema-brown)',
          paddingLeft: 'var(--space-3)',
        }}>
          {translatedArticle.excerpt}
        </p>

        {/* Body paragraphs */}
        {translatedArticle.body.map((para, i) => (
          <p key={i} style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--charcoal)',
            lineHeight: 'var(--leading-loose)',
            marginBottom: 'var(--space-4)',
          }}>
            {para}
          </p>
        ))}

        {/* Back link */}
        <div style={{
          marginTop: 'var(--space-7)',
          paddingTop: 'var(--space-5)',
          borderTop: '1px solid var(--pale-sand-40)',
        }}>
          <Link href="/blog" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase',
            color: 'var(--arema-brown)',
            textDecoration: 'none',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            {t('blogPage.backToBlog')}
          </Link>
        </div>
      </article>
    </main>
  );
}
