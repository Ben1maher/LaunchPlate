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
      className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden absolute top-full left-0 right-0 z-50 shadow-lg`}
      style={{ backgroundColor: style.backgroundColor || '#ffffff' }}
    >
      <div className="px-4 py-3 space-y-3">
        {menuItems.map((item: any, index: number) => (
          <a 
            key={index} 
            href={item.url} 
            className="block font-medium text-gray-600 hover:text-gray-900 py-2 border-b border-gray-100"
            style={{ color: style.color }}
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.text}
          </a>
        ))}
        {type === 'header-1' && (
          <div className="pt-2 pb-3">
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
      className="md:hidden flex flex-col justify-center items-center w-8 h-8 rounded-md focus:outline-none"
      onClick={toggleMobileMenu}
      aria-label="Toggle menu"
    >
      <span className={`block w-5 h-0.5 bg-gray-600 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`} style={{ marginBottom: '3px' }}></span>
      <span className={`block w-5 h-0.5 bg-gray-600 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} style={{ marginBottom: '3px' }}></span>
      <span className={`block w-5 h-0.5 bg-gray-600 transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
    </button>
  );

  // Render header type 1 (with CTA button)
  if (type === 'header-1') {
    return (
      <header style={styleObj} className="py-4 px-4 bg-white relative z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">{logo}</div>
          
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
        <div className="text-2xl font-bold">{logo}</div>
        
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
