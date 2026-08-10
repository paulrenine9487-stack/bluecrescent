import React, { useState, useEffect } from 'react';
import projectBanner from '../assets/project1.png';

const TABS = [
  { 
    label: 'Engineering & BIM',   
    key: 'Engineering & BIM',   
    icon: '⚙', 
    description: 'Advanced engineering, BIM coordination and digital construction solutions for complex building and infrastructure projects.',
    tags: ['BIM Modeling', 'BIM Coordination', 'MEP BIM', 'Structural BIM', 'Infrastructure BIM', 'Clash Detection', '4D / 5D', 'As-Built BIM'] 
  },
  { 
    label: 'Digital Twin',         
    key: 'Digital Twin',         
    icon: '💻', 
    description: 'Connecting physical assets with digital information to enable smarter operation, monitoring and lifecycle management.',
    tags: ['Digital Twin', 'BIM Integration', 'GIS', 'Asset Information', 'CAFM', 'CMMS', 'BMS / BAS'] 
  },
  { 
    label: 'Reality Capture',      
    key: 'Reality Capture',      
    icon: '📸', 
    description: 'Reality capture and point-cloud processing solutions for accurate existing-condition documentation and Scan-to-BIM workflows.',
    tags: ['3D Laser Scanning', 'Point Cloud', 'Scan-to-BIM', 'Existing Condition Modeling', 'As-Built Verification'] 
  },
  { 
    label: 'Sustainability',       
    key: 'Sustainability',       
    icon: '🌱', 
    description: 'Sustainable engineering solutions supporting energy efficiency, environmental performance and internationally recognized sustainability objectives.',
    tags: ['GSAS', 'LEED', 'Energy Audit', 'Green Building', 'Carbon Management', 'Environmental Consultancy'] 
  },
  { 
    label: 'Remote Construction',  
    key: 'Remote Construction',  
    icon: '📡', 
    description: 'Digital technologies connecting project teams, sites and technical specialists for improved collaboration, inspection and decision-making.',
    tags: ['Remote Site Support', '360° Site Documentation', 'Remote Inspection', 'AR Solutions', 'Digital Collaboration', 'Robotic Integration'] 
  },
  { 
    label: 'Infrastructure',       
    key: 'Infrastructure',       
    icon: '🏗', 
    description: 'Engineering and digital solutions supporting complex infrastructure, transportation, utilities and large-scale development projects.',
    tags: ['Infrastructure', 'Transportation', 'Utilities', 'Roads', 'Streetlights', 'Underground Utilities'] 
  },
];

const FALLBACK_DIVISIONS = [
  { division_type: 'Engineering & BIM',   name: 'Advanced BIM Coordination & MEP Engineering', project_count: 24, description: 'Advanced engineering, BIM coordination and digital construction solutions for complex building and infrastructure projects.' },
  { division_type: 'Digital Twin',         name: 'Integrated Life Cycle Digital Twin Platform', project_count: 15, description: 'Connecting physical assets with digital information to enable smarter operation, monitoring and lifecycle management.' },
  { division_type: 'Reality Capture',      name: '3D Laser Scanning & Scan-to-BIM Workflows',  project_count: 18, description: 'Reality capture and point-cloud processing solutions for accurate existing-condition documentation and Scan-to-BIM workflows.' },
  { division_type: 'Sustainability',       name: 'Sustainable Engineering & Energy Audit',     project_count: 12, description: 'Sustainable engineering solutions supporting energy efficiency, environmental performance and internationally recognized sustainability objectives.' },
  { division_type: 'Remote Construction',  name: 'Remote Site Documentation & AR Inspection', project_count: 9,  description: 'Digital technologies connecting project teams, sites and technical specialists for improved collaboration, inspection and decision-making.' },
  { division_type: 'Infrastructure',       name: 'Complex Infrastructure & Utility Works',      project_count: 20, description: 'Engineering and digital solutions supporting complex infrastructure, transportation, utilities and large-scale development projects.' },
];

export default function ProjectsPage({ activeSubTab = 'Engineering & BIM', onNavigate }) {
  const [projectDivisions, setProjectDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(
    TABS.some(t => t.key === activeSubTab) ? activeSubTab : 'Engineering & BIM'
  );

  useEffect(() => {
    if (activeSubTab && TABS.some(t => t.key === activeSubTab)) {
      setActiveTab(activeSubTab);
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
  const currentProjects = projectDivisions.filter(p => 
    (p.division_type || '').toLowerCase().includes(activeTab.toLowerCase()) || 
    activeTab.toLowerCase().includes((p.division_type || '').toLowerCase())
  );
  const displayProjects = currentProjects.length > 0 ? currentProjects : FALLBACK_DIVISIONS.filter(p => p.division_type === activeTab);

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

      {/* Sub-menu Tab Bar (6 Categories) */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E9F0', position: 'sticky', top: '90px', zIndex: 10 }}>
        <div className="container" style={{ display: 'flex', gap: '0', padding: '0 24px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
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
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '32px 28px',
                  boxShadow: '0 2px 20px rgba(0,0,0,0.07)',
                  border: '1px solid #F0F4F8',
                  borderLeft: '4px solid #087CFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(8,124,255,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 20px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <span style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#087CFF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  background: 'rgba(8,124,255,0.08)',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  alignSelf: 'flex-start'
                }}>
                  {proj.division_type}
                </span>
                <h3 style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#063B73',
                  lineHeight: '1.4'
                }}>
                  {proj.name}
                </h3>
                {proj.description && (
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748B', lineHeight: '1.6' }}>
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
