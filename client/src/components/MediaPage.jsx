import React, { useState, useEffect } from 'react';
import { getCachedCompanySettings, updateCachedCompanySettings } from '../utils/bannerCache';
import './MediaPage.css';

export default function MediaPage({ activeSubTab = 'Gallery', onNavigate }) {
  const [activeTab, setActiveTab] = useState(activeSubTab || 'Gallery');
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    if (activeSubTab) {
      setActiveTab(activeSubTab);
    }
  }, [activeSubTab]);

  useEffect(() => {
    fetch('/api/media')
      .then(res => res.ok ? res.json() : [])
      .then(data => setMediaItems(data))
      .catch(err => console.warn('Error fetching media items:', err));
  }, []);

  const [playingVideoId, setPlayingVideoId] = useState(null);

  const galleryItems = mediaItems.filter(item => item.type === 'gallery');
  const videoItems = mediaItems.filter(item => item.type === 'video');

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

  return (
    <div className="media-page-wrapper">
      {/* Banner */}
      <section
        className="media-hero-section"
        style={companySettings?.mediaPageBannerUrl ? { backgroundImage: `url("${companySettings.mediaPageBannerUrl}")` } : {}}
      >
        <div className="media-hero-overlay"></div>
        <div className="media-hero-container">
          <h1 className="media-hero-title">Media Center</h1>
          <p className="media-hero-subtitle">Explore our visual gallery of project landmarks, site operations, and technical innovations.</p>
        </div>
      </section>

      {/* Tabs bar */}
      <div className="media-tabs-container">
        <div className="media-tabs-bar">
          <button 
            className={`media-tab-btn ${activeTab === 'Gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('Gallery')}
          >
            📸 Photo Gallery
          </button>
          <button 
            className={`media-tab-btn ${activeTab === 'Videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('Videos')}
          >
            🎥 Video Showcase
          </button>
        </div>
      </div>

      {/* Content area */}
      <section className="media-content-section container">
        {activeTab === 'Gallery' ? (
          <div>
            <div className="media-section-header">
              <h2>Project Landmarks & Operations</h2>
              <p>High-resolution captures of our construction stages, design layouts, and technical survey milestones.</p>
            </div>
            
            {galleryItems.length === 0 ? (
              <div className="media-empty-state">No photos in the gallery yet.</div>
            ) : (
              <div className="media-gallery-grid">
                {galleryItems.map(item => (
                  <div 
                    key={item.id} 
                    className="media-gallery-card"
                    onClick={() => setSelectedPhoto(item)}
                  >
                    <div className="media-gallery-img-wrap">
                      <img src={item.url} alt={item.title} className="media-gallery-img" />
                      <div className="media-gallery-hover-overlay">
                        <span className="media-gallery-zoom-icon">🔍 View Large</span>
                      </div>
                    </div>
                    <div className="media-gallery-info">
                      <h4 className="media-gallery-title">{item.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="media-section-header">
              <h2>Featured Project Videos & Spotlights</h2>
              <p>Watch video documentation, virtual 3D BIM walkthroughs, and executive sustainability briefings.</p>
            </div>

            {videoItems.length === 0 ? (
              <div className="media-empty-state">No videos posted yet.</div>
            ) : (
              <div className="media-video-grid">
                {videoItems.map(item => {
                  const isPlaying = playingVideoId === item.id;
                  const thumbUrl = getYouTubeThumbnail(item.url);

                  return (
                    <div key={item.id} className="media-video-card">
                      <div className="media-video-thumb-wrap" onClick={() => setPlayingVideoId(item.id)}>
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
                            <div className="media-video-badge">Engineering Showcase</div>
                          </div>
                        )}
                      </div>
                      <div className="media-video-info">
                        <h4 className="media-video-title">{item.title}</h4>
                      </div>
                    </div>
                  );
                })}
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
