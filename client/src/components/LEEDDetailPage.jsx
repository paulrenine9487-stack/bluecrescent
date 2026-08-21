import React, { useState, useEffect } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './LEEDDetailPage.css';

const DEFAULT_LEED_CONTENT = {
  page_title: 'LEED',
  introduction: 'Comprehensive LEED sustainability consultancy supporting green building projects across design, construction, and operational lifecycle stages to achieve USGBC certifications.',
  design_title: 'DESIGN',
  design_description: 'LEED support during the design stage focuses on integrating USGBC sustainability prerequisites and credits into early architectural planning, energy modeling, daylighting design, and sustainable material specifications.',
  design_images: [
    { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'LEED BD+C Architectural Design Facilitation', display_order: 1 },
    { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', alt: 'LEED Energy Modeling & Performance Simulation', display_order: 2 },
    { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'LEED Sustainable Building Envelope Design', display_order: 3 },
    { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', alt: 'LEED Integrative Process & Credit Workshop', display_order: 4 }
  ],
  build_title: 'BUILD / CONSTRUCTION',
  build_description: 'During the construction phase, our LEED consultancy ensures strict compliance with construction activity pollution prevention, waste management diversion, indoor air quality management plans, and sustainable material tracking.',
  build_images: [
    { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'LEED Construction Environmental Compliance Auditing', display_order: 1 },
    { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'LEED Waste Diversion & Material Verification', display_order: 2 },
    { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'LEED Construction IAQ Management Inspection', display_order: 3 },
    { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'LEED On-site Construction Monitoring', display_order: 4 }
  ],
  operation_title: 'OPERATION',
  operation_description: 'For operational assets, LEED O+M consultancy focuses on optimizing building energy performance, indoor environmental quality monitoring, water efficiency verification, and continuous performance benchmarking.',
  operation_images: [
    { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'LEED O+M Energy Efficiency Diagnostic Audit', display_order: 1 },
    { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'LEED Facility Performance Optimization', display_order: 2 },
    { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80', alt: 'LEED Indoor Environmental Quality Testing', display_order: 3 },
    { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'LEED Long-term Asset Decarbonization Audit', display_order: 4 }
  ]
};

export default function LEEDDetailPage({ onNavigate }) {
  const [leedData, setLeedData] = useState(DEFAULT_LEED_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionIndices, setSectionIndices] = useState({ design: 0, build: 0, operation: 0 });

  // Lightbox Modal State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeGalleryImages, setActiveGalleryImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchLEEDContent = () => {
    fetch('/api/leed')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setLeedData(prev => ({
            ...prev,
            ...data
          }));
        }
      })
      .catch(err => console.warn('Error fetching LEED content:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchLEEDContent();
    window.addEventListener('leedContentUpdated', fetchLEEDContent);
    return () => window.removeEventListener('leedContentUpdated', fetchLEEDContent);
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
    <div className="leed-detail-container">
      <div className="leed-content-body" style={{ paddingTop: '0px' }}>

        {/* ── TOP PAGE TOPIC HEADER ── */}
        <div className="leed-page-header-clean" style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '900',
            color: '#063B73',
            letterSpacing: '-0.5px',
            margin: '0 0 16px 0'
          }}>
            Sustainability Services ({leedData.page_title || 'LEED'})
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
            {leedData.introduction || 'Comprehensive LEED sustainability consultancy supporting green building projects across design, construction, and operational lifecycle stages to achieve USGBC certifications.'}
          </p>

          {/* Section Separator */}
          <div style={{ height: '1px', background: '#E2E8F0', margin: '36px auto 0 auto', maxWidth: '1000px' }} />
        </div>

        {/* ── SECTION 01: DESIGN ── */}
        <section className="leed-major-section-left" id="leed-design-section">
          {/* Design Header & Gallery */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="leed-section-header-left">
              <h2 style={{
                fontSize: '26px',
                fontWeight: '700',
                color: '#063B73',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {leedData.design_title || 'DESIGN'}
              </h2>
              <div style={{ width: '44px', height: '3px', background: '#0057B8', margin: '0 0 16px 0', borderRadius: '2px' }} />
            </div>
            {Array.isArray(leedData.design_images) && leedData.design_images.length > 4 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  className="section-nav-btn"
                  onClick={() => setSectionIndices(prev => ({ ...prev, design: Math.max(prev.design - 1, 0) }))}
                  disabled={(sectionIndices.design || 0) === 0}
                  aria-label="Previous images"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="section-nav-btn"
                  onClick={() => setSectionIndices(prev => ({ ...prev, design: Math.min(prev.design + 1, leedData.design_images.length - 4) }))}
                  disabled={(sectionIndices.design || 0) >= leedData.design_images.length - 4}
                  aria-label="Next images"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
          <p className="leed-section-desc-left">
            {leedData.design_description}
          </p>

          {/* Design Image Gallery - Max 4 per row */}
          {Array.isArray(leedData.design_images) && leedData.design_images.length > 0 && (
            <div className="leed-gallery-grid grid-4col">
              {(leedData.design_images.length > 4 
                ? leedData.design_images.slice(sectionIndices.design || 0, (sectionIndices.design || 0) + 4) 
                : leedData.design_images
              ).map((imgItem, idx) => {
                const originalIdx = leedData.design_images.length > 4 ? (sectionIndices.design || 0) + idx : idx;
                return (
                  <div 
                    key={originalIdx} 
                    className="leed-gallery-card"
                    onClick={() => openLightbox(leedData.design_images, originalIdx)}
                  >
                    <img 
                      src={typeof imgItem === 'string' ? imgItem : imgItem.url} 
                      alt={typeof imgItem === 'object' ? (imgItem.alt || `LEED Design Image ${originalIdx + 1}`) : `LEED Design Image ${originalIdx + 1}`}
                      className="leed-gallery-img"
                      loading="lazy"
                    />
                    <div className="leed-gallery-zoom-icon">
                      <Maximize2 size={18} />
                    </div>
                    <div className="leed-gallery-overlay">
                      <span className="leed-gallery-caption">
                        {typeof imgItem === 'object' && imgItem.alt ? imgItem.alt : `LEED Design Stage - Photo ${originalIdx + 1}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── SECTION 02: BUILD / CONSTRUCTION ── */}
        <section className="leed-major-section-left" id="leed-build-section">
          {/* Build Header & Gallery */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="leed-section-header-left">
              <h2 style={{
                fontSize: '26px',
                fontWeight: '700',
                color: '#063B73',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {leedData.build_title || 'BUILD / CONSTRUCTION'}
              </h2>
              <div style={{ width: '44px', height: '3px', background: '#0057B8', margin: '0 0 16px 0', borderRadius: '2px' }} />
            </div>
            {Array.isArray(leedData.build_images) && leedData.build_images.length > 4 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  className="section-nav-btn"
                  onClick={() => setSectionIndices(prev => ({ ...prev, build: Math.max(prev.build - 1, 0) }))}
                  disabled={(sectionIndices.build || 0) === 0}
                  aria-label="Previous images"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="section-nav-btn"
                  onClick={() => setSectionIndices(prev => ({ ...prev, build: Math.min(prev.build + 1, leedData.build_images.length - 4) }))}
                  disabled={(sectionIndices.build || 0) >= leedData.build_images.length - 4}
                  aria-label="Next images"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
          <p className="leed-section-desc-left">
            {leedData.build_description}
          </p>

          {/* Build Image Gallery - Max 4 per row */}
          {Array.isArray(leedData.build_images) && leedData.build_images.length > 0 && (
            <div className="leed-gallery-grid grid-4col">
              {(leedData.build_images.length > 4 
                ? leedData.build_images.slice(sectionIndices.build || 0, (sectionIndices.build || 0) + 4) 
                : leedData.build_images
              ).map((imgItem, idx) => {
                const originalIdx = leedData.build_images.length > 4 ? (sectionIndices.build || 0) + idx : idx;
                return (
                  <div 
                    key={originalIdx} 
                    className="leed-gallery-card"
                    onClick={() => openLightbox(leedData.build_images, originalIdx)}
                  >
                    <img 
                      src={typeof imgItem === 'string' ? imgItem : imgItem.url} 
                      alt={typeof imgItem === 'object' ? (imgItem.alt || `LEED Build Image ${originalIdx + 1}`) : `LEED Build Image ${originalIdx + 1}`}
                      className="leed-gallery-img"
                      loading="lazy"
                    />
                    <div className="leed-gallery-zoom-icon">
                      <Maximize2 size={18} />
                    </div>
                    <div className="leed-gallery-overlay">
                      <span className="leed-gallery-caption">
                        {typeof imgItem === 'object' && imgItem.alt ? imgItem.alt : `LEED Construction Stage - Photo ${originalIdx + 1}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── SECTION 03: OPERATION ── */}
        <section className="leed-major-section-left" id="leed-operation-section">
          {/* Operation Header & Gallery */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="leed-section-header-left">
              <h2 style={{
                fontSize: '26px',
                fontWeight: '700',
                color: '#063B73',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {leedData.operation_title || 'OPERATION'}
              </h2>
              <div style={{ width: '44px', height: '3px', background: '#0057B8', margin: '0 0 16px 0', borderRadius: '2px' }} />
            </div>
            {Array.isArray(leedData.operation_images) && leedData.operation_images.length > 4 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  className="section-nav-btn"
                  onClick={() => setSectionIndices(prev => ({ ...prev, operation: Math.max(prev.operation - 1, 0) }))}
                  disabled={(sectionIndices.operation || 0) === 0}
                  aria-label="Previous images"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="section-nav-btn"
                  onClick={() => setSectionIndices(prev => ({ ...prev, operation: Math.min(prev.operation + 1, leedData.operation_images.length - 4) }))}
                  disabled={(sectionIndices.operation || 0) >= leedData.operation_images.length - 4}
                  aria-label="Next images"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
          <p className="leed-section-desc-left">
            {leedData.operation_description}
          </p>

          {/* Operation Image Gallery - Max 4 per row */}
          {Array.isArray(leedData.operation_images) && leedData.operation_images.length > 0 && (
            <div className="leed-gallery-grid grid-4col">
              {(leedData.operation_images.length > 4 
                ? leedData.operation_images.slice(sectionIndices.operation || 0, (sectionIndices.operation || 0) + 4) 
                : leedData.operation_images
              ).map((imgItem, idx) => {
                const originalIdx = leedData.operation_images.length > 4 ? (sectionIndices.operation || 0) + idx : idx;
                return (
                  <div 
                    key={originalIdx} 
                    className="leed-gallery-card"
                    onClick={() => openLightbox(leedData.operation_images, originalIdx)}
                  >
                    <img 
                      src={typeof imgItem === 'string' ? imgItem : imgItem.url} 
                      alt={typeof imgItem === 'object' ? (imgItem.alt || `LEED Operation Image ${originalIdx + 1}`) : `LEED Operation Image ${originalIdx + 1}`}
                      className="leed-gallery-img"
                      loading="lazy"
                    />
                    <div className="leed-gallery-zoom-icon">
                      <Maximize2 size={18} />
                    </div>
                    <div className="leed-gallery-overlay">
                      <span className="leed-gallery-caption">
                        {typeof imgItem === 'object' && imgItem.alt ? imgItem.alt : `LEED Operational Stage - Photo ${originalIdx + 1}`}
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
          <h4 style={{ margin: 0, color: '#063B73', fontSize: '18px', fontWeight: '700' }}>Inquire About LEED Sustainability Certification</h4>
          <p style={{ margin: '8px 0 0 0', fontSize: '14.5px', color: '#64748B', lineHeight: '1.6' }}>
            Our certified LEED Accredited Professionals (LEED AP BD+C / O+M) guide your project teams seamlessly from initial feasibility assessment through credit submission and final USGBC certification. Contact our engineering consultancy team at <strong>info@bcrescent.com</strong> or call <strong>+974 4463 5250</strong>.
          </p>
        </div>

      </div>

      {/* Lightbox Modal Overlay */}
      {lightboxOpen && currentImage && (
        <div className="leed-lightbox-backdrop" onClick={() => setLightboxOpen(false)}>
          <div className="leed-lightbox-modal" onClick={e => e.stopPropagation()}>
            <div className="leed-lightbox-topbar">
              <span className="leed-lightbox-counter">
                IMAGE {activeImageIndex + 1} / {activeGalleryImages.length}
              </span>
              <button 
                className="leed-lightbox-close-btn" 
                onClick={() => setLightboxOpen(false)}
                aria-label="Close Lightbox"
              >
                <X size={22} />
              </button>
            </div>

            <div className="leed-lightbox-image-wrap">
              <button 
                className="leed-lightbox-nav-btn prev"
                onClick={() => setActiveImageIndex(prev => (prev - 1 + activeGalleryImages.length) % activeGalleryImages.length)}
                aria-label="Previous Image"
              >
                <ChevronLeft size={28} />
              </button>

              <img 
                src={typeof currentImage === 'string' ? currentImage : currentImage.url} 
                alt={typeof currentImage === 'object' ? (currentImage.alt || 'LEED Detail View') : 'LEED Detail View'}
                className="leed-lightbox-img"
              />

              <button 
                className="leed-lightbox-nav-btn next"
                onClick={() => setActiveImageIndex(prev => (prev + 1) % activeGalleryImages.length)}
                aria-label="Next Image"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {typeof currentImage === 'object' && currentImage.alt && (
              <div className="leed-lightbox-caption">
                {currentImage.alt}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
