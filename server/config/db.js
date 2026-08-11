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
  testimonials: [
    {
      id: 1,
      title: "Excellent Work",
      content: "Blue Crescent has provided us with complete support for MEP drawings, all design Calculations in MEP & Stress Analysis etc in our projects. They are one of the best Engineering company who can be trusted for complete solutions of all Design & Engineering issues. I visited their office & fully satisfied with the Engineering & design team who delivered the works for us on time & also they provided complete support to get approval from various authorities for some woks in very short time. You are Excellent Blue crescent & keep going. Thanks for your works delivered.",
      author_name: "Gokulraj Chakaravarthy",
      company_name: "Diplomat Group W.L.L",
      status: "approved"
    }
  ],
  news: [
    {
      id: 1,
      title: "ISO 9001 Certified: We are now an ISO 9001 certified Quality Management System company.",
      content: "Blue Crescent is proud to announce that we are now an ISO 9001:2015 certified company, demonstrating our commitment to quality, efficiency, and continuous improvement.",
      category: "AWARDS",
      image: "/project1.png",
      date: "May 20, 2024"
    },
    {
      id: 2,
      title: "Energy Quotient Provider: We are the only authorised energy quotient service provider in Qatar.",
      content: "Blue Crescent has been recognized as the sole authorized energy quotient service provider in Qatar, enabling advanced energy diagnostics and conservation.",
      category: "SERVICES",
      image: "/simulation.png",
      date: "April 15, 2024"
    },
    {
      id: 3,
      title: "GORD GSAS Provider: We are now a GORD certified GSAS service provider.",
      content: "GORD has officially certified Blue Crescent as a green building GSAS consultancy and service provider for all building typologies.",
      category: "AWARDS",
      image: "/sust_workshop.png",
      date: "March 10, 2024"
    },
    {
      id: 4,
      title: "KAHRAMAA Project Tarsheed: Awarded prestigious KAHRAMAA Tarsheed Energy Audit for 22 schools campaign.",
      content: "Blue Crescent Sustainability division has been awarded the prestigious Tarsheed 2022 campaign by Kahramaa, auditing energy use across 22 Qatar schools.",
      category: "PROJECTS",
      image: "/project1.png",
      date: "February 28, 2024"
    }
  ],
  service_categories: [
    { id: 1, name: 'Engineering Services', slug: 'engineering-services', short_description: 'Comprehensive engineering services including CAD drafting, BIM modeling, 3D laser scanning, and scan-to-BIM conversions.', icon: 'Building2', display_order: 1, status: 'Active', featured: 1 },
    { id: 2, name: 'Sustainability Services', slug: 'sustainability-services', short_description: 'Green building facilitation, GSAS & LEED certifications, energy diagnostic audits, and carbon management strategies.', icon: 'Leaf', display_order: 2, status: 'Active', featured: 1 },
    { id: 3, name: 'Digital Twin', slug: 'digital-twin', short_description: 'Transformative Digital Twin solutions connecting spatial BIM models with real-time IoT monitoring and lifecycle asset management.', icon: 'Layers', display_order: 3, status: 'Active', featured: 1 },
    { id: 4, name: 'Construction Technology', slug: 'construction-technology', short_description: 'Cutting-edge construction technologies including remote site support, 360° capture, augmented reality, and robotics.', icon: 'Cpu', display_order: 4, status: 'Active', featured: 1 }
  ],
  services: [
    { id: 1, category: 'Engineering Services', category_id: 1, title: 'CAD', slug: 'cad', description: 'Professional multidisciplinary 2D/3D CAD drafting and engineering documentation support.', bullets: JSON.stringify(['2D Drafting', 'Shop Drawings', 'As-Built Documentation', 'Engineering Coordination']), tools: JSON.stringify([['AutoCAD', 'MicroStation'], ['Civil 3D', 'Revit']]), banner_image: '/servicepage1.png', display_order: 1, status: 'Active' },
    { id: 2, category: 'Engineering Services', category_id: 1, title: 'BIM', slug: 'bim', description: 'End-to-end Building Information Modeling up to LOD 500 across architectural, structural, and MEP disciplines.', bullets: JSON.stringify(['3D BIM Modeling', 'Clash Detection', '4D Scheduling', '5D Quantity Take-Off']), tools: JSON.stringify([['Autodesk Revit', 'Navisworks Manage'], ['Solibri', 'BIM 360']]), banner_image: '/servicepage1.png', display_order: 2, status: 'Active' },
    { id: 3, category: 'Engineering Services', category_id: 1, title: 'Laser Scanning', slug: 'laser-scanning', description: 'High-precision 3D laser scanning and point cloud capture for as-built verification and asset documentation.', bullets: JSON.stringify(['3D Laser Scanning', 'Point Cloud Registration', 'Dimensional Verification', 'Site Capture']), tools: JSON.stringify([['Leica RTC360', 'Faro Focus'], ['Cyclone', 'Recap Pro']]), banner_image: '/servicepage1.png', display_order: 3, status: 'Active' },
    { id: 4, category: 'Engineering Services', category_id: 1, title: 'Scan to BIM', slug: 'scan-to-bim', description: 'Converting raw point cloud scans into intelligent 3D BIM models for renovation, retrofit, and facility management.', bullets: JSON.stringify(['Point Cloud to BIM Conversion', 'As-Built Model Verification', 'Retrofit Modeling', 'Deviation Analysis']), tools: JSON.stringify([['Autodesk Revit', 'CloudCompare'], ['ClearEdge3D Edgewise']]), banner_image: '/servicepage1.png', display_order: 4, status: 'Active' },
    { id: 5, category: 'Sustainability Services', category_id: 2, title: 'GSAS', slug: 'gsas', description: 'Global Sustainability Assessment System (GSAS) certification management and green building compliance.', bullets: JSON.stringify(['GSAS Design & Build', 'GSAS Construction Management', 'Energy & Water Audits', 'Daylight Simulation']), tools: JSON.stringify([['GSAS Gate Tool', 'IES VE'], ['Sefaira', 'One Click LCA']]), banner_image: '/servicepage1.png', display_order: 1, status: 'Active' },
    { id: 6, category: 'Sustainability Services', category_id: 2, title: 'LEED', slug: 'leed', description: 'LEED BD+C, ID+C, and O+M consulting, energy modeling, and commissioning for USGBC certification.', bullets: JSON.stringify(['LEED Certification Management', 'Fundamental & Enhanced Commissioning', 'Thermal Comfort Modeling', 'Green Materials Sourcing']), tools: JSON.stringify([['USGBC LEED v4/v4.1', 'IES VE'], ['EnergyPlus', 'CxAlloy']]), banner_image: '/servicepage1.png', display_order: 2, status: 'Active' },
    { id: 7, category: 'Sustainability Services', category_id: 2, title: 'Energy Audit', slug: 'energy-audit', description: 'Comprehensive ASHRAE Level 1, 2, and 3 energy diagnostic audits to optimize building energy performance.', bullets: JSON.stringify(['ASHRAE Level 1, 2 & 3 Audits', 'Chiller Plant Optimization', 'Infrared Thermography', 'Power Quality Analysis']), tools: JSON.stringify([['FLIR Thermal Cameras', 'Power Quality Analyzers'], ['eQUEST', 'EnergyPlus']]), banner_image: '/servicepage1.png', display_order: 3, status: 'Active' },
    { id: 8, category: 'Sustainability Services', category_id: 2, title: 'Carbon Management', slug: 'carbon-management', description: 'Greenhouse gas inventory compiling, carbon footprinting, and ISO 14064 verification strategies.', bullets: JSON.stringify(['ISO 14064 GHG Accounting', 'Organizational Carbon Footprint', 'Decarbonization Roadmap', 'Lifecycle Assessment']), tools: JSON.stringify([['GHG Protocol Suite', 'ISO 14064 Guidelines'], ['Carbon Calculation Tools']]), banner_image: '/servicepage1.png', display_order: 4, status: 'Active' },
    { id: 9, category: 'Digital Twin', category_id: 3, title: 'Asset Twin', slug: 'asset-twin', description: 'Virtual representation of physical assets connecting 3D spatial models with operational telemetry.', bullets: JSON.stringify(['3D Asset Visualization', 'IoT Telemetry Integration', 'Predictive Asset Analytics', 'COBie Data Handover']), tools: JSON.stringify([['Autodesk Tandem', 'Azure Digital Twins'], ['ThingWorx', 'Matterport']]), banner_image: '/servicepage1.png', display_order: 1, status: 'Active' },
    { id: 10, category: 'Digital Twin', category_id: 3, title: 'System Integration', slug: 'system-integration', description: 'Connecting heterogeneous building automation, BMS, CAFM, and ERP software with Digital Twin hubs.', bullets: JSON.stringify(['REST/GraphQL API Middleware', 'BMS/BAS Integration', 'CAFM & ERP Connector', 'Data Pipelines']), tools: JSON.stringify([['Node-RED', 'Apache Kafka'], ['Grafana', 'Docker']]), banner_image: '/servicepage1.png', display_order: 2, status: 'Active' },
    { id: 11, category: 'Digital Twin', category_id: 3, title: 'Real-Time Monitoring', slug: 'real-time-monitoring', description: 'Continuous live sensor data monitoring, anomaly detection, and operational performance dashboards.', bullets: JSON.stringify(['Live Sensor Data Streaming', 'Anomaly Alerts', 'Energy Consumption Monitoring', 'Space Utilization Analytics']), tools: JSON.stringify([['Grafana', 'InfluxDB'], ['AWS IoT Core', 'Azure IoT']]), banner_image: '/servicepage1.png', display_order: 3, status: 'Active' },
    { id: 12, category: 'Digital Twin', category_id: 3, title: 'Asset Management', slug: 'asset-management', description: 'Comprehensive facility asset lifecycle tracking, maintenance scheduling, and digital operations handover.', bullets: JSON.stringify(['Maintenance Scheduling', 'Work Order Automation', 'Lifecycle Cost Analysis', 'Asset Register Management']), tools: JSON.stringify([['IBM Maximo', 'SAP PM'], ['Autodesk Tandem', 'Archibus']]), banner_image: '/servicepage1.png', display_order: 4, status: 'Active' },
    { id: 13, category: 'Construction Technology', category_id: 4, title: 'Remote Construction', slug: 'remote-construction', description: 'Remote site monitoring, virtual walkthroughs, and automated progress reporting for distributed teams.', bullets: JSON.stringify(['Remote Site Walkthroughs', 'Progress Monitoring', 'Virtual Inspections', 'Cloud Collaboration']), tools: JSON.stringify([['OpenSpace', 'Cupix'], ['Matterport', 'Autodesk ACC']]), banner_image: '/servicepage1.png', display_order: 1, status: 'Active' },
    { id: 14, category: 'Construction Technology', category_id: 4, title: '360° Capture', slug: '360-capture', description: 'High-resolution 360-degree photo and video documentation indexed to BIM drawings for visual tracking.', bullets: JSON.stringify(['360° Site Photo Mapping', 'Time-Lapse Progress Tracking', 'BIM Overlay Comparison', 'Historical Documentation']), tools: JSON.stringify([['Insta360 Pro', 'Ricoh Theta'], ['OpenSpace', 'HoloBuilder']]), banner_image: '/servicepage1.png', display_order: 2, status: 'Active' },
    { id: 15, category: 'Construction Technology', category_id: 4, title: 'AR Solutions', slug: 'ar-solutions', description: 'Augmented reality visualization overlaying 3D BIM models directly onto job site physical spaces.', bullets: JSON.stringify(['BIM Overlay on Site', 'Clash Detection in AR', 'Remote Expert Assistance', 'Safety Hazard Training']), tools: JSON.stringify([['Trimble Connect AR', 'HoloLens 2'], ['vGIS', 'Unity Industrial']]), banner_image: '/servicepage1.png', display_order: 3, status: 'Active' },
    { id: 16, category: 'Construction Technology', category_id: 4, title: 'Robotics', slug: 'robotics', description: 'Robotic site layout, autonomous scanning, and robotic inspection integrations for modern job sites.', bullets: JSON.stringify(['Autonomous Scanning Robots', 'Robotic Layout Marking', 'Drone Photogrammetry', 'Automated Surveys']), tools: JSON.stringify([['Boston Dynamics Spot', 'Dusty Robotics'], ['Skydio Drones', 'Pix4D']]), banner_image: '/servicepage1.png', display_order: 4, status: 'Active' }
  ]
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

    // 3. News Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'NEWS',
        image LONGTEXT,
        date VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

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
        division_type VARCHAR(100) NOT NULL DEFAULT 'BIM Projects',
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
        aboutUsCapabilitiesJson LONGTEXT
      );
    `);

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
        title VARCHAR(255) NOT NULL,
        url LONGTEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);


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

    try {
      await pool.query("SELECT category FROM news LIMIT 1");
    } catch (err) {
      console.log('Adding category, image, date to news table...');
      await pool.query("ALTER TABLE news ADD COLUMN category VARCHAR(100) DEFAULT 'NEWS'");
      await pool.query("ALTER TABLE news ADD COLUMN image LONGTEXT");
      await pool.query("ALTER TABLE news ADD COLUMN date VARCHAR(100)");
    }

    // Seed & Sync Admin Users
    console.log('Syncing admin user credentials...');
    const [superadminRows] = await pool.query('SELECT id FROM users WHERE username = ?', ['superadmin']);
    if (superadminRows.length > 0) {
      await pool.query('UPDATE users SET password = ?, role = ? WHERE username = ?', [hashPassword('super123'), 'super_admin', 'superadmin']);
    } else {
      await pool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['superadmin', hashPassword('super123'), 'super_admin']);
    }

    const [adminRows] = await pool.query('SELECT id FROM users WHERE username = ?', ['admin']);
    if (adminRows.length > 0) {
      await pool.query('UPDATE users SET password = ?, role = ? WHERE username = ?', [hashPassword('admin123'), 'admin', 'admin']);
    } else {
      await pool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', hashPassword('admin123'), 'admin']);
    }

    // Seed Testimonials
    const [tRows] = await pool.query('SELECT COUNT(*) as count FROM testimonials');
    if (tRows[0].count === 0) {
      console.log('Seeding testimonials...');
      for (const t of fallbackData.testimonials) {
        await pool.query(
          'INSERT INTO testimonials (title, content, author_name, company_name, status) VALUES (?, ?, ?, ?, ?)',
          [t.title, t.content, t.author_name, t.company_name, t.status]
        );
      }
    }

    // Seed News
    const [nRows] = await pool.query('SELECT COUNT(*) as count FROM news');
    if (nRows[0].count === 0) {
      console.log('Seeding news...');
      for (const n of fallbackData.news) {
        await pool.query(
          'INSERT INTO news (title, content, category, image, date) VALUES (?, ?, ?, ?, ?)',
          [n.title, n.content, n.category, n.image, n.date]
        );
      }
    }

    // Seed Certificates
    const [cRows] = await pool.query('SELECT COUNT(*) as count FROM certificates');
    if (cRows[0].count === 0) {
      console.log('Seeding certificates...');
      await pool.query(`
        INSERT INTO certificates (title, org, licenseNo, territory, validity, borderColor, badgeText, image, scope) VALUES 
        ('GSAS Design & Build Service Provider', 'Gulf Organisation for Research & Development (GORD) & GSAS', 'SPD-QA109-00109', 'Qatar', 'Valid & Recognized', 'border-green', 'GSAS CERTIFIED', '/certificate GSAG.png', 'Type I - Building Typologies License covering Commercial, Offices, Residential, Education, Mosques, Hospitality, Homes, Light Industry, Parks, Interiors & Renovations.'),
        ('ISO 9001:2015 Quality Management System', 'BQSR Quality Assurance Pvt. Ltd. (Accredited by IAS & IAF)', 'Cert No. 10487', 'International / Qatar', 'Valid & Recognized', 'border-gold', 'ISO 9001:2015 CERTIFIED', '/certificate IAF.png', 'Providing Engineering Design Work & GSAS Consultancy Services adhering to international quality control standards.')
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
      await pool.query("INSERT INTO menus (name, url, parent_id, order_num) VALUES ('CAD Projects', 'CAD Projects', ?, 1)", [projectsId]);
      await pool.query("INSERT INTO menus (name, url, parent_id, order_num) VALUES ('BIM Projects', 'BIM Projects', ?, 2)", [projectsId]);
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

      // Sync Projects sub-menus to the 5 required categories
      const [projectsMenuRows] = await pool.query("SELECT id FROM menus WHERE LOWER(name) = 'projects'");
      if (projectsMenuRows.length > 0) {
        const pId = projectsMenuRows[0].id;
        // Delete legacy sub-menus under Projects
        await pool.query("DELETE FROM menus WHERE parent_id = ? AND name NOT IN ('CAD Projects', 'BIM Projects', 'Laser Scanning Projects', 'Digital Twin Projects', 'Sustainability Projects')", [pId]);

        const requiredProjectSubMenus = [
          { name: 'CAD Projects', url: 'CAD Projects', order_num: 1 },
          { name: 'BIM Projects', url: 'BIM Projects', order_num: 2 },
          { name: 'Laser Scanning Projects', url: 'Laser Scanning Projects', order_num: 3 },
          { name: 'Digital Twin Projects', url: 'Digital Twin Projects', order_num: 4 },
          { name: 'Sustainability Projects', url: 'Sustainability Projects', order_num: 5 }
        ];

        for (const sub of requiredProjectSubMenus) {
          const [exists] = await pool.query("SELECT id FROM menus WHERE parent_id = ? AND name = ?", [pId, sub.name]);
          if (exists.length === 0) {
            await pool.query("INSERT INTO menus (name, url, parent_id, order_num) VALUES (?, ?, ?, ?)", [sub.name, sub.url, pId, sub.order_num]);
          } else {
            await pool.query("UPDATE menus SET order_num = ? WHERE id = ?", [sub.order_num, exists[0].id]);
          }
        }
      }

      // Inactivate legacy categories and services ('Telecom Services', 'Digital Twin Services', etc.)
      await pool.query("UPDATE service_categories SET status = 'Inactive' WHERE name IN ('Telecom Services', 'Telecom', 'Digital Twin Services') OR name NOT IN ('Engineering Services', 'Sustainability Services', 'Digital Twin', 'Construction Technology')");
      await pool.query("UPDATE services SET status = 'Inactive' WHERE category IN ('Telecom Services', 'Telecom', 'Digital Twin Services') OR category NOT IN ('Engineering Services', 'Sustainability Services', 'Digital Twin', 'Construction Technology')");
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

    // Seed/Migrate the required 4 Main Categories and 16 Sub-services
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
            title: 'CAD',
            slug: 'cad',
            description: 'Professional multidisciplinary 2D/3D CAD drafting and engineering documentation support.',
            bullets: ['2D Drafting', 'Shop Drawings', 'As-Built Documentation', 'Engineering Coordination'],
            tools: [['AutoCAD', 'MicroStation'], ['Civil 3D', 'Revit']],
            display_order: 1
          },
          {
            title: 'BIM',
            slug: 'bim',
            description: 'End-to-end Building Information Modeling up to LOD 500 across architectural, structural, and MEP disciplines.',
            bullets: ['3D BIM Modeling', 'Clash Detection', '4D Scheduling', '5D Quantity Take-Off'],
            tools: [['Autodesk Revit', 'Navisworks Manage'], ['Solibri', 'BIM 360']],
            display_order: 2
          },
          {
            title: 'Laser Scanning',
            slug: 'laser-scanning',
            description: 'High-precision 3D laser scanning and point cloud capture for as-built verification and asset documentation.',
            bullets: ['3D Laser Scanning', 'Point Cloud Registration', 'Dimensional Verification', 'Site Capture'],
            tools: [['Leica RTC360', 'Faro Focus'], ['Cyclone', 'Recap Pro']],
            display_order: 3
          },
          {
            title: 'Scan to BIM',
            slug: 'scan-to-bim',
            description: 'Converting raw point cloud scans into intelligent 3D BIM models for renovation, retrofit, and facility management.',
            bullets: ['Point Cloud to BIM Conversion', 'As-Built Model Verification', 'Retrofit Modeling', 'Deviation Analysis'],
            tools: [['Autodesk Revit', 'CloudCompare'], ['ClearEdge3D Edgewise']],
            display_order: 4
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
            title: 'Carbon Management',
            slug: 'carbon-management',
            description: 'Greenhouse gas inventory compiling, carbon footprinting, and ISO 14064 verification strategies.',
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
            title: 'Asset Twin',
            slug: 'asset-twin',
            description: 'Virtual representation of physical assets connecting 3D spatial models with operational telemetry.',
            bullets: ['3D Asset Visualization', 'IoT Telemetry Integration', 'Predictive Asset Analytics', 'COBie Data Handover'],
            tools: [['Autodesk Tandem', 'Azure Digital Twins'], ['ThingWorx', 'Matterport']],
            display_order: 1
          },
          {
            title: 'System Integration',
            slug: 'system-integration',
            description: 'Connecting heterogeneous building automation, BMS, CAFM, and ERP software with Digital Twin hubs.',
            bullets: ['REST/GraphQL API Middleware', 'BMS/BAS Integration', 'CAFM & ERP Connector', 'Data Pipelines'],
            tools: [['Node-RED', 'Apache Kafka'], ['Grafana', 'Docker']],
            display_order: 2
          },
          {
            title: 'Real-Time Monitoring',
            slug: 'real-time-monitoring',
            description: 'Continuous live sensor data monitoring, anomaly detection, and operational performance dashboards.',
            bullets: ['Live Sensor Data Streaming', 'Anomaly Alerts', 'Energy Consumption Monitoring', 'Space Utilization Analytics'],
            tools: [['Grafana', 'InfluxDB'], ['AWS IoT Core', 'Azure IoT']],
            display_order: 3
          },
          {
            title: 'Asset Management',
            slug: 'asset-management',
            description: 'Comprehensive facility asset lifecycle tracking, maintenance scheduling, and digital operations handover.',
            bullets: ['Maintenance Scheduling', 'Work Order Automation', 'Lifecycle Cost Analysis', 'Asset Register Management'],
            tools: [['IBM Maximo', 'SAP PM'], ['Autodesk Tandem', 'Archibus']],
            display_order: 4
          }
        ]
      },
      {
        name: 'Construction Technology',
        slug: 'construction-technology',
        short_description: 'Cutting-edge construction technologies including remote site support, 360° capture, augmented reality, and robotics.',
        icon: 'Cpu',
        display_order: 4,
        status: 'Active',
        featured: 1,
        services: [
          {
            title: 'Remote Construction',
            slug: 'remote-construction',
            description: 'Remote site monitoring, virtual walkthroughs, and automated progress reporting for distributed teams.',
            bullets: ['Remote Site Walkthroughs', 'Progress Monitoring', 'Virtual Inspections', 'Cloud Collaboration'],
            tools: [['OpenSpace', 'Cupix'], ['Matterport', 'Autodesk ACC']],
            display_order: 1
          },
          {
            title: '360° Capture',
            slug: '360-capture',
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
            title: 'Robotics',
            slug: 'robotics',
            description: 'Robotic site layout, autonomous scanning, and robotic inspection integrations for modern job sites.',
            bullets: ['Autonomous Scanning Robots', 'Robotic Layout Marking', 'Drone Photogrammetry', 'Automated Surveys'],
            tools: [['Boston Dynamics Spot', 'Dusty Robotics'], ['Skydio Drones', 'Pix4D']],
            display_order: 4
          }
        ]
      }
    ];

    // Archive (inactivate) any old categories not matching the 4 required
    const validCatNames = requiredCategories.map(c => c.name);
    await pool.query('UPDATE service_categories SET status = "Inactive" WHERE name NOT IN (?)', [validCatNames]);

    // Upsert the 4 main categories
    for (const cat of requiredCategories) {
      const [existingCat] = await pool.query('SELECT id FROM service_categories WHERE name = ? OR slug = ?', [cat.name, cat.slug]);
      let catId;
      if (existingCat.length === 0) {
        const [res] = await pool.query(
          'INSERT INTO service_categories (name, slug, short_description, icon, display_order, status, featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [cat.name, cat.slug, cat.short_description, cat.icon, cat.display_order, 'Active', cat.featured]
        );
        catId = res.insertId;
      } else {
        catId = existingCat[0].id;
        await pool.query(
          'UPDATE service_categories SET status = "Active" WHERE id = ?',
          [catId]
        );
      }

      // Upsert the 4 sub-services per category
      for (const s of cat.services) {
        const [existingSvc] = await pool.query(
          'SELECT id FROM services WHERE slug = ? OR (category = ? AND title = ?)',
          [s.slug, cat.name, s.title]
        );
        const bulletsJson = JSON.stringify(s.bullets);
        const toolsJson = JSON.stringify(s.tools);

        if (existingSvc.length === 0) {
          await pool.query(
            'INSERT INTO services (category, category_id, title, slug, description, bullets, tools, banner_image, display_order, status, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [cat.name, catId, s.title, s.slug, s.description, bulletsJson, toolsJson, '/servicepage1.png', s.display_order, 'Active', 1]
          );
        } else {
          // Preserve all custom user edits in the database (description, bullets, tools, images, etc.) on server restart
          await pool.query(
            'UPDATE services SET category = ?, category_id = ?, status = "Active" WHERE id = ?',
            [cat.name, catId, existingSvc[0].id]
          );
        }
      }
    }

    // Archive (inactivate) any old service items not matching the 16 sub-services
    const validSubSlugs = requiredCategories.flatMap(c => c.services.map(s => s.slug));
    await pool.query('UPDATE services SET status = "Inactive" WHERE slug NOT IN (?) AND title NOT IN ("CAD", "BIM", "Laser Scanning", "Scan to BIM", "GSAS", "LEED", "Energy Audit", "Carbon Management", "Asset Twin", "System Integration", "Real-Time Monitoring", "Asset Management", "Remote Construction", "360° Capture", "AR Solutions", "Robotics")', [validSubSlugs]);
    await pool.query('UPDATE services SET status = "Inactive" WHERE category IN ("Telecom Services", "Telecom", "Digital Twin Services") OR category NOT IN ("Engineering Services", "Sustainability Services", "Digital Twin", "Construction Technology")');
    await pool.query('UPDATE service_categories SET status = "Inactive" WHERE name IN ("Telecom Services", "Telecom", "Digital Twin Services") OR name NOT IN ("Engineering Services", "Sustainability Services", "Digital Twin", "Construction Technology")');

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

