import { Metadata } from 'next';
import { supabase } from './supabase';

export async function generatePageMetadata(pageKey: string): Promise<Metadata> {
  // Baseline fallbacks in case Supabase lookup fails or is not seeded
  let title = 'Arema Foods International';
  let description = 'Arema Foods International exports the finest rice from the fertile fields of Palakkad, Kerala to global markets.';
  let keywords = 'Kerala rice export, Palakkad Matta rice, premium rice, India food export, Arema Foods';

  try {
    const { data } = await supabase
      .from('site_translations')
      .select('*')
      .eq('lang', 'en')
      .in('key', [
        `seo.${pageKey}.title`,
        `seo.${pageKey}.description`,
        `seo.${pageKey}.keywords`
      ]);

    if (data && data.length > 0) {
      const tRow = data.find(r => r.key === `seo.${pageKey}.title`);
      const dRow = data.find(r => r.key === `seo.${pageKey}.description`);
      const kRow = data.find(r => r.key === `seo.${pageKey}.keywords`);

      if (tRow?.value) title = tRow.value;
      if (dRow?.value) description = dRow.value;
      if (kRow?.value) keywords = kRow.value;
    }
  } catch (e) {
    console.warn(`Failed to fetch SEO metadata for page ${pageKey}:`, e);
  }

  return {
    title,
    description,
    keywords: keywords ? keywords.split(',').map(k => k.trim()) : undefined,
    openGraph: {
      title,
      description,
      siteName: 'Arema Foods International',
      type: 'website',
    }
  };
}
