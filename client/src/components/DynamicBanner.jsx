import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getCachedPageBanners, getPageBanner } from '../utils/bannerCache';
import './DynamicBanner.css';

/**
 * DynamicBanner
 * Reusable dynamic / live banner component for all inner pages.
 * Supports:
 *  - Type A: Moving Image Slider (2-5 images, 5s crossfade, subtle Ken Burns)
 *  - Type B: Video Banner (autoplay, loop, muted, playsinline, automatic error fallback)
 *  - Seamless fallback to default images or single static image
 *  - Accessibility: Respects prefers-reduced-motion
 */
export default function DynamicBanner({
  pageKey,
  defaultImage,
  defaultImages = [],
  defaultVideo = '',
  title,
  subtitle,
  badge,
  breadcrumbs,
  children,
  className = '',
  style = {},
  overlayOpacity = 'default',
  minHeight = '420px'
}) {
  const [bannerConfig, setBannerConfig] = useState(() => {
    return getPageBanner(pageKey);
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const [failedImages, setFailedImages] = useState({});
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const videoRef = useRef(null);

  // Sync with global cache and fetch updates
  useEffect(() => {
    const updateConfig = () => {
      const config = getPageBanner(pageKey);
      setBannerConfig(config);
    };

    updateConfig();
    window.addEventListener('pageBannersUpdated', updateConfig);
    window.addEventListener('dataUpdated', updateConfig);

    // Initial direct fetch if cache was empty
    if (!bannerConfig) {
      fetch(`/api/banners/${encodeURIComponent(pageKey)}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.page_key) {
            setBannerConfig(data);
          }
        })
        .catch(() => {});
    }

    // Accessibility prefers-reduced-motion check
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    try {
      motionQuery.addEventListener('change', handleMotionChange);
    } catch (e) {
      motionQuery.addListener(handleMotionChange);
    }

    return () => {
      window.removeEventListener('pageBannersUpdated', updateConfig);
      window.removeEventListener('dataUpdated', updateConfig);
      try {
        motionQuery.removeEventListener('change', handleMotionChange);
      } catch (e) {
        motionQuery.removeListener(handleMotionChange);
      }
    };
  }, [pageKey]);

  // Determine active mode & media lists
  const bannerType = (bannerConfig?.banner_type || 'slider').toLowerCase();
  const isBannerActive = bannerConfig ? bannerConfig.status !== 'inactive' : true;
  const slideDuration = (bannerConfig?.slide_duration || 5) * 1000;

  // Resolve slides
  const validSlides = useMemo(() => {
    let list = [];
    if (bannerConfig && Array.isArray(bannerConfig.images) && bannerConfig.images.length > 0) {
      list = bannerConfig.images.filter(url => Boolean(url) && !failedImages[url]);
    }

    if (list.length === 0) {
      if (defaultImages.length > 0) {
        list = defaultImages.filter(url => Boolean(url) && !failedImages[url]);
      } else if (defaultImage && !failedImages[defaultImage]) {
        list = [defaultImage];
      }
    }

    if (list.length === 0 && defaultImage) {
      list = [defaultImage];
    }

    return list;
  }, [bannerConfig, defaultImages, defaultImage, failedImages]);

  // Handle Video banner
  const videoUrl = isBannerActive && bannerType === 'video' ? (bannerConfig?.video_url || defaultVideo) : '';
  const fallbackImg = bannerConfig?.fallback_image || defaultImage || (validSlides[0] || '');

  // Slide rotation loop for Slider mode
  useEffect(() => {
    if (bannerType === 'video' && videoUrl && !videoFailed) return;
    if (validSlides.length <= 1 || prefersReducedMotion) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % validSlides.length);
    }, slideDuration);

    return () => clearInterval(timer);
  }, [validSlides.length, slideDuration, bannerType, videoUrl, videoFailed, prefersReducedMotion]);

  // Handle image load error
  const handleImageError = (failedUrl) => {
    setFailedImages(prev => ({ ...prev, [failedUrl]: true }));
  };

  // Autoplay recovery for video
  useEffect(() => {
    if (bannerType === 'video' && videoUrl && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was blocked or failed, mark as fallback
          console.warn('Banner video autoplay failed or restricted. Displaying fallback image.');
          setVideoFailed(true);
        });
      }
    }
  }, [bannerType, videoUrl]);

  return (
    <div
      className={`dynamic-banner-wrapper ${className}`}
      style={{ minHeight, ...style }}
    >
      {/* Background Media Layer */}
      <div className="dynamic-banner-media-container">
        {isBannerActive && bannerType === 'video' && videoUrl && !videoFailed ? (
          <video
            ref={videoRef}
            key={videoUrl}
            src={videoUrl}
            className="dynamic-banner-video"
            autoPlay
            muted
            loop
            playsInline
            onError={() => {
              console.warn('Video failed to load in DynamicBanner. Falling back to image.');
              setVideoFailed(true);
            }}
          />
        ) : (
          <div className="dynamic-banner-slider-container">
            {validSlides.map((imgUrl, index) => {
              const isActive = index === currentSlideIndex;
              return (
                <div
                  key={`${imgUrl}-${index}`}
                  className={`dynamic-banner-slide ${isActive ? 'is-active' : ''} ${prefersReducedMotion ? 'no-animation' : ''}`}
                >
                  <img
                    src={imgUrl}
                    alt={title || 'Blue Crescent Banner'}
                    className="dynamic-banner-img"
                    onError={() => handleImageError(imgUrl)}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Video fallback image layer if video failed or loading */}
        {isBannerActive && bannerType === 'video' && videoFailed && fallbackImg && (
          <div className="dynamic-banner-slide is-active">
            <img
              src={fallbackImg}
              alt={title || 'Banner Fallback'}
              className="dynamic-banner-img"
            />
          </div>
        )}
      </div>

      {/* Subtle Corporate Blue Gradient Overlay */}
      <div className={`dynamic-banner-overlay opacity-${overlayOpacity}`} />

      {/* Slide Indicators (subtle small dots if 2+ slides in slider mode) */}
      {bannerType !== 'video' && validSlides.length > 1 && !prefersReducedMotion && (
        <div className="dynamic-banner-indicators" aria-hidden="true">
          {validSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`dynamic-banner-dot ${idx === currentSlideIndex ? 'is-active' : ''}`}
              onClick={() => setCurrentSlideIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Banner Text / Content Overlay Container */}
      {(title || subtitle || badge || breadcrumbs || children) && (
        <div className="dynamic-banner-content-wrap">
          <div className="container dynamic-banner-content-inner">
            {badge && <div className="dynamic-banner-badge">{badge}</div>}
            {breadcrumbs && <div className="dynamic-banner-breadcrumbs">{breadcrumbs}</div>}
            {title && <h1 className="dynamic-banner-title">{title}</h1>}
            {subtitle && <p className="dynamic-banner-subtitle">{subtitle}</p>}
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
