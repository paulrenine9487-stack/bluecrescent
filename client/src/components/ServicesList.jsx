import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function ServicesList({ onNavigate }) {
  const engineeringServices = [
    'Engineering Design support Services',
    'Specialised Simulation & Analysis',
    'Engineering (MEP, Infrastructure, Transportation) shop Drawings - 2D',
    'BIM Modelling - 3D',
    'Outsourcing Technical Experts'
  ];

  const sustainabilityServices = [
    'Energy Auditing',
    'Commissioning of LEED & GSAS',
    'Green Building Facilitation'
  ];

  const telecomServices = [
    'Fiber Optic (Indoor & Outdoor)',
    'Cellular (IBS & Outdoor Sites)',
    'Microwave Links',
    'Wi-Fi Systems'
  ];

  const handleServiceClick = (serviceName) => {
    if (onNavigate) {
      onNavigate('Services', serviceName);
    }
  };

  const handleExploreMore = (category) => {
    if (onNavigate) {
      onNavigate('Services', category);
    }
  };

  return (
    <section id="services" className="services-section-premium">
      <div className="services-container-inner">
        {/* Redesigned Header */}
      <div className="services-header-wrap">
        <h2 className="services-title-premium">Our Services</h2>
        <p className="services-subtitle-premium">
          Comprehensive solutions designed to meet your engineering, sustainability and telecom requirements.
        </p>
        {/* Custom Decorator Divider */}
        <div className="services-decorator">
          <div className="line"></div>
          <div className="dot-active"></div>
          <div className="dot-inactive"></div>
          <div className="line"></div>
        </div>
      </div>

      {/* Redesigned 3-Column Card Layout */}
      <div className="services-cards-grid">
        {/* Card 1: Engineering Services */}
        <div className="service-card-premium theme-blue">
          <div className="service-card-top-content">
            {/* Circular Icon Container */}
            <div className="service-icon-circle-wrap">
              <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="3 3" />
                <path d="M16 3v18" />
                <path d="M3 15h13" />
                <path d="M9 3v12" />
                <path d="M3 9h6" />
                <path d="M21 21l-4-4" />
                <path d="M17 13l4 4" />
              </svg>
            </div>
            
            <h3 className="service-card-heading">Engineering Services</h3>
            <div className="service-card-divider"></div>
            
            <ul className="service-card-bullets">
              {engineeringServices.map((item, idx) => (
                <li 
                  key={idx} 
                  className="service-bullet-item"
                  onClick={() => handleServiceClick(item)}
                >
                  <span className="star-bullet">✦</span>
                  <span className="bullet-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Explore More Footer */}
          <div className="service-card-footer-band" onClick={() => handleExploreMore('Engineering Services')}>
            <span className="footer-explore-text">Explore More</span>
            <div className="footer-arrow-circle">
              <ArrowRight size={14} />
            </div>
          </div>
        </div>

        {/* Card 2: Sustainability Services */}
        <div className="service-card-premium theme-green">
          <div className="service-card-top-content">
            {/* Circular Icon Container */}
            <div className="service-icon-circle-wrap">
              <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 21h16" />
                <path d="M6 21V7l7-3v17" />
                <path d="M18 21V12l-5-2" />
                <path d="M9 9h2" />
                <path d="M9 13h2" />
                <path d="M9 17h2" />
                <path d="M12 10a4 4 0 0 1 8 0c0 3-4 6-4 6s-4-3-4-6z" />
              </svg>
            </div>
            
            <h3 className="service-card-heading">Sustainability Services</h3>
            <div className="service-card-divider"></div>
            
            <ul className="service-card-bullets">
              {sustainabilityServices.map((item, idx) => (
                <li 
                  key={idx} 
                  className="service-bullet-item"
                  onClick={() => handleServiceClick(item)}
                >
                  <span className="star-bullet">✦</span>
                  <span className="bullet-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Explore More Footer */}
          <div className="service-card-footer-band" onClick={() => handleExploreMore('Sustainability Services')}>
            <span className="footer-explore-text">Explore More</span>
            <div className="footer-arrow-circle">
              <ArrowRight size={14} />
            </div>
          </div>
        </div>

        {/* Card 3: Telecom Services */}
        <div className="service-card-premium theme-purple">
          <div className="service-card-top-content">
            {/* Circular Icon Container */}
            <div className="service-icon-circle-wrap">
              <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3z" />
                <path d="M12 5L7 22" />
                <path d="M12 5l5 17" />
                <path d="M9 15h6" />
                <path d="M10 11h4" />
                <path d="M11 7h2" />
                <path d="M7.5 7.5a6 6 0 0 0 0 9" />
                <path d="M16.5 7.5a6 6 0 0 1 0 9" />
                <path d="M5.5 5.5a9 9 0 0 0 0 13" />
                <path d="M18.5 5.5a9 9 0 0 1 0 13" />
              </svg>
            </div>
            
            <h3 className="service-card-heading">Telecom Services</h3>
            <div className="service-card-divider"></div>
            
            <ul className="service-card-bullets">
              {telecomServices.map((item, idx) => (
                <li 
                  key={idx} 
                  className="service-bullet-item"
                  onClick={() => handleServiceClick(item)}
                >
                  <span className="star-bullet">✦</span>
                  <span className="bullet-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Explore More Footer */}
          <div className="service-card-footer-band" onClick={() => handleExploreMore('Telecom Services')}>
            <span className="footer-explore-text">Explore More</span>
            <div className="footer-arrow-circle">
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}
