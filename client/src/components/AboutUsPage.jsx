import React, { useState, useEffect, useRef } from 'react';
import { getCachedCompanySettings, updateCachedCompanySettings } from '../utils/bannerCache';
import TestimonialsSection from './TestimonialsSection';
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
  ChevronLeft,
  Sparkles,
  Calendar,
  MapPin,
  Target,
  Rocket,
  Shield,
  Factory,
  Database,
  Plane,
  Users,
  Activity,
  Award,
  Folder,
  Settings,
  Monitor,
  Box,
  Tv,
  Cloud,
  TrendingUp,
  Share2,
  ClipboardCheck,
  Heart,
  Zap,
  RefreshCw,
  Wrench,
  Wind,
  Volume2,
  Droplet
} from 'lucide-react';
import aboutBanner from '../assets/about.png';
import aboutEngineeringImg from '../assets/why.png';
import credentialsCityscape from '../assets/credentials_cityscape_bg.png';
import projectStructureImg from '../assets/project1.png';
import aboutus5 from '../assets/aboutus5.png';
import aboutus6 from '../assets/aboutus6.png';
import bimmodelImg from '../assets/bimmodel.png';
import './AboutUsPage.css';

const getLucideIcon = (name, size = 22, color = '#0057B8') => {
  switch(name) {
    case 'Cloud': return <Cloud size={size} color={color} />;
    case 'Monitor': return <Monitor size={size} color={color} />;
    case 'Settings': return <Settings size={size} color={color} />;
    case 'TrendingUp': return <TrendingUp size={size} color={color} />;
    case 'Share2': return <Share2 size={size} color={color} />;
    case 'ClipboardCheck': return <ClipboardCheck size={size} color={color} />;
    case 'Heart': return <Heart size={size} color={color} />;
    case 'Zap': return <Zap size={size} color={color} />;
    case 'RefreshCw': return <RefreshCw size={size} color={color} />;
    case 'Building2': return <Building2 size={size} color={color} />;
    case 'Layers': return <Layers size={size} color={color} />;
    case 'Radio': return <Radio size={size} color={color} />;
    case 'Wrench': return <Wrench size={size} color={color} />;
    case 'Wind': return <Wind size={size} color={color} />;
    case 'Volume2': return <Volume2 size={size} color={color} />;
    case 'Droplet': return <Droplet size={size} color={color} />;
    case 'Activity': return <Activity size={size} color={color} />;
    case 'Leaf': return <Leaf size={size} color={color} />;
    case 'Users': return <Users size={size} color={color} />;
    case 'Cpu': return <Cpu size={size} color={color} />;
    default: return <Building2 size={size} color={color} />;
  }
};

const DEFAULT_COUNTRIES = [
  {
    id: 'qatar',
    name: 'QATAR',
    num: '01',
    status: 'Head Office | Since 2013',
    desc: 'The foundation of our business and principal GCC operation.',
    accentColor: '#0A1B3D', // Dark Navy
    pinColor: '#0A1B3D',
    mapX: '41.5%',
    mapY: '35%',
    isBuildingIcon: true,
    flag: (
      <svg viewBox="0 0 100 100" style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <rect width="100" height="100" fill="#8A1538" />
        <polygon points="0,0 35,0 45,6 35,12 45,18 35,24 45,30 35,36 45,42 35,48 45,54 35,60 45,66 35,72 45,78 35,84 45,90 35,96 45,100 0,100" fill="#FFFFFF" />
      </svg>
    )
  },
  {
    id: 'uae',
    name: 'UAE',
    num: '02',
    status: 'Market Presence | Since 2015',
    desc: 'Supporting engineering and digital construction requirements.',
    accentColor: '#00A8FF', // Bright Blue
    pinColor: '#00A8FF',
    mapX: '56%',
    mapY: '45%',
    isBuildingIcon: false,
    flag: (
      <svg viewBox="0 0 100 100" style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <rect width="30" height="100" fill="#FF0000" />
        <rect x="30" y="0" width="70" height="33.3" fill="#00732F" />
        <rect x="30" y="33.3" width="70" height="33.3" fill="#FFFFFF" />
        <rect x="30" y="66.6" width="70" height="33.4" fill="#000000" />
      </svg>
    )
  },
  {
    id: 'india',
    name: 'INDIA',
    num: '03',
    status: 'Delivery Office | Since 2016',
    desc: 'Technical delivery and engineering resource centre supporting GCC projects.',
    accentColor: '#F58E0B', // Orange
    pinColor: '#F58E0B',
    mapX: '81.5%',
    mapY: '66%',
    isBuildingIcon: true,
    flag: (
      <svg viewBox="0 0 100 100" style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <rect y="0" width="100" height="33.3" fill="#FF9933" />
        <rect y="33.3" width="100" height="33.3" fill="#FFFFFF" />
        <rect y="66.6" width="100" height="33.4" fill="#128807" />
        <circle cx="50" cy="50" r="8" stroke="#000080" strokeWidth="1.5" fill="none" />
        <circle cx="50" cy="50" r="2.5" fill="#000080" />
        <line x1="50" y1="42" x2="50" y2="58" stroke="#000080" strokeWidth="0.8" />
        <line x1="42" y1="50" x2="58" y2="50" stroke="#000080" strokeWidth="0.8" />
      </svg>
    )
  },
  {
    id: 'kuwait',
    name: 'KUWAIT',
    num: '04',
    status: 'Market Presence | Since 2024',
    desc: 'Supporting engineering digitalization and construction technology.',
    accentColor: '#0055FF', // Pure Bright Blue
    pinColor: '#0055FF',
    mapX: '26.5%',
    mapY: '22%',
    isBuildingIcon: false,
    flag: (
      <svg viewBox="0 0 100 100" style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <rect y="0" width="100" height="33.3" fill="#007A3D" />
        <rect y="33.3" width="100" height="33.3" fill="#FFFFFF" />
        <rect y="66.6" width="100" height="33.4" fill="#CE1126" />
        <polygon points="0,0 30,33.3 30,66.6 0,100" fill="#000000" />
      </svg>
    )
  },
  {
    id: 'saudi',
    name: 'SAUDI ARABIA',
    num: '05',
    status: 'Market Presence | Since 2026',
    desc: 'Expanding digital engineering capabilities across the Kingdom.',
    accentColor: '#10B981', // Green
    pinColor: '#10B981',
    mapX: '28%',
    mapY: '60%',
    isBuildingIcon: false,
    flag: (
      <svg viewBox="0 0 100 100" style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <rect width="100" height="100" fill="#006C35" />
        <line x1="25" y1="65" x2="75" y2="65" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <line x1="30" y1="60" x2="30" y2="70" stroke="#FFFFFF" strokeWidth="2.5" />
        <circle cx="30" cy="65" r="2.5" fill="#FFFFFF" />
        <rect x="35" y="32" width="30" height="5" fill="#FFFFFF" rx="1.5" />
        <rect x="42" y="42" width="16" height="5" fill="#FFFFFF" rx="1.5" />
      </svg>
    )
  }
];

