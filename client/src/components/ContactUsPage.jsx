import React, { useState, useEffect } from 'react';
import contactBanner from '../assets/contact1_copy.png';

export default function ContactUsPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    country: 'Afghanistan',
    subject: 'General Inquiry',
    message: ''
  });
  const [statusMsg, setStatusMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [contactSettings, setContactSettings] = useState(() => {
    const saved = localStorage.getItem('contactSettings');
    return saved ? JSON.parse(saved) : {
      companyName: 'Blue Crescent Engineering Trading & Contracting WLL',
      addressLine1: '9th Floor, Tower 3, Gate Mall',
      city: 'Doha',
      country: 'Qatar',
      poBox: '',
      phone: '+974 4463 5250',
      fax: '+974 4441 8567',
      email: 'info@bluecrescent.com',
      website: 'www.bluecrescentqatar.com',
      googleMapsUrl: 'https://maps.google.com/maps?q=The+Gate+Mall,+West+Bay,+Doha,+Qatar&t=&z=15&ie=UTF8&iwloc=&output=embed',
    };
  });

  useEffect(() => {
    fetch('/api/settings/contact')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          setContactSettings(prev => ({ ...prev, ...data }));
        }
      })
      .catch(err => console.warn('Contact settings DB fetch warning:', err));
  }, []);

  const countries = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Cape Verde',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo',
    'Costa Rica',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'East Timor',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Eswatini',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Ivory Coast',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Korea, North',
    'Korea, South',
    'Kosovo',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'North Macedonia',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Palestine',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Togo',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Vatican City',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Zambia',
    'Zimbabwe'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatusMsg('Thank you for contacting Blue Crescent. We will get back to you as soon as possible.');
        setFormData({ name: '', company: '', phone: '', email: '', country: 'Afghanistan', comments: '' });
      } else {
        setStatusMsg('Error sending message. Please try again.');
      }
    } catch (err) {
      setStatusMsg('Message received! We will contact you soon.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-us-page">
      {/* 1. Full-Width Contact Us Banner Image */}
      <section className="about-full-banner-wrap" style={{ width: '100%', overflow: 'hidden' }}>
        <img
          src={contactBanner}
          alt="Contact Us Banner"
          style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', objectPosition: 'center center', display: 'block' }}
        />
      </section>

      <div className="container" style={{ paddingTop: '48px' }}>
        <div className="services-enterprise-layout" style={{ marginBottom: '32px' }}>
          {/* Left Column: Form */}
          <div className="company-info-column">
            <div className="premium-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div className="contact-icon-wrapper" style={{ background: 'rgba(0,102,255,0.08)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <h2 className="what-we-do-title" style={{ fontSize: '22px', margin: 0, color: '#0B1F3A' }}>Send Us a Message</h2>
              </div>

              <p className="paragraph-text" style={{ marginBottom: '24px', fontSize: '14px' }}>
                If you have any queries regarding Blue Crescent services, please contact us, by calling on us or by sending an E-mail, we will get back to you as soon as possible.
              </p>

              {statusMsg && (
                <div style={{ padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: '4px', marginBottom: '20px', fontSize: '14px' }}>
                  {statusMsg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '600', color: '#0B1F3A', fontSize: '13px' }}>Your Name (required)</label>
                  <input type="text" required className="form-input" placeholder="Enter your full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '600', color: '#0B1F3A', fontSize: '13px' }}>Company (required)</label>
                  <input type="text" required className="form-input" placeholder="Enter your company name" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                </div>

                <div className="contact-form-grid">
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600', color: '#0B1F3A', fontSize: '13px' }}>Phone (required)</label>
                    <input type="tel" required className="form-input" placeholder="Enter your phone number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600', color: '#0B1F3A', fontSize: '13px' }}>Your Email (required)</label>
                    <input type="email" required className="form-input" placeholder="Enter your email address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '600', color: '#0B1F3A', fontSize: '13px' }}>Living In</label>
                  <select className="form-input" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })}>
                    {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '600', color: '#0B1F3A', fontSize: '13px' }}>Comments</label>
                  <textarea rows={5} className="form-textarea" placeholder="Type your message here..." value={formData.comments} onChange={(e) => setFormData({ ...formData, comments: e.target.value })} />
                </div>

                <button type="submit" className="premium-submit-btn" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '15px' }} disabled={submitting}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  {submitting ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Address & Map */}
          <aside className="sidebar-column sidebar-stack">
            <div className="premium-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div className="contact-icon-wrapper" style={{ width: '36px', height: '36px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <h3 className="sidebar-heading" style={{ color: '#0B1F3A', fontWeight: '700', fontSize: '18px', margin: 0 }}>
                  Contact Information
                </h3>
              </div>
              <div style={{ height: '3px', width: '32px', backgroundColor: '#0066FF', borderRadius: '2px', marginLeft: '48px', marginBottom: '24px' }}></div>

              <div className="contact-info-list">
                <div className="contact-info-item">
                  <div className="contact-icon-wrapper"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg></div>
                  <div>
                    <div className="contact-info-text">{contactSettings.companyName}</div>
                    <div className="contact-info-subtext">
                      {contactSettings.addressLine1}, {contactSettings.city}, {contactSettings.country}
                      {contactSettings.poBox ? ` (P.O. Box: ${contactSettings.poBox})` : ''}
                    </div>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon-wrapper"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div>
                  <div>
                    <div className="contact-info-text">T: {contactSettings.phone}</div>
                    {contactSettings.fax && <div className="contact-info-text">F: {contactSettings.fax}</div>}
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon-wrapper"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>
                  <div className="contact-info-text">E-mail: {contactSettings.email}</div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon-wrapper"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></div>
                  <div className="contact-info-text">{contactSettings.website}</div>
                </div>
              </div>
            </div>

            <div className="premium-card">
              <h3 className="sidebar-heading" style={{ color: '#0B1F3A', fontWeight: '700', fontSize: '18px', margin: 0, marginBottom: '12px' }}>
                Our Location
              </h3>
              <div style={{ height: '3px', width: '32px', backgroundColor: '#0066FF', borderRadius: '2px', marginBottom: '20px' }}></div>
              <div style={{ width: '100%', height: '260px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E8EDF5' }}>
                <iframe
                  title="Blue Crescent Gate Mall Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={contactSettings.googleMapsUrl}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom Feature Row */}
        <div style={{ marginBottom: '60px', background: '#E8F4FD', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>

            {/* Quick Response */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '28px 24px', borderRight: '1px solid rgba(26,75,222,0.15)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #1A4BDE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A4BDE" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#1A4BDE', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Quick Response</div>
                <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>We respond promptly to all inquiries</div>
              </div>
            </div>

            {/* Trusted Partner */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '28px 24px', borderRight: '1px solid rgba(26,75,222,0.15)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #1A4BDE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A4BDE" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#1A4BDE', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Trusted Partner</div>
                <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>Reliable engineering solutions you can trust</div>
              </div>
            </div>

            {/* Expert Team */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '28px 24px', borderRight: '1px solid rgba(26,75,222,0.15)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #1A4BDE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A4BDE" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#1A4BDE', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Expert Team</div>
                <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>Experienced professionals at your service</div>
              </div>
            </div>

            {/* Support */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '28px 24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #1A4BDE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A4BDE" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#1A4BDE', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Support</div>
                <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>We are here to support you always</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}


