import React, { useState } from 'react';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import CredentialsSection from './components/CredentialsSection';
import CompanyInfo from './components/CompanyInfo';
import SidebarContent from './components/SidebarContent';
import ServicesList from './components/ServicesList';
import WhatWeDoCarousel from './components/WhatWeDoCarousel';
import ProjectsSlider from './components/ProjectsSlider';
import ServicesPage from './components/ServicesPage';
import AboutUsPage from './components/AboutUsPage';
import ProjectsPage from './components/ProjectsPage';
import ContactUsPage from './components/ContactUsPage';
import CertificationsPage from './components/CertificationsPage';
import Footer from './components/Footer';
import TestimonialModal from './components/TestimonialModal';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [currentView, setCurrentView] = useState('Home');
  const [activeSubTab, setActiveSubTab] = useState(''); // Empty defaults to Main Services Overview Page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Sync state with URL pathname on mount and handle back/forward navigation
  React.useEffect(() => {
    if (window.location.pathname === '/manager') {
      setCurrentView('Admin');
    }

    const handlePopState = () => {
      if (window.location.pathname === '/manager') {
        setCurrentView('Admin');
      } else {
        // Simple fallback
        setCurrentView('Home');
        setActiveSubTab('');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTestimonialSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleNavigate = (view, subTab = '') => {
    setCurrentView(view);
    setActiveSubTab(subTab);

    // Sync URL path
    if (view === 'Admin') {
      window.history.pushState({}, '', '/manager');
    } else {
      window.history.pushState({}, '', '/');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      {currentView === 'Admin' ? (
        <AdminPanel
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
      ) : currentView === 'About Us' ? (
        <AboutUsPage
          onOpenModal={() => setIsModalOpen(true)}
          onNavigate={handleNavigate}
        />
      ) : currentView === 'Services' ? (
        <ServicesPage
          activeSubTab={activeSubTab}
          onOpenModal={() => setIsModalOpen(true)}
          onNavigate={handleNavigate}
        />
      ) : (
        <>
          {/* Welcome Hero Carousel */}
          <HeroSlider onNavigate={handleNavigate} />

          {/* OUR CREDENTIALS Section (Full Width between Hero Slider and Why Blue Crescent) */}
          <CredentialsSection onNavigate={handleNavigate} />

          {/* Main Container with Company Info & Sidebar */}
          <main className="container">
            {/* Why Blue Crescent Redesigned Section */}
            <div className="why-bce-section-wrap" style={{ marginBottom: '80px' }}>
              <CompanyInfo onNavigate={handleNavigate} />
            </div>

            {/* News and Testimonials placed downside */}
            <div className="main-content-layout-downside" style={{ marginBottom: '80px' }}>
              <SidebarContent 
                key={refreshKey} 
                onOpenModal={() => setIsModalOpen(true)} 
              />
            </div>

            {/* Our Services Section */}
            <ServicesList onNavigate={handleNavigate} />

            {/* What We Do Section */}
            <WhatWeDoCarousel onNavigate={handleNavigate} />

            {/* Our Projects Section (Dynamically updated from Admin Panel) */}
            <ProjectsSlider onNavigate={handleNavigate} />
          </main>
        </>
      )}

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
