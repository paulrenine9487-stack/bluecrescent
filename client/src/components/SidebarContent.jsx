import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function SidebarContent({ onOpenModal }) {
  const [testimonials, setTestimonials] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async (url, setter) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Response not ok');
        const data = await res.json();
        if (isMounted) setter(data);
      } catch (err) {
        // Retry once after 1.5 seconds if Express server was still starting up
        setTimeout(async () => {
          try {
            const res = await fetch(url);
            if (res.ok && isMounted) {
              const data = await res.json();
              setter(data);
            }
          } catch (e) {
            // Keep fallback initial render state
          }
        }, 1500);
      }
    };

    fetchData('/api/testimonials', setTestimonials);
    fetchData('/api/news', setNews);

    return () => { isMounted = false; };
  }, []);

  // Map API news or use mock items that match the screenshot layout exactly
  const displayNews = news.length > 0 ? news.map((item, idx) => {
    const categories = ['PROJECTS', 'NEWS', 'AWARDS'];
    const images = ['/project1.png', '/sust_workshop.png', '/simulation.png'];
    const dates = ['May 20, 2024', 'April 15, 2024', 'March 10, 2024'];
    return {
      id: item.id,
      title: item.title,
      category: item.category || categories[idx % categories.length],
      image: item.image || images[idx % images.length],
      date: item.date || dates[idx % dates.length]
    };
  }) : [
    {
      id: 1,
      category: 'PROJECTS',
      image: '/project1.png',
      title: 'Blue Crescent Engineering Awarded Major Industrial Project in Saudi Arabia',
      date: 'May 20, 2024'
    },
    {
      id: 2,
      category: 'NEWS',
      image: '/sust_workshop.png',
      title: 'Advancing Sustainable Engineering Through Innovation',
      date: 'April 15, 2024'
    }
  ];

  return (
    <div className="news-testimonials-redesign-wrap">
      {/* LATEST NEWS SECTION */}
      <section className="premium-news-section">
        {/* Header row */}
        <div className="news-header-row">
          <div className="news-header-left">
            <h2 className="news-main-heading">Latest News</h2>
            <div className="why-bce-divider-line" style={{ margin: '16px 0 24px 0' }}></div>
            <p className="news-desc-para">
              Discover our latest achievements, announcements, and updates from Blue Crescent Engineering.
            </p>
          </div>
          <div className="news-header-right">
            <button className="btn-view-all-news">
              VIEW ALL NEWS <ArrowRight size={16} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        </div>

        {/* Content grid */}
        <div className="news-grid-content">
          {/* Left Column: Stack of cards */}
          <div className="news-list-column">
            {displayNews.map((item) => (
              <div key={item.id} className="news-item-row-card">
                <div className="news-item-info">
                  <span className={`news-tag-badge ${item.category.toLowerCase()}`}>
                    {item.category}
                  </span>
                  <h4 className="news-item-title">{item.title}</h4>
                  <div className="news-item-meta">
                    <span className="news-item-date">{item.date}</span>
                    <span className="news-item-sep">|</span>
                    <span className="news-item-cat">{item.category}</span>
                  </div>
                </div>
                <div className="news-item-arrow-wrap">
                  <div className="news-item-arrow-circle">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Large Image of why.png */}
          <div className="news-image-column">
            <div className="news-large-card-img-wrap">
              <img src="/why.png" alt="Blue Crescent Engineering Building" className="news-large-img" />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="premium-testimonials-section" style={{ marginTop: '80px' }}>
        <div className="testimonials-header-row" style={{ marginBottom: '32px' }}>
          <h2 className="news-main-heading">What Our Clients Say</h2>
          <div className="why-bce-divider-line" style={{ margin: '16px 0 24px 0' }}></div>
        </div>

        {/* Content grid */}
        <div className="testimonials-grid-content">
          {/* Left Column: Testimonials cards */}
          <div className="testimonials-list-column">
            {testimonials.length > 0 ? (
              testimonials.map((t) => (
                <div className="premium-card testimonial-card" key={t.id} style={{ marginBottom: '16px' }}>
                  <div className="testimonial-header">
                    <span className="quote-icon">“</span>
                    <h4 className="testimonial-title">{t.title}</h4>
                  </div>
                  <p className="testimonial-content">{t.content}</p>
                  <hr className="testimonial-divider" />
                  <div className="premium-testimonial-footer">
                    <div className="testimonial-author-wrapper">
                      <div className="author-avatar">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                      <div className="premium-testimonial-author">
                        <div className="premium-testimonial-name">{t.author_name}</div>
                        {t.company_name && <div className="premium-testimonial-company">{t.company_name}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="premium-card testimonial-card">
                <div className="testimonial-header">
                  <span className="quote-icon">“</span>
                  <h4 className="testimonial-title">Excellent Work</h4>
                </div>
                <p className="testimonial-content">
                  Blue Crescent has provided us with complete support for MEP drawings, all design Calculations in MEP & Stress Analysis etc in our projects. They are one of the best Engineering company who can be trusted for complete solutions of all Design & Engineering issues. I visited their office & fully satisfied with the Engineering & design team who delivered the works for us on time & also they provided complete support to get approval from various authorities for some woks in very short time. You are Excellent Blue crescent & keep going. Thanks for your works delivered.
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
                      <div className="premium-testimonial-company">Diplomat Group W.L.L</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Large Image of testimonial.png */}
          <div className="testimonials-image-column">
            <div className="testimonials-large-card-img-wrap">
              <img src="/testimonial.png" alt="Testimonials" className="testimonials-large-img" />
            </div>
          </div>
        </div>

        <div className="testimonials-action-row" style={{ marginTop: '32px', textAlign: 'center' }}>
          <button className="premium-submit-btn" onClick={onOpenModal}>
            SUBMIT TESTIMONIAL
          </button>
        </div>
      </section>
    </div>
  );
}
