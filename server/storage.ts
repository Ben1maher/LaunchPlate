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
        name: "Personal Trainer",
        description: "A dynamic template for fitness professionals with an energetic design",
        thumbnail: "",
        components: [
          {
            id: "header-1",
            type: "header-1",
            content: {
              logoText: "Fit<span class='text-primary'>Zone</span>",
              menuItems: [
                { text: "Services", url: "#services" },
                { text: "About", url: "#about" },
                { text: "Testimonials", url: "#testimonials" },
                { text: "Contact", url: "#contact" }
              ]
            },
            style: {
              backgroundColor: "#1A1A1A",
              textColor: "#ffffff",
              accentColor: "#22C55E"
            }
          },
          {
            id: "hero-section",
            type: "hero-split",
            content: {
              heading: "Transform Your Body & Mind",
              description: "Personalized fitness training designed to help you reach your goals and feel your best",
              primaryButtonText: "Start Your Journey",
              secondaryButtonText: "Free Consultation"
            },
            style: {
              backgroundColor: "#1A1A1A",
              headingColor: "#ffffff",
              textColor: "#D1D5DB",
              paddingTop: "80px",
              paddingBottom: "80px"
            }
          },
          {
            id: "services-section",
            type: "feature-cards",
            content: {
              title: "Training Programs",
              features: [
                {
                  title: "Personal Training",
                  description: "One-on-one sessions tailored to your specific needs",
                  icon: "ri-user-heart-line"
                },
                {
                  title: "Group Fitness",
                  description: "High-energy classes that motivate and inspire",
                  icon: "ri-group-line"
                },
                {
                  title: "Nutrition Planning",
                  description: "Custom meal plans to complement your fitness routine",
                  icon: "ri-restaurant-line"
                }
              ]
            },
            style: {
              backgroundColor: "#F7FEF9",
              headingColor: "#064E3B",
              textColor: "#374151",
              padding: "64px"
            }
          },
          {
            id: "testimonial-section",
            type: "testimonial-single",
            content: {
              quote: "Working with FitZone transformed not just my body, but my entire outlook on health and wellness. The personalized approach made all the difference.",
              author: "Sarah Johnson",
              role: "Lost 30lbs in 6 months"
            },
            style: {
              backgroundColor: "#E2FCEF",
              quoteColor: "#064E3B",
              textColor: "#374151",
              padding: "64px"
            }
          },
          {
            id: "cta-section",
            type: "email-signup",
            content: {
              heading: "Ready to Get Started?",
              description: "Sign up for a free consultation and take the first step toward a healthier you.",
              inputPlaceholder: "Your email",
              buttonText: "Book Now"
            },
            style: {
              backgroundColor: "#22C55E",
              headingColor: "#ffffff",
              textColor: "#F7FEF9",
              padding: "64px"
            }
          },
          {
            id: "footer-section",
            type: "footer-simple",
            content: {
              logoText: "Fit<span class='text-primary'>Zone</span>",
              tagline: "Your journey to a better you starts here",
              copyright: "© 2025 FitZone. All rights reserved."
            },
            style: {
              backgroundColor: "#1A1A1A",
              textColor: "#D1D5DB",
              padding: "48px"
            }
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        userId: 0,
        name: "Florist Shop",
        description: "A delicate and elegant template for floral businesses with a focus on natural beauty",
        thumbnail: "",
        components: [
          {
            id: "header-1",
            type: "header-transparent",
            content: {
              logoText: "Bloom<span class='text-primary'>& Petal</span>",
              menuItems: [
                { text: "Collections", url: "#collections" },
                { text: "Services", url: "#services" },
                { text: "About", url: "#about" },
                { text: "Order", url: "#order" }
              ]
            },
            style: {
              textColor: "#4B5563",
              accentColor: "#EC4899"
            }
          },
          {
            id: "hero-section",
            type: "hero-centered",
            content: {
              heading: "Handcrafted Floral Arrangements",
              description: "Beautiful, fresh flowers for every occasion, delivered with care and artistry",
              primaryButtonText: "Shop Now",
              secondaryButtonText: "Our Services"
            },
            style: {
              backgroundColor: "#FDF2F8",
              headingColor: "#831843",
              textColor: "#4B5563",
              paddingTop: "100px",
              paddingBottom: "100px"
            }
          },
          {
            id: "collections-section",
            type: "feature-grid",
            content: {
              title: "Our Collections",
              features: [
                {
                  title: "Seasonal Bouquets",
                  description: "Fresh arrangements showcasing the beauty of each season",
                  icon: "ri-flower-line"
                },
                {
                  title: "Wedding Flowers",
                  description: "Exquisite floral designs for your special day",
                  icon: "ri-hearts-line"
                },
                {
                  title: "Plant Gifts",
                  description: "Lasting green gifts that bring life to any space",
                  icon: "ri-plant-line"
                },
                {
                  title: "Custom Orders",
                  description: "Personalized arrangements for unique occasions",
                  icon: "ri-gift-line"
                }
              ]
            },
            style: {
              backgroundColor: "#ffffff",
              headingColor: "#831843",
              textColor: "#4B5563",
              padding: "64px"
            }
          },
          {
            id: "about-section",
            type: "text-block",
            content: {
              title: "Our Story",
              text: "Bloom & Petal was founded with a simple mission: to bring the beauty of nature into people's lives through thoughtfully crafted floral designs. Each arrangement is handcrafted with care and attention to detail, using only the freshest, most beautiful blooms sourced from local growers whenever possible."
            },
            style: {
              backgroundColor: "#FFFAFD",
              headingColor: "#831843",
              textColor: "#4B5563",
              padding: "64px"
            }
          },
          {
            id: "cta-section",
            type: "email-signup",
            content: {
              heading: "Subscribe for Floral Inspiration",
              description: "Join our newsletter for seasonal updates, special offers, and floral design tips.",
              inputPlaceholder: "Your email address",
              buttonText: "Subscribe"
            },
            style: {
              backgroundColor: "#FCE7F3",
              headingColor: "#831843",
              textColor: "#4B5563",
              padding: "64px"
            }
          },
          {
            id: "footer-section",
            type: "footer-simple",
            content: {
              logoText: "Bloom<span class='text-primary'>& Petal</span>",
              tagline: "Bringing natural beauty to life",
              copyright: "© 2025 Bloom & Petal. All rights reserved."
            },
            style: {
              backgroundColor: "#FFFAFD",
              textColor: "#4B5563",
              padding: "48px"
            }
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        userId: 0,
        name: "Hairdresser Salon",
        description: "A stylish template for hair salons with a modern, trendy aesthetic",
        thumbnail: "",
        components: [
          {
            id: "header-1",
            type: "header-1",
            content: {
              logoText: "Chic<span class='text-primary'>Cuts</span>",
              menuItems: [
                { text: "Services", url: "#services" },
                { text: "Gallery", url: "#gallery" },
                { text: "Team", url: "#team" },
                { text: "Book Now", url: "#booking" }
              ]
            },
            style: {
              backgroundColor: "#ffffff",
              textColor: "#1F2937",
              accentColor: "#8B5CF6"
            }
          },
          {
            id: "hero-section",
            type: "hero-gradient",
            content: {
              heading: "Express Your Style",
              description: "Expert hairstyling, coloring, and treatments in a relaxed, modern atmosphere",
              primaryButtonText: "Book Appointment",
              secondaryButtonText: "View Services"
            },
            style: {
              gradientStart: "#8B5CF6",
              gradientEnd: "#EC4899",
              headingColor: "#ffffff",
              textColor: "#F3F4F6",
              paddingTop: "100px",
              paddingBottom: "100px"
            }
          },
          {
            id: "services-section",
            type: "feature-cards",
            content: {
              title: "Our Services",
              features: [
                {
                  title: "Precision Cuts",
                  description: "Tailored haircuts that complement your unique features",
                  icon: "ri-scissors-line"
                },
                {
                  title: "Color & Highlights",
                  description: "From subtle to bold, customized to your style",
                  icon: "ri-palette-line"
                },
                {
                  title: "Treatments & Styling",
                  description: "Nourishing treatments and styling for all hair types",
                  icon: "ri-award-line"
                }
              ]
            },
            style: {
              backgroundColor: "#ffffff",
              headingColor: "#1F2937",
              textColor: "#4B5563",
              padding: "64px"
            }
          },
          {
            id: "testimonial-section",
            type: "testimonial-single",
            content: {
              quote: "The stylists at ChicCuts truly understand how to work with my hair type. I always leave feeling confident and beautiful.",
              author: "Emma Thompson",
              role: "Regular Client"
            },
            style: {
              backgroundColor: "#F5F3FF",
              quoteColor: "#4C1D95",
              textColor: "#4B5563",
              padding: "64px"
            }
          },
          {
            id: "booking-section",
            type: "contact-details",
            content: {
              title: "Book Your Appointment",
              description: "We're ready to help you look and feel your best. Book online or give us a call.",
              email: "appointments@chiccuts.com",
              phone: "+1 (555) 123-4567",
              address: "123 Style Street, Fashion District, FC 12345",
              buttonText: "Book Online"
            },
            style: {
              backgroundColor: "#ffffff",
              headingColor: "#1F2937",
              textColor: "#4B5563",
              padding: "64px"
            }
          },
          {
            id: "footer-section",
            type: "footer-columns",
            content: {
              logoText: "Chic<span class='text-primary'>Cuts</span>",
              description: "Where style meets expertise",
              copyright: "© 2025 ChicCuts Salon. All rights reserved.",
              columns: [
                {
                  title: "Hours",
                  links: [
                    { text: "Mon-Fri: 9am - 8pm", url: "#" },
                    { text: "Saturday: 9am - 6pm", url: "#" },
                    { text: "Sunday: 10am - 4pm", url: "#" }
                  ]
                },
                {
                  title: "Connect",
                  links: [
                    { text: "Instagram", url: "#" },
                    { text: "Facebook", url: "#" },
                    { text: "Pinterest", url: "#" }
                  ]
                }
              ]
            },
            style: {
              backgroundColor: "#1F2937",
              textColor: "#F3F4F6",
              headingColor: "#F9FAFB",
              padding: "64px"
            }
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        userId: 0,
        name: "Real Estate Agent",
        description: "A professional template for realtors with an emphasis on property showcasing",
        thumbnail: "",
        components: [
          {
            id: "header-1",
            type: "header-1",
            content: {
              logoText: "Prime<span class='text-primary'>Properties</span>",
              menuItems: [
                { text: "Listings", url: "#listings" },
                { text: "Services", url: "#services" },
                { text: "About", url: "#about" },
                { text: "Contact", url: "#contact" }
              ]
            },
            style: {
              backgroundColor: "#ffffff",
              textColor: "#1E293B",
              accentColor: "#0369A1"
            }
          },
          {
            id: "hero-section",
            type: "hero-split",
            content: {
              heading: "Find Your Dream Home",
              description: "Expert guidance through every step of your real estate journey, whether buying, selling, or investing",
              primaryButtonText: "View Listings",
              secondaryButtonText: "Free Consultation"
            },
            style: {
              backgroundColor: "#F0F9FF",
              headingColor: "#0C4A6E",
              textColor: "#1E293B",
              paddingTop: "80px",
              paddingBottom: "80px"
            }
          },
          {
            id: "services-section",
            type: "feature-grid",
            content: {
              title: "Comprehensive Real Estate Services",
              features: [
                {
                  title: "Buyer Representation",
                  description: "Expert guidance to find and secure your perfect property",
                  icon: "ri-home-heart-line"
                },
                {
                  title: "Seller Services",
                  description: "Strategic marketing and negotiation for maximum value",
                  icon: "ri-funds-line"
                },
                {
                  title: "Investment Properties",
                  description: "Analysis and acquisition of properties with growth potential",
                  icon: "ri-bar-chart-line"
                },
                {
                  title: "Property Management",
                  description: "Complete management solutions for property owners",
                  icon: "ri-building-line"
                }
              ]
            },
            style: {
              backgroundColor: "#ffffff",
              headingColor: "#0C4A6E",
              textColor: "#1E293B",
              padding: "64px"
            }
          },
          {
            id: "stats-section",
            type: "stats-bar",
            content: {
              title: "Proven Results",
              stats: [
                { value: "150+", label: "Properties Sold" },
                { value: "98%", label: "Asking Price Achieved" },
                { value: "28", label: "Average Days on Market" }
              ]
            },
            style: {
              backgroundColor: "#0369A1",
              headingColor: "#ffffff",
              textColor: "#F0F9FF",
              padding: "64px"
            }
          },
          {
            id: "testimonial-section",
            type: "testimonial-single",
            content: {
              quote: "Working with Prime Properties made selling our home incredibly smooth. Their market knowledge and attention to detail resulted in a quick sale above asking price.",
              author: "Michael & Julia Chen",
              role: "Sold their home in 10 days"
            },
            style: {
              backgroundColor: "#E0F2FE",
              quoteColor: "#0C4A6E",
              textColor: "#1E293B",
              padding: "64px"
            }
          },
          {
            id: "cta-section",
            type: "email-signup",
            content: {
              heading: "Stay Updated on New Listings",
              description: "Be the first to know about properties that match your criteria before they hit the market.",
              inputPlaceholder: "Your email address",
              buttonText: "Subscribe"
            },
            style: {
              backgroundColor: "#F8FAFC",
              headingColor: "#0C4A6E",
              textColor: "#1E293B",
              padding: "64px"
            }
          },
          {
            id: "footer-section",
            type: "footer-columns",
            content: {
              logoText: "Prime<span class='text-primary'>Properties</span>",
              description: "Your trusted partner in real estate",
              copyright: "© 2025 Prime Properties Realty. All rights reserved. License #ABC123456",
              columns: [
                {
                  title: "Contact",
                  links: [
                    { text: "123 Main Street, Suite 200", url: "#" },
                    { text: "Cityville, ST 12345", url: "#" },
                    { text: "(555) 123-4567", url: "#" }
                  ]
                },
                {
                  title: "Resources",
                  links: [
                    { text: "Mortgage Calculator", url: "#" },
                    { text: "Home Valuation", url: "#" },
                    { text: "Buyer's Guide", url: "#" }
                  ]
                }
              ]
            },
            style: {
              backgroundColor: "#0F172A",
              textColor: "#E2E8F0",
              headingColor: "#F8FAFC",
              padding: "64px"
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