import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
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

const TAGS = [
  'painting','sculpture','photography','digital-art',
  'illustration','printmaking','ceramics','street-art',
  'abstract','portrait','landscape','contemporary',
];

export default function LandingPage() {
  return (
    <div className="font-sans text-ink">

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white border-b border-neutral-200 px-8 h-14 flex items-center justify-between">
        <span className="font-serif text-[22px] font-semibold tracking-tight">Artspace</span>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm text-ink-soft no-underline hover:text-ink transition-colors">
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium px-5 py-2 bg-ink text-white rounded no-underline hover:bg-neutral-800 transition-colors"
          >
            Join free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-ink text-white min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20">
        <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-5">
          A social platform for artists
        </p>
        <h1 className="font-serif font-semibold leading-[1.05] tracking-tight mb-7 max-w-3xl"
            style={{ fontSize: 'clamp(42px, 7vw, 86px)' }}>
          Where art finds<br /><em>its audience.</em>
        </h1>
        <p className="text-base text-neutral-400 max-w-md leading-relaxed mb-10">
          Share your practice. Discover emerging artists. Build meaningful connections around the work that matters.
        </p>
        <Link
          to="/register"
          className="text-sm font-medium px-9 py-3.5 bg-white text-ink rounded no-underline hover:bg-neutral-100 transition-colors tracking-wide"
        >
          Create your space
        </Link>
      </section>

      {/* Feature strip */}
      <section className="max-w-5xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 border border-neutral-200 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-8 md:p-10">
              <p className="text-[11px] tracking-[0.15em] uppercase text-ink-faint mb-4">0{i + 1}</p>
              <h3 className="font-serif text-xl font-semibold mb-3 leading-snug">{f.label}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tag cloud */}
      <section className="bg-neutral-50 border-y border-neutral-200 py-16 px-8 text-center">
        <p className="text-[11px] tracking-[0.2em] uppercase text-ink-faint mb-7">Explore by practice</p>
        <div className="flex flex-wrap gap-2 justify-center max-w-xl mx-auto">
          {TAGS.map((t) => (
            <span
              key={t}
              className="px-3.5 py-1.5 border border-neutral-300 rounded-sm text-xs text-ink-soft tracking-widest lowercase"
            >
              #{t}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-6 py-20">
        <h2
          className="font-serif font-semibold tracking-tight mb-5 leading-tight"
          style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}
        >
          Your contemporary art partner.
        </h2>
        <p className="text-sm text-ink-soft max-w-sm mx-auto mb-8 leading-relaxed">
          Artspace is free to join. Start sharing your work today.
        </p>
        <Link
          to="/register"
          className="text-sm font-medium px-8 py-3 bg-ink text-white rounded no-underline hover:bg-neutral-800 transition-colors"
        >
          Get started
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-ink text-neutral-500 border-t border-neutral-800 px-8 py-8 text-center">
        <span className="font-serif text-lg text-white tracking-tight">Artspace</span>
        <p className="text-xs mt-3">
          © {new Date().getFullYear()} Artspace. A minimalist social network for artists.
        </p>
      </footer>
    </div>
  );
}
