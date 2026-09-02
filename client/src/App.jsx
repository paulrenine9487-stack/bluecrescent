import React, { useState, useEffect } from 'react';
import { fetchAndCacheCompanySettings } from './utils/bannerCache';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import CredentialsSection from './components/CredentialsSection';
import WhoWeAreSection from './components/WhoWeAreSection';
import ManagingPartnersMessageSection from './components/ManagingPartnersMessageSection';
import SustainabilityConsultancySection from './components/SustainabilityConsultancySection';
import RemoteConstruction from './components/RemoteConstruction';
import CompanyInfo from './components/CompanyInfo';
import SidebarContent from './components/SidebarContent';
import ProjectsSlider from './components/ProjectsSlider';
import WorkingPartnersSection from './components/WorkingPartnersSection';
import MajorClientsSection from './components/MajorClientsSection';
import ProjectInMindCTASection from './components/ProjectInMindCTASection';
import ServicesPage from './components/ServicesPage';
import AboutUsPage from './components/AboutUsPage';
import ProjectsPage from './components/ProjectsPage';
import ContactUsPage from './components/ContactUsPage';
import CertificationsPage from './components/CertificationsPage';
import MediaPage from './components/MediaPage';
import OurJourneyPage from './components/OurJourneyPage';
import Footer from './components/Footer';
import TestimonialModal from './components/TestimonialModal';
import AdminPanel from './components/AdminPanel';
import MaintenancePage from './components/MaintenancePage';
import ProjectDetailPage from './components/ProjectDetailPage';
import BlogDetailPage from './components/BlogDetailPage';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const [currentView, setCurrentView] = useState('Home');
  const [activeSubTab, setActiveSubTab] = useState(''); // Stores sub-tab or project slug
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Dynamic Maintenance Mode State
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceData, setMaintenanceData] = useState(null);

  useEffect(() => {
    const checkMaintenanceStatus = async () => {
      try {
        const res = await fetch('/api/settings/maintenance-status');
        if (res.ok) {
          const data = await res.json();
          setIsMaintenanceMode(Boolean(data.maintenanceMode));
          setMaintenanceData(data);
        }
      } catch (err) {
        console.warn('Could not fetch maintenance status (fail-safe to live site):', err);
        setIsMaintenanceMode(false);
      }
    };

    checkMaintenanceStatus();
    const interval = setInterval(checkMaintenanceStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Sync state with URL pathname on mount and handle back/forward navigation
  useEffect(() => {
    fetchAndCacheCompanySettings();
    const syncRouteWithURL = () => {
      const path = window.location.pathname;
      if (path === '/manager' || path === '/admin' || path.startsWith('/admin/')) {
        setCurrentView('Admin');
      } else if (path === '/our-journey') {
        setCurrentView('Our Journey');
      } else if (path.startsWith('/projects/')) {
        const parts = path.replace('/projects/', '').split('/').filter(Boolean);
        const slug = parts.length > 0 ? parts[parts.length - 1] : '';
        if (slug) {
          const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
          const knownSubTabs = [
            'engineering', 'sustainability', 'digitaltwin', 'construction', 'technology',
            'bim', 'cad', 'laserscanning', 'gsas', 'leed', 'energyaudit', 'environment',
            'assetmanagement', 'systemintegration', '360site', 'arsolutions', 'digitalcollaboration'
          ];
          const isCategorySubTab = knownSubTabs.some(k => cleanSlug.includes(k));
          if (isCategorySubTab) {
            setCurrentView('Projects');
            setActiveSubTab(decodeURIComponent(slug));
          } else {
            setCurrentView('ProjectDetail');
            setActiveSubTab(slug);
          }
        } else {
          setCurrentView('Projects');
          setActiveSubTab('');
        }
      } else if (path === '/projects') {
        setCurrentView('Projects');
        setActiveSubTab('');
      } else if (path.startsWith('/services/')) {
        const parts = path.replace('/services/', '').split('/').filter(Boolean);
        const sub = parts.length > 0 ? parts[parts.length - 1] : '';
        setCurrentView('Services');
        setActiveSubTab(sub ? decodeURIComponent(sub) : '');
      } else if (path === '/services') {
        setCurrentView('Services');
        setActiveSubTab('');
      } else if (path === '/about-us' || path === '/about') {
        setCurrentView('About Us');
      } else if (path === '/contact-us' || path === '/contact') {
        setCurrentView('Contact Us');
      } else if (path === '/certifications') {
        setCurrentView('Certifications');
      } else if (path.startsWith('/insights/') || path.startsWith('/blog/')) {
        const parts = path.split('/').filter(Boolean);
        const slug = parts.length > 1 ? parts[parts.length - 1] : '';
        setCurrentView('BlogDetail');
        setActiveSubTab(slug);
      } else if (path === '/media' || path === '/insights') {
        setCurrentView('Media');
      } else {
        setCurrentView('Home');
      }
    };

    syncRouteWithURL();

    const handlePopState = () => {
      syncRouteWithURL();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTestimonialSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleNavigate = (view, subTab = '') => {
    const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (view === 'Our Journey' || view === 'Journey') {
      window.history.pushState({}, '', '/about-us#our-journey');
      setCurrentView('About Us');
      setActiveSubTab('our-journey-section');
    } else if (view === "Let's Connect") {
      setCurrentView('Contact Us');
      setActiveSubTab(subTab);
    } else if (view === 'Expertise') {
      setCurrentView('Services');
      setActiveSubTab(subTab);
    } else {
      setCurrentView(view);
      setActiveSubTab(subTab);
    }

    // Sync URL path
    if (view === 'Admin') {
      window.history.pushState({}, '', '/manager');
    } else if (view === 'ProjectDetail' && subTab) {
      window.history.pushState({}, '', `/projects/${subTab}`);
    } else if (view === 'BlogDetail' && subTab) {
      window.history.pushState({}, '', `/insights/${subTab}`);
    } else if (view === 'Projects') {
      if (subTab) {
        window.history.pushState({}, '', `/projects/${slugify(subTab)}`);
      } else {
        window.history.pushState({}, '', '/projects');
      }
    } else if (view === 'Services' || view === 'Expertise') {
      if (subTab) {
        window.history.pushState({}, '', `/services/${slugify(subTab)}`);
      } else {
        window.history.pushState({}, '', '/services');
      }
    } else if (view === 'About Us') {
      window.history.pushState({}, '', subTab === 'our-journey-section' ? '/about-us#our-journey' : '/about-us');
    } else if (view === 'Contact Us' || view === "Let's Connect") {
      window.history.pushState({}, '', '/contact-us');
    } else if (view === 'Certifications') {
      window.history.pushState({}, '', '/certifications');
    } else if (view === 'Media') {
      window.history.pushState({}, '', '/media');
    } else if (view !== 'Our Journey' && view !== 'Journey') {
      window.history.pushState({}, '', '/');
    }

    if (subTab === 'our-journey-section' || view === 'Our Journey' || view === 'Journey') {
      const scrollFn = () => {
        const el = document.getElementById('our-journey-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
      scrollFn();
      setTimeout(scrollFn, 50);
      setTimeout(scrollFn, 200);
      setTimeout(scrollFn, 500);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // CRITICAL ADMIN BYPASS: If current view is Admin (/admin, /manager), Admin Panel renders normally
  if (currentView === 'Admin') {
    return (
      <div className="app-root is-admin-view">
        <ErrorBoundary key="Admin">
          <AdminPanel onNavigate={handleNavigate} />
        </ErrorBoundary>
      </div>
    );
  }

  // PUBLIC WEBSITE MAINTENANCE PAGE wrapper
  if (isMaintenanceMode) {
    return (
      <div className="app-root is-maintenance-view">
        <ErrorBoundary key="Maintenance">
          <MaintenancePage onNavigate={handleNavigate} maintenanceData={maintenanceData} />
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className={`app-root ${currentView === 'Home' ? 'is-home-view' : 'is-subpage-view'}`}>
      {/* Top Header Navigation */}
      <Header
        currentView={currentView}
        activeSubTab={activeSubTab}
        onNavigate={handleNavigate}
      />

      {/* Main View Router */}
      <ErrorBoundary key={currentView}>
        {currentView === 'ProjectDetail' ? (
          <ProjectDetailPage
            projectSlug={activeSubTab}
            onNavigate={handleNavigate}
          />
        ) : currentView === 'Certifications' ? (
          <CertificationsPage
            onNavigate={handleNavigate}
          />
        ) : (currentView === 'Contact Us' || currentView === "Let's Connect") ? (
          <ContactUsPage
            onNavigate={handleNavigate}
          />
        ) : currentView === 'Projects' ? (
          <ProjectsPage
            activeSubTab={activeSubTab}
            onNavigate={handleNavigate}
          />
        ) : (currentView === 'About Us' || currentView === 'Our Journey' || currentView === 'Journey') ? (
          <AboutUsPage
            scrollToSection={activeSubTab || (currentView === 'Our Journey' || currentView === 'Journey' ? 'our-journey-section' : '')}
            onOpenModal={() => setIsModalOpen(true)}
            onNavigate={handleNavigate}
          />
        ) : currentView === 'Services' ? (
          <ServicesPage
            activeSubTab={activeSubTab}
            onOpenModal={() => setIsModalOpen(true)}
            onNavigate={handleNavigate}
          />
        ) : currentView === 'Media' ? (
          <MediaPage
            activeSubTab={activeSubTab}
            onNavigate={handleNavigate}
          />
        ) : currentView === 'BlogDetail' ? (
          <BlogDetailPage
            slug={activeSubTab}
            onNavigate={handleNavigate}
          />
        ) : (
          <>
            {/* Welcome Hero Carousel */}
            <HeroSlider onNavigate={handleNavigate} />

            {/* NEW WHO WE ARE SECTION */}
            <WhoWeAreSection onNavigate={handleNavigate} />

            {/* MANAGING PARTNER'S MESSAGE SECTION */}
            <ManagingPartnersMessageSection />

            {/* SUSTAINABILITY CONSULTANCY SECTION */}
            <SustainabilityConsultancySection onNavigate={handleNavigate} />

            {/* REMOTE CONSTRUCTION SOLUTIONS SECTION */}
            <RemoteConstruction onNavigate={handleNavigate} />

            {/* Main Container with Company Info & Sidebar */}
            <main className="container">
              {/* Why Blue Crescent Redesigned Section */}
              <div className="why-bce-section-wrap" style={{ marginBottom: '24px' }}>
                <CompanyInfo onNavigate={handleNavigate} />
              </div>

              {/* Our Projects Section */}
              <ProjectsSlider onNavigate={handleNavigate} />

            </main>

            {/* OUR CREDENTIALS / CERTIFICATIONS Section (UNDER OUR PROJECTS) */}
            <CredentialsSection onNavigate={handleNavigate} />

            {/* OUR WORKING PARTNERS SECTION */}
            <WorkingPartnersSection />

            {/* OUR MAJOR CLIENTS SECTION - FULL WIDTH BLUE BACKGROUND */}
            <MajorClientsSection />

            {/* WHAT OUR CLIENTS SAY (News & Testimonials) */}
            <main className="container" style={{ marginTop: '40px' }}>
              <div className="main-content-layout-downside" style={{ marginBottom: '40px' }}>
                <SidebarContent 
                  currentView={currentView}
                  activeSubTab={activeSubTab}
                  onNavigate={handleNavigate}
                />
              </div>
            </main>

            {/* HAVE A PROJECT IN MIND? LET’S CONNECT. SECTION */}
            <ProjectInMindCTASection onNavigate={handleNavigate} />
          </>
        )}
      </ErrorBoundary>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Interactive Testimonial Submission Modal */}
      <TestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleTestimonialSuccess}
      />
    </div>
  );
}
