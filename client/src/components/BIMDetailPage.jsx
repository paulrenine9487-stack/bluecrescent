import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './BIMDetailPage.css';

export default function BIMDetailPage({ onNavigate }) {
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
    window.addEventListener('bimContentUpdated', fetchContent);
    return () => window.removeEventListener('bimContentUpdated', fetchContent);
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/bim');
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      }
    } catch (err) {
      console.error('Error fetching BIM content:', err);
    } finally {
      setLoading(false);
    }
  };

  const defaultBimImages = [
    { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', alt: 'Intelligent 3D Building Information Modeling (BIM) LOD 400', display_order: 1 },
    { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'Multi-Disciplinary BIM Structural & MEP Coordination', display_order: 2 },
    { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'BIM Clash Detection & Navisworks Spatial Audit', display_order: 3 },
    { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'BIM 4D Time Simulation & 5D Quantity Take-Off Analysis', display_order: 4 }
  ];

  // 6 Main Categories with Title Description & Sub-Topics
  const mainCategories = [
    {
      key: 'building',
      title: (content && content.building_main_title) || 'BUILDING',
      description: (content && content.building_main_desc) || 'End-to-end 3D Building Information Modeling up to LOD 500 for commercial, residential, healthcare, and industrial structures.',
      subTopics: [
        {
          key: 'arch',
          title: (content && content.b_arch_title) || 'ARCHITECTURE',
          desc: (content && content.b_arch_desc) || 'Intelligent 3D parametric architectural BIM modeling, wall envelope assemblies, facade detailing, spatial floor plans, and authority compliance models.',
          images: (content && content.b_arch_images && content.b_arch_images.length > 0) ? content.b_arch_images : defaultBimImages
        },
        {
          key: 'struct',
          title: (content && content.b_struct_title) || 'STRUCTURE',
          desc: (content && content.b_struct_desc) || 'Structural 3D BIM modeling including reinforced concrete framing, post-tensioned slabs, structural steel connections, and foundation rebar detailing.',
          images: (content && content.b_struct_images && content.b_struct_images.length > 0) ? content.b_struct_images : defaultBimImages
        },
        {
          key: 'interior',
          title: (content && content.b_interior_title) || 'INTERIOR',
          desc: (content && content.b_interior_desc) || 'High-LOD interior BIM modeling, ceiling systems, wall finishes, custom millwork, furniture layouts, and spatial interior coordination.',
          images: (content && content.b_interior_images && content.b_interior_images.length > 0) ? content.b_interior_images : defaultBimImages
        },
        {
          key: 'mep',
          title: (content && content.b_mep_title) || 'MECHANICAL ELECTRICAL',
          desc: (content && content.b_mep_desc) || '3D MEP BIM modeling covering HVAC ductwork, chilled water piping, electrical containment pathways, plumbing networks, and clash-free plant room layouts.',
          images: (content && content.b_mep_images && content.b_mep_images.length > 0) ? content.b_mep_images : defaultBimImages
        }
      ]
    },
    {
      key: 'infrastructure',
      title: (content && content.infra_main_title) || 'INFRASTRUCTURE',
      description: (content && content.infra_main_desc) || 'Comprehensive civil infrastructure BIM modeling for transportation, public utilities, roads, bridges, and site developments.',
      subTopics: [
        {
          key: 'landscape',
          title: (content && content.i_landscape_title) || 'LANDSCAPING',
          desc: (content && content.i_landscape_desc) || 'Civil site topography, hardscape/softscape 3D BIM modeling, site grading, retaining walls, and outdoor amenity spatial coordination.',
          images: (content && content.i_landscape_images && content.i_landscape_images.length > 0) ? content.i_landscape_images : defaultBimImages
        },
        {
          key: 'road',
          title: (content && content.i_road_title) || 'ROAD',
          desc: (content && content.i_road_desc) || '3D civil road corridor modeling, alignment profiles, pavement layer modeling, junction grading, and traffic network BIM integration.',
          images: (content && content.i_road_images && content.i_road_images.length > 0) ? content.i_road_images : defaultBimImages
        },
        {
          key: 'street_light',
          title: (content && content.i_street_light_title) || 'STREET LIGHT',
          desc: (content && content.i_street_light_desc) || 'Public street lighting BIM modeling, luminaire pole placement, underground electrical cabling, and feeder pillar distribution paths.',
          images: (content && content.i_street_light_images && content.i_street_light_images.length > 0) ? content.i_street_light_images : defaultBimImages
        },
        {
          key: 'util',
          title: (content && content.i_util_title) || 'UNDERGROUND UTILITIES',
          desc: (content && content.i_util_desc) || 'Subsurface utility BIM modeling including stormwater networks, foul sewer mains, potable water distribution, and telecommunication trench conduits.',
          images: (content && content.i_util_images && content.i_util_images.length > 0) ? content.i_util_images : defaultBimImages
        }
      ]
    },
    {
      key: 'four_d',
      title: (content && content.fourd_main_title) || '4D',
      description: (content && content.fourd_main_desc) || 'Time-based 4D BIM construction scheduling, visual sequence simulation, logistics planning, and progress tracking.',
      subTopics: [
        {
          key: 'building',
          title: (content && content.fourd_b_title) || 'BUILDING',
          desc: (content && content.fourd_b_desc) || 'Linking Primavera P6 / MS Project schedules to 3D building BIM models for step-by-step construction sequencing, crane logistics, and delay analysis.',
          images: (content && content.fourd_b_images && content.fourd_b_images.length > 0) ? content.fourd_b_images : defaultBimImages
        },
        {
          key: 'infrastructure',
          title: (content && content.fourd_i_title) || 'INFRASTRUCTURE',
          desc: (content && content.fourd_i_desc) || '4D scheduling and earthwork sequencing simulations for civil roadworks, bridges, utility trenching, and site earthworks.',
          images: (content && content.fourd_i_images && content.fourd_i_images.length > 0) ? content.fourd_i_images : defaultBimImages
        }
      ]
    },
    {
      key: 'five_d',
      title: (content && content.fived_main_title) || '5D',
      description: (content && content.fived_main_desc) || 'Cost-integrated 5D BIM quantity take-offs (QTO), automated bill of quantities (BOQ), and real-time cash flow estimation.',
      subTopics: [
        {
          key: 'building',
          title: (content && content.fived_b_title) || 'BUILDING',
          desc: (content && content.fived_b_desc) || 'Extracting accurate material quantities, concrete volumes, rebar tonnages, and MEP component counts directly from parametric 3D building models.',
          images: (content && content.fived_b_images && content.fived_b_images.length > 0) ? content.fived_b_images : defaultBimImages
        },
        {
          key: 'infrastructure',
          title: (content && content.fived_i_title) || 'INFRASTRUCTURE',
          desc: (content && content.fived_i_desc) || 'Civil quantity estimation for cut/fill earthworks, asphalt tonnage, utility piping line lengths, and infrastructure material costing.',
          images: (content && content.fived_i_images && content.fived_i_images.length > 0) ? content.fived_i_images : defaultBimImages
        }
      ]
    },
    {
      key: 'rendering',
      title: (content && content.render_main_title) || 'RENDERING',
      description: (content && content.render_main_desc) || 'Photorealistic 3D architectural visualization, virtual reality (VR) walkthroughs, and marketing animations created from BIM models.',
      subTopics: [
        {
          key: 'walkthrough',
          title: (content && content.r_walkthrough_title) || 'WALK THROUGH',
          desc: (content && content.r_walkthrough_desc) || 'Immersive 3D video walkthroughs, exterior fly-throughs, and interactive 360-degree panoramic virtual tours of building and infrastructure BIM assets.',
          images: (content && content.r_walkthrough_images && content.r_walkthrough_images.length > 0) ? content.r_walkthrough_images : defaultBimImages
        }
      ]
    },
    {
      key: 'reporting',
      title: (content && content.report_main_title) || 'REPORTING',
      description: (content && content.report_main_desc) || 'Automated BIM coordination reports, clash detection audits, LOD verification summaries, and periodic progress documentation.',
      subTopics: [
        {
          key: 'periodically',
          title: (content && content.rep_periodic_title) || 'PERIODICALLY',
          desc: (content && content.rep_periodic_desc) || 'Regular weekly and monthly BIM audit reporting, issue tracking dashboards, model compliance checks, and CDE data handover reports.',
          images: (content && content.rep_periodic_images && content.rep_periodic_images.length > 0) ? content.rep_periodic_images : defaultBimImages
        }
      ]
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
      <div className="bim-detail-wrapper">
        <div className="bim-detail-container" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '16px', color: '#64748B' }}>Loading BIM Services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bim-detail-wrapper">
      <div className="bim-detail-container">
        
        {/* Main Category Badge & Page Title */}
        <div className="bim-header-block">
          <h1 className="bim-main-title">Engineering Services ({(content && content.page_title) || 'BIM'})</h1>
          <div className="bim-title-bar" />
          {content && content.introduction && (
            <p className="bim-intro-text">{content.introduction}</p>
          )}
        </div>

        {/* 6 Main Category Sections */}
        {mainCategories.map((cat, catIdx) => (
          <div key={cat.key}>
            
            {/* Centered Main Section Header with Description */}
            <div className="bim-category-divider-block" style={catIdx > 0 ? { marginTop: '64px' } : {}}>
              <h2 className="bim-category-divider-title">{cat.title}</h2>
              <div className="bim-category-divider-bar" />
              {cat.description && (
                <p className="bim-category-divider-desc">{cat.description}</p>
              )}
            </div>

            {/* Sub-Topics under Main Category */}
            {cat.subTopics.map((sec) => {
              const startIndex = sectionIndices[sec.key] || 0;
              const hasMultiplePages = sec.images.length > 4;
              const visibleImages = hasMultiplePages ? sec.images.slice(startIndex, startIndex + 4) : sec.images;

              return (
                <section key={sec.key} className="bim-section-block">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h3 className="bim-section-title" style={{ margin: 0 }}>{sec.title}</h3>
                      <div className="bim-section-bar" />
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

                  {sec.desc && <p className="bim-section-desc">{sec.desc}</p>}

                  {/* Image Grid - 1 Row (Max 4 Images) */}
                  <div className="bim-image-grid">
                    {visibleImages.map((imgObj, idx) => {
                      const originalIdx = hasMultiplePages ? startIndex + idx : idx;
                      const imgUrl = typeof imgObj === 'string' ? imgObj : (imgObj.url || '');
                      const imgAlt = typeof imgObj === 'object' && imgObj.alt ? imgObj.alt : `BIM ${sec.title} Image ${originalIdx + 1}`;
                      return (
                        <div
                          key={originalIdx}
                          className="bim-image-card"
                          onClick={() => openLightbox(sec.images, originalIdx)}
                        >
                          <img src={imgUrl} alt={imgAlt} className="bim-card-img" />
                          <div className="bim-card-overlay">
                            <span className="bim-overlay-text">{imgAlt}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}

          </div>
        ))}

      </div>

      {/* Lightbox Modal */}
      {lightbox.isOpen && lightbox.images.length > 0 && (
        <div className="bim-lightbox-overlay" onClick={closeLightbox}>
          <div className="bim-lightbox-container" onClick={e => e.stopPropagation()}>
            <button className="bim-lightbox-close" onClick={closeLightbox}>&times;</button>
            
            <button className="bim-lightbox-btn bim-lightbox-prev" onClick={prevLightboxImage} aria-label="Previous image">
              <ChevronLeft size={22} />
            </button>
            <button className="bim-lightbox-btn bim-lightbox-next" onClick={nextLightboxImage} aria-label="Next image">
              <ChevronRight size={22} />
            </button>

            <div className="bim-lightbox-img-wrap">
              <img
                src={typeof lightbox.images[lightbox.currentIndex] === 'string'
                  ? lightbox.images[lightbox.currentIndex]
                  : (lightbox.images[lightbox.currentIndex].url || '')}
                alt={typeof lightbox.images[lightbox.currentIndex] === 'object'
                  ? lightbox.images[lightbox.currentIndex].alt
                  : ''}
                className="bim-lightbox-img"
              />
            </div>

            {typeof lightbox.images[lightbox.currentIndex] === 'object' && lightbox.images[lightbox.currentIndex].alt && (
              <div className="bim-lightbox-caption">
                {lightbox.images[lightbox.currentIndex].alt}
              </div>
            )}

            <div className="bim-lightbox-counter">
              IMAGE {lightbox.currentIndex + 1} / {lightbox.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
