import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  image: string;
  gradient: string;
}

const PRODUCTS_DATA: Record<string, Product> = {
  'matta-rice': {
    id: 'matta-rice',
    name: 'Palakkad Matta Rice',
    category: 'Kerala Heritage',
    tagline: 'The nutrient-dense red-bran heritage grain.',
    description: 'Revered across the Indian subcontinent and its global diaspora, Palakkad Matta Rice (Rosematta) is the signature grain of Kerala. Grown in the dense, nutrient-rich soil of Palakkad, it is parboiled in its husk, which locks in vital nutrients. It retains its red outer bran layer, providing a rich, rustic flavour, chewy texture, and significant dietary fiber, vitamins, and minerals.',
    highlights: [
      'High in dietary fiber',
      'Rich in Magnesium & Vitamin B6',
      'Lower glycemic index',
      'Naturally unpolished red bran'
    ],
    specs: [
      { label: 'Grain Type', value: 'Short-Medium Grain' },
      { label: 'Color', value: 'Deep Red / Rose' },
      { label: 'Milling', value: 'Unpolished (Bran Retained)' },
      { label: 'Processing', value: 'Parboiled' },
      { label: 'Broken percentage', value: 'Max 5%' },
      { label: 'Moisture', value: 'Max 13.5%' },
      { label: 'Packaging available', value: '1kg, 5kg, 10kg, 25kg, 50kg' },
    ],
    image: '/images/product-bag-nobg.png',
    gradient: 'linear-gradient(135deg, #ECEAE6 0%, #DBCDC0 100%)',
  },
  'kuruva-rice': {
    id: 'kuruva-rice',
    name: 'Premium Kuruva Rice',
    category: 'Premium Grade',
    tagline: 'Plump, double-boiled short grains for daily dining.',
    description: 'Premium Kuruva Rice is a popular short-grain variety cherished for its soft, plump texture upon cooking. Sourced directly from local farmers in Palakkad, our Kuruva rice undergoes advanced double-boiling, ensuring that the grains remain non-sticky, easily digestible, and rich in natural nutrients. It is the perfect companion for traditional meals, curries, and daily South Indian dishes.',
    highlights: [
      'Soft and plump texture',
      'Double boiled for digestive ease',
      'Non-sticky grains',
      '100% natural, chemical-free processing'
    ],
    specs: [
      { label: 'Grain Type', value: 'Plump Short Grain' },
      { label: 'Color', value: 'Pristine White' },
      { label: 'Milling', value: 'Double Polished' },
      { label: 'Processing', value: 'Double Boiled' },
      { label: 'Broken percentage', value: 'Max 3%' },
      { label: 'Moisture', value: 'Max 13%' },
      { label: 'Packaging available', value: '5kg, 10kg, 25kg, 50kg' },
    ],
    image: '/images/product-bag-nobg.png',
    gradient: 'linear-gradient(135deg, #ECEAE6 0%, #CDD2D5 100%)',
  },
  'aromatic-rice': {
    id: 'aromatic-rice',
    name: 'Jeerakasala Rice',
    category: 'Aromatic Collection',
    tagline: 'Naturally fragrant grains perfect for festive cooking.',
    description: 'Jeerakasala (also known as Kaima) is a premium, highly aromatic short-grain rice cultivated with utmost precision. Known for its small, slender grain size resembling cumin seeds (Jeera), this rice releases an intoxicating natural aroma when cooked. It is the preferred rice variety for Malabar Biryani, ghee rice, and rich festive preparations where scent and texture define the dish.',
    highlights: [
      'Exquisite natural fragrance',
      'Slender, non-sticky short grain',
      'Perfect for Biryani & Ghee Rice',
      'Aged to perfection for dry cooking'
    ],
    specs: [
      { label: 'Grain Type', value: 'Slender Short Grain' },
      { label: 'Color', value: 'Light Cream' },
      { label: 'Milling', value: 'Polished Aromatic Grade' },
      { label: 'Processing', value: 'Raw / Aged' },
      { label: 'Broken percentage', value: 'Max 2%' },
      { label: 'Moisture', value: 'Max 12.5%' },
      { label: 'Packaging available', value: '1kg, 5kg, 25kg' },
    ],
    image: '/images/product-bag-nobg.png',
    gradient: 'linear-gradient(135deg, #ECEAE6 0%, #DFD5C0 100%)',
  },
  'biryani-rice': {
    id: 'biryani-rice',
    name: 'Malabar Biryani Rice',
    category: 'Aromatic Collection',
    tagline: 'Superfine aged grains bringing authentic scent to Malabar Biryani.',
    description: 'Malabar Biryani Rice (specifically superfine Kaima / Jeerakasala) is aged to perfection. Sourced from organic heritage crop networks, each grain is milled to retain its natural essential oils. The short, thin grains absorb spices and ghee deeply, ensuring your signature Biryani is exceptionally flavorful and fragrant.',
    highlights: [
      'Superfine slender grain',
      'Naturally aged for 12 months',
      'High spice and fat absorption',
      'Authentic Malabar flavor'
    ],
    specs: [
      { label: 'Grain Type', value: 'Slender Short Grain' },
      { label: 'Color', value: 'Light Cream' },
      { label: 'Age', value: '12 Months+ (Aged)' },
      { label: 'Milling', value: 'Polished Aromatic Grade' },
      { label: 'Broken percentage', value: 'Max 2%' },
      { label: 'Moisture', value: 'Max 12.5%' },
      { label: 'Packaging available', value: '1kg, 5kg, 25kg' },
    ],
    image: '/images/product-bag-nobg.png',
    gradient: 'linear-gradient(135deg, #ECEAE6 0%, #DFD0BF 100%)',
  },
  'navara-rice': {
    id: 'navara-rice',
    name: 'Traditional Navara Rice',
    category: 'Medicinal & Heritage',
    tagline: 'Revered ancient grain of Kerala used in traditional health systems.',
    description: 'Navara Rice is a unique organic heritage grain native to Kerala, celebrated for its therapeutic and nutritional value in traditional health systems. Highly rich in antioxidants, proteins, and essential minerals, this short grain is traditionally used for preparing nourishing gruels, health broths, and authentic wellness treatments.',
    highlights: [
      'Rich in natural antioxidants',
      'Highly nutritive & digestible',
      'Traditional wellness grain',
      'Naturally red-bran unpolished'
    ],
    specs: [
      { label: 'Grain Type', value: 'Plump Short Grain' },
      { label: 'Bran', value: '100% Red Bran (Unpolished)' },
      { label: 'Processing', value: 'Raw / Semi-parboiled' },
      { label: 'Broken percentage', value: 'Max 5%' },
      { label: 'Moisture', value: 'Max 13.5%' },
      { label: 'Packaging available', value: '500g, 1kg, 5kg' },
    ],
    image: '/images/product-bag-nobg.png',
    gradient: 'linear-gradient(135deg, #ECEAE6 0%, #C8D1C4 100%)',
  },
  'gandhakasala-rice': {
    id: 'gandhakasala-rice',
    name: 'Gandhakasala Rice',
    category: 'Specialty Aromatic',
    tagline: 'Rare aromatic variety from Wayanad and Palakkad hills.',
    description: 'Gandhakasala Rice is a rare, GI-tagged specialty aromatic rice cultivated in the highland valleys. Known for its distinct, sweet-scented fragrance and rich nutritional composition, this superfine grain makes any meal a celebration. It is traditionally parboiled or milled raw to retain its unique highland terroir aroma.',
    highlights: [
      'GI-tagged highland heritage crop',
      'Intense sweet fragrance',
      'Rich in proteins & minerals',
      'Superfine delicate grain'
    ],
    specs: [
      { label: 'Grain Type', value: 'Superfine Short Grain' },
      { label: 'Color', value: 'Off-White / Cream' },
      { label: 'Milling', value: 'Semi-Polished' },
      { label: 'Broken percentage', value: 'Max 3%' },
      { label: 'Moisture', value: 'Max 13%' },
      { label: 'Packaging available', value: '1kg, 5kg, 10kg, 25kg' },
    ],
    image: '/images/product-bag-nobg.png',
    gradient: 'linear-gradient(135deg, #ECEAE6 0%, #C4CDD1 100%)',
  },
};

