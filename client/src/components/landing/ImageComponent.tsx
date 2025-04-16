import React from 'react';
import { Component } from '@shared/schema';

interface ImageComponentProps {
  component: Component;
}

export default function ImageComponent({ component }: ImageComponentProps) {
  const { content, style } = component;
  
  // Default values
  const url = content.url || '';
  const alt = content.alt || 'Image';
  const caption = content.caption;

  // Generate inline style object
  const containerStyle = {
    padding: style.padding || '0',
    margin: style.margin || '1rem 0',
    textAlign: style.textAlign || 'center',
    width: style.width || '100%',
    ...style
  };

  const imageStyle = {
    width: '100%',
    borderRadius: style.borderRadius || '0.5rem',
    border: style.border || 'none',
    boxShadow: style.boxShadow || 'none',
  };

  const captionStyle = {
    fontSize: style.captionFontSize || '0.875rem',
    color: style.captionColor || '#6b7280',
    marginTop: '0.5rem',
    fontStyle: 'italic'
  };

  return (
    <div style={containerStyle}>
      {url ? (
        <img 
          src={url} 
          alt={alt} 
          style={imageStyle}
        />
      ) : (
        <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
          <i className="ri-image-line text-4xl text-gray-400"></i>
        </div>
      )}
      
      {caption && (
        <p style={captionStyle}>{caption}</p>
      )}
    </div>
  );
}
