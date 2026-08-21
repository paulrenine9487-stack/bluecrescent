import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CADDetailPage.css';

export default function CADDetailPage({ onNavigate }) {
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
    window.addEventListener('cadContentUpdated', fetchContent);
    return () => window.removeEventListener('cadContentUpdated', fetchContent);
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/cad');
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      }
    } catch (err) {
      console.error('Error fetching CAD content:', err);
    } finally {
      setLoading(false);
    }
  };

  const defaultBuildingImages = [
    { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', alt: 'Architectural CAD Elevation & Floor Plan Blueprint', display_order: 1 },
    { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'Structural Steel Framing & Rebar CAD Shop Drawings', display_order: 2 },
    { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'Interior Architecture Fit-out Layout & Reflected Ceiling Plan', display_order: 3 },
    { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'HVAC Mechanical Ductwork & Pipe Schematic CAD Drafting', display_order: 4 }
  ];

  const defaultInfraImages = [
    { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'Civil Landscaping & Site Plan CAD Layout', display_order: 1 },
    { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'Highway Road Network Cross-Section CAD Design', display_order: 2 },
    { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Urban Street Lighting & Cable Network CAD Plan', display_order: 3 },
    { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'Underground Stormwater & Utility CAD Mapping', display_order: 4 }
  ];

  // Section data array for Building and Infrastructure sub-topics
  const buildingSubTopics = [
    {
      key: 'architecture',
      title: (content && content.arch_title) || 'ARCHITECTURE',
      desc: (content && content.arch_description) || 'Precision 2D/3D architectural CAD drafting, floor plans, building elevations, cross-sections, and detailed construction documentation complying with local authority standards.',
      images: (content && content.arch_images && content.arch_images.length > 0) ? content.arch_images : defaultBuildingImages
    },
    {
      key: 'structure',
      title: (content && content.struct_title) || 'STRUCTURE',
      desc: (content && content.struct_description) || 'Comprehensive structural CAD shop drawings including reinforced concrete detailing, structural steel framing, foundation layouts, and bar bending schedules (BBS).',
      images: (content && content.struct_images && content.struct_images.length > 0) ? content.struct_images : defaultBuildingImages
    },
    {
      key: 'interior',
      title: (content && content.interior_title) || 'INTERIOR',
      desc: (content && content.interior_description) || 'Detailed interior architectural fit-out CAD drawings, furniture layouts, reflected ceiling plans (RCP), wall elevations, and custom joinery detailing.',
      images: (content && content.interior_images && content.interior_images.length > 0) ? content.interior_images : defaultBuildingImages
    },
    {
      key: 'mechanical',
      title: (content && content.mech_title) || 'MECHANICAL',
      desc: (content && content.mech_description) || 'HVAC ductwork layouts, chilled water piping schematics, ventilation plans, mechanical equipment schedules, and clash-free shop drawings.',
      images: (content && content.mech_images && content.mech_images.length > 0) ? content.mech_images : defaultBuildingImages
    },
    {
      key: 'electrical',
      title: (content && content.elec_title) || 'ELECTRICAL',
      desc: (content && content.elec_description) || 'Electrical power distribution schematics, lighting layouts, low voltage (LV) systems, containment routing, cable tray paths, and single line diagrams (SLD).',
      images: (content && content.elec_images && content.elec_images.length > 0) ? content.elec_images : defaultBuildingImages
    }
  ];

  const infraSubTopics = [
    {
      key: 'landscaping',
      title: (content && content.landscape_title) || 'LANDSCAPING',
      desc: (content && content.landscape_description) || 'Hardscape and softscape CAD layouts, site grading plans, irrigation network details, outdoor lighting paths, and urban amenity drafting.',
      images: (content && content.landscape_images && content.landscape_images.length > 0) ? content.landscape_images : defaultInfraImages
    },
    {
      key: 'road',
      title: (content && content.road_title) || 'ROAD',
      desc: (content && content.road_description) || 'Civil road alignment drafting, longitudinal profiles, cross-sections, pavement markings, traffic sign details, and junction CAD designs.',
      images: (content && content.road_images && content.road_images.length > 0) ? content.road_images : defaultInfraImages
    },
    {
      key: 'street_light',
      title: (content && content.street_light_title) || 'STREET LIGHT',
      desc: (content && content.street_light_description) || 'Public street lighting network plans, pole placement layouts, feeder pillar schematics, underground ducting, and photometrical CAD drawings.',
      images: (content && content.street_light_images && content.street_light_images.length > 0) ? content.street_light_images : defaultInfraImages
    },
    {
      key: 'underground_utilities',
      title: (content && content.util_title) || 'UNDERGROUND UTILITIES',
      desc: (content && content.util_description) || 'Combined underground utility mapping (CUM), stormwater drainage, sewer networks, water supply lines, telecommunication ductways, and trench detail CAD drawings.',
      images: (content && content.util_images && content.util_images.length > 0) ? content.util_images : defaultInfraImages
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
      <div className="cad-detail-wrapper">
        <div className="cad-detail-container" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '16px', color: '#64748B' }}>Loading CAD Services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cad-detail-wrapper">
      <div className="cad-detail-container">
        
        {/* Main Category Badge & Page Title */}
        <div className="cad-header-block">
          <h1 className="cad-main-title">Engineering Services ({(content && content.page_title) || 'CAD'})</h1>
          <div className="cad-title-bar" />
          {content && content.introduction && (
            <p className="cad-intro-text">{content.introduction}</p>
          )}
        </div>

        {/* 1. BUILDING SECTION */}
        <div className="cad-category-divider-block">
          <h2 className="cad-category-divider-title">BUILDING</h2>
          <div className="cad-category-divider-bar" />
        </div>

        {buildingSubTopics.map((sec) => {
          const startIndex = sectionIndices[sec.key] || 0;
          const hasMultiplePages = sec.images.length > 4;
          const visibleImages = hasMultiplePages ? sec.images.slice(startIndex, startIndex + 4) : sec.images;

          return (
            <section key={sec.key} className="cad-section-block">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h3 className="cad-section-title" style={{ margin: 0 }}>{sec.title}</h3>
                  <div className="cad-section-bar" />
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

              {sec.desc && <p className="cad-section-desc">{sec.desc}</p>}

              {/* Image Grid - 1 Row (Max 4 Images) */}
              <div className="cad-image-grid">
                {visibleImages.map((imgObj, idx) => {
                  const originalIdx = hasMultiplePages ? startIndex + idx : idx;
                  const imgUrl = typeof imgObj === 'string' ? imgObj : (imgObj.url || '');
                  const imgAlt = typeof imgObj === 'object' && imgObj.alt ? imgObj.alt : `CAD ${sec.title} Image ${originalIdx + 1}`;
                  return (
                    <div
                      key={originalIdx}
                      className="cad-image-card"
                      onClick={() => openLightbox(sec.images, originalIdx)}
                    >
                      <img src={imgUrl} alt={imgAlt} className="cad-card-img" />
                      <div className="cad-card-overlay">
                        <span className="cad-overlay-text">{imgAlt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* 2. INFRASTRUCTURE SECTION */}
        <div className="cad-category-divider-block" style={{ marginTop: '70px' }}>
          <h2 className="cad-category-divider-title">INFRASTRUCTURE</h2>
          <div className="cad-category-divider-bar" />
        </div>

        {infraSubTopics.map((sec) => {
          const startIndex = sectionIndices[sec.key] || 0;
          const hasMultiplePages = sec.images.length > 4;
          const visibleImages = hasMultiplePages ? sec.images.slice(startIndex, startIndex + 4) : sec.images;

          return (
            <section key={sec.key} className="cad-section-block">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h3 className="cad-section-title" style={{ margin: 0 }}>{sec.title}</h3>
                  <div className="cad-section-bar" />
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

              {sec.desc && <p className="cad-section-desc">{sec.desc}</p>}

              {/* Image Grid - 1 Row (Max 4 Images) */}
              <div className="cad-image-grid">
                {visibleImages.map((imgObj, idx) => {
                  const originalIdx = hasMultiplePages ? startIndex + idx : idx;
                  const imgUrl = typeof imgObj === 'string' ? imgObj : (imgObj.url || '');
                  const imgAlt = typeof imgObj === 'object' && imgObj.alt ? imgObj.alt : `CAD ${sec.title} Image ${originalIdx + 1}`;
                  return (
                    <div
                      key={originalIdx}
                      className="cad-image-card"
                      onClick={() => openLightbox(sec.images, originalIdx)}
                    >
                      <img src={imgUrl} alt={imgAlt} className="cad-card-img" />
                      <div className="cad-card-overlay">
                        <span className="cad-overlay-text">{imgAlt}</span>
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
        <div className="cad-lightbox-overlay" onClick={closeLightbox}>
          <div className="cad-lightbox-container" onClick={e => e.stopPropagation()}>
            <button className="cad-lightbox-close" onClick={closeLightbox}>&times;</button>
            
            <button className="cad-lightbox-btn cad-lightbox-prev" onClick={prevLightboxImage} aria-label="Previous image">
              <ChevronLeft size={22} />
            </button>
            <button className="cad-lightbox-btn cad-lightbox-next" onClick={nextLightboxImage} aria-label="Next image">
              <ChevronRight size={22} />
            </button>

            <div className="cad-lightbox-img-wrap">
              <img
                src={typeof lightbox.images[lightbox.currentIndex] === 'string'
                  ? lightbox.images[lightbox.currentIndex]
                  : (lightbox.images[lightbox.currentIndex].url || '')}
                alt={typeof lightbox.images[lightbox.currentIndex] === 'object'
                  ? lightbox.images[lightbox.currentIndex].alt
                  : ''}
                className="cad-lightbox-img"
              />
            </div>

            {typeof lightbox.images[lightbox.currentIndex] === 'object' && lightbox.images[lightbox.currentIndex].alt && (
              <div className="cad-lightbox-caption">
                {lightbox.images[lightbox.currentIndex].alt}
              </div>
            )}

            <div className="cad-lightbox-counter">
              IMAGE {lightbox.currentIndex + 1} / {lightbox.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
