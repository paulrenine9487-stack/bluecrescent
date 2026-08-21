import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Briefcase, ArrowRight, Building2, Compass, Radio, Layers, Leaf, Cpu } from 'lucide-react';

const CATEGORIES = [
  'ALL',
  'ENGINEERING SERVICES',
  'SUSTAINABILITY SERVICES',
  'DIGITAL TWIN',
  'DIGITAL CONSTRUCTION TECHNOLOGY'
];

const FALLBACK_PROJECTS = [
  {
    id: 'p1',
    name: 'Hamad Port Maritime Facilities CAD Documentation',
    slug: 'hamad-port-maritime',
    division_type: 'CAD Projects',
    icon: 'Building2',
    description: 'Comprehensive 2D/3D CAD drafting, shop drawings, as-built documentation, and engineering support for port facilities.',
    project_count: 24,
    image: '/project1.png'
  },
  {
    id: 'p2',
    name: 'Qatar Free Zone BIM Coordination & LOD 500',
    slug: 'qatar-free-zone',
    division_type: 'BIM Projects',
    icon: 'Layers',
    description: 'Multidisciplinary BIM modeling, clash detection, 4D/5D simulations, and asset handover up to LOD 500.',
    project_count: 28,
    image: '/project1.png'
  },
  {
    id: 'p3',
    name: 'Hamad Airport Terminal 3D Laser Scanning',
    slug: 'airport-expansion-project',
    division_type: 'Laser Scanning Projects',
    icon: 'Radio',
    description: 'High-precision 3D laser scanning of existing terminal structures and point-cloud-to-BIM conversion.',
    project_count: 18,
    image: '/project1.png'
  },
  {
    id: 'p4',
    name: 'Qetaifan Island North Digital Twin Platform',
    slug: 'qetaifan-island-resort',
    division_type: 'Digital Twin Projects',
    icon: 'Cpu',
    description: 'Connecting physical assets with digital spatial models for IoT sensor monitoring and operational asset management.',
    project_count: 15,
    image: '/why.png'
  },
  {
    id: 'p5',
    name: 'Doha Port Terminal GSAS Green Certification',
    slug: 'doha-port-terminal',
    division_type: 'Sustainability Projects',
    icon: 'Leaf',
    description: 'GSAS green building certification management, energy diagnostic audits, and sustainable materials facilitation.',
    project_count: 12,
    image: '/sust_workshop.png'
  }
];

