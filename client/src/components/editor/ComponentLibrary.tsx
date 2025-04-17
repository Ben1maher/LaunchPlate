import { useState } from "react";
import { useEditor } from "../../context/EditorContext";
import { componentCategories, ComponentData } from "./componentData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout, LayoutTemplate, FileText, Laptop } from "lucide-react";

export default function ComponentLibrary() {
  const { addComponent, isDragging, setIsDragging } = useEditor();
  const [activeTab, setActiveTab] = useState("elements");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, componentType: string) => {
    console.log("Drag started with component type:", componentType);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/plain", componentType);
    e.dataTransfer.setData("componentType", componentType);
    e.currentTarget.classList.add("opacity-50");
    setIsDragging(true);
    
    // Create a custom drag image
    const dragPreview = document.createElement("div");
    dragPreview.className = "bg-white p-2 shadow-lg rounded border border-primary text-sm";
    dragPreview.textContent = `Add ${componentType} component`;
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 0, 0);
    
    setTimeout(() => {
      document.body.removeChild(dragPreview);
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("Drag ended");
    e.currentTarget.classList.remove("opacity-50");
    setIsDragging(false);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-sm uppercase text-gray-600">Components</h2>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs flex items-center gap-1"
            onClick={() => setIsTemplateModalOpen(true)}
          >
            <LayoutTemplate className="h-3.5 w-3.5" />
            Templates
          </Button>
        </div>
        <Tabs
          defaultValue="elements"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-2"
        >
          <TabsList className="grid grid-cols-3 h-auto p-0 bg-gray-100">
            <TabsTrigger
              value="elements"
              className="py-1.5 text-xs font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none"
            >
              Elements
            </TabsTrigger>
            <TabsTrigger
              value="sections"
              className="py-1.5 text-xs font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none"
            >
              Sections
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="py-1.5 text-xs font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none"
            >
              Templates
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="overflow-y-auto flex-1">
        {activeTab === "elements" && (
          <>
            {componentCategories.map((category, index) => (
              <div 
                key={category.name} 
                className={`p-3 ${category.name === "Hero Sections" ? "tutorial-highlight" : ""}`}
                id={category.name === "Hero Sections" ? "componentCategory" : undefined}
              >
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <h3 className="font-medium">{category.name}</h3>
                  <i className="ri-arrow-down-s-line"></i>
                </div>

                <div className={`grid ${category.name === "Basic Elements" ? "grid-cols-3" : "grid-cols-2"} gap-2`}>
                  {category.items.map((component) => (
                    <ComponentItem 
                      key={component.type} 
                      component={component} 
                      onDragStart={handleDragStart} 
                      onDragEnd={handleDragEnd}
                      onAddComponent={() => addComponent(component.type)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === "sections" && (
          <div className="p-4 flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p>Section templates will be available soon!</p>
              <Button variant="outline" size="sm" className="mt-2">
                Request Section
              </Button>
            </div>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="p-4 flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p>Full page templates will be available soon!</p>
              <Button variant="outline" size="sm" className="mt-2">
                Request Template
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ComponentItemProps {
  component: ComponentData;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, componentType: string) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onAddComponent: () => void;
}

function ComponentItem({ component, onDragStart, onDragEnd, onAddComponent }: ComponentItemProps) {
  // Standard Basic Element (Icon + Label)
  if (["heading", "text-block", "button", "image", "spacer", "divider"].includes(component.type)) {
    return (
      <div
        className="component-draggable bg-gray-100 hover:bg-gray-200 rounded p-2 cursor-grab transition"
        draggable
        onDragStart={(e) => onDragStart(e, component.type)}
        onDragEnd={onDragEnd}
        onClick={onAddComponent}
        data-component-type={component.type}
      >
        <div className="h-8 flex items-center justify-center">
          <i className={`${component.icon} text-gray-500`}></i>
        </div>
        <p className="text-xs text-gray-600 font-medium text-center">{component.label}</p>
      </div>
    );
  }

  // Header Components
  if (component.type.startsWith("header")) {
    return (
      <div
        className="component-draggable bg-gray-100 hover:bg-gray-200 rounded p-2 cursor-grab transition"
        draggable
        onDragStart={(e) => onDragStart(e, component.type)}
        onDragEnd={onDragEnd}
        onClick={onAddComponent}
        data-component-type={component.type}
      >
        <div className="text-center h-10 flex items-center justify-center">
          <p className="text-xs text-gray-600 font-medium">{component.label}</p>
        </div>
      </div>
    );
  }

  // Hero Components
  if (component.type.startsWith("hero")) {
    return (
      <div
        className="component-draggable bg-gray-100 hover:bg-gray-200 rounded p-2 cursor-grab transition"
        draggable
        onDragStart={(e) => onDragStart(e, component.type)}
        onDragEnd={onDragEnd}
        onClick={onAddComponent}
        data-component-type={component.type}
      >
        {component.type === "hero-split" ? (
          <div className="h-16 bg-gray-200 rounded-t flex items-center justify-center">
            <div className="w-1/2 h-full bg-gray-300 flex items-center justify-center">
              <i className="ri-image-line text-gray-500"></i>
            </div>
            <div className="w-1/2 h-full flex items-center justify-center">
              <i className="ri-text-spacing text-gray-500"></i>
            </div>
          </div>
        ) : (
          <div className="h-16 bg-gray-200 rounded-t flex flex-col items-center justify-center">
            <i className="ri-text-spacing text-gray-500"></i>
            <div className="w-1/2 h-6 bg-gray-300 mt-1 rounded flex items-center justify-center">
              <i className="ri-button-line text-gray-500 text-xs"></i>
            </div>
          </div>
        )}
        <p className="text-xs text-gray-600 font-medium text-center mt-1">{component.label}</p>
      </div>
    );
  }

  // Form Components
  if (component.type === "form" || component.type === "email-signup") {
    return (
      <div
        className="component-draggable bg-gray-100 hover:bg-gray-200 rounded p-2 cursor-grab transition"
        draggable
        onDragStart={(e) => onDragStart(e, component.type)}
        onDragEnd={onDragEnd}
        onClick={onAddComponent}
        data-component-type={component.type}
      >
        <div className="h-12 flex flex-col items-center justify-center">
          <i className={`${component.icon} text-gray-500`}></i>
        </div>
        <p className="text-xs text-gray-600 font-medium text-center">{component.label}</p>
      </div>
    );
  }

  // Fallback for any other component types
  return (
    <div
      className="component-draggable bg-gray-100 hover:bg-gray-200 rounded p-2 cursor-grab transition"
      draggable
      onDragStart={(e) => onDragStart(e, component.type)}
      onDragEnd={onDragEnd}
      onClick={onAddComponent}
      data-component-type={component.type}
    >
      <div className="text-center h-10 flex items-center justify-center">
        <p className="text-xs text-gray-600 font-medium">{component.label}</p>
      </div>
    </div>
  );
}
