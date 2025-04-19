import React, { useState, useEffect } from 'react';
import { Component } from '@shared/schema';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderComponentProps {
  component: Component;
}

export default function HeaderComponent({ component }: HeaderComponentProps) {
  // Extract component data
  const { type, content, style } = component;
  
  // Default values
  const logo = content.logo || 'Your Logo';
  const menuItems = content.menuItems || [];
  const ctaText = content.ctaText || 'Sign Up';
  const ctaUrl = content.ctaUrl || '#';
  const showCta = type === 'header-1';
  
  // Generate inline style object
  const styleObj = {
    backgroundColor: style.backgroundColor || '#ffffff',
    borderBottom: style.borderBottom || '1px solid #e5e7eb',
    ...style
  };
  
  // CTA button styling
  const ctaButtonStyle = {
    backgroundColor: style.buttonColor || '#3b82f6',
    color: style.buttonTextColor || '#ffffff',
  };
  
  // State for mobile menu
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile viewport size
  useEffect(() => {
    // Check if we're in the editor preview 
    const checkMobileView = () => {
      // Find the closest viewport container (for editor)
      const viewportContainer = document.querySelector('[data-viewport]');
      
      if (viewportContainer) {
        // We're in the editor - use the data attribute
        const viewport = viewportContainer.getAttribute('data-viewport');
        setIsMobile(viewport === 'mobile');
      } else {
        // We're in a regular view - use media query
        setIsMobile(window.innerWidth < 768);
      }
    };
    
    // Initial check
    checkMobileView();
    
    // Set up mutation observer to detect viewport changes in the editor
    const observer = new MutationObserver(checkMobileView);
    const container = document.body;
    
    observer.observe(container, { 
      attributes: true,
      subtree: true,
      attributeFilter: ['data-viewport']
    });
    
    // Add resize event listener for regular views
    window.addEventListener('resize', checkMobileView);
    
    // Clean up
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);
  
  return (
    <nav className="bg-white shadow-sm relative" style={styleObj}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 text-xl font-bold">
            {logo}
          </div>
          
          {/* For debugging in the editor */}
          <span className="hidden absolute top-0 right-0 text-xs bg-red-100 px-1">
            {isMobile ? 'Mobile' : 'Desktop'}
          </span>

          {/* Desktop Nav */}
          {!isMobile && (
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

          {/* Mobile menu button */}
          {isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 p-2 focus:outline-none border border-gray-200 rounded-md hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobile && isOpen && (
        <div className="px-4 pt-2 pb-4 space-y-2 border-t border-gray-100 bg-white absolute w-full z-50">
          {menuItems.map((item: any, index: number) => (
            <a
              key={index}
              href={item.url}
              className="block py-2 text-gray-700 hover:text-primary font-medium"
              onClick={() => setIsOpen(false)}
            >
              {item.text}
            </a>
          ))}
          
          {/* Mobile CTA button */}
          {showCta && (
            <div className="pt-2">
              <Button 
                className="w-full bg-primary text-white"
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
