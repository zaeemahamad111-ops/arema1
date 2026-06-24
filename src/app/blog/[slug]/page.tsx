import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogDetailClient from './BlogDetailClient';
import { supabase } from '@/lib/supabase';

/* ── Article Database ──────────────────────────────────────────── */
const articles: Record<string, {
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
}> = {
  'matta-rice-world-stage': {
    id: 'matta-rice-world-stage',
    category: 'Heritage',
    readTime: '6 min read',
    date: 'March 2024',
    title: 'How Palakkad Matta Rice Found Its Place on the World Stage',
    excerpt:
      "For centuries, Matta rice was the staple of Kerala's working families. Today, it commands premium positioning in European health food markets and Michelin-starred restaurant menus.",
    image: '/images/blog-images.png',
    author: 'Arema Editorial',
    authorRole: 'Field Notes Team',
    body: [
      'Palakkad Matta rice — with its distinctive pinkish-red hue and robust, nutty flavour — has fed generations of Kerala families through monsoons and festivals alike. For most of its history, it was simply the rice you ate, not a product you celebrated.',
      'That began to change in the mid-2010s, when a growing global interest in heritage grains, whole foods, and origin-specific produce started to align perfectly with what Matta had always been: unrefined, mineral-rich, and deeply rooted in its landscape.',
      'At Arema, we watched this shift closely. We had been sourcing from the Palakkad river delta for over a decade, building relationships with farmers who grew Matta the traditional way — flood-irrigated paddy fields, open sun drying, and minimal mechanical processing.',
      'When buyers from specialty food retailers in Germany, the Netherlands, and the UK first approached us, they were not looking for a commodity. They were looking for a story — and Matta had one that stretched back centuries.',
      'Today, Palakkad Matta holds shelf space in premium organic grocery stores across Europe, appears on menus in Michelin-starred restaurants, and is prescribed by nutritionists for its high fibre content and lower glycaemic index compared to polished white rice.',
      'The grain never changed. The world simply caught up with what Palakkad had always known.',
    ],
  },
  'palakkad-farmers': {
    id: 'palakkad-farmers',
    category: 'Farming',
    readTime: '5 min read',
    date: 'November 2023',
    title: 'The Farmers Behind Every Arema Grain',
    excerpt:
      'We work with a curated network of farmers who share one belief: that how you grow something is as important as what you grow.',
    image: '/images/tl-01.png',
    author: 'Arema Editorial',
    authorRole: 'Field Notes Team',
    body: [
      'Every bag of Arema rice begins not on a factory floor, but in a paddy field — with a farmer who knows the land by memory, who can read the sky for rain, and who takes personal pride in what emerges from the soil.',
      'Our sourcing model is relationship-first. We work with a curated network of about 40 farming families across the Palakkad district, many of whom have been growing rice for three or four generations. We do not simply place orders and collect produce. We visit. We discuss. We plan seasons together.',
      'This closeness to the source means we can maintain quality standards that no third-party audit can fully replicate. We know which farms irrigate from the Bharatapuzha river, which ones follow traditional flood-paddy techniques, and which farmers are experimenting with natural composting to reduce input costs.',
      'It also means that when climate conditions threaten a harvest — as they increasingly do — we are able to respond with flexibility, not just contract terms.',
      'At Arema, the farmer is not a supplier. The farmer is the product.',
    ],
  },
  'export-standards': {
    id: 'export-standards',
    category: 'Quality',
    readTime: '4 min read',
    date: 'January 2024',
    title: 'Why Export Quality Is a Philosophy, Not a Certificate',
    excerpt:
      'Certifications matter — but they are the floor, not the ceiling. At Arema, we believe true quality is built in the field, not the laboratory.',
    image: '/images/tl-02.png',
    author: 'Arema Editorial',
    authorRole: 'Field Notes Team',
    body: [
      'When buyers ask us about our quality certifications, we are always happy to share them — FSSAI compliance, phytosanitary clearances, moisture and purity testing reports. These are necessary, and we maintain them rigorously.',
      'But certifications are a floor. They tell you what a product is not: not contaminated, not adulterated, not below a minimum threshold. They do not tell you what a product actually is.',
      'At Arema, quality is defined upstream — at the farm, during the harvest, in the drying yard. By the time rice reaches our processing facility, the decisions that determine its quality have largely already been made.',
      'We reject a meaningful percentage of incoming stock every season — not because it fails laboratory tests, but because it does not meet our internal benchmarks for grain appearance, aroma, and broken grain percentage. That is not a standard a certificate requires. It is one we have chosen for ourselves.',
      'Our buyers come back to us not because of our paperwork, but because of our consistency. And consistency is the product of discipline, not documentation.',
    ],
  },
  'global-rice-markets': {
    id: 'global-rice-markets',
    category: 'Trade',
    readTime: '7 min read',
    date: 'September 2023',
    title: 'Navigating the Global Rice Market in 2024',
    excerpt:
      'As global food supply chains continue to evolve, premium origin products are finding new audiences. Here is what the market is telling us.',
    image: '/images/tl-03.png',
    author: 'Arema Editorial',
    authorRole: 'Field Notes Team',
    body: [
      'The global rice market is in the middle of a structural shift. For decades, the trade was dominated by price competition between large exporting nations. Volume, not value, was the primary metric.',
      'That dynamic has not disappeared — but it is increasingly being accompanied by a parallel market for origin-specific, traceable, and premium rice varieties. This is the space Arema operates in, and we have watched it grow considerably over the past five years.',
      'Several forces are converging. Health-conscious consumers in Europe and North America are actively seeking whole grain and heritage varieties. Diaspora communities in major cities are demanding authentic regional products rather than generic substitutes. And institutional buyers — hotel chains, premium food service companies — are willing to pay more for consistency and provenance.',
      'For Indian exporters, this creates both an opportunity and a challenge. The opportunity is real: heritage varieties like Matta, Jeerakasala, and Gobindobhog command meaningful price premiums. The challenge is meeting the traceability, documentation, and logistics expectations of sophisticated global buyers.',
      'We have invested in precisely these areas — not because it is currently required, but because we believe it soon will be, and because our buyers deserve it now.',
    ],
  },
  'parboiling-process': {
    id: 'parboiling-process',
    category: 'Process',
    readTime: '5 min read',
    date: 'July 2023',
    title: 'The Science and Tradition of Parboiling',
    excerpt:
      'Parboiling is one of the oldest forms of rice processing — and one of the most misunderstood. We explain why it matters for nutrition, texture, and shelf life.',
    image: '/images/tl-04.png',
    author: 'Arema Editorial',
    authorRole: 'Field Notes Team',
    body: [
      'Ask most consumers what parboiling means, and they will guess it involves boiling rice before packaging. That is not quite right — and the distinction matters more than most people realise.',
      'Parboiling is a hydrothermal treatment applied to paddy rice before milling. The unhusked grain is soaked in water, steamed under pressure, and then dried before the husk is removed. The result is a grain that has driven nutrients — particularly B vitamins — from the bran layer into the starchy endosperm, making them resistant to the milling process that would otherwise strip them away.',
      'This means parboiled rice retains significantly more nutritional value than comparable white rice, while still offering the familiar texture and appearance that makes it appealing to a wide range of consumers.',
      'There is also a functional benefit: parboiling gelatinises the starch in the grain, making it firmer and less prone to breakage during milling. This means higher yields, better grain integrity, and improved shelf life.',
      'At Arema, all our parboiled varieties go through a controlled two-stage parboiling process — traditional in method but precise in execution. The goal is to preserve the character of the grain while maximising its nutritional and commercial value.',
      'It is one of the oldest techniques in rice processing. It is also one of the smartest.',
    ],
  },
};

