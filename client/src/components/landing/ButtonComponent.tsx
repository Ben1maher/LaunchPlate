import React from 'react';
import { Component } from '@shared/schema';
import { Button } from '@/components/ui/button';

interface ButtonComponentProps {
  component: Component;
}

export default function ButtonComponent({ component }: ButtonComponentProps) {
  const { content, style } = component;
  
  // Default values
  const text = content.text || 'Click Me';
  const url = content.url || '#';
  const buttonType = content.type || 'primary';

  // Container styles
  const containerStyle = {
    display: 'flex',
    justifyContent: style.textAlign === 'center' ? 'center' : 
                    style.textAlign === 'right' ? 'flex-end' : 'flex-start',
    padding: style.padding || '0.5rem 0',
    margin: style.margin || '0',
  };

  // Button styles (separate from the container)
  const buttonStyle = {
    backgroundColor: buttonType === 'primary' ? (style.backgroundColor || '#3b82f6') : 
                     buttonType === 'secondary' ? (style.backgroundColor || '#6366f1') : 'transparent',
    color: style.color || '#ffffff',
    borderRadius: style.borderRadius || '0.25rem',
    fontWeight: style.fontWeight || '500',
    border: buttonType === 'outline' ? `1px solid ${style.borderColor || '#d1d5db'}` : 'none',
    padding: style.buttonPadding || '0.5rem 1rem',
    fontSize: style.fontSize || '1rem',
    fontFamily: style.fontFamily,
    textDecoration: buttonType === 'link' ? 'underline' : 'none',
    ...style
  };

  // Determine the variant based on the button type
  let variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
  
  switch (buttonType) {
    case 'primary':
      variant = 'default';
      break;
    case 'secondary':
      variant = 'secondary';
      break;
    case 'outline':
      variant = 'outline';
      break;
    case 'ghost':
      variant = 'ghost';
      break;
    case 'link':
      variant = 'link';
      break;
    default:
      variant = 'default';
  }

  return (
    <div style={containerStyle}>
      <Button 
        variant={variant}
        className="font-medium"
        style={buttonStyle}
        asChild
      >
        <a href={url}>{text}</a>
      </Button>
    </div>
  );
}
