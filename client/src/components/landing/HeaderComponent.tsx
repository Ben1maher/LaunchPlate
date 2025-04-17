import React from 'react';
import { Component } from '@shared/schema';
import NavBar from '../shared/NavBar';

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
  
  // Create nav items from menu items
  const navItems = menuItems.map((item: any) => ({
    text: item.text,
    url: item.url
  }));
  
  // CTA button config for header type 1
  const ctaButtonConfig = type === 'header-1' ? {
    text: ctaText,
    url: ctaUrl,
    style: {
      backgroundColor: style.buttonColor || '#3b82f6',
      color: style.buttonTextColor || '#ffffff'
    }
  } : undefined;
  
  return (
    <NavBar
      logo={logo}
      items={navItems}
      ctaButton={ctaButtonConfig}
      style={styleObj}
      className="border-b border-gray-100"
    />
  );
}
