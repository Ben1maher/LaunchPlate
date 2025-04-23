import { useState } from "react";
import { BrandAsset, useEditor } from "../../context/EditorContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorPicker } from "@/components/ui/color-picker";
import { Plus, X, Trash, Image, Palette, Paintbrush } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function BrandAssetsPanel() {
  const { 
    brandAssets, 
    addBrandAsset, 
    removeBrandAsset, 
    selectedComponent, 
    updateComponent,
    pageSettings,
    updatePageSettings,
    isEditingPage
  } = useEditor();
  const { toast } = useToast();
  const [newColorName, setNewColorName] = useState("");
  const [newColor, setNewColor] = useState("#3b82f6");
  const [newGradientName, setNewGradientName] = useState("");
  const [newGradientStart, setNewGradientStart] = useState("#4F46E5");
  const [newGradientEnd, setNewGradientEnd] = useState("#10B981");
  const [newImageName, setNewImageName] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [activeTab, setActiveTab] = useState("colors");
  
  // Filter assets by type
  const colorAssets = brandAssets.filter(asset => asset.type === 'color');
  const gradientAssets = brandAssets.filter(asset => asset.type === 'gradient');
  const imageAssets = brandAssets.filter(asset => asset.type === 'image');

  // Add a new color
  const handleAddColor = () => {
    if (!newColorName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for this color",
        variant: "destructive"
      });
      return;
    }

    console.log("Adding brand color asset:", { name: newColorName.trim(), type: 'color', value: newColor });
    
    addBrandAsset({
      name: newColorName.trim(),
      type: 'color',
      value: newColor
    });

    // Reset form
    setNewColorName("");
  };

  // Add a new gradient
  const handleAddGradient = () => {
    if (!newGradientName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for this gradient",
        variant: "destructive"
      });
      return;
    }

    console.log("Adding brand gradient asset:", { 
      name: newGradientName.trim(), 
      type: 'gradient', 
      value: newGradientStart,
      secondaryValue: newGradientEnd
    });
    
    addBrandAsset({
      name: newGradientName.trim(),
      type: 'gradient',
      value: newGradientStart,
      secondaryValue: newGradientEnd
    });

    // Reset form
    setNewGradientName("");
  };

  // Add a new image
  const handleAddImage = () => {
    if (!newImageName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for this image",
        variant: "destructive"
      });
      return;
    }

    if (!newImageUrl.trim()) {
      toast({
        title: "URL required",
        description: "Please enter an image URL",
        variant: "destructive"
      });
      return;
    }

    // Test if the image URL is valid
    const img = document.createElement('img') as HTMLImageElement;
    img.onload = () => {
      addBrandAsset({
        name: newImageName.trim(),
        type: 'image',
        value: newImageUrl.trim()
      });

      // Reset form
      setNewImageName("");
      setNewImageUrl("");
    };
    img.onerror = () => {
      toast({
        title: "Invalid image URL",
        description: "Could not load the image. Please check the URL and try again.",
        variant: "destructive"
      });
    };
    img.src = newImageUrl.trim();
  };

  return (
    <div className="space-y-4 p-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Brand Assets</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Brand Asset</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="colors" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="gradients">Gradients</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>
              
              {/* Colors Tab */}
              <TabsContent value="colors" className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Add New Color</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Color Name</label>
                      <Input 
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                        placeholder="e.g., Brand Blue"
                        className="mb-2"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Color Value</label>
                      <div className="flex gap-2">
                        <ColorPicker 
                          color={newColor}
                          onChange={setNewColor}
                        />
                        <Input 
                          value={newColor}
                          onChange={(e) => setNewColor(e.target.value)}
                          className="w-24 font-mono"
                        />
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button onClick={handleAddColor} className="w-full">
                        Add Color
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Gradients Tab */}
              <TabsContent value="gradients" className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Add New Gradient</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Gradient Name</label>
                      <Input 
                        value={newGradientName}
                        onChange={(e) => setNewGradientName(e.target.value)}
                        placeholder="e.g., Ocean Sunset"
                        className="mb-2"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Start Color</label>
                      <div className="flex gap-2 mb-2">
                        <ColorPicker 
                          color={newGradientStart}
                          onChange={setNewGradientStart}
                        />
                        <Input 
                          value={newGradientStart}
                          onChange={(e) => setNewGradientStart(e.target.value)}
                          className="w-24 font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">End Color</label>
                      <div className="flex gap-2">
                        <ColorPicker 
                          color={newGradientEnd}
                          onChange={setNewGradientEnd}
                        />
                        <Input 
                          value={newGradientEnd}
                          onChange={(e) => setNewGradientEnd(e.target.value)}
                          className="w-24 font-mono"
                        />
                      </div>
                    </div>
                    <div className="relative h-8 w-full rounded-md overflow-hidden mb-2">
                      <div 
                        className="absolute inset-0" 
                        style={{ 
                          background: `linear-gradient(135deg, ${newGradientStart}, ${newGradientEnd})` 
                        }}
                      />
                    </div>
                    <div className="pt-2">
                      <Button onClick={handleAddGradient} className="w-full">
                        Add Gradient
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Images Tab */}
              <TabsContent value="images" className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Add New Image</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Image Name</label>
                      <Input 
                        value={newImageName}
                        onChange={(e) => setNewImageName(e.target.value)}
                        placeholder="e.g., Hero Background"
                        className="mb-2"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Image URL</label>
                      <Input 
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="mb-2"
                      />
                    </div>
                    {newImageUrl && (
                      <div className="relative h-24 w-full rounded-md overflow-hidden mb-2 bg-gray-100 flex items-center justify-center">
                        <img 
                          src={newImageUrl} 
                          alt="Preview" 
                          className="object-cover h-full w-full"
                          onError={(e) => {
                            // Show error placeholder for invalid images
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjJDMTcuNSAyMiAyMiAxNy41IDIyIDEyQzIyIDYuNSAxNy41IDIgMTIgMkM2LjUgMiAyIDYuNSAyIDEyQzIgMTcuNSA2LjUgMjIgMTIgMjJaIiBzdHJva2U9IiNFNzRDM0MiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTIgOFYxMiIgc3Ryb2tlPSIjRTc0QzNDIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTEyIDE2SDAuMDEiIHN0cm9rZT0iI0U3NEMzQyIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==';
                          }}
                        />
                      </div>
                    )}
                    <div className="pt-2">
                      <Button onClick={handleAddImage} className="w-full">
                        Add Image
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-md">
        <Tabs defaultValue="colors">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors" className="flex gap-1 items-center">
              <Palette className="h-3.5 w-3.5" />
              Colors
              {colorAssets.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {colorAssets.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="gradients" className="flex gap-1 items-center">
              <Paintbrush className="h-3.5 w-3.5" />
              Gradients
              {gradientAssets.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {gradientAssets.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="images" className="flex gap-1 items-center">
              <Image className="h-3.5 w-3.5" />
              Images
              {imageAssets.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {imageAssets.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          {/* Colors Content */}
          <TabsContent value="colors" className="p-3">
            <ScrollArea className="h-[300px]">
              {colorAssets.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {colorAssets.map(asset => (
                    <div 
                      key={asset.id} 
                      className="group relative border rounded-md p-2 hover:border-primary transition-colors"
                    >
                      <div className="flex flex-col gap-1">
                        <button 
                          className="h-12 rounded-md cursor-pointer transition-all hover:ring-2 hover:ring-primary hover:ring-opacity-50" 
                          style={{ backgroundColor: asset.value }}
                          onClick={() => {
                            // First check if we have a selected component, regardless of editing mode
                            // This ensures we prioritize component styling over page styling
                            if (selectedComponent) {
                              console.log('Applying color from brand asset to component:', selectedComponent.type);
                              
                              // Special handling for header components
                              if (selectedComponent.type.includes('header')) {
                                console.log('Applying header color:', asset.value);
                                
                                // Create a custom event to trigger an immediate DOM update for the component
                                const event = new CustomEvent('header-color-change', {
                                  detail: { id: selectedComponent.id, color: asset.value }
                                });
                                document.dispatchEvent(event);
                                
                                // Force all clicks to refresh component styling
                                setTimeout(() => {
                                  document.dispatchEvent(new Event('click'));
                                }, 50);
                                
                                // Complete style object with all necessary isolation properties
                                const headerStyle = {
                                  ...selectedComponent.style,
                                  backgroundType: 'color',
                                  backgroundColor: `${asset.value} !important`,
                                  // Use color for both properties
                                  background: `${asset.value} !important`,
                                  backgroundImage: 'none !important',
                                  // Remove gradient properties
                                  gradientStartColor: undefined,
                                  gradientEndColor: undefined,
                                  gradientDirection: undefined,
                                  // Add style isolation
                                  position: 'relative',
                                  isolation: 'isolate',
                                  zIndex: 1
                                };
                                
                                updateComponent(selectedComponent.id, {
                                  style: headerStyle
                                });
                              }
                              // Regular components
                              else {
                                updateComponent(selectedComponent.id, {
                                  style: {
                                    ...selectedComponent.style,
                                    backgroundType: 'color',
                                    backgroundColor: `${asset.value} !important`,
                                    // Remove gradient properties if they exist
                                    background: 'none !important',
                                    backgroundImage: 'none !important',
                                    gradientStartColor: undefined,
                                    gradientEndColor: undefined,
                                    gradientDirection: undefined
                                  }
                                });
                              }
                              
                              toast({
                                title: "Color applied",
                                description: `Applied "${asset.name}" to the selected component.`,
                                duration: 2000
                              });
                            }
                            // If no component is selected but we're in page editing mode, update page background
                            else if (isEditingPage) {
                              // Update page background with this color
                              updatePageSettings({
                                background: {
                                  ...pageSettings.background,
                                  type: 'color',
                                  color: asset.value
                                }
                              });
                              
                              toast({
                                title: "Color applied",
                                description: `Applied "${asset.name}" to the page background.`,
                                duration: 2000
                              });
                            }
                            else {
                              toast({
                                title: "No target selected",
                                description: "Please select a component first or activate page settings.",
                                variant: "destructive",
                                duration: 3000
                              });
                            }
                          }}
                          title={`Apply "${asset.name}" to selected component`}
                        ></button>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-medium truncate max-w-[100px]">{asset.name}</div>
                            <div className="text-xs text-gray-500 font-mono">{asset.value}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeBrandAsset(asset.id)}
                          >
                            <Trash className="h-3.5 w-3.5 text-gray-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 text-gray-500">
                  <Palette className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No colors saved yet</p>
                  <p className="text-xs">Click the Add Asset button to get started</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          {/* Gradients Content */}
          <TabsContent value="gradients" className="p-3">
            <ScrollArea className="h-[300px]">
              {gradientAssets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {gradientAssets.map(asset => (
                    <div 
                      key={asset.id} 
                      className="group relative border rounded-md p-2 hover:border-primary transition-colors"
                    >
                      <div className="flex flex-col gap-1">
                        <button 
                          className="h-12 rounded-md w-full cursor-pointer transition-all hover:ring-2 hover:ring-primary hover:ring-opacity-50" 
                          style={{ 
                            background: `linear-gradient(135deg, ${asset.value}, ${asset.secondaryValue})` 
                          }}
                          onClick={() => {
                            // First check if we have a selected component, regardless of editing mode
                            // This ensures we prioritize component styling over page styling
                            if (selectedComponent) {
                              console.log('Applying gradient from brand asset to component:', selectedComponent.type);
                              
                              // Special handling for header components to prevent page-wide changes
                              if (selectedComponent.type.includes('header')) {
                                // Direction and complete gradient string with !important
                                const direction = 'to right'; // Default direction
                                const gradient = `linear-gradient(${direction}, ${asset.value}, ${asset.secondaryValue}) !important`;
                                
                                console.log('Applying header gradient:', gradient);
                                
                                // Create a custom event to force immediate DOM update
                                setTimeout(() => {
                                  document.dispatchEvent(new Event('click'));
                                }, 50);
                                
                                // Complete style object with all necessary isolation properties
                                const headerStyle = {
                                  ...selectedComponent.style,
                                  backgroundType: 'gradient',
                                  gradientStartColor: asset.value,
                                  gradientEndColor: asset.secondaryValue,
                                  gradientDirection: direction,
                                  background: gradient,
                                  backgroundImage: `linear-gradient(${direction}, ${asset.value}, ${asset.secondaryValue}) !important`,
                                  // Force clear potentially conflicting properties
                                  backgroundColor: 'transparent !important',
                                  // Add style isolation
                                  position: 'relative',
                                  isolation: 'isolate',
                                  zIndex: 1
                                };
                                
                                updateComponent(selectedComponent.id, {
                                  style: headerStyle
                                });
                              } 
                              // Regular components
                              else {
                                // Apply the gradient as background
                                const direction = 'to right'; // Default direction
                                const gradient = `linear-gradient(${direction}, ${asset.value}, ${asset.secondaryValue})`;
                                
                                updateComponent(selectedComponent.id, {
                                  style: {
                                    ...selectedComponent.style,
                                    backgroundType: 'gradient',
                                    gradientStartColor: asset.value,
                                    gradientEndColor: asset.secondaryValue,
                                    gradientDirection: direction,
                                    background: `${gradient} !important`,
                                    // Remove solid background if it exists
                                    backgroundColor: undefined
                                  }
                                });
                              }
                              
                              toast({
                                title: "Gradient applied",
                                description: `Applied "${asset.name}" to the selected component.`,
                                duration: 2000
                              });
                            }
                            // If no component is selected but we're in page editing mode, update page background
                            else if (isEditingPage) {
                              // Update page background with this gradient
                              updatePageSettings({
                                background: {
                                  ...pageSettings.background,
                                  type: 'gradient',
                                  gradientStart: asset.value,
                                  gradientEnd: asset.secondaryValue
                                }
                              });
                              
                              toast({
                                title: "Gradient applied",
                                description: `Applied "${asset.name}" to the page background.`,
                                duration: 2000
                              });
                            }
                            else {
                              toast({
                                title: "No target selected",
                                description: "Please select a component first or activate page settings.",
                                variant: "destructive",
                                duration: 3000
                              });
                            }
                          }}
                          title={`Apply "${asset.name}" to selected component`}
                        ></button>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-medium truncate max-w-[140px]">{asset.name}</div>
                            <div className="flex gap-1 items-center">
                              <div 
                                className="h-3 w-3 rounded-full" 
                                style={{ backgroundColor: asset.value }}
                              ></div>
                              <div 
                                className="h-3 w-3 rounded-full" 
                                style={{ backgroundColor: asset.secondaryValue }}
                              ></div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeBrandAsset(asset.id)}
                          >
                            <Trash className="h-3.5 w-3.5 text-gray-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 text-gray-500">
                  <Paintbrush className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No gradients saved yet</p>
                  <p className="text-xs">Click the Add Asset button to get started</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          {/* Images Content */}
          <TabsContent value="images" className="p-3">
            <ScrollArea className="h-[300px]">
              {imageAssets.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {imageAssets.map(asset => (
                    <div 
                      key={asset.id} 
                      className="group relative border rounded-md p-2 hover:border-primary transition-colors"
                    >
                      <div className="flex gap-3">
                        <div 
                          className="h-16 w-24 rounded-md bg-gray-100 flex-shrink-0 overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary hover:ring-opacity-50 transition-all"
                          onClick={() => {
                            // First check if we have a selected component, regardless of editing mode
                            // This ensures we prioritize component styling over page styling
                            if (selectedComponent) {
                              console.log('Applying image from brand asset to component:', selectedComponent.type);
                              
                              // Special handling for header components
                              if (selectedComponent.type.includes('header')) {
                                console.log('Applying header image:', asset.value);
                                
                                // Create a custom event to force immediate DOM update
                                setTimeout(() => {
                                  document.dispatchEvent(new Event('click'));
                                }, 50);
                                
                                // Complete style object with all necessary isolation properties
                                const headerStyle = {
                                  ...selectedComponent.style,
                                  backgroundType: 'image',
                                  backgroundImage: `url(${asset.value}) !important`,
                                  backgroundSize: 'cover !important',
                                  backgroundPosition: 'center !important',
                                  backgroundRepeat: 'no-repeat !important',
                                  // Force clear conflicting properties
                                  backgroundColor: 'transparent !important',
                                  background: 'none !important',
                                  // Remove gradient properties
                                  gradientStartColor: undefined,
                                  gradientEndColor: undefined,
                                  gradientDirection: undefined,
                                  // Add style isolation
                                  position: 'relative',
                                  isolation: 'isolate',
                                  zIndex: 1
                                };
                                
                                updateComponent(selectedComponent.id, {
                                  style: headerStyle
                                });
                              }
                              // Regular components
                              else {
                                updateComponent(selectedComponent.id, {
                                  style: {
                                    ...selectedComponent.style,
                                    backgroundType: 'image',
                                    backgroundImage: `url(${asset.value}) !important`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    // Remove other background properties
                                    backgroundColor: undefined,
                                    background: undefined,
                                    gradientStartColor: undefined,
                                    gradientEndColor: undefined,
                                    gradientDirection: undefined
                                  }
                                });
                              }
                              
                              toast({
                                title: "Image applied",
                                description: `Applied "${asset.name}" to the selected component.`,
                                duration: 2000
                              });
                            }
                            // If no component is selected but we're in page editing mode, update page background
                            else if (isEditingPage) {
                              // Update page background with this image
                              updatePageSettings({
                                background: {
                                  ...pageSettings.background,
                                  type: 'image',
                                  imageUrl: asset.value,
                                  overlay: pageSettings.background.overlay || 'rgba(0,0,0,0.4)',
                                  overlayOpacity: pageSettings.background.overlayOpacity || 0.4
                                }
                              });
                              
                              toast({
                                title: "Image applied",
                                description: `Applied "${asset.name}" to the page background.`,
                                duration: 2000
                              });
                            }
                            else {
                              toast({
                                title: "No target selected",
                                description: "Please select a component first or activate page settings.",
                                variant: "destructive",
                                duration: 3000
                              });
                            }
                          }}
                          title={`Apply "${asset.name}" to selected component`}
                        >
                          <img 
                            src={asset.value}
                            alt={asset.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-between py-1 flex-grow">
                          <div className="text-sm font-medium truncate max-w-[180px]">{asset.name}</div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500 truncate max-w-[150px]">{asset.value}</div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeBrandAsset(asset.id)}
                            >
                              <Trash className="h-3.5 w-3.5 text-gray-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 text-gray-500">
                  <Image className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No images saved yet</p>
                  <p className="text-xs">Click the Add Asset button to get started</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}