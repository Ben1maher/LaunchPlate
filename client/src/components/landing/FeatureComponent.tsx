import React from 'react';
import { Component } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { useToast } from '@/hooks/use-toast';

interface FeatureComponentProps {
  component: Component;
}

export default function FeatureComponent({ component }: FeatureComponentProps) {
  const { updateComponent } = useEditor();
  const { toast } = useToast();
  
  // Define Feature interface
  interface Feature {
    title: string;
    description: string;
    icon: string;
  }
  
  // Default features for demonstration
  const defaultFeatures: Feature[] = [
    {
      title: 'Feature 1',
      description: 'Description of feature 1',
      icon: 'ri-check-line'
    },
    {
      title: 'Feature 2',
      description: 'Description of feature 2',
      icon: 'ri-check-line'
    },
    {
      title: 'Feature 3',
      description: 'Description of feature 3',
      icon: 'ri-check-line'
    }
  ];

  // Get features from component content or use defaults
  const features = component.content.features || defaultFeatures;
  
  // Function to delete a feature
  const handleDeleteFeature = (index: number) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    
    updateComponent(component.id, {
      content: {
        ...component.content,
        features: updatedFeatures
      }
    });
    
    toast({
      title: "Feature deleted",
      description: "The feature has been removed",
      duration: 2000
    });
  };

  switch (component.type) {
    case 'feature-grid':
      return (
        <div className="w-full py-12" style={component.style}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-6">{component.content.title || 'Key Features'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature: Feature, index: number) => (
                <div key={index} className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 text-center relative group">
                  {/* Delete button */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 z-10"
                    onClick={() => handleDeleteFeature(index)}
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                  
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-primary/10 text-primary rounded-full">
                    <i className={feature.icon || 'ri-check-line'} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'feature-list':
      return (
        <div className="w-full py-12" style={component.style}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">{component.content.title || 'Our Features'}</h2>
            <div className="space-y-6">
              {features.map((feature: Feature, index: number) => (
                <div key={index} className="flex items-start p-4 bg-white rounded-lg border border-gray-100 relative group">
                  {/* Delete button */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 z-10"
                    onClick={() => handleDeleteFeature(index)}
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                  
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-primary/10 text-primary rounded-full mr-4">
                    <i className={feature.icon || 'ri-check-line'} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'feature-cards':
      return (
        <div className="w-full py-12" style={component.style}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-6">{component.content.title || 'Feature Cards'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature: Feature, index: number) => (
                <div key={index} className="p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 relative group">
                  {/* Delete button */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 z-10"
                    onClick={() => handleDeleteFeature(index)}
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                  
                  <div className="w-12 h-12 mb-4 flex items-center justify-center bg-primary text-white rounded-lg">
                    <i className={feature.icon || 'ri-check-line'} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="w-full py-12" style={component.style}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{component.content.title || 'Features'}</h2>
            <p className="text-center text-gray-600">Please select a specific feature component type.</p>
          </div>
        </div>
      );
  }
}