'use client';

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './FounderSection.module.css';
import { useLanguage } from '@/i18n/LanguageContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FounderSection() {
  const { t, getImage } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default to muted in JSX for clean initial mount
  const userToggledMuteRef = useRef<boolean | null>(null); // Tracks if the user manually muted/unmuted
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Video play failed:", err);
      });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering video play/pause on clicking speaker icon
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    userToggledMuteRef.current = nextMuted;
  };

  // Autoplay video when scrolled into view from Hero section
  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;

    const gsapCtx = gsap.context(() => {
      let trigger: ScrollTrigger | null = null;

      const initScrollTrigger = () => {
        if (!videoRef.current) return;
        
        trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 80%', 
          end: 'bottom 20%', 
          onToggle: (self) => {
            if (!videoRef.current) return;
            if (self.isActive) {
              const playPromise = videoRef.current.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => setIsPlaying(true))
                  .catch((err) => {
                    console.log("Autoplay blocked:", err);
                    if (videoRef.current) {
                      videoRef.current.muted = true;
                      setIsMuted(true);
                      videoRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error(e));
                    }
                  });
              }
            } else {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        });

        // Recalculate ScrollTrigger markers to prevent layout shifts from throwing off positions
        ScrollTrigger.refresh();
      };

      const timer = setTimeout(initScrollTrigger, 150);

      return () => clearTimeout(timer);
    });

    return () => gsapCtx.revert(); // Destroys all ScrollTriggers created in context
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} id="our-story">
      <div className={styles.container}>
        {/* ── LEFT COLUMN ─────────────────────────────────── */}
        <div className={styles.left}>
          <span className={styles.eyebrow}>{t('founder.eyebrow')}</span>
          <h2 className={styles.heading}>{t('founder.heading')}</h2>
          <p className={styles.description}>
            {t('founder.description')}
          </p>
        </div>

        {/* ── RIGHT COLUMN — MEDIA PLAYER ──────────────────── */}
        <div className={styles.right}>
          {/* Card container with thin border and rounded corners */}
          <div className={styles.cardContainer}>
            <div className={styles.videoWrapper} onClick={togglePlay}>
              <video
                ref={videoRef}
                src={getImage('founder_video', '/videos/founder-story-compressed.mp4')}
                className={styles.mediaVideo}
                loop
                playsInline
                muted={isMuted}
              />
              
              {/* Play/Pause Button Overlay */}
              <button 
                className={`${styles.playBtn} ${isPlaying ? styles.playBtnHidden : ''}`} 
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                <div className={styles.playIconContainer}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>

              {/* Volume Toggle Button */}
              <button
                className={styles.volumeBtn}
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
              >
                {isMuted ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>
            </div>

            {/* Bottom border badge (centered) */}
            <div className={styles.borderBadge}>
              <svg width="22" height="22" viewBox="0 0 36 36" fill="none">
                <path d="M6 30 C12 24 16 14 26 8" stroke="var(--arema-brown)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 23 C11 20 13 18 15 19 C16 21 14 23 12 23 Z" fill="var(--arema-brown)"/>
                <path d="M15 19 C14 16 16 14 18 15 C19 17 17 19 15 19 Z" fill="var(--arema-brown)"/>
                <path d="M18 15 C17 12 19 10 21 11 C22 13 20 15 18 15 Z" fill="var(--arema-brown)"/>
                <path d="M21 11 C20 8 22 6 24 7 C25 9 23 11 21 11 Z" fill="var(--arema-brown)"/>
                <path d="M14 25 C16 24 18 26 17 28 C15 29 13 27 14 25 Z" fill="var(--arema-brown)"/>
                <path d="M17 21 C19 20 21 22 20 24 C18 25 16 23 17 21 Z" fill="var(--arema-brown)"/>
                <path d="M20 17 C22 16 24 18 23 20 C21 21 19 19 20 17 Z" fill="var(--arema-brown)"/>
                <path d="M23 13 C25 12 27 14 26 16 C24 17 22 15 23 13 Z" fill="var(--arema-brown)"/>
              </svg>
            </div>
          </div>

          {/* Dynamic description below the video */}
          <div className={styles.conceptDescription}>
            <p>
              {t('founder.conceptDescription')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
