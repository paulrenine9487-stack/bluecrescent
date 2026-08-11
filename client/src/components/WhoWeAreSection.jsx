import React, { useState, useEffect } from 'react';
import { ArrowRight, Cpu, Layers, Compass, Radio, Building2 } from 'lucide-react';

export default function WhoWeAreSection({ onNavigate }) {
  const [companySettings, setCompanySettings] = useState(() => {
    const DEFAULT_COMPANY = {
      whoWeArePara1: "Blue Crescent Engineering is based upon pillars of engineering excellence, a proven system of quality assurance and a dedication in meeting the client's needs and schedules. The company is incorporated by the core values of teamwork, Respect and Integrity.",
      whoWeArePara2: "Our client-centered culture and teamwork based approach integrate the knowledge and skills of our network with local awareness, technical leadership and innovative approaches to solve our client's challenges.",
      whoWeArePara3: "Across our spectrum of expertise, We make the connection for each client that best serves their immediate objectives while fulfilling our shared purpose.",
      whoWeArePara4: "We offer multidisciplinary engineering solutions across our 4 core service verticals: Engineering Services (CAD, BIM, Laser Scanning, Scan to BIM), Sustainability Services (GSAS, LEED, Energy Audit, Carbon Management), Digital Twin, and Construction Technology."
    };
    try {
      const saved = localStorage.getItem('companySettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_COMPANY, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Error reading companySettings in WhoWeAreSection', e);
    }
    return DEFAULT_COMPANY;
  });

  useEffect(() => {
    fetch('/api/settings/company')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          setCompanySettings(prev => ({ ...prev, ...data }));
        }
      })
      .catch(err => console.warn('Company settings DB fetch warning:', err));
  }, []);
  const stages = [
    {
      step: '01',
      code: 'CAD',
      title: 'Engineering Documentation',
      desc: '2D Drafting, Shop Drawings & As-Built Documentation',
      icon: <Building2 size={24} color="#087CFF" />,
      color: '#087CFF'
    },
    {
      step: '02',
      code: 'BIM',
      title: 'Digital Construction',
      desc: '3D BIM Modeling, 4D/5D Simulation & Clash Coordination',
      icon: <Compass size={24} color="#00B8FF" />,
      color: '#00B8FF'
    },
    {
      step: '03',
      code: 'REALITY CAPTURE',
      title: 'Laser Scanning & Point Clouds',
      desc: '3D Laser Scanning, As-Built Verification & Scan-to-BIM',
      icon: <Radio size={24} color="#10B981" />,
      color: '#10B981'
    },
    {
      step: '04',
      code: 'DIGITAL TWIN',
      title: 'Connected Asset Lifecycle',
      desc: 'Asset Twin, System Integration, Real-Time Monitoring & Asset Management',
      icon: <Layers size={24} color="#6366F1" />,
      color: '#6366F1'
    }
  ];

  return (
    <section
      className="who-we-are-section"
      style={{
        background: '#F8FAFC',
        padding: '80px 0',
        borderTop: '1px solid rgba(6, 59, 115, 0.06)',
        borderBottom: '1px solid rgba(6, 59, 115, 0.06)'
      }}
    >
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '56px',
            alignItems: 'center'
          }}
        >
          {/* LEFT COLUMN: Content */}
          <div style={{ maxWidth: '580px' }}>
            <h2 className="why-bce-main-heading" style={{ fontSize: '32px', margin: '0 0 14px 0' }}>
              Who We Are
            </h2>

            <div className="why-bce-divider-line"></div>

            <h3 
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '24px',
                fontWeight: '800',
                color: '#087CFF',
                margin: '0 0 20px 0',
                lineHeight: 1.3
              }}
            >
              Engineering Experience. Digital Innovation.
            </h3>

            <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.7, margin: '0 0 16px 0', fontWeight: '500' }}>
              {companySettings.whoWeArePara1}
            </p>

            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7, margin: '0 0 16px 0' }}>
              {companySettings.whoWeArePara2}
            </p>

            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7, margin: '0 0 20px 0' }}>
              {companySettings.whoWeArePara3}
            </p>

            {companySettings.whoWeArePara4 && (
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7, margin: '0 0 32px 0' }}>
                {companySettings.whoWeArePara4}
              </p>
            )}

            <button
              className="btn-blue-premium"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onNavigate) onNavigate('Our Journey');
              }}
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                background: 'linear-gradient(90deg, #087CFF, #00B8FF)',
                color: '#FFFFFF',
                fontWeight: '800',
                fontSize: '13.5px',
                letterSpacing: '0.5px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 16px rgba(8, 124, 255, 0.3)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(8, 124, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(8, 124, 255, 0.3)';
              }}
            >
              DISCOVER OUR JOURNEY <ArrowRight size={16} />
            </button>
          </div>

          {/* RIGHT COLUMN: Digital Transformation Visual Flow */}
          <div style={{ width: '100%', position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                position: 'relative'
              }}
            >
              {stages.map((stg, idx) => (
                <div key={stg.code} style={{ position: 'relative' }}>
                  {/* Stage Card */}
                  <div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '20px 24px',
                      border: '1px solid rgba(6, 59, 115, 0.08)',
                      boxShadow: '0 4px 20px rgba(6, 59, 115, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      zIndex: 2
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(6px)';
                      e.currentTarget.style.borderColor = stg.color;
                      e.currentTarget.style.boxShadow = `0 10px 30px ${stg.color}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.borderColor = 'rgba(6, 59, 115, 0.08)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(6, 59, 115, 0.04)';
                    }}
                  >
                    {/* Icon Pill */}
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        background: `${stg.color}12`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {stg.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: stg.color, letterSpacing: '1px' }}>
                          STAGE {stg.step}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '900', color: '#063B73', letterSpacing: '0.5px' }}>
                          • {stg.code}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#063B73', margin: '0 0 2px 0' }}>
                        {stg.title}
                      </h4>
                      <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                        {stg.desc}
                      </p>
                    </div>
                  </div>

                  {/* Connecting Flow Arrow between stages */}
                  {idx < stages.length - 1 && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '4px 0',
                        position: 'relative',
                        zIndex: 1
                      }}
                    >
                      <div
                        style={{
                          width: '2px',
                          height: '14px',
                          background: 'linear-gradient(180deg, #087CFF, #00B8FF)',
                          borderRadius: '1px'
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
