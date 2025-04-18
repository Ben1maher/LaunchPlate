import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import types directly without using path aliases
interface Component {
  id: string;
  type: string;
  content: Record<string, any>;
  style: Record<string, any>;
}

interface HeaderComponentProps {
  component: Component;
}

export default function HeaderComponent({ component }: HeaderComponentProps) {
  // State for mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State to track window width
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Extract component data
  const { type, content, style } = component;
  
  // Default values
  const logo = content.logo || 'Your Logo';
  const menuItems = content.menuItems || [];
  const ctaText = content.ctaText || 'Sign Up';
  const ctaUrl = content.ctaUrl || '#';
  
  // Show CTA button for header-1 type only
  const showCta = type === 'header-1';
  
  // Generate inline style object
  const headerStyle = {
    backgroundColor: style.backgroundColor || '#ffffff',
    borderBottom: style.borderBottom || '1px solid #e5e7eb',
    fontFamily: style.fontFamily,
    color: style.color || '#000000',
  };
  
  // CTA button styling
  const ctaButtonStyle = {
    backgroundColor: style.buttonColor || '#3b82f6',
    color: style.buttonTextColor || '#ffffff',
  };
  
  // Whether to show mobile menu UI
  const isMobile = windowWidth < 768;
  
  return (
    <div className="w-full shadow-sm" style={headerStyle}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header container */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 text-xl font-bold z-10">
            {logo}
          </div>
          
          {/* Desktop Navigation - only visible on screens >= 768px */}
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
                  className="bg-primary text-white ml-2"
                  style={ctaButtonStyle}
                  asChild
                >
                  <a href={ctaUrl}>{ctaText}</a>
                </Button>
              )}
            </div>
          )}
          
          {/* Mobile Menu Button - only visible on screens < 768px */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          )}
        </div>
        
        {/* Mobile Navigation Menu - only visible when mobileMenuOpen is true */}
        {isMobile && mobileMenuOpen && (
          <div className="mt-4 pt-2 pb-4 border-t border-gray-100">
            <div className="space-y-3">
              {menuItems.map((item: any, index: number) => (
                <a
                  key={index}
                  href={item.url}
                  className="block py-2 text-gray-700 hover:text-primary font-medium"
                  onClick={() => setMobileMenuOpen(false)}
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
          </div>
        )}
      </div>
    </div>
  );
}