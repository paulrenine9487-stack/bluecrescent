import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './LaserScanningDetailPage.css';

export default function LaserScanningDetailPage({ onNavigate }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sectionIndices, setSectionIndices] = useState({});
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0
  });

  useEffect(() => {
    fetchContent();
    window.addEventListener('laserScanningContentUpdated', fetchContent);
    return () => window.removeEventListener('laserScanningContentUpdated', fetchContent);
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/laser-scanning');
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      }
    } catch (err) {
      console.error('Error fetching Laser Scanning content:', err);
    } finally {
      setLoading(false);
    }
  };

  const defaultBuildingImages = [
    { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'Commercial High-Rise Architectural 3D Laser Scanning Audit', display_order: 1 },
    { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'Building Interior MEP Pipe & Duct Terrestrial Laser Scan', display_order: 2 },
    { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'Historic Structure Facade & As-Built Point Cloud Survey', display_order: 3 },
    { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', alt: 'Healthcare Facility Interior Spatial Scanning & As-Built', display_order: 4 }
  ];

  const defaultInfrastructureImages = [
    { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'Civil Bridge Infrastructure 3D LiDAR Survey Inspection', display_order: 1 },
    { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'Industrial Utility Pipeline & Plant Reality Capture', display_order: 2 },
    { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Highway & Transportation Corridor Point Cloud Scan', display_order: 3 },
    { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'Tunnel & Heavy Substructure Dimensional Verification', display_order: 4 }
  ];

  const defaultRecapImages = [
    { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Autodesk ReCap Pro Point Cloud Processing & Alignment', display_order: 1 },
    { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: '3D Terrestrial Scan Point Cloud Colorization & Cleaning', display_order: 2 },
    { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'Georeferenced Target Point Cloud Control Registration', display_order: 3 },
    { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'Point Cloud Mesh Surface Reconstruction & Quality Audit', display_order: 4 }
  ];

  const defaultScanToBimImages = [
    { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', alt: 'Point Cloud to Revit Parametric BIM Model Conversion', display_order: 1 },
    { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'MEP As-Built Pipe & Conduit Scan-to-BIM Modeling', display_order: 2 },
    { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'Structural Clash Detection Scan vs Design Model Audit', display_order: 3 },
    { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'Asset Information Model (AIM) Scan-to-BIM Integration', display_order: 4 }
  ];

  const buildingImages = (content && content.building_images && content.building_images.length > 0)
    ? content.building_images
    : defaultBuildingImages;

  const infrastructureImages = (content && content.infrastructure_images && content.infrastructure_images.length > 0)
    ? content.infrastructure_images
    : defaultInfrastructureImages;

  const recapImages = (content && content.recap_images && content.recap_images.length > 0)
    ? content.recap_images
    : defaultRecapImages;

  const scanToBimImages = (content && content.scan_to_bim_images && content.scan_to_bim_images.length > 0)
    ? content.scan_to_bim_images
    : defaultScanToBimImages;

  const sections = [
    {
      key: 'building',
      title: (content && content.building_title) || 'BUILDING',
      desc: (content && content.building_description) || 'Comprehensive 3D laser scanning for commercial, residential, healthcare, and historic buildings. Captures millimeter-accurate spatial geometry, MEP installations, structural components, and complex facades to deliver precise as-built point cloud datasets.',
      images: buildingImages
    },
    {
      key: 'infrastructure',
      title: (content && content.infrastructure_title) || 'INFRASTRUCTURE',
      desc: (content && content.infrastructure_description) || 'Advanced 3D reality capture for major civil infrastructure including bridges, tunnels, highways, railway corridors, utility networks, and industrial plants. Ensures sub-centimeter accuracy for structural integrity assessment and expansion planning.',
      images: infrastructureImages
    },
    {
      key: 'recap',
      title: (content && content.recap_title) || 'RECAP WORK',
      desc: (content && content.recap_description) || 'End-to-end point cloud registration, indexing, noise filtration, georeferencing, and Autodesk ReCap project compilation. Transforms raw mobile, terrestrial, and aerial scanner files into structured, unified coordinate project files ready for engineering design.',
      images: recapImages
    },
    {
      key: 'scan_to_bim',
      title: (content && content.scan_to_bim_title) || 'SCAN TO BIM',
      desc: (content && content.scan_to_bim_description) || 'Converting registered point cloud data into intelligent LOD 100 to LOD 400 Revit BIM models. Enables precise clash detection, facility renovation planning, MEP coordination, digital twin asset management, and verified as-built modeling.',
      images: scanToBimImages
    }
  ];

  const openLightbox = (imageList, index) => {
    setLightbox({
      isOpen: true,
      images: imageList,
      currentIndex: index
    });
  };

  const closeLightbox = () => {
    setLightbox(prev => ({ ...prev, isOpen: false }));
  };

  const nextLightboxImage = () => {
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const prevLightboxImage = () => {
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
    }));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox.isOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightboxImage();
      if (e.key === 'ArrowLeft') prevLightboxImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox.isOpen]);

  if (loading) {
    return (
      <div className="laser-scanning-detail-wrapper">
        <div className="laser-scanning-detail-container" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '16px', color: '#64748B' }}>Loading Laser Scanning Services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="laser-scanning-detail-wrapper">
      <div className="laser-scanning-detail-container">
        
        {/* Main Category Badge & Page Title */}
        <div className="laser-scanning-header-block">
          <h1 className="laser-scanning-main-title">Engineering Services ({(content && content.page_title) || 'Laser Scanning Services'})</h1>
          <div className="laser-scanning-title-bar" />
          {content && content.introduction && (
            <p className="laser-scanning-intro-text">{content.introduction}</p>
          )}
        </div>

        {/* Sections */}
        {sections.map((sec) => {
          const startIndex = sectionIndices[sec.key] || 0;
          const hasMultiplePages = sec.images.length > 4;
          const visibleImages = hasMultiplePages ? sec.images.slice(startIndex, startIndex + 4) : sec.images;

          return (
            <section key={sec.key} className="laser-scanning-section-block">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h2 className="laser-scanning-section-title" style={{ margin: 0 }}>{sec.title}</h2>
                  <div className="laser-scanning-section-bar" />
                </div>
                {hasMultiplePages && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button
                      className="section-nav-btn"
                      onClick={() => setSectionIndices(prev => ({ ...prev, [sec.key]: Math.max((prev[sec.key] || 0) - 1, 0) }))}
                      disabled={startIndex === 0}
                      aria-label="Previous images"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      className="section-nav-btn"
                      onClick={() => setSectionIndices(prev => ({ ...prev, [sec.key]: Math.min((prev[sec.key] || 0) + 1, sec.images.length - 4) }))}
                      disabled={startIndex >= sec.images.length - 4}
                      aria-label="Next images"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>

              {sec.desc && <p className="laser-scanning-section-desc">{sec.desc}</p>}

              {/* Image Grid - 1 Row (Max 4 Images) */}
              <div className="laser-scanning-image-grid">
                {visibleImages.map((imgObj, idx) => {
                  const originalIdx = hasMultiplePages ? startIndex + idx : idx;
                  const imgUrl = typeof imgObj === 'string' ? imgObj : (imgObj.url || '');
                  const imgAlt = typeof imgObj === 'object' && imgObj.alt ? imgObj.alt : `Laser Scanning ${sec.title} Image ${originalIdx + 1}`;
                  return (
                    <div
                      key={originalIdx}
                      className="laser-scanning-image-card"
                      onClick={() => openLightbox(sec.images, originalIdx)}
                    >
                      <img src={imgUrl} alt={imgAlt} className="laser-scanning-card-img" />
                      <div className="laser-scanning-card-overlay">
                        <span className="laser-scanning-overlay-text">{imgAlt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

      </div>

      {/* Lightbox Modal */}
      {lightbox.isOpen && lightbox.images.length > 0 && (
        <div className="laser-scanning-lightbox-overlay" onClick={closeLightbox}>
          <div className="laser-scanning-lightbox-container" onClick={e => e.stopPropagation()}>
            <button className="laser-scanning-lightbox-close" onClick={closeLightbox}>&times;</button>
            
            <button className="laser-scanning-lightbox-btn laser-scanning-lightbox-prev" onClick={prevLightboxImage} aria-label="Previous image">
              <ChevronLeft size={22} />
            </button>
            <button className="laser-scanning-lightbox-btn laser-scanning-lightbox-next" onClick={nextLightboxImage} aria-label="Next image">
              <ChevronRight size={22} />
            </button>

            <div className="laser-scanning-lightbox-img-wrap">
              <img
                src={typeof lightbox.images[lightbox.currentIndex] === 'string'
                  ? lightbox.images[lightbox.currentIndex]
                  : (lightbox.images[lightbox.currentIndex].url || '')}
                alt={typeof lightbox.images[lightbox.currentIndex] === 'object'
                  ? lightbox.images[lightbox.currentIndex].alt
                  : ''}
                className="laser-scanning-lightbox-img"
              />
            </div>

            {typeof lightbox.images[lightbox.currentIndex] === 'object' && lightbox.images[lightbox.currentIndex].alt && (
              <div className="laser-scanning-lightbox-caption">
                {lightbox.images[lightbox.currentIndex].alt}
              </div>
            )}

            <div className="laser-scanning-lightbox-counter">
              IMAGE {lightbox.currentIndex + 1} / {lightbox.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
