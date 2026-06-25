'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { en } from '@/i18n/locales/en';
import { LANGUAGES, LanguageCode } from '@/i18n/translations';

// Sidebar navigation item config
interface SidebarItem {
  id: string;
  name: string;
  type: 'page' | 'products' | 'blogs';
  group: 'sections' | 'catalogs';
  prefixes?: string[];
  seoKey?: string;
}

// Combined visual flow of texts and media overrides per section
interface MediaConfig {
  mediaKey: string;
  label: string;
  mediaType: 'image' | 'video' | 'text';
}

const PAGE_FLOWS: Record<string, (string | MediaConfig)[]> = {
  general: [
    { mediaKey: 'logo', label: 'Website Logo Image', mediaType: 'image' },
    'nav.home', 'nav.ourStory', 'nav.products', 'nav.whyArema', 'nav.certificates', 'nav.blog', 'nav.contact',
    'footer.tagline', 'footer.navigate', 'footer.products', 'footer.contact', 'footer.mattaRice', 'footer.whiteRice', 'footer.aromaticRice', 'footer.valueAdded', 'footer.rights', 'footer.privacy', 'footer.terms',
    { mediaKey: 'whatsapp_number', label: 'WhatsApp Call Link Number (e.g. 9778339292)', mediaType: 'text' }
  ],
  home: [
    'hero.scrubText1', 'hero.scrubText2', 'hero.scrubText3', 'hero.scrollCue',
    'founder.eyebrow', 'founder.heading', 'founder.description', 'founder.conceptDescription',
    { mediaKey: 'founder_video', label: 'Founder Story Background Video (MP4)', mediaType: 'video' },
    'globalReach.eyebrow', 'globalReach.heading', 'globalReach.body', 'globalReach.cta', 'globalReach.countries', 'globalReach.certified', 'globalReach.direct', 'globalReach.packaging',
    'whyArema.eyebrow', 'whyArema.heading', 'whyArema.pillars',
    'products.eyebrow', 'products.heading', 'products.body', 'products.viewDetails', 'products.viewMore',
    'palakkad.eyebrow', 'palakkad.heading', 'palakkad.advantages',
    'blog.eyebrow', 'blog.heading', 'blog.viewAll', 'blog.readMore',
    'cta.heading', 'cta.btnPrimary', 'cta.btnSecondary'
  ],
  'our-story': [
    { mediaKey: 'ourstory_hero', label: 'Hero Background Banner Image', mediaType: 'image' },
    'ourStoryPage.heroLabel', 'ourStoryPage.heroHeadline', 'ourStoryPage.heroHeadlineEm', 'ourStoryPage.heroDesc', 'ourStoryPage.heroScroll',
    'ourStoryPage.aboutUs', 'ourStoryPage.statementLead', 'ourStoryPage.statementLeadEm', 'ourStoryPage.statementText1', 'ourStoryPage.statementText2',
    'ourStoryPage.badgeGI', 'ourStoryPage.badgeFSSAI', 'ourStoryPage.badgeAPEDA', 'ourStoryPage.badgeTraceable',
    'ourStoryPage.founderEyebrow', 'ourStoryPage.founderHeading', 'ourStoryPage.founderHeadingEm', 'ourStoryPage.founderTitle', 'ourStoryPage.founderDegree',
    { mediaKey: 'ourstory_founder', label: 'Founder Portrait Image', mediaType: 'image' },
    'ourStoryPage.founderPara1', 'ourStoryPage.founderPara2', 'ourStoryPage.founderPara3', 'ourStoryPage.founderQuote', 'ourStoryPage.founderBadgeFounded', 'ourStoryPage.founderBadgeCertified', 'ourStoryPage.founderBadgeAPEDA',
    'ourStoryPage.stripCap1', 'ourStoryPage.stripCap2', 'ourStoryPage.stripCap3',
    'ourStoryPage.visionMissionTitle', 'ourStoryPage.visionMissionTitleEm', 'ourStoryPage.visionMissionNote',
    'ourStoryPage.visionTitle', 'ourStoryPage.visionHeading', 'ourStoryPage.visionBody',
    'ourStoryPage.missionTitle', 'ourStoryPage.missionHeading', 'ourStoryPage.missionBody', 'ourStoryPage.missionHighlight',
    'ourStoryPage.fieldQuote', 'ourStoryPage.fieldQuoteAttr',
    { mediaKey: 'ourstory_quote_bg', label: 'Quote Highlight Background Banner', mediaType: 'image' },
    'ourStoryPage.beliefsTitle', 'ourStoryPage.beliefsHeading', 'ourStoryPage.beliefsHeadingEm', 'ourStoryPage.beliefs',
    'ourStoryPage.stat1Label', 'ourStoryPage.stat1Desc', 'ourStoryPage.stat2Label', 'ourStoryPage.stat2Desc', 'ourStoryPage.stat3Label', 'ourStoryPage.stat3Desc', 'ourStoryPage.stat4Label', 'ourStoryPage.stat4Desc',
    'ourStoryPage.reachLabel', 'ourStoryPage.reachTitle', 'ourStoryPage.reachTitleEm', 'ourStoryPage.reachBody',
    'ourStoryPage.route1Code', 'ourStoryPage.route1Region', 'ourStoryPage.route1Ports',
    'ourStoryPage.route2Code', 'ourStoryPage.route2Region', 'ourStoryPage.route2Ports',
    'ourStoryPage.route3Code', 'ourStoryPage.route3Region', 'ourStoryPage.route3Ports',
    'ourStoryPage.route4Code', 'ourStoryPage.route4Region', 'ourStoryPage.route4Ports',
    'ourStoryPage.routeStatus',
    'ourStoryPage.closingQuote', 'ourStoryPage.closingAttr', 'ourStoryPage.closingCta'
  ],
  'why-arema': [
    'whyAremaPage.heroLabel', 'whyAremaPage.heroTitle', 'whyAremaPage.heroTitleEm', 'whyAremaPage.heroDesc',
    { mediaKey: 'whyarema_strip', label: 'Paddy Fields Accent Strip Image', mediaType: 'image' },
    'whyAremaPage.valuesLabel', 'whyAremaPage.valuesHeading', 'whyAremaPage.valuesHeadingEm', 'whyAremaPage.pillars',
    'whyAremaPage.featureTitle', 'whyAremaPage.featureTitleEm', 'whyAremaPage.featureBody', 'whyAremaPage.featureList',
    { mediaKey: 'whyarema_split', label: 'Features Split Visual Banner Image', mediaType: 'image' }
  ],
  'products-catalog': [
    'productsPage.heroLabel', 'productsPage.heroTitle', 'productsPage.heroSubtitle', 'productsPage.viewSpecs',
    'productDetail.keyChars', 'productDetail.specTitle', 'productDetail.wholesaleTitle', 'productDetail.wholesaleDesc', 'productDetail.btnEnquiry', 'productDetail.exploreOther', 'productDetail.allProducts', 'productDetail.scrollDiscover'
  ],
  certs: [
    'certsPage.eyebrow', 'certsPage.heading', 'certsPage.headingEm', 'certsPage.desc', 'certsPage.viewDoc', 'certsPage.docName'
  ],
  'blog-page': [
    'blogPage.eyebrow', 'blogPage.title', 'blogPage.titleEm', 'blogPage.articlesCount', 'blogPage.filter', 'blogPage.featuredLabel', 'blogPage.readArticle', 'blogPage.moreStories', 'blogPage.newsletterEyebrow', 'blogPage.newsletterTitle', 'blogPage.newsletterBody', 'blogPage.newsletterPlaceholder', 'blogPage.newsletterSubmit', 'blogPage.privacyNote', 'blogPage.backToBlog'
  ],
  contact: [
    'contactPage.heroLabel', 'contactPage.heroTitle', 'contactPage.heroTitleEm', 'contactPage.heroDesc',
    'contactPage.address', 'contactPage.addressName', 'contactPage.addressLine1', 'contactPage.addressLine2', 'contactPage.addressLine3', 'contactPage.addressLine4',
    'contactPage.contact', 'contactPage.email', 'contactPage.phone1', 'contactPage.phone2',
    'contactPage.exportInq', 'contactPage.exportEmail', 'contactPage.hoursTitle', 'contactPage.hoursDays', 'contactPage.hoursTime',
    'contactPage.successTitle', 'contactPage.successBody', 'contactPage.formName', 'contactPage.formCompany', 'contactPage.formEmail', 'contactPage.formPhone', 'contactPage.formInquiryType', 'contactPage.formInquiryWholesale', 'contactPage.formInquiryPartner', 'contactPage.formInquiryLabel', 'contactPage.formInquiryRetail', 'contactPage.formInquiryMedia', 'contactPage.formInquiryOther', 'contactPage.formMessage', 'contactPage.formMessagePlaceholder', 'contactPage.formSubmit',
    'contactPage.mapEmbedUrl'
  ]
};

