import React from 'react';
import { Component } from '@shared/schema';

interface SpacerComponentProps {
  component: Component;
}

export default function SpacerComponent({ component }: SpacerComponentProps) {
  const { content, style } = component;
  
  // Default height
  const height = content.height || 50;

  // Generate inline style object
  const spacerStyle = {
    height: `${height}px`,
    width: '100%',
    ...style
  };

  return (
    <div 
      style={spacerStyle} 
      className="w-full"
      aria-hidden="true"
    ></div>
  );
}
