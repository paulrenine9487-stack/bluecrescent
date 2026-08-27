const mysql = require('mysql2/promise');
const crypto = require('crypto');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'Bluecres',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;
let isConnected = false;

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Seed data fallback
const fallbackData = {
  system_settings: {
    maintenanceMode: false,
    maintenanceTitle: 'WEBSITE UNDER MAINTENANCE',
    maintenanceMessage: 'We are currently performing scheduled maintenance to improve our website and digital services.\nThank you for your patience.\nWe will be back online shortly.',
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Default',
    maintenanceStartedAt: null,
    maintenanceEndedAt: null
  },
  activity_logs: [
    {
      id: 1,
      action: 'System Initialized',
      user_name: 'Super Admin',
      details: 'System settings initialized with Maintenance Mode OFF.',
      created_at: new Date().toISOString()
    }
  ],
  testimonials: [
    {
      id: 1,
      title: "Excellent Engineering & Technical Support",
      content: "Blue Crescent has provided us with complete support for MEP drawings, all design Calculations in MEP & Stress Analysis etc in our projects. They are one of the best Engineering company who can be trusted for complete solutions of all Design & Engineering issues. I visited their office & fully satisfied with the Engineering & design team who delivered the works for us on time & also they provided complete support to get approval from various authorities for some woks in very short time. You are Excellent Blue crescent & keep going. Thanks for your works delivered.",
      author_name: "Gokulraj Chakaravarthy",
      company_name: "Diplomat Group W.L.L",
      status: "approved"
    },
    {
      id: 2,
      title: "Outstanding BIM & Digital Twin Coordination",
      content: "Working with Blue Crescent Engineering on our complex commercial tower project was a seamless experience. Their 3D BIM modeling, spatial clash detection, and digital twin integration eliminated critical site conflicts before construction, saving our project team significant time and cost.",
      author_name: "Eng. Ahmed Al-Mansoori",
      company_name: "Qatar Project Management (QPM)",
      status: "approved"
    },
    {
      id: 3,
      title: "Reliable Specialized Technical Experts",
      content: "Blue Crescent's specialized engineering team delivered comprehensive CFD fluid dynamics analysis and acoustic vibration models. Their prompt authority approval support and high attention to detail made them an invaluable long-term engineering partner for our infrastructure projects.",
      author_name: "Praveen V. Kumar",
      company_name: "Contracting & Engineering W.L.L",
      status: "approved"
    },
    {
      id: 4,
      title: "Top-Tier Sustainability & GSAS Facilitation",
      content: "Their sustainability consultancy team guided our facility to achieve GSAS 4-Star environmental certification effortlessly. Outstanding precision in energy auditing, carbon footprint calculation, and clear communication throughout design and audit phases.",
      author_name: "Hassan Al-Kuwari",
      company_name: "Sustainable Infrastructure Lead, GCC Energy",
      status: "approved"
    }
  ],
  service_categories: [
    { id: 1, name: 'Engineering Services', slug: 'engineering-services', short_description: 'Comprehensive engineering services including CAD drafting, BIM modeling, 3D laser scanning, and scan-to-BIM conversions.', icon: 'Building2', display_order: 1, status: 'Active', featured: 1 },
    { id: 2, name: 'Sustainability Services', slug: 'sustainability-services', short_description: 'Green building facilitation, GSAS & LEED certifications, energy diagnostic audits, and carbon management strategies.', icon: 'Leaf', display_order: 2, status: 'Active', featured: 1 },
    { id: 3, name: 'Digital Twin', slug: 'digital-twin', short_description: 'Transformative Digital Twin solutions connecting spatial BIM models with real-time IoT monitoring and lifecycle asset management.', icon: 'Layers', display_order: 3, status: 'Active', featured: 1 },
    { id: 4, name: 'Construction Technology', slug: 'construction-technology', short_description: 'Cutting-edge construction technologies including remote site support, 360° capture, augmented reality, and robotics.', icon: 'Cpu', display_order: 4, status: 'Active', featured: 1 }
  ],
  services: [
    { id: 1, category: 'Engineering Services', category_id: 1, title: 'BIM', slug: 'bim', description: 'End-to-end Building Information Modeling up to LOD 500 across architectural, structural, and MEP disciplines.', bullets: JSON.stringify(['3D BIM Modeling', 'Clash Detection', '4D Scheduling', '5D Quantity Take-Off']), tools: JSON.stringify([['Autodesk Revit', 'Navisworks Manage'], ['Solibri', 'BIM 360']]), banner_image: '/servicepage1.png', display_order: 1, status: 'Active' },
    { id: 2, category: 'Engineering Services', category_id: 1, title: 'CAD', slug: 'cad', description: 'Professional multidisciplinary 2D/3D CAD drafting and engineering documentation support.', bullets: JSON.stringify(['2D Drafting', 'Shop Drawings', 'As-Built Documentation', 'Engineering Coordination']), tools: JSON.stringify([['AutoCAD', 'MicroStation'], ['Civil 3D', 'Revit']]), banner_image: '/servicepage1.png', display_order: 2, status: 'Active' },
    { id: 3, category: 'Engineering Services', category_id: 1, title: 'Laser Scanning Services', slug: 'laser-scanning', description: 'High-precision 3D laser scanning and point cloud capture for as-built verification and asset documentation.', bullets: JSON.stringify(['3D Laser Scanning', 'Point Cloud Registration', 'Dimensional Verification', 'Site Capture']), tools: JSON.stringify([['Leica RTC360', 'Faro Focus'], ['Cyclone', 'Recap Pro']]), banner_image: '/servicepage1.png', display_order: 3, status: 'Active' },
    { id: 4, category: 'Engineering Services', category_id: 1, title: 'Scan to BIM', slug: 'scan-to-bim', description: 'Converting raw point cloud scans into intelligent 3D BIM models for renovation, retrofit, and facility management.', bullets: JSON.stringify(['Point Cloud to BIM Conversion', 'As-Built Model Verification', 'Retrofit Modeling', 'Deviation Analysis']), tools: JSON.stringify([['Autodesk Revit', 'CloudCompare'], ['ClearEdge3D Edgewise']]), banner_image: '/servicepage1.png', display_order: 4, status: 'Active' },
    { id: 5, category: 'Sustainability Services', category_id: 2, title: 'GSAS', slug: 'gsas', description: 'Global Sustainability Assessment System (GSAS) certification management and green building compliance.', bullets: JSON.stringify(['GSAS Design & Build', 'GSAS Construction Management', 'Energy & Water Audits', 'Daylight Simulation']), tools: JSON.stringify([['GSAS Gate Tool', 'IES VE'], ['Sefaira', 'One Click LCA']]), banner_image: '/servicepage1.png', display_order: 1, status: 'Active' },
    { id: 6, category: 'Sustainability Services', category_id: 2, title: 'LEED', slug: 'leed', description: 'LEED BD+C, ID+C, and O+M consulting, energy modeling, and commissioning for USGBC certification.', bullets: JSON.stringify(['LEED Certification Management', 'Fundamental & Enhanced Commissioning', 'Thermal Comfort Modeling', 'Green Materials Sourcing']), tools: JSON.stringify([['USGBC LEED v4/v4.1', 'IES VE'], ['EnergyPlus', 'CxAlloy']]), banner_image: '/servicepage1.png', display_order: 2, status: 'Active' },
    { id: 7, category: 'Sustainability Services', category_id: 2, title: 'Energy Audit', slug: 'energy-audit', description: 'Comprehensive ASHRAE Level 1, 2, and 3 energy diagnostic audits to optimize building energy performance.', bullets: JSON.stringify(['ASHRAE Level 1, 2 & 3 Audits', 'Chiller Plant Optimization', 'Infrared Thermography', 'Power Quality Analysis']), tools: JSON.stringify([['FLIR Thermal Cameras', 'Power Quality Analyzers'], ['eQUEST', 'EnergyPlus']]), banner_image: '/servicepage1.png', display_order: 3, status: 'Active' },
    { id: 8, category: 'Sustainability Services', category_id: 2, title: 'Carbon Management', slug: 'carbon-management', description: 'Greenhouse gas inventory compiling, carbon footprinting, and ISO 14064 verification strategies.', bullets: JSON.stringify(['ISO 14064 GHG Accounting', 'Organizational Carbon Footprint', 'Decarbonization Roadmap', 'Lifecycle Assessment']), tools: JSON.stringify([['GHG Protocol Suite', 'ISO 14064 Guidelines'], ['Carbon Calculation Tools']]), banner_image: '/servicepage1.png', display_order: 4, status: 'Active' },
    { id: 9, category: 'Digital Twin', category_id: 3, title: 'Asset Twin', slug: 'asset-twin', description: 'Virtual representation of physical assets connecting 3D spatial models with operational telemetry.', bullets: JSON.stringify(['3D Asset Visualization', 'IoT Telemetry Integration', 'Predictive Asset Analytics', 'COBie Data Handover']), tools: JSON.stringify([['Autodesk Tandem', 'Azure Digital Twins'], ['ThingWorx', 'Matterport']]), banner_image: '/servicepage1.png', display_order: 1, status: 'Active' },
    { id: 10, category: 'Digital Twin', category_id: 3, title: 'System Integration', slug: 'system-integration', description: 'Connecting heterogeneous building automation, BMS, CAFM, and ERP software with Digital Twin hubs.', bullets: JSON.stringify(['REST/GraphQL API Middleware', 'BMS/BAS Integration', 'CAFM & ERP Connector', 'Data Pipelines']), tools: JSON.stringify([['Node-RED', 'Apache Kafka'], ['Grafana', 'Docker']]), banner_image: '/servicepage1.png', display_order: 2, status: 'Active' },
    { id: 11, category: 'Digital Twin', category_id: 3, title: 'Real-Time Monitoring', slug: 'real-time-monitoring', description: 'Continuous live sensor data monitoring, anomaly detection, and operational performance dashboards.', bullets: JSON.stringify(['Live Sensor Data Streaming', 'Anomaly Alerts', 'Energy Consumption Monitoring', 'Space Utilization Analytics']), tools: JSON.stringify([['Grafana', 'InfluxDB'], ['AWS IoT Core', 'Azure IoT']]), banner_image: '/servicepage1.png', display_order: 3, status: 'Active' },
    { id: 12, category: 'Digital Twin', category_id: 3, title: 'Asset Management', slug: 'asset-management', description: 'Comprehensive facility asset lifecycle tracking, maintenance scheduling, and digital operations handover.', bullets: JSON.stringify(['Maintenance Scheduling', 'Work Order Automation', 'Lifecycle Cost Analysis', 'Asset Register Management']), tools: JSON.stringify([['IBM Maximo', 'SAP PM'], ['Autodesk Tandem', 'Archibus']]), banner_image: '/servicepage1.png', display_order: 4, status: 'Active' },
    { id: 13, category: 'Construction Technology', category_id: 4, title: 'Laser Scanning', slug: 'construction-laser-scanning', description: 'Active construction site 3D reality capture, scan vs. BIM design deviation analysis, and progress monitoring.', bullets: JSON.stringify(['Construction Site Reality Capture', 'Scan vs. BIM Deviation Analysis', 'Floor Flatness & Levelness (FF/FL)', 'Progress Verification']), tools: JSON.stringify([['Leica RTC360', 'Faro Focus'], ['Verity ClearEdge3D', 'Autodesk ACC']]), banner_image: '/servicepage1.png', display_order: 1, status: 'Active' },
    { id: 14, category: 'Construction Technology', category_id: 4, title: '360° Site Documentation', slug: '360-site-documentation', description: 'High-resolution 360-degree photo and video documentation indexed to BIM drawings for visual tracking.', bullets: JSON.stringify(['360° Site Photo Mapping', 'Time-Lapse Progress Tracking', 'BIM Overlay Comparison', 'Historical Documentation']), tools: JSON.stringify([['Insta360 Pro', 'Ricoh Theta'], ['OpenSpace', 'HoloBuilder']]), banner_image: '/servicepage1.png', display_order: 2, status: 'Active' },
    { id: 15, category: 'Construction Technology', category_id: 4, title: 'AR Solutions', slug: 'ar-solutions', description: 'Augmented reality visualization overlaying 3D BIM models directly onto job site physical spaces.', bullets: JSON.stringify(['BIM Overlay on Site', 'Clash Detection in AR', 'Remote Expert Assistance', 'Safety Hazard Training']), tools: JSON.stringify([['Trimble Connect AR', 'HoloLens 2'], ['vGIS', 'Unity Industrial']]), banner_image: '/servicepage1.png', display_order: 3, status: 'Active' },
    { id: 16, category: 'Construction Technology', category_id: 4, title: 'Digital Collaboration', slug: 'digital-collaboration', description: 'Cloud-based common data environments (CDE), real-time BIM collaboration, and digital project management.', bullets: JSON.stringify(['CDE Common Data Environment', 'Real-Time BIM Cloud Sync', 'Digital Workflow Automation', 'Issue Management']), tools: JSON.stringify([['Autodesk ACC', 'BIM 360'], ['Trimble Connect', 'Procore']]), banner_image: '/servicepage1.png', display_order: 4, status: 'Active' }
  ],
  gsas_content: {
    page_title: 'GSAS',
    introduction: 'Professional GSAS sustainability consultancy supporting projects across design, construction and operational stages.',
    design_title: 'DESIGN',
    design_description: 'GSAS support during the design stage focuses on integrating sustainability requirements into project planning and design development. Our consultancy supports project teams in addressing GSAS criteria, sustainability strategies and documentation requirements from the early stages of design.',
    design_images: [
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Design Architectural Energy Modeling', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Design Stage Daylight Simulation', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Green Building Envelope Design', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Sustainability Design Workshop', display_order: 4 }
    ],
    build_title: 'BUILD / CONSTRUCTION',
    build_description: 'During construction, GSAS consultancy supports project teams in implementing sustainability requirements and maintaining alignment with applicable project objectives and documentation through the construction process.',
    build_images: [
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Construction Site Sustainability Inspection', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Waste Management & Environmental Auditing', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Materials Compliance Verification', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'GSAS On-site Construction Monitoring', display_order: 4 }
    ],
    operation_title: 'OPERATION',
    operation_description: 'At the operational stage, GSAS support focuses on maintaining sustainable building performance and supporting applicable operational requirements, documentation and sustainability objectives.',
    operation_images: [
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Operational Energy Diagnostic Audit', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Facility Performance Management', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Indoor Environmental Quality Testing', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'GSAS Long-term Decarbonization Monitoring', display_order: 4 }
    ]
  },
  leed_content: {
    page_title: 'LEED',
    introduction: 'Comprehensive LEED sustainability consultancy supporting green building projects across design, construction, and operational lifecycle stages to achieve USGBC certifications.',
    design_title: 'DESIGN',
    design_description: 'LEED support during the design stage focuses on integrating USGBC sustainability prerequisites and credits into early architectural planning, energy modeling, daylighting design, and sustainable material specifications.',
    design_images: [
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'LEED BD+C Architectural Design Facilitation', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', alt: 'LEED Energy Modeling & Performance Simulation', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'LEED Sustainable Building Envelope Design', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', alt: 'LEED Integrative Process & Credit Workshop', display_order: 4 }
    ],
    build_title: 'BUILD / CONSTRUCTION',
    build_description: 'During the construction phase, our LEED consultancy ensures strict compliance with construction activity pollution prevention, waste management diversion, indoor air quality management plans, and sustainable material tracking.',
    build_images: [
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'LEED Construction Environmental Compliance Auditing', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'LEED Waste Diversion & Material Verification', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'LEED Construction IAQ Management Inspection', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'LEED On-site Construction Monitoring', display_order: 4 }
    ],
    operation_title: 'OPERATION',
    operation_description: 'For operational assets, LEED O+M consultancy focuses on optimizing building energy performance, indoor environmental quality monitoring, water efficiency verification, and continuous performance benchmarking.',
    operation_images: [
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'LEED O+M Energy Efficiency Diagnostic Audit', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'LEED Facility Performance Optimization', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80', alt: 'LEED Indoor Environmental Quality Testing', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'LEED Long-term Asset Decarbonization Audit', display_order: 4 }
    ]
  },
  energy_audit_content: {
    page_title: 'Energy Audit',
    introduction: 'Comprehensive Energy Audit services providing detailed diagnostics, energy consumption analysis, ASHRAE Level 1, 2 & 3 audits, and cost-effective energy conservation measures across residential and commercial building assets.',
    residential_title: 'RESIDENTIAL BUILDING',
    residential_description: 'Energy audits for residential developments, villas, high-rise apartments, and residential complexes focusing on HVAC optimization, lighting efficiency, thermal envelope insulation, and utility cost reduction.',
    residential_images: [
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', alt: 'Residential Villa Thermal Efficiency Audit', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', alt: 'Residential HVAC & Cooling Diagnostics', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', alt: 'Residential Smart Lighting & Power Diagnostics', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', alt: 'Residential Solar & Energy Storage Assessment', display_order: 4 }
    ],
    commercial_title: 'COMMERCIAL BUILDING',
    commercial_description: 'Detailed energy diagnostics for commercial towers, corporate offices, shopping malls, hotels, and industrial facilities in accordance with ASHRAE audit standards to maximize operational energy efficiency.',
    commercial_images: [
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'Commercial Tower Central Chiller Plant Diagnostic Audit', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', alt: 'Commercial Office Building Automation & BMS Audit', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Commercial Facility Electrical Power Quality Analysis', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'Commercial HVAC Air Handling Unit Diagnostic Inspection', display_order: 4 }
    ]
  },
  environmental_content: {
    page_title: 'ENVIRONMENTAL',
    introduction: 'Comprehensive Environmental consultancy services specializing in environmental impact assessments, real-time noise monitoring, carbon footprint auditing, and sustainable decarbonization strategies.',
    noise_title: 'NOISE MONITORING',
    noise_description: 'Continuous environmental noise monitoring, acoustic modeling, baseline sound level measurement, and noise mitigation planning for construction sites, industrial facilities, and urban developments.',
    noise_images: [
      { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'Acoustic Sound Level Sensor & Noise Meter Field Audit', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'Environmental Noise Compliance Assessment Site', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'Construction Boundary Sound Vibration Monitoring', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'Industrial Environmental Acoustic Audit Equipment', display_order: 4 }
    ],
    carbon_title: 'CARBON MANAGEMENT',
    carbon_description: 'Strategic carbon management services including Scope 1, 2, and 3 greenhouse gas (GHG) accounting, organizational carbon footprint auditing, life cycle assessments (LCA), and net-zero decarbonization roadmaps.',
    carbon_images: [
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Carbon Footprint & Scope 1 2 3 Accounting Diagnostic', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'Decarbonization Roadmap & Clean Energy Transition', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80', alt: 'GHG Emission Inventory & Sustainability Audit', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'Corporate Net-Zero Carbon Strategy Assessment', display_order: 4 }
    ]
  },
  laser_scanning_content: {
    page_title: 'LASER SCANNING SERVICES',
    introduction: 'High-precision 3D laser scanning, terrestrial reality capture, and point cloud registration services for buildings, civil infrastructure, as-built documentation, recap modeling, and seamless Scan-to-BIM digital twin integration.',
    building_title: 'BUILDING',
    building_description: 'Comprehensive 3D laser scanning for commercial, residential, healthcare, and historic buildings. Captures millimeter-accurate spatial geometry, MEP installations, structural components, and complex facades to deliver precise as-built point cloud datasets.',
    building_images: [
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'Commercial High-Rise Architectural 3D Laser Scanning Audit', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'Building Interior MEP Pipe & Duct Terrestrial Laser Scan', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'Historic Structure Facade & As-Built Point Cloud Survey', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', alt: 'Healthcare Facility Interior Spatial Scanning & As-Built', display_order: 4 }
    ],
    infrastructure_title: 'INFRASTRUCTURE',
    infrastructure_description: 'Advanced 3D reality capture for major civil infrastructure including bridges, tunnels, highways, railway corridors, utility networks, and industrial plants. Ensures sub-centimeter accuracy for structural integrity assessment and expansion planning.',
    infrastructure_images: [
      { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'Civil Bridge Infrastructure 3D LiDAR Survey Inspection', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'Industrial Utility Pipeline & Plant Reality Capture', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Highway & Transportation Corridor Point Cloud Scan', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'Tunnel & Heavy Substructure Dimensional Verification', display_order: 4 }
    ],
    recap_title: 'RECAP WORK',
    recap_description: 'End-to-end point cloud registration, indexing, noise filtration, georeferencing, and Autodesk ReCap project compilation. Transforms raw mobile, terrestrial, and aerial scanner files into structured, unified coordinate project files ready for engineering design.',
    recap_images: [
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Autodesk ReCap Pro Point Cloud Processing & Alignment', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: '3D Terrestrial Scan Point Cloud Colorization & Cleaning', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'Georeferenced Target Point Cloud Control Registration', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'Point Cloud Mesh Surface Reconstruction & Quality Audit', display_order: 4 }
    ],
    scan_to_bim_title: 'SCAN TO BIM',
    scan_to_bim_description: 'Converting registered point cloud data into intelligent LOD 100 to LOD 400 Revit BIM models. Enables precise clash detection, facility renovation planning, MEP coordination, digital twin asset management, and verified as-built modeling.',
    scan_to_bim_images: [
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', alt: 'Point Cloud to Revit Parametric BIM Model Conversion', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'MEP As-Built Pipe & Conduit Scan-to-BIM Modeling', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'Structural Clash Detection Scan vs Design Model Audit', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'Asset Information Model (AIM) Scan-to-BIM Integration', display_order: 4 }
    ]
  },
  cad_content: {
    page_title: 'CAD',
    introduction: 'Professional multidisciplinary 2D drafting, 3D CAD modeling, detailed shop drawings, and engineering documentation support across Building (Architecture, Structure, Interior, Mechanical, Electrical) and Infrastructure (Landscaping, Road, Street Light, Underground Utilities) domains.',
    arch_title: 'ARCHITECTURE',
    arch_description: 'Precision 2D/3D architectural CAD drafting, floor plans, building elevations, cross-sections, and detailed construction documentation complying with local authority standards.',
    arch_images: [
      { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', alt: 'Architectural CAD Elevation & Floor Plan Blueprint', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'Building Exterior 3D CAD Wireframe Rendering', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'Commercial High-Rise Architectural Detail Drawing', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', alt: 'Authority Submission Architectural CAD Package', display_order: 4 }
    ],
    struct_title: 'STRUCTURE',
    struct_description: 'Comprehensive structural CAD shop drawings including reinforced concrete detailing, structural steel framing, foundation layouts, and bar bending schedules (BBS).',
    struct_images: [
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'Structural Steel Framing & Rebar CAD Shop Drawings', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'Concrete Column & Beam Connection CAD Details', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'Foundation & Retaining Wall Structural CAD Layout', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'Bar Bending Schedule & Structural Steel Connection Plan', display_order: 4 }
    ],
    interior_title: 'INTERIOR',
    interior_description: 'Detailed interior architectural fit-out CAD drawings, furniture layouts, reflected ceiling plans (RCP), wall elevations, and custom joinery detailing.',
    interior_images: [
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'Interior Architecture Fit-out Layout & Reflected Ceiling Plan', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', alt: 'Custom Millwork & Joinery CAD Shop Detail', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', alt: 'Commercial Office Space Partition & Ceiling CAD Plan', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'Luxury Residential Interior Elevation CAD Drawing', display_order: 4 }
    ],
    mech_title: 'MECHANICAL',
    mech_description: 'HVAC ductwork layouts, chilled water piping schematics, ventilation plans, mechanical equipment schedules, and clash-free shop drawings.',
    mech_images: [
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'HVAC Mechanical Ductwork & Pipe Schematic CAD Drafting', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'Chiller Plant Room Piping CAD Layout Drawing', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'Smoke Extract & Air Handling Unit (AHU) CAD Schematic', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'Firefighting Sprinkler System CAD Layout Plan', display_order: 4 }
    ],
    elec_title: 'ELECTRICAL',
    elec_description: 'Electrical power distribution schematics, lighting layouts, low voltage (LV) systems, containment routing, cable tray paths, and single line diagrams (SLD).',
    elec_images: [
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'Electrical Power & Single Line Diagram (SLD) CAD Plan', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Building Interior Lighting & Switch Control CAD Layout', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'Cable Tray & Electrical Containment Pathway CAD Detail', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'Extra Low Voltage (ELV) & Fire Alarm CAD Layout', display_order: 4 }
    ],
    landscape_title: 'LANDSCAPING',
    landscape_description: 'Hardscape and softscape CAD layouts, site grading plans, irrigation network details, outdoor lighting paths, and urban amenity drafting.',
    landscape_images: [
      { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'Civil Landscaping & Site Plan CAD Layout', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', alt: 'Hardscape & Paving Detail CAD Master Plan', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Automatic Irrigation Piping & Sprinkler CAD Network', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'Outdoor Park & Pedestrian Walkway CAD Layout', display_order: 4 }
    ],
    road_title: 'ROAD',
    road_description: 'Civil road alignment drafting, longitudinal profiles, cross-sections, pavement markings, traffic sign details, and junction CAD designs.',
    road_images: [
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'Highway Road Network Cross-Section CAD Design', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Road Longitudinal Profile & Vertical Alignment CAD', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'Intersection & Roundabout Geometric CAD Drafting', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'Pavement Marking & Traffic Control CAD Plan', display_order: 4 }
    ],
    street_light_title: 'STREET LIGHT',
    street_light_description: 'Public street lighting network plans, pole placement layouts, feeder pillar schematics, underground ducting, and photometrical CAD drawings.',
    street_light_images: [
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Urban Street Lighting & Cable Network CAD Plan', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'Lighting Pole Foundation & Underground Duct CAD Detail', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'Street Lighting Feeder Pillar Electrical Circuit CAD', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'Highway High-Mast Light Fixture Installation CAD Plan', display_order: 4 }
    ],
    util_title: 'UNDERGROUND UTILITIES',
    util_description: 'Combined underground utility mapping (CUM), stormwater drainage, sewer networks, water supply lines, telecommunication ductways, and trench detail CAD drawings.',
    util_images: [
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'Underground Stormwater & Utility CAD Mapping', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'Sewer & Potable Water Distribution Network CAD', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'Combined Utility Trench & Chamber Cross-Section CAD', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Telecom Fiber Cable Duct & Manhole Detail CAD Plan', display_order: 4 }
    ]
  },
  bim_content: {
    page_title: 'BIM',
    introduction: 'End-to-end 3D Building Information Modeling up to LOD 500 across Architectural, Structural, MEP, Infrastructure, 4D Scheduling, 5D Cost Estimation, VR Rendering, and Periodic BIM Audit Reporting.',
    building_main_title: 'BUILDING',
    building_main_desc: 'End-to-end 3D Building Information Modeling up to LOD 500 for commercial, residential, healthcare, and industrial structures.',
    b_arch_title: 'ARCHITECTURE',
    b_arch_desc: 'Intelligent 3D parametric architectural BIM modeling, wall envelope assemblies, facade detailing, spatial floor plans, and authority compliance models.',
    b_arch_images: [
      { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', alt: 'Architectural 3D BIM Model LOD 400 Building Elevation', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'Parametric Curtain Wall & Building Envelope BIM Detail', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'High-Rise Architectural Core & Shell BIM Coordination', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', alt: 'Revit Architectural Model Authority Submission View', display_order: 4 }
    ],
    b_struct_title: 'STRUCTURE',
    b_struct_desc: 'Structural 3D BIM modeling including reinforced concrete framing, post-tensioned slabs, structural steel connections, and foundation rebar detailing.',
    b_struct_images: [
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'Structural Steel Framing & Rebar 3D BIM Model', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'Reinforced Concrete Slab & Column 3D Structural Detail', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'Foundation Piling & Retaining Wall Structural BIM', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'Complex Structural Steel Truss Connection BIM Audit', display_order: 4 }
    ],
    b_interior_title: 'INTERIOR',
    b_interior_desc: 'High-LOD interior BIM modeling, ceiling systems, wall finishes, custom millwork, furniture layouts, and spatial interior coordination.',
    b_interior_images: [
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'Commercial Office Interior Architecture 3D BIM Model', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', alt: 'Reflected Ceiling System & Decorative Light Fixture BIM', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', alt: 'Hospitality Joinery & Interior Partition Wall BIM Detail', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'Luxury Interior Space Material Finish 3D Rendering', display_order: 4 }
    ],
    b_mep_title: 'MECHANICAL ELECTRICAL',
    b_mep_desc: '3D MEP BIM modeling covering HVAC ductwork, chilled water piping, electrical containment pathways, plumbing networks, and clash-free plant room layouts.',
    b_mep_images: [
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'Multi-Disciplinary 3D MEP Pipe & Ductwork BIM Model', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'Chiller Plant Room & Pump Mechanical 3D BIM Layout', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'Electrical Cable Tray & Substation Containment BIM', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'Fire Protection Sprinkler & Drainage System BIM Audit', display_order: 4 }
    ],
    infra_main_title: 'INFRASTRUCTURE',
    infra_main_desc: 'Comprehensive civil infrastructure BIM modeling for transportation, public utilities, roads, bridges, and site developments.',
    i_landscape_title: 'LANDSCAPING',
    i_landscape_desc: 'Civil site topography, hardscape/softscape 3D BIM modeling, site grading, retaining walls, and outdoor amenity spatial coordination.',
    i_landscape_images: [
      { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'Urban Park & Civil Site Landscaping 3D BIM Model', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', alt: 'Retaining Wall & Hardscape Paving 3D BIM Surface Model', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Automatic Site Irrigation Network & Fountain BIM Model', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'Pedestrian Plaza Hardscape & Softscape BIM Rendering', display_order: 4 }
    ],
    i_road_title: 'ROAD',
    i_road_desc: '3D civil road corridor modeling, alignment profiles, pavement layer modeling, junction grading, and traffic network BIM integration.',
    i_road_images: [
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'Highway Expressway Corridor 3D Civil BIM Model', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Multi-Lane Road Intersection & Roundabout Civil BIM', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'Bridge Approach Ramp & Guardrail Civil BIM Detail', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'Asphalt Pavement & Sub-Base Civil 3D Layer Model', display_order: 4 }
    ],
    i_street_light_title: 'STREET LIGHT',
    i_street_light_desc: 'Public street lighting BIM modeling, luminaire pole placement, underground electrical cabling, and feeder pillar distribution paths.',
    i_street_light_images: [
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Urban Street Lighting Cable Network 3D BIM Model', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'High-Mast Luminaire & Lighting Foundation BIM Detail', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'Feeder Pillar & Streetlight Control Cabinet BIM Plan', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'Smart Highway Streetlight Solar Panel Fixture BIM', display_order: 4 }
    ],
    i_util_title: 'UNDERGROUND UTILITIES',
    i_util_desc: 'Subsurface utility BIM modeling including stormwater networks, foul sewer mains, potable water distribution, and telecommunication trench conduits.',
    i_util_images: [
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'Underground Stormwater & Utility Clash Detection BIM', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'Water Distribution Main & Valve Chamber 3D BIM Model', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'Subsurface Utility Trench & Electrical Conduit Model', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Precast Sewer Manhole & Drainage Pipe BIM Detail', display_order: 4 }
    ],
    fourd_main_title: '4D',
    fourd_main_desc: 'Time-based 4D BIM construction scheduling, visual sequence simulation, logistics planning, and progress tracking.',
    fourd_b_title: 'BUILDING',
    fourd_b_desc: 'Linking Primavera P6 / MS Project schedules to 3D building BIM models for step-by-step construction sequencing, crane logistics, and delay analysis.',
    fourd_b_images: [
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: '4D Construction Timeline Simulation High-Rise Building', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: '4D Site Logistics & Tower Crane Placement Simulation', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'Weekly Construction Progress vs Planned 4D Audit', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', alt: 'Structural Concrete Pour 4D Schedule Visualizer', display_order: 4 }
    ],
    fourd_i_title: 'INFRASTRUCTURE',
    fourd_i_desc: '4D scheduling and earthwork sequencing simulations for civil roadworks, bridges, utility trenching, and site earthworks.',
    fourd_i_images: [
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'Highway Earthwork & Paving 4D Construction Sequence', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'Bridge Superstructure Erection 4D Timeline Model', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Underground Utility Trenching 4D Phasing Visualizer', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'Civil Site Cut and Fill 4D Schedule Progress Audit', display_order: 4 }
    ],
    fived_main_title: '5D',
    fived_main_desc: 'Cost-integrated 5D BIM quantity take-offs (QTO), automated bill of quantities (BOQ), and real-time cash flow estimation.',
    fived_b_title: 'BUILDING',
    fived_b_desc: 'Extracting accurate material quantities, concrete volumes, rebar tonnages, and MEP component counts directly from parametric 3D building models.',
    fived_b_images: [
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: '5D BIM Material Quantity Take-off (QTO) Building Dashboard', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', alt: 'Automated BOQ Concrete & Steel Volume Extraction', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', alt: '5D Cash Flow Forecast & Monthly Valuation Model', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: 'Building Cost Estimate & Variation Management BIM', display_order: 4 }
    ],
    fived_i_title: 'INFRASTRUCTURE',
    fived_i_desc: 'Civil quantity estimation for cut/fill earthworks, asphalt tonnage, utility piping line lengths, and infrastructure material costing.',
    fived_i_images: [
      { url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', alt: 'Civil Earthwork & Highway Asphalt 5D Quantity Take-off', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'Underground Pipeline Line-Item BOQ Cost Estimation', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Bridge Concrete & Pre-Stressed Cable 5D Cost Model', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', alt: 'Infrastructure Project Lifecycle Budget Analysis 5D', display_order: 4 }
    ],
    render_main_title: 'RENDERING',
    render_main_desc: 'Photorealistic 3D architectural visualization, virtual reality (VR) walkthroughs, and marketing animations created from BIM models.',
    r_walkthrough_title: 'WALK THROUGH',
    r_walkthrough_desc: 'Immersive 3D video walkthroughs, exterior fly-throughs, and interactive 360-degree panoramic virtual tours of building and infrastructure BIM assets.',
    r_walkthrough_images: [
      { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', alt: 'Photorealistic 3D Architectural Exterior VR Walkthrough', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'High-Definition Interior Architectural Fly-Through Animation', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', alt: '360 Panoramic Virtual Reality (VR) BIM Tour Render', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', alt: 'Commercial Atrium Day & Night Lighting Walkthrough', display_order: 4 }
    ],
    report_main_title: 'REPORTING',
    report_main_desc: 'Automated BIM coordination reports, clash detection audits, LOD verification summaries, and periodic progress documentation.',
    rep_periodic_title: 'PERIODICALLY',
    rep_periodic_desc: 'Regular weekly and monthly BIM audit reporting, issue tracking dashboards, model compliance checks, and CDE data handover reports.',
    rep_periodic_images: [
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Weekly Navisworks Clash Detection Summary Audit Report', display_order: 1 },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', alt: 'Monthly BIM Model Compliance & Quality Control Report', display_order: 2 },
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', alt: 'Periodic Multi-Disciplinary Coordination Dashboard', display_order: 3 },
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', alt: 'CDE Common Data Environment Progress & Issue Audit', display_order: 4 }
    ]
  }
};

