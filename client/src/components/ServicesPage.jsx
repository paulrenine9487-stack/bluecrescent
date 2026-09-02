import React, { useState, useEffect } from 'react';
import { getCachedCompanySettings, updateCachedCompanySettings } from '../utils/bannerCache';
import TestimonialsSection from './TestimonialsSection';
import GSASDetailPage from './GSASDetailPage';
import LEEDDetailPage from './LEEDDetailPage';
import EnergyAuditDetailPage from './EnergyAuditDetailPage';
import EnvironmentalDetailPage from './EnvironmentalDetailPage';
import LaserScanningDetailPage from './LaserScanningDetailPage';
import CADDetailPage from './CADDetailPage';
import BIMDetailPage from './BIMDetailPage';
import serviceBanner from '../assets/servicepage1.png';
import aboutBanner from '../assets/about.png';
import projectBanner from '../assets/project1.png';
import DynamicBanner from './DynamicBanner';
import './AboutUsPage.css';

export default function ServicesPage({ activeSubTab = '', onOpenModal, onNavigate }) {
  const isMainOverview = !activeSubTab || activeSubTab === 'Services' || activeSubTab === 'Main';
  const currentServiceTitle = isMainOverview ? 'Services' : activeSubTab;

  const [dynamicServices, setDynamicServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [companySettings, setCompanySettings] = useState(() => getCachedCompanySettings());

  useEffect(() => {
    const handleSettingsUpdated = (e) => {
      if (e?.detail) {
        setCompanySettings(prev => ({ ...prev, ...e.detail }));
      } else {
        setCompanySettings(getCachedCompanySettings());
      }
    };

    window.addEventListener('companySettingsUpdated', handleSettingsUpdated);

    fetch('/api/settings/company')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          updateCachedCompanySettings(data);
          setCompanySettings(prev => ({ ...prev, ...data }));
        }
      })
      .catch(err => console.warn('Company settings fetch warning:', err));

    fetch('/api/services')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) {
          setDynamicServices(data);
        }
      })
      .catch(err => console.warn('Services fetch warning:', err));

    fetch('/api/testimonials')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) {
          setTestimonials(data);
        }
      })
      .catch(err => console.warn('Testimonials fetch warning:', err));

    return () => {
      window.removeEventListener('companySettingsUpdated', handleSettingsUpdated);
    };
  }, []);

  // Static fallback data map for all 16 sub-services
  const staticServiceDetailsMap = {
    // Engineering Services
    'cad': { title: 'CAD', category: 'Engineering Services', description: 'Professional multidisciplinary 2D/3D CAD drafting, shop drawing production, and engineering documentation support.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['2D Drafting', 'Shop Drawings', 'As-Built Documentation', 'Engineering Coordination'], tools: [['AutoCAD', 'MicroStation'], ['Civil 3D', 'Revit CAD']] },
    'CAD': { title: 'CAD', category: 'Engineering Services', description: 'Professional multidisciplinary 2D/3D CAD drafting, shop drawing production, and engineering documentation support.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['2D Drafting', 'Shop Drawings', 'As-Built Documentation', 'Engineering Coordination'], tools: [['AutoCAD', 'MicroStation'], ['Civil 3D', 'Revit CAD']] },
    'bim': { title: 'BIM', category: 'Engineering Services', description: 'End-to-end Building Information Modeling (BIM) up to LOD 500 across architectural, structural, and MEP disciplines.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['3D BIM Modeling', 'Clash Detection & Resolution', '4D Construction Scheduling', '5D Quantity Take-Off (QTO)'], tools: [['Autodesk Revit', 'Navisworks Manage'], ['Solibri', 'BIM 360']] },
    'BIM': { title: 'BIM', category: 'Engineering Services', description: 'End-to-end Building Information Modeling (BIM) up to LOD 500 across architectural, structural, and MEP disciplines.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['3D BIM Modeling', 'Clash Detection & Resolution', '4D Construction Scheduling', '5D Quantity Take-Off (QTO)'], tools: [['Autodesk Revit', 'Navisworks Manage'], ['Solibri', 'BIM 360']] },
    'laser-scanning': { title: 'Laser Scanning Services', category: 'Engineering Services', description: 'High-precision 3D laser scanning and point cloud capture for as-built verification and asset documentation.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['3D Laser Scanning', 'Point Cloud Registration', 'Dimensional Verification', 'Site Reality Capture'], tools: [['Leica RTC360', 'Faro Focus'], ['Cyclone', 'Recap Pro']] },
    'Laser Scanning': { title: 'Laser Scanning Services', category: 'Engineering Services', description: 'High-precision 3D laser scanning and point cloud capture for as-built verification and asset documentation.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['3D Laser Scanning', 'Point Cloud Registration', 'Dimensional Verification', 'Site Reality Capture'], tools: [['Leica RTC360', 'Faro Focus'], ['Cyclone', 'Recap Pro']] },
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
    'digital-construction-technology': { title: 'Digital Construction Technology', category: 'Digital Construction Technology', description: 'Cutting-edge digital construction technologies including 3D reality capture, 360° site documentation, augmented reality solutions, and digital BIM collaboration.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['Laser Scanning', '360° Site Documentation', 'AR Solutions', 'Digital Collaboration'], tools: [['Leica RTC360', 'Faro Focus'], ['OpenSpace', 'Autodesk ACC']] },
    'Digital Construction Technology': { title: 'Digital Construction Technology', category: 'Digital Construction Technology', description: 'Cutting-edge digital construction technologies including 3D reality capture, 360° site documentation, augmented reality solutions, and digital BIM collaboration.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['Laser Scanning', '360° Site Documentation', 'AR Solutions', 'Digital Collaboration'], tools: [['Leica RTC360', 'Faro Focus'], ['OpenSpace', 'Autodesk ACC']] },
    'construction-technology': { title: 'Digital Construction Technology', category: 'Digital Construction Technology', description: 'Cutting-edge digital construction technologies including 3D reality capture, 360° site documentation, augmented reality solutions, and digital BIM collaboration.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['Laser Scanning', '360° Site Documentation', 'AR Solutions', 'Digital Collaboration'], tools: [['Leica RTC360', 'Faro Focus'], ['OpenSpace', 'Autodesk ACC']] },
    'Construction Technology': { title: 'Digital Construction Technology', category: 'Digital Construction Technology', description: 'Cutting-edge digital construction technologies including 3D reality capture, 360° site documentation, augmented reality solutions, and digital BIM collaboration.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['Laser Scanning', '360° Site Documentation', 'AR Solutions', 'Digital Collaboration'], tools: [['Leica RTC360', 'Faro Focus'], ['OpenSpace', 'Autodesk ACC']] },
    'construction-laser-scanning': { title: 'Construction Laser Scanning', category: 'Digital Construction Technology', description: 'Active construction site 3D reality capture, scan vs. BIM design deviation analysis, floor flatness/levelness verification, and automated progress monitoring.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['Construction Site Reality Capture', 'Scan vs. BIM Deviation Analysis', 'Floor Flatness & Levelness (FF/FL)', '4D Construction Progress Verification'], tools: [['Leica RTC360', 'Faro Focus'], ['Verity ClearEdge3D', 'Autodesk ACC']] },
    '360-site-documentation': { title: '360° Site Documentation', category: 'Construction Technology', description: 'High-resolution 360-degree photo and video documentation indexed to BIM drawings for visual progress tracking.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['360° Site Photo Mapping', 'Time-Lapse Progress Tracking', 'BIM Overlay Comparison', 'Historical Documentation'], tools: [['Insta360 Pro', 'Ricoh Theta'], ['OpenSpace', 'HoloBuilder']] },
    '360° Site Documentation': { title: '360° Site Documentation', category: 'Construction Technology', description: 'High-resolution 360-degree photo and video documentation indexed to BIM drawings for visual progress tracking.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['360° Site Photo Mapping', 'Time-Lapse Progress Tracking', 'BIM Overlay Comparison', 'Historical Documentation'], tools: [['Insta360 Pro', 'Ricoh Theta'], ['OpenSpace', 'HoloBuilder']] },
    'ar-solutions': { title: 'AR Solutions', category: 'Construction Technology', description: 'Augmented reality visualization overlaying 3D BIM models directly onto job site physical spaces.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['BIM Overlay on Site', 'Clash Detection in AR', 'Remote Expert Assistance', 'Safety Hazard Training'], tools: [['Trimble Connect AR', 'HoloLens 2'], ['vGIS', 'Unity Industrial']] },
    'AR Solutions': { title: 'AR Solutions', category: 'Construction Technology', description: 'Augmented reality visualization overlaying 3D BIM models directly onto job site physical spaces.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['BIM Overlay on Site', 'Clash Detection in AR', 'Remote Expert Assistance', 'Safety Hazard Training'], tools: [['Trimble Connect AR', 'HoloLens 2'], ['vGIS', 'Unity Industrial']] },
    'digital-collaboration': { title: 'Digital Collaboration', category: 'Construction Technology', description: 'Cloud-based common data environments (CDE), real-time BIM collaboration, and digital project management.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['CDE Common Data Environment', 'Real-Time BIM Cloud Sync', 'Digital Workflow Automation', 'Issue Management'], tools: [['Autodesk ACC', 'BIM 360'], ['Trimble Connect', 'Procore']] },
    'Digital Collaboration': { title: 'Digital Collaboration', category: 'Construction Technology', description: 'Cloud-based common data environments (CDE), real-time BIM collaboration, and digital project management.', bulletsTitle: 'Key Scope & Deliverables Include:', bullets: ['CDE Common Data Environment', 'Real-Time BIM Cloud Sync', 'Digital Workflow Automation', 'Issue Management'], tools: [['Autodesk ACC', 'BIM 360'], ['Trimble Connect', 'Procore']] }
  };

  // Map 4 core categories
  const coreServiceMap = {
    'engineering-services': { title: 'Engineering Services', description: 'Comprehensive engineering services including BIM modeling, CAD drafting, and 3D laser scanning.', bulletsTitle: 'Key Sub-Services Include:', bullets: ['BIM', 'CAD', 'Laser Scanning'], tools: [['AutoCAD', 'Revit'], ['Leica RTC360', 'CloudCompare']] },
    'sustainability-services': { title: 'Sustainability Services', description: 'Green building facilitation, GSAS & LEED certifications, energy diagnostic audits, and environment strategies.', bulletsTitle: 'Key Sub-Services Include:', bullets: ['GSAS', 'LEED', 'Energy Audit', 'Environment'], tools: [['GSAS Gate Tool', 'IES VE'], ['eQUEST', 'ISO 14064 Guidelines']] },
    'digital-twin': { title: 'Digital Twin', description: 'Transformative Digital Twin solutions connecting spatial BIM models with real-time IoT monitoring and lifecycle asset management.', bulletsTitle: 'Key Sub-Services Include:', bullets: ['Asset Management', 'System Integration'], tools: [['Autodesk Tandem', 'Grafana'], ['Node-RED', 'IBM Maximo']] },
    'digital-construction-technology': { title: 'Digital Construction Technology', description: 'Cutting-edge construction technologies including laser scanning, 360° site documentation, AR solutions, and digital collaboration.', bulletsTitle: 'Key Sub-Services Include:', bullets: ['Laser Scanning', '360° Site Documentation', 'AR Solutions', 'Digital Collaboration'], tools: [['Leica RTC360', 'Trimble AR'], ['Insta360', 'Autodesk ACC']] },
    'construction-technology': { title: 'Digital Construction Technology', description: 'Cutting-edge construction technologies including laser scanning, 360° site documentation, AR solutions, and digital collaboration.', bulletsTitle: 'Key Sub-Services Include:', bullets: ['Laser Scanning', '360° Site Documentation', 'AR Solutions', 'Digital Collaboration'], tools: [['Leica RTC360', 'Trimble AR'], ['Insta360', 'Autodesk ACC']] }
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

  const normalizeKey = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const findMatchingDetails = () => {
    if (!activeSubTab || activeSubTab === 'Services' || activeSubTab === 'Main') return null;

    const targetKey = normalizeKey(activeSubTab);

    // 1. Direct key match in resolved db map
    if (resolvedServiceDetailsMap[activeSubTab]) return resolvedServiceDetailsMap[activeSubTab];

    // 2. Direct key match in static map
    if (staticServiceDetailsMap[activeSubTab]) return staticServiceDetailsMap[activeSubTab];

    // 3. Direct key match in core category map
    if (coreServiceMap[activeSubTab]) return coreServiceMap[activeSubTab];

    // 4. Normalized key search in resolved db map
    const dbMatch = Object.values(resolvedServiceDetailsMap).find(d => 
      normalizeKey(d.slug) === targetKey || normalizeKey(d.title) === targetKey
    );
    if (dbMatch) return dbMatch;

    // 5. Normalized key search in static map
    const staticMatch = Object.values(staticServiceDetailsMap).find(d => 
      normalizeKey(d.slug) === targetKey || normalizeKey(d.title) === targetKey
    );
    if (staticMatch) return staticMatch;

    // 6. Normalized key search in core map
    const coreMatch = Object.values(coreServiceMap).find(c => 
      normalizeKey(c.title) === targetKey || normalizeKey(c.slug) === targetKey
    );
    if (coreMatch) return coreMatch;

    // 7. Fuzzy/substring search
    const fuzzyStatic = Object.values(staticServiceDetailsMap).find(d => 
      targetKey.includes(normalizeKey(d.title)) || normalizeKey(d.title).includes(targetKey)
    );
    if (fuzzyStatic) return fuzzyStatic;

    return null;
  };

  const selectedDetails = findMatchingDetails() 
    || resolvedServiceDetailsMap[currentServiceTitle] 
    || staticServiceDetailsMap[currentServiceTitle];

  // Resolve banner image dynamically
  const getBannerForService = (title) => {
    if (!title) return serviceBanner;
    const lower = title.toLowerCase();
    if (lower.includes('sustainability') || lower.includes('gsas') || lower.includes('leed') || lower.includes('energy') || lower.includes('carbon')) {
      return aboutBanner;
    }
    return serviceBanner;
  };

  const bannerToDisplay = companySettings?.servicesPageBannerUrl
    || ((selectedDetails && selectedDetails.banner_image) 
      ? selectedDetails.banner_image 
      : getBannerForService(currentServiceTitle));

  // Resolve Categories list dynamically for the main overview
  const categoryGroups = {
    'Engineering Services': ['BIM', 'CAD', 'Laser Scanning', 'Scan to BIM'],
    'Sustainability Services': ['GSAS', 'LEED', 'Energy Audit', 'Carbon Management'],
    'Digital Twin': ['Asset Twin', 'System Integration', 'Real-Time Monitoring', 'Asset Management'],
    'Digital Construction Technology': ['Construction Laser Scanning', '360° Site Documentation', 'AR Solutions', 'Digital Collaboration']
  };

  if (dynamicServices.length > 0) {
    const dynamicGroups = {};
    dynamicServices.filter(s => s.status !== 'Inactive').forEach(s => {
      let catName = s.category || 'Engineering Services';
      if (catName === 'Construction Technology') catName = 'Digital Construction Technology';
      if (!dynamicGroups[catName]) dynamicGroups[catName] = [];
      const itemTitle = s.title;
      if (!dynamicGroups[catName].includes(itemTitle)) {
        dynamicGroups[catName].push(itemTitle);
      }
    });
    if (Object.keys(dynamicGroups).length > 0) {
      delete categoryGroups['Digital Construction Technology'];
      Object.assign(categoryGroups, dynamicGroups);
    }
  }

  // Ensure BIM comes before CAD across all category groups
  Object.keys(categoryGroups).forEach(catName => {
    categoryGroups[catName].sort((a, b) => {
      const strA = a.toString().toUpperCase();
      const strB = b.toString().toUpperCase();
      if (strA.includes('BIM')) return -1;
      if (strB.includes('BIM')) return 1;
      if (strA.includes('CAD')) return strB.includes('BIM') ? 1 : -1;
      if (strB.includes('CAD')) return strA.includes('BIM') ? -1 : 1;
      if (strA === 'BIM') return -1;
      if (strB === 'BIM') return 1;
      if (strA === 'CAD') return strB === 'BIM' ? 1 : -1;
      if (strB === 'CAD') return strA === 'BIM' ? -1 : 1;
      return 0;
    });
  });

  const getCategoryIcon = (category) => {
    const lower = category.toLowerCase();
    if (lower.includes('engineering')) {
      return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00B8FF" strokeWidth="2" style={{ marginBottom: '16px' }}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>;
    } else if (lower.includes('sustainability')) {
      return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00B8FF" strokeWidth="2" style={{ marginBottom: '16px' }}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>;
    } else if (lower.includes('twin')) {
      return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00B8FF" strokeWidth="2" style={{ marginBottom: '16px' }}><rect x="2" y="3" width="9" height="9" rx="1"/><rect x="13" y="3" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/></svg>;
    } else {
      return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00B8FF" strokeWidth="2" style={{ marginBottom: '16px' }}><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16M4 18h.01"/></svg>;
    }
  };

  const subKey = (activeSubTab || '').toLowerCase().trim();
  const isGsas = subKey === 'gsas' || subKey.includes('gsas');
  const isLeed = subKey === 'leed' || subKey.includes('leed');
  const isEnergyAudit = subKey.includes('energy') || subKey.includes('carbon');
  const isEnvironmental = subKey.includes('environmental');
  const isLaserScanning = subKey.includes('laser') || subKey.includes('scan');
  const isCad = subKey === 'cad' || subKey.includes('cad');
  const isBim = subKey === 'bim' || subKey.includes('bim');

  const resolveBannerPageKey = () => {
    if (isGsas) return 'gsas';
    if (isLeed) return 'leed';
    if (isEnergyAudit) return 'energy-audit';
    if (isEnvironmental) return 'carbon-management';
    if (isLaserScanning) return 'laser-scanning';
    if (isCad) return 'cad';
    if (isBim) return 'bim';
    const cleanSub = subKey.replace(/[^a-z0-9-]/g, '');
    if (cleanSub.includes('twin')) return 'digital-twin';
    if (cleanSub.includes('construction') || cleanSub.includes('remote')) return 'construction-technology';
    return 'services';
  };

  const dynamicPageKey = resolveBannerPageKey();

  if (isGsas) {
    return (
      <div className="services-page">
        <DynamicBanner pageKey={dynamicPageKey} defaultImage={bannerToDisplay} />
        <GSASDetailPage onNavigate={onNavigate} />
        <div className="container" style={{ marginTop: '40px', marginBottom: '60px' }}>
          <TestimonialsSection />
        </div>
      </div>
    );
  }

  if (isLeed) {
    return (
      <div className="services-page">
        <DynamicBanner pageKey={dynamicPageKey} defaultImage={bannerToDisplay} />
        <LEEDDetailPage onNavigate={onNavigate} />
        <div className="container" style={{ marginTop: '40px', marginBottom: '60px' }}>
          <TestimonialsSection />
        </div>
      </div>
    );
  }

  if (isEnergyAudit) {
    return (
      <div className="services-page">
        <DynamicBanner pageKey={dynamicPageKey} defaultImage={bannerToDisplay} />
        <EnergyAuditDetailPage onNavigate={onNavigate} />
        <div className="container" style={{ marginTop: '40px', marginBottom: '60px' }}>
          <TestimonialsSection />
        </div>
      </div>
    );
  }

  if (isEnvironmental) {
    return (
      <div className="services-page">
        <DynamicBanner pageKey={dynamicPageKey} defaultImage={bannerToDisplay} />
        <EnvironmentalDetailPage onNavigate={onNavigate} />
        <div className="container" style={{ marginTop: '40px', marginBottom: '60px' }}>
          <TestimonialsSection />
        </div>
      </div>
    );
  }

  if (isLaserScanning) {
    return (
      <div className="services-page">
        <DynamicBanner pageKey={dynamicPageKey} defaultImage={bannerToDisplay} />
        <LaserScanningDetailPage onNavigate={onNavigate} />
        <div className="container" style={{ marginTop: '40px', marginBottom: '60px' }}>
          <TestimonialsSection />
        </div>
      </div>
    );
  }

  if (isCad) {
    return (
      <div className="services-page">
        <DynamicBanner pageKey={dynamicPageKey} defaultImage={bannerToDisplay} />
        <CADDetailPage onNavigate={onNavigate} />
        <div className="container" style={{ marginTop: '40px', marginBottom: '60px' }}>
          <TestimonialsSection />
        </div>
      </div>
    );
  }

  if (isBim) {
    return (
      <div className="services-page">
        <DynamicBanner pageKey={dynamicPageKey} defaultImage={bannerToDisplay} />
        <BIMDetailPage onNavigate={onNavigate} />
        <div className="container" style={{ marginTop: '40px', marginBottom: '60px' }}>
          <TestimonialsSection />
        </div>
      </div>
    );
  }

  return (
    <div className="services-page">
      <DynamicBanner pageKey={dynamicPageKey} defaultImage={bannerToDisplay} />

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
                      <h3 
                        className="service-category-title" 
                        style={{ fontSize: '18px', color: '#0B3D91', marginBottom: '12px', cursor: 'default' }}
                      >
                        {catName}
                      </h3>
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
                  {selectedDetails?.category && !currentServiceTitle.toLowerCase().includes(selectedDetails.category.toLowerCase())
                    ? `${selectedDetails.category} (${currentServiceTitle})`
                    : currentServiceTitle}
                </h2>

                {selectedDetails ? (
                  /* Custom Dedicated Page View for Sub-Services */
                  <div style={{ marginTop: '20px' }}>
                    {/* Digital Twin sub-service badge */}
                    {(selectedDetails.category === 'Digital Twin' || ['Life Cycle Twin Asset Management', 'Remote Work Automation', 'System Integration and Analysis', 'Asset Twin', 'System Integration', 'Real-Time Monitoring', 'Asset Management'].includes(currentServiceTitle)) && (
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

                    {selectedDetails.tools && Array.isArray(selectedDetails.tools) && (
                      <div style={{ marginTop: '28px', padding: '20px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <h4 style={{ margin: '0 0 14px 0', fontSize: '15px', color: '#0F172A', fontWeight: 700 }}>
                          Key Tools & Software Technology Stack
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {selectedDetails.tools.flat().map((tool, idx) => (
                            <span key={idx} style={{
                              background: '#EFF6FF',
                              color: '#1D4ED8',
                              border: '1px solid #BFDBFE',
                              padding: '6px 14px',
                              borderRadius: '20px',
                              fontSize: '13px',
                              fontWeight: 600
                            }}>
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

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
                      {currentServiceTitle.toLowerCase().includes('construction') ? (
                        <>
                          <li>Laser Scanning</li>
                          <li>360° Site Documentation</li>
                          <li>AR Solutions</li>
                          <li>Digital Collaboration</li>
                        </>
                      ) : (
                        <>
                          <li>Detailed engineering calculation & compliance reporting</li>
                          <li>Full integration with Architecture, MEP, and Structural teams</li>
                          <li>Value engineering & cost-effective solutions for clients</li>
                          <li>Authority approvals and technical clearance support</li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar removed — content moved to full-width sections below */}
        </div>
      </div>

      {/* ─── WHAT OUR CLIENTS SAY (matching Home & About Us layout) ─── */}
      <div className="container" style={{ marginTop: '40px', marginBottom: '60px' }}>
        <TestimonialsSection />
      </div>
    </div>
  );
}





