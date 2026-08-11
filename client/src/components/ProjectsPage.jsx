import React, { useState, useEffect } from 'react';
import projectBanner from '../assets/project1.png';

const TABS = [
  { 
    label: 'CAD Projects',   
    key: 'CAD Projects',   
    icon: '📐', 
    description: 'Multidisciplinary 2D/3D CAD drafting, shop drawings, and engineering documentation support for complex building and infrastructure developments.',
    tags: ['2D Drafting', 'Shop Drawings', 'As-Built Documentation', 'Engineering Coordination'] 
  },
  { 
    label: 'BIM Projects',   
    key: 'BIM Projects',   
    icon: '⚙', 
    description: 'Advanced Building Information Modeling up to LOD 500, clash detection, 4D scheduling, and 5D quantity take-offs across disciplines.',
    tags: ['3D BIM Modeling', 'Clash Detection', '4D Scheduling', '5D Take-Off', 'LOD 500'] 
  },
  { 
    label: 'Laser Scanning Projects',      
    key: 'Laser Scanning Projects',      
    icon: '📸', 
    description: 'High-precision 3D laser scanning, point cloud registration, existing-condition modeling, and Scan-to-BIM conversions.',
    tags: ['3D Laser Scanning', 'Point Cloud', 'Scan-to-BIM', 'As-Built Verification'] 
  },
  { 
    label: 'Digital Twin Projects',         
    key: 'Digital Twin Projects',         
    icon: '💻', 
    description: 'Transformative Digital Twin solutions connecting 3D spatial models with real-time IoT monitoring and lifecycle asset management.',
    tags: ['Asset Twin', 'System Integration', 'Real-Time Monitoring', 'Asset Management'] 
  },
  { 
    label: 'Sustainability Projects',       
    key: 'Sustainability Projects',       
    icon: '🌱', 
    description: 'Green building facilitation, GSAS & LEED certifications, energy diagnostic audits, and carbon management strategies.',
    tags: ['GSAS', 'LEED', 'Energy Audit', 'Carbon Management'] 
  }
];

const FALLBACK_DIVISIONS = [
  { division_type: 'CAD Projects',              name: 'Multidisciplinary CAD Drafting & Shop Drawings', project_count: 24, description: 'Multidisciplinary 2D/3D CAD drafting, shop drawings, and engineering documentation support.' },
  { division_type: 'BIM Projects',              name: 'Advanced BIM Coordination & LOD 500 Modeling',  project_count: 28, description: 'Building Information Modeling up to LOD 500, clash detection, and 4D/5D simulations.' },
  { division_type: 'Laser Scanning Projects',   name: '3D Laser Scanning & Scan-to-BIM Conversion',     project_count: 18, description: 'High-precision 3D laser scanning and point-cloud to BIM workflows.' },
  { division_type: 'Digital Twin Projects',     name: 'Integrated Life Cycle Digital Twin Platform',    project_count: 15, description: 'Connecting physical assets with digital information for IoT monitoring and lifecycle asset management.' },
  { division_type: 'Sustainability Projects',   name: 'GSAS & LEED Green Building Certification',      project_count: 12, description: 'Green building consulting, GSAS/LEED certification, and energy diagnostic audits.' }
];

const resolveTabKey = (subTab) => {
  if (!subTab) return TABS[0].key;
  const cleanSub = subTab.toLowerCase().replace(/[^a-z0-9]/g, '');
  const match = TABS.find(t => {
    const cleanKey = t.key.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanLabel = t.label.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleanKey.includes(cleanSub) || cleanSub.includes(cleanKey) || cleanLabel.includes(cleanSub) || cleanSub.includes(cleanLabel);
  });
  return match ? match.key : TABS[0].key;
};

export default function ProjectsPage({ activeSubTab = 'CAD Projects', onNavigate }) {
  const [projectDivisions, setProjectDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(resolveTabKey(activeSubTab));

  useEffect(() => {
    if (activeSubTab) {
      setActiveTab(resolveTabKey(activeSubTab));
    }
  }, [activeSubTab]);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) {
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
  }, []);

  const activeTabObj = TABS.find(t => t.key === activeTab) || TABS[0];
  const currentProjects = projectDivisions.filter(p => {
    const pDiv = (p.division_type || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const actTab = activeTab.toLowerCase().replace(/[^a-z0-9]/g, '');
    return pDiv.includes(actTab) || actTab.includes(pDiv);
  });
  const displayProjects = currentProjects.length > 0 ? currentProjects : FALLBACK_DIVISIONS.filter(p => resolveTabKey(p.division_type) === activeTab);

  return (
    <div className="projects-page">
      {/* Full-Width Projects Banner */}
      <section className="about-full-banner-wrap" style={{ width: '100%', overflow: 'hidden' }}>
        <img
          src={projectBanner}
          alt="Projects Banner"
          style={{ width: '100%', height: '420px', objectFit: 'cover', objectPosition: 'center center', display: 'block' }}
        />
      </section>

      {/* Sub-menu Tab Bar (5 Categories) */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E9F0', position: 'sticky', top: '90px', zIndex: 10 }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px', padding: '8px 16px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '18px 24px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.key ? '3px solid #087CFF' : '3px solid transparent',
                color: activeTab === tab.key ? '#087CFF' : '#64748B',
                fontWeight: activeTab === tab.key ? '700' : '600',
                fontSize: '14px',
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
              <span style={{ fontSize: '16px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '60px' }}>
        {/* Title & Subtitle Header Block */}
        <div 
          style={{ 
            marginBottom: '36px', 
            background: '#F8FAFC', 
            borderRadius: '16px', 
            padding: '28px 32px', 
            border: '1px solid rgba(6, 59, 115, 0.08)',
            textAlign: 'center'
          }}
        >
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#063B73', margin: '0 0 12px 0', fontFamily: 'Space Grotesk, sans-serif' }}>
            {activeTabObj.label}
          </h2>
          <p style={{ fontSize: '15px', color: '#475569', margin: 0, lineHeight: 1.65, maxWidth: '780px', marginLeft: 'auto', marginRight: 'auto', fontWeight: '500' }}>
            {activeTabObj.description}
          </p>
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
                    {proj.division_type || proj.category}
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