async function initDB() {
  try {
    // Try connecting to MySQL without database first
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    await connection.end();

    // Now create pool with database
    pool = mysql.createPool(dbConfig);

    // 1. Users Table (Access Control)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure superadmin account exists and has password bluecrescentmccmrfip
    const superAdminHashed = hashPassword('bluecrescentmccmrfip');
    await pool.query(`
      INSERT INTO users (username, password, role)
      VALUES ('superadmin', ?, 'super_admin')
      ON DUPLICATE KEY UPDATE password = VALUES(password), role = 'super_admin';
    `, [superAdminHashed]);

    // 2. Testimonials Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author_name VARCHAR(255) NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Drop News Table (Removed feature)
    await pool.query(`DROP TABLE IF EXISTS news;`);

    // 4. Certificates Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        org VARCHAR(255) NOT NULL,
        licenseNo VARCHAR(255) NOT NULL,
        territory VARCHAR(255) NOT NULL,
        validity VARCHAR(255) NOT NULL,
        borderColor VARCHAR(100) DEFAULT 'border-blue',
        badgeText VARCHAR(100) DEFAULT 'CERTIFIED',
        image LONGTEXT NOT NULL,
        scope TEXT NOT NULL,
        cert_category VARCHAR(100) DEFAULT 'Authority Certificates',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    try { await pool.query(`ALTER TABLE certificates ADD COLUMN cert_category VARCHAR(100) DEFAULT 'Authority Certificates';`); } catch (e) {}

    // 5. Menus Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS menus (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        url VARCHAR(255) NOT NULL,
        parent_id INT DEFAULT NULL,
        order_num INT DEFAULT 0
      );
    `);

    // 6. Footer Settings Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS footer_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        brand_desc TEXT,
        facebook_url VARCHAR(255),
        instagram_url VARCHAR(255),
        address TEXT,
        phone VARCHAR(100),
        fax VARCHAR(100),
        email VARCHAR(100),
        website VARCHAR(100),
        copyright VARCHAR(255)
      );
    `);

    // 7a. Service Categories Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS service_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        short_description TEXT,
        icon VARCHAR(100),
        display_order INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Active',
        featured TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // 7b. Services Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255),
        description TEXT,
        bullets TEXT, -- JSON Array
        tools TEXT, -- JSON Array
        banner_image LONGTEXT,
        display_order INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Active',
        featured TINYINT(1) DEFAULT 1,
        seo_title VARCHAR(255),
        seo_description TEXT,
        seo_keywords TEXT
      );
    `);

    try { await pool.query(`ALTER TABLE services ADD COLUMN IF NOT EXISTS slug VARCHAR(255);`); } catch (e) { }
    try { await pool.query(`ALTER TABLE services ADD COLUMN slug VARCHAR(255);`); } catch (e) { }
    try { await pool.query(`ALTER TABLE services ADD COLUMN display_order INT DEFAULT 0;`); } catch (e) { }
    try { await pool.query(`ALTER TABLE services ADD COLUMN status VARCHAR(50) DEFAULT 'Active';`); } catch (e) { }
    try { await pool.query(`ALTER TABLE services ADD COLUMN featured TINYINT(1) DEFAULT 1;`); } catch (e) { }
    try { await pool.query(`ALTER TABLE services ADD COLUMN seo_title VARCHAR(255);`); } catch (e) { }
    try { await pool.query(`ALTER TABLE services ADD COLUMN seo_description TEXT;`); } catch (e) { }
    try { await pool.query(`ALTER TABLE services ADD COLUMN seo_keywords TEXT;`); } catch (e) { }

    // 8. Hero Slides Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hero_slides (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        btn1_text VARCHAR(100),
        btn2_text VARCHAR(100),
        image LONGTEXT,
        status VARCHAR(50) DEFAULT 'published',
        order_num INT DEFAULT 0
      );
    `);

    // 9. Subscribers Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 10. Projects Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255),
        division_type VARCHAR(100) NOT NULL DEFAULT 'Engineering Services',
        project_count INT DEFAULT 0,
        client VARCHAR(255),
        contractor VARCHAR(255),
        consultant VARCHAR(255),
        location VARCHAR(255) DEFAULT 'Qatar',
        sector VARCHAR(255) DEFAULT 'Infrastructure & Buildings',
        status VARCHAR(50) DEFAULT 'Completed',
        year VARCHAR(50) DEFAULT '2024',
        short_description TEXT,
        description LONGTEXT,
        services LONGTEXT,
        disciplines LONGTEXT,
        project_stage VARCHAR(100),
        bim_level VARCHAR(100),
        scope_of_work LONGTEXT,
        deliverables LONGTEXT,
        technologies LONGTEXT,
        project_highlights TEXT,
        image LONGTEXT,
        gallery LONGTEXT,
        display_order INT DEFAULT 0,
        seo_title VARCHAR(255),
        seo_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // 11. Contact Submissions Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 11b. GSAS Content Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gsas_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_title VARCHAR(255) DEFAULT 'GSAS',
        introduction TEXT,
        design_title VARCHAR(255) DEFAULT 'DESIGN',
        design_description TEXT,
        design_images LONGTEXT,
        build_title VARCHAR(255) DEFAULT 'BUILD / CONSTRUCTION',
        build_description TEXT,
        build_images LONGTEXT,
        operation_title VARCHAR(255) DEFAULT 'OPERATION',
        operation_description TEXT,
        operation_images LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Seed default GSAS content if empty
    const [gsasRows] = await pool.query('SELECT id FROM gsas_content LIMIT 1');
    if (gsasRows.length === 0) {
      const fbGsas = fallbackData.gsas_content;
      await pool.query(`
        INSERT INTO gsas_content (
          page_title, introduction,
          design_title, design_description, design_images,
          build_title, build_description, build_images,
          operation_title, operation_description, operation_images
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        fbGsas.page_title, fbGsas.introduction,
        fbGsas.design_title, fbGsas.design_description, JSON.stringify(fbGsas.design_images),
        fbGsas.build_title, fbGsas.build_description, JSON.stringify(fbGsas.build_images),
        fbGsas.operation_title, fbGsas.operation_description, JSON.stringify(fbGsas.operation_images)
      ]);
    }

    // 11c. LEED Content Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leed_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_title VARCHAR(255) DEFAULT 'LEED',
        introduction TEXT,
        design_title VARCHAR(255) DEFAULT 'DESIGN',
        design_description TEXT,
        design_images LONGTEXT,
        build_title VARCHAR(255) DEFAULT 'BUILD / CONSTRUCTION',
        build_description TEXT,
        build_images LONGTEXT,
        operation_title VARCHAR(255) DEFAULT 'OPERATION',
        operation_description TEXT,
        operation_images LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Seed default LEED content if empty
    const [leedRows] = await pool.query('SELECT id FROM leed_content LIMIT 1');
    if (leedRows.length === 0) {
      const fbLeed = fallbackData.leed_content;
      await pool.query(`
        INSERT INTO leed_content (
          page_title, introduction,
          design_title, design_description, design_images,
          build_title, build_description, build_images,
          operation_title, operation_description, operation_images
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        fbLeed.page_title, fbLeed.introduction,
        fbLeed.design_title, fbLeed.design_description, JSON.stringify(fbLeed.design_images),
        fbLeed.build_title, fbLeed.build_description, JSON.stringify(fbLeed.build_images),
        fbLeed.operation_title, fbLeed.operation_description, JSON.stringify(fbLeed.operation_images)
      ]);
    }

    // 11d. Energy Audit Content Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS energy_audit_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_title VARCHAR(255) DEFAULT 'Energy Audit',
        introduction TEXT,
        residential_title VARCHAR(255) DEFAULT 'RESIDENTIAL BUILDING',
        residential_description TEXT,
        residential_images LONGTEXT,
        commercial_title VARCHAR(255) DEFAULT 'COMMERCIAL BUILDING',
        commercial_description TEXT,
        commercial_images LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Seed default Energy Audit content if empty
    const [auditRows] = await pool.query('SELECT id FROM energy_audit_content LIMIT 1');
    if (auditRows.length === 0) {
      const fbAudit = fallbackData.energy_audit_content;
      await pool.query(`
        INSERT INTO energy_audit_content (
          page_title, introduction,
          residential_title, residential_description, residential_images,
          commercial_title, commercial_description, commercial_images
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        fbAudit.page_title, fbAudit.introduction,
        fbAudit.residential_title, fbAudit.residential_description, JSON.stringify(fbAudit.residential_images),
        fbAudit.commercial_title, fbAudit.commercial_description, JSON.stringify(fbAudit.commercial_images)
      ]);
    }

    // 11e. Environmental Content Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS environmental_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_title VARCHAR(255) DEFAULT 'ENVIRONMENTAL',
        introduction TEXT,
        noise_title VARCHAR(255) DEFAULT 'NOISE MONITORING',
        noise_description TEXT,
        noise_images LONGTEXT,
        carbon_title VARCHAR(255) DEFAULT 'CARBON MANAGEMENT',
        carbon_description TEXT,
        carbon_images LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Seed default Environmental content if empty
    const [envRows] = await pool.query('SELECT id FROM environmental_content LIMIT 1');
    if (envRows.length === 0) {
      const fbEnv = fallbackData.environmental_content;
      await pool.query(`
        INSERT INTO environmental_content (
          page_title, introduction,
          noise_title, noise_description, noise_images,
          carbon_title, carbon_description, carbon_images
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        fbEnv.page_title, fbEnv.introduction,
        fbEnv.noise_title, fbEnv.noise_description, JSON.stringify(fbEnv.noise_images),
        fbEnv.carbon_title, fbEnv.carbon_description, JSON.stringify(fbEnv.carbon_images)
      ]);
    }

    // 11f. Laser Scanning Content Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS laser_scanning_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_title VARCHAR(255) DEFAULT 'LASER SCANNING SERVICES',
        introduction TEXT,
        building_title VARCHAR(255) DEFAULT 'BUILDING',
        building_description TEXT,
        building_images LONGTEXT,
        infrastructure_title VARCHAR(255) DEFAULT 'INFRASTRUCTURE',
        infrastructure_description TEXT,
        infrastructure_images LONGTEXT,
        recap_title VARCHAR(255) DEFAULT 'RECAP WORK',
        recap_description TEXT,
        recap_images LONGTEXT,
        scan_to_bim_title VARCHAR(255) DEFAULT 'SCAN TO BIM',
        scan_to_bim_description TEXT,
        scan_to_bim_images LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Seed default Laser Scanning content if empty
    const [laserRows] = await pool.query('SELECT id FROM laser_scanning_content LIMIT 1');
    if (laserRows.length === 0) {
      const fbLaser = fallbackData.laser_scanning_content;
      await pool.query(`
        INSERT INTO laser_scanning_content (
          page_title, introduction,
          building_title, building_description, building_images,
          infrastructure_title, infrastructure_description, infrastructure_images,
          recap_title, recap_description, recap_images,
          scan_to_bim_title, scan_to_bim_description, scan_to_bim_images
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        fbLaser.page_title, fbLaser.introduction,
        fbLaser.building_title, fbLaser.building_description, JSON.stringify(fbLaser.building_images),
        fbLaser.infrastructure_title, fbLaser.infrastructure_description, JSON.stringify(fbLaser.infrastructure_images),
        fbLaser.recap_title, fbLaser.recap_description, JSON.stringify(fbLaser.recap_images),
        fbLaser.scan_to_bim_title, fbLaser.scan_to_bim_description, JSON.stringify(fbLaser.scan_to_bim_images)
      ]);
    }

    // 11g. CAD Content Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cad_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_title VARCHAR(255) DEFAULT 'CAD',
        introduction TEXT,
        arch_title VARCHAR(255) DEFAULT 'ARCHITECTURE',
        arch_description TEXT,
        arch_images LONGTEXT,
        struct_title VARCHAR(255) DEFAULT 'STRUCTURE',
        struct_description TEXT,
        struct_images LONGTEXT,
        interior_title VARCHAR(255) DEFAULT 'INTERIOR',
        interior_description TEXT,
        interior_images LONGTEXT,
        mech_title VARCHAR(255) DEFAULT 'MECHANICAL',
        mech_description TEXT,
        mech_images LONGTEXT,
        elec_title VARCHAR(255) DEFAULT 'ELECTRICAL',
        elec_description TEXT,
        elec_images LONGTEXT,
        landscape_title VARCHAR(255) DEFAULT 'LANDSCAPING',
        landscape_description TEXT,
        landscape_images LONGTEXT,
        road_title VARCHAR(255) DEFAULT 'ROAD',
        road_description TEXT,
        road_images LONGTEXT,
        street_light_title VARCHAR(255) DEFAULT 'STREET LIGHT',
        street_light_description TEXT,
        street_light_images LONGTEXT,
        util_title VARCHAR(255) DEFAULT 'UNDERGROUND UTILITIES',
        util_description TEXT,
        util_images LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Seed default CAD content if empty
    const [cadRows] = await pool.query('SELECT id FROM cad_content LIMIT 1');
    if (cadRows.length === 0) {
      const fbCad = fallbackData.cad_content;
      await pool.query(`
        INSERT INTO cad_content (
          page_title, introduction,
          arch_title, arch_description, arch_images,
          struct_title, struct_description, struct_images,
          interior_title, interior_description, interior_images,
          mech_title, mech_description, mech_images,
          elec_title, elec_description, elec_images,
          landscape_title, landscape_description, landscape_images,
          road_title, road_description, road_images,
          street_light_title, street_light_description, street_light_images,
          util_title, util_description, util_images
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        fbCad.page_title, fbCad.introduction,
        fbCad.arch_title, fbCad.arch_description, JSON.stringify(fbCad.arch_images),
        fbCad.struct_title, fbCad.struct_description, JSON.stringify(fbCad.struct_images),
        fbCad.interior_title, fbCad.interior_description, JSON.stringify(fbCad.interior_images),
        fbCad.mech_title, fbCad.mech_description, JSON.stringify(fbCad.mech_images),
        fbCad.elec_title, fbCad.elec_description, JSON.stringify(fbCad.elec_images),
        fbCad.landscape_title, fbCad.landscape_description, JSON.stringify(fbCad.landscape_images),
        fbCad.road_title, fbCad.road_description, JSON.stringify(fbCad.road_images),
        fbCad.street_light_title, fbCad.street_light_description, JSON.stringify(fbCad.street_light_images),
        fbCad.util_title, fbCad.util_description, JSON.stringify(fbCad.util_images)
      ]);
    }

    // 11h. BIM Content Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bim_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_title VARCHAR(255) DEFAULT 'BIM',
        introduction TEXT,
        building_main_title VARCHAR(255) DEFAULT 'BUILDING',
        building_main_desc TEXT,
        b_arch_title VARCHAR(255) DEFAULT 'ARCHITECTURE',
        b_arch_desc TEXT,
        b_arch_images LONGTEXT,
        b_struct_title VARCHAR(255) DEFAULT 'STRUCTURE',
        b_struct_desc TEXT,
        b_struct_images LONGTEXT,
        b_interior_title VARCHAR(255) DEFAULT 'INTERIOR',
        b_interior_desc TEXT,
        b_interior_images LONGTEXT,
        b_mep_title VARCHAR(255) DEFAULT 'MECHANICAL ELECTRICAL',
        b_mep_desc TEXT,
        b_mep_images LONGTEXT,
        infra_main_title VARCHAR(255) DEFAULT 'INFRASTRUCTURE',
        infra_main_desc TEXT,
        i_landscape_title VARCHAR(255) DEFAULT 'LANDSCAPING',
        i_landscape_desc TEXT,
        i_landscape_images LONGTEXT,
        i_road_title VARCHAR(255) DEFAULT 'ROAD',
        i_road_desc TEXT,
        i_road_images LONGTEXT,
        i_street_light_title VARCHAR(255) DEFAULT 'STREET LIGHT',
        i_street_light_desc TEXT,
        i_street_light_images LONGTEXT,
        i_util_title VARCHAR(255) DEFAULT 'UNDERGROUND UTILITIES',
        i_util_desc TEXT,
        i_util_images LONGTEXT,
        fourd_main_title VARCHAR(255) DEFAULT '4D',
        fourd_main_desc TEXT,
        fourd_b_title VARCHAR(255) DEFAULT 'BUILDING',
        fourd_b_desc TEXT,
        fourd_b_images LONGTEXT,
        fourd_i_title VARCHAR(255) DEFAULT 'INFRASTRUCTURE',
        fourd_i_desc TEXT,
        fourd_i_images LONGTEXT,
        fived_main_title VARCHAR(255) DEFAULT '5D',
        fived_main_desc TEXT,
        fived_b_title VARCHAR(255) DEFAULT 'BUILDING',
        fived_b_desc TEXT,
        fived_b_images LONGTEXT,
        fived_i_title VARCHAR(255) DEFAULT 'INFRASTRUCTURE',
        fived_i_desc TEXT,
        fived_i_images LONGTEXT,
        render_main_title VARCHAR(255) DEFAULT 'RENDERING',
        render_main_desc TEXT,
        r_walkthrough_title VARCHAR(255) DEFAULT 'WALK THROUGH',
        r_walkthrough_desc TEXT,
        r_walkthrough_images LONGTEXT,
        report_main_title VARCHAR(255) DEFAULT 'REPORTING',
        report_main_desc TEXT,
        rep_periodic_title VARCHAR(255) DEFAULT 'PERIODICALLY',
        rep_periodic_desc TEXT,
        rep_periodic_images LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Seed default BIM content if empty
    const [bimRows] = await pool.query('SELECT id FROM bim_content LIMIT 1');
    if (bimRows.length === 0) {
      const fbBim = fallbackData.bim_content;
      await pool.query(`
        INSERT INTO bim_content (
          page_title, introduction,
          building_main_title, building_main_desc,
          b_arch_title, b_arch_desc, b_arch_images,
          b_struct_title, b_struct_desc, b_struct_images,
          b_interior_title, b_interior_desc, b_interior_images,
          b_mep_title, b_mep_desc, b_mep_images,
          infra_main_title, infra_main_desc,
          i_landscape_title, i_landscape_desc, i_landscape_images,
          i_road_title, i_road_desc, i_road_images,
          i_street_light_title, i_street_light_desc, i_street_light_images,
          i_util_title, i_util_desc, i_util_images,
          fourd_main_title, fourd_main_desc,
          fourd_b_title, fourd_b_desc, fourd_b_images,
          fourd_i_title, fourd_i_desc, fourd_i_images,
          fived_main_title, fived_main_desc,
          fived_b_title, fived_b_desc, fived_b_images,
          fived_i_title, fived_i_desc, fived_i_images,
          render_main_title, render_main_desc,
          r_walkthrough_title, r_walkthrough_desc, r_walkthrough_images,
          report_main_title, report_main_desc,
          rep_periodic_title, rep_periodic_desc, rep_periodic_images
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        fbBim.page_title, fbBim.introduction,
        fbBim.building_main_title, fbBim.building_main_desc,
        fbBim.b_arch_title, fbBim.b_arch_desc, JSON.stringify(fbBim.b_arch_images),
        fbBim.b_struct_title, fbBim.b_struct_desc, JSON.stringify(fbBim.b_struct_images),
        fbBim.b_interior_title, fbBim.b_interior_desc, JSON.stringify(fbBim.b_interior_images),
        fbBim.b_mep_title, fbBim.b_mep_desc, JSON.stringify(fbBim.b_mep_images),
        fbBim.infra_main_title, fbBim.infra_main_desc,
        fbBim.i_landscape_title, fbBim.i_landscape_desc, JSON.stringify(fbBim.i_landscape_images),
        fbBim.i_road_title, fbBim.i_road_desc, JSON.stringify(fbBim.i_road_images),
        fbBim.i_street_light_title, fbBim.i_street_light_desc, JSON.stringify(fbBim.i_street_light_images),
        fbBim.i_util_title, fbBim.i_util_desc, JSON.stringify(fbBim.i_util_images),
        fbBim.fourd_main_title, fbBim.fourd_main_desc,
        fbBim.fourd_b_title, fbBim.fourd_b_desc, JSON.stringify(fbBim.fourd_b_images),
        fbBim.fourd_i_title, fbBim.fourd_i_desc, JSON.stringify(fbBim.fourd_i_images),
        fbBim.fived_main_title, fbBim.fived_main_desc,
        fbBim.fived_b_title, fbBim.fived_b_desc, JSON.stringify(fbBim.fived_b_images),
        fbBim.fived_i_title, fbBim.fived_i_desc, JSON.stringify(fbBim.fived_i_images),
        fbBim.render_main_title, fbBim.render_main_desc,
        fbBim.r_walkthrough_title, fbBim.r_walkthrough_desc, JSON.stringify(fbBim.r_walkthrough_images),
        fbBim.report_main_title, fbBim.report_main_desc,
        fbBim.rep_periodic_title, fbBim.rep_periodic_desc, JSON.stringify(fbBim.rep_periodic_images)
      ]);
    }

    // 12. Company Settings Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS company_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        siteTitle VARCHAR(255),
        tagline VARCHAR(255),
        legalName VARCHAR(255),
        yearEstablished VARCHAR(100),
        copyrightText VARCHAR(255),
        whoWeArePara1 TEXT,
        whoWeArePara2 TEXT,
        whoWeArePara3 TEXT,
        whoWeArePara4 TEXT,
        mission TEXT,
        vision TEXT,
        qaqc TEXT,
        hse TEXT,
        whyIntro1 TEXT,
        whyIntro2 TEXT,
        whyIntro3 TEXT,
        whyIntro4 TEXT,
        value1Title VARCHAR(255),
        value1Desc TEXT,
        value2Title VARCHAR(255),
        value2Desc TEXT,
        value3Title VARCHAR(255),
        value3Desc TEXT,
        value4Title VARCHAR(255),
        value4Desc TEXT,
        value5Title VARCHAR(255),
        value5Desc TEXT,
        aboutUsVideoUrl LONGTEXT,
        aboutUsHeroType VARCHAR(50),
        aboutUsHeroUrl LONGTEXT,
        aboutUsMapImg LONGTEXT,
        aboutUsCapaImg LONGTEXT,
        aboutUsDigitalImg LONGTEXT,
        aboutUsFlowchartBg VARCHAR(50) DEFAULT '#F1F7FF',
        aboutUsCountriesJson LONGTEXT,
        aboutUsDisciplinesJson LONGTEXT,
        aboutUsFlowchartJson LONGTEXT,
        aboutUsCapabilitiesJson LONGTEXT,
        sustainabilityTitle VARCHAR(255),
        sustainabilitySubHeading VARCHAR(255),
        sustainabilityLeadDesc TEXT,
        sustainabilitySupportingDesc TEXT,
        sustainabilityImage LONGTEXT,
        sustainabilityBadgeTitle VARCHAR(255),
        sustainabilityBadgeSubtitle VARCHAR(255),
        sustainabilityCapabilitiesJson LONGTEXT,
        remoteTitle VARCHAR(255),
        remoteDesc TEXT,
        remoteImage LONGTEXT,
        remoteOverlayText VARCHAR(255),
        remotePillarsJson LONGTEXT
      );
    `);

    // Migrations for company_settings - add missing columns safely
    const colsToAdd = [
      ['sustainabilityTitle', 'VARCHAR(255)'],
      ['sustainabilitySubHeading', 'VARCHAR(255)'],
      ['sustainabilityLeadDesc', 'TEXT'],
      ['sustainabilitySupportingDesc', 'TEXT'],
      ['sustainabilityImage', 'LONGTEXT'],
      ['sustainabilityBadgeTitle', 'VARCHAR(255)'],
      ['sustainabilityBadgeSubtitle', 'VARCHAR(255)'],
      ['sustainabilityCapabilitiesJson', 'LONGTEXT'],
      ['remoteTitle', 'VARCHAR(255)'],
      ['remoteDesc', 'TEXT'],
      ['remoteImage', 'LONGTEXT'],
      ['remoteOverlayText', 'VARCHAR(255)'],
      ['remotePillarsJson', 'LONGTEXT'],
      ['aboutUsCountriesJson', 'LONGTEXT'],
      ['aboutUsDisciplinesJson', 'LONGTEXT'],
      ['aboutUsFlowchartJson', 'LONGTEXT'],
      ['aboutUsCapabilitiesJson', 'LONGTEXT'],
      ['aboutUsFlowchartBg', "VARCHAR(50) DEFAULT '#F1F7FF'"]
    ];

    for (const [colName, colType] of colsToAdd) {
      try {
        const [chk] = await pool.query(`
          SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'company_settings' AND COLUMN_NAME = ?
        `, [colName]);
        if (chk.length === 0) {
          await pool.query(`ALTER TABLE company_settings ADD COLUMN \`${colName}\` ${colType}`);
        }
      } catch (e) {
        // Fallback standard alter table
        try { await pool.query(`ALTER TABLE company_settings ADD COLUMN \`${colName}\` ${colType}`); } catch (err) {}
      }
    }

    // 13. Contact Settings Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        companyName VARCHAR(255),
        addressLine1 TEXT,
        city VARCHAR(100),
        country VARCHAR(100),
        poBox VARCHAR(50),
        phone VARCHAR(100),
        fax VARCHAR(100),
        email VARCHAR(100),
        website VARCHAR(100),
        googleMapsUrl TEXT,
        businessHoursMon VARCHAR(255),
        businessHoursFri VARCHAR(255),
        businessHoursSat VARCHAR(255)
      );
    `);

    // 14. Partners Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS partners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL DEFAULT 'Working Partner',
        image LONGTEXT,
        order_num INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 15. Media Items Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS media_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50) NOT NULL, -- 'gallery' or 'video'
        category VARCHAR(100) DEFAULT 'Our Work',
        title VARCHAR(255) NOT NULL,
        url LONGTEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    try { await pool.query(`ALTER TABLE media_items ADD COLUMN category VARCHAR(100) DEFAULT 'Our Work';`); } catch (e) {}

    // 16. Blogs Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE,
        category VARCHAR(100) DEFAULT 'Company News',
        author VARCHAR(100) DEFAULT 'Blue Crescent Team',
        date VARCHAR(100),
        image LONGTEXT,
        summary TEXT,
        short_description TEXT,
        content LONGTEXT,
        status VARCHAR(20) DEFAULT 'Published',
        is_active TINYINT(1) DEFAULT 1,
        display_order INT DEFAULT 0,
        seo_title VARCHAR(255),
        seo_description TEXT,
        seo_keywords TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    try {
      const blogCols = [
        { name: 'slug', type: 'VARCHAR(255)' },
        { name: 'short_description', type: 'TEXT' },
        { name: 'author', type: "VARCHAR(100) DEFAULT 'Blue Crescent Team'" },
        { name: 'date', type: 'VARCHAR(100)' },
        { name: 'status', type: "VARCHAR(20) DEFAULT 'Published'" },
        { name: 'is_active', type: 'TINYINT(1) DEFAULT 1' },
        { name: 'display_order', type: 'INT DEFAULT 0' },
        { name: 'seo_title', type: 'VARCHAR(255)' },
        { name: 'seo_description', type: 'TEXT' },
        { name: 'seo_keywords', type: 'TEXT' }
      ];
      for (const col of blogCols) {
        try {
          await pool.query(`SELECT ${col.name} FROM blogs LIMIT 1`);
        } catch (e) {
          await pool.query(`ALTER TABLE blogs ADD COLUMN ${col.name} ${col.type}`);
        }
      }
    } catch (err) {
      console.warn('Altering blogs table columns warning:', err.message);
    }

    // 17. System Settings Table (Maintenance Mode Source of Truth)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        maintenance_mode TINYINT(1) DEFAULT 0,
        maintenance_title VARCHAR(255) DEFAULT 'WEBSITE UNDER MAINTENANCE',
        maintenance_message TEXT,
        updated_by VARCHAR(255) DEFAULT 'Super Admin',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        maintenance_started_at TIMESTAMP NULL DEFAULT NULL,
        maintenance_ended_at TIMESTAMP NULL DEFAULT NULL
      );
    `);

    // 18. Activity Logs Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        action VARCHAR(255) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default system_settings record if empty (Default: maintenance_mode = 0 / Website Live)
    const [sysSettingsCount] = await pool.query('SELECT COUNT(*) as count FROM system_settings');
    if (sysSettingsCount[0].count === 0) {
      console.log('Seeding default system settings (Maintenance Mode OFF)...');
      await pool.query(`
        INSERT INTO system_settings (maintenance_mode, maintenance_title, maintenance_message, updated_by)
        VALUES (0, 'WEBSITE UNDER MAINTENANCE', 'We are currently performing scheduled maintenance to improve our website and digital services.\\nThank you for your patience.\\nWe will be back online shortly.', 'Super Admin')
      `);
    }


    // Seed default partners if empty
    const [partnerCountRows] = await pool.query('SELECT COUNT(*) as count FROM partners');
    if (partnerCountRows[0].count === 0) {
      console.log('Seeding default partners...');
      await pool.query(`
        INSERT INTO partners (name, role, image, order_num) VALUES
        ('TEKNIK Group',         'Engineering Partner',     '/partner_teknik.png',    1),
        ('ARCANA Build',         'Construction Partner',    '/partner_arcana.png',    2),
        ('NEXAGEN Solutions',    'Sustainability Partner',  '/partner_nexagen.png',   3),
        ('QAFrame Technologies', 'BIM Partner',            '/partner_qaframe.png',   4),
        ('MERIDIAN MEP',         'MEP Partner',            '/partner_meridian.png',  5),
        ('VISTARA Infrastructure','Infrastructure Partner', '/partner_vistara.png',   6)
      `);
    }

    // 14b. Major Clients Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS major_clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo LONGTEXT NOT NULL,
        display_order INT DEFAULT 0,
        status VARCHAR(20) DEFAULT 'Active',
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    const [clientCountRows] = await pool.query('SELECT COUNT(*) as count FROM major_clients');
    if (clientCountRows[0].count === 0) {
      console.log('Seeding default major clients...');
      await pool.query(`
        INSERT INTO major_clients (name, logo, display_order, status, is_active) VALUES
        ('Qatar Free Zones Authority',     '/partner_teknik.png',    1, 'Active', 1),
        ('Lusail Real Estate Development', '/partner_arcana.png',    2, 'Active', 1),
        ('Qatari Diar',                    '/partner_nexagen.png',   3, 'Active', 1),
        ('Ashghal Public Works Authority', '/partner_qaframe.png',   4, 'Active', 1),
        ('Qatar Airways Group',            '/partner_meridian.png',  5, 'Active', 1),
        ('KAHRAMAA Qatar',                 '/partner_vistara.png',   6, 'Active', 1)
      `);
    }

    // 16. Team Members Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS team_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL DEFAULT 'Team Member',
        image LONGTEXT,
        department VARCHAR(255) DEFAULT '',
        order_num INT DEFAULT 0,
        hierarchy_number INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default team members if empty
    const [teamCountRows] = await pool.query('SELECT COUNT(*) as count FROM team_members');
    if (teamCountRows[0].count === 0) {
      console.log('Seeding default team members...');
      await pool.query(`
        INSERT INTO team_members (name, role, image, department, order_num, hierarchy_number) VALUES
        ('Praveen',   'Team Member',               '/team_praveen.png',   'Engineering', 1, 1),
        ('Nancy',     'Team Member',               '/team_nancy.png',     'BIM & CAD',   2, 2),
        ('Raghul',    'Team Member',               '/team_raghul.png',    'Digital Twin', 3, 3),
        ('Zubariya',  'Team Member',               '/team_zubariya.png',  'Sustainability', 4, 4),
        ('Mohammed',  'BIM Specialist',            null,                  'BIM & CAD',   5, 5),
        ('Ananya',    'CAD Engineer',              null,                  'Engineering', 6, 6),
        ('Karthik',   'Project Lead',              null,                  'Management',  7, 7),
        ('Divya',     'Sustainability Specialist', null,                  'Sustainability', 8, 8)
      `);
    }

    // Migration for team_members hierarchy_number
    try {
      await pool.query("SELECT hierarchy_number FROM team_members LIMIT 1");
    } catch (e) {
      console.log('Adding hierarchy_number column to team_members...');
      await pool.query("ALTER TABLE team_members ADD COLUMN hierarchy_number INT DEFAULT 0");
      await pool.query("UPDATE team_members SET hierarchy_number = order_num WHERE hierarchy_number = 0 OR hierarchy_number IS NULL");
    }


    // Migrations: Alter tables if columns are missing
    try {
      console.log('Altering company_settings columns to LONGTEXT...');
      await pool.query("ALTER TABLE company_settings MODIFY COLUMN aboutUsHeroUrl LONGTEXT");
      await pool.query("ALTER TABLE company_settings MODIFY COLUMN aboutUsVideoUrl LONGTEXT");

      // Dynamic columns for new customizable backgrounds
      try {
        await pool.query("SELECT aboutUsMapImg FROM company_settings LIMIT 1");
      } catch (e) {
        console.log('Adding aboutUsMapImg column to company_settings...');
        await pool.query("ALTER TABLE company_settings ADD COLUMN aboutUsMapImg LONGTEXT");
      }

      try {
        await pool.query("SELECT aboutUsCapaImg FROM company_settings LIMIT 1");
      } catch (e) {
        console.log('Adding aboutUsCapaImg column to company_settings...');
        await pool.query("ALTER TABLE company_settings ADD COLUMN aboutUsCapaImg LONGTEXT");
      }

      try {
        await pool.query("SELECT aboutUsDigitalImg FROM company_settings LIMIT 1");
      } catch (e) {
        console.log('Adding aboutUsDigitalImg column to company_settings...');
        await pool.query("ALTER TABLE company_settings ADD COLUMN aboutUsDigitalImg LONGTEXT");
      }

      try {
        await pool.query("SELECT aboutUsFlowchartBg FROM company_settings LIMIT 1");
      } catch (e) {
        console.log('Adding aboutUsFlowchartBg column to company_settings...');
        await pool.query("ALTER TABLE company_settings ADD COLUMN aboutUsFlowchartBg VARCHAR(50) DEFAULT '#F1F7FF'");
      }

      // Add columns for CRUD lists stored as JSON
      try {
        await pool.query("SELECT aboutUsCountriesJson FROM company_settings LIMIT 1");
      } catch (e) {
        console.log('Adding aboutUsCountriesJson column to company_settings...');
        await pool.query("ALTER TABLE company_settings ADD COLUMN aboutUsCountriesJson LONGTEXT");
      }

      try {
        await pool.query("SELECT aboutUsDisciplinesJson FROM company_settings LIMIT 1");
      } catch (e) {
        console.log('Adding aboutUsDisciplinesJson column to company_settings...');
        await pool.query("ALTER TABLE company_settings ADD COLUMN aboutUsDisciplinesJson LONGTEXT");
      }

      try {
        await pool.query("SELECT aboutUsFlowchartJson FROM company_settings LIMIT 1");
      } catch (e) {
        console.log('Adding aboutUsFlowchartJson column to company_settings...');
        await pool.query("ALTER TABLE company_settings ADD COLUMN aboutUsFlowchartJson LONGTEXT");
      }

      try {
        await pool.query("SELECT aboutUsCapabilitiesJson FROM company_settings LIMIT 1");
      } catch (e) {
        console.log('Adding aboutUsCapabilitiesJson column to company_settings...');
        await pool.query("ALTER TABLE company_settings ADD COLUMN aboutUsCapabilitiesJson LONGTEXT");
      }

      // Projects table column expansion migration
      const projCols = [
        { name: 'slug', type: 'VARCHAR(255)' },
        { name: 'client', type: 'VARCHAR(255)' },
        { name: 'contractor', type: 'VARCHAR(255)' },
        { name: 'consultant', type: 'VARCHAR(255)' },
        { name: 'location', type: "VARCHAR(255) DEFAULT 'Qatar'" },
        { name: 'sector', type: "VARCHAR(255) DEFAULT 'Infrastructure & Buildings'" },
        { name: 'year', type: "VARCHAR(50) DEFAULT '2024'" },
        { name: 'short_description', type: 'TEXT' },
        { name: 'services', type: 'LONGTEXT' },
        { name: 'disciplines', type: 'LONGTEXT' },
        { name: 'project_stage', type: 'VARCHAR(100)' },
        { name: 'bim_level', type: 'VARCHAR(100)' },
        { name: 'scope_of_work', type: 'LONGTEXT' },
        { name: 'deliverables', type: 'LONGTEXT' },
        { name: 'technologies', type: 'LONGTEXT' },
        { name: 'project_highlights', type: 'TEXT' },
        { name: 'gallery', type: 'LONGTEXT' },
        { name: 'display_order', type: 'INT DEFAULT 0' },
        { name: 'seo_title', type: 'VARCHAR(255)' },
        { name: 'seo_description', type: 'TEXT' }
      ];

      for (const col of projCols) {
        try {
          await pool.query(`SELECT ${col.name} FROM projects LIMIT 1`);
        } catch (e) {
          console.log(`Adding ${col.name} column to projects...`);
          await pool.query(`ALTER TABLE projects ADD COLUMN ${col.name} ${col.type}`);
        }
      }
    } catch (err) {
      console.warn('Altering table columns warning:', err.message);
    }

    try {
      await pool.query("SELECT status FROM testimonials LIMIT 1");
    } catch (err) {
      console.log('Adding status to testimonials table...');
      await pool.query("ALTER TABLE testimonials ADD COLUMN status VARCHAR(50) DEFAULT 'pending'");
    }



    // Seed Certificates
    const [cRows] = await pool.query('SELECT COUNT(*) as count FROM certificates');
    if (cRows[0].count === 0) {
      console.log('Seeding certificates...');
      await pool.query(`
        INSERT INTO certificates (title, org, licenseNo, territory, validity, borderColor, badgeText, image, scope, cert_category) VALUES 
        ('ISO 9001:2015 Quality Management System', 'BQSR Quality Assurance Pvt. Ltd. (Accredited by IAS & IAF)', 'Cert No. 10487', 'International / Qatar', 'Valid & Recognized', 'border-gold', 'ISO 9001:2015 CERTIFIED', '/certificate IAF.png', 'Providing Engineering Design Work & GSAS Consultancy Services adhering to international quality control standards.', 'Authority Certificates'),
        ('GSAS Design & Build Service Provider', 'Gulf Organisation for Research & Development (GORD) & GSAS', 'SPD-QA109-00109', 'Qatar', 'Valid & Recognized', 'border-green', 'GSAS CERTIFIED', '/certificate GSAG.png', 'Type I - Building Typologies License covering Commercial, Offices, Residential, Education, Mosques, Hospitality, Homes, Light Industry, Parks, Interiors & Renovations.', 'Authority Certificates'),
        ('GSAS Building Sustainability Completion Certificate', 'Gulf Organisation for Research & Development (GORD)', 'GSAS-COMP-2025-01', 'Qatar', 'Verified Completion', 'border-green', 'COMPLETION CERTIFICATE', '/certificate GSAG.png', 'Official completion & compliance verification for sustainable building design and construction handover.', 'Completion Certificates'),
        ('BIM Project Execution & LOD 500 Completion Certificate', 'Blue Crescent Engineering & Building Authorities', 'BIM-LOD500-2025-02', 'Qatar & GCC', 'Verified Completion', 'border-blue', 'COMPLETION CERTIFICATE', '/bimmodel.png', 'LOD 500 As-Built BIM model verification, multidisciplinary clash detection, and asset handover completion.', 'Completion Certificates'),
        ('3D Laser Scanning & Scan-to-BIM Completion Certificate', 'Faro & Leica Reality Capture Standards', 'LS-3D-2025-03', 'Qatar', 'Verified Completion', 'border-blue', 'COMPLETION CERTIFICATE', '/servicepage1.png', 'High-precision 3D point cloud capture, dimensional verification, and as-built scan-to-BIM model delivery.', 'Completion Certificates'),
        ('Digital Twin Infrastructure Handover Completion Certificate', 'Blue Crescent Digital Transformation Division', 'DT-HANDOVER-2025-04', 'Qatar & GCC', 'Verified Completion', 'border-cyan', 'COMPLETION CERTIFICATE', '/why.png', 'Operational digital twin integration connecting BIM spatial models with real-time IoT facility management systems.', 'Completion Certificates')
      `);
    }

    // Seed Menus
    const [menuRows] = await pool.query('SELECT COUNT(*) as count FROM menus');
    if (menuRows[0].count === 0) {
      console.log('Seeding menus...');
      const [r1] = await pool.query("INSERT INTO menus (name, url, order_num) VALUES ('Home', 'Home', 1)");
      const [r2] = await pool.query("INSERT INTO menus (name, url, order_num) VALUES ('About Us', 'About Us', 2)");
      const [r3] = await pool.query("INSERT INTO menus (name, url, order_num) VALUES ('Services', 'Services', 3)");
      const [r4] = await pool.query("INSERT INTO menus (name, url, order_num) VALUES ('Projects', 'Projects', 4)");
      const [r5] = await pool.query("INSERT INTO menus (name, url, order_num) VALUES ('Media', 'Media', 5)");
      const [r6] = await pool.query("INSERT INTO menus (name, url, order_num) VALUES ('Contact Us', 'Contact Us', 6)");

      const projectsId = r4.insertId;
      await pool.query("INSERT INTO menus (name, url, parent_id, order_num) VALUES ('BIM Projects', 'BIM Projects', ?, 1)", [projectsId]);
      await pool.query("INSERT INTO menus (name, url, parent_id, order_num) VALUES ('CAD Projects', 'CAD Projects', ?, 2)", [projectsId]);
      await pool.query("INSERT INTO menus (name, url, parent_id, order_num) VALUES ('Laser Scanning Projects', 'Laser Scanning Projects', ?, 3)", [projectsId]);
      await pool.query("INSERT INTO menus (name, url, parent_id, order_num) VALUES ('Digital Twin Projects', 'Digital Twin Projects', ?, 4)", [projectsId]);
      await pool.query("INSERT INTO menus (name, url, parent_id, order_num) VALUES ('Sustainability Projects', 'Sustainability Projects', ?, 5)", [projectsId]);
    } else {
      // Dynamic migration for existing databases: ensure 'Media' exists
      const [hasMedia] = await pool.query("SELECT id FROM menus WHERE name = 'Media'");
      if (hasMedia.length === 0) {
        console.log('Migrating database: Adding Media menu item...');
        await pool.query("UPDATE menus SET order_num = 6 WHERE name = 'Contact Us'");
        await pool.query("INSERT INTO menus (name, url, order_num) VALUES ('Media', 'Media', 5)");
      }

      // Sync Projects sub-menus if missing
      const [projectsMenuRows] = await pool.query("SELECT id FROM menus WHERE LOWER(name) = 'projects'");
      if (projectsMenuRows.length > 0) {
        const pId = projectsMenuRows[0].id;
        const requiredProjectSubMenus = [
          { name: 'BIM Projects', url: 'BIM Projects', order_num: 1 },
          { name: 'CAD Projects', url: 'CAD Projects', order_num: 2 },
          { name: 'Laser Scanning Projects', url: 'Laser Scanning Projects', order_num: 3 },
          { name: 'Digital Twin Projects', url: 'Digital Twin Projects', order_num: 4 },
          { name: 'Sustainability Projects', url: 'Sustainability Projects', order_num: 5 }
        ];

        for (const sub of requiredProjectSubMenus) {
          const [exists] = await pool.query("SELECT id FROM menus WHERE parent_id = ? AND name = ?", [pId, sub.name]);
          if (exists.length === 0) {
            await pool.query("INSERT INTO menus (name, url, parent_id, order_num) VALUES (?, ?, ?, ?)", [sub.name, sub.url, pId, sub.order_num]);
          }
        }
      }
    }

    // Seed default media items (Gallery & Videos) if empty
    const [mediaCountRows] = await pool.query('SELECT COUNT(*) as count FROM media_items');
    if (mediaCountRows[0].count === 0) {
      console.log('Seeding default media items...');
      await pool.query(`
        INSERT INTO media_items (type, title, url) VALUES
        ('gallery', 'BIM Modelling Design Review', 'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=600&q=80'),
        ('gallery', 'MEP Infrastructure Coordination', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'),
        ('gallery', 'Sustainability Solar Site Survey', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&q=80'),
        ('gallery', 'Fiber Optic Telecom Installation', 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=600&q=80'),
        ('gallery', 'Acoustic Sound Simulation Analysis', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80'),
        ('gallery', 'GSAS Green Building Site Visit', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'),
        ('video', 'BIM Modelling & LOD 500 Virtual Tour', 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
        ('video', 'Sustainability & GSAS Green Design Methods', 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
        ('video', 'Telecom Network Rollout Showcase', 'https://www.youtube.com/embed/dQw4w9WgXcQ')
      `);
    }

    // Seed default blogs if empty
    const [blogsCountRows] = await pool.query('SELECT COUNT(*) as count FROM blogs');
    if (blogsCountRows[0].count === 0) {
      console.log('Seeding default blogs...');
      await pool.query(`
        INSERT INTO blogs (title, slug, category, author, date, image, summary, content, status, is_active, display_order) VALUES
        ('Blue Crescent Expands Multidisciplinary BIM & Digital Twin Services in Qatar', 'blue-crescent-expands-bim-digital-twin', 'Company News', 'Blue Crescent Editorial', 'August 2026', '/servicepage1.png', 'Blue Crescent Engineering announces the expansion of LOD 500 BIM modeling, 3D laser scanning, and real-time Digital Twin asset integrations across major Qatari infrastructure projects.', 'Full detailed blog article content regarding Blue Crescent Engineering expansion in Qatar...', 'Active', 1, 1),
        ('ISO 9001:2015 & GSAS Sustainability Accreditation Recertification', 'iso-9001-gsas-recertification', 'Announcement', 'Quality & Compliance Division', 'July 2026', '/why.png', 'Our engineering quality control management and GSAS green building consultancy frameworks have achieved renewed compliance certification.', 'Full detailed blog article content regarding ISO 9001:2015 and GSAS accreditation...', 'Active', 1, 2),
        ('Innovations in Remote Construction Management & Drone Site Inspections', 'innovations-remote-construction-drone-inspections', 'Engineering Blog', 'Technical Innovation Team', 'June 2026', '/project1.png', 'Discover how 360-degree site monitoring and cloud-based CAD/BIM collaboration are accelerating remote project deliveries.', 'Full detailed blog article content regarding drone site inspections and point cloud scans...', 'Active', 1, 3)
      `);
    }


    // Seed Footer
    const [footerRows] = await pool.query('SELECT COUNT(*) as count FROM footer_settings');
    if (footerRows[0].count === 0) {
      console.log('Seeding footer...');
      await pool.query(`
        INSERT INTO footer_settings (brand_desc, facebook_url, instagram_url, address, phone, fax, email, website, copyright) VALUES (
          'Delivering innovative engineering solutions with excellence, integrity and sustainability. Building a better future together.',
          'https://www.facebook.com/pages/Blue%20Crescent%20Engineering,%20Trading%20&%20Contracting/107539580965764/',
          '#',
          '9th Floor, Tower 3, Gate Mall, Doha, Qatar',
          '+974 4463 5250',
          '+974 4441 8567',
          'info@bluecrescent.com',
          'www.bluecrescentqatar.com',
          '© 2026 BLUE CRESCENT ENGINEERING. All Rights Reserved. A Solution for your Vision.'
        )
      `);
    }

    // Clean up legacy sub-service titles in MySQL database
    await pool.query(`
        UPDATE services SET status = 'Inactive' WHERE title IN (
          'Engineering Design support Services',
          'Specialised Simulation & Analysis',
          'Engineering (MEP, Infrastructure, Transportation) shop Drawings - 2D',
          'BIM Modelling - 3D',
          'Outsourcing Technical Experts',
          'GSAS Service',
          'LEED Consulting Services',
          'Energy Audit and Analysis',
          'ISO 14064 Consulting Services',
          '2D CAD Drafting Services',
          'BIM Services',
          'Life Cycle Twin Asset Management',
          'Remote Work Automation',
          'System Integration and Analysis'
        )
      `);

    // Ensure columns exist on service_categories
    try { await pool.query(`ALTER TABLE service_categories ADD COLUMN IF NOT EXISTS image LONGTEXT;`); } catch (e) { }
    try { await pool.query(`ALTER TABLE service_categories ADD COLUMN image LONGTEXT;`); } catch (e) { }

    // Ensure columns exist on services
    try { await pool.query(`ALTER TABLE services ADD COLUMN IF NOT EXISTS category_id INT;`); } catch (e) { }
    try { await pool.query(`ALTER TABLE services ADD COLUMN category_id INT;`); } catch (e) { }
    try { await pool.query(`ALTER TABLE services ADD COLUMN IF NOT EXISTS icon VARCHAR(100);`); } catch (e) { }
    try { await pool.query(`ALTER TABLE services ADD COLUMN icon VARCHAR(100);`); } catch (e) { }

    // Seed/Migrate the required 4 Main Categories and 13 Sub-services
    const requiredCategories = [
      {
        name: 'Engineering Services',
        slug: 'engineering-services',
        short_description: 'Comprehensive engineering services including CAD drafting, BIM modeling, 3D laser scanning, and scan-to-BIM conversions.',
        icon: 'Building2',
        display_order: 1,
        status: 'Active',
        featured: 1,
        services: [
          {
            title: 'BIM',
            slug: 'bim',
            description: 'End-to-end Building Information Modeling up to LOD 500 across architectural, structural, and MEP disciplines.',
            bullets: ['3D BIM Modeling', 'Clash Detection', '4D Scheduling', '5D Quantity Take-Off'],
            tools: [['Autodesk Revit', 'Navisworks Manage'], ['Solibri', 'BIM 360']],
            display_order: 1
          },
          {
            title: 'CAD',
            slug: 'cad',
            description: 'Professional multidisciplinary 2D/3D CAD drafting and engineering documentation support.',
            bullets: ['2D Drafting', 'Shop Drawings', 'As-Built Documentation', 'Engineering Coordination'],
            tools: [['AutoCAD', 'MicroStation'], ['Civil 3D', 'Revit']],
            display_order: 2
          },
          {
            title: 'Laser Scanning',
            slug: 'laser-scanning',
            description: 'High-precision 3D laser scanning and point cloud capture for as-built verification and asset documentation.',
            bullets: ['3D Laser Scanning', 'Point Cloud Registration', 'Dimensional Verification', 'Site Capture'],
            tools: [['Leica RTC360', 'Faro Focus'], ['Cyclone', 'Recap Pro']],
            display_order: 3
          }
        ]
      },
      {
        name: 'Sustainability Services',
        slug: 'sustainability-services',
        short_description: 'Green building facilitation, GSAS & LEED certifications, energy diagnostic audits, and carbon management strategies.',
        icon: 'Leaf',
        display_order: 2,
        status: 'Active',
        featured: 1,
        services: [
          {
            title: 'GSAS',
            slug: 'gsas',
            description: 'Global Sustainability Assessment System (GSAS) certification management and green building compliance.',
            bullets: ['GSAS Design & Build', 'GSAS Construction Management', 'Energy & Water Audits', 'Daylight Simulation'],
            tools: [['GSAS Gate Tool', 'IES VE'], ['Sefaira', 'One Click LCA']],
            display_order: 1
          },
          {
            title: 'LEED',
            slug: 'leed',
            description: 'LEED BD+C, ID+C, and O+M consulting, energy modeling, and commissioning for USGBC certification.',
            bullets: ['LEED Certification Management', 'Fundamental & Enhanced Commissioning', 'Thermal Comfort Modeling', 'Green Materials Sourcing'],
            tools: [['USGBC LEED v4/v4.1', 'IES VE'], ['EnergyPlus', 'CxAlloy']],
            display_order: 2
          },
          {
            title: 'Energy Audit',
            slug: 'energy-audit',
            description: 'Comprehensive ASHRAE Level 1, 2, and 3 energy diagnostic audits to optimize building energy performance.',
            bullets: ['ASHRAE Level 1, 2 & 3 Audits', 'Chiller Plant Optimization', 'Infrared Thermography', 'Power Quality Analysis'],
            tools: [['FLIR Thermal Cameras', 'Power Quality Analyzers'], ['eQUEST', 'EnergyPlus']],
            display_order: 3
          },
          {
            title: 'Environmental',
            slug: 'carbon-management',
            description: 'Greenhouse gas inventory compiling, carbon footprinting, and environmental verification strategies.',
            bullets: ['ISO 14064 GHG Accounting', 'Organizational Carbon Footprint', 'Decarbonization Roadmap', 'Lifecycle Assessment'],
            tools: [['GHG Protocol Suite', 'ISO 14064 Guidelines'], ['Carbon Calculation Tools']],
            display_order: 4
          }
        ]
      },
      {
        name: 'Digital Twin',
        slug: 'digital-twin',
        short_description: 'Transformative Digital Twin solutions connecting spatial BIM models with real-time IoT monitoring and lifecycle asset management.',
        icon: 'Layers',
        display_order: 3,
        status: 'Active',
        featured: 1,
        services: [
          {
            title: 'System Integration',
            slug: 'system-integration',
            description: 'Connecting heterogeneous building automation, BMS, CAFM, and ERP software with Digital Twin hubs.',
            bullets: ['REST/GraphQL API Middleware', 'BMS/BAS Integration', 'CAFM & ERP Connector', 'Data Pipelines'],
            tools: [['Node-RED', 'Apache Kafka'], ['Grafana', 'Docker']],
            display_order: 1
          },
          {
            title: 'Asset Management',
            slug: 'asset-management',
            description: 'Comprehensive facility asset lifecycle tracking, maintenance scheduling, and digital operations handover.',
            bullets: ['Maintenance Scheduling', 'Work Order Automation', 'Lifecycle Cost Analysis', 'Asset Register Management'],
            tools: [['IBM Maximo', 'SAP PM'], ['Autodesk Tandem', 'Archibus']],
            display_order: 2
          }
        ]
      },
      {
        name: 'Digital Construction Technology',
        slug: 'digital-construction-technology',
        short_description: 'Cutting-edge construction technologies including remote site support, 360° capture, augmented reality, and robotics.',
        icon: 'Cpu',
        display_order: 4,
        status: 'Active',
        featured: 1,
        services: [
          {
            title: 'Laser Scanning',
            slug: 'construction-laser-scanning',
            description: 'High-precision 3D reality capture and scan registration for construction verification.',
            bullets: ['3D Site Scanning', 'Point Cloud Registration', 'Dimensional Quality Verification', 'As-Built Scan Auditing'],
            tools: [['Leica RTC360', 'Faro Focus'], ['Cyclone', 'Recap Pro']],
            display_order: 1
          },
          {
            title: '360° Site Documentation',
            slug: '360-site-documentation',
            description: 'High-resolution 360-degree photo and video documentation indexed to BIM drawings for visual tracking.',
            bullets: ['360° Site Photo Mapping', 'Time-Lapse Progress Tracking', 'BIM Overlay Comparison', 'Historical Documentation'],
            tools: [['Insta360 Pro', 'Ricoh Theta'], ['OpenSpace', 'HoloBuilder']],
            display_order: 2
          },
          {
            title: 'AR Solutions',
            slug: 'ar-solutions',
            description: 'Augmented reality visualization overlaying 3D BIM models directly onto job site physical spaces.',
            bullets: ['BIM Overlay on Site', 'Clash Detection in AR', 'Remote Expert Assistance', 'Safety Hazard Training'],
            tools: [['Trimble Connect AR', 'HoloLens 2'], ['vGIS', 'Unity Industrial']],
            display_order: 3
          },
          {
            title: 'Digital Collaboration',
            slug: 'digital-collaboration',
            description: 'Cloud-based common data environments (CDE), real-time BIM collaboration, and digital project management.',
            bullets: ['CDE Common Data Environment', 'Real-Time BIM Cloud Sync', 'Digital Workflow Automation', 'Issue Management'],
            tools: [['Autodesk ACC', 'BIM 360'], ['Trimble Connect', 'Procore']],
            display_order: 4
          }
        ]
      }
    ];

    // Seed/Migrate default 4 Main Categories and 13 Sub-services ONLY if database tables are empty
    const [cCount] = await pool.query('SELECT COUNT(*) as count FROM service_categories');
    const [sCount] = await pool.query('SELECT COUNT(*) as count FROM services');

    if (cCount[0].count === 0 && sCount[0].count === 0) {
      console.log('Seeding initial service categories and sub-services...');
      for (const cat of requiredCategories) {
        const [res] = await pool.query(
          'INSERT INTO service_categories (name, slug, short_description, icon, display_order, status, featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [cat.name, cat.slug, cat.short_description, cat.icon, cat.display_order, 'Active', cat.featured]
        );
        const catId = res.insertId;

        for (const s of cat.services) {
          const bulletsJson = JSON.stringify(s.bullets);
          const toolsJson = JSON.stringify(s.tools);
          await pool.query(
            'INSERT INTO services (category, category_id, title, slug, description, bullets, tools, banner_image, display_order, status, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [cat.name, catId, s.title, s.slug, s.description, bulletsJson, toolsJson, '/servicepage1.png', s.display_order, 'Active', 1]
          );
        }
      }
    }

    // STRICT CLEANUP: Delete ALL sub-services from services table that are NOT in the approved sub-services
    const approvedSlugs = [
      'bim', 'cad', 'laser-scanning', 'scan-to-bim',
      'gsas', 'leed', 'energy-audit', 'carbon-management',
      'asset-twin', 'system-integration', 'real-time-monitoring', 'asset-management',
      'construction-laser-scanning', '360-site-documentation', 'ar-solutions', 'digital-collaboration',
      'remote-construction', '360-capture', 'robotics'
    ];
    await pool.query('DELETE FROM services WHERE slug NOT IN (?)', [approvedSlugs]);
    await pool.query('DELETE FROM services WHERE category_id NOT IN (SELECT id FROM service_categories)');

    // Guarantee all 4 categories and all 16 sub-services exist and are Active in the database
    for (const cat of requiredCategories) {
      let catId = null;
      const [cRows] = await pool.query(
        "SELECT id FROM service_categories WHERE name = ? OR slug = ? OR name LIKE ? LIMIT 1",
        [cat.name, cat.slug, `%${cat.name}%`]
      );
      if (cRows.length > 0) {
        catId = cRows[0].id;
        await pool.query("UPDATE service_categories SET name = ?, status = 'Active' WHERE id = ?", [cat.name, catId]);
      } else {
        const [cRes] = await pool.query(
          "INSERT INTO service_categories (name, slug, short_description, icon, display_order, status, featured) VALUES (?, ?, ?, ?, ?, 'Active', ?)",
          [cat.name, cat.slug, cat.short_description, cat.icon, cat.display_order, cat.featured]
        );
        catId = cRes.insertId;
      }

      for (const s of cat.services) {
        const [sRows] = await pool.query(
          "SELECT id FROM services WHERE slug = ? OR (category_id = ? AND title = ?)",
          [s.slug, catId, s.title]
        );
        if (sRows.length === 0) {
          await pool.query(
            "INSERT INTO services (category, category_id, title, slug, description, bullets, tools, banner_image, display_order, status, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', 1)",
            [cat.name, catId, s.title, s.slug, s.description, JSON.stringify(s.bullets), JSON.stringify(s.tools), '/servicepage1.png', s.display_order]
          );
        } else {
          await pool.query(
            "UPDATE services SET category = ?, category_id = ?, title = ?, status = 'Active', display_order = ? WHERE id = ?",
            [cat.name, catId, s.title, s.display_order, sRows[0].id]
          );
        }
      }
    }

    // Ensure BIM is order 1, CAD is order 2, Laser Scanning Services is order 3, GSAS is order 4, LEED is order 5
    await pool.query('UPDATE services SET display_order = 1 WHERE title = "BIM" OR slug = "bim"');
    await pool.query('UPDATE services SET display_order = 2 WHERE title = "CAD" OR slug = "cad"');
    await pool.query('UPDATE services SET display_order = 3 WHERE title LIKE "%Laser Scanning%" OR slug = "laser-scanning"');
    await pool.query('UPDATE services SET display_order = 4 WHERE title = "GSAS" OR slug = "gsas"');
    await pool.query('UPDATE services SET display_order = 5 WHERE title = "LEED" OR slug = "leed"');
    await pool.query('UPDATE services SET display_order = 6 WHERE title LIKE "%Asset%" OR slug = "asset-management"');
    await pool.query('UPDATE menus SET order_num = 1 WHERE name = "BIM Projects"');
    await pool.query('UPDATE menus SET order_num = 2 WHERE name = "CAD Projects"');

    // Seed Media Items
    const [mediaRows] = await pool.query('SELECT COUNT(*) as count FROM media_items');
    if (mediaRows[0].count === 0) {
      console.log('Seeding media items...');
      await pool.query(`
        INSERT INTO media_items (type, category, title, url) VALUES
        ('gallery', 'Site', 'Hamad Port Maritime Site Operations', '/project1.png'),
        ('gallery', 'Our Office', 'Doha Gate Tower Main Headquarters', '/about.png'),
        ('gallery', 'Expo', 'Qatar Digital Construction Expo 2025', '/why.png'),
        ('gallery', 'Our Work', '3D Point Cloud Scanning & As-Built Verification', '/servicepage1.png'),
        ('video', 'Our Work', 'BIM LOD 500 Coordination & Clash Detection Showcase', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
        ('video', 'Our Team', 'Blue Crescent Engineering Leadership & Technical Experts', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
        ('video', 'Knowledge Sharing', 'GSAS Green Building & Sustainability Workshop', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
      `);
    }

    // Seed Hero Slides
    const [heroRows] = await pool.query('SELECT COUNT(*) as count FROM hero_slides');
    if (heroRows[0].count === 0) {
      console.log('Seeding hero slides...');
      await pool.query(`
        INSERT INTO hero_slides (title, subtitle, btn1_text, btn2_text, image, status, order_num) VALUES 
        ('Engineering the Digital Future.', 'Blue Crescent Engineering delivers technology-driven engineering and digital transformation solutions across the complete lifecycle of buildings and infrastructure.', 'EXPLORE OUR SERVICES', 'VIEW OUR PROJECTS', NULL, 'published', 1)
      `);
    }

    // Seed Subscribers
    const [subRows] = await pool.query('SELECT COUNT(*) as count FROM subscribers');
    if (subRows[0].count === 0) {
      console.log('Seeding subscribers...');
      await pool.query(`
        INSERT INTO subscribers (email) VALUES 
        ('client1@gmail.com'),
        ('partner2@bluecrescent.com'),
        ('info@constructionqatar.com')
      `);
    }

    // Seed Company Settings
    const [compRows] = await pool.query('SELECT COUNT(*) as count FROM company_settings');
    if (compRows[0].count === 0) {
      console.log('Seeding default company settings...');
      await pool.query(`
        INSERT INTO company_settings (
          siteTitle, tagline, legalName, yearEstablished, copyrightText,
          whoWeArePara1, whoWeArePara2, whoWeArePara3, whoWeArePara4,
          mission, vision, qaqc, hse,
          whyIntro1, whyIntro2, whyIntro3, whyIntro4,
          value1Title, value1Desc,
          value2Title, value2Desc,
          value3Title, value3Desc,
          value4Title, value4Desc,
          value5Title, value5Desc,
          aboutUsVideoUrl, aboutUsHeroType, aboutUsHeroUrl
        ) VALUES (
          'Blue Crescent Engineering', 'A Solution for your Vision', 'Blue Crescent Engineering Trading & Contracting WLL', '2010', '© 2026 BLUE CRESCENT ENGINEERING. All Rights Reserved. A Solution for your Vision.',
          'Blue Crescent Engineering is based upon pillars of engineering excellence, a proven system of quality assurance and a dedication in meeting the client\\'s needs and schedules. The company is incorporated by the core values of teamwork, Respect and Integrity.',
          'Our client-centered culture and teamwork based approach integrate the knowledge and skills of our network with local awareness, technical leadership and innovative approaches to solve our client\\'s challenges.',
          'Across our spectrum of expertise, We make the connection for each client that best serves their immediate objectives while fulfilling our shared purpose.',
          'We offer premium services in Engineering Design Support for MEP, Infrastructure and Transportation, Simulations and Analysis, BIM Modelling, Outsourcing Technical Experts, Energy Audit, Commissioning for LEED and GSAS, LEED Facilitation and Academics & Trainings.',
          '\"With the sustainable approach in all activities that are undertaken and an uncompromising commitment to quality in all the process and deliverable that are undertaken\"',
          'Become the leading support services provider and become a recognized reputed company in the following fields: Engineering Support Services, Contracting Support Services, and Trading Services.',
          '\"Establishing and enhancing on a continuous basis an uncompromising quality assured and controlled procedures resulting in the most Client satisfied deliverables, in time\"',
          '\"Establishing a Healthier, Safe and Environmentally Friendly procedure that is embedded into all business processes and deliverables\"',
          'Guided by the best team leaders, supported by skilled staff, corporate commitment to deliver the services at their best quality while controlling the costs and time components.',
          'Solutions are provided in various options and supported with recommendations that best suit the Clients requirements.',
          'Supported by team of specialists in the areas of MEP design, Acoustics, Stress and Hydraulics, all engineering calculations.',
          'Services are applicable for Owners, Designers, Contractors and Operators.',
          'Integrity', 'We uphold strong ethical standards, building trust through transparent partnerships.',
          'Respect', 'We value every individual, partner and client relationship.',
          'Excellence', 'Striving for the highest international engineering standards.',
          'Teamwork', 'Together we achieve more through collaborative engineering.',
          'Innovation', 'Pioneering green technology and sustainable design.',
          '/aboutus.mp4', 'image', ''
        )
      `);
    } else {
      // Force update Why Partner section to exact original content
      await pool.query(`
        UPDATE company_settings SET 
          whyIntro1 = 'Guided by the best team leaders, supported by skilled staff, corporate commitment to deliver the services at their best quality while controlling the costs and time components.',
          whyIntro2 = 'Solutions are provided in various options and supported with recommendations that best suit the Clients requirements.',
          whyIntro3 = 'Supported by team of specialists in the areas of MEP design, Acoustics, Stress and Hydraulics, all engineering calculations.',
          whyIntro4 = 'Services are applicable for Owners, Designers, Contractors and Operators.'
      `);
      try {
        await pool.query(`
          UPDATE company_settings 
          SET aboutUsDisciplinesJson = '[{"name":"BIM Modeling & Coordination","icon":"Layers","image":"/uploads/bimmodel.png"},{"name":"CAD Documentation","icon":"Building2","image":""},{"name":"Reality Capture & Laser Scanning","icon":"Radio","image":""},{"name":"Specialized Engineering support","icon":"Wrench","image":""},{"name":"Computational Fluid Dynamics (CFD)","icon":"Wind","image":""},{"name":"Acoustic & Vibration Analysis","icon":"Volume2","image":""},{"name":"Hydraulic Analysis & Surge Control","icon":"Droplet","image":""},{"name":"Stress Analysis & Pipe Flexibility","icon":"Activity","image":""},{"name":"Energy Auditing & Commissioning","icon":"Zap","image":""},{"name":"Green Building Facilitation","icon":"Leaf","image":""},{"name":"Technical experts outsourcing","icon":"Users","image":""}]'
          WHERE aboutUsDisciplinesJson IS NULL OR aboutUsDisciplinesJson = ''
        `);
      } catch (err) {}
    }

    // Seed Contact Settings
    const [contRows] = await pool.query('SELECT COUNT(*) as count FROM contact_settings');
    if (contRows[0].count === 0) {
      console.log('Seeding default contact settings...');
      await pool.query(`
        INSERT INTO contact_settings (
          companyName, addressLine1, city, country, poBox,
          phone, fax, email, website, googleMapsUrl,
          businessHoursMon, businessHoursFri, businessHoursSat
        ) VALUES (
          'Blue Crescent Engineering Trading & Contracting WLL',
          '9th Floor, Tower 3, Gate Mall', 'Doha', 'Qatar', '',
          '+974 4463 5250', '+974 4441 8567', 'info@bluecrescent.com', 'www.bluecrescentqatar.com',
          'https://maps.google.com/maps?q=The+Gate+Mall,+West+Bay,+Doha,+Qatar&t=&z=15&ie=UTF8&iwloc=&output=embed',
          '8:00 AM – 6:00 PM', '8:00 AM – 12:00 PM', 'Closed'
        )
      `);
    }

    // Seed & Upgrade Projects with rich structured data
    const [projCountRows] = await pool.query('SELECT COUNT(*) as count FROM projects');
    const defaultSeedProjects = [
      {
        name: 'Qatar Free Zone Project',
        slug: 'qatar-free-zone',
        division_type: 'BIM Projects',
        client: 'Free Zones Authority (QFZA)',
        contractor: 'Consolidated Contractors Company (CCC)',
        consultant: 'Dar Al-Handasah',
        location: 'Doha, Qatar',
        sector: 'Infrastructure & Buildings',
        status: 'Completed',
        year: '2024',
        short_description: 'Multidisciplinary BIM coordination and digital asset information supporting infrastructure and building requirements.',
        description: 'Development and coordination of multidisciplinary BIM models and preparation of digital asset information to support operational requirements for Qatar Free Zone development.',
        services: JSON.stringify(['BIM', 'Digital Twin', 'Laser Scanning']),
        disciplines: JSON.stringify(['Architecture', 'Structure', 'MEP', 'Infrastructure']),
        project_stage: 'As-Built / Asset Handover',
        bim_level: 'LOD 500',
        scope_of_work: 'Development and coordination of multidisciplinary BIM models and preparation of digital asset information to support operational requirements.',
        deliverables: JSON.stringify(['BIM Models', 'As-Built Information', 'Asset Data', 'Digital Twin Integration']),
        technologies: JSON.stringify(['Revit', 'Navisworks', 'Digital Twin Platform', 'AutoCAD']),
        project_highlights: 'Multidisciplinary BIM coordination and digital asset information supporting infrastructure and building requirements.',
        image: '/project1.png',
        display_order: 1
      },
      {
        name: 'Hamad Port Maritime Facilities',
        slug: 'hamad-port-maritime',
        division_type: 'CAD Projects',
        client: 'Mwani Qatar / Ministry of Transport',
        contractor: 'China Harbour Engineering Company',
        consultant: 'AECOM',
        location: 'Umm Said, Qatar',
        sector: 'Transportation & Maritime',
        status: 'Completed',
        year: '2023',
        short_description: 'Multidisciplinary CAD drafting, shop drawings, and engineering documentation support.',
        description: 'Comprehensive CAD drafting, shop drawings, as-built documentation, and GSAS green building compliance management for maritime port facilities.',
        services: JSON.stringify(['CAD', 'GSAS', 'Engineering Services']),
        disciplines: JSON.stringify(['Infrastructure', 'Roads', 'Utilities', 'MEP']),
        project_stage: 'Construction & As-Built',
        bim_level: 'LOD 300',
        scope_of_work: 'Comprehensive CAD drafting, shop drawings, and GSAS green building compliance management for maritime port facilities.',
        deliverables: JSON.stringify(['Shop Drawings', 'As-Built Documentation', 'GSAS Certification Data']),
        technologies: JSON.stringify(['AutoCAD', 'Civil 3D', 'MicroStation']),
        project_highlights: 'Large-scale maritime infrastructure CAD documentation and environmental sustainability verification.',
        image: '/project1.png',
        display_order: 2
      },
      {
        name: 'Doha Port Terminal Renovation',
        slug: 'doha-port-terminal',
        division_type: 'Sustainability Projects',
        client: 'Mwani Qatar',
        contractor: 'Al Jaber Engineering',
        consultant: 'KEO International Consultants',
        location: 'Doha, Qatar',
        sector: 'Hospitality & Maritime',
        status: 'Completed',
        year: '2023',
        short_description: 'GSAS green building certification management and energy diagnostic audits.',
        description: 'GSAS green building certification management, energy diagnostic audits, and sustainable material sourcing for commercial cruise terminal facilities.',
        services: JSON.stringify(['Sustainability Services', 'GSAS', 'Energy Audit']),
        disciplines: JSON.stringify(['Architecture', 'MEP', 'Landscape']),
        project_stage: 'Design & Commissioning',
        bim_level: 'LOD 300',
        scope_of_work: 'GSAS green building certification management, energy diagnostic audits, and sustainable material sourcing.',
        deliverables: JSON.stringify(['GSAS Documentation', 'Energy Audit Reports', 'Sustainability Guidelines']),
        technologies: JSON.stringify(['IES VE', 'EnergyPlus', 'GSAS Gate Tool']),
        project_highlights: 'Achievement of 3-Star GSAS Design & Build rating for commercial cruise terminal facilities.',
        image: '/project1.png',
        display_order: 3
      },
      {
        name: 'Qatar Rail Station Project',
        slug: 'qatar-rail-station',
        division_type: 'BIM Projects',
        client: 'Qatar Rail',
        contractor: 'RHK Joint Venture',
        consultant: 'Atkins',
        location: 'Doha, Qatar',
        sector: 'Transportation & Metro',
        status: 'Completed',
        year: '2022',
        short_description: 'Building Information Modeling up to LOD 400, clash detection, and 4D/5D simulations.',
        description: 'Complex 3D BIM modeling, clash detection, and underground station coordination across architectural, structural, and MEP disciplines.',
        services: JSON.stringify(['BIM', 'Scan to BIM', 'Laser Scanning']),
        disciplines: JSON.stringify(['Architecture', 'Structure', 'MEP', 'Underground Utilities']),
        project_stage: 'Construction & As-Built',
        bim_level: 'LOD 400',
        scope_of_work: 'Complex 3D BIM modeling, clash detection, and underground station coordination across architectural and MEP disciplines.',
        deliverables: JSON.stringify(['3D BIM Models', 'Clash Reports', '4D Scheduling Models']),
        technologies: JSON.stringify(['Revit', 'Navisworks Manage', 'BIM 360']),
        project_highlights: 'Zero-clash resolution across 12,000+ underground utility & MEP interfaces.',
        image: '/project1.png',
        display_order: 4
      },
      {
        name: 'Bus Station & Transit Hub Depots',
        slug: 'bus-station-depots',
        division_type: 'BIM Projects',
        client: 'Ashghal / Ministry of Transport',
        contractor: 'HBK Contracting',
        consultant: 'Parsons',
        location: 'Doha & Al Wakra, Qatar',
        sector: 'Transportation',
        status: 'Completed',
        year: '2024',
        short_description: 'BIM modeling up to LOD 400 and GSAS green building certification for transit hubs.',
        description: 'BIM modeling up to LOD 400 and GSAS green building certification for regional bus depots and transit hubs.',
        services: JSON.stringify(['BIM', 'GSAS', 'Digital Twin']),
        disciplines: JSON.stringify(['Architecture', 'Structure', 'MEP', 'Roads']),
        project_stage: 'LOD 400 & As-Built',
        bim_level: 'LOD 400',
        scope_of_work: 'BIM modeling up to LOD 400 and GSAS green building certification for regional bus depots and transit hubs.',
        deliverables: JSON.stringify(['BIM Models', 'GSAS Certification', 'As-Built Documentation']),
        technologies: JSON.stringify(['Revit', 'Civil 3D', 'Navisworks']),
        project_highlights: 'Fast-track BIM delivery and GSAS sustainability rating across multiple transit depots.',
        image: '/project1.png',
        display_order: 5
      },
      {
        name: 'Hamad Airport Terminal Expansion',
        slug: 'airport-expansion-project',
        division_type: 'Laser Scanning Projects',
        client: 'Hamad International Airport',
        contractor: 'TAV Construction',
        consultant: 'Meinhardt',
        location: 'Doha, Qatar',
        sector: 'Aviation & Transportation',
        status: 'Completed',
        year: '2023',
        short_description: 'High-precision 3D laser scanning and point-cloud to BIM workflows.',
        description: 'High-precision 3D laser scanning of existing terminal structures and point-cloud-to-BIM conversion for expansion integration.',
        services: JSON.stringify(['Laser Scanning', 'Scan to BIM', 'BIM']),
        disciplines: JSON.stringify(['Architecture', 'MEP', 'Façade']),
        project_stage: 'Retrofit & Expansion',
        bim_level: 'LOD 400',
        scope_of_work: 'High-precision 3D laser scanning of existing terminal structures and point-cloud-to-BIM conversion for expansion integration.',
        deliverables: JSON.stringify(['Point Cloud Scans', 'Scan-to-BIM Models', 'As-Built Verification Reports']),
        technologies: JSON.stringify(['Leica RTC360', 'ReCap Pro', 'Revit']),
        project_highlights: 'Millimeter-accurate 3D laser scanning without disrupting operational airport terminal traffic.',
        image: '/project1.png',
        display_order: 6
      },
      {
        name: 'Qetaifan Island North Resort',
        slug: 'qetaifan-island-resort',
        division_type: 'Digital Twin Projects',
        client: 'Qetaifan Projects',
        contractor: 'Larsen & Toubro',
        consultant: 'Atkins',
        location: 'Lusail, Qatar',
        sector: 'Hospitality & Real Estate',
        status: 'Ongoing',
        year: '2025',
        short_description: 'Connecting physical assets with digital information for IoT monitoring and asset management.',
        description: 'Digital Twin platform integration and GSAS sustainability facilitation for luxury island resort and waterpark development.',
        services: JSON.stringify(['Digital Twin', 'BIM', 'Sustainability Services']),
        disciplines: JSON.stringify(['Architecture', 'Structure', 'MEP', 'Landscape', 'Utilities']),
        project_stage: 'Construction & Digital Twin Setup',
        bim_level: 'LOD 500',
        scope_of_work: 'Digital Twin platform integration and GSAS sustainability facilitation for luxury island resort and waterpark development.',
        deliverables: JSON.stringify(['Digital Twin Models', 'IoT Sensor Connections', 'GSAS Reports']),
        technologies: JSON.stringify(['Autodesk Tandem', 'Revit', 'Navisworks', 'Grafana']),
        project_highlights: 'Real-time digital twin asset tracking and energy monitoring for waterfront luxury developments.',
        image: '/project1.png',
        display_order: 7
      },
      {
        name: 'Qatar Foundation Research Complex',
        slug: 'qatar-foundation-research-complex',
        division_type: 'Sustainability Projects',
        client: 'Qatar Foundation',
        contractor: 'Midmac Contracting',
        consultant: 'Ove Arup & Partners',
        location: 'Education City, Doha',
        sector: 'Education & Government',
        status: 'Completed',
        year: '2022',
        short_description: 'Green building consulting, GSAS/LEED certification, and energy diagnostic audits.',
        description: 'CAD documentation support, LEED Gold commissioning, and building thermal envelope energy auditing for institutional research facilities.',
        services: JSON.stringify(['CAD', 'LEED', 'Sustainability Services']),
        disciplines: JSON.stringify(['Architecture', 'MEP', 'Façade']),
        project_stage: 'Design & LEED Commissioning',
        bim_level: 'LOD 300',
        scope_of_work: 'CAD documentation support, LEED Gold commissioning, and building thermal envelope energy auditing for institutional research facilities.',
        deliverables: JSON.stringify(['LEED Gold Documentation', 'Energy Audit Reports', 'CAD Shop Drawings']),
        technologies: JSON.stringify(['AutoCAD', 'eQUEST', 'IES VE']),
        project_highlights: 'Successful LEED Gold certification for institutional research facilities.',
        image: '/project1.png',
        display_order: 8
      }
    ];

    if (projCountRows[0].count === 0) {
      console.log('Seeding initial verified projects data...');
      for (const p of defaultSeedProjects) {
        await pool.query(
          `INSERT INTO projects (
            name, slug, division_type, client, contractor, consultant, location, sector, status, year,
            short_description, description, services, disciplines, project_stage, bim_level, scope_of_work,
            deliverables, technologies, project_highlights, image, display_order
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            p.name, p.slug, p.division_type, p.client, p.contractor, p.consultant, p.location, p.sector, p.status, p.year,
            p.short_description, p.description, p.services, p.disciplines, p.project_stage, p.bim_level, p.scope_of_work,
            p.deliverables, p.technologies, p.project_highlights, p.image, p.display_order
          ]
        );
      }
    } else {
      // Ensure existing records have valid slugs and structured data
      const [existingProjs] = await pool.query('SELECT id, name, slug FROM projects');
      for (const p of existingProjs) {
        if (!p.slug) {
          const generatedSlug = p.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
          await pool.query('UPDATE projects SET slug = ? WHERE id = ?', [generatedSlug, p.id]);
        }
      }
    }

    isConnected = true;
    console.log(' Successfully connected to MySQL database: Bluecres');
  } catch (err) {
    console.warn(' MySQL database connection warning (using mock/fallback mode):', err.message);
    isConnected = false;
  }
}

initDB();

module.exports = {
  getPool: () => pool,
  getIsConnected: () => isConnected,
  fallbackData,
  hashPassword
};

