import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MajorClientsSection() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const scrollContainerRef = useRef(null);

  const fetchMajorClients = async () => {
    try {
      const res = await fetch('/api/company-information/major-clients');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const activeOnly = data.filter(c => c.status === 'Active' || c.is_active === 1 || c.is_active === true);
          activeOnly.sort((a, b) => (Number(a.display_order) || 0) - (Number(b.display_order) || 0) || a.id - b.id);
          setClients(activeOnly);
        }
      }
    } catch (err) {
      console.warn('Error loading major clients for rail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMajorClients();

    const handleUpdate = () => {
      fetchMajorClients();
    };

    window.addEventListener('companySettingsUpdated', handleUpdate);
    window.addEventListener('dataUpdated', handleUpdate);

    // Check prefers-reduced-motion
    if (window.matchMedia) {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(motionQuery.matches);
      const listener = (e) => setPrefersReducedMotion(e.matches);
      motionQuery.addEventListener ? motionQuery.addEventListener('change', listener) : motionQuery.addListener(listener);
    }

    return () => {
      window.removeEventListener('companySettingsUpdated', handleUpdate);
      window.removeEventListener('dataUpdated', handleUpdate);
    };
  }, []);

  const handleScroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -280 : 280;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // If loading or zero active clients, hide section gracefully
  if (!loading && clients.length === 0) {
    return null;
  }

  // Duplicate client list to create seamless infinite marquee loop
  const displayLogos = clients.length > 0 ? [...clients, ...clients, ...clients] : [];
  const animationDuration = `${Math.max(25, clients.length * 5)}s`;

  return (
    <section 
      className="major-clients-section" 
      style={{ 
        width: '100%',
        padding: '48px 0', 
        background: 'linear-gradient(135deg, #EBF5FF 0%, #E0F2FE 50%, #F0F9FF 100%)',
        borderTop: '1px solid #BAE6FD',
        borderBottom: '1px solid #BAE6FD',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Inject Keyframe Animation dynamically */}
      <style>{`
        @keyframes bceMarqueeScroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }
        .bce-clients-marquee-track {
          display: flex;
          align-items: center;
          gap: 40px;
          width: max-content;
          will-change: transform;
        }
        .bce-clients-marquee-track.animated {
          animation: bceMarqueeScroll ${animationDuration} linear infinite;
        }
        .bce-clients-marquee-track.paused {
          animation-play-state: paused !important;
        }
      `}</style>

      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        
        {/* SECTION HEADER WITH NAV CONTROLS */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 
              style={{ 
                fontSize: '30px', 
                fontWeight: '800', 
                color: '#063B73', 
                textTransform: 'uppercase', 
                letterSpacing: '0.5px', 
                margin: '0 0 8px 0',
                lineHeight: 1.2
              }}
            >
              OUR MAJOR CLIENTS
            </h2>
            <div 
              style={{ 
                width: '50px', 
                height: '3.5px', 
                background: 'linear-gradient(90deg, #087CFF, #00B8FF)', 
                borderRadius: '4px' 
              }} 
            />
          </div>

          {/* Header Navigation Control Arrows */}
          {clients.length > 2 && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={() => handleScroll('left')}
                aria-label="Previous clients"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '1.5px solid #CBD5E1',
                  boxShadow: '0 2px 8px rgba(6, 59, 115, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#063B73',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#063B73';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#063B73';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.color = '#063B73';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                }}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => handleScroll('right')}
                aria-label="Next clients"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '1.5px solid #CBD5E1',
                  boxShadow: '0 2px 8px rgba(6, 59, 115, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#063B73',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#063B73';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#063B73';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.color = '#063B73';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* MARQUEE RAIL CONTAINER */}
        <div 
          style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Scrollable Viewport Rail */}
          <div
            ref={scrollContainerRef}
            style={{
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              padding: '10px 0',
              width: '100%',
              touchAction: 'pan-x'
            }}
          >
            {/* Infinite Marquee Track */}
            <div 
              className={`bce-clients-marquee-track ${!prefersReducedMotion ? 'animated' : ''} ${isHovered ? 'paused' : ''}`}
            >
              {displayLogos.map((client, index) => {
                const cacheBust = client.updated_at ? `?v=${new Date(client.updated_at).getTime()}` : '';
                const logoSrc = client.logo ? `${client.logo}${cacheBust}` : '/partner_teknik.png';

                return (
                  <div
                    key={`${client.id}-${index}`}
                    title={client.name}
                    style={{
                      flex: '0 0 auto',
                      width: '190px',
                      height: '95px',
                      background: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid rgba(6, 59, 115, 0.08)',
                      boxShadow: '0 2px 10px rgba(6, 59, 115, 0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '14px 20px',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      transition: 'transform 0.25s ease, boxShadow 0.25s ease, borderColor 0.25s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(8, 124, 255, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(8, 124, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(6, 59, 115, 0.03)';
                      e.currentTarget.style.borderColor = 'rgba(6, 59, 115, 0.08)';
                    }}
                  >
                    <img
                      src={logoSrc}
                      alt={client.name || 'Major Client'}
                      style={{
                        maxHeight: '60px',
                        maxWidth: '85%',
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80';
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
