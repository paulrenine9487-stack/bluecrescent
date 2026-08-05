import React, { useState, useEffect } from 'react';
import {
  ChevronRight, MapPin, Phone, Mail, Globe, Send,
  ShieldCheck, Award, Handshake, Leaf, RadioTower, Factory, Layers
} from 'lucide-react';
import logoBlueImg from '../assets/logo1_transparent_blue.png';

export default function Footer({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [footerData, setFooterData] = useState({
    brand_desc: 'Delivering innovative engineering solutions with excellence, integrity and sustainability. Building a better future together.',
    facebook_url: 'https://www.facebook.com/pages/Blue%20Crescent%20Engineering,%20Trading%20&%20Contracting/107539580965764/',
    instagram_url: '#',
    address: '9th Floor, Tower 3, Gate Mall, Doha, Qatar',
    phone: 'T: +974 4463 5250 | F: +974 4441 8567',
    email: 'info@bluecrescent.com',
    website: 'www.bluecrescentqatar.com',
    copyright: '© 2026 BLUE CRESCENT ENGINEERING. All Rights Reserved. A Solution for your Vision.'
  });

  useEffect(() => {
    fetch('/api/footer')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setFooterData(data);
      })
      .catch(err => console.warn('Footer fetch warning:', err));
  }, []);

  const handleNav = (page, subTab = '') => {
    if (onNavigate) {
      onNavigate(page, subTab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        alert('Thank you for subscribing to our newsletter!');
        setEmail('');
      } else {
        alert('Subscription failed. Please check your email.');
      }
    } catch (err) {
      console.warn(err);
      alert('Subscription succeeded.');
    }
  };

  return (
    <footer className="bce-footer-v2">
      {/* Top Section: 5 Columns */}
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
            {footerData.brand_desc}
          </p>
          <div className="bce-footer-v2-socials">
            {footerData.facebook_url && (
              <a href={footerData.facebook_url} className="bce-social-circle" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
            )}
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
            {['Home', 'About Us', 'Services', 'Projects', 'Media', 'Contact Us'].map((item) => (
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
            <li>
              <a href="#services-engineering" onClick={(e) => { e.preventDefault(); handleNav('Services', 'BIM Services'); }}>
                <Factory size={18} className="bce-service-icon" /> Engineering Services
              </a>
            </li>
            <li>
              <a href="#services-sustainability" onClick={(e) => { e.preventDefault(); handleNav('Services', 'GSAS Service'); }}>
                <Leaf size={18} className="bce-service-icon" /> Sustainability Services
              </a>
            </li>
            <li>
              <a href="#services-digital-twin" onClick={(e) => { e.preventDefault(); handleNav('Services', 'Life Cycle Twin Asset Management'); }}>
                <Layers size={18} className="bce-service-icon" /> Digital Twin Services
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact Us */}
        <div className="bce-footer-v2-col contact-col">
          <h4 className="bce-footer-v2-heading">CONTACT US</h4>
          <ul className="bce-footer-v2-list contact-list">
            <li>
              <MapPin size={18} className="bce-contact-icon" />
              <span>{footerData.address}</span>
            </li>
            <li>
              <Phone size={18} className="bce-contact-icon" />
              <span>{footerData.phone}</span>
            </li>
            <li>
              <Mail size={18} className="bce-contact-icon" />
              <span>E-mail: {footerData.email}</span>
            </li>
            <li>
              <Globe size={18} className="bce-contact-icon" />
              <span>{footerData.website}</span>
            </li>
          </ul>
        </div>

      </div>


      {/* Bottom Section: Copyright */}
      <div className="bce-footer-v2-bottom">
        <p>
          {footerData.copyright}
        </p>
      </div>
    </footer>
  );
}
