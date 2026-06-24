'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

// Original indices: 5, 6, 7, 8, 9, 11, 12, 13, 14, 15
const validIndices = [5, 6, 7, 8, 9, 11, 12, 13, 14, 15];
const certificates = validIndices.map(i => `/images/certificates/page_${i}.png`);

export default function CertificatesGallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (src: string) => setSelectedImage(src);
  const closeModal = () => setSelectedImage(null);

  return (
    <>
      <div className={styles.grid}>
        {certificates.map((src, index) => (
          <div key={src} className={styles.card} onClick={() => openModal(src)}>
            <div className={styles.imageWrap}>
              <Image
                src={src}
                alt={`Arema Certification Document ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'contain' }}
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
              />
              <div className={styles.viewOverlay}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>View Document</span>
              </div>
            </div>
            <div className={styles.cardLabel}>Document {index + 1}</div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className={styles.modal} onClick={closeModal}>
          <button className={styles.closeBtn} onClick={closeModal} aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage}
              alt="Certification Document Full View"
              fill
              style={{ objectFit: 'contain' }}
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
