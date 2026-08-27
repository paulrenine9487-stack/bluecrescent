// client/src/utils/bannerCache.js

const CACHE_KEY = 'companySettings';

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

export async function fetchAndCacheCompanySettings() {
  try {
    const [compRes, bannerRes] = await Promise.all([
      fetch('/api/settings/company').catch(() => null),
      fetch('/api/settings/banners').catch(() => null)
    ]);

    let mergedData = {};

    if (compRes && compRes.ok) {
      const compData = await compRes.json();
      if (compData && typeof compData === 'object') {
        mergedData = { ...mergedData, ...compData };
      }
    }

    if (bannerRes && bannerRes.ok) {
      const bannerData = await bannerRes.json();
      if (bannerData && typeof bannerData === 'object') {
        mergedData = { ...mergedData, ...bannerData };
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
