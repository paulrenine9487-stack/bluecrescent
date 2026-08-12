import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Eye, 
  Camera, 
  ShieldCheck, 
  Users, 
  Cpu, 
  ArrowRight, 
  Sparkles,
  Monitor,
  Bot
} from 'lucide-react';

const DEFAULT_REMOTE_PILLARS = [
  { id: 'support', title: 'Remote Site Support', desc: 'Connect project teams and technical specialists for faster real-time decision-making.', icon: 'Radio', slug: 'Remote Construction' },
  { id: 'ar-solutions', title: 'AR Solutions', desc: 'Augmented reality overlays for spatial coordination, design validation and clash detection.', icon: 'Eye', slug: 'AR Solutions' },
  { id: 'documentation', title: '360° Site Documentation', desc: 'Immersive 360° visual capture for complete site visibility and progress tracking.', icon: 'Camera', slug: '360° Capture' },
  { id: 'inspection', title: 'Remote Inspection', desc: 'Digital QA/QC inspection workflows reducing travel overhead while ensuring compliance.', icon: 'ShieldCheck', slug: 'Remote Construction' },
  { id: 'collaboration', title: 'Digital Collaboration', desc: 'Centralized cloud platforms enabling real-time site feeds and seamless coordination.', icon: 'Users', slug: 'Construction Technology' },
  { id: 'robotics', title: 'Robotic Integration', desc: 'Autonomous site scanning, robotic measurement devices and automated progress analytics.', icon: 'Cpu', slug: 'Robotics' }
];

const ICON_MAP = {
  Radio,
  Eye,
  Camera,
  ShieldCheck,
  Users,
  Cpu,
  Monitor,
  Bot,
  Sparkles
};

const cleanText = (val, fallback) => {
  if (!val) return fallback;
  const str = String(val).trim();
  if (str === '' || str.toLowerCase() === 'null' || str.toLowerCase() === 'undefined') {
    return fallback;
  }
  return str;
};

export default function RemoteConstruction({ onNavigate }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const [data, setData] = useState({
    remoteTitle: 'Remote Construction Solutions',
    remoteDesc: 'Connecting project teams, sites and technical specialists through digital technologies for improved collaboration, inspection and decision-making.',
    remoteImage: '/simulation.png',
    remoteOverlayText: 'Live Remote Site Inspection Active',
    remotePillarsJson: JSON.stringify(DEFAULT_REMOTE_PILLARS)
  });

  useEffect(() => {
    fetch('/api/settings/company')
      .then(res => res.ok ? res.json() : null)
      .then(resData => {
        if (resData) {
          setData(prev => ({
            ...prev,
            remoteTitle: cleanText(resData.remoteTitle, prev.remoteTitle),
            remoteDesc: cleanText(resData.remoteDesc, prev.remoteDesc),
            remoteImage: cleanText(resData.remoteImage, prev.remoteImage),
            remoteOverlayText: cleanText(resData.remoteOverlayText, prev.remoteOverlayText),
            remotePillarsJson: cleanText(resData.remotePillarsJson, prev.remotePillarsJson)
          }));
        }
      })
      .catch(err => console.warn('Remote construction settings load warning:', err));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  let pillarsList = DEFAULT_REMOTE_PILLARS;
  try {
    if (data.remotePillarsJson) {
      const parsed = JSON.parse(data.remotePillarsJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        pillarsList = parsed;
      }
    }
  } catch (e) {
    pillarsList = DEFAULT_REMOTE_PILLARS;
  }
  if (!Array.isArray(pillarsList)) {
    pillarsList = DEFAULT_REMOTE_PILLARS;
  }

  return (
    <section 
      id="remote-construction" 
      className={`remote-construction-section ${isVisible ? 'is-visible' : ''}`}
      ref={sectionRef}
    >
      <div className="container">
        <div className="remote-construction-grid">
          
          {/* LEFT COLUMN: Content Header & 6 Pillar Grid */}
          <div className="remote-content-col">
            <h2 className="remote-main-heading">
              {data.remoteTitle || 'Remote Construction Solutions'}
            </h2>
            <div className="why-bce-divider-line" style={{ marginBottom: '16px' }}></div>

            <p className="remote-desc-text">
              {data.remoteDesc}
            </p>

            {/* 6 Solutions Cards Grid */}
            <div className="remote-pillars-grid">
              {pillarsList.map((pillar, idx) => {
                const IconComponent = ICON_MAP[pillar.icon] || Radio;
                return (
                  <div 
                    key={pillar.id || idx} 
                    className="remote-card-glass"
                    onClick={() => {
                      if (onNavigate) onNavigate('Services', pillar.slug || 'Construction Technology');
                    }}
                  >
                    <div className="remote-icon-wrapper">
                      <IconComponent size={20} className="remote-card-icon" />
                    </div>
                    <div className="remote-card-info">
                      <h3 className="remote-card-title">{pillar.title}</h3>
                      <p className="remote-card-desc">{pillar.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Action */}
            <div className="remote-cta-wrap" style={{ marginTop: '24px' }}>
              <button
                type="button"
                className="btn-blue-premium"
                onClick={() => {
                  if (onNavigate) onNavigate('Services', 'Construction Technology');
                }}
              >
                <span>EXPLORE REMOTE CONSTRUCTION SOLUTIONS</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Engineering Technology Visual */}
          <div className="remote-visual-col">
            <div className="remote-image-frame">
              <img 
                src={data.remoteImage || '/simulation.png'} 
                alt="Remote Construction & Digital AR Inspection - Blue Crescent Engineering" 
                className="remote-tech-img"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
