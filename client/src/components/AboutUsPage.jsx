import React, { useState, useEffect, useRef } from 'react';
import aboutBanner from '../assets/about.png';
import aboutEngineeringImg from '../assets/why.png';
import './AboutUsPage.css';

export default function AboutUsPage({ onOpenModal, onNavigate }) {
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('');
  const [activeCardId, setActiveCardId] = useState(null);
  const [partnerIdx, setPartnerIdx] = useState(0);
  const [partners, setPartners] = useState([
    { id: 1, image: '/partner_teknik.png',   name: 'TEKNIK Group',          role: 'Engineering Partner'    },
    { id: 2, image: '/partner_arcana.png',   name: 'ARCANA Build',          role: 'Construction Partner'   },
    { id: 3, image: '/partner_nexagen.png',  name: 'NEXAGEN Solutions',     role: 'Sustainability Partner' },
    { id: 4, image: '/partner_qaframe.png',  name: 'QAFrame Technologies',  role: 'BIM Partner'            },
    { id: 5, image: '/partner_meridian.png', name: 'MERIDIAN MEP',          role: 'MEP Partner'            },
    { id: 6, image: '/partner_vistara.png',  name: 'VISTARA Infrastructure',role: 'Infrastructure Partner' },
  ]);
  const [newTestimonial, setNewTestimonial] = useState({
    title: '',
    body: '',
    author: '',
    company: ''
  });

  // Fetch approved testimonials from the API
  const [testimonialsList, setTestimonialsList] = useState([]);

  const [companySettings, setCompanySettings] = useState(() => {
    const DEFAULT_COMPANY = {
      whoWeArePara1: "Blue Crescent Engineering is based upon pillars of engineering excellence, a proven system of quality assurance and a dedication in meeting the client's needs and schedules. The company is incorporated by the core values of teamwork, Respect and Integrity.",
      whoWeArePara2: "Our client-centered culture and teamwork based approach integrate the knowledge and skills of our network with local awareness, technical leadership and innovative approaches to solve our client's challenges.",
      whoWeArePara3: "Across our spectrum of expertise, We make the connection for each client that best serves their immediate objectives while fulfilling our shared purpose.",
      whoWeArePara4: "We offer premium services in Engineering Design Support for MEP, Infrastructure and Transportation, Simulations and Analysis, BIM Modelling, Outsourcing Technical Experts, Energy Audit, Commissioning for LEED and GSAS, LEED Facilitation and Academics & Trainings.",
      value1Title: 'Integrity',
      value1Desc: 'We uphold strong ethical standards, building trust through transparent partnerships.',
      value2Title: 'Respect',
      value2Desc: 'We value every individual, partner and client relationship.',
      value3Title: 'Excellence',
      value3Desc: 'Striving for the highest international engineering standards.',
      value4Title: 'Teamwork',
      value4Desc: 'Together we achieve more through collaborative engineering.',
      value5Title: 'Innovation',
      value5Desc: 'Pioneering green technology and sustainable design.',
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
      console.warn('Error reading companySettings in AboutUsPage', e);
    }
    return DEFAULT_COMPANY;
  });

  const [aboutUsVideoUrl, setAboutUsVideoUrl] = useState(() => {
    return localStorage.getItem('aboutUsVideoUrl') || '/aboutus.mp4';
  });

  const [aboutUsHeroType, setAboutUsHeroType] = useState(() => {
    return localStorage.getItem('aboutUsHeroType') || 'image';
  });

  const [aboutUsHeroUrl, setAboutUsHeroUrl] = useState(() => {
    return localStorage.getItem('aboutUsHeroUrl') || '';
  });

  // Ref and state for Section 3 Fan Deck Scroll Animation
  const interactiveSectionRef = useRef(null);
  const [isInteractiveAnimated, setIsInteractiveAnimated] = useState(false);

  const fetchTestimonials = () => {
    fetch('/api/testimonials')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) {
          // Map API field names to what our cards expect
          setTestimonialsList(data.map(t => ({
            id: t.id,
            title: t.title,
            body: t.content,
            author: t.author_name,
            company: t.company_name
          })));
        }
      })
      .catch(err => console.warn('Testimonials fetch warning:', err));
  };

  useEffect(() => {
    fetchTestimonials();
    fetch('/api/settings/company')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          setCompanySettings(prev => ({ ...prev, ...data }));
          if (data.aboutUsVideoUrl) setAboutUsVideoUrl(data.aboutUsVideoUrl);
          if (data.aboutUsHeroType) setAboutUsHeroType(data.aboutUsHeroType);
          if (data.aboutUsHeroUrl) setAboutUsHeroUrl(data.aboutUsHeroUrl);
        }
      })
      .catch(err => console.warn('Company settings DB fetch warning:', err));

    // Fetch partners from API
    fetch('/api/partners')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) setPartners(data);
      })
      .catch(err => console.warn('Partners fetch warning:', err));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInteractiveAnimated(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (interactiveSectionRef.current) {
      observer.observe(interactiveSectionRef.current);
    }

    return () => {
      if (interactiveSectionRef.current) {
        observer.unobserve(interactiveSectionRef.current);
      }
    };
  }, []);

  const handleSubmitTestimonial = async (e) => {
    e.preventDefault();
    if (!newTestimonial.title || !newTestimonial.body || !newTestimonial.author) return;
    setSubmitting(true);
    setSubmittedMessage('');
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTestimonial.title,
          content: newTestimonial.body,
          author_name: newTestimonial.author,
          company_name: newTestimonial.company || '',
          status: 'pending'
        })
      });
      if (res.ok) {
        setSubmittedMessage('Thank you! Your testimonial has been submitted and is pending review.');
        setTimeout(() => {
          setShowTestimonialModal(false);
          setSubmittedMessage('');
          setNewTestimonial({ title: '', body: '', author: '', company: '' });
        }, 2500);
      } else {
        setSubmittedMessage('Failed to submit. Please try again.');
      }
    } catch (err) {
      setSubmittedMessage('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardClick = (id) => {
    setActiveCardId(activeCardId === id ? null : id);
  };

  return (
    <div className="about-us-page-wrapper">
      {/* SECTION 1: ABOUT US HERO BANNER */}
      <section className="about-hero-banner-wrap">
        <img
          src={aboutBanner}
          alt="About Us Banner - Blue Crescent Engineering"
          className="about-hero-banner-img"
        />
      </section>

      <div className="bce-container">
        {/* SECTION 2: WHO WE ARE */}
        <section className="who-we-are-section">
          <div className="who-we-are-grid">
            {/* Left: Text content */}
            <div className="who-we-are-content-box">
              <h2 className="bce-heading-primary">WHO WE ARE</h2>
              <div className="bce-underline-gradient"></div>

              {companySettings.whoWeArePara1 && (
                <p className="who-we-are-paragraph">
                  {companySettings.whoWeArePara1}
                </p>
              )}

              {companySettings.whoWeArePara2 && (
                <p className="who-we-are-paragraph">
                  {companySettings.whoWeArePara2}
                </p>
              )}

              {companySettings.whoWeArePara3 && (
                <p className="who-we-are-paragraph">
                  {companySettings.whoWeArePara3}
                </p>
              )}

              {companySettings.whoWeArePara4 && (
                <p className="who-we-are-paragraph">
                  {companySettings.whoWeArePara4}
                </p>
              )}
            </div>

            {/* Right: Video in portrait frame */}
            {aboutUsVideoUrl && (
              <div className="who-we-are-video-wrap">
                <div className="who-we-are-video-portrait">
                  <video
                    key={aboutUsVideoUrl}
                    src={aboutUsVideoUrl}
                    className="who-we-are-video"
                    autoPlay
                    muted
                    defaultMuted
                    loop
                    playsInline
                    controls
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3: OUR CORE VALUES INTERACTIVE (5-CARD FAN DECK ANIMATION) */}
        <section className="core-values-interactive-section" ref={interactiveSectionRef}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
            <h2 className="bce-heading-primary" style={{ fontSize: '40px' }}>OUR CORE VALUES</h2>
            <div className="bce-underline-gradient" style={{ margin: '0 auto 16px auto' }}></div>
            <p className="bce-section-subtitle" style={{ fontSize: '18px', color: '#475569', fontWeight: '500' }}>
              Engineering Excellence Built on Strong Principles
            </p>
          </div>

          <div className={`cards-fan-wrapper ${isInteractiveAnimated ? 'animated' : ''}`}>
            {/* Thin Glowing Blue Connecting Lines SVG Overlay */}
            <svg className="connecting-lines-svg" viewBox="0 0 1100 720" fill="none">
              {/* Line Center (550, 380) to Card 1 Top Left (250, 230) */}
              <path d="M 550 380 Q 400 300 250 230" className="connecting-line-path" />
              {/* Line Center (550, 380) to Card 2 Top Right (850, 230) */}
              <path d="M 550 380 Q 700 300 850 230" className="connecting-line-path" />
              {/* Line Center (550, 380) to Card 4 Bottom Left (290, 540) */}
              <path d="M 550 380 Q 420 460 290 540" className="connecting-line-path" />
              {/* Line Center (550, 380) to Card 5 Bottom Right (810, 540) */}
              <path d="M 550 380 Q 680 460 810 540" className="connecting-line-path" />
            </svg>

            {/* CARD 1: Teamwork (Move to Top Left, Rotate -15°) */}
            <div
              className={`fan-card card-1 ${activeCardId === 1 ? 'active-expanded' : ''}`}
              onClick={() => handleCardClick(1)}
            >
              <div>
                <div className="fan-card-icon">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="fan-card-title">{companySettings.value4Title || 'Teamwork'}</h3>
                <p className="fan-card-desc">{companySettings.value4Desc || 'Together we achieve more through collaborative engineering.'}</p>
              </div>
              <div className="fan-card-footer-tag">
                <span>01 ✦ Collaborative</span>
              </div>
            </div>

            {/* CARD 2: Respect (Move to Top Right, Rotate +15°) */}
            <div
              className={`fan-card card-2 ${activeCardId === 2 ? 'active-expanded' : ''}`}
              onClick={() => handleCardClick(2)}
            >
              <div>
                <div className="fan-card-icon">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <h3 className="fan-card-title">{companySettings.value2Title || 'Respect'}</h3>
                <p className="fan-card-desc">{companySettings.value2Desc || 'We value every individual, partner and client relationship.'}</p>
              </div>
              <div className="fan-card-footer-tag">
                <span>02 ✦ Relationships</span>
              </div>
            </div>

            {/* CARD 3: Integrity (Stay Center, Rotate 0°) */}
            <div
              className={`fan-card card-3 ${activeCardId === 3 ? 'active-expanded' : ''}`}
              onClick={() => handleCardClick(3)}
            >
              <div>
                <div className="fan-card-icon">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3 className="fan-card-title">{companySettings.value1Title || 'Integrity'}</h3>
                <p className="fan-card-desc">{companySettings.value1Desc || 'We uphold strong ethical standards, building trust through transparent partnerships.'}</p>
              </div>
              <div className="fan-card-footer-tag">
                <span>03 ✦ Transparency</span>
              </div>
            </div>

            {/* CARD 4: Excellence (Move to Bottom Left, Rotate -12°) */}
            <div
              className={`fan-card card-4 ${activeCardId === 4 ? 'active-expanded' : ''}`}
              onClick={() => handleCardClick(4)}
            >
              <div>
                <div className="fan-card-icon">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <h3 className="fan-card-title">{companySettings.value3Title || 'Excellence'}</h3>
                <p className="fan-card-desc">{companySettings.value3Desc || 'Striving for the highest international engineering standards.'}</p>
              </div>
              <div className="fan-card-footer-tag">
                <span>04 ✦ Standards</span>
              </div>
            </div>

            {/* CARD 5: Innovation (Move to Bottom Right, Rotate +12°) */}
            <div
              className={`fan-card card-5 ${activeCardId === 5 ? 'active-expanded' : ''}`}
              onClick={() => handleCardClick(5)}
            >
              <div>
                <div className="fan-card-icon" style={{ background: 'linear-gradient(135deg, #0088B3, #00B8FF)' }}>
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                  </svg>
                </div>
                <h3 className="fan-card-title">{companySettings.value5Title || 'Innovation'}</h3>
                <p className="fan-card-desc">{companySettings.value5Desc || 'Pioneering green technology and sustainable design.'}</p>
              </div>
              <div className="fan-card-footer-tag">
                <span>05 ✦ Sustainable</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3B: OUR WORKING PARTNERS */}
        {(() => {
          const visible = Math.min(4, partners.length);
          const max = Math.max(0, partners.length - visible);
          const prev = () => setPartnerIdx(i => Math.max(0, i - 1));
          const next = () => setPartnerIdx(i => Math.min(max, i + 1));
          return (
            <section className="working-partners-section">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h2 className="bce-heading-primary" style={{ fontSize: '36px' }}>OUR WORKING PARTNERS</h2>
                <div className="bce-underline-gradient" style={{ margin: '12px auto 16px auto' }}></div>
                <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '520px', margin: '0 auto' }}>
                  Trusted collaborations that drive excellence across every project we deliver.
                </p>
              </div>

              {partners.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>No partners added yet.</p>
              ) : (
                <>
                  <div className="partners-carousel-wrap">
                    <button className="partner-arrow partner-arrow-left" onClick={prev} disabled={partnerIdx === 0} aria-label="Previous">&#8249;</button>
                    <div className="partners-track-outer">
                      <div className="partners-track" style={{ transform: `translateX(calc(-${partnerIdx} * (100% / ${visible})))` }}>
                        {partners.map((p) => (
                          <div key={p.id} className="partner-card">
                            <div className="partner-img-wrap">
                              <img src={p.image} alt={p.name} className="partner-img" />
                            </div>
                            <div className="partner-card-body">
                              <p className="partner-name">{p.name}</p>
                              <p className="partner-role">{p.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button className="partner-arrow partner-arrow-right" onClick={next} disabled={partnerIdx >= max} aria-label="Next">&#8250;</button>
                  </div>
                  {max > 0 && (
                    <div className="partners-dots">
                      {Array.from({ length: max + 1 }).map((_, i) => (
                        <button key={i} className={`partner-dot ${i === partnerIdx ? 'active' : ''}`} onClick={() => setPartnerIdx(i)} aria-label={`Slide ${i + 1}`} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          );
        })()}

        {/* SECTION 4: LATEST NEWS (FULL-WIDTH 2-COLUMN) */}
        <section className="latest-news-section">
          <h2 className="bce-heading-primary">LATEST NEWS</h2>
          <div className="bce-underline-gradient"></div>

          <div className="latest-news-grid">
            {/* LEFT: News items */}
            <div className="news-items-list">
              {/* News 1 */}
              <div className="news-card-horizontal">
                <div className="news-card-icon-badge">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="news-card-body">
                  <div className="news-card-text">
                    <strong>ISO 9001 Certified:</strong> We are now an ISO 9001 certified Quality Management System company.
                  </div>
                  <button className="news-read-more-btn" onClick={() => { if (onOpenModal) onOpenModal('iso'); }}>
                    Read More →
                  </button>
                </div>
              </div>

              {/* News 2 */}
              <div className="news-card-horizontal">
                <div className="news-card-icon-badge">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                </div>
                <div className="news-card-body">
                  <div className="news-card-text">
                    <strong>Energy Quotient Provider:</strong> We are the only authorised energy quotient service provider in Qatar.
                  </div>
                  <button className="news-read-more-btn" onClick={() => { if (onNavigate) onNavigate('Services'); }}>
                    Read More →
                  </button>
                </div>
              </div>

              {/* News 3 */}
              <div className="news-card-horizontal">
                <div className="news-card-icon-badge">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7"></circle>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                  </svg>
                </div>
                <div className="news-card-body">
                  <div className="news-card-text">
                    <strong>GORD GSAS Provider:</strong> We are now a GORD certified GSAS service provider.
                  </div>
                  <button className="news-read-more-btn" onClick={() => { if (onOpenModal) onOpenModal('gsas'); }}>
                    Read More →
                  </button>
                </div>
              </div>

              {/* News 4 */}
              <div className="news-card-horizontal">
                <div className="news-card-icon-badge">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <div className="news-card-body">
                  <div className="news-card-text">
                    <strong>KAHRAMAA Project Tarsheed:</strong> Awarded prestigious KAHRAMAA Tarsheed Energy Audit for 22 schools campaign.
                  </div>
                  <button className="news-read-more-btn" onClick={() => { if (onOpenModal) onOpenModal('news2'); }}>
                    Read More →
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: Large Engineering Image with Parallax Effect */}
            <div className="news-parallax-image-wrap">
              <img
                src={aboutEngineeringImg}
                alt="Blue Crescent Engineering Excellence"
                className="news-parallax-img"
              />
            </div>
          </div>
        </section>

        {/* SECTION 5: TESTIMONIALS */}
        <section className="testimonials-section">
          <div className="testimonials-header-row" style={{ marginBottom: '32px' }}>
            <h2 className="bce-heading-primary">What Our Clients Say</h2>
            <div className="bce-underline-gradient" style={{ margin: '16px 0 0 0' }}></div>
          </div>

          {/* Two-column grid: testimonial card left, image right */}
          <div className="testimonials-grid-content">
            {/* Left Column: Testimonial Card */}
            <div className="testimonials-list-column">
              {testimonialsList.length > 0 ? (
                testimonialsList.map((item) => (
                  <div className="premium-card testimonial-card" key={item.id} style={{ marginBottom: '16px' }}>
                    <div className="testimonial-header">
                      <span className="quote-icon">"</span>
                    </div>
                    <p className="testimonial-content" style={{ fontStyle: 'italic', color: '#374151', lineHeight: '1.8' }}>{item.body}</p>
                    <hr className="testimonial-divider" />
                    <div className="premium-testimonial-footer">
                      <div className="testimonial-author-wrapper">
                        <div className="author-avatar">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                        <div className="premium-testimonial-author">
                          <div className="premium-testimonial-name">{item.author}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="premium-card testimonial-card">
                  <div className="testimonial-header">
                    <span className="quote-icon">"</span>
                  </div>
                  <p className="testimonial-content" style={{ fontStyle: 'italic', color: '#374151', lineHeight: '1.8' }}>
                    Blue Crescent has provided us with complete support for MEP drawings, all design Calculations in MEP &amp; Stress Analysis etc in our projects. They are one of the best Engineering company who can be trusted for complete solutions of all Design &amp; Engineering issues. I visited their office &amp; fully satisfied with the Engineering &amp; design team who delivered the works for us on time &amp; also they provided complete support to get approval from various authorities for some woks in very short time. You are Excellent Blue crescent &amp; keep going. Thanks for your works delivered.
                  </p>
                  <hr className="testimonial-divider" />
                  <div className="premium-testimonial-footer">
                    <div className="testimonial-author-wrapper">
                      <div className="author-avatar">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                      <div className="premium-testimonial-author">
                        <div className="premium-testimonial-name">Gokulraj Chakaravarthy</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Large testimonial image */}
            <div className="testimonials-image-column">
              <div className="testimonials-large-card-img-wrap">
                <img src="/testimonial.png" alt="Testimonials" className="testimonials-large-img" />
              </div>
            </div>
          </div>


        </section>

        {/* SECTION 7: FOOTER SPACING */}
        <div className="about-footer-spacer"></div>
      </div>
    </div>
  );
}
