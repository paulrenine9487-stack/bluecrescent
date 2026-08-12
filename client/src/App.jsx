import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import CredentialsSection from './components/CredentialsSection';
import WhoWeAreSection from './components/WhoWeAreSection';
import SustainabilityConsultancySection from './components/SustainabilityConsultancySection';
import RemoteConstruction from './components/RemoteConstruction';
import CompanyInfo from './components/CompanyInfo';
import SidebarContent from './components/SidebarContent';
import ServicesList from './components/ServicesList';
import ProjectsSlider from './components/ProjectsSlider';
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
import ProjectDetailPage from './components/ProjectDetailPage';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const [currentView, setCurrentView] = useState('Home');
  const [activeSubTab, setActiveSubTab] = useState(''); // Stores sub-tab or project slug
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Sync state with URL pathname on mount and handle back/forward navigation
  useEffect(() => {
    const syncRouteWithURL = () => {
      const path = window.location.pathname;
      if (path === '/manager' || path === '/admin' || path.startsWith('/admin/')) {
        setCurrentView('Admin');
      } else if (path === '/our-journey') {
        setCurrentView('Our Journey');
      } else if (path.startsWith('/projects/') && path.length > 10) {
        const slug = path.replace('/projects/', '').split('/')[0];
        if (slug) {
          setCurrentView('ProjectDetail');
          setActiveSubTab(slug);
        } else {
          setCurrentView('Projects');
        }
      } else if (path === '/projects') {
        setCurrentView('Projects');
      } else if (path.startsWith('/services/')) {
        const sub = path.replace('/services/', '').split('/')[0];
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
      } else if (path === '/media') {
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
    } else {
      setCurrentView(view);
      setActiveSubTab(subTab);
    }

    // Sync URL path
    if (view === 'Admin') {
      window.history.pushState({}, '', '/manager');
    } else if (view === 'ProjectDetail' && subTab) {
      window.history.pushState({}, '', `/projects/${subTab}`);
    } else if (view === 'Projects') {
      window.history.pushState({}, '', '/projects');
    } else if (view === 'Services') {
      if (subTab) {
        window.history.pushState({}, '', `/services/${slugify(subTab)}`);
      } else {
        window.history.pushState({}, '', '/services');
      }
    } else if (view === 'About Us') {
      window.history.pushState({}, '', subTab === 'our-journey-section' ? '/about-us#our-journey' : '/about-us');
    } else if (view === 'Contact Us') {
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

  return (
    <div className={`app-root ${currentView === 'Home' ? 'is-home-view' : (currentView === 'Admin' ? 'is-admin-view' : 'is-subpage-view')}`}>
      {/* Top Header Navigation */}
      {currentView !== 'Admin' && (
        <Header
          currentView={currentView}
          activeSubTab={activeSubTab}
          onNavigate={handleNavigate}
        />
      )}

      {/* Main View Router */}
      <ErrorBoundary key={currentView}>
        {currentView === 'Admin' ? (
          <AdminPanel
            onNavigate={handleNavigate}
          />
        ) : currentView === 'ProjectDetail' ? (
          <ProjectDetailPage
            projectSlug={activeSubTab}
            onNavigate={handleNavigate}
          />
        ) : currentView === 'Certifications' ? (
          <CertificationsPage
            onNavigate={handleNavigate}
          />
        ) : currentView === 'Contact Us' ? (
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
        ) : (
          <>
            {/* Welcome Hero Carousel */}
            <HeroSlider onNavigate={handleNavigate} />

            {/* OUR CREDENTIALS / CERTIFICATIONS Section */}
            <CredentialsSection onNavigate={handleNavigate} />

            {/* NEW WHO WE ARE SECTION */}
            <WhoWeAreSection onNavigate={handleNavigate} />

            {/* SUSTAINABILITY CONSULTANCY SECTION */}
            <SustainabilityConsultancySection onNavigate={handleNavigate} />

            {/* REMOTE CONSTRUCTION SOLUTIONS SECTION */}
            <RemoteConstruction onNavigate={handleNavigate} />

            {/* Main Container with Company Info & Sidebar */}
            <main className="container">
              {/* Why Blue Crescent Redesigned Section */}
              <div className="why-bce-section-wrap" style={{ marginBottom: '80px' }}>
                <CompanyInfo onNavigate={handleNavigate} />
              </div>

              {/* Our Services Section */}
              <ServicesList onNavigate={handleNavigate} />

              {/* Our Projects Section */}
              <ProjectsSlider onNavigate={handleNavigate} />

              {/* News and Testimonials */}
              <div className="main-content-layout-downside" style={{ marginBottom: '80px' }}>
                <SidebarContent 
                  key={refreshKey} 
                  onOpenModal={() => setIsModalOpen(true)} 
                />
              </div>
            </main>
          </>
        )}
      </ErrorBoundary>

      {/* Footer */}
      {currentView !== 'Admin' && <Footer onNavigate={handleNavigate} />}

      {/* Interactive Testimonial Submission Modal */}
      <TestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleTestimonialSuccess}
      />
    </div>
  );
}
