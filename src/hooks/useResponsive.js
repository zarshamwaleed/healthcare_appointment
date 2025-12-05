// src/hooks/useResponsive.js
import { useState, useEffect, useCallback } from 'react';

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  const [breakpoint, setBreakpoint] = useState('desktop');
  const [orientation, setOrientation] = useState('landscape');

  // Breakpoint definitions
  const BREAKPOINTS = {
    xs: 480,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  };

  // Update window size on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      // Update orientation
      setOrientation(
        window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      );
    };

    // Set initial values
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update breakpoint based on window width
  useEffect(() => {
    const width = windowSize.width;
    
    if (width < BREAKPOINTS.xs) {
      setBreakpoint('xs');
    } else if (width < BREAKPOINTS.sm) {
      setBreakpoint('sm');
    } else if (width < BREAKPOINTS.md) {
      setBreakpoint('md');
    } else if (width < BREAKPOINTS.lg) {
      setBreakpoint('lg');
    } else if (width < BREAKPOINTS.xl) {
      setBreakpoint('xl');
    } else if (width < BREAKPOINTS['2xl']) {
      setBreakpoint('2xl');
    } else {
      setBreakpoint('3xl');
    }
  }, [windowSize.width]);

  // Check if current viewport matches a breakpoint
  const isBreakpoint = useCallback((bp) => {
    const width = windowSize.width;
    
    switch (bp) {
      case 'xs': return width < BREAKPOINTS.xs;
      case 'sm': return width >= BREAKPOINTS.xs && width < BREAKPOINTS.sm;
      case 'md': return width >= BREAKPOINTS.sm && width < BREAKPOINTS.md;
      case 'lg': return width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
      case 'xl': return width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl;
      case '2xl': return width >= BREAKPOINTS.xl && width < BREAKPOINTS['2xl'];
      case '3xl': return width >= BREAKPOINTS['2xl'];
      default: return false;
    }
  }, [windowSize.width]);

  // Check if screen is mobile (less than md)
  const isMobile = useCallback(() => {
    return windowSize.width < BREAKPOINTS.md;
  }, [windowSize.width]);

  // Check if screen is tablet (between md and lg)
  const isTablet = useCallback(() => {
    return windowSize.width >= BREAKPOINTS.md && windowSize.width < BREAKPOINTS.lg;
  }, [windowSize.width]);

  // Check if screen is desktop (lg and above)
  const isDesktop = useCallback(() => {
    return windowSize.width >= BREAKPOINTS.lg;
  }, [windowSize.width]);

  // Check if screen is small mobile (xs)
  const isSmallMobile = useCallback(() => {
    return windowSize.width < BREAKPOINTS.xs;
  }, [windowSize.width]);

  // Get appropriate font size based on screen size
  const getResponsiveFontSize = useCallback((baseSize = 16) => {
    const width = windowSize.width;
    
    if (width < BREAKPOINTS.sm) {
      return baseSize * 0.9; // 90% on small screens
    } else if (width < BREAKPOINTS.md) {
      return baseSize * 0.95; // 95% on medium-small screens
    } else if (width < BREAKPOINTS.lg) {
      return baseSize; // 100% on medium screens
    } else if (width < BREAKPOINTS.xl) {
      return baseSize * 1.05; // 105% on large screens
    } else {
      return baseSize * 1.1; // 110% on extra large screens
    }
  }, [windowSize.width]);

  // Get appropriate spacing based on screen size
  const getResponsiveSpacing = useCallback((baseSpacing = 1) => {
    const multiplier = isMobile() ? 0.8 : isTablet() ? 0.9 : 1;
    return baseSpacing * multiplier;
  }, [isMobile, isTablet]);

  // Get number of columns for grid based on screen size
  const getGridColumns = useCallback((defaultColumns = 3) => {
    if (windowSize.width < BREAKPOINTS.sm) {
      return 1;
    } else if (windowSize.width < BREAKPOINTS.md) {
      return Math.min(2, defaultColumns);
    } else if (windowSize.width < BREAKPOINTS.lg) {
      return Math.min(3, defaultColumns);
    } else {
      return defaultColumns;
    }
  }, [windowSize.width]);

  // Check if device has touch capability
  const hasTouch = useCallback(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Check if device is in dark mode
  const prefersDarkMode = useCallback(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, []);

  // Check if device has reduced motion preference
  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Get appropriate image size based on screen and pixel density
  const getImageSize = useCallback((baseSize = 300) => {
    const pixelRatio = window.devicePixelRatio || 1;
    const width = windowSize.width;
    
    let sizeMultiplier = 1;
    
    if (width < BREAKPOINTS.sm) {
      sizeMultiplier = 0.5;
    } else if (width < BREAKPOINTS.md) {
      sizeMultiplier = 0.75;
    } else if (width < BREAKPOINTS.lg) {
      sizeMultiplier = 0.9;
    }
    
    return Math.round(baseSize * sizeMultiplier * pixelRatio);
  }, [windowSize.width]);

  // Responsive layout helper for conditional rendering
  const responsiveRender = useCallback(({
    mobile: mobileComponent,
    tablet: tabletComponent,
    desktop: desktopComponent,
    default: defaultComponent
  }) => {
    if (isMobile() && mobileComponent) {
      return mobileComponent;
    } else if (isTablet() && tabletComponent) {
      return tabletComponent;
    } else if (isDesktop() && desktopComponent) {
      return desktopComponent;
    }
    return defaultComponent;
  }, [isMobile, isTablet, isDesktop]);

  return {
    // State
    windowSize,
    breakpoint,
    orientation,
    
    // Device detection
    isMobile,
    isTablet,
    isDesktop,
    isSmallMobile,
    isBreakpoint,
    hasTouch,
    prefersDarkMode,
    prefersReducedMotion,
    
    // Responsive utilities
    getResponsiveFontSize,
    getResponsiveSpacing,
    getGridColumns,
    getImageSize,
    responsiveRender,
    
    // Breakpoint values
    breakpoints: BREAKPOINTS
  };
};

export default useResponsive;