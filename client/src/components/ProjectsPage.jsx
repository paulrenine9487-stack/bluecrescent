import React, { useState, useEffect } from 'react';
import { getCachedCompanySettings, updateCachedCompanySettings } from '../utils/bannerCache';
import projectBanner from '../assets/project1.png';

const PROJECT_CATEGORIES = [
  {
    id: 'engineering-services',
    name: 'Engineering Services',
    slug: 'engineering-services',
    icon: '⚙',
    subCategories: [
      {
        key: 'BIM Projects',
        label: 'BIM Projects',
        icon: '⚙',
        description: 'Advanced Building Information Modeling up to LOD 500, clash detection, 4D scheduling, and 5D quantity take-offs across disciplines.',
        tags: ['3D BIM Modeling', 'Clash Detection', '4D Scheduling', '5D Take-Off', 'LOD 500']
      },
      {
        key: 'CAD Projects',
        label: 'CAD Projects',
        icon: '📐',
        description: 'Multidisciplinary 2D/3D CAD drafting, shop drawings, and engineering documentation support for complex building and infrastructure developments.',
        tags: ['2D Drafting', 'Shop Drawings', 'As-Built Documentation', 'Engineering Coordination']
      },
      {
        key: 'Laser Scanning Projects',
        label: 'Laser Scanning Projects',
        icon: '📸',
        description: 'High-precision 3D laser scanning, point cloud registration, existing-condition modeling, and Scan-to-BIM conversions.',
        tags: ['3D Laser Scanning', 'Point Cloud', 'Scan-to-BIM', 'As-Built Verification']
      }
    ]
  },
  {
    id: 'sustainability-services',
    name: 'Sustainability Services',
    slug: 'sustainability-services',
    icon: '🌱',
    subCategories: [
      {
        key: 'GSAS Projects',
        label: 'GSAS Projects',
        icon: '🌱',
        description: 'GSAS green building certification, thermal modeling, and sustainability compliance for Qatar and MENA region developments.',
        tags: ['GSAS Certification', 'Sustainability Assessment', 'Thermal Modeling', 'Green Building']
      },
      {
        key: 'LEED Projects',
        label: 'LEED Projects',
        icon: '🌿',
        description: 'LEED rating system facilitation, indoor environmental quality, and energy-efficient building lifecycle solutions.',
        tags: ['LEED Gold/Platinum', 'Energy Efficiency', 'IEQ Management', 'Sustainable Materials']
      },
      {
        key: 'Energy Audit Projects',
        label: 'Energy Audit Projects',
        icon: '⚡',
        description: 'Comprehensive facility energy diagnostic audits, HVAC optimization, and benchmark performance reporting.',
        tags: ['Energy Diagnostic', 'HVAC Optimization', 'Consumption Audit', 'Efficiency Strategy']
      },
      {
        key: 'Environment Projects',
        label: 'Environment Projects',
        icon: '🌍',
        description: 'Environmental management, sustainability strategies, embodied carbon assessment, and greenhouse gas inventory tracking across asset lifecycles.',
        tags: ['Environmental Protection', 'Carbon Management', 'GHG Inventory', 'Lifecycle Assessment']
      }
    ]
  },
  {
    id: 'digital-twin',
    name: 'Digital Twin',
    slug: 'digital-twin',
    icon: '💻',
    subCategories: [
      {
        key: 'Asset Management Projects',
        label: 'Asset Management Projects',
        icon: '🏢',
        description: 'Digital asset tagging, maintenance scheduling, space optimization, and operational efficiency analytics.',
        tags: ['Asset Tagging', 'Maintenance Automation', 'Space Analytics', 'OpEx Reduction']
      },
      {
        key: 'System Integration Projects',
        label: 'System Integration Projects',
        icon: '🔄',
        description: 'Seamless integration of BMS, CAFM, and SCADA telemetry into unified digital twin command dashboards.',
        tags: ['BMS Integration', 'CAFM Sync', 'SCADA Telemetry', 'Unified Dashboard']
      }
    ]
  },
  {
    id: 'construction-technology',
    name: 'Digital Construction Technology',
    slug: 'construction-technology',
    icon: '📡',
    subCategories: [
      {
        key: 'Laser Scanning Projects',
        label: 'Laser Scanning Projects',
        icon: '📸',
        description: 'High-precision 3D laser scanning, point cloud registration, existing-condition modeling, and Scan-to-BIM conversions.',
        tags: ['3D Laser Scanning', 'Point Cloud', 'Scan-to-BIM', 'As-Built Verification']
      },
      {
        key: '360° Site Documentation Projects',
        label: '360° Site Documentation Projects',
        icon: '📷',
        description: 'High-resolution 360-degree photo and video documentation indexed to BIM drawings for visual progress tracking.',
        tags: ['360° Photo Capture', 'Reality Tracking', 'BIM Overlay', 'Site Documentation']
      },
      {
        key: 'AR Solutions Projects',
        label: 'AR Solutions Projects',
        icon: '👓',
        description: 'Augmented Reality on-site model overlays for clash inspection, spatial verification, and client walkthroughs.',
        tags: ['Augmented Reality', 'On-Site Overlay', 'Spatial Verification', 'Interactive Inspection']
      },
      {
        key: 'Digital Collaboration Projects',
        label: 'Digital Collaboration Projects',
        icon: '💻',
        description: 'Cloud-based common data environments (CDE), real-time BIM collaboration, and digital project management.',
        tags: ['CDE Environment', 'BIM Cloud', 'Digital Collaboration', 'Project Management']
      }
    ]
  }
];

