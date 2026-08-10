import React, { useState, useEffect, useRef } from 'react';

/* ── Static Fallback Content ──────────────────────────────────────── */
const STATIC_HERO = {
  badge: 'ENGINEERING DIGITAL TRANSFORMATION',
  title: 'Engineering the Digital Future.',
  sub:   'Blue Crescent Engineering delivers technology-driven engineering and digital transformation solutions across the complete lifecycle of buildings and infrastructure.',
  btn1:  'EXPLORE OUR SERVICES',
  btn2:  'VIEW OUR PROJECTS',
  image: null
};

const STATS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#74D2FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    value: '13+',
    label: 'YEARS OF EXPERIENCE',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#74D2FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    value: '150+',
    label: 'TECHNICAL EXPERTS',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#74D2FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z" />
      </svg>
    ),
    value: '5',
    label: 'REGIONAL MARKETS',
    sublabel: 'Qatar • UAE • Kuwait • Saudi Arabia • India'
  }
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

  // Parse and map title, description, and badge dynamically to match new positioning
  const rawTitle = currentSlide.title || currentSlide.line1 || '';
  const displayTitle = (rawTitle.includes('Building Today') || rawTitle.includes('Sustaining Tomorrow') || !rawTitle)
    ? 'Engineering the Digital Future.'
    : rawTitle;

  const rawDesc = currentSlide.subtitle || currentSlide.sub || '';
  const displayDesc = (rawDesc.includes('sustainability in every project') || rawDesc.includes('Committed to quality') || !rawDesc)
    ? 'Blue Crescent Engineering delivers technology-driven engineering and digital transformation solutions across the complete lifecycle of buildings and infrastructure.'
    : rawDesc;

  const rawBadge = currentSlide.badge || '';
  const displayBadge = (rawBadge === 'A SOLUTION FOR YOUR VISION' || !rawBadge)
    ? 'ENGINEERING DIGITAL TRANSFORMATION'
    : rawBadge;

  const rawBtn1 = currentSlide.btn1_text || currentSlide.btn1 || '';
  const displayBtn1 = (rawBtn1.toUpperCase().includes('SERVICES') || !rawBtn1)
    ? 'EXPLORE OUR SERVICES'
    : rawBtn1;

  const rawBtn2 = currentSlide.btn2_text || currentSlide.btn2 || '';
  const displayBtn2 = (rawBtn2.toUpperCase().includes('PROJECTS') || rawBtn2.toUpperCase().includes('CONSULTATION') || !rawBtn2)
    ? 'VIEW OUR PROJECTS'
    : rawBtn2;

  // Split title to highlight the final word in cyan (matches premium design)
  const parseTitle = (fullTitle) => {
    if (!fullTitle) return { mainText: '', highlight: '' };
    const tokens = fullTitle.trim().split(' ');
    if (tokens.length <= 1) return { mainText: fullTitle, highlight: '' };
    const highlight = tokens.pop();
    const mainText = tokens.join(' ');
    return { mainText, highlight };
  };

  const renderTitle = (title) => {
    if (!title) return '';
    if (title.includes('Digital Future') || title.includes('Digital Twin')) {
      return (
        <>
          Engineering the <span className="hs-cyan">Digital Future.</span>
          <div className="hs-title-supporting" style={{ fontSize: '0.55em', fontWeight: 700, marginTop: '16px', lineHeight: 1.3, color: '#FFFFFF' }}>
            From CAD to BIM.<br />
            From Reality Capture to <span className="hs-cyan">Digital Twin.</span>
          </div>
        </>
      );
    }
    const { mainText, highlight } = parseTitle(title);
    return (
      <>
        {mainText} <span className="hs-cyan">{highlight}</span>
      </>
    );
  };

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
            {displayBadge}
          </div>

          <h1 className="hs-title">
            {renderTitle(displayTitle)}
          </h1>

          <p className="hs-sub">{displayDesc}</p>

          <div className="hs-btns">
            <button
              className="hs-btn-primary"
              onClick={() => onNavigate && onNavigate('Services')}
            >
              {displayBtn1} &nbsp;→
            </button>
            <button
              className="hs-btn-outline"
              onClick={() => onNavigate && onNavigate('Projects')}
            >
              {displayBtn2}
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
                {s.sublabel && (
                  <span className="hs-stat-sublbl" style={{ fontSize: '8px', fontWeight: '500', color: 'rgba(116, 210, 255, 0.85)', letterSpacing: '0.5px', marginTop: '2px', textTransform: 'uppercase' }}>
                    {s.sublabel}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
