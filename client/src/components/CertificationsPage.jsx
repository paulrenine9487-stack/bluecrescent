import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function CertificationsPage({ onNavigate }) {
  const [activeCertModal, setActiveCertModal] = useState(null);
  const [dynamicCerts, setDynamicCerts] = useState([]);

  useEffect(() => {
    fetch('/api/certificates')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) {
          setDynamicCerts(data);
        }
      })
      .catch(err => console.warn('Certificates fetch warning:', err));
  }, []);

  const fallbackCertificates = [
    {
      id: 'gsas',
      title: 'GSAS Design & Build Service Provider',
      org: 'Gulf Organisation for Research & Development (GORD) & GSAS',
      licenseNo: 'SPD-QA109-00109',
      territory: 'Qatar',
      validity: 'Valid & Recognized',
      borderColor: 'border-green',
      badgeText: 'GSAS CERTIFIED',
      image: '/certificate GSAG.png',
      scope: 'Type I - Building Typologies License covering Commercial, Offices, Residential, Education, Mosques, Hospitality, Homes, Light Industry, Parks, Interiors & Renovations.'
    },
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
      scope: 'Providing Engineering Services & Sustainability Consultancy adhering to international quality control standards.'
    }
  ];

  const certificates = dynamicCerts.length > 0 ? dynamicCerts : fallbackCertificates;
  const selectedCert = certificates.find(c => c.id === activeCertModal || c.id?.toString() === activeCertModal?.toString());

  return (
    <div className="certifications-page-root">
      {/* 1. Hero Banner */}
      <section className="cert-page-hero">
        <div className="container">
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
        </div>
      </section>

      {/* 2. Main Certifications Showcase */}
      <section className="cert-page-main container">
        <div className="cert-page-grid">
          {certificates.map((cert) => (
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
          ))}
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
