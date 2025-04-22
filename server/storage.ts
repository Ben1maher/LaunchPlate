import { 
  users, type User, type InsertUser,
  templates, type Template, type InsertTemplate,
  projects, type Project, type InsertProject,
  type PageComponent, type Component,
  SubscriptionTiers
} from "@shared/schema";
import { configureTierPermissions } from "./auth";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Storage interface for CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  
  // Template operations
  getAllTemplates(): Promise<Template[]>;
  getPublicTemplates(): Promise<Template[]>;
  getUserTemplates(userId: number): Promise<Template[]>;
  getTemplateById(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<Template | undefined>;
  deleteTemplate(id: number): Promise<boolean>;
  
  // Project operations
  getAllProjects(): Promise<Project[]>;
  getUserProjects(userId: number): Promise<Project[]>;
  getProjectById(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private templates: Map<number, Template>;
  private projects: Map<number, Project>;
  private userId: number;
  private templateId: number;
  private projectId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.templates = new Map();
    this.projects = new Map();
    this.userId = 1;
    this.templateId = 1;
    this.projectId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24h - how often expired sessions are removed
    });

    // Add a developer account that automatically has premium tier access
    // Use username: developer, password: developer123
    const devId = this.userId++;
    const devUser: User = {
      id: devId,
      username: "developer",
      email: "dev@launchplate.local",
      password: "$2a$10$Q7X4UVDI1D/ACe0GaS1D6.VEK3YfA.KVJ9.dL6A0Qj1AEiAFsJW9S", // hashed "developer123"
      fullName: "Developer Account",
      createdAt: new Date().toISOString(),
      accountType: "premium", // Premium tier 
      projectsLimit: 30,      // Premium tier limit
      pagesLimit: 3,          // Premium tier limit
      storage: 100,           // Premium tier limit in MB
      canDeploy: true,        // Premium tier capability
      canSaveTemplates: true, // Premium tier capability
      avatarUrl: null,
      isActive: true,
      stripeCustomerId: "dev_customer_id",
      stripeSubscriptionId: "dev_subscription_id"
    };
    this.users.set(devId, devUser);

    // Add some default templates
    this.initDefaultTemplates();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser: User = {
      ...existingUser,
      ...updates,
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Template methods
  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getPublicTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(
      (template) => template.isPublic
    );
  }

  async getUserTemplates(userId: number): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(
      (template) => template.userId === userId
    );
  }

  async getTemplateById(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = this.templateId++;
    const template: Template = { 
      ...insertTemplate, 
      id,
      userId: insertTemplate.userId || 0,
      description: insertTemplate.description || null,
      thumbnail: insertTemplate.thumbnail || null,
      isPublic: insertTemplate.isPublic ?? false
    };
    this.templates.set(id, template);
    return template;
  }

  async updateTemplate(id: number, templateUpdate: Partial<InsertTemplate>): Promise<Template | undefined> {
    const existingTemplate = this.templates.get(id);
    if (!existingTemplate) return undefined;

    const updatedTemplate: Template = { 
      ...existingTemplate, 
      ...templateUpdate,
      userId: templateUpdate.userId ?? existingTemplate.userId,
      description: templateUpdate.description ?? existingTemplate.description,
      thumbnail: templateUpdate.thumbnail ?? existingTemplate.thumbnail,
      isPublic: templateUpdate.isPublic ?? existingTemplate.isPublic
    };
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteTemplate(id: number): Promise<boolean> {
    return this.templates.delete(id);
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getUserProjects(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId
    );
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectId++;
    const project: Project = { 
      ...insertProject, 
      id,
      userId: insertProject.userId || 0,
      description: insertProject.description || null,
      updatedAt: new Date().toISOString(),
      published: insertProject.published ?? false,
      publishedUrl: insertProject.publishedUrl || null
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<InsertProject>): Promise<Project | undefined> {
    const existingProject = this.projects.get(id);
    if (!existingProject) return undefined;

    const updatedProject: Project = { 
      ...existingProject, 
      ...projectUpdate,
      userId: projectUpdate.userId ?? existingProject.userId,
      description: projectUpdate.description ?? existingProject.description,
      updatedAt: new Date().toISOString(),
      published: projectUpdate.published ?? existingProject.published,
      publishedUrl: projectUpdate.publishedUrl ?? existingProject.publishedUrl
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Initialize default templates
  private initDefaultTemplates() {
    const defaultTemplates: InsertTemplate[] = [
      {
        userId: 0, // System templates have userId 0
        name: "Basic Landing Page",
        description: "A simple, clean landing page with essential sections for any product or service",
        thumbnail: "",
        components: [
          {
            id: "header-1",
            type: "header-1",
            content: {
              logo: "LaunchPlate",
              menuItems: [
                { text: "Home", url: "#" },
                { text: "Features", url: "#features" },
                { text: "Pricing", url: "#pricing" },
                { text: "Contact", url: "#contact" }
              ],
              ctaText: "Sign Up",
              ctaUrl: "#signup"
            },
            style: {
              backgroundColor: "#ffffff",
              padding: "16px",
              borderBottom: "1px solid #e5e7eb"
            }
          },
          {
            id: "hero-split",
            type: "hero-split",
            content: {
              heading: "Create Landing Pages That Convert",
              subheading: "Build beautiful, responsive landing pages without any coding skills required.",
              primaryButtonText: "Get Started",
              primaryButtonUrl: "#get-started",
              secondaryButtonText: "Learn More",
              secondaryButtonUrl: "#learn-more",
              imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
            },
            style: {
              backgroundColor: "#f9fafb",
              padding: "64px 16px"
            }
          },
          {
            id: "heading-features",
            type: "heading",
            content: {
              text: "Key Features",
              level: "h2"
            },
            style: {
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              margin: "64px 0 24px",
              color: "#1f2937"
            }
          },
          {
            id: "text-features",
            type: "text-block",
            content: {
              text: "Our platform offers everything you need to create effective landing pages quickly and easily."
            },
            style: {
              textAlign: "center",
              maxWidth: "720px",
              margin: "0 auto 48px",
              fontSize: "1.1rem",
              lineHeight: "1.6",
              color: "#4b5563"
            }
          },
          {
            id: "feature-1",
            type: "text-block",
            content: {
              text: "<div class='grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4'><div class='text-center p-4'><div class='rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mx-auto mb-4'><i class='ri-edit-line text-2xl text-blue-600'></i></div><h3 class='text-lg font-semibold mb-2'>Easy Editor</h3><p class='text-gray-600'>Intuitive drag-and-drop interface makes building pages simple.</p></div><div class='text-center p-4'><div class='rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mx-auto mb-4'><i class='ri-responsive-line text-2xl text-green-600'></i></div><h3 class='text-lg font-semibold mb-2'>Responsive Design</h3><p class='text-gray-600'>Pages look great on all devices, from mobile to desktop.</p></div><div class='text-center p-4'><div class='rounded-full bg-purple-100 w-16 h-16 flex items-center justify-center mx-auto mb-4'><i class='ri-bar-chart-line text-2xl text-purple-600'></i></div><h3 class='text-lg font-semibold mb-2'>Convert Visitors</h3><p class='text-gray-600'>Optimized for conversions with proven design patterns.</p></div></div>"
            },
            style: {
              margin: "48px 0",
              padding: "0"
            }
          },
          {
            id: "spacer-1",
            type: "spacer",
            content: {
              height: 48
            },
            style: {}
          },
          {
            id: "heading-pricing",
            type: "heading",
            content: {
              text: "Simple Pricing",
              level: "h2"
            },
            style: {
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              margin: "64px 0 24px",
              color: "#1f2937"
            }
          },
          {
            id: "text-pricing",
            type: "text-block",
            content: {
              text: "Choose the plan that fits your needs. All plans include all features."
            },
            style: {
              textAlign: "center",
              maxWidth: "720px",
              margin: "0 auto 48px",
              fontSize: "1.1rem",
              lineHeight: "1.6",
              color: "#4b5563"
            }
          },
          {
            id: "pricing-table",
            type: "text-block",
            content: {
              text: "<div class='grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4'><div class='border border-gray-200 rounded-lg p-6 bg-white hover:shadow-lg transition-shadow'><h3 class='text-xl font-bold mb-2'>Starter</h3><p class='text-gray-500 mb-4'>For individuals and small projects</p><div class='text-3xl font-bold mb-4'>$9<span class='text-base font-normal text-gray-500'>/mo</span></div><ul class='space-y-2 mb-6'><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>1 landing page</li><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>Basic analytics</li><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>24/7 support</li></ul><button class='w-full py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50'>Choose Plan</button></div><div class='border-2 border-blue-600 rounded-lg p-6 bg-white relative shadow-lg'><span class='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium'>Popular</span><h3 class='text-xl font-bold mb-2'>Pro</h3><p class='text-gray-500 mb-4'>For growing businesses</p><div class='text-3xl font-bold mb-4'>$29<span class='text-base font-normal text-gray-500'>/mo</span></div><ul class='space-y-2 mb-6'><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>10 landing pages</li><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>Advanced analytics</li><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>Priority support</li><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>Custom domains</li></ul><button class='w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'>Choose Plan</button></div><div class='border border-gray-200 rounded-lg p-6 bg-white hover:shadow-lg transition-shadow'><h3 class='text-xl font-bold mb-2'>Enterprise</h3><p class='text-gray-500 mb-4'>For large organizations</p><div class='text-3xl font-bold mb-4'>$99<span class='text-base font-normal text-gray-500'>/mo</span></div><ul class='space-y-2 mb-6'><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>Unlimited pages</li><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>Complete analytics suite</li><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>Dedicated support</li><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>Team collaboration</li></ul><button class='w-full py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50'>Contact Sales</button></div></div>"
            },
            style: {
              margin: "48px 0",
              padding: "0"
            }
          },
          {
            id: "spacer-2",
            type: "spacer",
            content: {
              height: 48
            },
            style: {}
          },
          {
            id: "form-contact",
            type: "form",
            content: {
              title: "Ready to Get Started?",
              fields: [
                { name: "name", label: "Your Name", type: "text", required: true },
                { name: "email", label: "Email Address", type: "email", required: true },
                { name: "message", label: "Message", type: "textarea", required: false }
              ],
              submitText: "Get Started"
            },
            style: {
              backgroundColor: "#f9fafb",
              padding: "48px 24px",
              margin: "64px 0",
              borderRadius: "8px",
              maxWidth: "720px",
              marginLeft: "auto",
              marginRight: "auto"
            }
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString()
      },
      {
        userId: 0,
        name: "Professional Business",
        description: "A professional business template with clean layout and corporate styling",
        thumbnail: "",
        components: [
          {
            id: "header-2",
            type: "header-2",
            content: {
              logo: "Acme Inc.",
              menuItems: [
                { text: "Home", url: "#" },
                { text: "Services", url: "#services" },
                { text: "About", url: "#about" },
                { text: "Team", url: "#team" },
                { text: "Contact", url: "#contact" }
              ]
            },
            style: {
              backgroundColor: "#ffffff",
              padding: "20px 24px",
              borderBottom: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
            }
          },
          {
            id: "hero-centered",
            type: "hero-centered",
            content: {
              heading: "Trusted Business Solutions",
              subheading: "We provide comprehensive business services to help your company grow and succeed in today's competitive market.",
              buttonText: "Our Services",
              buttonUrl: "#services"
            },
            style: {
              backgroundColor: "#1e3a8a",
              color: "#ffffff",
              padding: "80px 24px",
              textAlign: "center"
            }
          },
          {
            id: "heading-services",
            type: "heading",
            content: {
              text: "Our Services",
              level: "h2"
            },
            style: {
              textAlign: "center",
              fontSize: "2.5rem",
              fontWeight: "bold",
              margin: "64px 0 24px",
              color: "#1f2937"
            }
          },
          {
            id: "text-services",
            type: "text-block",
            content: {
              text: "We offer a range of professional services designed to help your business thrive. Our expert team provides tailored solutions to meet your specific needs."
            },
            style: {
              textAlign: "center",
              maxWidth: "800px",
              margin: "0 auto 48px",
              fontSize: "1.1rem",
              lineHeight: "1.6",
              color: "#4b5563"
            }
          },
          {
            id: "form-contact",
            type: "form",
            content: {
              title: "Get in Touch",
              fields: [
                { name: "name", label: "Your Name", type: "text", required: true },
                { name: "email", label: "Email Address", type: "email", required: true },
                { name: "company", label: "Company Name", type: "text", required: false },
                { name: "message", label: "Message", type: "textarea", required: true }
              ],
              submitText: "Send Message"
            },
            style: {
              backgroundColor: "#f9fafb",
              padding: "48px 24px",
              margin: "64px 0",
              borderRadius: "8px",
              maxWidth: "720px",
              marginLeft: "auto",
              marginRight: "auto"
            }
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString()
      },
      {
        userId: 0,
        name: "Startup Launch",
        description: "A modern, vibrant template perfect for startup product launches",
        thumbnail: "",
        components: [
          {
            id: "header-1",
            type: "header-1",
            content: {
              logo: "RocketStart",
              menuItems: [
                { text: "Home", url: "#" },
                { text: "Product", url: "#product" },
                { text: "Features", url: "#features" },
                { text: "Testimonials", url: "#testimonials" },
                { text: "Pricing", url: "#pricing" }
              ],
              ctaText: "Early Access",
              ctaUrl: "#signup"
            },
            style: {
              backgroundType: "gradient",
              gradientDirection: "to right",
              gradientStartColor: "#7c3aed",
              gradientEndColor: "#9333ea",
              backgroundImage: "linear-gradient(to right, #7c3aed, #9333ea)",
              color: "#ffffff",
              padding: "16px 24px",
              fontFamily: "Poppins, sans-serif"
            }
          },
          {
            id: "hero-centered",
            type: "hero-centered",
            content: {
              heading: "Launch Your Idea Faster",
              subheading: "The all-in-one platform for modern startups. Build, launch, and grow with tools designed for today's entrepreneurs.",
              primaryButtonText: "Get Early Access",
              primaryButtonUrl: "#signup",
              secondaryButtonText: "Watch Demo",
              secondaryButtonUrl: "#demo",
              backgroundImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3"
            },
            style: {
              backgroundType: "image",
              backgroundImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3",
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "#ffffff",
              padding: "120px 24px",
              minHeight: "600px",
              textAlign: "center",
              overlayColor: "rgba(79, 70, 229, 0.85)",
              fontFamily: "Poppins, sans-serif"
            }
          },
          {
            id: "spacer-1",
            type: "spacer",
            content: {
              height: 80
            },
            style: {
              backgroundColor: "#f9fafb"
            }
          },
          {
            id: "heading-features",
            type: "heading",
            content: {
              text: "Revolutionary Features",
              level: "h2"
            },
            style: {
              textAlign: "center",
              fontSize: "2.5rem",
              fontWeight: "bold",
              margin: "0 0 24px",
              color: "#1f2937",
              fontFamily: "Poppins, sans-serif"
            }
          },
          {
            id: "text-features",
            type: "text-block",
            content: {
              text: "Our platform provides everything you need to bring your vision to life quickly and efficiently."
            },
            style: {
              textAlign: "center",
              maxWidth: "720px",
              margin: "0 auto 48px",
              fontSize: "1.1rem",
              lineHeight: "1.6",
              color: "#4b5563",
              fontFamily: "Poppins, sans-serif"
            }
          },
          {
            id: "feature-blocks",
            type: "text-block",
            content: {
              text: "<div class='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4'><div class='bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-purple-600'><div class='rounded-full bg-purple-100 w-16 h-16 flex items-center justify-center mx-auto mb-4'><i class='ri-rocket-line text-2xl text-purple-600'></i></div><h3 class='text-xl font-bold mb-3 text-center'>Quick Launch</h3><p class='text-gray-600'>Go from idea to live product in days instead of months with our streamlined tools and templates.</p></div><div class='bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-indigo-600'><div class='rounded-full bg-indigo-100 w-16 h-16 flex items-center justify-center mx-auto mb-4'><i class='ri-pie-chart-line text-2xl text-indigo-600'></i></div><h3 class='text-xl font-bold mb-3 text-center'>Smart Analytics</h3><p class='text-gray-600'>Make data-driven decisions with real-time insights and comprehensive analytics dashboards.</p></div><div class='bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-pink-600'><div class='rounded-full bg-pink-100 w-16 h-16 flex items-center justify-center mx-auto mb-4'><i class='ri-customer-service-line text-2xl text-pink-600'></i></div><h3 class='text-xl font-bold mb-3 text-center'>24/7 Support</h3><p class='text-gray-600'>Our expert support team is always available to help solve problems and answer questions.</p></div></div>"
            },
            style: {
              margin: "48px 0",
              padding: "0 16px"
            }
          },
          {
            id: "divider-1",
            type: "divider",
            content: {
              style: "gradient"
            },
            style: {
              margin: "64px auto",
              maxWidth: "120px",
              height: "4px",
              background: "linear-gradient(to right, #7c3aed, #ec4899)"
            }
          },
          {
            id: "testimonial-section",
            type: "text-block",
            content: {
              text: "<div class='max-w-6xl mx-auto px-4'><h2 class='text-2xl md:text-3xl font-bold text-center mb-12'>What Our Users Say</h2><div class='grid md:grid-cols-2 gap-8'><div class='bg-white p-6 rounded-xl shadow-md border border-gray-100'><div class='flex items-center mb-4'><img src='https://randomuser.me/api/portraits/women/32.jpg' alt='Testimonial' class='w-14 h-14 rounded-full mr-4'><div><h4 class='font-bold'>Sarah Johnson</h4><p class='text-gray-500 text-sm'>Founder, TechStart</p></div></div><div class='text-gray-700'><i class='ri-double-quotes-l text-purple-400 text-2xl'></i><p class='my-2'>RocketStart helped us launch our MVP in just two weeks! The intuitive interface and pre-built components saved us countless development hours.</p><div class='flex mt-2'><i class='ri-star-fill text-yellow-500'></i><i class='ri-star-fill text-yellow-500'></i><i class='ri-star-fill text-yellow-500'></i><i class='ri-star-fill text-yellow-500'></i><i class='ri-star-fill text-yellow-500'></i></div></div></div><div class='bg-white p-6 rounded-xl shadow-md border border-gray-100'><div class='flex items-center mb-4'><img src='https://randomuser.me/api/portraits/men/47.jpg' alt='Testimonial' class='w-14 h-14 rounded-full mr-4'><div><h4 class='font-bold'>David Chen</h4><p class='text-gray-500 text-sm'>CEO, InnovateCo</p></div></div><div class='text-gray-700'><i class='ri-double-quotes-l text-purple-400 text-2xl'></i><p class='my-2'>The analytics tools are incredible. We've been able to track user engagement and optimize our funnel in ways we never could before.</p><div class='flex mt-2'><i class='ri-star-fill text-yellow-500'></i><i class='ri-star-fill text-yellow-500'></i><i class='ri-star-fill text-yellow-500'></i><i class='ri-star-fill text-yellow-500'></i><i class='ri-star-fill text-yellow-500'></i></div></div></div></div></div>"
            },
            style: {
              margin: "64px 0",
              padding: "0 16px",
              backgroundColor: "#f9fafb"
            }
          },
          {
            id: "pricing-section",
            type: "text-block",
            content: {
              text: "<div class='max-w-6xl mx-auto px-4'><h2 class='text-3xl font-bold text-center mb-4' id='pricing'>Transparent Pricing</h2><p class='text-center text-gray-600 max-w-xl mx-auto mb-12'>Choose the plan that fits your needs. All plans include all features.</p><div class='grid md:grid-cols-3 gap-8'><div class='bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-200 transform hover:-translate-y-1'><div class='text-center border-b pb-4'><h3 class='text-xl font-bold mb-1'>Starter</h3><p class='text-gray-500 mb-4'>For early-stage startups</p><div class='text-3xl font-bold mb-2'><span class='text-gray-500 text-lg'>$</span>29<span class='text-base font-normal text-gray-500'>/mo</span></div></div><ul class='mt-6 space-y-3 mb-6'><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>Up to 5 team members</li><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>Basic analytics</li><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>1,000 monthly active users</li><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>Email support</li></ul><button class='w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all'>Choose Starter</button></div><div class='bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-400 transform hover:-translate-y-1 relative'><div class='absolute -top-3 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium'>Popular</div><div class='text-center border-b pb-4'><h3 class='text-xl font-bold mb-1'>Pro</h3><p class='text-gray-500 mb-4'>For growing companies</p><div class='text-3xl font-bold mb-2'><span class='text-gray-500 text-lg'>$</span>79<span class='text-base font-normal text-gray-500'>/mo</span></div></div><ul class='mt-6 space-y-3 mb-6'><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>Up to 20 team members</li><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>Advanced analytics</li><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>10,000 monthly active users</li><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>Priority support</li><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>Custom branding</li></ul><button class='w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all'>Choose Pro</button></div><div class='bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-200 transform hover:-translate-y-1'><div class='text-center border-b pb-4'><h3 class='text-xl font-bold mb-1'>Enterprise</h3><p class='text-gray-500 mb-4'>For large organizations</p><div class='text-3xl font-bold mb-2'><span class='text-gray-500 text-lg'>$</span>199<span class='text-base font-normal text-gray-500'>/mo</span></div></div><ul class='mt-6 space-y-3 mb-6'><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>Unlimited team members</li><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>Custom reporting</li><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>Unlimited users</li><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>24/7 phone & email support</li><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>Custom integrations</li><li class='flex items-center'><i class='ri-check-line text-green-500 mr-2'></i>Dedicated account manager</li></ul><button class='w-full py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-all'>Contact Sales</button></div></div></div>"
            },
            style: {
              margin: "80px 0",
              padding: "64px 0",
              backgroundColor: "#ffffff"
            }
          },
          {
            id: "email-signup",
            type: "email-signup",
            content: {
              title: "Join the Waitlist",
              description: "Be the first to know when we launch. Get exclusive early access and special offers.",
              buttonText: "Join Now",
              placeholder: "Enter your email address"
            },
            style: {
              backgroundType: "gradient",
              gradientDirection: "to right",
              gradientStartColor: "#7c3aed",
              gradientEndColor: "#ec4899",
              backgroundImage: "linear-gradient(to right, #7c3aed, #ec4899)",
              color: "#ffffff",
              padding: "64px 24px",
              borderRadius: "16px",
              maxWidth: "1024px",
              margin: "80px auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              fontFamily: "Poppins, sans-serif"
            }
          },
          {
            id: "footer-section",
            type: "text-block",
            content: {
              text: "<footer class='max-w-6xl mx-auto px-4 pb-12'><div class='grid md:grid-cols-4 gap-8 py-8'><div><h3 class='font-bold text-lg mb-4'>RocketStart</h3><p class='text-gray-600 mb-4'>Launch your startup faster with our all-in-one platform.</p><div class='flex space-x-4'><a href='#' class='text-gray-400 hover:text-gray-800'><i class='ri-twitter-fill text-xl'></i></a><a href='#' class='text-gray-400 hover:text-gray-800'><i class='ri-facebook-fill text-xl'></i></a><a href='#' class='text-gray-400 hover:text-gray-800'><i class='ri-instagram-fill text-xl'></i></a><a href='#' class='text-gray-400 hover:text-gray-800'><i class='ri-linkedin-fill text-xl'></i></a></div></div><div><h3 class='font-bold mb-4'>Product</h3><ul class='space-y-2'><li><a href='#' class='text-gray-600 hover:text-purple-600'>Features</a></li><li><a href='#' class='text-gray-600 hover:text-purple-600'>Pricing</a></li><li><a href='#' class='text-gray-600 hover:text-purple-600'>Testimonials</a></li><li><a href='#' class='text-gray-600 hover:text-purple-600'>FAQ</a></li></ul></div><div><h3 class='font-bold mb-4'>Resources</h3><ul class='space-y-2'><li><a href='#' class='text-gray-600 hover:text-purple-600'>Blog</a></li><li><a href='#' class='text-gray-600 hover:text-purple-600'>Documentation</a></li><li><a href='#' class='text-gray-600 hover:text-purple-600'>Community</a></li><li><a href='#' class='text-gray-600 hover:text-purple-600'>Support</a></li></ul></div><div><h3 class='font-bold mb-4'>Company</h3><ul class='space-y-2'><li><a href='#' class='text-gray-600 hover:text-purple-600'>About</a></li><li><a href='#' class='text-gray-600 hover:text-purple-600'>Careers</a></li><li><a href='#' class='text-gray-600 hover:text-purple-600'>Contact</a></li><li><a href='#' class='text-gray-600 hover:text-purple-600'>Privacy & Terms</a></li></ul></div></div><div class='border-t border-gray-200 pt-8 text-center text-gray-500 text-sm'>© 2025 RocketStart. All rights reserved.</div></footer>"
            },
            style: {
              backgroundColor: "#f9fafb",
              padding: "0 16px",
              fontFamily: "Poppins, sans-serif"
            }
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString()
      },
      {
        userId: 0,
        name: "Portfolio Showcase",
        description: "A minimal, elegant template for personal portfolios and showcases",
        thumbnail: "",
        components: [
          {
            id: "header-2",
            type: "header-2",
            content: {
              logo: "Alexandra Design",
              menuItems: [
                { text: "Home", url: "#" },
                { text: "Portfolio", url: "#portfolio" },
                { text: "About", url: "#about" },
                { text: "Services", url: "#services" },
                { text: "Contact", url: "#contact" }
              ]
            },
            style: {
              backgroundColor: "#ffffff",
              padding: "24px",
              fontFamily: "'Playfair Display', serif",
              borderBottom: "1px solid #f0f0f0"
            }
          },
          {
            id: "hero-centered",
            type: "hero-centered",
            content: {
              heading: "Crafting Digital Experiences",
              subheading: "Transforming ideas into beautiful, functional digital experiences that help brands tell their stories and connect with their audience.",
              primaryButtonText: "View My Work",
              primaryButtonUrl: "#portfolio",
              secondaryButtonText: "Contact Me",
              secondaryButtonUrl: "#contact",
              backgroundImage: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.0.3"
            },
            style: {
              backgroundType: "image",
              backgroundImage: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.0.3",
              backgroundSize: "cover",
              backgroundPosition: "center",
              padding: "140px 24px",
              minHeight: "85vh",
              textAlign: "center",
              overlayColor: "rgba(0, 0, 0, 0.7)",
              color: "#ffffff",
              fontFamily: "'Playfair Display', serif"
            }
          },
          {
            id: "spacer-1",
            type: "spacer",
            content: {
              height: 80
            },
            style: {
              backgroundColor: "#ffffff"
            }
          },
          {
            id: "portfolio-section",
            type: "text-block",
            content: {
              text: "<div class='max-w-6xl mx-auto px-4' id='portfolio'><h2 class='text-3xl md:text-4xl font-bold mb-10 text-center relative inline-block'><span class='relative z-10'>Selected Works</span><span class='absolute bottom-0 left-0 w-full h-3 bg-yellow-200 transform -rotate-1 z-0'></span></h2><div class='grid md:grid-cols-2 lg:grid-cols-3 gap-6'><div class='group relative overflow-hidden rounded-lg transition-all duration-300 transform hover:-translate-y-2'><img src='https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3' alt='Project 1' class='w-full aspect-video object-cover transform transition-transform duration-500 group-hover:scale-110'><div class='absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div><div class='absolute bottom-0 left-0 p-4 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300'><h3 class='text-xl font-semibold'>E-Commerce Redesign</h3><p class='text-sm text-gray-200'>UX/UI Design, Development</p></div></div><div class='group relative overflow-hidden rounded-lg transition-all duration-300 transform hover:-translate-y-2'><img src='https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3' alt='Project 2' class='w-full aspect-video object-cover transform transition-transform duration-500 group-hover:scale-110'><div class='absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div><div class='absolute bottom-0 left-0 p-4 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300'><h3 class='text-xl font-semibold'>Finance App</h3><p class='text-sm text-gray-200'>Mobile App Design</p></div></div><div class='group relative overflow-hidden rounded-lg transition-all duration-300 transform hover:-translate-y-2'><img src='https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3' alt='Project 3' class='w-full aspect-video object-cover transform transition-transform duration-500 group-hover:scale-110'><div class='absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div><div class='absolute bottom-0 left-0 p-4 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300'><h3 class='text-xl font-semibold'>Brand Identity</h3><p class='text-sm text-gray-200'>Logo Design, Branding</p></div></div><div class='group relative overflow-hidden rounded-lg transition-all duration-300 transform hover:-translate-y-2'><img src='https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3' alt='Project 4' class='w-full aspect-video object-cover transform transition-transform duration-500 group-hover:scale-110'><div class='absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div><div class='absolute bottom-0 left-0 p-4 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300'><h3 class='text-xl font-semibold'>Coffee Shop Website</h3><p class='text-sm text-gray-200'>Web Design, Development</p></div></div><div class='group relative overflow-hidden rounded-lg transition-all duration-300 transform hover:-translate-y-2'><img src='https://images.unsplash.com/photo-1558655146-605d86ed31b3?ixlib=rb-4.0.3' alt='Project 5' class='w-full aspect-video object-cover transform transition-transform duration-500 group-hover:scale-110'><div class='absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div><div class='absolute bottom-0 left-0 p-4 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300'><h3 class='text-xl font-semibold'>Health & Wellness App</h3><p class='text-sm text-gray-200'>UX/UI Design, Development</p></div></div><div class='group relative overflow-hidden rounded-lg transition-all duration-300 transform hover:-translate-y-2'><img src='https://images.unsplash.com/photo-1629429407673-58e58883c777?ixlib=rb-4.0.3' alt='Project 6' class='w-full aspect-video object-cover transform transition-transform duration-500 group-hover:scale-110'><div class='absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div><div class='absolute bottom-0 left-0 p-4 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300'><h3 class='text-xl font-semibold'>Educational Platform</h3><p class='text-sm text-gray-200'>Web App Design</p></div></div></div></div>"
            },
            style: {
              padding: "0px",
              margin: "0px 0px 80px 0px"
            }
          },
          {
            id: "divider-1",
            type: "divider",
            content: {
              style: "solid"
            },
            style: {
              margin: "0px auto 80px",
              maxWidth: "200px",
              height: "1px",
              backgroundColor: "#e5e7eb"
            }
          },
          {
            id: "about-section",
            type: "text-block",
            content: {
              text: "<div class='max-w-6xl mx-auto px-4' id='about'><div class='grid md:grid-cols-2 gap-12 items-center'><div class='relative'><img src='https://images.unsplash.com/photo-1580609a3622a291d3a0a9e3a52995ece?ixlib=rb-4.0.3' alt='Portrait' class='rounded-lg shadow-xl z-10 relative'><div class='absolute -bottom-4 -right-4 w-64 h-64 bg-yellow-100 rounded-lg -z-10'></div></div><div><h2 class='text-3xl md:text-4xl font-bold mb-6 relative inline-block'><span class='relative z-10'>About Me</span><span class='absolute bottom-0 left-0 w-full h-3 bg-yellow-200 transform -rotate-1 z-0'></span></h2><p class='text-gray-700 mb-6 leading-relaxed'>With over 10 years of experience in design and development, I bring a unique blend of creative and technical expertise to every project. My design philosophy centers around creating intuitive, beautiful digital experiences that solve real problems.</p><p class='text-gray-700 mb-8 leading-relaxed'>I've worked with clients ranging from startups to Fortune 500 companies, helping them build brand identities, websites, and digital products that connect with their audiences and drive business growth.</p><div class='flex flex-wrap gap-3'><span class='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm'>UX/UI Design</span><span class='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm'>Web Development</span><span class='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm'>Branding</span><span class='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm'>Mobile Design</span><span class='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm'>Illustration</span></div></div></div></div>"
            },
            style: {
              padding: "0px",
              margin: "0px 0px 100px 0px"
            }
          },
          {
            id: "services-section",
            type: "text-block",
            content: {
              text: "<div class='max-w-6xl mx-auto px-4 py-20 bg-gray-50' id='services'><h2 class='text-3xl md:text-4xl font-bold mb-12 text-center relative inline-block'><span class='relative z-10'>Services</span><span class='absolute bottom-0 left-0 w-full h-3 bg-yellow-200 transform -rotate-1 z-0'></span></h2><div class='grid md:grid-cols-2 lg:grid-cols-3 gap-10'><div class='p-6 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md'><div class='w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4'><i class='ri-layout-4-line text-yellow-700 text-xl'></i></div><h3 class='text-xl font-bold mb-3'>UX/UI Design</h3><p class='text-gray-600'>Creating intuitive, user-centered digital experiences that solve real problems with beautiful, functional interfaces.</p></div><div class='p-6 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md'><div class='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4'><i class='ri-code-s-slash-line text-blue-700 text-xl'></i></div><h3 class='text-xl font-bold mb-3'>Web Development</h3><p class='text-gray-600'>Building responsive, performant websites and applications using modern frameworks and best practices.</p></div><div class='p-6 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md'><div class='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4'><i class='ri-paint-brush-line text-green-700 text-xl'></i></div><h3 class='text-xl font-bold mb-3'>Branding</h3><p class='text-gray-600'>Developing cohesive brand identities that communicate your values and resonate with your target audience.</p></div><div class='p-6 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md'><div class='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4'><i class='ri-smartphone-line text-purple-700 text-xl'></i></div><h3 class='text-xl font-bold mb-3'>Mobile Design</h3><p class='text-gray-600'>Designing engaging mobile experiences that are optimized for touch interactions and different screen sizes.</p></div><div class='p-6 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md'><div class='w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4'><i class='ri-store-line text-red-700 text-xl'></i></div><h3 class='text-xl font-bold mb-3'>E-Commerce</h3><p class='text-gray-600'>Building intuitive shopping experiences that convert visitors into customers with seamless checkout flows.</p></div><div class='p-6 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md'><div class='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4'><i class='ri-line-chart-line text-orange-700 text-xl'></i></div><h3 class='text-xl font-bold mb-3'>SEO & Analytics</h3><p class='text-gray-600'>Optimizing websites for search engines and implementing analytics to track performance and user behavior.</p></div></div></div>"
            },
            style: {
              padding: "0px",
              margin: "0px 0px 80px 0px",
              backgroundColor: "#f9fafb"
            }
          },
          {
            id: "testimonial-section",
            type: "text-block",
            content: {
              text: "<div class='max-w-5xl mx-auto px-4 py-16'><h2 class='text-3xl md:text-4xl font-bold mb-12 text-center relative inline-block'><span class='relative z-10'>Client Feedback</span><span class='absolute bottom-0 left-0 w-full h-3 bg-yellow-200 transform -rotate-1 z-0'></span></h2><div class='px-8 py-10 bg-white rounded-xl shadow-lg border border-gray-100 mb-12 relative'><div class='absolute -top-5 left-10 text-6xl text-yellow-300'>\"</div><p class='text-gray-700 mb-6 text-lg italic relative z-10'>Alexandra transformed our outdated website into a beautiful, functional platform that perfectly represents our brand. Her attention to detail and user-centered approach resulted in a significant increase in engagement and conversions.</p><div class='flex items-center'><img src='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3' class='w-12 h-12 rounded-full mr-4' alt='Client'><div><h4 class='font-bold'>Sarah Johnson</h4><p class='text-gray-600 text-sm'>CEO, TechStart Inc.</p></div></div></div><div class='grid md:grid-cols-2 gap-8'><div class='px-6 py-8 bg-white rounded-xl shadow-sm border border-gray-100 relative'><div class='absolute -top-4 left-8 text-4xl text-yellow-300'>\"</div><p class='text-gray-700 mb-5 relative z-10'>Working with Alexandra was a pleasure. She took the time to understand our business goals and delivered a design that exceeded our expectations.</p><div class='flex items-center'><img src='https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3' class='w-10 h-10 rounded-full mr-3' alt='Client'><div><h4 class='font-bold text-sm'>Michael Chen</h4><p class='text-gray-600 text-xs'>Marketing Director, GrowthCo</p></div></div></div><div class='px-6 py-8 bg-white rounded-xl shadow-sm border border-gray-100 relative'><div class='absolute -top-4 left-8 text-4xl text-yellow-300'>\"</div><p class='text-gray-700 mb-5 relative z-10'>Alexandra's design skills are matched by her technical expertise. The website she created for us is not only beautiful but also performs exceptionally well.</p><div class='flex items-center'><img src='https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3' class='w-10 h-10 rounded-full mr-3' alt='Client'><div><h4 class='font-bold text-sm'>Emily Rodriguez</h4><p class='text-gray-600 text-xs'>Founder, Creative Solutions</p></div></div></div></div></div>"
            },
            style: {
              padding: "0px",
              margin: "0px 0px 80px 0px"
            }
          },
          {
            id: "contact-section",
            type: "form",
            content: {
              title: "Let's Work Together",
              fields: [
                { name: "name", label: "Your Name", type: "text", required: true },
                { name: "email", label: "Email Address", type: "email", required: true },
                { name: "service", label: "Service Needed", type: "select", 
                  options: [
                    "UX/UI Design", 
                    "Web Development", 
                    "Branding",
                    "Mobile Design",
                    "E-Commerce",
                    "Other"
                  ],
                  required: true 
                },
                { name: "message", label: "Project Details", type: "textarea", required: true }
              ],
              submitText: "Send Message"
            },
            style: {
              backgroundColor: "#f9fafb",
              padding: "64px 32px",
              margin: "0px 0px 0px 0px",
              borderRadius: "0px",
              maxWidth: "900px",
              marginLeft: "auto",
              marginRight: "auto",
              fontFamily: "'Playfair Display', serif",
              boxShadow: "none",
              border: "none"
            }
          },
          {
            id: "footer-section",
            type: "text-block",
            content: {
              text: "<footer class='bg-gray-900 text-white py-12'><div class='max-w-6xl mx-auto px-4'><div class='grid md:grid-cols-3 gap-8 mb-8'><div><h3 class='text-xl font-bold mb-4'>Alexandra Design</h3><p class='text-gray-400 mb-4'>Creating beautiful digital experiences that connect, engage, and inspire.</p><div class='flex space-x-4'><a href='#' class='text-gray-400 hover:text-white transition-colors'><i class='ri-instagram-line text-xl'></i></a><a href='#' class='text-gray-400 hover:text-white transition-colors'><i class='ri-dribbble-line text-xl'></i></a><a href='#' class='text-gray-400 hover:text-white transition-colors'><i class='ri-behance-line text-xl'></i></a><a href='#' class='text-gray-400 hover:text-white transition-colors'><i class='ri-linkedin-line text-xl'></i></a></div></div><div><h3 class='text-xl font-bold mb-4'>Contact</h3><ul class='space-y-2 text-gray-400'><li class='flex items-center'><i class='ri-mail-line mr-2'></i>hello@alexandradesign.com</li><li class='flex items-center'><i class='ri-phone-line mr-2'></i>+1 (555) 123-4567</li><li class='flex items-center'><i class='ri-map-pin-line mr-2'></i>San Francisco, CA</li></ul></div><div><h3 class='text-xl font-bold mb-4'>Quick Links</h3><ul class='space-y-2 text-gray-400'><li><a href='#portfolio' class='hover:text-white transition-colors'>Portfolio</a></li><li><a href='#services' class='hover:text-white transition-colors'>Services</a></li><li><a href='#about' class='hover:text-white transition-colors'>About</a></li><li><a href='#contact' class='hover:text-white transition-colors'>Contact</a></li></ul></div></div><div class='border-t border-gray-800 pt-8 text-center text-gray-500'>© 2025 Alexandra Design. All rights reserved.</div></div></footer>"
            },
            style: {
              padding: "0px",
              margin: "0px"
            }
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString()
      }
    ];

    defaultTemplates.forEach(template => {
      const id = this.templateId++;
      this.templates.set(id, { 
        ...template, 
        id,
        userId: template.userId || 0,
        description: template.description || null,
        thumbnail: template.thumbnail || null,
        isPublic: template.isPublic || false
      });
    });
  }
}

export const storage = new MemStorage();
