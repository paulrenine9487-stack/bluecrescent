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

  // Custom static fallback data map for all 12 sub-services
  const staticServiceDetailsMap = {
    'Engineering Design support Services': {
      description: 'We at Blue Crescent Engineering provide comprehensive Engineering Design Support Services spanning conceptual development, preliminary FEED engineering, detailed design calculations, and authority approval management across Qatar & GCC region.',
      bulletsTitle: 'Key Design Support Services Include:',
      bullets: [
        'Comprehensive HVAC, Plumbing, Drainage, and Electrical Load Calculations.',
        'Structural Load Analysis, Foundation Design & Frame Modeling.',
        'Value Engineering & System Optimization to reduce CapEx & OpEx.',
        'Peer Review & Technical Audit of third-party engineering packages.',
        'Authority Approval Submissions (Kahramaa, Civil Defense, Ashghal, Qatar Municipality).'
      ],
      tools: [
        ['AutoCAD', 'HAP (Hourly Analysis Program)'],
        ['ETABS', 'SAFE'],
        ['STAAD.Pro', 'Revit MEP']
      ]
    },
    '2D CAD Drafting Services': {
      description: 'High-precision 2D CAD drafting and shop drawing development for Mechanical, Electrical, Plumbing (MEP) systems, civil infrastructure networks, and transportation corridors.',
      bulletsTitle: 'Key Shop Drawing Deliverables Include:',
      bullets: [
        'Coordinated Mechanical, Electrical & Plumbing (MEP) 2D Shop Drawings.',
        'Infrastructure Utility Layouts (Stormwater, Foul Sewer, Potable Water, District Cooling).',
        'Road Alignment, Pavement Marking & Traffic Signage 2D Drawings.',
        'Builder’s Work & Penetration Coordination Drawings.',
        'As-Built Drawings & Record Documentation for Handover.'
      ],
      tools: [
        ['AutoCAD Electrical', 'AutoCAD MEP'],
        ['MicroStation', 'Civil 3D']
      ]
    },
    'BIM Services': {
      description: 'Advanced Building Information Modeling (BIM) services up to LOD 500, enabling clash-free multi-disciplinary coordination, 4D construction scheduling, and 5D quantity extraction. Blue Crescent Engineering delivers BIM solutions that reduce rework, improve collaboration, and drive data-rich handovers across the full project lifecycle.',
      bulletsTitle: 'Key BIM Capabilities Include:',
      bullets: [
        'Multi-Disciplinary 3D BIM Model Creation (Architectural, Structural, MEP) to LOD 500.',
        'Automated Clash Detection & Matrix Resolution using Navisworks Manage.',
        '4D Construction Sequencing & Phasing Visualizations linked to project schedules.',
        '5D Quantity Take-off (QTO) & Cost Estimation Integration with project controls.',
        'COBie Data Integration & Scan-to-BIM Point Cloud Modeling for existing structures.',
        'BIM Execution Plan (BEP) preparation and Common Data Environment (CDE) management.',
        'ISO 19650 compliant BIM delivery and digital handover documentation.'
      ],
      tools: [
        ['Autodesk Revit', 'Navisworks Manage'],
        ['Solibri Model Checker', 'BIM 360 / Autodesk Construction Cloud'],
        ['Autodesk Civil 3D', 'Bentley OpenBuildings']
      ]
    },
    'Outsourcing Technical Experts': {
      description: 'Deployment of highly qualified, specialized engineering personnel and technical experts to client site teams and project management offices across Qatar and the Gulf region.',
      bulletsTitle: 'Specialized Personnel Available for Deployment:',
      bullets: [
        'Senior MEP Project Engineers & Technical Coordinators.',
        'Certified BIM Managers, Coordinators & Modellers.',
        'Structural, Civil & Infrastructure Senior Engineers.',
        'Certified QA/QC Inspectors & HSE Safety Managers.',
        'Contract Specialists, Cost Engineers & Commercial Managers.'
      ],
      tools: [
        ['On-Demand Talent Scaling', 'Deep Local Qatar Market Expertise'],
        ['Immediate Site Mobilization', 'Full Regulatory Compliance']
      ]
    },
    'GSAS Service': {
      description: 'GSAS (Global Sustainability Assessment System) certification management, green building compliance facilitation, and design and construction consulting for commercial, residential, and institutional projects.',
      bulletsTitle: 'GSAS Services Include:',
      bullets: [
        'GSAS Design & Build Certification management (1-Star to 5-Star).',
        'GSAS Construction Management facilitation and site auditing.',
        'Energy & Water optimization studies conforming to GSAS standards.',
        'Indoor Environmental Quality (IEQ) assessment and daylight simulation.',
        'Materials & lifecycle assessment (LCA) matching GSAS requirements.'
      ],
      tools: [
        ['GSAS Gate Tool', 'IES VE'],
        ['Sefaira', 'One Click LCA']
      ]
    },
    'LEED Consulting Services': {
      description: 'LEED (Leadership in Energy and Environmental Design) consulting and certification management from concept design through to final USGBC audit and commissioning.',
      bulletsTitle: 'LEED Services Include:',
      bullets: [
        'LEED BD+C, ID+C, and O+M certification facilitation.',
        'Fundamental & Enhanced Commissioning (Cx) satisfying USGBC standards.',
        'Thermal comfort modeling, building energy simulation, and daylight calculations.',
        'Indoor air quality testing and green materials sourcing strategies.',
        'LEED Online portal management and submittal documentation compilation.'
      ],
      tools: [
        ['USGBC LEED v4/v4.1 Guidelines', 'IES VE'],
        ['CxAlloy Commissioning Platform', 'EnergyPlus']
      ]
    },
    'Energy Audit and Analysis': {
      description: 'Comprehensive energy auditing and diagnostic analysis services to maximize operational energy efficiency and achieve regulatory sustainability compliance.',
      bulletsTitle: 'Energy Audit & Analysis Scope:',
      bullets: [
        'ASHRAE Level 1, 2, and 3 (Investment Grade) Energy Audits.',
        'HVAC system thermal efficiency and central chiller plant optimization.',
        'Building envelope thermal imaging (infrared thermography) and testing.',
        'Electrical demand management, power quality analysis, and power factor correction.',
        'Renewable energy (Solar PV) integration and economic feasibility analysis.'
      ],
      tools: [
        ['FLIR Thermal Cameras', 'Power Quality Analyzers'],
        ['Data Loggers', 'eQUEST / EnergyPlus']
      ]
    },
    'ISO 14064 Consulting Services': {
      description: 'Consulting services for Greenhouse Gas (GHG) inventory compilation, validation, and verification conforming to ISO 14064 international standards for carbon footprint auditing.',
      bulletsTitle: 'ISO 14064 Consulting Scope:',
      bullets: [
        'ISO 14064-1: Organizational carbon footprint inventory and reporting.',
        'ISO 14064-2: Project-level GHG emission reduction quantification.',
        'ISO 14064-3: Validation and verification of GHG assertions.',
        'Product carbon footprinting and corporate sustainability auditing.',
        'Carbon offset and decarbonization roadmap strategy development.'
      ],
      tools: [
        ['GHG Protocol Suite', 'ISO 14064 Guidelines'],
        ['Carbon Calculation Tools', 'Decarbonization Models']
      ]
    },
    'Life Cycle Twin Asset Management': {
      description: 'Our Life Cycle Twin Asset Management service leverages Digital Twin technology to monitor, simulate, and optimize physical assets across their entire lifecycle — from design and construction through operation and decommissioning — delivering unprecedented visibility and control over asset performance.',
      bulletsTitle: 'Key Life Cycle Twin Capabilities:',
      bullets: [
        'Real-time asset health monitoring using IoT sensor integration and AI-driven analytics.',
        'Predictive maintenance scheduling based on twin simulation data to reduce downtime.',
        'Asset performance benchmarking against design intent across full operational lifespan.',
        'Digital handover documentation (COBie, IFC) linked to live twin models.',
        'End-of-life decommissioning simulations for cost-effective asset retirement planning.',
        'Integration with CMMS/EAM platforms for seamless facility management workflows.'
      ],
      tools: [
        ['Autodesk Tandem', 'Bentley iTwin Platform'],
        ['Azure Digital Twins', 'IBM Maximo / SAP PM'],
        ['Siemens MindSphere', 'AVEVA Asset Performance Management']
      ]
    },
    'Remote Work Automation': {
      description: 'Blue Crescent Engineering\'s Remote Work Automation service harnesses Digital Twin environments to automate complex operational workflows, remote inspections, and process controls — enabling engineering teams to manage assets and systems from anywhere in the world with precision and confidence.',
      bulletsTitle: 'Remote Work Automation Services Include:',
      bullets: [
        'Automated remote inspection workflows using drone integration and twin-synchronized imagery.',
        'Virtual commissioning and remote FAT (Factory Acceptance Testing) through Digital Twin replicas.',
        'Remote SCADA/PLC simulation and control via Digital Twin dashboards.',
        'Automated anomaly detection and alert escalation using AI-powered twin analytics.',
        'Cloud-based collaborative engineering workspaces eliminating on-site constraints.',
        'Remote training simulation environments for field technicians and operators.'
      ],
      tools: [
        ['AVEVA System Platform', 'Emerson DeltaV Digital Twin'],
        ['Honeywell Connected Plant', 'GE Digital APM'],
        ['PTC ThingWorx', 'Rockwell FactoryTalk']
      ]
    },
    'System Integration and Analysis': {
      description: 'Our System Integration and Analysis service provides end-to-end connectivity between heterogeneous engineering systems, IoT platforms, operational technology (OT), and enterprise IT — creating a unified Digital Twin ecosystem that drives smarter decisions, faster responses, and optimized performance.',
      bulletsTitle: 'System Integration & Analysis Scope:',
      bullets: [
        'OT/IT convergence architecture design connecting PLCs, SCADA, BMS, and ERP systems.',
        'API-driven integration of multi-vendor IoT platforms and sensor data streams.',
        'Digital Twin federated model management across BIM, GIS, and simulation platforms.',
        'Data normalization, cleansing, and real-time analytics pipeline configuration.',
        'Interoperability compliance with ISO 19650, IEC 62443, and MQTT/OPC-UA protocols.',
        'Custom dashboard and reporting toolchain development for stakeholder visibility.'
      ],
      tools: [
        ['Microsoft Azure IoT Hub', 'AWS IoT Greengrass'],
        ['MuleSoft / Boomi Integration', 'OPC-UA / MQTT Brokers'],
        ['Esri ArcGIS Digital Twin', 'Trimble Connect']
      ]
    }
  };

  // Convert dynamicServices database list to map structure
  const resolvedServiceDetailsMap = {};
  dynamicServices.forEach(s => {
    let bulletsParsed = [];
    let toolsParsed = null;
    try {
      bulletsParsed = typeof s.bullets === 'string' ? JSON.parse(s.bullets) : (s.bullets || []);
      toolsParsed = typeof s.tools === 'string' ? JSON.parse(s.tools) : (s.tools || null);
    } catch (e) {
      console.error('Error parsing bullets/tools in ServicesPage:', e);
    }
    resolvedServiceDetailsMap[s.title] = {
      description: s.description,
      bulletsTitle: 'Key Scope & Deliverables Include:',
      bullets: bulletsParsed,
      tools: toolsParsed,
      banner_image: s.banner_image || ''
    };
  });

  const serviceDetailsMap = dynamicServices.length > 0 ? resolvedServiceDetailsMap : staticServiceDetailsMap;
  const selectedDetails = serviceDetailsMap[currentServiceTitle];

  // Resolve banner image dynamically
  const getBannerForService = (title) => {
    if (!title) return serviceBanner;
    const lower = title.toLowerCase();
    if (lower.includes('telecom') || lower.includes('ibs') || lower.includes('cellular') || lower.includes('microwave') || lower.includes('wi-fi') || lower.includes('antenna')) {
      return projectBanner;
    }
    if (lower.includes('sustainability') || lower.includes('gsas') || lower.includes('leed') || lower.includes('commissioning') || lower.includes('environment') || lower.includes('acoustic') || lower.includes('noise')) {
      return aboutBanner;
    }
    return serviceBanner;
  };

  const bannerToDisplay = (selectedDetails && selectedDetails.banner_image) 
    ? selectedDetails.banner_image 
    : getBannerForService(currentServiceTitle);

  // Resolve Categories list dynamically
  const categoryGroups = {
    'Engineering Services': [],
    'Sustainability Services': [],
    'Digital Twin Services': []
  };

  if (dynamicServices.length > 0) {
    dynamicServices
      .filter(s => !s.category.toLowerCase().includes('telecom'))
      .filter(s => !['Engineering Design support Services', 'Specialised Simulation & Analysis', 'BIM Modelling - 3D', 'Engineering (MEP, Infrastructure, Transportation) shop Drawings - 2D'].includes(s.title))
      .forEach(s => {
        if (!categoryGroups[s.category]) {
          categoryGroups[s.category] = [];
        }
        categoryGroups[s.category].push(s.title);
      });

    // Always guarantee Engineering Services has exactly these two items
    if (categoryGroups['Engineering Services'].length === 0) {
      categoryGroups['Engineering Services'] = ['BIM Services', '2D CAD Drafting Services', 'Outsourcing Technical Experts'];
    } else {
      if (!categoryGroups['Engineering Services'].includes('BIM Services'))
        categoryGroups['Engineering Services'].unshift('BIM Services');
      if (!categoryGroups['Engineering Services'].includes('2D CAD Drafting Services'))
        categoryGroups['Engineering Services'].splice(1, 0, '2D CAD Drafting Services');
      if (!categoryGroups['Engineering Services'].includes('Outsourcing Technical Experts'))
        categoryGroups['Engineering Services'].push('Outsourcing Technical Experts');
    }

    // Always ensure Digital Twin Services items appear
    if (categoryGroups['Digital Twin Services'].length === 0) {
      categoryGroups['Digital Twin Services'] = [
        'Life Cycle Twin Asset Management',
        'Remote Work Automation',
        'System Integration and Analysis'
      ];
    }
  } else {
    categoryGroups['Engineering Services'] = [
      'BIM Services',
      '2D CAD Drafting Services',
      'Outsourcing Technical Experts'
    ];
    categoryGroups['Sustainability Services'] = [
      'GSAS Service',
      'LEED Consulting Services',
      'Energy Audit and Analysis',
      'ISO 14064 Consulting Services'
    ];
    categoryGroups['Digital Twin Services'] = [
      'Life Cycle Twin Asset Management',
      'Remote Work Automation',
      'System Integration and Analysis'
    ];
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

                {/* Render Specialised Simulation & Analysis View */}
                {currentServiceTitle === 'Specialised Simulation & Analysis' ? (
                  <>
                    <div className="service-flex-block">
                      <div className="service-text-wrap">
                        <p className="paragraph-text">
                          We, at Blue Crescent Engineering Specialised Simulation and Analysis offers advanced engineering solution for Acoustics, HVAC, Power, Oil & Gas domains. We add values to our clients by providing the following services which really helps our clients to acquire a good decision during the early stages of projects by averting any possible future foilmes.
                        </p>
                        <p className="paragraph-text">
                          We,Blue Crescent Engineering have collaborated with specialized service experts and providers to provide unique, feasible, cost effective, and environmental friendly solutions for our client's challenges by adopting the advanced tools like Numerical Methods, Simulation Algorithm and Finite Element Method with remarkable ease.
                        </p>
                        <p className="paragraph-text">
                          The Key aspects of our Specialised Simulation and Analysis services includes,
                        </p>

                        <ul className="bullet-list">
                          <li>CFD (Computational Fluid Dynamics) Analysis</li>
                          <li>Piping Analysis (Fem)</li>
                          <li>Structural Analysis</li>
                          <li>Acoustic Study, Acoustic Analysis, Noise and Vibration Control</li>
                        </ul>
                      </div>

                      {/* Side Simulation Visualizations */}
                      <div className="service-image-sidebar">
                        <img 
                          src="/cfd_building_airflow.png"
                          alt="CFD Building Airflow Simulation" 
                          className="service-img"
                        />
                        <img 
                          src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'><rect width='100%' height='100%' fill='%230f172a'/><g stroke='%2322c55e' stroke-width='1.5' fill='none'><rect x='60' y='30' width='180' height='140'/><line x1='60' y1='65' x2='240' y2='65' stroke='%23eab308'/><line x1='60' y1='100' x2='240' y2='100' stroke='%23ef4444'/><line x1='60' y1='135' x2='240' y2='135' stroke='%2306b6d4'/><line x1='120' y1='30' x2='120' y2='170'/><line x1='180' y1='30' x2='180' y2='170'/></g><text x='85' y='188' fill='%2394a3b8' font-family='sans-serif' font-size='10'>MULTI-STORY BUILDING STRESS MAP</text></svg>"
                          alt="Multi-story Stress Map" 
                          className="service-img"
                        />
                      </div>
                    </div>

                    {/* Section 2: CFD Analysis */}
                    <h3 className="section-heading-grey" style={{ fontSize: '24px', color: '#55606e' }}>
                      CFD Analysis
                    </h3>
                    <p className="paragraph-text">
                      This most Advanced Simulation technology can apply in various stages of building design to make buildings better with regard to safety, energy efficiency, comfort and health. Some applications of CFD Analysis,
                    </p>
                    
                    <div className="service-flex-block">
                      <div className="service-text-wrap">
                        <ul className="bullet-list">
                          <li>Temperature, Humidity and Velocity Simulation for Human Comfort</li>
                          <li>Smoke Simulations- Atrium Ventilation and Tunnel Ventilation</li>
                          <li>The are IAQ Simulations- Car park Ventilation and Mining Ventilation</li>
                          <li>Design Optimization for Cooling Towers and Diffusers in Thermal Storage Tanks</li>
                          <li>Optimization of Turbo Machineries, Simulation of Boilers and Steam Generators</li>
                          <li>Flow Simulation and Analysis in Mixing Tanks, Heat Exchangers and Erosion Tubes.</li>
                          <li>Fire Evacuation Modelling</li>
                          <li>Offshore Rig Wind and Wave Analysis ( mainly in Oil and Gas Sector)</li>
                          <li>CFD for oil and Gas Piping – Environmental Condition Impact on Oil & Gas Process</li>
                          <li>Fuel Tank Sloshing Analysis</li>
                        </ul>
                      </div>

                      <div className="service-image-sidebar">
                        <img 
                          src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='160' viewBox='0 0 300 160'><rect width='100%' height='100%' fill='%230284c7'/><circle cx='150' cy='80' r='50' fill='none' stroke='%23fef08a' stroke-width='4'/><path d='M100 80 Q150 20 200 80 T300 80' fill='none' stroke='%23ffffff' stroke-width='2'/><text x='75' y='145' fill='%23ffffff' font-family='sans-serif' font-size='10'>OFFSHORE RIG & PIPING 3D MODEL</text></svg>"
                          alt="Offshore Rig Piping Model" 
                          className="service-img"
                        />
                        <img 
                          src="/simulation.png" 
                          alt="CFD Spiral Vector Analysis" 
                          className="service-img"
                        />
                      </div>
                    </div>

                    {/* Section 3: Piping Analysis */}
                    <h3 className="section-heading-grey" style={{ fontSize: '24px', color: '#55606e' }}>
                      Piping Analysis
                    </h3>
                    <p className="paragraph-text">
                      Finite Element Method along with aero-acoustic analysis is the tool used for doing the comprehensive piping network analysis. It is necessary to evaluate the mechanical behavior of the piping under regular loads (Internal pressure and thermal stresses) as well under occasional and intermittent loading cases such as noise, expansion, seismic loads or earthquake, high wind of special vibration, and water hammer. As the Piping network is complicated due to fluid-structure coupling an organized study and Analysis is required considering all the dissemination's. Some applications of Piping Analysis,
                    </p>
                    <ul className="bullet-list">
                      <li>Thermal, Stress, Expansion and Seismic Analysis</li>
                      <li>Pulsation Analysis (mainly in Oil and Gas Sectors)</li>
                      <li>Surge Analysis</li>
                      <li>Flow Assurance Analysis (mainly in Oil and Gas Sectors)</li>
                    </ul>

                    {/* Section 4: Structural Analysis */}
                    <h3 className="section-heading-grey" style={{ fontSize: '24px', color: '#55606e' }}>
                      Structural Analysis
                    </h3>
                    <p className="paragraph-text">
                      Finite Element Method is the tool used to calculate the strength and failure properties of solids.The structures need to be designed based on the analysis of Material strength for various load conditions and simulation of stresses developed in structures for static and dynamic loads. Some applications of Structural Analysis,
                    </p>

                    <ul className="bullet-list">
                      <li>
                        <strong>Seismic Analysis includes,</strong>
                        <ul className="nested-bullet-list">
                          <li>Equivalent Static Analysis</li>
                          <li>Response Spectrum Analysis</li>
                          <li>Linear Dynamic Analysis</li>
                          <li>Non-Linear Static Analysis and</li>
                          <li>Non-Linear Dynamic Analysis</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Vibration Isolation System Design Includes,</strong>
                        <ul className="nested-bullet-list">
                          <li>Design of Vibration Isolators for Structures and heavy machineries</li>
                          <li>Design of shock mounts for equipments and structures</li>
                          <li>Design of foundation for buildings to improve resistance to earthquakes.</li>
                          <li>Design of foundation for buildings to improve resistance to earthquakes.</li>
                        </ul>
                      </li>
                    </ul>

                    {/* Section 5: Simulation Tools Table */}
                    <div className="tools-section">
                      <h3 className="tools-title">Tools</h3>
                      <table className="tools-table">
                        <tbody>
                          <tr>
                            <td>NASTRAN</td>
                            <td>ANSYS CFX</td>
                          </tr>
                          <tr>
                            <td>FEMAP</td>
                            <td>FDS</td>
                          </tr>
                          <tr>
                            <td>Open Cascade</td>
                            <td>Bentley PLUS</td>
                          </tr>
                          <tr>
                            <td>ANSYS FLUENT</td>
                            <td>Bentley AUTOPIPE</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Section 6: Acoustic Study, Analysis, Noise and Vibration Control */}
                    <h3 className="section-heading-grey" style={{ fontSize: '24px', color: '#55606e', marginTop: '40px' }}>
                      Acoustic Study,Analysis,Noise and Vibration Control
                    </h3>

                    <h4 className="service-subheading" style={{ fontSize: '18px', color: '#637180', fontWeight: '400', marginTop: '16px' }}>
                      Architectural and Engineering Acoustics
                    </h4>
                    <p className="paragraph-text">
                      Our Acoustic services ranges from basic design support for individual residences to studies for major transportation systems, hotels, retail centers, offices, civic and condominium projects. Recommendations to achieve industry standards for acoustical performance by providing detailed report based on methods of standard engineering practices. We support our clients to achieve a comfortable atmosphere by providing feasible, cost effective and unique recommendations that is fully integrated to the design teams such as Architecture, Structure and Mechanical design.
                    </p>

                    <h4 className="service-subheading" style={{ fontSize: '18px', color: '#637180', fontWeight: '400', marginTop: '24px' }}>
                      Products
                    </h4>
                    <ul className="bullet-list">
                      <li>Floating Floors</li>
                      <li>Acoustic Panels</li>
                      <li>Acoustic Barriers</li>
                      <li>Acoustic Doors</li>
                      <li>Inertia Bases</li>
                      <li>Sound Attenuators</li>
                      <li>Acoustic Louvers</li>
                    </ul>

                    {/* Section 7: Acoustic Tools Table */}
                    <div className="tools-section">
                      <h3 className="tools-title">Tools</h3>
                      <table className="tools-table">
                        <tbody>
                          <tr>
                            <td>DIRAC</td>
                            <td>Control Rome Calculator</td>
                          </tr>
                          <tr>
                            <td>ODEON</td>
                            <td>Porous Abcorber Calculator</td>
                          </tr>
                          <tr>
                            <td>Duct Noise Calculator</td>
                            <td>Speech Re-inforcement Calculator</td>
                          </tr>
                          <tr>
                            <td>Acoustic Tools</td>
                            <td>RION Sound Level Meter</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : selectedDetails ? (
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
                        Digital Twin Services
                      </div>
                    )}
                    <p className="paragraph-text">
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
                      <div className="tools-section" style={{ marginTop: '30px' }}>
                        <h3 className="tools-title">Tools & Frameworks</h3>
                        <table className="tools-table">
                          <tbody>
                            {selectedDetails.tools.map((row, rIdx) => (
                              <tr key={rIdx}>
                                <td>{row && row[0]}</td>
                                <td>{row && row[1]}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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





