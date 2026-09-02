import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import DynamicBanner from './DynamicBanner';

export default function CertificationsPage({ onNavigate }) {
  const [activeCertModal, setActiveCertModal] = useState(null);
  const [dynamicCerts, setDynamicCerts] = useState([]);
  const [sec1Filter, setSec1Filter] = useState('ALL');
  const [sec2Filter, setSec2Filter] = useState('ALL');

  const [sec1Index, setSec1Index] = useState(0);
  const [sec1Paused, setSec1Paused] = useState(false);
  const [sec2Index, setSec2Index] = useState(0);
  const [sec2Paused, setSec2Paused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cardsToShow = windowWidth < 900 ? 1 : 2;

  const fetchCertificatesData = () => {
    fetch('/api/certificates')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) {
          setDynamicCerts(data);
        }
      })
      .catch(err => console.warn('Certificates fetch warning:', err));
  };

  useEffect(() => {
    fetchCertificatesData();
    window.addEventListener('dataUpdated', fetchCertificatesData);
    window.addEventListener('menuUpdated', fetchCertificatesData);
    return () => {
      window.removeEventListener('dataUpdated', fetchCertificatesData);
      window.removeEventListener('menuUpdated', fetchCertificatesData);
    };
  }, []);

  const fallbackCertificates = [
    {
      id: 'iso',
      title: 'ISO 9001:2015 Quality Management System',
      org: 'BQSR Quality Assurance Pvt. Ltd. (Accredited by IAS & IAF)',
      licenseNo: 'Cert No. 10487',
      territory: 'International / Qatar',
      validity: 'Valid & Recognized',
      borderColor: 'border-gold',
      badgeText: 'ISO 9001:2015 CERTIFIED',
      image: '/certificate IAF.png',
      scope: 'Providing Engineering Services & Sustainability Consultancy adhering to international quality control standards.',
      cert_category: 'Authority Certificates'
    },
    {
      id: 'gsas-auth',
      title: 'GSAS Design & Build Service Provider',
      org: 'Gulf Organisation for Research & Development (GORD) & GSAS',
      licenseNo: 'SPD-QA109-00109',
      territory: 'Qatar',
      validity: 'Valid & Recognized',
      borderColor: 'border-green',
      badgeText: 'GSAS CERTIFIED',
      image: '/certificate GSAG.png',
      scope: 'Type I - Building Typologies License covering Commercial, Offices, Residential, Education, Mosques, Hospitality, Homes, Light Industry, Parks, Interiors & Renovations.',
      cert_category: 'Authority Certificates'
    },
    {
      id: 'gsas-comp',
      title: 'GSAS Building Sustainability Completion Certificate',
      org: 'Gulf Organisation for Research & Development (GORD)',
      licenseNo: 'GSAS-COMP-2025-01',
      territory: 'Qatar',
      validity: 'Verified Completion',
      borderColor: 'border-green',
      badgeText: 'COMPLETION CERTIFICATE',
      image: '/certificate GSAG.png',
      scope: 'Official completion & compliance verification for sustainable building design and construction handover.',
      cert_category: 'Completion Certificates'
    },
    {
      id: 'bim-comp',
      title: 'BIM Project Execution & LOD 500 Completion Certificate',
      org: 'Blue Crescent Engineering & Building Authorities',
      licenseNo: 'BIM-LOD500-2025-02',
      territory: 'Qatar & GCC',
      validity: 'Verified Completion',
      borderColor: 'border-blue',
      badgeText: 'COMPLETION CERTIFICATE',
      image: '/bimmodel.png',
      scope: 'LOD 500 As-Built BIM model verification, multidisciplinary clash detection, and asset handover completion.',
      cert_category: 'Completion Certificates'
    },
    {
      id: 'ls-comp',
      title: '3D Laser Scanning & Scan-to-BIM Completion Certificate',
      org: 'Faro & Leica Reality Capture Standards',
      licenseNo: 'LS-3D-2025-03',
      territory: 'Qatar',
      validity: 'Verified Completion',
      borderColor: 'border-blue',
      badgeText: 'COMPLETION CERTIFICATE',
      image: '/servicepage1.png',
      scope: 'High-precision 3D point cloud capture, dimensional verification, and as-built scan-to-BIM model delivery.',
      cert_category: 'Completion Certificates'
    },
    {
      id: 'dt-comp',
      title: 'Digital Twin Infrastructure Handover Completion Certificate',
      org: 'Blue Crescent Digital Transformation Division',
      licenseNo: 'DT-HANDOVER-2025-04',
      territory: 'Qatar & GCC',
      validity: 'Verified Completion',
      borderColor: 'border-cyan',
      badgeText: 'COMPLETION CERTIFICATE',
      image: '/why.png',
      scope: 'Operational digital twin integration connecting BIM spatial models with real-time IoT facility management systems.',
      cert_category: 'Completion Certificates'
    }
  ];

  const certificates = dynamicCerts.length > 0 ? dynamicCerts : fallbackCertificates;
  const selectedCert = certificates.find(c => c.id === activeCertModal || c.id?.toString() === activeCertModal?.toString());

  const authorityCerts = certificates.filter(c => 
    (c.cert_category || '').toLowerCase().includes('authority') ||
    (c.title || '').toLowerCase().includes('iso') ||
    (c.badgeText || '').toLowerCase().includes('iso') ||
    (c.id === 'gsas-auth' || c.id === 'iso')
  );

  const completionCerts = certificates.filter(c => 
    (c.cert_category || '').toLowerCase().includes('completion') ||
    (c.badgeText || '').toLowerCase().includes('completion') ||
    (c.id && c.id.toString().includes('comp')) ||
    !authorityCerts.some(a => a.id === c.id)
  );

  const sec1Tabs = [
    { key: 'ALL', label: 'All Authority Certs', icon: '📜' },
    { key: 'ISO 9001:2015', label: 'ISO 9001:2015', icon: '🛡️' },
    { key: 'GSAS Provider', label: 'GSAS Provider', icon: '🌱' }
  ];

  const sec2Tabs = [
    { key: 'ALL', label: 'All Completion Certs', icon: '📜' },
    { key: 'GSAS', label: 'GSAS', icon: '🌱' },
    { key: 'BIM LOD 500', label: 'BIM LOD 500', icon: '⚙️' },
    { key: 'Laser Scanning', label: 'Laser Scanning', icon: '📷' },
    { key: 'Digital Twin', label: 'Digital Twin', icon: '💻' }
  ];

  const filteredAuthorityCerts = authorityCerts.filter(c => {
    if (sec1Filter === 'ALL') return true;
    if (sec1Filter === 'ISO 9001:2015') return (c.title || '').toLowerCase().includes('iso');
    if (sec1Filter === 'GSAS Provider') return (c.title || '').toLowerCase().includes('gsas');
    return true;
  });

  const filteredCompletionCerts = completionCerts.filter(c => {
    if (sec2Filter === 'ALL') return true;
    if (sec2Filter === 'GSAS') return (c.title || '').toLowerCase().includes('gsas');
    if (sec2Filter === 'BIM LOD 500') return (c.title || '').toLowerCase().includes('bim');
    if (sec2Filter === 'Laser Scanning') return (c.title || '').toLowerCase().includes('scanning') || (c.title || '').toLowerCase().includes('laser');
    if (sec2Filter === 'Digital Twin') return (c.title || '').toLowerCase().includes('twin') || (c.title || '').toLowerCase().includes('digital');
    return true;
  });

  useEffect(() => {
    setSec1Index(0);
  }, [sec1Filter]);

  useEffect(() => {
    setSec2Index(0);
  }, [sec2Filter]);

  // Section 01 Auto-Scroll loop
  useEffect(() => {
    if (sec1Paused || filteredAuthorityCerts.length <= cardsToShow) return;
    const interval = setInterval(() => {
      setSec1Index(prev => (prev < filteredAuthorityCerts.length - cardsToShow ? prev + 1 : 0));
    }, 3500);
    return () => clearInterval(interval);
  }, [sec1Paused, filteredAuthorityCerts.length, cardsToShow]);

  // Section 02 Auto-Scroll loop
  useEffect(() => {
    if (sec2Paused || filteredCompletionCerts.length <= cardsToShow) return;
    const interval = setInterval(() => {
      setSec2Index(prev => (prev < filteredCompletionCerts.length - cardsToShow ? prev + 1 : 0));
    }, 3500);
    return () => clearInterval(interval);
  }, [sec2Paused, filteredCompletionCerts.length, cardsToShow]);

  const renderCertCard = (cert) => (
    <div key={cert.id} className="cert-full-card" onClick={() => setActiveCertModal(cert.id)}>
      <div className="cert-card-media">
        <img src={cert.image} alt={`${cert.title} Document`} />
        <div className="cert-media-overlay">
          <span>🔍 CLICK TO ENLARGE FULL DOCUMENT</span>
        </div>
      </div>

      <div className="cert-card-info">
        <span className="cert-type-badge">{cert.badgeText || 'OFFICIAL CERTIFICATE'}</span>
        <h2 className="cert-card-title">{cert.title}</h2>
        <span className="cert-org-name">Issuing Body: <strong>{cert.org}</strong></span>

        <div className="cert-meta-tags">
          {cert.licenseNo && (
            <div className="meta-tag">
              <span className="meta-lbl">License / Cert No:</span>
              <span className="meta-val">{cert.licenseNo}</span>
            </div>
          )}
          {cert.territory && (
            <div className="meta-tag">
              <span className="meta-lbl">Territory:</span>
              <span className="meta-val">{cert.territory}</span>
            </div>
          )}
        </div>

        {cert.scope && (
          <div className="cert-scope-box">
            <strong>Scope of Accreditation:</strong> {cert.scope}
          </div>
        )}

        <button
          type="button"
          className="btn-blue-premium cert-card-view-btn"
          onClick={(e) => {
            e.stopPropagation();
            setActiveCertModal(cert.id);
          }}
        >
          <span>VIEW FULL DOCUMENT</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="certifications-page-root">
      {/* 1. Dynamic Live Hero Banner */}
      <DynamicBanner
        pageKey="certifications"
        defaultImage="/credentials_cityscape_bg.png"
        defaultImages={['/credentials_cityscape_bg.png', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80', '/servicepage1.png']}
      >
        <div className="cert-hero-badge">
          <span className="badge-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00D9FF', display: 'inline-block' }}></span>
          OFFICIAL COMPANY ACCREDITATIONS
        </div>
        <h1 className="cert-hero-title" style={{ color: '#FFFFF0' }}>
          Our Official <span className="cyan-text" style={{ color: '#00D9FF' }}>Certifications</span> &amp; Licenses
        </h1>
        <p className="cert-hero-subtitle" style={{ color: '#FFFFF0' }}>
          Blue Crescent Engineering operates under strict international standards and official governing body accreditations in Qatar and globally.
        </p>
        <button
          type="button"
          className="btn-back-home"
          onClick={() => { if (onNavigate) onNavigate('Home'); }}
        >
          <ArrowLeft size={16} /> BACK TO HOME
        </button>
      </DynamicBanner>

      {/* 2. Main Certifications Showcase */}
      <section className="cert-page-main container" style={{ paddingBottom: '90px' }}>
        
        {/* SECTION A: Authority Certificates */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', borderBottom: '2px solid #E2E8F0', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#0057B8', color: '#FFFFFF', padding: '6px 14px', borderRadius: '8px', fontWeight: '800', fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif' }}>
                SECTION 01
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '24px', fontWeight: '800', color: '#062F63', margin: 0 }}>
                Authority Certificates
              </h2>
            </div>

            {/* Sub-Category Tabs (Image-1 Style) */}
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              {sec1Tabs.map(tab => {
                const isActive = sec1Filter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSec1Filter(tab.key)}
                    style={{
                      padding: '10px 16px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: isActive ? '3px solid #087CFF' : '3px solid transparent',
                      color: isActive ? '#087CFF' : '#64748B',
                      fontWeight: isActive ? '700' : '600',
                      fontSize: '13.5px',
                      cursor: 'pointer',
                      letterSpacing: '0.3px',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px'
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>{tab.icon}</span>
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 01 Auto Horizontal Slider */}
          <div 
            style={{ width: '100%', overflow: 'hidden', padding: '12px 0 24px 0' }}
            onMouseEnter={() => setSec1Paused(true)}
            onMouseLeave={() => setSec1Paused(false)}
          >
            <div
              style={{
                display: 'flex',
                transform: `translateX(calc(-${sec1Index} * (100% / ${cardsToShow} + ${24 / cardsToShow}px)))`,
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                gap: '24px',
                alignItems: 'stretch'
              }}
            >
              {filteredAuthorityCerts.map(cert => (
                <div 
                  key={cert.id} 
                  style={{ flex: `0 0 calc(${100 / cardsToShow}% - ${(24 * (cardsToShow - 1)) / cardsToShow}px)`, boxSizing: 'border-box' }}
                >
                  {renderCertCard(cert)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION B: Completion Certificates */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', borderBottom: '2px solid #E2E8F0', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#10B981', color: '#FFFFFF', padding: '6px 14px', borderRadius: '8px', fontWeight: '800', fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif' }}>
                SECTION 02
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '24px', fontWeight: '800', color: '#062F63', margin: 0 }}>
                Completion Certificates
              </h2>
            </div>

            {/* Sub-Category Tabs (Image-1 Style) */}
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              {sec2Tabs.map(tab => {
                const isActive = sec2Filter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSec2Filter(tab.key)}
                    style={{
                      padding: '10px 16px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: isActive ? '3px solid #10B981' : '3px solid transparent',
                      color: isActive ? '#059669' : '#64748B',
                      fontWeight: isActive ? '700' : '600',
                      fontSize: '13.5px',
                      cursor: 'pointer',
                      letterSpacing: '0.3px',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px'
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>{tab.icon}</span>
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 02 Auto Horizontal Slider */}
          <div 
            style={{ width: '100%', overflow: 'hidden', padding: '12px 0 24px 0' }}
            onMouseEnter={() => setSec2Paused(true)}
            onMouseLeave={() => setSec2Paused(false)}
          >
            <div
              style={{
                display: 'flex',
                transform: `translateX(calc(-${sec2Index} * (100% / ${cardsToShow} + ${24 / cardsToShow}px)))`,
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                gap: '24px',
                alignItems: 'stretch'
              }}
            >
              {filteredCompletionCerts.map(cert => (
                <div 
                  key={cert.id} 
                  style={{ flex: `0 0 calc(${100 / cardsToShow}% - ${(24 * (cardsToShow - 1)) / cardsToShow}px)`, boxSizing: 'border-box' }}
                >
                  {renderCertCard(cert)}
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* 3. Certificate Lightbox Modal */}
      {activeCertModal && selectedCert && (
        <div
          className="modal-backdrop"
          onClick={() => setActiveCertModal(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(6, 14, 26, 0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '30px 20px'
          }}
        >
          <div
            className="modal-card cert-modal-card"
            style={{
              maxWidth: '680px',
              width: '100%',
              maxHeight: '80vh',
              background: '#071C3B',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(0, 217, 255, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              margin: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="cert-modal-header"
              style={{
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                background: '#0B1F3A',
                flexShrink: 0
              }}
            >
              <div style={{ paddingRight: '12px', flex: 1 }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#00D9FF', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                  OFFICIAL ACCREDITATION DOCUMENT
                </span>
                <h3 style={{ color: '#FFFFFF', fontSize: '16.5px', fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                  {selectedCert.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCertModal(null)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: '#FFF',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                ✕
              </button>
            </div>
            <div style={{
              padding: '20px',
              textAlign: 'center',
              background: '#020C1B',
              overflowY: 'auto',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={selectedCert.image}
                alt={selectedCert.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: 'calc(80vh - 100px)',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
