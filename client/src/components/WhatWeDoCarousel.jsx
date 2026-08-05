import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Monitor, Cpu, Settings, Globe, FileText, Signal } from 'lucide-react';

export default function WhatWeDoCarousel({ onNavigate }) {
  const cards = [
    {
      id: 1,
      title: 'Engineering MEP & Shop Drawings - 2D',
      subServiceKey: 'Engineering (MEP, Infrastructure, Transportation) shop Drawings - 2D',
      icon: <Settings size={28} className="what-we-do-icon" />,
      description: 'Detailed 2D engineering coordination, plumbing, drainage, HVAC, and load layout drawings.',
      image: '/why.png'
    },
    {
      id: 2,
      title: 'GSAS & LEED Sustainability Design',
      subServiceKey: 'GSAS & LEED Sustainability Design Consultancy Services',
      icon: <Globe size={28} className="what-we-do-icon" />,
      description: 'Eco-friendly green building consultancy, energy modeling, and GSAS certification management.',
      image: '/sust_workshop.png'
    },
    {
      id: 3,
      title: 'Environmental Impact Assessment',
      subServiceKey: 'Environment Impact Assessment (EIA) Services',
      icon: <FileText size={28} className="what-we-do-icon" />,
      description: 'Air quality, thermal emissions, noise modeling, and regulatory environment compliance audits.',
      image: '/eng_island.png'
    }
  ];

  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => {
    setStartIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev < cards.length - 3 ? prev + 1 : prev));
  };

  return (
    <section className="what-we-do-section" style={{ marginTop: '80px', marginBottom: '80px' }}>
      <div className="what-we-do-header">
        <div className="what-we-do-title-wrap">
          <h2 className="what-we-do-title" style={{ color: '#0B1F3A' }}>What We Do</h2>
          <div className="title-underline-yellow" style={{ background: '#00A198', boxShadow: '0 0 10px #00A198' }}></div>
        </div>

        <div className="carousel-nav-arrows">
          <button 
            className="carousel-arrow-btn" 
            onClick={handlePrev} 
            disabled={startIndex === 0}
            style={{
              borderColor: 'rgba(11, 31, 58, 0.2)',
              color: '#0B1F3A',
              background: startIndex === 0 ? 'rgba(0,0,0,0.02)' : 'transparent',
              opacity: startIndex === 0 ? 0.4 : 1
            }}
            aria-label="Previous items"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            className="carousel-arrow-btn" 
            onClick={handleNext}
            disabled={startIndex >= cards.length - 3}
            style={{
              borderColor: 'rgba(11, 31, 58, 0.2)',
              color: '#0B1F3A',
              background: startIndex >= cards.length - 3 ? 'rgba(0,0,0,0.02)' : 'transparent',
              opacity: startIndex >= cards.length - 3 ? 0.4 : 1
            }}
            aria-label="Next items"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Sliding Viewport Container */}
      <div style={{ width: '100%', overflow: 'hidden', padding: '12px 4px' }}>
        <div 
          style={{
            display: 'flex',
            transform: `translateX(-${startIndex * (100 / 3)}%)`,
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            gap: '24px'
          }}
        >
          {cards.map((card) => (
            <div 
              className="card-item" 
              key={card.id}
              style={{
                flex: '0 0 calc(33.333% - 16px)',
                boxSizing: 'border-box',
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid rgba(11, 31, 58, 0.08)',
                boxShadow: '0 4px 20px rgba(11, 31, 58, 0.04)',
                padding: '24px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 161, 152, 0.15)';
                e.currentTarget.style.borderColor = '#00A198';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(11, 31, 58, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(11, 31, 58, 0.08)';
              }}
              onClick={() => {
                if (onNavigate) {
                  onNavigate('Services', card.subServiceKey);
                }
              }}
            >
              {/* Image Preview */}
              <div 
                style={{
                  width: '100%',
                  height: '180px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '18px',
                  position: 'relative',
                  background: '#0B1F3A'
                }}
              >
                <img 
                  src={card.image} 
                  alt={card.title} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div 
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0, 161, 152, 0.9)',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                  }}
                >
                  {card.icon}
                </div>
              </div>

              {/* Title & Description */}
              <h4 
                style={{
                  fontSize: '18px',
                  fontWeight: '800',
                  color: '#0B1F3A',
                  margin: '0 0 8px 0',
                  lineHeight: 1.4,
                  minHeight: '50px'
                }}
              >
                {card.title}
              </h4>
              
              <p
                style={{
                  fontSize: '13.5px',
                  color: '#475569',
                  lineHeight: 1.6,
                  margin: '0 0 20px 0',
                  height: '60px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {card.description}
              </p>

              {/* Read More link */}
              <a 
                href="#service-detail" 
                className="card-read-more"
                style={{
                  fontSize: '13px',
                  fontWeight: '800',
                  color: '#00A198',
                  textDecoration: 'none',
                  display: 'inline-block',
                  marginTop: 'auto',
                  letterSpacing: '0.5px'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onNavigate) {
                    onNavigate('Services', card.subServiceKey);
                  }
                }}
              >
                READ MORE →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
