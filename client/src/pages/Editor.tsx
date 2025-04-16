import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useEditor } from "../context/EditorContext";
import ComponentLibrary from "../components/editor/ComponentLibrary";
import Canvas from "../components/editor/Canvas";
import PropertiesPanel from "../components/editor/PropertiesPanel";
import TutorialOverlay from "../components/editor/TutorialOverlay";
import InteractiveTour from "../components/editor/InteractiveTour";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Save, 
  Eye, 
  Rocket, 
  Undo2, 
  Redo2, 
  Settings, 
  HelpCircle,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Editor() {
  const params = useParams();
  const projectId = params?.id ? parseInt(params.id) : undefined;
  const [location, setLocation] = useLocation();
  
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
    canRedo
  } = useEditor();
  
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const { toast } = useToast();

  // Check if this is a new user (no projects yet) to show tutorial
  // Parse URL parameters to check for template ID
  const searchParams = new URLSearchParams(window.location.search);
  const templateId = searchParams.get('template');
  
  useEffect(() => {
    // Always show tutorial for testing
    setTutorialActive(true);
    
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
        try {
          // Fetch template from API
          const response = await fetch(`/api/templates/${templateId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch template (${response.status})`);
          }
          
          const template = await response.json();
          
          // Set components from template
          if (template?.components) {
            resetEditor(); // Clear any existing components
            setComponents(template.components);
            toast({
              title: "Template loaded",
              description: `Template "${template.name}" loaded successfully. Customize it to fit your needs.`,
            });
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
          resetEditor();
        }
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
            <h1 className="font-semibold text-xl">LaunchPlate</h1>
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
        <ComponentLibrary />
        <Canvas />
        <PropertiesPanel />
      </div>
      
      {/* Tutorial Components */}
      {tutorialActive && <TutorialOverlay />}
      <InteractiveTour />
      
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
