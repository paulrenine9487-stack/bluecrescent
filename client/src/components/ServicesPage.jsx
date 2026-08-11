import React, { useState, useEffect } from 'react';
import serviceBanner from '../assets/servicepage1.png';
import aboutBanner from '../assets/about.png';
import projectBanner from '../assets/project1.png';
import './AboutUsPage.css';

export default function ServicesPage({ activeSubTab = '', onOpenModal, onNavigate }) {
  const isMainOverview = !activeSubTab || activeSubTab === 'Services' || activeSubTab === 'Main';
  const currentServiceTitle = isMainOverview ? 'Services' : activeSubTab;

  const [dynamicServices, setDynamicServices] = useState([]);
  const [news, setNews] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) {
          setDynamicServices(data);
        }
      })
      .catch(err => console.warn('Services fetch warning:', err));

    fetch('/api/news')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) {
          setNews(data.slice(0, 4)); // Show at most 4 news items
        }
      })
      .catch(err => console.warn('News fetch warning:', err));

    fetch('/api/testimonials')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) {
          setTestimonials(data);
        }
      })
      .catch(err => console.warn('Testimonials fetch warning:', err));
  }, []);

  // Static fallback data map for all 16 sub-services
  const staticServiceDetailsMap = {
    // Engineering Services
    'cad': { title: 'CAD', category: 'Engineering Services', description: 'Professional multidisciplinary 2D/3D CAD drafting, shop drawing production, and engineering documentation support.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['2D Drafting', 'Shop Drawings', 'As-Built Documentation', 'Engineering Coordination'], tools: [['AutoCAD', 'MicroStation'], ['Civil 3D', 'Revit CAD']] },
    'CAD': { title: 'CAD', category: 'Engineering Services', description: 'Professional multidisciplinary 2D/3D CAD drafting, shop drawing production, and engineering documentation support.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['2D Drafting', 'Shop Drawings', 'As-Built Documentation', 'Engineering Coordination'], tools: [['AutoCAD', 'MicroStation'], ['Civil 3D', 'Revit CAD']] },
    'bim': { title: 'BIM', category: 'Engineering Services', description: 'End-to-end Building Information Modeling (BIM) up to LOD 500 across architectural, structural, and MEP disciplines.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['3D BIM Modeling', 'Clash Detection & Resolution', '4D Construction Scheduling', '5D Quantity Take-Off (QTO)'], tools: [['Autodesk Revit', 'Navisworks Manage'], ['Solibri', 'BIM 360']] },
    'BIM': { title: 'BIM', category: 'Engineering Services', description: 'End-to-end Building Information Modeling (BIM) up to LOD 500 across architectural, structural, and MEP disciplines.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['3D BIM Modeling', 'Clash Detection & Resolution', '4D Construction Scheduling', '5D Quantity Take-Off (QTO)'], tools: [['Autodesk Revit', 'Navisworks Manage'], ['Solibri', 'BIM 360']] },
    'laser-scanning': { title: 'Laser Scanning', category: 'Engineering Services', description: 'High-precision 3D laser scanning and point cloud capture for as-built verification and asset documentation.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['3D Laser Scanning', 'Point Cloud Registration', 'Dimensional Verification', 'Site Reality Capture'], tools: [['Leica RTC360', 'Faro Focus'], ['Cyclone', 'Recap Pro']] },
    'Laser Scanning': { title: 'Laser Scanning', category: 'Engineering Services', description: 'High-precision 3D laser scanning and point cloud capture for as-built verification and asset documentation.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['3D Laser Scanning', 'Point Cloud Registration', 'Dimensional Verification', 'Site Reality Capture'], tools: [['Leica RTC360', 'Faro Focus'], ['Cyclone', 'Recap Pro']] },
    'scan-to-bim': { title: 'Scan to BIM', category: 'Engineering Services', description: 'Converting raw point cloud scans into intelligent 3D BIM models for renovation, retrofit, and facility management.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['Point Cloud to BIM Conversion', 'As-Built Model Verification', 'Retrofit Modeling', 'Deviation Analysis'], tools: [['Autodesk Revit', 'CloudCompare'], ['ClearEdge3D Edgewise', 'Recap Pro']] },
    'Scan to BIM': { title: 'Scan to BIM', category: 'Engineering Services', description: 'Converting raw point cloud scans into intelligent 3D BIM models for renovation, retrofit, and facility management.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['Point Cloud to BIM Conversion', 'As-Built Model Verification', 'Retrofit Modeling', 'Deviation Analysis'], tools: [['Autodesk Revit', 'CloudCompare'], ['ClearEdge3D Edgewise', 'Recap Pro']] },

    // Sustainability Services
    'gsas': { title: 'GSAS', category: 'Sustainability Services', description: 'Global Sustainability Assessment System (GSAS) certification management, green building compliance, and auditing.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['GSAS Design & Build Certification', 'GSAS Construction Management', 'Energy & Water Audits', 'Daylight Simulation'], tools: [['GSAS Gate Tool', 'IES VE'], ['Sefaira', 'One Click LCA']] },
    'GSAS': { title: 'GSAS', category: 'Sustainability Services', description: 'Global Sustainability Assessment System (GSAS) certification management, green building compliance, and auditing.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['GSAS Design & Build Certification', 'GSAS Construction Management', 'Energy & Water Audits', 'Daylight Simulation'], tools: [['GSAS Gate Tool', 'IES VE'], ['Sefaira', 'One Click LCA']] },
    'leed': { title: 'LEED', category: 'Sustainability Services', description: 'LEED BD+C, ID+C, and O+M consulting, energy modeling, and commissioning for USGBC green certification.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['LEED Certification Management', 'Fundamental & Enhanced Commissioning', 'Thermal Comfort Modeling', 'Green Materials Sourcing'], tools: [['USGBC LEED v4/v4.1', 'IES VE'], ['EnergyPlus', 'CxAlloy']] },
    'LEED': { title: 'LEED', category: 'Sustainability Services', description: 'LEED BD+C, ID+C, and O+M consulting, energy modeling, and commissioning for USGBC green certification.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['LEED Certification Management', 'Fundamental & Enhanced Commissioning', 'Thermal Comfort Modeling', 'Green Materials Sourcing'], tools: [['USGBC LEED v4/v4.1', 'IES VE'], ['EnergyPlus', 'CxAlloy']] },
    'energy-audit': { title: 'Energy Audit', category: 'Sustainability Services', description: 'Comprehensive ASHRAE Level 1, 2, and 3 energy diagnostic audits to optimize building energy efficiency.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['ASHRAE Level 1, 2 & 3 Audits', 'Chiller Plant Optimization', 'Infrared Thermography', 'Power Quality Analysis'], tools: [['FLIR Thermal Cameras', 'Power Quality Analyzers'], ['eQUEST', 'EnergyPlus']] },
    'Energy Audit': { title: 'Energy Audit', category: 'Sustainability Services', description: 'Comprehensive ASHRAE Level 1, 2, and 3 energy diagnostic audits to optimize building energy efficiency.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['ASHRAE Level 1, 2 & 3 Audits', 'Chiller Plant Optimization', 'Infrared Thermography', 'Power Quality Analysis'], tools: [['FLIR Thermal Cameras', 'Power Quality Analyzers'], ['eQUEST', 'EnergyPlus']] },
    'carbon-management': { title: 'Carbon Management', category: 'Sustainability Services', description: 'Greenhouse gas inventory compiling, organizational carbon footprinting, and ISO 14064 verification strategies.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['ISO 14064 GHG Accounting', 'Organizational Carbon Footprint', 'Decarbonization Roadmap', 'Lifecycle Assessment'], tools: [['GHG Protocol Suite', 'ISO 14064 Guidelines'], ['Carbon Calculation Tools', 'Decarbonization Models']] },
    'Carbon Management': { title: 'Carbon Management', category: 'Sustainability Services', description: 'Greenhouse gas inventory compiling, organizational carbon footprinting, and ISO 14064 verification strategies.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['ISO 14064 GHG Accounting', 'Organizational Carbon Footprint', 'Decarbonization Roadmap', 'Lifecycle Assessment'], tools: [['GHG Protocol Suite', 'ISO 14064 Guidelines'], ['Carbon Calculation Tools', 'Decarbonization Models']] },

    // Digital Twin
    'asset-twin': { title: 'Asset Twin', category: 'Digital Twin', description: 'Virtual representation of physical assets connecting 3D spatial models with operational telemetry.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['3D Asset Visualization', 'IoT Telemetry Integration', 'Predictive Asset Analytics', 'COBie Data Handover'], tools: [['Autodesk Tandem', 'Azure Digital Twins'], ['ThingWorx', 'Matterport']] },
    'Asset Twin': { title: 'Asset Twin', category: 'Digital Twin', description: 'Virtual representation of physical assets connecting 3D spatial models with operational telemetry.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['3D Asset Visualization', 'IoT Telemetry Integration', 'Predictive Asset Analytics', 'COBie Data Handover'], tools: [['Autodesk Tandem', 'Azure Digital Twins'], ['ThingWorx', 'Matterport']] },
    'system-integration': { title: 'System Integration', category: 'Digital Twin', description: 'Connecting heterogeneous building automation, BMS, CAFM, and ERP software with Digital Twin hubs.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['REST/GraphQL API Middleware', 'BMS/BAS Integration', 'CAFM & ERP Connectors', 'Data Pipelines'], tools: [['Node-RED', 'Apache Kafka'], ['Grafana', 'Docker']] },
    'System Integration': { title: 'System Integration', category: 'Digital Twin', description: 'Connecting heterogeneous building automation, BMS, CAFM, and ERP software with Digital Twin hubs.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['REST/GraphQL API Middleware', 'BMS/BAS Integration', 'CAFM & ERP Connectors', 'Data Pipelines'], tools: [['Node-RED', 'Apache Kafka'], ['Grafana', 'Docker']] },
    'real-time-monitoring': { title: 'Real-Time Monitoring', category: 'Digital Twin', description: 'Continuous live sensor data monitoring, anomaly detection, and operational performance dashboards.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['Live Sensor Data Streaming', 'Anomaly Alerts', 'Energy Consumption Monitoring', 'Space Utilization Analytics'], tools: [['Grafana', 'InfluxDB'], ['AWS IoT Core', 'Azure IoT']] },
    'Real-Time Monitoring': { title: 'Real-Time Monitoring', category: 'Digital Twin', description: 'Continuous live sensor data monitoring, anomaly detection, and operational performance dashboards.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['Live Sensor Data Streaming', 'Anomaly Alerts', 'Energy Consumption Monitoring', 'Space Utilization Analytics'], tools: [['Grafana', 'InfluxDB'], ['AWS IoT Core', 'Azure IoT']] },
    'asset-management': { title: 'Asset Management', category: 'Digital Twin', description: 'Comprehensive facility asset lifecycle tracking, maintenance scheduling, and digital operations handover.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['Maintenance Scheduling', 'Work Order Automation', 'Lifecycle Cost Analysis', 'Asset Register Management'], tools: [['IBM Maximo', 'SAP PM'], ['Autodesk Tandem', 'Archibus']] },
    'Asset Management': { title: 'Asset Management', category: 'Digital Twin', description: 'Comprehensive facility asset lifecycle tracking, maintenance scheduling, and digital operations handover.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['Maintenance Scheduling', 'Work Order Automation', 'Lifecycle Cost Analysis', 'Asset Register Management'], tools: [['IBM Maximo', 'SAP PM'], ['Autodesk Tandem', 'Archibus']] },

    // Construction Technology
    'remote-construction': { title: 'Remote Construction', category: 'Construction Technology', description: 'Remote site monitoring, virtual walkthroughs, and automated progress reporting for distributed teams.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['Remote Site Walkthroughs', 'Progress Monitoring', 'Virtual Inspections', 'Cloud Collaboration'], tools: [['OpenSpace', 'Cupix'], ['Matterport', 'Autodesk ACC']] },
    'Remote Construction': { title: 'Remote Construction', category: 'Construction Technology', description: 'Remote site monitoring, virtual walkthroughs, and automated progress reporting for distributed teams.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['Remote Site Walkthroughs', 'Progress Monitoring', 'Virtual Inspections', 'Cloud Collaboration'], tools: [['OpenSpace', 'Cupix'], ['Matterport', 'Autodesk ACC']] },
    '360-capture': { title: '360° Capture', category: 'Construction Technology', description: 'High-resolution 360-degree photo and video documentation indexed to BIM drawings for visual tracking.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['360° Site Photo Mapping', 'Time-Lapse Progress Tracking', 'BIM Overlay Comparison', 'Historical Documentation'], tools: [['Insta360 Pro', 'Ricoh Theta'], ['OpenSpace', 'HoloBuilder']] },
    '360° Capture': { title: '360° Capture', category: 'Construction Technology', description: 'High-resolution 360-degree photo and video documentation indexed to BIM drawings for visual tracking.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['360° Site Photo Mapping', 'Time-Lapse Progress Tracking', 'BIM Overlay Comparison', 'Historical Documentation'], tools: [['Insta360 Pro', 'Ricoh Theta'], ['OpenSpace', 'HoloBuilder']] },
    'ar-solutions': { title: 'AR Solutions', category: 'Construction Technology', description: 'Augmented reality visualization overlaying 3D BIM models directly onto job site physical spaces.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['BIM Overlay on Site', 'Clash Detection in AR', 'Remote Expert Assistance', 'Safety Hazard Training'], tools: [['Trimble Connect AR', 'HoloLens 2'], ['vGIS', 'Unity Industrial']] },
    'AR Solutions': { title: 'AR Solutions', category: 'Construction Technology', description: 'Augmented reality visualization overlaying 3D BIM models directly onto job site physical spaces.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['BIM Overlay on Site', 'Clash Detection in AR', 'Remote Expert Assistance', 'Safety Hazard Training'], tools: [['Trimble Connect AR', 'HoloLens 2'], ['vGIS', 'Unity Industrial']] },
    'robotics': { title: 'Robotics', category: 'Construction Technology', description: 'Robotic site layout, autonomous scanning, and robotic inspection integrations for modern job sites.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['Autonomous Scanning Robots', 'Robotic Layout Marking', 'Drone Photogrammetry', 'Automated Surveys'], tools: [['Boston Dynamics Spot', 'Dusty Robotics'], ['Skydio Drones', 'Pix4D']] },
    'Robotics': { title: 'Robotics', category: 'Construction Technology', description: 'Robotic site layout, autonomous scanning, and robotic inspection integrations for modern job sites.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['Autonomous Scanning Robots', 'Robotic Layout Marking', 'Drone Photogrammetry', 'Automated Surveys'], tools: [['Boston Dynamics Spot', 'Dusty Robotics'], ['Skydio Drones', 'Pix4D']] }
  };

  // Map 4 core categories
  const coreServiceMap = {
    'engineering-services': { title: 'Engineering Services', description: 'Comprehensive engineering services including CAD drafting, BIM modeling, 3D laser scanning, and scan-to-BIM conversions.', bulletsTitle: 'Key Sub-Services Include:', bullets: ['CAD', 'BIM', 'Laser Scanning', 'Scan to BIM'], tools: [['AutoCAD', 'Revit'], ['Leica RTC360', 'CloudCompare']] },
    'sustainability-services': { title: 'Sustainability Services', description: 'Green building facilitation, GSAS & LEED certifications, energy diagnostic audits, and carbon management strategies.', bulletsTitle: 'Key Sub-Services Include:', bullets: ['GSAS', 'LEED', 'Energy Audit', 'Carbon Management'], tools: [['GSAS Gate Tool', 'IES VE'], ['eQUEST', 'ISO 14064 Guidelines']] },
    'digital-twin': { title: 'Digital Twin', description: 'Transformative Digital Twin solutions connecting spatial BIM models with real-time IoT monitoring and lifecycle asset management.', bulletsTitle: 'Key Sub-Services Include:', bullets: ['Asset Twin', 'System Integration', 'Real-Time Monitoring', 'Asset Management'], tools: [['Autodesk Tandem', 'Grafana'], ['Node-RED', 'IBM Maximo']] },
    'construction-technology': { title: 'Construction Technology', description: 'Cutting-edge construction technologies including remote site support, 360° capture, augmented reality, and robotics.', bulletsTitle: 'Key Sub-Services Include:', bullets: ['Remote Construction', '360° Capture', 'AR Solutions', 'Robotics'], tools: [['OpenSpace', 'Trimble AR'], ['Insta360', 'Boston Dynamics Spot']] }
  };

  // Convert dynamicServices database list to map structure
  const resolvedServiceDetailsMap = { ...staticServiceDetailsMap };
  dynamicServices.filter(s => s.status !== 'Inactive').forEach(s => {
    let bulletsParsed = [];
    let toolsParsed = null;
    try {
      bulletsParsed = typeof s.bullets === 'string' ? JSON.parse(s.bullets) : (s.bullets || []);
      toolsParsed = typeof s.tools === 'string' ? JSON.parse(s.tools) : (s.tools || null);
    } catch (e) {
      console.error('Error parsing bullets/tools in ServicesPage:', e);
    }
    const itemData = {
      title: s.title,
      slug: s.slug,
      category: s.category,
      description: s.description,
      bulletsTitle: 'Key Scope & Deliverables Include:',
      bullets: bulletsParsed,
      tools: toolsParsed,
      banner_image: s.banner_image || ''
    };
    resolvedServiceDetailsMap[s.title] = itemData;
    if (s.slug) resolvedServiceDetailsMap[s.slug] = itemData;
  });

  const selectedDetails = resolvedServiceDetailsMap[activeSubTab] 
    || Object.values(resolvedServiceDetailsMap).find(d => (d.slug && d.slug.toLowerCase() === (activeSubTab || '').toLowerCase()) || (d.title && d.title.toLowerCase() === (activeSubTab || '').toLowerCase()))
    || coreServiceMap[activeSubTab] 
    || Object.values(coreServiceMap).find(c => c.title.toLowerCase() === (activeSubTab || '').toLowerCase())
    || resolvedServiceDetailsMap[currentServiceTitle] 
    || staticServiceDetailsMap[currentServiceTitle]
    || staticServiceDetailsMap['cad'];

  // Resolve banner image dynamically
  const getBannerForService = (title) => {
    if (!title) return serviceBanner;
    const lower = title.toLowerCase();
    if (lower.includes('sustainability') || lower.includes('gsas') || lower.includes('leed') || lower.includes('energy') || lower.includes('carbon')) {
      return aboutBanner;
    }
    return serviceBanner;
  };

  const bannerToDisplay = (selectedDetails && selectedDetails.banner_image) 
    ? selectedDetails.banner_image 
    : getBannerForService(currentServiceTitle);

  // Resolve Categories list dynamically for the main overview
  const categoryGroups = {
    'Engineering Services': ['CAD', 'BIM', 'Laser Scanning', 'Scan to BIM'],
    'Sustainability Services': ['GSAS', 'LEED', 'Energy Audit', 'Carbon Management'],
    'Digital Twin': ['Asset Twin', 'System Integration', 'Real-Time Monitoring', 'Asset Management'],
    'Construction Technology': ['Remote Construction', '360° Capture', 'AR Solutions', 'Robotics']
  };

  if (dynamicServices.length > 0) {
    const dynamicGroups = {};
    dynamicServices.filter(s => s.status !== 'Inactive').forEach(s => {
      const catName = s.category || 'Engineering Services';
      if (!dynamicGroups[catName]) dynamicGroups[catName] = [];
      const itemTitle = s.title;
      if (!dynamicGroups[catName].includes(itemTitle)) {
        dynamicGroups[catName].push(itemTitle);
      }
    });
    if (Object.keys(dynamicGroups).length > 0) {
      Object.assign(categoryGroups, dynamicGroups);
    }
  }

  const getCategoryIcon = (category) => {
    if (category.toLowerCase().includes('engineering')) {
      return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00B8FF" strokeWidth="2" style={{ marginBottom: '16px' }}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>;
    } else if (category.toLowerCase().includes('sustainability')) {
      return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00B8FF" strokeWidth="2" style={{ marginBottom: '16px' }}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>;
    } else if (category.toLowerCase().includes('digital twin')) {
      return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00B8FF" strokeWidth="2" style={{ marginBottom: '16px' }}><rect x="2" y="3" width="9" height="9" rx="1"/><rect x="13" y="3" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/></svg>;
    } else {
      return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00B8FF" strokeWidth="2" style={{ marginBottom: '16px' }}><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16M4 18h.01"/></svg>;
    }
  };

  return (
    <div className="services-page">
      {/* 1. Header Title Banner */}
      <section className="about-full-banner-wrap" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <img
          src={bannerToDisplay}
          alt="Services Banner"
          style={{ width: '100%', height: '420px', objectFit: 'cover', objectPosition: 'center center', display: 'block' }}
        />
      </section>


      {/* 3. Main Content Container — full width, no sidebar */}
      <div className="container">
        <div className="services-enterprise-layout" style={{ gridTemplateColumns: '1fr' }}>
          {/* Main Column */}
          <div className="company-info-column">
            {isMainOverview ? (
              /* Main Services Overview Page (Matches User Screenshots 2 & 3) */
              <div>
                <div className="what-we-do-title-wrap" style={{ marginBottom: '24px' }}>
                  <h2 className="what-we-do-title">Services</h2>
                  <div className="title-underline-yellow"></div>
                </div>

                {/* Categories List */}
                <div className="premium-service-cards-grid">
                  {Object.keys(categoryGroups).map((catName) => (
                    <div key={catName} className="premium-card">
                      {getCategoryIcon(catName)}
                      <h3 className="service-category-title" style={{ fontSize: '18px', color: '#0B3D91', marginBottom: '12px' }}>{catName}</h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {categoryGroups[catName].map((item) => (
                          <li key={item}>
                            <a 
                              className="service-link-item"
                              onClick={(e) => {
                                e.preventDefault();
                                onNavigate('Services', item);
                              }}
                            >
                              {item}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>


                {/* Business Areas Section (Matches Screenshot 3) */}
                {/* Business Areas Section */}
                <div className="premium-business-card">
                  <div className="what-we-do-title-wrap" style={{ marginBottom: '32px' }}>
                    <h2 className="what-we-do-title" style={{ color: '#0B1F3A', fontSize: '24px' }}>Business Areas</h2>
                  </div>

                  <ul className="blue-check-list">
                    <li>Established in Doha, Qatar to serve the Construction Sector.</li>
                    <li>Envisioned to expand the current strength to meet the growing needs of Qatar and other regions.</li>
                    <li>Equipped with most experienced staffs to deliver the Engineering Projects at various levels.</li>
                    <li>Economical Solutions with greater Engineering Values.</li>
                    <li>Specialized Engineering Support Services ranging from Concept development to Construction documentation.</li>
                    <li>Experienced in Qatar Market with various Clients including Contractors & Consultants.</li>
                  </ul>
                </div>
              </div>
            ) : (
              /* Dedicated Service Sub-Page View */
              <div>
                <h2 className="section-heading-grey" style={{ fontSize: '26px', marginTop: 0 }}>
                  {currentServiceTitle}
                </h2>

                {selectedDetails ? (
                  /* Custom Dedicated Page View for Sub-Services */
                  <div style={{ marginTop: '20px' }}>
                    {/* Digital Twin sub-service badge */}
                    {['Life Cycle Twin Asset Management', 'Remote Work Automation', 'System Integration and Analysis'].includes(currentServiceTitle) && (
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        background: 'linear-gradient(90deg, #0B3D91, #0066FF)',
                        color: '#fff', borderRadius: '8px',
                        padding: '8px 18px', marginBottom: '20px',
                        fontSize: '12px', fontWeight: 700, letterSpacing: '1.4px', textTransform: 'uppercase'
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="3" width="9" height="9" rx="1.5"/><rect x="13" y="3" width="9" height="9" rx="1.5"/>
                          <rect x="2" y="13" width="9" height="9" rx="1.5"/><rect x="13" y="13" width="9" height="9" rx="1.5"/>
                        </svg>
                        Digital Twin
                      </div>
                    )}
                    <p className="paragraph-text" style={{ whiteSpace: 'pre-line' }}>
                      {selectedDetails.description}
                    </p>

                    <h3 className="service-subheading" style={{ fontSize: '20px', color: '#475569', marginTop: '24px' }}>
                      {selectedDetails.bulletsTitle}
                    </h3>
                    <ul className="bullet-list">
                      {Array.isArray(selectedDetails.bullets) && selectedDetails.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>



                    <div style={{ padding: '24px', background: '#f8fafc', borderLeft: '4px solid var(--primary-gold)', borderRadius: '4px', marginTop: '30px' }}>
                      <h4 style={{ margin: 0, color: '#334155', fontSize: '16px' }}>Need assistance with {currentServiceTitle}?</h4>
                      <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#64748b' }}>
                        Contact our specialized engineering team at <strong>info@bcrescent.com</strong> or call us at <strong>+974 4463 5250</strong>.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Generic Fallback */
                  <div style={{ marginTop: '20px' }}>
                    <p className="paragraph-text">
                      Blue Crescent Engineering provides premier <strong>{currentServiceTitle}</strong> to support commercial, residential, infrastructure, and industrial developments in Qatar and the GCC region.
                    </p>

                    <h3 className="service-subheading" style={{ fontSize: '20px', color: '#475569', marginTop: '24px' }}>
                      Service Overview & Deliverables
                    </h3>
                    <ul className="bullet-list">
                      <li>Detailed engineering calculation & compliance reporting</li>
                      <li>Full integration with Architecture, MEP, and Structural teams</li>
                      <li>Value engineering & cost-effective solutions for clients</li>
                      <li>Authority approvals and technical clearance support</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar removed — content moved to full-width sections below */}
        </div>
      </div>

      {/* ─── LATEST NEWS (full-width, matching About Us layout) ─── */}
      <div className="container" style={{ marginTop: '80px' }}>
        <section className="latest-news-section">
          <h2 className="bce-heading-primary">LATEST NEWS</h2>
          <div className="bce-underline-gradient"></div>

          <div className="latest-news-grid">
            {/* LEFT: News items */}
            <div className="news-items-list">
              {news.length > 0 ? (
                news.map((item) => (
                  <div key={item.id} className="news-card-horizontal">
                    <div className="news-card-icon-badge">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <div className="news-card-body">
                      <div className="news-card-text">
                        <strong>{item.category}:</strong> {item.title}
                      </div>
                      <button className="news-read-more-btn" onClick={() => { if (onOpenModal) onOpenModal('news'); }}>
                        Read More →
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {/* News 1 */}
                  <div className="news-card-horizontal">
                    <div className="news-card-icon-badge">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <div className="news-card-body">
                      <div className="news-card-text">
                        <strong>ISO 9001 Certified:</strong> We are now an ISO 9001 certified Quality Management System company.
                      </div>
                      <button className="news-read-more-btn" onClick={() => { if (onOpenModal) onOpenModal('iso'); }}>
                        Read More →
                      </button>
                    </div>
                  </div>

                  {/* News 2 */}
                  <div className="news-card-horizontal">
                    <div className="news-card-icon-badge">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                    </div>
                    <div className="news-card-body">
                      <div className="news-card-text">
                        <strong>Energy Quotient Provider:</strong> We are the only authorised energy quotient service provider in Qatar.
                      </div>
                      <button className="news-read-more-btn" onClick={() => { if (onNavigate) onNavigate('Services'); }}>
                        Read More →
                      </button>
                    </div>
                  </div>

                  {/* News 3 */}
                  <div className="news-card-horizontal">
                    <div className="news-card-icon-badge">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="7"></circle>
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                      </svg>
                    </div>
                    <div className="news-card-body">
                      <div className="news-card-text">
                        <strong>GORD GSAS Provider:</strong> We are now a GORD certified GSAS service provider.
                      </div>
                      <button className="news-read-more-btn" onClick={() => { if (onOpenModal) onOpenModal('gsas'); }}>
                        Read More →
                      </button>
                    </div>
                  </div>

                  {/* News 4 */}
                  <div className="news-card-horizontal">
                    <div className="news-card-icon-badge">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    </div>
                    <div className="news-card-body">
                      <div className="news-card-text">
                        <strong>KAHRAMAA Project Tarsheed:</strong> Awarded prestigious KAHRAMAA Tarsheed Energy Audit for 22 schools campaign.
                      </div>
                      <button className="news-read-more-btn" onClick={() => { if (onOpenModal) onOpenModal('news2'); }}>
                        Read More →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* RIGHT: Large image */}
            <div className="news-parallax-image-wrap">
              <img
                src="/why.png"
                alt="Blue Crescent Engineering Excellence"
                className="news-parallax-img"
              />
            </div>
          </div>
        </section>

        {/* ─── WHAT OUR CLIENTS SAY (matching About Us layout) ─── */}
        <section className="testimonials-section" style={{ marginTop: '80px' }}>
          <div className="testimonials-header-row" style={{ marginBottom: '32px' }}>
            <h2 className="bce-heading-primary">What Our Clients Say</h2>
            <div className="bce-underline-gradient" style={{ margin: '16px 0 0 0' }}></div>
          </div>

          <div className="testimonials-grid-content">
            {/* Left: Testimonial cards */}
            <div className="testimonials-list-column">
              {testimonials.length > 0 ? (
                testimonials.map((t) => (
                  <div className="premium-card testimonial-card" key={t.id} style={{ marginBottom: '16px' }}>
                    <div className="testimonial-header">
                      <span className="quote-icon">"</span>
                      <h4 className="testimonial-title" style={{ color: '#0066FF' }}>{t.title}</h4>
                    </div>
                    <p className="testimonial-content" style={{ fontStyle: 'italic', color: '#374151', lineHeight: '1.8' }}>
                      {t.content}
                    </p>
                    <hr className="testimonial-divider" />
                    <div className="premium-testimonial-footer">
                      <div className="testimonial-author-wrapper">
                        <div className="author-avatar">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                        <div className="premium-testimonial-author">
                          <div className="premium-testimonial-name">{t.author_name}</div>
                          <div className="premium-testimonial-company">{t.company_name}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="premium-card testimonial-card">
                  <div className="testimonial-header">
                    <span className="quote-icon">"</span>
                    <h4 className="testimonial-title" style={{ color: '#0066FF' }}>Excellent Work</h4>
                  </div>
                  <p className="testimonial-content" style={{ fontStyle: 'italic', color: '#374151', lineHeight: '1.8' }}>
                    Blue Crescent has provided us with complete support for MEP drawings, all design Calculations in MEP &amp; Stress Analysis etc in our projects. They are one of the best Engineering company who can be trusted for complete solutions of all Design &amp; Engineering issues. I visited their office &amp; fully satisfied with the Engineering &amp; design team who delivered the works for us on time &amp; also they provided complete support to get approval from various authorities for some woks in very short time. You are Excellent Blue crescent &amp; keep going. Thanks for your works delivered.
                  </p>
                  <hr className="testimonial-divider" />
                  <div className="premium-testimonial-footer">
                    <div className="testimonial-author-wrapper">
                      <div className="author-avatar">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                      <div className="premium-testimonial-author">
                        <div className="premium-testimonial-name">Gokulraj Chakaravarthy</div>
                        <div className="premium-testimonial-company">Diplomat Group W.L.L</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: testimonial image */}
            <div className="testimonials-image-column">
              <div className="testimonials-large-card-img-wrap">
                <img src="/testimonial.png" alt="Testimonials" className="testimonials-large-img" />
              </div>
            </div>
          </div>


        </section>
      </div>
    </div>
  );
}





