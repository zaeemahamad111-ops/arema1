'use client';

import React, { useState } from 'react';

export default function CMSLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/cms-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        // Refresh page to trigger server cookie evaluation
        window.location.reload();
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #1E1712 0%, #0F0A07 100%)',
      padding: '24px',
      fontFamily: 'var(--font-body, system-ui)'
    }}>
      {/* Background spotlights */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '30%',
        width: '400px',
        height: '400px',
        background: 'rgba(219, 187, 160, 0.03)',
        filter: 'blur(100px)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(219, 187, 160, 0.08)',
        borderRadius: '16px',
        padding: '40px 32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        zIndex: 1
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display, Georgia)',
            fontSize: '1.8rem',
            color: '#F4EFEA',
            margin: '0 0 8px 0',
            fontWeight: 700,
            letterSpacing: '-0.02em'
          }}>
            AREMA <span style={{ color: '#D4AF37', fontWeight: 300 }}>CMS</span>
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: 'rgba(244, 239, 234, 0.5)',
            margin: 0
          }}>
            Enter credentials to manage content
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            background: 'rgba(220, 53, 69, 0.1)',
            border: '1px solid rgba(220, 53, 69, 0.2)',
            color: '#EA868F',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="username" style={{
              display: 'block',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'rgba(244, 239, 234, 0.7)',
              marginBottom: '8px',
              fontWeight: 600
            }}>
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(219, 187, 160, 0.15)',
                borderRadius: '8px',
                color: '#F4EFEA',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              placeholder="e.g. admin"
              onFocus={(e) => e.target.style.borderColor = 'rgba(219, 187, 160, 0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(219, 187, 160, 0.15)'}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'rgba(244, 239, 234, 0.7)',
              marginBottom: '8px',
              fontWeight: 600
            }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(219, 187, 160, 0.15)',
                borderRadius: '8px',
                color: '#F4EFEA',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              placeholder="••••••••"
              onFocus={(e) => e.target.style.borderColor = 'rgba(219, 187, 160, 0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(219, 187, 160, 0.15)'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #C5A059 0%, #A27B3C 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#0F0A07',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'transform 0.15s, opacity 0.15s',
              boxShadow: '0 4px 15px rgba(162, 123, 60, 0.25)'
            }}
            onMouseOver={(e) => {
              if(!loading) e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
