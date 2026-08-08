import React, { useState, useEffect } from 'react';
import projectBanner from '../assets/project1.png';

// Static fallback data — used only when API is unavailable
const FALLBACK_DIVISIONS = [
  { division_type: 'Engineering Division',    name: 'Engineering Design Support Works', project_count: 24, description: 'MEP, Infrastructure and Transportation engineering design support.' },
  { division_type: 'Engineering Division',    name: 'BIM Modeling & Coordination',       project_count: 18, description: 'Full BIM modelling and coordination services across disciplines.' },
  { division_type: 'Sustainability Division', name: 'LEED/GSAS Gold Commissioning',      project_count: 12, description: 'Commissioning services achieving LEED and GSAS Gold ratings.' },
  { division_type: 'Sustainability Division', name: 'Energy Audit Works',                 project_count: 9,  description: 'Comprehensive energy auditing for residential and commercial projects.' },
  { division_type: 'Digital Twin Division',   name: 'Life Cycle Twin Asset Management',  project_count: 12, description: 'Virtual representation of physical assets, integrating real-time IoT sensors and 3D space.' },
  { division_type: 'Digital Twin Division',   name: 'Remote Work & System Integration',   project_count: 8,  description: 'Industrial automation, control logic simulation, and legacy system SCADA integration.' },
];

const TABS = [
  { label: 'Engineering Division',    key: 'Engineering Division',    icon: '⚙' },
  { label: 'Sustainability Division', key: 'Sustainability Division', icon: '🌱' },
  { label: 'Digital Twin Division',   key: 'Digital Twin Division',   icon: '💻' },
];

// Sample project images per division
const DIVISION_IMAGES = {
  'Engineering Division':    ['/eng_stadium.png', '/eng_tower.png', '/eng_island.png'],
  'Sustainability Division': ['/sust_workshop.png'],
  'Digital Twin Division':   ['/why.png', '/aerial_city_hero.png'],
};

export default function ProjectsPage({ activeSubTab = 'Engineering Division', onNavigate }) {
  const [projectDivisions, setProjectDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(
    TABS.some(t => t.key === activeSubTab) ? activeSubTab : 'Engineering Division'
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

  const currentProjects = projectDivisions.filter(p => p.division_type === activeTab);

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

      {/* Sub-menu Tab Bar */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E9F0', position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="container" style={{ display: 'flex', gap: '0', padding: '0 24px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '18px 32px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.key ? '3px solid #00A198' : '3px solid transparent',
                color: activeTab === tab.key ? '#00A198' : '#64748B',
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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#888', fontSize: '15px' }}>
            Loading projects...
          </div>
        ) : currentProjects.length === 0 ? (
          <div className="coming-soon-container">
            <p>Coming Soon...</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px',
          }}>
            {currentProjects.map((proj, idx) => (
              <div
                key={proj.id || idx}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '32px 28px',
                  boxShadow: '0 2px 20px rgba(0,0,0,0.07)',
                  border: '1px solid #F0F4F8',
                  borderLeft: '4px solid #00A198',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,161,152,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 20px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <span style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#00A198',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  background: 'rgba(0,161,152,0.08)',
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
                  color: '#0F1A2E',
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

        {/* Gallery Grid (project images per division) */}
        {(() => {
          const galleryImages = DIVISION_IMAGES[activeTab] || [];
          return galleryImages.length > 0 ? (
            <div className="projects-gallery-grid" style={{ marginTop: '48px' }}>
              {galleryImages.map((img, idx) => (
                <div className="project-card" key={idx}>
                  <img
                    src={img}
                    alt={`${activeTab} project ${idx + 1}`}
                    className="project-card-img"
                  />
                </div>
              ))}
            </div>
          ) : null;
        })()}
      </div>
    </div>
  );
}