const FALLBACK_DIVISIONS = [
  { division_type: 'BIM Projects',              name: 'Advanced BIM Coordination & LOD 500 Modeling',  project_count: 28, description: 'Building Information Modeling up to LOD 500, clash detection, and 4D/5D simulations.' },
  { division_type: 'CAD Projects',              name: 'Multidisciplinary CAD Drafting & Shop Drawings', project_count: 24, description: 'Multidisciplinary 2D/3D CAD drafting, shop drawings, and engineering documentation support.' },
  { division_type: 'Laser Scanning Projects',   name: '3D Laser Scanning & Scan-to-BIM Conversion',     project_count: 18, description: 'High-precision 3D laser scanning and point-cloud to BIM workflows.' },
  { division_type: 'Scan to BIM Projects',      name: 'Scan-to-BIM Heritage & As-Built Conversion',     project_count: 16, description: 'As-built point cloud conversion into intelligent Revit BIM families and asset models.' },
  { division_type: 'GSAS Projects',             name: 'GSAS 4-Star Sustainability & Thermal Modeling', project_count: 14, description: 'Green building facilitation, GSAS 4-star certification, and energy diagnostics.' },
  { division_type: 'LEED Projects',             name: 'LEED Gold Building Environmental Certification', project_count: 12, description: 'LEED Gold compliance, energy benchmarking, and sustainable material tracking.' },
  { division_type: 'Energy Audit Projects',     name: 'Facility Diagnostic Energy & HVAC Performance',  project_count: 10, description: 'Level 2 ASHRAE energy diagnostic audits and HVAC retro-commissioning.' },
  { division_type: 'Environment Projects',      name: 'Environmental Management & Decarbonization',     project_count: 9,  description: 'Whole-life environmental assessment and zero-carbon building strategy.' },
  { division_type: 'Asset Twin Projects',       name: 'Integrated Life Cycle Digital Twin Platform',    project_count: 15, description: 'Connecting physical assets with digital information for IoT monitoring and lifecycle management.' },
  { division_type: 'System Integration Projects',name: 'IoT Telemetry & BMS Command Dashboard Sync',   project_count: 11, description: 'Integrating BMS, CAFM, and telemetry sensors into unified command platforms.' },
  { division_type: 'Real-Time Monitoring Projects', name: 'Live Environmental Sensor & IAQ Monitoring', project_count: 13, description: 'Real-time IoT environmental monitoring and predictive maintenance analytics.' },
  { division_type: 'Asset Management Projects', name: 'Digital Asset Tagging & Space Analytics',       project_count: 14, description: 'Automated asset lifecycle management, maintenance dispatch, and space utilization.' },
  { division_type: 'Remote Construction Projects', name: 'Remote Site Inspection & Cloud Monitoring',  project_count: 12, description: 'Remote virtual site visits, live progress tracking, and cloud status reporting.' },
  { division_type: '360° Capture Projects',     name: '360° Reality Documentation & BIM Overlay',       project_count: 15, description: '360-degree site visual capture integrated with 4D BIM progress timeline.' },
  { division_type: 'AR Solutions Projects',     name: 'On-Site Augmented Reality BIM Overlay',         project_count: 8,  description: 'HoloLens AR visual overlay for MEP clash verification and inspection.' },
  { division_type: 'Robotics Projects',         name: 'Autonomous Rover & Drone Surveying',            project_count: 7,  description: 'Robotic site capture rovers and autonomous drone laser scanning surveys.' }
];

