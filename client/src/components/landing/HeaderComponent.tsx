import React from 'react';
import { Component } from '@shared/schema';
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

  // Generate inline style object
  const styleObj = {
    backgroundColor: style.backgroundColor || '#ffffff',
    padding: style.padding || '16px',
    borderBottom: style.borderBottom || '1px solid #e5e7eb',
    fontFamily: style.fontFamily,
    color: style.color,
    ...style
  };

  // Render header type 1 (with CTA button)
  if (type === 'header-1') {
    return (
      <header style={styleObj} className="py-4 px-4 bg-white">
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
      </header>
    );
  }
  
  // Render header type 2 (without CTA button)
  return (
    <header style={styleObj} className="py-4 px-4 bg-white">
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
      </div>
    </header>
  );
}
