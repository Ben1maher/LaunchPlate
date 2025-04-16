import React from 'react';
import { Component } from '@shared/schema';

interface DividerComponentProps {
  component: Component;
}

export default function DividerComponent({ component }: DividerComponentProps) {
  const { content, style } = component;
  
  // Default values
  const dividerStyle = content.style || 'solid';

  // Generate inline style object
  const containerStyle = {
    padding: style.padding || '0',
    margin: style.margin || '32px 0',
    ...style
  };

  // Style for the actual line
  const lineStyle = {
    borderTop: dividerStyle === 'solid' ? `1px solid ${style.color || '#e5e7eb'}` :
              dividerStyle === 'dashed' ? `1px dashed ${style.color || '#e5e7eb'}` :
              dividerStyle === 'dotted' ? `1px dotted ${style.color || '#e5e7eb'}` :
              `1px solid ${style.color || '#e5e7eb'}`,
    width: '100%'
  };

  return (
    <div style={containerStyle}>
      <hr style={lineStyle} />
    </div>
  );
}
