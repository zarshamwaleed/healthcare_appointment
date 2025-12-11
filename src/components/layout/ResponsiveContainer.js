import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Maximize2, 
  Minimize2,
  RotateCcw,
  Grid,
  List,
  Columns,
  Eye,
  EyeOff,
  Layout,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

const ResponsiveContainer = ({ 
  children, 
  showControls = true,
  defaultView = 'desktop',
  allowResize = true,
  showGrid = false,
  showBreakpoints = false
}) => {
  const { settings } = useAccessibility();
  const [currentView, setCurrentView] = useState(defaultView);
  const [containerWidth, setContainerWidth] = useState('100%');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGridOverlay, setShowGridOverlay] = useState(showGrid);
  const [showBreakpointLabels, setShowBreakpointLabels] = useState(showBreakpoints);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [orientation, setOrientation] = useState('landscape');

  const breakpoints = {
    mobile: { width: 375, height: 667, label: 'Mobile (375px)', icon: <Smartphone size={16} /> },
    'mobile-large': { width: 425, height: 812, label: 'Large Mobile (425px)', icon: <Smartphone size={18} /> },
    tablet: { width: 768, height: 1024, label: 'Tablet (768px)', icon: <Tablet size={16} /> },
    laptop: { width: 1024, height: 768, label: 'Laptop (1024px)', icon: <Monitor size={16} /> },
    desktop: { width: 1280, height: 800, label: 'Desktop (1280px)', icon: <Monitor size={18} /> },
    'desktop-large': { width: 1440, height: 900, label: 'Large Desktop (1440px)', icon: <Monitor size={20} /> },
    full: { width: '100%', height: 'auto', label: 'Full Width', icon: <Maximize2 size={16} /> }
  };

  // Handle orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      setOrientation(isPortrait ? 'portrait' : 'landscape');
    };

    handleOrientationChange();
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case '1': setCurrentView('mobile'); break;
          case '2': setCurrentView('tablet'); break;
          case '3': setCurrentView('desktop'); break;
          case '4': setCurrentView('full'); break;
          case 'g': setShowGridOverlay(prev => !prev); break;
          case 'b': setShowBreakpointLabels(prev => !prev); break;
          case 'f': toggleFullscreen(); break;
          case '+': case '=': handleZoomChange(10); break;
          case '-': handleZoomChange(-10); break;
          case '0': setZoomLevel(100); break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view === 'full') {
      setContainerWidth('100%');
    } else {
      setContainerWidth(`${breakpoints[view].width}px`);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleZoomChange = (change) => {
    const newZoom = Math.max(25, Math.min(300, zoomLevel + change));
    setZoomLevel(newZoom);
  };

  const resetView = () => {
    setCurrentView(defaultView);
    setZoomLevel(100);
    setContainerWidth(
      defaultView === 'full' 
        ? '100%' 
        : `${breakpoints[defaultView].width}px`
    );
    setShowGridOverlay(false);
    setShowBreakpointLabels(false);
  };

  const handleResize = (direction, amount = 10) => {
    if (!allowResize || currentView === 'full') return;

    const currentBreakpoint = breakpoints[currentView];
    const currentWidth = parseInt(containerWidth);
    
    let newWidth = direction === 'increase' 
      ? currentWidth + amount 
      : currentWidth - amount;
    
    // Clamp to reasonable bounds
    newWidth = Math.max(320, Math.min(2000, newWidth));
    
    setContainerWidth(`${newWidth}px`);
  };

  const getCurrentBreakpoint = () => {
    const width = containerWidth === '100%' 
      ? window.innerWidth 
      : parseInt(containerWidth);
    
    if (width < 425) return 'mobile';
    if (width < 768) return 'mobile-large';
    if (width < 1024) return 'tablet';
    if (width < 1280) return 'laptop';
    if (width < 1440) return 'desktop';
    return 'desktop-large';
  };

  const getGridColumns = () => {
    const width = containerWidth === '100%' 
      ? window.innerWidth 
      : parseInt(containerWidth);
    
    if (width < 640) return 4;
    if (width < 768) return 6;
    if (width < 1024) return 8;
    return 12;
  };

  const renderDeviceFrame = () => {
    if (currentView === 'full') return null;

    const isMobile = currentView.includes('mobile');
    const isTablet = currentView === 'tablet';
    
    return (
      <div className={`device-frame ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`}>
        {/* Device top bar */}
        <div className="device-top-bar">
          <div className="device-camera"></div>
          <div className="device-speaker"></div>
        </div>
        
        {/* Device screen */}
        <div className="device-screen">
          {children}
        </div>
        
        {/* Device bottom bar (for mobile) */}
        {isMobile && <div className="device-home-button"></div>}
      </div>
    );
  };

  const renderBreakpointLabels = () => {
    if (!showBreakpointLabels) return null;

    const labels = [
      { name: 'xs', min: 0, max: 639, color: 'bg-red-500' },
      { name: 'sm', min: 640, max: 767, color: 'bg-orange-500' },
      { name: 'md', min: 768, max: 1023, color: 'bg-yellow-500' },
      { name: 'lg', min: 1024, max: 1279, color: 'bg-green-500' },
      { name: 'xl', min: 1280, max: 1535, color: 'bg-blue-500' },
      { name: '2xl', min: 1536, max: Infinity, color: 'bg-purple-500' }
    ];

    const currentWidth = containerWidth === '100%' 
      ? window.innerWidth 
      : parseInt(containerWidth);

    const currentLabel = labels.find(label => 
      currentWidth >= label.min && currentWidth <= label.max
    );

    return (
      <div className="fixed top-20 right-4 z-40">
        {labels.map(label => (
          <div
            key={label.name}
            className={`flex items-center gap-2 mb-1 px-3 py-1 rounded text-xs font-medium text-white ${
              currentLabel?.name === label.name 
                ? `${label.color} ring-2 ring-white` 
                : `${label.color} opacity-50`
            }`}
          >
            <span>{label.name.toUpperCase()}</span>
            <span>{label.min}-{label.max === Infinity ? '∞' : label.max}px</span>
          </div>
        ))}
      </div>
    );
  };

  const renderGridOverlay = () => {
    if (!showGridOverlay) return null;

    const columns = getGridColumns();
    const columnWidth = 100 / columns;

    return (
      <div className="fixed inset-0 pointer-events-none z-30">
        <div className="container mx-auto h-full">
          <div className="grid h-full" style={{ 
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: '1rem'
          }}>
            {Array.from({ length: columns }).map((_, i) => (
              <div 
                key={i} 
                className="bg-blue-500/10 border border-blue-300/30"
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (!showControls) {
    return (
      <div className={`responsive-container ${settings.mode}`}>
        <div 
          className="responsive-content"
          style={{ 
            width: containerWidth,
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center'
          }}
        >
          {currentView === 'full' ? children : renderDeviceFrame()}
        </div>
        {renderGridOverlay()}
        {renderBreakpointLabels()}
      </div>
    );
  }

  return (
    <div className={`responsive-container ${settings.mode} ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Controls Sidebar */}
      <div className={`controls-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3 className="font-bold">Responsive Controls</h3>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="sidebar-content">
          {/* View Selector */}
          <div className="control-group">
            <h4 className="font-medium mb-2">View</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(breakpoints).map(([key, breakpoint]) => (
                <button
                  key={key}
                  onClick={() => handleViewChange(key)}
                  className={`flex flex-col items-center p-2 rounded border ${
                      currentView === key
                        ? 'bg-primary-100 border-primary-500 text-primary-700'
                        : 'bg-white border-gray-300 hover:bg-gray-50 dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700'
                    }`}
                >
                  {breakpoint.icon}
                  <span className="text-xs mt-1">{key.split('-')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="control-group">
            <h4 className="font-medium mb-2">Zoom: {zoomLevel}%</h4>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleZoomChange(-10)}
                className="flex-1 p-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                <ZoomOut size={16} />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="flex-1 p-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                {zoomLevel}%
              </button>
              <button
                onClick={() => handleZoomChange(10)}
                className="flex-1 p-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                <ZoomIn size={16} />
              </button>
            </div>
          </div>

          {/* Layout Tools */}
          <div className="control-group">
            <h4 className="font-medium mb-2">Layout Tools</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowGridOverlay(!showGridOverlay)}
                className={`p-2 rounded flex items-center gap-2 ${
                  showGridOverlay
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Grid size={16} />
                <span className="text-sm">Grid</span>
              </button>
              <button
                onClick={() => setShowBreakpointLabels(!showBreakpointLabels)}
                className={`p-2 rounded flex items-center gap-2 ${
                  showBreakpointLabels
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Layout size={16} />
                <span className="text-sm">Breakpoints</span>
              </button>
            </div>
          </div>

          {/* Current Breakpoint */}
          <div className="control-group">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Current</div>
              <div className="font-medium">{breakpoints[getCurrentBreakpoint()]?.label}</div>
              <div className="text-sm text-gray-600 mt-1">
                Width: {containerWidth === '100%' ? '100%' : `${parseInt(containerWidth)}px`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Controls Bar */}
        <div className="controls-bar">
          <div className="flex flex-wrap items-center gap-4">
            {/* Sidebar Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              {sidebarOpen ? <ChevronRight size={20} /> : <Menu size={20} />}
            </button>

            {/* View Selector - Compact */}
            <div className="flex items-center gap-1">
              {Object.entries(breakpoints).slice(0, 4).map(([key, breakpoint]) => (
                <button
                  key={key}
                  onClick={() => handleViewChange(key)}
                  className={`p-2 rounded ${
                    currentView === key
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  title={breakpoint.label}
                >
                  {breakpoint.icon}
                </button>
              ))}
            </div>

            {/* Resize Controls */}
            {allowResize && currentView !== 'full' && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleResize('decrease')}
                  className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                  title="Decrease width"
                >
                  ←
                </button>
                <span className="text-sm font-medium min-w-[80px] text-center">
                  {parseInt(containerWidth)}px
                </span>
                <button
                  onClick={() => handleResize('increase')}
                  className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                  title="Increase width"
                >
                  →
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button
                onClick={resetView}
                className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                title="Reset view"
              >
                <RotateCcw size={18} />
              </button>
              <button
                onClick={() => setShowGridOverlay(!showGridOverlay)}
                className={`p-2 rounded ${
                  showGridOverlay
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title="Toggle grid overlay"
              >
                <Grid size={18} />
              </button>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm">Zoom:</span>
            <input
              type="range"
              min="25"
              max="300"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium min-w-[40px]">{zoomLevel}%</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          <div 
            className="responsive-content-wrapper"
            style={{ 
              width: containerWidth,
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              margin: '0 auto'
            }}
          >
            {currentView === 'full' ? children : renderDeviceFrame()}
          </div>
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="font-medium">
                {breakpoints[currentView]?.label}
              </span>
              {currentView !== 'full' && (
                <span>
                  {breakpoints[currentView].width} × {breakpoints[currentView].height}
                </span>
              )}
              <span className="text-gray-600">
                {orientation === 'portrait' ? 'Portrait' : 'Landscape'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                Breakpoint: <span className="font-medium">{getCurrentBreakpoint()}</span>
              </span>
              <span className="text-gray-600">
                Columns: <span className="font-medium">{getGridColumns()}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Overlay */}
      {renderGridOverlay()}

      {/* Breakpoint Labels */}
      {renderBreakpointLabels()}

      {/* Styles */}
      <style jsx>{`
        .responsive-container {
          position: relative;
          height: 100vh;
          display: flex;
          background: linear-gradient(45deg, #f8fafc 25%, transparent 25%),
                      linear-gradient(-45deg, #f8fafc 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #f8fafc 75%),
                      linear-gradient(-45deg, transparent 75%, #f8fafc 75%);
          background-size: 20px 20px;
        }

        .responsive-container.fullscreen {
          height: 100vh;
        }

        .controls-sidebar {
          width: 280px;
          background: white;
          border-right: 1px solid #e2e8f0;
          transition: transform 0.3s ease;
          overflow-y: auto;
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
          z-index: 20;
        }

        @media (max-width: 768px) {
          .controls-sidebar {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            transform: translateX(-100%);
          }

          .controls-sidebar.open {
            transform: translateX(0);
          }
        }

        .sidebar-header {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sidebar-content {
          padding: 1rem;
        }

        .control-group {
          margin-bottom: 1.5rem;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .controls-bar {
          padding: 1rem;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .content-area {
          flex: 1;
          overflow: auto;
          padding: 2rem;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .status-bar {
          padding: 0.75rem 1rem;
          background: white;
          border-top: 1px solid #e2e8f0;
          box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
        }

        .device-frame {
          position: relative;
          border: 12px solid #1a202c;
          border-radius: 24px;
          background: white;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }

        .device-frame.mobile {
          width: 375px;
          height: 667px;
        }

        .device-frame.tablet {
          width: 768px;
          height: 1024px;
          border-radius: 16px;
          border-width: 16px;
        }

        .device-frame.desktop {
          width: 1280px;
          height: 800px;
          border-radius: 8px;
          border-width: 8px;
          border-color: #2d3748;
        }

        .device-top-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 24px;
          background: #1a202c;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .device-camera {
          width: 8px;
          height: 8px;
          background: #4a5568;
          border-radius: 50%;
          margin-right: 8px;
        }

        .device-speaker {
          width: 40px;
          height: 4px;
          background: #4a5568;
          border-radius: 2px;
        }

        .device-screen {
          width: 100%;
          height: 100%;
          overflow: auto;
        }

        .device-home-button {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 40px;
          border: 2px solid #4a5568;
          border-radius: 50%;
        }

        /* Elderly mode adjustments */
        .elderly .responsive-container {
          background-size: 40px 40px;
        }

        .elderly .controls-sidebar {
          width: 320px;
          font-size: 1.1em;
        }

        .elderly .device-frame {
          border-width: 16px;
        }
      `}</style>
    </div>
  );
};

export default ResponsiveContainer;