import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  Compass, 
  Radio, 
  Layers, 
  Leaf, 
  Cpu, 
  Globe, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  Calendar,
  MapPin
} from 'lucide-react';

const MILESTONES = [
  {
    year: '2013',
    title: 'Qatar',
    desc: 'Company established with CAD drafting and technical resource services.',
    icon: <Building2 size={18} color="#087CFF" />,
    row: 'top'
  },
  {
    year: '2015',
    title: 'UAE & Sustainability',
    desc: 'Expanded into Dubai and introduced sustainability consultancy.',
    icon: <Leaf size={18} color="#087CFF" />,
    row: 'bottom'
  },
  {
    year: '2016',
    title: 'India',
    desc: 'Established India operations to strengthen engineering production capacity.',
    icon: <Layers size={18} color="#087CFF" />,
    row: 'top'
  },
  {
    year: '2017',
    title: 'BIM',
    desc: 'Expanded into Building Information Modeling and digital construction.',
    icon: <Compass size={18} color="#087CFF" />,
    row: 'bottom'
  },
  {
    year: '2018',
    title: 'Laser Scanning',
    desc: 'Introduced laser scanning, point-cloud processing and Scan-to-BIM.',
    icon: <Sparkles size={18} color="#087CFF" />,
    row: 'top'
  },
  {
    year: '2019',
    title: 'Digital Twin',
    desc: 'Entered Digital Twin and asset lifecycle management solutions.',
    icon: <Cpu size={18} color="#087CFF" />,
    row: 'bottom'
  },
  {
    year: '2024',
    title: 'Kuwait & Remote Construction',
    desc: 'Expanded into Kuwait and introduced remote construction technologies.',
    icon: <Radio size={18} color="#087CFF" />,
    row: 'top'
  },
  {
    year: '2026',
    title: 'Saudi Arabia',
    desc: 'Expanded operations into Saudi Arabia, strengthening GCC presence.',
    icon: <Globe size={18} color="#087CFF" />,
    row: 'bottom'
  }
];

const CAPABILITIES = [
  {
    title: 'CAD & Engineering Documentation',
    slug: 'cad-engineering-documentation',
    desc: 'Multidisciplinary 2D drafting, shop drawings and as-built documentation.',
    icon: <Building2 size={26} color="#087CFF" />
  },
  {
    title: 'BIM & Digital Construction',
    slug: 'bim-digital-construction',
    desc: 'End-to-end 3D/4D/5D BIM modeling, clash coordination and COBie data.',
    icon: <Compass size={26} color="#00B8FF" />
  },
  {
    title: 'Laser Scanning & Reality Capture',
    slug: 'laser-scanning-reality-capture',
    desc: '3D point cloud capture, Scan-to-BIM modeling and as-built verification.',
    icon: <Radio size={26} color="#10B981" />
  },
  {
    title: 'Digital Twin & Asset Lifecycle',
    slug: 'digital-twin-asset-lifecycle',
    desc: 'Connecting physical assets with live data for smarter lifecycle management.',
    icon: <Layers size={26} color="#6366F1" />
  },
  {
    title: 'Sustainability Consultancy',
    slug: 'sustainability-consultancy',
    desc: 'GSAS, LEED green building certifications and energy audit consultancy.',
    icon: <Leaf size={26} color="#059669" />
  },
  {
    title: 'Remote Construction Solutions',
    slug: 'remote-construction-solutions',
    desc: '360° site documentation, remote inspection and AR robotic integration.',
    icon: <Cpu size={26} color="#EC4899" />
  }
];

