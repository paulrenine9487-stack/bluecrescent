import React, { useState, useEffect, useRef } from 'react';

/* ── Static Fallback Content ──────────────────────────────────────── */
const STATIC_HERO = {
  badge: 'A SOLUTION FOR YOUR VISION',
  title: 'Engineering Excellence, Building a Better Tomorrow.',
  sub:   'Blue Crescent Engineering delivers innovative, sustainable and reliable engineering solutions across the globe.',
  btn1:  'EXPLORE OUR SERVICES',
  btn2:  'GET A CONSULTATION',
  image: null
};

const STATS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#74D2FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z" />
      </svg>
    ),
    value: '25+',
    label: 'COUNTRIES',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#74D2FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    value: '500+',
    label: 'PROJECTS',
  },
];

export default function HeroSlider({ onNavigate }) {
  const videoRef = useRef(null);
  const [slides, setSlides] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [heroType, setHeroType] = useState('video');
  const [heroUrl, setHeroUrl] = useState('');

  // Fetch dynamic hero slides & banner settings
  useEffect(() => {
    fetch('/api/hero_slides')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const published = data.filter(s => s.status === 'published');
        if (published.length > 0) {
          setSlides(published);
        }
      })
      .catch(err => console.warn('Hero slides fetch warning:', err));

    fetch('/api/settings/company')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data === 'object') {
          if (data.aboutUsHeroType) setHeroType(data.aboutUsHeroType);
          if (data.aboutUsHeroUrl) setHeroUrl(data.aboutUsHeroUrl);
        }
      })
      .catch(err => console.warn('Hero settings fetch warning:', err));
  }, []);

  // Slide cycle interval
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides]);

  /* Ensure video plays on mount if using fallback video background */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.play().catch(() => {});
  }, [activeIdx, slides, heroUrl, heroType]);

  // Determine current active slide
  const currentSlide = slides.length > 0 ? slides[activeIdx] : STATIC_HERO;

  // Split title to highlight the final word in cyan (matches premium design)
  const parseTitle = (fullTitle) => {
    if (!fullTitle) return { mainText: '', highlight: '' };
    const tokens = fullTitle.trim().split(' ');
    if (tokens.length <= 1) return { mainText: fullTitle, highlight: '' };
    const highlight = tokens.pop();
    const mainText = tokens.join(' ');
    return { mainText, highlight };
  };

  const { mainText, highlight } = parseTitle(currentSlide.title || currentSlide.line1);

  return (
    <section className="hs-section">

      {/* ── Slide Background (Dynamic Video or Image Background) ── */}
      {heroType === 'video' ? (
        <video
          ref={videoRef}
          key={heroUrl || '/hero2.mp4'}
          className="hs-video"
          src={heroUrl || '/hero2.mp4'}
          autoPlay
          muted
          defaultMuted
          loop
          playsInline
        />
      ) : (
        <div
          className="hs-video"
          style={{
            backgroundImage: `url(${heroUrl || '/aboutus-default-banner.png'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%'
          }}
        />
      )}

      {/* ── Dark video overlay for text contrast ────────────────── */}
      <div className="hs-video-overlay" />

      {/* ── Floating soft light particles ───────────────────────── */}
      <div className="hs-particles">
        {[...Array(6)].map((_, i) => (
          <span key={i} className={`hs-dot hs-dot-${i + 1}`} />
        ))}
      </div>

      {/* ── Main Hero Content ───────────────────────────────────── */}
      <div className="hs-container">

        {/* LEFT COLUMN: Text + CTA Buttons */}
        <div className="hs-left">
          <div className="hs-badge">
            <span className="hs-badge-pulse" />
            {currentSlide.badge || 'A SOLUTION FOR YOUR VISION'}
          </div>

          <h1 className="hs-title">
            {mainText} <span className="hs-cyan">{highlight}</span>
          </h1>

          <p className="hs-sub">{currentSlide.subtitle || currentSlide.sub}</p>

          <div className="hs-btns">
            <button
              className="hs-btn-primary"
              onClick={() => onNavigate && onNavigate('Services')}
            >
              {currentSlide.btn1_text || currentSlide.btn1 || 'EXPLORE OUR SERVICES'} &nbsp;→
            </button>
            <button
              className="hs-btn-outline"
              onClick={() => onNavigate && onNavigate('Contact Us')}
            >
              {currentSlide.btn2_text || currentSlide.btn2 || 'GET A CONSULTATION'}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Glassmorphism Stat Cards */}
        <div className="hs-right">
          {STATS.map((s, i) => (
            <div key={i} className="hs-stat-card">
              <div className="hs-stat-icon">{s.icon}</div>
              <div className="hs-stat-info">
                <span className="hs-stat-val">{s.value}</span>
                <span className="hs-stat-lbl">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
