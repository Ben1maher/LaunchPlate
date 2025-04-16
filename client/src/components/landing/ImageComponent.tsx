import React, { useState } from 'react';
import { Component } from '@shared/schema';

interface ImageComponentProps {
  component: Component;
}

export default function ImageComponent({ component }: ImageComponentProps) {
  const { content, style } = component;
  const [imageError, setImageError] = useState(false);
  
  // Default values
  const url = content.url || '';
  const alt = content.alt || 'Image';
  const caption = content.caption;

  // Reset error state if URL changes
  React.useEffect(() => {
    setImageError(false);
  }, [url]);

  // Generate inline style object
  const containerStyle = {
    padding: style.padding || '0',
    margin: style.margin || '1rem 0',
    textAlign: style.textAlign || 'center',
    width: style.width || '100%',
    maxWidth: style.maxWidth || '100%',
    ...style
  };

  const imageStyle = {
    width: '100%',
    maxWidth: '100%',
    height: style.height || 'auto',
    objectFit: style.objectFit || 'cover',
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

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div style={containerStyle}>
      {url && !imageError ? (
        <img 
          src={url} 
          alt={alt} 
          style={imageStyle}
          onError={handleImageError}
        />
      ) : (
        <div 
          className="bg-gray-100 rounded-lg flex flex-col items-center justify-center p-8"
          style={{
            minHeight: style.height || '240px',
            aspectRatio: style.aspectRatio || '16/9',
            border: '2px dashed #e5e7eb'
          }}
        >
          <i className="ri-image-line text-5xl text-gray-400 mb-4"></i>
          <p className="text-gray-500 text-sm text-center max-w-xs">
            {imageError 
              ? "Image failed to load. Please check the URL and try again." 
              : "No image set. Add an image URL in the properties panel."}
          </p>
        </div>
      )}
      
      {caption && (
        <p style={captionStyle}>{caption}</p>
      )}
    </div>
  );
}
