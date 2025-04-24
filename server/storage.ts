import { InsertUser, User, InsertTemplate, Template, InsertProject, Project, SubscriptionTiers } from "../shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

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
    this.userId = 3; // Start at 3 to account for 1 = admin, 2 = guest
    this.templateId = 6; // Start at 6 to account for 5 default templates
    this.projectId = 1;
    
    // Create a memory-based session store
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Create a default admin user
    const adminUser: User = {
      id: 1,
      username: "admin",
      email: "admin@example.com",
      password: "$2a$10$R4C1s/f7YVqRwX.9HFnGw.ZPYh5FiIBCJHx0M.zBsNVKJf3BnF8Z2", // 'password'
      fullName: "Admin User",
      accountType: SubscriptionTiers.PREMIUM,
      projectsLimit: 100,
      pagesLimit: 10,
      storage: 10 * 1024 * 1024 * 1024, // 10GB
      canDeploy: true,
      canSaveTemplates: true,
      avatarUrl: null,
      isActive: true,
      createdAt: new Date().toISOString(),
      stripeCustomerId: null,
      stripeSubscriptionId: null
    };
    
    // Create a guest user for demos
    const guestUser: User = {
      id: 2,
      username: "guest_9bde299f6f9c9d62",
      email: "guest@example.com",
      password: "$2a$10$R4C1s/f7YVqRwX.9HFnGw.ZPYh5FiIBCJHx0M.zBsNVKJf3BnF8Z2", // 'password'
      fullName: "Guest User",
      accountType: SubscriptionTiers.GUEST,
      projectsLimit: 1,
      pagesLimit: 1,
      storage: 10 * 1024 * 1024, // 10MB
      canDeploy: false,
      canSaveTemplates: false,
      avatarUrl: null,
      isActive: true,
      createdAt: new Date().toISOString(),
      stripeCustomerId: null,
      stripeSubscriptionId: null
    };
    
    this.users.set(adminUser.id, adminUser);
    this.users.set(guestUser.id, guestUser);
    
    // Initialize with default templates
    this.initDefaultTemplates();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { 
      ...insertUser, 
      id: this.userId++,
      accountType: SubscriptionTiers.FREE,
      projectsLimit: 3,
      pagesLimit: 1,
      storage: 100 * 1024 * 1024, // 100MB
      canDeploy: false,
      canSaveTemplates: false,
      avatarUrl: null,
      isActive: true,
      createdAt: new Date().toISOString(),
      stripeCustomerId: null,
      stripeSubscriptionId: null
    };
    
    this.users.set(user.id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      ...updates
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }
  
  async getPublicTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(t => t.isPublic);
  }
  
  async getUserTemplates(userId: number): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(t => t.userId === userId || t.isPublic);
  }
  
  async getTemplateById(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }
  
  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const template: Template = { 
      ...insertTemplate, 
      id: this.templateId++,
      createdAt: new Date().toISOString()
    };
    
    this.templates.set(template.id, template);
    return template;
  }
  
  async updateTemplate(id: number, templateUpdate: Partial<InsertTemplate>): Promise<Template | undefined> {
    const template = this.templates.get(id);
    if (!template) return undefined;
    
    const updatedTemplate: Template = { 
      ...template,
      ...templateUpdate
    };
    
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }
  
  async deleteTemplate(id: number): Promise<boolean> {
    return this.templates.delete(id);
  }
  
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }
  
  async getUserProjects(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(p => p.userId === userId);
  }
  
  async getProjectById(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const project: Project = { 
      ...insertProject, 
      id: this.projectId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.projects.set(project.id, project);
    return project;
  }
  
  async updateProject(id: number, projectUpdate: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject: Project = { 
      ...project,
      ...projectUpdate,
      updatedAt: new Date().toISOString()
    };
    
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }
  
  private initDefaultTemplates() {
    const defaultTemplates: Template[] = [
      {
        id: 1,
        userId: 0,
        name: "Music Distribution",
        description: "A vibrant landing page for music distribution service with a modern gradient design and musician-focused sections",
        thumbnail: "",
        components: [
          {
            id: "header",
            type: "header-1",
            content: {
              logo: "SoundLaunch",
              menuItems: [
                { text: "Home", url: "#" },
                { text: "Features", url: "#features" },
                { text: "Pricing", url: "#pricing" },
                { text: "Artists", url: "#artists" },
                { text: "Support", url: "#support" }
              ],
              ctaText: "Start Free",
              ctaUrl: "#signup"
            },
            style: {
              backgroundColor: "#0f0f12",
              padding: "16px 24px",
              color: "#ffffff",
              borderBottom: "1px solid #2d2d36",
              fontFamily: "Inter, sans-serif"
            }
          },
          {
            id: "hero",
            type: "hero-gradient",
            content: {
              heading: "Launch Your Music To The World",
              subheading: "The all-in-one platform for independent artists to distribute, promote, and monetize their music across all major streaming platforms.",
              primaryButtonText: "Get Started Free",
              primaryButtonUrl: "#signup",
              secondaryButtonText: "See How It Works",
              secondaryButtonUrl: "#how-it-works"
            },
            style: {
              backgroundType: "gradient",
              gradientDirection: "to right",
              gradientStartColor: "#3c096c",
              gradientEndColor: "#7b2cbf",
              backgroundImage: "linear-gradient(to right, #3c096c, #7b2cbf)",
              color: "#ffffff",
              textAlign: "center",
              padding: "120px 24px",
              fontFamily: "Inter, sans-serif"
            }
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        userId: 0,
        name: "Professional Business Pro",
        description: "A modern, professional template with a clean design for business consulting services",
        thumbnail: "",
        components: [
          {
            id: "header-business",
            type: "header-1",
            content: {
              logo: "BusinessPro",
              menuItems: [
                { text: "Home", url: "#" },
                { text: "Services", url: "#services" },
                { text: "About", url: "#about" },
                { text: "Team", url: "#team" },
                { text: "Contact", url: "#contact" }
              ],
              ctaText: "Get Started",
              ctaUrl: "#contact"
            },
            style: {
              backgroundColor: "#ffffff",
              padding: "16px 24px",
              color: "#1e293b",
              borderBottom: "1px solid #f1f5f9",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              fontFamily: "Inter, sans-serif"
            }
          },
          {
            id: "hero-business",
            type: "hero-centered",
            content: {
              heading: "Professional Business Solutions",
              subheading: "We provide strategic consulting services to help your business grow and succeed in today's competitive market.",
              primaryButtonText: "Our Services",
              primaryButtonUrl: "#services",
              secondaryButtonText: "Contact Us",
              secondaryButtonUrl: "#contact",
              backgroundImage: ""
            },
            style: {
              backgroundColor: "#f8fafc",
              padding: "100px 24px",
              color: "#1e293b",
              textAlign: "center",
              fontFamily: "Inter, sans-serif"
            }
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        userId: 0,
        name: "Premium E-Commerce Shop",
        description: "A modern e-commerce template with elegant product displays and conversion-focused design elements",
        thumbnail: "",
        components: [
          {
            id: "header-ecommerce",
            type: "header-1",
            content: {
              logo: "ShopWave",
              menuItems: [
                { text: "Home", url: "#" },
                { text: "Shop", url: "#shop" },
                { text: "Collections", url: "#collections" },
                { text: "Sale", url: "#sale" },
                { text: "About", url: "#about" }
              ],
              ctaText: "Cart (0)",
              ctaUrl: "#cart"
            },
            style: {
              backgroundColor: "#ffffff",
              padding: "16px 24px",
              color: "#334155",
              borderBottom: "1px solid #f1f5f9",
              fontFamily: "Inter, sans-serif"
            }
          },
          {
            id: "hero-ecommerce",
            type: "hero-split",
            content: {
              heading: "Summer Collection 2025",
              subheading: "Discover our latest styles perfect for the summer season. High-quality materials with exceptional comfort.",
              buttonText: "Shop Now",
              buttonUrl: "#shop",
              imageUrl: "",
              imageAlt: "Summer collection showcase"
            },
            style: {
              backgroundColor: "#f8fafc",
              padding: "80px 24px",
              color: "#334155",
              fontFamily: "Inter, sans-serif"
            }
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        userId: 0,
        name: "Premium Membership",
        description: "A membership landing page for subscription services with pricing tiers and feature comparisons",
        thumbnail: "",
        components: [
          {
            id: "header-membership",
            type: "header-1",
            content: {
              logo: "MemberHub",
              menuItems: [
                { text: "Home", url: "#" },
                { text: "Features", url: "#features" },
                { text: "Pricing", url: "#pricing" },
                { text: "Testimonials", url: "#testimonials" },
                { text: "FAQ", url: "#faq" }
              ],
              ctaText: "Sign In",
              ctaUrl: "#signin"
            },
            style: {
              backgroundColor: "#111827",
              padding: "16px 24px",
              color: "#ffffff",
              borderBottom: "1px solid #1f2937",
              fontFamily: "Inter, sans-serif"
            }
          },
          {
            id: "hero-membership",
            type: "hero-centered",
            content: {
              heading: "Premium Membership For Premium Results",
              subheading: "Join thousands of members who are transforming their lives with exclusive access to premium content, tools, and community.",
              primaryButtonText: "Start Free Trial",
              primaryButtonUrl: "#signup",
              secondaryButtonText: "View Pricing",
              secondaryButtonUrl: "#pricing",
              backgroundImage: ""
            },
            style: {
              backgroundType: "gradient",
              gradientDirection: "to bottom right",
              gradientStartColor: "#111827",
              gradientEndColor: "#374151",
              backgroundImage: "linear-gradient(to bottom right, #111827, #374151)",
              color: "#ffffff",
              padding: "100px 24px",
              textAlign: "center",
              fontFamily: "Inter, sans-serif"
            }
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 5,
        userId: 0,
        name: "Startup Launch",
        description: "A modern, vibrant template inspired by Stripe's design, perfect for SaaS and startup product launches",
        thumbnail: "",
        components: [
          {
            id: "header-startup",
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
              fontFamily: "Inter, sans-serif"
            }
          },
          {
            id: "hero-startup",
            type: "hero-centered",
            content: {
              heading: "Launch Your Idea Faster",
              subheading: "The all-in-one platform for modern startups. Build, launch, and grow with tools designed for today's entrepreneurs.",
              primaryButtonText: "Get Early Access",
              primaryButtonUrl: "#signup",
              secondaryButtonText: "Watch Demo",
              secondaryButtonUrl: "#demo",
              backgroundImage: ""
            },
            style: {
              backgroundColor: "#f8fafc",
              padding: "120px 24px",
              color: "#1e293b",
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
              position: "relative"
            }
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString()
      }
    ];
    
    for (const template of defaultTemplates) {
      this.templates.set(template.id, template);
    }
  }
}

export const storage = new MemStorage();