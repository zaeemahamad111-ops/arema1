'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import styles from './Blog.module.css';
import NewsletterForm from './NewsletterForm';

const CATEGORIES = ['All', 'Heritage', 'Farming', 'Quality', 'Trade', 'Process'];

const articles = [
  {
    id: 'authenticity-of-granary',
    category: 'Heritage',
    readTime: '5 min read',
    date: 'June 2026',
    title: 'AREMA : The Authenticity of the Granary',
    excerpt:
      'In our childhood, one of the most significant sights and ways of life in our countryside was the vast paddy fields—spread out like a lush green carpet, the true source of rice and grain.',
    image: '/images/blog-images.png',
    featured: true,
  },
  {
    id: 'premium-matta-rice-dominating-global-markets',
    category: 'Trade',
    readTime: '5 min read',
    date: 'June 2026',
    title: 'Taste the Tradition of Kerala with Every Grain : Why Premium Matta Rice is Dominating Global Markets',
    excerpt:
      'The global demand for authentic, nutrient-rich ethnic foods is reaching an all-time high. Sourcing authentic regional staples like Kerala Matta rice is the fastest way to build customer loyalty.',
    image: '/images/tl-05.png',
    featured: false,
  },
  {
    id: 'why-matta-doesnt-taste-like-90s',
    category: 'Quality',
    readTime: '6 min read',
    date: 'June 2026',
    title: 'Why doesn’t Matta taste like the 90’s anymore ? and how we brought it back?',
    excerpt:
      '“Pazhaya aa taste ippo kittunnilla.” If you’ve heard your parents say this, or caught yourself thinking it after a bland sadhya outside Kerala, you’re not imagining things. The Palakkadan Matta of the 90s has quietly vanished.',
    image: '/images/matta-grain-hands.png',
    featured: false,
  },
  {
    id: 'meet-bharathapuzha-farmers',
    category: 'Farming',
    readTime: '5 min read',
    date: 'June 2026',
    title: 'Meet the Bharathapuzha Farmers Behind Our Arema Rice',
    excerpt:
      'Every pack of Arema GI tagged Palakkadan Matta starts with a farmer, not a factory. Across the Bharathapuzha belt, generations of farmers still grow paddy the way GI tag demands.',
    image: '/images/tl-01.png',
    featured: false,
  },
  {
    id: 'three-myths-about-palakkadan-matta',
    category: 'Quality',
    readTime: '5 min read',
    date: 'June 2026',
    title: 'Three Myths about Palakkadan Matta that even Malayalis believe',
    excerpt:
      'Not all red rice is Palakkadan Matta — and half of Kerala still gets fooled. We debunk the common myths surrounding this famous grain.',
    image: '/images/tl-02.png',
    featured: false,
  },
];

