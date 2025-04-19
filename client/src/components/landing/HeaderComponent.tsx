import React, { useState } from 'react';
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
  
  return (
    <nav className="bg-white shadow-sm" style={styleObj}>
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
                className="bg-primary text-white"
                style={ctaButtonStyle}
                asChild
              >
                <a href={ctaUrl}>{ctaText}</a>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 border-t border-gray-100">
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
