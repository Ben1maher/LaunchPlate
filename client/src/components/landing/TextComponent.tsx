import React from 'react';
import { Component } from '@shared/schema';

interface TextComponentProps {
  component: Component;
}

export default function TextComponent({ component }: TextComponentProps) {
  const { type, content, style } = component;
  
  // Generate inline style object with proper margin and padding handling
  const containerStyle: any = {
    // Handle individual padding values if specified, otherwise use the general padding
    paddingTop: style.paddingTop || style.padding?.split(' ')[0] || '0',
    paddingRight: style.paddingRight || (style.padding?.split(' ')[1] || style.padding?.split(' ')[0] || '0'),
    paddingBottom: style.paddingBottom || (style.padding?.split(' ')[2] || style.padding?.split(' ')[0] || '0'),
    paddingLeft: style.paddingLeft || (style.padding?.split(' ')[3] || style.padding?.split(' ')[1] || style.padding?.split(' ')[0] || '0'),
    
    // Handle individual margin values if specified, otherwise use the general margin
    marginTop: style.marginTop || style.margin?.split(' ')[0] || '0',
    marginRight: style.marginRight || (style.margin?.split(' ')[1] || style.margin?.split(' ')[0] || '0'),
    marginBottom: style.marginBottom || (style.margin?.split(' ')[2] || style.margin?.split(' ')[0] || '1rem'),
    marginLeft: style.marginLeft || (style.margin?.split(' ')[3] || style.margin?.split(' ')[1] || style.margin?.split(' ')[0] || '0'),
    
    fontFamily: style.fontFamily,
    textAlign: style.textAlign || 'left',
    borderRadius: style.borderRadius,
    border: style.border,
    boxShadow: style.boxShadow,
    
    // Ensure styling is contained to this component only 
    position: 'relative',
    isolation: 'isolate',
  };
  
  // Handle background styles (solid color, gradient, or image)
  // Apply background styles with the highest specificity and isolation
  if (style.backgroundType === 'gradient' && style.background) {
    // Override all background properties to ensure clean gradient application
    containerStyle.background = `${style.background} !important`;
    containerStyle.backgroundColor = 'transparent !important';
    containerStyle.backgroundImage = 'none !important';
    // Add a pseudo-element to ensure the gradient background is rendered on top
    containerStyle.position = 'relative';
    containerStyle.isolation = 'isolate';
  } else if (style.backgroundType === 'image' && style.backgroundImage) {
    // Override all background properties for image
    containerStyle.backgroundImage = `url("${style.backgroundImage}") !important`;
    containerStyle.backgroundColor = 'transparent !important';
    containerStyle.background = 'none !important';
    containerStyle.backgroundSize = `${style.backgroundSize || 'cover'} !important`;
    containerStyle.backgroundPosition = `${style.backgroundPosition || 'center'} !important`;
    containerStyle.backgroundRepeat = `${style.backgroundRepeat || 'no-repeat'} !important`;
    containerStyle.position = 'relative';
    containerStyle.isolation = 'isolate';
  } else if (style.backgroundColor) {
    // Override all background properties for solid color
    containerStyle.backgroundColor = `${style.backgroundColor} !important`;
    containerStyle.background = 'none !important';
    containerStyle.backgroundImage = 'none !important';
    containerStyle.position = 'relative';
    containerStyle.isolation = 'isolate';
  } else {
    // Default transparent background
    containerStyle.backgroundColor = 'transparent';
    containerStyle.background = 'none';
    containerStyle.backgroundImage = 'none';
  }

  // For heading component
  if (type === 'heading') {
    const headingLevel = content.level || 'h2';
    const headingText = content.text || 'Section Heading';
    
    const headingStyle = {
      fontSize: style.fontSize || getDefaultHeadingSize(headingLevel),
      fontWeight: style.fontWeight || 'bold',
      color: style.color || '#111827',
      lineHeight: style.lineHeight || '1.2',
      wordWrap: 'break-word' as 'break-word',
      hyphens: 'auto' as 'auto',
      maxWidth: '100%',
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
  
  // For text block component with mobile optimization
  const textStyle = {
    fontSize: style.fontSize || 'clamp(0.875rem, 2vw, 1rem)',
    fontWeight: style.fontWeight || 'normal',
    color: style.color || '#4b5563',
    lineHeight: style.lineHeight || '1.5',
    wordWrap: 'break-word' as 'break-word',
    hyphens: 'auto' as 'auto',
    maxWidth: '100%',
    ...containerStyle
  };
  
  return (
    <p style={textStyle}>
      {content.text || 'Add your text here. This can be a paragraph describing your product, service, or offering.'}
    </p>
  );
}

// Helper function to get default font size for different heading levels with responsive sizes
function getDefaultHeadingSize(level: string): string {
  switch (level) {
    case 'h1':
      return 'clamp(2rem, 5vw, 2.5rem)';
    case 'h2':
      return 'clamp(1.5rem, 4vw, 2rem)';
    case 'h3':
      return 'clamp(1.25rem, 3vw, 1.5rem)';
    case 'h4':
      return 'clamp(1rem, 2vw, 1.25rem)';
    default:
      return 'clamp(1.5rem, 4vw, 2rem)';
  }
}
