import { useState, useRef, useEffect } from "react";
import { useEditor } from "../../context/EditorContext";
import ComponentRenderer from "./ComponentRenderer";
import { Component, ComponentType } from "@shared/schema";
import { Smartphone, Tablet, Monitor, LayoutGrid, ZoomIn, ZoomOut, ArrowUp, ArrowDown, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Canvas() {
  const {
    components,
    selectedComponent,
    setSelectedComponent,
    isDragging,
    addComponent,
    moveComponent,
    removeComponent,
    viewportMode,
    setViewportMode
  } = useEditor();
  
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGridLines, setShowGridLines] = useState(false);
  const [dropPosition, setDropPosition] = useState<{ index: number, position: 'top' | 'bottom' } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Reset drop position on component selection change
  useEffect(() => {
    setDropPosition(null);
  }, [selectedComponent]);
  
  // Zoom controls
  const increaseZoom = () => {
    setZoomLevel(Math.min(150, zoomLevel + 10));
  };
  
  const decreaseZoom = () => {
    setZoomLevel(Math.max(50, zoomLevel - 10));
  };

  // Handle dragging components from library
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // Check if dragging a new component or reordering
    if (e.dataTransfer.types.includes('componentType')) {
      e.currentTarget.classList.add('dropzone-active-copy');
    } else {
      e.currentTarget.classList.add('dropzone-active-move');
    }
    
    e.dataTransfer.dropEffect = 'copy';
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('dropzone-active-copy');
    e.currentTarget.classList.remove('dropzone-active-move');
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dropzone-active-copy');
    e.currentTarget.classList.remove('dropzone-active-move');
    
    // Check if this is a new component or reordering
    const componentType = e.dataTransfer.getData('componentType');
    if (componentType) {
      addComponent(componentType as ComponentType);
    }
  };
  
  // Handle reordering components via drag and drop
  const handleComponentDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('componentIndex', String(index));
    
    // Create custom drag image
    const dragPreview = document.createElement('div');
    dragPreview.className = 'bg-primary p-2 shadow-lg rounded text-white text-xs';
    dragPreview.textContent = `Moving ${components[index].type} component`;
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 20, 20);
    
    setTimeout(() => {
      document.body.removeChild(dragPreview);
    }, 0);
  };
  
  const handleComponentDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY;
    const threshold = 10; // pixels from top/bottom to trigger position indicators
    
    if (mouseY < rect.top + threshold) {
      // Top area
      setDropPosition({ index, position: 'top' });
    } else if (mouseY > rect.bottom - threshold) {
      // Bottom area
      setDropPosition({ index, position: 'bottom' });
    } else {
      // Middle area - highlight the component itself
      setDropPosition(null);
    }
  };
  
  const handleComponentDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const fromIndex = Number(e.dataTransfer.getData('componentIndex'));
    let toIndex = index;
    
    // Determine exact position based on dropPosition
    if (dropPosition) {
      if (dropPosition.position === 'top') {
        toIndex = index;
      } else {
        toIndex = index + 1;
      }
    }
    
    // Adjust for component moving down
    if (fromIndex < toIndex) {
      toIndex--;
    }
    
    if (fromIndex !== toIndex) {
      moveComponent(fromIndex, toIndex);
    }
    
    setDropPosition(null);
  };
  
  // Show tutorial for empty canvas
  const isEmpty = components.length === 0;

  return (
    <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
      {/* Canvas Controls */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xs font-medium text-gray-700">Canvas Controls</span>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Responsive Preview Toggle */}
          <div className="bg-gray-100 rounded-md p-0.5 flex items-center">
            <Button 
              variant={viewportMode === 'desktop' ? 'default' : 'ghost'} 
              size="sm"
              className={`px-2 ${viewportMode === 'desktop' ? '' : 'hover:bg-gray-200'}`}
              onClick={() => setViewportMode('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewportMode === 'tablet' ? 'default' : 'ghost'} 
              size="sm"
              className={`px-2 ${viewportMode === 'tablet' ? '' : 'hover:bg-gray-200'}`}
              onClick={() => setViewportMode('tablet')}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewportMode === 'mobile' ? 'default' : 'ghost'} 
              size="sm"
              className={`px-2 ${viewportMode === 'mobile' ? '' : 'hover:bg-gray-200'}`}
              onClick={() => setViewportMode('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          
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
          <div className="relative">
            {viewportMode !== 'desktop' && (
              <div className="absolute -top-8 left-0 right-0 text-center">
                <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                  {viewportMode === 'tablet' ? 'Tablet View (768px)' : 'Mobile View (375px)'}
                </span>
              </div>
            )}
            <div 
              data-viewport={viewportMode}
              className={`bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-300 ${
                viewportMode === 'tablet' ? 'max-w-xl mx-auto' : 
                viewportMode === 'mobile' ? 'max-w-sm mx-auto' : 
                'w-full'
              }`}
            >
              {/* Page Canvas */}
              <div 
                className={`min-h-[80vh] border-4 ${
                  isDragging 
                    ? "border-primary border-dashed" 
                    : "border-transparent"
                } dropzone ${showGridLines ? 'bg-grid-pattern' : ''}`}
                id="mainDropzone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {isEmpty ? (
                  // Improved Empty State with better instructions and less text
                  <div className="flex flex-col items-center justify-center h-full" id="emptyState">
                    <div className="text-center p-10">
                      <div className="flex justify-center">
                        <i className="ri-drag-drop-line text-6xl text-gray-300 mb-4"></i>
                      </div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Drop Components Here</h3>
                      <p className="text-gray-500 max-w-md mb-6">Drag elements from the sidebar and drop them in this area.</p>
                    </div>
                  </div>
                ) : (
                  // Components on the canvas
                  <div className="flex flex-col">
                    {components.map((component, index) => (
                      <div 
                        key={component.id} 
                        className="relative group component-wrapper"
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
                              <div className="flex flex-col gap-2 bg-white shadow-lg rounded-md p-2 border border-gray-200">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center justify-center h-8 w-8 p-0 hover:bg-gray-100 hover:text-primary transition-colors"
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
                                  className="flex items-center justify-center h-8 w-8 p-0 hover:bg-gray-100 hover:text-primary transition-colors"
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
                                  className="flex items-center justify-center h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                  onClick={() => {
                                    if (confirm("Are you sure you want to remove this component?")) {
                                      removeComponent(component.id);
                                      setSelectedComponent(null);
                                    }
                                  }}
                                  title="Delete component"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {/* Additional visible controls for all components */}
                          <div className={`absolute -right-10 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-40`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center justify-center h-6 w-6 p-0 bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200"
                              onClick={() => setSelectedComponent(component)}
                              title="Edit component"
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                          </div>
                          <ComponentRenderer 
                            component={component}
                            isSelected={selectedComponent?.id === component.id}
                            onClick={() => setSelectedComponent(component)}
                            inEditor={true}
                            viewportMode={viewportMode}
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
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        /* Improved dropzone feedback */
        .dropzone-active-copy {
          border: 4px dashed #3b82f6 !important;
          background-color: rgba(59, 130, 246, 0.05) !important;
          animation: pulse-copy 1.5s infinite;
        }
        
        .dropzone-active-move {
          border: 4px dashed #10b981 !important;
          background-color: rgba(16, 185, 129, 0.05) !important;
          animation: pulse-move 1.5s infinite;
        }
        
        @keyframes pulse-copy {
          0% {
            border-color: #3b82f6;
          }
          50% {
            border-color: #93c5fd;
          }
          100% {
            border-color: #3b82f6;
          }
        }
        
        @keyframes pulse-move {
          0% {
            border-color: #10b981;
          }
          50% {
            border-color: #6ee7b7;
          }
          100% {
            border-color: #10b981;
          }
        }
        `
      }} />
    </div>
  );
}