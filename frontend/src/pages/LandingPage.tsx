import React from 'react';
import { Link } from 'react-router-dom';

const FEATURE_ROWS = [
  {
    label: 'Share your work',
    body: 'Upload images and videos. Add context, captions, and tags. Build a living portfolio that speaks for itself.',
  },
  {
    label: 'Follow what matters',
    body: 'Subscribe to tags that reflect your practice — painting, ceramics, digital, street. Your feed surfaces what you care about.',
  },
  {
    label: 'Connect with peers',
    body: 'Send and accept friend requests. Comment on work from artists whose tags intersect with your own.',
  },
];

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#111' }}>
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#fff', borderBottom: '1px solid #e5e5e5',
        padding: '0 32px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>
          Artspace
        </span>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link to="/login" style={{ textDecoration: 'none', fontSize: 13, color: '#525252' }}>Sign in</Link>
          <Link to="/register" style={{
            textDecoration: 'none', fontSize: 13, fontWeight: 500,
            padding: '7px 20px', background: '#111', color: '#fff', borderRadius: 3,
          }}>
            Join free
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{
        background: '#111', color: '#fff',
        minHeight: '70vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '80px 24px',
      }}>
        <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#737373', margin: '0 0 20px' }}>
          A social platform for artists
        </p>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(42px, 7vw, 86px)',
          fontWeight: 600, lineHeight: 1.05,
          margin: '0 0 28px', maxWidth: 760,
          letterSpacing: '-0.02em',
        }}>
          Where art finds<br />
          <em>its audience.</em>
        </h1>
        <p style={{ fontSize: 16, color: '#a3a3a3', maxWidth: 480, lineHeight: 1.7, margin: '0 0 40px' }}>
          Share your practice. Discover emerging artists. Build meaningful connections around the work that matters.
        </p>
        <Link to="/register" style={{
          textDecoration: 'none', fontSize: 15, fontWeight: 500,
          padding: '14px 36px', background: '#fff', color: '#111',
          borderRadius: 3, letterSpacing: '0.02em',
        }}>
          Create your space
        </Link>
      </section>

      {/* ── Exhibition-style feature strip ────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1px',
          border: '1px solid #e5e5e5',
        }}>
          {FEATURE_ROWS.map((f, i) => (
            <div
              key={i}
              style={{
                padding: '40px 32px',
                borderRight: i < FEATURE_ROWS.length - 1 ? '1px solid #e5e5e5' : 'none',
              }}
            >
              <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a3a3a3', margin: '0 0 16px' }}>
                0{i + 1}
              </p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, margin: '0 0 12px', lineHeight: 1.2 }}>
                {f.label}
              </h3>
              <p style={{ fontSize: 14, color: '#525252', lineHeight: 1.7, margin: 0 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tag cloud ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#fafafa', padding: '64px 32px', textAlign: 'center', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a3a3a3', margin: '0 0 28px' }}>
          Explore by practice
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 600, margin: '0 auto' }}>
          {['painting', 'sculpture', 'photography', 'digital-art', 'illustration', 'printmaking', 'ceramics', 'street-art', 'abstract', 'portrait', 'landscape', 'contemporary'].map((t) => (
            <span
              key={t}
              style={{
                padding: '6px 14px', border: '1px solid #d4d4d4', borderRadius: 2,
                fontSize: 12, color: '#525252', letterSpacing: '0.04em',
              }}
            >
              #{t}
            </span>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 600, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
          Your contemporary art partner.
        </h2>
        <p style={{ fontSize: 15, color: '#525252', maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Artspace is free to join. Start sharing your work today.
        </p>
        <Link to="/register" style={{
          textDecoration: 'none', fontSize: 14, fontWeight: 500,
          padding: '12px 32px', background: '#111', color: '#fff', borderRadius: 3,
        }}>
          Get started
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid #e5e5e5', background: '#111', color: '#737373',
        padding: '32px', textAlign: 'center',
      }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>
          Artspace
        </span>
        <p style={{ fontSize: 12, margin: '12px 0 0' }}>
          © {new Date().getFullYear()} Artspace. A minimalist social network for artists.
        </p>
      </footer>
    </div>
  );
}
