import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';

const FALLBACK_PROJECT_IMAGES = [
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80'
];

export default function ProjectsSlider({ onNavigate }) {
  const [projects, setProjects] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) {
          // Only show Active projects
          setProjects(data.filter(p => p.status !== 'Inactive'));
        }
      })
      .catch(err => console.warn('Projects slider fetch warning:', err));
  }, []);

  const getCardsToShow = () => {
    if (windowWidth < 640) return 1;
    if (windowWidth < 1024) return 2;
    return 3;
  };

  const cardsToShow = getCardsToShow();

  if (projects.length === 0) return null;

  const handlePrev = () => {
    setStartIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev < projects.length - cardsToShow ? prev + 1 : prev));
  };

  return (
    <section className="what-we-do-section" style={{ marginTop: '48px', marginBottom: '80px' }}>
      <div className="what-we-do-header">
        <div className="what-we-do-title-wrap">
          <h2 className="what-we-do-title" style={{ color: '#0B1F3A' }}>Our Projects</h2>
          <div className="title-underline-yellow" style={{ background: '#00A198', boxShadow: '0 0 10px #00A198' }}></div>
        </div>

        {projects.length > cardsToShow && (
          <div className="carousel-nav-arrows">
            <button 
              className="carousel-arrow-btn" 
              onClick={handlePrev} 
              disabled={startIndex === 0}
              style={{
                borderColor: 'rgba(11, 31, 58, 0.2)',
                color: '#0B1F3A',
                background: startIndex === 0 ? 'rgba(0,0,0,0.02)' : 'transparent',
                opacity: startIndex === 0 ? 0.4 : 1
              }}
              aria-label="Previous projects"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className="carousel-arrow-btn" 
              onClick={handleNext}
              disabled={startIndex >= projects.length - cardsToShow}
              style={{
                borderColor: 'rgba(11, 31, 58, 0.2)',
                color: '#0B1F3A',
                background: startIndex >= projects.length - cardsToShow ? 'rgba(0,0,0,0.02)' : 'transparent',
                opacity: startIndex >= projects.length - cardsToShow ? 0.4 : 1
              }}
              aria-label="Next projects"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Viewport for slider */}
      <div style={{ width: '100%', overflow: 'hidden', padding: '12px 4px' }}>
        <div 
          style={{
            display: 'flex',
            transform: `translateX(-${startIndex * (100 / cardsToShow)}%)`,
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            gap: '24px'
          }}
        >
          {projects.map((project, idx) => {
            const projectImg = project.image || FALLBACK_PROJECT_IMAGES[idx % FALLBACK_PROJECT_IMAGES.length];
            return (
              <div 
                key={project.id || idx}
                className="card-item"
                style={{
                  flex: `0 0 calc(${100 / cardsToShow}% - ${(24 * (cardsToShow - 1)) / cardsToShow}px)`,
                  boxSizing: 'border-box',
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid rgba(11, 31, 58, 0.08)',
                  boxShadow: '0 4px 20px rgba(11, 31, 58, 0.04)',
                  padding: '24px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 161, 152, 0.15)';
                  e.currentTarget.style.borderColor = '#00A198';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(11, 31, 58, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(11, 31, 58, 0.08)';
                }}
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('Projects', project.division_type);
                  }
                }}
              >
                {/* Image */}
                <div 
                  style={{
                    width: '100%',
                    height: '190px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '18px',
                    position: 'relative',
                    background: '#0B1F3A'
                  }}
                >
                  <img 
                    src={projectImg} 
                    alt={project.name} 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(11, 31, 58, 0.85)',
                      backdropFilter: 'blur(4px)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#FFFFFF',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {project.division_type}
                  </div>
                </div>

                {/* Content */}
                <h4 
                  style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    color: '#0B1F3A',
                    margin: '0 0 8px 0',
                    lineHeight: 1.4,
                    minHeight: '50px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {project.name}
                </h4>

                <p 
                  style={{
                    fontSize: '13.5px',
                    color: '#475569',
                    margin: '0 0 20px 0',
                    lineHeight: 1.6,
                    height: '64px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {project.description || 'Professional design development and MEP engineering works for GCC building topologies.'}
                </p>

                <div 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto',
                    borderTop: '1px solid rgba(11, 31, 58, 0.06)',
                    paddingTop: '16px'
                  }}
                >
                  <span 
                    style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#00A198',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Briefcase size={14} />
                    {project.project_count}+ Projects
                  </span>
                  <span 
                    style={{
                      fontSize: '12px',
                      fontWeight: '850',
                      color: '#0B1F3A',
                      letterSpacing: '0.5px'
                    }}
                  >
                    VIEW DETAILS →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
