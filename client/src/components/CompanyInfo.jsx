import React, { useState, useEffect, useRef } from 'react';
import { Award, Users, Globe, Layers, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CompanyInfo({ onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(4); // Start at middle card (index 4)
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const [companySettings, setCompanySettings] = useState(() => {
    const DEFAULT_COMPANY = {
      whyIntro1: 'Guided by the best team leaders, supported by skilled staff, corporate commitment to deliver the services at their best quality while controlling the costs and time components.',
      whyIntro2: 'Solutions are provided in various options and supported with recommendations that best suit the Clients requirements.',
      whyIntro3: 'Supported by team of specialists in the areas of MEP design, Acoustics, Stress and Hydraulics, all engineering calculations.',
      whyIntro4: 'Services are applicable for Owners, Designers, Contractors and Operators.'
    };
    try {
      const saved = localStorage.getItem('companySettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_COMPANY, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Error reading companySettings in CompanyInfo', e);
    }
    return DEFAULT_COMPANY;
  });

  const cards = [
    {
      id: 'experience',
      title: '13+ Years of Experience',
      icon: <Award size={40} className="company-card-icon" />,
      text: 'Engineering experience since 2013, continuously evolving with the construction and digital technology industry.',
      themeClass: 'theme-blue'
    },
    {
      id: 'experts',
      title: '150+ Technical Experts',
      icon: <Users size={40} className="company-card-icon" />,
      text: 'Multidisciplinary technical professionals delivering engineering, BIM, digital and sustainability solutions.',
      themeClass: 'theme-green'
    },
    {
      id: 'presence',
      title: 'GCC & India Presence',
      icon: <Globe size={40} className="company-card-icon" />,
      text: 'Supporting projects and clients across Qatar, UAE, Kuwait, Saudi Arabia and India.',
      themeClass: 'theme-pink'
    },
    {
      id: 'solutions',
      title: 'End-to-End Solutions',
      icon: <Layers size={40} className="company-card-icon" />,
      text: 'From engineering design and construction support to digital transformation and asset lifecycle management.',
      themeClass: 'theme-lavender'
    }
  ];

  // Extended array of 3 sets for infinite right-to-left loop scrolling
  const extendedCards = [...cards, ...cards, ...cards];

  // Intersection Observer for scroll animation trigger
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

  useEffect(() => {
    fetch('/api/settings/company')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          setCompanySettings(prev => ({ ...prev, ...data }));
        }
      })
      .catch(err => console.warn('Company settings DB fetch warning:', err));
  }, []);

  // Autoplay functionality
  useEffect(() => {
    if (!isVisible || isHovered) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setActiveIndex((prev) => prev + 1);
    }, 3300); // 2.5s pause + 0.8s slide transition

    return () => clearInterval(interval);
  }, [isVisible, isHovered]);

  // Snapping/loop adjustment
  useEffect(() => {
    if (activeIndex === 8) {
      // Snaps back from index 8 to index 4
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(4);
      }, 800);
      return () => clearTimeout(timer);
    }
    if (activeIndex === 3) {
      // Snaps forward from index 3 to index 7
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(7);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [activeIndex]);

  // Restore transition state after snapping
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const handleDotClick = (index) => {
    setIsTransitioning(true);
    setActiveIndex(index);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setActiveIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setIsTransitioning(true);
    setActiveIndex((prev) => prev + 1);
  };

  const currentDotIndex = activeIndex % 4;

  return (
    <div 
      className={`why-bce-redesign-container ${isVisible ? 'is-visible' : ''}`}
      ref={sectionRef}
      id="why-blue-crescent"
    >
      {/* LEFT SIDE - Stays fixed */}
      <div className={`why-bce-info-block ${isVisible ? 'is-visible' : ''}`}>
        <h2 className="why-bce-main-heading">
          Why Blue Crescent?
        </h2>
        <div className="why-bce-divider-line"></div>
        <p className="why-bce-desc-para">
          {companySettings.whyIntro1 || 'Guided by the best team leaders, supported by skilled staff, corporate commitment to deliver the services at their best quality while controlling the costs and time components.'}
        </p>
        <p className="why-bce-desc-para">
          {companySettings.whyIntro2 || 'Solutions are provided in various options and supported with recommendations that best suit the Clients requirements.'}
        </p>
        <p className="why-bce-desc-para">
          {companySettings.whyIntro3 || 'Supported by team of specialists in the areas of MEP design, Acoustics, Stress and Hydraulics, all engineering calculations.'}
        </p>
        <p className="why-bce-desc-para">
          {companySettings.whyIntro4 || 'Services are applicable for Owners, Designers, Contractors and Operators.'}
        </p>
        <button 
          className="btn-blue-premium"
          onClick={() => {
            if (onNavigate) onNavigate('About Us');
          }}
        >
          LEARN MORE ABOUT US <ArrowRight size={16} style={{ marginLeft: '8px' }} />
        </button>
      </div>

      {/* RIGHT SIDE - Animated Viewport */}
      <div className={`why-bce-slider-block ${isVisible ? 'is-visible' : ''}`}>
        <div 
          className="why-bce-slider-viewport"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Manual Navigation Buttons */}
          <button 
            className="why-bce-nav-btn prev-btn" 
            onClick={handlePrev}
            aria-label="Previous slide"
          >
            <ChevronLeft size={22} />
          </button>
          <button 
            className="why-bce-nav-btn next-btn" 
            onClick={handleNext}
            aria-label="Next slide"
          >
            <ChevronRight size={22} />
          </button>

          <div 
            className="why-bce-slider-track"
            style={{
              '--active-index': activeIndex,
              transition: isTransitioning ? 'left 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
            }}
          >
            {extendedCards.map((card, index) => {
              const isCurrent = index === activeIndex;
              return (
                <div 
                  key={`${card.id}-${index}`} 
                  className={`why-bce-item-card ${card.themeClass} ${isCurrent ? 'is-active-card' : ''}`}
                >
                  <div className="why-bce-card-icon-wrap">
                    {card.icon}
                  </div>
                  <div className="why-bce-card-content">
                    <h4 className="why-bce-card-title">{card.title}</h4>
                    <p className="why-bce-card-text">{card.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="why-bce-dots-nav">
          {cards.map((_, idx) => (
            <button
              key={idx}
              className={`why-bce-dot ${currentDotIndex === idx ? 'is-active' : ''}`}
              onClick={() => handleDotClick(4 + idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
