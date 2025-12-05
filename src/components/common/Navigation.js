import React, { useState, useEffect } from 'react';
import { 
  NavLink, 
  useLocation, 
  useNavigate 
} from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  Stethoscope, 
  Settings, 
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Bell,
  User,
  HelpCircle,
  LogOut,
  History,
  Star,
  Shield,
  Volume2
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

const Navigation = ({
  variant = 'sidebar',
  position = 'left',
  collapsed = false,
  onToggleCollapse,
  showMobileMenu = false,
  onMobileMenuToggle,
  className = ''
}) => {
  const { settings } = useAccessibility();
  const location = useLocation();
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState('/');
  const [openSubmenus, setOpenSubmenus] = useState({});

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const mainMenuItems = [
    {
      id: 'home',
      path: '/',
      label: 'Home',
      icon: <Home size={20} />,
      exact: true,
      description: 'Dashboard and overview'
    },
    {
      id: 'book',
      path: '/mode-selection',
      label: 'Book Appointment',
      icon: <Calendar size={20} />,
      description: 'Start new booking'
    },
    {
      id: 'doctors',
      path: '/doctors',
      label: 'Find Doctors',
      icon: <Users size={20} />,
      description: 'Search specialists'
    },
    {
      id: 'symptoms',
      path: '/symptoms',
      label: 'Symptoms Checker',
      icon: <Stethoscope size={20} />,
      description: 'Describe your symptoms'
    },
    {
      id: 'history',
      path: '/history',
      label: 'Appointment History',
      icon: <History size={20} />,
      description: 'Past appointments'
    }
  ];

  const userMenuItems = [
    {
      id: 'profile',
      path: '/profile',
      label: 'Profiles', // Changed from 'My Profile' to 'Profiles'
      icon: <User size={20} />,
      description: 'Personal information'
    },
    {
      id: 'settings',
      path: '/settings',
      label: 'Settings', // Moved Settings here from settingsMenuItems
      icon: <Settings size={20} />,
      description: 'Account preferences'
    },
    {
      id: 'notifications',
      path: '/notifications',
      label: 'Notifications',
      icon: <Bell size={20} />,
      badge: 3,
      description: 'Alerts and updates'
    },
    {
      id: 'favorites',
      path: '/favorites',
      label: 'Favorites',
      icon: <Star size={20} />,
      description: 'Saved doctors'
    }
  ];

  const settingsMenuItems = [
    {
      id: 'accessibility',
      path: '/accessibility',
      label: 'Accessibility',
      icon: <Shield size={20} />,
      description: 'Interface adjustments'
    },
    {
      id: 'help',
      path: '/help',
      label: 'Help & Support',
      icon: <HelpCircle size={20} />,
      description: 'Get assistance'
    }
    // Removed 'settings' item since it's now in userMenuItems
  ];

  const toggleSubmenu = (menuId) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const getNavItemClasses = (isActive) => {
    const baseClasses = `
      flex items-center rounded-lg
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
      ${settings.mode === 'elderly' ? 'text-lg' : 'text-base'}
    `;

    if (isActive) {
      return settings.highContrast 
        ? `${baseClasses} bg-black text-white` 
        : `${baseClasses} bg-primary-100 text-primary-700`;
    }

    return `
      ${baseClasses} 
      ${settings.highContrast 
        ? 'text-black hover:bg-gray-200' 
        : 'text-gray-700 hover:bg-gray-100'}
    `;
  };

  const getIconClasses = (isActive) => {
    if (isActive) {
      return settings.highContrast 
        ? 'text-white' 
        : 'text-primary-600';
    }
    return 'text-gray-500';
  };

  const renderNavItem = (item) => {
    const isActive = item.exact 
      ? activePath === item.path 
      : activePath.startsWith(item.path);

    return (
      <NavLink
        key={item.id}
        to={item.path}
        end={item.exact}
        className={({ isActive: navIsActive }) => getNavItemClasses(navIsActive)}
        aria-current={isActive ? 'page' : undefined}
        title={collapsed ? item.label : item.description}
      >
        <div className={`
          flex items-center 
          ${collapsed ? 'justify-center w-full py-3' : 'w-full px-4 py-3'}
        `}>
          <div className={`${getIconClasses(isActive)} ${collapsed ? '' : 'mr-3'}`}>
            {item.icon}
          </div>
          
          {!collapsed && (
            <>
              <span className="flex-1 font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </div>
      </NavLink>
    );
  };

  const renderSidebar = () => {
    return (
      <aside className={`
        ${settings.highContrast 
          ? 'bg-white border-2 border-black' 
          : 'bg-white border-r border-gray-200'}
        h-screen sticky top-0
        transition-all duration-300
        ${collapsed ? 'w-16' : 'w-64'}
        ${className}
      `}>
        {/* Header */}
        <div className={`
          p-4 border-b 
          ${settings.highContrast ? 'border-black' : 'border-gray-200'}
          ${collapsed ? 'text-center' : ''}
        `}>
          <div className="flex items-center justify-between">
            {!collapsed ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Stethoscope size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <h1 className="font-bold">SmartHealth</h1>
                    <p className="text-xs text-gray-500">Navigation</p>
                  </div>
                </div>
                <button
                  onClick={onToggleCollapse}
                  className="p-1 rounded hover:bg-gray-100"
                  aria-label="Collapse menu"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={onToggleCollapse}
                className="p-2 rounded hover:bg-gray-100 mx-auto"
                aria-label="Expand menu"
              >
                <Menu size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Content */}
        <div className="p-4 space-y-1">
          {/* Main Menu */}
          {!collapsed && (
            <div className="mb-6">
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2 px-4">
                Main Menu
              </h3>
              <div className="space-y-1">
                {mainMenuItems.map(renderNavItem)}
              </div>
            </div>
          )}

          {/* User Menu */}
          {!collapsed && (
            <div className="mb-6">
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2 px-4">
                My Account
              </h3>
              <div className="space-y-1">
                {userMenuItems.map(renderNavItem)}
              </div>
            </div>
          )}

          {/* Settings Menu */}
          <div className={collapsed ? 'space-y-1' : 'mb-6'}>
            {!collapsed && (
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2 px-4">
                Preferences
              </h3>
            )}
            <div className="space-y-1">
              {settingsMenuItems.map(renderNavItem)}
            </div>
          </div>

          {/* Collapsed View */}
          {collapsed && (
            <div className="space-y-1">
              {mainMenuItems.slice(0, 3).map(item => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => getNavItemClasses(isActive)}
                  title={item.label}
                >
                  <div className="p-3 flex justify-center">
                    <div className={getIconClasses(activePath === item.path)}>
                      {item.icon}
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!collapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <User size={20} className="text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">John Doe</p>
                <p className="text-xs text-gray-500">Patient</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings size={18} className="text-gray-500" />
                <span className="text-gray-700">Profile Settings</span> {/* Changed from 'Settings' to 'Profile Settings' */}
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>
        )}
      </aside>
    );
  };

  const renderTopNav = () => {
    return (
      <nav className={`
        ${settings.highContrast 
          ? 'bg-white border-b-2 border-black' 
          : 'bg-white border-b border-gray-200'}
        sticky top-0 z-30
        ${className}
      `}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center">
              <button
                onClick={onMobileMenuToggle}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                aria-label="Toggle mobile menu"
              >
                <Menu size={24} />
              </button>
              
              <div className="ml-4 flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Stethoscope size={24} className="text-primary-600" />
                </div>
                <div>
                  <h1 className="font-bold text-lg">SmartHealth Care</h1>
                  <p className="text-xs text-gray-500">Appointment System</p>
                </div>
              </div>
            </div>

            {/* Center Section - Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {mainMenuItems.map(item => {
                const isActive = item.exact 
                  ? activePath === item.path 
                  : activePath.startsWith(item.path);
                
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    end={item.exact}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-colors
                      ${isActive 
                        ? settings.highContrast 
                          ? 'bg-black text-white' 
                          : 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </div>
                  </NavLink>
                );
              })}
              
              {/* Profile link in top navigation */}
              <NavLink
                to="/profile"
                className={`
                  px-4 py-2 rounded-lg font-medium transition-colors
                  ${activePath === '/profile'
                    ? settings.highContrast 
                      ? 'bg-black text-white' 
                      : 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <User size={20} />
                  Profiles
                </div>
              </NavLink>
              
              {/* Settings link in top navigation */}
              <NavLink
                to="/settings"
                className={`
                  px-4 py-2 rounded-lg font-medium transition-colors
                  ${activePath === '/settings'
                    ? settings.highContrast 
                      ? 'bg-black text-white' 
                      : 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <Settings size={20} />
                  Settings
                </div>
              </NavLink>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {settings.voiceAssistance && (
                <button
                  className="p-2 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200"
                  aria-label="Voice assistant"
                >
                  <Volume2 size={20} />
                </button>
              )}
              
              <button
                className="p-2 rounded-full hover:bg-gray-100 relative"
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              <button
                onClick={() => navigate('/profile')}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="User profile"
              >
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  const renderMobileMenu = () => {
    if (!showMobileMenu) return null;

    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black/50"
          onClick={onMobileMenuToggle}
        />
        
        {/* Menu Panel */}
        <div className={`
          absolute top-0 ${position === 'left' ? 'left-0' : 'right-0'}
          w-64 h-full bg-white shadow-xl
          transform transition-transform duration-300
          ${showMobileMenu ? 'translate-x-0' : position === 'left' ? '-translate-x-full' : 'translate-x-full'}
        `}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Stethoscope size={24} className="text-primary-600" />
                </div>
                <div>
                  <h1 className="font-bold">SmartHealth</h1>
                  <p className="text-xs text-gray-500">Mobile Menu</p>
                </div>
              </div>
              <button
                onClick={onMobileMenuToggle}
                className="p-2 rounded hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Menu Content */}
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-sm uppercase text-gray-500 font-semibold mb-3">
                Main Navigation
              </h3>
              <div className="space-y-1">
                {mainMenuItems.map(renderNavItem)}
              </div>
            </div>

            <div>
              <h3 className="text-sm uppercase text-gray-500 font-semibold mb-3">
                My Account
              </h3>
              <div className="space-y-1">
                {userMenuItems.map(renderNavItem)}
              </div>
            </div>

            <div>
              <h3 className="text-sm uppercase text-gray-500 font-semibold mb-3">
                Preferences
              </h3>
              <div className="space-y-1">
                {settingsMenuItems.map(renderNavItem)}
              </div>
            </div>

            {/* User Info */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User size={24} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-bold">John Doe</p>
                  <p className="text-sm text-gray-500">john@example.com</p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  navigate('/settings');
                  onMobileMenuToggle();
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <Settings size={18} className="text-gray-500" />
                  <span>Profile Settings</span>
                </div>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBreadcrumb = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    return (
      <nav className="bg-gray-50 py-3 px-4 border-b border-gray-200">
        <div className="container mx-auto">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <NavLink to="/" className="text-primary-600 hover:text-primary-800">
                <Home size={16} className="inline mr-1" />
                Home
              </NavLink>
            </li>
            {pathSegments.map((segment, index) => {
              const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
              const isLast = index === pathSegments.length - 1;
              const label = segment.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
              
              return (
                <li key={path} className="flex items-center">
                  <ChevronRight size={14} className="text-gray-400 mx-2" />
                  {isLast ? (
                    <span className="text-gray-700 font-medium">{label}</span>
                  ) : (
                    <NavLink 
                      to={path} 
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {label}
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    );
  };

  switch(variant) {
    case 'sidebar':
      return renderSidebar();
    case 'top':
      return (
        <>
          {renderTopNav()}
          {renderBreadcrumb()}
        </>
      );
    case 'breadcrumb':
      return renderBreadcrumb();
    case 'mobile':
      return renderMobileMenu();
    default:
      return renderSidebar();
  }
};

// Pre-configured Navigation Components
export const SidebarNavigation = (props) => (
  <Navigation variant="sidebar" {...props} />
);

export const TopNavigation = (props) => (
  <Navigation variant="top" {...props} />
);

export const BreadcrumbNavigation = (props) => (
  <Navigation variant="breadcrumb" {...props} />
);

export const MobileNavigation = (props) => (
  <Navigation variant="mobile" {...props} />
);

// Navigation Provider for managing state
export const NavigationProvider = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const contextValue = {
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
    toggleSidebar: () => setSidebarCollapsed(!sidebarCollapsed),
    toggleMobileMenu: () => setMobileMenuOpen(!mobileMenuOpen)
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

// Create context for navigation
const NavigationContext = React.createContext();
export const useNavigation = () => React.useContext(NavigationContext);

export default Navigation;