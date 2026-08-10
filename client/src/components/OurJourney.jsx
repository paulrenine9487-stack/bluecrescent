import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Award, Layers, Compass, Cpu, Activity, Globe } from 'lucide-react';

export default function OurJourney() {
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
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const milestones = [
    {
      year: '2013',
      title: 'Qatar',
      desc: 'Company established with CAD drafting and technical resource services.',
      icon: <Calendar size={18} />
    },
    {
      year: '2015',
      title: 'UAE & Sustainability',
      desc: 'Expanded into Dubai and introduced sustainability consultancy.',
      icon: <MapPin size={18} />
    },
    {
      year: '2016',
      title: 'India',
      desc: 'Established India operations to strengthen engineering production capacity and technical support.',
      icon: <Award size={18} />
    },
    {
      year: '2017',
      title: 'BIM',
      desc: 'Expanded into Building Information Modeling and digital construction.',
      icon: <Layers size={18} />
    },
    {
      year: '2018',
      title: 'Laser Scanning',
      desc: 'Introduced laser scanning, point-cloud processing and Scan-to-BIM.',
      icon: <Compass size={18} />
    },
    {
      year: '2019',
      title: 'Digital Twin',
      desc: 'Entered Digital Twin and asset lifecycle management solutions.',
      icon: <Cpu size={18} />
    },
    {
      year: '2024',
      title: 'Kuwait & Remote Construction',
      desc: 'Expanded into Kuwait and introduced remote construction technologies and digital collaboration.',
      icon: <Activity size={18} />
    },
    {
      year: '2026',
      title: 'Saudi Arabia',
      desc: 'Expanded operations into Saudi Arabia, strengthening our GCC presence.',
      icon: <Globe size={18} />
    }
  ];

  return (
    <section 
      id="our-journey" 
      className={`journey-section-container ${isVisible ? 'is-visible' : ''}`}
      ref={sectionRef}
    >
      <div className="journey-header">
        <h2 className="journey-main-title">
          From Engineering Support to Digital Transformation
        </h2>
        <p className="journey-sub-title">
          Our journey has continuously evolved with the engineering, construction and digital technology landscape.
        </p>
      </div>

      <div className="journey-timeline-outer">
        {/* Horizontal timeline line for desktop */}
        <div className="journey-timeline-line"></div>

        <div className="journey-timeline-items">
          {milestones.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={index} 
                className={`journey-item-wrapper ${isEven ? 'position-top' : 'position-bottom'}`}
                style={{ '--delay-index': index }}
              >
                {/* Timeline connection dot */}
                <div className="journey-node-dot">
                  <div className="journey-node-inner"></div>
                </div>

                {/* Card container */}
                <div className="journey-milestone-card">
                  <div className="journey-card-header">
                    <span className="journey-year">{item.year}</span>
                    <span className="journey-card-icon">{item.icon}</span>
                  </div>
                  <h4 className="journey-milestone-title">{item.title}</h4>
                  <p className="journey-milestone-desc">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
