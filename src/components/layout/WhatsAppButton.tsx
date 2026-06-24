'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import styles from './WhatsAppButton.module.css';

const WHATSAPP_NUMBER = '9778339292'; // The client's number

const TOOLTIPS: Record<string, string> = {
  en: "Chat with us",
  ar: "تواصل معنا",
  de: "Chatten Sie mit uns",
  es: "Chatea con nosotros",
  fr: "Contactez-nous",
  it: "Chatta con noi",
  nl: "Chat met ons",
  ru: "Связаться с нами",
  zh: "与我们聊天",
  ja: "お問い合わせ",
  ko: "문의하기",
  ta: "எங்களுடன் அரட்டையடிக்கவும்",
  hi: "हमसे चैट करें"
};

const MESSAGES: Record<string, string> = {
  en: "Hello Arema Foods, I would like to inquire about your products.",
  ar: "مرحباً أريما فودز، أود الاستفسار عن منتجاتكم.",
  de: "Hallo Arema Foods, ich möchte mich über Ihre Produkte erkundigen.",
  es: "Hola Arema Foods, me gustaría consultar sobre sus productos.",
  fr: "Bonjour Arema Foods, je souhaite me renseigner sur vos produits.",
  it: "Ciao Arema Foods, vorrei chiedere informazioni sui vostri prodotti.",
  nl: "Hallo Arema Foods, ik wil graag informeren naar uw producten.",
  ru: "Здравствуйте, Arema Foods, я хотел бы узнать о вашей продукции.",
  zh: "您好 Arema Foods，我想咨询您的产品。",
  ja: "Arema Foods様、製品について問い合わせたいです。",
  ko: "안녕하세요 Arema Foods, 제품에 대해 문의하고 싶습니다.",
  ta: "வணக்கம் அரேமா ஃபுட்ஸ், உங்கள் தயாரிப்புகளைப் பற்றி விசாரிக்க விரும்புகிறேன்.",
  hi: "नमस्ते अरेमा फूड्स, मैं आपके उत्पादों के बारे में पूछताछ करना चाहता हूँ।"
};

export default function WhatsAppButton() {
  const { lang, isRTL, getImage } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if the preloader has finished
    const checkPreloader = () => {
      if (sessionStorage.getItem('arema-preloader-done') === '1') {
        setVisible(true);
        return true;
      }
      return false;
    };

    // If preloader is already done, show immediately
    if (checkPreloader()) return;

    // Otherwise, check at regular intervals until the preloader flag is set
    const interval = setInterval(() => {
      if (checkPreloader()) {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const tooltipText = TOOLTIPS[lang] || TOOLTIPS['en'];
  const baseMessage = MESSAGES[lang] || MESSAGES['en'];
  const encodedText = encodeURIComponent(baseMessage);
  
  // Format standard WhatsApp URL using wa.me format
  const whatsappNumber = getImage('whatsapp_number', WHATSAPP_NUMBER);
  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${encodedText}`;

  return (
    <div className={`${styles.whatsappContainer} ${visible ? styles.whatsappVisible : ''} ${isRTL ? styles.whatsappRTL : ''}`}>
      {/* Tooltip Label (fades in on hover) */}
      <div className={styles.tooltip}>{tooltipText}</div>

      {/* Floating Button */}
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={styles.whatsappBtn}
        aria-label="Contact us on WhatsApp"
      >
        {/* Animated Ripple Pulse */}
        <div className={styles.pulseRing} />
        
        {/* SVG WhatsApp Icon */}
        <svg className={styles.icon} viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.46h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
        </svg>
      </a >
    </div>
  );
}
