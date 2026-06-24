'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import gsap from 'gsap';
import styles from './Preloader.module.css';

export default function Preloader() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  if (pathname?.startsWith('/cms')) {
    return null;
  }
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
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

    // 1. Fade in logo
    tl.to(logoRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' });

    // 2. Fill progress bar
    tl.to(progressRef.current, { width: '100%', duration: 1.4, ease: 'power2.inOut' }, '-=0.3');

    // 3. Fade out logo before slide-up
    tl.to(logoRef.current, { scale: 0.96, opacity: 0, duration: 0.35, ease: 'power2.in' }, '+=0.1');
  }, []);

  if (!active) return null;

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
