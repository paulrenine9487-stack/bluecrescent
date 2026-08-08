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

    // 7. Services Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        bullets TEXT, -- JSON Array
        tools TEXT, -- JSON Array
        banner_image LONGTEXT
      );
    `);

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
        division_type VARCHAR(100) NOT NULL DEFAULT 'Engineering Division',
        project_count INT DEFAULT 0,
        description TEXT,
        image LONGTEXT,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
        aboutUsHeroUrl LONGTEXT
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
    } catch (err) {
      console.warn('Altering company_settings columns warning:', err.message);
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
      await pool.query("INSERT INTO menus (name, url, parent_id, order_num) VALUES ('Engineering Division', 'Engineering Division', ?, 1)", [projectsId]);
      await pool.query("INSERT INTO menus (name, url, parent_id, order_num) VALUES ('Sustainability Division', 'Sustainability Division', ?, 2)", [projectsId]);
      await pool.query("INSERT INTO menus (name, url, parent_id, order_num) VALUES ('Digital Twin Division', 'Digital Twin Division', ?, 3)", [projectsId]);
    } else {
      // Dynamic migration for existing databases: ensure 'Media' exists
      const [hasMedia] = await pool.query("SELECT id FROM menus WHERE name = 'Media'");
      if (hasMedia.length === 0) {
        console.log('Migrating database: Adding Media menu item...');
        await pool.query("UPDATE menus SET order_num = 6 WHERE name = 'Contact Us'");
        await pool.query("INSERT INTO menus (name, url, order_num) VALUES ('Media', 'Media', 5)");
      }
      // Migrate Telecom Division to Digital Twin Division
      await pool.query("UPDATE menus SET name = 'Digital Twin Division', url = 'Digital Twin Division' WHERE name = 'Telecom Division'");
      await pool.query("UPDATE projects SET division_type = 'Digital Twin Division' WHERE division_type = 'Telecom Division'");

      // Migrate / Seed Digital Twin Services if missing
      const [dtRows] = await pool.query("SELECT COUNT(*) as count FROM services WHERE category = 'Digital Twin Services'");
      if (dtRows[0].count === 0) {
        console.log('Migrating database: Seeding Digital Twin Services...');
        const dtSeeds = [
          {
            category: 'Digital Twin Services',
            title: 'Life Cycle Twin Asset Management',
            description: 'Virtual representation of physical assets, integrating real-time IoT sensors and 3D space for facilities management and predictive maintenance.',
            bullets: JSON.stringify([
              'Real-time IoT sensor telemetry integration with 3D BIM models.',
              'Predictive maintenance schedules and asset health monitoring dashboard.',
              'Immersive virtual inspections and operational analytics overlay.',
              'COBie data integration and digital operations handover.'
            ]),
            tools: JSON.stringify([
              ['Autodesk Tandem', 'Azure Digital Twins'],
              ['Matterport 3D Pro', 'ThingWorx IoT']
            ]),
            banner_image: '/servicepage1.png'
          },
          {
            category: 'Digital Twin Services',
            title: 'Remote Work Automation',
            description: 'Industrial automation, control logic simulation, and remote work validation platforms for distributed teams.',
            bullets: JSON.stringify([
              'SCADA and PLC control systems logic simulation and remote testing.',
              'Collaborative virtual control room environments for remote operators.',
              'Safety training and hazard simulation in interactive 3D spaces.',
              'Cloud-based process monitoring and diagnostics pipeline.'
            ]),
            tools: JSON.stringify([
              ['Siemens SIMIT', 'Unity Industrial'],
              ['Wonderware SCADA', 'AWS IoT RoboRunner']
            ]),
            banner_image: '/servicepage1.png'
          },
          {
            category: 'Digital Twin Services',
            title: 'System Integration and Analysis',
            description: 'Pipelining heterogeneous system APIs, legacy database schemas, and spatial maps into a unified enterprise operations hub.',
            bullets: JSON.stringify([
              'REST/GraphQL API middleware development for legacy system connectivity.',
              'Data ingestion and normalization pipelines from raw log streams.',
              'Cross-platform analytics dashboards and operational reports.',
              'Cybersecurity isolation and secure tunnel architecture for remote nodes.'
            ]),
            tools: JSON.stringify([
              ['Node-RED', 'Apache Kafka'],
              ['Grafana', 'Docker / Kubernetes']
            ]),
            banner_image: '/servicepage1.png'
          }
        ];
        for (const s of dtSeeds) {
          await pool.query(
            'INSERT INTO services (category, title, description, bullets, tools, banner_image) VALUES (?, ?, ?, ?, ?, ?)',
            [s.category, s.title, s.description, s.bullets, s.tools, s.banner_image]
          );
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

    // Clean up old and seed new Sustainability Services
    const [sustRows] = await pool.query("SELECT COUNT(*) as count FROM services WHERE category = 'Sustainability Services' AND title IN ('GSAS Service', 'LEED Consulting Services', 'Energy Audit and Analysis', 'ISO 14064 Consulting Services')");
    if (sustRows[0].count < 4) {
      console.log('Migrating Sustainability Services in MySQL database...');
      await pool.query("DELETE FROM services WHERE category = 'Sustainability Services'");
      const sustSeeds = [
        {
          category: 'Sustainability Services',
          title: 'GSAS Service',
          description: 'GSAS (Global Sustainability Assessment System) certification management, green building compliance facilitation, and design and construction consulting for commercial, residential, and institutional projects.',
          bullets: JSON.stringify([
            'GSAS Design & Build Certification management (1-Star to 5-Star).',
            'GSAS Construction Management facilitation and site auditing.',
            'Energy & Water optimization studies conforming to GSAS standards.',
            'Indoor Environmental Quality (IEQ) assessment and daylight simulation.',
            'Materials & lifecycle assessment (LCA) matching GSAS requirements.'
          ]),
          tools: JSON.stringify([
            ['GSAS Gate Tool', 'IES VE'],
            ['Sefaira', 'One Click LCA']
          ]),
          banner_image: '/servicepage1.png'
        },
        {
          category: 'Sustainability Services',
          title: 'LEED Consulting Services',
          description: 'LEED (Leadership in Energy and Environmental Design) consulting and certification management from concept design through to final USGBC audit and commissioning.',
          bullets: JSON.stringify([
            'LEED BD+C, ID+C, and O+M certification facilitation.',
            'Fundamental & Enhanced Commissioning (Cx) satisfying USGBC standards.',
            'Thermal comfort modeling, building energy simulation, and daylight calculations.',
            'Indoor air quality testing and green materials sourcing strategies.',
            'LEED Online portal management and submittal documentation compilation.'
          ]),
          tools: JSON.stringify([
            ['USGBC LEED v4/v4.1 Guidelines', 'IES VE'],
            ['CxAlloy Commissioning Platform', 'EnergyPlus']
          ]),
          banner_image: '/servicepage1.png'
        },
        {
          category: 'Sustainability Services',
          title: 'Energy Audit and Analysis',
          description: 'Comprehensive energy auditing and diagnostic analysis services to maximize operational energy efficiency and achieve regulatory sustainability compliance.',
          bullets: JSON.stringify([
            'ASHRAE Level 1, 2, and 3 (Investment Grade) Energy Audits.',
            'HVAC system thermal efficiency and central chiller plant optimization.',
            'Building envelope thermal imaging (infrared thermography) and testing.',
            'Electrical demand management, power quality analysis, and power factor correction.',
            'Renewable energy (Solar PV) integration and economic feasibility analysis.'
          ]),
          tools: JSON.stringify([
            ['FLIR Thermal Cameras', 'Power Quality Analyzers'],
            ['Data Loggers', 'eQUEST / EnergyPlus']
          ]),
          banner_image: '/servicepage1.png'
        },
        {
          category: 'Sustainability Services',
          title: 'ISO 14064 Consulting Services',
          description: 'Consulting services for Greenhouse Gas (GHG) inventory compilation, validation, and verification conforming to ISO 14064 international standards for carbon footprint auditing.',
          bullets: JSON.stringify([
            'ISO 14064-1: Organizational carbon footprint inventory and reporting.',
            'ISO 14064-2: Project-level GHG emission reduction quantification.',
            'ISO 14064-3: Validation and verification of GHG assertions.',
            'Product carbon footprinting and corporate sustainability auditing.',
            'Carbon offset and decarbonization roadmap strategy development.'
          ]),
          tools: JSON.stringify([
            ['GHG Protocol Suite', 'ISO 14064 Guidelines'],
            ['Carbon Calculation Tools', 'Decarbonization Models']
          ]),
          banner_image: '/servicepage1.png'
        }
      ];
      for (const s of sustSeeds) {
        await pool.query(
          'INSERT INTO services (category, title, description, bullets, tools, banner_image) VALUES (?, ?, ?, ?, ?, ?)',
          [s.category, s.title, s.description, s.bullets, s.tools, s.banner_image]
        );
      }
    }

    // Seed Services
    const [servicesRows] = await pool.query('SELECT COUNT(*) as count FROM services');
    if (servicesRows[0].count === 0) {
      console.log('Seeding services...');
      const servicesSeed = [
        {
          category: 'Engineering Services',
          title: 'Engineering Design support Services',
          description: 'We at Blue Crescent Engineering provide comprehensive Engineering Design Support Services spanning conceptual development, preliminary FEED engineering, detailed design calculations, and authority approval management across Qatar & GCC region.',
          bullets: JSON.stringify([
            'Comprehensive HVAC, Plumbing, Drainage, and Electrical Load Calculations.',
            'Structural Load Analysis, Foundation Design & Frame Modeling.',
            'Value Engineering & System Optimization to reduce CapEx & OpEx.',
            'Peer Review & Technical Audit of third-party engineering packages.',
            'Authority Approval Submissions (Kahramaa, Civil Defense, Ashghal, Qatar Municipality).'
          ]),
          tools: JSON.stringify([
            ['AutoCAD', 'HAP (Hourly Analysis Program)'],
            ['ETABS', 'SAFE'],
            ['STAAD.Pro', 'Revit MEP']
          ]),
          banner_image: '/servicepage1.png'
        },
        {
          category: 'Engineering Services',
          title: 'Specialised Simulation & Analysis',
          description: 'We, at Blue Crescent Engineering Specialised Simulation and Analysis offers advanced engineering solution for Acoustics, HVAC, Power, Oil & Gas domains. We add values to our clients by providing the following services which really helps our clients to acquire a good decision during the early stages of projects by averting any possible future foilmes.\n\nWe,Blue Crescent Engineering have collaborated with specialized service experts and providers to provide unique, feasible, cost effective, and environmental friendly solutions for our client\'s challenges by adopting the advanced tools like Numerical Methods, Simulation Algorithm and Finite Element Method with remarkable ease.',
          bullets: JSON.stringify([
            'CFD (Computational Fluid Dynamics) Analysis',
            'Piping Analysis (Fem)',
            'Structural Analysis',
            'Acoustic Study, Acoustic Analysis, Noise and Vibration Control'
          ]),
          tools: JSON.stringify([
            ['NASTRAN', 'ANSYS CFX'],
            ['FEMAP', 'FDS'],
            ['Open Cascade', 'Bentley PLUS'],
            ['ANSYS FLUENT', 'Bentley AUTOPIPE']
          ]),
          banner_image: '/servicepage1.png'
        },
        {
          category: 'Engineering Services',
          title: 'Engineering (MEP, Infrastructure, Transportation) shop Drawings - 2D',
          description: 'High-precision 2D CAD drafting and shop drawing development for Mechanical, Electrical, Plumbing (MEP) systems, civil infrastructure networks, and transportation corridors.',
          bullets: JSON.stringify([
            'Coordinated Mechanical, Electrical & Plumbing (MEP) 2D Shop Drawings.',
            'Infrastructure Utility Layouts (Stormwater, Foul Sewer, Potable Water, District Cooling).',
            'Road Alignment, Pavement Marking & Traffic Signage 2D Drawings.',
            'Builder’s Work & Penetration Coordination Drawings.',
            'As-Built Drawings & Record Documentation for Handover.'
          ]),
          tools: JSON.stringify([
            ['AutoCAD Electrical', 'AutoCAD MEP'],
            ['MicroStation', 'Civil 3D']
          ]),
          banner_image: '/servicepage1.png'
        },
        {
          category: 'Engineering Services',
          title: 'BIM Modelling - 3D',
          description: 'Advanced Building Information Modeling (BIM) services up to LOD 500, enabling clash-free multi-disciplinary coordination, 4D construction scheduling, and 5D quantity extraction.',
          bullets: JSON.stringify([
            'Multi-Disciplinary 3D BIM Model Creation (Architectural, Structural, MEP).',
            'Automated Clash Detection & Matrix Resolution (Navisworks Manage).',
            '4D Construction Sequencing & Phasing Visualizations.',
            '5D Quantity Take-off (QTO) & Cost Estimation Integration.',
            'COBie Data Integration & Scan-to-BIM Point Cloud Modeling.'
          ]),
          tools: JSON.stringify([
            ['Autodesk Revit', 'Navisworks Manage'],
            ['Solibri Model Checker', 'BIM 360 / Autodesk Construction Cloud']
          ]),
          banner_image: '/servicepage1.png'
        },
        {
          category: 'Engineering Services',
          title: 'Outsourcing Technical Experts',
          description: 'Deployment of highly qualified, specialized engineering personnel and technical experts to client site teams and project management offices across Qatar and the Gulf region.',
          bullets: JSON.stringify([
            'Senior MEP Project Engineers & Technical Coordinators.',
            'Certified BIM Managers, Coordinators & Modellers.',
            'Structural, Civil & Infrastructure Senior Engineers.',
            'Certified QA/QC Inspectors & HSE Safety Managers.',
            'Contract Specialists, Cost Engineers & Commercial Managers.'
          ]),
          tools: JSON.stringify([
            ['On-Demand Talent Scaling', 'Deep Local Qatar Market Expertise'],
            ['Immediate Site Mobilization', 'Full Regulatory Compliance']
          ]),
          banner_image: '/servicepage1.png'
        },
        {
          category: 'Sustainability Services',
          title: 'Energy Auditing',
          description: 'Comprehensive energy audit services tailored for commercial, residential, healthcare, and industrial facilities to maximize energy efficiency and comply with Qatar National Sustainability Standards.',
          bullets: JSON.stringify([
            'ASHRAE Level 1 (Walk-Through), Level 2 (Energy Survey), and Level 3 (Investment Grade) Audits.',
            'HVAC System Thermal Performance & Chiller Plant Efficiency Audits.',
            'Building Envelope Thermal Imaging (Infrared Thermography) & Blower Door Testing.',
            'Power Quality Analysis, Power Factor Correction & Electrical Peak Demand Management.',
            'Renewable Energy (Solar PV) Feasibility & Energy Conservation Measure (ECM) ROI Reports.'
          ]),
          tools: JSON.stringify([
            ['FLIR Thermal Cameras', 'Power Quality Analyzers'],
            ['Data Loggers', 'eQUEST / EnergyPlus']
          ]),
          banner_image: '/servicepage1.png'
        },
        {
          category: 'Sustainability Services',
          title: 'Commissioning LEED & GSAS',
          description: 'Independent 3rd-Party Commissioning Authority (CxA) services ensuring building systems operate according to design intent and satisfy LEED & GSAS sustainability requirements.',
          bullets: JSON.stringify([
            'Fundamental & Enhanced Commissioning for LEED (BD+C, ID+C, O+M).',
            'GSAS (Global Sustainability Assessment System) Mandatory Cx Certification.',
            'Re-Commissioning & Retro-Commissioning of Existing Operational Buildings.',
            'Pre-Functional Checklists, Functional Performance Testing (FPT), and Integrated Systems Testing (IST).',
            'O&M Manual Verification, Staff Training Supervision, and 10-Month Warranty Reviews.'
          ]),
          tools: JSON.stringify([
            ['GSAS 2019 / 2022 Guidelines', 'USGBC LEED v4 / v4.1 Standards'],
            ['CxAlloy Commissioning Platform', 'Calibrated Testing Instruments']
          ]),
          banner_image: '/servicepage1.png'
        },
        {
          category: 'Sustainability Services',
          title: 'Green Building Facilitation',
          description: 'Full lifecycle green building consulting, facilitating GSAS & LEED certifications from concept design stage through to final award and handover.',
          bullets: JSON.stringify([
            'GSAS 1-Star to 5-Star Rating Facilitation & Documentation Management.',
            'LEED Certified, Silver, Gold & Platinum Certification Management.',
            'Life Cycle Assessment (LCA) & Embodied Carbon Footprint Calculations.',
            'Indoor Environmental Quality (IEQ) Studies, Daylight & Views Simulation.',
            'Water Conservation Strategy & Stormwater Management Consulting.'
          ]),
          tools: JSON.stringify([
            ['GSAS Gate Tool', 'IES VE'],
            ['Sefaira', 'One Click LCA']
          ]),
          banner_image: '/servicepage1.png'
        },
        {
          category: 'Telecom Services',
          title: 'Fiber Optic (Indoor & Outdoor)',
          description: 'Turnkey fiber optic network engineering, encompassing indoor structured cabling, outdoor long-haul backbone networks, and FTTH (Fiber-To-The-Home) deployment.',
          bullets: JSON.stringify([
            'Single-Mode (OS2) and Multi-Mode (OM3/OM4/OM5) Fiber Infrastructure Design.',
            'Outdoor Duct Network, Handhole & Manhole Infrastructure Routing.',
            'Fusion Splicing, Termination, and OTDR Trace Testing & Certification.',
            'FTTH (Fiber-to-the-Home) & FTTB (Fiber-to-the-Building) Passive Optical Networks.',
            'Ooredoo & Vodafone Qatar Service Provider Interface Coordination.'
          ]),
          tools: JSON.stringify([
            ['EXFO OTDR Testers', 'Fujikura Fusion Splicers'],
            ['Fluke Networks Cable Analyzer', 'AutoCAD Telecom']
          ]),
          banner_image: '/servicepage1.png'
        },
        {
          category: 'Telecom Services',
          title: 'Cellular (IBS & Outdoor Sites)',
          description: 'In-Building Solutions (IBS) and Outdoor Cell Site engineering for seamless 4G LTE & 5G NR mobile coverage across Qatar’s iconic towers, stadiums, and infrastructure.',
          bullets: JSON.stringify([
            'Active & Passive Distributed Antenna System (DAS) Design for IBS.',
            'Small Cell & Femtocell Indoor Coverage Planning for High-Rise Buildings.',
            'Outdoor Macro Cell Tower Foundation, Pole Mount & Monopole Engineering.',
            'RF Field Survey, CW Propagation Testing & Drive Test Optimization.',
            'Service Provider (Ooredoo / Vodafone) Approval & Site Integration.'
          ]),
          tools: JSON.stringify([
            ['iBwave Design', 'TEMS Investigation'],
            ['Anritsu Site Master', 'NEMO Outdoor']
          ]),
          banner_image: '/servicepage1.png'
        },
        {
          category: 'Telecom Services',
          title: 'Microwave Links',
          description: 'High-capacity Wireless Backhaul Point-to-Point (P2P) and Point-to-Multipoint (P2MP) microwave network design and line-of-sight validation.',
          bullets: JSON.stringify([
            'Line-of-Sight (LOS) Path Survey & Fresnel Zone Clearance Analysis.',
            'Microwave Link Budget Calculation, Availability & Rain Fade Modeling.',
            'High-Frequency (6GHz to 80GHz E-Band) Microwave Equipment Specification.',
            'Antenna Mounting Structure, Tower Wind Load & Structural Stress Analysis.',
            'Regulatory Spectrum Licensing & Frequency Coordination Support.'
          ]),
          tools: JSON.stringify([
            ['Pathloss 5', 'Planet RF'],
            ['TEMS Microwave', 'Pathfinder']
          ]),
          banner_image: '/servicepage1.png'
        },
        {
          category: 'Telecom Services',
          title: 'Wi-Fi Systems',
          description: 'High-density enterprise Wi-Fi 6 / 6E / 7 wireless network architecture for commercial offices, luxury hotels, educational campuses, and industrial facilities.',
          bullets: JSON.stringify([
            'Predictive & On-Site Active Wi-Fi Heatmap Survey (Ekahau AI Pro).',
            'Access Point (AP) Location Optimization & Channel Allocation Planning.',
            'Enterprise WLAN Controller Configuration & High-Availability Mesh Architecture.',
            'Guest Portal, Captive Portal & Bandwidth Management Integration.',
            'Post-Deployment Validation, Signal Strength (RSSI) & SNR Optimization.'
          ]),
          tools: JSON.stringify([
            ['Ekahau AI Pro', 'Sidekick 2'],
            ['AirMagnet WiFi Analyzer', 'Cisco Catalyst Center']
          ]),
          banner_image: '/servicepage1.png'
        }
      ];

      for (const s of servicesSeed) {
        await pool.query(
          'INSERT INTO services (category, title, description, bullets, tools, banner_image) VALUES (?, ?, ?, ?, ?, ?)',
          [s.category, s.title, s.description, s.bullets, s.tools, s.banner_image]
        );
      }
    }

    // Seed Hero Slides
    const [heroRows] = await pool.query('SELECT COUNT(*) as count FROM hero_slides');
    if (heroRows[0].count === 0) {
      console.log('Seeding hero slides...');
      await pool.query(`
        INSERT INTO hero_slides (title, subtitle, btn1_text, btn2_text, image, status, order_num) VALUES 
        ('Engineering Excellence, Building a Better Tomorrow.', 'Blue Crescent Engineering delivers innovative, sustainable and reliable engineering solutions across the globe.', 'Explore Our Services', 'Get a Consultation', NULL, 'published', 1),
        ('Innovative Solutions For Complex Challenges', 'We combine technology, expertise and commitment to deliver outstanding results.', 'Our Services', 'View Projects', '/simulation.png', 'published', 2),
        ('Building Today. Sustaining Tomorrow.', 'Committed to quality, safety and sustainability in every project we deliver.', 'View Projects', 'Contact Us', '/why.png', 'published', 3),
        ('Global Presence. Trusted by Partners Worldwide.', 'Delivering engineering excellence in 25+ countries with 500+ successful projects.', 'About Us', 'Get In Touch', '/aerial_city_hero.png', 'draft', 4),
        ('Shaping Infrastructure. Improving Lives.', 'From concept to completion, we build infrastructure that makes a lasting impact.', 'Our Work', 'Contact Us', '/eng_tower.png', 'published', 5)
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

