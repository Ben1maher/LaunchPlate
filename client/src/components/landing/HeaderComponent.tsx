import React, { useState, useEffect } from 'react';
import { Component } from '@shared/schema';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderComponentProps {
  component: Component;
  viewportMode?: 'desktop' | 'tablet' | 'mobile';
}

export default function HeaderComponent({ component, viewportMode }: HeaderComponentProps) {
  // Extract component data
  const { type, content, style } = component;
  
  // Default values
  const logo = content.logo || 'Your Logo';
  const menuItems = content.menuItems || [];
  const ctaText = content.ctaText || 'Sign Up';
  const ctaUrl = content.ctaUrl || '#';
  const showCta = type === 'header-1';
  
  // Get a clean version of the color value without !important tags
  const getCleanColor = (color: string | undefined) => {
    return color?.replace(' !important', '') || '';
  };
  
  // Enhanced style object that includes background styling directly
  // This serves as a fallback if the dynamic CSS styles fail
  const styleObj: React.CSSProperties = {
    borderBottom: style.borderBottom || '1px solid #e5e7eb',
    padding: style.padding || '16px',
    // Apply background styling based on the type
    ...(style.backgroundType === 'color' && {
      backgroundColor: getCleanColor(style.backgroundColor) || '#ffffff',
      background: getCleanColor(style.backgroundColor) || '#ffffff',
    }),
    ...(style.backgroundType === 'gradient' && style.gradientStartColor && style.gradientEndColor && {
      background: `linear-gradient(${style.gradientDirection || 'to right'}, ${style.gradientStartColor}, ${style.gradientEndColor})`,
    }),
  };
  
  // Log any style changes for debugging
  useEffect(() => {
    if (style.backgroundType === 'color') {
      console.log('HeaderComponent: Updating background color to:', getCleanColor(style.backgroundColor));
    } else if (style.backgroundType === 'gradient') {
      console.log('HeaderComponent: Updating background gradient to:', 
        `linear-gradient(${style.gradientDirection || 'to right'}, ${style.gradientStartColor}, ${style.gradientEndColor})`);
    }
    
    // If the style changes significantly, we need to rebuild our style object
    console.log('HeaderComponent: New style object:', style);
  }, [style]);
  
  // Listen for clicks anywhere to refresh our state
  // This helps maintain styling when switching between page and component editing
  useEffect(() => {
    const handleGlobalClick = () => {
      // Force a re-application of styles
      if (style.backgroundType === 'color') {
        console.log('HeaderComponent: Refresh color background on click');
      } else if (style.backgroundType === 'gradient' && style.gradientStartColor && style.gradientEndColor) {
        console.log('HeaderComponent: Refresh gradient background on click');
      } else if (style.backgroundType === 'image' && style.backgroundImage) {
        console.log('HeaderComponent: Refresh image background on click');
      }
    };
    
    document.addEventListener('click', handleGlobalClick);
    
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [style]);
  
  // CTA button styling
  const ctaButtonStyle = {
    backgroundColor: style.buttonColor || '#3b82f6',
    color: style.buttonTextColor || '#ffffff',
  };
  
  // State for mobile/tablet menu
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  // Helper to determine if we should show mobile menu
  const showMobileMenu = isMobile || isTablet;
  
  // Check for mobile and tablet viewport sizes
  useEffect(() => {
    // If viewportMode is provided from the editor context, use it directly
    if (viewportMode) {
      setIsMobile(viewportMode === 'mobile');
      setIsTablet(viewportMode === 'tablet');
      return;
    }

    // Otherwise use our own detection method for non-editor views
    const checkResponsiveView = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    // Initial check
    checkResponsiveView();
    
    // Add resize event listener for regular views
    window.addEventListener('resize', checkResponsiveView);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkResponsiveView);
    };
  }, [viewportMode]);
  
  return (
    <nav className="shadow-sm relative" style={styleObj}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 text-xl font-bold">
            {logo}
          </div>
          
          {/* For debugging in the editor */}
          <span className="absolute top-0 right-0 text-xs bg-red-100 px-1 opacity-50 z-50">
            {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'} {viewportMode && `(${viewportMode})`}
          </span>

          {/* Desktop Nav - only visible on desktop */}
          {!showMobileMenu && (
            <div className="flex items-center space-x-6">
              {menuItems.map((item: any, index: number) => (
                <a
                  key={index}
                  href={item.url}
                  className="text-gray-700 hover:text-primary font-medium"
                >
                  {item.text}
                </a>
              ))}
              
              {/* Desktop CTA button */}
              {showCta && (
                <Button 
                  className="bg-primary text-white"
                  style={ctaButtonStyle}
                  asChild
                >
                  <a href={ctaUrl}>{ctaText}</a>
                </Button>
              )}
            </div>
          )}

          {/* Mobile/Tablet menu button */}
          {showMobileMenu && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`text-gray-700 p-2 focus:outline-none border ${isOpen ? 'border-gray-400 bg-gray-100' : 'border-gray-200'} rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2`}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <>
                  <X size={20} /> 
                  <span className="text-sm">Close</span>
                </>
              ) : (
                <>
                  <Menu size={20} />
                  <span className="text-sm">Menu</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Nav */}
      {showMobileMenu && isOpen && (
        <div 
          className="px-4 pt-2 pb-4 space-y-2 border-t border-gray-100 bg-white absolute w-full z-50 shadow-lg animate-in fade-in slide-in-from-top-5 duration-200"
          style={{ left: 0, right: 0 }}
        >
          {menuItems.map((item: any, index: number) => (
            <a
              key={index}
              href={item.url}
              className="block py-3 px-2 text-gray-700 hover:text-primary hover:bg-gray-50 font-medium rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.text}
            </a>
          ))}
          
          {/* Mobile/Tablet CTA button */}
          {showCta && (
            <div className="pt-3 mt-2 border-t border-gray-100">
              <Button 
                className="w-full bg-primary text-white py-5"
                style={ctaButtonStyle}
                asChild
              >
                <a href={ctaUrl}>{ctaText}</a>
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}