export default function ProjectsSlider({ onNavigate }) {
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [startIndex, setStartIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchProjectsData = () => {
    fetch('/api/projects')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.length > 0) {
          const activeProjects = data.filter(p => p.status !== 'Inactive');
          if (activeProjects.length > 0) {
            setProjects(activeProjects);
          }
        }
      })
      .catch(err => console.warn('Projects slider fetch warning:', err));
  };

  useEffect(() => {
    fetchProjectsData();
    window.addEventListener('dataUpdated', fetchProjectsData);
    window.addEventListener('menuUpdated', fetchProjectsData);
    return () => {
      window.removeEventListener('dataUpdated', fetchProjectsData);
      window.removeEventListener('menuUpdated', fetchProjectsData);
    };
  }, []);

  const [isPaused, setIsPaused] = useState(false);

  // Filter projects by active category
  const filteredProjects = activeCategory === 'ALL'
    ? projects
    : projects.filter(p => {
        const divType = (p.division_type || p.category || p.name || '').toUpperCase().trim();
        const active = activeCategory.toUpperCase().trim();
        
        if (active.includes('ENGINEERING')) {
          return divType.includes('BIM') || divType.includes('CAD') || divType.includes('SCAN') || divType.includes('ENGINEERING');
        }
        if (active.includes('SUSTAINABILITY')) {
          return divType.includes('GSAS') || divType.includes('LEED') || divType.includes('ENERGY') || divType.includes('ENVIRONMENT') || divType.includes('SUSTAINABILITY');
        }
        if (active.includes('TWIN')) {
          return divType.includes('TWIN') || divType.includes('ASSET') || divType.includes('SYSTEM') || divType.includes('MONITORING');
        }
        if (active.includes('CONSTRUCTION') || active.includes('TECHNOLOGY')) {
          return divType.includes('SCAN') || divType.includes('360') || divType.includes('AR') || divType.includes('COLLABORATION') || divType.includes('CONSTRUCTION') || divType.includes('ROBOTICS');
        }
        return divType.includes(active) || active.includes(divType);
      });

  const displayProjects = filteredProjects.length > 0 ? filteredProjects : projects;

  const getCardsToShow = () => {
    if (windowWidth < 640) return 1;
    if (windowWidth < 1024) return 2;
    return 3;
  };

  const cardsToShow = getCardsToShow();

  // Auto-scroll loop every 3.5 seconds
  useEffect(() => {
    if (isPaused || displayProjects.length <= cardsToShow) return;

    const interval = setInterval(() => {
      setStartIndex((prev) => {
        if (prev >= displayProjects.length - cardsToShow) {
          return 0;
        }
        return prev + 1;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, displayProjects.length, cardsToShow]);

  const handlePrev = () => {
    setStartIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev < displayProjects.length - cardsToShow ? prev + 1 : prev));
  };

  const getCategoryIcon = (divType) => {
    const upper = (divType || '').toUpperCase();
    if (upper.includes('BIM') || upper.includes('ENGINEERING')) return <Building2 size={20} color="#FFFFFF" />;
    if (upper.includes('TWIN')) return <Compass size={20} color="#FFFFFF" />;
    if (upper.includes('REALITY') || upper.includes('SCAN')) return <Radio size={20} color="#FFFFFF" />;
    if (upper.includes('SUSTAINABILITY')) return <Leaf size={20} color="#FFFFFF" />;
    if (upper.includes('REMOTE')) return <Cpu size={20} color="#FFFFFF" />;
    return <Layers size={20} color="#FFFFFF" />;
  };

  return (
    <section 
      className="projects-section-staggered" 
      style={{ 
        marginTop: '64px', 
        marginBottom: '100px',
        background: 'linear-gradient(180deg, #F0F7FF 0%, #E6F0FA 100%)',
        padding: '50px 24px 60px 24px',
        borderRadius: '32px',
        border: '1px solid #BAE6FD'
      }}
    >
      <div className="projects-container-inner">
        {/* Centered Section Header */}
        <div className="projects-header-wrap" style={{ position: 'relative', textAlign: 'center', marginBottom: '32px', padding: windowWidth < 768 ? '0 16px' : '0 100px' }}>
          <h2 style={{ margin: '0 0 10px 0', color: '#063B73', fontSize: windowWidth < 640 ? '24px' : '32px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif' }}>
            Our Projects
          </h2>
          <div style={{ width: '48px', height: '4px', background: 'linear-gradient(90deg, #087CFF, #00B8FF)', borderRadius: '2px', margin: '0 auto 14px auto' }} />
          <p style={{ margin: '0 auto', maxWidth: '760px', color: '#475569', fontSize: windowWidth < 640 ? '13.5px' : '15px', lineHeight: 1.6, fontWeight: '400' }}>
            Explore our engineering, BIM coordination, digital twin, and sustainability portfolio across key industry sectors.
          </p>

          {/* Navigation Controls */}
          {displayProjects.length > cardsToShow && (
            <div className="carousel-nav-arrows" style={{ position: 'absolute', right: windowWidth < 768 ? '16px' : 0, top: windowWidth < 768 ? '-10px' : '50%', transform: windowWidth < 768 ? 'none' : 'translateY(-50%)', display: 'flex', gap: '10px' }}>
              <button
                className="carousel-arrow-btn"
                onClick={handlePrev}
                disabled={startIndex === 0}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  border: '1px solid rgba(6, 59, 115, 0.2)',
                  color: '#063B73',
                  background: startIndex === 0 ? 'rgba(0,0,0,0.02)' : '#FFFFFF',
                  opacity: startIndex === 0 ? 0.4 : 1,
                  cursor: startIndex === 0 ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(6, 59, 115, 0.08)'
                }}
                aria-label="Previous projects"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="carousel-arrow-btn"
                onClick={handleNext}
                disabled={startIndex >= displayProjects.length - cardsToShow}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  border: '1px solid rgba(6, 59, 115, 0.2)',
                  color: '#063B73',
                  background: startIndex >= displayProjects.length - cardsToShow ? 'rgba(0,0,0,0.02)' : '#FFFFFF',
                  opacity: startIndex >= displayProjects.length - cardsToShow ? 0.4 : 1,
                  cursor: startIndex >= displayProjects.length - cardsToShow ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(6, 59, 115, 0.08)'
                }}
                aria-label="Next projects"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* 6 Category Pill Filter Bar */}
        <div
          className="projects-category-tab-bar"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: windowWidth < 768 ? '8px 6px' : '8px',
            padding: windowWidth < 768 ? '0 12px 12px 12px' : '0 0 12px 0',
            marginBottom: windowWidth < 768 ? '24px' : '40px',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setStartIndex(0);
              }}
              style={{
                padding: windowWidth < 768 ? '8px 14px' : '9px 18px',
                borderRadius: '20px',
                border: activeCategory === cat ? '1px solid #087CFF' : '1px solid rgba(6, 59, 115, 0.12)',
                background: activeCategory === cat ? '#087CFF' : '#FFFFFF',
                color: activeCategory === cat ? '#FFFFFF' : '#475569',
                fontSize: windowWidth < 768 ? '11px' : '12px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.25s ease',
                flexShrink: 0,
                boxShadow: activeCategory === cat ? '0 4px 14px rgba(8, 124, 255, 0.25)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Slider Cards Track with Auto-Scroll Pause on Hover */}
        <div 
          style={{ width: '100%', overflow: 'hidden', padding: '16px 0 24px 0' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            style={{
              display: 'flex',
              transform: `translateX(calc(-${startIndex} * (100% / ${cardsToShow} + ${24 / cardsToShow}px)))`,
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              gap: '24px',
              alignItems: 'stretch'
            }}
          >
            {displayProjects.map((project, idx) => {
              return (
                <div
                  key={project.id || idx}
                  className="staggered-project-card"
                  style={{
                    flex: `0 0 calc(${100 / cardsToShow}% - ${(24 * (cardsToShow - 1)) / cardsToShow}px)`,
                    boxSizing: 'border-box',
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    border: '1px solid rgba(6, 59, 115, 0.1)',
                    boxShadow: '0 8px 30px rgba(6, 59, 115, 0.06)',
                    padding: '16px 16px 24px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    minHeight: '350px',
                    marginTop: '0px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 44px rgba(8, 124, 255, 0.16)';
                    e.currentTarget.style.borderColor = '#087CFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(6, 59, 115, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(6, 59, 115, 0.1)';
                  }}
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate('ProjectDetail', project.slug || project.id);
                    }
                  }}
                >
                  <div>
                    {/* Image Thumbnail Block (Icon Badge Removed as requested) */}
                    <div
                      style={{
                        width: '100%',
                        height: '230px',
                        borderRadius: '18px',
                        overflow: 'hidden',
                        marginBottom: '20px',
                        position: 'relative',
                        background: '#F8FAFC'
                      }}
                    >
                      <img
                        src={project.image || '/project1.png'}
                        alt={project.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </div>

                    {/* Title */}
                    <h4
                      style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '20px',
                        fontWeight: '800',
                        color: '#063B73',
                        margin: '0 0 8px 0',
                        lineHeight: 1.35,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '52px'
                      }}
                    >
                      {project.name}
                    </h4>

                    {/* Sub-Category Title Badge under Title */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 14px',
                        borderRadius: '20px',
                        background: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        color: '#059669',
                        fontSize: '12px',
                        fontWeight: '700',
                        marginBottom: '14px'
                      }}
                    >
                      {project.division_type || activeCategory}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      borderTop: '1px solid rgba(6, 59, 115, 0.08)',
                      paddingTop: '16px'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12.5px',
                        fontWeight: '800',
                        color: '#063B73',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        letterSpacing: '0.3px'
                      }}
                    >
                      VIEW DETAILS <ArrowRight size={14} color="#087CFF" />
                    </span>
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
