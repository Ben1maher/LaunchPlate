import React from 'react';
import { Component } from '@shared/schema';

interface ColumnsComponentProps {
  component: Component;
  inEditor?: boolean;
}

export default function ColumnsComponent({ component, inEditor = false }: ColumnsComponentProps) {
  // Determine the number of columns based on the component type
  const getColumnCount = () => {
    switch (component.type) {
      case 'columns-2':
        return 2;
      case 'columns-3':
        return 3;
      case 'columns-4':
        return 4;
      default:
        return 2;
    }
  };

  const columnCount = getColumnCount();

  return (
    <div className={`w-full py-8 ${component.style.padding || ''}`} style={component.style}>
      <div className={`container mx-auto px-4 md:px-6`}>
        <div className={`grid grid-cols-1 md:grid-cols-${columnCount} gap-6`}>
          {Array.from({ length: columnCount }).map((_, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold mb-3">{component.content[`title${index + 1}`] || `Column ${index + 1}`}</h3>
              <p className="text-gray-600">
                {component.content[`content${index + 1}`] || 'Add your content here. You can edit this text in the properties panel.'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}