// client/src/utils/bannerCache.js

const CACHE_KEY = 'companySettings';
const PAGE_BANNERS_KEY = 'pageBannersMap';

export function getCachedCompanySettings() {
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    let parsed = {};
    if (saved) {
      try {
        parsed = JSON.parse(saved) || {};
      } catch (e) {}
    }
    return { ...parsed };
  } catch (e) {
    console.warn('Error reading cached company settings:', e);
  }
  return {};
}

export function updateCachedCompanySettings(newSettings) {
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    let current = {};
    if (saved) {
      try {
        current = JSON.parse(saved) || {};
      } catch (e) {}
    }
    const updated = { ...current, ...newSettings };
    
    // Explicitly update OR remove direct localStorage fallback keys
    const bannerKeys = [
      'aboutUsPageBannerUrl',
      'aboutUsHeroUrl',
      'servicesPageBannerUrl',
      'projectsPageBannerUrl',
      'mediaPageBannerUrl',
      'contactUsPageBannerUrl',
      'homeBannerUrl'
    ];
    bannerKeys.forEach(key => {
      if (updated[key]) {
        localStorage.setItem(key, updated[key]);
      } else {
        localStorage.removeItem(key);
        delete updated[key];
      }
    });

    localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('companySettingsUpdated', { detail: updated }));
    return updated;
  } catch (e) {
    console.warn('Error updating company settings cache:', e);
    return newSettings;
  }
}

export function getCachedPageBanners() {
  try {
    const saved = localStorage.getItem(PAGE_BANNERS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      } catch (e) {}
    }
  } catch (e) {
    console.warn('Error reading cached page banners:', e);
  }
  return {};
}

export function updateCachedPageBanners(newMap) {
  try {
    const current = getCachedPageBanners();
    const merged = { ...current, ...newMap };
    localStorage.setItem(PAGE_BANNERS_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent('pageBannersUpdated', { detail: merged }));
    return merged;
  } catch (e) {
    console.warn('Error updating cached page banners:', e);
    return newMap;
  }
}

export function getPageBanner(pageKey) {
  if (!pageKey) return null;
  const map = getCachedPageBanners();
  const normalizedKey = pageKey.toLowerCase().replace(/[^a-z0-9-]/g, '');
  return map[pageKey] || map[normalizedKey] || null;
}

export async function fetchAndCacheCompanySettings() {
  try {
    const [compRes, legacyBannerRes, liveBannersRes] = await Promise.all([
      fetch('/api/settings/company').catch(() => null),
      fetch('/api/settings/banners').catch(() => null),
      fetch('/api/banners').catch(() => null)
    ]);

    let mergedData = {};

    if (compRes && compRes.ok) {
      const compData = await compRes.json();
      if (compData && typeof compData === 'object') {
        mergedData = { ...mergedData, ...compData };
      }
    }

    if (legacyBannerRes && legacyBannerRes.ok) {
      const bannerData = await legacyBannerRes.json();
      if (bannerData && typeof bannerData === 'object') {
        mergedData = { ...mergedData, ...bannerData };
      }
    }

    if (liveBannersRes && liveBannersRes.ok) {
      const liveBanners = await liveBannersRes.json();
      if (liveBanners && typeof liveBanners === 'object') {
        updateCachedPageBanners(liveBanners);
      }
    }

    if (Object.keys(mergedData).length > 0) {
      return updateCachedCompanySettings(mergedData);
    }
  } catch (err) {
    console.warn('Error pre-fetching company settings:', err);
  }
  return getCachedCompanySettings();
}

