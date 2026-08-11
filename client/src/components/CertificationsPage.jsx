import React, { useState, useEffect } from 'react';

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

      {/* Hero Header */}
      <section className="cert-page-hero">
        <div className="container">
          <div className="cert-hero-badge">
            <span className="badge-dot"></span>
            OFFICIAL COMPANY ACCREDITATIONS
          </div>
          <h1 className="cert-hero-title">
            Our Official <span className="cyan-text">Certifications</span> &amp; Licenses
          </h1>
          <p className="cert-hero-subtitle">
            Blue Crescent Engineering operates under strict international standards and official governing body accreditations in Qatar and globally.
          </p>
          <button
            className="btn-back-home"
            style={{ marginTop: '24px' }}
            onClick={() => { if (onNavigate) onNavigate('Home'); }}
          >
            ← BACK TO HOME
          </button>
        </div>
      </section>

      {/* Main Certifications Showcase */}
      <section className="cert-page-main container">
        <div className="cert-page-grid">
          {certificates.map((cert) => (
            <div key={cert.id} className="cert-full-card">
              <div
                className={`cert-card-media ${cert.borderColor}`}
                onClick={() => setActiveCertModal(cert.id)}
              >
                <img src={cert.image} alt={`${cert.title} Document`} />
                <div className="cert-media-overlay">
                  <span>🔍 CLICK TO ENLARGE FULL DOCUMENT</span>
                </div>
              </div>

              <div className="cert-card-info">
                <span className="cert-type-badge">{cert.badgeText}</span>
                <h2 className="cert-card-title">{cert.title}</h2>
                <span className="cert-org-name">Issuing Body: <strong>{cert.org}</strong></span>

                <div className="cert-meta-tags">
                  <div className="meta-tag">
                    <span className="meta-lbl">License / Cert No:</span>
                    <span className="meta-val">{cert.licenseNo}</span>
                  </div>
                  <div className="meta-tag">
                    <span className="meta-lbl">Territory:</span>
                    <span className="meta-val">{cert.territory}</span>
                  </div>
                </div>

                <p className="cert-scope-text">
                  <strong>Scope of Accreditation:</strong> {cert.scope}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certificate Modal - always shows full header */}
      {activeCertModal && selectedCert && (
        <div
          className="modal-backdrop"
          onClick={() => setActiveCertModal(null)}
          style={{
            alignItems: 'flex-start',
            paddingTop: '40px',
            paddingBottom: '40px',
            overflowY: 'auto'
          }}
        >
          <div
            className="modal-card cert-modal-card"
            style={{ maxWidth: '640px', width: '100%', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER — padding pushes it fully into view */}
            <div
              className="cert-modal-header"
              style={{ padding: '32px 32px 20px 32px', marginBottom: '0', flexShrink: 0 }}
            >
              <div
                className="cert-modal-title-group"
                style={{ flex: 1, minWidth: 0, paddingRight: '16px' }}
              >
                <span className="cert-modal-badge">
                  <span className="badge-dot"></span>
                  OFFICIAL ACCREDITATION DOCUMENT
                </span>
                <h3 style={{
                  color: '#FFFFF0',
                  fontSize: '22px',
                  fontWeight: '700',
                  lineHeight: '1.4',
                  letterSpacing: '0.3px',
                  marginTop: '8px',
                  marginBottom: '0',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  maxWidth: '100%'
                }}>
                  {selectedCert.title}
                </h3>
              </div>
              <button
                className="cert-close-btn"
                onClick={() => setActiveCertModal(null)}
                aria-label="Close Modal"
                style={{
                  flexShrink: 0,
                  alignSelf: 'flex-start',
                  marginTop: '4px',
                  color: '#00D9FF',
                  background: 'rgba(0,217,255,0.12)',
                  border: '1px solid rgba(0,217,255,0.4)',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                ✕
              </button>
            </div>

            {/* BODY — scrollable */}
            <div
              className="cert-modal-body"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '24px 32px 32px 32px',
                maxHeight: '70vh',
                overflowY: 'auto'
              }}
            >
              <div style={{ textAlign: 'center', width: '100%' }}>
                <img
                  src={selectedCert.image}
                  alt={selectedCert.title}
                  style={{ width: '100%', borderRadius: '8px', boxShadow: '0 6px 20px rgba(0,0,0,0.5)', border: '2px solid rgba(0, 184, 255, 0.4)', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

