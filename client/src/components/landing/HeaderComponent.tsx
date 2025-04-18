import React, { useState, useEffect } from 'react';
import { Component } from '@shared/schema';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderComponentProps {
  component: Component;
}

export default function HeaderComponent({ component }: HeaderComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Extract component data
  const { type, content, style } = component;
  
  // Default values
  const logo = content.logo || 'Your Logo';
  const menuItems = content.menuItems || [];
  const ctaText = content.ctaText || 'Sign Up';
  const ctaUrl = content.ctaUrl || '#';

  // Set mounted state on initial render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate inline style object
  const styleObj = {
    backgroundColor: style.backgroundColor || '#ffffff',
    borderBottom: style.borderBottom || '1px solid #e5e7eb',
    fontFamily: style.fontFamily,
    color: style.color || '#000000',
    ...style
  };
  
  // CTA button styling
  const ctaButtonStyle = {
    backgroundColor: style.buttonColor || '#3b82f6',
    color: style.buttonTextColor || '#ffffff',
  };
  
  const showCta = type === 'header-1';
  
  // Handle menu toggle
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // If component isn't mounted yet, return null
  if (!isMounted) return null;

  return (
    <nav className="shadow-sm" style={styleObj}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 text-xl font-bold">
            {logo}
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
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

          {/* Mobile menu button - ALWAYS show on mobile */}
          <div className="block md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav - controlled by isOpen state */}
      <div 
        className={`${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} 
        md:hidden overflow-hidden transition-all duration-300 ease-in-out`}
      >
        <div className="px-4 py-2 space-y-3 border-t border-gray-100">
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
            <div className="pt-2 pb-3">
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
    </nav>
  );
}