// Helper to flatten nested object
function flattenObject(obj: any, prefix = ''): Record<string, string> {
  const results: Record<string, string> = {};
  for (const k in obj) {
    if (prefix === '' && (k === 'productsData' || k === 'blogData' || k === 'seo')) {
      continue; // Skip raw data structures to handle specifically
    }
    const key = prefix ? `${prefix}.${k}` : k;
    const val = obj[k];
    if (Array.isArray(val)) {
      results[key] = JSON.stringify(val);
    } else if (typeof val === 'object' && val !== null) {
      Object.assign(results, flattenObject(val, key));
    } else {
      results[key] = String(val);
    }
  }
  return results;
}

export default function CMSClient() {
  const [activeItem, setActiveItem] = useState<string>('general');
  const [activeSubTab, setActiveSubTab] = useState<'content' | 'seo'>('content');
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('en');

  // Supabase states
  const [siteTranslations, setSiteTranslations] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [productTranslations, setProductTranslations] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogTranslations, setBlogTranslations] = useState<any[]>([]);
  const [imageOverrides, setImageOverrides] = useState<any[]>([]);
  const [mediaValues, setMediaValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const values: Record<string, string> = {};
    imageOverrides.forEach(o => {
      values[o.key] = o.url;
    });
    setMediaValues(values);
  }, [imageOverrides]);

  // Page Editing Drafts
  const [draftTranslations, setDraftTranslations] = useState<Record<string, string>>({});

  // Product Selection/Drafts
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [productDraft, setProductDraft] = useState({
    id: '',
    image_url: '/images/product-bag-nobg.png',
    name: '',
    category: '',
    tagline: '',
    description: '',
    highlights: [] as string[],
    specs: [] as { label: string; value: string }[],
  });

  // Blog Selection/Drafts
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [blogDraft, setBlogDraft] = useState({
    id: '',
    image_url: '/images/blog-images.png',
    category: 'Heritage',
    readTime: '5 min read',
    date: '',
    title: '',
    excerpt: '',
    body: [] as string[],
  });

  // UI status
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Fetch Database State
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [
        { data: trans },
        { data: prods },
        { data: prodTrans },
        { data: blgs },
        { data: blgTrans },
        { data: imgs },
      ] = await Promise.all([
        supabase.from('site_translations').select('*'),
        supabase.from('products').select('*').order('order_index', { ascending: true }),
        supabase.from('product_translations').select('*'),
        supabase.from('blogs').select('*'),
        supabase.from('blog_translations').select('*'),
        supabase.from('image_overrides').select('*'),
      ]);

      if (trans) setSiteTranslations(trans);
      if (prods) {
        const sorted = [...(prods || [])].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
        setProducts(sorted);
        if (sorted.length > 0 && !selectedProductId) {
          setSelectedProductId(sorted[0].id);
        }
      }
      if (prodTrans) setProductTranslations(prodTrans);
      if (blgs) {
        setBlogs(blgs);
        if (blgs.length > 0 && !selectedBlogId) {
          setSelectedBlogId(blgs[0].id);
        }
      }
      if (blgTrans) setBlogTranslations(blgTrans);
      if (imgs) setImageOverrides(imgs);
    } catch (err: any) {
      showStatus('Connection with Supabase failed. Check configuration.', true);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Page drafts when activeItem, selectedLang, or siteTranslations load/change
  useEffect(() => {
    const activeConfig = SIDEBAR_ITEMS.find(item => item.id === activeItem);
    if (!activeConfig || activeConfig.type !== 'page') return;

    const flatEn = flattenObject(en);
    const draft: Record<string, string> = {};

    // 1. Text overrides keys matching page prefixes
    if (activeConfig.prefixes) {
      Object.keys(flatEn).forEach(key => {
        const matches = activeConfig.prefixes!.some((pfx: string) => key.startsWith(pfx));
        if (matches) {
          const match = siteTranslations.find(t => t.key === key && t.lang === selectedLang);
          draft[key] = match ? match.value : '';
        }
      });
    }

    // 2. SEO Keys
    if (activeConfig.seoKey) {
      const seoKeys = [
        `seo.${activeConfig.seoKey}.title`,
        `seo.${activeConfig.seoKey}.description`,
        `seo.${activeConfig.seoKey}.keywords`
      ];
      seoKeys.forEach(key => {
        const match = siteTranslations.find(t => t.key === key && t.lang === selectedLang);
        draft[key] = match ? match.value : '';
      });
    }

    setDraftTranslations(draft);
  }, [activeItem, selectedLang, siteTranslations]);

  // Adjust active tab if the newly selected page does not support the active tab
  useEffect(() => {
    const config = SIDEBAR_ITEMS.find(item => item.id === activeItem);
    if (config?.type === 'page') {
      if (activeSubTab === 'seo' && !config.seoKey) {
        setActiveSubTab('content');
      }
    }
  }, [activeItem]);

  // Update Product form draft
  useEffect(() => {
    if (isAddingProduct) return;
    if (!selectedProductId) return;

    const baseProd = products.find(p => p.id === selectedProductId);
    const transProd = productTranslations.find(pt => pt.product_id === selectedProductId && pt.lang === selectedLang);

    setProductDraft({
      id: selectedProductId,
      image_url: baseProd?.image_url || '/images/product-bag-nobg.png',
      name: transProd?.name || '',
      category: transProd?.category || '',
      tagline: transProd?.tagline || '',
      description: transProd?.description || '',
      highlights: transProd?.highlights || [],
      specs: transProd?.specs || [],
    });
  }, [selectedProductId, selectedLang, products, productTranslations, isAddingProduct]);

  // Update Blog form draft
  useEffect(() => {
    if (isAddingBlog) return;
    if (!selectedBlogId) return;

    const baseBlog = blogs.find(b => b.id === selectedBlogId);
    const transBlog = blogTranslations.find(bt => bt.blog_id === selectedBlogId && bt.lang === selectedLang);

    setBlogDraft({
      id: selectedBlogId,
      image_url: baseBlog?.image_url || '/images/blog-images.png',
      category: transBlog?.category || 'Heritage',
      readTime: transBlog?.readTime || '5 min read',
      date: transBlog?.date || '',
      title: transBlog?.title || '',
      excerpt: transBlog?.excerpt || '',
      body: transBlog?.body || [],
    });
  }, [selectedBlogId, selectedLang, blogs, blogTranslations, isAddingBlog]);

  const showStatus = (text: string, error = false) => {
    setStatusMessage({ text, error });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  const handleLogout = async () => {
    await fetch('/api/cms-login', { method: 'DELETE' });
    window.location.reload();
  };

  // ── SAVE HANDLERS ──────────────────────────────────────────────────

  const savePageTranslations = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(draftTranslations)
        .filter(([_, val]) => val.trim() !== '')
        .map(([key, val]) => ({
          key,
          lang: selectedLang,
          value: val
        }));

      if (updates.length === 0) {
        showStatus('No translations to save.');
        setSaving(false);
        return;
      }

      const { error } = await supabase.from('site_translations').upsert(updates, { onConflict: 'key,lang' });
      if (error) throw error;

      showStatus('Updates saved successfully!');
      
      const { data: trans } = await supabase.from('site_translations').select('*');
      if (trans) setSiteTranslations(trans);
    } catch (err: any) {
      showStatus(`Failed to save: ${err.message}`, true);
    } finally {
      setSaving(false);
    }
  };

  const saveProduct = async () => {
    if (!productDraft.id) {
      showStatus('Product slug is required.', true);
      return;
    }
    setSaving(true);
    try {
      const { error: baseErr } = await supabase.from('products').upsert({
        id: productDraft.id,
        image_url: productDraft.image_url,
      }, { onConflict: 'id' });
      if (baseErr) throw baseErr;

      const { error: transErr } = await supabase.from('product_translations').upsert({
        product_id: productDraft.id,
        lang: selectedLang,
        name: productDraft.name,
        category: productDraft.category,
        tagline: productDraft.tagline,
        description: productDraft.description,
        highlights: productDraft.highlights,
        specs: productDraft.specs,
      }, { onConflict: 'product_id,lang' });
      if (transErr) throw transErr;

      showStatus('Product settings updated successfully!');
      setIsAddingProduct(false);
      setSelectedProductId(productDraft.id);
      await fetchData(true);
    } catch (err: any) {
      showStatus(`Product save error: ${err.message}`, true);
    } finally {
      setSaving(false);
    }
  };

  const moveProduct = async (id: string, direction: 'up' | 'down') => {
    const ptThis = productTranslations.find(pt => pt.product_id === id && pt.lang === 'en');
    const thisCat = ptThis?.category || 'Rice';
    
    // get all products in this category
    const catProducts = products.filter(p => {
      const pt = productTranslations.find(pt => pt.product_id === p.id && pt.lang === 'en');
      return (pt?.category || 'Rice') === thisCat;
    });

    const idx = catProducts.findIndex(p => p.id === id);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= catProducts.length) return;

    const targetProduct = catProducts[idx];
    const swapProduct = catProducts[swapIdx];

    const aOrder = targetProduct.order_index ?? products.findIndex(p => p.id === id);
    const bOrder = swapProduct.order_index ?? products.findIndex(p => p.id === swapProduct.id);

    const newProducts = [...products];
    const globalIdxTarget = newProducts.findIndex(p => p.id === id);
    const globalIdxSwap = newProducts.findIndex(p => p.id === swapProduct.id);

    // Swap order_index values in local state
    newProducts[globalIdxTarget] = { ...newProducts[globalIdxTarget], order_index: bOrder };
    newProducts[globalIdxSwap] = { ...newProducts[globalIdxSwap], order_index: aOrder };
    newProducts.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
    setProducts(newProducts);

    try {
      await Promise.all([
        supabase.from('products').update({ order_index: bOrder }).eq('id', id),
        supabase.from('products').update({ order_index: aOrder }).eq('id', swapProduct.id),
      ]);
    } catch (err: any) {
      showStatus(`Reorder failed: ${err.message}`, true);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm(`Permanently delete product "${id}"?`)) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      showStatus('Product deleted.');
      setSelectedProductId(null);
      await fetchData();
    } catch (err: any) {
      showStatus(`Delete failed: ${err.message}`, true);
    } finally {
      setSaving(false);
    }
  };

  const saveBlog = async () => {
    if (!blogDraft.id) {
      showStatus('Blog slug is required.', true);
      return;
    }
    setSaving(true);
    try {
      const { error: baseErr } = await supabase.from('blogs').upsert({
        id: blogDraft.id,
        image_url: blogDraft.image_url,
      }, { onConflict: 'id' });
      if (baseErr) throw baseErr;

      const { error: transErr } = await supabase.from('blog_translations').upsert({
        blog_id: blogDraft.id,
        lang: selectedLang,
        category: blogDraft.category,
        readTime: blogDraft.readTime,
        date: blogDraft.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        title: blogDraft.title,
        excerpt: blogDraft.excerpt,
        body: blogDraft.body,
      }, { onConflict: 'blog_id,lang' });
      if (transErr) throw transErr;

      showStatus('Blog article saved successfully!');
      setIsAddingBlog(false);
      setSelectedBlogId(blogDraft.id);
      await fetchData(true);
    } catch (err: any) {
      showStatus(`Blog save error: ${err.message}`, true);
    } finally {
      setSaving(false);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm(`Permanently delete blog article "${id}"?`)) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) throw error;
      showStatus('Blog article removed.');
      setSelectedBlogId(null);
      await fetchData();
    } catch (err: any) {
      showStatus(`Delete failed: ${err.message}`, true);
    } finally {
      setSaving(false);
    }
  };

  // ── FILE UPLOADS & OVERRIDES ──────────────────────────────────────

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'blog' | string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `cms/${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from('cms-media')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadErr) {
        throw new Error(`${uploadErr.message}. If bucket is missing, run SQL editor storage setups.`);
      }

      const { data } = supabase.storage.from('cms-media').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      if (target === 'product') {
        setProductDraft(prev => ({ ...prev, image_url: publicUrl }));
        showStatus('Product asset uploaded successfully.');
      } else if (target === 'blog') {
        setBlogDraft(prev => ({ ...prev, image_url: publicUrl }));
        showStatus('Blog article asset uploaded.');
      } else {
        // Direct media override upsert
        const { error: overrideErr } = await supabase.from('image_overrides').upsert({
          key: target,
          url: publicUrl
        }, { onConflict: 'key' });

        if (overrideErr) throw overrideErr;

        showStatus(`Media asset for key "${target}" updated!`);
        await fetchData();
      }
    } catch (err: any) {
      showStatus(`Upload failed: ${err.message}. Ensure bucket exists and has correct insert permissions.`, true);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleManualUrlSave = async (key: string, value: string) => {
    if (!value.trim()) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('image_overrides').upsert({
        key,
        url: value
      }, { onConflict: 'key' });
      if (error) throw error;
      showStatus(`Override value for "${key}" updated.`);
      await fetchData();
    } catch (err: any) {
      showStatus(`Update failed: ${err.message}`, true);
    } finally {
      setSaving(false);
    }
  };

  const removeMediaOverride = async (key: string) => {
    if (!confirm(`Delete media override setting for "${key}"?`)) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('image_overrides').delete().eq('key', key);
      if (error) throw error;
      showStatus(`Cleared override for "${key}".`);
      await fetchData();
    } catch (err: any) {
      showStatus(`Failed to clear: ${err.message}`, true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FCFAF7',
        color: '#2E251E',
        fontFamily: 'var(--font-body, system-ui)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(162, 123, 60, 0.1)',
            borderTopColor: '#A27B3C',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px auto'
          }} />
          <p style={{ fontSize: '0.85rem', color: '#2E251E' }}>Retrieving schema from Supabase...</p>
          <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
        </div>
      </div>
    );
  }

  const activeConfig = SIDEBAR_ITEMS.find(item => item.id === activeItem);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FCFAF7',
      color: '#2E251E',
      fontFamily: 'var(--font-body, system-ui)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* ── TOP HEADER ────────────────────────────────────────────────── */}
      <header style={{
        padding: '16px 32px',
        background: '#FFFFFF',
        borderBottom: '1px solid rgba(162, 123, 60, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontFamily: 'var(--font-display, Georgia)',
            fontSize: '1.4rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#2E251E'
          }}>
            AREMA <span style={{ color: '#A27B3C', fontWeight: 300 }}>CMS</span>
          </span>
          <span style={{
            fontSize: '0.65rem',
            background: 'rgba(162, 123, 60, 0.08)',
            color: '#A27B3C',
            padding: '2px 8px',
            borderRadius: '10px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>Database Backed</span>
        </div>

        {/* Global actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid rgba(220, 53, 69, 0.35)',
              borderRadius: '6px',
              color: '#DC3545',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(220, 53, 69, 0.05)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* ── LEFT SIDEBAR NAVIGATION ──────────────────────────────────── */}
        <aside style={{
          width: '280px',
          borderRight: '1px solid rgba(162, 123, 60, 0.12)',
          background: '#F5EFEB',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          overflowY: 'auto'
        }}>
          
          <div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(46, 37, 30, 0.45)', marginBottom: '12px', paddingLeft: '8px', fontWeight: 700 }}>Page Sections</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {SIDEBAR_ITEMS.filter(item => item.group === 'sections').map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveItem(item.id);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 14px',
                    background: activeItem === item.id ? 'rgba(162, 123, 60, 0.08)' : 'transparent',
                    border: 'none',
                    borderLeft: activeItem === item.id ? '3px solid #A27B3C' : '3px solid transparent',
                    borderRadius: '0 8px 8px 0',
                    color: activeItem === item.id ? '#A27B3C' : 'rgba(46, 37, 30, 0.75)',
                    fontSize: '0.85rem',
                    fontWeight: activeItem === item.id ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onMouseOver={(e) => {
                    if (activeItem !== item.id) e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                  }}
                  onMouseOut={(e) => {
                    if (activeItem !== item.id) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(46, 37, 30, 0.45)', marginBottom: '12px', paddingLeft: '8px', fontWeight: 700 }}>Catalog Managers</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {SIDEBAR_ITEMS.filter(item => item.group === 'catalogs').map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveItem(item.id);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 14px',
                    background: activeItem === item.id ? 'rgba(162, 123, 60, 0.08)' : 'transparent',
                    border: 'none',
                    borderLeft: activeItem === item.id ? '3px solid #A27B3C' : '3px solid transparent',
                    borderRadius: '0 8px 8px 0',
                    color: activeItem === item.id ? '#A27B3C' : 'rgba(46, 37, 30, 0.75)',
                    fontSize: '0.85rem',
                    fontWeight: activeItem === item.id ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onMouseOver={(e) => {
                    if (activeItem !== item.id) e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                  }}
                  onMouseOut={(e) => {
                    if (activeItem !== item.id) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* ── RIGHT CONTENT PANEL ─────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

          {/* PAGE SECTION EDITOR VIEW */}
          {activeConfig && activeConfig.type === 'page' && (
            <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              
              {/* Header with Title and Language Picker */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                borderBottom: '1px solid rgba(162, 123, 60, 0.12)',
                paddingBottom: '20px'
              }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', margin: '0 0 6px 0', fontFamily: 'Georgia', fontWeight: 600, color: '#2E251E' }}>
                    {activeConfig.name}
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(46, 37, 30, 0.55)', margin: 0 }}>
                    Manage combined page content details and media overrides in sequence.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(46, 37, 30, 0.75)', fontWeight: 600 }}>Active Language:</span>
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value as LanguageCode)}
                    style={{
                      padding: '10px 16px',
                      background: '#FFFFFF',
                      border: '1px solid rgba(162, 123, 60, 0.25)',
                      borderRadius: '8px',
                      color: '#2E251E',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {LANGUAGES.map(l => (
                      <option key={l.code} value={l.code}>
                        {l.flag} {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sub Navigation Tabs for the Page (Content & Media / SEO) */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid rgba(162, 123, 60, 0.1)', paddingBottom: '8px' }}>
                <button
                  onClick={() => setActiveSubTab('content')}
                  style={{
                    padding: '8px 20px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeSubTab === 'content' ? '2px solid #A27B3C' : '2px solid transparent',
                    color: activeSubTab === 'content' ? '#A27B3C' : 'rgba(46, 37, 30, 0.6)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                >
                  Content & Media
                </button>

                {activeConfig.seoKey && (
                  <button
                    onClick={() => setActiveSubTab('seo')}
                    style={{
                      padding: '8px 20px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: activeSubTab === 'seo' ? '2px solid #A27B3C' : '2px solid transparent',
                      color: activeSubTab === 'seo' ? '#A27B3C' : 'rgba(46, 37, 30, 0.6)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                  >
                    SEO Tags
                  </button>
                )}
              </div>

              {/* TAB 1: Combined Content & Media inline Flow */}
              {activeSubTab === 'content' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                  {PAGE_FLOWS[activeItem]?.map((item, index) => {
                    
                    // CASE A: It's a text key
                    if (typeof item === 'string') {
                      const key = item;
                      const baselineValue = flattenObject(en)[key] || '';
                      const isArray = baselineValue.startsWith('[') || baselineValue.startsWith('{');

                      return (
                        <div key={key} style={{
                          background: '#FFFFFF',
                          border: '1px solid rgba(162, 123, 60, 0.08)',
                          padding: '24px',
                          borderRadius: '12px',
                          boxShadow: '0 2px 8px rgba(162, 123, 60, 0.03)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#A27B3C', fontFamily: 'monospace' }}>{key}</span>
                            {isArray && (
                              <span style={{
                                fontSize: '0.65rem',
                                background: 'rgba(162, 123, 60, 0.08)',
                                color: '#A27B3C',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontWeight: 700
                              }}>JSON Array</span>
                            )}
                          </div>

                          <div style={{
                            fontSize: '0.85rem',
                            background: '#F9F6F2',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            color: 'rgba(46, 37, 30, 0.7)',
                            marginBottom: '14px',
                            borderLeft: '3px solid #C5A059',
                            lineHeight: 1.5
                          }}>
                            <strong>English baseline:</strong> {baselineValue}
                          </div>

                          <textarea
                            rows={isArray ? 5 : 2}
                            value={draftTranslations[key] || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDraftTranslations(prev => ({ ...prev, [key]: val }));
                            }}
                            placeholder={isArray ? '[ "Item 1", "Item 2" ]' : `Enter translation...`}
                            style={{
                              width: '100%',
                              padding: '14px 18px',
                              background: '#FFFFFF',
                              border: '1px solid rgba(162, 123, 60, 0.2)',
                              borderRadius: '8px',
                              color: '#2E251E',
                              fontSize: '0.9rem',
                              lineHeight: 1.5,
                              outline: 'none',
                              fontFamily: isArray ? 'monospace' : 'inherit',
                              resize: 'vertical',
                              transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#A27B3C'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(162, 123, 60, 0.2)'}
                          />
                        </div>
                      );
                    }

                    // CASE B: It's a media override key
                    const media = item as MediaConfig;
                    const dbOverride = imageOverrides.find(o => o.key === media.mediaKey);
                    const currentVal = dbOverride ? dbOverride.url : '';

                    return (
                      <div key={media.mediaKey} style={{
                        background: '#FFFFFF',
                        border: '2px dashed rgba(162, 123, 60, 0.15)',
                        padding: '24px',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        boxShadow: '0 2px 8px rgba(162, 123, 60, 0.03)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#A27B3C' }}>
                            🖼️ {media.label}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(46, 37, 30, 0.4)', fontFamily: 'monospace' }}>
                            media_override key: {media.mediaKey}
                          </span>
                        </div>

                        {/* Preview */}
                        {currentVal && media.mediaType === 'image' && (
                          <div style={{ height: '180px', background: '#F9F6F2', border: '1px solid rgba(162, 123, 60, 0.1)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={currentVal} alt="Dynamic Media Override" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                          </div>
                        )}

                        {currentVal && media.mediaType === 'video' && (
                          <div style={{ height: '180px', background: '#F9F6F2', border: '1px solid rgba(162, 123, 60, 0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                            <video src={currentVal} controls muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            value={mediaValues[media.mediaKey] || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMediaValues(prev => ({ ...prev, [media.mediaKey]: val }));
                            }}
                            onBlur={(e) => handleManualUrlSave(media.mediaKey, e.target.value)}
                            placeholder={media.mediaType === 'text' ? 'Provide phone or value override...' : 'Or paste a public asset link URL directly...'}
                            style={{
                              flex: 1,
                              padding: '10px 14px',
                              background: '#FFFFFF',
                              border: '1px solid rgba(162, 123, 60, 0.2)',
                              borderRadius: '6px',
                              color: '#2E251E',
                              fontSize: '0.85rem',
                              outline: 'none'
                            }}
                          />
                          {currentVal && (
                            <button
                              onClick={() => removeMediaOverride(media.mediaKey)}
                              style={{
                                padding: '8px 14px',
                                background: 'rgba(220, 53, 69, 0.05)',
                                border: '1px solid rgba(220, 53, 69, 0.25)',
                                color: '#DC3545',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                fontWeight: 600
                              }}
                            >
                              Reset
                            </button>
                          )}
                        </div>

                        {media.mediaType !== 'text' && (
                          <div style={{ position: 'relative' }}>
                            <button style={{
                              width: '100%',
                              padding: '10px',
                              background: 'rgba(162, 123, 60, 0.06)',
                              border: '1px solid rgba(162, 123, 60, 0.15)',
                              borderRadius: '6px',
                              color: '#A27B3C',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}>
                              {uploadingFile ? 'Uploading file...' : `Upload New ${media.mediaType === 'video' ? 'Video File' : 'Image File'}`}
                            </button>
                            <input
                              type="file"
                              accept={media.mediaType === 'video' ? 'video/*' : 'image/*'}
                              disabled={uploadingFile}
                              onChange={(e) => uploadFile(e, media.mediaKey)}
                              style={{
                                position: 'absolute',
                                inset: 0,
                                opacity: 0,
                                cursor: 'pointer'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div style={{
                    position: 'sticky',
                    bottom: 0,
                    background: '#FCFAF7',
                    padding: '24px 0 16px 0',
                    marginTop: '32px',
                    borderTop: '1px solid rgba(162, 123, 60, 0.12)',
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}>
                    <button
                      onClick={savePageTranslations}
                      disabled={saving}
                      style={{
                        padding: '12px 32px',
                        background: 'linear-gradient(135deg, #C5A059 0%, #A27B3C 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        cursor: saving ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem',
                        boxShadow: '0 4px 20px rgba(162, 123, 60, 0.15)',
                        transition: 'opacity 0.2s'
                      }}
                    >
                      {saving ? 'Saving...' : 'Save Page Content'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: SEO Details editing */}
              {activeSubTab === 'seo' && activeConfig.seoKey && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(162, 123, 60, 0.08)',
                    padding: '28px',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    boxShadow: '0 2px 8px rgba(162, 123, 60, 0.03)'
                  }}>
                    <h3 style={{ fontSize: '1.1rem', color: '#A27B3C', margin: '0 0 8px 0', fontWeight: 600 }}>SEO Metadata</h3>
                    
                    {/* SEO Title */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(46, 37, 30, 0.65)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Page Title Tag
                      </label>
                      <input
                        type="text"
                        value={draftTranslations[`seo.${activeConfig.seoKey}.title`] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraftTranslations(prev => ({ ...prev, [`seo.${activeConfig.seoKey}.title`]: val }));
                        }}
                        placeholder="Page title text used by search engine search listings..."
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: '#FFFFFF',
                          border: '1px solid rgba(162, 123, 60, 0.2)',
                          borderRadius: '8px',
                          color: '#2E251E',
                          fontSize: '0.9rem',
                          outline: 'none'
                        }}
                      />
                    </div>

                    {/* SEO Description */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(46, 37, 30, 0.65)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Meta Description
                      </label>
                      <textarea
                        rows={3}
                        value={draftTranslations[`seo.${activeConfig.seoKey}.description`] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraftTranslations(prev => ({ ...prev, [`seo.${activeConfig.seoKey}.description`]: val }));
                        }}
                        placeholder="Provide a concise summary paragraph (approx 150-160 chars) about this page..."
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: '#FFFFFF',
                          border: '1px solid rgba(162, 123, 60, 0.2)',
                          borderRadius: '8px',
                          color: '#2E251E',
                          fontSize: '0.9rem',
                          outline: 'none',
                          resize: 'vertical',
                          lineHeight: 1.5
                        }}
                      />
                    </div>

                    {/* SEO Keywords */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(46, 37, 30, 0.65)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Meta Keywords
                      </label>
                      <input
                        type="text"
                        value={draftTranslations[`seo.${activeConfig.seoKey}.keywords`] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraftTranslations(prev => ({ ...prev, [`seo.${activeConfig.seoKey}.keywords`]: val }));
                        }}
                        placeholder="e.g. matta rice, organic export, kerala, arema foods (comma-separated list)"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: '#FFFFFF',
                          border: '1px solid rgba(162, 123, 60, 0.2)',
                          borderRadius: '8px',
                          color: '#2E251E',
                          fontSize: '0.9rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{
                    position: 'sticky',
                    bottom: 0,
                    background: '#FCFAF7',
                    padding: '24px 0 16px 0',
                    marginTop: '32px',
                    borderTop: '1px solid rgba(162, 123, 60, 0.12)',
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}>
                    <button
                      onClick={savePageTranslations}
                      disabled={saving}
                      style={{
                        padding: '12px 32px',
                        background: 'linear-gradient(135deg, #C5A059 0%, #A27B3C 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        cursor: saving ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem',
                        boxShadow: '0 4px 20px rgba(162, 123, 60, 0.15)'
                      }}
                    >
                      {saving ? 'Saving...' : 'Save SEO Tags'}
                    </button>
                  </div>
                </div>
              )}

            </main>
          )}

          {/* CATALOG 1: PRODUCTS MANAGER VIEW */}
          {activeItem === 'products-list' && (
            <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              
              {/* Product side list panel */}
              <aside style={{
                width: '240px',
                borderRight: '1px solid rgba(162, 123, 60, 0.12)',
                background: '#F5EFEB',
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(46, 37, 30, 0.45)', marginBottom: '12px', paddingLeft: '8px', fontWeight: 700 }}>Catalog Entries</div>
                  {(() => {
                    const categoriesString = siteTranslations.find(t => t.key === 'global.productCategories' && t.lang === 'en')?.value || 'Kerala Heritage,Premium Grade,Aromatic Collection,Medicinal & Heritage,Specialty Aromatic,Rice Powders,Kondattams';
                    const categoryOrder = categoriesString.split(',').map((c: string) => c.trim()).filter(Boolean);
                    
                    const groupedProducts: Record<string, typeof products> = {};
                    products.forEach(p => {
                      const trans = productTranslations.find(pt => pt.product_id === p.id && pt.lang === 'en');
                      const cat = trans?.category || 'Rice';
                      if (!groupedProducts[cat]) groupedProducts[cat] = [];
                      groupedProducts[cat].push(p);
                    });

                    const orderedCategories = categoryOrder.filter((cat: string) => groupedProducts[cat]);
                    Object.keys(groupedProducts).forEach(cat => {
                      if (!orderedCategories.includes(cat)) orderedCategories.push(cat);
                    });

                    return orderedCategories.map((cat: string) => (
                      <div key={cat} style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C5A059', marginBottom: '6px', paddingLeft: '8px', fontWeight: 700 }}>
                          ▼ {cat}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {groupedProducts[cat].map(p => {
                            const trans = productTranslations.find(pt => pt.product_id === p.id && pt.lang === 'en');
                            return (
                              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <button
                                  onClick={() => {
                                    setIsAddingProduct(false);
                                    setSelectedProductId(p.id);
                                  }}
                                  style={{
                                    flex: 1,
                                    textAlign: 'left',
                                    padding: '8px 12px',
                                    background: (!isAddingProduct && selectedProductId === p.id) ? 'rgba(162, 123, 60, 0.08)' : 'transparent',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: (!isAddingProduct && selectedProductId === p.id) ? '#A27B3C' : 'rgba(46, 37, 30, 0.75)',
                                    fontSize: '0.8rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2px',
                                    transition: 'all 0.15s'
                                  }}
                                >
                                  <span style={{ fontWeight: 600 }}>{trans?.name || p.id}</span>
                                  <span style={{ fontSize: '0.65rem', color: 'rgba(46, 37, 30, 0.45)', fontFamily: 'monospace' }}>{p.id}</span>
                                </button>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                  <button
                                    onClick={() => moveProduct(p.id, 'up')}
                                    title="Move Up"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(46,37,30,0.4)', padding: '2px 4px', borderRadius: '4px', lineHeight: 1 }}
                                    onMouseOver={(e) => e.currentTarget.style.color = '#A27B3C'}
                                    onMouseOut={(e) => e.currentTarget.style.color = 'rgba(46,37,30,0.4)'}
                                  >▲</button>
                                  <button
                                    onClick={() => moveProduct(p.id, 'down')}
                                    title="Move Down"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(46,37,30,0.4)', padding: '2px 4px', borderRadius: '4px', lineHeight: 1 }}
                                    onMouseOver={(e) => e.currentTarget.style.color = '#A27B3C'}
                                    onMouseOut={(e) => e.currentTarget.style.color = 'rgba(46,37,30,0.4)'}
                                  >▼</button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ));
                  })()}
                </div>

                <button
                  onClick={() => {
                    setIsAddingProduct(true);
                    setSelectedProductId(null);
                    setIsManagingCategories(false);
                    setProductDraft({
                      id: '',
                      image_url: '/images/product-bag-nobg.png',
                      name: '',
                      category: '',
                      tagline: '',
                      description: '',
                      highlights: [],
                      specs: [],
                    });
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#FFFFFF',
                    border: '1px dashed rgba(162, 123, 60, 0.4)',
                    borderRadius: '8px',
                    color: '#A27B3C',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'center',
                    marginTop: '16px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(162, 123, 60, 0.03)'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#FFFFFF'}
                >
                  + Add Product
                </button>

                <button
                  onClick={() => {
                    setIsAddingProduct(false);
                    setSelectedProductId(null);
                    setIsManagingCategories(true);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#FFFFFF',
                    border: '1px solid rgba(162, 123, 60, 0.4)',
                    borderRadius: '8px',
                    color: '#A27B3C',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'center',
                    marginTop: '8px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(162, 123, 60, 0.03)'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#FFFFFF'}
                >
                  ⚙️ Manage Categories
                </button>
              </aside>

              {/* Product form editing panel */}
              <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
                
                {isManagingCategories ? (
                  <div>
                    <h2 style={{ fontSize: '1.4rem', margin: '0 0 6px 0', fontFamily: 'Georgia', fontWeight: 600, color: '#2E251E' }}>
                      Manage Product Categories
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(46, 37, 30, 0.55)', margin: 0, marginBottom: '24px' }}>
                      Reorder the categories below to change how they appear on the products page.
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '600px' }}>
                      {(() => {
                        const categoriesString = siteTranslations.find(t => t.key === 'global.productCategories' && t.lang === 'en')?.value || 'Kerala Heritage,Premium Grade,Aromatic Collection,Medicinal & Heritage,Specialty Aromatic,Rice Powders,Kondattams';
                        const cats = categoriesString.split(',').map((c: string) => c.trim()).filter(Boolean);
                        
                        const moveCat = async (idx: number, dir: 'up'|'down') => {
                          const newCats = [...cats];
                          const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
                          if (swapIdx < 0 || swapIdx >= newCats.length) return;
                          
                          [newCats[idx], newCats[swapIdx]] = [newCats[swapIdx], newCats[idx]];
                          const newString = newCats.join(',');
                          
                          try {
                            setSaving(true);
                            await supabase.from('site_translations').upsert({
                              key: 'global.productCategories',
                              lang: 'en',
                              value: newString
                            }, { onConflict: 'key,lang' });
                            await fetchData();
                          } catch (err: any) {
                            showStatus(`Failed to update categories: ${err.message}`, true);
                          } finally {
                            setSaving(false);
                          }
                        };
                        
                        return cats.map((cat: string, i: number) => (
                          <div key={cat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#FFFFFF', border: '1px solid rgba(162, 123, 60, 0.15)', borderRadius: '8px' }}>
                            <span style={{ fontWeight: 600, color: '#2E251E' }}>{cat}</span>
                            <div style={{ display: 'flex', gap: '16px' }}>
                              <button onClick={() => moveCat(i, 'up')} disabled={i === 0 || saving} style={{ cursor: (i === 0 || saving) ? 'not-allowed' : 'pointer', background: 'none', border: '1px solid rgba(162,123,60,0.2)', padding: '4px 12px', borderRadius: '4px', color: '#A27B3C' }}>▲ Move Up</button>
                              <button onClick={() => moveCat(i, 'down')} disabled={i === cats.length - 1 || saving} style={{ cursor: (i === cats.length - 1 || saving) ? 'not-allowed' : 'pointer', background: 'none', border: '1px solid rgba(162,123,60,0.2)', padding: '4px 12px', borderRadius: '4px', color: '#A27B3C' }}>▼ Move Down</button>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                  borderBottom: '1px solid rgba(162, 123, 60, 0.12)',
                  paddingBottom: '20px'
                }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', margin: '0 0 6px 0', fontFamily: 'Georgia', fontWeight: 600, color: '#2E251E' }}>
                      {isAddingProduct ? 'Create New Product' : `Edit Product parameters: ${selectedProductId}`}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(46, 37, 30, 0.55)', margin: 0 }}>Configure names, attributes, specifications lists, and translations.</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(46, 37, 30, 0.75)', fontWeight: 600 }}>Edit Language:</span>
                    <select
                      value={selectedLang}
                      onChange={(e) => setSelectedLang(e.target.value as LanguageCode)}
                      style={{
                        padding: '10px 16px',
                        background: '#FFFFFF',
                        border: '1px solid rgba(162, 123, 60, 0.25)',
                        borderRadius: '8px',
                        color: '#2E251E',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {LANGUAGES.map(l => (
                        <option key={l.code} value={l.code}>
                          {l.flag} {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '32px' }}>
                  
                  {/* Inputs Fields Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(46, 37, 30, 0.65)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Product Slug ID (e.g. kaima-rice)
                      </label>
                      <input
                        type="text"
                        disabled={!isAddingProduct}
                        value={productDraft.id}
                        onChange={(e) => setProductDraft(prev => ({ ...prev, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                        placeholder="e.g. premium-kaima"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#FFFFFF',
                          border: '1px solid rgba(162, 123, 60, 0.2)',
                          borderRadius: '6px',
                          color: isAddingProduct ? '#2E251E' : 'rgba(46, 37, 30, 0.45)',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(46, 37, 30, 0.65)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Product Name
                        </label>
                        <input
                          type="text"
                          value={productDraft.name}
                          onChange={(e) => setProductDraft(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Premium Kaima Rice"
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: '#FFFFFF',
                            border: '1px solid rgba(162, 123, 60, 0.2)',
                            borderRadius: '6px',
                            color: '#2E251E',
                            fontSize: '0.85rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(46, 37, 30, 0.65)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Category Label
                        </label>
                        <input
                          type="text"
                          value={productDraft.category}
                          onChange={(e) => setProductDraft(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="e.g. Aromatic Rice"
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: '#FFFFFF',
                            border: '1px solid rgba(162, 123, 60, 0.2)',
                            borderRadius: '6px',
                            color: '#2E251E',
                            fontSize: '0.85rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(46, 37, 30, 0.65)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Brief Tagline
                      </label>
                      <input
                        type="text"
                        value={productDraft.tagline}
                        onChange={(e) => setProductDraft(prev => ({ ...prev, tagline: e.target.value }))}
                        placeholder="The short grain with sweet aroma..."
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#FFFFFF',
                          border: '1px solid rgba(162, 123, 60, 0.2)',
                          borderRadius: '6px',
                          color: '#2E251E',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(46, 37, 30, 0.65)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Product Narrative Description
                      </label>
                      <textarea
                        rows={5}
                        value={productDraft.description}
                        onChange={(e) => setProductDraft(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Full product background story..."
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#FFFFFF',
                          border: '1px solid rgba(162, 123, 60, 0.2)',
                          borderRadius: '6px',
                          color: '#2E251E',
                          fontSize: '0.85rem',
                          outline: 'none',
                          lineHeight: 1.5,
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    {/* Highlights array editor */}
                    <div style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(162, 123, 60, 0.08)',
                      padding: '20px',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#A27B3C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Highlights list</span>
                        <button
                          onClick={() => setProductDraft(prev => ({ ...prev, highlights: [...prev.highlights, ''] }))}
                          style={{
                            background: 'rgba(162, 123, 60, 0.08)',
                            border: '1px solid rgba(162, 123, 60, 0.2)',
                            color: '#A27B3C',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          + Add Highlight
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {productDraft.highlights.map((h, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                            <input
                              type="text"
                              value={h}
                              onChange={(e) => {
                                const list = [...productDraft.highlights];
                                list[idx] = e.target.value;
                                setProductDraft(prev => ({ ...prev, highlights: list }));
                              }}
                              placeholder="Key attribute highlight..."
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                background: '#FFFFFF',
                                border: '1px solid rgba(162, 123, 60, 0.2)',
                                borderRadius: '4px',
                                color: '#2E251E',
                                fontSize: '0.8rem',
                                outline: 'none'
                              }}
                            />
                            <button
                              onClick={() => {
                                const list = productDraft.highlights.filter((_, i) => i !== idx);
                                setProductDraft(prev => ({ ...prev, highlights: list }));
                              }}
                              style={{
                                background: 'rgba(220, 53, 69, 0.05)',
                                border: '1px solid rgba(220, 53, 69, 0.25)',
                                color: '#DC3545',
                                width: '32px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Specs array editor */}
                    <div style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(162, 123, 60, 0.08)',
                      padding: '20px',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#A27B3C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Parameters Specifications</span>
                        <button
                          onClick={() => setProductDraft(prev => ({ ...prev, specs: [...prev.specs, { label: '', value: '' }] }))}
                          style={{
                            background: 'rgba(162, 123, 60, 0.08)',
                            border: '1px solid rgba(162, 123, 60, 0.2)',
                            color: '#A27B3C',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          + Add Spec
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {productDraft.specs.map((s, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                            <input
                              type="text"
                              value={s.label}
                              onChange={(e) => {
                                const list = [...productDraft.specs];
                                list[idx] = { ...list[idx], label: e.target.value };
                                setProductDraft(prev => ({ ...prev, specs: list }));
                              }}
                              placeholder="Parameter name..."
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                background: '#FFFFFF',
                                border: '1px solid rgba(162, 123, 60, 0.2)',
                                borderRadius: '4px',
                                color: '#2E251E',
                                fontSize: '0.8rem',
                                outline: 'none'
                              }}
                            />
                            <input
                              type="text"
                              value={s.value}
                              onChange={(e) => {
                                const list = [...productDraft.specs];
                                list[idx] = { ...list[idx], value: e.target.value };
                                setProductDraft(prev => ({ ...prev, specs: list }));
                              }}
                              placeholder="Specification limit/value..."
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                background: '#FFFFFF',
                                border: '1px solid rgba(162, 123, 60, 0.2)',
                                borderRadius: '4px',
                                color: '#2E251E',
                                fontSize: '0.8rem',
                                outline: 'none'
                              }}
                            />
                            <button
                              onClick={() => {
                                const list = productDraft.specs.filter((_, i) => i !== idx);
                                setProductDraft(prev => ({ ...prev, specs: list }));
                              }}
                              style={{
                                background: 'rgba(220, 53, 69, 0.05)',
                                border: '1px solid rgba(220, 53, 69, 0.25)',
                                color: '#DC3545',
                                width: '32px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Sidebar Media Preview & Save Product */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    <div style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(162, 123, 60, 0.08)',
                      borderRadius: '10px',
                      padding: '20px'
                    }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(46, 37, 30, 0.65)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Product Bag Cover Image
                      </label>
                      
                      <div style={{
                        height: '200px',
                        background: '#F9F6F2',
                        border: '1px solid rgba(162, 123, 60, 0.12)',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={productDraft.image_url}
                          alt="Bag cover"
                          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', padding: '16px' }}
                          onError={(e) => {
                            e.currentTarget.src = '/images/product-bag-nobg.png';
                          }}
                        />
                      </div>

                      <input
                        type="text"
                        value={productDraft.image_url}
                        onChange={(e) => setProductDraft(prev => ({ ...prev, image_url: e.target.value }))}
                        placeholder="Image asset public path..."
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          background: '#FFFFFF',
                          border: '1px solid rgba(162, 123, 60, 0.2)',
                          borderRadius: '6px',
                          color: '#2E251E',
                          fontSize: '0.8rem',
                          outline: 'none',
                          marginBottom: '12px'
                        }}
                      />

                      <div style={{ position: 'relative' }}>
                        <button style={{
                          width: '100%',
                          padding: '10px',
                          background: 'rgba(162, 123, 60, 0.08)',
                          border: '1px solid rgba(162, 123, 60, 0.2)',
                          borderRadius: '6px',
                          color: '#A27B3C',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}>
                          {uploadingFile ? 'Uploading file...' : 'Upload Image'}
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingFile}
                          onChange={(e) => uploadFile(e, 'product')}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0,
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button
                        onClick={saveProduct}
                        disabled={saving}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'linear-gradient(135deg, #C5A059 0%, #A27B3C 100%)',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          cursor: saving ? 'not-allowed' : 'pointer',
                          fontSize: '0.85rem',
                          boxShadow: '0 4px 15px rgba(162, 123, 60, 0.2)'
                        }}
                      >
                        {saving ? 'Saving...' : isAddingProduct ? 'Create Product' : 'Save Product'}
                      </button>

                      {isAddingProduct && (
                        <button
                          onClick={() => {
                            setIsAddingProduct(false);
                            setSelectedProductId(products.length > 0 ? products[0].id : null);
                          }}
                          disabled={saving}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: 'transparent',
                            border: '1px solid rgba(162, 123, 60, 0.3)',
                            borderRadius: '6px',
                            color: 'rgba(46, 37, 30, 0.65)',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: saving ? 'not-allowed' : 'pointer'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(162, 123, 60, 0.04)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          Cancel
                        </button>
                      )}

                      {!isAddingProduct && selectedProductId && (
                        <button
                          onClick={() => deleteProduct(selectedProductId)}
                          disabled={saving}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: 'transparent',
                            border: '1px solid rgba(220, 53, 69, 0.35)',
                            borderRadius: '6px',
                            color: '#DC3545',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: saving ? 'not-allowed' : 'pointer'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(220, 53, 69, 0.05)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          Delete Product
                        </button>
                      )}
                    </div>

                  </div>

                </div>
                  </>
                )}

              </div>

            </main>
          )}

          {/* CATALOG 2: BLOG POSTS ARTICLES VIEW */}
          {activeItem === 'blogs-list' && (
            <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              
              {/* Blog side list panel */}
              <aside style={{
                width: '240px',
                borderRight: '1px solid rgba(162, 123, 60, 0.12)',
                background: '#F5EFEB',
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(46, 37, 30, 0.45)', marginBottom: '12px', paddingLeft: '8px', fontWeight: 700 }}>Articles</div>
                  {blogs.map(b => {
                    const trans = blogTranslations.find(bt => bt.blog_id === b.id && bt.lang === 'en');
                    return (
                      <button
                        key={b.id}
                        onClick={() => {
                          setIsAddingBlog(false);
                          setSelectedBlogId(b.id);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '10px 12px',
                          background: (!isAddingBlog && selectedBlogId === b.id) ? 'rgba(162, 123, 60, 0.08)' : 'transparent',
                          border: 'none',
                          borderRadius: '8px',
                          color: (!isAddingBlog && selectedBlogId === b.id) ? '#A27B3C' : 'rgba(46, 37, 30, 0.75)',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          transition: 'all 0.15s'
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{trans?.title || b.id}</span>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(46, 37, 30, 0.45)', fontFamily: 'monospace' }}>{b.id}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    setIsAddingBlog(true);
                    setSelectedBlogId(null);
                    setBlogDraft({
                      id: '',
                      image_url: '/images/blog-images.png',
                      category: 'Heritage',
                      readTime: '5 min read',
                      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                      title: '',
                      excerpt: '',
                      body: [],
                    });
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#FFFFFF',
                    border: '1px dashed rgba(162, 123, 60, 0.4)',
                    borderRadius: '8px',
                    color: '#A27B3C',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'center',
                    marginTop: '16px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(162, 123, 60, 0.03)'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#FFFFFF'}
                >
                  + Add Article
                </button>
              </aside>

              {/* Blog form editing panel */}
              <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                  borderBottom: '1px solid rgba(162, 123, 60, 0.12)',
                  paddingBottom: '20px'
                }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', margin: '0 0 6px 0', fontFamily: 'Georgia', fontWeight: 600, color: '#2E251E' }}>
                      {isAddingBlog ? 'Create New Article' : `Edit Article parameters: ${selectedBlogId}`}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(46, 37, 30, 0.55)', margin: 0 }}>Configure titles, excerpts, body paragraphs lists, and translations.</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(46, 37, 30, 0.75)', fontWeight: 600 }}>Edit Language:</span>
                    <select
                      value={selectedLang}
                      onChange={(e) => setSelectedLang(e.target.value as LanguageCode)}
                      style={{
                        padding: '10px 16px',
                        background: '#FFFFFF',
                        border: '1px solid rgba(162, 123, 60, 0.25)',
                        borderRadius: '8px',
                        color: '#2E251E',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {LANGUAGES.map(l => (
                        <option key={l.code} value={l.code}>
                          {l.flag} {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '32px' }}>
                  
                  {/* Inputs Fields Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(46, 37, 30, 0.65)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Article Slug ID (e.g. kaima-rice-heritage)
                      </label>
                      <input
                        type="text"
                        disabled={!isAddingBlog}
                        value={blogDraft.id}
                        onChange={(e) => setBlogDraft(prev => ({ ...prev, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                        placeholder="e.g. new-farming-methods"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#FFFFFF',
                          border: '1px solid rgba(162, 123, 60, 0.2)',
                          borderRadius: '6px',
                          color: isAddingBlog ? '#2E251E' : 'rgba(46, 37, 30, 0.45)',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(46, 37, 30, 0.65)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Article Title
                      </label>
                      <input
                        type="text"
                        value={blogDraft.title}
                        onChange={(e) => setBlogDraft(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. The Sustainable Future of Rice..."
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#FFFFFF',
                          border: '1px solid rgba(162, 123, 60, 0.2)',
                          borderRadius: '6px',
                          color: '#2E251E',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(46, 37, 30, 0.65)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Category
                        </label>
                        <input
                          type="text"
                          value={blogDraft.category}
                          onChange={(e) => setBlogDraft(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="e.g. Farming"
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: '#FFFFFF',
                            border: '1px solid rgba(162, 123, 60, 0.2)',
                            borderRadius: '6px',
                            color: '#2E251E',
                            fontSize: '0.85rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(46, 37, 30, 0.65)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Read Time
                        </label>
                        <input
                          type="text"
                          value={blogDraft.readTime}
                          onChange={(e) => setBlogDraft(prev => ({ ...prev, readTime: e.target.value }))}
                          placeholder="e.g. 5 min read"
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: '#FFFFFF',
                            border: '1px solid rgba(162, 123, 60, 0.2)',
                            borderRadius: '6px',
                            color: '#2E251E',
                            fontSize: '0.85rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(46, 37, 30, 0.65)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Publication Date
                        </label>
                        <input
                          type="text"
                          value={blogDraft.date}
                          onChange={(e) => setBlogDraft(prev => ({ ...prev, date: e.target.value }))}
                          placeholder="e.g. November 2026"
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: '#FFFFFF',
                            border: '1px solid rgba(162, 123, 60, 0.2)',
                            borderRadius: '6px',
                            color: '#2E251E',
                            fontSize: '0.85rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(46, 37, 30, 0.65)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Excerpt / Summary
                      </label>
                      <textarea
                        rows={3}
                        value={blogDraft.excerpt}
                        onChange={(e) => setBlogDraft(prev => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="Brief summary snippet..."
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#FFFFFF',
                          border: '1px solid rgba(162, 123, 60, 0.2)',
                          borderRadius: '6px',
                          color: '#2E251E',
                          fontSize: '0.85rem',
                          outline: 'none',
                          lineHeight: 1.5,
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    {/* Paragraph list array editor */}
                    <div style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(162, 123, 60, 0.08)',
                      padding: '20px',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#A27B3C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Body Paragraphs</span>
                        <button
                          onClick={() => setBlogDraft(prev => ({ ...prev, body: [...prev.body, ''] }))}
                          style={{
                            background: 'rgba(162, 123, 60, 0.08)',
                            border: '1px solid rgba(162, 123, 60, 0.25)',
                            color: '#A27B3C',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          + Add Paragraph
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {blogDraft.body.map((para, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <span style={{
                              width: '24px',
                              height: '24px',
                              background: 'rgba(162, 123, 60, 0.06)',
                              border: '1px solid rgba(162, 123, 60, 0.15)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              color: 'rgba(46, 37, 30, 0.5)',
                              marginTop: '8px',
                              flexShrink: 0
                            }}>{idx + 1}</span>
                            <textarea
                              rows={4}
                              value={para}
                              onChange={(e) => {
                                const list = [...blogDraft.body];
                                list[idx] = e.target.value;
                                setBlogDraft(prev => ({ ...prev, body: list }));
                              }}
                              placeholder="Type paragraph text content..."
                              style={{
                                flex: 1,
                                padding: '10px 14px',
                                background: '#FFFFFF',
                                border: '1px solid rgba(162, 123, 60, 0.2)',
                                borderRadius: '6px',
                                color: '#2E251E',
                                fontSize: '0.85rem',
                                outline: 'none',
                                lineHeight: 1.5,
                                resize: 'vertical'
                              }}
                            />
                            <button
                              onClick={() => {
                                const list = blogDraft.body.filter((_, i) => i !== idx);
                                setBlogDraft(prev => ({ ...prev, body: list }));
                              }}
                              style={{
                                background: 'rgba(220, 53, 69, 0.05)',
                                border: '1px solid rgba(220, 53, 69, 0.25)',
                                color: '#DC3545',
                                width: '32px',
                                height: '32px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: '4px'
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Sidebar Cover Image preview & actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    <div style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(162, 123, 60, 0.08)',
                      borderRadius: '10px',
                      padding: '20px'
                    }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(46, 37, 30, 0.65)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Cover Visual Image
                      </label>
                      
                      <div style={{
                        height: '160px',
                        background: '#F9F6F2',
                        border: '1px solid rgba(162, 123, 60, 0.12)',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={blogDraft.image_url}
                          alt="Cover view"
                          style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.src = '/images/blog-images.png';
                          }}
                        />
                      </div>

                      <input
                        type="text"
                        value={blogDraft.image_url}
                        onChange={(e) => setBlogDraft(prev => ({ ...prev, image_url: e.target.value }))}
                        placeholder="Image asset public path..."
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          background: '#FFFFFF',
                          border: '1px solid rgba(162, 123, 60, 0.2)',
                          borderRadius: '6px',
                          color: '#2E251E',
                          fontSize: '0.8rem',
                          outline: 'none',
                          marginBottom: '12px'
                        }}
                      />

                      <div style={{ position: 'relative' }}>
                        <button style={{
                          width: '100%',
                          padding: '10px',
                          background: 'rgba(162, 123, 60, 0.08)',
                          border: '1px solid rgba(162, 123, 60, 0.2)',
                          borderRadius: '6px',
                          color: '#A27B3C',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}>
                          {uploadingFile ? 'Uploading file...' : 'Upload Image'}
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingFile}
                          onChange={(e) => uploadFile(e, 'blog')}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0,
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button
                        onClick={saveBlog}
                        disabled={saving}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'linear-gradient(135deg, #C5A059 0%, #A27B3C 100%)',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          cursor: saving ? 'not-allowed' : 'pointer',
                          fontSize: '0.85rem',
                          boxShadow: '0 4px 15px rgba(162, 123, 60, 0.2)'
                        }}
                      >
                        {saving ? 'Saving...' : 'Save Article'}
                      </button>

                      {!isAddingBlog && selectedBlogId && (
                        <button
                          onClick={() => deleteBlog(selectedBlogId)}
                          disabled={saving}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: 'transparent',
                            border: '1px solid rgba(220, 53, 69, 0.35)',
                            borderRadius: '6px',
                            color: '#DC3545',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: saving ? 'not-allowed' : 'pointer'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(220, 53, 69, 0.05)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          Delete Article
                        </button>
                      )}
                    </div>

                  </div>

                </div>

              </div>
            </main>
          )}

        </div>

      </div>
    </div>
  );
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: 'general',
    name: 'General Settings',
    type: 'page',
    group: 'sections',
    prefixes: ['nav.', 'footer.']
  },
  {
    id: 'home',
    name: 'Home Page',
    type: 'page',
    group: 'sections',
    prefixes: ['hero.', 'founder.', 'globalReach.', 'whyArema.', 'products.', 'palakkad.', 'blog.', 'cta.'],
    seoKey: 'home'
  },
  {
    id: 'our-story',
    name: 'Our Story Page',
    type: 'page',
    group: 'sections',
    prefixes: ['ourStoryPage.'],
    seoKey: 'ourStory'
  },
  {
    id: 'why-arema',
    name: 'Why Choose Arema',
    type: 'page',
    group: 'sections',
    prefixes: ['whyAremaPage.'],
    seoKey: 'whyArema'
  },
  {
    id: 'products-catalog',
    name: 'Products Page Text',
    type: 'page',
    group: 'sections',
    prefixes: ['productsPage.', 'productDetail.'],
    seoKey: 'products'
  },
  {
    id: 'certs',
    name: 'Certificates Page',
    type: 'page',
    group: 'sections',
    prefixes: ['certsPage.'],
    seoKey: 'certificates'
  },
  {
    id: 'blog-page',
    name: 'Blog Catalog Page',
    type: 'page',
    group: 'sections',
    prefixes: ['blogPage.'],
    seoKey: 'blog'
  },
  {
    id: 'contact',
    name: 'Contact Page',
    type: 'page',
    group: 'sections',
    prefixes: ['contactPage.'],
    seoKey: 'contact'
  },
  {
    id: 'products-list',
    name: 'Product Catalog Entries',
    type: 'products',
    group: 'catalogs'
  },
  {
    id: 'blogs-list',
    name: 'Blog Articles Manager',
    type: 'blogs',
    group: 'catalogs'
  }
];
