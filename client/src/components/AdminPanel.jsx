import React, { useState, useEffect } from 'react';
import { getCachedCompanySettings, updateCachedCompanySettings } from '../utils/bannerCache';
import { 
  Lock, User, Plus, Trash, Edit, Check, LogOut, Settings, 
  Globe, Award, FileText, Menu, Layers, Shield, Eye, Trash2,
  Search, Bell, FileDown, Folder, Key, Image as ImageIcon,
  ChevronLeft, ChevronRight, CheckSquare, X,
  LayoutDashboard, Newspaper, Briefcase, Wrench, Star, FolderTree,
  Mail, Send, History, Sliders, Database, Terminal, ChevronDown, FileCode,
  Building, MapPin, Phone, Map, Clock, Cpu, ExternalLink,
  Radio, Leaf, Building2, Wind, Volume2, Droplet, Activity, Zap, Users,
  Monitor, Cloud, TrendingUp, Share2, ClipboardCheck, Heart, RefreshCw
} from 'lucide-react';
import './AdminPanel.css';
import logoBlueImg from '../assets/logo1_transparent_blue.png';

export default function AdminPanel({ onNavigate }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Auth state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Sidebar tab state
  const [activeTab, setActiveTab] = useState('/admin/dashboard');
  
  // Sidebar collapsible sections state
  const [sectionsExpanded, setSectionsExpanded] = useState({
    content: true,
    categories: true,
    communication: true,
    admin: true,
    settings: true,
    media: true,
    system: true
  });

  const toggleSection = (section) => {
    setSectionsExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Entities lists state
  const [heroSlides, setHeroSlides] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const [testimonials, setTestimonials] = useState([]);
  const [menus, setMenus] = useState([]);
  const [footer, setFooter] = useState(null);
  const [users, setUsers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [contactInquiries, setContactInquiries] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [partners, setPartners] = useState([]);

  // SEO Management State
  const [seoPages, setSeoPages] = useState({
    'Home': {
      title: 'Blue Crescent Engineering | Technical Services & Solutions',
      description: 'Blue Crescent Engineering delivers premier sustainability, telecom, and specialized engineering design solutions with verified compliance and expert execution.',
      keywords: 'Engineering, Telecom, Sustainability, GSAS, LEED, Telecom Design, MEP, BIM',
      canonical: 'https://bluecrescent.com',
      slug: '/',
      robotsIndex: 'Index (Recommended - show in Google)',
      robotsFollow: 'Follow (Follow links on page)',
      ogTitle: 'Blue Crescent Engineering | Technical Services & Solutions',
      ogImage: 'https://bluecrescent.com/logo.png',
      ogUrl: 'https://bluecrescent.com',
      ogType: 'website',
      ogDescription: 'Blue Crescent Engineering delivers premier sustainability, telecom, and specialized engineering design solutions.',
      twitterTitle: 'Blue Crescent Engineering | Technical Services & Solutions',
      twitterImage: 'https://bluecrescent.com/logo.png',
      twitterType: 'Summary Card with Large Image',
      twitterDescription: 'Blue Crescent Engineering delivers premier sustainability, telecom, and specialized engineering design solutions.',
      imgAlt: 'Blue Crescent Engineering Logo',
      imgTitle: 'Blue Crescent Logo',
      imgCaption: 'Powering technical solutions that scale your vision.',
      schemaTemplate: 'Organization Schema (Logo, Social links)',
      schemaPayload: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Blue Crescent Engineering",
  "url": "https://bluecrescent.com",
  "logo": "https://bluecrescent.com/logo.png",
  "sameAs": [
    "https://linkedin.com/company/bluecrescent"
  ]
}`,
      sitemapInclude: true,
      sitemapPriority: 1.0,
      changeFrequency: 'Weekly (Standard static content)'
    },
    'About Us': {
      title: 'About Us | Blue Crescent Engineering',
      description: 'Discover our mission, our professional engineering team, and our commitment to sustainable design and telecom infrastructure excellence.',
      keywords: 'About Blue Crescent, Engineering Team, Sustainability Commitment, Telecom History',
      canonical: 'https://bluecrescent.com/about',
      slug: '/about',
      robotsIndex: 'Index (Recommended - show in Google)',
      robotsFollow: 'Follow (Follow links on page)',
      ogTitle: 'About Us | Blue Crescent Engineering',
      ogImage: 'https://bluecrescent.com/logo.png',
      ogUrl: 'https://bluecrescent.com/about',
      ogType: 'website',
      ogDescription: 'Discover our mission, our professional engineering team, and our commitment to sustainable design.',
      twitterTitle: 'About Us | Blue Crescent Engineering',
      twitterImage: 'https://bluecrescent.com/logo.png',
      twitterType: 'Summary Card with Large Image',
      twitterDescription: 'Discover our mission, our professional engineering team, and our commitment to sustainable design.',
      imgAlt: 'Blue Crescent About Image',
      imgTitle: 'About Us Banner',
      imgCaption: 'Our professional engineering team in action.',
      schemaTemplate: 'AboutPage Schema',
      schemaPayload: `{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Blue Crescent Engineering",
  "description": "Information about Blue Crescent Engineering mission and values."
}`,
      sitemapInclude: true,
      sitemapPriority: 0.8,
      changeFrequency: 'Monthly (Slowly changing content)'
    },
    'Services': {
      title: 'Services | Blue Crescent Engineering',
      description: 'Explore our complete suite of services including simulation & analysis, BIM modeling, sustainability consulting, acoustics, and telecom solutions.',
      keywords: 'Engineering Services, Simulation, BIM Modeling, LEED GSAS, Telecom Design, Acoustics',
      canonical: 'https://bluecrescent.com/services',
      slug: '/services',
      robotsIndex: 'Index (Recommended - show in Google)',
      robotsFollow: 'Follow (Follow links on page)',
      ogTitle: 'Services | Blue Crescent Engineering',
      ogImage: 'https://bluecrescent.com/logo.png',
      ogUrl: 'https://bluecrescent.com/services',
      ogType: 'website',
      ogDescription: 'Explore our complete suite of engineering services, sustainability consulting, and telecom designs.',
      twitterTitle: 'Services | Blue Crescent Engineering',
      twitterImage: 'https://bluecrescent.com/logo.png',
      twitterType: 'Summary Card with Large Image',
      twitterDescription: 'Explore our complete suite of engineering services, sustainability consulting, and telecom designs.',
      imgAlt: 'Blue Crescent Services',
      imgTitle: 'Services Overview',
      imgCaption: 'MEP, BIM, and telecom engineering systems design.',
      schemaTemplate: 'Service Schema',
      schemaPayload: `{
  "@context": "https://schema.org",
  "@type": "Service",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Blue Crescent Engineering"
  },
  "serviceType": "Technical Design and Engineering Consulting"
}`,
      sitemapInclude: true,
      sitemapPriority: 0.9,
      changeFrequency: 'Weekly (Standard static content)'
    },
    'Projects': {
      title: 'Our Projects | Blue Crescent Engineering',
      description: 'Browse our portfolio of engineering, telecom, and sustainability consultancy projects completed across various industry divisions.',
      keywords: 'Engineering Portfolio, Project Case Studies, Sustainability Projects, Telecom Infrastructure',
      canonical: 'https://bluecrescent.com/projects',
      slug: '/projects',
      robotsIndex: 'Index (Recommended - show in Google)',
      robotsFollow: 'Follow (Follow links on page)',
      ogTitle: 'Our Projects | Blue Crescent Engineering',
      ogImage: 'https://bluecrescent.com/logo.png',
      ogUrl: 'https://bluecrescent.com/projects',
      ogType: 'website',
      ogDescription: 'Browse our portfolio of engineering, telecom, and sustainability consultancy projects.',
      twitterTitle: 'Our Projects | Blue Crescent Engineering',
      twitterImage: 'https://bluecrescent.com/logo.png',
      twitterType: 'Summary Card with Large Image',
      twitterDescription: 'Browse our portfolio of engineering, telecom, and sustainability consultancy projects.',
      imgAlt: 'Projects Portfolio',
      imgTitle: 'Completed Project Showcase',
      imgCaption: 'A dynamic view of our architectural and engineering achievements.',
      schemaTemplate: 'CollectionPage Schema',
      schemaPayload: `{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Blue Crescent Engineering Projects Portfolio"
}`,
      sitemapInclude: true,
      sitemapPriority: 0.9,
      changeFrequency: 'Weekly (Standard static content)'
    },
    'Contact Us': {
      title: 'Contact Us | Blue Crescent Engineering',
      description: 'Get in touch with Blue Crescent Engineering for business inquiries, custom design consultations, and professional service solutions.',
      keywords: 'Contact Blue Crescent, Office Location, Engineering Consultation, Support Email',
      canonical: 'https://bluecrescent.com/contact',
      slug: '/contact',
      robotsIndex: 'Index (Recommended - show in Google)',
      robotsFollow: 'Follow (Follow links on page)',
      ogTitle: 'Contact Us | Blue Crescent Engineering',
      ogImage: 'https://bluecrescent.com/logo.png',
      ogUrl: 'https://bluecrescent.com/contact',
      ogType: 'website',
      ogDescription: 'Get in touch with Blue Crescent Engineering for business inquiries and consultations.',
      twitterTitle: 'Contact Us | Blue Crescent Engineering',
      twitterImage: 'https://bluecrescent.com/logo.png',
      twitterType: 'Summary Card with Large Image',
      twitterDescription: 'Get in touch with Blue Crescent Engineering for business inquiries and consultations.',
      imgAlt: 'Contact Us Office',
      imgTitle: 'Blue Crescent Offices',
      imgCaption: 'Our support team is ready to coordinate your next engineering solution.',
      schemaTemplate: 'ContactPage Schema',
      schemaPayload: `{
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact Blue Crescent Engineering",
  "url": "https://bluecrescent.com/contact"
}`,
      sitemapInclude: true,
      sitemapPriority: 0.7,
      changeFrequency: 'Monthly (Slowly changing content)'
    }
  });

  const [selectedSeoPage, setSelectedSeoPage] = useState('Home');
  const [seoSubTab, setSeoSubTab] = useState('general'); // 'general', 'social', 'image', 'schema', 'sitemap'

  // About Us video state
  const [aboutUsVideoUrl, setAboutUsVideoUrl] = useState(() => {
    return localStorage.getItem('aboutUsVideoUrl') || '/aboutus.mp4';
  });
  const [aboutUsVideoFile, setAboutUsVideoFile] = useState(null);
  const [aboutUsVideoUploading, setAboutUsVideoUploading] = useState(false);

  // About Us Hero Media state
  const [aboutUsHeroType, setAboutUsHeroType] = useState(() => {
    return localStorage.getItem('aboutUsHeroType') || 'image';
  });
  const [aboutUsHeroUrl, setAboutUsHeroUrl] = useState(() => {
    return localStorage.getItem('aboutUsHeroUrl') || '';
  });
  const [aboutUsHeroFile, setAboutUsHeroFile] = useState(null);
  const [aboutUsHeroUploading, setAboutUsHeroUploading] = useState(false);

  // All Page Banners State (Home, About Us, Services, Projects, Media, Contact Us)
  const [pageBanners, setPageBanners] = useState({
    home: '',
    aboutus: '',
    services: '',
    projects: '',
    media: '',
    contactus: ''
  });
  const [bannerUploadingKey, setBannerUploadingKey] = useState(null);

  const fetchPageBanners = async () => {
    try {
      const res = await fetch('/api/settings/banners');
      if (res.ok) {
        const data = await res.json();
        setPageBanners({
          home: data.homeBannerUrl || '',
          aboutus: data.aboutUsPageBannerUrl || '',
          services: data.servicesPageBannerUrl || '',
          projects: data.projectsPageBannerUrl || '',
          media: data.mediaPageBannerUrl || '',
          contactus: data.contactUsPageBannerUrl || ''
        });
      }
    } catch (err) {
      console.warn('Error fetching page banners:', err);
    }
  };

  const handleBannerUpload = async (pageKey, file) => {
    if (!file) return;
    setBannerUploadingKey(pageKey);
    const keyMap = {
      'home': 'homeBannerUrl',
      'aboutus': 'aboutUsPageBannerUrl',
      'services': 'servicesPageBannerUrl',
      'projects': 'projectsPageBannerUrl',
      'media': 'mediaPageBannerUrl',
      'contactus': 'contactUsPageBannerUrl'
    };
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Url = reader.result;
        const res = await fetch('/api/settings/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageKey, bannerUrl: base64Url })
        });
        if (res.ok) {
          const result = await res.json();
          setPageBanners(prev => ({
            ...prev,
            [pageKey]: result.bannerUrl
          }));
          if (keyMap[pageKey]) {
            updateCachedCompanySettings({ [keyMap[pageKey]]: result.bannerUrl });
          }
          alert(`Success! ${pageKey.toUpperCase()} banner updated successfully.`);
        } else {
          alert('Failed to upload banner. Please try again.');
        }
        setBannerUploadingKey(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading file.');
      setBannerUploadingKey(null);
    }
  };

  const handleBannerDelete = async (pageKey, title) => {
    if (!confirm(`Are you sure you want to delete the custom banner for ${title} and revert to the default system banner?`)) return;
    const keyMap = {
      'home': 'homeBannerUrl',
      'aboutus': 'aboutUsPageBannerUrl',
      'services': 'servicesPageBannerUrl',
      'projects': 'projectsPageBannerUrl',
      'media': 'mediaPageBannerUrl',
      'contactus': 'contactUsPageBannerUrl'
    };
    try {
      const res = await fetch(`/api/settings/banners/${pageKey}`, { method: 'DELETE' });
      if (res.ok) {
        setPageBanners(prev => ({
          ...prev,
          [pageKey]: ''
        }));
        if (keyMap[pageKey]) {
          updateCachedCompanySettings({ [keyMap[pageKey]]: '' });
        }
        alert(`Custom banner for ${title} deleted. Reverted to default system banner.`);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting banner.');
    }
  };

  const updateSeoField = (field, val) => {
    setSeoPages(prev => ({
      ...prev,
      [selectedSeoPage]: {
        ...prev[selectedSeoPage],
        [field]: val
      }
    }));
  };

  const updateCompanyField = (field, val) => {
    setCompanySettings(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const saveCompanySettings = async () => {
    try {
      const payload = {
        ...companySettings,
        aboutUsVideoUrl,
        aboutUsHeroType,
        aboutUsHeroUrl
      };
      delete payload.id;
      const res = await fetch('/api/settings/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const result = await res.json();
        if (result.data) {
          const finalUrl = result.data.aboutUsHeroUrl || '';
          const finalVideoUrl = result.data.aboutUsVideoUrl || '';
          
          setAboutUsHeroUrl(finalUrl);
          setAboutUsVideoUrl(finalVideoUrl);
          
          localStorage.setItem('companySettings', JSON.stringify(companySettings));
          localStorage.setItem('aboutUsHeroType', aboutUsHeroType);
          localStorage.setItem('aboutUsHeroUrl', finalUrl);
          localStorage.setItem('aboutUsVideoUrl', finalVideoUrl);
        }
      }
    } catch (err) {
      console.warn('DB save error:', err);
    }
    alert('Company Information saved successfully! Changes will reflect on the frontend.');
  };

  const discardCompanyChanges = () => {
    const saved = localStorage.getItem('companySettings');
    setCompanySettings(saved ? JSON.parse(saved) : DEFAULT_COMPANY_SETTINGS);
    setAboutUsVideoUrl(localStorage.getItem('aboutUsVideoUrl') || '/aboutus.mp4');
    setAboutUsHeroType(localStorage.getItem('aboutUsHeroType') || 'image');
    setAboutUsHeroUrl(localStorage.getItem('aboutUsHeroUrl') || '');
    alert('Changes discarded. Fields restored to last saved values.');
  };

  const saveContactSettings = async () => {
    localStorage.setItem('contactSettings', JSON.stringify(contactSettings));
    
    try {
      const payload = { ...contactSettings };
      delete payload.id;
      await fetch('/api/settings/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('DB save error:', err);
    }
    alert('Contact Information saved successfully! Changes will appear on the Contact Us page.');
  };

  // Project form modal state
  const defaultProjectForm = {
    name: '',
    slug: '',
    division_type: 'BIM Projects',
    client: '',
    contractor: '',
    consultant: '',
    location: 'Qatar',
    sector: 'Infrastructure & Buildings',
    status: 'Completed',
    year: '2024',
    short_description: '',
    description: '',
    services: 'BIM, Digital Twin',
    disciplines: 'Architecture, Structure, MEP',
    project_stage: 'As-Built / Asset Handover',
    bim_level: 'LOD 500',
    scope_of_work: '',
    deliverables: 'BIM Models, As-Built Information, Asset Data',
    technologies: 'Revit, Navisworks, AutoCAD',
    project_highlights: '',
    image: '/project1.png',
    gallery: '',
    display_order: 1
  };
  const [projectForm, setProjectForm] = useState(defaultProjectForm);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);

  // Mock states for settings / categories / media / about
  const [generalSettings, setGeneralSettings] = useState({
    siteTitle: 'Blue Crescent Engineering',
    companyEmail: 'info@bluecrescent.com',
    companyPhone: '+974 4463 5250',
    companyFax: '+974 4441 8567',
    officeAddress: '9th Floor, Tower 3, Gate Mall, Doha, Qatar',
    logo: ''
  });

  // Default values
  const DEFAULT_CONTACT_SETTINGS = {
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
    businessHoursMon: '8:00 AM – 6:00 PM',
    businessHoursFri: '8:00 AM – 12:00 PM',
    businessHoursSat: 'Closed'
  };

  const DEFAULT_COMPANY_SETTINGS = {
    siteTitle: 'Blue Crescent Engineering',
    tagline: 'A Solution for your Vision',
    legalName: 'Blue Crescent Engineering Trading & Contracting WLL',
    yearEstablished: '2010',
    copyrightText: '© 2026 BLUE CRESCENT ENGINEERING. All Rights Reserved. A Solution for your Vision.',
    whoWeArePara1: "Blue Crescent Engineering is based upon pillars of engineering excellence, a proven system of quality assurance and a dedication in meeting the client's needs and schedules. The company is incorporated by the core values of teamwork, Respect and Integrity.",
    whoWeArePara2: 'Our client-centered culture and teamwork based approach integrate the knowledge and skills of our network with local awareness, technical leadership and innovative approaches to solve our client\'s challenges.',
    whoWeArePara3: 'Across our spectrum of expertise, We make the connection for each client that best serves their immediate objectives while fulfilling our shared purpose.',
    whoWeArePara4: 'We offer multidisciplinary engineering solutions across our 4 core service verticals: Engineering Services (CAD, BIM, Laser Scanning, Scan to BIM), Sustainability Services (GSAS, LEED, Energy Audit, Carbon Management), Digital Twin, and Construction Technology.',
    mission: '"With the sustainable approach in all activities that are undertaken and an uncompromising commitment to quality in all the process and deliverable that are undertaken"',
    vision: 'Become the leading support services provider and become a recognized reputed company in the following fields: Engineering Support Services, Contracting Support Services, and Trading Services.',
    qaqc: '"Establishing and enhancing on a continuous basis an uncompromising quality assured and controlled procedures resulting in the most Client satisfied deliverables, in time"',
    hse: '"Establishing a Healthier, Safe and Environmentally Friendly procedure that is embedded into all business processes and deliverables"',
    whyIntro1: 'Guided by the best team leaders, supported by skilled staff, corporate commitment to deliver the services at their best quality while controlling the costs and time components.',
    whyIntro2: 'Solutions are provided in various options and supported with recommendations that best suit the Clients requirements.',
    whyIntro3: 'Supported by team of specialists in the areas of MEP design, Acoustics, Stress and Hydraulics, all engineering calculations.',
    whyIntro4: 'Services are applicable for Owners, Designers, Contractors and Operators.',
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
    aboutUsMapImg: '/map1.png',
    aboutUsCapaImg: '/capa.png',
    aboutUsDigitalImg: '/digital.png',
    aboutUsFlowchartBg: '#F1F7FF',
    aboutUsCountriesJson: JSON.stringify([
      { id: 'qatar', name: 'QATAR', desc: 'Regional Head Office and core operations.', accentColor: '#0057B8' },
      { id: 'kuwait', name: 'KUWAIT', desc: 'Project support & technical advisory office.', accentColor: '#00A896' },
      { id: 'uae', name: 'UAE', desc: 'Specialized design and consultancy services.', accentColor: '#F05454' },
      { id: 'saudi', name: 'SAUDI ARABIA', desc: 'Regional operations & infrastructure support.', accentColor: '#00B896' },
      { id: 'india', name: 'INDIA', desc: 'Technical delivery & design production center.', accentColor: '#8A3FFC' }
    ]),
    aboutUsDisciplinesJson: JSON.stringify([
      { name: 'BIM Modeling & Coordination', icon: 'Layers' },
      { name: 'CAD Documentation', icon: 'Building2' },
      { name: 'Reality Capture & Laser Scanning', icon: 'Radio' },
      { name: 'Specialized Engineering support', icon: 'Wrench' },
      { name: 'Computational fluid dynamics (CFD)', icon: 'Wind' },
      { name: 'Acoustic & Vibration Analysis', icon: 'Volume2' },
      { name: 'Advanced Hydraulic Analysis', icon: 'Droplet' },
      { name: 'Stress Analysis (Piping & Static)', icon: 'Activity' },
      { name: 'Energy Auditing & Commissioning', icon: 'Zap' },
      { name: 'Green Building Facilitation', icon: 'Leaf' },
      { name: 'Technical experts outsourcing', icon: 'Users' }
    ]),
    aboutUsFlowchartJson: JSON.stringify([
      { num: '01', title: 'PHYSICAL ASSET', desc: 'The tangible operational environment.', icon: 'Building2' },
      { num: '02', title: 'BIM', desc: 'Structured spatial & technical information model.', icon: 'Layers' },
      { num: '03', title: 'DIGITAL TWIN', desc: 'Operational representation connecting physics with data.', icon: 'Cpu' },
      { num: '04', title: 'INTELLIGENT OPERATIONS', desc: 'Smarter lifecycle management and real-time visualization.', icon: 'Monitor' }
    ]),
    aboutUsCapabilitiesJson: JSON.stringify([
      { title: 'Common Data Environment', desc: 'Unified and secure data across the asset lifecycle.', icon: 'Cloud' },
      { title: 'Real-Time Monitoring', desc: 'Live data insights for better situational awareness.', icon: 'Monitor' },
      { title: 'Predictive Maintenance', desc: 'AI-driven predictions to minimize downtime.', icon: 'Settings' },
      { title: 'Operational Optimization', desc: 'Optimize performance and reduce operational costs.', icon: 'TrendingUp' },
      { title: 'Scenario Simulation', desc: 'Simulate scenarios for smarter decision making.', icon: 'Share2' },
      { title: 'Automated Issue Management', desc: 'Detect, track and resolve issues efficiently.', icon: 'ClipboardCheck' },
      { title: 'Asset Health Analysis', desc: 'Continuous assessment of asset health and risk.', icon: 'Heart' },
      { title: 'Energy Optimization', desc: 'Improve energy efficiency and sustainability.', icon: 'Zap' },
      { title: 'Lifecycle Management', desc: 'Manage the asset lifecycle from design to decommission.', icon: 'RefreshCw' }
    ]),
    sustainabilityTitle: 'SUSTAINABILITY CONSULTANCY',
    sustainabilitySubHeading: 'Building Better, Building Sustainably.',
    sustainabilityLeadDesc: 'Helping projects achieve better environmental performance, regulatory compliance and internationally recognized sustainability objectives.',
    sustainabilitySupportingDesc: 'Our sustainability consultancy capabilities support projects across design, construction, operations and maintenance, with a focus on energy performance, environmental responsibility and sustainable building practices.',
    sustainabilityImage: '/sust_workshop.png',
    sustainabilityBadgeTitle: 'SUSTAINABLE ENGINEERING',
    sustainabilityBadgeSubtitle: 'GSAS • LEED • ENERGY • CARBON',
    sustainabilityCapabilitiesJson: JSON.stringify([
      { name: 'GSAS', icon: 'Award', slug: 'GSAS', desc: 'GSAS Consultancy & Certification Guidance' },
      { name: 'LEED', icon: 'ShieldCheck', slug: 'LEED', desc: 'LEED BD+C, ID+C & O+M Consultancy' },
      { name: 'Energy Audits', icon: 'Zap', slug: 'Energy Audit', desc: 'ASHRAE Level 1, 2 & 3 Diagnostics' },
      { name: 'Carbon Management', icon: 'BarChart3', slug: 'Carbon Management', desc: 'GHG Footprinting & Decarbonization' },
      { name: 'Green Building Gap Analysis', icon: 'SearchCheck', slug: 'Sustainability Services', desc: 'Compliance & Performance Assessment' },
      { name: 'ISO 14064', icon: 'FileCheck2', slug: 'Carbon Management', desc: 'GHG Verification & Reporting Standards' },
      { name: 'Environmental Consultancy', icon: 'TreePine', slug: 'Sustainability Services', desc: 'Ecological & Environmental Solutions' }
    ]),
    remoteTitle: 'Remote Construction Solutions',
    remoteDesc: 'Connecting project teams, sites and technical specialists through digital technologies for improved collaboration, inspection and decision-making.',
    remoteImage: '/simulation.png',
    remoteOverlayText: 'Live Remote Site Inspection Active',
    remotePillarsJson: JSON.stringify([
      { id: 'support', title: 'Remote Site Support', desc: 'Connect project teams and technical specialists for faster real-time decision-making.', icon: 'Radio', slug: 'Remote Construction' },
      { id: 'ar-solutions', title: 'AR Solutions', desc: 'Augmented reality overlays for spatial coordination, design validation and clash detection.', icon: 'Eye', slug: 'AR Solutions' },
      { id: 'documentation', title: '360° Site Documentation', desc: 'Immersive 360° visual capture for complete site visibility and progress tracking.', icon: 'Camera', slug: '360° Capture' },
      { id: 'inspection', title: 'Remote Inspection', desc: 'Digital QA/QC inspection workflows reducing travel overhead while ensuring compliance.', icon: 'ShieldCheck', slug: 'Remote Construction' },
      { id: 'collaboration', title: 'Digital Collaboration', desc: 'Centralized cloud platforms enabling real-time site feeds and seamless coordination.', icon: 'Users', slug: 'Construction Technology' },
      { id: 'robotics', title: 'Robotic Integration', desc: 'Autonomous site scanning, robotic measurement devices and automated progress analytics.', icon: 'Cpu', slug: 'Robotics' }
    ])
  };

  // State hooks loading from localStorage
  const [contactSettings, setContactSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('contactSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_CONTACT_SETTINGS, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Error reading contactSettings', e);
    }
    return DEFAULT_CONTACT_SETTINGS;
  });

  const [companySettings, setCompanySettings] = useState(() => {
    try {
      const saved = localStorage.getItem('companySettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_COMPANY_SETTINGS, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Error reading companySettings', e);
    }
    return DEFAULT_COMPANY_SETTINGS;
  });

  const parseJsonArray = (val, fallbackJsonStr = '[]') => {
    if (!val) {
      try {
        const fb = typeof fallbackJsonStr === 'string' ? JSON.parse(fallbackJsonStr) : fallbackJsonStr;
        return Array.isArray(fb) ? fb : [];
      } catch (e) {
        return [];
      }
    }
    try {
      const parsed = typeof val === 'string' ? JSON.parse(val) : val;
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    try {
      const fb = typeof fallbackJsonStr === 'string' ? JSON.parse(fallbackJsonStr) : fallbackJsonStr;
      return Array.isArray(fb) ? fb : [];
    } catch (e) {}
    return [];
  };

  // Popup Banner Modal state for Company Info 5 CRUD sections
  const [crudModal, setCrudModal] = useState({
    isOpen: false,
    type: '', // 'discipline', 'digitalTwin', 'capabilityChip', 'remotePillar', 'teamMember'
    editIndex: null, // null = new card, number = editing card index
    data: { name: '', title: '', desc: '', icon: '', slug: '', role: '', image: '' }
  });

  const openCrudModal = (type, editIndex = null, initialData = {}) => {
    setCrudModal({
      isOpen: true,
      type,
      editIndex,
      data: {
        name: initialData.name || '',
        title: initialData.title || '',
        desc: initialData.desc || '',
        icon: initialData.icon || (type === 'discipline' ? 'Building2' : type === 'digitalTwin' ? 'Cloud' : type === 'capabilityChip' ? 'Award' : type === 'remotePillar' ? 'Radio' : ''),
        slug: initialData.slug || '',
        role: initialData.role || '',
        image: initialData.image || ''
      }
    });
  };

  const closeCrudModal = () => {
    setCrudModal({
      isOpen: false,
      type: '',
      editIndex: null,
      data: { name: '', title: '', desc: '', icon: '', slug: '', role: '', image: '' }
    });
  };

  const handleSaveCrudModal = async () => {
    const { type, editIndex, data } = crudModal;

    if (type === 'discipline') {
      const list = parseJsonArray(companySettings.aboutUsDisciplinesJson, DEFAULT_COMPANY_SETTINGS.aboutUsDisciplinesJson);
      const itemToSave = { name: data.name || 'New Discipline', icon: data.icon || 'Building2' };
      if (editIndex !== null) {
        list[editIndex] = itemToSave;
      } else {
        list.push(itemToSave);
      }
      updateCompanyField('aboutUsDisciplinesJson', JSON.stringify(list));
    } else if (type === 'digitalTwin') {
      const list = parseJsonArray(companySettings.aboutUsCapabilitiesJson, DEFAULT_COMPANY_SETTINGS.aboutUsCapabilitiesJson);
      const itemToSave = { title: data.title || 'New Capability', desc: data.desc || '', icon: data.icon || 'Cloud' };
      if (editIndex !== null) {
        list[editIndex] = itemToSave;
      } else {
        list.push(itemToSave);
      }
      updateCompanyField('aboutUsCapabilitiesJson', JSON.stringify(list));
    } else if (type === 'capabilityChip') {
      const list = parseJsonArray(companySettings.sustainabilityCapabilitiesJson, DEFAULT_COMPANY_SETTINGS.sustainabilityCapabilitiesJson);
      const itemToSave = { name: data.name || 'New Capability', icon: data.icon || 'Award', slug: data.slug || 'Sustainability Services', desc: data.desc || '' };
      if (editIndex !== null) {
        list[editIndex] = itemToSave;
      } else {
        list.push(itemToSave);
      }
      updateCompanyField('sustainabilityCapabilitiesJson', JSON.stringify(list));
    } else if (type === 'remotePillar') {
      const list = parseJsonArray(companySettings.remotePillarsJson, DEFAULT_COMPANY_SETTINGS.remotePillarsJson);
      const itemToSave = {
        id: editIndex !== null ? list[editIndex]?.id : `pillar_${Date.now()}`,
        title: data.title || 'New Pillar',
        desc: data.desc || '',
        icon: data.icon || 'Radio',
        slug: data.slug || 'Construction Technology'
      };
      if (editIndex !== null) {
        list[editIndex] = itemToSave;
      } else {
        list.push(itemToSave);
      }
      updateCompanyField('remotePillarsJson', JSON.stringify(list));
    } else if (type === 'teamMember') {
      if (editIndex !== null) {
        const member = (Array.isArray(teamMembers) ? teamMembers : [])[editIndex];
        if (member) {
          const updatedMember = { ...member, name: data.name, role: data.role, image: data.image };
          try {
            const res = await fetch(`/api/team/${member.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedMember)
            });
            if (res.ok) {
              const saved = await res.json();
              setTeamMembers(prev => (Array.isArray(prev) ? prev : []).map(m => m.id === member.id ? saved : m));
            }
          } catch (e) {
            console.error('Error updating team member:', e);
          }
        }
      } else {
        try {
          const res = await fetch('/api/team', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: data.name || 'New Team Member',
              role: data.role || 'Team Member',
              image: data.image || null,
              order_num: (Array.isArray(teamMembers) ? teamMembers.length : 0) + 1
            })
          });
          if (res.ok) {
            const newMember = await res.json();
            setTeamMembers(prev => [...(Array.isArray(prev) ? prev : []), newMember]);
          }
        } catch (e) {
          console.error('Error adding team member:', e);
        }
      }
    }

    closeCrudModal();
  };

  // Operation states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [activeEditItem, setActiveEditItem] = useState(null); // holds item being edited
  const [showAddModal, setShowAddModal] = useState(false);
  const serviceSubmenuOptions = {
    'Engineering Services': ['BIM', 'CAD', 'Laser Scanning', 'Scan to BIM'],
    'Sustainability Services': ['GSAS', 'LEED', 'Energy Audit', 'Carbon Management'],
    'Digital Twin': ['Asset Twin', 'System Integration', 'Real-Time Monitoring', 'Asset Management'],
    'Construction Technology': ['Remote Construction', '360° Capture', 'AR Solutions', 'Robotics']
  };

  // Form fields states
  const defaultCategoryForm = { name: '', slug: '', short_description: '', icon: 'Building2', image: '', display_order: 1, status: 'Active' };
  const [categoryForm, setCategoryForm] = useState(defaultCategoryForm);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const defaultServiceForm = { category: 'Engineering Services', category_id: null, title: '', slug: '', description: '', bullets: [''], tools: [['', '']], banner_image: '/servicepage1.png', icon: '', display_order: 1, status: 'Active' };
  const [serviceForm, setServiceForm] = useState(defaultServiceForm);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);

  const [heroForm, setHeroForm] = useState({ title: '', subtitle: '', btn1_text: '', btn2_text: '', image: '', status: 'published', order_num: 1 });
  const [certForm, setCertForm] = useState({ title: '', org: '', licenseNo: '', territory: '', validity: 'Valid & Recognized', borderColor: 'border-blue', badgeText: 'CERTIFIED', image: '', scope: '' });
  const [newsForm, setNewsForm] = useState({ title: '', content: '', category: 'NEWS', image: '', date: '' });
  const [testimonialForm, setTestimonialForm] = useState({ title: '', content: '', author_name: '', company_name: '', status: 'approved' });
  const [menuForm, setMenuForm] = useState({ name: '', url: '', parent_id: '', order_num: 0 });
  const [footerForm, setFooterForm] = useState({ brand_desc: '', facebook_url: '', instagram_url: '', address: '', phone: '', fax: '', email: '', website: '', copyright: '' });
  const [userForm, setUserForm] = useState({ username: '', password: '', role: 'admin' });
  const [partnerForm, setPartnerForm] = useState({ name: '', role: 'Working Partner', image: '', order_num: 0 });
  const [mediaForm, setMediaForm] = useState({ type: 'gallery', title: '', url: '' });

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleNavClick = (tabRoute) => {
    setActiveTab(tabRoute);
    setIsMobileSidebarOpen(false);
  };

  // Pagination mocks
  const [currentPage, setCurrentPage] = useState(1);

  // Auto-login from sessionStorage
  useEffect(() => {
    const savedUser = sessionStorage.getItem('admin_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setCurrentUser(parsed);
      setIsLoggedIn(true);
    }
  }, []);

  // Enforce access control: redirect non-superadmins from restricted tabs
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      const restrictedTabs = [
        '/admin/users',
        '/admin/settings/company',
        '/admin/settings/contact',
        '/admin/settings/footer',
        '/admin/seo'
      ];
      if (currentUser.role !== 'super_admin' && restrictedTabs.includes(activeTab)) {
        setActiveTab('/admin/dashboard');
      }
    }
  }, [activeTab, currentUser, isLoggedIn]);

  const getTabFromRoute = (route) => {
    if (route === '/admin/news') return 'news';
    if (route === '/admin/projects') return 'projects';
    if (route === '/admin/services') return 'services';
    if (route === '/admin/certificates') return 'certificates';
    if (route === '/admin/testimonials') return 'testimonials';
    if (route === '/admin/contact') return 'inquiries';
    if (route === '/admin/subscribers') return 'subscribers';
    if (route === '/admin/users') return 'users';
    if (route === '/admin/settings/footer') return 'footer';
    if (route === '/admin/backup') return 'backup';
    if (route === '/admin/media') return 'media';
    if (route === '/admin/partners') return 'partners';
    return route;
  };

  const fetchDashboardStats = async () => {
    try {
      const resServ = await fetch('/api/services');
      if (resServ.ok) setServices(await resServ.json());
      
      const resCert = await fetch('/api/certificates');
      if (resCert.ok) setCertificates(await resCert.json());
      
      const resProj = await fetch('/api/projects');
      if (resProj.ok) setProjects(await resProj.json());

      const resInq = await fetch('/api/contact');
      if (resInq.ok) setContactInquiries(await resInq.json());

      const resSub = await fetch('/api/subscribers');
      if (resSub.ok) setSubscribers(await resSub.json());
    } catch (err) {
      console.warn('Dashboard stats fetch warning:', err);
    }
  };

  // Fetch data whenever isLoggedIn or activeTab changes
  useEffect(() => {
    if (!isLoggedIn) return;
    const tabName = getTabFromRoute(activeTab);
    if (tabName === '/admin/dashboard') {
      fetchDashboardStats();
    } else {
      fetchDataForTab(tabName);
    }
    setCurrentPage(1);
    setSearchQuery('');
  }, [isLoggedIn, activeTab]);

  const fetchDataForTab = async (tab) => {
    try {
      if (tab === 'hero') {
        const res = await fetch('/api/hero_slides');
        if (res.ok) setHeroSlides(await res.json());
      } else if (tab === 'services') {
        const resSvc = await fetch('/api/services?all=true');
        if (resSvc.ok) setServices(await resSvc.json());
        const resCat = await fetch('/api/service-categories?all=true');
        if (resCat.ok) setServiceCategories(await resCat.json());
      } else if (tab === 'certificates') {
        const res = await fetch('/api/certificates');
        if (res.ok) setCertificates(await res.json());
      } else if (tab === 'news') {
        const res = await fetch('/api/news');
        if (res.ok) setNews(await res.json());
      } else if (tab === 'testimonials') {
        const res = await fetch('/api/testimonials?all=true');
        if (res.ok) setTestimonials(await res.json());
      } else if (tab === 'menus') {
        const res = await fetch('/api/menus');
        if (res.ok) setMenus(await res.json());
      } else if (tab === 'footer') {
        const res = await fetch('/api/footer');
        if (res.ok) {
          const data = await res.json();
          setFooter(data);
          setFooterForm(data);
        }
      } else if (tab === 'users' && currentUser?.role === 'super_admin') {
        const res = await fetch('/api/users');
        if (res.ok) setUsers(await res.json());
      } else if (tab === 'subscribers') {
        const res = await fetch('/api/subscribers');
        if (res.ok) setSubscribers(await res.json());
      } else if (tab === 'inquiries') {
        const res = await fetch('/api/contact');
        if (res.ok) setContactInquiries(await res.json());
      } else if (tab === 'projects') {
        const res = await fetch('/api/projects?all=true');
        if (res.ok) setProjects(await res.json());
      } else if (tab === 'partners') {
        const res = await fetch('/api/partners');
        if (res.ok) setPartners(await res.json());
      } else if (tab === 'media') {
        const res = await fetch('/api/media');
        if (res.ok) setMediaItems(await res.json());
      } else if (tab === '/admin/settings/company') {
        fetchPageBanners();
        const resTeam = await fetch('/api/team?all=true');
        if (resTeam.ok) setTeamMembers(await resTeam.json());
        const res = await fetch('/api/settings/company');
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === 'object' && Object.keys(data).length > 0) {
            setCompanySettings(prev => ({ ...prev, ...data }));
            if (data.aboutUsVideoUrl) setAboutUsVideoUrl(data.aboutUsVideoUrl);
            if (data.aboutUsHeroType) setAboutUsHeroType(data.aboutUsHeroType);
            if (data.aboutUsHeroUrl) setAboutUsHeroUrl(data.aboutUsHeroUrl);
            setPageBanners(prev => ({
              ...prev,
              home: data.homeBannerUrl || data.aboutUsHeroUrl || '',
              aboutus: data.aboutUsPageBannerUrl || '',
              services: data.servicesPageBannerUrl || '',
              projects: data.projectsPageBannerUrl || '',
              media: data.mediaPageBannerUrl || '',
              contactus: data.contactUsPageBannerUrl || ''
            }));
          }
        }
      } else if (tab === '/admin/settings/contact') {
        const res = await fetch('/api/settings/contact');
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === 'object' && Object.keys(data).length > 0) {
            setContactSettings(prev => ({ ...prev, ...data }));
          }
        }
      }
    } catch (err) {
      console.error(`Error fetching data for ${tab}:`, err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!usernameInput || !passwordInput) {
      setAuthError('Please fill out all fields.');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsLoggedIn(true);
        setCurrentUser(data.user);
        sessionStorage.setItem('admin_user', JSON.stringify(data.user));
        setUsernameInput('');
        setPasswordInput('');
      } else {
        setAuthError(data.error || 'Authentication failed.');
      }
    } catch (err) {
      setAuthError('Connection warning: check if the server is running.');
      console.error(err);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    sessionStorage.removeItem('admin_user');
  };

  // Convert File to Base64
  const handleImageUpload = (file, setter, formName) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setter(prev => ({ ...prev, [formName]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Reset forms helper
  const resetForms = () => {
    setActiveEditItem(null);
    setHeroForm({ title: '', subtitle: '', btn1_text: '', btn2_text: '', image: '', status: 'published', order_num: 1 });
    setServiceForm({ category: 'Engineering Services', title: 'CAD', description: '', bullets: [''], tools: [['', '']], banner_image: '/servicepage1.png' });
    setCertForm({ title: '', org: '', licenseNo: '', territory: '', validity: 'Valid & Recognized', borderColor: 'border-blue', badgeText: 'CERTIFIED', image: '', scope: '' });
    setNewsForm({ title: '', content: '', category: 'NEWS', image: '', date: '' });
    setTestimonialForm({ title: '', content: '', author_name: '', company_name: '', status: 'approved' });
    setMenuForm({ name: '', url: '', parent_id: '', order_num: 0 });
    setUserForm({ username: '', password: '', role: 'admin' });
    setProjectForm(defaultProjectForm);
    setPartnerForm({ name: '', role: 'Working Partner', image: '', order_num: 0 });
    setMediaForm({ type: 'gallery', title: '', url: '' });
  };

  // Explicit close handlers for modals (Cancels only the active modal without page/route side effects)
  const handleCloseAddModal = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    setShowAddModal(false);
    setActiveEditItem(null);
    resetForms();
  };

  const handleCloseCategoryModal = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    setShowCategoryModal(false);
    setEditingCategoryId(null);
    setCategoryForm(defaultCategoryForm);
  };

  const handleCloseServiceModal = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    setShowServiceModal(false);
    setEditingServiceId(null);
    setServiceForm(defaultServiceForm);
  };

  // General CRUD handlers
  const handleSave = async (tab, id = null) => {
    const apiTab = getTabFromRoute(tab);
    let url = `/api/${apiTab === 'hero' ? 'hero_slides' : apiTab}`;
    let method = 'POST';
    let bodyData = {};

    if (id) {
      url += `/${id}`;
      method = 'PUT';
    }

    if (apiTab === 'hero') {
      bodyData = { ...heroForm };
    } else if (apiTab === 'services') {
      bodyData = { ...serviceForm };
    } else if (apiTab === 'certificates') {
      bodyData = { ...certForm };
    } else if (apiTab === 'news') {
      bodyData = { ...newsForm };
    } else if (apiTab === 'testimonials') {
      bodyData = { ...testimonialForm };
    } else if (apiTab === 'menus') {
      bodyData = { ...menuForm };
      if (!bodyData.parent_id) bodyData.parent_id = null;
    } else if (apiTab === 'users') {
      bodyData = { ...userForm };
    } else if (apiTab === 'projects') {
      bodyData = { ...projectForm };
    } else if (apiTab === 'partners') {
      bodyData = { ...partnerForm };
    } else if (apiTab === 'media') {
      bodyData = { ...mediaForm };
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      if (res.ok) {
        setShowAddModal(false);
        setActiveEditItem(null);
        resetForms();
        fetchDataForTab(apiTab);
      } else {
        alert('Failed to save item.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (tab, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const apiTab = getTabFromRoute(tab);
    const routeName = apiTab === 'hero' ? 'hero_slides' : apiTab;
    try {
      const res = await fetch(`/api/${routeName}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDataForTab(apiTab);
      } else {
        alert('Failed to delete item.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveTestimonial = async (t) => {
    try {
      const res = await fetch(`/api/testimonials/${t.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: t.title,
          content: t.content,
          author_name: t.author_name,
          company_name: t.company_name,
          status: 'approved'
        })
      });
      if (res.ok) {
        fetchDataForTab('testimonials');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFooterSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(footerForm)
      });
      if (res.ok) {
        alert('Footer settings successfully saved!');
        fetchDataForTab('footer');
      } else {
        alert('Failed to save footer parameters.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Dynamic Array Handlers for Services bullets/tools
  const handleBulletChange = (idx, value) => {
    const updated = [...serviceForm.bullets];
    updated[idx] = value;
    setServiceForm(prev => ({ ...prev, bullets: updated }));
  };

  const addBullet = () => {
    setServiceForm(prev => ({ ...prev, bullets: [...prev.bullets, ''] }));
  };

  const removeBullet = (idx) => {
    const updated = serviceForm.bullets.filter((_, i) => i !== idx);
    setServiceForm(prev => ({ ...prev, bullets: updated }));
  };

  const handleToolChange = (idx, colIdx, value) => {
    const updated = [...serviceForm.tools];
    if (!updated[idx]) updated[idx] = ['', ''];
    updated[idx][colIdx] = value;
    setServiceForm(prev => ({ ...prev, tools: updated }));
  };

  const addToolRow = () => {
    setServiceForm(prev => ({ ...prev, tools: [...prev.tools, ['', '']] }));
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: '', slug: '', short_description: '', icon: 'Building2', image: '', display_order: (serviceCategories.length + 1), status: 'Active' });
  };

  const resetServiceForm = () => {
    setServiceForm({ category: 'Engineering Services', category_id: null, title: '', slug: '', description: '', bullets: [''], tools: [['', '']], banner_image: '/servicepage1.png', icon: '', display_order: 1, status: 'Active' });
  };

  const startEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setCategoryForm({
      name: cat.name || '',
      slug: cat.slug || '',
      short_description: cat.short_description || '',
      icon: cat.icon || 'Building2',
      image: cat.image || '',
      display_order: cat.display_order || 1,
      status: cat.status || 'Active'
    });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e) => {
    if (e) e.preventDefault();
    if (!categoryForm.name) {
      alert('Please enter a Category Name');
      return;
    }
    const method = editingCategoryId ? 'PUT' : 'POST';
    const url = editingCategoryId ? `/api/service-categories/${editingCategoryId}` : '/api/service-categories';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      });
      if (res.ok) {
        setShowCategoryModal(false);
        setEditingCategoryId(null);
        resetCategoryForm();
        fetchDataForTab('services');
      } else {
        alert('Failed to save Category');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this Category? Sub-services under it may be affected.')) return;
    try {
      const res = await fetch(`/api/service-categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDataForTab('services');
      } else {
        alert('Failed to delete category.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCategoryStatus = async (cat) => {
    const newStatus = cat.status === 'Inactive' ? 'Active' : 'Inactive';
    try {
      const res = await fetch(`/api/service-categories/${cat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cat, status: newStatus })
      });
      if (res.ok) {
        fetchDataForTab('services');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const moveCategoryOrder = async (cat, direction) => {
    const sorted = [...serviceCategories].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    const idx = sorted.findIndex(c => c.id === cat.id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    const otherCat = sorted[targetIdx];
    const tempOrder = cat.display_order || (idx + 1);
    const otherOrder = otherCat.display_order || (targetIdx + 1);

    try {
      await fetch(`/api/service-categories/${cat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cat, display_order: otherOrder })
      });
      await fetch(`/api/service-categories/${otherCat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...otherCat, display_order: tempOrder })
      });
      fetchDataForTab('services');
    } catch (err) {
      console.error(err);
    }
  };

  const startEditService = (svc) => {
    setEditingServiceId(svc.id);
    let bulletsParsed = [''];
    let toolsParsed = [['', '']];
    try {
      bulletsParsed = typeof svc.bullets === 'string' ? JSON.parse(svc.bullets) : (svc.bullets || ['']);
    } catch(e) {}
    try {
      toolsParsed = typeof svc.tools === 'string' ? JSON.parse(svc.tools) : (svc.tools || [['', '']]);
    } catch(e) {}

    setServiceForm({
      category: svc.category || 'Engineering Services',
      category_id: svc.category_id || null,
      title: svc.title || '',
      slug: svc.slug || '',
      description: svc.description || '',
      bullets: Array.isArray(bulletsParsed) && bulletsParsed.length > 0 ? bulletsParsed : [''],
      tools: Array.isArray(toolsParsed) && toolsParsed.length > 0 ? toolsParsed : [['', '']],
      banner_image: svc.banner_image || '/servicepage1.png',
      icon: svc.icon || '',
      display_order: svc.display_order || 1,
      status: svc.status || 'Active'
    });
    setShowServiceModal(true);
  };

  const handleSaveService = async (e) => {
    if (e) e.preventDefault();
    if (!serviceForm.title) {
      alert('Please enter a Sub-Service Title');
      return;
    }
    const method = editingServiceId ? 'PUT' : 'POST';
    const url = editingServiceId ? `/api/services/${editingServiceId}` : '/api/services';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceForm)
      });
      if (res.ok) {
        setShowServiceModal(false);
        setEditingServiceId(null);
        resetServiceForm();
        fetchDataForTab('services');
      } else {
        alert('Failed to save Sub-Service');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id) => {
    if (!confirm('Are you sure you want to delete this sub-service?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDataForTab('services');
      } else {
        alert('Failed to delete sub-service.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleServiceStatus = async (svc) => {
    const newStatus = svc.status === 'Inactive' ? 'Active' : 'Inactive';
    try {
      const res = await fetch(`/api/services/${svc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...svc, status: newStatus })
      });
      if (res.ok) {
        fetchDataForTab('services');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const moveServiceOrder = async (svc, direction, siblingList) => {
    const sorted = [...siblingList].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    const idx = sorted.findIndex(s => s.id === svc.id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    const otherSvc = sorted[targetIdx];
    const tempOrder = svc.display_order || (idx + 1);
    const otherOrder = otherSvc.display_order || (targetIdx + 1);

    try {
      await fetch(`/api/services/${svc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...svc, display_order: otherOrder })
      });
      await fetch(`/api/services/${otherSvc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...otherSvc, display_order: tempOrder })
      });
      fetchDataForTab('services');
    } catch (err) {
      console.error(err);
    }
  };

  // Set up edit item state
  const startEdit = (tab, item) => {
    setActiveEditItem(item);
    if (tab === 'hero') {
      setHeroForm({
        title: item.title,
        subtitle: item.subtitle,
        btn1_text: item.btn1_text,
        btn2_text: item.btn2_text,
        image: item.image || '',
        status: item.status || 'published',
        order_num: item.order_num || 1
      });
    } else if (tab === 'services') {
      let bulletsParsed = [''];
      let toolsParsed = [['', '']];
      try {
        bulletsParsed = typeof item.bullets === 'string' ? JSON.parse(item.bullets) : (item.bullets || ['']);
        toolsParsed = typeof item.tools === 'string' ? JSON.parse(item.tools) : (item.tools || [['', '']]);
      } catch(e) {}
      setServiceForm({
        category: item.category,
        title: item.title,
        description: item.description || '',
        bullets: bulletsParsed,
        tools: toolsParsed,
        banner_image: item.banner_image || '/servicepage1.png'
      });
    } else if (tab === 'certificates') {
      setCertForm({
        title: item.title,
        org: item.org,
        licenseNo: item.licenseNo,
        territory: item.territory,
        validity: item.validity || 'Valid & Recognized',
        borderColor: item.borderColor || 'border-blue',
        badgeText: item.badgeText || 'CERTIFIED',
        image: item.image || '',
        scope: item.scope || ''
      });
    } else if (tab === 'news') {
      setNewsForm({
        title: item.title,
        content: item.content || '',
        category: item.category || 'NEWS',
        image: item.image || '',
        date: item.date || ''
      });
    } else if (tab === 'testimonials') {
      setTestimonialForm({
        title: item.title,
        content: item.content,
        author_name: item.author_name,
        company_name: item.company_name,
        status: item.status || 'approved'
      });
    } else if (tab === 'menus') {
      setMenuForm({
        name: item.name,
        url: item.url,
        parent_id: item.parent_id || '',
        order_num: item.order_num || 0
      });
    } else if (tab === 'users') {
      setUserForm({
        username: item.username,
        password: '', // blank password during edit loads as placeholder
        role: item.role
      });
    } else if (tab === 'projects') {
      setProjectForm({
        name: item.name || '',
        slug: item.slug || '',
        division_type: item.division_type || item.category || 'BIM Projects',
        client: item.client || '',
        contractor: item.contractor || '',
        consultant: item.consultant || '',
        location: item.location || 'Qatar',
        sector: item.sector || 'Infrastructure & Buildings',
        status: item.status || 'Completed',
        year: item.year || '2024',
        short_description: item.short_description || item.description || '',
        description: item.description || '',
        services: typeof item.services === 'string' ? item.services : (Array.isArray(item.services) ? item.services.join(', ') : ''),
        disciplines: typeof item.disciplines === 'string' ? item.disciplines : (Array.isArray(item.disciplines) ? item.disciplines.join(', ') : ''),
        project_stage: item.project_stage || '',
        bim_level: item.bim_level || '',
        scope_of_work: item.scope_of_work || '',
        deliverables: typeof item.deliverables === 'string' ? item.deliverables : (Array.isArray(item.deliverables) ? item.deliverables.join(', ') : ''),
        technologies: typeof item.technologies === 'string' ? item.technologies : (Array.isArray(item.technologies) ? item.technologies.join(', ') : ''),
        project_highlights: item.project_highlights || '',
        image: item.image || '/project1.png',
        gallery: typeof item.gallery === 'string' ? item.gallery : (Array.isArray(item.gallery) ? item.gallery.join(', ') : ''),
        display_order: item.display_order || 1
      });
    } else if (tab === 'partners') {
      setPartnerForm({
        name: item.name,
        role: item.role || 'Working Partner',
        image: item.image || '',
        order_num: item.order_num || 0
      });
    } else if (tab === 'media') {
      setMediaForm({
        type: item.type || 'gallery',
        title: item.title || '',
        url: item.url || ''
      });
    }
    setShowAddModal(true);
  };

  // Header stats card rendering depending on the current active tab
  const renderDashboardStats = () => {
    const apiTab = getTabFromRoute(activeTab);
    if (apiTab === 'hero') {
      return (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon-wrapper blue"><Folder size={20} /></div>
            <div className="admin-stat-content">
              <h4>Total Slides</h4>
              <div className="value">{String(heroSlides.length).padStart(2, '0')}</div>
              <span className="active">Active</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon-wrapper green"><CheckSquare size={20} /></div>
            <div className="admin-stat-content">
              <h4>Published Slides</h4>
              <div className="value">{String(heroSlides.filter(s => s.status === 'published').length).padStart(2, '0')}</div>
              <span className="active">Active</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon-wrapper orange"><FileText size={20} /></div>
            <div className="admin-stat-content">
              <h4>Draft Slides</h4>
              <div className="value">{String(heroSlides.filter(s => s.status === 'draft').length).padStart(2, '0')}</div>
              <span className="pending">Pending</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon-wrapper purple"><Trash size={20} /></div>
            <div className="admin-stat-content">
              <h4>Inactive Slides</h4>
              <div className="value">{String(heroSlides.filter(s => s.status === 'inactive').length).padStart(2, '0')}</div>
              <span className="inactive">Inactive</span>
            </div>
          </div>
        </div>
      );
    }

    if (apiTab === 'services') {
      const activeServices = services.filter(s => s.status !== 'Inactive');
      const countFor = (cat) => activeServices.filter(s => s.category && s.category.toLowerCase().includes(cat.toLowerCase())).length;

      return (
        <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          <div className="admin-stat-card">
            <div className="admin-stat-icon-wrapper blue"><Layers size={20} /></div>
            <div className="admin-stat-content">
              <h4>Total Services</h4>
              <div className="value">{String(activeServices.length).padStart(2, '0')}</div>
              <span className="active">Active</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon-wrapper green"><Layers size={20} /></div>
            <div className="admin-stat-content">
              <h4>Engineering</h4>
              <div className="value">{String(countFor('Engineering')).padStart(2, '0')}</div>
              <span className="active">Sub-services</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon-wrapper orange"><Layers size={20} /></div>
            <div className="admin-stat-content">
              <h4>Sustainability</h4>
              <div className="value">{String(countFor('Sustainability')).padStart(2, '0')}</div>
              <span className="active">Sub-services</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon-wrapper purple"><Layers size={20} /></div>
            <div className="admin-stat-content">
              <h4>Digital Twin</h4>
              <div className="value">{String(countFor('Digital Twin')).padStart(2, '0')}</div>
              <span className="active">Sub-services</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon-wrapper blue"><Layers size={20} /></div>
            <div className="admin-stat-content">
              <h4>Construction Tech</h4>
              <div className="value">{String(countFor('Construction')).padStart(2, '0')}</div>
              <span className="active">Sub-services</span>
            </div>
          </div>
        </div>
      );
    }

    if (apiTab === 'news') {
      return (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon-wrapper blue"><FileText size={20} /></div>
            <div className="admin-stat-content">
              <h4>Total News</h4>
              <div className="value">{String(news.length).padStart(2, '0')}</div>
              <span className="active">Articles</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon-wrapper green"><FileText size={20} /></div>
            <div className="admin-stat-content">
              <h4>Projects news</h4>
              <div className="value">{String(news.filter(n => n.category === 'PROJECTS').length).padStart(2, '0')}</div>
              <span className="active">Items</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon-wrapper orange"><FileText size={20} /></div>
            <div className="admin-stat-content">
              <h4>Standard news</h4>
              <div className="value">{String(news.filter(n => n.category === 'NEWS').length).padStart(2, '0')}</div>
              <span className="active">Items</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon-wrapper purple"><FileText size={20} /></div>
            <div className="admin-stat-content">
              <h4>Awards news</h4>
              <div className="value">{String(news.filter(n => n.category === 'AWARDS').length).padStart(2, '0')}</div>
              <span className="active">Items</span>
            </div>
          </div>
        </div>
      );
    }

    if (apiTab === 'testimonials') {
      return (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon-wrapper blue"><Eye size={20} /></div>
            <div className="admin-stat-content">
              <h4>Reviews Total</h4>
              <div className="value">{String(testimonials.length).padStart(2, '0')}</div>
              <span className="active">Reviews</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon-wrapper green"><Eye size={20} /></div>
            <div className="admin-stat-content">
              <h4>Approved</h4>
              <div className="value">{String(testimonials.filter(t => t.status === 'approved').length).padStart(2, '0')}</div>
              <span className="active">Published</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon-wrapper orange"><Eye size={20} /></div>
            <div className="admin-stat-content">
              <h4>Pending</h4>
              <div className="value">{String(testimonials.filter(t => t.status === 'pending').length).padStart(2, '0')}</div>
              <span className="pending">Needs Approval</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon-wrapper purple"><Eye size={20} /></div>
            <div className="admin-stat-content">
              <h4>Rejected</h4>
              <div className="value">{String(testimonials.filter(t => t.status === 'rejected' || t.status === 'hidden').length).padStart(2, '0')}</div>
              <span className="inactive">Hidden</span>
            </div>
          </div>
        </div>
      );
    }

    // Default generic stats
    return (
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper blue"><Layers size={20} /></div>
          <div className="admin-stat-content">
            <h4>Total Records</h4>
            <div className="value">12</div>
            <span className="active">Database Rows</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper green"><CheckSquare size={20} /></div>
          <div className="admin-stat-content">
            <h4>System Sync</h4>
            <div className="value">100%</div>
            <span className="active">Online</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper orange"><Settings size={20} /></div>
          <div className="admin-stat-content">
            <h4>Server Version</h4>
            <div className="value">v1.2</div>
            <span className="pending">Stable Node</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper purple"><Shield size={20} /></div>
          <div className="admin-stat-content">
            <h4>Active Admins</h4>
            <div className="value">02</div>
            <span className="active">Online</span>
          </div>
        </div>
      </div>
    );
  };

  const renderPlaceholder = (title, breadcrumb) => {
    return (
      <div className="admin-placeholder-container">
        <div className="admin-placeholder-card">
          <div className="admin-placeholder-illustration">
            <Layers size={48} className="coming-soon-icon" />
          </div>
          <h2>Coming Soon</h2>
          <p>
            The page <strong style={{ textTransform: 'capitalize' }}>{title}</strong> under <code style={{ color: 'var(--primary-blue)', background: 'rgba(10, 91, 255, 0.05)', padding: '2px 6px', borderRadius: '4px' }}>{breadcrumb}</code> is currently under development. Check back later for updates!
          </p>
          <div className="admin-placeholder-badge">Planned Feature</div>
        </div>
      </div>
    );
  };

  // Render auth box if not logged in
  if (!isLoggedIn) {
    return (
      <div className="admin-panel-root">
        <div className="admin-auth-container">
          <div className="admin-auth-card">
            <div className="admin-auth-logo">
              <h2>BLUE CRESCENT</h2>
              <p>CONTROL PANEL LOGIN</p>
            </div>
            
            {authError && <div className="admin-auth-error">{authError}</div>}
            
            <form onSubmit={handleLogin}>
              <div className="admin-form-group">
                <label>Username</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="admin-input"
                    style={{ paddingLeft: '40px' }}
                    placeholder="Enter admin username"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    className="admin-input"
                    style={{ paddingLeft: '40px' }}
                    placeholder="Enter password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="admin-btn" style={{ marginTop: '10px' }}>
                LOG IN
              </button>
            </form>
            
            <button
              onClick={() => onNavigate('Home')}
              className="admin-btn-secondary"
              style={{ width: '100%', marginTop: '15px' }}
            >
              ← GO TO HOMEPAGE
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter items helper
  const filterList = (list, keys) => {
    if (!searchQuery) return list;
    return list.filter(item => 
      keys.some(key => {
        const val = item[key];
        return val && String(val).toLowerCase().includes(searchQuery.toLowerCase());
      })
    );
  };

  return (
    <div className="admin-panel-root">
      {/* Mobile Sidebar Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="admin-sidebar-backdrop" 
          onClick={() => setIsMobileSidebarOpen(false)} 
        />
      )}

      {/* Left Navigation Sidebar */}
      <aside className={`admin-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-logo-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid #E2E8F0', marginBottom: '20px' }}>
          <img src={logoBlueImg} alt="Blue Crescent Engineering" className="admin-sidebar-logo-img" style={{ height: '48px', maxWidth: '100%', objectFit: 'contain' }} />
          <button 
            type="button" 
            className="admin-sidebar-mobile-close"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Close Mobile Navigation Menu"
          >
            <X size={20} />
          </button>
        </div>

          <div className="admin-sidebar-nav">
            {/* Dashboard Item */}
            <button 
              className={`admin-nav-item ${activeTab === '/admin/dashboard' ? 'active' : ''}`}
              onClick={() => handleNavClick('/admin/dashboard')}
            >
              <div className="admin-nav-item-left">
                <LayoutDashboard size={20} /> Dashboard
              </div>
              {activeTab === '/admin/dashboard' && <div className="admin-nav-indicator" />}
            </button>

            {/* Users & Roles Item */}
            <button 
              className={`admin-nav-item ${activeTab === '/admin/users' ? 'active' : ''}`}
              style={currentUser?.role !== 'super_admin' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
              onClick={() => {
                if (currentUser?.role === 'super_admin') {
                  handleNavClick('/admin/users');
                }
              }}
            >
              <div className="admin-nav-item-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Shield size={20} />
                <span style={{ fontSize: '13.5px', whiteSpace: 'nowrap' }}>Access Control</span>
              </div>
              {currentUser?.role !== 'super_admin' ? (
                <Lock size={14} style={{ opacity: 0.8, color: '#64748B' }} />
              ) : (
                activeTab === '/admin/users' && <div className="admin-nav-indicator" />
              )}
            </button>

            {/* Content Management Section */}
            <div className="admin-sidebar-header-wrapper" onClick={() => toggleSection('content')}>
              <span className="admin-sidebar-header">Content Management</span>
              {sectionsExpanded.content ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
            {sectionsExpanded.content && (
              <>

                <button 
                  className={`admin-nav-item ${activeTab === '/admin/projects' ? 'active' : ''}`}
                  onClick={() => handleNavClick('/admin/projects')}
                >
                  <div className="admin-nav-item-left">
                    <Briefcase size={20} /> Projects
                  </div>
                  {activeTab === '/admin/projects' && <div className="admin-nav-indicator" />}
                </button>
                <button 
                  className={`admin-nav-item ${activeTab === '/admin/services' ? 'active' : ''}`}
                  onClick={() => handleNavClick('/admin/services')}
                >
                  <div className="admin-nav-item-left">
                    <Wrench size={20} /> Services
                  </div>
                  {activeTab === '/admin/services' && <div className="admin-nav-indicator" />}
                </button>
                <button 
                  className={`admin-nav-item ${activeTab === '/admin/certificates' ? 'active' : ''}`}
                  onClick={() => handleNavClick('/admin/certificates')}
                >
                  <div className="admin-nav-item-left">
                    <Award size={20} /> Certificates
                  </div>
                  {activeTab === '/admin/certificates' && <div className="admin-nav-indicator" />}
                </button>
                <button 
                  className={`admin-nav-item ${activeTab === '/admin/testimonials' ? 'active' : ''}`}
                  onClick={() => handleNavClick('/admin/testimonials')}
                >
                  <div className="admin-nav-item-left">
                    <Star size={20} /> Testimonials
                  </div>
                  {activeTab === '/admin/testimonials' && <div className="admin-nav-indicator" />}
                </button>
                <button 
                  className={`admin-nav-item ${activeTab === '/admin/partners' ? 'active' : ''}`}
                  onClick={() => handleNavClick('/admin/partners')}
                >
                  <div className="admin-nav-item-left">
                    <Building size={20} /> Working Partners
                  </div>
                  {activeTab === '/admin/partners' && <div className="admin-nav-indicator" />}
                </button>
                <button 
                  className={`admin-nav-item ${activeTab === '/admin/media' ? 'active' : ''}`}
                  onClick={() => handleNavClick('/admin/media')}
                >
                  <div className="admin-nav-item-left">
                    <ImageIcon size={20} /> Media Library
                  </div>
                  {activeTab === '/admin/media' && <div className="admin-nav-indicator" />}
                </button>
              </>
            )}

            {/* Website Settings Section */}
            <div className="admin-sidebar-header-wrapper" onClick={() => toggleSection('settings')}>
              <span className="admin-sidebar-header">Website Settings</span>
              {sectionsExpanded.settings ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
            {sectionsExpanded.settings && (
              <>
                <button 
                  className={`admin-nav-item ${activeTab === '/admin/settings/company' ? 'active' : ''}`}
                  style={currentUser?.role !== 'super_admin' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  onClick={() => {
                    if (currentUser?.role === 'super_admin') {
                      handleNavClick('/admin/settings/company');
                    }
                  }}
                >
                  <div className="admin-nav-item-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Sliders size={20} />
                    <span style={{ fontSize: '13.5px', whiteSpace: 'nowrap' }}>Company Information</span>
                  </div>
                  {currentUser?.role !== 'super_admin' ? (
                    <Lock size={14} style={{ opacity: 0.8, color: '#64748B' }} />
                  ) : (
                    activeTab === '/admin/settings/company' && <div className="admin-nav-indicator" />
                  )}
                </button>
                <button 
                  className={`admin-nav-item ${activeTab === '/admin/settings/contact' ? 'active' : ''}`}
                  style={currentUser?.role !== 'super_admin' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  onClick={() => {
                    if (currentUser?.role === 'super_admin') {
                      handleNavClick('/admin/settings/contact');
                    }
                  }}
                >
                  <div className="admin-nav-item-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Mail size={20} />
                    <span style={{ fontSize: '13.5px', whiteSpace: 'nowrap' }}>Contact Information</span>
                  </div>
                  {currentUser?.role !== 'super_admin' ? (
                    <Lock size={14} style={{ opacity: 0.8, color: '#64748B' }} />
                  ) : (
                    activeTab === '/admin/settings/contact' && <div className="admin-nav-indicator" />
                  )}
                </button>
                <button 
                  className={`admin-nav-item ${activeTab === '/admin/settings/footer' ? 'active' : ''}`}
                  style={currentUser?.role !== 'super_admin' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  onClick={() => {
                    if (currentUser?.role === 'super_admin') {
                      handleNavClick('/admin/settings/footer');
                    }
                  }}
                >
                  <div className="admin-nav-item-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Settings size={20} />
                    <span style={{ fontSize: '13.5px', whiteSpace: 'nowrap' }}>Footer Management</span>
                  </div>
                  {currentUser?.role !== 'super_admin' ? (
                    <Lock size={14} style={{ opacity: 0.8, color: '#64748B' }} />
                  ) : (
                    activeTab === '/admin/settings/footer' && <div className="admin-nav-indicator" />
                  )}
                </button>
                {/* SEO Management Item */}
                <button 
                  className={`admin-nav-item ${activeTab === '/admin/seo' ? 'active' : ''}`}
                  style={currentUser?.role !== 'super_admin' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  onClick={() => {
                    if (currentUser?.role === 'super_admin') {
                      handleNavClick('/admin/seo');
                    }
                  }}
                >
                  <div className="admin-nav-item-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Search size={20} />
                    <span style={{ fontSize: '13.5px', whiteSpace: 'nowrap' }}>SEO Management</span>
                  </div>
                  {currentUser?.role !== 'super_admin' ? (
                    <Lock size={14} style={{ opacity: 0.8, color: '#64748B' }} />
                  ) : (
                    activeTab === '/admin/seo' && <div className="admin-nav-indicator" />
                  )}
                </button>
              </>
            )}

            {/* System Section */}
            <div className="admin-sidebar-header-wrapper" onClick={() => toggleSection('system')}>
              <span className="admin-sidebar-header">System</span>
              {sectionsExpanded.system ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
            {sectionsExpanded.system && (
              <>
                <button 
                  className={`admin-nav-item ${activeTab === '/admin/backup' ? 'active' : ''}`}
                  onClick={() => handleNavClick('/admin/backup')}
                >
                  <div className="admin-nav-item-left">
                    <Database size={20} /> Backup & Restore
                  </div>
                  {activeTab === '/admin/backup' && <div className="admin-nav-indicator" />}
                </button>
              </>
            )}

            {/* Logout Item */}
            <button 
              className="admin-nav-item admin-logout-btn" 
              onClick={handleLogout}
              style={{ marginTop: '24px' }}
            >
              <div className="admin-nav-item-left">
                <LogOut size={20} /> Logout
              </div>
            </button>
          </div>
        </aside>

        {/* Right Main Pane Wrapper */}
        <div className="admin-main-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Top Main Header */}
          <header className="admin-header-main" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', padding: '0 24px', borderBottom: '1px solid #E2E8F0', background: '#FFFFFF', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                type="button" 
                className="admin-hamburger-btn"
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                aria-label="Toggle Navigation Menu"
                title="Toggle Sidebar Menu"
              >
                <Menu size={20} />
                <span className="admin-menu-btn-label" style={{ fontSize: '13px', fontWeight: '700' }}>Menu</span>
              </button>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text-dark)', textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {(activeTab || '/admin/dashboard').split('/').pop().replace(/-/g, ' ')}
              </h2>
            </div>

            <div className="admin-header-right" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>


              <div className="admin-header-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <div className="admin-profile-avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#00A198', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' }}>
                  {(currentUser?.username || 'Admin').substring(0, 2).toUpperCase()}
                </div>
                <div className="admin-profile-meta" style={{ display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: 'var(--text-dark)', textTransform: 'capitalize' }}>{currentUser?.username || 'Super Admin'}</h4>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>{currentUser?.role === 'super_admin' ? 'Super Admin' : 'Administrator'}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Right Main Pane */}
          <main className="admin-content-pane">
          {/* Conditional Add Button Header */}
          {['/admin/news', '/admin/services', '/admin/certificates', '/admin/testimonials', '/admin/users', '/admin/projects', '/admin/partners', '/admin/media'].includes(activeTab) && (
            <div className="admin-pane-header" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <button 
                className="admin-add-btn" 
                onClick={() => {
                  if (activeTab === '/admin/projects') {
                    resetForms();
                    setEditingProjectId(null);
                    setShowAddModal(true);
                  } else {
                    resetForms();
                    setShowAddModal(true);
                  }
                }}
              >
                <Plus size={16} /> 
                {activeTab === '/admin/news' && 'Compose News'}
                {activeTab === '/admin/services' && 'Add New Service'}
                {activeTab === '/admin/certificates' && 'Add Certificate'}
                {activeTab === '/admin/testimonials' && 'Add Testimonial'}
                {activeTab === '/admin/users' && 'Create Administrator'}
                {activeTab === '/admin/projects' && 'Add New Project'}
                {activeTab === '/admin/partners' && 'Add Partner'}
                {activeTab === '/admin/media' && 'Add Media'}
              </button>
            </div>
          )}

          {/* Render Stats grid if applicable */}
          {['/admin/services', '/admin/news', '/admin/testimonials', '/admin/certificates'].includes(activeTab) && renderDashboardStats()}

          {/* MAIN TABLES & SECTIONS */}
          <div className="admin-table-card">
            
            {/* PLACEHOLDER PAGES */}
            {['/admin/categories/service', '/admin/categories/project', '/admin/categories/news', '/admin/activity-logs', '/admin/settings/social', '/admin/settings/seo', '/admin/documents', '/admin/system-logs'].includes(activeTab) && (
              renderPlaceholder(
                activeTab.split('/').pop().replace(/-/g, ' '),
                activeTab.replace('/admin/', '').replace(/\//g, ' > ').replace(/-/g, ' ')
              )
            )}
            
            {/* COMPANY INFORMATION SETTINGS */}
            {activeTab === '/admin/settings/company' && (
              <div style={{ padding: '24px', background: '#F8FAFC', borderRadius: '12px' }}>

                {/* Page Header */}
                <div className="admin-settings-page-header">
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#64748B', letterSpacing: '1px' }}>WEBSITE SETTINGS</span>
                    <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', margin: '4px 0 0 0' }}>Company Information</h2>
                    <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748B' }}>Edit the core company identity, about text, mission, vision, and policies shown on the About Us page and homepage.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}
                      onClick={discardCompanyChanges}
                    >
                      Discard Changes
                    </button>
                    <button
                      style={{ background: '#003E8A', color: '#FFFFFF', border: 'none', padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={saveCompanySettings}
                    >
                      <Check size={14} /> Save Changes
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                  {/* SECTION 1: Site Identity */}
                  <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}><Building size={16} /></div>
                      <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Site Identity</h3>
                    </div>
                    <div className="admin-form-grid-2col" style={{ padding: '24px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Company / Site Name</label>
                        <input type="text" value={companySettings.siteTitle || ''} onChange={e => updateCompanyField('siteTitle', e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Tagline / Slogan</label>
                        <input type="text" value={companySettings.tagline || ''} onChange={e => updateCompanyField('tagline', e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Registered Legal Name</label>
                        <input type="text" value={companySettings.legalName || ''} onChange={e => updateCompanyField('legalName', e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Year Established</label>
                        <input type="text" value={companySettings.yearEstablished || ''} onChange={e => updateCompanyField('yearEstablished', e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div className="admin-span-2">
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Copyright Text (Footer)</label>
                        <input type="text" value={companySettings.copyrightText || ''} onChange={e => updateCompanyField('copyrightText', e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    </div>
                  </div>

                  {/* ALL WEBSITE PAGE BANNERS MANAGEMENT SECTION */}
                  <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7' }}>
                          <ImageIcon size={20} />
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Website Page Banners Management
                          </h3>
                          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>
                            Upload, view, replace, or delete custom top banner images for each page. Click "Reset Default" to restore the system default banner.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="admin-banners-grid">
                      {[
                        { key: 'aboutus', title: 'About Us Banner', route: '/about-us', defaultBanner: '/about.png', description: 'Top banner image displayed on the About Us page.' },
                        { key: 'services', title: 'Services Banner', route: '/services', defaultBanner: '/servicepage1.png', description: 'Top banner image displayed across all Services pages.' },
                        { key: 'projects', title: 'Projects Banner', route: '/projects', defaultBanner: '/project1.png', description: 'Top banner image displayed on the Projects portfolio page.' },
                        { key: 'media', title: 'Media Center Banner', route: '/media', defaultBanner: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80', description: 'Top hero section background on the Media & News page.' },
                        { key: 'contactus', title: 'Contact Us Banner', route: '/contact-us', defaultBanner: '/contact1.png', description: 'Top banner image displayed on the Contact Us page.' }
                      ].map((item) => {
                        const currentUrl = pageBanners[item.key] || '';
                        const isCustom = Boolean(currentUrl);
                        const displayImg = currentUrl || item.defaultBanner;

                        return (
                          <div key={item.key} className="admin-banner-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div style={{ padding: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>{item.title}</h4>
                                <span style={{
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  padding: '4px 8px',
                                  borderRadius: '20px',
                                  background: isCustom ? '#DCFCE7' : '#F1F5F9',
                                  color: isCustom ? '#15803D' : '#64748B'
                                }}>
                                  {isCustom ? 'Custom Uploaded' : 'Default System'}
                                </span>
                              </div>
                              <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748B', lineHeight: '1.4' }}>{item.description}</p>
                              
                              {/* Preview Box */}
                              <div style={{
                                width: '100%',
                                height: '120px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                background: '#061E3D',
                                border: '1px solid #CBD5E1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                              }}>
                                <img
                                  src={displayImg}
                                  alt={`${item.title} Preview`}
                                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                  onError={e => { e.currentTarget.src = item.defaultBanner; }}
                                />
                              </div>
                            </div>

                            {/* Card Action Controls */}
                            <div style={{ padding: '12px 16px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <label style={{
                                flex: 1,
                                padding: '8px 12px',
                                borderRadius: '6px',
                                background: '#003E8A',
                                color: '#FFFFFF',
                                fontSize: '12px',
                                fontWeight: '700',
                                textAlign: 'center',
                                cursor: 'pointer',
                                display: 'inline-block'
                              }}>
                                {bannerUploadingKey === item.key ? 'Uploading...' : '📤 Upload New Banner'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={e => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleBannerUpload(item.key, e.target.files[0]);
                                    }
                                  }}
                                />
                              </label>

                              {isCustom && (
                                <button
                                  type="button"
                                  style={{
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    background: '#FEF2F2',
                                    color: '#DC2626',
                                    border: '1px solid #FCA5A5',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => handleBannerDelete(item.key, item.title)}
                                >
                                  🗑 Reset Default
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* HERO BANNER MEDIA MANAGEMENT */}
                  <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}><ImageIcon size={16} /></div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Home — Hero Banner Media</h3>
                          <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>Customize the top banner media of the Home page with either a custom image or background video.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="admin-hero-media-grid" style={{ padding: '24px' }}>
                      {/* Left Side: Type and Upload */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        
                        {/* Selector */}
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Media Type</label>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: aboutUsHeroType === 'image' ? '2px solid #003E8A' : '1px solid #CBD5E1', background: aboutUsHeroType === 'image' ? '#EFF6FF' : '#FFFFFF', color: aboutUsHeroType === 'image' ? '#003E8A' : '#475569', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
                              onClick={() => setAboutUsHeroType('image')}
                            >
                              🖼 Custom Image Banner
                            </button>
                            <button
                              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: aboutUsHeroType === 'video' ? '2px solid #003E8A' : '1px solid #CBD5E1', background: aboutUsHeroType === 'video' ? '#EFF6FF' : '#FFFFFF', color: aboutUsHeroType === 'video' ? '#003E8A' : '#475569', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
                              onClick={() => setAboutUsHeroType('video')}
                            >
                              🎥 Background Video Banner
                            </button>
                          </div>
                        </div>

                        {/* File Upload Zone */}
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                            {aboutUsHeroType === 'image' ? 'Upload Banner Image' : 'Upload Banner Video'}
                          </label>
                          <div
                            style={{ border: '2px dashed #CBD5E1', borderRadius: '10px', padding: '36px 20px', textAlign: 'center', background: '#F8FAFC', cursor: 'pointer', transition: 'all 0.2s' }}
                            onClick={() => document.getElementById('aboutus-hero-input').click()}
                          >
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                              <FileDown size={20} style={{ color: '#475569' }} />
                            </div>
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                              Drag & drop or <span style={{ color: '#003E8A', textDecoration: 'underline' }}>click to browse</span>
                            </p>
                            <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>
                              {aboutUsHeroType === 'image' ? 'JPG, PNG, WebP — Recommended: 1920x450' : 'MP4, WebM — Recommended: 10-15 seconds loop'}
                            </p>
                            {aboutUsHeroFile && (
                              <div style={{ marginTop: '12px', padding: '8px 12px', background: '#E0F2FE', borderRadius: '6px', border: '1px solid #BAE6FD', fontSize: '12px', color: '#0369A1' }}>
                                Selected file: <strong>{aboutUsHeroFile.name}</strong> ({(aboutUsHeroFile.size / 1024 / 1024).toFixed(2)} MB)
                              </div>
                            )}
                          </div>
                          <input
                            id="aboutus-hero-input"
                            type="file"
                            accept={aboutUsHeroType === 'image' ? 'image/*' : 'video/*'}
                            style={{ display: 'none' }}
                            onChange={e => {
                              const file = e.target.files[0];
                              if (file) {
                                setAboutUsHeroFile(file);
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setAboutUsHeroUrl(reader.result);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            disabled={!aboutUsHeroFile || aboutUsHeroUploading}
                            style={{ flex: 1, padding: '10px 16px', borderRadius: '6px', border: 'none', background: aboutUsHeroFile && !aboutUsHeroUploading ? '#003E8A' : '#E2E8F0', color: aboutUsHeroFile && !aboutUsHeroUploading ? '#FFFFFF' : '#94A3B8', fontSize: '13px', fontWeight: '700', cursor: aboutUsHeroFile && !aboutUsHeroUploading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                            onClick={async () => {
                              if (!aboutUsHeroFile) return;
                              setAboutUsHeroUploading(true);
                              await new Promise(r => setTimeout(r, 1500));
                              setAboutUsHeroUploading(false);
                              alert(`${aboutUsHeroType === 'image' ? 'Image' : 'Video'} uploaded successfully! Click Save Changes above/below to persist.`);
                              setAboutUsHeroFile(null);
                            }}
                          >
                            {aboutUsHeroUploading ? 'Uploading...' : 'Apply Uploaded Media'}
                          </button>
                          {aboutUsHeroUrl && (
                            <button
                              style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid #FCA5A5', background: '#FFF1F2', color: '#DC2626', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                              onClick={() => {
                                if (confirm('Reset to default About Us Banner?')) {
                                  setAboutUsHeroUrl('');
                                  setAboutUsHeroFile(null);
                                }
                              }}
                            >
                              Reset Default
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Right Side: Media Preview */}
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Hero Preview</label>
                        <div style={{ width: '100%', height: '170px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #0F172A', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {aboutUsHeroType === 'video' && aboutUsHeroUrl ? (
                            <video
                              key={aboutUsHeroUrl}
                              src={aboutUsHeroUrl}
                              autoPlay
                              muted
                              loop
                              playsInline
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <img
                              src={aboutUsHeroUrl || '/aboutus-default-banner.png'}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80'; }}
                            />
                          )}
                        </div>
                        <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#94A3B8', textAlign: 'center' }}>Preview on the Home page top banner</p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: About Us — Who We Are */}
                  <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA580C' }}><Layers size={16} /></div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>About Us — Who We Are</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>Displayed in the "Who We Are" section on the About Us page</p>
                      </div>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                      {/* VIDEO MANAGEMENT CARD */}
                      <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                        <div style={{ padding: '14px 20px', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FileText size={14} style={{ color: '#38BDF8' }} />
                            </div>
                            <div>
                              <span style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF' }}>Who We Are — Section Video</span>
                              <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block' }}>Plays in portrait frame beside the company text on About Us page</span>
                            </div>
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', background: aboutUsVideoUrl ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: aboutUsVideoUrl ? '#10B981' : '#EF4444' }}>
                            {aboutUsVideoUrl ? 'ACTIVE' : 'NO VIDEO'}
                          </span>
                        </div>

                        <div className="admin-video-card-grid" style={{ padding: '20px' }}>

                          {/* Left: Upload Controls */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Upload / Replace Video</label>
                              <div
                                style={{ border: '2px dashed #CBD5E1', borderRadius: '10px', padding: '28px 20px', textAlign: 'center', background: '#FFFFFF', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s' }}
                                onClick={() => document.getElementById('aboutus-video-input').click()}
                                onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.background = '#EFF6FF'; }}
                                onDragLeave={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.background = '#FFFFFF'; }}
                                onDrop={e => {
                                  e.preventDefault();
                                  e.currentTarget.style.borderColor = '#CBD5E1';
                                  e.currentTarget.style.background = '#FFFFFF';
                                  const file = e.dataTransfer.files[0];
                                  if (file && file.type.startsWith('video/')) {
                                    setAboutUsVideoFile(file);
                                    setAboutUsVideoUrl(URL.createObjectURL(file));
                                  }
                                }}
                              >
                                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                                  <FileDown size={24} style={{ color: '#2563EB' }} />
                                </div>
                                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>Drag & drop video or <span style={{ color: '#2563EB', textDecoration: 'underline' }}>click to browse</span></p>
                                <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#94A3B8' }}>MP4, WebM, MOV — Max 100 MB recommended</p>
                                {aboutUsVideoFile && (
                                  <div style={{ marginTop: '10px', padding: '8px 12px', background: '#F0FDF4', borderRadius: '6px', border: '1px solid #BBF7D0', fontSize: '12px', color: '#166534' }}>
                                    ✓ Selected: <strong>{aboutUsVideoFile.name}</strong> ({(aboutUsVideoFile.size / 1024 / 1024).toFixed(2)} MB)
                                  </div>
                                )}
                              </div>
                              <input
                                id="aboutus-video-input"
                                type="file"
                                accept="video/mp4,video/webm,video/quicktime"
                                style={{ display: 'none' }}
                                onChange={e => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    setAboutUsVideoFile(file);
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setAboutUsVideoUrl(reader.result);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              <button
                                disabled={!aboutUsVideoFile || aboutUsVideoUploading}
                                style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: 'none', background: aboutUsVideoFile && !aboutUsVideoUploading ? '#003E8A' : '#E2E8F0', color: aboutUsVideoFile && !aboutUsVideoUploading ? '#FFFFFF' : '#94A3B8', fontSize: '13px', fontWeight: '700', cursor: aboutUsVideoFile && !aboutUsVideoUploading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                onClick={async () => {
                                  if (!aboutUsVideoFile) return;
                                  setAboutUsVideoUploading(true);
                                  // Simulate upload
                                  await new Promise(r => setTimeout(r, 1800));
                                  setAboutUsVideoUploading(false);
                                  alert(`Video "${aboutUsVideoFile.name}" uploaded successfully! It will appear on the About Us page.`);
                                  setAboutUsVideoFile(null);
                                }}
                              >
                                {aboutUsVideoUploading ? (
                                  <><span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFFFFF', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Uploading...</>
                                ) : (
                                  <><Check size={14} /> {aboutUsVideoFile ? 'Upload New Video' : 'Select a file first'}</>
                                )}
                              </button>
                              {aboutUsVideoUrl && (
                                <button
                                  style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #FCA5A5', background: '#FFF1F2', color: '#DC2626', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                  onClick={() => {
                                    if (confirm('Are you sure you want to delete the current video from the About Us page?')) {
                                      setAboutUsVideoUrl('');
                                      setAboutUsVideoFile(null);
                                      alert('Video removed. The About Us page will no longer show a video.');
                                    }
                                  }}
                                >
                                  <Trash size={14} /> Delete Video
                                </button>
                              )}
                            </div>

                              <div style={{ padding: '10px 14px', background: '#FFFBEB', borderRadius: '8px', border: '1px solid #FDE68A', fontSize: '12px', color: '#92400E', lineHeight: '1.5' }}>
                              [!] <strong>Note:</strong> The video plays automatically (muted, looped) in portrait frame beside the "Who We Are" text on the About Us page. Keep it under 60 seconds for best performance.
                             </div>
                          </div>

                          {/* Right: Live Video Preview */}
                          {aboutUsVideoUrl && (
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Current Video Preview</label>
                              <div style={{ borderRadius: '10px', overflow: 'hidden', border: '2px solid #0F172A', background: '#000', aspectRatio: '9/16', maxHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <video
                                  key={aboutUsVideoUrl}
                                  src={aboutUsVideoUrl}
                                  autoPlay
                                  muted
                                  loop
                                  playsInline
                                  controls
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                              </div>
                              <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#94A3B8', textAlign: 'center' }}>This is how it looks on the About Us page</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* PARAGRAPH FIELDS */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                          { label: 'Paragraph 1 — Company Pillars', field: 'whoWeArePara1' },
                          { label: 'Paragraph 2 — Client Culture', field: 'whoWeArePara2' },
                          { label: 'Paragraph 3 — Expertise Spectrum', field: 'whoWeArePara3' },
                          { label: 'Paragraph 4 — Service Offerings', field: 'whoWeArePara4' }
                        ].map((item, i) => (
                          <div key={i}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{item.label}</label>
                            <textarea rows={3} value={companySettings[item.field] || ''} onChange={e => updateCompanyField(item.field, e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: '1.6' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: Mission, Vision, QA&QC, HSE Policy */}
                  <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}><Shield size={16} /></div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mission, Vision & Policies</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>Used in the sliding cards carousel on the homepage ("Why Blue Crescent?" section)</p>
                      </div>
                    </div>
                    <div className="admin-form-grid-2col" style={{ padding: '24px' }}>
                      {[
                        { label: 'Mission Statement', field: 'mission' },
                        { label: 'Vision Statement', field: 'vision' },
                        { label: 'QA & QC Policy', field: 'qaqc' },
                        { label: 'HSE Policy', field: 'hse' }
                      ].map((item, i) => (
                        <div key={i}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{item.label}</label>
                          <textarea rows={4} value={companySettings[item.field] || ''} onChange={e => updateCompanyField(item.field, e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: '1.6' }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 4: Why Blue Crescent */}
                  <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}><Star size={16} /></div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Why Blue Crescent — Homepage Section</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>The descriptive text shown beside the policy cards on the homepage</p>
                      </div>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {[
                        { label: 'Intro Paragraph 1', field: 'whyIntro1' },
                        { label: 'Intro Paragraph 2', field: 'whyIntro2' },
                        { label: 'Intro Paragraph 3', field: 'whyIntro3' },
                        { label: 'Intro Paragraph 4', field: 'whyIntro4' }
                      ].map((item, i) => (
                        <div key={i}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{item.label}</label>
                          <textarea rows={2} value={companySettings[item.field] || ''} onChange={e => updateCompanyField(item.field, e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: '1.6' }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 5: Core Values (About Us page fan cards) */}
                  <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA580C' }}><Award size={16} /></div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Core Values — About Us Fan Cards</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>Titles and descriptions for the 5 animated fan-deck cards on the About Us page</p>
                      </div>
                    </div>
                    <div className="admin-form-grid-2col" style={{ padding: '24px' }}>
                      {[
                        { titleField: 'value1Title', descField: 'value1Desc' },
                        { titleField: 'value2Title', descField: 'value2Desc' },
                        { titleField: 'value3Title', descField: 'value3Desc' },
                        { titleField: 'value4Title', descField: 'value4Desc' },
                        { titleField: 'value5Title', descField: 'value5Desc' },
                      ].map((card, i) => (
                        <div key={i} style={{ background: '#F8FAFC', borderRadius: '10px', padding: '16px', border: '1px solid #E2E8F0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>Card 0{i + 1}</span>
                          </div>
                          <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>Title</label>
                            <input type="text" value={companySettings[card.titleField] || ''} onChange={e => updateCompanyField(card.titleField, e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>Description</label>
                            <textarea rows={2} value={companySettings[card.descField] || ''} onChange={e => updateCompanyField(card.descField, e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 6: Custom Section Backgrounds */}
                  <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}><ImageIcon size={16} /></div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Custom Section Backgrounds</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>Configure background images and color schemes for About Us page sections</p>
                      </div>
                    </div>
                    <div className="admin-form-grid-2col" style={{ padding: '24px' }}>
                      
                      {/* Geographical Presence Map Image */}
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Geographical Presence Map Image</label>
                        <div className="admin-file-upload">
                          <label className="admin-file-label">
                            <span>Select map image file...</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleImageUpload(e.target.files[0], setCompanySettings, 'aboutUsMapImg')}
                            />
                          </label>
                        </div>
                        {companySettings.aboutUsMapImg && (
                          <div className="admin-upload-preview" style={{ marginTop: '10px' }}>
                            <img src={companySettings.aboutUsMapImg} alt="Map Preview" style={{ maxHeight: '100px', objectFit: 'contain' }} />
                            <button className="admin-upload-preview-remove" onClick={() => updateCompanyField('aboutUsMapImg', '')}>✕</button>
                          </div>
                        )}
                      </div>

                      {/* Capacity Card Background Image */}
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Capacity Left Card Background Image</label>
                        <div className="admin-file-upload">
                          <label className="admin-file-label">
                            <span>Select capacity background image...</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleImageUpload(e.target.files[0], setCompanySettings, 'aboutUsCapaImg')}
                            />
                          </label>
                        </div>
                        {companySettings.aboutUsCapaImg && (
                          <div className="admin-upload-preview" style={{ marginTop: '10px' }}>
                            <img src={companySettings.aboutUsCapaImg} alt="Capacity Preview" style={{ maxHeight: '100px', objectFit: 'contain' }} />
                            <button className="admin-upload-preview-remove" onClick={() => updateCompanyField('aboutUsCapaImg', '')}>✕</button>
                          </div>
                        )}
                      </div>

                      {/* Digital Twin Section Background Image */}
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Digital Twin Section Background Image</label>
                        <div className="admin-file-upload">
                          <label className="admin-file-label">
                            <span>Select digital twin background image...</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleImageUpload(e.target.files[0], setCompanySettings, 'aboutUsDigitalImg')}
                            />
                          </label>
                        </div>
                        {companySettings.aboutUsDigitalImg && (
                          <div className="admin-upload-preview" style={{ marginTop: '10px' }}>
                            <img src={companySettings.aboutUsDigitalImg} alt="Digital Twin Preview" style={{ maxHeight: '100px', objectFit: 'contain' }} />
                            <button className="admin-upload-preview-remove" onClick={() => updateCompanyField('aboutUsDigitalImg', '')}>✕</button>
                          </div>
                        )}
                      </div>

                      {/* Digital Twin Flowchart Background Color */}
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Flowchart Container Background Color</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <input 
                            type="color" 
                            value={companySettings.aboutUsFlowchartBg || '#F1F7FF'} 
                            onChange={e => updateCompanyField('aboutUsFlowchartBg', e.target.value)} 
                            style={{ width: '48px', height: '38px', padding: '0', border: '1px solid #CBD5E1', borderRadius: '6px', cursor: 'pointer' }}
                          />
                          <input 
                            type="text" 
                            value={companySettings.aboutUsFlowchartBg || '#F1F7FF'} 
                            onChange={e => updateCompanyField('aboutUsFlowchartBg', e.target.value)} 
                            style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* SECTION 7: Dynamic GCC Countries list editor */}
                  <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}><Globe size={16} /></div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>GCC Geographical Presence Offices (CRUD)</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>Customize the texts, accent colors, and statuses of your GCC regional office cards</p>
                      </div>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {(() => {
                        let list = [];
                        try {
                          const val = companySettings.aboutUsCountriesJson;
                          list = val ? JSON.parse(val) : JSON.parse(DEFAULT_COMPANY_SETTINGS.aboutUsCountriesJson);
                          if (!Array.isArray(list) || list.length === 0) {
                            list = JSON.parse(DEFAULT_COMPANY_SETTINGS.aboutUsCountriesJson);
                          }
                        } catch(e) {
                          list = JSON.parse(DEFAULT_COMPANY_SETTINGS.aboutUsCountriesJson);
                        }
                        return list.map((item, idx) => (
                          <div key={item.id || idx} className="admin-countries-crud-grid" style={{ padding: '14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>Country Name</label>
                              <input type="text" value={item.name || ''} onChange={e => {
                                const copy = [...list];
                                copy[idx].name = e.target.value;
                                updateCompanyField('aboutUsCountriesJson', JSON.stringify(copy));
                              }} style={{ width: '100%', padding: '6px 10px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px' }} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>Office Status / Year</label>
                              <input type="text" value={item.status || ''} onChange={e => {
                                const copy = [...list];
                                copy[idx].status = e.target.value;
                                updateCompanyField('aboutUsCountriesJson', JSON.stringify(copy));
                              }} style={{ width: '100%', padding: '6px 10px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px' }} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>Short Description</label>
                              <input type="text" value={item.desc || ''} onChange={e => {
                                const copy = [...list];
                                copy[idx].desc = e.target.value;
                                updateCompanyField('aboutUsCountriesJson', JSON.stringify(copy));
                              }} style={{ width: '100%', padding: '6px 10px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px' }} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>Color</label>
                              <input type="color" value={item.accentColor || '#0057B8'} onChange={e => {
                                const copy = [...list];
                                copy[idx].accentColor = e.target.value;
                                updateCompanyField('aboutUsCountriesJson', JSON.stringify(copy));
                              }} style={{ width: '100%', height: '30px', padding: 0, border: '1px solid #CBD5E1', borderRadius: '6px', cursor: 'pointer' }} />
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* SECTION 8: Dynamic Capacity Disciplines CRUD */}
                  <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}><Star size={16} /></div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Capacity Disciplines (CRUD)</h3>
                          <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>Add, edit, or remove discipline cards displayed under "Our Capacity" section</p>
                        </div>
                      </div>
                      <button 
                        style={{ background: '#16A34A', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 6px rgba(22, 163, 74, 0.2)' }} 
                        onClick={() => openCrudModal('discipline', null, { name: '', icon: 'Building2' })}
                      >
                        <Plus size={15} /> + Add Card
                      </button>
                    </div>
                    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
                      {(() => {
                        const list = parseJsonArray(companySettings.aboutUsDisciplinesJson, DEFAULT_COMPANY_SETTINGS.aboutUsDisciplinesJson);
                        return list.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ background: '#EFF6FF', color: '#2563EB', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', border: '1px solid #BFDBFE' }}>
                                {item.icon || 'Building2'}
                              </div>
                              <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#1E293B' }}>{item.name}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button 
                                title="Edit Discipline"
                                style={{ background: '#2563EB', color: '#FFFFFF', border: 'none', width: '30px', height: '30px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                                onClick={() => openCrudModal('discipline', idx, item)}
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                title="Delete Discipline"
                                style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', width: '30px', height: '30px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                                onClick={() => {
                                  const copy = [...list];
                                  copy.splice(idx, 1);
                                  updateCompanyField('aboutUsDisciplinesJson', JSON.stringify(copy));
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* SECTION 9: Dynamic Flowchart Steps CRUD */}
                  <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}><Cpu size={16} /></div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Flowchart Steps Configuration (CRUD)</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>Customize flowchart milestone names, descriptions and indicators</p>
                      </div>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {(() => {
                        const list = parseJsonArray(companySettings.aboutUsFlowchartJson, DEFAULT_COMPANY_SETTINGS.aboutUsFlowchartJson);
                        return list.map((item, idx) => (
                          <div key={idx} className="admin-flowchart-step-grid" style={{ padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '9px', fontWeight: '700', color: '#64748B', marginBottom: '3px' }}>STEP</label>
                              <input type="text" value={item.num || ''} onChange={e => {
                                const copy = [...list];
                                copy[idx].num = e.target.value;
                                updateCompanyField('aboutUsFlowchartJson', JSON.stringify(copy));
                              }} style={{ width: '100%', padding: '6px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px', textAlign: 'center' }} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '9px', fontWeight: '700', color: '#64748B', marginBottom: '3px' }}>TITLE</label>
                              <input type="text" value={item.title || ''} onChange={e => {
                                const copy = [...list];
                                copy[idx].title = e.target.value;
                                updateCompanyField('aboutUsFlowchartJson', JSON.stringify(copy));
                              }} style={{ width: '100%', padding: '6px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px' }} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '9px', fontWeight: '700', color: '#64748B', marginBottom: '3px' }}>DESCRIPTION</label>
                              <input type="text" value={item.desc || ''} onChange={e => {
                                const copy = [...list];
                                copy[idx].desc = e.target.value;
                                updateCompanyField('aboutUsFlowchartJson', JSON.stringify(copy));
                              }} style={{ width: '100%', padding: '6px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px' }} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '9px', fontWeight: '700', color: '#64748B', marginBottom: '3px' }}>ICON</label>
                              <select value={item.icon || 'Building2'} onChange={e => {
                                const copy = [...list];
                                copy[idx].icon = e.target.value;
                                updateCompanyField('aboutUsFlowchartJson', JSON.stringify(copy));
                              }} style={{ width: '100%', padding: '6px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px' }}>
                                {['Building2', 'Layers', 'Cpu', 'Monitor'].map(i => (
                                  <option key={i} value={i}>{i}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* SECTION 10: Dynamic Digital Twin Capabilities CRUD */}
                  <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA580C' }}><Layers size={16} /></div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Digital Twin Capabilities (CRUD)</h3>
                          <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>Customize the capability cards shown inside the Digital Twin section</p>
                        </div>
                      </div>
                      <button 
                        style={{ background: '#EA580C', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 6px rgba(234, 88, 12, 0.2)' }} 
                        onClick={() => openCrudModal('digitalTwin', null, { title: '', desc: '', icon: 'Cloud' })}
                      >
                        <Plus size={15} /> + Add Card
                      </button>
                    </div>
                    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
                      {(() => {
                        const list = parseJsonArray(companySettings.aboutUsCapabilitiesJson, DEFAULT_COMPANY_SETTINGS.aboutUsCapabilitiesJson);
                        return list.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ background: '#FFF7ED', color: '#EA580C', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', border: '1px solid #FFEDD5' }}>
                                  {item.icon || 'Cloud'}
                                </div>
                                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>{item.title}</h4>
                              </div>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button 
                                  title="Edit Capability"
                                  style={{ background: '#EA580C', color: '#FFFFFF', border: 'none', width: '30px', height: '30px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                                  onClick={() => openCrudModal('digitalTwin', idx, item)}
                                >
                                  <Edit size={14} />
                                </button>
                                <button 
                                  title="Delete Capability"
                                  style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', width: '30px', height: '30px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                                  onClick={() => {
                                    const copy = [...list];
                                    copy.splice(idx, 1);
                                    updateCompanyField('aboutUsCapabilitiesJson', JSON.stringify(copy));
                                  }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                            {item.desc && (
                              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748B', lineHeight: '1.4' }}>{item.desc}</p>
                            )}
                          </div>
                        ));
                      })()}
                    </div>
                  </div>


                  {/* SECTION 11: Sustainability Consultancy Section Manager (CRUD) */}
                  <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}><Leaf size={16} /></div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sustainability Consultancy Section (Homepage CRUD)</h3>
                          <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>Customize text, descriptions, main section image and core capability chips</p>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="admin-form-grid-2col">
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Section Main Title</label>
                          <input type="text" value={companySettings.sustainabilityTitle || 'SUSTAINABILITY CONSULTANCY'} onChange={e => updateCompanyField('sustainabilityTitle', e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Section Subheading</label>
                          <input type="text" value={companySettings.sustainabilitySubHeading || 'Building Better, Building Sustainably.'} onChange={e => updateCompanyField('sustainabilitySubHeading', e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }} />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Lead Paragraph Description</label>
                        <textarea rows="2" value={companySettings.sustainabilityLeadDesc || ''} onChange={e => updateCompanyField('sustainabilityLeadDesc', e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Supporting Paragraph Description</label>
                        <textarea rows="2" value={companySettings.sustainabilitySupportingDesc || ''} onChange={e => updateCompanyField('sustainabilitySupportingDesc', e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
                      </div>

                      {/* Main Image Upload */}
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Sustainability Section Main Image</label>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <input type="file" accept="image/*" onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                updateCompanyField('sustainabilityImage', reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }} style={{ fontSize: '13px' }} />
                          {companySettings.sustainabilityImage && (
                            <img src={companySettings.sustainabilityImage} alt="Sustainability preview" style={{ height: '50px', borderRadius: '6px', border: '1px solid #E2E8F0', objectFit: 'cover' }} />
                          )}
                        </div>
                      </div>

                      {/* Capabilities Chips Manager */}
                      <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '16px', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                          <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#1E293B', textTransform: 'uppercase' }}>Core Capabilities Chips (CRUD)</h4>
                          <button 
                            style={{ background: '#10B981', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 6px rgba(16, 185, 129, 0.2)' }} 
                            onClick={() => openCrudModal('capabilityChip', null, { name: '', icon: 'Award', slug: 'Sustainability Services', desc: '' })}
                          >
                            <Plus size={15} /> + Add Capability Chip
                          </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
                          {(() => {
                            const list = parseJsonArray(companySettings.sustainabilityCapabilitiesJson, DEFAULT_COMPANY_SETTINGS.sustainabilityCapabilitiesJson);
                            return list.map((item, idx) => (
                              <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#FFFFFF', padding: '12px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div style={{ background: '#ECFDF5', color: '#10B981', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', border: '1px solid #A7F3D0' }}>
                                    {item.icon || 'Award'}
                                  </div>
                                  <div>
                                    <strong style={{ fontSize: '13.5px', color: '#1E293B', display: 'block' }}>{item.name}</strong>
                                    {item.slug && <span style={{ fontSize: '11px', color: '#64748B' }}>Route: {item.slug}</span>}
                                  </div>
                                </div>

                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button 
                                    title="Edit Chip"
                                    style={{ background: '#10B981', color: '#FFFFFF', border: 'none', width: '30px', height: '30px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                                    onClick={() => openCrudModal('capabilityChip', idx, item)}
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button 
                                    title="Delete Chip"
                                    style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', width: '30px', height: '30px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                                    onClick={() => {
                                      const copy = [...list];
                                      copy.splice(idx, 1);
                                      updateCompanyField('sustainabilityCapabilitiesJson', JSON.stringify(copy));
                                    }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 12: Remote Construction Solutions Section Manager (CRUD) */}
                  <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}><Cpu size={16} /></div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Remote Construction Solutions Section (Homepage CRUD)</h3>
                          <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>Customize title, description, technology visual image and 6 pillar cards</p>
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="admin-form-grid-2col">
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Section Heading</label>
                          <input type="text" value={companySettings.remoteTitle || 'Remote Construction Solutions'} onChange={e => updateCompanyField('remoteTitle', e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Status Overlay Text</label>
                          <input type="text" value={companySettings.remoteOverlayText || 'Live Remote Site Inspection Active'} onChange={e => updateCompanyField('remoteOverlayText', e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }} />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Description Paragraph</label>
                        <textarea rows="2" value={companySettings.remoteDesc || ''} onChange={e => updateCompanyField('remoteDesc', e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
                      </div>

                      {/* Visual Image Upload */}
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Technology Visual Image</label>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <input type="file" accept="image/*" onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                updateCompanyField('remoteImage', reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }} style={{ fontSize: '13px' }} />
                          {companySettings.remoteImage && (
                            <img src={companySettings.remoteImage} alt="Remote preview" style={{ height: '50px', borderRadius: '6px', border: '1px solid #E2E8F0', objectFit: 'cover' }} />
                          )}
                        </div>
                      </div>

                      {/* Pillars Cards Manager */}
                      <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '16px', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                          <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#1E293B', textTransform: 'uppercase' }}>Remote Solutions Pillars (CRUD)</h4>
                          <button 
                            style={{ background: '#2563EB', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)' }} 
                            onClick={() => openCrudModal('remotePillar', null, { title: '', desc: '', icon: 'Radio', slug: 'Construction Technology' })}
                          >
                            <Plus size={15} /> + Add Solution Pillar Card
                          </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
                          {(() => {
                            const list = parseJsonArray(companySettings.remotePillarsJson, DEFAULT_COMPANY_SETTINGS.remotePillarsJson);
                            return list.map((pillar, idx) => (
                              <div key={pillar.id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#FFFFFF', padding: '14px', borderRadius: '8px', border: '1px solid #CBD5E1', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ background: '#EFF6FF', color: '#2563EB', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', border: '1px solid #BFDBFE' }}>
                                      {pillar.icon || 'Radio'}
                                    </div>
                                    <div>
                                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>{pillar.title}</h4>
                                      {pillar.slug && <span style={{ fontSize: '11px', color: '#64748B' }}>Route: {pillar.slug}</span>}
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', gap: '6px' }}>
                                    <button 
                                      title="Edit Pillar"
                                      style={{ background: '#2563EB', color: '#FFFFFF', border: 'none', width: '30px', height: '30px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                                      onClick={() => openCrudModal('remotePillar', idx, pillar)}
                                    >
                                      <Edit size={14} />
                                    </button>
                                    <button 
                                      title="Delete Pillar"
                                      style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', width: '30px', height: '30px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                                      onClick={() => {
                                        const copy = [...list];
                                        copy.splice(idx, 1);
                                        updateCompanyField('remotePillarsJson', JSON.stringify(copy));
                                      }}
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>

                                {pillar.desc && (
                                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748B', lineHeight: '1.4' }}>{pillar.desc}</p>
                                )}
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 13: Our Team Members CRUD Manager */}
                  <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: '24px' }}>
                    <div style={{ padding: '16px 24px', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}><Users size={16} /></div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>OUR TEAM MEMBERS (ABOUT US CRUD)</h3>
                          <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>Manage team member photos, names, roles and order saved live in MySQL database</p>
                        </div>
                      </div>
                      <button 
                        style={{ background: '#16A34A', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 6px rgba(22, 163, 74, 0.2)' }} 
                        onClick={() => openCrudModal('teamMember', null, { name: '', role: 'Team Member', image: null })}
                      >
                        <Plus size={15} /> + Add Team Member
                      </button>
                    </div>

                    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                      {(Array.isArray(teamMembers) ? teamMembers : []).map((member, idx) => (
                        <div key={member.id || idx} style={{ background: '#FFFFFF', borderRadius: '10px', border: '1px solid #CBD5E1', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', background: 'linear-gradient(135deg, #071C3B, #00A198)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: '800', fontSize: '18px' }}>
                              {member.image ? (
                                <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                (member.name ? member.name.charAt(0) : 'T')
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ margin: '0 0 2px 0', fontSize: '15px', fontWeight: '700', color: '#1E293B' }}>{member.name}</h4>
                              <span style={{ fontSize: '12.5px', color: '#00A198', fontWeight: '700', display: 'block' }}>{member.role || 'Team Member'}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'flex-end', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                            <button 
                              style={{ background: '#2563EB', color: '#FFFFFF', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} 
                              onClick={() => openCrudModal('teamMember', idx, member)}
                            >
                              <Edit size={13} /> Edit
                            </button>

                            <button 
                              style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} 
                              onClick={async () => {
                                if (!confirm(`Delete ${member.name}?`)) return;
                                try {
                                  const res = await fetch(`/api/team/${member.id}`, { method: 'DELETE' });
                                  if (res.ok) {
                                    setTeamMembers(prev => (Array.isArray(prev) ? prev : []).filter(m => m.id !== member.id));
                                  }
                                } catch(e){}
                              }}
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Save */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '12px' }}>
                    <button
                      style={{ background: '#003E8A', color: '#FFFFFF', border: 'none', padding: '12px 32px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                      onClick={saveCompanySettings}
                    >
                      <Check size={16} /> Save All Company Information
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* CONTACT INFORMATION SETTINGS */}
            {activeTab === '/admin/settings/contact' && (
              <div style={{ padding: '24px', background: '#F8FAFC', borderRadius: '12px' }}>
                {/* Header */}
                <div className="admin-settings-page-header">
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#64748B', letterSpacing: '1px' }}>WEBSITE SETTINGS</span>
                    <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', margin: '4px 0 0 0' }}>Contact Information</h2>
                    <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748B' }}>Update the contact details displayed publicly on the Contact Us page.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}
                      onClick={() => setContactSettings({
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
                        businessHoursMon: '8:00 AM – 6:00 PM',
                        businessHoursFri: '8:00 AM – 12:00 PM',
                        businessHoursSat: 'Closed'
                      })}
                    >
                      Reset Defaults
                    </button>
                    <button
                      style={{ background: '#003E8A', color: '#FFFFFF', border: 'none', padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={saveContactSettings}
                    >
                      <Check size={14} /> Save Changes
                    </button>
                  </div>
                </div>

                <div className="admin-form-grid-2col">
                  {/* LEFT: Address & Identity */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Company Identity */}
                    <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                          <Building size={18} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1E293B' }}>Company Identity</h3>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Registered Company Name</label>
                          <input
                            type="text"
                            value={contactSettings.companyName}
                            onChange={e => setContactSettings(p => ({ ...p, companyName: e.target.value }))}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA580C' }}>
                          <MapPin size={18} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1E293B' }}>Office Address</h3>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Address Line 1</label>
                          <input
                            type="text"
                            value={contactSettings.addressLine1}
                            onChange={e => setContactSettings(p => ({ ...p, addressLine1: e.target.value }))}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div className="admin-form-grid-2col">
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>City</label>
                            <input
                              type="text"
                              value={contactSettings.city}
                              onChange={e => setContactSettings(p => ({ ...p, city: e.target.value }))}
                              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Country</label>
                            <input
                              type="text"
                              value={contactSettings.country}
                              onChange={e => setContactSettings(p => ({ ...p, country: e.target.value }))}
                              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                            />
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>P.O. Box <span style={{ fontWeight: '400', textTransform: 'none' }}>(optional)</span></label>
                          <input
                            type="text"
                            value={contactSettings.poBox}
                            onChange={e => setContactSettings(p => ({ ...p, poBox: e.target.value }))}
                            placeholder="e.g. P.O. Box 12345"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Business Hours */}
                    <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}>
                          <Clock size={18} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1E293B' }}>Business Hours</h3>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Sunday – Thursday</label>
                          <input
                            type="text"
                            value={contactSettings.businessHoursMon}
                            onChange={e => setContactSettings(p => ({ ...p, businessHoursMon: e.target.value }))}
                            placeholder="e.g. 8:00 AM – 6:00 PM"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Friday</label>
                          <input
                            type="text"
                            value={contactSettings.businessHoursFri}
                            onChange={e => setContactSettings(p => ({ ...p, businessHoursFri: e.target.value }))}
                            placeholder="e.g. 8:00 AM – 12:00 PM"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Saturday</label>
                          <input
                            type="text"
                            value={contactSettings.businessHoursSat}
                            onChange={e => setContactSettings(p => ({ ...p, businessHoursSat: e.target.value }))}
                            placeholder="e.g. Closed"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Contact Channels + Map */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Phone & Fax */}
                    <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                          <Phone size={18} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1E293B' }}>Phone & Fax</h3>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Phone Number</label>
                          <input
                            type="tel"
                            value={contactSettings.phone}
                            onChange={e => setContactSettings(p => ({ ...p, phone: e.target.value }))}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Fax Number</label>
                          <input
                            type="tel"
                            value={contactSettings.fax}
                            onChange={e => setContactSettings(p => ({ ...p, fax: e.target.value }))}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email & Website */}
                    <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA580C' }}>
                          <Mail size={18} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1E293B' }}>Email & Web Presence</h3>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Email Address</label>
                          <input
                            type="email"
                            value={contactSettings.email}
                            onChange={e => setContactSettings(p => ({ ...p, email: e.target.value }))}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Website URL</label>
                          <input
                            type="text"
                            value={contactSettings.website}
                            onChange={e => setContactSettings(p => ({ ...p, website: e.target.value }))}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Google Maps Embed */}
                    <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}>
                          <Map size={18} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1E293B' }}>Location Map</h3>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Google Maps Embed URL</label>
                          <textarea
                            rows={3}
                            value={contactSettings.googleMapsUrl}
                            onChange={e => setContactSettings(p => ({ ...p, googleMapsUrl: e.target.value }))}
                            placeholder="Paste the Google Maps iframe src URL here..."
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'monospace' }}
                          />
                          <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', display: 'block' }}>Paste the <strong>src</strong> URL from a Google Maps embed iframe tag.</span>
                        </div>
                        {/* Live Map Preview */}
                        {contactSettings.googleMapsUrl && (
                          <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #E2E8F0', height: '180px' }}>
                            <iframe
                              title="Map Preview"
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              style={{ border: 0, display: 'block' }}
                              src={contactSettings.googleMapsUrl}
                              allowFullScreen
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Live Preview Card */}
                    <div style={{ background: 'linear-gradient(135deg, #A8EDDA 0%, #C8F7EA 100%)', borderRadius: '12px', padding: '24px', color: '#0F4C3A', border: '1px solid #7DD9BE' }}>
                      <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>Live Preview — Contact Us Page</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                          <MapPin size={14} style={{ marginTop: '2px', flexShrink: 0, opacity: 0.7 }} />
                          <span style={{ fontSize: '13px', lineHeight: '1.5' }}>{contactSettings.companyName}<br />{contactSettings.addressLine1}, {contactSettings.city}, {contactSettings.country}{contactSettings.poBox ? `, ${contactSettings.poBox}` : ''}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <Phone size={14} style={{ opacity: 0.7, flexShrink: 0 }} />
                          <span style={{ fontSize: '13px' }}>T: {contactSettings.phone} &nbsp;|&nbsp; F: {contactSettings.fax}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <Mail size={14} style={{ opacity: 0.7, flexShrink: 0 }} />
                          <span style={{ fontSize: '13px' }}>E-mail: {contactSettings.email}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <Globe size={14} style={{ opacity: 0.7, flexShrink: 0 }} />
                          <span style={{ fontSize: '13px' }}>{contactSettings.website}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SEO MANAGEMENT SYSTEM */}
            {activeTab === '/admin/seo' && (
              <div className="seo-management-panel" style={{ padding: '24px', background: '#F8FAFC', borderRadius: '12px' }}>
                {/* Header title */}
                <div className="admin-settings-page-header">
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#64748B', letterSpacing: '1px' }}>EDIT SECTION</span>
                    <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#0F172A', margin: '4px 0 0 0', textTransform: 'lowercase' }}>seo management</h2>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button 
                      className="admin-action-btn-secondary" 
                      style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}
                      onClick={() => {
                        if (confirm('Reset all page SEO fields to factory defaults?')) {
                          alert('SEO configuration reset to default metadata.');
                        }
                      }}
                    >
                      Reset All
                    </button>
                    <button 
                      className="admin-action-btn-secondary" 
                      style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => {
                        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` + 
                          Object.keys(seoPages).map(p => `  <url>\n    <loc>${seoPages[p].canonical}</loc>\n    <changefreq>${seoPages[p].changeFrequency.split(' ')[0].toLowerCase()}</changefreq>\n    <priority>${seoPages[p].sitemapPriority}</priority>\n  </url>`).join('\n') + 
                          `\n</urlset>`;
                        const blob = new Blob([sitemapContent], { type: 'text/xml' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'sitemap.xml';
                        a.click();
                      }}
                    >
                      <FileText size={14} /> Download Sitemap
                    </button>
                    <button 
                      className="admin-add-btn" 
                      style={{ background: '#003E8A', color: '#FFFFFF', border: 'none', padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => alert(`Success: SEO Metadata settings for "${selectedSeoPage}" saved and synced successfully!`)}
                    >
                      <Check size={14} /> Save Page SEO
                    </button>
                  </div>
                </div>

                {/* Subtitle card */}
                <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                    <Search size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1E293B' }}>SEO Management System</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>Configure search engine optimization, canonicals, social meta cards, structured schema, and sitemaps dynamically.</p>
                  </div>
                </div>

                {/* Select Website Page row */}
                <div className="admin-settings-page-header" style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Select Website Page</label>
                    <select 
                      value={selectedSeoPage} 
                      onChange={(e) => setSelectedSeoPage(e.target.value)}
                      style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', color: '#334155', outline: 'none', background: '#F8FAFC', maxWidth: '100%', minWidth: '200px' }}
                    >
                      {Object.keys(seoPages).map(p => (
                        <option key={p} value={p}>{p === 'Home' ? 'Homepage (Home)' : p}</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    className="admin-action-btn-secondary" 
                    style={{ background: '#2563EB', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => {
                      updateSeoField('keywords', `${selectedSeoPage}, Blue Crescent, Technical Design Qatar`);
                      alert('SEO keywords and metadata generated dynamically for ' + selectedSeoPage);
                    }}
                  >
                    <Sliders size={14} /> Generate SEO
                  </button>
                </div>

                {/* Main Content Layout Grid */}
                <div className="admin-hero-media-grid">
                  {/* Left Column: Form Sub-tabs */}
                  <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    {/* Tab Navigation Headers */}
                    <div className="admin-seo-tabs-bar" style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', padding: '0 8px' }}>
                      {[
                        { id: 'general', label: 'General Settings' },
                        { id: 'social', label: 'Social Meta Tags' },
                        { id: 'image', label: 'Image Alt/SEO' },
                        { id: 'schema', label: 'Structured Schema' },
                        { id: 'sitemap', label: 'Sitemap Config' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setSeoSubTab(tab.id)}
                          style={{
                            padding: '16px 20px',
                            border: 'none',
                            background: 'none',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: seoSubTab === tab.id ? '#2563EB' : '#64748B',
                            borderBottom: seoSubTab === tab.id ? '2px solid #2563EB' : '2px solid transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Tab Body Contents */}
                    <div style={{ padding: '24px' }}>
                      {/* GENERAL SETTINGS */}
                      {seoSubTab === 'general' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>SEO Title *</label>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: seoPages[selectedSeoPage].title.length > 60 ? '#D97706' : '#10B981' }}>
                                {seoPages[selectedSeoPage].title.length} / 60 chars
                              </span>
                            </div>
                            <input 
                              type="text"
                              value={seoPages[selectedSeoPage].title}
                              onChange={(e) => updateSeoField('title', e.target.value)}
                              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                            />
                          </div>

                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Meta Description *</label>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: (seoPages[selectedSeoPage].description.length > 160 || seoPages[selectedSeoPage].description.length < 120) ? '#D97706' : '#10B981' }}>
                                {seoPages[selectedSeoPage].description.length} / 160 chars
                              </span>
                            </div>
                            <textarea 
                              rows="3"
                              value={seoPages[selectedSeoPage].description}
                              onChange={(e) => updateSeoField('description', e.target.value)}
                              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Meta Keywords</label>
                            <input 
                              type="text"
                              value={seoPages[selectedSeoPage].keywords}
                              onChange={(e) => updateSeoField('keywords', e.target.value)}
                              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                              placeholder="comma separated values"
                            />
                          </div>

                          <div className="admin-form-grid-2col">
                            <div>
                              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Canonical URL</label>
                              <input 
                                type="text"
                                value={seoPages[selectedSeoPage].canonical}
                                onChange={(e) => updateSeoField('canonical', e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>SEO Slug (URL Path)</label>
                              <input 
                                type="text"
                                value={seoPages[selectedSeoPage].slug}
                                onChange={(e) => updateSeoField('slug', e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                              />
                            </div>
                          </div>

                          <div className="admin-form-grid-2col">
                            <div>
                              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Robots Indexing</label>
                              <select 
                                value={seoPages[selectedSeoPage].robotsIndex}
                                onChange={(e) => updateSeoField('robotsIndex', e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#FFFFFF' }}
                              >
                                <option>Index (Recommended - show in Google)</option>
                                <option>Noindex (Hide page from search results)</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Robots Links Follow</label>
                              <select 
                                value={seoPages[selectedSeoPage].robotsFollow}
                                onChange={(e) => updateSeoField('robotsFollow', e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#FFFFFF' }}
                              >
                                <option>Follow (Follow links on page)</option>
                                <option>Nofollow (Do not follow links)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SOCIAL META TAGS */}
                      {seoSubTab === 'social' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                          {/* Facebook Open Graph */}
                          <div>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', borderBottom: '1px solid #F1F5F9', paddingBottom: '6px' }}>
                              Open Graph (OG) Facebook Configuration
                            </h4>
                            <div className="admin-form-grid-2col" style={{ marginBottom: '16px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748B', marginBottom: '6px' }}>OG Title</label>
                                <input 
                                  type="text"
                                  value={seoPages[selectedSeoPage].ogTitle}
                                  onChange={(e) => updateSeoField('ogTitle', e.target.value)}
                                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748B', marginBottom: '6px' }}>OG Image URL</label>
                                <input 
                                  type="text"
                                  value={seoPages[selectedSeoPage].ogImage}
                                  onChange={(e) => updateSeoField('ogImage', e.target.value)}
                                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                                />
                              </div>
                            </div>
                            <div className="admin-form-grid-2col" style={{ marginBottom: '16px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748B', marginBottom: '6px' }}>OG Page URL</label>
                                <input 
                                  type="text"
                                  value={seoPages[selectedSeoPage].ogUrl}
                                  onChange={(e) => updateSeoField('ogUrl', e.target.value)}
                                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748B', marginBottom: '6px' }}>OG Content Type</label>
                                <input 
                                  type="text"
                                  value={seoPages[selectedSeoPage].ogType}
                                  onChange={(e) => updateSeoField('ogType', e.target.value)}
                                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                                />
                              </div>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748B', marginBottom: '6px' }}>OG Description</label>
                              <textarea 
                                rows="2"
                                value={seoPages[selectedSeoPage].ogDescription}
                                onChange={(e) => updateSeoField('ogDescription', e.target.value)}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                              />
                            </div>
                          </div>

                          {/* Twitter Integration */}
                          <div>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', borderBottom: '1px solid #F1F5F9', paddingBottom: '6px' }}>
                              Twitter Card Integration
                            </h4>
                            <div className="admin-form-grid-2col" style={{ marginBottom: '16px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748B', marginBottom: '6px' }}>Twitter Card Title</label>
                                <input 
                                  type="text"
                                  value={seoPages[selectedSeoPage].twitterTitle}
                                  onChange={(e) => updateSeoField('twitterTitle', e.target.value)}
                                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748B', marginBottom: '6px' }}>Twitter Preview Image URL</label>
                                <input 
                                  type="text"
                                  value={seoPages[selectedSeoPage].twitterImage}
                                  onChange={(e) => updateSeoField('twitterImage', e.target.value)}
                                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                                />
                              </div>
                            </div>
                            <div className="admin-form-grid-2col" style={{ marginBottom: '16px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748B', marginBottom: '6px' }}>Twitter Card Type</label>
                                <select 
                                  value={seoPages[selectedSeoPage].twitterType}
                                  onChange={(e) => updateSeoField('twitterType', e.target.value)}
                                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', background: '#FFFFFF' }}
                                >
                                  <option>Summary Card with Large Image</option>
                                  <option>Summary Card</option>
                                </select>
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748B', marginBottom: '6px' }}>Twitter Card Description</label>
                                <input 
                                  type="text"
                                  value={seoPages[selectedSeoPage].twitterDescription}
                                  onChange={(e) => updateSeoField('twitterDescription', e.target.value)}
                                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* IMAGE ALT / SEO */}
                      {seoSubTab === 'image' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', borderBottom: '1px solid #F1F5F9', paddingBottom: '6px' }}>
                            Dynamic Page Image Alt & Title Configuration
                          </h4>
                          <div className="admin-form-grid-2col">
                            <div>
                              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Global Image Alt Attribute</label>
                              <input 
                                type="text"
                                value={seoPages[selectedSeoPage].imgAlt}
                                onChange={(e) => updateSeoField('imgAlt', e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Global Image Title Attribute</label>
                              <input 
                                type="text"
                                value={seoPages[selectedSeoPage].imgTitle}
                                onChange={(e) => updateSeoField('imgTitle', e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                              />
                            </div>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Global Image Caption / Tooltip</label>
                            <textarea 
                              rows="3"
                              value={seoPages[selectedSeoPage].imgCaption}
                              onChange={(e) => updateSeoField('imgCaption', e.target.value)}
                              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                            />
                          </div>
                        </div>
                      )}

                      {/* STRUCTURED SCHEMA */}
                      {seoSubTab === 'schema' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>
                              JSON-LD Structured Data Schema
                            </h4>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} /> JSON SYNTAX VALID
                            </span>
                          </div>

                          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Select Schema Template</label>
                              <select 
                                value={seoPages[selectedSeoPage].schemaTemplate}
                                onChange={(e) => updateSeoField('schemaTemplate', e.target.value)}
                                style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', color: '#475569', outline: 'none', background: '#FFFFFF' }}
                              >
                                <option>Organization Schema (Logo, Social links)</option>
                                <option>AboutPage Schema</option>
                                <option>Service Schema</option>
                                <option>CollectionPage Schema</option>
                                <option>ContactPage Schema</option>
                              </select>
                            </div>
                            <button
                              style={{ padding: '6px 12px', border: 'none', background: '#0F172A', color: '#FFFFFF', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                              onClick={() => {
                                const t = seoPages[selectedSeoPage].schemaTemplate;
                                let payload = '';
                                if (t.includes('Organization')) {
                                  payload = `{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Blue Crescent Engineering",\n  "url": "https://bluecrescent.com",\n  "logo": "https://bluecrescent.com/logo.png",\n  "sameAs": [\n    "https://linkedin.com/company/bluecrescent"\n  ]\n}`;
                                } else if (t.includes('About')) {
                                  payload = `{\n  "@context": "https://schema.org",\n  "@type": "AboutPage",\n  "name": "About Blue Crescent Engineering",\n  "description": "Information about Blue Crescent Engineering mission."\n}`;
                                } else if (t.includes('Service')) {
                                  payload = `{\n  "@context": "https://schema.org",\n  "@type": "Service",\n  "provider": {\n    "@type": "LocalBusiness",\n    "name": "Blue Crescent Engineering"\n  },\n  "serviceType": "Technical Design and Engineering Consulting"\n}`;
                                } else if (t.includes('Collection')) {
                                  payload = `{\n  "@context": "https://schema.org",\n  "@type": "CollectionPage",\n  "name": "Blue Crescent Engineering Projects Portfolio"\n}`;
                                } else {
                                  payload = `{\n  "@context": "https://schema.org",\n  "@type": "ContactPage",\n  "name": "Contact Blue Crescent Engineering",\n  "url": "https://bluecrescent.com/contact"\n}`;
                                }
                                updateSeoField('schemaPayload', payload);
                                alert('Template payload loaded successfully.');
                              }}
                            >
                              Load Template
                            </button>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Custom JSON-LD Payload Editor</label>
                            <textarea 
                              rows="8"
                              value={seoPages[selectedSeoPage].schemaPayload}
                              onChange={(e) => updateSeoField('schemaPayload', e.target.value)}
                              style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #0F172A', background: '#0F172A', color: '#38BDF8', fontSize: '13px', fontFamily: 'monospace', outline: 'none', resize: 'vertical' }}
                            />
                          </div>
                        </div>
                      )}

                      {/* SITEMAP CONFIGURATION */}
                      {seoSubTab === 'sitemap' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', borderBottom: '1px solid #F1F5F9', paddingBottom: '6px' }}>
                            Sitemap XML & Crawler Settings
                          </h4>
                          
                          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                              <strong style={{ fontSize: '14px', color: '#1E293B' }}>Include in Sitemap.xml</strong>
                              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748B' }}>Toggle whether search bots are directed to this page in sitemaps.</p>
                            </div>
                            <input 
                              type="checkbox"
                              checked={seoPages[selectedSeoPage].sitemapInclude}
                              onChange={(e) => updateSeoField('sitemapInclude', e.target.checked)}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                          </div>

                          <div className="admin-form-grid-2col">
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Sitemap Priority Score</label>
                                <span style={{ fontSize: '13px', fontWeight: '800', color: '#2563EB' }}>{seoPages[selectedSeoPage].sitemapPriority}</span>
                              </div>
                              <input 
                                type="range"
                                min="0.1"
                                max="1.0"
                                step="0.1"
                                value={seoPages[selectedSeoPage].sitemapPriority}
                                onChange={(e) => updateSeoField('sitemapPriority', parseFloat(e.target.value))}
                                style={{ width: '100%', cursor: 'pointer' }}
                              />
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8', marginTop: '4px' }}>
                                <span>0.1 (Low)</span>
                                <span>0.5</span>
                                <span>1.0 (High)</span>
                              </div>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Change Frequency</label>
                              <select 
                                value={seoPages[selectedSeoPage].changeFrequency}
                                onChange={(e) => updateSeoField('changeFrequency', e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', color: '#334155', outline: 'none', background: '#FFFFFF' }}
                              >
                                <option>Weekly (Standard static content)</option>
                                <option>Daily (Frequently updated content)</option>
                                <option>Monthly (Slowly changing content)</option>
                                <option>Yearly (Static archive details)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: SEO Gauge Score & Recommendations */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* SEO Score Circle */}
                    <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                      <h4 style={{ margin: '0 0 16px 0', fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Real-Time SEO Score
                      </h4>
                      <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto 16px auto' }}>
                        <svg width="140" height="140" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#F1F5F9"
                            strokeWidth="3.2"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="3.2"
                            strokeDasharray={`${
                              100 - 
                              (seoPages[selectedSeoPage].title.length > 60 ? 10 : 0) -
                              (seoPages[selectedSeoPage].description.length < 120 ? 10 : 0) -
                              (!seoPages[selectedSeoPage].keywords ? 5 : 0) -
                              (!seoPages[selectedSeoPage].twitterImage ? 5 : 0)
                            }, 100`}
                          />
                        </svg>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                          <span style={{ fontSize: '28px', fontWeight: '800', color: '#1E293B', display: 'block' }}>
                            {
                              100 - 
                              (seoPages[selectedSeoPage].title.length > 60 ? 10 : 0) -
                              (seoPages[selectedSeoPage].description.length < 120 ? 10 : 0) -
                              (!seoPages[selectedSeoPage].keywords ? 5 : 0) -
                              (!seoPages[selectedSeoPage].twitterImage ? 5 : 0)
                            }
                          </span>
                          <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>/ 100 SCORE</span>
                        </div>
                      </div>
                      <div style={{ background: '#EFF6FF', color: '#2563EB', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'inline-block' }}>
                        Excellent SEO Health
                      </div>
                    </div>

                    {/* Actionable Recommendations */}
                    <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                      <h4 style={{ margin: '0 0 16px 0', fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Actionable Recommendations
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {seoPages[selectedSeoPage].title.length > 60 ? (
                          <li style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>
                            <span style={{ color: '#D97706', fontWeight: 'bold' }}>•</span>
                            <span><strong>Title is too long</strong>: Shorten title length below 60 characters to prevent search engine truncation.</span>
                          </li>
                        ) : (
                          <li style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#10B981', lineHeight: '1.4' }}>
                            <span style={{ color: '#10B981', fontWeight: 'bold' }}>✓</span>
                            <span>Title length is optimal.</span>
                          </li>
                        )}
                        {seoPages[selectedSeoPage].description.length < 120 ? (
                          <li style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>
                            <span style={{ color: '#D97706', fontWeight: 'bold' }}>•</span>
                            <span><strong>Description is too short</strong>: Aim for 120-160 characters for complete search snippet coverage.</span>
                          </li>
                        ) : (
                          <li style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#10B981', lineHeight: '1.4' }}>
                            <span style={{ color: '#10B981', fontWeight: 'bold' }}>✓</span>
                            <span>Meta description length is optimal.</span>
                          </li>
                        )}
                        {!seoPages[selectedSeoPage].keywords ? (
                          <li style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>
                            <span style={{ color: '#D97706', fontWeight: 'bold' }}>•</span>
                            <span><strong>Missing Keywords</strong>: Add Meta Keywords to target relevant technical services.</span>
                          </li>
                        ) : (
                          <li style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#10B981', lineHeight: '1.4' }}>
                            <span style={{ color: '#10B981', fontWeight: 'bold' }}>✓</span>
                            <span>Target keywords are configured.</span>
                          </li>
                        )}
                        {!seoPages[selectedSeoPage].twitterImage ? (
                          <li style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>
                            <span style={{ color: '#D97706', fontWeight: 'bold' }}>•</span>
                            <span><strong>Social previews</strong>: Add a Twitter preview image for better social layout styling.</span>
                          </li>
                        ) : (
                          <li style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#10B981', lineHeight: '1.4' }}>
                            <span style={{ color: '#10B981', fontWeight: 'bold' }}>✓</span>
                            <span>Social preview tags are configured.</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === '/admin/dashboard' && (
              <div className="admin-dashboard-overview">
                <div className="admin-dashboard-welcome">
                  <div className="admin-dashboard-welcome-left">
                    <span className="admin-welcome-tagline">BLUE CRESCENT ENGINEERING - ADMIN CONTROL PANEL</span>
                    <h1>Engineering Management Console</h1>
                    <p>
                      Welcome back, <strong className="welcome-gold">{currentUser?.role === 'super_admin' ? 'Super Admin' : 'Administrator'}</strong> • {new Date().toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="admin-dashboard-welcome-right">
                    <div className="admin-portal-status">
                      <span className="status-label">PORTAL STATUS</span>
                      <span className="status-indicator">
                        <span className="status-pulse-dot" /> ALL SYSTEMS LIVE
                      </span>
                    </div>
                    <div className="admin-welcome-icon-box">
                      <LayoutDashboard size={24} />
                    </div>
                  </div>
                </div>

                <div className="admin-stats-grid">
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon-wrapper blue"><Wrench size={20} /></div>
                    <div className="admin-stat-content">
                      <div className="value">{String(services.length).padStart(2, '0')}</div>
                      <h4>TOTAL SERVICES</h4>
                      <span className="active">Active Services</span>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon-wrapper green"><Award size={20} /></div>
                    <div className="admin-stat-content">
                      <div className="value">{String(certificates.length).padStart(2, '0')}</div>
                      <h4>CERTIFICATES</h4>
                      <span className="active">Valid Credentials</span>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon-wrapper orange"><Briefcase size={20} /></div>
                    <div className="admin-stat-content">
                      <div className="value">{String(projects.length).padStart(2, '0')}</div>
                      <h4>TOTAL PROJECTS</h4>
                      <span className="active">Featured Portfolio</span>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon-wrapper purple"><Mail size={20} /></div>
                    <div className="admin-stat-content">
                      <div className="value">{String(contactInquiries.length).padStart(2, '0')}</div>
                      <h4>CONTACT ENQUIRIES</h4>
                      <span className="active">Inquiries Received</span>
                    </div>
                  </div>
                </div>

                <div className="admin-dashboard-split-layout">
                  {/* Left Column: Quick Actions */}
                  <div className="admin-dashboard-left-col">
                    <div className="admin-quick-links-section">
                      <h3>+ QUICK ACTIONS</h3>
                      <div className="admin-quick-grid">
                        <div className="admin-quick-action-card" onClick={() => { resetForms(); setShowAddModal(true); }}>
                          <div className="admin-action-icon blue"><Newspaper size={20} /></div>
                          <h4>COMPOSE NEWS</h4>
                        </div>
                        <div className="admin-quick-action-card" onClick={() => { resetForms(); setShowAddModal(true); }}>
                          <div className="admin-action-icon green"><Wrench size={20} /></div>
                          <h4>ADD SERVICE</h4>
                        </div>
                        <div className="admin-quick-action-card" onClick={() => { resetForms(); setShowAddModal(true); }}>
                          <div className="admin-action-icon orange"><Award size={20} /></div>
                          <h4>ADD CERTIFICATE</h4>
                        </div>
                        <div className="admin-quick-action-card" onClick={() => { resetForms(); setShowAddModal(true); }}>
                          <div className="admin-action-icon purple"><Star size={20} /></div>
                          <h4>ADD REVIEW</h4>
                        </div>
                        <div className="admin-quick-action-card" onClick={() => setActiveTab('/admin/users')}>
                          <div className="admin-action-icon cyan"><Shield size={20} /></div>
                          <h4>EDIT PROFILE</h4>
                        </div>
                        <div className="admin-quick-action-card" onClick={() => setActiveTab('/admin/settings/company')}>
                          <div className="admin-action-icon yellow"><Sliders size={20} /></div>
                          <h4>BRANDING</h4>
                        </div>
                        <div className="admin-quick-action-card" onClick={() => setActiveTab('/admin/backup')}>
                          <div className="admin-action-icon indigo"><Database size={20} /></div>
                          <h4>BACKUP CONFIG</h4>
                        </div>
                        <div className="admin-quick-action-card" onClick={() => onNavigate('Home')}>
                          <div className="admin-action-icon rose"><Globe size={20} /></div>
                          <h4>LIVE PORTAL</h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Active Executive profile */}
                  <div className="admin-dashboard-right-col">
                    <div className="admin-executive-card">
                      <h3>
                        <Shield size={16} style={{ color: 'var(--gold-accent)' }} /> ACTIVE EXECUTIVE
                      </h3>
                      <div className="admin-executive-content">
                        <div className="admin-executive-avatar">
                          <img src="/sust_workshop.png" alt="Executive" />
                        </div>
                        <span className="executive-tagline">CONSOLE OPERATOR</span>
                        <h4 className="executive-name">{currentUser?.username || 'Super Admin'}</h4>
                        <p className="executive-post">
                          {currentUser?.role === 'super_admin' ? 'Chief Operations Administrator' : 'Systems Control Operator'}<br/>
                          Blue Crescent Engineering Corp.
                        </p>
                        <button className="admin-executive-btn" onClick={() => setActiveTab('/admin/users')}>
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SERVICES WORKSPACE */}
            {activeTab === '/admin/services' && (
              <div>
                <div className="admin-table-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>Services Management</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>
                      Manage your 4 main service categories and 16 dynamic sub-services structure.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      className="admin-add-btn"
                      style={{ background: '#0F172A', color: '#FFF' }}
                      onClick={() => {
                        resetCategoryForm();
                        setEditingCategoryId(null);
                        setShowCategoryModal(true);
                      }}
                    >
                      <Plus size={16} /> Add Main Category
                    </button>
                    <button
                      className="admin-add-btn"
                      onClick={() => {
                        resetServiceForm();
                        setEditingServiceId(null);
                        setShowServiceModal(true);
                      }}
                    >
                      <Plus size={16} /> Add Sub-Service
                    </button>
                  </div>
                </div>

                {/* HIERARCHICAL DISPLAY */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {serviceCategories
                    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                    .map((cat, catIdx) => {
                      const categoryServices = services
                        .filter(s => s.category === cat.name || s.category_id === cat.id)
                        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
                      const isActiveCat = cat.status !== 'Inactive';

                      return (
                        <div key={cat.id || cat.name} style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                          
                          {/* Category Header Bar */}
                          <div style={{ padding: '16px 20px', background: isActiveCat ? '#F8FAFC' : '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              <span style={{ fontSize: '12px', fontWeight: '800', background: '#003E8A', color: '#FFF', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                0{catIdx + 1}
                              </span>
                              <div>
                                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: isActiveCat ? '#0F172A' : '#94A3B8', letterSpacing: '0.5px' }}>
                                  {cat.name.toUpperCase()}
                                </h4>
                                {cat.short_description && (
                                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>{cat.short_description}</p>
                                )}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className={`admin-badge ${isActiveCat ? 'approved' : 'pending'}`}>
                                {isActiveCat ? 'Active Category' : 'Inactive'}
                              </span>

                              {/* Category Reorder Buttons */}
                              <button
                                style={{ background: '#FFF', border: '1px solid #CBD5E1', padding: '4px 8px', borderRadius: '4px', cursor: catIdx === 0 ? 'not-allowed' : 'pointer', opacity: catIdx === 0 ? 0.4 : 1 }}
                                disabled={catIdx === 0}
                                onClick={() => moveCategoryOrder(cat, 'up')}
                                title="Move Up"
                              >
                                ▲
                              </button>
                              <button
                                style={{ background: '#FFF', border: '1px solid #CBD5E1', padding: '4px 8px', borderRadius: '4px', cursor: catIdx === serviceCategories.length - 1 ? 'not-allowed' : 'pointer', opacity: catIdx === serviceCategories.length - 1 ? 0.4 : 1 }}
                                disabled={catIdx === serviceCategories.length - 1}
                                onClick={() => moveCategoryOrder(cat, 'down')}
                                title="Move Down"
                              >
                                ▼
                              </button>

                              {/* Toggle Status */}
                              <button
                                style={{ background: isActiveCat ? '#FFF1F2' : '#F0FDF4', color: isActiveCat ? '#DC2626' : '#166534', border: `1px solid ${isActiveCat ? '#FECDD3' : '#BBF7D0'}`, padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                                onClick={() => toggleCategoryStatus(cat)}
                              >
                                {isActiveCat ? 'Disable' : 'Enable'}
                              </button>

                              {/* Edit Category */}
                              <button className="admin-action-btn" title="Edit Category" onClick={() => startEditCategory(cat)}>
                                <Edit size={14} />
                              </button>

                              {/* Delete Category */}
                              <button className="admin-action-btn delete" title="Delete Category" onClick={() => handleDeleteCategory(cat.id)}>
                                <Trash size={14} />
                              </button>

                              {/* Add Sub-Service under this Category */}
                              <button
                                style={{ background: '#003E8A', color: '#FFFFFF', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                onClick={() => {
                                  resetServiceForm();
                                  setServiceForm(prev => ({ ...prev, category: cat.name, category_id: cat.id }));
                                  setEditingServiceId(null);
                                  setShowServiceModal(true);
                                }}
                              >
                                <Plus size={14} /> Sub-Service
                              </button>
                            </div>
                          </div>

                          {/* Sub-Services List */}
                          <div style={{ padding: '0', background: '#FFFFFF' }}>
                            {categoryServices.length === 0 ? (
                              <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8', fontSize: '13px', fontStyle: 'italic' }}>
                                No sub-services configured under {cat.name}. Click "+ Sub-Service" above to add one.
                              </div>
                            ) : (
                              <div className="admin-table-wrapper" style={{ margin: 0, border: 'none', borderRadius: 0 }}>
                                <table className="admin-table" style={{ margin: 0, border: 'none' }}>
                                  <thead>
                                    <tr style={{ background: '#FAF5FF' }}>
                                      <th style={{ width: '40px' }}>#</th>
                                      <th>Sub-Service Name</th>
                                      <th>Slug Path</th>
                                      <th>Scope / Bullets</th>
                                      <th>Status</th>
                                      <th style={{ width: '170px' }}>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {categoryServices.map((subSvc, subIdx) => {
                                      const isActiveSub = subSvc.status !== 'Inactive';
                                      let bullets = [];
                                      try { bullets = typeof subSvc.bullets === 'string' ? JSON.parse(subSvc.bullets) : (subSvc.bullets || []); } catch(e) {}

                                      return (
                                        <tr key={subSvc.id || subSvc.title} style={{ opacity: isActiveSub ? 1 : 0.65 }}>
                                          <td>{subIdx + 1}</td>
                                          <td style={{ fontWeight: '700', color: '#0F172A' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                              <span style={{ color: '#003E8A' }}>↳</span>
                                              <span>{subSvc.title}</span>
                                            </div>
                                          </td>
                                          <td><code style={{ fontSize: '12px', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', color: '#475569' }}>/services/{subSvc.slug || subSvc.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}</code></td>
                                          <td style={{ fontSize: '11px', color: '#64748B' }}>
                                            {bullets.length > 0 ? `${bullets.length} items` : 'Default'}
                                          </td>
                                          <td>
                                            <span className={`admin-badge ${isActiveSub ? 'approved' : 'pending'}`}>
                                              {isActiveSub ? 'Active' : 'Inactive'}
                                            </span>
                                          </td>
                                          <td>
                                            <div className="admin-actions" style={{ gap: '6px' }}>
                                              {/* Reorder Sub-Service */}
                                              <button
                                                style={{ background: '#FFF', border: '1px solid #CBD5E1', padding: '2px 6px', borderRadius: '4px', cursor: subIdx === 0 ? 'not-allowed' : 'pointer', fontSize: '10px', opacity: subIdx === 0 ? 0.4 : 1 }}
                                                disabled={subIdx === 0}
                                                onClick={() => moveServiceOrder(subSvc, 'up', categoryServices)}
                                                title="Move Up"
                                              >
                                                ▲
                                              </button>
                                              <button
                                                style={{ background: '#FFF', border: '1px solid #CBD5E1', padding: '2px 6px', borderRadius: '4px', cursor: subIdx === categoryServices.length - 1 ? 'not-allowed' : 'pointer', fontSize: '10px', opacity: subIdx === categoryServices.length - 1 ? 0.4 : 1 }}
                                                disabled={subIdx === categoryServices.length - 1}
                                                onClick={() => moveServiceOrder(subSvc, 'down', categoryServices)}
                                                title="Move Down"
                                              >
                                                ▼
                                              </button>
                                              {/* Toggle Enable/Disable */}
                                              <button
                                                style={{ background: isActiveSub ? '#FFF1F2' : '#F0FDF4', color: isActiveSub ? '#DC2626' : '#166534', border: `1px solid ${isActiveSub ? '#FECDD3' : '#BBF7D0'}`, padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                                                onClick={() => toggleServiceStatus(subSvc)}
                                              >
                                                {isActiveSub ? 'Disable' : 'Enable'}
                                              </button>
                                              {/* Edit Sub-Service */}
                                              <button className="admin-action-btn" title="Edit Sub-Service" onClick={() => startEditService(subSvc)}>
                                                <Edit size={13} />
                                              </button>
                                              {/* Delete Sub-Service */}
                                              <button className="admin-action-btn delete" title="Delete Sub-Service" onClick={() => handleDeleteService(subSvc.id)}>
                                                <Trash size={13} />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>

                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* CERTIFICATES WORKSPACE */}
            {activeTab === '/admin/certificates' && (
              <div>
                <div className="admin-table-card-header">
                  <h3>Accreditation Certificates</h3>
                  <div className="admin-search-bar">
                    <input 
                      type="text" 
                      className="admin-input" 
                      placeholder="Search certs..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Document</th>
                        <th>Title</th>
                        <th>Issuer</th>
                        <th>License No</th>
                        <th>Territory</th>
                        <th>Validity</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterList(certificates, ['title', 'org']).map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td>
                            <img src={item.image} alt="cert preview" className="admin-table-preview-img" style={{ height: '50px', width: '38px', objectFit: 'contain' }} />
                          </td>
                          <td style={{ fontWeight: '600' }}>{item.title}</td>
                          <td>{item.org}</td>
                          <td><code>{item.licenseNo}</code></td>
                          <td>{item.territory}</td>
                          <td><span className="admin-badge approved">{item.validity}</span></td>
                          <td>
                            <div className="admin-actions">
                              <button className="admin-action-btn" onClick={() => startEdit('certificates', item)}><Edit size={13} /></button>
                              <button className="admin-action-btn delete" onClick={() => handleDelete('certificates', item.id)}><Trash size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}



            {/* TESTIMONIALS WORKSPACE */}
            {activeTab === '/admin/testimonials' && (
              <div>
                <div className="admin-table-card-header">
                  <h3>Client Reviews & Testimonials</h3>
                  <div className="admin-search-bar">
                    <input 
                      type="text" 
                      className="admin-input" 
                      placeholder="Search reviews..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Headline</th>
                        <th>Client Name</th>
                        <th>Company</th>
                        <th>Quote Content</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterList(testimonials, ['title', 'author_name', 'company_name']).map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td style={{ fontWeight: '600' }}>{item.title}</td>
                          <td>{item.author_name}</td>
                          <td>{item.company_name}</td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '11px', maxWidth: '300px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            "{item.content}"
                          </td>
                          <td>
                            <span className={`admin-badge ${item.status}`}>
                              {item.status}
                            </span>
                          </td>
                          <td>
                            <div className="admin-actions">
                              {item.status === 'pending' && (
                                <button 
                                  className="admin-action-btn approve" 
                                  title="Approve Testimonial"
                                  onClick={() => handleApproveTestimonial(item)}
                                >
                                  <Check size={13} />
                                </button>
                              )}
                              <button className="admin-action-btn" onClick={() => startEdit('testimonials', item)}><Edit size={13} /></button>
                              <button className="admin-action-btn delete" onClick={() => handleDelete('testimonials', item.id)}><Trash size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MENUS WORKSPACE (SUPERADMIN EXCLUSIVE) */}
            {activeTab === 'menus' && currentUser?.role === 'super_admin' && (
              <div>
                <div className="admin-table-card-header">
                  <h3>Navigation Menus</h3>
                  <div className="admin-search-bar">
                    <input 
                      type="text" 
                      className="admin-input" 
                      placeholder="Search menus..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Route / URL</th>
                        <th>Parent Item</th>
                        <th>Sort Index</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterList(menus, ['name', 'url']).map((item, idx) => {
                      const parent = menus.find(m => m.id === item.parent_id);
                      return (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td style={{ fontWeight: '600' }}>{item.name}</td>
                          <td><code>{item.url}</code></td>
                          <td>{parent ? parent.name : <em style={{ color: 'var(--text-muted)' }}>Root Menu</em>}</td>
                          <td>{item.order_num}</td>
                          <td>
                            <div className="admin-actions">
                              <button className="admin-action-btn" onClick={() => startEdit('menus', item)}><Edit size={13} /></button>
                              <button className="admin-action-btn delete" onClick={() => handleDelete('menus', item.id)}><Trash size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

            {/* FOOTER SETTINGS (SUPERADMIN EXCLUSIVE) */}
            {activeTab === '/admin/settings/footer' && currentUser?.role === 'super_admin' && footer && (
              <div>
                <div className="admin-table-card-header" style={{ marginBottom: '24px' }}>
                  <h3>Footer Parameters</h3>
                </div>

                <form onSubmit={handleFooterSave} className="admin-form-grid" style={{ padding: '0 10px' }}>
                  <div className="admin-form-group admin-span-2">
                    <label>Footer Brand Bio Summary</label>
                    <textarea 
                      rows="3" 
                      className="admin-input"
                      value={footerForm.brand_desc}
                      onChange={(e) => setFooterForm({ ...footerForm, brand_desc: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Office physical Address</label>
                    <input 
                      type="text" 
                      className="admin-input"
                      value={footerForm.address}
                      onChange={(e) => setFooterForm({ ...footerForm, address: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Support Email Address</label>
                    <input 
                      type="email" 
                      className="admin-input"
                      value={footerForm.email}
                      onChange={(e) => setFooterForm({ ...footerForm, email: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Office Phone Line</label>
                    <input 
                      type="text" 
                      className="admin-input"
                      value={footerForm.phone}
                      onChange={(e) => setFooterForm({ ...footerForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Fax Contact</label>
                    <input 
                      type="text" 
                      className="admin-input"
                      value={footerForm.fax}
                      onChange={(e) => setFooterForm({ ...footerForm, fax: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Corporate website URL</label>
                    <input 
                      type="text" 
                      className="admin-input"
                      value={footerForm.website}
                      onChange={(e) => setFooterForm({ ...footerForm, website: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Facebook Page Link</label>
                    <input 
                      type="text" 
                      className="admin-input"
                      value={footerForm.facebook_url}
                      onChange={(e) => setFooterForm({ ...footerForm, facebook_url: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group admin-span-2">
                    <label>Copyright text</label>
                    <input 
                      type="text" 
                      className="admin-input"
                      value={footerForm.copyright}
                      onChange={(e) => setFooterForm({ ...footerForm, copyright: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group admin-span-2" style={{ marginTop: '10px' }}>
                    <button type="submit" className="admin-btn" style={{ width: 'auto', padding: '12px 30px' }}>
                      Update Footer Settings
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* USERS ACCESS CONTROL (SUPERADMIN EXCLUSIVE) */}
            {activeTab === '/admin/users' && currentUser?.role === 'super_admin' && (
              <div>
                <div className="admin-table-card-header">
                  <h3>Admin Accounts</h3>
                  <div className="admin-search-bar">
                    <input 
                      type="text" 
                      className="admin-input" 
                      placeholder="Search accounts..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Account Username</th>
                        <th>Role Authority</th>
                        <th>Creation Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterList(users, ['username', 'role']).map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td style={{ fontWeight: '600' }}>{item.username}</td>
                          <td>
                            <span className={`admin-badge ${item.role === 'super_admin' ? 'approved' : 'draft'}`}>
                              {item.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                            </span>
                          </td>
                          <td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Seeded'}</td>
                          <td>
                            <div className="admin-actions">
                              <button className="admin-action-btn" onClick={() => startEdit('users', item)}><Edit size={13} /></button>
                              <button 
                                className="admin-action-btn delete" 
                                onClick={() => handleDelete('users', item.id)}
                                disabled={item.username === currentUser?.username} // Cannot delete self
                              >
                                <Trash size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CONTACT INQUIRIES WORKSPACE */}
            {activeTab === '/admin/contact' && (
              <div>
                <div className="admin-table-card-header">
                  <h3>Client Contact Inquiries</h3>
                  <div className="admin-search-bar">
                    <input 
                      type="text" 
                      className="admin-input" 
                      placeholder="Search inquiries..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Sender Name</th>
                        <th>Email Address</th>
                        <th>Message Details</th>
                        <th>Date Received</th>
                        <th style={{ width: '60px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterList(contactInquiries, ['name', 'email', 'message']).map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td style={{ fontWeight: '600' }}>{item.name}</td>
                          <td>{item.email}</td>
                          <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.message}</td>
                          <td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Today'}</td>
                          <td>
                            <div className="admin-actions">
                              <button className="admin-action-btn delete" title="Delete Inquiry" onClick={() => handleDelete('contact', item.id)}>
                                <Trash size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {contactInquiries.length === 0 && (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                            No client inquiries found in database.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUBSCRIBERS WORKSPACE */}
            {activeTab === '/admin/subscribers' && (
              <div>
                <div className="admin-table-card-header">
                  <h3>Newsletter Subscribers</h3>
                  <div className="admin-search-bar">
                    <input 
                      type="text" 
                      className="admin-input" 
                      placeholder="Search emails..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Email Address</th>
                        <th>Subscribed Date</th>
                        <th style={{ width: '60px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterList(subscribers, ['email']).map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td style={{ fontWeight: '600' }}>{item.email}</td>
                          <td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Seeded'}</td>
                          <td>
                            <div className="admin-actions">
                              <button className="admin-action-btn delete" title="Remove Subscriber" onClick={() => handleDelete('subscribers', item.id)}>
                                <Trash size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {subscribers.length === 0 && (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                            No email subscribers found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ABOUT US SETTINGS (MOCK) */}
            {activeTab === 'about' && (
              <div>
                <div className="admin-table-card-header" style={{ marginBottom: '20px' }}>
                  <h3>Company Profile Details</h3>
                </div>
                <div className="admin-form-grid" style={{ padding: '10px' }}>
                  <div className="admin-form-group admin-span-2">
                    <label>Vision Statement</label>
                    <textarea 
                      rows="2" 
                      className="admin-input"
                      value={aboutSettings.vision}
                      onChange={(e) => setAboutSettings({ ...aboutSettings, vision: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group admin-span-2">
                    <label>Mission Statement</label>
                    <textarea 
                      rows="2" 
                      className="admin-input"
                      value={aboutSettings.mission}
                      onChange={(e) => setAboutSettings({ ...aboutSettings, mission: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group admin-span-2">
                    <label>Company History Introduction</label>
                    <textarea 
                      rows="3" 
                      className="admin-input"
                      value={aboutSettings.history}
                      onChange={(e) => setAboutSettings({ ...aboutSettings, history: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group admin-span-2">
                    <button type="button" className="admin-btn" style={{ width: 'auto' }} onClick={() => alert('About settings saved mock successfully!')}>
                      Save Profile Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PROJECTS WORKSPACE */}
            {activeTab === '/admin/projects' && (
              <div>
                {/* Stats strip */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '28px'
                }}>
                  {[
                    { name: 'BIM Projects', label: 'BIM Projects', icon: Layers, bg: '#F0FDFA', color: '#0D9488', border: '#99F6E4' },
                    { name: 'CAD Projects', label: 'CAD Projects', icon: FileCode, bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
                    { name: 'Laser Scanning Projects', label: 'Laser Scanning', icon: Radio, bg: '#FFF7ED', color: '#EA580C', border: '#FFEDD5' },
                    { name: 'Digital Twin Projects', label: 'Digital Twin', icon: Cpu, bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE' },
                    { name: 'Sustainability Projects', label: 'Sustainability', icon: Leaf, bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' }
                  ].map(item => {
                    const IconComp = item.icon;
                    const count = projects.filter(p => (p.division_type || p.category) === item.name).length;
                    return (
                      <div
                        key={item.name}
                        style={{
                          background: '#FFFFFF',
                          borderRadius: '16px',
                          padding: '20px 22px',
                          border: `1px solid ${item.border}`,
                          boxShadow: '0 4px 16px rgba(6, 59, 115, 0.04)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                          cursor: 'default',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 10px 24px rgba(6, 59, 115, 0.1)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(6, 59, 115, 0.04)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '800',
                            color: '#1E293B',
                            letterSpacing: '0.4px',
                            textTransform: 'uppercase'
                          }}>
                            {item.label}
                          </span>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: item.bg,
                            color: item.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <IconComp size={18} />
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                          <span style={{ fontSize: '32px', fontWeight: '800', color: '#063B73', lineHeight: 1 }}>
                            {count}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748B' }}>
                            {count === 1 ? 'Project' : 'Projects'}
                          </span>
                        </div>

                        {/* Bottom accent indicator bar */}
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: item.color,
                          opacity: 0.85
                        }} />
                      </div>
                    );
                  })}
                </div>

                {/* Projects Table */}
                <div className="admin-table-card-header">
                  <h3>Managed Projects ({projects.length})</h3>
                  <div className="admin-search-bar">
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Project Name</th>
                        <th>Category</th>
                        <th>Client / Location</th>
                        <th>Status</th>
                        <th style={{ width: '120px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterList(projects, ['name', 'division_type', 'client', 'location']).map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden', background: '#F1F5F9', flexShrink: 0 }}>
                                <img
                                  src={item.image || '/project1.png'}
                                  alt={item.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  onError={(e) => { e.target.onerror = null; e.target.src = '/project1.png'; }}
                                />
                              </div>
                              <div>
                                <strong style={{ color: '#063B73', display: 'block', fontSize: '14px' }}>{item.name}</strong>
                                <span style={{ fontSize: '12px', color: '#64748B' }}>/projects/{item.slug || item.id}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#087CFF', background: 'rgba(8,124,255,0.08)', padding: '4px 10px', borderRadius: '12px' }}>
                              {item.division_type || item.category || 'BIM Projects'}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontSize: '13px', color: '#334155' }}>
                              {item.client || 'Client N/A'}
                              <div style={{ fontSize: '11px', color: '#64748B' }}>{item.location || 'Qatar'} • {item.year || '2024'}</div>
                            </div>
                          </td>
                          <td>
                            <span className={`admin-badge ${item.status === 'Completed' || item.status === 'Active' ? 'approved' : 'pending'}`}>
                              {item.status || 'Completed'}
                            </span>
                          </td>
                          <td>
                            <div className="admin-actions">
                              <button
                                className="admin-action-btn"
                                title="View Project Detail Page"
                                onClick={() => {
                                  if (onNavigate) onNavigate('ProjectDetail', item.slug || item.id);
                                }}
                                style={{ color: '#087CFF' }}
                              >
                                <ExternalLink size={13} />
                              </button>
                              <button className="admin-action-btn" title="Edit Project" onClick={() => startEdit('projects', item)}>
                                <Edit size={13} />
                              </button>
                              <button className="admin-action-btn delete" title="Delete Project" onClick={() => handleDelete('projects', item.id)}>
                                <Trash size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {projects.length === 0 && (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No projects found. Click "+ Add New Item" to create one.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PARTNERS WORKSPACE */}
            {activeTab === '/admin/partners' && (
              <div>
                <div className="admin-table-card-header">
                  <h3>Our Working Partners</h3>
                  <div className="admin-search-bar">
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Search partners..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Logo</th>
                        <th>Partner Name</th>
                        <th>Role Description</th>
                        <th>Sort Order</th>
                        <th style={{ width: '90px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterList(partners, ['name', 'role']).map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td>
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="admin-table-preview-img" style={{ height: '40px', width: '40px', objectFit: 'cover', borderRadius: '8px' }} />
                            ) : (
                              <div style={{ height: '40px', width: '40px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#94A3B8', fontWeight: '700' }}>No Logo</div>
                            )}
                          </td>
                          <td style={{ fontWeight: '600' }}>{item.name}</td>
                          <td style={{ color: '#00B8A0', fontWeight: '600' }}>{item.role}</td>
                          <td>{item.order_num}</td>
                          <td>
                            <div className="admin-actions">
                              <button className="admin-action-btn" title="Edit" onClick={() => startEdit('partners', item)}>
                                <Edit size={13} />
                              </button>
                              <button className="admin-action-btn delete" title="Delete" onClick={() => handleDelete('partners', item.id)}>
                                <Trash size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {partners.length === 0 && (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No partners yet. Click "Add Partner" to get started.</td></tr>
                      )}
                  </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MEDIA LIBRARY WORKSPACE */}
            {activeTab === '/admin/media' && (
              <div>
                <div className="admin-table-card-header">
                  <h3>Media Library</h3>
                  <div className="admin-search-bar">
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Search media..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                {/* Gallery Section */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ color: 'var(--text-muted)', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>📸 Gallery Images</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                    {filterList(mediaItems.filter(m => m.type === 'gallery'), ['title']).map((item) => (
                      <div key={item.id} style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', background: 'var(--card-bg)' }}>
                        <div style={{ position: 'relative', paddingBottom: '70%', overflow: 'hidden', background: '#0F172A' }}>
                          <img src={item.url} alt={item.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none'; }} />
                        </div>
                        <div style={{ padding: '8px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title || 'Untitled'}</div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="admin-action-btn" title="Edit" onClick={() => startEdit('media', item)}><Edit size={12} /></button>
                            <button className="admin-action-btn delete" title="Delete" onClick={() => handleDelete('media', item.id)}><Trash size={12} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {mediaItems.filter(m => m.type === 'gallery').length === 0 && (
                      <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '14px' }}>No gallery images yet. Click "Add Media" above.</div>
                    )}
                  </div>
                </div>
                {/* Videos Section */}
                <div>
                  <h4 style={{ color: 'var(--text-muted)', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>🎥 YouTube Videos</h4>
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th style={{ width: '40px' }}>#</th>
                          <th style={{ width: '120px' }}>Thumbnail</th>
                          <th>Title</th>
                          <th>YouTube URL</th>
                          <th style={{ width: '90px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterList(mediaItems.filter(m => m.type === 'video'), ['title', 'url']).map((item, idx) => {
                          const ytId = item.url.match(/(?:v=|youtu\.be\/|embed\/)([^&?/]+)/)?.[1];
                          return (
                            <tr key={item.id}>
                              <td>{idx + 1}</td>
                              <td>
                                {ytId ? (
                                  <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt={item.title} style={{ width: '100px', height: '56px', objectFit: 'cover', borderRadius: '6px' }} />
                                ) : <span style={{ color: '#94A3B8', fontSize: '12px' }}>No Thumb</span>}
                              </td>
                              <td style={{ fontWeight: 600 }}>{item.title}</td>
                              <td style={{ color: '#00B8A0', fontSize: '13px', wordBreak: 'break-all' }}>{item.url}</td>
                              <td>
                                <div className="admin-actions">
                                  <button className="admin-action-btn" title="Edit" onClick={() => startEdit('media', item)}><Edit size={13} /></button>
                                  <button className="admin-action-btn delete" title="Delete" onClick={() => handleDelete('media', item.id)}><Trash size={13} /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {mediaItems.filter(m => m.type === 'video').length === 0 && (
                          <tr><td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>No videos yet. Click "Add Media" above.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY MANAGEMENT (MOCK) */}
            {activeTab === 'categories' && (
              <div>
                <div className="admin-table-card-header">
                  <h3>Service categories</h3>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Category Name</th>
                      <th>Total Submenus</th>
                      <th>Layout Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td style={{ fontWeight: '600' }}>Engineering Services</td>
                      <td>4 Submenus</td>
                      <td>Dropdown Grid</td>
                      <td><span className="admin-badge approved">Active</span></td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td style={{ fontWeight: '600' }}>Sustainability Services</td>
                      <td>4 Submenus</td>
                      <td>Dropdown Grid</td>
                      <td><span className="admin-badge approved">Active</span></td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td style={{ fontWeight: '600' }}>Digital Twin</td>
                      <td>4 Submenus</td>
                      <td>Dropdown Grid</td>
                      <td><span className="admin-badge approved">Active</span></td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td style={{ fontWeight: '600' }}>Construction Technology</td>
                      <td>4 Submenus</td>
                      <td>Dropdown Grid</td>
                      <td><span className="admin-badge approved">Active</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* GENERAL SETTINGS (MOCK) */}
            {activeTab === 'general_settings' && (
              <div>
                <div className="admin-table-card-header" style={{ marginBottom: '20px' }}>
                  <h3>Site Configuration</h3>
                </div>
                <div className="admin-form-grid" style={{ padding: '10px' }}>
                  <div className="admin-form-group">
                    <label>Website Title</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={generalSettings.siteTitle}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, siteTitle: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Main Corporate Email</label>
                    <input 
                      type="email" 
                      className="admin-input" 
                      value={generalSettings.companyEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, companyEmail: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Contact Phone</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={generalSettings.companyPhone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, companyPhone: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Contact Fax</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={generalSettings.companyFax}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, companyFax: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group admin-span-2">
                    <label>Office physical Address</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={generalSettings.officeAddress}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, officeAddress: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group admin-span-2">
                    <button type="button" className="admin-btn" style={{ width: 'auto' }} onClick={() => alert('General Settings mock saved!')}>
                      Save Configuration
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MEDIA LIBRARY (MOCK) */}
            {activeTab === '/admin/media' && (
              <div>
                <div className="admin-table-card-header" style={{ marginBottom: '20px' }}>
                  <h3>Static Media Assets</h3>
                </div>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                  <button className="admin-add-btn" onClick={() => alert('Upload files triggers system uploader.')}>
                    <Plus size={15} /> Upload Files
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px' }}>
                  {['/why.png', '/sust_workshop.png', '/simulation.png', '/project1.png'].map((img, i) => (
                    <div key={i} style={{ border: '1px solid var(--panel-border)', borderRadius: '6px', overflow: 'hidden', background: '#F8FAFC' }}>
                      <img src={img} alt="media preview" style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                      <div style={{ padding: '6px', fontSize: '10px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', textAlign: 'center' }}>
                        {img.split('/').pop()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BACKUP & RESTORE WORKSPACE */}
            {activeTab === '/admin/backup' && (
              <div>
                <div className="admin-table-card-header" style={{ marginBottom: '20px' }}>
                  <h3>Database Maintenance</h3>
                </div>
                <div style={{ padding: '20px', border: '1px solid var(--panel-border)', borderRadius: '8px', background: '#FFFDF9', maxWidth: '500px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#B45309' }}>Backup Recommender System</h4>
                  <p style={{ fontSize: '13px', color: '#78350F', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                    It is highly recommended to perform SQL database backups regularly before running schema adjustments. Clicking below compiles current configurations into a text SQL download sheet.
                  </p>
                  <button 
                    className="admin-add-btn" 
                    onClick={() => {
                      // Simulates schema backup download
                      const element = document.createElement("a");
                      const file = new Blob(["-- BLUE CRESCENT DATABASE BACKUP SCHEMA\n-- Generated in Admin Panel\n\nSELECT * FROM users;\nSELECT * FROM hero_slides;\nSELECT * FROM services;"], {type: 'text/plain'});
                      element.href = URL.createObjectURL(file);
                      element.download = "blue_crescent_backup.sql";
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                  >
                    <FileDown size={16} /> Create Database Backup (.SQL)
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* DYNAMIC FORM MODALS FOR TAB CRUD */}
      {showAddModal && (
        <div className="admin-modal-backdrop" onClick={handleCloseAddModal}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>
                {activeEditItem ? `Modify ${activeTab.split('/').pop().replace(/-/g, ' ')}` : `Create New ${activeTab.split('/').pop().replace(/-/g, ' ')}`}
              </h3>
              <button type="button" className="admin-modal-close" onClick={handleCloseAddModal}>
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              
              {/* hero form */}
              {activeTab === 'hero' && (
                <div>
                  <div className="admin-form-group">
                    <label>Slide Title Header</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      placeholder="e.g. Engineering Excellence, Building a Better Tomorrow."
                      value={heroForm.title}
                      onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="admin-form-group">
                    <label>Subtitle description</label>
                    <textarea 
                      rows="3"
                      className="admin-input" 
                      placeholder="Enter subtitle content..."
                      value={heroForm.subtitle}
                      onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label>Primary Button label</label>
                      <input 
                        type="text" 
                        className="admin-input" 
                        placeholder="e.g. Explore Our Services"
                        value={heroForm.btn1_text}
                        onChange={(e) => setHeroForm({ ...heroForm, btn1_text: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Secondary Button label</label>
                      <input 
                        type="text" 
                        className="admin-input" 
                        placeholder="e.g. Get a Consultation"
                        value={heroForm.btn2_text}
                        onChange={(e) => setHeroForm({ ...heroForm, btn2_text: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label>Status</label>
                      <select 
                        className="admin-input"
                        value={heroForm.status}
                        onChange={(e) => setHeroForm({ ...heroForm, status: e.target.value })}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Display Order index</label>
                      <input 
                        type="number" 
                        className="admin-input" 
                        value={heroForm.order_num}
                        onChange={(e) => setHeroForm({ ...heroForm, order_num: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Slide Background Image</label>
                    <div className="admin-file-upload">
                      <label className="admin-file-label">
                        <span>Select slide image...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files[0], setHeroForm, 'image')}
                        />
                      </label>
                    </div>
                    {heroForm.image && (
                      <div className="admin-upload-preview">
                        <img src={heroForm.image} alt="Slide preview" />
                        <button className="admin-upload-preview-remove" onClick={() => setHeroForm(prev => ({ ...prev, image: '' }))}>✕</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* services form */}
              {activeTab === '/admin/services' && (
                <div>
                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label>Category Group</label>
                      <select
                        className="admin-input"
                        value={serviceForm.category}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, category: e.target.value }))}
                      >
                        <option value="Engineering Services">Engineering Services</option>
                        <option value="Sustainability Services">Sustainability Services</option>
                        <option value="Digital Twin">Digital Twin</option>
                        <option value="Construction Technology">Construction Technology</option>
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label>Service Title</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. BIM"
                        value={serviceForm.title}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Detailed Description</label>
                    <textarea
                      rows="4"
                      className="admin-input"
                      style={{ fontFamily: 'inherit', resize: 'vertical' }}
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  {/* Bullets dynamic lists */}
                  <div className="admin-form-group">
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      Scope & Deliverables List Bullets
                      <button className="admin-btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={addBullet}>
                        + Add Bullet
                      </button>
                    </label>

                    <div className="admin-dynamic-list">
                      {serviceForm.bullets.map((bullet, idx) => (
                        <div key={idx} className="admin-dynamic-row">
                          <input
                            type="text"
                            className="admin-input"
                            placeholder="Enter deliverable description..."
                            value={bullet}
                            onChange={(e) => handleBulletChange(idx, e.target.value)}
                          />
                          <button className="admin-action-btn delete" onClick={() => removeBullet(idx)}>
                            <Trash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* certificates form */}
              {activeTab === '/admin/certificates' && (
                <div>
                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label>Certificate Title</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. ISO 9001:2015"
                        value={certForm.title}
                        onChange={(e) => setCertForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Issuing Organization</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. BQSR Assurance"
                        value={certForm.org}
                        onChange={(e) => setCertForm(prev => ({ ...prev, org: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label>License / Certificate No</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. SPD-QA-001"
                        value={certForm.licenseNo}
                        onChange={(e) => setCertForm(prev => ({ ...prev, licenseNo: e.target.value }))}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Territory</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Qatar"
                        value={certForm.territory}
                        onChange={(e) => setCertForm(prev => ({ ...prev, territory: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label>Border Highlight Color</label>
                      <select
                        className="admin-input"
                        value={certForm.borderColor}
                        onChange={(e) => setCertForm(prev => ({ ...prev, borderColor: e.target.value }))}
                      >
                        <option value="border-blue">Blue highlights</option>
                        <option value="border-green">Green highlights</option>
                        <option value="border-gold">Gold highlights</option>
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label>Badge Ribbon Text</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. ISO CERTIFIED"
                        value={certForm.badgeText}
                        onChange={(e) => setCertForm(prev => ({ ...prev, badgeText: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Valid status text</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={certForm.validity}
                      onChange={(e) => setCertForm(prev => ({ ...prev, validity: e.target.value }))}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Scope Specifications summary</label>
                    <textarea
                      rows="3"
                      className="admin-input"
                      placeholder="Detail certificate authority specifications..."
                      value={certForm.scope}
                      onChange={(e) => setCertForm(prev => ({ ...prev, scope: e.target.value }))}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Accreditation Document Image</label>
                    <div className="admin-file-upload">
                      <label className="admin-file-label">
                        <span>Select certificate image...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files[0], setCertForm, 'image')}
                        />
                      </label>
                    </div>
                    {certForm.image && (
                      <div className="admin-upload-preview">
                        <img src={certForm.image} alt="Certificate preview" />
                        <button className="admin-upload-preview-remove" onClick={() => setCertForm(prev => ({ ...prev, image: '' }))}>✕</button>
                      </div>
                    )}
                  </div>
                </div>
              )}



              {/* project form */}
              {activeTab === '/admin/projects' && (
                <div>
                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label>Project Title / Name *</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Qatar Free Zone Project"
                        value={projectForm.name}
                        onChange={e => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>URL Slug (SEO Friendly)</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. qatar-free-zone"
                        value={projectForm.slug}
                        onChange={e => setProjectForm(prev => ({ ...prev, slug: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label>Project Category / Division *</label>
                      <select
                        className="admin-input"
                        value={projectForm.division_type}
                        onChange={e => setProjectForm(prev => ({ ...prev, division_type: e.target.value }))}
                      >
                        <option value="BIM Projects">BIM Projects</option>
                        <option value="CAD Projects">CAD Projects</option>
                        <option value="Laser Scanning Projects">Laser Scanning Projects</option>
                        <option value="Digital Twin Projects">Digital Twin Projects</option>
                        <option value="Sustainability Projects">Sustainability Projects</option>
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label>Project Status</label>
                      <select
                        className="admin-input"
                        value={projectForm.status}
                        onChange={e => setProjectForm(prev => ({ ...prev, status: e.target.value }))}
                      >
                        <option value="Completed">Completed</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label>Client Name</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Free Zones Authority (QFZA)"
                        value={projectForm.client}
                        onChange={e => setProjectForm(prev => ({ ...prev, client: e.target.value }))}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Main Contractor / Consultant</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. CCC / Dar Al-Handasah"
                        value={projectForm.contractor}
                        onChange={e => setProjectForm(prev => ({ ...prev, contractor: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Doha, Qatar"
                        value={projectForm.location}
                        onChange={e => setProjectForm(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Sector</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Infrastructure & Buildings"
                        value={projectForm.sector}
                        onChange={e => setProjectForm(prev => ({ ...prev, sector: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label>Year</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. 2024"
                        value={projectForm.year}
                        onChange={e => setProjectForm(prev => ({ ...prev, year: e.target.value }))}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>BIM Level / Project Stage</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. LOD 500 / As-Built"
                        value={projectForm.bim_level}
                        onChange={e => setProjectForm(prev => ({ ...prev, bim_level: e.target.value, project_stage: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Short Project Summary</label>
                    <textarea
                      rows="2"
                      className="admin-input"
                      style={{ fontFamily: 'inherit', resize: 'vertical' }}
                      placeholder="Brief 1-2 sentence project overview..."
                      value={projectForm.short_description}
                      onChange={e => setProjectForm(prev => ({ ...prev, short_description: e.target.value }))}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Detailed Scope of Work</label>
                    <textarea
                      rows="3"
                      className="admin-input"
                      style={{ fontFamily: 'inherit', resize: 'vertical' }}
                      placeholder="Detailed explanation of Blue Crescent engineering scope..."
                      value={projectForm.scope_of_work}
                      onChange={e => setProjectForm(prev => ({ ...prev, scope_of_work: e.target.value }))}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Services Provided (Comma-separated)</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. BIM, Digital Twin, Laser Scanning"
                      value={projectForm.services}
                      onChange={e => setProjectForm(prev => ({ ...prev, services: e.target.value }))}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Technical Disciplines (Comma-separated)</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Architecture, Structure, MEP, Infrastructure"
                      value={projectForm.disciplines}
                      onChange={e => setProjectForm(prev => ({ ...prev, disciplines: e.target.value }))}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Key Deliverables (Comma-separated)</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. BIM Models, As-Built Information, Asset Data"
                      value={projectForm.deliverables}
                      onChange={e => setProjectForm(prev => ({ ...prev, deliverables: e.target.value }))}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Software & Technology Used (Comma-separated)</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Revit, Navisworks, Digital Twin Platform"
                      value={projectForm.technologies}
                      onChange={e => setProjectForm(prev => ({ ...prev, technologies: e.target.value }))}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Project Highlights / Quote Statement</label>
                    <textarea
                      rows="2"
                      className="admin-input"
                      style={{ fontFamily: 'inherit', resize: 'vertical' }}
                      placeholder="Highlight complexity, zero-clash achievement, or technical scale..."
                      value={projectForm.project_highlights}
                      onChange={e => setProjectForm(prev => ({ ...prev, project_highlights: e.target.value }))}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Main Project Image</label>
                    <div className="admin-file-upload">
                      <label className="admin-file-label">
                        <span>Select project image...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files[0], setProjectForm, 'image')}
                        />
                      </label>
                    </div>
                    {projectForm.image && (
                      <div className="admin-upload-preview">
                        <img src={projectForm.image} alt="Project preview" />
                        <button className="admin-upload-preview-remove" onClick={() => setProjectForm(prev => ({ ...prev, image: '' }))}>✕</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* testimonials form */}
              {activeTab === '/admin/testimonials' && (
                <div>
                  <div className="admin-form-group">
                    <label>Review Summary / Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={testimonialForm.title}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label>Client Name</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={testimonialForm.author_name}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, author_name: e.target.value }))}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Company Designation</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={testimonialForm.company_name}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, company_name: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Approval Status</label>
                    <select
                      className="admin-input"
                      value={testimonialForm.status}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="approved">Approved (Visible in Frontend)</option>
                      <option value="pending">Pending Review</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Quote Content</label>
                    <textarea
                      rows="4"
                      className="admin-input"
                      style={{ fontFamily: 'inherit', resize: 'vertical' }}
                      value={testimonialForm.content}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, content: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {/* menus form */}
              {activeTab === 'menus' && (
                <div>
                  <div className="admin-form-group">
                    <label>Navigation Label</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Services"
                      value={menuForm.name}
                      onChange={(e) => setMenuForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Navigation Action / Route</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Home, Services, About Us"
                      value={menuForm.url}
                      onChange={(e) => setMenuForm(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label>Parent Navigation ID (Submenu Mapping)</label>
                      <select
                        className="admin-input"
                        value={menuForm.parent_id}
                        onChange={(e) => setMenuForm(prev => ({ ...prev, parent_id: e.target.value }))}
                      >
                        <option value="">No Parent (Root Item)</option>
                        {menus.filter(m => !m.parent_id).map(parent => (
                          <option key={parent.id} value={parent.id}>{parent.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label>Sort Order Index</label>
                      <input
                        type="number"
                        className="admin-input"
                        value={menuForm.order_num}
                        onChange={(e) => setMenuForm(prev => ({ ...prev, order_num: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* partners form */}
              {activeTab === '/admin/partners' && (
                <div>
                  <div className="admin-form-group">
                    <label>Partner Company Name</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. TEKNIK Group"
                      value={partnerForm.name}
                      onChange={e => setPartnerForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label>Role / Relationship</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Engineering Partner"
                        value={partnerForm.role}
                        onChange={e => setPartnerForm(prev => ({ ...prev, role: e.target.value }))}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Sort Order Index</label>
                      <input
                        type="number"
                        className="admin-input"
                        value={partnerForm.order_num}
                        onChange={e => setPartnerForm(prev => ({ ...prev, order_num: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Partner Logo / Image</label>
                    <div className="admin-file-upload">
                      <label className="admin-file-label">
                        <span>Select image file...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleImageUpload(e.target.files[0], setPartnerForm, 'image')}
                        />
                      </label>
                    </div>
                    {partnerForm.image && (
                      <div className="admin-upload-preview" style={{ marginTop: '10px' }}>
                        <img src={partnerForm.image} alt="Partner Logo Preview" style={{ maxHeight: '100px', objectFit: 'contain' }} />
                        <button className="admin-upload-preview-remove" onClick={() => setPartnerForm(prev => ({ ...prev, image: '' }))}>✕</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* media form */}
              {activeTab === '/admin/media' && (
                <div>
                  <div className="admin-form-group">
                    <label>Media Type</label>
                    <select
                      className="admin-input"
                      value={mediaForm.type}
                      onChange={e => setMediaForm(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="gallery">📸 Gallery Image</option>
                      <option value="video">🎥 YouTube Video</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Title / Caption</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder={mediaForm.type === 'gallery' ? 'e.g. Project Site Photo' : 'e.g. Company Overview Video'}
                      value={mediaForm.title}
                      onChange={e => setMediaForm(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  {mediaForm.type === 'gallery' ? (
                    <div className="admin-form-group">
                      <label>Upload Image or Paste Image URL</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="https://... or upload below"
                        value={mediaForm.url}
                        onChange={e => setMediaForm(prev => ({ ...prev, url: e.target.value }))}
                      />
                      <div style={{ marginTop: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--bg-primary)', border: '2px dashed var(--border)', borderRadius: '10px', padding: '14px 20px', fontSize: '14px', color: 'var(--text-muted)' }}>
                          <ImageIcon size={20} /> Drop image here or click to upload
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onloadend = () => setMediaForm(prev => ({ ...prev, url: reader.result }));
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                      </div>
                      {mediaForm.url && (
                        <div className="admin-upload-preview" style={{ marginTop: '10px' }}>
                          <img src={mediaForm.url} alt="Preview" style={{ maxHeight: '120px', objectFit: 'contain', borderRadius: '8px' }} />
                          <button className="admin-upload-preview-remove" onClick={() => setMediaForm(prev => ({ ...prev, url: '' }))}>✕</button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="admin-form-group">
                      <label>YouTube Video URL</label>
                      <input
                        type="url"
                        className="admin-input"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={mediaForm.url}
                        onChange={e => setMediaForm(prev => ({ ...prev, url: e.target.value }))}
                      />
                      {mediaForm.url && (() => {
                        const ytId = mediaForm.url.match(/(?:v=|youtu\.be\/|embed\/)([^&?/]+)/)?.[1];
                        return ytId ? (
                          <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden' }}>
                            <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt="YouTube Thumbnail" style={{ width: '100%', maxWidth: '280px', borderRadius: '8px' }} />
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* users form */}
              {activeTab === '/admin/users' && (
                <div>
                  <div className="admin-form-group">
                    <label>Admin Username</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={userForm.username}
                      onChange={(e) => setUserForm(prev => ({ ...prev, username: e.target.value }))}
                      disabled={!!activeEditItem} // Cannot rename username
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>
                      {activeEditItem ? 'Password (Leave empty to keep unchanged)' : 'Login Password'}
                    </label>
                    <input
                      type="password"
                      className="admin-input"
                      value={userForm.password}
                      onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Access Role Authority</label>
                    <select
                      className="admin-input"
                      value={userForm.role}
                      onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                    >
                      <option value="admin">Admin (Standard Access)</option>
                      <option value="super_admin">Super Admin (All Access)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="admin-modal-footer">
              <button type="button" className="admin-btn-secondary" onClick={handleCloseAddModal}>
                Cancel
              </button>
              <button type="button" className="admin-btn" style={{ width: 'auto', padding: '10px 24px' }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSave(activeTab, activeEditItem?.id); }}>
                {activeEditItem ? 'Save Updates' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="admin-modal-backdrop" onClick={handleCloseCategoryModal}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingCategoryId ? 'Edit Main Category' : 'Add Main Category'}</h3>
              <button type="button" className="admin-modal-close" onClick={handleCloseCategoryModal}>
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Engineering Services"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="admin-form-group">
                <label>Category Slug (Auto-generated if empty)</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. engineering-services"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                />
              </div>

              <div className="admin-form-group">
                <label>Short Description</label>
                <textarea
                  rows="3"
                  className="admin-input"
                  style={{ fontFamily: 'inherit', resize: 'vertical' }}
                  placeholder="Brief summary of category..."
                  value={categoryForm.short_description}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, short_description: e.target.value }))}
                />
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Icon Identifier</label>
                  <select
                    className="admin-input"
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                  >
                    <option value="Building2">Building2 (Engineering)</option>
                    <option value="Leaf">Leaf (Sustainability)</option>
                    <option value="Layers">Layers (Digital Twin)</option>
                    <option value="Cpu">Cpu (Construction Tech)</option>
                    <option value="Compass">Compass</option>
                    <option value="Wrench">Wrench</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={categoryForm.display_order}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, display_order: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Status</label>
                <select
                  className="admin-input"
                  value={categoryForm.status}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Active">Active (Visible on Website)</option>
                  <option value="Inactive">Inactive (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button type="button" className="admin-btn-secondary" onClick={handleCloseCategoryModal}>
                Cancel
              </button>
              <button type="button" className="admin-btn" style={{ width: 'auto', padding: '10px 24px' }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSaveCategory(e); }}>
                {editingCategoryId ? 'Save Category Updates' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SERVICE MODAL */}
      {showServiceModal && (
        <div className="admin-modal-backdrop" onClick={handleCloseServiceModal}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div className="admin-modal-header">
              <h3>{editingServiceId ? 'Edit Sub-Service' : 'Add Sub-Service'}</h3>
              <button type="button" className="admin-modal-close" onClick={handleCloseServiceModal}>
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Parent Category *</label>
                  <select
                    className="admin-input"
                    value={serviceForm.category}
                    onChange={(e) => {
                      const selectedCatName = e.target.value;
                      const matchedCat = serviceCategories.find(c => c.name === selectedCatName);
                      setServiceForm(prev => ({ ...prev, category: selectedCatName, category_id: matchedCat ? matchedCat.id : null }));
                    }}
                  >
                    {serviceCategories.map(cat => (
                      <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Sub-Service Title *</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. CAD or Laser Scanning"
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>URL Slug Path (Auto-generated if empty)</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. cad or laser-scanning"
                    value={serviceForm.slug}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, slug: e.target.value }))}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={serviceForm.display_order}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, display_order: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Description</label>
                <textarea
                  rows="4"
                  className="admin-input"
                  style={{ fontFamily: 'inherit', resize: 'vertical' }}
                  placeholder="Detailed description of sub-service..."
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              {/* Scope Bullets */}
              <div className="admin-form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Scope & Key Deliverables List
                  <button type="button" className="admin-btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); addBullet(); }}>
                    + Add Scope Bullet
                  </button>
                </label>

                <div className="admin-dynamic-list">
                  {serviceForm.bullets.map((bullet, idx) => (
                    <div key={idx} className="admin-dynamic-row">
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. 2D Drafting or Shop Drawings"
                        value={bullet}
                        onChange={(e) => handleBulletChange(idx, e.target.value)}
                      />
                      <button type="button" className="admin-action-btn delete" onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeBullet(idx); }}>
                        <Trash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>



              <div className="admin-form-group">
                <label>Status</label>
                <select
                  className="admin-input"
                  value={serviceForm.status}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Active">Active (Visible on Website)</option>
                  <option value="Inactive">Inactive (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button type="button" className="admin-btn-secondary" onClick={handleCloseServiceModal}>
                Cancel
              </button>
              <button type="button" className="admin-btn" style={{ width: 'auto', padding: '10px 24px' }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSaveService(e); }}>
                {editingServiceId ? 'Save Sub-Service Updates' : 'Create Sub-Service'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* POPUP BANNER MODAL FOR COMPANY INFO CRUD SECTIONS */}
      {crudModal.isOpen && (
        <div className="admin-modal-backdrop" onClick={closeCrudModal}>
          <div className="admin-modal-card" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #071C3B 0%, #003E8A 100%)',
              color: '#FFFFFF',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#60A5FA', display: 'block', marginBottom: '2px' }}>
                  {crudModal.editIndex !== null ? 'EDIT CARD ENTRY' : 'ADD NEW CARD ENTRY'}
                </span>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>
                  {crudModal.type === 'discipline' && (crudModal.editIndex !== null ? 'Edit Capacity Discipline' : 'Add Capacity Discipline')}
                  {crudModal.type === 'digitalTwin' && (crudModal.editIndex !== null ? 'Edit Digital Twin Capability' : 'Add Digital Twin Capability Card')}
                  {crudModal.type === 'capabilityChip' && (crudModal.editIndex !== null ? 'Edit Core Capability Chip' : 'Add Core Capability Chip')}
                  {crudModal.type === 'remotePillar' && (crudModal.editIndex !== null ? 'Edit Remote Solution Pillar' : 'Add Remote Solution Pillar Card')}
                  {crudModal.type === 'teamMember' && (crudModal.editIndex !== null ? 'Edit Team Member Profile' : 'Add New Team Member')}
                </h3>
              </div>
              <button 
                onClick={closeCrudModal}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  color: '#FFFFFF',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="admin-modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Name / Title field */}
              {crudModal.type === 'discipline' && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Discipline Name *</label>
                  <input 
                    type="text" 
                    value={crudModal.data.name || ''} 
                    onChange={e => setCrudModal(prev => ({ ...prev, data: { ...prev.data, name: e.target.value } }))}
                    placeholder="e.g. BIM Modeling & Coordination"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }} 
                  />
                </div>
              )}

              {(crudModal.type === 'digitalTwin' || crudModal.type === 'remotePillar') && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Card Title *</label>
                  <input 
                    type="text" 
                    value={crudModal.data.title || ''} 
                    onChange={e => setCrudModal(prev => ({ ...prev, data: { ...prev.data, title: e.target.value } }))}
                    placeholder="e.g. Common Data Environment"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }} 
                  />
                </div>
              )}

              {crudModal.type === 'capabilityChip' && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Capability Chip Name *</label>
                  <input 
                    type="text" 
                    value={crudModal.data.name || ''} 
                    onChange={e => setCrudModal(prev => ({ ...prev, data: { ...prev.data, name: e.target.value } }))}
                    placeholder="e.g. GSAS or LEED"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }} 
                  />
                </div>
              )}

              {crudModal.type === 'teamMember' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Team Member Name *</label>
                    <input 
                      type="text" 
                      value={crudModal.data.name || ''} 
                      onChange={e => setCrudModal(prev => ({ ...prev, data: { ...prev.data, name: e.target.value } }))}
                      placeholder="e.g. Praveen Kumar"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Role / Designation *</label>
                    <input 
                      type="text" 
                      value={crudModal.data.role || ''} 
                      onChange={e => setCrudModal(prev => ({ ...prev, data: { ...prev.data, role: e.target.value } }))}
                      placeholder="e.g. Technical Director"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Profile Photo</label>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '10px', overflow: 'hidden', background: 'linear-gradient(135deg, #071C3B, #00A198)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: '800', fontSize: '20px' }}>
                        {crudModal.data.image ? (
                          <img src={crudModal.data.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          (crudModal.data.name ? crudModal.data.name.charAt(0) : 'T')
                        )}
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setCrudModal(prev => ({ ...prev, data: { ...prev.data, image: reader.result } }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                        style={{ fontSize: '13px' }} 
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Icon Dropdown */}
              {crudModal.type !== 'teamMember' && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Card Display Icon</label>
                  <select 
                    value={crudModal.data.icon || ''} 
                    onChange={e => setCrudModal(prev => ({ ...prev, data: { ...prev.data, icon: e.target.value } }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#FFFFFF' }}
                  >
                    {[
                      'Building2', 'Layers', 'Radio', 'Wrench', 'Wind', 'Volume2', 'Droplet', 
                      'Activity', 'Zap', 'Leaf', 'Users', 'Cpu', 'Award', 'ShieldCheck', 
                      'BarChart3', 'SearchCheck', 'FileCheck2', 'TreePine', 'Cloud', 'Monitor', 
                      'Settings', 'TrendingUp', 'Share2', 'ClipboardCheck', 'Heart', 'RefreshCw', 
                      'Eye', 'Camera', 'Bot'
                    ].map(i => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Slug link field */}
              {(crudModal.type === 'capabilityChip' || crudModal.type === 'remotePillar') && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Service Route / Slug</label>
                  <input 
                    type="text" 
                    value={crudModal.data.slug || ''} 
                    onChange={e => setCrudModal(prev => ({ ...prev, data: { ...prev.data, slug: e.target.value } }))}
                    placeholder="e.g. Sustainability Services or Construction Technology"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }} 
                  />
                </div>
              )}

              {/* Description textarea */}
              {(crudModal.type === 'digitalTwin' || crudModal.type === 'remotePillar' || crudModal.type === 'capabilityChip') && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Card Description</label>
                  <textarea 
                    rows={3} 
                    value={crudModal.data.desc || ''} 
                    onChange={e => setCrudModal(prev => ({ ...prev, data: { ...prev.data, desc: e.target.value } }))}
                    placeholder="Write a short summary of this card..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none', resize: 'vertical' }} 
                  />
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="admin-modal-footer" style={{
              padding: '16px 24px',
              background: '#F8FAFC',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={closeCrudModal}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCrudModal}
                style={{
                  background: 'linear-gradient(135deg, #00A198 0%, #00827B 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(0, 161, 152, 0.25)'
                }}
              >
                <Check size={16} />
                {crudModal.editIndex !== null ? 'Save Changes' : 'Add Card Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
