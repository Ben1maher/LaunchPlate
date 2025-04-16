import React from 'react';
import { Component } from '@shared/schema';
import { Button } from '@/components/ui/button';

interface HeroComponentProps {
  component: Component;
}

export default function HeroComponent({ component }: HeroComponentProps) {
  // Extract component data
  const { type, content, style } = component;
  
  // Generate inline style object
  const styleObj = {
    backgroundColor: style.backgroundColor || '#f9fafb',
    padding: style.padding || '64px 16px',
    fontFamily: style.fontFamily,
    color: style.color,
    ...style
  };

  // Heading styles
  const headingStyle = {
    fontSize: style.headingFontSize || '2.5rem',
    fontWeight: style.headingFontWeight || 'bold',
    color: style.headingColor || style.color || '#111827',
    lineHeight: '1.2',
    marginBottom: '1rem'
  };

  // Subheading styles
  const subheadingStyle = {
    fontSize: style.subheadingFontSize || '1.25rem',
    color: style.subheadingColor || style.color || '#4b5563',
    marginBottom: '2rem'
  };

  // Button styles
  const primaryButtonStyle = {
    backgroundColor: style.primaryButtonColor || '#3b82f6',
    color: style.primaryButtonTextColor || '#ffffff'
  };

  const secondaryButtonStyle = {
    backgroundColor: 'transparent',
    borderColor: style.secondaryButtonBorderColor || '#d1d5db',
    color: style.secondaryButtonTextColor || '#374151'
  };

  // Split hero (text and image side by side)
  if (type === 'hero-split') {
    return (
      <section style={styleObj} className="py-16">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 space-y-6">
            <h1 style={headingStyle}>
              {content.heading || 'Create Landing Pages That Convert'}
            </h1>
            <p style={subheadingStyle}>
              {content.subheading || 'Build beautiful, responsive landing pages without any coding skills required.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                style={primaryButtonStyle}
                className="px-6 py-3 rounded-md font-medium"
                asChild
              >
                <a href={content.primaryButtonUrl || '#'}>
                  {content.primaryButtonText || 'Get Started'}
                </a>
              </Button>
              <Button 
                variant="outline" 
                style={secondaryButtonStyle}
                className="px-6 py-3 rounded-md font-medium"
                asChild
              >
                <a href={content.secondaryButtonUrl || '#'}>
                  {content.secondaryButtonText || 'Learn More'}
                </a>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            {content.imageUrl ? (
              <img 
                src={content.imageUrl} 
                alt="Hero image"
                className="rounded-lg w-full h-auto"
              />
            ) : (
              <div className="bg-gray-200 rounded-lg h-72 flex items-center justify-center">
                <i className="ri-image-line text-4xl text-gray-400"></i>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
  
  // Centered hero
  return (
    <section style={styleObj} className="py-16 text-center">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        <h1 style={headingStyle}>
          {content.heading || 'Create Landing Pages That Convert'}
        </h1>
        <p style={subheadingStyle}>
          {content.subheading || 'Build beautiful, responsive landing pages without any coding skills required.'}
        </p>
        <div className="flex justify-center">
          <Button 
            style={primaryButtonStyle}
            className="px-6 py-3 rounded-md font-medium"
            asChild
          >
            <a href={content.buttonUrl || '#'}>
              {content.buttonText || 'Get Started'}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
