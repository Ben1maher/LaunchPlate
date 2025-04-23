import React, { useState, useEffect, useRef } from 'react';
import { Component } from '@shared/schema';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';

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
  
  // Start with a clean style object 
  const baseStyleObj: React.CSSProperties = {
    borderBottom: style.borderBottom || '1px solid #e5e7eb'
  };
  
  // DO NOT copy ALL styles from component.style - this was causing issues
  // Only selectively copy the ones we need
  
  // Copy base style to final style object (to be modified)
  let styleObj: React.CSSProperties = { ...baseStyleObj };
  
  // Check for the 'background' property first as it might be set directly with a gradient
  if (style.background && style.backgroundType === 'gradient') {
    console.log('Header: Using direct background gradient:', style.background);
    // Use the background as is - it's already a full CSS gradient
    styleObj.background = `${style.background} !important`;
    
    // These are essential to avoid conflicts
    styleObj.backgroundColor = 'transparent !important';
    styleObj.backgroundImage = 'none !important';
  } 
  // Fallback to construct gradient from individual properties
  else if (style.backgroundType === 'gradient' && style.gradientStartColor && style.gradientEndColor) {
    console.log('Header: Constructing gradient from:', style.gradientStartColor, style.gradientEndColor);
    
    // Construct the gradient
    const gradientCSS = `linear-gradient(${style.gradientDirection || 'to right'}, ${style.gradientStartColor}, ${style.gradientEndColor})`;
    styleObj.background = `${gradientCSS} !important`;
    
    // Clear all competing properties
    styleObj.backgroundImage = 'none !important';
    styleObj.backgroundColor = 'transparent !important';
  } 
  // Handle background images
  else if (style.backgroundType === 'image' && style.backgroundImage) {
    console.log('Header: Applying background image:', style.backgroundImage);
    
    // Handle background image
    styleObj.backgroundImage = `url(${style.backgroundImage}) !important`;
    styleObj.backgroundSize = `${style.backgroundSize || 'cover'} !important`;
    styleObj.backgroundPosition = `${style.backgroundPosition || 'center'} !important`;
    styleObj.backgroundRepeat = `${style.backgroundRepeat || 'no-repeat'} !important`;
    
    // Clear competing properties
    styleObj.background = 'none !important';
    styleObj.backgroundColor = 'transparent !important';
  } 
  // Default to solid color
  else {
    console.log('Header: Using background color:', style.backgroundColor || '#ffffff');
    
    // Default to solid color
    styleObj.backgroundColor = `${style.backgroundColor || '#ffffff'} !important`;
    
    // Clear competing properties
    styleObj.backgroundImage = 'none !important';
    styleObj.background = 'none !important';
  }
  
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
  
  // Add style isolation to prevent inheritance from parent components
  styleObj.position = 'relative';
  styleObj.isolation = 'isolate';
  styleObj.zIndex = 1;
  
  // Generate a unique ID for this header to target it specifically with CSS
  const headerId = useRef(`header-${component?.id || uuidv4()}`);
  
  // Create and inject a style element with high-specificity CSS targeting just this header
  useEffect(() => {
    console.log("HeaderComponent direct DOM styling: Style object", style);
    console.log("HeaderComponent ID:", headerId.current);
    // Create the CSS with very high specificity and !important
    let cssText = '';
    
    if (style.backgroundType === 'color' && style.backgroundColor) {
      cssText = `
        #${headerId.current} {
          background: ${style.backgroundColor} !important;
          background-color: ${style.backgroundColor} !important;
          background-image: none !important;
        }
      `;
    } 
    else if (style.backgroundType === 'gradient' && style.gradientStartColor && style.gradientEndColor) {
      const gradient = `linear-gradient(${style.gradientDirection || 'to right'}, ${style.gradientStartColor}, ${style.gradientEndColor})`;
      cssText = `
        #${headerId.current} {
          background: ${gradient} !important;
          background-image: ${gradient} !important;
          background-color: transparent !important;
        }
      `;
    }
    else if (style.backgroundType === 'image' && style.backgroundImage) {
      // Make sure we have a proper url() format for the background image
      const imageUrl = style.backgroundImage.startsWith('url(') 
        ? style.backgroundImage 
        : `url(${style.backgroundImage})`;
        
      cssText = `
        #${headerId.current} {
          background-image: ${imageUrl} !important;
          background-size: ${style.backgroundSize || 'cover'} !important;
          background-position: ${style.backgroundPosition || 'center'} !important;
          background-repeat: ${style.backgroundRepeat || 'no-repeat'} !important;
          background-color: transparent !important;
        }
      `;
    }
    
    if (cssText) {
      // Create or update style element
      let styleEl = document.getElementById(`style-${headerId.current}`);
      
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = `style-${headerId.current}`;
        document.head.appendChild(styleEl);
      }
      
      styleEl.textContent = cssText;
      console.log("HeaderComponent: Applied CSS:", cssText);
      
      // Clean up on unmount
      return () => {
        if (styleEl && styleEl.parentNode) {
          styleEl.parentNode.removeChild(styleEl);
        }
      };
    }
  }, [style.backgroundType, style.backgroundColor, style.gradientStartColor, style.gradientEndColor, 
      style.gradientDirection, style.backgroundImage, style.backgroundSize, style.backgroundPosition, 
      style.backgroundRepeat]);
  
  return (
    <nav id={headerId.current} className="shadow-sm relative" style={{}}>
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
