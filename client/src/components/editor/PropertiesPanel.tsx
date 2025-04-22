import { useState, useEffect, useRef } from "react";
import { useEditor } from "../../context/EditorContext";
import { BrandAsset } from "../../context/EditorContext";
import { Component, ComponentType, PageSettings } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getComponentData } from "./componentData";
import { ChevronRight, X, Copy, Trash, Settings, ArrowUp, ArrowDown, Move, Upload, Image, Palette, Layers, Globe, Paintbrush } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ColorPicker } from "@/components/ui/color-picker";
import { Slider } from "@/components/ui/slider";
import BrandAssetsPanel from "./BrandAssetsPanel";

// Visual Spacing Control Component
interface SpacingControlProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  color: string;
  min?: number;
  max?: number;
  defaultValue?: string;
}

function SpacingControl({ 
  value, 
  onChange, 
  label, 
  color,
  min = 0,
  max = 100,
  defaultValue = '0px'
}: SpacingControlProps) {
  // Parse the current value (e.g., "16px" -> 16)
  const parseValue = (val: string): number => {
    const num = parseInt(val);
    return isNaN(num) ? 0 : num;
  };

  // Format the value for display (e.g., 16 -> "16px")
  const formatValue = (num: number): string => {
    return `${num}px`;
  };

  const numericValue = parseValue(value || defaultValue);
  
  // Handle slider change
  const handleSliderChange = (newValue: number[]) => {
    onChange(formatValue(newValue[0]));
  };

  // Handle direct input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // If they're typing a number without units, keep it that way until they're done
    if (/^\d+$/.test(inputValue)) {
      onChange(`${inputValue}px`);
    } else {
      onChange(inputValue);
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-500 block text-center">{label}</label>
      <div className="flex gap-2">
        <div className="flex-grow">
          <Slider
            value={[numericValue]}
            min={min}
            max={max}
            step={1}
            onValueChange={handleSliderChange}
            className={`${color}`}
          />
        </div>
        <Input
          type="text"
          value={value || defaultValue}
          onChange={handleInputChange}
          className={`text-sm w-16 flex-shrink-0 ${color}`}
        />
      </div>
    </div>
  );
}

