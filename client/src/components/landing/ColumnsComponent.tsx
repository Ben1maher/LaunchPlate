import React from 'react';
import { Component } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash, Pencil } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { useToast } from '@/hooks/use-toast';

interface ColumnsComponentProps {
  component: Component;
  inEditor?: boolean;
}

export default function ColumnsComponent({ component, inEditor = false }: ColumnsComponentProps) {
  const { updateComponent } = useEditor();
  const { toast } = useToast();
  
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
  
  // Reset a column's content to default
  const handleResetColumn = (index: number) => {
    const updates = {
      content: {
        ...component.content,
        [`title${index + 1}`]: `Column ${index + 1}`,
        [`content${index + 1}`]: 'Add your content here. You can edit this text in the properties panel.'
      }
    };
    
    updateComponent(component.id, updates);
    
    toast({
      title: "Column reset",
      description: `Column ${index + 1} has been reset to default content`,
      duration: 2000
    });
  };

  return (
    <div className={`w-full py-8 ${component.style.padding || ''}`} style={component.style}>
      <div className={`container mx-auto px-4 md:px-6`}>
        <div className={`grid grid-cols-1 md:grid-cols-${columnCount} gap-6`}>
          {Array.from({ length: columnCount }).map((_, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 relative group"
            >
              {/* Column Controls (only shown when in editor and hovered) */}
              {inEditor && (
                <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-7 w-7 rounded-full shadow-md"
                    title="Reset column"
                    onClick={() => handleResetColumn(index)}
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
              
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