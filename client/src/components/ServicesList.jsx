import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Building2, Compass, Radio, Layers, Leaf, Cpu } from 'lucide-react';

const FALLBACK_CATEGORIES = [
  {
    id: 1,
    num: '01',
    name: 'CAD & Engineering Documentation',
    slug: 'cad-engineering-documentation',
    icon: 'Building2',
    bgLight: '#F0F7FF',
    border: '1px solid #BAE6FD',
    accent: '#087CFF',
    titleColor: '#063B73',
    textColor: '#1E293B',
    iconBg: '#E0F2FE',
    description: 'Professional multidisciplinary CAD production and engineering documentation for complex building, infrastructure and industrial projects.',
    subServices: [
      '2D Drafting',
      'Shop Drawings',
      'As-Built Documentation',
      'Engineering Coordination'
    ]
  },
  {
    id: 2,
    num: '02',
    name: 'BIM & Digital Construction',
    slug: 'bim-digital-construction',
    icon: 'Layers',
    bgLight: '#FFF1F2',
    border: '1px solid #FECDD3',
    accent: '#E11D48',
    titleColor: '#881337',
    textColor: '#1E293B',
    iconBg: '#FFE4E6',
    description: 'End-to-end BIM services supporting projects from design development through construction and final asset handover.',
    subServices: [
      '3D BIM',
      '4D / 5D',
      'Architectural BIM',
      'Structural BIM',
      'MEP BIM',
      'Infrastructure BIM',
      'Clash Coordination',
      'COBie',
      'As-Built BIM'
    ]
  },
  {
    id: 3,
    num: '03',
    name: 'Laser Scanning & Reality Capture',
    slug: 'laser-scanning-reality-capture',
    icon: 'Radio',
    bgLight: '#F0FDF4',
    border: '1px solid #99F6E4',
    accent: '#0D9488',
    titleColor: '#134E4A',
    textColor: '#1E293B',
    iconBg: '#CCFBF1',
    description: 'Transforming physical assets into accurate digital information through advanced reality-capture workflows.',
    subServices: [
      '3D Laser Scanning',
      'Point Cloud Processing',
      'Scan-to-BIM',
      'Existing Condition Modeling',
      'As-Built Verification'
    ]
  },
  {
    id: 4,
    num: '04',
    name: 'Digital Twin & Asset Lifecycle',
    slug: 'digital-twin-asset-lifecycle',
    icon: 'Compass',
    bgLight: '#FFF1F2',
    border: '1px solid #FECDD3',
    accent: '#E11D48',
    titleColor: '#881337',
    textColor: '#1E293B',
    iconBg: '#FFE4E6',
    description: 'Connecting physical assets with digital information to enable smarter operation, monitoring and lifecycle management.',
    subServices: [
      'Digital Twin',
      'BIM Integration',
      'GIS',
      'CAFM / IWMS',
      'CMMS',
      'BAS / BMS',
      'ERP',
      'EDMS',
      'Asset Information Management'
    ]
  },
  {
    id: 5,
    num: '05',
    name: 'Sustainability Consultancy',
    slug: 'sustainability-consultancy',
    icon: 'Leaf',
    bgLight: '#F0FDF4',
    border: '1px solid #BBF7D0',
    accent: '#16A34A',
    titleColor: '#064E3B',
    textColor: '#1E293B',
    iconBg: '#DCFCE7',
    description: 'Helping projects achieve better environmental performance, regulatory compliance and internationally recognized sustainability objectives.',
    subServices: [
      'GSAS',
      'LEED',
      'Energy Audits',
      'Green Building Gap Analysis',
      'Carbon Footprint Management',
      'ISO 14064',
      'Environmental Consultancy'
    ]
  },
  {
    id: 6,
    num: '06',
    name: 'Remote Construction Solutions',
    slug: 'remote-construction-solutions',
    icon: 'Cpu',
    bgLight: '#FFFBEB',
    border: '1px solid #FDE68A',
    accent: '#D97706',
    titleColor: '#78350F',
    textColor: '#1E293B',
    iconBg: '#FEF3C7',
    description: 'Connecting project teams, sites and technical specialists through digital technologies for improved collaboration and decision-making.',
    subServices: [
      'Remote Site Support',
      'AR Solutions',
      '360° Site Documentation',
      'Remote Inspection',
      'Digital Collaboration',
      'Robotic Integration'
    ]
  }
];

