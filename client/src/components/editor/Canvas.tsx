import { useState, useRef, useEffect } from "react";
import { useEditor } from "../../context/EditorContext";
import ComponentRenderer from "./ComponentRenderer";
import { Component } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Monitor, Tablet, Smartphone, ZoomIn, ZoomOut, LayoutGrid, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Canvas() {
  const { 
    components, 
    setComponents, 
    addComponent, 
    selectedComponent, 
    setSelectedComponent, 
    isDragging, 
    moveComponent 
  } = useEditor();
  
  const [activeDropzone, setActiveDropzone] = useState<string | null>(null);
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGridLines, setShowGridLines] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Handle drop events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setActiveDropzone("mainDropzone");
  };

  const handleDragLeave = () => {
    setActiveDropzone(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActiveDropzone(null);
    
    const componentType = e.dataTransfer.getData("componentType");
    if (componentType) {
      addComponent(componentType as any);
      
      // Scroll to the bottom of the canvas to show the new component
      if (canvasRef.current) {
        setTimeout(() => {
          canvasRef.current?.scrollTo({
            top: canvasRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }, 100);
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
    e.dataTransfer.setData("componentIndex", index.toString());
    e.currentTarget.classList.add("opacity-50");
  };

  const handleComponentDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleComponentDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("componentIndex"));
    
    if (dragIndex !== dropIndex) {
      moveComponent(dragIndex, dropIndex);
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
            className={`bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-300 ${
              viewportSize === 'tablet' ? 'max-w-xl mx-auto' : 
              viewportSize === 'mobile' ? 'max-w-sm mx-auto' : 
              'w-full'
            }`}
          >
            {/* Page Canvas */}
            <div 
              className={`min-h-[80vh] border-4 ${
                activeDropzone === "mainDropzone" 
                  ? "border-primary dropzone-active" 
                  : "border-transparent"
              } dropzone ${showGridLines ? 'bg-grid-pattern' : ''}`}
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
                      <Button variant="outline" className="gap-2">
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
                      draggable
                      onDragStart={(e) => handleComponentDragStart(e, index)}
                      onDragOver={(e) => handleComponentDragOver(e, index)}
                      onDrop={(e) => handleComponentDrop(e, index)}
                    >
                      <ComponentRenderer 
                        component={component}
                        isSelected={selectedComponent?.id === component.id}
                        onClick={() => setSelectedComponent(component)}
                        inEditor={true}
                      />
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
        `
      }} />
    </div>
  );
}
