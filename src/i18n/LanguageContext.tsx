'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, LANGUAGES, LanguageCode, TranslationSchema } from './translations';
import { supabase } from '@/lib/supabase';

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  isRTL: boolean;
  t: (key: string) => string;
  currentTranslations: TranslationSchema;
  getImage: (key: string, defaultUrl: string) => string;
  refreshData: () => Promise<void>;
  dbProductsRaw: any[];
  dbBlogsRaw: any[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>('en');

  // Supabase states for dynamic overrides
  const [dbTranslations, setDbTranslations] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbProductTrans, setDbProductTrans] = useState<any[]>([]);
  const [dbBlogs, setDbBlogs] = useState<any[]>([]);
  const [dbBlogTrans, setDbBlogTrans] = useState<any[]>([]);
  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>({});

  const loadDbData = async () => {
    try {
      const [
        { data: trans },
        { data: prods },
        { data: prodTrans },
        { data: blgs },
        { data: blgTrans },
        { data: imgs }
      ] = await Promise.all([
        supabase.from('site_translations').select('*'),
        supabase.from('products').select('*'),
        supabase.from('product_translations').select('*'),
        supabase.from('blogs').select('*'),
        supabase.from('blog_translations').select('*'),
        supabase.from('image_overrides').select('*')
      ]);

      if (trans) setDbTranslations(trans);
      if (prods) setDbProducts(prods);
      if (prodTrans) setDbProductTrans(prodTrans);
      if (blgs) setDbBlogs(blgs);
      if (blgTrans) setDbBlogTrans(blgTrans);
      
      if (imgs) {
        const imgMap = imgs.reduce((acc: any, item: any) => {
          acc[item.key] = item.url;
          return acc;
        }, {});
        setImageOverrides(imgMap);
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to static local translations.', e);
    }
  };

  // Load persisted language preference on mount and fetch database records
  useEffect(() => {
    const saved = localStorage.getItem('arema-lang') as LanguageCode;
    if (saved && translations[saved]) {
      setLangState(saved);
    }
    loadDbData();
  }, []);

  const setLang = (newLang: LanguageCode) => {
    if (translations[newLang]) {
      setLangState(newLang);
      localStorage.setItem('arema-lang', newLang);
    }
  };

  const isRTL = lang === 'ar';

  // Merge Supabase dynamic values over the static baseline
  const getMergedTranslations = (): TranslationSchema => {
    // Deep clone static baseline
    const base = JSON.parse(JSON.stringify(translations[lang] || translations['en']));
    
    // 1. Merge site translations
    dbTranslations
      .filter((item: any) => item.lang === lang)
      .forEach((item: any) => {
        const parts = item.key.split('.');
        let current = base;
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          if (!current[part]) current[part] = {};
          current = current[part];
        }
        const lastKey = parts[parts.length - 1];
        
        let parsedVal = item.value;
        if (item.value.startsWith('[') || item.value.startsWith('{')) {
          try {
            parsedVal = JSON.parse(item.value);
          } catch (e) {}
        }
        current[lastKey] = parsedVal;
      });

    // 2. Merge products
    if (dbProducts.length > 0) {
      const prodData: Record<string, any> = {};
      dbProducts.forEach((p: any) => {
        const trans = dbProductTrans.find((pt: any) => pt.product_id === p.id && pt.lang === lang);
        if (trans) {
          prodData[p.id] = {
            name: trans.name,
            category: trans.category,
            tagline: trans.tagline,
            description: trans.description,
            highlights: trans.highlights,
            specs: trans.specs,
            image_url: p.image_url
          };
        }
      });
      if (Object.keys(prodData).length > 0) {
        base.productsData = prodData;
      }
    }

    // 3. Merge blogs
    if (dbBlogs.length > 0) {
      const blogData: Record<string, any> = {};
      dbBlogs.forEach((b: any) => {
        const trans = dbBlogTrans.find((bt: any) => bt.blog_id === b.id && bt.lang === lang);
        if (trans) {
          blogData[b.id] = {
            category: trans.category,
            readTime: trans.readTime,
            date: trans.date,
            title: trans.title,
            excerpt: trans.excerpt,
            body: trans.body,
            image_url: b.image_url
          };
        }
      });
      if (Object.keys(blogData).length > 0) {
        base.blogData = blogData;
      }
    }

    return base;
  };

  const currentTranslations = getMergedTranslations();

  // Safe translation resolver supporting dot-notation keys
  const t = (key: string): string => {
    try {
      const parts = key.split('.');
      let obj: any = currentTranslations;
      for (const part of parts) {
        obj = obj[part];
        if (obj === undefined) break;
      }
      if (typeof obj === 'string') return obj;
      if (Array.isArray(obj)) return obj.join(' ');
    } catch (e) {
      console.warn(`Translation key not found: ${key}`);
    }
    
    // Fallback to English if translation is missing
    try {
      const parts = key.split('.');
      let obj: any = translations['en'];
      for (const part of parts) {
        obj = obj[part];
        if (obj === undefined) break;
      }
      if (typeof obj === 'string') return obj;
    } catch (e) {}

    return key;
  };

  // Helper to retrieve overridden image URL or fall back to default
  const getImage = (key: string, defaultUrl: string): string => {
    return imageOverrides[key] || defaultUrl;
  };

  const refreshData = async () => {
    await loadDbData();
  };

  return (
    <LanguageContext.Provider value={{ 
      lang, 
      setLang, 
      isRTL, 
      t, 
      currentTranslations, 
      getImage, 
      refreshData,
      dbProductsRaw: dbProducts,
      dbBlogsRaw: dbBlogs
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
