import React from 'react';
import { Component } from '@shared/schema';
import { Button } from '@/components/ui/button';

interface HeroComponentProps {
  component: Component;
  inEditor?: boolean;
  viewportMode?: 'desktop' | 'tablet' | 'mobile';
  onClick?: () => void;
}

export default function HeroComponent({ 
  component, 
  inEditor = false, 
  viewportMode = 'desktop',
  onClick 
}: HeroComponentProps) {
  // Extract component data
  const { type, content, style } = component;
  
  // Start with a clean style object
  const baseStyleObj: React.CSSProperties = {
    position: 'relative' as 'relative',
    overflow: 'hidden',
    padding: style.padding || '64px 16px'
  };
  
  // Add other styles from component.style
  // Ensure we don't copy over properties that might conflict with TypeScript typings
  Object.keys(style).forEach(key => {
    if (key !== 'position' && key !== 'overflow') {
      (baseStyleObj as any)[key] = style[key];
    }
  });
  
  // Copy base style to final style object (to be modified)
  let styleObj: React.CSSProperties = { ...baseStyleObj };
  
  // Apply the appropriate background styling based on the type
  // This will override any background properties in the style object
  if (style.backgroundType === 'gradient') {
    // If the background property is directly set (e.g., by the PropertiesPanel component)
    if (style.background) {
      styleObj.background = style.background;
    } 
    // Otherwise, construct it from gradient properties
    else if (style.gradientStartColor && style.gradientEndColor) {
      styleObj.background = `linear-gradient(${style.gradientDirection || 'to right'}, ${style.gradientStartColor}, ${style.gradientEndColor})`;
    }
    
    // Clear other background properties to avoid conflicts
    delete styleObj.backgroundImage;
    delete styleObj.backgroundColor;
  } else if (style.backgroundType === 'image' && style.backgroundImage) {
    console.log('Applying background image:', style.backgroundImage);
    
    // Explicitly set these properties for background image
    styleObj.backgroundImage = `url(${style.backgroundImage})`;
    styleObj.backgroundSize = style.backgroundSize || 'cover';
    styleObj.backgroundPosition = style.backgroundPosition || 'center';
    styleObj.backgroundRepeat = style.backgroundRepeat || 'no-repeat';
    
    // Clear potentially conflicting properties
    delete styleObj.background;
    delete styleObj.backgroundColor;
  } else {
    // Default to solid color background
    styleObj.backgroundColor = style.backgroundColor || '#f9fafb';
    
    // Clear other background properties to avoid conflicts
    delete styleObj.backgroundImage;
    delete styleObj.background;
  }

  // Heading styles with mobile responsiveness
  const headingStyle = {
    fontSize: style.headingFontSize || 'clamp(1.75rem, 5vw, 2.5rem)', 
    fontWeight: style.headingFontWeight || 'bold',
    color: style.headingColor || style.color || '#111827',
    lineHeight: '1.2',
    marginBottom: '1rem',
    wordBreak: 'normal' as 'normal',
    hyphens: 'none' as 'none',
    whiteSpace: 'normal' as 'normal'
  };

  // Subheading styles with mobile responsiveness
  const subheadingStyle = {
    fontSize: style.subheadingFontSize || 'clamp(1rem, 3vw, 1.25rem)',
    color: style.subheadingColor || style.color || '#4b5563',
    marginBottom: '2rem',
    wordWrap: 'break-word' as 'break-word',
    maxWidth: '100%'
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

  // Create overlay element if needed (for background images)
  const Overlay = () => {
    if (style.backgroundType === 'image' && style.overlayColor) {
      return (
        <div 
          className="absolute inset-0 w-full h-full z-0" 
          style={{ backgroundColor: style.overlayColor }}
        ></div>
      );
    }
    return null;
  };

  // Split hero (text and image side by side)
  if (type === 'hero-split') {
    return (
      <section style={styleObj} className="py-16">
        {/* Background overlay if needed */}
        <Overlay />
        
        {/* Content - with higher z-index to appear above overlay */}
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="md:w-1/2 space-y-6">
            <h1 style={headingStyle}>
              {content.heading || 'Create Landing Pages That Convert'}
            </h1>
            <p style={subheadingStyle}>
              {content.subheading || 'Build beautiful, responsive landing pages without any coding skills required.'}
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Button 
                style={primaryButtonStyle}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium text-sm sm:text-base"
                asChild
              >
                <a href={content.primaryButtonUrl || '#'}>
                  {content.primaryButtonText || 'Get Started'}
                </a>
              </Button>
              <Button 
                variant="outline" 
                style={secondaryButtonStyle}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium text-sm sm:text-base"
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
              <div className="relative group">
                <img 
                  src={content.imageUrl} 
                  alt="Hero image"
                  className="rounded-lg w-full h-auto"
                  style={{
                    maxHeight: content.imageMaxHeight || 'none',
                    objectFit: content.imageObjectFit || 'cover',
                    objectPosition: content.imagePosition || 'center'
                  }}
                />
                {/* Image controls overlay - only visible in editor mode */}
                {inEditor && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="flex gap-2">
                      <button 
                        className="bg-white text-gray-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent selection of component
                          // Create a file input and trigger it
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = async (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (!file) return;
                            
                            try {
                              const formData = new FormData();
                              formData.append('image', file);
                              
                              const response = await fetch('/api/upload/image', {
                                method: 'POST',
                                body: formData
                              });
                              
                              if (response.ok) {
                                const data = await response.json();
                                // Update the image URL through the updateComponent function
                                if (onClick) {
                                  onClick(); // Select the component if it isn't already
                                }
                                // This would be handled by the editor context's updateComponent function
                                const event = new CustomEvent('hero:updateImage', {
                                  detail: {
                                    componentId: component.id,
                                    imageUrl: data.url
                                  }
                                });
                                document.dispatchEvent(event);
                              }
                            } catch (error) {
                              console.error('Error uploading image:', error);
                            }
                          };
                          input.click();
                        }}
                      >
                        Replace
                      </button>
                      <button 
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-600"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent selection of component
                          // This would be handled by the editor context's updateComponent function
                          const event = new CustomEvent('hero:updateImage', {
                            detail: {
                              componentId: component.id,
                              imageUrl: ''
                            }
                          });
                          document.dispatchEvent(event);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div 
                className={`bg-gray-200 rounded-lg h-72 flex items-center justify-center cursor-pointer relative overflow-hidden ${
                  inEditor ? 'hover:bg-gray-300 hover:border-primary hover:border-2 transition-colors' : ''
                }`}
                onClick={(e) => {
                  if (!inEditor) return;
                  e.stopPropagation(); // Prevent selection of component when clicking the dropzone
                  
                  // Create a file input and trigger it
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (!file) return;
                    
                    try {
                      const formData = new FormData();
                      formData.append('image', file);
                      
                      const response = await fetch('/api/upload/image', {
                        method: 'POST',
                        body: formData
                      });
                      
                      if (response.ok) {
                        const data = await response.json();
                        // Update the image URL through the updateComponent function
                        if (onClick) {
                          onClick(); // Select the component if it isn't already
                        }
                        // This would be handled by the editor context's updateComponent function
                        const event = new CustomEvent('hero:updateImage', {
                          detail: {
                            componentId: component.id,
                            imageUrl: data.url
                          }
                        });
                        document.dispatchEvent(event);
                      }
                    } catch (error) {
                      console.error('Error uploading image:', error);
                    }
                  };
                  input.click();
                }}
                onDragOver={(e) => {
                  if (!inEditor) return;
                  e.preventDefault();
                  e.currentTarget.classList.add('border-2', 'border-primary', 'bg-gray-300');
                }}
                onDragLeave={(e) => {
                  if (!inEditor) return;
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-2', 'border-primary', 'bg-gray-300');
                }}
                onDrop={async (e) => {
                  if (!inEditor) return;
                  e.preventDefault();
                  
                  e.currentTarget.classList.remove('border-2', 'border-primary', 'bg-gray-300');
                  
                  // Check if there are files
                  const files = e.dataTransfer.files;
                  if (files && files.length > 0) {
                    const file = files[0];
                    
                    // Check if the file is an image
                    if (!file.type.startsWith('image/')) {
                      return; // Not an image
                    }
                    
                    try {
                      const formData = new FormData();
                      formData.append('image', file);
                      
                      const response = await fetch('/api/upload/image', {
                        method: 'POST',
                        body: formData
                      });
                      
                      if (response.ok) {
                        const data = await response.json();
                        console.log('Image uploaded successfully:', data.url);
                        
                        // Update the image URL through the updateComponent function
                        if (onClick) {
                          onClick(); // Select the component if it isn't already
                        }
                        
                        // This would be handled by the editor context's updateComponent function
                        const event = new CustomEvent('hero:updateImage', {
                          detail: {
                            componentId: component.id,
                            imageUrl: data.url
                          }
                        });
                        document.dispatchEvent(event);
                      }
                    } catch (error) {
                      console.error('Error uploading image:', error);
                    }
                  }
                }}
              >
                <div className="text-center p-4">
                  <i className="ri-image-line text-4xl text-gray-400 mb-2"></i>
                  {inEditor && (
                    <p className="text-gray-600 text-sm">
                      {viewportMode === 'mobile' ? 'Tap' : 'Click or drop image here'}
                    </p>
                  )}
                </div>
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
      {/* Background overlay if needed */}
      <Overlay />
      
      {/* Content - with higher z-index to appear above overlay */}
      <div className="max-w-3xl mx-auto px-4 space-y-6 relative z-10">
        <h1 style={headingStyle}>
          {content.heading || 'Create Landing Pages That Convert'}
        </h1>
        <p style={subheadingStyle}>
          {content.subheading || 'Build beautiful, responsive landing pages without any coding skills required.'}
        </p>
        <div className="flex justify-center">
          <Button 
            style={primaryButtonStyle}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium text-sm sm:text-base"
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
