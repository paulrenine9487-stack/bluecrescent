import React, { useState, useEffect } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './GSASDetailPage.css';

const DEFAULT_GSAS_CONTENT = {
  page_title: 'GSAS',
  introduction: 'Professional GSAS sustainability consultancy supporting projects across design, construction and operational stages.',
  design_title: 'DESIGN',
  design_description: 'GSAS support during the design stage focuses on integrating sustainability requirements into project planning and design development. Our consultancy supports project teams in addressing GSAS criteria, sustainability strategies and documentation requirements from the early stages of design.',
  design_images: [
    { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Design Architectural Energy Modeling', display_order: 1 },
    { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Design Stage Daylight Simulation', display_order: 2 },
    { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Green Building Envelope Design', display_order: 3 },
    { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Sustainability Design Workshop', display_order: 4 }
  ],
  build_title: 'BUILD / CONSTRUCTION',
  build_description: 'During construction, GSAS consultancy supports project teams in implementing sustainability requirements and maintaining alignment with applicable project objectives and documentation through the construction process.',
  build_images: [
    { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Construction Site Sustainability Inspection', display_order: 1 },
    { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Waste Management & Environmental Auditing', display_order: 2 },
    { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Materials Compliance Verification', display_order: 3 },
    { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'GSAS On-site Construction Monitoring', display_order: 4 }
  ],
  operation_title: 'OPERATION',
  operation_description: 'At the operational stage, GSAS support focuses on maintaining sustainable building performance and supporting applicable operational requirements, documentation and sustainability objectives.',
  operation_images: [
    { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Operational Energy Diagnostic Audit', display_order: 1 },
    { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Facility Performance Management', display_order: 2 },
    { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Indoor Environmental Quality Testing', display_order: 3 },
    { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Long-term Decarbonization Monitoring', display_order: 4 }
  ]
};

export default function GSASDetailPage({ onNavigate }) {
  const [gsasData, setGsasData] = useState(DEFAULT_GSAS_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionIndices, setSectionIndices] = useState({ design: 0, build: 0, operation: 0 });

  // Lightbox Modal State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeGalleryImages, setActiveGalleryImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchGSASContent = () => {
    fetch('/api/gsas')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setGsasData(prev => ({
            ...prev,
            ...data
          }));
        }
      })
      .catch(err => console.warn('Error fetching GSAS content:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchGSASContent();
    window.addEventListener('gsasContentUpdated', fetchGSASContent);
    return () => window.removeEventListener('gsasContentUpdated', fetchGSASContent);
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
    <div className="gsas-detail-container">
      <div className="gsas-content-body" style={{ paddingTop: '0px' }}>

        {/* ── TOP PAGE TOPIC HEADER ── */}
        <div className="gsas-page-header-clean" style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '900',
            color: '#063B73',
            letterSpacing: '-0.5px',
            margin: '0 0 16px 0'
          }}>
            Sustainability Services ({gsasData.page_title || 'GSAS'})
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
            {gsasData.introduction || 'Professional GSAS sustainability consultancy supporting projects across design, construction and operational stages.'}
          </p>

          {/* Section Separator */}
          <div style={{ height: '1px', background: '#E2E8F0', margin: '36px auto 0 auto', maxWidth: '1000px' }} />
        </div>

        {/* ── SECTION 01: DESIGN ── */}
        <section className="gsas-major-section-left" id="gsas-design-section">
          {/* Design Header & Gallery */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="gsas-section-header-left">
              <h2 style={{
                fontSize: '26px',
                fontWeight: '700',
                color: '#063B73',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {gsasData.design_title || 'DESIGN'}
              </h2>
              <div style={{ width: '44px', height: '3px', background: '#0057B8', margin: '0 0 16px 0', borderRadius: '2px' }} />
            </div>
            {Array.isArray(gsasData.design_images) && gsasData.design_images.length > 4 && (
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
                  onClick={() => setSectionIndices(prev => ({ ...prev, design: Math.min(prev.design + 1, gsasData.design_images.length - 4) }))}
                  disabled={(sectionIndices.design || 0) >= gsasData.design_images.length - 4}
                  aria-label="Next images"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
          <p className="gsas-section-desc-left">
            {gsasData.design_description}
          </p>

          {/* Design Image Gallery - Max 4 per row */}
          {Array.isArray(gsasData.design_images) && gsasData.design_images.length > 0 && (
            <div className="gsas-gallery-grid grid-4col">
              {(gsasData.design_images.length > 4 
                ? gsasData.design_images.slice(sectionIndices.design || 0, (sectionIndices.design || 0) + 4) 
                : gsasData.design_images
              ).map((imgItem, idx) => {
                const originalIdx = gsasData.design_images.length > 4 ? (sectionIndices.design || 0) + idx : idx;
                return (
                  <div 
                    key={originalIdx} 
                    className="gsas-gallery-card"
                    onClick={() => openLightbox(gsasData.design_images, originalIdx)}
                  >
                    <img 
                      src={typeof imgItem === 'string' ? imgItem : imgItem.url} 
                      alt={typeof imgItem === 'object' ? (imgItem.alt || `GSAS Design Image ${originalIdx + 1}`) : `GSAS Design Image ${originalIdx + 1}`}
                      className="gsas-gallery-img"
                      loading="lazy"
                    />
                    <div className="gsas-gallery-zoom-icon">
                      <Maximize2 size={18} />
                    </div>
                    <div className="gsas-gallery-overlay">
                      <span className="gsas-gallery-caption">
                        {typeof imgItem === 'object' && imgItem.alt ? imgItem.alt : `GSAS Design Stage - Photo ${originalIdx + 1}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── SECTION 02: BUILD / CONSTRUCTION ── */}
        <section className="gsas-major-section-left" id="gsas-build-section">
          {/* Build Header & Gallery */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="gsas-section-header-left">
              <h2 style={{
                fontSize: '26px',
                fontWeight: '700',
                color: '#063B73',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {gsasData.build_title || 'BUILD / CONSTRUCTION'}
              </h2>
              <div style={{ width: '44px', height: '3px', background: '#0057B8', margin: '0 0 16px 0', borderRadius: '2px' }} />
            </div>
            {Array.isArray(gsasData.build_images) && gsasData.build_images.length > 4 && (
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
                  onClick={() => setSectionIndices(prev => ({ ...prev, build: Math.min(prev.build + 1, gsasData.build_images.length - 4) }))}
                  disabled={(sectionIndices.build || 0) >= gsasData.build_images.length - 4}
                  aria-label="Next images"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
          <p className="gsas-section-desc-left">
            {gsasData.build_description}
          </p>

          {/* Build Image Gallery - Max 4 per row */}
          {Array.isArray(gsasData.build_images) && gsasData.build_images.length > 0 && (
            <div className="gsas-gallery-grid grid-4col">
              {(gsasData.build_images.length > 4 
                ? gsasData.build_images.slice(sectionIndices.build || 0, (sectionIndices.build || 0) + 4) 
                : gsasData.build_images
              ).map((imgItem, idx) => {
                const originalIdx = gsasData.build_images.length > 4 ? (sectionIndices.build || 0) + idx : idx;
                return (
                  <div 
                    key={originalIdx} 
                    className="gsas-gallery-card"
                    onClick={() => openLightbox(gsasData.build_images, originalIdx)}
                  >
                    <img 
                      src={typeof imgItem === 'string' ? imgItem : imgItem.url} 
                      alt={typeof imgItem === 'object' ? (imgItem.alt || `GSAS Build Image ${originalIdx + 1}`) : `GSAS Build Image ${originalIdx + 1}`}
                      className="gsas-gallery-img"
                      loading="lazy"
                    />
                    <div className="gsas-gallery-zoom-icon">
                      <Maximize2 size={18} />
                    </div>
                    <div className="gsas-gallery-overlay">
                      <span className="gsas-gallery-caption">
                        {typeof imgItem === 'object' && imgItem.alt ? imgItem.alt : `GSAS Construction Stage - Photo ${originalIdx + 1}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── SECTION 03: OPERATION ── */}
        <section className="gsas-major-section-left" id="gsas-operation-section">
          {/* Operation Header & Gallery */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="gsas-section-header-left">
              <h2 style={{
                fontSize: '26px',
                fontWeight: '700',
                color: '#063B73',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {gsasData.operation_title || 'OPERATION'}
              </h2>
              <div style={{ width: '44px', height: '3px', background: '#0057B8', margin: '0 0 16px 0', borderRadius: '2px' }} />
            </div>
            {Array.isArray(gsasData.operation_images) && gsasData.operation_images.length > 4 && (
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
                  onClick={() => setSectionIndices(prev => ({ ...prev, operation: Math.min(prev.operation + 1, gsasData.operation_images.length - 4) }))}
                  disabled={(sectionIndices.operation || 0) >= gsasData.operation_images.length - 4}
                  aria-label="Next images"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
          <p className="gsas-section-desc-left">
            {gsasData.operation_description}
          </p>

          {/* Operation Image Gallery - Max 4 per row */}
          {Array.isArray(gsasData.operation_images) && gsasData.operation_images.length > 0 && (
            <div className="gsas-gallery-grid grid-4col">
              {(gsasData.operation_images.length > 4 
                ? gsasData.operation_images.slice(sectionIndices.operation || 0, (sectionIndices.operation || 0) + 4) 
                : gsasData.operation_images
              ).map((imgItem, idx) => {
                const originalIdx = gsasData.operation_images.length > 4 ? (sectionIndices.operation || 0) + idx : idx;
                return (
                  <div 
                    key={originalIdx} 
                    className="gsas-gallery-card"
                    onClick={() => openLightbox(gsasData.operation_images, originalIdx)}
                  >
                    <img 
                      src={typeof imgItem === 'string' ? imgItem : imgItem.url} 
                      alt={typeof imgItem === 'object' ? (imgItem.alt || `GSAS Operation Image ${originalIdx + 1}`) : `GSAS Operation Image ${originalIdx + 1}`}
                      className="gsas-gallery-img"
                      loading="lazy"
                    />
                    <div className="gsas-gallery-zoom-icon">
                      <Maximize2 size={18} />
                    </div>
                    <div className="gsas-gallery-overlay">
                      <span className="gsas-gallery-caption">
                        {typeof imgItem === 'object' && imgItem.alt ? imgItem.alt : `GSAS Operation Stage - Photo ${originalIdx + 1}`}
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
          <h4 style={{ margin: 0, color: '#063B73', fontSize: '18px', fontWeight: '700' }}>Inquire About GSAS Sustainability Certification</h4>
          <p style={{ margin: '8px 0 0 0', fontSize: '14.5px', color: '#64748B', lineHeight: '1.6' }}>
            Our certified GSAS sustainability assessors guide your projects seamlessly from early concept design through construction verification to final asset commissioning. Contact our engineering consultancy team at <strong>info@bcrescent.com</strong> or call <strong>+974 4463 5250</strong>.
          </p>
        </div>

      </div>

      {/* Lightbox Modal Overlay */}
      {lightboxOpen && currentImage && (
        <div className="gsas-lightbox-backdrop" onClick={() => setLightboxOpen(false)}>
          <div className="gsas-lightbox-modal" onClick={e => e.stopPropagation()}>
            <div className="gsas-lightbox-topbar">
              <span className="gsas-lightbox-counter">
                IMAGE {activeImageIndex + 1} / {activeGalleryImages.length}
              </span>
              <button 
                className="gsas-lightbox-close-btn" 
                onClick={() => setLightboxOpen(false)}
                aria-label="Close Lightbox"
              >
                <X size={22} />
              </button>
            </div>

            <div className="gsas-lightbox-image-wrap">
              <button 
                className="gsas-lightbox-nav-btn prev"
                onClick={() => setActiveImageIndex(prev => (prev - 1 + activeGalleryImages.length) % activeGalleryImages.length)}
                aria-label="Previous Image"
              >
                <ChevronLeft size={28} />
              </button>

              <img 
                src={typeof currentImage === 'string' ? currentImage : currentImage.url} 
                alt={typeof currentImage === 'object' ? (currentImage.alt || 'GSAS Detail View') : 'GSAS Detail View'}
                className="gsas-lightbox-img"
              />

              <button 
                className="gsas-lightbox-nav-btn next"
                onClick={() => setActiveImageIndex(prev => (prev + 1) % activeGalleryImages.length)}
                aria-label="Next Image"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {typeof currentImage === 'object' && currentImage.alt && (
              <div className="gsas-lightbox-caption">
                {currentImage.alt}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
