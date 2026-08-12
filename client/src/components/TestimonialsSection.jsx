import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const DEFAULT_TESTIMONIALS = [
  {
    id: 't1',
    title: 'Excellent Engineering & Technical Support',
    content: 'Blue Crescent has provided us with complete support for MEP drawings, all design Calculations in MEP & Stress Analysis etc in our projects. They are one of the best Engineering company who can be trusted for complete solutions of all Design & Engineering issues. I visited their office & fully satisfied with the Engineering & design team who delivered the works for us on time & also they provided complete support to get approval from various authorities for some woks in very short time. You are Excellent Blue crescent & keep going. Thanks for your works delivered.',
    author_name: 'Gokulraj Chakaravarthy',
    company_name: 'Diplomat Group W.L.L',
    rating: 5
  },
  {
    id: 't2',
    title: 'Outstanding BIM & Digital Twin Coordination',
    content: 'Working with Blue Crescent Engineering on our complex commercial tower project was a seamless experience. Their 3D BIM modeling, spatial clash detection, and digital twin integration eliminated critical site conflicts before construction, saving our project team significant time and cost.',
    author_name: 'Eng. Ahmed Al-Mansoori',
    company_name: 'Qatar Project Management (QPM)',
    rating: 5
  },
  {
    id: 't3',
    title: 'Reliable Specialized Technical Experts',
    content: 'Blue Crescent’s specialized engineering team delivered comprehensive CFD fluid dynamics analysis and acoustic vibration models. Their prompt authority approval support and high attention to detail made them an invaluable long-term engineering partner for our infrastructure projects.',
    author_name: 'Praveen V. Kumar',
    company_name: 'Contracting & Engineering W.L.L',
    rating: 5
  },
  {
    id: 't4',
    title: 'Top-Tier Sustainability & GSAS Facilitation',
    content: 'Their sustainability consultancy team guided our facility to achieve GSAS 4-Star environmental certification effortlessly. Outstanding precision in energy auditing, carbon footprint calculation, and clear communication throughout design and audit phases.',
    author_name: 'Hassan Al-Kuwari',
    company_name: 'Sustainable Infrastructure Lead, GCC Energy',
    rating: 5
  }
];

export default function TestimonialsSection({ style, containerClassName = '' }) {
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        }
      })
      .catch(err => console.warn('Testimonials load warning:', err));
  }, []);

  // Auto-Play Carousel Timer (4.5s Interval)
  useEffect(() => {
    if (isHovered || testimonials.length <= 1) return;

    const timer = setInterval(() => {
      handleNextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, [currentIndex, isHovered, testimonials.length]);

  const handleNextSlide = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
      setIsFading(false);
    }, 200);
  };

  const handlePrevSlide = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
      setIsFading(false);
    }, 200);
  };

  const handleDotClick = (idx) => {
    if (idx === currentIndex) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(idx);
      setIsFading(false);
    }, 200);
  };

  const currentTestimonial = testimonials[currentIndex] || DEFAULT_TESTIMONIALS[0];

  return (
    <section className={`premium-testimonials-section ${containerClassName}`} style={{ marginTop: '60px', marginBottom: '80px', ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="news-main-heading" style={{ margin: 0, fontFamily: 'Space Grotesk, sans-serif', fontSize: '32px', fontWeight: '800', color: '#063B73' }}>
            What Our Clients Say
          </h2>
          <div className="why-bce-divider-line" style={{ margin: '14px 0 0 0', width: '60px', height: '3.5px', background: '#0057B8', borderRadius: '4px' }}></div>
        </div>

        {/* Top Carousel Navigation Arrows */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={handlePrevSlide}
              aria-label="Previous Testimonial"
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#071C3B',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#0057B8'; e.currentTarget.style.color = '#0057B8'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.color = '#071C3B'; }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextSlide}
              aria-label="Next Testimonial"
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#071C3B',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#0057B8'; e.currentTarget.style.color = '#0057B8'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.color = '#071C3B'; }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="testimonials-grid-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'stretch' }}>
        {/* Left Column: Auto-rotating Testimonial Card */}
        <div 
          className="testimonials-list-column"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            className="premium-card testimonial-card" 
            style={{
              position: 'relative',
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #E2E8F0',
              padding: '28px 32px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.04)',
              opacity: isFading ? 0.3 : 1,
              transform: isFading ? 'translateY(6px)' : 'translateY(0)',
              transition: 'opacity 0.25s ease, transform 0.25s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '370px',
              boxSizing: 'border-box'
            }}
          >
            {/* Quote Mark Icon */}
            <div style={{ position: 'absolute', top: '24px', right: '28px', color: '#0057B8', opacity: 0.15 }}>
              <Quote size={48} />
            </div>

            <div>
              {/* Rating Stars */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                {[...Array(currentTestimonial.rating || 5)].map((_, i) => (
                  <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>

              <h3 className="testimonial-title" style={{ fontSize: '17px', fontWeight: '800', color: '#071C3B', margin: '0 0 10px 0', lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentTestimonial.title || 'Client Feedback'}
              </h3>

              <p className="testimonial-content" style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, fontStyle: 'italic', margin: 0, height: '145px', overflowY: 'auto', paddingRight: '4px' }}>
                "{currentTestimonial.content || currentTestimonial.body}"
              </p>
            </div>

            <div>
              <hr className="testimonial-divider" style={{ margin: '16px 0', borderColor: '#F1F5F9' }} />
              
              <div className="premium-testimonial-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="testimonial-author-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="author-avatar" style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #071C3B, #0057B8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: '800', fontSize: '16px', flexShrink: 0 }}>
                    {(currentTestimonial.author_name || currentTestimonial.author) ? (currentTestimonial.author_name || currentTestimonial.author).charAt(0) : 'C'}
                  </div>
                  <div className="premium-testimonial-author">
                    <div className="premium-testimonial-name" style={{ fontSize: '14.5px', fontWeight: '700', color: '#071C3B' }}>
                      {currentTestimonial.author_name || currentTestimonial.author}
                    </div>
                    <div className="premium-testimonial-company" style={{ fontSize: '12.5px', color: '#0057B8', fontWeight: '600' }}>
                      {currentTestimonial.company_name || 'Verified Client'}
                    </div>
                  </div>
                </div>

                {/* Step counter badge */}
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#94A3B8', letterSpacing: '1px' }}>
                  {String(currentIndex + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Clickable Pagination Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                style={{
                  border: 'none',
                  height: '8px',
                  width: idx === currentIndex ? '28px' : '8px',
                  borderRadius: '4px',
                  background: idx === currentIndex ? 'linear-gradient(90deg, #071C3B, #0057B8)' : '#CBD5E1',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Clean Image matching fixed height */}
        <div className="testimonials-image-column">
          <div className="testimonials-large-card-img-wrap" style={{ height: '370px', borderRadius: '20px', overflow: 'hidden', border: '1.5px solid #E2E8F0', boxShadow: '0 12px 36px rgba(0,0,0,0.04)' }}>
            <img src="/testimonial.png" alt="What Our Clients Say - Blue Crescent Engineering" className="testimonials-large-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