export async function generateStaticParams() {
  return [
    { id: 'matta-rice' },
    { id: 'kuruva-rice' },
    { id: 'aromatic-rice' },
    { id: 'biryani-rice' },
    { id: 'navara-rice' },
    { id: 'gandhakasala-rice' },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  let product = PRODUCTS_DATA[id];

  if (!product) {
    try {
      const { data: dbProd } = await supabase.from('products').select('*').eq('id', id).single();
      if (dbProd) {
        const { data: dbTrans } = await supabase.from('product_translations').select('*').eq('product_id', id).eq('lang', 'en').single();
        if (dbTrans) {
          product = {
            id: dbProd.id,
            name: dbTrans.name,
            category: dbTrans.category,
            tagline: dbTrans.tagline,
            description: dbTrans.description,
            highlights: dbTrans.highlights || [],
            specs: dbTrans.specs || [],
            image: dbProd.image_url,
            gradient: 'linear-gradient(135deg, #ECEAE6 0%, #DBCDC0 100%)',
          };
        }
      }
    } catch (e) {}
  }

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | Arema Foods`,
    description: product.tagline,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product = PRODUCTS_DATA[id];

  if (!product) {
    try {
      const { data: dbProd } = await supabase.from('products').select('*').eq('id', id).single();
      if (dbProd) {
        const { data: dbTrans } = await supabase.from('product_translations').select('*').eq('product_id', id).eq('lang', 'en').single();
        if (dbTrans) {
          product = {
            id: dbProd.id,
            name: dbTrans.name,
            category: dbTrans.category,
            tagline: dbTrans.tagline,
            description: dbTrans.description,
            highlights: dbTrans.highlights || [],
            specs: dbTrans.specs || [],
            image: dbProd.image_url,
            gradient: 'linear-gradient(135deg, #ECEAE6 0%, #DBCDC0 100%)',
          };
        }
      }
    } catch (e) {}
  }

  if (!product) {
    notFound();
  }

  // Get other products for recommendation (limit to 2 related products)
  const otherProducts = Object.values(PRODUCTS_DATA)
    .filter((p) => p.id !== id)
    .slice(0, 2);

  return (
    <ProductDetailClient product={product} otherProducts={otherProducts} />
  );
}
