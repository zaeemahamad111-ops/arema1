'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { en } from '@/i18n/locales/en';
import { LANGUAGES, LanguageCode } from '@/i18n/translations';

// Helper to flatten nested object
function flattenObject(obj: any, prefix = ''): Record<string, string> {
  const results: Record<string, string> = {};
  for (const k in obj) {
    if (prefix === '' && (k === 'productsData' || k === 'blogData')) {
      continue;
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

// Group definitions for page-wise editing
const PAGE_GROUPS = [
  { id: 'nav-footer', name: 'Navigation & Footer', prefixes: ['nav.', 'footer.'] },
  { id: 'home', name: 'Home Page', prefixes: ['hero.', 'founder.', 'globalReach.', 'whyArema.', 'products.', 'palakkad.', 'blog.', 'cta.'] },
  { id: 'our-story', name: 'Our Story Page', prefixes: ['ourStoryPage.'] },
  { id: 'why-arema', name: 'Why Choose Arema Page', prefixes: ['whyAremaPage.'] },
  { id: 'products-page', name: 'Products Catalog Page', prefixes: ['productsPage.', 'productDetail.'] },
  { id: 'certs', name: 'Certificates Page', prefixes: ['certsPage.'] },
  { id: 'blog-page', name: 'Blog Catalog Page', prefixes: ['blogPage.'] },
  { id: 'contact', name: 'Contact Page', prefixes: ['contactPage.'] },
];

export default function CMSClient() {
  const [activeTab, setActiveTab] = useState<'pages' | 'products' | 'blogs' | 'media'>('pages');
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('en');
  const [selectedPageGroup, setSelectedPageGroup] = useState(PAGE_GROUPS[0].id);

  // Database Data States
  const [siteTranslations, setSiteTranslations] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [productTranslations, setProductTranslations] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogTranslations, setBlogTranslations] = useState<any[]>([]);
  const [imageOverrides, setImageOverrides] = useState<any[]>([]);

  // Draft States
  const [draftTranslations, setDraftTranslations] = useState<Record<string, string>>({});
  
  // Active Product Editing State
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
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

  // Active Blog Editing State
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

  // Global variables & override draft states
  const [overrideDraft, setOverrideDraft] = useState({
    key: '',
    url: '',
  });

  // UI Status
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Load all data from Supabase
  const fetchData = async () => {
    setLoading(true);
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
        supabase.from('products').select('*'),
        supabase.from('product_translations').select('*'),
        supabase.from('blogs').select('*'),
        supabase.from('blog_translations').select('*'),
        supabase.from('image_overrides').select('*'),
      ]);

      if (trans) setSiteTranslations(trans);
      if (prods) {
        setProducts(prods);
        if (prods.length > 0 && !selectedProductId) {
          setSelectedProductId(prods[0].id);
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
      showStatus('Failed to retrieve content from Supabase. Verify connection settings.', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update page translation drafts when selected language or group changes
  useEffect(() => {
    const flatEn = flattenObject(en);
    const draft: Record<string, string> = {};

    // Get prefixes for active group
    const activeGroup = PAGE_GROUPS.find(g => g.id === selectedPageGroup);
    if (!activeGroup) return;

    Object.keys(flatEn).forEach(key => {
      const matchesGroup = activeGroup.prefixes.some(pfx => key.startsWith(pfx));
      if (matchesGroup) {
        // Find existing override in database
        const match = siteTranslations.find(t => t.key === key && t.lang === selectedLang);
        draft[key] = match ? match.value : '';
      }
    });

    setDraftTranslations(draft);
  }, [selectedLang, selectedPageGroup, siteTranslations]);

  // Load product draft when selected product or language changes
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

  // Load blog draft when selected blog or language changes
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
    }, 4000);
  };

  const handleLogout = async () => {
    await fetch('/api/cms-login', { method: 'DELETE' });
    window.location.reload();
  };

  // ── Pages Save Handler ───────────────────────────────────────────────
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

      showStatus('Translations saved successfully!');
      // Refetch to align states
      const { data: trans } = await supabase.from('site_translations').select('*');
      if (trans) setSiteTranslations(trans);
    } catch (err: any) {
      showStatus(`Error saving page translations: ${err.message}`, true);
    } finally {
      setSaving(false);
    }
  };

  // ── Products Save & Delete Handlers ──────────────────────────────────
  const saveProduct = async () => {
    if (!productDraft.id) {
      showStatus('Product ID (slug) is required.', true);
      return;
    }
    setSaving(true);
    try {
      // 1. Save base product row
      const { error: prodErr } = await supabase.from('products').upsert({
        id: productDraft.id,
        image_url: productDraft.image_url,
      }, { onConflict: 'id' });

      if (prodErr) throw prodErr;

      // 2. Save translation row
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

      showStatus('Product configurations saved successfully!');
      
      // Reset modes & reload database state
      setIsAddingProduct(false);
      setSelectedProductId(productDraft.id);
      await fetchData();
    } catch (err: any) {
      showStatus(`Error saving product: ${err.message}`, true);
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm(`Are you sure you want to delete the product "${id}"? This deletes all localized details too.`)) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      showStatus('Product deleted successfully.');
      setSelectedProductId(null);
      await fetchData();
    } catch (err: any) {
      showStatus(`Error deleting product: ${err.message}`, true);
    } finally {
      setSaving(false);
    }
  };

  // ── Blogs Save & Delete Handlers ─────────────────────────────────────
  const saveBlog = async () => {
    if (!blogDraft.id) {
      showStatus('Blog ID (slug) is required.', true);
      return;
    }
    setSaving(true);
    try {
      // 1. Save base blog row
      const { error: blogErr } = await supabase.from('blogs').upsert({
        id: blogDraft.id,
        image_url: blogDraft.image_url,
      }, { onConflict: 'id' });

      if (blogErr) throw blogErr;

      // 2. Save translation row
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

      showStatus('Blog post configurations saved successfully!');

      setIsAddingBlog(false);
      setSelectedBlogId(blogDraft.id);
      await fetchData();
    } catch (err: any) {
      showStatus(`Error saving blog post: ${err.message}`, true);
    } finally {
      setSaving(false);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm(`Are you sure you want to delete the blog post "${id}"?`)) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) throw error;
      showStatus('Blog post deleted successfully.');
      setSelectedBlogId(null);
      await fetchData();
    } catch (err: any) {
      showStatus(`Error deleting blog post: ${err.message}`, true);
    } finally {
      setSaving(false);
    }
  };

  // ── Media Upload & Override Handlers ─────────────────────────────────
  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'blog' | 'global') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `cms/${fileName}`;

      // Upload to cms-media bucket
      const { error: uploadErr } = await supabase.storage
        .from('cms-media')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadErr) {
        throw new Error(`Upload error: ${uploadErr.message}. Make sure the bucket "cms-media" exists and is public.`);
      }

      // Resolve public URL
      const { data } = supabase.storage.from('cms-media').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      if (target === 'product') {
        setProductDraft(prev => ({ ...prev, image_url: publicUrl }));
      } else if (target === 'blog') {
        setBlogDraft(prev => ({ ...prev, image_url: publicUrl }));
      } else if (target === 'global') {
        setOverrideDraft(prev => ({ ...prev, url: publicUrl }));
      }

      showStatus('File uploaded and path resolved successfully!');
    } catch (err: any) {
      showStatus(`File upload failed: ${err.message}`, true);
    } finally {
      setUploadingFile(false);
    }
  };

  const saveImageOverride = async () => {
    if (!overrideDraft.key || !overrideDraft.url) {
      showStatus('Both override Key and URL / Value are required.', true);
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from('image_overrides').upsert({
        key: overrideDraft.key,
        url: overrideDraft.url,
      }, { onConflict: 'key' });

      if (error) throw error;
      showStatus(`Setting override for "${overrideDraft.key}" saved!`);
      setOverrideDraft({ key: '', url: '' });
      await fetchData();
    } catch (err: any) {
      showStatus(`Error saving override: ${err.message}`, true);
    } finally {
      setSaving(false);
    }
  };

  const deleteImageOverride = async (key: string) => {
    if (!confirm(`Remove the override for "${key}"?`)) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('image_overrides').delete().eq('key', key);
      if (error) throw error;
      showStatus(`Override for "${key}" removed.`);
      await fetchData();
    } catch (err: any) {
      showStatus(`Error removing override: ${err.message}`, true);
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
        background: '#0F0A07',
        color: '#F4EFEA',
        fontFamily: 'var(--font-body, system-ui)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(219, 187, 160, 0.1)',
            borderTopColor: '#C5A059',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px auto'
          }} />
          <p style={{ fontSize: '0.9rem', color: 'rgba(244, 239, 234, 0.6)' }}>Connecting to Supabase...</p>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes spin { to { transform: rotate(360deg); } }
          `}} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0F0A07',
      color: '#F4EFEA',
      fontFamily: 'var(--font-body, system-ui)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* ── TOP HEADER ────────────────────────────────────────────────── */}
      <header style={{
        padding: '16px 32px',
        background: 'rgba(25, 20, 16, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(219, 187, 160, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontFamily: 'var(--font-display, Georgia)',
            fontSize: '1.4rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#F4EFEA'
          }}>
            AREMA <span style={{ color: '#D4AF37', fontWeight: 300 }}>CMS</span>
          </span>
          <span style={{
            fontSize: '0.65rem',
            background: 'rgba(212, 175, 55, 0.1)',
            color: '#D4AF37',
            padding: '2px 8px',
            borderRadius: '10px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>v1.0</span>
        </div>

        {/* Tab Controls */}
        <nav style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'pages', label: 'Pages Text' },
            { id: 'products', label: 'Product Catalog' },
            { id: 'blogs', label: 'Blog Posts' },
            { id: 'media', label: 'Media & Settings' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '8px 16px',
                background: activeTab === tab.id ? 'rgba(219, 187, 160, 0.1)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                color: activeTab === tab.id ? '#D4AF37' : 'rgba(244, 239, 234, 0.6)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div>
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 12px',
              background: 'transparent',
              border: '1px solid rgba(220, 53, 69, 0.3)',
              borderRadius: '6px',
              color: '#EA868F',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(220, 53, 69, 0.08)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Status Overlay Message */}
      {statusMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: statusMessage.error ? '#5c191e' : '#1e4620',
          border: `1px solid ${statusMessage.error ? '#EA868F' : '#75b798'}`,
          color: statusMessage.error ? '#F8D7DA' : '#D1E7DD',
          padding: '16px 24px',
          borderRadius: '8px',
          fontSize: '0.9rem',
          zIndex: 1000,
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          maxWidth: '400px'
        }}>
          {statusMessage.text}
        </div>
      )}

      {/* Main Grid Panel */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* ─── TAB 1: PAGES TEXT EDITOR ──────────────────────────────── */}
        {activeTab === 'pages' && (
          <>
            {/* Sidebar */}
            <aside style={{
              width: '280px',
              borderRight: '1px solid rgba(219, 187, 160, 0.08)',
              background: 'rgba(20, 15, 12, 0.3)',
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(244, 239, 234, 0.4)', marginBottom: '12px', paddingLeft: '8px', fontWeight: 600 }}>Sections</div>
              {PAGE_GROUPS.map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedPageGroup(g.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    background: selectedPageGroup === g.id ? 'rgba(219, 187, 160, 0.06)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: selectedPageGroup === g.id ? '#D4AF37' : 'rgba(244, 239, 234, 0.7)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {g.name}
                </button>
              ))}
            </aside>

            {/* Main Fields Form */}
            <main style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(219, 187, 160, 0.08)', paddingBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px 0', fontFamily: 'var(--font-display, Georgia)', fontWeight: 600 }}>
                    {PAGE_GROUPS.find(g => g.id === selectedPageGroup)?.name}
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(244, 239, 234, 0.4)', margin: 0 }}>Configure override texts. Empty fields will automatically fall back to baseline English translations.</p>
                </div>
                
                {/* Language Picker Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'rgba(244, 239, 234, 0.6)', fontWeight: 600 }}>Language:</label>
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value as LanguageCode)}
                    style={{
                      padding: '8px 16px',
                      background: '#1A130E',
                      border: '1px solid rgba(219, 187, 160, 0.2)',
                      borderRadius: '6px',
                      color: '#F4EFEA',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      outline: 'none'
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

              {/* Form Fields list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                {Object.keys(draftTranslations).length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'rgba(244, 239, 234, 0.3)', padding: '40px 0' }}>No keys match this section.</div>
                ) : (
                  Object.keys(draftTranslations).sort().map(key => {
                    const baselineValue = flattenObject(en)[key] || '';
                    const isArray = baselineValue.startsWith('[') || baselineValue.startsWith('{');

                    return (
                      <div key={key} style={{
                        background: 'rgba(255, 255, 255, 0.01)',
                        border: '1px solid rgba(219, 187, 160, 0.04)',
                        padding: '20px',
                        borderRadius: '10px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{key}</span>
                          {isArray && (
                            <span style={{
                              fontSize: '0.65rem',
                              background: 'rgba(0, 123, 255, 0.1)',
                              color: '#6ea8fe',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontWeight: 600
                            }}>JSON Array</span>
                          )}
                        </div>

                        {/* Baseline display */}
                        <div style={{
                          fontSize: '0.8rem',
                          background: 'rgba(0, 0, 0, 0.15)',
                          padding: '10px 14px',
                          borderRadius: '6px',
                          color: 'rgba(244, 239, 234, 0.5)',
                          marginBottom: '12px',
                          borderLeft: '2px solid rgba(219, 187, 160, 0.2)'
                        }}>
                          <strong>English Baseline:</strong> {baselineValue}
                        </div>

                        {/* Input Area */}
                        <textarea
                          rows={isArray ? 5 : 2}
                          value={draftTranslations[key]}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDraftTranslations(prev => ({ ...prev, [key]: val }));
                          }}
                          placeholder={isArray ? '[ "Highlight 1", "Highlight 2" ]' : `Enter ${LANGUAGES.find(l => l.code === selectedLang)?.name} translation...`}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: '#0a0705',
                            border: '1px solid rgba(219, 187, 160, 0.12)',
                            borderRadius: '6px',
                            color: '#F4EFEA',
                            fontSize: '0.85rem',
                            lineHeight: 1.5,
                            outline: 'none',
                            fontFamily: isArray ? 'monospace' : 'inherit',
                            resize: 'vertical',
                            transition: 'border-color 0.2s'
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'rgba(219, 187, 160, 0.4)'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(219, 187, 160, 0.12)'}
                        />
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom Sticky Action Bar */}
              <div style={{
                position: 'sticky',
                bottom: 0,
                background: '#0F0A07',
                padding: '24px 0 0 0',
                marginTop: '32px',
                borderTop: '1px solid rgba(219, 187, 160, 0.08)',
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={savePageTranslations}
                  disabled={saving}
                  style={{
                    padding: '12px 28px',
                    background: 'linear-gradient(135deg, #C5A059 0%, #A27B3C 100%)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#0F0A07',
                    fontWeight: 700,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '0.85rem',
                    boxShadow: '0 4px 15px rgba(162, 123, 60, 0.2)'
                  }}
                >
                  {saving ? 'Saving...' : 'Save Page Translations'}
                </button>
              </div>
            </main>
          </>
        )}

        {/* ─── TAB 2: PRODUCT CRUD MANAGER ───────────────────────────── */}
        {activeTab === 'products' && (
          <>
            {/* Sidebar list */}
            <aside style={{
              width: '280px',
              borderRight: '1px solid rgba(219, 187, 160, 0.08)',
              background: 'rgba(20, 15, 12, 0.3)',
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(244, 239, 234, 0.4)', marginBottom: '12px', paddingLeft: '8px', fontWeight: 600 }}>Products</div>
                {products.map(p => {
                  const details = productTranslations.find(pt => pt.product_id === p.id && pt.lang === 'en');
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setIsAddingProduct(false);
                        setSelectedProductId(p.id);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 12px',
                        background: (!isAddingProduct && selectedProductId === p.id) ? 'rgba(219, 187, 160, 0.06)' : 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        color: (!isAddingProduct && selectedProductId === p.id) ? '#D4AF37' : 'rgba(244, 239, 234, 0.7)',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{details?.name || p.id}</span>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(244, 239, 234, 0.4)' }}>{p.id}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setIsAddingProduct(true);
                  setSelectedProductId(null);
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
                  background: 'rgba(219, 187, 160, 0.05)',
                  border: '1px dashed rgba(219, 187, 160, 0.3)',
                  borderRadius: '8px',
                  color: '#D4AF37',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'center',
                  marginTop: '16px'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(219, 187, 160, 0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(219, 187, 160, 0.05)'}
              >
                + Add New Product
              </button>
            </aside>

            {/* Main Editing Area */}
            <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(219, 187, 160, 0.08)', paddingBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px 0', fontFamily: 'var(--font-display, Georgia)', fontWeight: 600 }}>
                    {isAddingProduct ? 'Add New Product Catalog Entry' : `Configure Product: ${selectedProductId}`}
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(244, 239, 234, 0.4)', margin: 0 }}>Configure images, labels, categories, and technical parameters.</p>
                </div>
                
                {/* Language Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'rgba(244, 239, 234, 0.6)', fontWeight: 600 }}>Language:</label>
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value as LanguageCode)}
                    style={{
                      padding: '8px 16px',
                      background: '#1A130E',
                      border: '1px solid rgba(219, 187, 160, 0.2)',
                      borderRadius: '6px',
                      color: '#F4EFEA',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      outline: 'none'
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

              {/* Form Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '32px' }}>
                
                {/* Inputs Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Slug / Product ID */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(244, 239, 234, 0.6)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Product Slug / ID (e.g. kuruva-rice)
                    </label>
                    <input
                      type="text"
                      disabled={!isAddingProduct}
                      value={productDraft.id}
                      onChange={(e) => setProductDraft(prev => ({ ...prev, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#0a0705',
                        border: '1px solid rgba(219, 187, 160, 0.12)',
                        borderRadius: '6px',
                        color: isAddingProduct ? '#F4EFEA' : 'rgba(244, 239, 234, 0.4)',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                      placeholder="e.g. premium-matta"
                    />
                  </div>

                  {/* Name & Category Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(244, 239, 234, 0.6)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={productDraft.name}
                        onChange={(e) => setProductDraft(prev => ({ ...prev, name: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#0a0705',
                          border: '1px solid rgba(219, 187, 160, 0.12)',
                          borderRadius: '6px',
                          color: '#F4EFEA',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                        placeholder="e.g. Palakkad Matta Rice"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(244, 239, 234, 0.6)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Category
                      </label>
                      <input
                        type="text"
                        value={productDraft.category}
                        onChange={(e) => setProductDraft(prev => ({ ...prev, category: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#0a0705',
                          border: '1px solid rgba(219, 187, 160, 0.12)',
                          borderRadius: '6px',
                          color: '#F4EFEA',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                        placeholder="e.g. Kerala Heritage"
                      />
                    </div>
                  </div>

                  {/* Tagline */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(244, 239, 234, 0.6)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Tagline / Brief Description
                    </label>
                    <input
                      type="text"
                      value={productDraft.tagline}
                      onChange={(e) => setProductDraft(prev => ({ ...prev, tagline: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#0a0705',
                        border: '1px solid rgba(219, 187, 160, 0.12)',
                        borderRadius: '6px',
                        color: '#F4EFEA',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                      placeholder="The nutrient-dense red-bran heritage grain."
                    />
                  </div>

                  {/* Full Description */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(244, 239, 234, 0.6)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Full Description
                    </label>
                    <textarea
                      rows={5}
                      value={productDraft.description}
                      onChange={(e) => setProductDraft(prev => ({ ...prev, description: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#0a0705',
                        border: '1px solid rgba(219, 187, 160, 0.12)',
                        borderRadius: '6px',
                        color: '#F4EFEA',
                        fontSize: '0.85rem',
                        outline: 'none',
                        lineHeight: 1.5,
                        resize: 'vertical'
                      }}
                      placeholder="Detailed product story..."
                    />
                  </div>

                  {/* Highlights editor */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid rgba(219, 187, 160, 0.05)',
                    padding: '20px',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Highlights</span>
                      <button
                        onClick={() => setProductDraft(prev => ({ ...prev, highlights: [...prev.highlights, ''] }))}
                        style={{
                          background: 'rgba(219, 187, 160, 0.1)',
                          border: '1px solid rgba(219, 187, 160, 0.2)',
                          color: '#D4AF37',
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
                      {productDraft.highlights.map((h, index) => (
                        <div key={index} style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            value={h}
                            onChange={(e) => {
                              const list = [...productDraft.highlights];
                              list[index] = e.target.value;
                              setProductDraft(prev => ({ ...prev, highlights: list }));
                            }}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              background: '#0a0705',
                              border: '1px solid rgba(219, 187, 160, 0.12)',
                              borderRadius: '4px',
                              color: '#F4EFEA',
                              fontSize: '0.8rem',
                              outline: 'none'
                            }}
                            placeholder="e.g. High in dietary fiber"
                          />
                          <button
                            onClick={() => {
                              const list = productDraft.highlights.filter((_, idx) => idx !== index);
                              setProductDraft(prev => ({ ...prev, highlights: list }));
                            }}
                            style={{
                              background: 'rgba(220, 53, 69, 0.08)',
                              border: '1px solid rgba(220, 53, 69, 0.2)',
                              color: '#EA868F',
                              width: '34px',
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

                  {/* Specifications editor */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid rgba(219, 187, 160, 0.05)',
                    padding: '20px',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Technical Specifications</span>
                      <button
                        onClick={() => setProductDraft(prev => ({ ...prev, specs: [...prev.specs, { label: '', value: '' }] }))}
                        style={{
                          background: 'rgba(219, 187, 160, 0.1)',
                          border: '1px solid rgba(219, 187, 160, 0.2)',
                          color: '#D4AF37',
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
                      {productDraft.specs.map((s, index) => (
                        <div key={index} style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            value={s.label}
                            onChange={(e) => {
                              const list = [...productDraft.specs];
                              list[index] = { ...list[index], label: e.target.value };
                              setProductDraft(prev => ({ ...prev, specs: list }));
                            }}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              background: '#0a0705',
                              border: '1px solid rgba(219, 187, 160, 0.12)',
                              borderRadius: '4px',
                              color: '#F4EFEA',
                              fontSize: '0.8rem',
                              outline: 'none'
                            }}
                            placeholder="Label (e.g. Moisture)"
                          />
                          <input
                            type="text"
                            value={s.value}
                            onChange={(e) => {
                              const list = [...productDraft.specs];
                              list[index] = { ...list[index], value: e.target.value };
                              setProductDraft(prev => ({ ...prev, specs: list }));
                            }}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              background: '#0a0705',
                              border: '1px solid rgba(219, 187, 160, 0.12)',
                              borderRadius: '4px',
                              color: '#F4EFEA',
                              fontSize: '0.8rem',
                              outline: 'none'
                            }}
                            placeholder="Value (e.g. Max 13.5%)"
                          />
                          <button
                            onClick={() => {
                              const list = productDraft.specs.filter((_, idx) => idx !== index);
                              setProductDraft(prev => ({ ...prev, specs: list }));
                            }}
                            style={{
                              background: 'rgba(220, 53, 69, 0.08)',
                              border: '1px solid rgba(220, 53, 69, 0.2)',
                              color: '#EA868F',
                              width: '34px',
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

                {/* Media & Action Sidebar Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Image Preview & Config */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid rgba(219, 187, 160, 0.08)',
                    borderRadius: '10px',
                    padding: '20px'
                  }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(244, 239, 234, 0.6)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Product Image
                    </label>
                    <div style={{
                      height: '220px',
                      background: 'radial-gradient(circle at center, #261D15 0%, #0a0705 100%)',
                      border: '1px solid rgba(219, 187, 160, 0.1)',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <img
                        src={productDraft.image_url}
                        alt="Product bag preview"
                        style={{
                          maxHeight: '100%',
                          maxWidth: '100%',
                          objectFit: 'contain',
                          padding: '16px'
                        }}
                        onError={(e) => {
                          e.currentTarget.src = '/images/product-bag-nobg.png';
                        }}
                      />
                    </div>

                    <input
                      type="text"
                      value={productDraft.image_url}
                      onChange={(e) => setProductDraft(prev => ({ ...prev, image_url: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: '#0a0705',
                        border: '1px solid rgba(219, 187, 160, 0.12)',
                        borderRadius: '4px',
                        color: '#F4EFEA',
                        fontSize: '0.8rem',
                        outline: 'none',
                        marginBottom: '12px'
                      }}
                      placeholder="Image URL"
                    />

                    {/* Image Upload Input */}
                    <div style={{ position: 'relative' }}>
                      <button style={{
                        width: '100%',
                        padding: '10px',
                        background: 'rgba(219, 187, 160, 0.08)',
                        border: '1px solid rgba(219, 187, 160, 0.2)',
                        borderRadius: '6px',
                        color: '#D4AF37',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}>
                        {uploadingFile ? 'Uploading Asset...' : 'Upload Image'}
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

                  {/* Save and Delete Actions */}
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
                        color: '#0F0A07',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: saving ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 15px rgba(162, 123, 60, 0.2)'
                      }}
                    >
                      {saving ? 'Saving...' : 'Save Product'}
                    </button>

                    {!isAddingProduct && selectedProductId && (
                      <button
                        onClick={() => deleteProduct(selectedProductId)}
                        disabled={saving}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'transparent',
                          border: '1px solid rgba(220, 53, 69, 0.3)',
                          borderRadius: '6px',
                          color: '#EA868F',
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
            </main>
          </>
        )}

        {/* ─── TAB 3: BLOG CRUD MANAGER ──────────────────────────────── */}
        {activeTab === 'blogs' && (
          <>
            {/* Sidebar list */}
            <aside style={{
              width: '280px',
              borderRight: '1px solid rgba(219, 187, 160, 0.08)',
              background: 'rgba(20, 15, 12, 0.3)',
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(244, 239, 234, 0.4)', marginBottom: '12px', paddingLeft: '8px', fontWeight: 600 }}>Articles</div>
                {blogs.map(b => {
                  const details = blogTranslations.find(bt => bt.blog_id === b.id && bt.lang === 'en');
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
                        background: (!isAddingBlog && selectedBlogId === b.id) ? 'rgba(219, 187, 160, 0.06)' : 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        color: (!isAddingBlog && selectedBlogId === b.id) ? '#D4AF37' : 'rgba(244, 239, 234, 0.7)',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{details?.title || b.id}</span>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(244, 239, 234, 0.4)' }}>{b.id}</span>
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
                  background: 'rgba(219, 187, 160, 0.05)',
                  border: '1px dashed rgba(219, 187, 160, 0.3)',
                  borderRadius: '8px',
                  color: '#D4AF37',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'center',
                  marginTop: '16px'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(219, 187, 160, 0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(219, 187, 160, 0.05)'}
              >
                + Add New Blog
              </button>
            </aside>

            {/* Main Editing Area */}
            <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(219, 187, 160, 0.08)', paddingBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px 0', fontFamily: 'var(--font-display, Georgia)', fontWeight: 600 }}>
                    {isAddingBlog ? 'Create New Blog Post' : `Configure Blog: ${selectedBlogId}`}
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(244, 239, 234, 0.4)', margin: 0 }}>Configure post title, excerpt, metadata and body paragraphs.</p>
                </div>

                {/* Language Picker */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'rgba(244, 239, 234, 0.6)', fontWeight: 600 }}>Language:</label>
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value as LanguageCode)}
                    style={{
                      padding: '8px 16px',
                      background: '#1A130E',
                      border: '1px solid rgba(219, 187, 160, 0.2)',
                      borderRadius: '6px',
                      color: '#F4EFEA',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      outline: 'none'
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

              {/* Form Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '32px' }}>
                
                {/* Inputs Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Slug / Blog ID */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(244, 239, 234, 0.6)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Blog Slug / ID (e.g. kerala-farming-trends)
                    </label>
                    <input
                      type="text"
                      disabled={!isAddingBlog}
                      value={blogDraft.id}
                      onChange={(e) => setBlogDraft(prev => ({ ...prev, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#0a0705',
                        border: '1px solid rgba(219, 187, 160, 0.12)',
                        borderRadius: '6px',
                        color: isAddingBlog ? '#F4EFEA' : 'rgba(244, 239, 234, 0.4)',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                      placeholder="e.g. new-heritage-standards"
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(244, 239, 234, 0.6)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Article Title
                    </label>
                    <input
                      type="text"
                      value={blogDraft.title}
                      onChange={(e) => setBlogDraft(prev => ({ ...prev, title: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#0a0705',
                        border: '1px solid rgba(219, 187, 160, 0.12)',
                        borderRadius: '6px',
                        color: '#F4EFEA',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                      placeholder="The Farmers Behind Every Arema Grain"
                    />
                  </div>

                  {/* Category, readTime, date Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(244, 239, 234, 0.6)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Category
                      </label>
                      <input
                        type="text"
                        value={blogDraft.category}
                        onChange={(e) => setBlogDraft(prev => ({ ...prev, category: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#0a0705',
                          border: '1px solid rgba(219, 187, 160, 0.12)',
                          borderRadius: '6px',
                          color: '#F4EFEA',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                        placeholder="e.g. Farming"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(244, 239, 234, 0.6)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Read Time
                      </label>
                      <input
                        type="text"
                        value={blogDraft.readTime}
                        onChange={(e) => setBlogDraft(prev => ({ ...prev, readTime: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#0a0705',
                          border: '1px solid rgba(219, 187, 160, 0.12)',
                          borderRadius: '6px',
                          color: '#F4EFEA',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                        placeholder="e.g. 5 min read"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(244, 239, 234, 0.6)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Publication Date
                      </label>
                      <input
                        type="text"
                        value={blogDraft.date}
                        onChange={(e) => setBlogDraft(prev => ({ ...prev, date: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#0a0705',
                          border: '1px solid rgba(219, 187, 160, 0.12)',
                          borderRadius: '6px',
                          color: '#F4EFEA',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                        placeholder="e.g. June 2026"
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(244, 239, 234, 0.6)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Excerpt / Summary
                    </label>
                    <textarea
                      rows={3}
                      value={blogDraft.excerpt}
                      onChange={(e) => setBlogDraft(prev => ({ ...prev, excerpt: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#0a0705',
                        border: '1px solid rgba(219, 187, 160, 0.12)',
                        borderRadius: '6px',
                        color: '#F4EFEA',
                        fontSize: '0.85rem',
                        outline: 'none',
                        lineHeight: 1.5,
                        resize: 'vertical'
                      }}
                      placeholder="Brief article introduction..."
                    />
                  </div>

                  {/* Body paragraphs list */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid rgba(219, 187, 160, 0.05)',
                    padding: '20px',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Body Paragraphs</span>
                      <button
                        onClick={() => setBlogDraft(prev => ({ ...prev, body: [...prev.body, ''] }))}
                        style={{
                          background: 'rgba(219, 187, 160, 0.1)',
                          border: '1px solid rgba(219, 187, 160, 0.2)',
                          color: '#D4AF37',
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
                      {blogDraft.body.map((para, index) => (
                        <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <span style={{
                            width: '24px',
                            height: '24px',
                            background: 'rgba(219, 187, 160, 0.06)',
                            border: '1px solid rgba(219, 187, 160, 0.1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            color: 'rgba(244, 239, 234, 0.5)',
                            marginTop: '8px',
                            flexShrink: 0
                          }}>{index + 1}</span>
                          <textarea
                            rows={4}
                            value={para}
                            onChange={(e) => {
                              const list = [...blogDraft.body];
                              list[index] = e.target.value;
                              setBlogDraft(prev => ({ ...prev, body: list }));
                            }}
                            style={{
                              flex: 1,
                              padding: '10px 14px',
                              background: '#0a0705',
                              border: '1px solid rgba(219, 187, 160, 0.12)',
                              borderRadius: '6px',
                              color: '#F4EFEA',
                              fontSize: '0.85rem',
                              outline: 'none',
                              lineHeight: 1.5,
                              resize: 'vertical'
                            }}
                            placeholder="Paragraph content..."
                          />
                          <button
                            onClick={() => {
                              const list = blogDraft.body.filter((_, idx) => idx !== index);
                              setBlogDraft(prev => ({ ...prev, body: list }));
                            }}
                            style={{
                              background: 'rgba(220, 53, 69, 0.08)',
                              border: '1px solid rgba(220, 53, 69, 0.2)',
                              color: '#EA868F',
                              width: '34px',
                              height: '34px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginTop: '4px',
                              flexShrink: 0
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Media & Action Sidebar Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Image preview & upload */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid rgba(219, 187, 160, 0.08)',
                    borderRadius: '10px',
                    padding: '20px'
                  }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(244, 239, 234, 0.6)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Article Cover Image
                    </label>
                    <div style={{
                      height: '180px',
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid rgba(219, 187, 160, 0.1)',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <img
                        src={blogDraft.image_url}
                        alt="Blog cover preview"
                        style={{
                          height: '100%',
                          width: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.currentTarget.src = '/images/blog-images.png';
                        }}
                      />
                    </div>

                    <input
                      type="text"
                      value={blogDraft.image_url}
                      onChange={(e) => setBlogDraft(prev => ({ ...prev, image_url: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: '#0a0705',
                        border: '1px solid rgba(219, 187, 160, 0.12)',
                        borderRadius: '4px',
                        color: '#F4EFEA',
                        fontSize: '0.8rem',
                        outline: 'none',
                        marginBottom: '12px'
                      }}
                      placeholder="Image URL"
                    />

                    {/* Image Upload Input */}
                    <div style={{ position: 'relative' }}>
                      <button style={{
                        width: '100%',
                        padding: '10px',
                        background: 'rgba(219, 187, 160, 0.08)',
                        border: '1px solid rgba(219, 187, 160, 0.2)',
                        borderRadius: '6px',
                        color: '#D4AF37',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}>
                        {uploadingFile ? 'Uploading Asset...' : 'Upload Image'}
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

                  {/* Save and Delete Actions */}
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
                        color: '#0F0A07',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: saving ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 15px rgba(162, 123, 60, 0.2)'
                      }}
                    >
                      {saving ? 'Saving...' : 'Save Blog Post'}
                    </button>

                    {!isAddingBlog && selectedBlogId && (
                      <button
                        onClick={() => deleteBlog(selectedBlogId)}
                        disabled={saving}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'transparent',
                          border: '1px solid rgba(220, 53, 69, 0.3)',
                          borderRadius: '6px',
                          color: '#EA868F',
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
            </main>
          </>
        )}

        {/* ─── TAB 4: MEDIA & OVERRIDES SETTINGS ─────────────────────── */}
        {activeTab === 'media' && (
          <main style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px 0', fontFamily: 'var(--font-display, Georgia)', fontWeight: 600 }}>Media & Global Variable Configurations</h2>
              <p style={{ fontSize: '0.8rem', color: 'rgba(244, 239, 234, 0.4)', margin: 0 }}>Configure dynamic logo replacements, WhatsApp phone links, background videos, or upload general website assets.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
              
              {/* Left Column: Overrides Form & Upload */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Upload Section */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.01)',
                  border: '1px solid rgba(219, 187, 160, 0.08)',
                  borderRadius: '12px',
                  padding: '24px'
                }}>
                  <h3 style={{ fontSize: '1rem', color: '#D4AF37', margin: '0 0 8px 0', fontWeight: 600 }}>Upload Media Asset</h3>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(244, 239, 234, 0.4)', margin: '0 0 16px 0' }}>Upload image or video files directly to Supabase storage to generate dynamic URLs.</p>
                  
                  <div style={{
                    border: '1px dashed rgba(219, 187, 160, 0.2)',
                    padding: '28px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    background: 'rgba(0,0,0,0.1)',
                    position: 'relative'
                  }}>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(244, 239, 234, 0.5)', display: 'block', marginBottom: '8px' }}>
                      Drag and drop file here, or click to choose
                    </span>
                    <button style={{
                      padding: '8px 16px',
                      background: 'rgba(219, 187, 160, 0.1)',
                      border: '1px solid rgba(219, 187, 160, 0.25)',
                      borderRadius: '6px',
                      color: '#D4AF37',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}>
                      {uploadingFile ? 'Uploading file...' : 'Choose File'}
                    </button>
                    <input
                      type="file"
                      disabled={uploadingFile}
                      onChange={(e) => uploadFile(e, 'global')}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                </div>

                {/* Upsert Overrides Form */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.01)',
                  border: '1px solid rgba(219, 187, 160, 0.08)',
                  borderRadius: '12px',
                  padding: '24px'
                }}>
                  <h3 style={{ fontSize: '1rem', color: '#D4AF37', margin: '0 0 8px 0', fontWeight: 600 }}>Create / Edit Override</h3>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(244, 239, 234, 0.4)', margin: '0 0 20px 0' }}>Assign a value or media URL to a global key to override static settings.</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(244, 239, 234, 0.6)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Override Key (e.g. logo, whatsapp_number, founder_video)
                      </label>
                      <input
                        type="text"
                        value={overrideDraft.key}
                        onChange={(e) => setOverrideDraft(prev => ({ ...prev, key: e.target.value.trim() }))}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#0a0705',
                          border: '1px solid rgba(219, 187, 160, 0.12)',
                          borderRadius: '6px',
                          color: '#F4EFEA',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                        placeholder="e.g. whatsapp_number"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(244, 239, 234, 0.6)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Override Value / URL
                      </label>
                      <input
                        type="text"
                        value={overrideDraft.url}
                        onChange={(e) => setOverrideDraft(prev => ({ ...prev, url: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#0a0705',
                          border: '1px solid rgba(219, 187, 160, 0.12)',
                          borderRadius: '6px',
                          color: '#F4EFEA',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                        placeholder="e.g. 9778339292 or http://..."
                      />
                    </div>

                    <button
                      onClick={saveImageOverride}
                      disabled={saving}
                      style={{
                        padding: '12px',
                        background: 'linear-gradient(135deg, #C5A059 0%, #A27B3C 100%)',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#0F0A07',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: saving ? 'not-allowed' : 'pointer',
                        marginTop: '8px'
                      }}
                    >
                      {saving ? 'Saving...' : 'Set Override'}
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: Existing Settings List */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px solid rgba(219, 187, 160, 0.08)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <h3 style={{ fontSize: '1rem', color: '#D4AF37', margin: '0 0 16px 0', fontWeight: 600 }}>Active Image & Global Settings Overrides</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {imageOverrides.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'rgba(244, 239, 234, 0.3)', padding: '24px 0' }}>No variables overridden in database.</div>
                  ) : (
                    imageOverrides.map(img => (
                      <div key={img.key} style={{
                        background: '#0a0705',
                        border: '1px solid rgba(219, 187, 160, 0.06)',
                        padding: '16px',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#D4AF37', fontFamily: 'monospace' }}>{img.key}</span>
                          <button
                            onClick={() => deleteImageOverride(img.key)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#EA868F',
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              fontWeight: 600
                            }}
                          >
                            Remove
                          </button>
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: 'rgba(244, 239, 234, 0.5)',
                          wordBreak: 'break-all',
                          background: 'rgba(255,255,255,0.02)',
                          padding: '6px 10px',
                          borderRadius: '4px'
                        }}>
                          {img.url}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </main>
        )}

      </div>
    </div>
  );
}