/* ── Metadata ────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let article = articles[slug];

  if (!article) {
    try {
      const { data: dbBlog } = await supabase.from('blogs').select('*').eq('id', slug).single();
      if (dbBlog) {
        const { data: dbTrans } = await supabase.from('blog_translations').select('*').eq('blog_id', slug).eq('lang', 'en').single();
        if (dbTrans) {
          article = {
            id: dbBlog.id,
            category: dbTrans.category || 'Heritage',
            readTime: dbTrans.readTime || '5 min read',
            date: dbTrans.date || new Date(dbBlog.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            title: dbTrans.title,
            excerpt: dbTrans.excerpt,
            image: dbBlog.image_url,
            body: dbTrans.body || [],
            author: 'Arema Editorial',
            authorRole: 'Field Notes Team',
          };
        }
      }
    } catch (e) {}
  }

  if (!article) return { title: 'Article Not Found' };
  return {
    title: `${article.title} — Field Notes`,
    description: article.excerpt,
  };
}

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

/* ── Page ─────────────────────────────────────────────────────── */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let article = articles[slug];

  if (!article) {
    try {
      const { data: dbBlog } = await supabase.from('blogs').select('*').eq('id', slug).single();
      if (dbBlog) {
        const { data: dbTrans } = await supabase.from('blog_translations').select('*').eq('blog_id', slug).eq('lang', 'en').single();
        if (dbTrans) {
          article = {
            id: dbBlog.id,
            category: dbTrans.category || 'Heritage',
            readTime: dbTrans.readTime || '5 min read',
            date: dbTrans.date || new Date(dbBlog.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            title: dbTrans.title,
            excerpt: dbTrans.excerpt,
            image: dbBlog.image_url,
            body: dbTrans.body || [],
            author: 'Arema Editorial',
            authorRole: 'Field Notes Team',
          };
        }
      }
    } catch (e) {}
  }

  if (!article) notFound();

  return (
    <BlogDetailClient article={article} />
  );
}