export default function ServicesList({ onNavigate }) {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [startIndex, setStartIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetch('/api/service-categories')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) {
          const activeData = data.filter(c => c.status !== 'Inactive');
          if (activeData.length > 0) {
            setCategories(activeData.map((cat, idx) => {
              const numStr = (idx + 1).toString().padStart(2, '0');
              const fallback = FALLBACK_CATEGORIES.find(f => f.slug === cat.slug) || FALLBACK_CATEGORIES[idx % FALLBACK_CATEGORIES.length];
              return {
                id: cat.id || idx + 1,
                num: numStr,
                name: cat.name,
                slug: cat.slug,
                icon: cat.icon || fallback.icon,
                bgLight: fallback.bgLight,
                border: fallback.border,
                accent: fallback.accent,
                titleColor: fallback.titleColor,
                textColor: fallback.textColor,
                iconBg: fallback.iconBg,
                description: cat.short_description || fallback.description,
                subServices: fallback.subServices
              };
            }));
          }
        }
      })
      .catch(err => console.warn('Categories fetch warning:', err));
  }, []);

  const getCardsToShow = () => {
    if (windowWidth < 640) return 1;
    if (windowWidth < 1024) return 2;
    return 3;
  };

  const cardsToShow = getCardsToShow();

  const handlePrev = () => {
    setStartIndex((prev) => (prev > 0 ? prev - 1 : categories.length - cardsToShow));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev < categories.length - cardsToShow ? prev + 1 : 0));
  };

  const getCategoryIcon = (iconName, color) => {
    switch (iconName) {
      case 'Building2': return <Building2 size={22} color={color} />;
      case 'Compass': return <Compass size={22} color={color} />;
      case 'Radio': return <Radio size={22} color={color} />;
      case 'Layers': return <Layers size={22} color={color} />;
      case 'Leaf': return <Leaf size={22} color={color} />;
      case 'Cpu': return <Cpu size={22} color={color} />;
      default: return <Building2 size={22} color={color} />;
    }
  };

  const handleExplore = (slug) => {
    if (onNavigate) {
      onNavigate('Services', slug);
    }
  };

  return (
    <section id="services" className="services-section-premium" style={{ marginTop: '64px', marginBottom: '80px' }}>
      <div className="services-container-inner">
        {/* Section Header */}
        <div className="services-header-wrap" style={{ position: 'relative', textAlign: 'center', marginBottom: '40px', padding: '0 100px' }}>
          <h2 className="services-title-premium" style={{ margin: '0 0 10px 0', color: '#063B73', fontSize: '32px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif' }}>
            Our Services
          </h2>
          <div style={{ width: '48px', height: '4px', background: 'linear-gradient(90deg, #087CFF, #00B8FF)', borderRadius: '2px', margin: '0 auto 14px auto' }} />
          <p className="services-subtitle-premium" style={{ margin: '0 auto', maxWidth: '760px', color: '#475569', fontSize: '15px', lineHeight: 1.6, fontWeight: '400' }}>
            Comprehensive engineering and digital transformation solutions connecting design, construction and asset lifecycle management.
          </p>

          <div className="carousel-nav-arrows" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '10px' }}>
            <button
              className="carousel-arrow-btn"
              onClick={handlePrev}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: '1px solid rgba(6, 59, 115, 0.2)',
                color: '#063B73',
                background: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(6, 59, 115, 0.08)'
              }}
              aria-label="Previous service"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="carousel-arrow-btn"
              onClick={handleNext}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: '1px solid rgba(6, 59, 115, 0.2)',
                color: '#063B73',
                background: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(6, 59, 115, 0.08)'
              }}
              aria-label="Next service"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel Track */}
        <div style={{ width: '100%', overflow: 'hidden', padding: '12px 4px' }}>
          <div
            style={{
              display: 'flex',
              transform: `translateX(-${startIndex * (100 / cardsToShow)}%)`,
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              gap: '24px'
            }}
          >
            {categories.map((cat) => {
              return (
                <div
                  key={cat.id || cat.slug}
                  className="service-card-vibrant"
                  style={{
                    flex: `0 0 calc(${100 / cardsToShow}% - ${(24 * (cardsToShow - 1)) / cardsToShow}px)`,
                    boxSizing: 'border-box',
                    background: cat.bgLight,
                    borderRadius: '24px',
                    border: cat.border,
                    padding: '32px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(6, 59, 115, 0.05)',
                    minHeight: '420px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(6, 59, 115, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(6, 59, 115, 0.05)';
                  }}
                  onClick={() => handleExplore(cat.slug)}
                >
                  {/* Decorative Background Accent Shape */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-40px',
                      right: '-40px',
                      width: '160px',
                      height: '160px',
                      borderRadius: '50%',
                      background: cat.iconBg,
                      opacity: 0.6,
                      pointerEvents: 'none'
                    }}
                  />

                  <div>
                    {/* Top Row: Number & Accent Icon Box */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', position: 'relative', zIndex: 2 }}>
                      <span style={{ fontSize: '32px', fontWeight: '800', color: cat.accent, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.5px' }}>
                        {cat.num}
                      </span>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: cat.iconBg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${cat.accent}33`
                        }}
                      >
                        {getCategoryIcon(cat.icon, cat.accent)}
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '21px',
                        fontWeight: '800',
                        color: cat.titleColor,
                        margin: '0 0 20px 0',
                        lineHeight: 1.3,
                        position: 'relative',
                        zIndex: 2
                      }}
                    >
                      {cat.name}
                    </h3>

                    {/* Full Sub-services Checklist */}
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: '0 0 28px 0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        position: 'relative',
                        zIndex: 2
                      }}
                    >
                      {cat.subServices.map((sub, idx) => (
                        <li 
                          key={idx} 
                          className="sub-service-touch-item"
                          style={{ 
                            fontSize: '14px', 
                            color: cat.textColor, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            fontWeight: '600',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            margin: '0 -8px',
                            borderRadius: '6px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            const textSpan = e.currentTarget.querySelector('.sub-text-label');
                            if (textSpan) textSpan.style.color = cat.accent;
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)';
                          }}
                          onMouseLeave={(e) => {
                            const textSpan = e.currentTarget.querySelector('.sub-text-label');
                            if (textSpan) textSpan.style.color = cat.textColor;
                            e.currentTarget.style.background = 'transparent';
                          }}
                          onTouchStart={(e) => {
                            const textSpan = e.currentTarget.querySelector('.sub-text-label');
                            if (textSpan) textSpan.style.color = cat.accent;
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
                          }}
                          onTouchEnd={(e) => {
                            const textSpan = e.currentTarget.querySelector('.sub-text-label');
                            if (textSpan) textSpan.style.color = cat.textColor;
                            e.currentTarget.style.background = 'transparent';
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExplore(cat.slug);
                          }}
                        >
                          <span style={{ color: cat.accent, fontWeight: '800', fontSize: '15px', flexShrink: 0 }}>✓</span>
                          <span className="sub-text-label" style={{ color: cat.textColor, transition: 'color 0.2s ease' }}>{sub}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Explore Service CTA Footer */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: `1px solid ${cat.accent}30`,
                      paddingTop: '18px',
                      color: cat.accent,
                      fontWeight: '800',
                      fontSize: '14px',
                      letterSpacing: '0.3px',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    <span>Explore Service</span>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: cat.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      <ArrowRight size={16} color={cat.accent} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
