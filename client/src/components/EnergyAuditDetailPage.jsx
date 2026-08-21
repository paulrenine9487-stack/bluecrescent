import React, { useState, useEffect } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './EnergyAuditDetailPage.css';

const DEFAULT_ENERGY_AUDIT_CONTENT = {
  page_title: 'Energy Audit',
  introduction: 'Comprehensive Energy Audit services providing detailed diagnostics, energy consumption analysis, ASHRAE Level 1, 2 & 3 audits, and cost-effective energy conservation measures across residential and commercial building assets.',
  residential_title: 'RESIDENTIAL BUILDING',
  residential_description: 'Energy audits for residential developments, villas, high-rise apartments, and residential complexes focusing on HVAC optimization, lighting efficiency, thermal envelope insulation, and utility cost reduction.',
  residential_images: [
    { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', alt: 'Residential Villa Thermal Efficiency Audit', display_order: 1 },
    { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', alt: 'Residential HVAC & Cooling Diagnostics', display_order: 2 },
    { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', alt: 'Residential Smart Lighting & Power Diagnostics', display_order: 3 },
    { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', alt: 'Residential Solar & Energy Storage Assessment', display_order: 4 }
  ],
  commercial_title: 'COMMERCIAL BUILDING',
  commercial_description: 'Detailed energy diagnostics for commercial towers, corporate offices, shopping malls, hotels, and industrial facilities in accordance with ASHRAE audit standards to maximize operational energy efficiency.',
  commercial_images: [
    { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'Commercial Tower Central Chiller Plant Diagnostic Audit', display_order: 1 },
    { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', alt: 'Commercial Office Building Automation & BMS Audit', display_order: 2 },
    { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Commercial Facility Electrical Power Quality Analysis', display_order: 3 },
    { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'Commercial HVAC Air Handling Unit Diagnostic Inspection', display_order: 4 }
  ]
};

export default function EnergyAuditDetailPage({ onNavigate }) {
  const [auditData, setAuditData] = useState(DEFAULT_ENERGY_AUDIT_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionIndices, setSectionIndices] = useState({ residential: 0, commercial: 0 });

  // Lightbox Modal State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeGalleryImages, setActiveGalleryImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchEnergyAuditContent = () => {
    fetch('/api/energy-audit')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setAuditData(prev => ({
            ...prev,
            ...data
          }));
        }
      })
      .catch(err => console.warn('Error fetching Energy Audit content:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchEnergyAuditContent();
    window.addEventListener('energyAuditContentUpdated', fetchEnergyAuditContent);
    return () => window.removeEventListener('energyAuditContentUpdated', fetchEnergyAuditContent);
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex(prev => (prev + 1) % activeGalleryImages.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex(prev => (prev - 1 + activeGalleryImages.length) % activeGalleryImages.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, activeGalleryImages]);

  const openLightbox = (imagesList, index) => {
    setActiveGalleryImages(imagesList);
    setActiveImageIndex(index);
    setLightboxOpen(true);
  };

  const currentImage = activeGalleryImages[activeImageIndex] || null;

  const getGridClass = (imagesCount) => {
    if (imagesCount >= 4) return 'grid-4col';
    if (imagesCount === 3) return 'grid-3col';
    if (imagesCount === 2) return 'grid-2col';
    return 'grid-4col';
  };

  return (
    <div className="energy-audit-container">
      <div className="energy-audit-content-body" style={{ paddingTop: '0px' }}>

        {/* ── TOP PAGE TOPIC HEADER ── */}
        <div className="energy-audit-page-header-clean" style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '900',
            color: '#063B73',
            letterSpacing: '-0.5px',
            margin: '0 0 16px 0'
          }}>
            Sustainability Services ({auditData.page_title || 'Energy Audit'})
          </h1>
          <div style={{
            width: '70px',
            height: '4px',
            background: 'linear-gradient(90deg, #0057B8 0%, #00A896 100%)',
            margin: '0 auto 20px auto',
            borderRadius: '2px'
          }} />
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#475569',
            maxWidth: '800px',
            margin: '0 auto',
            fontWeight: '400'
          }}>
            {auditData.introduction || 'Comprehensive Energy Audit services providing detailed diagnostics, energy consumption analysis, ASHRAE Level 1, 2 & 3 audits, and cost-effective energy conservation measures across residential and commercial building assets.'}
          </p>

          {/* Section Separator */}
          <div style={{ height: '1px', background: '#E2E8F0', margin: '36px auto 0 auto', maxWidth: '1000px' }} />
        </div>

        {/* ── SECTION 01: RESIDENTIAL BUILDING ── */}
        <section className="energy-audit-major-section-left" id="energy-audit-residential-section">
          {/* Residential Header & Gallery */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="energy-audit-section-header-left">
              <h2 style={{
                fontSize: '26px',
                fontWeight: '700',
                color: '#063B73',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {auditData.residential_title || 'RESIDENTIAL BUILDING'}
              </h2>
              <div style={{ width: '44px', height: '3px', background: '#0057B8', margin: '0 0 16px 0', borderRadius: '2px' }} />
            </div>
            {Array.isArray(auditData.residential_images) && auditData.residential_images.length > 4 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  className="section-nav-btn"
                  onClick={() => setSectionIndices(prev => ({ ...prev, residential: Math.max(prev.residential - 1, 0) }))}
                  disabled={(sectionIndices.residential || 0) === 0}
                  aria-label="Previous images"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="section-nav-btn"
                  onClick={() => setSectionIndices(prev => ({ ...prev, residential: Math.min(prev.residential + 1, auditData.residential_images.length - 4) }))}
                  disabled={(sectionIndices.residential || 0) >= auditData.residential_images.length - 4}
                  aria-label="Next images"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
          <p className="energy-audit-section-desc-left">
            {auditData.residential_description}
          </p>

          {/* Residential Image Gallery - Max 4 per row */}
          {Array.isArray(auditData.residential_images) && auditData.residential_images.length > 0 && (
            <div className="energy-audit-gallery-grid grid-4col">
              {(auditData.residential_images.length > 4 
                ? auditData.residential_images.slice(sectionIndices.residential || 0, (sectionIndices.residential || 0) + 4) 
                : auditData.residential_images
              ).map((imgItem, idx) => {
                const originalIdx = auditData.residential_images.length > 4 ? (sectionIndices.residential || 0) + idx : idx;
                return (
                  <div 
                    key={originalIdx} 
                    className="energy-audit-gallery-card"
                    onClick={() => openLightbox(auditData.residential_images, originalIdx)}
                  >
                    <img 
                      src={typeof imgItem === 'string' ? imgItem : imgItem.url} 
                      alt={typeof imgItem === 'object' ? (imgItem.alt || `Residential Energy Audit Image ${originalIdx + 1}`) : `Residential Energy Audit Image ${originalIdx + 1}`}
                      className="energy-audit-gallery-img"
                      loading="lazy"
                    />
                    <div className="energy-audit-zoom-icon">
                      <Maximize2 size={18} />
                    </div>
                    <div className="energy-audit-overlay">
                      <span className="energy-audit-caption">
                        {typeof imgItem === 'object' && imgItem.alt ? imgItem.alt : `Residential Audit - Photo ${originalIdx + 1}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── SECTION 02: COMMERCIAL BUILDING ── */}
        <section className="energy-audit-major-section-left" id="energy-audit-commercial-section">
          {/* Commercial Header & Gallery */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="energy-audit-section-header-left">
              <h2 style={{
                fontSize: '26px',
                fontWeight: '700',
                color: '#063B73',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {auditData.commercial_title || 'COMMERCIAL BUILDING'}
              </h2>
              <div style={{ width: '44px', height: '3px', background: '#0057B8', margin: '0 0 16px 0', borderRadius: '2px' }} />
            </div>
            {Array.isArray(auditData.commercial_images) && auditData.commercial_images.length > 4 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  className="section-nav-btn"
                  onClick={() => setSectionIndices(prev => ({ ...prev, commercial: Math.max(prev.commercial - 1, 0) }))}
                  disabled={(sectionIndices.commercial || 0) === 0}
                  aria-label="Previous images"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="section-nav-btn"
                  onClick={() => setSectionIndices(prev => ({ ...prev, commercial: Math.min(prev.commercial + 1, auditData.commercial_images.length - 4) }))}
                  disabled={(sectionIndices.commercial || 0) >= auditData.commercial_images.length - 4}
                  aria-label="Next images"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
          <p className="energy-audit-section-desc-left">
            {auditData.commercial_description}
          </p>

          {/* Commercial Image Gallery - Max 4 per row */}
          {Array.isArray(auditData.commercial_images) && auditData.commercial_images.length > 0 && (
            <div className="energy-audit-gallery-grid grid-4col">
              {(auditData.commercial_images.length > 4 
                ? auditData.commercial_images.slice(sectionIndices.commercial || 0, (sectionIndices.commercial || 0) + 4) 
                : auditData.commercial_images
              ).map((imgItem, idx) => {
                const originalIdx = auditData.commercial_images.length > 4 ? (sectionIndices.commercial || 0) + idx : idx;
                return (
                  <div 
                    key={originalIdx} 
                    className="energy-audit-gallery-card"
                    onClick={() => openLightbox(auditData.commercial_images, originalIdx)}
                  >
                    <img 
                      src={typeof imgItem === 'string' ? imgItem : imgItem.url} 
                      alt={typeof imgItem === 'object' ? (imgItem.alt || `Commercial Energy Audit Image ${originalIdx + 1}`) : `Commercial Energy Audit Image ${originalIdx + 1}`}
                      className="energy-audit-gallery-img"
                      loading="lazy"
                    />
                    <div className="energy-audit-zoom-icon">
                      <Maximize2 size={18} />
                    </div>
                    <div className="energy-audit-overlay">
                      <span className="energy-audit-caption">
                        {typeof imgItem === 'object' && imgItem.alt ? imgItem.alt : `Commercial Audit - Photo ${originalIdx + 1}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Contact Inquiry Box */}
        <div style={{
          padding: '28px 32px',
          background: '#FFFFFF',
          borderLeft: '4px solid #0057B8',
          borderRadius: '12px',
          marginTop: '50px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          border: '1px solid #E2E8F0',
          borderLeftWidth: '4px'
        }}>
          <h4 style={{ margin: 0, color: '#063B73', fontSize: '18px', fontWeight: '700' }}>Inquire About Energy Audit Services</h4>
          <p style={{ margin: '8px 0 0 0', fontSize: '14.5px', color: '#64748B', lineHeight: '1.6' }}>
            Our certified energy auditors (ASHRAE Level 1, 2 & 3 / Certified Energy Managers) identify cost-saving opportunities and optimize building energy performance. Contact our engineering team at <strong>info@bcrescent.com</strong> or call <strong>+974 4463 5250</strong>.
          </p>
        </div>

      </div>

      {/* Lightbox Modal Overlay */}
      {lightboxOpen && currentImage && (
        <div className="energy-audit-lightbox-backdrop" onClick={() => setLightboxOpen(false)}>
          <div className="energy-audit-lightbox-modal" onClick={e => e.stopPropagation()}>
            <div className="energy-audit-lightbox-topbar">
              <span className="energy-audit-lightbox-counter">
                IMAGE {activeImageIndex + 1} / {activeGalleryImages.length}
              </span>
              <button 
                className="energy-audit-lightbox-close-btn" 
                onClick={() => setLightboxOpen(false)}
                aria-label="Close Lightbox"
              >
                <X size={22} />
              </button>
            </div>

            <div className="energy-audit-lightbox-image-wrap">
              <button 
                className="energy-audit-lightbox-nav-btn prev"
                onClick={() => setActiveImageIndex(prev => (prev - 1 + activeGalleryImages.length) % activeGalleryImages.length)}
                aria-label="Previous Image"
              >
                <ChevronLeft size={28} />
              </button>

              <img 
                src={typeof currentImage === 'string' ? currentImage : currentImage.url} 
                alt={typeof currentImage === 'object' ? (currentImage.alt || 'Energy Audit Detail View') : 'Energy Audit Detail View'}
                className="energy-audit-lightbox-img"
              />

              <button 
                className="energy-audit-lightbox-nav-btn next"
                onClick={() => setActiveImageIndex(prev => (prev + 1) % activeGalleryImages.length)}
                aria-label="Next Image"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {typeof currentImage === 'object' && currentImage.alt && (
              <div className="energy-audit-lightbox-caption">
                {currentImage.alt}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
