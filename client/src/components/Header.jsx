import React, { useState, useEffect } from 'react';
import logoBlueImg from '../assets/logo1_transparent_blue.png';
import logoWhiteImg from '../assets/logo1_transparent_white.png';

export default function Header({ currentView = 'Home', activeSubTab = '', onNavigate }) {
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Dynamic Navigation & Services data states
  const [dynamicMenus, setDynamicMenus] = useState([]);
  const [dynamicServices, setDynamicServices] = useState([]);

  useEffect(() => {
    // Fetch menus
    fetch('/api/menus')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) setDynamicMenus(data);
      })
      .catch(err => console.warn('Menus fetch warning:', err));

    // Fetch services
    fetch('/api/services')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) setDynamicServices(data);
      })
      .catch(err => console.warn('Services fetch warning:', err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const credSection = document.querySelector('.credentials-full-section');
      if (credSection && currentView === 'Home') {
        const rect = credSection.getBoundingClientRect();
        if (rect.top <= 75) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      } else {
        if (window.scrollY > 50) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // Fallbacks
  const defaultNavItems = ['Home', 'About Us', 'Services', 'Projects', 'Contact Us'];
  const defaultProjectSubItems = ['Engineering Division', 'Sustainability Division', 'Telecom Division'];
  const defaultServiceCategories = [
    {
      name: 'Engineering Services',
      items: [
        'Engineering Design support Services',
        'Specialised Simulation & Analysis',
        'Engineering (MEP, Infrastructure, Transportation) shop Drawings - 2D',
        'BIM Modelling - 3D',
        'Outsourcing Technical Experts'
      ]
    },
    {
      name: 'Sustainability Services',
      items: [
        'Energy Auditing',
        'Commissioning LEED & GSAS',
        'Green Building Facilitation'
      ]
    },
    {
      name: 'Telecom Services',
      items: [
        'Fiber Optic (Indoor & Outdoor)',
        'Cellular (IBS & Outdoor Sites)',
        'Microwave Links',
        'Wi-Fi Systems'
      ]
    }
  ];

  // Resolve menus dynamically
  let navItems = defaultNavItems;
  let projectSubItems = defaultProjectSubItems;

  if (dynamicMenus.length > 0) {
    const rootMenus = dynamicMenus.filter(m => !m.parent_id).sort((a, b) => a.order_num - b.order_num);
    navItems = rootMenus.map(m => m.name);

    const projectsMenu = rootMenus.find(m => m.name.toLowerCase() === 'projects');
    if (projectsMenu) {
      const subMenus = dynamicMenus.filter(m => m.parent_id === projectsMenu.id).sort((a, b) => a.order_num - b.order_num);
      if (subMenus.length > 0) {
        projectSubItems = subMenus.map(m => m.name);
      }
    }
  }

  // Resolve service categories dynamically from the services table!
  let serviceCategories = defaultServiceCategories;
  if (dynamicServices.length > 0) {
    const categoriesMap = {};
    dynamicServices.forEach(s => {
      if (!categoriesMap[s.category]) {
        categoriesMap[s.category] = [];
      }
      categoriesMap[s.category].push(s.title);
    });
    serviceCategories = Object.keys(categoriesMap).map(catName => ({
      name: catName,
      items: categoriesMap[catName]
    }));
  }

  const isProjectsActive = currentView === 'Projects' || projectSubItems.includes(currentView);
  const isServicesActive = currentView === 'Services';

  const isTransparent = currentView === 'Home' && !isScrolled;
  const headerClass = currentView === 'Home' ? (isTransparent ? 'is-transparent' : 'is-scrolled') : 'is-scrolled';

  return (
    <div className={`header-pinned-wrap ${headerClass}`}>
      <div className="top-nav-bar-accent"></div>
      <header className="site-header">
        <div className="container header-inner">
          <a
            href="#"
            className="logo-brand"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('Home');
            }}
          >
            <img
              src={logoBlueImg}
              alt="Blue Crescent Engineering Logo"
              className="header-logo-img"
              style={{ height: '62px', width: 'auto', display: 'block', objectFit: 'contain' }}
            />
          </a>

          <nav>
            <ul className="nav-menu">
              {navItems.map((item) => {
                // Services Multi-Level Dropdown
                if (item === 'Services') {
                  return (
                    <li
                      key={item}
                      className="nav-item-dropdown"
                      onMouseEnter={() => setServicesDropdownOpen(true)}
                      onMouseLeave={() => {
                        setServicesDropdownOpen(false);
                        setActiveCategory(null);
                      }}
                    >
                      <a
                        href="#"
                        className={`nav-link ${isServicesActive ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onNavigate) onNavigate('Services');
                        }}
                      >
                        SERVICES <span className="dropdown-arrow">▾</span>
                      </a>

                      {servicesDropdownOpen && (
                        <ul className="dropdown-menu main-services-dropdown">
                          {serviceCategories.map((cat) => (
                            <li
                              key={cat.name}
                              className="dropdown-item category-item"
                              onMouseEnter={() => setActiveCategory(cat.name)}
                            >
                              <div className="category-title">
                                {cat.name} <span className="sub-arrow">▸</span>
                              </div>

                              {activeCategory === cat.name && (
                                <ul className="secondary-dropdown-menu">
                                  {cat.items.map((subService) => (
                                    <li key={subService} className="dropdown-item">
                                      <a
                                        href="#"
                                        className={`dropdown-item-link ${activeSubTab === subService ? 'active-sub' : ''}`}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setServicesDropdownOpen(false);
                                          setActiveCategory(null);
                                          if (onNavigate) onNavigate('Services', subService);
                                        }}
                                      >
                                        {subService}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                }

                // Projects Single-Level Dropdown
                if (item === 'Projects') {
                  return (
                    <li
                      key={item}
                      className="nav-item-dropdown"
                      onMouseEnter={() => setProjectsDropdownOpen(true)}
                      onMouseLeave={() => setProjectsDropdownOpen(false)}
                    >
                      <a
                        href="#"
                        className={`nav-link ${isProjectsActive ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onNavigate) onNavigate('Projects');
                        }}
                      >
                        PROJECTS <span className="dropdown-arrow">▾</span>
                      </a>

                      {projectsDropdownOpen && (
                        <ul className="dropdown-menu">
                          {projectSubItems.map((subItem) => (
                            <li key={subItem} className="dropdown-item">
                              <a
                                href="#"
                                className={`dropdown-item-link ${activeSubTab === subItem ? 'active-sub' : ''}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setProjectsDropdownOpen(false);
                                  if (onNavigate) onNavigate('Projects', subItem);
                                }}
                              >
                                {subItem}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                }

                // Standard Nav Link
                return (
                  <li key={item}>
                    <a
                      href="#"
                      className={`nav-link ${currentView === item ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (onNavigate) onNavigate(item);
                      }}
                    >
                      {item.toUpperCase()}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}