export default function AboutUsPage({ onOpenModal, onNavigate }) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('');
  const [activeCardId, setActiveCardId] = useState(null);
  const [partnerIdx, setPartnerIdx] = useState(0);
  const [activeIndustryIdx, setActiveIndustryIdx] = useState(0);
  const [partners, setPartners] = useState([
    { id: 1, image: '/partner_teknik.png', name: 'TEKNIK Group', role: 'Engineering Partner' },
    { id: 2, image: '/partner_arcana.png', name: 'ARCANA Build', role: 'Construction Partner' },
    { id: 3, image: '/partner_nexagen.png', name: 'NEXAGEN Solutions', role: 'Sustainability Partner' },
    { id: 4, image: '/partner_qaframe.png', name: 'QAFrame Technologies', role: 'BIM Partner' },
    { id: 5, image: '/partner_meridian.png', name: 'MERIDIAN MEP', role: 'MEP Partner' },
    { id: 6, image: '/partner_vistara.png', name: 'VISTARA Infrastructure', role: 'Infrastructure Partner' },
  ]);
  const [newTestimonial, setNewTestimonial] = useState({
    title: '',
    body: '',
    author: '',
    company: ''
  });

  // Fetch approved testimonials from the API
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  useEffect(() => {
    const total = testimonialsList.length > 0 ? testimonialsList.length : 1;
    const interval = setInterval(() => {
      setActiveTestimonialIdx((prev) => (prev + 1) % total);
    }, 4500);
    return () => clearInterval(interval);
  }, [testimonialsList.length]);

  const [companySettings, setCompanySettings] = useState(() => {
    const DEFAULT_COMPANY = {
      whoWeArePara1: "Founded in Qatar in 2013, Blue Crescent Engineering has grown from a CAD technical-resource provider into a multidisciplinary engineering and digital transformation organization.",
      whoWeArePara2: "Our growth has been driven by one principle: continuously evolving our capabilities to meet the changing needs of the engineering, construction and asset-management industries.",
      whoWeArePara3: "From CAD and BIM to laser scanning, Digital Twin, sustainability and remote construction, we combine engineering knowledge with digital technologies to support projects throughout their lifecycle.",
      whoWeArePara4: "Today, our 150+ technical experts, representing multiple nationalities and engineering disciplines, provide scalable technical resources capable of supporting projects of varying size and complexity.",
      whoWeArePara5: "With our Head Office in Qatar, an engineering delivery office in India, and market presence across the GCC, we combine regional project understanding with strong technical production capacity.",
      value1Title: 'Integrity',
      value1Desc: 'We uphold strong ethical standards, building trust through transparent partnerships.',
      value2Title: 'Respect',
      value2Desc: 'We value every individual, partner and client relationship.',
      value3Title: 'Excellence',
      value3Desc: 'Striving for the highest international engineering standards.',
      value4Title: 'Teamwork',
      value4Desc: 'Together we achieve more through collaborative engineering.',
      value5Title: 'Innovation',
      value5Desc: 'Pioneering green technology and sustainable design.',
    };
    const cached = getCachedCompanySettings();
    return { ...DEFAULT_COMPANY, ...cached };
  });

  const [aboutUsVideoUrl, setAboutUsVideoUrl] = useState(() => {
    return localStorage.getItem('aboutUsVideoUrl') || '/aboutus.mp4';
  });

  const [aboutUsHeroType, setAboutUsHeroType] = useState(() => {
    return localStorage.getItem('aboutUsHeroType') || 'image';
  });

  const [aboutUsHeroUrl, setAboutUsHeroUrl] = useState(() => {
    return localStorage.getItem('aboutUsHeroUrl') || '';
  });

  // Ref and state for Section 3 Fan Deck Scroll Animation
  const interactiveSectionRef = useRef(null);
  const [isInteractiveAnimated, setIsInteractiveAnimated] = useState(false);

  const fetchTestimonials = () => {
    fetch('/api/testimonials')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) {
          setTestimonialsList(data.map(t => ({
            id: t.id,
            title: t.title,
            body: t.content,
            author: t.author_name,
            company: t.company_name
          })));
        }
      })
      .catch(err => console.warn('Testimonials fetch warning:', err));
  };

  useEffect(() => {
    fetchTestimonials();

    const handleSettingsUpdated = (e) => {
      if (e?.detail) {
        setCompanySettings(prev => ({ ...prev, ...e.detail }));
      } else {
        setCompanySettings(prev => ({ ...prev, ...getCachedCompanySettings() }));
      }
    };

    window.addEventListener('companySettingsUpdated', handleSettingsUpdated);

    fetch('/api/settings/company')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          updateCachedCompanySettings(data);
          setCompanySettings(prev => ({ ...prev, ...data }));
          if (data.aboutUsVideoUrl) setAboutUsVideoUrl(data.aboutUsVideoUrl);
          if (data.aboutUsHeroType) setAboutUsHeroType(data.aboutUsHeroType);
          if (data.aboutUsHeroUrl) setAboutUsHeroUrl(data.aboutUsHeroUrl);
        }
      })
      .catch(err => console.warn('Company settings DB fetch warning:', err));

    fetch('/api/partners')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) setPartners(data);
      })
      .catch(err => console.warn('Partners fetch warning:', err));

    return () => {
      window.removeEventListener('companySettingsUpdated', handleSettingsUpdated);
    };
  }, []);

  const countries = React.useMemo(() => {
    let base = DEFAULT_COUNTRIES;
    try {
      if (companySettings.aboutUsCountriesJson) {
        const parsed = JSON.parse(companySettings.aboutUsCountriesJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return base.map(c => {
            const match = parsed.find(p => p.id === c.id);
            return match ? { ...c, ...match } : c;
          });
        }
      }
    } catch (e) {
      console.warn('Countries parsing error', e);
    }
    return base;
  }, [companySettings.aboutUsCountriesJson]);

  const disciplines = React.useMemo(() => {
    const DEFAULT_DISCIPLINES = [
      { name: 'BIM Modeling & Coordination', image: '/uploads/bimmodel.png' },
      { name: 'CAD Documentation', image: '/our capacity/cad.png' },
      { name: 'Reality Capture & Laser Scanning', image: '/our capacity/reality.png' },
      { name: 'Specialized Engineering support', image: '/our capacity/special.png' },
      { name: 'Energy Auditing & Commissioning', image: '/our capacity/energy.png' },
      { name: 'Green Building Facilitation', image: '/our capacity/green.png' },
      { name: 'Technical experts outsourcing', image: '/our capacity/technical.png' }
    ];
    const EXCLUDED_DISCIPLINES = [
      'computational fluid dynamics',
      'acoustic & vibration',
      'hydraulic analysis',
      'stress analysis'
    ];
    try {
      if (companySettings.aboutUsDisciplinesJson) {
        const parsed = JSON.parse(companySettings.aboutUsDisciplinesJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
            .filter(item => !EXCLUDED_DISCIPLINES.some(ex => (item.name || '').toLowerCase().includes(ex)))
            .map((item, idx) => ({
              ...item,
              image: (item.name && item.name.toLowerCase().includes('bim')) ? '/uploads/bimmodel.png' : (item.image || DEFAULT_DISCIPLINES[idx]?.image || (item.name && item.name.toLowerCase().includes('cad') ? '/our capacity/cad.png' : null))
            }));
        }
      }
    } catch (e) {
      console.warn('Disciplines parsing error', e);
    }
    return DEFAULT_DISCIPLINES;
  }, [companySettings.aboutUsDisciplinesJson]);

  const flowchartSteps = React.useMemo(() => {
    try {
      if (companySettings.aboutUsFlowchartJson) {
        const parsed = JSON.parse(companySettings.aboutUsFlowchartJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Flowchart parsing error', e);
    }
    return [
      { num: '01', title: 'PHYSICAL ASSET', desc: 'The tangible operational environment.', icon: 'Building2' },
      { num: '02', title: 'BIM', desc: 'Structured spatial & technical information model.', icon: 'Layers' },
      { num: '03', title: 'DIGITAL TWIN', desc: 'Operational representation connecting physics with data.', icon: 'Cpu' },
      { num: '04', title: 'INTELLIGENT OPERATIONS', desc: 'Smarter lifecycle management and real-time visualization.', icon: 'Monitor' }
    ];
  }, [companySettings.aboutUsFlowchartJson]);

  const capabilities = React.useMemo(() => {
    try {
      if (companySettings.aboutUsCapabilitiesJson) {
        const parsed = JSON.parse(companySettings.aboutUsCapabilitiesJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Capabilities parsing error', e);
    }
    return [
      { title: 'Common Data Environment', desc: 'Unified and secure data across the asset lifecycle.', icon: 'Cloud' },
      { title: 'Real-Time Monitoring', desc: 'Live data insights for better situational awareness.', icon: 'Monitor' },
      { title: 'Predictive Maintenance', desc: 'AI-driven predictions to minimize downtime.', icon: 'Settings' },
      { title: 'Operational Optimization', desc: 'Optimize performance and reduce operational costs.', icon: 'TrendingUp' },
      { title: 'Scenario Simulation', desc: 'Simulate scenarios for smarter decision making.', icon: 'Share2' },
      { title: 'Automated Issue Management', desc: 'Detect, track and resolve issues efficiently.', icon: 'ClipboardCheck' },
      { title: 'Asset Health Analysis', desc: 'Continuous assessment of asset health and risk.', icon: 'Heart' },
      { title: 'Energy Optimization', desc: 'Improve energy efficiency and sustainability.', icon: 'Zap' },
      { title: 'Lifecycle Management', desc: 'Manage the asset lifecycle from design to decommission.', icon: 'RefreshCw' }
    ];
  }, [companySettings.aboutUsCapabilitiesJson]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInteractiveAnimated(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (interactiveSectionRef.current) {
      observer.observe(interactiveSectionRef.current);
    }

    return () => {
      if (interactiveSectionRef.current) {
        observer.unobserve(interactiveSectionRef.current);
      }
    };
  }, []);

  const handleCardClick = (id) => {
    setActiveCardId(activeCardId === id ? null : id);
  };

  return (
    <div className="about-us-page-wrapper" style={{ background: '#FFFFFF' }}>

      {/* ── SECTION 1: ABOUT US HERO ────────────────────────────────── */}
      <section className="about-hero-banner-wrap">
        <img
          src={companySettings?.aboutUsPageBannerUrl || companySettings?.aboutUsHeroUrl || aboutUsHeroUrl || localStorage.getItem('aboutUsPageBannerUrl') || localStorage.getItem('aboutUsHeroUrl') || aboutBanner}
          alt="About Us Banner - Blue Crescent Engineering"
          className="about-hero-banner-img"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = aboutBanner;
          }}
        />
      </section>

      <div className="bce-container">

        {/* ── SECTION 2: WHO WE ARE (REPLACED CONTENT) ───────────────── */}
        <section className="who-we-are-section" style={{ marginBottom: '90px' }}>
          <div className="who-we-are-grid">
            {/* Left: Text content */}
            <div className="who-we-are-content-box">
              <h2 className="bce-heading-primary" style={{ fontSize: '38px', color: '#063B73' }}>WHO WE ARE</h2>
              {/* Subtle Blue Accent Line */}
              <div style={{ width: '60px', height: '3.5px', background: '#0057B8', borderRadius: '4px', marginBottom: '24px' }}></div>

              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '24px', fontWeight: '700', color: '#0F2747', marginBottom: '20px', lineHeight: 1.35 }}>
                Engineering Experience. Digital Innovation.
              </h3>

              <p className="who-we-are-paragraph" style={{ color: '#475569', fontSize: '15.5px', lineHeight: 1.7, marginBottom: '16px' }}>
                {companySettings.whoWeArePara1 || "Founded in Qatar in 2013, Blue Crescent Engineering has grown from a CAD technical-resource provider into a multidisciplinary engineering and digital transformation organization."}
              </p>

              <p className="who-we-are-paragraph" style={{ color: '#475569', fontSize: '15.5px', lineHeight: 1.7, marginBottom: '16px' }}>
                {companySettings.whoWeArePara2 || "Our growth has been driven by one principle: continuously evolving our capabilities to meet the changing needs of the engineering, construction and asset-management industries."}
              </p>

              <p className="who-we-are-paragraph" style={{ color: '#475569', fontSize: '15.5px', lineHeight: 1.7, marginBottom: '16px' }}>
                {companySettings.whoWeArePara3 || "From CAD and BIM to laser scanning, Digital Twin, sustainability and remote construction, we combine engineering knowledge with digital technologies to support projects throughout their lifecycle."}
              </p>

              <p className="who-we-are-paragraph" style={{ color: '#475569', fontSize: '15.5px', lineHeight: 1.7, marginBottom: '16px' }}>
                {companySettings.whoWeArePara4 || "Today, our 150+ technical experts, representing multiple nationalities and engineering disciplines, provide scalable technical resources capable of supporting projects of varying size and complexity."}
              </p>

              <p className="who-we-are-paragraph" style={{ color: '#475569', fontSize: '15.5px', lineHeight: 1.7, marginBottom: '32px' }}>
                {companySettings.whoWeArePara5 || "With our Head Office in Qatar, an engineering delivery office in India, and market presence across the GCC, we combine regional project understanding with strong technical production capacity."}
              </p>

            </div>

            {/* Right: Video player or fallback image */}
            <div className="who-we-are-video-wrap">
              {aboutUsVideoUrl ? (
                <div className="who-we-are-video-portrait">
                  <video
                    key={aboutUsVideoUrl}
                    src={aboutUsVideoUrl}
                    className="who-we-are-video"
                    autoPlay
                    muted
                    defaultMuted
                    loop
                    playsInline
                    controls
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="who-we-are-video-portrait">
                  <img
                    src={aboutEngineeringImg}
                    alt="Who We Are Team - Blue Crescent"
                    className="who-we-are-video"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── SECTION: OUR JOURNEY (MILESTONE TIMELINE) ────────────────── */}
        <OurJourneySection windowWidth={windowWidth} />

        {/* ── SECTION 3: VISION & MISSION (REDESIGNED) ──────────────── */}
        <section
          style={{
            marginBottom: '90px',
            padding: windowWidth >= 768 ? '60px 40px' : '40px 20px',
            background: '#F8FBFF',
            borderRadius: '24px',
            border: '1px solid #D8E7F5',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle blue decorative dotted patterns in top corners */}
          <div style={{ position: 'absolute', top: '15px', left: '15px', opacity: 0.15, pointerEvents: 'none', zIndex: 1 }}>
            <svg width="120" height="120" fill="none">
              <pattern id="dotPatternVision" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2.5" cy="2.5" r="2.5" fill="#087CFF" />
              </pattern>
              <rect width="120" height="120" fill="url(#dotPatternVision)" />
            </svg>
          </div>
          <div style={{ position: 'absolute', top: '15px', right: '15px', opacity: 0.15, pointerEvents: 'none', zIndex: 1 }}>
            <svg width="120" height="120" fill="none">
              <rect width="120" height="120" fill="url(#dotPatternVision)" />
            </svg>
          </div>

          {/* Flowing background lines */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none', zIndex: 1 }}>
            <svg width="100%" height="100%" viewBox="0 0 1200 600" fill="none" preserveAspectRatio="none">
              <path d="M-50,380 C150,180 350,550 750,220 C950,120 1150,420 1250,320" stroke="#087CFF" strokeWidth="2" />
              <path d="M-50,430 C150,230 350,600 750,270 C950,170 1150,470 1250,370" stroke="#087CFF" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '56px', position: 'relative', zIndex: 3 }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '38px', fontWeight: '800', color: '#063B73', margin: '8px 0 0 0' }}>
              Vision & Mission
            </h2>
            <div style={{ width: '50px', height: '3.5px', background: '#087CFF', borderRadius: '4px', margin: '14px auto' }}></div>
            <p style={{ fontSize: '16.5px', color: '#475569', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
              Guided by a clear purpose, we are committed to engineering a smarter, digital and sustainable future for our clients and communities.
            </p>
          </div>

          {/* Main Card Layout */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: windowWidth >= 992 ? '1fr 1fr' : '1fr',
              gap: '32px',
              position: 'relative',
              zIndex: 3,
              marginBottom: '56px'
            }}
          >
            {/* CARD 1: VISION */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #D8E7F5',
                borderRadius: '22px',
                padding: windowWidth >= 768 ? '40px 40px 0 40px' : '30px 24px 0 24px',
                boxShadow: '0 8px 32px rgba(6, 59, 115, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                minHeight: windowWidth >= 768 ? '440px' : 'auto'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(6, 59, 115, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(6, 59, 115, 0.04)';
              }}
            >
              {/* Card text content */}
              <div style={{ maxWidth: windowWidth >= 768 ? '58%' : '100%', zIndex: 3, position: 'relative', paddingBottom: windowWidth >= 768 ? '40px' : '0' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '2px', color: '#087CFF', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  VISION
                </span>
                <div style={{ width: '28px', height: '2px', background: '#087CFF', marginBottom: '14px' }}></div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '26px', fontWeight: '700', color: '#0F2747', margin: '0 0 12px 0', lineHeight: 1.3 }}>
                  Engineering a Smarter, Digital and Sustainable Future
                </h3>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  To become a trusted regional leader in engineering digital transformation, connecting design, construction and asset operations through intelligent, integrated and sustainable technologies.
                </p>
              </div>

              {/* Blended Skyline Visual */}
              <div style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                opacity: 0.95,
                zIndex: 1,
                pointerEvents: 'none'
              }}>
                <img
                  src={aboutus5}
                  alt="Modern sustainable architecture"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'right bottom'
                  }}
                />
              </div>

              {/* Bottom accent line */}
              <div style={{ height: '4px', width: '100%', background: '#087CFF', position: 'absolute', bottom: 0, left: 0, zIndex: 3 }} />
            </div>

            {/* CARD 2: MISSION */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #D8E7F5',
                borderRadius: '22px',
                padding: windowWidth >= 768 ? '40px 40px 0 40px' : '30px 24px 0 24px',
                boxShadow: '0 8px 32px rgba(6, 59, 115, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                minHeight: windowWidth >= 768 ? '440px' : 'auto'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(6, 59, 115, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(6, 59, 115, 0.04)';
              }}
            >
              {/* Card text content */}
              <div style={{ maxWidth: windowWidth >= 768 ? '58%' : '100%', zIndex: 3, position: 'relative', paddingBottom: windowWidth >= 768 ? '40px' : '0' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '2px', color: '#00A896', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  MISSION
                </span>
                <div style={{ width: '28px', height: '2px', background: '#00A896', marginBottom: '14px' }}></div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '26px', fontWeight: '700', color: '#0F2747', margin: '0 0 12px 0', lineHeight: 1.3 }}>
                  Transforming Engineering Through Technology
                </h3>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  To deliver reliable, scalable and innovative engineering solutions by combining technical expertise, digital technologies and multidisciplinary resources, helping our clients improve project delivery, operational efficiency and long-term asset performance.
                </p>
              </div>

              {/* Blended Construction Site Visual */}
              <div style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                opacity: 0.95,
                zIndex: 1,
                pointerEvents: 'none'
              }}>
                <img
                  src={aboutus6}
                  alt="Modern construction project structure"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'right bottom'
                  }}
                />
              </div>

              {/* Bottom accent line */}
              <div style={{ height: '4px', width: '100%', background: '#00A896', position: 'absolute', bottom: 0, left: 0, zIndex: 3 }} />
            </div>
          </div>

        </section>

        {/* ── SECTION 4: OUR CORE VALUES (5-CARD FAN DECK ANIMATION) ──── */}
        <section className="core-values-interactive-section" ref={interactiveSectionRef}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
            <h2 className="bce-heading-primary" style={{ fontSize: '38px', color: '#063B73' }}>OUR CORE VALUES</h2>
            <div className="bce-underline-gradient" style={{ margin: '0 auto 16px auto' }}></div>
            <p className="bce-section-subtitle" style={{ fontSize: '16.5px', color: '#475569', fontWeight: '500' }}>
              Engineering Excellence Built on Strong Principles
            </p>
          </div>

          <div className={`cards-fan-wrapper ${isInteractiveAnimated ? 'animated' : ''}`}>
            <svg className="connecting-lines-svg" viewBox="0 0 1100 720" fill="none">
              <path d="M 550 380 Q 400 300 250 230" className="connecting-line-path" />
              <path d="M 550 380 Q 700 300 850 230" className="connecting-line-path" />
              <path d="M 550 380 Q 420 460 290 540" className="connecting-line-path" />
              <path d="M 550 380 Q 680 460 810 540" className="connecting-line-path" />
            </svg>

            {/* CARD 1: Teamwork */}
            <div
              className={`fan-card card-1 ${activeCardId === 1 ? 'active-expanded' : ''}`}
              onClick={() => handleCardClick(1)}
            >
              <div>
                <div className="fan-card-icon">
                  <Users size={26} color="#FFFFFF" />
                </div>
                <h3 className="fan-card-title">{companySettings.value4Title || 'Teamwork'}</h3>
                <p className="fan-card-desc">{companySettings.value4Desc || 'Together we achieve more through collaborative engineering.'}</p>
              </div>
              <div className="fan-card-footer-tag">
                <span>01 ✦ Collaborative</span>
              </div>
            </div>

            {/* CARD 2: Respect */}
            <div
              className={`fan-card card-2 ${activeCardId === 2 ? 'active-expanded' : ''}`}
              onClick={() => handleCardClick(2)}
            >
              <div>
                <div className="fan-card-icon">
                  <Compass size={26} color="#FFFFFF" />
                </div>
                <h3 className="fan-card-title">{companySettings.value2Title || 'Respect'}</h3>
                <p className="fan-card-desc">{companySettings.value2Desc || 'We value every individual, partner and client relationship.'}</p>
              </div>
              <div className="fan-card-footer-tag">
                <span>02 ✦ Relationships</span>
              </div>
            </div>

            {/* CARD 3: Integrity */}
            <div
              className={`fan-card card-3 ${activeCardId === 3 ? 'active-expanded' : ''}`}
              onClick={() => handleCardClick(3)}
            >
              <div>
                <div className="fan-card-icon">
                  <Shield size={26} color="#FFFFFF" />
                </div>
                <h3 className="fan-card-title">{companySettings.value1Title || 'Integrity'}</h3>
                <p className="fan-card-desc">{companySettings.value1Desc || 'We uphold strong ethical standards, building trust through transparent partnerships.'}</p>
              </div>
              <div className="fan-card-footer-tag">
                <span>03 ✦ Transparency</span>
              </div>
            </div>

            {/* CARD 4: Excellence */}
            <div
              className={`fan-card card-4 ${activeCardId === 4 ? 'active-expanded' : ''}`}
              onClick={() => handleCardClick(4)}
            >
              <div>
                <div className="fan-card-icon">
                  <Award size={26} color="#FFFFFF" />
                </div>
                <h3 className="fan-card-title">{companySettings.value3Title || 'Excellence'}</h3>
                <p className="fan-card-desc">{companySettings.value3Desc || 'Striving for the highest international engineering standards.'}</p>
              </div>
              <div className="fan-card-footer-tag">
                <span>04 ✦ Standards</span>
              </div>
            </div>

            {/* CARD 5: Innovation */}
            <div
              className={`fan-card card-5 ${activeCardId === 5 ? 'active-expanded' : ''}`}
              onClick={() => handleCardClick(5)}
            >
              <div>
                <div className="fan-card-icon" style={{ background: 'linear-gradient(135deg, #0088B3, #00B8FF)' }}>
                  <Sparkles size={26} color="#FFFFFF" />
                </div>
                <h3 className="fan-card-title">{companySettings.value5Title || 'Innovation'}</h3>
                <p className="fan-card-desc">{companySettings.value5Desc || 'Pioneering green technology and sustainable design.'}</p>
              </div>
              <div className="fan-card-footer-tag">
                <span>05 ✦ Sustainable</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: OUR CORE STRENGTHS – CAROUSEL ────────────────── */}
        <CoreStrengthsCarousel windowWidth={windowWidth} />

        {/* ── SECTION: OUR TEAM (LEADERSHIP & TECHNICAL SPECIALISTS) ─────── */}
        <OurTeamSection windowWidth={windowWidth} />

        {/* ── SECTION 6: OUR APPROACH (NEW SECTION) ──────────────────── */}
        <section style={{ marginBottom: '90px' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '32px', fontWeight: '800', color: '#063B73', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
              OUR APPROACH
            </h2>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '24px', fontWeight: '600', color: '#0057B8', margin: '0 0 14px 0', lineHeight: 1.4 }}>
              Digital. Smart. Sustainable.
            </p>
            <div style={{ width: '60px', height: '3.5px', background: '#0057B8', borderRadius: '4px', margin: '0 auto 16px auto' }} />
            <p style={{ fontSize: '16px', color: '#475569', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
              Our approach connects engineering information, people, processes and technologies throughout the asset lifecycle.
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: windowWidth >= 1024 ? 'row' : 'column',
            alignItems: 'center',
            gap: windowWidth >= 1024 ? '50px' : '70px',
            justifyContent: 'center',
            padding: '30px 0'
          }}>
            {/* Card 1 */}
            <ApproachDiamondCard
              num="01"
              title="DIGITAL"
              desc="Transform physical and engineering information into structured digital assets."
              icon={<Cpu size={22} color="#0057B8" />}
              windowWidth={windowWidth}
            />

            {windowWidth >= 1024 && <span style={{ color: '#08A8F0', fontSize: '24px', fontWeight: '800', margin: '0 10px' }}>→</span>}

            {/* Card 2 */}
            <ApproachDiamondCard
              num="02"
              title="SMART"
              desc="Connect data, systems and technologies to improve collaboration, automation and decision-making."
              icon={<Compass size={22} color="#0057B8" />}
              windowWidth={windowWidth}
            />

            {windowWidth >= 1024 && <span style={{ color: '#08A8F0', fontSize: '24px', fontWeight: '800', margin: '0 10px' }}>→</span>}

            {/* Card 3 */}
            <ApproachDiamondCard
              num="03"
              title="SUSTAINABLE"
              desc="Support efficient design, construction and operation while improving long-term environmental and asset performance."
              icon={<Leaf size={22} color="#0057B8" />}
              windowWidth={windowWidth}
            />
          </div>
        </section>

      </div> {/* Close bce-container for full width section */}

      {/* ── SECTION 7: INDUSTRIES WE SERVE (NEW SECTION - FULL WIDTH) ───────────── */}
      <section
        style={{
          marginBottom: '90px',
          background: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.94) 0%, rgba(255, 255, 255, 0.8) 55%, rgba(255, 255, 255, 0.25) 100%), url(${aboutus5})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          padding: '80px 0',
          width: '100%',
          borderTop: '1.5px solid #E2EAF3',
          borderBottom: '1.5px solid #E2EAF3',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '32px', fontWeight: '800', color: '#063B73', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
              Industries We Serve
            </h2>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '24px', fontWeight: '600', color: '#0057B8', margin: '0 0 14px 0', lineHeight: 1.4 }}>
              Experience Across Complex Project Environments
            </p>
            <div style={{ width: '60px', height: '3.5px', background: '#0057B8', borderRadius: '4px', margin: '0 auto 16px auto' }} />
            <p style={{ fontSize: '16px', color: '#475569', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
              Our multidisciplinary capabilities allow us to support a wide range of sectors.
            </p>
          </div>

          <IndustriesArc
            windowWidth={windowWidth}
            activeIdx={activeIndustryIdx}
            setActiveIdx={setActiveIndustryIdx}
          />
        </div>
      </section>

      <div className="bce-container"> {/* Reopen bce-container */}

        {/* ── SECTION 8: OUR GEOGRAPHICAL PRESENCE (NEW SECTION) ───────── */}
        <section style={{ marginBottom: '90px', padding: '20px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '32px', fontWeight: '800', color: '#063B73', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
              Our Geographical Presence
            </h2>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '24px', fontWeight: '600', color: '#0057B8', margin: '0 0 14px 0', lineHeight: 1.4 }}>
              GCC Expertise. Global Delivery Capability.
            </p>
            <div style={{ width: '60px', height: '3.5px', background: '#0057B8', borderRadius: '4px', margin: '0 auto 16px auto' }} />
          </div>
          <GeographicalPresence windowWidth={windowWidth} mapImg={companySettings.aboutUsMapImg || '/map1.png'} countries={countries} />
        </section>

        {/* ── SECTION 9: OUR CAPACITY (NEW SECTION) ──────────────────── */}
        <section style={{ marginBottom: '90px' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '32px', fontWeight: '800', color: '#063B73', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
              Our Capacity
            </h2>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '24px', fontWeight: '600', color: '#0057B8', margin: '0 0 14px 0', lineHeight: 1.4 }}>
              150+ Experts. One Integrated Team.
            </p>
            <div style={{ width: '60px', height: '3.5px', background: '#0057B8', borderRadius: '4px', margin: '0 auto 16px auto' }} />
            <p style={{ fontSize: '16px', color: '#475569', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
              Our strength is not limited to software capability. It comes from the combination of people, engineering knowledge, technology and scalable delivery resources.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: windowWidth >= 1024 ? '340px 1fr' : '1fr', gap: '40px', alignItems: 'stretch' }}>
            {/* Left: Large 150+ statistic with Capa Background */}
            <div
              style={{
                background: `#0057B8 url(${companySettings.aboutUsCapaImg || '/capa.png'}) no-repeat center center / cover`,
                borderRadius: '24px',
                padding: '60px 40px',
                textAlign: 'center',
                color: '#FFFFFF',
                boxShadow: '0 12px 40px rgba(0, 87, 184, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '360px'
              }}
            >
              <div style={{ fontSize: '84px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '8px', lineHeight: 1, zIndex: 2 }}>
                150+
              </div>
              <div style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '3px', color: '#FFFFFF', opacity: 0.95, textTransform: 'uppercase', zIndex: 2 }}>
                TECHNICAL EXPERTS
              </div>
            </div>

            {/* Right: Capability description & interactive tag cards */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {/* Title Area */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '32px', fontWeight: '800', color: '#0F2747', margin: '0', lineHeight: 1.25 }}>
                  Multidisciplinary Capability
                </h3>
              </div>

              {/* Grid of Icon Cards - 2 Rows Layout with Larger Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: windowWidth >= 1200 ? 'repeat(4, 1fr)' : windowWidth >= 768 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                gap: '18px',
                width: '100%'
              }}>
                {disciplines.map(item => (
                  <div
                    key={item.name}
                    style={{
                      background: '#FFFFFF',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '18px',
                      padding: '22px 12px',
                      width: '100%',
                      height: '195px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 6px 16px rgba(6, 59, 115, 0.05)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxSizing: 'border-box'
                    }}
                    className="strength-card-hover"
                  >
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: '#F2F7FD',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0, 87, 184, 0.08)'
                    }}>
                      {(() => {
                        const nameLower = (item.name || '').toLowerCase();
                        const imagePath = nameLower.includes('bim') ? (item.image || '/uploads/bimmodel.png' || bimmodelImg) : (
                          item.image || (
                            nameLower.includes('cad') ? '/our capacity/cad.png' :
                            nameLower.includes('reality') ? '/our capacity/reality.png' :
                            nameLower.includes('special') ? '/our capacity/special.png' :
                            nameLower.includes('cfd') ? '/our capacity/cfd.png' :
                            nameLower.includes('vibration') ? '/our capacity/vibration.png' :
                            nameLower.includes('hydraul') ? '/our capacity/hydralic.png' :
                            nameLower.includes('stress') ? '/our capacity/stress.png' :
                            nameLower.includes('energy') ? '/our capacity/energy.png' :
                            nameLower.includes('green') ? '/our capacity/green.png' :
                            nameLower.includes('outsourcing') ? '/our capacity/technical.png' : null
                          )
                        );
                        return imagePath ? (
                          <img
                            src={imagePath}
                            alt={item.name}
                            style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                          />
                        ) : (
                          getLucideIcon(item.icon, 30, '#0057B8')
                        );
                      })()}
                    </div>
                    <div style={{ width: '28px', height: '3px', background: 'linear-gradient(90deg, #0057B8, #00A896)', margin: '6px 0', borderRadius: '2px' }} />
                    <span style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '13.5px',
                      fontWeight: '800',
                      color: '#0F2747',
                      textAlign: 'center',
                      lineHeight: 1.3,
                      display: 'block'
                    }}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div> {/* Close bce-container for full bleed Section 10 */}

      {/* ── SECTION 10: DIGITAL TWIN (NEW SECTION) ────────────────── */}
      <section style={{
        background: `linear-gradient(180deg, rgba(244, 248, 255, 0.92) 0%, rgba(240, 246, 255, 0.95) 100%), url(${companySettings.aboutUsDigitalImg || '/digital.png'}) no-repeat center center / cover`,
        padding: '80px 0',
        marginBottom: '90px',
        borderTop: '1px solid #E2EAF3',
        borderBottom: '1px solid #E2EAF3',
        boxShadow: '0 10px 30px rgba(0, 87, 184, 0.02)'
      }}>
        <div className="bce-container"> {/* Inner container to keep content centered */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '32px', fontWeight: '800', color: '#063B73', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
              Digital Twin
            </h2>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '24px', fontWeight: '600', color: '#0057B8', margin: '0 0 14px 0', lineHeight: 1.4 }}>
              From BIM Model to Intelligent Asset
            </p>
            <div style={{ width: '60px', height: '3.5px', background: '#0057B8', borderRadius: '4px', margin: '0 auto 16px auto' }} />
            <p style={{ fontSize: '16px', color: '#475569', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
              We transform engineering information into connected Digital Twin environments that support the entire operational lifecycle of an asset.
            </p>
          </div>

          {/* Visual Lifecycle Flow chart */}
          <div
            style={{
              display: 'flex',
              flexDirection: windowWidth >= 1024 ? 'row' : 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: companySettings.aboutUsFlowchartBg || '#F1F7FF',
              border: '1.5px solid #E2EAF3',
              borderRadius: '24px',
              padding: '48px 30px',
              marginBottom: '56px',
              boxShadow: '0 12px 40px rgba(6, 59, 115, 0.04)',
              gap: '20px'
            }}
          >
            {flowchartSteps.map((step, sIdx) => (
              <React.Fragment key={step.title}>
                <div style={{ flex: 1, textAlign: 'center', padding: '10px' }}>
                  {/* Badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: '#E2F0FF',
                    border: '1.5px solid #0057B8',
                    color: '#0057B8',
                    fontSize: '11px',
                    fontWeight: '800',
                    fontFamily: 'Space Grotesk, sans-serif',
                    marginBottom: '12px',
                    boxShadow: '0 2px 6px rgba(0, 87, 184, 0.08)'
                  }}>
                    {step.num}
                  </div>
                  {/* Circle Icon */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: '1.5px solid #E2EAF3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto',
                    boxShadow: '0 4px 10px rgba(0, 87, 184, 0.05)'
                  }}>
                    {getLucideIcon(step.icon, 24, '#0057B8')}
                  </div>
                  <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13.5px', fontWeight: '800', color: '#063B73', margin: '0 0 6px 0', letterSpacing: '0.5px' }}>{step.title}</h4>
                  <p style={{ fontSize: '11.5px', color: '#64748B', lineHeight: 1.4, margin: '0 auto', maxWidth: '180px', fontWeight: '500' }}>{step.desc}</p>
                </div>
                {sIdx < 3 && windowWidth >= 1024 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 0.4, position: 'relative', minWidth: '80px', margin: '0 10px' }}>
                    {/* Dotted connecting line */}
                              <div style={{
                      background: '#FFFFFF',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      border: '1.5px solid #B9D5F4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                      boxShadow: '0 2px 6px rgba(0, 87, 184, 0.06)'
                    }}>
                      <ArrowRight size={14} color="#0057B8" strokeWidth={2.5} />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Capability chips / cards below: Dynamic Grid */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
            {capabilities.map(cap => (
              <div
                key={cap.title}
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #F0F4FA',
                  borderRadius: '16px',
                  padding: '24px 20px',
                  boxShadow: '0 4px 12px rgba(6, 59, 115, 0.03)',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  width: windowWidth >= 1200 ? '220px' : windowWidth >= 768 ? '340px' : '100%',
                  minHeight: '140px',
                  boxSizing: 'border-box'
                }}
                className="strength-card-hover"
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#F2F7FD',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getLucideIcon(cap.icon, 22, '#0057B8')}
                </div>
                <div>
                  <h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14.5px', fontWeight: '800', color: '#0F2747', margin: '0 0 6px 0', lineHeight: 1.2 }}>
                    {cap.title}
                  </h5>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0, lineHeight: 1.4, fontWeight: '500' }}>
                    {cap.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div> {/* Close inner bce-container */}
      </section>

      <div className="bce-container"> {/* Reopen bce-container for subsequent sections */}

        {/* ── SECTION 11: OUR WORKING PARTNERS ───────────────────────── */}
        {(() => {
          const visible = Math.min(4, partners.length);
          const max = Math.max(0, partners.length - visible);
          const prev = () => setPartnerIdx(i => Math.max(0, i - 1));
          const next = () => setPartnerIdx(i => Math.min(max, i + 1));
          return (
            <section className="working-partners-section">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '32px', fontWeight: '800', color: '#063B73', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
                  OUR WORKING PARTNERS
                </h2>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '24px', fontWeight: '600', color: '#0057B8', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                  Trusted collaborations that drive excellence across every project we deliver.
                </p>
                <div style={{ width: '60px', height: '3.5px', background: '#0057B8', borderRadius: '4px', margin: '0 auto 16px auto' }} />
              </div>

              {partners.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>No partners added yet.</p>
              ) : (
                <>
                  <div className="partners-carousel-wrap">
                    <button className="partner-arrow partner-arrow-left" onClick={prev} disabled={partnerIdx === 0} aria-label="Previous">&#8249;</button>
                    <div className="partners-track-outer">
                      <div className="partners-track" style={{ transform: `translateX(calc(-${partnerIdx} * (100% / ${visible})))` }}>
                        {partners.map((p) => (
                          <div key={p.id} className="partner-card">
                            <div className="partner-img-wrap">
                              <img src={p.image} alt={p.name} className="partner-img" />
                            </div>
                            <div className="partner-card-body">
                              <p className="partner-name">{p.name}</p>
                              <p className="partner-role">{p.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button className="partner-arrow partner-arrow-right" onClick={next} disabled={partnerIdx >= max} aria-label="Next">&#8250;</button>
                  </div>
                  {max > 0 && (
                    <div className="partners-dots">
                      {Array.from({ length: max + 1 }).map((_, i) => (
                        <button key={i} className={`partner-dot ${i === partnerIdx ? 'active' : ''}`} onClick={() => setPartnerIdx(i)} aria-label={`Slide ${i + 1}`} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          );
        })()}

        {/* ── SECTION 13: TESTIMONIALS (SAME HOME PAGE DESIGN) ───────── */}
        <TestimonialsSection />

        {/* ── SECTION 14: FOOTER SPACING ─────────────────────────────── */}
        <div className="about-footer-spacer"></div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CORE STRENGTHS CAROUSEL — self-contained sub-component
───────────────────────────────────────────────────────────── */
const STRENGTHS = [
  {
    icon: <Calendar size={28} color="#0057B8" />,
    iconBg: 'rgba(0,87,184,0.10)',
    heading: '13+ Years',
    subtitle: 'Industry Experience',
    subtitleColor: '#0057B8',
    desc: 'Established in Qatar in 2013 with continuous expansion of capabilities and markets.',
  },
  {
    icon: <Users size={28} color="#0057B8" />,
    iconBg: 'rgba(0,87,184,0.10)',
    heading: '150+ Experts',
    subtitle: 'Technical Professionals',
    subtitleColor: '#0057B8',
    desc: 'A scalable multidisciplinary engineering team supporting projects of varying size and complexity.',
  },
  {
    icon: <Globe size={28} color="#0288D1" />,
    iconBg: 'rgba(2,136,209,0.10)',
    heading: 'Multi-National',
    subtitle: 'Engineering Workforce',
    subtitleColor: '#0288D1',
    desc: 'A diverse professional team providing engineering knowledge, flexibility and international project exposure.',
  },
  {
    icon: <Layers size={28} color="#0057B8" />,
    iconBg: 'rgba(0,87,184,0.10)',
    heading: 'End-to-End',
    subtitle: 'Digital Engineering Capability',
    subtitleColor: '#0057B8',
    desc: 'CAD → BIM → Laser Scanning → Digital Twin → Remote Construction → Asset Lifecycle.',
  },
  {
    icon: <MapPin size={28} color="#0288D1" />,
    iconBg: 'rgba(2,136,209,0.10)',
    heading: 'GCC',
    subtitle: 'Regional Experience',
    subtitleColor: '#0288D1',
    desc: 'Engineering and digital delivery experience across key GCC markets.',
  },
  {
    icon: <Cpu size={28} color="#0057B8" />,
    iconBg: 'rgba(0,87,184,0.10)',
    heading: 'Engineering + Technology',
    subtitle: 'Integrated Expertise',
    subtitleColor: '#0057B8',
    desc: 'Combining engineering knowledge with advanced digital technologies.',
  },
  {
    icon: <Activity size={28} color="#0288D1" />,
    iconBg: 'rgba(2,136,209,0.10)',
    heading: 'Scalable',
    subtitle: 'Delivery Model',
    subtitleColor: '#0288D1',
    desc: 'Flexible technical resources that can be mobilized according to project requirements.',
  },
];

function CoreStrengthsCarousel({ windowWidth }) {
  const getVisible = (w) => {
    if (w >= 1024) return 4;
    if (w >= 640) return 2;
    return 1;
  };

  const visibleCount = getVisible(windowWidth);
  const total = STRENGTHS.length;
  const maxIndex = total - visibleCount;

  const [index, setIndex] = React.useState(0);
  const [transitioning, setTransitioning] = React.useState(true);
  const [hovering, setHovering] = React.useState(false);
  const [dragStart, setDragStart] = React.useState(null);
  const [prevHovered, setPrevHovered] = React.useState(false);
  const [nextHovered, setNextHovered] = React.useState(false);
  const autoRef = React.useRef(null);
  const trackRef = React.useRef(null);

  /* ── helpers ── */
  const clampedIndex = (i) => Math.max(0, Math.min(i, maxIndex));

  const goTo = React.useCallback((i) => {
    setTransitioning(true);
    setIndex(clampedIndex(i));
  }, [maxIndex]);

  const prev = React.useCallback(() => {
    setIndex(prev => {
      const next = prev - 1;
      return next < 0 ? maxIndex : next;
    });
    setTransitioning(true);
  }, [maxIndex]);

  const next = React.useCallback(() => {
    setIndex(prev => {
      const next = prev + 1;
      return next > maxIndex ? 0 : next;
    });
    setTransitioning(true);
  }, [maxIndex]);

  /* ── auto-play ── */
  React.useEffect(() => {
    if (hovering) return;
    autoRef.current = setInterval(next, 3000);
    return () => clearInterval(autoRef.current);
  }, [next, hovering]);

  /* ── keyboard ── */
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  /* ── clamp index when visibleCount changes (resize) ── */
  React.useEffect(() => {
    setIndex(i => Math.min(i, Math.max(0, total - visibleCount)));
  }, [visibleCount, total]);

  /* ── drag / touch ── */
  const handlePointerDown = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setDragStart(clientX);
  };
  const handlePointerUp = (e) => {
    if (dragStart === null) return;
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStart - clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    setDragStart(null);
  };

  /* ── derived offset ── */
  const pct = (100 / visibleCount) * index;

  /* ── pagination dots: one dot per possible stop ── */
  const dots = Array.from({ length: maxIndex + 1 });

  const navBtnStyle = (isHovered) => ({
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: `1.5px solid ${isHovered ? '#0057B8' : '#D6E4F7'}`,
    background: isHovered ? '#0057B8' : '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: isHovered ? '0 4px 20px rgba(0,87,184,0.25)' : '0 2px 12px rgba(0,87,184,0.10)',
    transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.15s',
    transform: isHovered ? 'scale(1.10)' : 'scale(1)',
    flexShrink: 0,
  });

  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #F4F8FD 0%, #EBF3FC 100%)',
        borderRadius: '24px',
        padding: '60px 32px 50px 32px',
        marginBottom: '90px',
        border: '1px solid #E1EDFA',
        boxShadow: '0 8px 30px rgba(0, 87, 184, 0.02)'
      }}
    >
      {/* ── Header ── */}
      <div style={{ textAlign: 'center', marginBottom: '52px' }}>

        {/* TITLE — large, bold, dark navy */}
        <h2 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '32px',
          fontWeight: '800',
          color: '#063B73',
          margin: '0 0 14px 0',
          letterSpacing: '-0.5px',
          lineHeight: 1.15,
          textTransform: 'uppercase'
        }}>
          Our Core Strengths
        </h2>

        {/* SUBTITLE — medium, blue accent */}
        <p style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '24px',
          fontWeight: '600',
          color: '#0057B8',
          margin: '0 0 16px 0',
          letterSpacing: '0',
          lineHeight: 1.4
        }}>
          Engineering Capability Built for Scale.
        </p>

        {/* Accent divider */}
        <div style={{ width: '60px', height: '3.5px', background: '#0057B8', borderRadius: '4px', margin: '0 auto 20px auto' }} />

        {/* Supporting description */}
        <p style={{
          fontSize: '16.5px',
          color: '#64748B',
          maxWidth: '660px',
          margin: '0 auto',
          lineHeight: 1.75,
          fontWeight: '400'
        }}>
          Our people, expertise and technology enable us to deliver complex engineering projects with precision, innovation and efficiency.
        </p>
      </div>

      {/* ── Carousel wrapper ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>

        {/* Prev button */}
        <button
          aria-label="Previous strength"
          onClick={prev}
          style={navBtnStyle(prevHovered)}
          onMouseEnter={() => setPrevHovered(true)}
          onMouseLeave={() => setPrevHovered(false)}
        >
          <ChevronLeft size={20} color={prevHovered ? '#FFFFFF' : '#0057B8'} />
        </button>

        {/* Track container — clips overflow */}
        <div 
          style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <div
            ref={trackRef}
            onMouseDown={handlePointerDown}
            onMouseUp={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchEnd={handlePointerUp}
            style={{
              display: 'flex',
              transform: `translateX(-${pct}%)`,
              transition: transitioning ? 'transform 0.45s cubic-bezier(0.4,0,0.2,1)' : 'none',
              willChange: 'transform',
              userSelect: 'none',
              cursor: dragStart !== null ? 'grabbing' : 'grab',
            }}
          >
            {STRENGTHS.map((s, i) => (
              <div
                key={i}
                style={{
                  flex: `0 0 ${100 / visibleCount}%`,
                  maxWidth: `${100 / visibleCount}%`,
                  padding: '0 10px',
                  boxSizing: 'border-box',
                }}
              >
                <StrengthCard card={s} />
              </div>
            ))}
          </div>
        </div>

        {/* Next button */}
        <button
          aria-label="Next strength"
          onClick={next}
          style={navBtnStyle(nextHovered)}
          onMouseEnter={() => setNextHovered(true)}
          onMouseLeave={() => setNextHovered(false)}
        >
          <ChevronRight size={20} color={nextHovered ? '#FFFFFF' : '#0057B8'} />
        </button>
      </div>

      {/* ── Pagination dots ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '28px' }}>
        {dots.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            style={{
              width: i === index ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === index ? '#0057B8' : '#CBD5E1',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        ))}
      </div>
    </section>
  );
}

function StrengthCard({ card }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#FFFFFF',
        border: `1.5px solid ${hovered ? '#0057B8' : '#E2EDF8'}`,
        borderRadius: '20px',
        padding: '28px 24px 22px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '260px',
        boxSizing: 'border-box',
        boxShadow: hovered ? '0 12px 36px rgba(0,87,184,0.12)' : '0 2px 16px rgba(0,87,184,0.05)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        position: 'relative',
      }}
    >
      {/* Icon box */}
      <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
        {card.icon}
      </div>

      {/* Heading */}
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: '800', color: '#0F2747', marginBottom: '4px', lineHeight: 1.2 }}>
        {card.heading}
      </div>

      {/* Subtitle */}
      <div style={{ fontSize: '13px', fontWeight: '700', color: card.subtitleColor, marginBottom: '6px', letterSpacing: '0.02em' }}>
        {card.subtitle}
      </div>

      {/* Accent line */}
      <div style={{ width: '32px', height: '2.5px', background: card.subtitleColor, borderRadius: '2px', marginBottom: '14px', opacity: 0.5 }} />

      {/* Description */}
      <p style={{ fontSize: '13.5px', color: '#5A6A7E', lineHeight: 1.6, margin: 0, flex: 1 }}>
        {card.desc}
      </p>

      {/* Bottom-right arrow */}
      <div style={{
        position: 'absolute',
        bottom: '18px',
        right: '18px',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: `1.5px solid ${hovered ? '#0057B8' : '#D6E4F7'}`,
        background: hovered ? '#0057B8' : '#F5F9FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.25s ease',
      }}>
        <ArrowRight size={14} color={hovered ? '#FFFFFF' : '#0057B8'} />
      </div>
    </div>
  );
}

function ApproachDiamondCard({ num, title, desc, icon, windowWidth }) {
  const [hovered, setHovered] = React.useState(false);

  // Compute transform: lift straight up (translateY(-8px)) regardless of the parent rotation
  // Since the parent card is rotated 45 degrees, standard CSS hover translateY would lift diagonally.
  // By splitting the transforms, we can keep the translation vertical!
  // Parent container rotated 45deg:
  // To move strictly vertically by `d` in screen space, we translate both X and Y by `d / sqrt(2)`.
  // -8px vertically means translating by -5.65px on both rotated X and Y axes.
  const liftX = hovered ? -5.65 : 0;
  const liftY = hovered ? -5.65 : 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '230px',
        height: '230px',
        background: hovered ? 'linear-gradient(135deg, #FFF5F5 0%, #FFF0F0 100%)' : 'linear-gradient(135deg, #FFFDFD 0%, #FFF9F9 100%)',
        border: `1.5px solid ${hovered ? '#EF4444' : '#FDE8E8'}`,
        transform: `rotate(45deg) translate(${liftX}px, ${liftY}px)`,
        boxShadow: hovered ? '0 12px 32px rgba(239, 68, 68, 0.12)' : '0 3px 16px rgba(239, 68, 68, 0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease',
        margin: windowWidth >= 1024 ? '35px 5px' : '40px 0',
        cursor: 'pointer',
        position: 'relative',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          transform: 'rotate(-45deg)',
          textAlign: 'center',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          position: 'relative'
        }}
      >
        {/* Rotated diamond box containing the number */}
        <div style={{
          width: '42px',
          height: '42px',
          transform: 'rotate(45deg)',
          background: hovered ? '#EF4444' : 'rgba(239, 68, 68, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          border: `1.5px solid ${hovered ? '#EF4444' : '#FEE2E2'}`,
          transition: 'all 0.3s ease',
          boxShadow: hovered ? '0 4px 12px rgba(239, 68, 68, 0.2)' : 'none'
        }}>
          {/* Un-rotated step number */}
          <div style={{
            transform: 'rotate(-45deg)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '15px',
            fontWeight: '800',
            color: hovered ? '#FFFFFF' : '#EF4444',
            transition: 'color 0.3s ease',
            lineHeight: 1
          }}>
            {num}
          </div>
        </div>

        {/* Heading */}
        <h4 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '15px',
          fontWeight: '800',
          color: '#0F2747',
          margin: '0 0 10px 0',
          letterSpacing: '1px'
        }}>
          {title}
        </h4>

        {/* Description */}
        <p style={{
          fontSize: '11px',
          color: '#64748B',
          lineHeight: 1.5,
          margin: 0,
          maxWidth: '155px',
          fontWeight: '500'
        }}>
          {desc}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   INDUSTRIES WE SERVE — ARC LAYOUT & DATA
───────────────────────────────────────────────────────────── */
const INDUSTRIES_DATA = [
  {
    label: 'BUILDINGS',
    title: 'Buildings & Commercial Developments',
    desc: 'High-rise, commercial, residential and mixed-use developments with advanced BIM, clash coordination, and lifecycle asset information.',
    icon: <Building2 size={24} color="#0057B8" />,
    iconBg: 'rgba(0, 87, 184, 0.08)'
  },
  {
    label: 'INFRASTRUCTURE',
    title: 'Infrastructure Developments',
    desc: 'Roads, utilities, public infrastructure and major civil developments supporting key municipal and national projects across the GCC.',
    icon: <MapPin size={24} color="#0057B8" />,
    iconBg: 'rgba(0, 87, 184, 0.08)'
  },
  {
    label: 'TRANSPORTATION',
    title: 'Transportation Systems',
    desc: 'Airports, rail, metro, ports, bus stations and general transportation infrastructure with complex engineering and smart systems integration.',
    icon: <Plane size={24} color="#0057B8" />,
    iconBg: 'rgba(0, 87, 184, 0.08)'
  },
  {
    label: 'INDUSTRIAL',
    title: 'Industrial & Oil & Gas',
    desc: 'Industrial facilities, plants, utilities and complex engineering environments requiring specialized stress, acoustics, and structural calculations.',
    icon: <Factory size={24} color="#0057B8" />,
    iconBg: 'rgba(0, 87, 184, 0.08)'
  },
  {
    label: 'GOVERNMENT',
    title: 'Government & Public Assets',
    desc: 'Public buildings, infrastructure and strategic national developments delivered with premium quality control, strict security, and cost performance.',
    icon: <Shield size={24} color="#0057B8" />,
    iconBg: 'rgba(0, 87, 184, 0.08)'
  },
  {
    label: 'MANAGEMENT',
    title: 'Facility & Asset Management',
    desc: 'Digital information and Digital Twin solutions supporting operational assets throughout their complete lifecycle (CAD → BIM → Asset Lifecycle).',
    icon: <Database size={24} color="#0057B8" />,
    iconBg: 'rgba(0, 87, 184, 0.08)'
  }
];

function IndustriesArc({ windowWidth, activeIdx, setActiveIdx }) {
  const isDesktop = windowWidth >= 900;
  const current = INDUSTRIES_DATA[activeIdx];

  // Positions on the 1000x480 desktop coordinate box
  const positions = [
    { left: '10%', top: '78%', label: 'BUILDINGS' },
    { left: '22%', top: '44%', label: 'INFRASTRUCTURE' },
    { left: '38%', top: '24%', label: 'TRANSPORTATION' },
    { left: '62%', top: '24%', label: 'INDUSTRIAL' },
    { left: '78%', top: '44%', label: 'GOVERNMENT' },
    { left: '90%', top: '78%', label: 'MANAGEMENT' }
  ];

  if (!isDesktop) {
    // ── MOBILE & TABLET LAYOUT ──
    return (
      <div style={{ width: '100%', boxSizing: 'border-box' }}>
        {/* Horizontal & Wrapped tabs for Mobile */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px 8px',
          padding: '12px 4px',
          marginBottom: '32px'
        }}>
          {INDUSTRIES_DATA.map((item, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={item.label}
                onClick={() => setActiveIdx(idx)}
                style={{
                  background: isActive ? '#0057B8' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#475569',
                  border: `1.5px solid ${isActive ? '#0057B8' : '#E2EAF3'}`,
                  borderRadius: '30px',
                  padding: '10px 20px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 4px 12px rgba(0, 87, 184, 0.15)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Selected content card */}
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #E2EAF3',
          borderRadius: '24px',
          padding: '40px 24px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 87, 184, 0.03)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Central icon */}
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(0, 87, 184, 0.06)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            border: '1px solid rgba(0, 87, 184, 0.1)'
          }}>
            {current.icon}
          </div>

          <h3 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '22px',
            fontWeight: '800',
            color: '#0F2747',
            margin: '0 0 12px 0'
          }}>
            {current.title}
          </h3>

          <div style={{ width: '40px', height: '3px', background: '#0057B8', borderRadius: '2px', margin: '0 auto 16px auto' }} />

          <p style={{
            fontSize: '14.5px',
            color: '#64748B',
            lineHeight: 1.65,
            maxWidth: '560px',
            margin: '0 auto'
          }}>
            {current.desc}
          </p>
        </div>
      </div>
    );
  }

  // ── DESKTOP ARCH LAYOUT ──
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '1060px',
      height: '480px',
      margin: '0 auto',
      overflow: 'visible',
      boxSizing: 'border-box'
    }}>
      {/* BACKGROUND: grid lines and dashed arch path */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 1000 480" fill="none">
        {/* Subtle grid background */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(226, 234, 243, 0.35)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Dynamic Connecting dashed arch path */}
        <path d="M 100 390 Q 500 60 900 390" fill="none" stroke="rgba(0, 87, 184, 0.32)" strokeWidth="4.5" strokeDasharray="6,6" />
      </svg>

      {/* CENTER DETAILS CONTAINER */}
      <div style={{
        position: 'absolute',
        top: '190px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        width: '460px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5
      }}>
        {/* Central rotated diamond container */}
        <div style={{
          width: '50px',
          height: '50px',
          transform: 'rotate(45deg)',
          background: '#FFFFFF',
          border: '1.5px solid #0057B8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(0, 87, 184, 0.1)'
        }}>
          <div style={{ transform: 'rotate(-45deg)', display: 'flex' }}>
            {current.icon}
          </div>
        </div>

        {/* Selected Industry Title */}
        <h3 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '22px',
          fontWeight: '800',
          color: '#0F2747',
          margin: '0 0 10px 0',
          lineHeight: 1.3
        }}>
          {current.title}
        </h3>

        {/* Blue divider line */}
        <div style={{ width: '40px', height: '3px', background: '#0057B8', borderRadius: '2px', marginTop: '8px', marginBottom: '14px' }} />

        {/* Selected Industry Description */}
        <p style={{
          fontSize: '13.5px',
          color: '#64748B',
          lineHeight: 1.65,
          margin: 0,
          fontWeight: '500'
        }}>
          {current.desc}
        </p>
      </div>

      {/* INTERACTIVE NODES ON THE ARCH */}
      {INDUSTRIES_DATA.map((item, idx) => {
        const pos = positions[idx];
        const isActive = idx === activeIdx;
        const [hovered, setHovered] = React.useState(false);

        return (
          <div
            key={item.label}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => setActiveIdx(idx)}
            style={{
              position: 'absolute',
              left: pos.left,
              top: pos.top,
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.3s ease'
            }}
          >
            {/* Circle Node */}
            <div style={{
              width: isActive ? '52px' : '44px',
              height: isActive ? '52px' : '44px',
              borderRadius: '50%',
              background: isActive ? '#0057B8' : (hovered ? 'rgba(0, 87, 184, 0.08)' : '#FFFFFF'),
              border: `1.5px solid ${isActive ? '#0057B8' : (hovered ? '#0057B8' : '#D6E4F7')}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isActive
                ? '0 0 0 6px rgba(0, 87, 184, 0.15), 0 4px 12px rgba(0, 87, 184, 0.25)'
                : (hovered ? '0 4px 12px rgba(0, 87, 184, 0.1)' : '0 2px 8px rgba(0, 87, 184, 0.03)'),
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              {React.cloneElement(item.icon, {
                size: isActive ? 20 : 18,
                color: isActive ? '#FFFFFF' : '#0057B8'
              })}
            </div>

            {/* Label below circle */}
            <span style={{
              marginTop: '10px',
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '11px',
              fontWeight: '800',
              letterSpacing: '1px',
              color: isActive ? '#0057B8' : '#64748B',
              transition: 'color 0.25s ease'
            }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function GeographicalPresence({ windowWidth, mapImg, countries }) {
  const [activeId, setActiveId] = React.useState('qatar');
  const isDesktop = windowWidth >= 1024;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1.2fr 1fr' : '1fr', gap: '36px', alignItems: 'stretch' }}>

      {/* ── LEFT COLUMN: DYNAMIC MAP VISUAL ── */}
      <div
        style={{
          background: `#FAFBFD url(${mapImg}) no-repeat center center / contain`,
          border: '1.5px solid #E2EAF3',
          borderRadius: '24px',
          padding: isDesktop ? '32px' : '20px',
          height: isDesktop ? '520px' : '380px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 87, 184, 0.02)'
        }}
      >

        {/* Static Map Image is sufficient - dynamic overlay pins removed */}

      </div>

      {/* ── RIGHT COLUMN: INTERACTIVE COUNTRIES LIST ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {countries.map((c) => {
          const isActive = c.id === activeId;
          const [hovered, setHovered] = React.useState(false);

          return (
            <div
              key={c.id}
              onClick={() => setActiveId(c.id)}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                background: '#FFFFFF',
                border: `1.5px solid ${isActive ? c.accentColor : '#E2EAF3'}`,
                borderLeft: `5px solid ${c.accentColor}`,
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: isActive
                  ? '0 6px 20px rgba(6, 59, 115, 0.05)'
                  : (hovered ? '0 4px 12px rgba(6, 59, 115, 0.02)' : 'none'),
                transform: hovered && !isActive ? 'translateX(4px)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {/* Left Group: Flag + Text */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

                {/* Round Flag Wrapper */}
                <div style={{ flexShrink: 0 }}>
                  {c.flag}
                </div>

                {/* Country info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', fontWeight: '800', color: '#0F2747', margin: 0 }}>
                      {c.name}
                    </h4>
                    <span
                      style={{
                        fontSize: '9.5px',
                        fontWeight: '800',
                        color: c.accentColor,
                        background: `${c.accentColor}08`,
                        border: `1px solid ${c.accentColor}20`,
                        padding: '2px 8px',
                        borderRadius: '30px',
                        letterSpacing: '0.2px'
                      }}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#5A6A7E', margin: 0, lineHeight: 1.45, fontWeight: '500' }}>
                    {c.desc}
                  </p>
                </div>

              </div>

              {/* Right icon badge */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isActive ? c.accentColor : 'rgba(0, 87, 184, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.25s ease'
                }}
              >
                {c.isBuildingIcon ? (
                  <Building2 size={14} color={isActive ? '#FFFFFF' : c.accentColor} />
                ) : (
                  <MapPin size={14} color={isActive ? '#FFFFFF' : c.accentColor} />
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Embedded CSS animation keyframes */}
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
      `}</style>

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   OUR JOURNEY SECTION (8-CARD STAGGERED WAVE TIMELINE)
───────────────────────────────────────────────────────────── */
function OurJourneySection({ windowWidth }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

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

  const isDesktop = windowWidth >= 1200;
  const isTablet = windowWidth >= 768 && windowWidth < 1200;

  return (
    <section 
      id="our-journey-section"
      style={{ 
        padding: '60px 0 80px 0', 
        background: '#F8FBFF', 
        borderRadius: '24px',
        border: '1px solid #D8E7F5',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '80px'
      }}
    >
      {/* Background wave vectors */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none', zIndex: 0 }}>
        <svg width="100%" height="100%" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100,200 C300,50 600,450 1000,100 C1200,-50 1400,150 1600,50" stroke="#087CFF" strokeWidth="4" />
          <path d="M-50,250 C350,100 650,500 1050,150 C1250,0 1450,200 1650,100" stroke="#19B5FE" strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
          {/* Line 1: Main Big Title */}
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
            OUR JOURNEY
          </h2>

          {/* Decorative Divider */}
          <div style={{ width: '60px', height: '3.5px', background: '#087CFF', borderRadius: '4px', margin: '0 auto 12px auto' }} />

          {/* Line 2: Subtitle */}
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

          {/* Line 3: Description */}
          <p 
            style={{ 
              fontSize: '15px', 
              color: '#64748B', 
              lineHeight: 1.6, 
              margin: '0 auto', 
              maxWidth: '720px' 
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
              <svg width="100%" height="100%" viewBox="0 0 1320 560" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="waveGradJourney" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#087CFF" />
                    <stop offset="50%" stopColor="#00B8FF" />
                    <stop offset="100%" stopColor="#087CFF" />
                  </linearGradient>
                </defs>
                {/* Precise connecting dashed line passing directly from card bottom-centers to card top-centers */}
                <path 
                  d="M 20,240 Q 50,240 82.5,240 L 247.5,315 L 412.5,240 L 577.5,315 L 742.5,240 L 907.5,315 L 1072.5,240 L 1237.5,315 Q 1270,315 1300,315" 
                  stroke="url(#waveGradJourney)" 
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
                gap: '12px',
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
                      transition: `opacity 0.6s ease ${idx * 0.1}s, transform 0.6s ease ${idx * 0.1}s`
                    }}
                  >
                    {/* Milestone Card (Fits 100% inside column width to prevent overflow) */}
                    <div 
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '30px 10px 14px 10px',
                        border: '1.5px solid #E2EAF3',
                        boxShadow: '0 10px 30px rgba(6, 59, 115, 0.06)',
                        position: 'absolute',
                        left: '50%',
                        transform: 'translate(-50%, 0)',
                        width: '158px',
                        height: '215px',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        top: isTop ? '25px' : '315px',
                        transition: 'all 0.25s ease',
                        zIndex: 3
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translate(-50%, -6px)';
                        e.currentTarget.style.boxShadow = '0 18px 40px rgba(8, 124, 255, 0.15)';
                        e.currentTarget.style.borderColor = '#087CFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translate(-50%, 0)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(6, 59, 115, 0.06)';
                        e.currentTarget.style.borderColor = '#E2EAF3';
                      }}
                    >
                      {/* Floating Overlapping Circular Icon */}
                      <div 
                        style={{ 
                          position: 'absolute', 
                          top: '-22px', 
                          left: '50%',
                          transform: 'translate(-50%, 0)',
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          background: '#EFF6FF',
                          border: '2px solid #FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 6px 16px rgba(8, 124, 255, 0.15)',
                          zIndex: 10
                        }}
                      >
                        {m.icon}
                      </div>

                      {/* Line 1: Big Bold Title */}
                      <h4 
                        style={{ 
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontSize: '16.5px', 
                          fontWeight: '800', 
                          color: '#062F63', 
                          margin: '0 0 3px 0', 
                          lineHeight: 1.25,
                          textAlign: 'center'
                        }}
                      >
                        {m.title}
                      </h4>

                      {/* Line 2: Proportional Subtitle Year */}
                      <div 
                        style={{
                          color: '#087CFF',
                          fontSize: '14px',
                          fontWeight: '800',
                          fontFamily: 'Space Grotesk, sans-serif',
                          marginBottom: '6px',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {m.year}
                      </div>

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

                      {/* Line 3: Description */}
                      <p style={{ fontSize: '11.5px', color: '#475569', margin: 0, lineHeight: 1.4, textAlign: 'center', fontWeight: '500' }}>
                        {m.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TABLET / MOBILE LAYOUT: Responsive Grid */}
        {!isDesktop && (
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: isTablet ? 'repeat(2, 1fr)' : '1fr',
              gap: '36px 20px',
              position: 'relative',
              zIndex: 2,
              paddingTop: '20px'
            }}
          >
            {MILESTONES.map((m, idx) => (
              <div 
                key={m.year}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '32px 20px 20px 20px',
                  border: '1px solid #E2EAF3',
                  boxShadow: '0 10px 30px rgba(6, 59, 115, 0.08)',
                  position: 'relative',
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
                    boxShadow: '0 4px 10px rgba(8, 124, 255, 0.1)',
                    zIndex: 10
                  }}
                >
                  {m.icon}
                </div>

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

                <h4 
                  style={{ 
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '16px', 
                    fontWeight: '700', 
                    color: '#062F63', 
                    margin: '0 0 6px 0', 
                    textAlign: 'center' 
                  }}
                >
                  {m.title}
                </h4>

                <div 
                  style={{ 
                    width: '32px', 
                    height: '2.5px', 
                    background: '#087CFF', 
                    borderRadius: '2px',
                    marginBottom: '10px'
                  }} 
                />

                <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.5, textAlign: 'center' }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   OUR TEAM SECTION CAROUSEL
───────────────────────────────────────────────────────────── */
function OurTeamSection({ windowWidth }) {
  const [team, setTeam] = useState([
    { id: 1, name: 'Dijo Daniel', role: 'Admin / Manager', image: '/Dijo Daniel-Admin.png' },
    { id: 2, name: 'Hamza Maroof', role: 'Sales Executive', image: '/Hamza Maroof - Sales Executive.png' },
    { id: 3, name: 'Hanuman Pandey', role: 'Lidar Specialist', image: '/Hanuman Pandey - Lidar Specialist.png' },
    { id: 4, name: 'Pandiarajan Nattathi', role: 'Sr. BIM Coordinator', image: '/Pandiarajan Nattathi - Sr. BIM Coordinator.png' },
    { id: 5, name: 'Ranjithkumar', role: 'Sustainability Manager', image: '/Ranjithkumar - Sustainability Manager.png' },
    { id: 6, name: 'Riyas Abdul Rasheed', role: 'Branch Office Manager', image: '/Riyas Abdul Rasheed - Branch Office Manager.png' },
    { id: 7, name: 'Sudharsan Shanmugam', role: 'Sr. BIM Coordinator', image: '/Sudharsan Shanmugam - Sr. BIM Coordinator.png' },
    { id: 8, name: 'Sulaiman Siddique', role: 'Sustainablity Engineer', image: '/Sulaiman Siddique  - Sustainablity Engineer.png' },
    { id: 9, name: 'Vasanth Subburam', role: 'BIM Coordinator', image: '/Vasanth Subburam - BIM Coordinator.png' }
  ]);

  const [teamIndex, setTeamIndex] = useState(0);
  const [isTeamPaused, setIsTeamPaused] = useState(false);

  const teamCardsToShow = windowWidth >= 1024 ? 4 : windowWidth >= 640 ? 2 : 1;

  const fetchTeamData = () => {
    fetch('/api/team')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTeam(data);
          data.forEach(item => {
            if (item.image) {
              const img = new Image();
              img.src = item.image;
            }
          });
        }
      })
      .catch(err => console.warn('Team fetch warning:', err));
  };

  useEffect(() => {
    fetchTeamData();
    window.addEventListener('dataUpdated', fetchTeamData);
    window.addEventListener('menuUpdated', fetchTeamData);
    return () => {
      window.removeEventListener('dataUpdated', fetchTeamData);
      window.removeEventListener('menuUpdated', fetchTeamData);
    };
  }, []);

  const handlePrev = () => {
    setTeamIndex(prev => (prev > 0 ? prev - 1 : team.length - teamCardsToShow));
  };

  const handleNext = () => {
    setTeamIndex(prev => (prev < team.length - teamCardsToShow ? prev + 1 : 0));
  };

  // Auto-play interval for automatic smooth moving every 3.0 seconds
  useEffect(() => {
    if (isTeamPaused || team.length <= teamCardsToShow) return;

    const autoTimer = setInterval(() => {
      setTeamIndex(prev => (prev < team.length - teamCardsToShow ? prev + 1 : 0));
    }, 3000);

    return () => clearInterval(autoTimer);
  }, [isTeamPaused, team.length, teamCardsToShow]);

  return (
    <section 
      style={{ 
        marginBottom: '90px', 
        position: 'relative',
        background: '#F8FBFF',
        borderRadius: '24px',
        border: '1px solid #D8E7F5',
        padding: windowWidth >= 768 ? '48px 24px' : '36px 16px',
        overflow: 'hidden'
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px auto' }}>
        <h2 
          style={{ 
            fontFamily: 'Space Grotesk, sans-serif', 
            fontSize: windowWidth >= 992 ? '36px' : windowWidth >= 768 ? '30px' : '26px', 
            fontWeight: '800', 
            color: '#063B73', 
            margin: '0 0 8px 0', 
            letterSpacing: '-0.5px' 
          }}
        >
          Our Team. Our Core Strength.
        </h2>
        <h3 
          style={{ 
            fontFamily: 'Space Grotesk, sans-serif', 
            fontSize: windowWidth >= 768 ? '22px' : '18px', 
            fontWeight: '700', 
            color: '#0F172A', 
            margin: '0 0 12px 0' 
          }}
        >
          Meet Our Engineering &amp; Technical Leadership.
        </h3>
        <div style={{ width: '60px', height: '3.5px', background: '#0057B8', borderRadius: '4px', margin: '0 auto 16px auto' }} />
        <p style={{ fontSize: '15px', color: '#64748B', margin: '0 auto 20px auto', lineHeight: 1.6, maxWidth: '680px' }}>
          Our experienced engineering leaders, technical specialists, and dedicated team members driving digital transformation and project delivery across the GCC.
        </p>
      </div>

      <div style={{ position: 'relative', padding: windowWidth >= 768 ? '0 56px' : '0 40px' }}>
        <button
          onClick={handlePrev}
          title="Previous"
          style={{
            position: 'absolute',
            left: windowWidth >= 768 ? '4px' : '0px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#FFFFFF',
            color: '#063B73',
            border: '1.5px solid #CBD5E1',
            boxShadow: '0 6px 20px rgba(6, 59, 115, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'transform 0.2s ease, background 0.2s ease, border-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#087CFF';
            e.currentTarget.style.background = '#087CFF';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#CBD5E1';
            e.currentTarget.style.background = '#FFFFFF';
            e.currentTarget.style.color = '#063B73';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={handleNext}
          title="Next"
          style={{
            position: 'absolute',
            right: windowWidth >= 768 ? '4px' : '0px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#FFFFFF',
            color: '#063B73',
            border: '1.5px solid #CBD5E1',
            boxShadow: '0 6px 20px rgba(6, 59, 115, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'transform 0.2s ease, background 0.2s ease, border-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#087CFF';
            e.currentTarget.style.background = '#087CFF';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#CBD5E1';
            e.currentTarget.style.background = '#FFFFFF';
            e.currentTarget.style.color = '#063B73';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <ChevronRight size={22} />
        </button>

        {/* Track Slider Container */}
        <div 
          style={{ width: '100%', overflow: 'hidden', padding: '12px 0 20px 0' }}
          onMouseEnter={() => setIsTeamPaused(true)}
          onMouseLeave={() => setIsTeamPaused(false)}
        >
          <div
            style={{
              display: 'flex',
              transform: `translateX(calc(-${teamIndex} * (100% / ${teamCardsToShow} + ${24 / teamCardsToShow}px)))`,
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              gap: '24px',
              alignItems: 'stretch'
            }}
          >
            {team.map((member, idx) => (
              <div
                key={member.id || idx}
                style={{
                  flex: `0 0 calc(${100 / teamCardsToShow}% - ${(24 * (teamCardsToShow - 1)) / teamCardsToShow}px)`,
                  boxSizing: 'border-box',
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #E2EAF3',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(6, 59, 115, 0.06)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 18px 40px rgba(6, 59, 115, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(6, 59, 115, 0.06)';
                }}
              >
                <div style={{ position: 'relative', height: '280px', background: '#F1F5F9', overflow: 'hidden', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #071C3B 0%, #0057B8 100%)',
                      color: '#FFFFFF',
                      fontSize: '54px',
                      fontWeight: '800',
                      zIndex: 1
                    }}
                  >
                    {member.name ? member.name.charAt(0) : 'T'}
                  </div>

                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      loading="eager"
                      fetchPriority="high"
                      style={{
                        position: 'relative',
                        zIndex: 2,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center 20%',
                        transform: 'scale(1.35)',
                        borderRadius: '0px',
                        transition: 'transform 0.3s ease'
                      }}
                      onError={(e) => {
                        const nameLower = (member.name || '').toLowerCase();
                        if (nameLower.includes('dijo')) e.target.src = '/Dijo Daniel-Admin.png';
                        else if (nameLower.includes('hamza')) e.target.src = '/Hamza Maroof - Sales Executive.png';
                        else if (nameLower.includes('hanuman')) e.target.src = '/Hanuman Pandey - Lidar Specialist.png';
                        else if (nameLower.includes('pandiarajan')) e.target.src = '/Pandiarajan Nattathi - Sr. BIM Coordinator.png';
                        else if (nameLower.includes('ranjith')) e.target.src = '/Ranjithkumar - Sustainability Manager.png';
                        else if (nameLower.includes('riyas')) e.target.src = '/Riyas Abdul Rasheed - Branch Office Manager.png';
                        else if (nameLower.includes('sudharsan')) e.target.src = '/Sudharsan Shanmugam - Sr. BIM Coordinator.png';
                        else if (nameLower.includes('sulaiman')) e.target.src = '/Sulaiman Siddique  - Sustainablity Engineer.png';
                        else if (nameLower.includes('vasanth')) e.target.src = '/Vasanth Subburam - BIM Coordinator.png';
                        else e.target.style.display = 'none';
                      }}
                    />
                  ) : null}
                </div>

                <div style={{ padding: '20px 16px', textAlign: 'center', background: '#FFFFFF' }}>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '19px', fontWeight: '800', color: '#062F63', margin: '0 0 6px 0' }}>
                    {member.name}
                  </h3>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#10B981', letterSpacing: '0.2px' }}>
                    {member.role || 'Team Member'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