function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function BlogPage() {
  const { currentTranslations, t, lang, dbBlogsRaw } = useLanguage();

  useEffect(() => {
    document.title = `${t('blogPage.eyebrow')} — Arema Foods International`;
  }, [t]);

  const displayArticles = dbBlogsRaw && dbBlogsRaw.length > 0
    ? dbBlogsRaw.map((b: any) => {
        const base = articles.find(a => a.id === b.id) || {
          id: b.id,
          category: 'Heritage',
          readTime: '5 min read',
          date: new Date(b.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          title: b.id,
          excerpt: '',
          image: b.image_url,
          featured: false
        };
        // Prefer the local article image (guaranteed to exist); fall back to DB url if it looks like a full URL
        const resolvedImage = base.image && (base.image.startsWith('/images/') || base.image.startsWith('http'))
          ? base.image
          : (b.image_url && (b.image_url.startsWith('http') || b.image_url.startsWith('/images/')))
            ? b.image_url
            : '/images/blog-images.png';
        return {
          ...base,
          id: b.id,
          image: resolvedImage,
          featured: b.id === 'authenticity-of-granary'
        };
      })
    : articles;

  const getCategoryTranslation = (cat: string) => {
    if (cat === 'All') {
      switch (lang) {
        case 'ar': return 'الكل';
        case 'de': return 'Alle';
        case 'fr': return 'Tout';
        case 'it': return 'Tutto';
        case 'nl': return 'Alle';
        case 'ja': return 'すべて';
        case 'ko': return '전체';
        case 'zh': return '全部';
        case 'ru': return 'Все';
        case 'hi': return 'सभी';
        case 'ta': return 'அனைத்தும்';
        case 'es': return 'Todo';
        default: return 'All';
      }
    }
    const articleWithCat = displayArticles.find(a => a.category === cat);
    if (articleWithCat) {
      const trans = currentTranslations.blogData?.[articleWithCat.id];
      if (trans) return trans.category;
    }
    return cat;
  };

  const translatedArticles = displayArticles.map((art) => {
    const trans = currentTranslations.blogData?.[art.id];
    return {
      ...art,
      category: trans?.category || art.category,
      readTime: trans?.readTime || art.readTime,
      date: trans?.date || art.date,
      title: trans?.title || art.title,
      excerpt: trans?.excerpt || art.excerpt,
    };
  });

  const featured = translatedArticles.find((a) => a.featured) || translatedArticles[0];
  const rest = translatedArticles.filter((a) => a.id !== (featured?.id || ''));

  return (
    <main>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className={styles.hero}>
        <Image
          src="/images/hero.png"
          alt="Palakkad rice fields at golden hour"
          fill
          className={styles.heroBg}
          priority
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>{t('blogPage.eyebrow')}</p>
          <h1 className={styles.heroTitle}>
            {t('blogPage.title')}<em>{t('blogPage.titleEm')}</em>
          </h1>
          <div className={styles.heroMeta}>
            <span className={styles.articleCount}>{translatedArticles.length} {t('blogPage.articlesCount')}</span>
          </div>
        </div>
      </section>

      {/* ── CATEGORY FILTER ──────────────────────────── */}
      <nav className={styles.filterBar} aria-label="Blog categories">
        <div className={styles.filterInner}>
          <span className={styles.filterLabel}>{t('blogPage.filter')}</span>
          {CATEGORIES.map((cat) => (
            <span key={cat} className={`${styles.pill} ${cat === 'All' ? styles.pillActive : ''}`}>
              {getCategoryTranslation(cat)}
            </span>
          ))}
        </div>
      </nav>

      {/* ── FEATURED ARTICLE ─────────────────────────── */}
      <section className={styles.featuredSection}>
        <div className={styles.sectionInner}>
          <p className={styles.sectionLabel}>{t('blogPage.featuredLabel')}</p>
          <Link href={`/blog/${featured.id}`} className={styles.featuredCard}>
            {/* Image */}
            <div className={styles.featuredImageWrap}>
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className={styles.featuredImg}
                sizes="(max-width: 768px) 100vw, 55vw"
                priority
              />
              <span className={styles.featuredBadge}>{t('blogPage.featuredLabel')}</span>
            </div>

            {/* Body */}
            <div className={styles.featuredBody}>
              <div className={styles.cardMeta}>
                <span className={styles.categoryTag}>{featured.category}</span>
                <span className={styles.dot} />
                <span className={styles.readTime}>{featured.readTime}</span>
              </div>
              <p className={styles.dateText}>{featured.date}</p>
              <h2 className={styles.cardTitle}>{featured.title}</h2>
              <p className={styles.cardExcerpt}>{featured.excerpt}</p>
              <span className={styles.readLink}>
                {t('blogPage.readArticle')} <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── ARTICLE GRID ─────────────────────────────── */}
      <section className={styles.gridSection}>
        <div className={styles.sectionInner}>
          <p className={styles.sectionLabel}>{t('blogPage.moreStories')}</p>
          <div className={styles.grid}>
            {rest.map((article) => (
              <Link key={article.id} href={`/blog/${article.id}`} className={styles.articleCard}>
                {/* Thumbnail */}
                <div className={styles.cardImageWrap}>
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className={styles.cardImg}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span className={styles.cardCategoryBadge}>{article.category}</span>
                </div>

                {/* Content */}
                <div className={styles.cardContent}>
                  <div className={styles.cardMeta}>
                    <span className={styles.readTime}>{article.readTime}</span>
                  </div>
                  <h3 className={styles.cardTitleSm}>{article.title}</h3>
                  <p className={styles.cardExcerptSm}>{article.excerpt}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardDate}>{article.date}</span>
                    <span className={styles.cardArrow}>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────── */}
      <section className={styles.newsletter}>
        <Image
          src="/images/tl-05.png"
          alt="Global trade — cargo ship at sunset"
          fill
          className={styles.newsletterBg}
          sizes="100vw"
        />
        <div className={styles.newsletterOverlay} />
        <div className={styles.newsletterContent}>
          <p className={styles.newsletterEyebrow}>{t('blogPage.newsletterEyebrow')}</p>
          <h2 className={styles.newsletterTitle}>
            {t('blogPage.newsletterTitle')}
          </h2>
          <p className={styles.newsletterBody}>
            {t('blogPage.newsletterBody')}
          </p>
          <NewsletterForm />
          <p className={styles.privacyNote}>{t('blogPage.privacyNote')}</p>
        </div>
      </section>
    </main>
  );
}
