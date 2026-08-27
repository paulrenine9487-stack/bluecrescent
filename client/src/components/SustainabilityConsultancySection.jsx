import React, { useState, useEffect } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  SearchCheck, 
  FileCheck2, 
  TreePine, 
  ArrowRight,
  Leaf
} from 'lucide-react';
import './SustainabilityConsultancySection.css';

const DEFAULT_CAPABILITIES = [
  { name: 'GSAS', icon: 'Award', slug: 'GSAS', desc: 'GSAS Consultancy & Certification Guidance' },
  { name: 'LEED', icon: 'ShieldCheck', slug: 'LEED', desc: 'LEED BD+C, ID+C & O+M Consultancy' },
  { name: 'Energy Audits', icon: 'Zap', slug: 'Energy Audit', desc: 'ASHRAE Level 1, 2 & 3 Diagnostics' },
  { name: 'Carbon Management', icon: 'BarChart3', slug: 'Carbon Management', desc: 'GHG Footprinting & Decarbonization' },
  { name: 'Green Building Gap Analysis', icon: 'SearchCheck', slug: 'Sustainability Services', desc: 'Compliance & Performance Assessment' },
  { name: 'ISO 14064', icon: 'FileCheck2', slug: 'Carbon Management', desc: 'GHG Verification & Reporting Standards' },
  { name: 'Environmental Consultancy', icon: 'TreePine', slug: 'Sustainability Services', desc: 'Ecological & Environmental Solutions' }
];

const ICON_MAP = {
  Award,
  ShieldCheck,
  Zap,
  BarChart3,
  SearchCheck,
  FileCheck2,
  TreePine,
  Leaf
};

const cleanText = (val, fallback) => {
  if (!val) return fallback;
  const str = String(val).trim();
  if (str === '' || str.toLowerCase() === 'null' || str.toLowerCase() === 'undefined') {
    return fallback;
  }
  return str;
};

export default function SustainabilityConsultancySection({ onNavigate }) {
  const [data, setData] = useState({
    sustainabilityTitle: 'SUSTAINABILITY CONSULTANCY',
    sustainabilitySubHeading: 'Building Better, Building Sustainably.',
    sustainabilityLeadDesc: 'Helping projects achieve better environmental performance, regulatory compliance and internationally recognized sustainability objectives.',
    sustainabilitySupportingDesc: 'Our sustainability consultancy capabilities support projects across design, construction, operations and maintenance, with a focus on energy performance, environmental responsibility and sustainable building practices.',
    sustainabilityImage: '/sust_workshop.png',
    sustainabilityBadgeTitle: 'SUSTAINABLE ENGINEERING',
    sustainabilityBadgeSubtitle: 'GSAS • LEED • ENERGY • CARBON',
    sustainabilityCapabilitiesJson: JSON.stringify(DEFAULT_CAPABILITIES)
  });

  useEffect(() => {
    fetch('/api/settings/company')
      .then(res => res.ok ? res.json() : null)
      .then(resData => {
        if (resData) {
          setData(prev => ({
            ...prev,
            sustainabilityTitle: cleanText(resData.sustainabilityTitle, prev.sustainabilityTitle),
            sustainabilitySubHeading: cleanText(resData.sustainabilitySubHeading, prev.sustainabilitySubHeading),
            sustainabilityLeadDesc: cleanText(resData.sustainabilityLeadDesc, prev.sustainabilityLeadDesc),
            sustainabilitySupportingDesc: cleanText(resData.sustainabilitySupportingDesc, prev.sustainabilitySupportingDesc),
            sustainabilityImage: cleanText(resData.sustainabilityImage, prev.sustainabilityImage),
            sustainabilityBadgeTitle: cleanText(resData.sustainabilityBadgeTitle, prev.sustainabilityBadgeTitle),
            sustainabilityBadgeSubtitle: cleanText(resData.sustainabilityBadgeSubtitle, prev.sustainabilityBadgeSubtitle),
            sustainabilityCapabilitiesJson: cleanText(resData.sustainabilityCapabilitiesJson, prev.sustainabilityCapabilitiesJson)
          }));
        }
      })
      .catch(err => console.warn('Sustainability section settings load warning:', err));
  }, []);

  let capabilitiesList = DEFAULT_CAPABILITIES;
  try {
    if (data.sustainabilityCapabilitiesJson) {
      const parsed = JSON.parse(data.sustainabilityCapabilitiesJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        capabilitiesList = parsed;
      }
    }
  } catch (e) {
    capabilitiesList = DEFAULT_CAPABILITIES;
  }
  if (!Array.isArray(capabilitiesList)) {
    capabilitiesList = DEFAULT_CAPABILITIES;
  }

  const handleCtaClick = () => {
    if (onNavigate) {
      onNavigate('Services', 'Sustainability Services');
    }
  };

  const handleCapabilityClick = (slug) => {
    if (onNavigate) {
      onNavigate('Services', slug || 'Sustainability Services');
    }
  };

  return (
    <section className="sustainability-consultancy-section">
      <div className="sust-tech-bg-overlay"></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="sustainability-consultancy-grid">
          
          {/* LEFT COLUMN: Visual Presentation Container */}
          <div className="sust-visual-column">
            <div className="sust-image-container">
              <img
                src={cleanText(data.sustainabilityImage, '/sust_workshop.png')}
                alt="Blue Crescent Engineering Sustainability Consultancy"
                className="sust-main-image"
                loading="lazy"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Section Header, Copy & Capability Grid */}
          <div className="sust-content-column">
            {/* Main Section Title */}
            <div className="sust-title-wrap">
              <h2 className="sust-main-title">{cleanText(data.sustainabilityTitle, 'SUSTAINABILITY CONSULTANCY')}</h2>
              <div className="sust-title-underline"></div>
            </div>

            {/* Subtitle */}
            <h3 className="sust-sub-heading">
              {cleanText(data.sustainabilitySubHeading, 'Building Better, Building Sustainably.')}
            </h3>

            {/* Descriptions */}
            <p className="sust-lead-description">
              {cleanText(data.sustainabilityLeadDesc, 'Helping projects achieve better environmental performance, regulatory compliance and internationally recognized sustainability objectives.')}
            </p>

            <p className="sust-supporting-description">
              {cleanText(data.sustainabilitySupportingDesc, 'Our sustainability consultancy capabilities support projects across design, construction, operations and maintenance, with a focus on energy performance, environmental responsibility and sustainable building practices.')}
            </p>

            {/* Core Capabilities Chips */}
            <div className="sust-capabilities-wrapper">
              <h3 className="sust-capabilities-title">CORE CAPABILITIES</h3>
              
              <div className="sust-chips-grid">
                {capabilitiesList.map((cap, idx) => {
                  const IconComp = ICON_MAP[cap.icon] || Award;
                  return (
                    <button
                      key={idx}
                      className="sust-capability-chip"
                      onClick={() => handleCapabilityClick(cap.slug)}
                      title={`View ${cap.name} details`}
                      type="button"
                    >
                      <span className="sust-chip-icon-wrap">
                        <IconComp size={16} className="sust-chip-icon" />
                      </span>
                      <span className="sust-chip-name">{cap.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA Button */}
            <div className="sust-cta-wrap">
              <button 
                className="sust-cta-button" 
                onClick={handleCtaClick}
                type="button"
              >
                <span>EXPLORE SUSTAINABILITY SERVICES</span>
                <ArrowRight size={18} className="sust-cta-arrow" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
