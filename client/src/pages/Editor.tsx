import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useEditor } from "../context/EditorContext";
import { useQuery } from "@tanstack/react-query";
import { Template } from "@shared/schema";
import ComponentLibrary from "../components/editor/ComponentLibrary";
import Canvas from "../components/editor/Canvas";
import PropertiesPanel from "../components/editor/PropertiesPanel";
import TutorialOverlay from "../components/editor/TutorialOverlay";
import InteractiveTour from "../components/editor/InteractiveTour";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Save, 
  Eye, 
  Rocket, 
  Undo2, 
  Redo2, 
  Settings, 
  HelpCircle,
  ArrowLeft,
  Laptop,
  GanttChart,
  PlusCircle,
  Smartphone,
  Tablet,
  Monitor
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Editor() {
  const params = useParams();
  const projectId = params?.id ? parseInt(params.id) : undefined;
  const [location, setLocation] = useLocation();
  
  const { data: templates, isLoading: templatesLoading } = useQuery<Template[]>({
    queryKey: ['/api/templates'],
  });
  
  const { 
    components, 
    setComponents,
    tutorialActive, 
    setTutorialActive, 
    resetEditor, 
    loadProject,
    saveProject,
    undo,
    redo,
    canUndo,
    canRedo,
    viewportMode,
    setViewportMode
  } = useEditor();
  
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const { toast } = useToast();

  // Check if this is a new user (no projects yet) to show tutorial
  // Parse URL parameters to check for template ID
  const searchParams = new URLSearchParams(window.location.search);
  const templateId = searchParams.get('template');
  
  // Function to handle template loading with content preservation
  const loadTemplateWithContentPreservation = async (templateId: string) => {
    try {
      // Fetch template from API
      const response = await fetch(`/api/templates/${templateId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch template (${response.status})`);
      }
      
      const template = await response.json();
      
      // Check if there are existing components to preserve content from
      if (template?.components) {
        if (components.length > 0) {
          // Create a mapping of existing components by type for content preservation
          const existingContentMap = new Map();
          components.forEach(component => {
            existingContentMap.set(component.type, component.content);
          });
          
          // Create new components array with preserved content where possible
          const newComponents = template.components.map(templateComponent => {
            const existingContent = existingContentMap.get(templateComponent.type);
            
            // If we have existing content for this component type, preserve it
            if (existingContent) {
              return {
                ...templateComponent,
                content: {
                  ...templateComponent.content, // Get template structure
                  ...existingContent // Override with user content
                }
              };
            }
            return templateComponent;
          });
          
          setComponents(newComponents);
          toast({
            title: "Template applied",
            description: `Template "${template.name}" applied with your content preserved.`,
          });
        } else {
          // If no existing components, just load the template normally
          setComponents(template.components);
          toast({
            title: "Template loaded",
            description: `Template "${template.name}" loaded successfully. Customize it to fit your needs.`,
          });
        }
        
        setProjectName(template.name ? `My ${template.name}` : "My Landing Page");
        setProjectDescription(template.description || "");
      } else {
        throw new Error("Invalid template data");
      }
    } catch (error) {
      console.error("Failed to load template:", error);
      toast({
        title: "Error loading template",
        description: "Could not load the selected template. Please try another one.",
        variant: "destructive",
      });
      if (components.length === 0) {
        resetEditor();
      }
    }
  };
  
  useEffect(() => {
    // Disable tutorial for better UX
    setTutorialActive(false);
    
    // Load project or template if ID is provided, or reset the editor
    const handleInitialLoad = async () => {
      if (projectId) {
        try {
          await loadProject(projectId);
          toast({
            title: "Project loaded",
            description: "Your project has been loaded successfully.",
          });
        } catch (error) {
          toast({
            title: "Error loading project",
            description: "Could not load the project. It may have been deleted or you don't have access.",
            variant: "destructive",
          });
          setLocation("/editor");
        }
      } else if (templateId) {
        if (components.length === 0) {
          // For initial load with empty canvas
          resetEditor();
        }
        await loadTemplateWithContentPreservation(templateId);
      } else {
        resetEditor();
      }
    };
    
    handleInitialLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, templateId]);

  const handleSave = async () => {
    if (!projectName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a name for your project.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const id = await saveProject(projectName, projectDescription);
      setIsSaveDialogOpen(false);
      setLocation(`/editor/${id}`);
    } catch (error) {
      console.error("Failed to save project:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    // Temporary solution for demo - in a real app, we'd save first
    // then redirect to the preview page
    if (components.length === 0) {
      toast({
        title: "Nothing to preview",
        description: "Add some components to your page first.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Save your project first",
      description: "You need to save your project before previewing it.",
    });
    setIsSaveDialogOpen(true);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <i className="ri-layout-4-line text-primary text-2xl"></i>
            <h1 id="welcomeHeader" className="font-semibold text-xl">LaunchPlate</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-sm">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={undo}
              disabled={!canUndo()}
              className="gap-1"
            >
              <Undo2 className="h-4 w-4" /> Undo
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={redo}
              disabled={!canRedo()}
              className="gap-1"
            >
              <Redo2 className="h-4 w-4" /> Redo
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePreview}
              className="gap-1"
            >
              <Eye className="h-4 w-4" /> Preview
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => setIsSaveDialogOpen(true)}
              className="gap-1"
            >
              <Save className="h-4 w-4" /> Save
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="bg-green-600 hover:bg-green-700 gap-1"
              onClick={() => setIsSaveDialogOpen(true)}
            >
              <Rocket className="h-4 w-4" /> Publish
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Responsive Preview Toggle */}
            <div id="devicePreviewSelector" className="bg-gray-100 rounded-md p-0.5 flex items-center mr-4">
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
            
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <div id="componentLibrary" className="flex-shrink-0">
          <ComponentLibrary />
        </div>
        <div id="mainCanvas" className="flex-1">
          <Canvas />
        </div>
        <div id="propertiesPanel" className="flex-shrink-0">
          <PropertiesPanel />
        </div>
      </div>
      
      {/* Tutorial Components */}
      {tutorialActive && <TutorialOverlay />}
      <InteractiveTour />
      
      {/* Template Selection Modal */}
      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <DialogContent className="sm:max-w-[900px] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl">Choose a Template</DialogTitle>
            <DialogDescription>
              Select one of our professionally designed templates to quickly create your landing page.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
            {templatesLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
              ))
            ) : templates && templates.length > 0 ? (
              templates.map((template) => {
                // Generate a preview style based on the template name
                let previewStyle: React.CSSProperties = { 
                  position: 'relative', 
                  background: '#f9fafb'
                };
                let iconColor = "text-gray-400";
                let tagColor = "bg-gray-100 text-gray-600";
                let tagText = "General";
                let previewIcon = <Laptop className={`h-8 w-8 ${iconColor}`} />;
                
                // Customize preview based on template type
                if (template.name.includes("Business")) {
                  previewStyle = { 
                    background: 'linear-gradient(to bottom, #1e3a8a, #3b82f6)',
                    position: 'relative'
                  };
                  iconColor = "text-white";
                  tagColor = "bg-blue-700 text-white";
                  tagText = "Business";
                  previewIcon = <GanttChart className={`h-8 w-8 ${iconColor}`} />;
                } else if (template.name.includes("Startup")) {
                  previewStyle = { 
                    background: 'linear-gradient(to right, #7c3aed, #ec4899)',
                    position: 'relative'
                  };
                  iconColor = "text-white";
                  tagColor = "bg-purple-700 text-white";
                  tagText = "Startup";
                  previewIcon = <Rocket className={`h-8 w-8 ${iconColor}`} />;
                } else if (template.name.includes("Portfolio")) {
                  previewStyle = { 
                    background: '#f3f4f6',
                    position: 'relative',
                    fontFamily: 'Georgia, serif'
                  };
                  iconColor = "text-gray-700";
                  tagColor = "bg-gray-700 text-white";
                  tagText = "Portfolio";
                  previewIcon = <Laptop className={`h-8 w-8 ${iconColor}`} />;
                }
                
                return (
                  <div 
                    key={template.id} 
                    className="flex flex-col rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => window.location.href = `/editor?template=${template.id}`}
                  >
                    <div 
                      className="h-40 flex items-center justify-center" 
                      style={previewStyle}
                    >
                      <span className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded ${tagColor}`}>
                        {tagText}
                      </span>
                      
                      <div className="flex flex-col items-center">
                        <div className="h-10 mb-2 flex items-center justify-center">
                          {previewIcon}
                        </div>
                        <div className={`text-center ${template.name.includes("Business") || template.name.includes("Startup") ? "text-white" : "text-gray-700"}`}>
                          <p className="font-bold text-base">{template.name}</p>
                        </div>
                      </div>
                      
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                          Use Template
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {template.description || 'A customizable template for your landing page.'}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 text-center p-8">
                <p className="text-gray-600 mb-4">No templates available. Create one from scratch!</p>
                <Button onClick={() => setIsTemplateModalOpen(false)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create from Scratch
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Save Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Your Landing Page</DialogTitle>
            <DialogDescription>
              Give your landing page a name and description to save it.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Project Name
              </label>
              <Input
                id="name"
                placeholder="My Awesome Landing Page"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (optional)
              </label>
              <Textarea
                id="description"
                placeholder="Describe your landing page..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
