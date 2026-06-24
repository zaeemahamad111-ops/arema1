'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { useLanguage } from '@/i18n/LanguageContext';
import { LANGUAGES } from '@/i18n/translations';

export default function Navbar() {
  const { lang, setLang, t, getImage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  
  const pathname = usePathname();
  const isHome = pathname === '/';
  const showLinks = !isHome || scrolled;

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/our-story', label: t('nav.ourStory') },
    { href: '/products', label: t('nav.products') },
    { href: '/why-arema', label: t('nav.whyArema') },
    { href: '/certificates', label: t('nav.certificates') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/contact', label: t('nav.contact') },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { 
    setMenuOpen(false); 
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => { 
    document.body.style.overflow = menuOpen ? 'hidden' : ''; 
  }, [menuOpen]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedDesktop = desktopDropdownRef.current && desktopDropdownRef.current.contains(target);
      const clickedMobile = mobileDropdownRef.current && mobileDropdownRef.current.contains(target);
      if (!clickedDesktop && !clickedMobile) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${isHome ? styles.homeNav : ''}`}>
        <div className={styles.inner}>
          {/* Logo — Always visible on all pages */}
          <Link href="/" className={styles.wordmark}>
            <div className={styles.logoIcon}>
              <Image
                src={getImage('logo', '/images/logo.png')}
                alt="Arema Foods Logo"
                width={54}
                height={54}
                priority
                className={styles.logoImg}
              />
            </div>
          </Link>

          {/* Desktop Navigation Links — Slides in from right-to-left on scroll */}
          <div className={`${styles.desktopLinks} ${showLinks ? styles.desktopLinksVisible : ''}`}>
            {navLinks.map((link) => {
              const isContact = link.href === '/contact';
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${isContact ? styles.navContactBtn : styles.navLink} ${pathname === link.href ? styles.activeNavLink : ''}`}
                >
                  {link.label}
                  {isContact && ' ↗'}
                </Link>
              );
            })}

            {/* Desktop Globe Switcher */}
            <div ref={desktopDropdownRef} className={styles.langSelectorContainer}>
              <button 
                className={styles.globeBtn} 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="Select Language"
                aria-expanded={dropdownOpen}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.globeIcon}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span className={styles.currentLangCode}>{lang.toUpperCase()}</span>
              </button>
              
              {dropdownOpen && (
                <ul className={styles.langDropdown} data-lenis-prevent>
                  {LANGUAGES.map((l) => (
                    <li key={l.code}>
                      <button 
                        onClick={() => {
                          setLang(l.code);
                          setDropdownOpen(false);
                        }}
                        className={`${styles.langOption} ${lang === l.code ? styles.langOptionActive : ''}`}
                      >
                        <span className={styles.langFlag}>{l.flag}</span>
                        <span className={styles.langName}>{l.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Mobile Hamburg menu button — Visible only on mobile screens */}
          <div className={styles.mobileMenuContainer}>
            {/* Mobile Language Switcher (Directly on header bar) */}
            <div ref={mobileDropdownRef} className={`${styles.langSelectorContainer} ${styles.mobileLangSelector}`}>
              <button 
                className={styles.globeBtn} 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="Select Language"
                aria-expanded={dropdownOpen}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.globeIcon}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span className={styles.currentLangCode}>{lang.toUpperCase()}</span>
              </button>
              
              {dropdownOpen && (
                <ul className={styles.langDropdown} data-lenis-prevent>
                  {LANGUAGES.map((l) => (
                    <li key={l.code}>
                      <button 
                        onClick={() => {
                          setLang(l.code);
                          setDropdownOpen(false);
                        }}
                        className={`${styles.langOption} ${lang === l.code ? styles.langOptionActive : ''}`}
                      >
                        <span className={styles.langFlag}>{l.flag}</span>
                        <span className={styles.langName}>{l.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              className={`${styles.menuBtn} ${menuOpen ? styles.menuBtnOpen : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span className={styles.menuLabel}>{menuOpen ? t('nav.close') : t('nav.menu')}</span>
              <div className={styles.hamburger}>
                <span />
                <span />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay menu */}
      <div className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`} aria-hidden={!menuOpen}>
        <div className={styles.overlayInner}>
          <ul className={styles.overlayLinks}>
            {navLinks.map((link, i) => (
              <li key={link.href} style={{ transitionDelay: `${60 + i * 55}ms` }}>
                <Link
                  href={link.href}
                  className={`${styles.overlayLink} ${pathname === link.href ? styles.active : ''}`}
                >
                  <span className={styles.overlayNum}>0{i + 1}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.overlayFooter}>
            <Link href="/contact" className={styles.overlayContact}>{t('nav.getInTouch')} →</Link>
          </div>
        </div>
      </div>
    </>
  );
}
