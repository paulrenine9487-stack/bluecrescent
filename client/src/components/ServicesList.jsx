import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function ServicesList({ onNavigate }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) {
          // Exclude any obsolete Telecom services just in case, focusing on our main 3 categories
          setServices(data.filter(s => !s.category.toLowerCase().includes('telecom')));
        }
      })
      .catch(err => console.warn('Home services fetch warning:', err));
  }, []);

  // Group by category
  const categoryGroups = {};
  if (services.length > 0) {
    const filteredServices = services
      .filter(s => !['Engineering Design support Services', 'Specialised Simulation & Analysis', 'BIM Modelling - 3D', 'Engineering (MEP, Infrastructure, Transportation) shop Drawings - 2D'].includes(s.title));
      
    filteredServices.forEach(s => {
      if (!categoryGroups[s.category]) {
        categoryGroups[s.category] = [];
      }
      categoryGroups[s.category].push(s.title);
    });

    // Guarantee items in Engineering Services
    if (!categoryGroups['Engineering Services']) {
      categoryGroups['Engineering Services'] = ['BIM Services', '2D CAD Drafting Services', 'Outsourcing Technical Experts'];
    } else {
      const items = categoryGroups['Engineering Services'];
      if (!items.includes('BIM Services')) items.unshift('BIM Services');
      if (!items.includes('2D CAD Drafting Services')) items.splice(1, 0, '2D CAD Drafting Services');
      if (!items.includes('Outsourcing Technical Experts')) items.push('Outsourcing Technical Experts');
      categoryGroups['Engineering Services'] = Array.from(new Set(items));
    }

    // Guarantee Digital Twin Services
    if (!categoryGroups['Digital Twin Services']) {
      categoryGroups['Digital Twin Services'] = [
        'Life Cycle Twin Asset Management',
        'Remote Work Automation',
        'System Integration and Analysis'
      ];
    }
  } else {
    // Fallbacks
    categoryGroups['Engineering Services'] = [
      'BIM Services',
      '2D CAD Drafting Services',
      'Outsourcing Technical Experts'
    ];
    categoryGroups['Sustainability Services'] = [
      'GSAS Service',
      'LEED Consulting Services',
      'Energy Audit and Analysis',
      'ISO 14064 Consulting Services'
    ];
    categoryGroups['Digital Twin Services'] = [
      'Life Cycle Twin Asset Management',
      'Remote Work Automation',
      'System Integration and Analysis'
    ];
  }

  const getThemeClass = (catName) => {
    const name = catName.toLowerCase();
    if (name.includes('engineering')) return 'theme-blue';
    if (name.includes('sustainability')) return 'theme-green';
    if (name.includes('digital twin')) return 'theme-purple';
    return 'theme-blue';
  };

  const getIconSvg = (catName) => {
    const name = catName.toLowerCase();
    if (name.includes('engineering')) {
      return (
        <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="3 3" />
          <path d="M16 3v18" />
          <path d="M3 15h13" />
          <path d="M9 3v12" />
          <path d="M3 9h6" />
          <path d="M21 21l-4-4" />
          <path d="M17 13l4 4" />
        </svg>
      );
    }
    if (name.includes('sustainability')) {
      return (
        <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 21h16" />
          <path d="M6 21V7l7-3v17" />
          <path d="M18 21V12l-5-2" />
          <path d="M9 9h2" />
          <path d="M9 13h2" />
          <path d="M9 17h2" />
          <path d="M12 10a4 4 0 0 1 8 0c0 3-4 6-4 6s-4-3-4-6z" />
        </svg>
      );
    }
    // Digital Twin / Telecom
    return (
      <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <rect x="6" y="6" width="4" height="4" rx="0.5" />
        <rect x="14" y="6" width="4" height="4" rx="0.5" />
      </svg>
    );
  };

  const handleServiceClick = (serviceName) => {
    if (onNavigate) {
      onNavigate('Services', serviceName);
    }
  };

  const handleExploreMore = (category) => {
    if (onNavigate) {
      // Pick first subservice or go to main category
      const subItems = categoryGroups[category] || [];
      onNavigate('Services', subItems[0] || category);
    }
  };

  return (
    <section id="services" className="services-section-premium">
      <div className="services-container-inner">
        {/* Redesigned Header */}
        <div className="services-header-wrap">
          <h2 className="services-title-premium">Our Services</h2>
          <p className="services-subtitle-premium">
            Comprehensive solutions designed to meet your engineering and sustainability requirements.
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
          {Object.keys(categoryGroups).map((catName) => (
            <div key={catName} className={`service-card-premium ${getThemeClass(catName)}`}>
              <div className="service-card-top-content">
                {/* Circular Icon Container */}
                <div className="service-icon-circle-wrap">
                  {getIconSvg(catName)}
                </div>
                
                <h3 className="service-card-heading">{catName}</h3>
                <div className="service-card-divider"></div>
                
                <ul className="service-card-bullets">
                  {(categoryGroups[catName] || []).map((item, idx) => (
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
              <div className="service-card-footer-band" onClick={() => handleExploreMore(catName)}>
                <span className="footer-explore-text">Explore More</span>
                <div className="footer-arrow-circle">
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
