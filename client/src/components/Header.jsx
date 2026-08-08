import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import logoBlueImg from '../assets/logo1_transparent_blue.png';
import logoWhiteImg from '../assets/logo1_transparent_white.png';

export default function Header({ currentView = 'Home', activeSubTab = '', onNavigate }) {
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mediaDropdownOpen, setMediaDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null); // 'Services', 'Projects', 'Media'
  const [activeMobileCategory, setActiveMobileCategory] = useState(null); // For mobile services sub-categories

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
  const defaultNavItems = ['Home', 'About Us', 'Services', 'Projects', 'Media', 'Contact Us'];
  const defaultProjectSubItems = ['Engineering Division', 'Sustainability Division', 'Digital Twin Division'];
  const defaultServiceCategories = [
    {
      name: 'Engineering Services',
      items: [
        'BIM Services',
        '2D CAD Drafting Services',
        'Outsourcing Technical Experts'
      ]
    },
    {
      name: 'Sustainability Services',
      items: [
        'GSAS Service',
        'LEED Consulting Services',
        'Energy Audit and Analysis',
        'ISO 14064 Consulting Services'
      ]
    },
    {
      name: 'Digital Twin Services',
      items: [
        'Life Cycle Twin Asset Management',
        'Remote Work Automation',
        'System Integration and Analysis'
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
      const subMenus = dynamicMenus
        .filter(m => m.parent_id === projectsMenu.id)
        .sort((a, b) => a.order_num - b.order_num);
      if (subMenus.length > 0) {
        projectSubItems = subMenus.map(m => m.name);
      }
    }
  }

  // Resolve service categories dynamically from the services table!
  let serviceCategories = defaultServiceCategories;
  if (dynamicServices.length > 0) {
    const categoriesMap = {};
    dynamicServices
      .filter(s => !s.category.toLowerCase().includes('telecom'))
      .filter(s => !['Engineering Design support Services', 'Specialised Simulation & Analysis', 'BIM Modelling - 3D', 'Engineering (MEP, Infrastructure, Transportation) shop Drawings - 2D'].includes(s.title))
      .forEach(s => {
        if (!categoriesMap[s.category]) {
          categoriesMap[s.category] = [];
        }
        categoriesMap[s.category].push(s.title);
      });

    // Build dynamic categories from API data
    const dynamicCategories = Object.keys(categoriesMap).map(catName => ({
      name: catName,
      items: categoriesMap[catName]
    }));

    // Always guarantee Engineering Services with exactly these two items
    const hasEngineering = dynamicCategories.some(c => c.name === 'Engineering Services');
    if (!hasEngineering) {
      dynamicCategories.unshift({
        name: 'Engineering Services',
        items: ['BIM Services', '2D CAD Drafting Services', 'Outsourcing Technical Experts']
      });
    } else {
      const engCat = dynamicCategories.find(c => c.name === 'Engineering Services');
      if (!engCat.items.includes('BIM Services')) engCat.items.unshift('BIM Services');
      if (!engCat.items.includes('2D CAD Drafting Services')) engCat.items.splice(1, 0, '2D CAD Drafting Services');
      if (!engCat.items.includes('Outsourcing Technical Experts')) engCat.items.push('Outsourcing Technical Experts');
    }

    // Always guarantee Digital Twin Services
    const hasDigitalTwin = dynamicCategories.some(c => c.name === 'Digital Twin Services');
    if (!hasDigitalTwin) {
      dynamicCategories.push({
        name: 'Digital Twin Services',
        items: [
          'Life Cycle Twin Asset Management',
          'Remote Work Automation',
          'System Integration and Analysis'
        ]
      });
    }

    serviceCategories = dynamicCategories;
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
              setIsMobileMenuOpen(false);
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

          <nav className="desktop-nav">
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

                // Media Dropdown with Gallery & Videos
                if (item === 'Media') {
                  return (
                    <li
                      key={item}
                      className="nav-item-dropdown"
                      onMouseEnter={() => setMediaDropdownOpen(true)}
                      onMouseLeave={() => setMediaDropdownOpen(false)}
                    >
                      <a
                        href="#"
                        className={`nav-link ${currentView === 'Media' ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onNavigate) onNavigate('Media', 'Gallery');
                        }}
                      >
                        MEDIA <span className="dropdown-arrow">▾</span>
                      </a>

                      {mediaDropdownOpen && (
                        <ul className="dropdown-menu">
                          <li className="dropdown-item">
                            <a
                              href="#"
                              className={`dropdown-item-link ${currentView === 'Media' && activeSubTab === 'Gallery' ? 'active-sub' : ''}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setMediaDropdownOpen(false);
                                if (onNavigate) onNavigate('Media', 'Gallery');
                              }}
                            >
                              📸 Gallery
                            </a>
                          </li>
                          <li className="dropdown-item">
                            <a
                              href="#"
                              className={`dropdown-item-link ${currentView === 'Media' && activeSubTab === 'Videos' ? 'active-sub' : ''}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setMediaDropdownOpen(false);
                                if (onNavigate) onNavigate('Media', 'Videos');
                              }}
                            >
                              🎥 Videos (YouTube)
                            </a>
                          </li>
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

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="mobile-nav-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-menu-drawer ${isMobileMenuOpen ? 'is-open' : ''}`}>
        <nav className="mobile-nav-content">
          <ul className="mobile-nav-list">
            {navItems.map((item) => {
              // Services accordion
              if (item === 'Services') {
                const isOpen = activeMobileDropdown === 'Services';
                return (
                  <li key={item} className="mobile-dropdown-item">
                    <button
                      className={`mobile-dropdown-trigger ${isServicesActive ? 'active' : ''}`}
                      onClick={() => setActiveMobileDropdown(isOpen ? null : 'Services')}
                    >
                      <span>SERVICES</span>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {isOpen && (
                      <ul className="mobile-submenu-lvl1">
                        {serviceCategories.map((cat) => {
                          const isCatOpen = activeMobileCategory === cat.name;
                          return (
                            <li key={cat.name} className="mobile-submenu-cat-item">
                              <button
                                className="mobile-submenu-cat-trigger"
                                onClick={() => setActiveMobileCategory(isCatOpen ? null : cat.name)}
                              >
                                <span>{cat.name}</span>
                                {isCatOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>

                              {isCatOpen && (
                                <ul className="mobile-submenu-lvl2">
                                  {cat.items.map((sub) => (
                                    <li key={sub}>
                                      <a
                                        href="#"
                                        className={activeSubTab === sub ? 'active-sub' : ''}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setIsMobileMenuOpen(false);
                                          if (onNavigate) onNavigate('Services', sub);
                                        }}
                                      >
                                        {sub}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }

              // Projects accordion
              if (item === 'Projects') {
                const isOpen = activeMobileDropdown === 'Projects';
                return (
                  <li key={item} className="mobile-dropdown-item">
                    <button
                      className={`mobile-dropdown-trigger ${isProjectsActive ? 'active' : ''}`}
                      onClick={() => setActiveMobileDropdown(isOpen ? null : 'Projects')}
                    >
                      <span>PROJECTS</span>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {isOpen && (
                      <ul className="mobile-submenu-lvl1">
                        {projectSubItems.map((sub) => (
                          <li key={sub}>
                            <a
                              href="#"
                              className={activeSubTab === sub ? 'active-sub' : ''}
                              onClick={(e) => {
                                e.preventDefault();
                                setIsMobileMenuOpen(false);
                                if (onNavigate) onNavigate('Projects', sub);
                              }}
                            >
                              {sub}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              // Media accordion
              if (item === 'Media') {
                const isOpen = activeMobileDropdown === 'Media';
                return (
                  <li key={item} className="mobile-dropdown-item">
                    <button
                      className={`mobile-dropdown-trigger ${currentView === 'Media' ? 'active' : ''}`}
                      onClick={() => setActiveMobileDropdown(isOpen ? null : 'Media')}
                    >
                      <span>MEDIA</span>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {isOpen && (
                      <ul className="mobile-submenu-lvl1">
                        <li>
                          <a
                            href="#"
                            className={currentView === 'Media' && activeSubTab === 'Gallery' ? 'active-sub' : ''}
                            onClick={(e) => {
                              e.preventDefault();
                              setIsMobileMenuOpen(false);
                              if (onNavigate) onNavigate('Media', 'Gallery');
                            }}
                          >
                            📸 Gallery
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className={currentView === 'Media' && activeSubTab === 'Videos' ? 'active-sub' : ''}
                            onClick={(e) => {
                              e.preventDefault();
                              setIsMobileMenuOpen(false);
                              if (onNavigate) onNavigate('Media', 'Videos');
                            }}
                          >
                            🎥 Videos (YouTube)
                          </a>
                        </li>
                      </ul>
                    )}
                  </li>
                );
              }

              // Standard Link
              return (
                <li key={item}>
                  <a
                    href="#"
                    className={`mobile-nav-link ${currentView === item ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
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
    </div>
  );
}
