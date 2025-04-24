import React from 'react';
import { PremiumBusinessTemplate, PremiumEcommerceTemplate } from '../../templates/premium-templates';
import { Component } from '@shared/schema';

interface CustomTemplateRendererProps {
  component: Component;
  onClick?: () => void;
  isSelected?: boolean;
  inEditor: boolean;
}

/**
 * Renders premium/custom template components
 */
export default function CustomTemplateRenderer({ 
  component, 
  onClick, 
  isSelected = false,
  inEditor
}: CustomTemplateRendererProps) {
  // Apply custom styling when selected in editor
  const wrapperStyle = isSelected && inEditor ? {
    outline: '2px solid #3b82f6',
    borderRadius: '4px',
    position: 'relative' as const,
    overflow: 'visible'
  } : {};

  // Render different templates based on component type
  const renderTemplate = () => {
    switch (component.type) {
      case 'custom-business-template':
        return <PremiumBusinessTemplate />;
      case 'custom-ecommerce-template':
        return <PremiumEcommerceTemplate />;
      case 'custom-membership-template':
        // If we don't have a dedicated membership template yet, use business template as fallback
        return <PremiumBusinessTemplate />; 
      case 'custom-startup-template':
        // If we don't have a dedicated startup template yet, use business template as fallback
        return <PremiumBusinessTemplate />;
      default:
        return <div>Unknown template type: {component.type}</div>;
    }
  };

  return (
    <div 
      onClick={onClick} 
      style={wrapperStyle}
      className="relative"
    >
      {renderTemplate()}
      
      {/* Control overlay shown only when selected in editor */}
      {isSelected && inEditor && (
        <div className="absolute top-2 right-2 z-50 flex gap-2 bg-white p-1 rounded shadow">
          <button 
            className="p-1 rounded hover:bg-gray-100 text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
        </div>
      )}
    </div>
  );
}