// Page Background Settings Component
function PageBackgroundSettings({ 
  pageSettings, 
  updatePageSettings 
}: { 
  pageSettings: PageSettings, 
  updatePageSettings: (settings: Partial<PageSettings>) => void 
}) {
  const { toast } = useToast();
  const { addBrandAsset } = useEditor();
  const [backgroundType, setBackgroundType] = useState<'color' | 'gradient' | 'image'>(
    pageSettings.background.type || 'color'
  );
  const [imageUrl, setImageUrl] = useState(pageSettings.background.imageUrl || '');

  // Update background type and initialize defaults for that type
  const handleBackgroundTypeChange = (type: 'color' | 'gradient' | 'image') => {
    setBackgroundType(type);
    
    // Set default values for the selected type
    switch(type) {
      case 'color':
        updatePageSettings({
          background: {
            type: 'color',
            color: pageSettings.background.color || '#ffffff'
          }
        });
        break;
      case 'gradient':
        updatePageSettings({
          background: {
            type: 'gradient',
            gradientStart: pageSettings.background.gradientStart || '#4F46E5',
            gradientEnd: pageSettings.background.gradientEnd || '#10B981'
          }
        });
        break;
      case 'image':
        updatePageSettings({
          background: {
            type: 'image',
            imageUrl: pageSettings.background.imageUrl || '',
            overlay: pageSettings.background.overlay || 'rgba(0,0,0,0.4)',
            overlayOpacity: pageSettings.background.overlayOpacity || 0.4
          }
        });
        break;
    }
  };

  // Handle image URL input
  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
  };

  // Apply image URL
  const applyImageUrl = () => {
    if (!imageUrl) {
      toast({
        title: "Missing image URL",
        description: "Please enter an image URL to apply",
        variant: "destructive"
      });
      return;
    }

    // Test if the image URL is valid
    const img = document.createElement('img') as HTMLImageElement;
    img.onload = () => {
      updatePageSettings({
        background: {
          ...pageSettings.background,
          imageUrl
        }
      });
      toast({
        title: "Background image updated",
        description: "The page background image has been updated."
      });
    };
    img.onerror = () => {
      toast({
        title: "Invalid image URL",
        description: "Could not load the image. Please check the URL and try again.",
        variant: "destructive"
      });
    };
    img.src = imageUrl;
  };

  // Handle file upload for background image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive"
      });
      return;
    }

    // For this example, we'll create a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setImageUrl(dataUrl);
        updatePageSettings({
          background: {
            ...pageSettings.background,
            type: 'image',
            imageUrl: dataUrl
          }
        });
        toast({
          title: "Background image uploaded",
          description: "The page background image has been updated."
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div>
        <label className="text-xs text-gray-600 block mb-1">Background Type</label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={backgroundType === 'color' ? 'default' : 'outline'}
            size="sm"
            className="w-full"
            onClick={() => handleBackgroundTypeChange('color')}
          >
            <Palette className="h-4 w-4 mr-1" />
            Color
          </Button>
          <Button
            variant={backgroundType === 'gradient' ? 'default' : 'outline'}
            size="sm"
            className="w-full"
            onClick={() => handleBackgroundTypeChange('gradient')}
          >
            <Layers className="h-4 w-4 mr-1" />
            Gradient
          </Button>
          <Button
            variant={backgroundType === 'image' ? 'default' : 'outline'}
            size="sm"
            className="w-full"
            onClick={() => handleBackgroundTypeChange('image')}
          >
            <Image className="h-4 w-4 mr-1" />
            Image
          </Button>
        </div>
      </div>

      {/* Color Background */}
      {backgroundType === 'color' && (
        <div>
          <label className="text-xs text-gray-600 block mb-1">Background Color</label>
          <div className="flex items-center gap-2">
            <ColorPicker
              color={pageSettings.background.color || '#ffffff'}
              onChange={(color) => updatePageSettings({ 
                background: { ...pageSettings.background, color } 
              })}
            />
            <Input 
              value={pageSettings.background.color || '#ffffff'}
              onChange={(e) => updatePageSettings({ 
                background: { ...pageSettings.background, color: e.target.value } 
              })}
              className="text-sm flex-1"
            />
          </div>
        </div>
      )}

      {/* Gradient Background */}
      {backgroundType === 'gradient' && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Gradient Start Color</label>
            <div className="flex items-center gap-2">
              <ColorPicker
                color={pageSettings.background.gradientStart || '#4F46E5'}
                onChange={(color) => updatePageSettings({ 
                  background: { ...pageSettings.background, gradientStart: color } 
                })}
              />
              <Input 
                value={pageSettings.background.gradientStart || '#4F46E5'}
                onChange={(e) => updatePageSettings({ 
                  background: { ...pageSettings.background, gradientStart: e.target.value } 
                })}
                className="text-sm flex-1"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">Gradient End Color</label>
            <div className="flex items-center gap-2">
              <ColorPicker
                color={pageSettings.background.gradientEnd || '#10B981'}
                onChange={(color) => updatePageSettings({ 
                  background: { ...pageSettings.background, gradientEnd: color } 
                })}
              />
              <Input 
                value={pageSettings.background.gradientEnd || '#10B981'}
                onChange={(e) => updatePageSettings({ 
                  background: { ...pageSettings.background, gradientEnd: e.target.value } 
                })}
                className="text-sm flex-1"
              />
            </div>
          </div>
          <div className="mt-2 space-y-2">
            <div className="h-10 rounded" style={{ 
              background: `linear-gradient(135deg, ${pageSettings.background.gradientStart || '#4F46E5'}, ${pageSettings.background.gradientEnd || '#10B981'})` 
            }} />
            
            <Button
              variant="outline"
              size="sm"
              className="w-full text-sm"
              onClick={() => {
                const startColor = pageSettings.background.gradientStart || '#4F46E5';
                const endColor = pageSettings.background.gradientEnd || '#10B981';
                
                // Generate default name from the colors
                const defaultName = `Gradient ${startColor.substring(1, 4)}..${endColor.substring(1, 4)}`;
                
                // Prompt for a name
                const gradientName = prompt('Enter a name for this gradient', defaultName);
                if (gradientName) {
                  // Add the asset to brand assets collection
                  addBrandAsset({
                    name: gradientName.trim(),
                    type: 'gradient',
                    value: startColor,
                    secondaryValue: endColor
                  });
                  
                  // Show toast notification
                  toast({
                    title: "Gradient saved",
                    description: `"${gradientName.trim()}" has been added to your brand assets.`,
                    duration: 3000
                  });
                }
              }}
            >
              Save to Brand Assets
            </Button>
          </div>
        </div>
      )}

      {/* Image Background */}
      {backgroundType === 'image' && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Image URL</label>
            <div className="flex gap-2">
              <Input 
                value={imageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="text-sm flex-1"
              />
              <Button 
                size="sm" 
                className="whitespace-nowrap"
                onClick={applyImageUrl}
                disabled={!imageUrl}
              >
                Apply
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter a URL or upload an image below
            </p>
          </div>
          
          <div>
            <label className="text-xs text-gray-600 block mb-1">Upload Image</label>
            <div className="border border-gray-200 rounded-md p-4 text-center bg-gray-50">
              <label className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <Upload className="h-5 w-5 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload</span>
                  <span className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</span>
                </div>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          {pageSettings.background.imageUrl && (
            <div>
              <label className="text-xs text-gray-600 block mb-1">Overlay Color</label>
              <div className="flex items-center gap-2">
                <ColorPicker
                  color={pageSettings.background.overlay || 'rgba(0,0,0,0.4)'}
                  onChange={(color) => updatePageSettings({ 
                    background: { ...pageSettings.background, overlay: color } 
                  })}
                  opacity
                />
                <div className="flex-1">
                  <label className="text-xs text-gray-600 block mb-1">Overlay Opacity</label>
                  <Input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={pageSettings.background.overlayOpacity || 0.4}
                    onChange={(e) => updatePageSettings({ 
                      background: { 
                        ...pageSettings.background, 
                        overlayOpacity: parseFloat(e.target.value) 
                      } 
                    })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
          
          {pageSettings.background.imageUrl && (
            <div className="relative h-20 overflow-hidden rounded">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${pageSettings.background.imageUrl})` }}
              />
              <div 
                className="absolute inset-0"
                style={{ 
                  backgroundColor: pageSettings.background.overlay || 'rgba(0,0,0,0.4)',
                  opacity: pageSettings.background.overlayOpacity || 0.4
                }}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function PropertiesPanel() {
  const { 
    selectedComponent, 
    updateComponent, 
    removeComponent, 
    components, 
    moveComponent,
    pageSettings,
    updatePageSettings,
    isEditingPage,
    setIsEditingPage,
    addBrandAsset
  } = useEditor();
  const [activeTab, setActiveTab] = useState("general");

  // Get the index of the selected component in the components array
  const selectedIndex = selectedComponent 
    ? components.findIndex(comp => comp.id === selectedComponent.id) 
    : -1;

  // Reset active tab when selected component changes
  useEffect(() => {
    setActiveTab("general");
  }, [selectedComponent?.id]);

  // If we're in page editing mode but no component is selected
  if (isEditingPage && !selectedComponent) {
    return (
      <div className="w-72 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-sm uppercase text-gray-600">Page Settings</h2>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => setIsEditingPage(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Page Settings Content */}
        <Tabs defaultValue="background" className="flex-1 flex flex-col">
          <div className="px-3 pt-3 border-b border-gray-200 flex-shrink-0">
            <TabsList className="grid grid-cols-4 h-9">
              <TabsTrigger value="background" className="text-xs">Background</TabsTrigger>
              <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
              <TabsTrigger value="brand" className="text-xs">Brand Assets</TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 min-h-0 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
            {/* Background Tab */}
            <TabsContent value="background" className="p-4 m-0 space-y-4">
              <PageBackgroundSettings 
                pageSettings={pageSettings} 
                updatePageSettings={updatePageSettings} 
              />
            </TabsContent>
            
            {/* Layout Tab */}
            <TabsContent value="layout" className="p-4 m-0 space-y-4">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Content Width</label>
                <Select
                  value={pageSettings.width || 'contained'}
                  onValueChange={(value) => updatePageSettings({ width: value as 'full' | 'contained' })}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select width" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contained">Contained</SelectItem>
                    <SelectItem value="full">Full Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {pageSettings.width === 'contained' && (
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Max Width (px)</label>
                  <Input
                    type="number"
                    value={pageSettings.maxWidth || 1200}
                    onChange={(e) => updatePageSettings({ maxWidth: parseInt(e.target.value) })}
                    className="text-sm"
                  />
                </div>
              )}
            </TabsContent>
            
            {/* Brand Assets Tab */}
            <TabsContent value="brand" className="p-0 m-0">
              <BrandAssetsPanel />
            </TabsContent>
            
            {/* Advanced Tab */}
            <TabsContent value="advanced" className="p-4 m-0 space-y-4">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Font Family</label>
                <Select
                  value={pageSettings.fontFamily || 'system-ui'}
                  onValueChange={(value) => updatePageSettings({ fontFamily: value })}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system-ui">System UI</SelectItem>
                    <SelectItem value="sans-serif">Sans Serif</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="monospace">Monospace</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
  }

  // If no component is selected and not in page editing mode
  if (!selectedComponent) {
    return (
      <div className="w-72 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-sm uppercase text-gray-600">Properties</h2>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* No Selection State */}
        <div className="flex-1 p-4 flex flex-col items-center justify-center text-center" id="noSelectionState">
          <div className="bg-gray-100 p-6 rounded-full mb-4">
            <i className="ri-cursor-line text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-gray-700 font-medium mb-1">No Element Selected</h3>
          <p className="text-gray-500 text-sm mb-6">Select an element on the canvas to edit its properties</p>
          <Button 
            variant="default" 
            className="gap-1 mb-3"
            onClick={() => setIsEditingPage(true)}
          >
            <Settings className="h-4 w-4" />
            Edit Page Settings
          </Button>
          <Button 
            variant="outline" 
            className="gap-1 mb-3"
            onClick={() => {
              setIsEditingPage(true);
              const tabsElement = document.querySelector('[value="brand"]');
              if (tabsElement) {
                (tabsElement as HTMLElement).click();
              }
            }}
          >
            <Paintbrush className="h-4 w-4" />
            Manage Brand Assets
          </Button>
          <Button variant="link" className="text-primary-500 gap-1">
            <i className="ri-information-line"></i>
            Learn how to edit properties
          </Button>
        </div>
      </div>
    );
  }

  const componentData = getComponentData(selectedComponent.type);

  // Move component up
  const handleMoveUp = () => {
    if (selectedIndex > 0) {
      moveComponent(selectedIndex, selectedIndex - 1);
    }
  };

  // Move component down
  const handleMoveDown = () => {
    if (selectedIndex < components.length - 1) {
      moveComponent(selectedIndex, selectedIndex + 1);
    }
  };

  // Duplicate component
  const handleDuplicate = () => {
    const duplicatedComponent: Component = {
      ...selectedComponent,
      id: `${selectedComponent.id}-copy-${Date.now()}`
    };
    
    const newComponents = [...components];
    newComponents.splice(selectedIndex + 1, 0, duplicatedComponent);
    updateComponent(duplicatedComponent.id, duplicatedComponent);
  };

  return (
    <div className="w-72 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-sm uppercase text-gray-600">Properties</h2>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Component Type Header */}
      <div className="bg-gray-50 p-3 flex items-center justify-between">
        <div className="flex items-center">
          <i className={`${componentData?.icon || 'ri-layout-3-line'} text-gray-500 mr-2`}></i>
          <span className="font-medium text-gray-800">{componentData?.label || 'Component'}</span>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleMoveUp} disabled={selectedIndex <= 0}>
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleMoveDown} disabled={selectedIndex >= components.length - 1}>
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Properties Tabs */}
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-3 pt-3 border-b border-gray-200 flex-shrink-0">
          <TabsList className="grid grid-cols-4 h-9">
            <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
            <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
            <TabsTrigger value="brand" className="text-xs">Brand Assets</TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 min-h-0 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
          {/* General Tab */}
          <TabsContent value="general" className="p-0 m-0 h-full overflow-y-auto">
            <RenderGeneralProperties component={selectedComponent} updateComponent={updateComponent} />
          </TabsContent>
          
          {/* Style Tab */}
          <TabsContent value="style" className="p-0 m-0 h-full overflow-y-auto">
            <RenderStyleProperties component={selectedComponent} updateComponent={updateComponent} />
          </TabsContent>

          {/* Brand Assets Tab */}
          <TabsContent value="brand" className="p-0 m-0">
            <BrandAssetsPanel />
          </TabsContent>
          
          {/* Advanced Tab */}
          <TabsContent value="advanced" className="p-0 m-0">
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Element ID</label>
                <Input
                  value={selectedComponent.id}
                  readOnly
                  className="text-sm text-gray-500"
                />
              </div>
              
              <div className="pt-2 flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start gap-2"
                  onClick={handleDuplicate}
                >
                  <Copy className="h-4 w-4" />
                  Duplicate Component
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                  onClick={() => removeComponent(selectedComponent.id)}
                >
                  <Trash className="h-4 w-4" />
                  Delete Component
                </Button>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

// Component-specific properties
function RenderGeneralProperties({ component, updateComponent }: { component: Component, updateComponent: (id: string, updates: Partial<Component>) => void }) {
  const updateContent = (key: string, value: any) => {
    updateComponent(component.id, {
      content: {
        ...component.content,
        [key]: value
      }
    });
  };

  switch (component.type) {
    case 'header-1':
    case 'header-2':
    case 'header-transparent':
      return (
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Logo Text</label>
            <Input
              value={component.content.logo || ''}
              onChange={(e) => updateContent('logo', e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-600 block mb-1">Menu Items</label>
            <div className="space-y-2">
              {component.content.menuItems?.map((item: any, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item.text}
                    onChange={(e) => {
                      const newMenuItems = [...component.content.menuItems];
                      newMenuItems[index] = { ...item, text: e.target.value };
                      updateContent('menuItems', newMenuItems);
                    }}
                    placeholder="Menu text"
                    className="text-sm flex-1"
                  />
                  <Input
                    value={item.url}
                    onChange={(e) => {
                      const newMenuItems = [...component.content.menuItems];
                      newMenuItems[index] = { ...item, url: e.target.value };
                      updateContent('menuItems', newMenuItems);
                    }}
                    placeholder="URL"
                    className="text-sm flex-1"
                  />
                  <Button
                    variant="ghost" 
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => {
                      const newMenuItems = component.content.menuItems.filter((_: any, i: number) => i !== index);
                      updateContent('menuItems', newMenuItems);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  const newMenuItems = [...(component.content.menuItems || []), { text: 'New Item', url: '#' }];
                  updateContent('menuItems', newMenuItems);
                }}
              >
                Add Menu Item
              </Button>
            </div>
          </div>
          
          {component.type === 'header-1' && (
            <div>
              <label className="text-xs text-gray-600 block mb-1">CTA Button</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={component.content.ctaText || ''}
                  onChange={(e) => updateContent('ctaText', e.target.value)}
                  placeholder="Button text"
                  className="text-sm"
                />
                <Input
                  value={component.content.ctaUrl || ''}
                  onChange={(e) => updateContent('ctaUrl', e.target.value)}
                  placeholder="URL"
                  className="text-sm"
                />
              </div>
            </div>
          )}
          
          {component.type === 'header-transparent' && (
            <div>
              <label className="text-xs text-gray-600 block mb-1">Header Style</label>
              <Select
                value={component.content.headerStyle || 'overlay'}
                onValueChange={(value) => updateContent('headerStyle', value)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overlay">Overlay</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      );
    
    case 'hero-split':
    case 'hero-centered':
    case 'hero-video':
    case 'hero-gradient':
      return (
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Heading</label>
            <Input
              value={component.content.heading || ''}
              onChange={(e) => updateContent('heading', e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-600 block mb-1">Subheading</label>
            <Textarea
              value={component.content.subheading || ''}
              onChange={(e) => updateContent('subheading', e.target.value)}
              className="text-sm resize-none"
              rows={2}
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-600 block mb-1">
              {component.type === 'hero-split' ? 'Primary Button' : 'Button'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={component.type === 'hero-split' ? component.content.primaryButtonText || '' : component.content.buttonText || ''}
                onChange={(e) => updateContent(
                  component.type === 'hero-split' ? 'primaryButtonText' : 'buttonText', 
                  e.target.value
                )}
                placeholder="Button text"
                className="text-sm"
              />
              <Input
                value={component.type === 'hero-split' ? component.content.primaryButtonUrl || '' : component.content.buttonUrl || ''}
                onChange={(e) => updateContent(
                  component.type === 'hero-split' ? 'primaryButtonUrl' : 'buttonUrl', 
                  e.target.value
                )}
                placeholder="URL"
                className="text-sm"
              />
            </div>
          </div>
          
          {component.type === 'hero-split' && (
            <>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Secondary Button</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={component.content.secondaryButtonText || ''}
                    onChange={(e) => updateContent('secondaryButtonText', e.target.value)}
                    placeholder="Button text"
                    className="text-sm"
                  />
                  <Input
                    value={component.content.secondaryButtonUrl || ''}
                    onChange={(e) => updateContent('secondaryButtonUrl', e.target.value)}
                    placeholder="URL"
                    className="text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3">Hero Image</h3>
                
                {/* Image upload section */}
                <div className="mb-2 border border-dashed border-gray-300 rounded-md p-4 bg-gray-50">
                  <div className="text-center">
                    <Image className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <div className="text-xs text-gray-600 mb-2">
                      Upload an image for your hero section
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="hero-image-upload"
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        
                        const file = files[0];
                        
                        // Validate file type
                        if (!file.type.startsWith('image/')) {
                          toast({
                            title: "Invalid file type",
                            description: "Please select an image file (JPG, PNG, GIF, etc.)",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        // Validate file size (5MB max)
                        if (file.size > 5 * 1024 * 1024) {
                          toast({
                            title: "File too large",
                            description: "Image size exceeds 5MB limit",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        try {
                          const formData = new FormData();
                          formData.append('image', file);
                          
                          const response = await fetch('/api/upload/image', {
                            method: 'POST',
                            body: formData
                          });
                          
                          if (!response.ok) {
                            throw new Error('Failed to upload image');
                          }
                          
                          const data = await response.json();
                          updateContent('imageUrl', data.url);
                          
                          toast({
                            title: "Image uploaded",
                            description: "Hero image has been uploaded successfully",
                            duration: 3000
                          });
                        } catch (error) {
                          console.error('Image upload error:', error);
                          toast({
                            title: "Upload failed",
                            description: "Failed to upload image. Please try again.",
                            variant: "destructive"
                          });
                        } finally {
                          // Clear the file input
                          e.target.value = '';
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={() => document.getElementById('hero-image-upload')?.click()}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Upload className="h-4 w-4" />
                        Choose Image
                      </div>
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Image URL</label>
                  <Input
                    value={component.content.imageUrl || ''}
                    onChange={(e) => updateContent('imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="text-sm"
                  />
                </div>
                
                {component.content.imageUrl && (
                  <div className="mt-1 p-2 border rounded-md bg-gray-50">
                    <div className="aspect-video relative bg-white rounded-sm overflow-hidden border">
                      <img 
                        src={component.content.imageUrl} 
                        alt="Preview" 
                        className="absolute inset-0 w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const nextElement = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                      />
                      <div 
                        className="absolute inset-0 w-full h-full flex-col items-center justify-center bg-gray-100 hidden" 
                        style={{ display: 'none' }}
                      >
                        <i className="ri-error-warning-line text-amber-500 text-xl mb-1"></i>
                        <span className="text-xs text-gray-600">Image failed to load</span>
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-right">
                      <button 
                        className="text-destructive hover:text-destructive-foreground"
                        onClick={() => updateContent('imageUrl', '')}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Image size and display options */}
                {component.content.imageUrl && (
                  <>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Max Height</label>
                      <Input
                        value={component.content.imageMaxHeight || ''}
                        onChange={(e) => updateContent('imageMaxHeight', e.target.value)}
                        placeholder="e.g., 400px, 50vh, auto"
                        className="text-sm"
                      />
                      <div className="mt-1 text-xs text-gray-500">
                        Use CSS values like px, %, vh, or "auto"
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Object Fit</label>
                      <Select
                        value={component.content.imageObjectFit || 'cover'}
                        onValueChange={(value) => updateContent('imageObjectFit', value)}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select fit mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cover">Cover (fill container)</SelectItem>
                          <SelectItem value="contain">Contain (show all)</SelectItem>
                          <SelectItem value="fill">Fill (stretch)</SelectItem>
                          <SelectItem value="none">None (original size)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Image Position</label>
                      <Select
                        value={component.content.imagePosition || 'center'}
                        onValueChange={(value) => updateContent('imagePosition', value)}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                          <SelectItem value="top left">Top Left</SelectItem>
                          <SelectItem value="top right">Top Right</SelectItem>
                          <SelectItem value="bottom left">Bottom Left</SelectItem>
                          <SelectItem value="bottom right">Bottom Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      );
    
    case 'heading':
      return (
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Heading Text</label>
            <Input
              value={component.content.text || ''}
              onChange={(e) => updateContent('text', e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-600 block mb-1">Heading Level</label>
            <div className="mb-1 text-xs text-gray-500">Current level: {component.content.level || 'h2'}</div>
            <Select
              defaultValue={component.content.level || 'h2'}
              value={component.content.level || 'h2'}
              onValueChange={(value) => {
                console.log("Heading level changed to:", value);
                updateContent('level', value);
              }}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">H1 - Main Heading</SelectItem>
                <SelectItem value="h2">H2 - Section Heading</SelectItem>
                <SelectItem value="h3">H3 - Subsection Heading</SelectItem>
                <SelectItem value="h4">H4 - Small Heading</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    
    case 'text-block':
      return (
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Text Content</label>
            <Textarea
              value={component.content.text || ''}
              onChange={(e) => updateContent('text', e.target.value)}
              className="text-sm resize-none"
              rows={6}
            />
          </div>
        </div>
      );
    
    case 'button':
      return (
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Button Text</label>
            <Input
              value={component.content.text || ''}
              onChange={(e) => updateContent('text', e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-600 block mb-1">URL</label>
            <Input
              value={component.content.url || ''}
              onChange={(e) => updateContent('url', e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-600 block mb-1">Button Type</label>
            <Select
              value={component.content.type || 'primary'}
              onValueChange={(value) => updateContent('type', value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    
    case 'image':
      // Add state for image upload
      const [uploading, setUploading] = useState(false);
      const [uploadError, setUploadError] = useState<string | null>(null);
      const fileInputRef = useRef<HTMLInputElement>(null);
      const { toast } = useToast();

      // Handle image upload
      const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        const file = files[0];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setUploadError("Please select an image file (JPG, PNG, GIF, etc.)");
          return;
        }
        
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          setUploadError("Image size exceeds 5MB limit");
          return;
        }
        
        setUploading(true);
        setUploadError(null);
        
        try {
          const formData = new FormData();
          formData.append('image', file);
          
          const response = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData
          });
          
          if (!response.ok) {
            throw new Error('Failed to upload image');
          }
          
          const data = await response.json();
          updateContent('url', data.url);
          toast({
            title: "Image uploaded successfully",
            description: "Your image has been uploaded and added to the component.",
            duration: 3000
          });
        } catch (error) {
          console.error('Image upload error:', error);
          setUploadError("Failed to upload image. Please try again.");
        } finally {
          setUploading(false);
          // Clear the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };

      return (
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Image Source</label>
            
            {/* Image upload section */}
            <div className="mb-4 border border-dashed border-gray-300 rounded-md p-4 bg-gray-50">
              <div className="text-center">
                <Image className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <div className="text-xs text-gray-600 mb-2">
                  Upload an image from your computer
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                      Uploading...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Upload className="h-4 w-4" />
                      Choose Image
                    </div>
                  )}
                </Button>
                
                {uploadError && (
                  <Alert variant="destructive" className="mt-2 py-2">
                    <AlertDescription className="text-xs">{uploadError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
            
            <label className="text-xs text-gray-600 block mb-1">Or enter image URL</label>
            <Input
              value={component.content.url || ''}
              onChange={(e) => updateContent('url', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="text-sm"
            />
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <i className="ri-information-line mr-1"></i>
              <span>Paste a direct URL to an image (JPG, PNG, SVG, etc.)</span>
            </div>
            
            {component.content.url && (
              <div className="mt-3 p-2 border rounded-md bg-gray-50">
                <div className="aspect-video relative bg-white rounded-sm overflow-hidden border">
                  <img 
                    src={component.content.url} 
                    alt="Preview" 
                    className="absolute inset-0 w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const nextElement = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'flex';
                      }
                    }}
                  />
                  <div 
                    className="absolute inset-0 w-full h-full flex-col items-center justify-center bg-gray-100 hidden" 
                    style={{ display: 'none' }}
                  >
                    <i className="ri-error-warning-line text-amber-500 text-xl mb-1"></i>
                    <span className="text-xs text-gray-600">Image failed to load</span>
                  </div>
                </div>
                <div className="mt-1 text-xs text-right">
                  <button 
                    className="text-destructive hover:text-destructive-foreground"
                    onClick={() => updateContent('url', '')}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label className="text-xs text-gray-600 block mb-1">Alt Text <span className="text-amber-500">*</span></label>
            <Input
              value={component.content.alt || ''}
              onChange={(e) => updateContent('alt', e.target.value)}
              placeholder="Image description for accessibility"
              className="text-sm"
            />
            <div className="mt-1 text-xs text-gray-500">
              Describe the image for screen readers and SEO
            </div>
          </div>
          
          <div>
            <label className="text-xs text-gray-600 block mb-1">Caption (optional)</label>
            <Input
              value={component.content.caption || ''}
              onChange={(e) => updateContent('caption', e.target.value)}
              placeholder="Image caption"
              className="text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-1">Image Size</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Select
                  value={component.style.maxWidth || '100%'}
                  onValueChange={(value) => {
                    updateComponent(component.id, {
                      style: {
                        ...component.style,
                        maxWidth: value
                      }
                    });
                  }}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select width" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100%">Full width</SelectItem>
                    <SelectItem value="75%">75% width</SelectItem>
                    <SelectItem value="50%">50% width</SelectItem>
                    <SelectItem value="400px">Small (400px)</SelectItem>
                    <SelectItem value="600px">Medium (600px)</SelectItem>
                    <SelectItem value="800px">Large (800px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={component.style.borderRadius || '0.5rem'}
                  onValueChange={(value) => {
                    updateComponent(component.id, {
                      style: {
                        ...component.style,
                        borderRadius: value
                      }
                    });
                  }}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select radius" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No rounding</SelectItem>
                    <SelectItem value="0.25rem">Slight rounding</SelectItem>
                    <SelectItem value="0.5rem">Medium rounding</SelectItem>
                    <SelectItem value="1rem">Heavy rounding</SelectItem>
                    <SelectItem value="9999px">Full circle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      );
    
    case 'spacer':
      return (
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Height (px)</label>
            <Input
              type="number"
              value={component.content.height || 50}
              onChange={(e) => updateContent('height', parseInt(e.target.value))}
              className="text-sm"
              min={10}
              max={200}
            />
          </div>
        </div>
      );
    
    case 'divider':
      return (
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Divider Style</label>
            <Select
              value={component.content.style || 'solid'}
              onValueChange={(value) => updateContent('style', value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    
    case 'form':
      return (
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Form Title</label>
            <Input
              value={component.content.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-600 block mb-1">Submit Button Text</label>
            <Input
              value={component.content.submitText || ''}
              onChange={(e) => updateContent('submitText', e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-600 block mb-1">Form Fields</label>
            <div className="space-y-2 mt-2">
              {component.content.fields?.map((field: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded p-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium">{field.label || `Field ${index + 1}`}</span>
                    <Button
                      variant="ghost" 
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        const newFields = component.content.fields.filter((_: any, i: number) => i !== index);
                        updateContent('fields', newFields);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-1">
                    <div>
                      <label className="text-xs text-gray-500 block">Label</label>
                      <Input
                        value={field.label || ''}
                        onChange={(e) => {
                          const newFields = [...component.content.fields];
                          newFields[index] = { ...field, label: e.target.value };
                          updateContent('fields', newFields);
                        }}
                        className="text-xs h-7"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block">Name</label>
                      <Input
                        value={field.name || ''}
                        onChange={(e) => {
                          const newFields = [...component.content.fields];
                          newFields[index] = { ...field, name: e.target.value };
                          updateContent('fields', newFields);
                        }}
                        className="text-xs h-7"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 block">Type</label>
                      <Select
                        value={field.type || 'text'}
                        onValueChange={(value) => {
                          const newFields = [...component.content.fields];
                          newFields[index] = { ...field, type: value };
                          updateContent('fields', newFields);
                        }}
                      >
                        <SelectTrigger className="text-xs h-7">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="tel">Phone</SelectItem>
                          <SelectItem value="textarea">Textarea</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center">
                      <label className="text-xs text-gray-500 flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={field.required || false}
                          onChange={(e) => {
                            const newFields = [...component.content.fields];
                            newFields[index] = { ...field, required: e.target.checked };
                            updateContent('fields', newFields);
                          }}
                          className="rounded"
                        />
                        Required
                      </label>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  const newFields = [...(component.content.fields || []), { 
                    name: `field${component.content.fields?.length || 0 + 1}`, 
                    label: 'New Field', 
                    type: 'text', 
                    required: false 
                  }];
                  updateContent('fields', newFields);
                }}
              >
                Add Field
              </Button>
            </div>
          </div>
        </div>
      );
    
    case 'email-signup':
      return (
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Title</label>
            <Input
              value={component.content.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-600 block mb-1">Description</label>
            <Textarea
              value={component.content.description || ''}
              onChange={(e) => updateContent('description', e.target.value)}
              className="text-sm resize-none"
              rows={2}
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-600 block mb-1">Button Text</label>
            <Input
              value={component.content.buttonText || ''}
              onChange={(e) => updateContent('buttonText', e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
      );
      
    // Columns components
    case 'columns-2':
    case 'columns-3':
    case 'columns-4':
      return (
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Columns Gap</label>
            <Select
              value={component.content.gap || 'medium'}
              onValueChange={(value) => updateContent('gap', value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select gap size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-xs text-gray-600 block mb-1">Vertical Alignment</label>
            <Select
              value={component.content.verticalAlign || 'top'}
              onValueChange={(value) => updateContent('verticalAlign', value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select alignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="bottom">Bottom</SelectItem>
                <SelectItem value="stretch">Stretch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-xs text-gray-600 block mb-1">Equal Column Width</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="equalWidth"
                checked={component.content.equalWidth || true}
                onChange={(e) => updateContent('equalWidth', e.target.checked)}
              />
              <label htmlFor="equalWidth" className="text-sm">Make all columns equal width</label>
            </div>
          </div>
          
          <div>
            <label className="text-xs text-gray-600 block mb-1">Stack on Mobile</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="stackOnMobile"
                checked={component.content.stackOnMobile !== false}
                onChange={(e) => updateContent('stackOnMobile', e.target.checked)}
              />
              <label htmlFor="stackOnMobile" className="text-sm">Stack columns on mobile devices</label>
            </div>
          </div>
        </div>
      );
      
    // Feature components
    case 'feature-grid':
    case 'feature-list':
    case 'feature-cards':
      return (
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Section Title</label>
            <Input
              value={component.content.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-600 block mb-1">Section Description</label>
            <Textarea
              value={component.content.description || ''}
              onChange={(e) => updateContent('description', e.target.value)}
              className="text-sm resize-none"
              rows={2}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-600">Features</label>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => {
                  const newFeatures = [
                    ...(component.content.features || []),
                    {
                      title: 'New Feature',
                      description: 'Description of this feature',
                      icon: 'ri-star-line'
                    }
                  ];
                  updateContent('features', newFeatures);
                }}
              >
                Add Feature
              </Button>
            </div>
            
            {component.content.features?.map((feature: any, index: number) => (
              <div key={index} className="border rounded-md p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Feature {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => {
                      const newFeatures = component.content.features.filter((_: any, i: number) => i !== index);
                      updateContent('features', newFeatures);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Title</label>
                  <Input
                    value={feature.title || ''}
                    onChange={(e) => {
                      const newFeatures = [...component.content.features];
                      newFeatures[index] = { ...feature, title: e.target.value };
                      updateContent('features', newFeatures);
                    }}
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Description</label>
                  <Textarea
                    value={feature.description || ''}
                    onChange={(e) => {
                      const newFeatures = [...component.content.features];
                      newFeatures[index] = { ...feature, description: e.target.value };
                      updateContent('features', newFeatures);
                    }}
                    className="text-sm resize-none"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Icon</label>
                  <Input
                    value={feature.icon || ''}
                    onChange={(e) => {
                      const newFeatures = [...component.content.features];
                      newFeatures[index] = { ...feature, icon: e.target.value };
                      updateContent('features', newFeatures);
                    }}
                    className="text-sm"
                    placeholder="Remix icon class (e.g., ri-star-line)"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      
    // Testimonial components
    case 'testimonial-single':
    case 'testimonial-carousel':
      return (
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Section Title</label>
            <Input
              value={component.content.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-600">Testimonials</label>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => {
                  const newTestimonials = [
                    ...(component.content.testimonials || []),
                    {
                      quote: 'This product changed my life!',
                      author: 'Jane Doe',
                      role: 'CEO, Company',
                      avatarUrl: ''
                    }
                  ];
                  updateContent('testimonials', newTestimonials);
                }}
              >
                Add Testimonial
              </Button>
            </div>
            
            {component.content.testimonials?.map((item: any, index: number) => (
              <div key={index} className="border rounded-md p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Testimonial {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => {
                      const newTestimonials = component.content.testimonials.filter((_: any, i: number) => i !== index);
                      updateContent('testimonials', newTestimonials);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Quote</label>
                  <Textarea
                    value={item.quote || ''}
                    onChange={(e) => {
                      const newTestimonials = [...component.content.testimonials];
                      newTestimonials[index] = { ...item, quote: e.target.value };
                      updateContent('testimonials', newTestimonials);
                    }}
                    className="text-sm resize-none"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Author Name</label>
                  <Input
                    value={item.author || ''}
                    onChange={(e) => {
                      const newTestimonials = [...component.content.testimonials];
                      newTestimonials[index] = { ...item, author: e.target.value };
                      updateContent('testimonials', newTestimonials);
                    }}
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Author Role</label>
                  <Input
                    value={item.role || ''}
                    onChange={(e) => {
                      const newTestimonials = [...component.content.testimonials];
                      newTestimonials[index] = { ...item, role: e.target.value };
                      updateContent('testimonials', newTestimonials);
                    }}
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Avatar URL</label>
                  <Input
                    value={item.avatarUrl || ''}
                    onChange={(e) => {
                      const newTestimonials = [...component.content.testimonials];
                      newTestimonials[index] = { ...item, avatarUrl: e.target.value };
                      updateContent('testimonials', newTestimonials);
                    }}
                    className="text-sm"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      
    // Stats bar
    case 'stats-bar':
      return (
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Section Title</label>
            <Input
              value={component.content.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-600">Statistics</label>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => {
                  const newStats = [
                    ...(component.content.stats || []),
                    { value: '100+', label: 'Customers' }
                  ];
                  updateContent('stats', newStats);
                }}
              >
                Add Stat
              </Button>
            </div>
            
            {component.content.stats?.map((stat: any, index: number) => (
              <div key={index} className="border rounded-md p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Stat {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => {
                      const newStats = component.content.stats.filter((_: any, i: number) => i !== index);
                      updateContent('stats', newStats);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Value</label>
                  <Input
                    value={stat.value || ''}
                    onChange={(e) => {
                      const newStats = [...component.content.stats];
                      newStats[index] = { ...stat, value: e.target.value };
                      updateContent('stats', newStats);
                    }}
                    className="text-sm"
                    placeholder="100+"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Label</label>
                  <Input
                    value={stat.label || ''}
                    onChange={(e) => {
                      const newStats = [...component.content.stats];
                      newStats[index] = { ...stat, label: e.target.value };
                      updateContent('stats', newStats);
                    }}
                    className="text-sm"
                    placeholder="Customers"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      
    // Pricing cards
    case 'pricing-cards':
      return (
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Section Title</label>
            <Input
              value={component.content.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-600 block mb-1">Section Description</label>
            <Textarea
              value={component.content.description || ''}
              onChange={(e) => updateContent('description', e.target.value)}
              className="text-sm resize-none"
              rows={2}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-600">Pricing Plans</label>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => {
                  const newPlans = [
                    ...(component.content.plans || []),
                    {
                      name: 'Basic',
                      price: '$19',
                      period: 'per month',
                      description: 'Perfect for individuals',
                      features: ['Feature 1', 'Feature 2'],
                      buttonText: 'Get Started',
                      buttonUrl: '#',
                      highlight: false
                    }
                  ];
                  updateContent('plans', newPlans);
                }}
              >
                Add Plan
              </Button>
            </div>
            
            {component.content.plans?.map((plan: any, index: number) => (
              <div key={index} className="border rounded-md p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">{plan.name || `Plan ${index + 1}`}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => {
                      const newPlans = component.content.plans.filter((_: any, i: number) => i !== index);
                      updateContent('plans', newPlans);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Plan Name</label>
                  <Input
                    value={plan.name || ''}
                    onChange={(e) => {
                      const newPlans = [...component.content.plans];
                      newPlans[index] = { ...plan, name: e.target.value };
                      updateContent('plans', newPlans);
                    }}
                    className="text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Price</label>
                    <Input
                      value={plan.price || ''}
                      onChange={(e) => {
                        const newPlans = [...component.content.plans];
                        newPlans[index] = { ...plan, price: e.target.value };
                        updateContent('plans', newPlans);
                      }}
                      className="text-sm"
                      placeholder="$19"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Period</label>
                    <Input
                      value={plan.period || ''}
                      onChange={(e) => {
                        const newPlans = [...component.content.plans];
                        newPlans[index] = { ...plan, period: e.target.value };
                        updateContent('plans', newPlans);
                      }}
                      className="text-sm"
                      placeholder="per month"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Description</label>
                  <Input
                    value={plan.description || ''}
                    onChange={(e) => {
                      const newPlans = [...component.content.plans];
                      newPlans[index] = { ...plan, description: e.target.value };
                      updateContent('plans', newPlans);
                    }}
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-gray-600">Features</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => {
                        const newPlans = [...component.content.plans];
                        const newFeatures = [...(plan.features || []), 'New feature'];
                        newPlans[index] = { ...plan, features: newFeatures };
                        updateContent('plans', newPlans);
                      }}
                    >
                      + Add
                    </Button>
                  </div>
                  
                  {plan.features?.map((feature: string, featureIndex: number) => (
                    <div key={featureIndex} className="flex items-center gap-2 mb-1">
                      <Input
                        value={feature}
                        onChange={(e) => {
                          const newPlans = [...component.content.plans];
                          const newFeatures = [...plan.features];
                          newFeatures[featureIndex] = e.target.value;
                          newPlans[index] = { ...plan, features: newFeatures };
                          updateContent('plans', newPlans);
                        }}
                        className="text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => {
                          const newPlans = [...component.content.plans];
                          const newFeatures = plan.features.filter((_: string, i: number) => i !== featureIndex);
                          newPlans[index] = { ...plan, features: newFeatures };
                          updateContent('plans', newPlans);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Button Text</label>
                    <Input
                      value={plan.buttonText || ''}
                      onChange={(e) => {
                        const newPlans = [...component.content.plans];
                        newPlans[index] = { ...plan, buttonText: e.target.value };
                        updateContent('plans', newPlans);
                      }}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Button URL</label>
                    <Input
                      value={plan.buttonUrl || ''}
                      onChange={(e) => {
                        const newPlans = [...component.content.plans];
                        newPlans[index] = { ...plan, buttonUrl: e.target.value };
                        updateContent('plans', newPlans);
                      }}
                      className="text-sm"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="checkbox"
                    id={`highlight-${index}`}
                    checked={plan.highlight || false}
                    onChange={(e) => {
                      const newPlans = [...component.content.plans];
                      newPlans[index] = { ...plan, highlight: e.target.checked };
                      updateContent('plans', newPlans);
                    }}
                  />
                  <label htmlFor={`highlight-${index}`} className="text-sm">Highlight this plan</label>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      
    // Footer components
    case 'footer-simple':
    case 'footer-columns':
      return (
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Company Name</label>
            <Input
              value={component.content.companyName || ''}
              onChange={(e) => updateContent('companyName', e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-600 block mb-1">Tagline</label>
            <Input
              value={component.content.tagline || ''}
              onChange={(e) => updateContent('tagline', e.target.value)}
              className="text-sm"
            />
          </div>
          
          {component.type === 'footer-simple' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-600">Links</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => {
                    const newLinks = [
                      ...(component.content.links || []),
                      { text: 'New Link', url: '#' }
                    ];
                    updateContent('links', newLinks);
                  }}
                >
                  Add Link
                </Button>
              </div>
              
              {component.content.links?.map((link: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={link.text || ''}
                    onChange={(e) => {
                      const newLinks = [...component.content.links];
                      newLinks[index] = { ...link, text: e.target.value };
                      updateContent('links', newLinks);
                    }}
                    className="text-sm"
                    placeholder="Link text"
                  />
                  <Input
                    value={link.url || ''}
                    onChange={(e) => {
                      const newLinks = [...component.content.links];
                      newLinks[index] = { ...link, url: e.target.value };
                      updateContent('links', newLinks);
                    }}
                    className="text-sm"
                    placeholder="URL"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    onClick={() => {
                      const newLinks = component.content.links.filter((_: any, i: number) => i !== index);
                      updateContent('links', newLinks);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {component.type === 'footer-columns' && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-600">Footer Columns</label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      const newColumns = [
                        ...(component.content.columns || []),
                        { 
                          title: 'New Column',
                          links: [
                            { text: 'Link 1', url: '#' },
                            { text: 'Link 2', url: '#' }
                          ]
                        }
                      ];
                      updateContent('columns', newColumns);
                    }}
                  >
                    Add Column
                  </Button>
                </div>
                
                {component.content.columns?.map((column: any, colIndex: number) => (
                  <div key={colIndex} className="border rounded-md p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">{column.title || `Column ${colIndex + 1}`}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => {
                          const newColumns = component.content.columns.filter((_: any, i: number) => i !== colIndex);
                          updateContent('columns', newColumns);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Column Title</label>
                      <Input
                        value={column.title || ''}
                        onChange={(e) => {
                          const newColumns = [...component.content.columns];
                          newColumns[colIndex] = { ...column, title: e.target.value };
                          updateContent('columns', newColumns);
                        }}
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-gray-600">Links</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => {
                            const newColumns = [...component.content.columns];
                            const newLinks = [...(column.links || []), { text: 'New Link', url: '#' }];
                            newColumns[colIndex] = { ...column, links: newLinks };
                            updateContent('columns', newColumns);
                          }}
                        >
                          + Add Link
                        </Button>
                      </div>
                      
                      {column.links?.map((link: any, linkIndex: number) => (
                        <div key={linkIndex} className="flex items-center gap-2">
                          <Input
                            value={link.text || ''}
                            onChange={(e) => {
                              const newColumns = [...component.content.columns];
                              const newLinks = [...column.links];
                              newLinks[linkIndex] = { ...link, text: e.target.value };
                              newColumns[colIndex] = { ...column, links: newLinks };
                              updateContent('columns', newColumns);
                            }}
                            className="text-sm"
                            placeholder="Link text"
                          />
                          <Input
                            value={link.url || ''}
                            onChange={(e) => {
                              const newColumns = [...component.content.columns];
                              const newLinks = [...column.links];
                              newLinks[linkIndex] = { ...link, url: e.target.value };
                              newColumns[colIndex] = { ...column, links: newLinks };
                              updateContent('columns', newColumns);
                            }}
                            className="text-sm"
                            placeholder="URL"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0"
                            onClick={() => {
                              const newColumns = [...component.content.columns];
                              const newLinks = column.links.filter((_: any, i: number) => i !== linkIndex);
                              newColumns[colIndex] = { ...column, links: newLinks };
                              updateContent('columns', newColumns);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          <div>
            <label className="text-xs text-gray-600 block mb-1">Copyright Text</label>
            <Input
              value={component.content.copyright || ''}
              onChange={(e) => updateContent('copyright', e.target.value)}
              className="text-sm"
              placeholder="© 2025 Your Company. All rights reserved."
            />
          </div>
        </div>
      );
    
    default:
      return (
        <div className="p-4">
          <p className="text-sm text-gray-500">No properties available for this component type.</p>
        </div>
      );
  }
}

// Style properties for components
function RenderStyleProperties({ component, updateComponent }: { component: Component, updateComponent: (id: string, updates: Partial<Component>) => void }) {
  // State for background image upload
  const [bgUploading, setBgUploading] = useState(false);
  const [bgUploadError, setBgUploadError] = useState<string | null>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { addBrandAsset, isEditingPage } = useEditor();

  const updateStyle = (key: string, value: any) => {
    updateComponent(component.id, {
      style: {
        ...component.style,
        [key]: value
      }
    });
  };
  
  // Handle background image upload
  const handleBgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setBgUploadError("Please select an image file (JPG, PNG, GIF, etc.)");
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setBgUploadError("Image size exceeds 5MB limit");
      return;
    }
    
    setBgUploading(true);
    setBgUploadError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      // Update all background properties at once to ensure proper rendering
      const newStyles = {
        backgroundImage: data.url,
        backgroundType: 'image',
        backgroundSize: component.style.backgroundSize || 'cover',
        backgroundPosition: component.style.backgroundPosition || 'center',
        backgroundRepeat: component.style.backgroundRepeat || 'no-repeat'
      };
      
      // Apply all style updates at once
      updateComponent(component.id, {
        style: {
          ...component.style,
          ...newStyles
        }
      });
      
      toast({
        title: "Background image uploaded",
        description: "Your background image has been uploaded and applied.",
        duration: 3000
      });
    } catch (error) {
      console.error('Background image upload error:', error);
      setBgUploadError("Failed to upload image. Please try again.");
    } finally {
      setBgUploading(false);
      // Clear the file input
      if (bgFileInputRef.current) {
        bgFileInputRef.current.value = '';
      }
    }
  };

  // Common style properties for most components
  return (
    <div className="p-4 space-y-4">
      {/* Background */}
      <div>
        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3">Background</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Type</label>
            <Select
              value={component.style.backgroundType || 'color'}
              onValueChange={(value) => {
                // Update background type
                updateStyle('backgroundType', value);
                
                // Apply appropriate styling based on the new background type
                if (value === 'gradient') {
                  // Set default gradient colors if not already set
                  const startColor = component.style.gradientStartColor || '#4F46E5';
                  const endColor = component.style.gradientEndColor || '#0EA5E9';
                  const direction = component.style.gradientDirection || 'to right';
                  
                  // Create the gradient
                  const gradient = `linear-gradient(${direction}, ${startColor}, ${endColor})`;
                  
                  console.log("Applying gradient:", gradient);
                  console.log("Component style before update:", component.style);
                  console.log("isEditingPage:", isEditingPage);
                  
                  // Make sure we're not in page editing mode
                  if (isEditingPage) {
                    console.log("Warning: Trying to update component background while in page editing mode");
                    toast({
                      title: "Cannot update component",
                      description: "Please exit page editing mode to modify component backgrounds.",
                      variant: "destructive"
                    });
                    return;
                  }
                  
                  // Update style properties directly to ensure all values are set
                  const updatedStyle = {
                    ...component.style,
                    backgroundType: value,
                    gradientStartColor: startColor,
                    gradientEndColor: endColor,
                    gradientDirection: direction,
                    background: gradient,
                    // Clear potentially conflicting properties
                    backgroundColor: undefined, 
                    backgroundImage: undefined
                  };
                  
                  console.log("Component style after update:", updatedStyle);
                  
                  // Update the component with all the style changes at once
                  updateComponent(component.id, {
                    style: updatedStyle
                  });
                } else if (value === 'color') {
                  // Default color if switching to solid color
                  const color = component.style.backgroundColor || '#F9FAFB';
                  
                  // Update style properties
                  updateComponent(component.id, {
                    style: {
                      ...component.style,
                      backgroundType: value,
                      backgroundColor: color,
                      // Clear potentially conflicting properties
                      background: undefined,
                      backgroundImage: undefined
                    }
                  });
                } else if (value === 'image') {
                  // Keep current background image if exists, or set empty
                  const imgUrl = component.style.backgroundImage || '';
                  
                  // Update style properties
                  updateComponent(component.id, {
                    style: {
                      ...component.style,
                      backgroundType: value,
                      backgroundImage: imgUrl,
                      // Set default image properties if not set
                      backgroundSize: component.style.backgroundSize || 'cover',
                      backgroundPosition: component.style.backgroundPosition || 'center',
                      backgroundRepeat: component.style.backgroundRepeat || 'no-repeat',
                      // Clear potentially conflicting properties
                      backgroundColor: undefined,
                      background: undefined
                    }
                  });
                }
              }}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Background type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="color">Solid Color</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Show relevant background options based on type */}
          {(component.style.backgroundType === 'color' || !component.style.backgroundType) && (
            <div>
              <label className="text-xs text-gray-600 block mb-1">Color</label>
              <ColorPicker
                color={component.style.backgroundColor || '#F9FAFB'}
                onChange={(color) => updateStyle('backgroundColor', color)}
              />
            </div>
          )}
          
          {component.style.backgroundType === 'gradient' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Gradient Direction</label>
                <Select
                  value={component.style.gradientDirection || 'to right'}
                  onValueChange={(value) => {
                    // Check if we're in page editing mode
                    if (isEditingPage) {
                      console.log("Warning: Trying to update component gradient while in page editing mode");
                      toast({
                        title: "Cannot update component",
                        description: "Please exit page editing mode to modify component styles.",
                        variant: "destructive"
                      });
                      return;
                    }
                    
                    // Create the full style update with new direction
                    const startColor = component.style.gradientStartColor || '#4F46E5';
                    const endColor = component.style.gradientEndColor || '#0EA5E9';
                    const gradient = `linear-gradient(${value}, ${startColor}, ${endColor})`;
                    
                    console.log("Updating gradient direction:", value);
                    console.log("New gradient:", gradient);
                    
                    // Update all related gradient properties at once
                    updateComponent(component.id, {
                      style: {
                        ...component.style,
                        gradientDirection: value,
                        background: gradient
                      }
                    });
                  }}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="to right">Horizontal (Left to Right)</SelectItem>
                    <SelectItem value="to left">Horizontal (Right to Left)</SelectItem>
                    <SelectItem value="to bottom">Vertical (Top to Bottom)</SelectItem>
                    <SelectItem value="to top">Vertical (Bottom to Top)</SelectItem>
                    <SelectItem value="to bottom right">Diagonal (Top-Left to Bottom-Right)</SelectItem>
                    <SelectItem value="to bottom left">Diagonal (Top-Right to Bottom-Left)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs text-gray-600 block mb-1">Start Color</label>
                <ColorPicker
                  color={component.style.gradientStartColor || '#4F46E5'}
                  onChange={(color) => {
                    // Check if we're in page editing mode
                    if (isEditingPage) {
                      console.log("Warning: Trying to update component gradient while in page editing mode");
                      toast({
                        title: "Cannot update component",
                        description: "Please exit page editing mode to modify component styles.",
                        variant: "destructive"
                      });
                      return;
                    }
                    
                    // Create the full style update
                    const direction = component.style.gradientDirection || 'to right';
                    const endColor = component.style.gradientEndColor || '#0EA5E9';
                    const gradient = `linear-gradient(${direction}, ${color}, ${endColor})`;
                    
                    console.log("Updating gradient start color:", color);
                    console.log("New gradient:", gradient);
                    
                    // Update all related gradient properties at once
                    updateComponent(component.id, {
                      style: {
                        ...component.style,
                        gradientStartColor: color,
                        background: gradient
                      }
                    });
                  }}
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-600 block mb-1">End Color</label>
                <ColorPicker
                  color={component.style.gradientEndColor || '#0EA5E9'}
                  onChange={(color) => {
                    // Check if we're in page editing mode
                    if (isEditingPage) {
                      console.log("Warning: Trying to update component gradient while in page editing mode");
                      toast({
                        title: "Cannot update component",
                        description: "Please exit page editing mode to modify component styles.",
                        variant: "destructive"
                      });
                      return;
                    }
                    
                    // Create the full style update
                    const direction = component.style.gradientDirection || 'to right';
                    const startColor = component.style.gradientStartColor || '#4F46E5';
                    const gradient = `linear-gradient(${direction}, ${startColor}, ${color})`;
                    
                    console.log("Updating gradient end color:", color);
                    console.log("New gradient:", gradient);
                    
                    // Update all related gradient properties at once
                    updateComponent(component.id, {
                      style: {
                        ...component.style,
                        gradientEndColor: color,
                        background: gradient
                      }
                    });
                  }}
                />
              </div>
              
              {/* Gradient Preview */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">Preview</label>
                <div 
                  className="h-12 rounded-md border border-gray-200" 
                  style={{ 
                    background: `linear-gradient(${component.style.gradientDirection || 'to right'}, ${component.style.gradientStartColor || '#4F46E5'}, ${component.style.gradientEndColor || '#0EA5E9'})` 
                  }}
                ></div>
                <div className="flex justify-end mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      // Even if we're in page editing mode, we can still save to brand assets
                      // as it doesn't affect the component styling
                      const startColor = component.style.gradientStartColor || '#4F46E5';
                      const endColor = component.style.gradientEndColor || '#0EA5E9';
                      
                      // Generate default name from the colors
                      const defaultName = `Gradient ${startColor.substring(1, 4)}..${endColor.substring(1, 4)}`;
                      
                      // Prompt for a name
                      const gradientName = prompt('Enter a name for this gradient', defaultName);
                      if (gradientName) {
                        // Add the asset to brand assets collection
                        addBrandAsset({
                          name: gradientName.trim(),
                          type: 'gradient',
                          value: startColor,
                          secondaryValue: endColor
                        });
                          
                        // Show toast notification
                        toast({
                          title: "Gradient saved",
                          description: `"${gradientName.trim()}" has been added to your brand assets.`,
                          duration: 3000
                        });
                      }
                    }}
                  >
                    Save to Brand Assets
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {component.style.backgroundType === 'image' && (
            <div className="space-y-3">
              <div>
                {/* Background Image upload section */}
                <div className="mb-4 border border-dashed border-gray-300 rounded-md p-4 bg-gray-50">
                  <div className="text-center">
                    <Image className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <div className="text-xs text-gray-600 mb-2">
                      Upload a background image
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={bgFileInputRef}
                      onChange={handleBgImageUpload}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={() => bgFileInputRef.current?.click()}
                      disabled={bgUploading}
                    >
                      {bgUploading ? (
                        <div className="flex items-center">
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                          Uploading...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Upload className="h-4 w-4" />
                          Choose Background Image
                        </div>
                      )}
                    </Button>
                    
                    {bgUploadError && (
                      <Alert variant="destructive" className="mt-2 py-2">
                        <AlertDescription className="text-xs">{bgUploadError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              
                <label className="text-xs text-gray-600 block mb-1">Or enter image URL</label>
                <Input
                  value={component.style.backgroundImage || ''}
                  onChange={(e) => {
                    const url = e.target.value;
                    // Remove 'url()' if the user pastes a CSS background-image value
                    const cleanUrl = url.replace(/^url\(['"]?|['"]?\)$/g, '');
                    
                    // Update all related properties at once
                    const newStyles: Partial<Record<string, any>> = {
                      backgroundImage: cleanUrl
                    };
                    
                    // If adding a URL, make sure backgroundType is set to 'image'
                    if (cleanUrl && component.style.backgroundType !== 'image') {
                      newStyles.backgroundType = 'image';
                      
                      // Set default background properties if not already set
                      if (!component.style.backgroundSize) {
                        newStyles.backgroundSize = 'cover';
                      }
                      if (!component.style.backgroundPosition) {
                        newStyles.backgroundPosition = 'center';
                      }
                      if (!component.style.backgroundRepeat) {
                        newStyles.backgroundRepeat = 'no-repeat';
                      }
                    }
                    
                    // Apply all style updates at once
                    updateComponent(component.id, {
                      style: {
                        ...component.style,
                        ...newStyles
                      }
                    });
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="text-sm"
                />
                <div className="mt-2 text-xs text-gray-500 flex items-center">
                  <i className="ri-information-line mr-1"></i>
                  <span>Paste a direct URL to an image</span>
                </div>
                
                {component.style.backgroundImage && (
                  <div className="mt-3 p-2 border rounded-md bg-gray-50">
                    <div className="aspect-video relative rounded-sm overflow-hidden border bg-white">
                      <div 
                        className="absolute inset-0 w-full h-full" 
                        style={{ 
                          backgroundImage: `url(${component.style.backgroundImage})`,
                          backgroundSize: component.style.backgroundSize || 'cover',
                          backgroundPosition: component.style.backgroundPosition || 'center',
                          backgroundRepeat: component.style.backgroundRepeat || 'no-repeat'
                        }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-right">
                      <button 
                        className="text-destructive hover:text-destructive-foreground"
                        onClick={() => {
                          // Update all properties at once
                          updateComponent(component.id, {
                            style: {
                              ...component.style,
                              backgroundImage: '',
                              backgroundType: 'color'
                            }
                          });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-xs text-gray-600 block mb-1">Size</label>
                <Select
                  value={component.style.backgroundSize || 'cover'}
                  onValueChange={(value) => updateStyle('backgroundSize', value)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover">Cover (Fill Container)</SelectItem>
                    <SelectItem value="contain">Contain (Show Full Image)</SelectItem>
                    <SelectItem value="auto">Original Size</SelectItem>
                    <SelectItem value="100% 100%">Stretch to Fit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs text-gray-600 block mb-1">Position</label>
                <Select
                  value={component.style.backgroundPosition || 'center'}
                  onValueChange={(value) => updateStyle('backgroundPosition', value)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="top left">Top Left</SelectItem>
                    <SelectItem value="top right">Top Right</SelectItem>
                    <SelectItem value="bottom left">Bottom Left</SelectItem>
                    <SelectItem value="bottom right">Bottom Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs text-gray-600 block mb-1">Repeat</label>
                <Select
                  value={component.style.backgroundRepeat || 'no-repeat'}
                  onValueChange={(value) => updateStyle('backgroundRepeat', value)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Repeat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-repeat">No Repeat</SelectItem>
                    <SelectItem value="repeat">Repeat (Tile)</SelectItem>
                    <SelectItem value="repeat-x">Repeat Horizontally</SelectItem>
                    <SelectItem value="repeat-y">Repeat Vertically</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs text-gray-600 block mb-1">Overlay Color</label>
                <ColorPicker
                  color={component.style.overlayColor || 'rgba(0,0,0,0)'}
                  onChange={(color) => updateStyle('overlayColor', color)}
                />
                <div className="mt-1 text-xs text-gray-500">
                  Use rgba format for transparency (e.g., rgba(0,0,0,0.5))
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Spacing */}
      <div>
        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3">SPACING</h3>
        <div className="space-y-6">
          {/* Visual Spacing Preview */}
          <div className="relative h-48 border border-dashed border-gray-300 rounded-md bg-gray-50">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Margin Indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="w-5/6 h-5/6 relative border-2 border-dashed border-blue-300 flex items-center justify-center"
                  style={{
                    marginTop: component.style.marginTop || '0px',
                    marginRight: component.style.marginRight || '0px',
                    marginBottom: component.style.marginBottom || '0px',
                    marginLeft: component.style.marginLeft || '0px',
                  }}
                >
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-[10px] px-1 bg-white text-blue-500">Margin</span>
                  
                  {/* Padding Indicator */}
                  <div 
                    className="w-full h-full border-2 border-blue-500 flex items-center justify-center bg-blue-50"
                    style={{
                      paddingTop: component.style.paddingTop || '16px',
                      paddingRight: component.style.paddingRight || '16px',
                      paddingBottom: component.style.paddingBottom || '16px',
                      paddingLeft: component.style.paddingLeft || '16px',
                    }}
                  >
                    <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-[10px] px-1 bg-white text-blue-600">Padding</span>
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center border border-blue-200">
                      <span className="text-xs text-blue-800 font-medium">Content</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="grid grid-cols-2 gap-6">
            {/* Padding Controls */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-gray-700">Padding</label>
                <span className="text-[10px] text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">Inner Space</span>
              </div>
              <div className="space-y-3">
                <SpacingControl
                  label="Top"
                  value={component.style.paddingTop || '16px'}
                  onChange={(value) => updateStyle('paddingTop', value)}
                  color="bg-blue-100 border-blue-200"
                  min={0}
                  max={100}
                  defaultValue="16px"
                />
                <SpacingControl
                  label="Right"
                  value={component.style.paddingRight || '16px'}
                  onChange={(value) => updateStyle('paddingRight', value)}
                  color="bg-blue-100 border-blue-200"
                  min={0}
                  max={100}
                  defaultValue="16px"
                />
                <SpacingControl
                  label="Bottom"
                  value={component.style.paddingBottom || '16px'}
                  onChange={(value) => updateStyle('paddingBottom', value)}
                  color="bg-blue-100 border-blue-200"
                  min={0}
                  max={100}
                  defaultValue="16px"
                />
                <SpacingControl
                  label="Left"
                  value={component.style.paddingLeft || '16px'}
                  onChange={(value) => updateStyle('paddingLeft', value)}
                  color="bg-blue-100 border-blue-200"
                  min={0}
                  max={100}
                  defaultValue="16px"
                />
              </div>
            </div>
            
            {/* Margin Controls */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-gray-700">Margin</label>
                <span className="text-[10px] text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">Outer Space</span>
              </div>
              <div className="space-y-3">
                <SpacingControl
                  label="Top"
                  value={component.style.marginTop || '0px'}
                  onChange={(value) => updateStyle('marginTop', value)}
                  color="bg-blue-50 border-blue-100"
                  min={0}
                  max={100}
                  defaultValue="0px"
                />
                <SpacingControl
                  label="Right"
                  value={component.style.marginRight || '0px'}
                  onChange={(value) => updateStyle('marginRight', value)}
                  color="bg-blue-50 border-blue-100"
                  min={0}
                  max={100}
                  defaultValue="0px"
                />
                <SpacingControl
                  label="Bottom"
                  value={component.style.marginBottom || '0px'}
                  onChange={(value) => updateStyle('marginBottom', value)}
                  color="bg-blue-50 border-blue-100"
                  min={0}
                  max={100}
                  defaultValue="0px"
                />
                <SpacingControl
                  label="Left"
                  value={component.style.marginLeft || '0px'}
                  onChange={(value) => updateStyle('marginLeft', value)}
                  color="bg-blue-50 border-blue-100"
                  min={0}
                  max={100}
                  defaultValue="0px"
                />
              </div>
            </div>
          </div>
          
          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                updateStyle('paddingTop', '16px');
                updateStyle('paddingRight', '16px');
                updateStyle('paddingBottom', '16px');
                updateStyle('paddingLeft', '16px');
              }}
              className="text-xs"
            >
              Reset Padding
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                updateStyle('marginTop', '0px');
                updateStyle('marginRight', '0px');
                updateStyle('marginBottom', '0px');
                updateStyle('marginLeft', '0px');
              }}
              className="text-xs"
            >
              Reset Margin
            </Button>
          </div>
        </div>
      </div>
      
      {/* Border */}
      <div>
        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3">Border</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Border Width</label>
            <Select
              value={component.style.borderWidth || '0px'}
              onValueChange={(value) => updateStyle('borderWidth', value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0px">None</SelectItem>
                <SelectItem value="1px">1px</SelectItem>
                <SelectItem value="2px">2px</SelectItem>
                <SelectItem value="4px">4px</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">Border Radius</label>
            <Select
              value={component.style.borderRadius || '0px'}
              onValueChange={(value) => updateStyle('borderRadius', value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Radius" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0px">Square</SelectItem>
                <SelectItem value="4px">Slight (4px)</SelectItem>
                <SelectItem value="8px">Rounded (8px)</SelectItem>
                <SelectItem value="16px">Very Rounded (16px)</SelectItem>
                <SelectItem value="9999px">Pill</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Typography (for text-based components) */}
      {['heading', 'text-block', 'button', 'form', 'email-signup', 'header-1', 'header-2', 'hero-split', 'hero-centered'].includes(component.type) && (
        <div>
          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3">Typography</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Font Family</label>
              <Select
                value={component.style.fontFamily || 'Inter, sans-serif'}
                onValueChange={(value) => updateStyle('fontFamily', value)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                  <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                  <SelectItem value="Poppins, sans-serif">Poppins</SelectItem>
                  <SelectItem value="'Playfair Display', serif">Playfair Display</SelectItem>
                  <SelectItem value="'Montserrat', sans-serif">Montserrat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Font Weight</label>
              <Select
                value={component.style.fontWeight || 'normal'}
                onValueChange={(value) => updateStyle('fontWeight', value)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Regular</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Text Color</label>
              <ColorPicker
                color={component.style.color || '#111827'}
                onChange={(color) => updateStyle('color', color)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Text Align</label>
              <Select
                value={component.style.textAlign || 'left'}
                onValueChange={(value) => updateStyle('textAlign', value)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Align" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
