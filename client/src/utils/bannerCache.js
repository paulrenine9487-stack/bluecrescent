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
    // Cross-merge individual direct localStorage keys as fallbacks
    const aboutUsPageBannerUrl = parsed.aboutUsPageBannerUrl || parsed.aboutUsHeroUrl || localStorage.getItem('aboutUsPageBannerUrl') || localStorage.getItem('aboutUsHeroUrl') || '';
    const servicesPageBannerUrl = parsed.servicesPageBannerUrl || localStorage.getItem('servicesPageBannerUrl') || '';
    const projectsPageBannerUrl = parsed.projectsPageBannerUrl || localStorage.getItem('projectsPageBannerUrl') || '';
    const mediaPageBannerUrl = parsed.mediaPageBannerUrl || localStorage.getItem('mediaPageBannerUrl') || '';
    const contactUsPageBannerUrl = parsed.contactUsPageBannerUrl || localStorage.getItem('contactUsPageBannerUrl') || '';
    const homeBannerUrl = parsed.homeBannerUrl || localStorage.getItem('homeBannerUrl') || '';

    return {
      ...parsed,
      aboutUsPageBannerUrl,
      aboutUsHeroUrl: parsed.aboutUsHeroUrl || aboutUsPageBannerUrl,
      servicesPageBannerUrl,
      projectsPageBannerUrl,
      mediaPageBannerUrl,
      contactUsPageBannerUrl,
      homeBannerUrl
    };
  } catch (e) {
    console.warn('Error reading cached company settings:', e);
  }
  return {};
}

export function updateCachedCompanySettings(newSettings) {
  try {
    const current = getCachedCompanySettings();
    const updated = { ...current, ...newSettings };
    
    // Save direct localStorage fallback keys
    if (updated.aboutUsPageBannerUrl) localStorage.setItem('aboutUsPageBannerUrl', updated.aboutUsPageBannerUrl);
    if (updated.aboutUsHeroUrl) localStorage.setItem('aboutUsHeroUrl', updated.aboutUsHeroUrl);
    if (updated.servicesPageBannerUrl) localStorage.setItem('servicesPageBannerUrl', updated.servicesPageBannerUrl);
    if (updated.projectsPageBannerUrl) localStorage.setItem('projectsPageBannerUrl', updated.projectsPageBannerUrl);
    if (updated.mediaPageBannerUrl) localStorage.setItem('mediaPageBannerUrl', updated.mediaPageBannerUrl);
    if (updated.contactUsPageBannerUrl) localStorage.setItem('contactUsPageBannerUrl', updated.contactUsPageBannerUrl);
    if (updated.homeBannerUrl) localStorage.setItem('homeBannerUrl', updated.homeBannerUrl);

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
