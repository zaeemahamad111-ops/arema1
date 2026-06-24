'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import gsap from 'gsap';
import styles from './Preloader.module.css';

export default function Preloader() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  // All hooks MUST be declared before any conditional returns (React rules of hooks)
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    // Skip entirely on CMS routes
    if (pathname?.startsWith('/cms')) return;

    // Guard: only run once (prevents React StrictMode double-invoke issues)
    if (hasRun.current) return;

    // If we've already shown the preloader this browser session, skip it.
    // This is the KEY fix: Next.js SPA navigation re-mounts layout components,
    // so without this check the preloader fires every time you go back to Home.
    const alreadySeen = sessionStorage.getItem('arema-preloader-done');
    if (alreadySeen) {
      setActive(false);
      return;
    }

    hasRun.current = true;
    setActive(true);

    // Lock scroll while preloader is visible
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        if (!containerRef.current) return;
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: () => {
            document.body.style.overflow = '';
            // Mark as done so we never show it again this session
            sessionStorage.setItem('arema-preloader-done', '1');
            setActive(false);
          },
        });
      },
    });

    // Only animate if refs are mounted
    if (logoRef.current) {
      tl.to(logoRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' });
    }
    if (progressRef.current) {
      tl.to(progressRef.current, { width: '100%', duration: 1.4, ease: 'power2.inOut' }, '-=0.3');
    }
    if (logoRef.current) {
      tl.to(logoRef.current, { scale: 0.96, opacity: 0, duration: 0.35, ease: 'power2.in' }, '+=0.1');
    }
  }, [pathname]);

  // Don't render on CMS routes or when not active
  if (pathname?.startsWith('/cms') || !active) return null;

  return (
    <div ref={containerRef} className={styles.preloaderContainer}>
      <div className={styles.centerContent}>
        <div ref={logoRef} className={styles.logoWrap}>
          <Image
            src="/images/logo.png"
            alt="Arema Foods"
            width={100}
            height={100}
            priority
            className={styles.logoImg}
          />
        </div>
        <div className={styles.loaderBarContainer}>
          <div ref={progressRef} className={styles.loaderBarProgress} />
        </div>
      </div>
    </div>
  );
}
