import React, { useEffect } from 'react';
import { Component } from '@shared/schema';
import HeaderComponent from '../landing/HeaderComponent';
import HeroComponent from '../landing/HeroComponent';
import TextComponent from '../landing/TextComponent';
import ButtonComponent from '../landing/ButtonComponent';
import ImageComponent from '../landing/ImageComponent';
import FormComponent from '../landing/FormComponent';
import SpacerComponent from '../landing/SpacerComponent';
import DividerComponent from '../landing/DividerComponent';
import ColumnsComponent from '../landing/ColumnsComponent';
import FeatureComponent from '../landing/FeatureComponent';
import TestimonialComponent from '../landing/TestimonialComponent';
import MarketingComponent from '../landing/MarketingComponent';
import FooterComponent from '../landing/FooterComponent';
import { useEditor } from '../../context/EditorContext';
import { Button } from '@/components/ui/button';
import { Settings, Copy, Trash, Move } from 'lucide-react';

interface ComponentRendererProps {
  component: Component;
  isSelected?: boolean;
  onClick?: () => void;
  inEditor: boolean;
  viewportMode?: 'desktop' | 'tablet' | 'mobile';
}

export default function ComponentRenderer({ component, isSelected = false, onClick, inEditor, viewportMode = 'desktop' }: ComponentRendererProps) {
  const { removeComponent, updateComponent } = useEditor();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeComponent(component.id);
  };

  // Note: Duplicate button was removed, but we'll keep this function in case we want to restore it later
  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Just a placeholder for now since we removed the button
    console.log("Duplicate component feature is disabled");
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick && onClick();
  };

  // Render the actual component based on its type
  const renderComponent = () => {
    switch (component.type) {
      // Headers
      case 'header-1':
      case 'header-2':
      case 'header-transparent':
        return <HeaderComponent component={component} viewportMode={viewportMode} />;
      
      // Hero Sections
      case 'hero-split':
      case 'hero-centered':
      case 'hero-video':
      case 'hero-gradient':
        return <HeroComponent 
          component={component} 
          inEditor={inEditor} 
          viewportMode={viewportMode} 
          onClick={onClick} 
        />;
      
      // Text Elements
      case 'heading':
      case 'text-block':
      case 'list-item':
      case 'blockquote':
        return <TextComponent component={component} />;
      
      case 'button':
        return <ButtonComponent component={component} />;
      
      // Media Elements
      case 'image':
      case 'gallery':
      case 'video':
      case 'carousel':
        return <ImageComponent component={component} />;
      
      // Forms & CTAs
      case 'form':
      case 'email-signup':
      case 'contact-details':
        return <FormComponent component={component} />;
      
      // Layout Elements
      case 'spacer':
        return <SpacerComponent component={component} />;
      
      case 'divider':
        return <DividerComponent component={component} />;
      
      case 'columns-2':
      case 'columns-3':
      case 'columns-4':
        return <ColumnsComponent component={component} inEditor={inEditor} />;
      
      // Feature Sections
      case 'feature-grid':
      case 'feature-list':
      case 'feature-cards':
        return <FeatureComponent component={component} />;
      
      // Testimonials
      case 'testimonial-single':
      case 'testimonial-carousel':
        return <TestimonialComponent component={component} />;
      
      // Marketing
      case 'stats-bar':
      case 'pricing-cards':
        return <MarketingComponent component={component} />;
      
      // Footers
      case 'footer-simple':
      case 'footer-columns':
        return <FooterComponent component={component} />;
      
      default:
        return (
          <div className="p-4 border border-dashed border-gray-300 rounded">
            <p className="text-gray-500 text-center">Unknown component type: {component.type}</p>
          </div>
        );
    }
  };

  if (!inEditor) {
    // Simple rendering without editor controls for preview mode
    return renderComponent();
  }

  // Add debugging for header components
  if (component.type.includes('header')) {
    console.log('ComponentRenderer: Rendering header component with style:', component.style);
    
    // Add a dynamic style tag to the document head for this specific component
    // This ensures the styling has the highest specificity possible
    useEffect(() => {
      // Only do this for header components
      if (!component.type.includes('header')) return;
      
      // Create a style element if it doesn't exist
      let styleEl = document.getElementById(`header-style-${component.id}`);
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = `header-style-${component.id}`;
        document.head.appendChild(styleEl);
      }
      
      // Create CSS content based on the style type
      let cssContent = '';
      
      if (component.style.backgroundType === 'color') {
        console.log('ComponentRenderer: Applying header color style:', component.style.backgroundColor);
        // For colors, we should use both background and background-color since 
        // some browsers prioritize one over the other
        cssContent = `
          [data-component-id="${component.id}"] > nav {
            background: ${component.style.backgroundColor || '#ffffff'} !important;
            background-color: ${component.style.backgroundColor || '#ffffff'} !important;
            background-image: none !important;
          }
        `;
      } else if (component.style.backgroundType === 'gradient' && 
                component.style.gradientStartColor && 
                component.style.gradientEndColor) {
        console.log('ComponentRenderer: Applying header gradient style:', 
                   component.style.gradientStartColor, component.style.gradientEndColor);
        const gradient = `linear-gradient(${component.style.gradientDirection || 'to right'}, ${component.style.gradientStartColor}, ${component.style.gradientEndColor})`;
        cssContent = `
          [data-component-id="${component.id}"] > nav {
            background: ${gradient} !important;
            background-image: ${gradient} !important;
            background-color: transparent !important;
          }
        `;
      } else if (component.style.backgroundType === 'image' && component.style.backgroundImage) {
        console.log('ComponentRenderer: Applying header image style:', component.style.backgroundImage);
        const imageUrl = component.style.backgroundImage.startsWith('url(') 
              ? component.style.backgroundImage 
              : `url(${component.style.backgroundImage})`;
        cssContent = `
          [data-component-id="${component.id}"] > nav {
            background-image: ${imageUrl} !important;
            background-size: ${component.style.backgroundSize || 'cover'} !important;
            background-position: ${component.style.backgroundPosition || 'center'} !important;
            background-repeat: ${component.style.backgroundRepeat || 'no-repeat'} !important;
            background-color: transparent !important;
          }
        `;
      }
      
      // Set the CSS content
      if (cssContent) {
        styleEl.textContent = cssContent;
        console.log('ComponentRenderer: Added CSS style tag with content:', cssContent);
      }
      
      // Cleanup on unmount
      return () => {
        if (styleEl && document.head.contains(styleEl)) {
          document.head.removeChild(styleEl);
        }
      };
    }, [component.id, component.type, component.style]);
  }

  return (
    <div 
      className={`relative component-wrapper group hover:outline hover:outline-1 hover:outline-gray-200 ${
        isSelected ? 'outline outline-2 outline-primary selected' : ''
      } hover:bg-transparent`}
      // Set styling properties without using all:initial which was resetting the outline
      style={{ 
        pointerEvents: 'all',
        isolation: 'isolate',
        zIndex: 1,
        position: 'relative',
        // Removed all:initial and contain:content as they interfere with outline
        display: 'block',
        boxSizing: 'border-box',
        // Apply special background styling for header components directly at the wrapper level with !important flags
        ...(component.type.includes('header') && component.style.backgroundType === 'color' && {
          backgroundColor: `${component.style.backgroundColor || '#ffffff'} !important`,
          background: `${component.style.backgroundColor || '#ffffff'} !important`,
          backgroundImage: 'none !important',
        }),
        ...(component.type.includes('header') && component.style.backgroundType === 'gradient' && {
          background: `linear-gradient(${component.style.gradientDirection || 'to right'}, ${component.style.gradientStartColor}, ${component.style.gradientEndColor}) !important`,
          backgroundImage: `linear-gradient(${component.style.gradientDirection || 'to right'}, ${component.style.gradientStartColor}, ${component.style.gradientEndColor}) !important`,
          backgroundColor: 'transparent !important',
        }),
        ...(component.type.includes('header') && component.style.backgroundType === 'image' && {
          backgroundImage: `${component.style.backgroundImage?.startsWith('url(') 
            ? component.style.backgroundImage 
            : `url(${component.style.backgroundImage})`} !important`,
          backgroundSize: `${component.style.backgroundSize || 'cover'} !important`,
          backgroundPosition: `${component.style.backgroundPosition || 'center'} !important`,
          backgroundRepeat: `${component.style.backgroundRepeat || 'no-repeat'} !important`,
          backgroundColor: 'transparent !important',
          background: 'none !important',
        })
      }} 
      onClick={onClick}
      data-component-id={component.id}
      data-component-type={component.type}
    >
      {isSelected && (
        <div className="absolute -top-3 left-3 bg-primary text-white px-2 py-0.5 text-xs rounded z-10 flex items-center gap-1 shadow-sm">
          <i className="ri-edit-line text-[10px]"></i>
          {component.type.replace(/-/g, ' ')}
        </div>
      )}
      
      {renderComponent()}
      
      {/* Component Controls - visible on hover or when selected */}
      <div 
        className={`absolute top-2 right-2 flex items-center gap-1 p-1 bg-white/90 rounded-md shadow-sm border border-gray-100 backdrop-blur-sm ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        } transition-opacity duration-200`}
      >
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
          title="Delete component"
          onClick={handleDelete}
        >
          <Trash className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
