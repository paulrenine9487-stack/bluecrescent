import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const DEFAULT_CERTS = [
  {
    id: 'gsas-auth',
    title: 'GSAS Design & Build Service Provider',
    org: 'GORD',
    image: '/certificate GSAG.png'
  },
  {
    id: 'iso',
    title: 'ISO 9001:2015 Quality Management System',
    org: 'BQSR',
    image: '/certificate IAF.png'
  },
  {
    id: 'gsas-comp',
    title: 'GSAS Sustainability Completion Certificate',
    org: 'GORD',
    image: '/certificate GSAG.png'
  },
  {
    id: 'bim-comp',
    title: 'BIM Execution & LOD 500 Completion',
    org: 'Blue Crescent',
    image: '/bimmodel.png'
  }
];

export default function CredentialsSection({ onNavigate }) {
  const [certData, setCertData] = useState(DEFAULT_CERTS);
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetch('/api/certificates')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) {
          const list = data.map((c, i) => ({
            id: c.id || `cert-${i}`,
            title: c.title,
            org: c.org || c.issued_by || 'Authority',
            image: c.image || (c.title?.toLowerCase().includes('iso') ? '/certificate IAF.png' : '/certificate GSAG.png')
          }));
          if (list.length >= 3) {
            setCertData(list);
          }
        }
      })
      .catch(err => console.warn('Certificates fetch warning:', err));
  }, []);

  const getCardsToShow = () => {
    if (windowWidth < 640) return 1;
    if (windowWidth < 1024) return 2;
    return 3;
  };

  const cardsToShow = getCardsToShow();

  // Auto-scroll loop every 3.5 seconds
  useEffect(() => {
    if (isPaused || certData.length <= cardsToShow) return;

    const interval = setInterval(() => {
      setStartIndex((prev) => {
        if (prev >= certData.length - cardsToShow) {
          return 0;
        }
        return prev + 1;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, certData.length, cardsToShow]);

  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate('Certifications');
    }
  };

  return (
    <section className="credentials-full-section bce-certifications-compact-section">
      {/* Background Overlay */}
      <div className="bce-cert-bg-overlay"></div>

      <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '1320px' }}>
        {/* Section Header */}
        <div className="bce-cert-header-row">
          <div className="bce-cert-header-info">
            <h2 className="bce-cert-main-heading" style={{ color: '#063B73' }}>
              CERTIFIED. TRUSTED. BUILT FOR EXCELLENCE.
            </h2>
            <p className="bce-cert-description" style={{ color: '#475569' }}>
              Our commitment to quality, sustainability and engineering excellence is supported by internationally recognized standards and certification frameworks.
            </p>
          </div>

          <div className="bce-cert-header-action">
            <button
              type="button"
              className="btn-blue-premium bce-view-all-certs-btn"
              onClick={() => {
                if (onNavigate) onNavigate('Certifications');
              }}
            >
              <span>VIEW ALL CERTIFICATES</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* 3 Visible Cards Side-by-Side Auto-Scroll Slider */}
        <div 
          style={{ width: '100%', overflow: 'hidden', padding: '10px 0 20px 0' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            style={{
              display: 'flex',
              transform: `translateX(calc(-${startIndex} * (100% / ${cardsToShow} + ${22 / cardsToShow}px)))`,
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              gap: '22px'
            }}
          >
            {certData.map((cert) => (
              <div
                key={cert.id}
                className="bce-cert-card"
                onClick={handleCardClick}
                style={{
                  flex: `0 0 calc(${100 / cardsToShow}% - ${(22 * (cardsToShow - 1)) / cardsToShow}px)`,
                  boxSizing: 'border-box'
                }}
              >
                {/* Certificate Image Area */}
                <div className="bce-cert-image-area">
                  <img
                    src={cert.image}
                    alt={`${cert.title} Document`}
                  />
                </div>

                {/* Certificate Info */}
                <div className="bce-cert-card-info">
                  <h3 className="bce-cert-card-title">{cert.title}</h3>
                  <p className="bce-cert-card-org">
                    Certified by <span className="bce-cert-org-name">{cert.org}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