export default function OurJourneyPage({ onNavigate }) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    document.title = 'Our Journey | Blue Crescent Engineering';
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Trigger animations sequentially
    const timer = setTimeout(() => setAnimate(true), 100);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const isDesktop = windowWidth >= 1200;
  const isTablet = windowWidth >= 768 && windowWidth < 1200;

  return (
    <div className="journey-page-wrapper" style={{ background: '#FFFFFF', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* ── Breadcrumb & Sub-Header Navigation ───────────────────────── */}
      <div style={{ background: '#F8FAFC', borderBottom: '1px solid rgba(6, 59, 115, 0.08)', padding: '16px 0' }}>
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748B', fontWeight: '600' }}>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('Home'); }}
              style={{ color: '#087CFF', textDecoration: 'none' }}
            >
              Home
            </a>
            <ChevronRight size={14} color="#94A3B8" />
            <span style={{ color: '#063B73', fontWeight: '700' }}>Our Journey</span>
          </div>
        </div>
      </div>

      {/* ── Hero Section ───────────────────────────────────────────── */}
      <section 
        style={{
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #F8FAFC 100%)',
          padding: '70px 0 80px 0',
          position: 'relative',
          overflow: 'hidden',
          color: '#063B73',
          borderBottom: '1px solid rgba(6, 59, 115, 0.08)'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(8, 124, 255, 0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.8
          }}
        />

        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '800px' }}>
            <span 
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '14px',
                fontWeight: '800',
                letterSpacing: '2px',
                color: '#087CFF',
                textTransform: 'uppercase',
                background: 'rgba(8, 124, 255, 0.1)',
                padding: '6px 16px',
                borderRadius: '20px',
                display: 'inline-block',
                marginBottom: '16px'
              }}
            >
              OUR JOURNEY
            </span>

            <h1 
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '42px',
                fontWeight: '800',
                color: '#063B73',
                margin: '0 0 16px 0',
                lineHeight: 1.2
              }}
            >
              From Engineering Support to <br />
              <span style={{ color: '#087CFF' }}>Digital Transformation</span>
            </h1>

            <p style={{ fontSize: '17px', color: '#475569', lineHeight: 1.6, margin: 0, fontWeight: '500' }}>
              Our journey has continuously evolved with the engineering, construction and digital technology landscape.
            </p>
          </div>
        </div>
      </section>

      {/* ── Redesigned Wave Timeline Section ───────────────────────────── */}
      <section 
        style={{ 
          padding: '100px 0 120px 0', 
          background: '#F8FBFF', 
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle engineering waves in the background */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none', zIndex: 0 }}>
          <svg width="100%" height="100%" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100,200 C300,50 600,450 1000,100 C1200,-50 1400,150 1600,50" stroke="#087CFF" strokeWidth="4" />
            <path d="M-50,250 C350,100 650,500 1050,150 C1250,0 1450,200 1650,100" stroke="#19B5FE" strokeWidth="2" strokeDasharray="5,5" />
          </svg>
        </div>

        {/* Dotted grid decorative patterns in selected corners */}
        <div 
          style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            width: '100px',
            height: '100px',
            backgroundImage: 'radial-gradient(rgba(8, 124, 255, 0.15) 1.5px, transparent 1.5px)',
            backgroundSize: '12px 12px',
            opacity: 0.8,
            pointerEvents: 'none'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            width: '120px',
            height: '120px',
            backgroundImage: 'radial-gradient(rgba(8, 124, 255, 0.15) 1.5px, transparent 1.5px)',
            backgroundSize: '12px 12px',
            opacity: 0.8,
            pointerEvents: 'none'
          }}
        />

        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 
              style={{ 
                fontFamily: 'Space Grotesk, sans-serif', 
                fontSize: isDesktop ? '42px' : isTablet ? '36px' : '28px', 
                fontWeight: '800', 
                color: '#062F63', 
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: '0 0 10px 0',
                lineHeight: 1.2
              }}
            >
              Timeline &amp; Milestones
            </h2>
            <div style={{ width: '60px', height: '3.5px', background: '#087CFF', borderRadius: '4px', margin: '0 auto 12px auto' }}></div>
            <h3 
              style={{ 
                fontFamily: 'Space Grotesk, sans-serif', 
                fontSize: isTablet ? '24px' : '20px', 
                fontWeight: '700', 
                color: '#087CFF', 
                margin: '0 0 14px 0' 
              }}
            >
              Building Excellence Since 2013
            </h3>
            <p 
              style={{ 
                fontSize: '15px', 
                color: '#64748B', 
                lineHeight: 1.6, 
                margin: '0 auto', 
                maxWidth: '700px' 
              }}
            >
              Our journey of growth, innovation and expansion across key markets and technologies to deliver value to our clients.
            </p>
          </div>

          {/* DESKTOP TIMELINE: Flowing Blue Wave Timeline */}
          {isDesktop && (
            <div style={{ position: 'relative', margin: '40px 0', height: '560px' }}>
              
              {/* Central SVG Curved Wave Line */}
              <div 
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  zIndex: 2,
                  pointerEvents: 'none'
                }}
              >
                <svg width="100%" height="100%" viewBox="0 0 1350 560" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#087CFF" />
                      <stop offset="50%" stopColor="#19B5FE" />
                      <stop offset="100%" stopColor="#087CFF" />
                    </linearGradient>
                  </defs>
                  {/* Wave path corresponding to peak and valley coordinates (Dotted style) */}
                  <path 
                    d="M 0,280 C 42,280 42,160 84,160 C 126,160 210,400 252,400 C 294,400 378,160 420,160 C 462,160 546,400 588,400 C 630,400 714,160 756,160 C 798,160 882,400 924,400 C 966,400 1050,160 1092,160 C 1134,160 1218,400 1260,400 C 1302,400 1308,280 1350,280" 
                    stroke="url(#waveGrad)" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                    strokeDasharray="8,8"
                  />
                </svg>
              </div>

              {/* 8 Columns Grid */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(8, 1fr)',
                  gap: '16px',
                  position: 'relative',
                  height: '560px',
                  zIndex: 3
                }}
              >
                {MILESTONES.map((m, idx) => {
                  const isTop = m.row === 'top';
                  
                  return (
                    <div 
                      key={m.year} 
                      style={{ 
                        position: 'relative',
                        height: '560px',
                        opacity: animate ? 1 : 0,
                        transform: animate ? 'translateY(0)' : 'translateY(20px)',
                        transition: `opacity 0.6s ease ${idx * 0.15}s, transform 0.6s ease ${idx * 0.15}s`
                      }}
                    >
                      {/* Vertical Connector Line */}
                      {isTop ? (
                        <div 
                          style={{
                            position: 'absolute',
                            top: '160px',
                            height: '80px',
                            left: '50%',
                            width: '1px',
                            borderLeft: '2px dotted #087CFF',
                            transform: 'translateX(-50%)',
                            opacity: 0.6,
                            zIndex: 1
                          }}
                        />
                      ) : (
                        <div 
                          style={{
                            position: 'absolute',
                            top: '315px',
                            height: '85px',
                            left: '50%',
                            width: '1px',
                            borderLeft: '2px dotted #087CFF',
                            transform: 'translateX(-50%)',
                            opacity: 0.6,
                            zIndex: 1
                          }}
                        />
                      )}

                      {/* Milestone Card (Square Shape) */}
                      <div 
                        style={{
                          background: '#FFFFFF',
                          borderRadius: '14px',
                          padding: '28px 14px 16px 14px',
                          border: '1px solid #E2EAF3',
                          boxShadow: '0 10px 30px rgba(6, 59, 115, 0.08)',
                          position: 'absolute',
                          left: '50%',
                          transform: 'translate(-50%, 0)',
                          width: '210px',
                          height: '210px',
                          boxSizing: 'border-box',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          top: isTop ? '30px' : '315px',
                          transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                          zIndex: 3
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translate(-50%, -5px)';
                          e.currentTarget.style.boxShadow = '0 15px 35px rgba(8, 124, 255, 0.12)';
                          e.currentTarget.style.borderColor = '#087CFF';
                          const iconBadge = e.currentTarget.querySelector('.icon-badge-inner');
                          if (iconBadge) iconBadge.style.transform = 'translate(-50%, -2px) scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translate(-50%, 0)';
                          e.currentTarget.style.boxShadow = '0 10px 30px rgba(6, 59, 115, 0.08)';
                          e.currentTarget.style.borderColor = '#E2EAF3';
                          const iconBadge = e.currentTarget.querySelector('.icon-badge-inner');
                          if (iconBadge) iconBadge.style.transform = 'translate(-50%, 0) scale(1)';
                        }}
                      >
                        {/* Floating Overlapping Circular Icon */}
                        <div 
                          className="icon-badge-inner"
                          style={{ 
                            position: 'absolute', 
                            top: '-22px', 
                            left: '50%',
                            transform: 'translate(-50%, 0)',
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: '#EAF4FF',
                            border: '1.5px solid #BBD9F7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 10px rgba(8, 124, 255, 0.1)',
                            transition: 'transform 0.25s ease',
                            zIndex: 10
                          }}
                        >
                          {m.icon}
                        </div>

                        {/* Year */}
                        <div 
                          style={{
                            color: '#087CFF',
                            fontSize: '22px',
                            fontWeight: '800',
                            fontFamily: 'Space Grotesk, sans-serif',
                            marginBottom: '4px'
                          }}
                        >
                          {m.year}
                        </div>

                        {/* Title */}
                        <h4 
                          style={{ 
                            fontFamily: 'Space Grotesk, sans-serif',
                            fontSize: '14.5px', 
                            fontWeight: '700', 
                            color: '#062F63', 
                            margin: '0 0 4px 0', 
                            lineHeight: 1.3,
                            textAlign: 'center'
                          }}
                        >
                          {m.title}
                        </h4>

                        {/* Divider Line */}
                        <div 
                          style={{ 
                            width: '32px', 
                            height: '2.5px', 
                            background: '#087CFF', 
                            borderRadius: '2px',
                            marginBottom: '8px'
                          }} 
                        />

                        {/* Description */}
                        <p style={{ fontSize: '12px', color: '#334155', margin: 0, lineHeight: 1.45, textAlign: 'center' }}>
                          {m.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TABLET LAYOUT: 2 Columns Grid */}
          {isTablet && (
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '40px 24px',
                position: 'relative',
                zIndex: 2
              }}
            >
              {MILESTONES.map((m, idx) => (
                <div 
                  key={m.year}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '36px 24px 24px 24px',
                    border: '1px solid #E2EAF3',
                    boxShadow: '0 10px 30px rgba(6, 59, 115, 0.08)',
                    position: 'relative',
                    minHeight: '210px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateY(0)' : 'translateY(20px)',
                    transition: `opacity 0.5s ease ${idx * 0.1}s, transform 0.5s ease ${idx * 0.1}s`
                  }}
                >
                  {/* Floating Overlapping Circular Icon */}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '-22px', 
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: '#EAF4FF',
                      border: '1.5px solid #BBD9F7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(8, 124, 255, 0.1)'
                    }}
                  >
                    {m.icon}
                  </div>

                  <div style={{ color: '#087CFF', fontSize: '23px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '6px' }}>
                    {m.year}
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#062F63', margin: '0 0 6px 0', textAlign: 'center' }}>{m.title}</h4>
                  <div style={{ width: '32px', height: '2.5px', background: '#087CFF', borderRadius: '2px', marginBottom: '10px' }} />
                  <p style={{ fontSize: '13px', color: '#334155', margin: 0, lineHeight: 1.55, textAlign: 'center' }}>{m.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* MOBILE LAYOUT: Vertical Timeline */}
          {!isDesktop && !isTablet && (
            <div style={{ position: 'relative', paddingLeft: '32px', zIndex: 2 }}>
              {/* Vertical Blue Connecting Line */}
              <div 
                style={{
                  position: 'absolute',
                  top: '8px',
                  bottom: '8px',
                  left: '11px',
                  width: '3px',
                  background: 'linear-gradient(180deg, #087CFF 0%, #19B5FE 100%)',
                  borderRadius: '2px'
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                {MILESTONES.map((m, idx) => (
                  <div 
                    key={m.year} 
                    style={{ 
                      position: 'relative',
                      opacity: animate ? 1 : 0,
                      transform: animate ? 'translateX(0)' : 'translateX(-20px)',
                      transition: `opacity 0.5s ease ${idx * 0.1}s, transform 0.5s ease ${idx * 0.1}s`
                    }}
                  >
                    {/* Node Dot on Left */}
                    <div 
                      style={{
                        position: 'absolute',
                        left: '-28px',
                        top: '12px',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: '#FFFFFF',
                        border: '3.5px solid #087CFF',
                        boxShadow: '0 0 8px rgba(8, 124, 255, 0.4)',
                        zIndex: 4
                      }}
                    />

                    {/* Card Container aligned to Right */}
                    <div 
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '14px',
                        padding: '24px',
                        border: '1px solid #E2EAF3',
                        boxShadow: '0 10px 30px rgba(6, 59, 115, 0.08)',
                        width: 'calc(100% - 10px)',
                        maxWidth: '500px',
                        position: 'relative'
                      }}
                    >
                      {/* Floating circular icon top-right inside card */}
                      <div 
                        style={{ 
                          position: 'absolute', 
                          top: '20px', 
                          right: '20px',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: '#EAF4FF',
                          border: '1.5px solid #BBD9F7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {m.icon}
                      </div>

                      <div style={{ color: '#087CFF', fontSize: '22px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '4px' }}>
                        {m.year}
                      </div>
                      
                      <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#062F63', margin: '0 0 8px 0', textAlign: 'left' }}>
                        {m.title}
                      </h4>

                      <div style={{ width: '32px', height: '2.5px', background: '#087CFF', borderRadius: '2px', marginBottom: '12px' }} />
                      
                      <p style={{ fontSize: '13px', color: '#334155', margin: 0, lineHeight: 1.55, textAlign: 'left' }}>
                        {m.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ── WHERE WE ARE TODAY ───────────────────────────────────────── */}
      <section style={{ padding: '90px 0', background: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 56px auto' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px', color: '#087CFF', textTransform: 'uppercase' }}>
              WHERE WE ARE TODAY
            </span>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '36px', fontWeight: '800', color: '#063B73', margin: '10px 0 16px 0' }}>
              Engineering. Technology. Transformation.
            </h2>
            <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: 1.65, margin: 0 }}>
              Today, Blue Crescent Engineering combines engineering expertise with digital technologies to support clients across the complete lifecycle of buildings and infrastructure.
            </p>
          </div>

          {/* 6 Capability Cards */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}
          >
            {CAPABILITIES.map((cap) => (
              <div 
                key={cap.slug}
                style={{
                  background: '#F8FAFC',
                  borderRadius: '16px',
                  padding: '28px',
                  border: '1px solid rgba(6, 59, 115, 0.08)',
                  boxShadow: '0 4px 20px rgba(6, 59, 115, 0.03)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(8, 124, 255, 0.12)';
                  e.currentTarget.style.borderColor = '#087CFF';
                  e.currentTarget.style.background = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(6, 59, 115, 0.03)';
                  e.currentTarget.style.borderColor = 'rgba(6, 59, 115, 0.08)';
                  e.currentTarget.style.background = '#F8FAFC';
                }}
                onClick={() => {
                  if (onNavigate) onNavigate('Services', cap.slug);
                }}
              >
                <div>
                  <div style={{ marginBottom: '20px' }}>{cap.icon}</div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#063B73', margin: '0 0 10px 0', lineHeight: 1.35 }}>
                    {cap.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                    {cap.desc}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '800', color: '#087CFF' }}>
                  EXPLORE SERVICE <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Bottom CTA Section ────────────────────────────────────────── */}
      <section 
        style={{ 
          padding: '80px 0', 
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #F8FAFC 100%)', 
          color: '#063B73', 
          textAlign: 'center',
          borderTop: '1px solid rgba(6, 59, 115, 0.08)' 
        }}
      >
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '36px', fontWeight: '800', color: '#063B73', margin: '0 0 16px 0' }}>
            Ready to Build the Future?
          </h2>
          <p style={{ fontSize: '16.5px', color: '#475569', lineHeight: 1.6, margin: '0 0 36px 0', fontWeight: '500' }}>
            Explore our integrated engineering and digital transformation solutions.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => { if (onNavigate) onNavigate('Services'); }}
              style={{
                padding: '14px 32px',
                borderRadius: '12px',
                background: 'linear-gradient(90deg, #087CFF, #00B8FF)',
                color: '#FFFFFF',
                fontWeight: '800',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(8, 124, 255, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.25s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              EXPLORE OUR SERVICES <ArrowRight size={16} />
            </button>

            <button 
              onClick={() => { if (onNavigate) onNavigate('Contact Us'); }}
              style={{
                padding: '14px 32px',
                borderRadius: '12px',
                background: '#FFFFFF',
                border: '1px solid rgba(6, 59, 115, 0.2)',
                color: '#063B73',
                fontWeight: '800',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(6, 59, 115, 0.06)',
                transition: 'transform 0.25s ease, border-color 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = '#087CFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(6, 59, 115, 0.2)';
              }}
            >
              CONTACT US →
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
