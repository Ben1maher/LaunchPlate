import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Project, Component } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ComponentRenderer from "../components/editor/ComponentRenderer";
import { ArrowLeft, Pencil, Download, Monitor, Tablet, Smartphone } from "lucide-react";
import { Link } from "wouter";

export default function Preview() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const projectId = params?.id ? parseInt(params.id) : undefined;
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const { toast } = useToast();

  useEffect(() => {
    if (!projectId) {
      setLocation("/");
      return;
    }

    async function loadProject() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/projects/${projectId}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error("Project not found");
        }
        
        const data = await response.json();
        setProject(data);
      } catch (error) {
        toast({
          title: "Error loading preview",
          description: "Could not load the project. It may have been deleted or you don't have access.",
          variant: "destructive",
        });
        setLocation("/");
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [projectId, setLocation, toast]);

  // Handle HTML export (in real app, this would generate an actual HTML file)
  const handleExport = () => {
    toast({
      title: "Export functionality",
      description: "In a production app, this would generate and download an HTML file of your landing page.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Project not found</p>
          <Link href="/">
            <Button className="mt-4">Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Preview Header */}
      <header className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="font-medium">Preview: {project.name}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Viewport Controls */}
          <div className="flex items-center bg-gray-800 rounded overflow-hidden mr-3">
            <Button
              variant={viewportSize === 'desktop' ? 'default' : 'ghost'}
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => setViewportSize('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={viewportSize === 'tablet' ? 'default' : 'ghost'}
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => setViewportSize('tablet')}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={viewportSize === 'mobile' ? 'default' : 'ghost'}
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => setViewportSize('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-transparent border-gray-700 text-white hover:bg-gray-800 gap-1"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" /> Export HTML
          </Button>
          <Link href={`/editor/${project.id}`}>
            <Button size="sm" className="gap-1">
              <Pencil className="h-4 w-4" /> Edit
            </Button>
          </Link>
        </div>
      </header>
      
      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto bg-gray-200 p-8">
        <div 
          data-viewport={viewportSize}
          className={`mx-auto bg-white shadow-md transition-all duration-300 ${
            viewportSize === 'tablet' ? 'max-w-xl' : 
            viewportSize === 'mobile' ? 'max-w-sm' : 
            'max-w-screen-lg'
          }`}
        >
          {project.components && Array.isArray(project.components) && project.components.length > 0 ? (
            (project.components as Component[]).map((component: Component, index: number) => (
              <ComponentRenderer 
                key={component.id || index}
                component={component}
                inEditor={false}
                viewportMode={viewportSize}
              />
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-500">This landing page has no components.</p>
              <Link href={`/editor/${project.id}`}>
                <Button className="mt-4">
                  <Pencil className="h-4 w-4 mr-2" /> Edit this page
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
