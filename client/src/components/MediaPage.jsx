import React, { useState, useEffect } from 'react';
import { getCachedCompanySettings, updateCachedCompanySettings } from '../utils/bannerCache';
import './MediaPage.css';

function CategoryMediaSlider({ title, categoryColor, items, renderCard, cardsToShow = 3 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
  }, [items.length]);

  // Auto-scroll loop every 3.5 seconds
  useEffect(() => {
    if (isPaused || items.length <= cardsToShow) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev < items.length - cardsToShow ? prev + 1 : 0));
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused, items.length, cardsToShow]);

  return (
    <div style={{ marginBottom: '48px' }}>
      {/* Category Row Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', borderBottom: '1.5px solid #E2E8F0', paddingBottom: '10px' }}>
        <div style={{ width: '5px', height: '22px', background: categoryColor || '#0057B8', borderRadius: '4px' }}></div>
        <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '20px', fontWeight: '800', color: '#062F63', margin: 0 }}>
          {title}
        </h3>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', background: '#F8FAFC', padding: '2px 10px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Auto Horizontal Slider Track */}
      <div 
        style={{ width: '100%', overflow: 'hidden', padding: '8px 0 20px 0' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          style={{
            display: 'flex',
            transform: `translateX(calc(-${currentIndex} * (100% / ${cardsToShow} + ${24 / cardsToShow}px)))`,
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            gap: '24px',
            alignItems: 'stretch'
          }}
        >
          {items.map(item => (
            <div 
              key={item.id} 
              style={{ flex: `0 0 calc(${100 / cardsToShow}% - ${(24 * (cardsToShow - 1)) / cardsToShow}px)`, boxSizing: 'border-box' }}
            >
              {renderCard(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MediaPage({ activeSubTab = 'Gallery', onNavigate }) {
  const [activeTab, setActiveTab] = useState(activeSubTab || 'Gallery');
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [galleryCategory, setGalleryCategory] = useState('ALL');
  const [videoCategory, setVideoCategory] = useState('ALL');

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cardsToShow = windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : 3;

  useEffect(() => {
    if (activeSubTab) {
      setActiveTab(activeSubTab);
    }
  }, [activeSubTab]);

  const [blogs, setBlogs] = useState([]);

  const fetchMediaData = () => {
    fetch('/api/media')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          setMediaItems(data);
        }
      })
      .catch(err => console.warn('Error fetching media items:', err));

    fetch('/api/blogs')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBlogs(data);
        }
      })
      .catch(err => console.warn('Error fetching blogs:', err));
  };

  useEffect(() => {
    fetchMediaData();
    window.addEventListener('dataUpdated', fetchMediaData);
    window.addEventListener('menuUpdated', fetchMediaData);
    return () => {
      window.removeEventListener('dataUpdated', fetchMediaData);
      window.removeEventListener('menuUpdated', fetchMediaData);
    };
  }, []);

  const [playingVideoId, setPlayingVideoId] = useState(null);

  // Fallback items if empty
  const fallbackGallery = [
    { id: 'g1', type: 'gallery', category: 'Site', title: 'Hamad Port Maritime Site Operations', url: '/project1.png' },
    { id: 'g2', type: 'gallery', category: 'Our Office', title: 'Doha Gate Tower Main Headquarters', url: '/about.png' },
    { id: 'g3', type: 'gallery', category: 'Expo', title: 'Qatar Digital Construction Expo 2025', url: '/why.png' },
    { id: 'g4', type: 'gallery', category: 'Our Work', title: '3D Point Cloud Scanning & As-Built Verification', url: '/servicepage1.png' }
  ];

  const fallbackVideos = [
    { id: 'v1', type: 'video', category: 'Our Work', title: 'BIM LOD 500 Coordination & Clash Detection Showcase', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: 'v2', type: 'video', category: 'Our Team', title: 'Blue Crescent Engineering Leadership & Technical Experts', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: 'v3', type: 'video', category: 'Knowledge Sharing', title: 'GSAS Green Building & Sustainability Workshop', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
  ];

  const rawGallery = mediaItems.filter(item => item.type === 'gallery');
  const rawVideos = mediaItems.filter(item => item.type === 'video');

  const galleryItems = rawGallery.length > 0 ? rawGallery : fallbackGallery;
  const videoItems = rawVideos.length > 0 ? rawVideos : fallbackVideos;

  const filteredGallery = galleryCategory === 'ALL'
    ? galleryItems
    : galleryItems.filter(item => (item.category || '').toLowerCase() === galleryCategory.toLowerCase());

  const filteredVideos = videoCategory === 'ALL'
    ? videoItems
    : videoItems.filter(item => (item.category || '').toLowerCase() === videoCategory.toLowerCase());

  const defaultGalleryCats = ['Site', 'Our Office', 'Expo', 'Our Work'];
  const galleryCats = ['ALL', ...Array.from(new Set([...defaultGalleryCats, ...galleryItems.map(i => i.category).filter(Boolean)]))];

  const defaultVideoCats = ['Our Work', 'Our Team', 'Knowledge Sharing'];
  const videoCats = ['ALL', ...Array.from(new Set([...defaultVideoCats, ...videoItems.map(i => i.category).filter(Boolean)]))];

  const getYouTubeId = (url) => {
    if (!url) return '';
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([^&?/]+)/);
    return match ? match[1] : '';
  };

  const getEmbedUrl = (url) => {
    const id = getYouTubeId(url);
    if (!id) return url;
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&modestbranding=1&rel=0&controls=1&showinfo=0&iv_load_policy=3`;
  };

  const getYouTubeThumbnail = (url) => {
    const id = getYouTubeId(url);
    if (!id) return '/project1.png';
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  };

  const [companySettings, setCompanySettings] = useState(() => getCachedCompanySettings());

  useEffect(() => {
    const handleSettingsUpdated = (e) => {
      if (e?.detail) {
        setCompanySettings(prev => ({ ...prev, ...e.detail }));
      } else {
        setCompanySettings(getCachedCompanySettings());
      }
    };

    window.addEventListener('companySettingsUpdated', handleSettingsUpdated);

    fetch('/api/settings/company')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          updateCachedCompanySettings(data);
          setCompanySettings(prev => ({ ...prev, ...data }));
        }
      })
      .catch(err => console.warn('Company settings fetch warning:', err));

    return () => {
      window.removeEventListener('companySettingsUpdated', handleSettingsUpdated);
    };
  }, []);

  const isGalleryView = activeTab.toLowerCase().startsWith('gal');
  const isBlogView = activeTab.toLowerCase().startsWith('blog') || activeTab.toLowerCase().startsWith('announc');

  const sampleBlogs = [
    {
      id: 'b1',
      title: 'Blue Crescent Expands Multidisciplinary BIM & Digital Twin Services in Qatar',
      date: 'August 2026',
      category: 'Company News',
      image: '/servicepage1.png',
      summary: 'Blue Crescent Engineering announces the expansion of LOD 500 BIM modeling, 3D laser scanning, and real-time Digital Twin asset integrations across major Qatari infrastructure projects.'
    },
    {
      id: 'b2',
      title: 'ISO 9001:2015 & GSAS Sustainability Accreditation Recertification',
      date: 'July 2026',
      category: 'Announcement',
      image: '/why.png',
      summary: 'Our engineering quality control management and GSAS green building consultancy frameworks have achieved renewed compliance certification.'
    },
    {
      id: 'b3',
      title: 'Innovations in Remote Construction Management & Drone Site Inspections',
      date: 'June 2026',
      category: 'Engineering Blog',
      image: '/project1.png',
      summary: 'Discover how 360-degree site monitoring and cloud-based CAD/BIM collaboration are accelerating remote project deliveries.'
    }
  ];

  const renderGalleryCard = (item) => (
    <div 
      key={item.id} 
      className="media-gallery-card"
      onClick={() => setSelectedPhoto(item)}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}
    >
      <div className="media-gallery-img-wrap" style={{ height: '240px' }}>
        <img src={item.url} alt={item.title} className="media-gallery-img" />
        <div className="media-gallery-hover-overlay">
          <span className="media-gallery-zoom-icon">🔍 View Large</span>
        </div>
      </div>
      <div className="media-gallery-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#0057B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
          {item.category || 'Site'}
        </span>
        <h4 className="media-gallery-title">{item.title}</h4>
      </div>
    </div>
  );

  const renderVideoCard = (item) => {
    const isPlaying = playingVideoId === item.id;
    const thumbUrl = getYouTubeThumbnail(item.url);

    return (
      <div key={item.id} className="media-video-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
        <div className="media-video-thumb-wrap" onClick={() => setPlayingVideoId(item.id)} style={{ height: '240px' }}>
          {isPlaying ? (
            <iframe
              src={getEmbedUrl(item.url)}
              title={item.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="media-video-iframe"
            ></iframe>
          ) : (
            <div className="media-custom-video-preview">
              <img src={thumbUrl} alt={item.title} className="media-video-thumb-img" />
              <div className="media-video-gradient-overlay" />
              <div className="media-custom-play-btn" title="Play Video">
                <div className="media-play-icon-inner">▶</div>
              </div>
              <div className="media-video-badge">{item.category || 'Our Work'}</div>
            </div>
          )}
        </div>
        <div className="media-video-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            {item.category || 'Our Work'}
          </span>
          <h4 className="media-video-title">{item.title}</h4>
        </div>
      </div>
    );
  };

  // Group gallery items by category
  const activeGalleryGroupCategories = galleryCategory === 'ALL'
    ? galleryCats.filter(c => c !== 'ALL')
    : [galleryCategory];

  // Group video items by category
  const activeVideoGroupCategories = videoCategory === 'ALL'
    ? videoCats.filter(c => c !== 'ALL')
    : [videoCategory];

  return (
    <div className="media-page-wrapper">
      {/* Banner */}
      <section
        className="media-hero-section"
        style={companySettings?.mediaPageBannerUrl ? { backgroundImage: `url("${companySettings.mediaPageBannerUrl}")` } : {}}
      >
        <div className="media-hero-overlay"></div>
        <div className="media-hero-container">
          <h1 className="media-hero-title">
            {isBlogView ? 'Blogs' : isGalleryView ? 'Photo Gallery' : 'Video Showcase'}
          </h1>
          <p className="media-hero-subtitle">
            {isBlogView
              ? 'Stay informed with the latest engineering insights, company articles, and technical publications.'
              : isGalleryView 
                ? 'Explore site operations, Qatar Expo highlights, our main offices, and technical milestones.' 
                : 'Watch 3D BIM walkthroughs, team leadership videos, and engineering briefings.'}
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section className="media-content-section container" style={{ padding: '50px 24px 90px 24px' }}>
        
        {/* Top Sub-Tab Navigation Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('Gallery')}
            style={{
              padding: '10px 24px',
              borderRadius: '30px',
              border: isGalleryView ? '2px solid #0057B8' : '1.5px solid #E2E8F0',
              background: isGalleryView ? '#0057B8' : '#FFFFFF',
              color: isGalleryView ? '#FFFFFF' : '#475569',
              fontWeight: '800',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: isGalleryView ? '0 4px 14px rgba(0, 87, 184, 0.25)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            📸 Photo Gallery
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Videos')}
            style={{
              padding: '10px 24px',
              borderRadius: '30px',
              border: (!isGalleryView && !isBlogView) ? '2px solid #10B981' : '1.5px solid #E2E8F0',
              background: (!isGalleryView && !isBlogView) ? '#10B981' : '#FFFFFF',
              color: (!isGalleryView && !isBlogView) ? '#FFFFFF' : '#475569',
              fontWeight: '800',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: (!isGalleryView && !isBlogView) ? '0 4px 14px rgba(16, 185, 129, 0.25)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            🎥 Video Showcase
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Blogs')}
            style={{
              padding: '10px 24px',
              borderRadius: '30px',
              border: isBlogView ? '2px solid #087CFF' : '1.5px solid #E2E8F0',
              background: isBlogView ? '#087CFF' : '#FFFFFF',
              color: isBlogView ? '#FFFFFF' : '#475569',
              fontWeight: '800',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: isBlogView ? '0 4px 14px rgba(8, 124, 255, 0.25)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            📝 Blogs
          </button>
        </div>
        
        {/* =========================================================================
            VIEW 3: BLOGS
           ========================================================================= */}
        {isBlogView ? (
          <div>
            <div style={{ borderBottom: '2px solid #E2E8F0', paddingBottom: '20px', marginBottom: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ background: '#087CFF', color: '#FFFFFF', padding: '6px 14px', borderRadius: '8px', fontWeight: '800', fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif' }}>
                  BLOGS
                </div>
              </div>
            </div>

            {(() => {
              const activeBlogsList = blogs.length > 0 ? blogs : sampleBlogs;

              if (activeBlogsList.length === 0) {
                return (
                  <div style={{ textAlign: 'center', padding: '60px 24px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <p style={{ fontSize: '15px', color: '#64748B', fontWeight: '600', margin: 0 }}>No engineering insights published in this category yet.</p>
                  </div>
                );
              }

              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
                  {activeBlogsList.map((blog) => {
                    const cacheBust = blog.updated_at ? `?v=${new Date(blog.updated_at).getTime()}` : '';
                    const blogImg = blog.image ? (blog.image.startsWith('data:') || blog.image.startsWith('http') ? blog.image : `${blog.image}${cacheBust}`) : '/servicepage1.png';

                    return (
                      <div
                        key={blog.id}
                        style={{
                          background: '#FFFFFF',
                          borderRadius: '16px',
                          border: '1px solid #E2E8F0',
                          overflow: 'hidden',
                          boxShadow: '0 4px 20px rgba(6, 59, 115, 0.05)',
                          display: 'flex',
                          flexDirection: 'column',
                          cursor: 'pointer',
                          transition: 'transform 0.3s ease, boxShadow 0.3s ease'
                        }}
                        onClick={() => onNavigate ? onNavigate('BlogDetail', blog.slug || blog.id) : null}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-6px)';
                          e.currentTarget.style.boxShadow = '0 12px 30px rgba(8, 124, 255, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 20px rgba(6, 59, 115, 0.05)';
                        }}
                      >
                        <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                          <img
                            src={blogImg}
                            alt={blog.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.currentTarget.src = '/servicepage1.png'; }}
                          />
                          <span
                            style={{
                              position: 'absolute',
                              top: '14px',
                              left: '14px',
                              background: '#087CFF',
                              color: '#FFFFFF',
                              fontSize: '11px',
                              fontWeight: '800',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            {blog.category || 'Company News'}
                          </span>
                        </div>

                        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '8px' }}>
                            📅 {blog.date}
                          </span>
                          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '18px', fontWeight: '800', color: '#063B73', margin: '0 0 12px 0', lineHeight: 1.35 }}>
                            {blog.title}
                          </h3>
                          <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: '0 0 20px 0', flex: 1 }}>
                            {blog.short_description || blog.summary}
                          </p>
                          <button
                            type="button"
                            style={{
                              alignSelf: 'flex-start',
                              background: '#EFF6FF',
                              color: '#087CFF',
                              border: '1px solid #DBEAFE',
                              padding: '8px 18px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '800',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onNavigate) onNavigate('BlogDetail', blog.slug || blog.id);
                            }}
                          >
                            Read Full Article →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        ) : isGalleryView ? (
          <div>
            <div style={{ borderBottom: '2px solid #E2E8F0', paddingBottom: '20px', marginBottom: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ background: '#0057B8', color: '#FFFFFF', padding: '6px 14px', borderRadius: '8px', fontWeight: '800', fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif' }}>
                    GALLERY
                  </div>
                </div>

                {/* Gallery Sub-Categories Filter Pills */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {galleryCats.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setGalleryCategory(cat)}
                      style={{
                        padding: '8px 20px',
                        borderRadius: '30px',
                        border: galleryCategory === cat ? '1.5px solid #0057B8' : '1.5px solid #E2E8F0',
                        background: galleryCategory === cat ? '#0057B8' : '#FFFFFF',
                        color: galleryCategory === cat ? '#FFFFFF' : '#475569',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: galleryCategory === cat ? '0 4px 12px rgba(0, 87, 184, 0.25)' : 'none'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ALL = Horizontal Auto Sliders per Row; Particular Title = Vertical Grid */}
            {galleryCategory === 'ALL' ? (
              activeGalleryGroupCategories.map(cat => {
                const catItems = galleryItems.filter(item => (item.category || '').toLowerCase() === cat.toLowerCase());
                if (catItems.length === 0) return null;
                return (
                  <CategoryMediaSlider
                    key={cat}
                    title={cat}
                    categoryColor="#0057B8"
                    items={catItems}
                    renderCard={renderGalleryCard}
                    cardsToShow={cardsToShow}
                  />
                );
              })
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '5px', height: '22px', background: '#0057B8', borderRadius: '4px' }}></div>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: '800', color: '#062F63', margin: 0 }}>
                    {galleryCategory}
                  </h3>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748B', background: '#F8FAFC', padding: '2px 12px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                    {filteredGallery.length} {filteredGallery.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {filteredGallery.length === 0 ? (
                  <div className="media-empty-state">No photo items in this category.</div>
                ) : (
                  <div className="media-gallery-grid">
                    {filteredGallery.map(renderGalleryCard)}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* =========================================================================
              VIEW 2: VIDEO SHOWCASE PAGE ONLY
             ========================================================================= */
          <div>
            <div style={{ borderBottom: '2px solid #E2E8F0', paddingBottom: '20px', marginBottom: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ background: '#10B981', color: '#FFFFFF', padding: '6px 14px', borderRadius: '8px', fontWeight: '800', fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif' }}>
                    VIDEO
                  </div>
                </div>

                {/* Video Sub-Categories Filter Pills */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {videoCats.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setVideoCategory(cat)}
                      style={{
                        padding: '8px 20px',
                        borderRadius: '30px',
                        border: videoCategory === cat ? '1.5px solid #10B981' : '1.5px solid #E2E8F0',
                        background: videoCategory === cat ? '#10B981' : '#FFFFFF',
                        color: videoCategory === cat ? '#FFFFFF' : '#475569',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: videoCategory === cat ? '0 4px 12px rgba(16, 185, 129, 0.25)' : 'none'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ALL = Horizontal Auto Sliders per Row; Particular Title = Vertical Grid */}
            {videoCategory === 'ALL' ? (
              activeVideoGroupCategories.map(cat => {
                const catItems = videoItems.filter(item => (item.category || '').toLowerCase() === cat.toLowerCase());
                if (catItems.length === 0) return null;
                return (
                  <CategoryMediaSlider
                    key={cat}
                    title={cat}
                    categoryColor="#10B981"
                    items={catItems}
                    renderCard={renderVideoCard}
                    cardsToShow={cardsToShow}
                  />
                );
              })
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '5px', height: '22px', background: '#10B981', borderRadius: '4px' }}></div>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: '800', color: '#062F63', margin: 0 }}>
                    {videoCategory}
                  </h3>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748B', background: '#F8FAFC', padding: '2px 12px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                    {filteredVideos.length} {filteredVideos.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {filteredVideos.length === 0 ? (
                  <div className="media-empty-state">No video items in this category.</div>
                ) : (
                  <div className="media-video-grid">
                    {filteredVideos.map(renderVideoCard)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="media-lightbox" onClick={() => setSelectedPhoto(null)}>
          <div className="media-lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="media-lightbox-close" onClick={() => setSelectedPhoto(null)}>✕</button>
            <img src={selectedPhoto.url} alt={selectedPhoto.title} className="media-lightbox-img" />
            <div className="media-lightbox-caption">{selectedPhoto.title}</div>
          </div>
        </div>
      )}
    </div>
  );
}
