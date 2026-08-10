import React, { useState, useEffect, useRef } from 'react';
import { Monitor, Camera, Cpu, ArrowRight } from 'lucide-react';
import techImage from '/simulation.png';

export default function RemoteConstruction({ onNavigate }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const featureCards = [
    {
      id: 'support',
      title: 'Remote Site Support',
      desc: 'Connect project teams and technical specialists with remote site support for faster collaboration, inspection and decision-making.',
      icon: <Monitor size={26} className="remote-card-icon" />
    },
    {
      id: 'documentation',
      title: '360° Site Documentation',
      desc: 'Capture and document site conditions using immersive 360° technology for better project visibility and remote collaboration.',
      icon: <Camera size={26} className="remote-card-icon" />
    },
    {
      id: 'robotics',
      title: 'AR & Robotic Integration',
      desc: 'Leverage augmented reality and robotic technologies to improve remote inspection, visualization and construction workflows.',
      icon: <Cpu size={26} className="remote-card-icon" />
    }
  ];

  return (
    <section 
      id="remote-construction" 
      className={`remote-construction-section ${isVisible ? 'is-visible' : ''}`}
      ref={sectionRef}
      style={{ marginBottom: '80px' }}
    >
      <div className="remote-construction-grid">
        {/* LEFT COLUMN: Content & Feature Cards */}
        <div className="remote-content-col">
          <span className="remote-sub-badge">DIGITAL CONSTRUCTION</span>
          <h2 className="remote-main-heading">
            Building Beyond Boundaries
          </h2>
          <div className="why-bce-divider-line" style={{ marginBottom: '20px' }}></div>
          <p className="remote-desc-text">
            Connecting teams, sites and technical expertise through remote construction technologies, augmented reality and digital collaboration.
          </p>

          <div className="remote-cards-stack">
            {featureCards.map((card) => (
              <div key={card.id} className="remote-card-glass">
                <div className="remote-icon-wrapper">
                  {card.icon}
                </div>
                <div className="remote-card-info">
                  <h3 className="remote-card-title">{card.title}</h3>
                  <p className="remote-card-desc">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Engineering Technology Visual */}
        <div className="remote-visual-col">
          <div className="remote-image-frame">
            <img 
              src={techImage} 
              alt="Remote Construction & AR Inspection - Blue Crescent Engineering" 
              className="remote-tech-img"
            />
            <div className="remote-overlay-card">
              <span className="remote-pulse-dot"></span>
              <span className="remote-overlay-text">Live Remote Site Inspection</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
