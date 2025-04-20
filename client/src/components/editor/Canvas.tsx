import { useState, useRef } from "react";
import { useEditor } from "../../context/EditorContext";
import ComponentRenderer from "./ComponentRenderer";
import { Component, ComponentType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  ZoomIn, 
  ZoomOut, 
  LayoutGrid, 
  Play,
  ArrowUp,
  ArrowDown,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Canvas() {
  const { 
    components, 
    setComponents, 
    addComponent, 
    selectedComponent, 
    setSelectedComponent, 
    isDragging, 
    moveComponent,
    removeComponent
  } = useEditor();
  
  const [activeDropzone, setActiveDropzone] = useState<string | null>(null);
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGridLines, setShowGridLines] = useState(false);
  const [dropPosition, setDropPosition] = useState<{ index: number, position: 'top' | 'bottom' } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Handle canvas drop events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setActiveDropzone("mainDropzone");
    
    // Add a highlight class to show where the component can be dropped
    e.currentTarget.classList.add("dropzone-active");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActiveDropzone(null);
    e.currentTarget.classList.remove("dropzone-active");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("Drop event triggered on main canvas");
    
    // Remove active states
    setActiveDropzone(null);
    e.currentTarget.classList.remove("dropzone-active");
    
    // Check if this is a reordering operation (existing component being moved)
    const isReorderOperation = e.dataTransfer.types.includes("application/x-component-index");
    
    // If not a reordering operation, it's a new component from the library
    if (!isReorderOperation) {
      // Get drag data - try both methods for compatibility
      const componentType = e.dataTransfer.getData("componentType") || e.dataTransfer.getData("text/plain");
      console.log("Dropped component type on main canvas:", componentType);
      
      if (componentType && componentType.trim() !== '') {
        // Add the component at the end (default behavior for canvas drop)
        addComponent(componentType as ComponentType);
        
        // Show toast for user feedback
        toast({
          title: "Component Added",
          description: `Added ${componentType} component to your page.`,
        });
        
        // Scroll to the bottom of the canvas to show the new component
        if (canvasRef.current) {
          setTimeout(() => {
            canvasRef.current?.scrollTo({
              top: canvasRef.current.scrollHeight,
              behavior: 'smooth'
            });
          }, 100);
        }
      } else {
        console.warn("Empty or invalid component type dropped on canvas:", componentType);
      }
    }
  };

  // Adjust zoom level
  const increaseZoom = () => {
    if (zoomLevel < 150) {
      setZoomLevel(zoomLevel + 10);
    }
  };

  const decreaseZoom = () => {
    if (zoomLevel > 50) {
      setZoomLevel(zoomLevel - 10);
    }
  };

  // Handle component reordering with drag and drop
  const handleComponentDragStart = (e: React.DragEvent, index: number) => {
    console.log("Starting drag for component at index:", index);
    
    try {
      // Set the drag data (this is critical)
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("application/x-component-index", index.toString());
      
      // Set opacity for the dragged element for visual feedback
      e.currentTarget.classList.add("opacity-50");
    } catch (error) {
      console.error("Error in drag start:", error);
    }
  };

  // Improved component drag over handling with position detection
  const handleComponentDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
    // Get the component's bounding rectangle
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Calculate how far into the component the cursor is (as a percentage)
    const relativeY = e.clientY - rect.top;
    const percentY = (relativeY / rect.height) * 100;
    
    // Use a 20% threshold at the top for more intuitive positioning
    // This makes it easier to drop components at the top
    const position = percentY < 20 ? 'top' : 'bottom';
    
    console.log(`Drag over component ${index}, position: ${position}, percentY: ${percentY.toFixed(1)}%`);
    
    // Set visual indicator for drop position
    setDropPosition({ index, position });
  };

  // Handle drop on a component
  const handleComponentDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    console.log("Component drop event at index:", dropIndex);
    
    // Reset drop position indicator
    setDropPosition(null);
    
    // Log all available data types in the transfer
    console.log("Available data types:", e.dataTransfer.types);
    
    // Log all the data transfer types for debugging
    console.log("Full data types:", e.dataTransfer.types.join(', '));
    
    // Check if this is a reordering operation (existing component being moved)
    const isReorderOperation = e.dataTransfer.types.includes("application/x-component-index");
    
    // If not a reordering operation, it's a new component from the library
    if (!isReorderOperation) {
      // This is a new component from the library
      const componentType = e.dataTransfer.getData("componentType") || e.dataTransfer.getData("text/plain");
      console.log("Dropped new component type:", componentType);
      
      if (componentType && componentType.trim() !== '') {
        // Determine position with 20% threshold for top section
        const rect = e.currentTarget.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;
        const percentY = (relativeY / rect.height) * 100;
        const position = percentY < 20 ? 'top' : 'bottom';
        console.log("Drop position:", position, "percent Y:", percentY.toFixed(1) + "%");
        
        // Adjust insert index based on position
        const insertIndex = position === 'top' ? dropIndex : dropIndex + 1;
        console.log("Inserting at index:", insertIndex);
        
        try {
          // Add component at specific position
          addComponent(componentType as ComponentType, insertIndex);
          
          toast({
            title: "Component Added",
            description: `Added ${componentType} component at position ${insertIndex}.`,
          });
        } catch (error) {
          console.error("Error adding component:", error);
          toast({
            title: "Error",
            description: "Failed to add component at the specified position.",
            variant: "destructive"
          });
        }
      } else {
        console.warn("Empty or invalid component type:", componentType);
      }
    } else {
      // This is reordering existing components
      try {
        const dragIndexStr = e.dataTransfer.getData("application/x-component-index");
        const dragIndex = parseInt(dragIndexStr);
        console.log("Reordering from index:", dragIndex, "to around index:", dropIndex);
        
        if (!isNaN(dragIndex) && dragIndex !== dropIndex) {
          // Determine position with 20% threshold for top section
          const rect = e.currentTarget.getBoundingClientRect();
          const relativeY = e.clientY - rect.top;
          const percentY = (relativeY / rect.height) * 100;
          const position = percentY < 20 ? 'top' : 'bottom';
          console.log("Drop position for reordering:", position, "percent Y:", percentY.toFixed(1) + "%");
          
          // Calculate the target index based on position and drag direction
          let targetIndex;
          if (dragIndex < dropIndex) {
            // Dragging downward
            targetIndex = position === 'top' ? dropIndex : dropIndex + 1;
          } else {
            // Dragging upward
            targetIndex = position === 'top' ? dropIndex : dropIndex + 1;
            
            // When dragging upward and dropping at the bottom of a component, 
            // we need to adjust the target index
            if (position === 'bottom' && targetIndex > dragIndex) {
              targetIndex -= 1;
            }
          }
          
          console.log("Moving component from", dragIndex, "to", targetIndex);
          moveComponent(dragIndex, targetIndex);
        }
      } catch (error) {
        console.error("Error handling component reordering:", error);
      }
    }
  };

  // Show tutorial for empty canvas
  const isEmpty = components.length === 0;

  return (
    <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
      {/* Canvas Controls */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Viewport:</span>
          <div className="flex items-center bg-gray-100 rounded p-1">
            <Button
              variant={viewportSize === 'desktop' ? 'default' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewportSize('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={viewportSize === 'tablet' ? 'default' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewportSize('tablet')}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={viewportSize === 'mobile' ? 'default' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewportSize('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={decreaseZoom}
              disabled={zoomLevel <= 50}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium">{zoomLevel}%</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={increaseZoom}
              disabled={zoomLevel >= 150}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="h-5 border-r border-gray-300"></div>
          
          <Button
            variant={showGridLines ? 'default' : 'outline'}
            size="sm"
            className="text-xs h-7 gap-1"
            onClick={() => setShowGridLines(!showGridLines)}
          >
            <LayoutGrid className="h-3 w-3" />
            Grid Lines
          </Button>
        </div>
      </div>
      
      {/* Canvas Workspace */}
      <div 
        className="flex-1 overflow-y-auto p-8 flex justify-center" 
        id="canvasDropzone"
        ref={canvasRef}
      >
        {/* Canvas container with zoom effect */}
        <div 
          className={`w-full max-w-5xl transition-all duration-200`}
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center'
          }}
        >
          {/* Actual canvas with responsive preview */}
          <div 
            data-viewport={viewportSize}
            className={`bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-300 ${
              viewportSize === 'tablet' ? 'max-w-xl mx-auto' : 
              viewportSize === 'mobile' ? 'max-w-sm mx-auto' : 
              'w-full'
            }`}
          >
            {/* Page Canvas */}
            <div 
              className={`min-h-[80vh] border-4 ${
                isDragging 
                  ? "border-primary border-dashed" 
                  : "border-transparent"
              } dropzone ${showGridLines ? 'bg-grid-pattern' : ''} ${
                activeDropzone === "mainDropzone" ? "dropzone-active" : ""
              }`}
              id="mainDropzone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isEmpty ? (
                // Empty State
                <div className="flex flex-col items-center justify-center h-full" id="emptyState">
                  <div className="text-center p-10">
                    <div className="flex justify-center">
                      <i className="ri-drag-drop-line text-6xl text-gray-300 mb-4"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Start Building Your Landing Page</h3>
                    <p className="text-gray-500 max-w-md mb-6">Drag and drop components from the library on the left to begin creating your page.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <Button 
                        variant="outline" 
                        className="gap-2" 
                        onClick={async () => {
                          try {
                            // Fetch the default template from the API
                            const response = await fetch('/api/templates/1');
                            if (!response.ok) throw new Error('Failed to fetch template');
                            
                            const template = await response.json();
                            
                            // Apply template components to the canvas
                            if (template && template.components) {
                              setComponents(template.components);
                              toast({
                                title: "Template applied",
                                description: "Template has been loaded successfully!",
                              });
                            }
                          } catch (error) {
                            console.error("Error loading template:", error);
                            toast({
                              title: "Error loading template",
                              description: "Failed to load the template. Please try again.",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        <i className="ri-file-copy-line"></i>
                        Start with Template
                      </Button>
                      <Button 
                        variant="default" 
                        className="gap-2"
                        onClick={() => toast({
                          title: "Tutorial",
                          description: "Follow the interactive guide to build your landing page step by step."
                        })}
                      >
                        <Play className="h-4 w-4" />
                        Watch Tutorial
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                // Components on the canvas
                <div className="flex flex-col">
                  {components.map((component, index) => (
                    <div 
                      key={component.id} 
                      className="relative"
                      style={{ backgroundColor: 'transparent' }}
                      draggable
                      onDragStart={(e) => handleComponentDragStart(e, index)}
                      onDragOver={(e) => handleComponentDragOver(e, index)}
                      onDrop={(e) => handleComponentDrop(e, index)}
                      onDragEnd={() => setDropPosition(null)}
                    >
                      {/* Top drop indicator */}
                      {dropPosition?.index === index && dropPosition?.position === 'top' && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-primary z-10 -translate-y-[2px]" 
                          style={{ pointerEvents: 'none' }}>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary" />
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-primary" />
                        </div>
                      )}
                      
                      <div className="relative" style={{ backgroundColor: 'transparent' }}>
                        {/* Component Controls */}
                        {selectedComponent?.id === component.id && (
                          <div className="absolute left-0 -translate-x-full top-0 h-full flex items-center pr-2 z-50">
                            <div className="flex flex-col gap-1 bg-white shadow-md rounded-md p-1 border border-gray-200">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center justify-center h-8 w-8 p-0"
                                onClick={() => index > 0 && moveComponent(index, index - 1)}
                                disabled={index === 0}
                                title="Move component up"
                              >
                                <ArrowUp className="h-4 w-4" />
                                <span className="sr-only">Move Up</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center justify-center h-8 w-8 p-0"
                                onClick={() => index < components.length - 1 && moveComponent(index, index + 1)}
                                disabled={index === components.length - 1}
                                title="Move component down"
                              >
                                <ArrowDown className="h-4 w-4" />
                                <span className="sr-only">Move Down</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center justify-center h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => removeComponent(component.id)}
                                title="Delete component"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </div>
                        )}
                        <ComponentRenderer 
                          component={component}
                          isSelected={selectedComponent?.id === component.id}
                          onClick={() => setSelectedComponent(component)}
                          inEditor={true}
                          viewportMode={viewportSize}
                        />
                      </div>
                      
                      {/* Bottom drop indicator */}
                      {dropPosition?.index === index && dropPosition?.position === 'bottom' && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary z-10 translate-y-[2px]" 
                          style={{ pointerEvents: 'none' }}>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary" />
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-primary" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        /* Override any potential gray background on component selection */
        .component-wrapper {
          background-color: transparent !important;
        }
        .component-wrapper:hover, 
        .component-wrapper.selected, 
        .component-wrapper.active {
          background-color: transparent !important;
        }
        `
      }} />
    </div>
  );
}