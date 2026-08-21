import React, { useState, useEffect } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './EnvironmentalDetailPage.css';

const DEFAULT_ENVIRONMENTAL_CONTENT = {
  page_title: 'ENVIRONMENTAL',
  introduction: 'Comprehensive Environmental consultancy services specializing in environmental impact assessments, real-time noise monitoring, carbon footprint auditing, and sustainable decarbonization strategies.',
  noise_title: 'NOISE MONITORING',
  noise_description: 'Continuous environmental noise monitoring, acoustic modeling, baseline sound level measurement, and noise mitigation planning for construction sites, industrial facilities, and urban developments.',
  noise_images: [
    { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'Acoustic Sound Level Sensor & Noise Meter Field Audit', display_order: 1 },
    { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'Environmental Noise Compliance Assessment Site', display_order: 2 },
    { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'Construction Boundary Sound Vibration Monitoring', display_order: 3 },
    { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'Industrial Environmental Acoustic Audit Equipment', display_order: 4 }
  ],
  carbon_title: 'CARBON MANAGEMENT',
  carbon_description: 'Strategic carbon management services including Scope 1, 2, and 3 greenhouse gas (GHG) accounting, organizational carbon footprint auditing, life cycle assessments (LCA), and net-zero decarbonization roadmaps.',
  carbon_images: [
    { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Carbon Footprint & Scope 1 2 3 Accounting Diagnostic', display_order: 1 },
    { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'Decarbonization Roadmap & Clean Energy Transition', display_order: 2 },
    { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80', alt: 'GHG Emission Inventory & Sustainability Audit', display_order: 3 },
    { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'Corporate Net-Zero Carbon Strategy Assessment', display_order: 4 }
  ]
};

export default function EnvironmentalDetailPage({ onNavigate }) {
  const [envData, setEnvData] = useState(DEFAULT_ENVIRONMENTAL_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionIndices, setSectionIndices] = useState({ noise: 0, carbon: 0 });

  // Lightbox Modal State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeGalleryImages, setActiveGalleryImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchEnvironmentalContent = () => {
    fetch('/api/environmental')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setEnvData(prev => ({
            ...prev,
            ...data
          }));
        }
      })
      .catch(err => console.warn('Error fetching Environmental content:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchEnvironmentalContent();
    window.addEventListener('environmentalContentUpdated', fetchEnvironmentalContent);
    return () => window.removeEventListener('environmentalContentUpdated', fetchEnvironmentalContent);
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
    <div className="environmental-container">
      <div className="environmental-content-body" style={{ paddingTop: '0px' }}>

        {/* ── TOP PAGE TOPIC HEADER ── */}
        <div className="environmental-page-header-clean" style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '900',
            color: '#063B73',
            letterSpacing: '-0.5px',
            margin: '0 0 16px 0'
          }}>
            Sustainability Services ({envData.page_title || 'Environmental'})
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
            {envData.introduction || 'Comprehensive Environmental consultancy services specializing in environmental impact assessments, real-time noise monitoring, carbon footprint auditing, and sustainable decarbonization strategies.'}
          </p>

          {/* Section Separator */}
          <div style={{ height: '1px', background: '#E2E8F0', margin: '36px auto 0 auto', maxWidth: '1000px' }} />
        </div>

        {/* ── SECTION 01: NOISE MONITORING ── */}
        <section className="environmental-major-section-left" id="environmental-noise-section">
          {/* Noise Header & Gallery */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="environmental-section-header-left">
              <h2 style={{
                fontSize: '26px',
                fontWeight: '700',
                color: '#063B73',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {envData.noise_title || 'NOISE MONITORING'}
              </h2>
              <div style={{ width: '44px', height: '3px', background: '#0057B8', margin: '0 0 16px 0', borderRadius: '2px' }} />
            </div>
            {Array.isArray(envData.noise_images) && envData.noise_images.length > 4 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  className="section-nav-btn"
                  onClick={() => setSectionIndices(prev => ({ ...prev, noise: Math.max(prev.noise - 1, 0) }))}
                  disabled={(sectionIndices.noise || 0) === 0}
                  aria-label="Previous images"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="section-nav-btn"
                  onClick={() => setSectionIndices(prev => ({ ...prev, noise: Math.min(prev.noise + 1, envData.noise_images.length - 4) }))}
                  disabled={(sectionIndices.noise || 0) >= envData.noise_images.length - 4}
                  aria-label="Next images"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
          <p className="environmental-section-desc-left">
            {envData.noise_description}
          </p>

          {/* Noise Monitoring Image Gallery - Max 4 per row */}
          {Array.isArray(envData.noise_images) && envData.noise_images.length > 0 && (
            <div className="environmental-gallery-grid grid-4col">
              {(envData.noise_images.length > 4 
                ? envData.noise_images.slice(sectionIndices.noise || 0, (sectionIndices.noise || 0) + 4) 
                : envData.noise_images
              ).map((imgItem, idx) => {
                const originalIdx = envData.noise_images.length > 4 ? (sectionIndices.noise || 0) + idx : idx;
                return (
                  <div 
                    key={originalIdx} 
                    className="environmental-gallery-card"
                    onClick={() => openLightbox(envData.noise_images, originalIdx)}
                  >
                    <img 
                      src={typeof imgItem === 'string' ? imgItem : imgItem.url} 
                      alt={typeof imgItem === 'object' ? (imgItem.alt || `Noise Monitoring Image ${originalIdx + 1}`) : `Noise Monitoring Image ${originalIdx + 1}`}
                      className="environmental-gallery-img"
                      loading="lazy"
                    />
                    <div className="environmental-zoom-icon">
                      <Maximize2 size={18} />
                    </div>
                    <div className="environmental-gallery-overlay">
                      <span className="environmental-caption">
                        {typeof imgItem === 'object' && imgItem.alt ? imgItem.alt : `Noise Monitoring - Photo ${originalIdx + 1}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── SECTION 02: CARBON MANAGEMENT ── */}
        <section className="environmental-major-section-left" id="environmental-carbon-section">
          {/* Carbon Header & Gallery */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="environmental-section-header-left">
              <h2 style={{
                fontSize: '26px',
                fontWeight: '700',
                color: '#063B73',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {envData.carbon_title || 'CARBON MANAGEMENT'}
              </h2>
              <div style={{ width: '44px', height: '3px', background: '#0057B8', margin: '0 0 16px 0', borderRadius: '2px' }} />
            </div>
            {Array.isArray(envData.carbon_images) && envData.carbon_images.length > 4 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  className="section-nav-btn"
                  onClick={() => setSectionIndices(prev => ({ ...prev, carbon: Math.max(prev.carbon - 1, 0) }))}
                  disabled={(sectionIndices.carbon || 0) === 0}
                  aria-label="Previous images"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="section-nav-btn"
                  onClick={() => setSectionIndices(prev => ({ ...prev, carbon: Math.min(prev.carbon + 1, envData.carbon_images.length - 4) }))}
                  disabled={(sectionIndices.carbon || 0) >= envData.carbon_images.length - 4}
                  aria-label="Next images"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
          <p className="environmental-section-desc-left">
            {envData.carbon_description}
          </p>

          {/* Carbon Management Image Gallery - Max 4 per row */}
          {Array.isArray(envData.carbon_images) && envData.carbon_images.length > 0 && (
            <div className="environmental-gallery-grid grid-4col">
              {(envData.carbon_images.length > 4 
                ? envData.carbon_images.slice(sectionIndices.carbon || 0, (sectionIndices.carbon || 0) + 4) 
                : envData.carbon_images
              ).map((imgItem, idx) => {
                const originalIdx = envData.carbon_images.length > 4 ? (sectionIndices.carbon || 0) + idx : idx;
                return (
                  <div 
                    key={originalIdx} 
                    className="environmental-gallery-card"
                    onClick={() => openLightbox(envData.carbon_images, originalIdx)}
                  >
                    <img 
                      src={typeof imgItem === 'string' ? imgItem : imgItem.url} 
                      alt={typeof imgItem === 'object' ? (imgItem.alt || `Carbon Management Image ${originalIdx + 1}`) : `Carbon Management Image ${originalIdx + 1}`}
                      className="environmental-gallery-img"
                      loading="lazy"
                    />
                    <div className="environmental-zoom-icon">
                      <Maximize2 size={18} />
                    </div>
                    <div className="environmental-gallery-overlay">
                      <span className="environmental-caption">
                        {typeof imgItem === 'object' && imgItem.alt ? imgItem.alt : `Carbon Management - Photo ${originalIdx + 1}`}
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
          <h4 style={{ margin: 0, color: '#063B73', fontSize: '18px', fontWeight: '700' }}>Inquire About Environmental & Carbon Management Services</h4>
          <p style={{ margin: '8px 0 0 0', fontSize: '14.5px', color: '#64748B', lineHeight: '1.6' }}>
            Our environmental specialists and carbon auditors assist organization and construction teams in achieving environmental compliance and net-zero carbon targets. Contact our engineering team at <strong>info@bcrescent.com</strong> or call <strong>+974 4463 5250</strong>.
          </p>
        </div>

      </div>

      {/* Lightbox Modal Overlay */}
      {lightboxOpen && currentImage && (
        <div className="environmental-lightbox-backdrop" onClick={() => setLightboxOpen(false)}>
          <div className="environmental-lightbox-modal" onClick={e => e.stopPropagation()}>
            <div className="environmental-lightbox-topbar">
              <span className="environmental-lightbox-counter">
                IMAGE {activeImageIndex + 1} / {activeGalleryImages.length}
              </span>
              <button 
                className="environmental-lightbox-close-btn" 
                onClick={() => setLightboxOpen(false)}
                aria-label="Close Lightbox"
              >
                <X size={22} />
              </button>
            </div>

            <div className="environmental-lightbox-image-wrap">
              <button 
                className="environmental-lightbox-nav-btn prev"
                onClick={() => setActiveImageIndex(prev => (prev - 1 + activeGalleryImages.length) % activeGalleryImages.length)}
                aria-label="Previous Image"
              >
                <ChevronLeft size={28} />
              </button>

              <img 
                src={typeof currentImage === 'string' ? currentImage : currentImage.url} 
                alt={typeof currentImage === 'object' ? (currentImage.alt || 'Environmental Detail View') : 'Environmental Detail View'}
                className="environmental-lightbox-img"
              />

              <button 
                className="environmental-lightbox-nav-btn next"
                onClick={() => setActiveImageIndex(prev => (prev + 1) % activeGalleryImages.length)}
                aria-label="Next Image"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {typeof currentImage === 'object' && currentImage.alt && (
              <div className="environmental-lightbox-caption">
                {currentImage.alt}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
