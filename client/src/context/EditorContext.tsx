import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { 
  Component,
  ComponentType, 
  PageComponent,
  PageSettings
} from '@shared/schema';
import { v4 as uuidv4 } from 'uuid';
import { apiRequest } from '@/lib/queryClient';

// Define brand asset types
export interface BrandAsset {
  id: string;
  name: string;
  type: 'color' | 'gradient' | 'image';
  value: string;
  // For gradients
  secondaryValue?: string;
  createdAt: Date;
}

interface EditorContextType {
  components: Component[];
  selectedComponent: Component | null;
  isDragging: boolean;
  tutorialActive: boolean;
  tourStep: number;
  viewportMode: 'desktop' | 'tablet' | 'mobile';
  history: Component[][];
  historyIndex: number;
  pageSettings: PageSettings;
  isEditingPage: boolean;
  brandAssets: BrandAsset[];
  
  setComponents: (components: Component[]) => void;
  setSelectedComponent: (component: Component | null) => void;
  setIsDragging: (isDragging: boolean) => void;
  setTutorialActive: (active: boolean) => void;
  setTourStep: (step: number) => void;
  setViewportMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  setIsEditingPage: (isEditing: boolean) => void;
  
  addComponent: (type: ComponentType, index?: number) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  removeComponent: (id: string) => void;
  moveComponent: (fromIndex: number, toIndex: number) => void;
  
  updatePageSettings: (settings: Partial<PageSettings>) => void;
  
