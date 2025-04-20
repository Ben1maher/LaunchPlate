import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { 
  Component,
  ComponentType, 
  PageComponent 
} from '@shared/schema';
import { v4 as uuidv4 } from 'uuid';
import { apiRequest } from '@/lib/queryClient';

interface EditorContextType {
  components: Component[];
  selectedComponent: Component | null;
  isDragging: boolean;
  tutorialActive: boolean;
  tourStep: number;
  history: Component[][];
  historyIndex: number;
  
  setComponents: (components: Component[]) => void;
  setSelectedComponent: (component: Component | null) => void;
  setIsDragging: (isDragging: boolean) => void;
  setTutorialActive: (active: boolean) => void;
  setTourStep: (step: number) => void;
  
  addComponent: (type: ComponentType, index?: number) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  removeComponent: (id: string) => void;
  moveComponent: (fromIndex: number, toIndex: number) => void;
  
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  saveProject: (name: string, description: string) => Promise<number>;
  loadProject: (id: number) => Promise<void>;
  
  resetEditor: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

const MAX_HISTORY = 50;

export function EditorProvider({ children }: { children: ReactNode }) {
  const [components, setComponentsState] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tutorialActive, setTutorialActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  
  // History for undo/redo functionality
  const [history, setHistory] = useState<Component[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const { toast } = useToast();
  const { user, isAuthenticated, isGuest } = useAuth();
  const [_, navigate] = useLocation();
  
  // Hero image update event listener
  useEffect(() => {
    const handleHeroImageUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { componentId, imageUrl } = customEvent.detail;
      
      const component = components.find(c => c.id === componentId);
      if (component) {
        // Use updateComponent to update the image URL
        const updatedContent = {
          ...component.content,
          imageUrl
        };
        
        updateComponent(componentId, {
          content: updatedContent
        });
        
        toast({
          title: imageUrl ? "Image Updated" : "Image Removed",
          description: imageUrl ? "The hero image has been updated." : "The hero image has been removed.",
          duration: 3000
        });
      }
    };
    
    // Add event listener
    document.addEventListener('hero:updateImage', handleHeroImageUpdate);
    
    // Cleanup
    return () => {
      document.removeEventListener('hero:updateImage', handleHeroImageUpdate);
    };
  }, [components, toast]);

  // Set components with history tracking
  const setComponents = (newComponents: Component[]) => {
    setComponentsState(newComponents);
    
    // Add to history if different from current state
    if (JSON.stringify(newComponents) !== JSON.stringify(history[historyIndex])) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push([...newComponents]);
      
      // Limit history size
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }
      
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const addComponent = (type: ComponentType, index?: number) => {
    const newComponent: Component = {
      id: uuidv4(),
      type,
      content: getDefaultContentForType(type),
      style: getDefaultStyleForType(type),
    };

    const newComponents = [...components];
    if (index !== undefined) {
      newComponents.splice(index, 0, newComponent);
    } else {
      newComponents.push(newComponent);
    }

    setComponents(newComponents);
    setSelectedComponent(newComponent);
  };

  const updateComponent = (id: string, updates: Partial<Component>) => {
    const newComponents = components.map(component => 
      component.id === id 
        ? { ...component, ...updates } 
        : component
    );
    
    setComponents(newComponents);
    
    if (selectedComponent?.id === id) {
      setSelectedComponent({ ...selectedComponent, ...updates });
    }
  };

  const removeComponent = (id: string) => {
    const newComponents = components.filter(component => component.id !== id);
    setComponents(newComponents);
    
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
  };

  const moveComponent = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    const newComponents = [...components];
    const [removed] = newComponents.splice(fromIndex, 1);
    newComponents.splice(toIndex, 0, removed);
    
    setComponents(newComponents);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setComponentsState(history[historyIndex - 1]);
      setSelectedComponent(null);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setComponentsState(history[historyIndex + 1]);
      setSelectedComponent(null);
    }
  };

  const canUndo = () => historyIndex > 0;
  const canRedo = () => historyIndex < history.length - 1;

  const saveProject = async (name: string, description: string): Promise<number> => {
    // Check authentication status
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your project.",
        variant: "destructive",
      });
      navigate("/auth");
      throw new Error("Authentication required");
    }

    try {
      // Check if the user has reached their project limit (only for free tier)
      if (user?.accountType === "free" && !isGuest) {
        // Fetch user's current projects to check against limit
        const projectsResponse = await apiRequest('GET', `/api/projects?userId=${user.id}`);
        
        if (projectsResponse.ok) {
          const userProjects = await projectsResponse.json();
          const projectLimit = user.projectsLimit || 3;
          
          if (userProjects.length >= projectLimit) {
            toast({
              title: "Project limit reached",
              description: `Free accounts are limited to ${projectLimit} projects. Upgrade to create more projects.`,
              variant: "destructive",
            });
            return -1;
          }
        }
      }
      
      // Save the project
      const response = await apiRequest('POST', '/api/projects', {
        userId: user?.id,
        name,
        description,
        components,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        published: false
      });
      
      if (!response.ok) {
        throw new Error("Failed to save project");
      }
      
      const project = await response.json();
      
      toast({
        title: "Project saved",
        description: "Your landing page has been saved successfully.",
      });
      
      return project.id;
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: "Error saving project",
        description: "There was an error saving your project. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const loadProject = async (id: number): Promise<void> => {
    try {
      const response = await apiRequest('GET', `/api/projects/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load project: ${response.statusText}`);
      }
      
      const project = await response.json();
      
      // Check if the user has permission to edit this project
      if (user?.id !== project.userId && !isGuest) {
        toast({
          title: "Permission denied",
          description: "You don't have permission to edit this project.",
          variant: "destructive",
        });
        navigate("/projects");
        throw new Error("Permission denied");
      }
      
      setComponents(project.components);
      
      toast({
        title: "Project loaded",
        description: `${project.name} has been loaded successfully.`,
        duration: 3000
      });
    } catch (error) {
      console.error("Error loading project:", error);
      toast({
        title: "Error loading project",
        description: "There was an error loading the project. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetEditor = () => {
    setComponentsState([]);
    setSelectedComponent(null);
    setHistory([[]]);
    setHistoryIndex(0);
  };

  // Get default content based on component type
  const getDefaultContentForType = (type: ComponentType) => {
    switch (type) {
      case 'header-1':
        return {
          logo: 'Your Logo',
          menuItems: [
            { text: 'Home', url: '#' },
            { text: 'Features', url: '#features' },
            { text: 'Pricing', url: '#pricing' },
            { text: 'Contact', url: '#contact' }
          ],
          ctaText: 'Sign Up',
          ctaUrl: '#signup'
        };
      case 'header-2':
        return {
          logo: 'Your Logo',
          menuItems: [
            { text: 'Home', url: '#' },
            { text: 'Features', url: '#features' },
            { text: 'Pricing', url: '#pricing' },
            { text: 'Contact', url: '#contact' }
          ]
        };
      case 'hero-split':
        return {
          heading: 'Create Landing Pages That Convert',
          subheading: 'Build beautiful, responsive landing pages without any coding skills required.',
          primaryButtonText: 'Get Started',
          primaryButtonUrl: '#get-started',
          secondaryButtonText: 'Learn More',
          secondaryButtonUrl: '#learn-more',
          imageUrl: ''
        };
      case 'hero-centered':
        return {
          heading: 'Create Landing Pages That Convert',
          subheading: 'Build beautiful, responsive landing pages without any coding skills required.',
          buttonText: 'Get Started',
          buttonUrl: '#get-started'
        };
      case 'heading':
        return {
          text: 'Section Heading',
          level: 'h2'
        };
      case 'text-block':
        return {
          text: 'Add your text here. This can be a paragraph describing your product, service, or offering.'
        };
      case 'button':
        return {
          text: 'Click Me',
          url: '#',
          type: 'primary'
        };
      case 'image':
        return {
          url: '',
          alt: 'Image description',
          caption: ''
        };
      case 'spacer':
        return {
          height: 50
        };
      case 'divider':
        return {
          style: 'solid'
        };
      case 'form':
        return {
          title: 'Contact Us',
          fields: [
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'message', label: 'Message', type: 'textarea', required: true }
          ],
          submitText: 'Send Message'
        };
      case 'email-signup':
        return {
          title: 'Subscribe to our newsletter',
          description: 'Get the latest updates and news right to your inbox.',
          buttonText: 'Subscribe'
        };
      default:
        return {};
    }
  };

  // Get default style based on component type
  const getDefaultStyleForType = (type: ComponentType) => {
    switch (type) {
      case 'header-1':
      case 'header-2':
        return {
          backgroundColor: '#ffffff',
          padding: '16px',
          borderBottom: '1px solid #e5e7eb'
        };
      case 'hero-split':
      case 'hero-centered':
        return {
          backgroundColor: '#f9fafb',
          padding: '64px 16px'
        };
      case 'heading':
        return {
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '1rem'
        };
      case 'text-block':
        return {
          fontSize: '1rem',
          color: '#4b5563',
          lineHeight: '1.5',
          marginBottom: '1rem'
        };
      case 'button':
        return {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          fontWeight: '500'
        };
      case 'image':
        return {
          width: '100%',
          borderRadius: '0.5rem',
          marginBottom: '1rem'
        };
      case 'spacer':
        return {
          height: '50px'
        };
      case 'divider':
        return {
          borderTop: '1px solid #e5e7eb',
          margin: '32px 0'
        };
      case 'form':
      case 'email-signup':
        return {
          backgroundColor: '#ffffff',
          padding: '32px',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        };
      default:
        return {};
    }
  };

  const value = {
    components,
    selectedComponent,
    isDragging,
    tutorialActive,
    tourStep,
    history,
    historyIndex,
    
    setComponents,
    setSelectedComponent,
    setIsDragging,
    setTutorialActive,
    setTourStep,
    
    addComponent,
    updateComponent,
    removeComponent,
    moveComponent,
    
    undo,
    redo,
    canUndo,
    canRedo,
    
    saveProject,
    loadProject,
    
    resetEditor
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
