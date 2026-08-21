import React, { useState, useEffect } from 'react';
import {
  ChevronRight, MapPin, Phone, Mail, Globe,
  Leaf, Layers, Cpu, Compass, Radio, Building2
} from 'lucide-react';
import logoBlueImg from '../assets/logo1_transparent_blue.png';

export default function Footer({ onNavigate }) {
  const [footerData, setFooterData] = useState({
    brand_desc: 'Engineering and digital transformation solutions connecting design, construction and asset lifecycle management.',
    facebook_url: 'https://www.facebook.com/pages/Blue%20Crescent%20Engineering,%20Trading%20&%20Contracting/107539580965764/',
    instagram_url: '#',
    address: '9th Floor, Tower 3, Gate Mall, Doha, Qatar',
    phone: 'T: +974 4463 5250 | F: +974 4441 8567',
    email: 'info@bluecrescent.com',
    website: 'www.bluecrescentqatar.com',
    copyright: '© 2026 BLUE CRESCENT ENGINEERING. All Rights Reserved. A Solution for your Vision.'
  });

  const [dynamicMenus, setDynamicMenus] = useState([]);
  const [dynamicServices, setDynamicServices] = useState([]);

  const fetchAllFooterData = () => {
    fetch('/api/footer')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setFooterData(prev => ({
            ...prev,
            ...data
          }));
        }
      })
      .catch(err => console.warn('Footer fetch warning:', err));

    fetch('/api/menus')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDynamicMenus(data);
        }
      })
      .catch(err => console.warn('Menus fetch warning in footer:', err));

    fetch('/api/services')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDynamicServices(data);
        }
      })
      .catch(err => console.warn('Services fetch warning in footer:', err));

    fetch('/api/settings/contact')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data === 'object') {
          setFooterData(prev => ({
            ...prev,
            address: data.address || prev.address,
            phone: data.phone || prev.phone,
            email: data.email || prev.email,
            website: data.website || prev.website
          }));
        }
      })
      .catch(err => console.warn('Contact settings fetch warning:', err));
  };

  useEffect(() => {
    fetchAllFooterData();
    window.addEventListener('dataUpdated', fetchAllFooterData);
    window.addEventListener('menuUpdated', fetchAllFooterData);
    return () => {
      window.removeEventListener('dataUpdated', fetchAllFooterData);
      window.removeEventListener('menuUpdated', fetchAllFooterData);
    };
  }, []);

  const handleNav = (page, subTab = '') => {
    if (onNavigate) {
      onNavigate(page, subTab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Resolve quick links from dynamicMenus or default
  const rootMenus = dynamicMenus.filter(m => !m.parent_id).sort((a, b) => (a.order_num || 0) - (b.order_num || 0));
  const quickLinks = rootMenus.length > 0
    ? rootMenus.map(m => m.name)
    : ['Home', 'About Us', 'Services', 'Projects', 'Media', 'Contact Us'];

  // Exact 6 services list for footer as requested
  const serviceItems = [
    { title: 'BIM', slug: 'bim' },
    { title: 'CAD', slug: 'cad' },
    { title: 'Laser Scanning', slug: 'laser-scanning' },
    { title: 'GSAS', slug: 'gsas' },
    { title: 'LEED', slug: 'leed' },
    { title: 'Asset Management', slug: 'asset-management' }
  ];

  const getServiceIcon = (title) => {
    const t = (title || '').toLowerCase();
    if (t.includes('bim')) return <Compass size={16} className="bce-service-icon" />;
    if (t.includes('cad')) return <Building2 size={16} className="bce-service-icon" />;
    if (t.includes('gsas') || t.includes('leed') || t.includes('sustainability') || t.includes('energy')) return <Leaf size={16} className="bce-service-icon" />;
    if (t.includes('twin') || t.includes('system') || t.includes('integration')) return <Layers size={16} className="bce-service-icon" />;
    return <Cpu size={16} className="bce-service-icon" />;
  };

  return (
    <footer className="bce-footer-v2">
      {/* Top Section: 4 Columns */}
      <div className="bce-footer-v2-top">

        {/* Column 1: Brand & Socials */}
        <div className="bce-footer-v2-col brand-col">
          <div className="bce-footer-v2-logo" onClick={() => handleNav('Home')}>
            <img
              src={logoBlueImg}
              alt="Blue Crescent Engineering"
              className="bce-footer-v2-logo-img"
            />
          </div>
          <p className="bce-footer-v2-desc">
            Delivering innovative engineering solutions with excellence,<br />
            integrity and sustainability. Building a better<br />
            future together for your vision.
          </p>
          <div className="bce-footer-v2-socials">
            {footerData.facebook_url && (
              <a href={footerData.facebook_url} className="bce-social-circle" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
            )}
            <a href="https://www.youtube.com/@visionnextqatar" className="bce-social-circle youtube-social-circle" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            {footerData.instagram_url && footerData.instagram_url !== '#' && (
              <a href={footerData.instagram_url} className="bce-social-circle" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
            )}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="bce-footer-v2-col links-col">
          <h4 className="bce-footer-v2-heading">QUICK LINKS</h4>
          <ul className="bce-footer-v2-list">
            {quickLinks.map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} onClick={(e) => { e.preventDefault(); handleNav(item); }}>
                  <ChevronRight size={14} className="bce-list-icon" /> {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Our Services */}
        <div className="bce-footer-v2-col services-col">
          <h4 className="bce-footer-v2-heading">OUR SERVICES</h4>
          <ul className="bce-footer-v2-list services-list">
            {serviceItems.map((svc) => (
              <li key={svc.title}>
                <a href={`#services-${svc.slug}`} onClick={(e) => { e.preventDefault(); handleNav('Services', svc.slug); }}>
                  {getServiceIcon(svc.title)} {svc.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact Us */}
        <div className="bce-footer-v2-col contact-col">
          <h4 className="bce-footer-v2-heading">CONTACT US</h4>
          <ul className="bce-footer-v2-list contact-list">
            {footerData.address && (
              <li>
                <MapPin size={18} className="bce-contact-icon" />
                <span>{footerData.address}</span>
              </li>
            )}
            {footerData.phone && (
              <li>
                <Phone size={18} className="bce-contact-icon" />
                <span>{footerData.phone}</span>
              </li>
            )}
            {footerData.email && (
              <li>
                <Mail size={18} className="bce-contact-icon" />
                <span>E-mail: {footerData.email}</span>
              </li>
            )}
            {footerData.website && (
              <li>
                <Globe size={18} className="bce-contact-icon" />
                <span>{footerData.website}</span>
              </li>
            )}
          </ul>
        </div>

      </div>

      {/* Bottom Section: Copyright */}
      <div className="bce-footer-v2-bottom">
        <p style={{ color: '#FFFFFF', margin: 0 }}>
          {footerData.copyright}
        </p>
      </div>
    </footer>
  );
}
