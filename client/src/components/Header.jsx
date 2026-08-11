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
  const [dynamicCategories, setDynamicCategories] = useState([]);

  useEffect(() => {
    // Fetch menus
    fetch('/api/menus')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) setDynamicMenus(data);
      })
      .catch(err => console.warn('Menus fetch warning:', err));

    // Fetch categories
    fetch('/api/service-categories')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) setDynamicCategories(data);
      })
      .catch(err => console.warn('Categories fetch warning:', err));

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
  const defaultProjectSubItems = ['CAD Projects', 'BIM Projects', 'Laser Scanning Projects', 'Digital Twin Projects', 'Sustainability Projects'];
  const defaultServiceCategories = [
    {
      name: 'Engineering Services',
      slug: 'engineering-services',
      items: [
        { title: 'CAD', slug: 'cad' },
        { title: 'BIM', slug: 'bim' },
        { title: 'Laser Scanning', slug: 'laser-scanning' },
        { title: 'Scan to BIM', slug: 'scan-to-bim' }
      ]
    },
    {
      name: 'Sustainability Services',
      slug: 'sustainability-services',
      items: [
        { title: 'GSAS', slug: 'gsas' },
        { title: 'LEED', slug: 'leed' },
        { title: 'Energy Audit', slug: 'energy-audit' },
        { title: 'Carbon Management', slug: 'carbon-management' }
      ]
    },
    {
      name: 'Digital Twin',
      slug: 'digital-twin',
      items: [
        { title: 'Asset Twin', slug: 'asset-twin' },
        { title: 'System Integration', slug: 'system-integration' },
        { title: 'Real-Time Monitoring', slug: 'real-time-monitoring' },
        { title: 'Asset Management', slug: 'asset-management' }
      ]
    },
    {
      name: 'Construction Technology',
      slug: 'construction-technology',
      items: [
        { title: 'Remote Construction', slug: 'remote-construction' },
        { title: '360° Capture', slug: '360-capture' },
        { title: 'AR Solutions', slug: 'ar-solutions' },
        { title: 'Robotics', slug: 'robotics' }
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

  // Allowed Main Category Names
  const ALLOWED_CATEGORY_NAMES = [
    'Engineering Services',
    'Sustainability Services',
    'Digital Twin',
    'Construction Technology'
  ];

  // Resolve service categories dynamically from API or fallbacks
  let serviceCategories = defaultServiceCategories;

  if (dynamicServices.length > 0 || dynamicCategories.length > 0) {
    const activeCats = dynamicCategories.length > 0
      ? dynamicCategories
        .filter(c => c.status !== 'Inactive' && ALLOWED_CATEGORY_NAMES.includes(c.name))
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      : defaultServiceCategories;

    const categoriesMap = {};

    // Initialize map from categories
    activeCats.forEach(cat => {
      if (ALLOWED_CATEGORY_NAMES.includes(cat.name)) {
        categoriesMap[cat.name] = {
          name: cat.name,
          slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          items: []
        };
      }
    });

    // Populate sub-services from dynamicServices
    if (dynamicServices.length > 0) {
      dynamicServices
        .filter(s => s.status !== 'Inactive' && ALLOWED_CATEGORY_NAMES.includes(s.category))
        .forEach(s => {
          if (categoriesMap[s.category]) {
            const itemObj = {
              id: s.id,
              title: s.title,
              slug: s.slug || s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            };

            const exists = categoriesMap[s.category].items.some(i => (i.title || i) === s.title);
            if (!exists) {
              categoriesMap[s.category].items.push(itemObj);
            }
          }
        });
    }

    const parsedCats = Object.values(categoriesMap).filter(c => c.items.length > 0);
    if (parsedCats.length > 0) {
      serviceCategories = parsedCats;
    }
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
                        Services <span className="dropdown-arrow">▾</span>
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
                                  {cat.items.map((subItem) => {
                                    const subTitle = typeof subItem === 'string' ? subItem : subItem.title;
                                    const subTarget = typeof subItem === 'string' ? subItem : (subItem.slug || subItem.title);
                                    return (
                                      <li key={subTitle} className="dropdown-item">
                                        <a
                                          href="#"
                                          className={`dropdown-item-link ${activeSubTab === subTitle || activeSubTab === subTarget ? 'active-sub' : ''}`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setServicesDropdownOpen(false);
                                            setActiveCategory(null);
                                            if (onNavigate) onNavigate('Services', subTarget);
                                          }}
                                        >
                                          {subTitle}
                                        </a>
                                      </li>
                                    );
                                  })}
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
                        Projects <span className="dropdown-arrow">▾</span>
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
                        Media <span className="dropdown-arrow">▾</span>
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
                      {item}
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
                      <span>Services</span>
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
                                  {cat.items.map((sub) => {
                                    const subTitle = typeof sub === 'string' ? sub : sub.title;
                                    const subTarget = typeof sub === 'string' ? sub : (sub.slug || sub.title);
                                    return (
                                      <li key={subTitle}>
                                        <a
                                          href="#"
                                          className={activeSubTab === subTitle || activeSubTab === subTarget ? 'active-sub' : ''}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setIsMobileMenuOpen(false);
                                            if (onNavigate) onNavigate('Services', subTarget);
                                          }}
                                        >
                                          {subTitle}
                                        </a>
                                      </li>
                                    );
                                  })}
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
                      <span>Projects</span>
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
                      <span>Media</span>
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
                    {item}
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
