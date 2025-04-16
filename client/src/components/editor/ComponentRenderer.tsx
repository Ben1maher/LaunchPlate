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
}

export default function ComponentRenderer({ component, isSelected = false, onClick, inEditor }: ComponentRendererProps) {
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
        return <HeaderComponent component={component} />;
      
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
      className={`relative component-wrapper ${isSelected ? 'outline outline-2 outline-primary' : ''}`} 
      onClick={onClick}
    >
      {renderComponent()}
      
      {/* Component Controls - visible on hover or when selected */}
      <div className={`absolute top-0 right-0 m-2 flex space-x-1 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
        <Button 
          size="icon" 
          variant="secondary" 
          className="h-8 w-8 bg-white shadow-sm text-gray-500 hover:text-gray-700"
        >
          <Move className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="secondary" 
          className="h-8 w-8 bg-white shadow-sm text-gray-500 hover:text-gray-700"
          onClick={handleSettingsClick}
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="secondary" 
          className="h-8 w-8 bg-white shadow-sm text-gray-500 hover:text-gray-700"
          onClick={handleDuplicate}
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="secondary" 
          className="h-8 w-8 bg-white shadow-sm text-red-500 hover:text-red-700"
          onClick={handleDelete}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
