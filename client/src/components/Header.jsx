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
  const [activeProjectCategory, setActiveProjectCategory] = useState(null); // For desktop projects sub-categories
  const [activeMobileProjectCategory, setActiveMobileProjectCategory] = useState(null); // For mobile projects sub-categories

  // Dynamic Navigation & Services data states
  const [dynamicMenus, setDynamicMenus] = useState([]);
  const [dynamicServices, setDynamicServices] = useState([]);
  const [dynamicCategories, setDynamicCategories] = useState([]);

  const fetchAllHeaderData = () => {
    // Fetch menus
    fetch('/api/menus')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setDynamicMenus(data);
      })
      .catch(err => console.warn('Menus fetch warning:', err));

    // Fetch categories
    fetch('/api/service-categories')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setDynamicCategories(data);
      })
      .catch(err => console.warn('Categories fetch warning:', err));

    // Fetch services
    fetch('/api/services')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setDynamicServices(data);
      })
      .catch(err => console.warn('Services fetch warning:', err));
  };

  useEffect(() => {
    fetchAllHeaderData();
    window.addEventListener('menuUpdated', fetchAllHeaderData);
    return () => window.removeEventListener('menuUpdated', fetchAllHeaderData);
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
  const defaultNavItems = ['Home', 'About Us', 'Services', 'Projects', 'Insights', 'Contact Us'];
  const defaultProjectSubItems = ['BIM Projects', 'CAD Projects', 'Laser Scanning Projects', 'Digital Twin Projects', 'Sustainability Projects'];
  const defaultServiceCategories = [
    {
      name: 'Engineering Services',
      slug: 'engineering-services',
      items: [
        { title: 'BIM', slug: 'bim' },
        { title: 'CAD', slug: 'cad' },
        { title: 'Laser Scanning Services', slug: 'laser-scanning' }
      ]
    },
    {
      name: 'Sustainability Services',
      slug: 'sustainability-services',
      items: [
        { title: 'GSAS', slug: 'gsas' },
        { title: 'LEED', slug: 'leed' },
        { title: 'Energy Audit', slug: 'energy-audit' },
        { title: 'Environment', slug: 'environment' }
      ]
    },
    {
      name: 'Digital Twin',
      slug: 'digital-twin',
      items: []
    },
    {
      name: 'Digital Construction Technology',
      slug: 'digital-construction-technology',
      items: []
    }
  ];

  // Resolve menus dynamically
  let navItems = defaultNavItems;
  let projectSubItems = defaultProjectSubItems;

  if (dynamicMenus.length > 0) {
    const rootMenus = dynamicMenus.filter(m => !m.parent_id).sort((a, b) => (a.order_num || 0) - (b.order_num || 0));
    if (rootMenus.length > 0) {
      navItems = rootMenus.map(m => m.name);
    }

    const projectsMenu = rootMenus.find(m => m.name.toLowerCase() === 'projects');
    if (projectsMenu) {
      const subMenus = dynamicMenus
        .filter(m => m.parent_id === projectsMenu.id)
        .sort((a, b) => (a.order_num || 0) - (b.order_num || 0));
      if (subMenus.length > 0) {
        projectSubItems = subMenus.map(m => m.name);
      }
    }
  }

  // Resolve service categories dynamically from API or fallbacks
  let serviceCategories = defaultServiceCategories;

  if (dynamicServices.length > 0 || dynamicCategories.length > 0) {
    const activeCats = dynamicCategories.length > 0
      ? dynamicCategories
        .filter(c => c.status !== 'Inactive')
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      : defaultServiceCategories;

    const categoriesMap = {};

    // Initialize map strictly from active categories
    activeCats.forEach(cat => {
      categoriesMap[cat.name] = {
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        items: cat.items || []
      };
    });

    // Populate sub-services from dynamicServices only into existing active categories (excluding Digital Twin and Digital Construction Technology)
    if (dynamicServices.length > 0) {
      dynamicServices
        .filter(s => s.status !== 'Inactive')
        .forEach(s => {
          const catName = s.category || '';
          const isNoSubMenu = ['digital twin', 'digital construction technology', 'construction technology'].includes(catName.toLowerCase().trim());
          if (isNoSubMenu) return;

          if (catName) {
            let targetKey = catName;
            if (!categoriesMap[targetKey]) {
              targetKey = Object.keys(categoriesMap).find(k => 
                k.toLowerCase().includes(catName.toLowerCase()) || catName.toLowerCase().includes(k.toLowerCase())
              );
            }
            if (targetKey && categoriesMap[targetKey]) {
              const isTargetNoSubMenu = ['digital twin', 'digital construction technology', 'construction technology'].includes(targetKey.toLowerCase().trim());
              if (isTargetNoSubMenu) return;

              const itemTitle = s.title === 'Laser Scanning' ? 'Laser Scanning Services' : s.title;
              const itemObj = {
                id: s.id,
                title: itemTitle,
                slug: s.slug || itemTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')
              };

              const exists = categoriesMap[targetKey].items.some(i => (i.title || i) === itemTitle || (i.title || i) === s.title);
              if (!exists) {
                categoriesMap[targetKey].items.push(itemObj);
              }
            } else if (dynamicCategories.length === 0) {
              categoriesMap[catName] = {
                name: catName,
                slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                items: [{
                  id: s.id,
                  title: s.title,
                  slug: s.slug || s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                }]
              };
            }
          }
        });
    }

    const parsedCats = Object.values(categoriesMap).filter(c => 
      ['digital twin', 'digital construction technology', 'construction technology'].includes((c.name || '').toLowerCase().trim()) ||
      (c.items && c.items.length > 0) ||
      dynamicCategories.some(dc => dc.name === c.name && dc.status !== 'Inactive')
    );
    const serviceOrder = ['BIM', 'CAD', 'LASER SCANNING', 'GSAS', 'LEED', 'ASSET MANAGEMENT', 'ASSET TWIN', 'SYSTEM INTEGRATION'];
    parsedCats.forEach(cat => {
      cat.items.sort((a, b) => {
        const titleA = (a.title || a).toString().toUpperCase();
        const titleB = (b.title || b).toString().toUpperCase();
        const idxA = serviceOrder.findIndex(o => titleA.includes(o));
        const idxB = serviceOrder.findIndex(o => titleB.includes(o));
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return (a.display_order || 0) - (b.display_order || 0);
      });
    });

    if (parsedCats.length > 0) {
      serviceCategories = parsedCats;
    }
  }

  // Derive project categories with sub-items matching the service categories structure
  let projectCategories = serviceCategories.map(cat => {
    const rawName = cat.name || '';
    const projName = rawName.toLowerCase().includes('project')
      ? rawName
      : rawName.replace(/Services$/i, '').trim() + ' Projects';
    return {
      name: projName,
      slug: cat.slug || rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      items: (cat.items || []).map(subItem => {
        const title = typeof subItem === 'string' ? subItem : subItem.title;
        const slug = typeof subItem === 'string' ? subItem : (subItem.slug || subItem.title);
        const projectTitle = (title || '').toLowerCase().includes('project') ? title : `${title} Projects`;
        return {
          title: projectTitle,
          slug: slug || projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        };
      })
    };
  });

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
                          {serviceCategories.map((cat) => {
                            const isNoSubMenuCat = ['digital twin', 'digital construction technology', 'construction technology'].includes((cat.name || '').toLowerCase().trim());
                            const hasSubItems = !isNoSubMenuCat && cat.items && cat.items.length > 0;

                            return (
                              <li
                                key={cat.name}
                                className="dropdown-item category-item"
                                onMouseEnter={() => setActiveCategory(hasSubItems ? cat.name : null)}
                              >
                                <div 
                                  className="category-title"
                                  style={{ cursor: hasSubItems ? 'default' : 'pointer' }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (hasSubItems) {
                                      setActiveCategory(activeCategory === cat.name ? null : cat.name);
                                    } else {
                                      setServicesDropdownOpen(false);
                                      setActiveCategory(null);
                                      if (onNavigate) onNavigate('Services', cat.slug || cat.name);
                                    }
                                  }}
                                >
                                  {cat.name} {hasSubItems && <span className="sub-arrow">▸</span>}
                                </div>

                                {hasSubItems && activeCategory === cat.name && (
                                  <ul className="secondary-dropdown-menu">
                                    {cat.items.map((subItem) => {
                                      const rawTitle = typeof subItem === 'string' ? subItem : subItem.title;
                                      const subTitle = rawTitle === 'Laser Scanning' ? 'Laser Scanning Services' : rawTitle;
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
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                }

                // Projects Single-Level Dropdown (No Sub-Menu Flyout)
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
                          {projectCategories.map((cat) => (
                            <li key={cat.name} className="dropdown-item">
                              <a
                                href="#"
                                className={`dropdown-item-link ${activeSubTab === cat.name || activeSubTab === cat.slug ? 'active-sub' : ''}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setProjectsDropdownOpen(false);
                                  if (onNavigate) onNavigate('Projects', cat.slug || cat.name);
                                }}
                              >
                                {cat.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                }

                // Insights / Media Dropdown with Gallery, Videos & Blogs / Announcements
                if (item === 'Media' || item === 'Insights') {
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
                        Insights <span className="dropdown-arrow">▾</span>
                      </a>

                      {mediaDropdownOpen && (
                        <ul className="dropdown-menu">
                          <li className="dropdown-item">
                            <a
                              href="#"
                              className={`dropdown-item-link ${currentView === 'Media' && (activeSubTab === 'Gallery' || !activeSubTab) ? 'active-sub' : ''}`}
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
                              🎥 Videos
                            </a>
                          </li>
                          <li className="dropdown-item">
                            <a
                              href="#"
                              className={`dropdown-item-link ${currentView === 'Media' && (activeSubTab === 'Blogs' || activeSubTab === 'Announcements') ? 'active-sub' : ''}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setMediaDropdownOpen(false);
                                if (onNavigate) onNavigate('Media', 'Blogs');
                              }}
                            >
                              📝 Blogs
                            </a>
                          </li>
                        </ul>
                      )}
                    </li>
                  );
                }

                // Custom Dynamic Sub-menu Dropdown
                const rootMenuObj = dynamicMenus.find(m => m.name === item && !m.parent_id);
                const customSubMenus = rootMenuObj
                  ? dynamicMenus.filter(m => m.parent_id === rootMenuObj.id).sort((a, b) => (a.order_num || 0) - (b.order_num || 0))
                  : [];

                if (customSubMenus.length > 0) {
                  const isOpen = activeMobileDropdown === item;
                  return (
                    <li
                      key={item}
                      className="nav-item-dropdown"
                      onMouseEnter={() => setActiveMobileDropdown(item)}
                      onMouseLeave={() => setActiveMobileDropdown(null)}
                    >
                      <a
                        href="#"
                        className={`nav-link ${currentView === item ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onNavigate) onNavigate(item, '', rootMenuObj?.url);
                        }}
                      >
                        {item} <span className="dropdown-arrow">▾</span>
                      </a>

                      {isOpen && (
                        <ul className="dropdown-menu">
                          {customSubMenus.map((sub) => (
                            <li key={sub.id || sub.name} className="dropdown-item">
                              <a
                                href="#"
                                className={`dropdown-item-link ${activeSubTab === sub.name ? 'active-sub' : ''}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setActiveMobileDropdown(null);
                                  if (onNavigate) onNavigate(item, sub.name, sub.url);
                                }}
                              >
                                {sub.name}
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
                        if (onNavigate) onNavigate(item, '', rootMenuObj?.url);
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
                          const isNoSubMenuCat = ['digital twin', 'digital construction technology', 'construction technology'].includes((cat.name || '').toLowerCase().trim());
                          const hasSubItems = !isNoSubMenuCat && cat.items && cat.items.length > 0;

                          if (!hasSubItems) {
                            return (
                              <li key={cat.name} className="mobile-submenu-cat-item">
                                <a
                                  href="#"
                                  className="mobile-submenu-cat-trigger"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setIsMobileMenuOpen(false);
                                    if (onNavigate) onNavigate('Services', cat.slug || cat.name);
                                  }}
                                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', textDecoration: 'none' }}
                                >
                                  <span>{cat.name}</span>
                                </a>
                              </li>
                            );
                          }

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
                                    const rawTitle = typeof sub === 'string' ? sub : sub.title;
                                    const subTitle = rawTitle === 'Laser Scanning' ? 'Laser Scanning Services' : rawTitle;
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

              // Projects single-level category list in mobile
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
                        {projectCategories.map((cat) => (
                          <li key={cat.name}>
                            <a
                              href="#"
                              className={activeSubTab === cat.name || activeSubTab === cat.slug ? 'active-sub' : ''}
                              onClick={(e) => {
                                e.preventDefault();
                                setIsMobileMenuOpen(false);
                                if (onNavigate) onNavigate('Projects', cat.slug || cat.name);
                              }}
                            >
                              {cat.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              // Insights / Media accordion
              if (item === 'Media' || item === 'Insights') {
                const isOpen = activeMobileDropdown === 'Media' || activeMobileDropdown === 'Insights';
                return (
                  <li key={item} className="mobile-dropdown-item">
                    <button
                      className={`mobile-dropdown-trigger ${currentView === 'Media' ? 'active' : ''}`}
                      onClick={() => setActiveMobileDropdown(isOpen ? null : 'Insights')}
                    >
                      <span>Insights</span>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {isOpen && (
                      <ul className="mobile-submenu-lvl1">
                        <li>
                          <a
                            href="#"
                            className={currentView === 'Media' && (activeSubTab === 'Gallery' || !activeSubTab) ? 'active-sub' : ''}
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
                            🎥 Videos
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className={currentView === 'Media' && (activeSubTab === 'Blogs' || activeSubTab === 'Announcements') ? 'active-sub' : ''}
                            onClick={(e) => {
                              e.preventDefault();
                              setIsMobileMenuOpen(false);
                              if (onNavigate) onNavigate('Media', 'Blogs');
                            }}
                          >
                            📝 Blogs
                          </a>
                        </li>
                      </ul>
                    )}
                  </li>
                );
              }

              // Custom Dynamic Sub-menu accordion in mobile
              const rootMenuObj = dynamicMenus.find(m => m.name === item && !m.parent_id);
              const customSubMenus = rootMenuObj
                ? dynamicMenus.filter(m => m.parent_id === rootMenuObj.id).sort((a, b) => (a.order_num || 0) - (b.order_num || 0))
                : [];

              if (customSubMenus.length > 0) {
                const isOpen = activeMobileDropdown === item;
                return (
                  <li key={item} className="mobile-dropdown-item">
                    <button
                      className={`mobile-dropdown-trigger ${currentView === item ? 'active' : ''}`}
                      onClick={() => setActiveMobileDropdown(isOpen ? null : item)}
                    >
                      <span>{item}</span>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {isOpen && (
                      <ul className="mobile-submenu-lvl1">
                        {customSubMenus.map((sub) => (
                          <li key={sub.id || sub.name}>
                            <a
                              href="#"
                              className={activeSubTab === sub.name ? 'active-sub' : ''}
                              onClick={(e) => {
                                e.preventDefault();
                                setIsMobileMenuOpen(false);
                                if (onNavigate) onNavigate(item, sub.name, sub.url);
                              }}
                            >
                              {sub.name}
                            </a>
                          </li>
                        ))}
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
                      if (onNavigate) onNavigate(item, '', rootMenuObj?.url);
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
