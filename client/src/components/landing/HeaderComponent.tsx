import React, { useState } from 'react';
import { Component } from '@shared/schema';
import { Button } from '@/components/ui/button';

interface HeaderComponentProps {
  component: Component;
}

export default function HeaderComponent({ component }: HeaderComponentProps) {
  // State for mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Extract component data
  const { type, content, style } = component;
  
  // Default values
  const logo = content.logo || 'Your Logo';
  const menuItems = content.menuItems || [];
  const ctaText = content.ctaText || 'Sign Up';
  const ctaUrl = content.ctaUrl || '#';

  // Generate inline style object
  const styleObj = {
    backgroundColor: style.backgroundColor || '#ffffff',
    padding: style.padding || '16px',
    borderBottom: style.borderBottom || '1px solid #e5e7eb',
    fontFamily: style.fontFamily,
    color: style.color,
    ...style
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Mobile menu component - shared between header types
  const MobileMenu = () => (
    <div 
      className={`${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-[-10px] opacity-0 pointer-events-none'} 
        md:hidden absolute top-full left-0 right-0 z-50 shadow-lg transition-all duration-200 ease-in-out transform`}
      style={{ 
        backgroundColor: style.backgroundColor || '#ffffff',
        borderTop: '1px solid rgba(0,0,0,0.05)' 
      }}
    >
      <div className="px-5 py-4 space-y-1">
        {menuItems.map((item: any, index: number) => (
          <a 
            key={index} 
            href={item.url} 
            className="block font-medium hover:bg-gray-50 rounded-md py-3 px-3 transition-colors"
            style={{ color: style.color || '#4b5563' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.text}
          </a>
        ))}
        {type === 'header-1' && (
          <div className="pt-3 pb-2">
            <Button 
              className="w-full"
              style={{ 
                backgroundColor: style.buttonColor || '#3b82f6',
                color: style.buttonTextColor || '#ffffff'
              }}
              asChild
            >
              <a href={ctaUrl}>{ctaText}</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // Hamburger button component
  const HamburgerButton = () => (
    <button 
      className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-md focus:outline-none"
      onClick={toggleMobileMenu}
      aria-label="Toggle menu"
      style={{ color: style.color }}
    >
      <div className="w-6 h-6 relative">
        <span 
          className={`absolute block w-6 h-0.5 transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'top-3 rotate-45' : 'top-1'}`} 
          style={{ backgroundColor: style.color || "#374151" }}
        ></span>
        <span 
          className={`absolute block w-6 h-0.5 top-3 transition-all duration-200 ease-in-out ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} 
          style={{ backgroundColor: style.color || "#374151" }}
        ></span>
        <span 
          className={`absolute block w-6 h-0.5 transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'top-3 -rotate-45' : 'top-5'}`} 
          style={{ backgroundColor: style.color || "#374151" }}
        ></span>
      </div>
    </button>
  );

  // Render header type 1 (with CTA button)
  if (type === 'header-1') {
    return (
      <header style={styleObj} className="py-4 px-4 bg-white relative z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-bold truncate max-w-[200px] sm:max-w-none">{logo}</div>
          
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item: any, index: number) => (
              <a 
                key={index} 
                href={item.url} 
                className="font-medium text-gray-600 hover:text-gray-900"
                style={{ color: style.color }}
              >
                {item.text}
              </a>
            ))}
          </nav>
          
          <div className="hidden md:block">
            <Button 
              className="bg-primary-500 text-white"
              style={{ 
                backgroundColor: style.buttonColor || '#3b82f6',
                color: style.buttonTextColor || '#ffffff'
              }}
              asChild
            >
              <a href={ctaUrl}>{ctaText}</a>
            </Button>
          </div>
          
          <HamburgerButton />
        </div>
        
        <MobileMenu />
      </header>
    );
  }
  
  // Render header type 2 (without CTA button)
  return (
    <header style={styleObj} className="py-4 px-4 bg-white relative z-10">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-xl sm:text-2xl font-bold truncate max-w-[200px] sm:max-w-none">{logo}</div>
        
        <nav className="hidden md:flex space-x-8">
          {menuItems.map((item: any, index: number) => (
            <a 
              key={index} 
              href={item.url} 
              className="font-medium text-gray-600 hover:text-gray-900"
              style={{ color: style.color }}
            >
              {item.text}
            </a>
          ))}
        </nav>
        
        <HamburgerButton />
      </div>
      
      <MobileMenu />
    </header>
  );
}
