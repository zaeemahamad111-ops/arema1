'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import styles from './page.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    inquiry: 'wholesale',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Website Inquiry: ${formData.inquiry} from ${formData.name}`;
    const body = `Name: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`;
    window.location.href = `mailto:nibeesh.jb@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <main style={{ paddingTop: 'var(--nav-height)' }}>
      {/* ── HEADER ───────────────────────────────────── */}
      <section style={{ padding: 'var(--space-12) 0 var(--space-8)', background: 'var(--pale-sand-20)' }}>
        <div className="container">
          <span className="eyebrow" style={{ display: 'block', marginBottom: 'var(--space-5)' }}>Get in Touch</span>
          <h1 className="display-xl" style={{ color: 'var(--dark-text)', maxWidth: '16ch' }}>
            Start a<br />
            <em style={{ fontStyle: 'italic', color: 'var(--arema-brown)' }}>Conversation</em>
          </h1>
          <p className="body-lg" style={{ color: 'var(--charcoal)', maxWidth: '50ch', marginTop: 'var(--space-5)' }}>
            Whether you are a buyer, distributor, retailer, or a journalist with a question —
            we would love to hear from you.
          </p>
        </div>
      </section>

      {/* ── CONTACT LAYOUT ───────────────────────────── */}
      <section style={{ padding: 'var(--space-10) 0 var(--space-12)', background: 'var(--light-surface)' }}>
        <div className="container">
          <div className={styles.layout}>
            {/* Contact Info */}
            <div className={styles.info}>
              <div className={styles.infoBlock}>
                <h3 className={styles.infoTitle}>Address</h3>
                <address style={{ fontStyle: 'normal' }}>
                  <p className="body-base">Arema Foods International</p>
                  <p className="body-sm">27/665, 1st floor, Das complex,</p>
                  <p className="body-sm">Near Builtech Pavilion, NH-47,</p>
                  <p className="body-sm">Bypass Kadamkode, Palakkad,</p>
                  <p className="body-sm">Kerala, South India - 678013</p>
                </address>
              </div>

              <div className={styles.infoBlock}>
                <h3 className={styles.infoTitle}>Contact</h3>
                <a href="mailto:nibeesh.jb@gmail.com" className={styles.infoLink}>nibeesh.jb@gmail.com</a>
                <a href="tel:+919778339292" className={styles.infoLink}>+91 9778339292</a>
                <a href="tel:04913589795" className={styles.infoLink}>0491 3589 795</a>
              </div>

              <div className={styles.infoBlock}>
                <h3 className={styles.infoTitle}>Export Inquiries</h3>
                <a href="mailto:nibeesh.jb@gmail.com" className={styles.infoLink}>nibeesh.jb@gmail.com</a>
              </div>

              <div className={styles.infoBlock}>
                <h3 className={styles.infoTitle}>Business Hours</h3>
                <p className="body-sm">Monday – Saturday</p>
                <p className="body-sm">9:00 AM – 6:00 PM IST</p>
              </div>

            </div>

            {/* Form */}
            <div className={styles.formWrap}>
              {submitted ? (
                <div className={styles.success}>
                  <div className={styles.successIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <h3 className={styles.successTitle}>Message Sent</h3>
                  <p className={styles.successBody}>Thank you for reaching out. We will respond within 1–2 business days.</p>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label htmlFor="name" className={styles.label}>Full Name *</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Your name"
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="company" className={styles.label}>Company</label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Company name"
                      />
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label htmlFor="email" className={styles.label}>Email Address *</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="phone" className={styles.label}>Phone Number</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="inquiry" className={styles.label}>Inquiry Type *</label>
                    <select
                      id="inquiry"
                      name="inquiry"
                      required
                      value={formData.inquiry}
                      onChange={handleChange}
                      className={styles.select}
                    >
                      <option value="wholesale">Wholesale Purchase</option>
                      <option value="distribution">Distribution Partnership</option>
                      <option value="private-label">Private Label / OEM</option>
                      <option value="retail">Retail Enquiry</option>
                      <option value="media">Media / Press</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="message" className={styles.label}>Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className={styles.textarea}
                      placeholder="Tell us about your requirements..."
                    />
                  </div>

                  <button type="submit" className={`btn btn--primary ${styles.submitBtn}`}>
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FULL WIDTH MAP ───────────────────────────── */}
      <section style={{ width: '100%', height: '550px' }}>
        <iframe
          src="https://maps.google.com/maps?q=Arema+Foods+International,+27/665,+1st+floor,+Das+complex,+Near+Builtech+Pavilion,+NH-47,+Bypass+Kadamkode,+Palakkad,+Kerala&t=&z=14&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </main>
  );
}
