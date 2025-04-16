import React from 'react';
import { Component } from '@shared/schema';

interface TextComponentProps {
  component: Component;
}

export default function TextComponent({ component }: TextComponentProps) {
  const { type, content, style } = component;
  
  // Generate inline style object
  const containerStyle = {
    padding: style.padding || '0',
    margin: style.margin || '1rem 0',
    fontFamily: style.fontFamily,
    textAlign: style.textAlign || 'left',
    ...style
  };

  // For heading component
  if (type === 'heading') {
    const headingLevel = content.level || 'h2';
    const headingText = content.text || 'Section Heading';
    
    const headingStyle = {
      fontSize: style.fontSize || getDefaultHeadingSize(headingLevel),
      fontWeight: style.fontWeight || 'bold',
      color: style.color || '#111827',
      lineHeight: style.lineHeight || '1.2',
      ...containerStyle
    };

    switch (headingLevel) {
      case 'h1':
        return <h1 style={headingStyle}>{headingText}</h1>;
      case 'h2':
        return <h2 style={headingStyle}>{headingText}</h2>;
      case 'h3':
        return <h3 style={headingStyle}>{headingText}</h3>;
      case 'h4':
        return <h4 style={headingStyle}>{headingText}</h4>;
      default:
        return <h2 style={headingStyle}>{headingText}</h2>;
    }
  }
  
  // For text block component
  const textStyle = {
    fontSize: style.fontSize || '1rem',
    fontWeight: style.fontWeight || 'normal',
    color: style.color || '#4b5563',
    lineHeight: style.lineHeight || '1.5',
    ...containerStyle
  };
  
  return (
    <p style={textStyle}>
      {content.text || 'Add your text here. This can be a paragraph describing your product, service, or offering.'}
    </p>
  );
}

// Helper function to get default font size for different heading levels
function getDefaultHeadingSize(level: string): string {
  switch (level) {
    case 'h1':
      return '2.5rem';
    case 'h2':
      return '2rem';
    case 'h3':
      return '1.5rem';
    case 'h4':
      return '1.25rem';
    default:
      return '2rem';
  }
}
