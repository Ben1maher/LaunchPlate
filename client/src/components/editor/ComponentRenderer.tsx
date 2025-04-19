import React from 'react';
import { Component } from '@shared/schema';
import HeaderComponent from '../landing/HeaderComponent';
import HeroComponent from '../landing/HeroComponent';
import TextComponent from '../landing/TextComponent';
import ButtonComponent from '../landing/ButtonComponent';
import ImageComponent from '../landing/ImageComponent';
import FormComponent from '../landing/FormComponent';
import SpacerComponent from '../landing/SpacerComponent';
import DividerComponent from '../landing/DividerComponent';
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

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicatedComponent: Component = {
      ...component,
      id: `${component.id}-copy-${Date.now()}`
    };
    updateComponent(duplicatedComponent.id, duplicatedComponent);
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick && onClick();
  };

  // Render the actual component based on its type
  const renderComponent = () => {
    switch (component.type) {
      case 'header-1':
      case 'header-2':
        return <HeaderComponent component={component} viewportMode={viewportMode} />;
      
      case 'hero-split':
      case 'hero-centered':
        return <HeroComponent component={component} />;
      
      case 'heading':
      case 'text-block':
        return <TextComponent component={component} />;
      
      case 'button':
        return <ButtonComponent component={component} />;
      
      case 'image':
        return <ImageComponent component={component} />;
      
      case 'form':
      case 'email-signup':
        return <FormComponent component={component} />;
      
      case 'spacer':
        return <SpacerComponent component={component} />;
      
      case 'divider':
        return <DividerComponent component={component} />;
      
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

  return (
    <div 
      className={`relative component-wrapper group hover:bg-gray-50/50 hover:outline hover:outline-1 hover:outline-gray-200 ${
        isSelected ? 'outline outline-2 outline-primary bg-blue-50/20' : ''
      }`} 
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
          className="h-7 w-7 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          title="Edit properties"
          onClick={handleSettingsClick}
        >
          <Settings className="h-3.5 w-3.5" />
        </Button>
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-7 w-7 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          title="Duplicate component"
          onClick={handleDuplicate}
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
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
