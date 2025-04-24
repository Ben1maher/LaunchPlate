import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useEditor } from "../context/EditorContext";

// Helper function to generate unique IDs for components
const generateUniqueId = () => crypto.randomUUID();
import { useQuery } from "@tanstack/react-query";
import { Template, Component, ComponentType } from "@shared/schema";
import ComponentLibrary from "../components/editor/ComponentLibrary";
import Canvas from "../components/editor/Canvas";
import PropertiesPanel from "../components/editor/PropertiesPanel";
import TutorialOverlay from "../components/editor/TutorialOverlay";
import InteractiveTour from "../components/editor/InteractiveTour";
import { PremiumBusinessTemplate, PremiumEcommerceTemplate } from "../templates/premium-templates";
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
      // Special case for template ID 2 (Professional Business)
      if (templateId === '2') {
        // Use the new BusinessTemplate component
        const template = {
          id: 2,
          name: "Premium Business Pro",
          description: "A high-end business template with premium design, inspired by Stripe's enterprise aesthetic",
          thumbnail: "",
          components: []
        };
        
        // Create a component that directly embeds our premium template HTML
        const premiumTemplateContent = `
          <div class="premium-template">
            <!-- Navigation -->
            <header class="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
              <div class="container flex h-16 items-center justify-between">
                <div class="flex items-center gap-6 md:gap-10">
                  <div class="font-bold text-xl text-blue-600">Business<span class="text-gray-800">Pro</span></div>
                  <nav class="hidden md:flex gap-6">
                    <a href="#" class="text-sm font-medium transition-colors hover:text-blue-600">Features</a>
                    <a href="#" class="text-sm font-medium transition-colors hover:text-blue-600">Solutions</a>
                    <a href="#" class="text-sm font-medium transition-colors hover:text-blue-600">Pricing</a>
                    <a href="#" class="text-sm font-medium transition-colors hover:text-blue-600">Resources</a>
                  </nav>
                </div>
                <div class="flex items-center gap-4">
                  <a href="#" class="text-sm font-medium hover:underline underline-offset-4">Sign In</a>
                  <button class="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600">Get Started</button>
                </div>
              </div>
            </header>

            <!-- Hero Section -->
            <section class="relative overflow-hidden">
              <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9IiNkZGQiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIvPjwvZz48L3N2Zz4=')] bg-center border-b"></div>
              <div class="absolute top-0 right-0 -z-10 h-full w-full bg-gradient-to-b from-white via-white/90 to-white"></div>
              
              <div class="container relative pt-24 pb-20 md:pt-32 md:pb-24">
                <div class="flex flex-col gap-4 items-center text-center">
                  <div class="inline-flex items-center rounded-full border px-4 py-1 text-sm font-semibold mb-4">Launching Q2 2025</div>
                  <h1 class="text-4xl md:text-6xl font-bold leading-tight tracking-tighter text-gray-900 md:text-center">
                    Elevate Your Business<br />With <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Professional</span> Solutions
                  </h1>
                  <p class="mt-4 text-xl text-gray-500 max-w-2xl md:text-center leading-relaxed">
                    Streamline operations, enhance customer experiences, and drive growth with our enterprise-grade platform designed for modern businesses.
                  </p>
                  <div class="mt-8 flex flex-wrap items-center gap-4">
                    <button class="inline-flex items-center justify-center rounded-full bg-blue-600 h-11 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-500">Start Free Trial</button>
                    <button class="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white h-11 px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50">
                      Schedule Demo <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2"><path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                    </button>
                  </div>
                  <p class="mt-4 text-sm text-gray-500">No credit card required. 14-day free trial.</p>
                </div>
              </div>

              <!-- Logos section -->
              <div class="container pb-16">
                <div class="flex flex-col items-center">
                  <p class="text-sm text-gray-500 mb-8 uppercase tracking-wide">Trusted by leading companies</p>
                  <div class="flex flex-wrap justify-center gap-8 md:gap-16 grayscale opacity-70">
                    <div class="h-8 w-32 bg-gray-200 rounded"></div>
                    <div class="h-8 w-32 bg-gray-200 rounded"></div>
                    <div class="h-8 w-32 bg-gray-200 rounded"></div>
                    <div class="h-8 w-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Features Section -->
            <section class="container py-20">
              <div class="grid gap-8 lg:grid-cols-3 md:gap-12">
                <div class="relative overflow-hidden rounded-lg border bg-gradient-to-b from-blue-50 to-white p-8">
                  <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-blue-600"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>
                  </div>
                  <h3 class="mb-3 text-xl font-bold">Enterprise Security</h3>
                  <p class="text-gray-500">
                    Bank-level encryption and comprehensive compliance standards keep your data secure and your business protected.
                  </p>
                </div>
                <div class="relative overflow-hidden rounded-lg border bg-gradient-to-b from-blue-50 to-white p-8">
                  <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-blue-600"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  </div>
                  <h3 class="mb-3 text-xl font-bold">Lightning Performance</h3>
                  <p class="text-gray-500">
                    Engineered for speed with globally distributed infrastructure and intelligent caching for optimal response times.
                  </p>
                </div>
                <div class="relative overflow-hidden rounded-lg border bg-gradient-to-b from-blue-50 to-white p-8">
                  <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-blue-600"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10v2H7z"/><path d="M7 13h4v2H7z"/></svg>
                  </div>
                  <h3 class="mb-3 text-xl font-bold">Advanced Analytics</h3>
                  <p class="text-gray-500">
                    Gain actionable insights with real-time data visualization and customizable reporting dashboards.
                  </p>
                </div>
              </div>
            </section>

            <!-- CTA Section -->
            <section class="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 text-white">
              <div class="container text-center">
                <h2 class="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Ready to Transform Your Business?</h2>
                <p class="mx-auto max-w-2xl text-lg mb-8">
                  Join thousands of companies that are streamlining operations and driving growth with our platform.
                </p>
                <div class="flex flex-wrap justify-center gap-4">
                  <button class="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow transition-colors hover:bg-gray-100">
                    Start Free Trial
                  </button>
                  <button class="inline-flex items-center justify-center rounded-full border border-white px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/20">
                    Schedule Demo
                  </button>
                </div>
              </div>
            </section>

            <!-- Footer -->
            <footer class="bg-gray-900 text-gray-300 py-12">
              <div class="container">
                <div class="grid grid-cols-2 md:grid-cols-5 gap-8">
                  <div class="col-span-2">
                    <div class="font-bold text-xl text-white mb-4">Business<span class="text-blue-400">Pro</span></div>
                    <p class="text-sm text-gray-400 mb-4 max-w-md">
                      Comprehensive business solutions designed to streamline operations, enhance customer experiences, and drive sustainable growth.
                    </p>
                    <div class="flex space-x-4">
                      <a href="#" class="text-gray-400 hover:text-white">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" class="text-gray-400 hover:text-white">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div>
                    <h3 class="text-white font-semibold mb-3">Product</h3>
                    <ul class="space-y-2 text-sm">
                      <li><a href="#" class="hover:text-white transition-colors">Features</a></li>
                      <li><a href="#" class="hover:text-white transition-colors">Pricing</a></li>
                      <li><a href="#" class="hover:text-white transition-colors">Case Studies</a></li>
                      <li><a href="#" class="hover:text-white transition-colors">Reviews</a></li>
                    </ul>
                  </div>

                  <div>
                    <h3 class="text-white font-semibold mb-3">Company</h3>
                    <ul class="space-y-2 text-sm">
                      <li><a href="#" class="hover:text-white transition-colors">About</a></li>
                      <li><a href="#" class="hover:text-white transition-colors">Careers</a></li>
                      <li><a href="#" class="hover:text-white transition-colors">Press</a></li>
                      <li><a href="#" class="hover:text-white transition-colors">Contact</a></li>
                    </ul>
                  </div>

                  <div>
                    <h3 class="text-white font-semibold mb-3">Resources</h3>
                    <ul class="space-y-2 text-sm">
                      <li><a href="#" class="hover:text-white transition-colors">Blog</a></li>
                      <li><a href="#" class="hover:text-white transition-colors">Documentation</a></li>
                      <li><a href="#" class="hover:text-white transition-colors">Help Center</a></li>
                      <li><a href="#" class="hover:text-white transition-colors">Community</a></li>
                    </ul>
                  </div>
                </div>

                <div class="mt-12 pt-8 border-t border-gray-800 text-sm text-gray-400">
                  <div class="flex flex-col md:flex-row justify-between items-center">
                    <p>© 2025 BusinessPro. All rights reserved.</p>
                    <div class="flex gap-6 mt-4 md:mt-0">
                      <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
                      <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        `;
        
        // For the business template, we'll create a collection of standard components
        // that make up a business template page
        const businessComponents: Component[] = [
          // Header component
          {
            id: crypto.randomUUID(),
            type: "header-1",
            content: {
              logoText: "Business<span>Pro</span>",
              menuItems: [
                { text: "Features", url: "#features" },
                { text: "Solutions", url: "#solutions" },
                { text: "Pricing", url: "#pricing" },
                { text: "Resources", url: "#resources" }
              ]
            },
            style: {
              backgroundColor: "#ffffff",
              backgroundType: "color",
              textColor: "#1E3A8A",
              accentColor: "#3B82F6"
            }
          },
          // Hero section
          {
            id: generateUniqueId(),
            type: "hero-gradient",
            content: {
              tagline: "Launching Q2 2025",
              heading: "Elevate Your Business With Professional Solutions",
              description: "Streamline operations, enhance customer experiences, and drive growth with our enterprise-grade platform designed for modern businesses.",
              primaryButtonText: "Start Free Trial",
              secondaryButtonText: "Schedule Demo"
            },
            style: {
              paddingTop: "80px",
              paddingBottom: "80px",
              gradientStartColor: "#eef2ff",
              gradientEndColor: "#ffffff",
              headingColor: "#111827",
              textColor: "#4B5563"
            }
          },
          // Features section
          {
            id: generateUniqueId(),
            type: "feature-cards",
            content: {
              heading: "Why Choose BusinessPro",
              features: [
                {
                  title: "Enterprise Security",
                  description: "Bank-level encryption and comprehensive compliance standards keep your data secure."
                },
                {
                  title: "Lightning Performance",
                  description: "Engineered for speed with globally distributed infrastructure for optimal response times."
                },
                {
                  title: "Advanced Analytics",
                  description: "Gain actionable insights with real-time data visualization and customizable reporting."
                }
              ]
            },
            style: {
              backgroundColor: "#ffffff",
              backgroundType: "color",
              cardBackgroundColor: "#f7f9fc",
              headingColor: "#111827",
              textColor: "#4B5563",
              padding: "80px"
            }
          },
          // CTA section
          {
            id: generateId(),
            type: "hero-centered",
            content: {
              heading: "Ready to Transform Your Business?",
              description: "Join thousands of companies that are streamlining operations and driving growth with our platform.",
              primaryButtonText: "Start Free Trial",
              secondaryButtonText: "Schedule Demo"
            },
            style: {
              backgroundType: "gradient",
              gradientStartColor: "#2563EB",
              gradientEndColor: "#4F46E5",
              textColor: "#ffffff",
              padding: "80px"
            }
          },
          // Footer
          {
            id: generateId(),
            type: "footer-columns",
            content: {
              logoText: "BusinessPro",
              description: "Comprehensive business solutions designed to streamline operations and drive growth.",
              columns: [
                {
                  title: "Product",
                  links: [
                    { text: "Features", url: "#" },
                    { text: "Pricing", url: "#" },
                    { text: "Case Studies", url: "#" }
                  ]
                },
                {
                  title: "Company",
                  links: [
                    { text: "About", url: "#" },
                    { text: "Careers", url: "#" },
                    { text: "Contact", url: "#" }
                  ]
                },
                {
                  title: "Resources",
                  links: [
                    { text: "Blog", url: "#" },
                    { text: "Documentation", url: "#" },
                    { text: "Help Center", url: "#" }
                  ]
                }
              ],
              copyright: "© 2025 BusinessPro. All rights reserved."
            },
            style: {
              backgroundColor: "#18181B",
              textColor: "#9CA3AF",
              headingColor: "#FFFFFF",
              padding: "64px"
            }
          }
        ];
        
        
        
        setComponents(businessComponents);
        toast({
          title: "Premium template loaded",
          description: "Professional Business template loaded successfully. Customize it to fit your needs.",
        });
        
        setProjectName(`My ${template.name}`);
        setProjectDescription(template.description || "");
        return;
      }
      
      // Regular template loading for other templates
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
          const newComponents = template.components.map((templateComponent: Component) => {
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
