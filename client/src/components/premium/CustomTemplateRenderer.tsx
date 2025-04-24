import React, { useState } from 'react';
import { PremiumBusinessTemplate, PremiumEcommerceTemplate } from '../../templates/premium-templates';
import { Component, ComponentType } from '@shared/schema';
import { useEditor } from '../../context/EditorContext';
import { Settings, Edit, Copy, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomTemplateRendererProps {
  component: Component;
  onClick?: () => void;
  isSelected?: boolean;
  inEditor: boolean;
}

/**
 * Renders premium/custom template components with editable sections
 */
export default function CustomTemplateRenderer({ 
  component, 
  onClick, 
  isSelected = false,
  inEditor
}: CustomTemplateRendererProps) {
  const { updateComponent, addComponent, removeComponent } = useEditor();
  const [editableSection, setEditableSection] = useState<string | null>(null);

  // Define customization states
  const content = component.content || {};
  
  // Add custom styles for the editor mode
  const wrapperStyle = isSelected && inEditor ? {
    outline: '2px solid #3b82f6',
    borderRadius: '4px',
    position: 'relative' as const,
    overflow: 'visible'
  } : {};

  // Function to handle editing of a specific section
  const handleSectionEdit = (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create editable component for this section if not already exists
    if (!content[sectionId]) {
      // Update component content to include this section
      updateComponent(component.id, {
        content: {
          ...content,
          [sectionId]: {
            text: 'Edit this section',
            isEditing: true
          }
        }
      });
    } else {
      // Toggle editing mode for this section
      updateComponent(component.id, {
        content: {
          ...content,
          [sectionId]: {
            ...content[sectionId],
            isEditing: true
          }
        }
      });
    }
    
    setEditableSection(sectionId);
  };

  // Function to convert template to individual components
  const handleConvertToComponents = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // In a real implementation, this would break the template into individual components
    // For now, we'll just display a message
    alert('This feature will convert the template into individual editable components.');
  };
  
  // Render different templates based on component type
  const renderTemplate = () => {
    const templateProps = {
      content: content,
      onSectionEdit: handleSectionEdit,
      inEditor: inEditor,
      editableSection: editableSection
    };
    
    switch (component.type) {
      case 'custom-business-template':
        return <PremiumBusinessTemplate {...templateProps} />;
      case 'custom-ecommerce-template':
        return <PremiumEcommerceTemplate {...templateProps} />;
      case 'custom-membership-template':
        // If we don't have a dedicated membership template yet, use business template as fallback
        return <PremiumBusinessTemplate {...templateProps} />; 
      case 'custom-startup-template':
        // If we don't have a dedicated startup template yet, use business template as fallback
        return <PremiumBusinessTemplate {...templateProps} />;
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
          <div className="flex items-center gap-2 text-sm text-gray-600 mr-2">
            <span>Template Mode</span>
          </div>
          
          <Button 
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={handleConvertToComponents}
            title="Convert to individual components"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button 
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick();
            }}
            title="Template settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Customization helpers - shown when hovering over editable sections */}
      {inEditor && isSelected && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg z-50 flex items-center gap-3">
          <span className="text-sm font-medium">Click on any section to customize it</span>
        </div>
      )}
    </div>
  );
}