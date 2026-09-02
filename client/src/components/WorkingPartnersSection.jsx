import React, { useState, useEffect } from 'react';
import './WorkingPartnersSection.css';

const DEFAULT_PARTNERS = [
  { id: 1, image: '/partner_teknik.png', name: 'TEKNIK Group', role: 'Engineering Partner' },
  { id: 2, image: '/partner_arcana.png', name: 'ARCANA Build', role: 'Construction Partner' },
  { id: 3, image: '/partner_nexagen.png', name: 'NEXAGEN Solutions', role: 'Sustainability Partner' },
  { id: 4, image: '/partner_qaframe.png', name: 'QAFrame Technologies', role: 'BIM Partner' },
  { id: 5, image: '/partner_meridian.png', name: 'MERIDIAN MEP', role: 'MEP Partner' },
  { id: 6, image: '/partner_vistara.png', name: 'VISTARA Infrastructure', role: 'Infrastructure Partner' },
];

export default function WorkingPartnersSection() {
  const [partners, setPartners] = useState(DEFAULT_PARTNERS);
  const [partnerIdx, setPartnerIdx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  // Responsive visible cards count
  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setVisibleCount(1);
      } else if (width <= 768) {
        setVisibleCount(2);
      } else if (width <= 1024) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const fetchPartners = () => {
    fetch('/api/partners')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          data.sort((a, b) => (Number(a.order_num) || 0) - (Number(b.order_num) || 0) || a.id - b.id);
          setPartners(data);
        }
      })
      .catch(err => console.warn('Partners fetch warning:', err));
  };

  useEffect(() => {
    fetchPartners();

    const handleUpdate = () => {
      fetchPartners();
    };

    window.addEventListener('dataUpdated', handleUpdate);
    window.addEventListener('companySettingsUpdated', handleUpdate);

    return () => {
      window.removeEventListener('dataUpdated', handleUpdate);
      window.removeEventListener('companySettingsUpdated', handleUpdate);
    };
  }, []);

  const maxIdx = Math.max(0, partners.length - visibleCount);

  // Keep index within bounds if window resize changes maxIdx
  useEffect(() => {
    if (partnerIdx > maxIdx) {
      setPartnerIdx(maxIdx);
    }
  }, [maxIdx, partnerIdx]);

  const prev = () => setPartnerIdx(i => Math.max(0, i - 1));
  const next = () => setPartnerIdx(i => Math.min(maxIdx, i + 1));

  if (!partners || partners.length === 0) {
    return null;
  }

  return (
    <section className="working-partners-section">
      <div className="working-partners-container">
        
        {/* Section Header */}
        <div className="working-partners-header">
          <h2 className="working-partners-title">
            OUR WORKING PARTNERS
          </h2>
          <p className="working-partners-subtitle">
            Trusted collaborations that drive excellence across every project we deliver.
          </p>
          <div className="working-partners-accent-bar" />
        </div>

        {/* Carousel */}
        <div className="partners-carousel-wrap">
          <button 
            type="button"
            className="partner-arrow partner-arrow-left" 
            onClick={prev} 
            disabled={partnerIdx === 0} 
            aria-label="Previous partners"
          >
            &#8249;
          </button>

          <div className="partners-track-outer">
            <div 
              className="partners-track" 
              style={{ 
                transform: `translateX(calc(-${partnerIdx} * (100% / ${visibleCount})))` 
              }}
            >
              {partners.map((p) => {
                const logoSrc = p.image || '/partner_teknik.png';
                return (
                  <div key={p.id} className="partner-card">
                    <div className="partner-img-wrap">
                      <img 
                        src={logoSrc} 
                        alt={p.name || 'Partner'} 
                        className="partner-img" 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                    </div>
                    <div className="partner-card-body">
                      <p className="partner-name">{p.name}</p>
                      <p className="partner-role">{p.role || 'Working Partner'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            type="button"
            className="partner-arrow partner-arrow-right" 
            onClick={next} 
            disabled={partnerIdx >= maxIdx} 
            aria-label="Next partners"
          >
            &#8250;
          </button>
        </div>

        {/* Pagination Dots */}
        {maxIdx > 0 && (
          <div className="partners-dots">
            {Array.from({ length: maxIdx + 1 }).map((_, i) => (
              <button 
                type="button"
                key={i} 
                className={`partner-dot ${i === partnerIdx ? 'active' : ''}`} 
                onClick={() => setPartnerIdx(i)} 
                aria-label={`Go to slide ${i + 1}`} 
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
