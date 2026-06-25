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
  'authenticity-of-granary': {
    id: 'authenticity-of-granary',
    category: 'Heritage',
    readTime: '5 min read',
    date: 'June 2026',
    title: 'AREMA : The Authenticity of the Granary',
    excerpt:
      'In our childhood, one of the most significant sights and ways of life in our countryside was the vast paddy fields—spread out like a lush green carpet, the true source of rice and grain.',
    image: '/images/blog-images.png',
    author: 'Arema Editorial',
    authorRole: 'Field Notes Team',
    body: [
      'In our childhood, one of the most significant sights and ways of life in our countryside was the vast paddy fields—spread out like a lush green carpet, the true source of rice and grain. These fields were not just agricultural land; they were the heartbeat of our communities, the place where generations met the land in a sacred contract of effort and harvest.',
      'The granary was not merely a storage facility. It was the most important building in any household or village. To have a full granary was to have security, dignity, and the ability to feed those who depended on you. Elders would say: "When the granary is full, the family sleeps well." This phrase carried more than agricultural meaning—it was a philosophy of abundance rooted in honest work.',
      'AREMA was born from this same ethos. Our founders grew up watching paddy farmers labour through heat and monsoon, understanding intimately that the grain they produced was not a commodity—it was a covenant. The name AREMA itself is drawn from that reverence: "Arema" echoes the Malayalam word for granary, a nod to the central role this institution played in Kerala\'s agrarian soul.',
      'Today, when we source our GI-tagged Palakkadan Matta rice from the Bharathapuzha belt, we are not simply executing a supply chain transaction. We are honouring a lineage. The same land. The same grain varieties. The same commitment to doing things right, even when shortcuts are cheaper.',
      'What makes Palakkadan Matta unique is not just its nutritional profile or its distinctive red bran layer—it is the fact that it cannot exist without its geography. The laterite soil, the seasonal flooding from the Bharathapuzha river, the specific humidity and altitude of the Palakkad region: these are irreplaceable conditions. The GI tag is not marketing language. It is a legal recognition that this grain is inseparable from this place.',
      'As AREMA brings this grain to international markets—to South Asian diaspora communities in the UK, to health-conscious buyers in the Gulf, to specialty food importers in Europe—we carry that authenticity with us. We are not just exporters. We are translators of a culture, making sure that every packet of rice arriving on a shelf in London or Dubai carries the full weight of where it came from.',
      'The granary may look different now. It may be a climate-controlled warehouse, a certified processing facility, an export container. But the spirit inside remains unchanged: honest grain, grown by honest people, handled with the care it deserves.',
    ],
  },

  'premium-matta-rice-dominating-global-markets': {
    id: 'premium-matta-rice-dominating-global-markets',
    category: 'Trade',
    readTime: '5 min read',
    date: 'June 2026',
    title: 'Taste the Tradition of Kerala with Every Grain : Why Premium Matta Rice is Dominating Global Markets',
    excerpt:
      'The global demand for authentic, nutrient-rich ethnic foods is reaching an all-time high. Sourcing authentic regional staples like Kerala Matta rice is the fastest way to build customer loyalty.',
    image: '/images/tl-05.png',
    author: 'Arema Editorial',
    authorRole: 'Field Notes Team',
    body: [
      'The global demand for authentic, nutrient-rich ethnic foods is reaching an all-time high. Whether you\'re running a retail chain, a wholesale distribution network, or a specialty food import business, sourcing authentic regional staples like Kerala Matta rice is the fastest way to build customer loyalty and long-term revenue.',
      'Palakkadan Matta rice — also called Kerala red rice or rosematta — is one of the most culturally significant staple grains in South Indian and Sri Lankan cuisine. Now, its unique flavour profile, superior nutritional value, and traceable GI (Geographical Indication) status are earning it a premium position in global food markets.',
      'Kerala Matta rice carries the Geographical Indication (GI) tag — a legal certification guaranteeing it is grown in the Palakkad region of Kerala, India, under specific traditional farming methods. This means buyers and end consumers can trust the authenticity of every grain. Unlike generic red rice alternatives from Southeast Asia, GI-certified Palakkadan Matta offers provenance, accountability, and a story that resonates with today\'s discerning consumer.',
      'From a nutritional standpoint, Palakkadan Matta rice stands apart. It retains its bran layer even after parboiling, making it rich in dietary fibre, B vitamins, and minerals like calcium and iron. Nutritionists increasingly recommend it as a healthier alternative to polished white rice, especially for diabetics and those managing weight — a growing consumer segment across global markets.',
      'The global ethnic food market is projected to exceed USD 100 billion by 2030. Diaspora communities in the UK, UAE, Canada, and Australia are driving consistent demand for authentic South Asian staples. Meanwhile, health food retailers are actively seeking traceable, whole-grain alternatives to mass-produced white rice. Palakkadan Matta rice sits perfectly at the intersection of both trends.',
      'AREMA Foods International has built its reputation on delivering exactly this kind of product: GI-certified Palakkadan Matta rice, carefully parboiled and processed to maintain grain integrity, nutritional density, and authentic flavour. Our supply chain is transparent, our certifications are current, and our logistics are built for international B2B partnerships.',
      'Whether you\'re an importer looking for a reliable, high-margin SKU or a distributor seeking to expand your authentic Indian rice portfolio, AREMA\'s Matta rice offers the quality, documentation, and provenance your market demands. The tradition of Kerala is ready for the world\'s tables.',
    ],
  },

  'why-matta-doesnt-taste-like-90s': {
    id: 'why-matta-doesnt-taste-like-90s',
    category: 'Quality',
    readTime: '6 min read',
    date: 'June 2026',
    title: "Why doesn't Matta taste like the 90's anymore ? and how we brought it back?",
    excerpt:
      '"Pazhaya aa taste ippo kittunnilla." If you\'ve heard your parents say this, or caught yourself thinking it after a bland sadhya outside Kerala, you\'re not imagining things. The Palakkadan Matta of the 90s has quietly vanished.',
    image: '/images/matta-grain-hands.png',
    author: 'Arema Editorial',
    authorRole: 'Field Notes Team',
    body: [
      '"Pazhaya aa taste ippo kittunnilla." If you\'ve heard your parents say this, or caught yourself thinking it after a bland sadhya outside Kerala, you\'re not imagining things. The Palakkadan Matta of the 90s has quietly vanished from most kitchens — replaced by impostors wearing the same name.',
      'Here\'s what happened. As demand for Matta rice grew beyond Kerala\'s borders, the supply chain expanded — and shortcuts crept in. Farmers switched to higher-yield hybrid paddy varieties that looked similar to authentic Palakkadan Matta but lacked the earthy, nutty depth that made the original special. Mills began sourcing from outside the Palakkad region. Processing methods changed to increase throughput. The grain became thinner, quicker to cook, and largely flavourless.',
      'The GI tag for Palakkadan Matta rice exists precisely to prevent this. But its enforcement has historically been inconsistent. Rice sold as "Matta" on retail shelves is often a blend — or not Palakkadan Matta at all. Without a reliable origin trail, neither the buyer nor the end consumer can know what they\'re actually eating.',
      'AREMA\'s answer was to go back to the source. We identified the specific farming communities in the Bharathapuzha belt still growing traditional Jyothi and Athira paddy varieties — the cultivars that produce the deep, nutty, slightly sticky Matta that older Keralites remember. These farmers grow on laterite soil, irrigated by Bharathapuzha water, at altitudes that create the right stress conditions for flavour development.',
      'We changed our processing too. Most commercial mills parboil at high pressure to save time — but this strips flavour. AREMA uses a two-stage low-pressure parboiling method that takes longer, costs more, but preserves the natural compounds that give authentic Matta its character. The drying is done slowly, in open yards when weather permits, to avoid the smoky aftertaste that comes from aggressive kiln drying.',
      'The result is a grain that takes you back. Not because we added anything. Because we refused to take anything away.',
      'If you\'ve been eating Matta rice that tastes like nothing, you now know why — and you know there\'s an alternative. Authentic Palakkadan Matta still exists. It just requires a supply chain that refuses to compromise.',
    ],
  },

  'meet-bharathapuzha-farmers': {
    id: 'meet-bharathapuzha-farmers',
    category: 'Farming',
    readTime: '5 min read',
    date: 'June 2026',
    title: 'Meet the Bharathapuzha Farmers Behind Our Arema Rice',
    excerpt:
      'Every pack of Arema GI tagged Palakkadan Matta starts with a farmer, not a factory. Across the Bharathapuzha belt, generations of farmers still grow paddy the way GI tag demands.',
    image: '/images/tl-01.png',
    author: 'Arema Editorial',
    authorRole: 'Field Notes Team',
    body: [
      'Every pack of AREMA GI-tagged Palakkadan Matta starts with a farmer, not a factory. Across the Bharathapuzha belt — the river-fed agricultural corridor running through Palakkad district in Kerala — generations of farming families still grow paddy the way the GI tag demands: the right variety, in the right soil, with the right seasonal timing.',
      'These are not large industrial operations. Most of our partner farmers work plots of 2 to 5 acres, often on land their grandparents cleared. They know every inch of it — which corners flood first in the monsoon, where the soil is richest, which paddy variety performs best in which microclimate. That knowledge, passed down over generations, is not something a seed catalogue or an agronomy report can replicate.',
      'Farming in the Bharathapuzha belt is not easy work. The summer heat is extreme. Water levels fluctuate with the monsoon. Input costs — seeds, fertiliser, labour — have risen steadily, while the price offered by middlemen often has not. Many younger people have left farming for other opportunities, putting pressure on families to manage larger plots with fewer hands.',
      'AREMA works directly with these farming communities, bypassing intermediaries where possible. This is not charity — it is strategy. Direct sourcing lets us pay a premium for quality grain, creates an incentive for farmers to maintain traditional cultivation practices, and gives us complete visibility into how our rice is grown. When we commit to a farmer for a season, we are committing to their craft.',
      'We visit these farms. Our team travels to Palakkad during key growing periods — transplanting, harvest — to understand what\'s happening on the ground and to build relationships that go beyond invoice and payment. Some of our sourcing relationships are more than a decade old.',
      'When you hold a pack of AREMA Matta rice, you are holding the result of someone\'s full agricultural year. We think that deserves to be said out loud.',
    ],
  },

  'three-myths-about-palakkadan-matta': {
    id: 'three-myths-about-palakkadan-matta',
    category: 'Quality',
    readTime: '5 min read',
    date: 'June 2026',
    title: 'Three Myths about Palakkadan Matta that even Malayalis believe',
    excerpt:
      'Not all red rice is Palakkadan Matta — and half of Kerala still gets fooled. We debunk the common myths surrounding this famous grain.',
    image: '/images/tl-02.png',
    author: 'Arema Editorial',
    authorRole: 'Field Notes Team',
    body: [
      'Palakkadan Matta rice has a devoted following — but even among those who love it most, there is a surprising amount of misinformation about what it actually is, how it behaves, and what makes it worth paying a premium for. Here are three myths that persist even among Keralites who grew up eating this grain.',
      'Myth 1: All red rice is Palakkadan Matta. This is the most common and commercially damaging misconception. Walk into any supermarket and you\'ll find products labelled "red rice" or even "Matta rice" that are neither Palakkadan in origin nor Matta in variety. Red rice is grown across South and Southeast Asia — in Sri Lanka, Thailand, Bhutan, and elsewhere — and while some of it is excellent, it is not the same grain. Authentic Palakkadan Matta carries a GI tag, is grown in a specific geographic corridor in Palakkad district, and comes from specific paddy cultivars. Without these, it\'s just red rice.',
      'Myth 2: Matta is hard to cook and takes too long. This belief has pushed many home cooks away from Matta and toward white rice. While traditional Matta does require more water and a longer cooking time than polished white rice, parboiled Matta — which is what AREMA produces — cooks in a manageable 25 to 30 minutes. Pressure cooker users find it even faster. The key is soaking the grain for 20 to 30 minutes before cooking, which most Matta veterans will tell you is non-negotiable. Once you adjust your method, the cooking process is entirely straightforward.',
      'Myth 3: Matta\'s health benefits are exaggerated. Some consumers dismiss the nutritional claims around Matta rice as food marketing. In fact, the evidence is well-established. Parboiled Palakkadan Matta retains its bran layer, which means it contains significantly more dietary fibre, B vitamins, and minerals than polished white rice. Its glycaemic index is lower, which matters for blood sugar management. Kerala\'s traditional diet, centred on this grain, is associated with lower rates of diet-related chronic illness compared to regions that shifted to polished white rice. The health case is not hype — it is agricultural and nutritional fact.',
      'These myths are not harmless. They let inferior products masquerade as the real thing, undercut farmers who grow authentic Matta at higher cost, and deprive consumers of a grain that genuinely delivers on its reputation. Knowing the truth is the first step to demanding the genuine article.',
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