  addBrandAsset: (asset: Omit<BrandAsset, 'id' | 'createdAt'>) => void;
  removeBrandAsset: (id: string) => void;
  
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
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isEditingPage, setIsEditingPage] = useState(false);
  
  // Default page settings
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    background: {
      type: 'color',
      color: '#ffffff'
    },
    width: 'contained',
    maxWidth: 1200
  });
  
  // Default brand assets for each template
  const defaultBrandAssets: BrandAsset[] = [
    // Colors
    {
      id: 'default-primary',
      name: 'Primary Blue',
      type: 'color',
      value: '#3B82F6',
      createdAt: new Date()
    },
    {
      id: 'default-secondary',
      name: 'Secondary Teal',
      type: 'color',
      value: '#14B8A6',
      createdAt: new Date()
    },
    {
      id: 'default-accent',
      name: 'Accent Indigo',
      type: 'color',
      value: '#6366F1',
      createdAt: new Date()
    },
    {
      id: 'default-neutral',
      name: 'Neutral Gray',
      type: 'color',
      value: '#6B7280',
      createdAt: new Date()
    },
    
    // Gradients
    {
      id: 'default-gradient-1',
      name: 'Blue Ocean',
      type: 'gradient',
      value: '#3B82F6',
      secondaryValue: '#2DD4BF',
      createdAt: new Date()
    },
    {
      id: 'default-gradient-2',
      name: 'Sunset Vibes',
      type: 'gradient',
      value: '#F59E0B',
      secondaryValue: '#EF4444',
      createdAt: new Date()
    },
    {
      id: 'default-gradient-3',
      name: 'Purple Haze',
      type: 'gradient',
      value: '#8B5CF6',
      secondaryValue: '#EC4899',
      createdAt: new Date()
    }
  ];
  
  // Brand assets for reusable colors, gradients, and images
  const [brandAssets, setBrandAssets] = useState<BrandAsset[]>(defaultBrandAssets);
  
  // History for undo/redo functionality
  const [history, setHistory] = useState<Component[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const { toast } = useToast();
  const { user, isAuthenticated, isGuest } = useAuth();
  const [_, navigate] = useLocation();
  
  // Create a ref for the editor context element
  const editorContextRef = React.useRef<HTMLDivElement>(null);

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
    
    // Brand asset add event handler
    const handleAddBrandAsset = (e: Event) => {
      const customEvent = e as CustomEvent;
      const assetDetails = customEvent.detail;
      
      if (assetDetails) {
        addBrandAsset(assetDetails);
      }
    };
    
    // Add event listeners
    document.addEventListener('hero:updateImage', handleHeroImageUpdate);
    
    if (editorContextRef.current) {
      editorContextRef.current.addEventListener('editor:addBrandAsset', handleAddBrandAsset);
    }
    
    // Cleanup
    return () => {
      document.removeEventListener('hero:updateImage', handleHeroImageUpdate);
      
      if (editorContextRef.current) {
        editorContextRef.current.removeEventListener('editor:addBrandAsset', handleAddBrandAsset);
      }
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

  const addComponent = (type: ComponentType, index?: number, customComponent?: Component) => {
    // Create the base component
    let newComponent: Component = customComponent || {
      id: uuidv4(),
      type,
      content: getDefaultContentForType(type),
      style: getDefaultStyleForType(type),
    };
    
    // Apply page background color to all components by default
    if (pageSettings.background.type === 'color' && pageSettings.background.color) {
      // Apply page background color to the component
      newComponent = {
        ...newComponent,
        style: {
          ...newComponent.style,
          backgroundColor: pageSettings.background.color
        }
      };
    }

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
        description: "To save your design, you need to create an account.",
        variant: "destructive",
      });
      navigate("/auth");
      throw new Error("Authentication required");
    }
    
    // Guest users cannot save projects
    if (isGuest) {
      toast({
        title: "Account required",
        description: "To save your design, you need to create a free account.",
        variant: "destructive",
      });
      navigate("/auth");
      throw new Error("Guest cannot save projects");
    }

    try {
      // Check if the user has reached their project limit (only for free tier)
      if (user?.accountType === "free") {
        // Fetch user's current projects to check against limit
        const projectsResponse = await apiRequest('GET', `/api/projects?userId=${user.id}`);
        
        if (projectsResponse.ok) {
          const userProjects = await projectsResponse.json();
          const projectLimit = user.projectsLimit || 1;
          
          if (userProjects.length >= projectLimit) {
            toast({
              title: "Project limit reached",
              description: `Free accounts are limited to ${projectLimit} project. Upgrade to create more projects.`,
              variant: "destructive",
            });
            return -1;
          }
        }
      }
      
      // Save the project with brand assets
      const response = await apiRequest('POST', '/api/projects', {
        userId: user?.id,
        name,
        description,
        components,
        brandAssets, // Include brand assets with the project
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
      
      // If the project has saved brand assets, load those instead of the defaults
      if (project.brandAssets && Array.isArray(project.brandAssets) && project.brandAssets.length > 0) {
        setBrandAssets(project.brandAssets);
      } else {
        // For older projects without brand assets, keep using the defaults
        setBrandAssets(defaultBrandAssets);
      }
      
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

  const updatePageSettings = (settings: Partial<PageSettings>) => {
    let newPageSettings: PageSettings;
    
    if (settings.background && typeof settings.background === 'object') {
      // For background updates, merge the objects instead of replacing
      newPageSettings = {
        ...pageSettings,
        ...settings,
        background: {
          ...pageSettings.background,
          ...settings.background
        }
      };
      setPageSettings(newPageSettings);
      
      // We no longer automatically update component backgrounds when page background changes
      // Each component should maintain its own background styling independently
    } else {
      // For other settings, just spread them in
      newPageSettings = {
        ...pageSettings,
        ...settings
      };
      setPageSettings(newPageSettings);
    }
    
    // Deselect any component when editing page settings
    if (selectedComponent && !isEditingPage) {
      setSelectedComponent(null);
    }
    
    toast({
      title: "Page settings updated",
      description: "The page background has been updated.",
      duration: 2000
    });
  };

  // Brand assets management
  const addBrandAsset = (asset: Omit<BrandAsset, 'id' | 'createdAt'>) => {
    console.log("EditorContext - Adding brand asset:", asset);
    
    const newAsset: BrandAsset = {
      ...asset,
      id: uuidv4(),
      createdAt: new Date()
    };
    
    console.log("EditorContext - Created new asset:", newAsset);
    
    setBrandAssets(prevAssets => {
      const updatedAssets = [...prevAssets, newAsset];
      console.log("EditorContext - Updated brand assets:", updatedAssets);
      return updatedAssets;
    });
    
    toast({
      title: "Brand asset saved",
      description: `"${asset.name}" has been added to your brand assets.`,
      duration: 2000
    });
  };
  
  const removeBrandAsset = (id: string) => {
    console.log("EditorContext - Removing brand asset with ID:", id);
    
    setBrandAssets(prevAssets => {
      console.log("EditorContext - Current assets before removal:", prevAssets);
      
      const assetToRemove = prevAssets.find(asset => asset.id === id);
      const filteredAssets = prevAssets.filter(asset => asset.id !== id);
      
      console.log("EditorContext - Asset to remove:", assetToRemove);
      console.log("EditorContext - Updated assets after removal:", filteredAssets);
      
      if (assetToRemove) {
        toast({
          title: "Brand asset removed",
          description: `"${assetToRemove.name}" has been removed from your brand assets.`,
          duration: 2000
        });
      }
      
      return filteredAssets;
    });
  };

  const resetEditor = () => {
    setComponentsState([]);
    setSelectedComponent(null);
    setHistory([[]]);
    setHistoryIndex(0);
    setPageSettings({
      background: {
        type: 'color',
        color: '#ffffff'
      },
      width: 'contained',
      maxWidth: 1200
    });
    setBrandAssets([]);
  };

  // Get default content based on component type
  const getDefaultContentForType = (type: ComponentType) => {
    switch (type) {
      // Headers
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
      case 'header-transparent':
        return {
          logo: 'Your Logo',
          logoColor: 'white',
          menuItems: [
            { text: 'Home', url: '#' },
            { text: 'Features', url: '#features' },
            { text: 'Pricing', url: '#pricing' },
            { text: 'Contact', url: '#contact' }
          ],
          ctaText: 'Sign Up',
          ctaUrl: '#signup'
        };
        
      // Hero sections
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
      case 'hero-video':
        return {
          heading: 'Create Landing Pages That Convert',
          subheading: 'Build beautiful, responsive landing pages without any coding skills required.',
          buttonText: 'Get Started',
          buttonUrl: '#get-started',
          videoUrl: '',
          overlayOpacity: 0.5
        };
      case 'hero-gradient':
        return {
          heading: 'Create Landing Pages That Convert',
          subheading: 'Build beautiful, responsive landing pages without any coding skills required.',
          buttonText: 'Get Started',
          buttonUrl: '#get-started',
          gradientStart: '#4F46E5',
          gradientEnd: '#10B981'
        };
        
      // Text elements
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
      case 'list-item':
        return {
          items: [
            'First list item with important information',
            'Second list item with additional details',
            'Third list item highlighting key benefits'
          ],
          type: 'bullet' // or 'numbered'
        };
      case 'blockquote':
        return {
          quote: 'This product has completely transformed how we work. The efficiency gains are simply incredible.',
          author: 'Jane Smith',
          role: 'CEO, Acme Corp'
        };
        
      // Media elements
      case 'image':
        return {
          url: '',
          alt: 'Image description',
          caption: ''
        };
      case 'gallery':
        return {
          images: [
            { url: '', alt: 'Gallery image 1', caption: 'Caption 1' },
            { url: '', alt: 'Gallery image 2', caption: 'Caption 2' },
            { url: '', alt: 'Gallery image 3', caption: 'Caption 3' },
            { url: '', alt: 'Gallery image 4', caption: 'Caption 4' }
          ],
          columns: 2
        };
      case 'video':
        return {
          url: '',
          title: 'Video title',
          autoplay: false,
          controls: true,
          loop: false,
          type: 'youtube' // or 'vimeo', 'mp4'
        };
      case 'carousel':
        return {
          slides: [
            { imageUrl: '', title: 'Slide 1', description: 'Description for slide 1' },
            { imageUrl: '', title: 'Slide 2', description: 'Description for slide 2' },
            { imageUrl: '', title: 'Slide 3', description: 'Description for slide 3' }
          ],
          autoplay: true,
          interval: 5000,
          showIndicators: true,
          showArrows: true
        };
        
      // Layout elements  
      case 'spacer':
        return {
          height: 50
        };
      case 'divider':
        return {
          style: 'solid'
        };
      case 'columns-2':
        return {
          columns: [
            { content: 'Add content for the first column here.' },
            { content: 'Add content for the second column here.' }
          ],
          gap: 24,
          verticalAlign: 'top'
        };
      case 'columns-3':
        return {
          columns: [
            { content: 'First column content.' },
            { content: 'Second column content.' },
            { content: 'Third column content.' }
          ],
          gap: 24,
          verticalAlign: 'top'
        };
      case 'columns-4':
        return {
          columns: [
            { content: 'Column 1' },
            { content: 'Column 2' },
            { content: 'Column 3' },
            { content: 'Column 4' }
          ],
          gap: 16,
          verticalAlign: 'top'
        };
        
      // Forms and CTAs
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
      case 'contact-details':
        return {
          title: 'Get in touch',
          email: 'contact@example.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main Street, City, Country',
          showIcons: true,
          showMap: false
        };
        
      // Feature sections
      case 'feature-grid':
        return {
          title: 'Key Features',
          description: 'Discover what makes our product special',
          features: [
            { icon: 'ri-rocket-line', title: 'Fast Performance', description: 'Lightning-quick response times' },
            { icon: 'ri-shield-check-line', title: 'Secure', description: 'Enterprise-grade security' },
            { icon: 'ri-user-smile-line', title: 'User-Friendly', description: 'Intuitive design for all users' },
            { icon: 'ri-tools-line', title: 'Customizable', description: 'Adapt to your specific needs' }
          ],
          columns: 2
        };
      case 'feature-list':
        return {
          title: 'Why Choose Us',
          features: [
            { title: 'Easy to use', description: 'Our platform is designed with simplicity in mind.' },
            { title: 'Powerful integrations', description: 'Connect with all your favorite tools and services.' },
            { title: 'Advanced analytics', description: 'Gain insights into your performance with detailed metrics.' }
          ],
          layout: 'stacked' // or 'horizontal'
        };
      case 'feature-cards':
        return {
          title: 'Our Services',
          cards: [
            { image: '', title: 'Web Design', description: 'Beautiful, responsive websites built to convert visitors.' },
            { image: '', title: 'App Development', description: 'Cross-platform mobile applications for iOS and Android.' },
            { image: '', title: 'Brand Strategy', description: 'Comprehensive branding solutions to elevate your business.' }
          ],
          background: 'light'
        };
        
      // Testimonial sections
      case 'testimonial-single':
        return {
          quote: "The most intuitive and user-friendly platform I've ever used. It has revolutionized how we approach our work.",
          author: 'Alex Johnson',
          company: 'TechCorp',
          avatar: ''
        };
      case 'testimonial-carousel':
        return {
          testimonials: [
            { quote: 'Incredible service and amazing results.', author: 'John Doe', company: 'ABC Inc', avatar: '' },
            { quote: "The best investment we've made for our business.", author: 'Sarah Brown', company: 'XYZ Corp', avatar: '' },
            { quote: 'Exceptional quality and support.', author: 'Michael Chen', company: '123 Industries', avatar: '' }
          ],
          autoplay: true,
          interval: 5000
        };
        
      // Statistics and pricing
      case 'stats-bar':
        return {
          title: 'Our Impact',
          stats: [
            { value: '10K+', label: 'Users' },
            { value: '500+', label: 'Projects' },
            { value: '99%', label: 'Satisfaction' },
            { value: '24/7', label: 'Support' }
          ],
          layout: 'horizontal'
        };
      case 'pricing-cards':
        return {
          title: 'Pricing Plans',
          description: 'Choose the perfect plan for your needs',
          plans: [
            {
              name: 'Basic',
              price: '19',
              period: 'month',
              description: 'For individuals and small projects',
              features: ['Feature 1', 'Feature 2', 'Feature 3'],
              cta: 'Get Started',
              popular: false
            },
            {
              name: 'Pro',
              price: '49',
              period: 'month',
              description: 'For growing businesses',
              features: ['All Basic features', 'Feature 4', 'Feature 5', 'Feature 6'],
              cta: 'Get Started',
              popular: true
            },
            {
              name: 'Enterprise',
              price: '99',
              period: 'month',
              description: 'For large organizations',
              features: ['All Pro features', 'Feature 7', 'Feature 8', 'Feature 9'],
              cta: 'Contact Sales',
              popular: false
            }
          ]
        };
        
      // Footers
      case 'footer-simple':
        return {
          logo: 'Your Logo',
          tagline: 'Creating beautiful solutions',
          copyright: `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
          links: [
            { text: 'Privacy Policy', url: '#privacy' },
            { text: 'Terms of Service', url: '#terms' },
            { text: 'Contact', url: '#contact' }
          ],
          socialLinks: [
            { platform: 'twitter', url: '#' },
            { platform: 'facebook', url: '#' },
            { platform: 'instagram', url: '#' }
          ]
        };
      case 'footer-columns':
        return {
          logo: 'Your Logo',
          tagline: 'Creating beautiful solutions',
          copyright: `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
          columns: [
            {
              title: 'Company',
              links: [
                { text: 'About Us', url: '#about' },
                { text: 'Careers', url: '#careers' },
                { text: 'News', url: '#news' }
              ]
            },
            {
              title: 'Products',
              links: [
                { text: 'Product 1', url: '#product1' },
                { text: 'Product 2', url: '#product2' },
                { text: 'Product 3', url: '#product3' }
              ]
            },
            {
              title: 'Resources',
              links: [
                { text: 'Blog', url: '#blog' },
                { text: 'Documentation', url: '#docs' },
                { text: 'Support', url: '#support' }
              ]
            },
            {
              title: 'Legal',
              links: [
                { text: 'Privacy Policy', url: '#privacy' },
                { text: 'Terms of Service', url: '#terms' },
                { text: 'Cookie Policy', url: '#cookies' }
              ]
            }
          ],
          socialLinks: [
            { platform: 'twitter', url: '#' },
            { platform: 'facebook', url: '#' },
            { platform: 'instagram', url: '#' },
            { platform: 'linkedin', url: '#' }
          ]
        };
        
      default:
        return {};
    }
  };

  // Get default style based on component type
  const getDefaultStyleForType = (type: ComponentType) => {
    switch (type) {
      // Headers
      case 'header-1':
      case 'header-2':
        return {
          backgroundColor: '#ffffff',
          padding: '16px',
          borderBottom: '1px solid #e5e7eb'
        };
      case 'header-transparent':
        return {
          backgroundColor: 'transparent',
          padding: '24px 16px',
          color: '#ffffff'
        };
      
      // Hero sections
      case 'hero-split':
      case 'hero-centered':
        return {
          backgroundColor: '#f9fafb',
          padding: '64px 16px'
        };
      case 'hero-video':
        return {
          padding: '80px 16px',
          color: '#ffffff',
          textAlign: 'center'
        };
      case 'hero-gradient':
        return {
          padding: '80px 16px',
          background: 'linear-gradient(to right, #4F46E5, #10B981)',
          color: '#ffffff',
          textAlign: 'center'
        };
        
      // Text elements
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
      case 'list-item':
        return {
          fontSize: '1rem',
          color: '#4b5563',
          lineHeight: '1.5',
          marginBottom: '1.5rem'
        };
      case 'blockquote':
        return {
          fontSize: '1.125rem',
          fontStyle: 'italic',
          borderLeft: '4px solid #3b82f6',
          paddingLeft: '1rem',
          color: '#4b5563',
          marginBottom: '1.5rem'
        };
        
      // Media elements
      case 'image':
        return {
          width: '100%',
          borderRadius: '0.5rem',
          marginBottom: '1rem'
        };
      case 'gallery':
        return {
          display: 'grid',
          gridGap: '1rem',
          marginBottom: '2rem'
        };
      case 'video':
        return {
          width: '100%',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem'
        };
      case 'carousel':
        return {
          width: '100%',
          height: '400px',
          borderRadius: '0.5rem',
          marginBottom: '2rem'
        };
        
      // Layout elements
      case 'spacer':
        return {
          height: '50px'
        };
      case 'divider':
        return {
          borderTop: '1px solid #e5e7eb',
          margin: '32px 0'
        };
      case 'columns-2':
      case 'columns-3':
      case 'columns-4':
        return {
          display: 'grid',
          gridGap: '2rem',
          marginBottom: '2rem'
        };
        
      // Forms and CTAs
      case 'form':
      case 'email-signup':
        return {
          backgroundColor: '#ffffff',
          padding: '32px',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        };
      case 'contact-details':
        return {
          padding: '1rem 0',
          marginBottom: '2rem'
        };
        
      // Feature sections
      case 'feature-grid':
      case 'feature-list':
        return {
          padding: '64px 16px',
          backgroundColor: '#ffffff'
        };
      case 'feature-cards':
        return {
          padding: '64px 16px',
          backgroundColor: '#f9fafb'
        };
        
      // Testimonial sections
      case 'testimonial-single':
        return {
          padding: '64px 16px',
          backgroundColor: '#ffffff',
          textAlign: 'center',
          marginBottom: '0'
        };
      case 'testimonial-carousel':
        return {
          padding: '64px 16px',
          backgroundColor: '#f9fafb',
          textAlign: 'center',
          marginBottom: '0'
        };
        
      // Statistics and pricing
      case 'stats-bar':
        return {
          padding: '48px 16px',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          textAlign: 'center'
        };
      case 'pricing-cards':
        return {
          padding: '64px 16px',
          backgroundColor: '#ffffff'
        };
        
      // Footers
      case 'footer-simple':
        return {
          padding: '32px 16px',
          backgroundColor: '#f9fafb',
          borderTop: '1px solid #e5e7eb'
        };
      case 'footer-columns':
        return {
          padding: '64px 16px 32px',
          backgroundColor: '#111827',
          color: '#ffffff'
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
    viewportMode,
    history,
    historyIndex,
    pageSettings,
    isEditingPage,
    brandAssets,
    
    setComponents,
    setSelectedComponent,
    setIsDragging,
    setTutorialActive,
    setTourStep,
    setViewportMode,
    setIsEditingPage,
    
    addComponent,
    updateComponent,
    removeComponent,
    moveComponent,
    
    updatePageSettings,
    
    addBrandAsset,
    removeBrandAsset,
    
    undo,
    redo,
    canUndo,
    canRedo,
    
    saveProject,
    loadProject,
    
    resetEditor
  };

  return (
    <div ref={editorContextRef} data-editor-context="true">
      <EditorContext.Provider value={value}>
        {children}
      </EditorContext.Provider>
    </div>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
