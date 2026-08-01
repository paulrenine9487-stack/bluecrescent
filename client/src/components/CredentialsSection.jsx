import React, { useState } from 'react';
import { ShieldCheck, Leaf, Globe, Award } from 'lucide-react';
import cityscapeBg from '../assets/credentials_cityscape_bg.png';

export default function CredentialsSection({ onNavigate }) {
  const [activeCertModal, setActiveCertModal] = useState(null);

  return (
    <section className="credentials-full-section">
      {/* Cityscape background image container */}
      <div 
        className="credentials-bg-cityscape" 
        style={{ backgroundImage: `url(${cityscapeBg})` }}
      ></div>

      {/* Blueprint drawing in the upper-right corner */}
      <div className="credentials-blueprint-top-right">
        <svg width="450" height="450" viewBox="0 0 450 450" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="280" cy="170" r="140" stroke="rgba(0, 184, 255, 0.4)" strokeWidth="1" />
          <circle cx="280" cy="170" r="100" stroke="rgba(0, 184, 255, 0.3)" strokeWidth="1" />
          <circle cx="280" cy="170" r="60" stroke="rgba(0, 184, 255, 0.3)" strokeWidth="1" />
          <circle cx="280" cy="170" r="180" stroke="rgba(0, 184, 255, 0.2)" strokeDasharray="5,5" strokeWidth="1" fill="none" />
          <line x1="80" y1="170" x2="480" y2="170" stroke="rgba(0, 184, 255, 0.3)" strokeWidth="1" />
          <line x1="280" y1="-30" x2="280" y2="370" stroke="rgba(0, 184, 255, 0.3)" strokeWidth="1" />
          <rect x="200" y="90" width="160" height="160" stroke="rgba(0, 184, 255, 0.25)" strokeWidth="1" />
          <rect x="230" y="120" width="100" height="100" stroke="rgba(0, 184, 255, 0.2)" strokeWidth="1" />
          <path d="M 140,170 A 140,140 0 0,1 280,30" stroke="rgba(0, 217, 255, 0.5)" strokeWidth="1.5" />
          <line x1="280" y1="30" x2="280" y2="15" stroke="rgba(0, 217, 255, 0.6)" strokeWidth="2" />
          <line x1="420" y1="170" x2="435" y2="170" stroke="rgba(0, 217, 255, 0.6)" strokeWidth="2" />
        </svg>
      </div>

      {/* Engineering wireframe on the left side */}
      <div className="credentials-wireframe-left">
        <svg width="350" height="550" viewBox="0 0 350 550" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="40" y1="100" x2="200" y2="160" stroke="rgba(0, 217, 255, 0.3)" strokeWidth="1.5" />
          <line x1="200" y1="160" x2="100" y2="280" stroke="rgba(0, 217, 255, 0.3)" strokeWidth="1.5" />
          <line x1="100" y1="280" x2="260" y2="330" stroke="rgba(0, 217, 255, 0.3)" strokeWidth="1.5" />
          <line x1="260" y1="330" x2="130" y2="450" stroke="rgba(0, 217, 255, 0.3)" strokeWidth="1.5" />
          
          <line x1="40" y1="100" x2="100" y2="280" stroke="rgba(0, 217, 255, 0.25)" strokeWidth="1.2" />
          <line x1="200" y1="160" x2="260" y2="330" stroke="rgba(0, 217, 255, 0.25)" strokeWidth="1.2" />
          <line x1="100" y1="280" x2="130" y2="450" stroke="rgba(0, 217, 255, 0.25)" strokeWidth="1.2" />
          
          <line x1="40" y1="100" x2="40" y2="280" stroke="rgba(0, 217, 255, 0.15)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="200" y1="160" x2="200" y2="410" stroke="rgba(0, 217, 255, 0.15)" strokeWidth="1" strokeDasharray="3,3" />
          
          <circle cx="40" cy="100" r="5" fill="#00D9FF" fillOpacity="0.4" stroke="rgba(0, 217, 255, 0.6)" strokeWidth="1.5" />
          <circle cx="200" cy="160" r="5" fill="#00D9FF" fillOpacity="0.4" stroke="rgba(0, 217, 255, 0.6)" strokeWidth="1.5" />
          <circle cx="100" cy="280" r="5" fill="#00D9FF" fillOpacity="0.4" stroke="rgba(0, 217, 255, 0.6)" strokeWidth="1.5" />
          <circle cx="260" cy="330" r="5" fill="#00D9FF" fillOpacity="0.4" stroke="rgba(0, 217, 255, 0.6)" strokeWidth="1.5" />
          <circle cx="130" cy="450" r="5" fill="#00D9FF" fillOpacity="0.4" stroke="rgba(0, 217, 255, 0.6)" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="container credentials-container">
        {/* Top Header Row with Section details & Feature outline glass blocks */}
        <div className="credentials-header-row">
          <div className="credentials-header-info">
            <span className="credentials-sub-badge">OUR GLOBAL CERTIFICATIONS</span>
            <h2 className="credentials-main-heading">
              Certified. Trusted. <br />
              Committed to <span className="gradient-excellence-text">Excellence.</span>
            </h2>
            <p className="credentials-desc-text">
              We are recognized by international bodies for our commitment to quality, sustainability and engineering excellence.
            </p>
            <button 
              className="btn-cyan-premium"
              onClick={() => {
                if (onNavigate) onNavigate('Certifications');
              }}
            >
              VIEW ALL CERTIFICATIONS →
            </button>
          </div>

          <div className="credentials-feature-blocks">
            <div className="feature-block-glass">
              <div className="feature-icon-wrapper">
                <ShieldCheck size={26} className="feature-icon" strokeWidth={1.5} />
              </div>
              <span className="feature-label">Internationally Certified</span>
            </div>

            <div className="feature-block-glass">
              <div className="feature-icon-wrapper">
                <Leaf size={26} className="feature-icon" strokeWidth={1.5} />
              </div>
              <span className="feature-label">Sustainable Engineering</span>
            </div>

            <div className="feature-block-glass">
              <div className="feature-icon-wrapper">
                <Globe size={26} className="feature-icon" strokeWidth={1.5} />
              </div>
              <span className="feature-label">Global Standards</span>
            </div>

            <div className="feature-block-glass">
              <div className="feature-icon-wrapper">
                <Award size={26} className="feature-icon" strokeWidth={1.5} />
              </div>
              <span className="feature-label">Quality Excellence</span>
            </div>
          </div>
        </div>

        {/* Certificate Cards */}
        <div className="credentials-cards-grid">
          {/* Card 1: GSAS */}
          <div className="cert-card-glass" onClick={() => setActiveCertModal('gsas')}>
            <div className="cert-card-image-wrap">
              <img 
                src="/certificate GSAG.png" 
                alt="GSAS Design & Build Service Provider Certificate - Blue Crescent Engineering" 
              />
              <div className="cert-card-image-hover">
                <span>🔍 CLICK TO ENLARGE</span>
              </div>
            </div>
            <div className="cert-card-content">
              <h3 className="cert-title-text">GSAS Design & Build Service Provider</h3>
              <span className="cert-by-text">Certified by <span className="cert-highlight-cyan">GORD</span></span>
              <p className="cert-body-text">
                Recognized as GSAS Design & Build Service Provider for delivering sustainable and high performance building solutions.
              </p>
              <button 
                className="cert-link-btn" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setActiveCertModal('gsas'); 
                }}
              >
                View Certificate →
              </button>
            </div>
          </div>

          {/* Glowing Vertical Divider */}
          <div className="credentials-glow-divider"></div>

          {/* Card 2: ISO 9001 */}
          <div className="cert-card-glass" onClick={() => setActiveCertModal('iso')}>
            <div className="cert-card-image-wrap">
              <img 
                src="/certificate IAF.png" 
                alt="ISO 9001:2015 BQSR Quality Management System Certificate - Blue Crescent Engineering" 
              />
              <div className="cert-card-image-hover">
                <span>🔍 CLICK TO ENLARGE</span>
              </div>
            </div>
            <div className="cert-card-content">
              <h3 className="cert-title-text">ISO 9001:2015 Quality Management System</h3>
              <span className="cert-by-text">Certified by <span className="cert-highlight-cyan">BQSR</span></span>
              <p className="cert-body-text">
                Our Quality Management System is certified to ISO 9001:2015 ensuring world-class processes and client satisfaction.
              </p>
              <button 
                className="cert-link-btn" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setActiveCertModal('iso'); 
                }}
              >
                View Certificate →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Lightbox Modal */}
      {activeCertModal && (
        <div className="modal-backdrop" onClick={() => setActiveCertModal(null)}>
          <div className="modal-card cert-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cert-modal-header">
              <div className="cert-modal-title-group">
                <span className="cert-modal-badge">
                  <span className="badge-dot"></span>
                  OFFICIAL ACCREDITATION DOCUMENT
                </span>
                <h3>
                  {activeCertModal === 'gsas' 
                    ? 'GORD GSAS Design & Build Service Provider Certificate' 
                    : 'ISO 9001:2015 Quality Management System Certificate'
                  }
                </h3>
              </div>
              <button 
                className="cert-close-btn" 
                onClick={() => setActiveCertModal(null)}
                aria-label="Close Modal"
              >
                ✕
              </button>
            </div>
            <div className="cert-modal-body">
              <img 
                src={activeCertModal === 'gsas' ? '/certificate GSAG.png' : '/certificate IAF.png'} 
                alt="Official Certificate Document - Blue Crescent Engineering" 
                className="cert-full-img" 
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