const resolveCategoryAndSubTab = (subTabParam) => {
  if (!subTabParam) {
    return {
      category: PROJECT_CATEGORIES[0],
      subCategory: PROJECT_CATEGORIES[0].subCategories[0]
    };
  }

  const clean = subTabParam.toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const cat of PROJECT_CATEGORIES) {
    const cleanCatName = cat.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanCatSlug = cat.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (clean === cleanCatName || clean === cleanCatSlug || cleanCatName.includes(clean) || clean.includes(cleanCatName)) {
      return {
        category: cat,
        subCategory: cat.subCategories[0]
      };
    }

    for (const sub of cat.subCategories) {
      const cleanSubKey = sub.key.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanSubLabel = sub.label.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanSubKey.includes(clean) || clean.includes(cleanSubKey) || cleanSubLabel.includes(clean) || clean.includes(cleanSubLabel)) {
        return {
          category: cat,
          subCategory: sub
        };
      }
    }
  }

  return {
    category: PROJECT_CATEGORIES[0],
    subCategory: PROJECT_CATEGORIES[0].subCategories[0]
  };
};

export default function ProjectsPage({ activeSubTab = 'engineering-services', onNavigate }) {
  const [projectDivisions, setProjectDivisions] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialResolved = resolveCategoryAndSubTab(activeSubTab);
  const [activeCategory, setActiveCategory] = useState(initialResolved.category);
  const [activeSubCategory, setActiveSubCategory] = useState(initialResolved.subCategory);

  useEffect(() => {
    if (activeSubTab) {
      const resolved = resolveCategoryAndSubTab(activeSubTab);
      setActiveCategory(resolved.category);
      setActiveSubCategory(resolved.subCategory);
    }
  }, [activeSubTab]);

  const [companySettings, setCompanySettings] = useState(() => getCachedCompanySettings());

  useEffect(() => {
    const handleSettingsUpdated = (e) => {
      if (e?.detail) {
        setCompanySettings(prev => ({ ...prev, ...e.detail }));
      } else {
        setCompanySettings(getCachedCompanySettings());
      }
    };

    window.addEventListener('companySettingsUpdated', handleSettingsUpdated);

    fetch('/api/settings/company')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          updateCachedCompanySettings(data);
          setCompanySettings(prev => ({ ...prev, ...data }));
        }
      })
      .catch(err => console.warn('Company settings fetch warning:', err));

    fetch('/api/projects')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProjectDivisions(data.filter(p => p.status !== 'Inactive'));
        } else {
          setProjectDivisions(FALLBACK_DIVISIONS);
        }
        setLoading(false);
      })
      .catch(() => {
        setProjectDivisions(FALLBACK_DIVISIONS);
        setLoading(false);
      });

    return () => {
      window.removeEventListener('companySettingsUpdated', handleSettingsUpdated);
    };
  }, []);

  const handleSelectMainCategory = (cat) => {
    setActiveCategory(cat);
    if (cat.subCategories && cat.subCategories.length > 0) {
      setActiveSubCategory(cat.subCategories[0]);
    }
  };

  const currentProjects = projectDivisions.filter(p => {
    const pCat = (p.division_type || p.category || p.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const actSub = activeSubCategory.key.toLowerCase().replace(/[^a-z0-9]/g, '');
    const actCat = activeCategory.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return pCat.includes(actSub) || actSub.includes(pCat) || (pCat.includes(actCat) && pCat.includes(actSub.slice(0, 4)));
  });

  const displayProjects = currentProjects.length > 0
    ? currentProjects
    : FALLBACK_DIVISIONS.filter(p => {
        const pDiv = p.division_type.toLowerCase().replace(/[^a-z0-9]/g, '');
        const actSub = activeSubCategory.key.toLowerCase().replace(/[^a-z0-9]/g, '');
        return pDiv.includes(actSub) || actSub.includes(pDiv);
      });

  return (
    <div className="projects-page">
      {/* Full-Width Projects Banner */}
      <section className="about-full-banner-wrap" style={{ width: '100%', overflow: 'hidden', marginBottom: 0 }}>
        <img
          src={companySettings?.projectsPageBannerUrl || projectBanner}
          alt="Projects Banner"
          className="about-hero-banner-img page-banner-img"
        />
      </section>

      {/* Sub-Category Tab Bar (ONLY sub-categories for active category) */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E9F0', position: 'sticky', top: '85px', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px', padding: '6px 16px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
          {activeCategory.subCategories.map(sub => {
            const isSubActive = activeSubCategory.key === sub.key;
            return (
              <button
                key={sub.key}
                onClick={() => setActiveSubCategory(sub)}
                style={{
                  padding: '14px 20px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isSubActive ? '3px solid #087CFF' : '3px solid transparent',
                  color: isSubActive ? '#087CFF' : '#64748B',
                  fontWeight: isSubActive ? '700' : '600',
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  letterSpacing: '0.3px',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexShrink: 0
                }}
              >
                <span style={{ fontSize: '15px' }}>{sub.icon}</span>
                {sub.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        {/* Title & Subtitle Header Block */}
        <div 
          style={{ 
            marginBottom: '32px', 
            background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)', 
            borderRadius: '16px', 
            padding: '28px 32px', 
            border: '1px solid rgba(8, 124, 255, 0.12)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: '#087CFF', letterSpacing: '1.2px', marginBottom: '8px' }}>
            {activeCategory.name}
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#063B73', margin: '0 0 10px 0', fontFamily: 'Space Grotesk, sans-serif' }}>
            {activeSubCategory.label}
          </h2>
          <p style={{ fontSize: '14.5px', color: '#475569', margin: '0 0 16px 0', lineHeight: 1.6, maxWidth: '780px', marginLeft: 'auto', marginRight: 'auto', fontWeight: '500' }}>
            {activeSubCategory.description}
          </p>
          {activeSubCategory.tags && (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
              {activeSubCategory.tags.map(t => (
                <span key={t} style={{
                  fontSize: '11.5px',
                  fontWeight: '700',
                  color: '#063B73',
                  background: '#FFFFFF',
                  border: '1px solid rgba(6, 59, 115, 0.12)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}>
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#888', fontSize: '15px' }}>
            Loading projects...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}>
            {displayProjects.map((proj, idx) => (
              <div
                key={proj.id || idx}
                onClick={() => onNavigate('ProjectDetail', proj.slug || proj.id)}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 32px rgba(8,124,255,0.18)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {/* Project Image Container */}
                <div style={{ height: '200px', width: '100%', overflow: 'hidden', background: '#F1F5F9', position: 'relative' }}>
                  <img
                    src={proj.image || projectBanner}
                    alt={proj.name}
                    onError={(e) => { e.target.onerror = null; e.target.src = projectBanner; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#087CFF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(4px)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    {proj.division_type || activeSubCategory.label}
                  </span>
                </div>

                {/* Project Info Block */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#063B73',
                    lineHeight: '1.35',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    {proj.name}
                  </h3>

                  {/* Sub-Category Badge Under Title */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      background: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      color: '#059669',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      width: 'fit-content'
                    }}
                  >
                    {proj.division_type || activeSubCategory.label}
                  </div>

                  {(proj.location || proj.sector) && (
                    <p style={{ margin: 0, fontSize: '13px', color: '#087CFF', fontWeight: '600' }}>
                      {[proj.location, proj.sector].filter(Boolean).join(' • ')}
                    </p>
                  )}

                  <p style={{ margin: 0, fontSize: '14px', color: '#64748B', lineHeight: '1.6', flex: 1 }}>
                    {proj.short_description || proj.description || 'Multidisciplinary engineering and BIM coordination deliverables.'}
                  </p>

                  <div style={{ paddingTop: '12px', marginTop: 'auto', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#087CFF', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      VIEW PROJECT →
                    </span>
                    {proj.year && (
                      <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>
                        {proj.year}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
