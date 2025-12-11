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
  Volume2,
  Moon,
  Sun
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useTheme } from '../../context/ThemeContext';
import ModeToggle from '../mode-selection/ModeToggle';

const Navigation = ({
  variant = 'sidebar',
  position = 'left',
  collapsed = false,
  onToggleCollapse,
  showMobileMenu = false,
  onMobileMenuToggle,
  className = ''
}) => {
  const { settings, updateSettings } = useAccessibility();
  const { theme, toggleTheme } = useTheme();
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
      id: 'symptoms',
      path: '/symptoms',
      label: 'Symptoms Checker',
      icon: <Stethoscope size={20} />,
      description: 'Describe your symptoms'
    },
    {
      id: 'doctors',
      path: '/doctors',
      label: 'Find Doctors',
      icon: <Users size={20} />,
      description: 'Search specialists'
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
      focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-1
      ${settings.mode === 'elderly' ? 'text-lg' : 'text-base'}
    `;

    if (isActive) {
      return `${baseClasses} bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100`;
    }

    return `${baseClasses} text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700`;
  };

  const getIconClasses = (isActive) => {
    if (isActive) {
      return 'text-blue-600 dark:text-blue-300';
    }
    return 'text-gray-500 dark:text-gray-400';
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
        bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700
        h-screen sticky top-0
        transition-all duration-300
        ${collapsed ? 'w-16' : 'w-64'}
        ${className}
      `}>
        {/* Header */}
        <div className={`
          p-4 border-b border-gray-200 dark:border-slate-700
          ${collapsed ? 'text-center' : ''}
        `}>
          <div className="flex items-center justify-between">
            {!collapsed ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Stethoscope size={24} className="text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h1 className="font-bold dark:text-white">SmartHealth</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Navigation</p>
                  </div>
                </div>
                <button
                  onClick={onToggleCollapse}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700"
                  aria-label="Collapse menu"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={onToggleCollapse}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 mx-auto"
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
              <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold mb-2 px-4">
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
              <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold mb-2 px-4">
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
              <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold mb-2 px-4">
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
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <User size={20} className="text-blue-600 dark:text-blue-300" />
              </div>
              <div className="flex-1">
                <p className="font-medium dark:text-white">John Doe</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Patient</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings size={18} className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Profile Settings</span>
              </div>
              <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
            </button>
          </div>
        )}
      </aside>
    );
  };

  const renderTopNav = () => {
    return (
      <nav className={`
        bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700
        sticky top-0 z-30
        ${className}
      `}>
        <div className="max-w-full px-6">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={onMobileMenuToggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 lg:hidden"
              aria-label="Toggle mobile menu"
            >
              <Menu size={24} className="dark:text-gray-200" />
            </button>

            {/* Left Section - Navigation Links */}
            <div className="hidden lg:flex items-center space-x-2">
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
                      flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-600 dark:bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                      }
                    `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
              
              {/* Profile link in top navigation */}
              <NavLink
                to="/profile"
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${activePath === '/profile'
                    ? 'bg-blue-600 dark:bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }
                `}
              >
                <User size={20} />
                <span>Profiles</span>
              </NavLink>
              
              {/* Settings link in top navigation */}
              <NavLink
                to="/settings"
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${activePath === '/settings'
                    ? 'bg-blue-600 dark:bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }
                `}
              >
                <Settings size={20} />
                <span>Settings</span>
              </NavLink>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle theme"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? (
                  <Moon size={20} className="text-gray-700" />
                ) : (
                  <Sun size={20} className="text-gray-300" />
                )}
              </button>

              {/* Mode Toggle */}
              <div className="relative">
                <ModeToggle 
                  compact={true}
                  position="inline"
                  floating={false}
                  autoClose={true}
                  showLabels={true}
                />
              </div>
              
              {settings.voiceAssistance && (
                <button
                  className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
                  aria-label="Voice assistant"
                >
                  <Volume2 size={20} />
                </button>
              )}
              
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 relative"
                aria-label="Notifications"
              >
                <Bell size={20} className="dark:text-gray-200" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              <button
                onClick={() => navigate('/profile')}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
                aria-label="User profile"
              >
                <User size={20} className="dark:text-gray-200" />
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
          w-64 h-full bg-white dark:bg-slate-800 shadow-xl
          transform transition-transform duration-300
          ${showMobileMenu ? 'translate-x-0' : position === 'left' ? '-translate-x-full' : 'translate-x-full'}
        `}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Stethoscope size={24} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h1 className="font-bold dark:text-white">SmartHealth</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Mobile Menu</p>
                </div>
              </div>
              <button
                onClick={onMobileMenuToggle}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700"
                aria-label="Close menu"
              >
                <X size={24} className="dark:text-gray-200" />
              </button>
            </div>
          </div>

          {/* Menu Content */}
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-semibold mb-3">
                Main Navigation
              </h3>
              <div className="space-y-1">
                {mainMenuItems.map(renderNavItem)}
              </div>
            </div>

            <div>
              <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-semibold mb-3">
                My Account
              </h3>
              <div className="space-y-1">
                {userMenuItems.map(renderNavItem)}
              </div>
            </div>

            <div>
              <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-semibold mb-3">
                Preferences
              </h3>
              <div className="space-y-1">
                {settingsMenuItems.map(renderNavItem)}
              </div>
            </div>

            {/* Theme Toggle in Mobile Menu */}
            <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle theme"
              >
                <div className="flex items-center gap-3">
                  {theme === 'light' ? (
                    <>
                      <Moon size={20} className="text-gray-600 dark:text-gray-300" />
                      <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun size={20} className="text-gray-600 dark:text-gray-300" />
                      <span className="text-gray-700 dark:text-gray-300">Light Mode</span>
                    </>
                  )}
                </div>
                <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
              </button>
            </div>

            {/* User Info */}
            <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <User size={24} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="font-bold dark:text-white">John Doe</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">john@example.com</p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  navigate('/settings');
                  onMobileMenuToggle();
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <div className="flex items-center gap-3">
                  <Settings size={18} className="text-gray-500 dark:text-gray-400" />
                  <span className="dark:text-gray-300">Profile Settings</span>
                </div>
                <ChevronRight size={16} className="dark:text-gray-500" />
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
      <nav className="bg-gray-50 dark:bg-slate-800 py-3 px-4 border-b border-gray-200 dark:border-slate-700">
        <div className="container mx-auto">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <NavLink to="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
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
                  <ChevronRight size={14} className="text-gray-400 dark:text-gray-500 mx-2" />
                  {isLast ? (
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{label}</span>
                  ) : (
                    <NavLink 
                      to={path} 
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
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
      return renderTopNav();
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