import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function CredentialsSection({ onNavigate }) {
  const [certData, setCertData] = useState([
    {
      id: 'gsas',
      title: 'GSAS Design & Build Service Provider',
      org: 'GORD',
      image: '/certificate GSAG.png'
    },
    {
      id: 'iso',
      title: 'ISO 9001:2015 Quality Management System',
      org: 'BQSR',
      image: '/certificate IAF.png'
    }
  ]);

  useEffect(() => {
    fetch('/api/certificates')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) {
          const gsasItem = data.find(c => (c.title || '').toLowerCase().includes('gsas')) || data[0];
          const isoItem = data.find(c => (c.title || '').toLowerCase().includes('iso')) || data[1];

          setCertData([
            {
              id: gsasItem.id || 'gsas',
              title: 'GSAS Design & Build Service Provider',
              org: 'GORD',
              image: gsasItem.image || '/certificate GSAG.png'
            },
            {
              id: isoItem.id || 'iso',
              title: 'ISO 9001:2015 Quality Management System',
              org: 'BQSR',
              image: isoItem.image || '/certificate IAF.png'
            }
          ]);
        }
      })
      .catch(err => console.warn('Certificates fetch warning:', err));
  }, []);

  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate('Certifications');
    }
  };

  return (
    <section className="credentials-full-section bce-certifications-compact-section">
      {/* Subtle Engineering Grid Line-Art Background Overlay */}
      <div className="bce-cert-bg-overlay"></div>

      <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '1080px' }}>
        {/* Section Header with Left Content & Right Action Button */}
        <div className="bce-cert-header-row">
          <div className="bce-cert-header-info">
            <h2 className="bce-cert-main-heading" style={{ color: '#063B73' }}>
              CERTIFIED. TRUSTED. BUILT FOR EXCELLENCE.
            </h2>
            <p className="bce-cert-description" style={{ color: '#475569' }}>
              Our commitment to quality, sustainability and engineering excellence is supported by internationally recognized standards and certification frameworks.
            </p>
          </div>

          <div className="bce-cert-header-action">
            <button
              type="button"
              className="btn-blue-premium bce-view-all-certs-btn"
              onClick={() => {
                if (onNavigate) onNavigate('Certifications');
              }}
            >
              <span>VIEW ALL CERTIFICATES</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Exactly TWO Certificate Cards Side-by-Side */}
        <div className="bce-cert-cards-row">
          {certData.map((cert) => (
            <div
              key={cert.id}
              className="bce-cert-card"
              onClick={handleCardClick}
            >
              {/* Certificate Image Area */}
              <div className="bce-cert-image-area">
                <img
                  src={cert.image}
                  alt={`${cert.title} Document`}
                />
              </div>

              {/* Certificate Info */}
              <div className="bce-cert-card-info">
                <h3 className="bce-cert-card-title">{cert.title}</h3>
                <p className="bce-cert-card-org">
                  Certified by <span className="bce-cert-org-name">{cert.org}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
