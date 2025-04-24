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
                { text: "Programs", url: "#programs" },
                { text: "Methodology", url: "#methodology" },
                { text: "Success Stories", url: "#success-stories" },
                { text: "Book Now", url: "#booking" }
              ]
            },
            style: {
              backgroundColor: "#111827",
              textColor: "#F9FAFB",
              accentColor: "#10B981"
            }
          },
          {
            id: "hero-section",
            type: "hero-gradient",
            content: {
              heading: "ELEVATE YOUR FITNESS JOURNEY",
              description: "Science-backed training methods tailored to your unique body and goals. Transform beyond the physical.",
              primaryButtonText: "Start 7-Day Trial",
              secondaryButtonText: "View Training Methods"
            },
            style: {
              gradientStart: "#064E3B",
              gradientEnd: "#10B981",
              headingColor: "#ffffff",
              textColor: "#E5E7EB",
              primaryButtonColor: "#F9FAFB",
              primaryButtonTextColor: "#064E3B",
              secondaryButtonColor: "transparent",
              secondaryButtonTextColor: "#F9FAFB",
              paddingTop: "100px",
              paddingBottom: "100px"
            }
          },
          {
            id: "stats-section",
            type: "stats-bar",
            content: {
              title: "Real Results",
              stats: [
                { value: "5,000+", label: "Workouts Completed" },
                { value: "94%", label: "Client Success Rate" },
                { value: "800+", label: "Weight Lost (kg)" }
              ]
            },
            style: {
              backgroundColor: "#111827",
              headingColor: "#F9FAFB",
              textColor: "#D1D5DB",
              padding: "48px"
            }
          },
          {
            id: "services-section",
            type: "feature-cards",
            content: {
              title: "SPECIALIZED TRAINING PROGRAMS",
              features: [
                {
                  title: "1:1 Elite Coaching",
                  description: "Personalized training with biomechanical analysis and progressive overload principles",
                  icon: "ri-user-star-line"
                },
                {
                  title: "HIIT Transformation",
                  description: "High-intensity interval training for maximum fat loss and cardiovascular improvement",
                  icon: "ri-heart-pulse-line"
                },
                {
                  title: "Nutrition Mastery",
                  description: "Macro-optimized nutrition plans with periodic adjustments based on your progress",
                  icon: "ri-nutrients-line"
                }
              ]
            },
            style: {
              backgroundColor: "#0D9488",
              headingColor: "#F0FDF4",
              textColor: "#F0FDF4",
              padding: "64px",
              borderRadius: "0px"
            }
          },
          {
            id: "methodology-section",
            type: "columns-2",
            content: {
              title: "THE FITZONE METHOD",
              subtitle: "A holistic approach to fitness that combines strength, mobility, and recovery",
              leftColumnContent: "<h3 class='text-xl font-bold mb-4'>Progressive Overload</h3><p class='mb-6'>Our scientifically-proven methodology gradually increases workout intensity to continuously challenge your body and prevent plateaus.</p><h3 class='text-xl font-bold mb-4'>Mind-Muscle Connection</h3><p>Learn techniques to maximize neuromuscular efficiency and achieve better results with proper form and execution.</p>",
              rightColumnContent: "<h3 class='text-xl font-bold mb-4'>Recovery Optimization</h3><p class='mb-6'>Structured recovery protocols including mobility work, nutrition timing, and sleep optimization to enhance results.</p><h3 class='text-xl font-bold mb-4'>Data-Driven Progress</h3><p>Regular assessments and benchmarks to track progress and make evidence-based adjustments to your program.</p>"
            },
            style: {
              backgroundColor: "#F0FDF4",
              titleColor: "#064E3B",
              textColor: "#1F2937",
              padding: "80px"
            }
          },
          {
            id: "testimonial-section",
            type: "testimonial-carousel",
            content: {
              testimonials: [
                {
                  quote: "FitZone's approach to strength training revolutionized how I view fitness. I've gained 12lbs of muscle while actually improving my mobility and reducing joint pain.",
                  author: "James Rodriguez",
                  role: "Software Engineer, 8 months with FitZone"
                },
                {
                  quote: "After three failed attempts with other trainers, FitZone helped me lose 35lbs and keep it off. Their nutrition coaching was the game-changer I needed.",
                  author: "Sarah Johnson",
                  role: "Marketing Director, 1 year with FitZone"
                },
                {
                  quote: "At 52, I never thought I could feel this strong and energetic. My metabolic health markers are better now than they were in my 30s!",
                  author: "Michael Chen",
                  role: "Business Owner, 14 months with FitZone"
                }
              ]
            },
            style: {
              backgroundColor: "#064E3B",
              quoteColor: "#ECFDF5",
              textColor: "#D1FAE5",
              padding: "80px"
            }
          },
          {
            id: "cta-section",
            type: "email-signup",
            content: {
              heading: "START YOUR TRANSFORMATION TODAY",
              description: "Sign up for a complimentary fitness assessment and personalized program recommendation.",
              inputPlaceholder: "Your email",
              buttonText: "CLAIM FREE ASSESSMENT"
            },
            style: {
              backgroundColor: "#10B981",
              headingColor: "#ffffff",
              textColor: "#F0FDF4",
              buttonColor: "#111827",
              buttonTextColor: "#ffffff",
              padding: "80px"
            }
          },
          {
            id: "footer-section",
            type: "footer-columns",
            content: {
              logoText: "Fit<span class='text-primary'>Zone</span>",
              description: "Science-backed fitness coaching for transformative results",
              copyright: "© 2025 FitZone. All rights reserved.",
              columns: [
                {
                  title: "Hours",
                  links: [
                    { text: "Mon-Fri: 5am - 10pm", url: "#" },
                    { text: "Saturday: 7am - 8pm", url: "#" },
                    { text: "Sunday: 8am - 6pm", url: "#" }
                  ]
                },
                {
                  title: "Connect",
                  links: [
                    { text: "Instagram", url: "#" },
                    { text: "YouTube", url: "#" },
                    { text: "Podcast", url: "#" }
                  ]
                }
              ]
            },
            style: {
              backgroundColor: "#111827",
              textColor: "#D1D5DB",
              headingColor: "#F9FAFB",
              padding: "64px"
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
              logoText: "Wild<span class='text-primary'>Bloom</span>",
              menuItems: [
                { text: "Collections", url: "#collections" },
                { text: "Our Process", url: "#process" },
                { text: "Studio", url: "#studio" },
                { text: "Order", url: "#order" }
              ]
            },
            style: {
              textColor: "#4A5568",
              accentColor: "#DB2777"
            }
          },
          {
            id: "hero-section",
            type: "hero-split",
            content: {
              heading: "Artisanal Floral Design",
              description: "Botanical arrangements that tell a story, crafted with seasonal blooms and a touch of wild beauty",
              primaryButtonText: "Shop Collections",
              secondaryButtonText: "About Our Studio"
            },
            style: {
              backgroundColor: "#FFFAF0",
              headingColor: "#B45309",
              textColor: "#4B5563",
              primaryButtonColor: "#DB2777",
              primaryButtonTextColor: "#ffffff",
              secondaryButtonColor: "transparent",
              secondaryButtonTextColor: "#B45309",
              paddingTop: "120px",
              paddingBottom: "120px"
            }
          },
          {
            id: "process-section",
            type: "columns-3",
            content: {
              title: "Our Botanical Approach",
              subtitle: "Every arrangement is thoughtfully designed with intention and care",
              column1Content: "<div class='text-center'><div class='inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 mb-4'><span class='text-pink-600 text-xl font-semibold'>1</span></div><h3 class='text-lg font-medium mb-2'>Thoughtful Sourcing</h3><p>We partner with local farms that practice sustainable growing methods to source the finest seasonal blooms.</p></div>",
              column2Content: "<div class='text-center'><div class='inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 mb-4'><span class='text-pink-600 text-xl font-semibold'>2</span></div><h3 class='text-lg font-medium mb-2'>Artistic Composition</h3><p>Each arrangement is hand-crafted with attention to color harmony, texture, and sculptural elements.</p></div>",
              column3Content: "<div class='text-center'><div class='inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 mb-4'><span class='text-pink-600 text-xl font-semibold'>3</span></div><h3 class='text-lg font-medium mb-2'>Mindful Delivery</h3><p>Delivered with care in eco-friendly packaging to ensure your flowers arrive in perfect condition.</p></div>"
            },
            style: {
              backgroundColor: "#ffffff",
              titleColor: "#B45309",
              textColor: "#4B5563",
              padding: "80px"
            }
          },
          {
            id: "collections-section",
            type: "gallery",
            content: {
              title: "Seasonal Collections",
              description: "Our arrangements reflect the changing beauty of nature throughout the year",
              images: [
                {
                  src: "https://images.unsplash.com/photo-1566904809505-29025835a0fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
                  alt: "Spring Collection",
                  caption: "Spring Awakening"
                },
                {
                  src: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
                  alt: "Summer Collection",
                  caption: "Summer Abundance"
                },
                {
                  src: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80",
                  alt: "Autumn Collection",
                  caption: "Autumn Warmth"
                },
                {
                  src: "https://images.unsplash.com/photo-1545165375-7c5a75c9aedf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
                  alt: "Winter Collection",
                  caption: "Winter Elegance"
                }
              ]
            },
            style: {
              backgroundColor: "#FDF2F8",
              titleColor: "#9D174D",
              textColor: "#4B5563",
              padding: "80px"
            }
          },
          {
            id: "testimonial-section",
            type: "testimonial-single",
            content: {
              quote: "WildBloom created the most exquisite arrangements for our wedding. Their attention to detail and understanding of our vision exceeded all expectations. The flowers were not just decorations—they were works of art that captured the essence of our special day.",
              author: "Emily & Thomas",
              role: "Wedding Clients"
            },
            style: {
              backgroundColor: "#FCF8F1",
              quoteColor: "#92400E",
              textColor: "#4B5563",
              padding: "80px"
            }
          },
          {
            id: "services-section",
            type: "feature-cards",
            content: {
              title: "Floral Services",
              features: [
                {
                  title: "Bespoke Arrangements",
                  description: "Custom designs created especially for your space and occasion",
                  icon: "ri-scissors-cut-line"
                },
                {
                  title: "Weddings & Events",
                  description: "Full-service floral design for your most memorable celebrations",
                  icon: "ri-calendar-event-line"
                },
                {
                  title: "Floral Subscriptions",
                  description: "Regular deliveries of seasonal blooms to brighten your home or office",
                  icon: "ri-repeat-line"
                }
              ]
            },
            style: {
              backgroundColor: "#ffffff",
              headingColor: "#9D174D",
              textColor: "#4B5563",
              padding: "80px"
            }
          },
          {
            id: "cta-section",
            type: "email-signup",
            content: {
              heading: "Join Our Botanical Community",
              description: "Receive seasonal inspiration, early access to limited collections, and floral care tips.",
              inputPlaceholder: "Your email address",
              buttonText: "Subscribe"
            },
            style: {
              backgroundColor: "#FBD1E3",
              headingColor: "#9D174D",
              textColor: "#4B5563",
              buttonColor: "#9D174D",
              buttonTextColor: "#ffffff",
              padding: "80px"
            }
          },
          {
            id: "footer-section",
            type: "footer-columns",
            content: {
              logoText: "Wild<span class='text-primary'>Bloom</span>",
              description: "Artisanal floral design with a wild and natural aesthetic",
              copyright: "© 2025 WildBloom Studio. All rights reserved.",
              columns: [
                {
                  title: "Visit Our Studio",
                  links: [
                    { text: "123 Botanical Lane", url: "#" },
                    { text: "Bloom District", url: "#" },
                    { text: "Open Wed-Sun, 10am-6pm", url: "#" }
                  ]
                },
                {
                  title: "Connect",
                  links: [
                    { text: "Instagram", url: "#" },
                    { text: "Pinterest", url: "#" },
                    { text: "Contact", url: "#" }
                  ]
                }
              ]
            },
            style: {
              backgroundColor: "#FFFAF0",
              textColor: "#4B5563",
              headingColor: "#92400E",
              padding: "64px"
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
              logoText: "Luxe<span class='text-primary'>Style</span>",
              menuItems: [
                { text: "Experiences", url: "#experiences" },
                { text: "Portfolio", url: "#portfolio" },
                { text: "Stylists", url: "#stylists" },
                { text: "Reserve", url: "#reserve" }
              ]
            },
            style: {
              backgroundColor: "#0f172a",
              textColor: "#f8fafc",
              accentColor: "#a855f7"
            }
          },
          {
            id: "hero-section",
            type: "hero-video",
            content: {
              heading: "REDEFINE YOUR SIGNATURE LOOK",
              description: "An elevated salon experience where creativity, technique, and personalized consultation meet",
              primaryButtonText: "Book Your Experience",
              secondaryButtonText: "Explore Services",
              videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hairdresser-washing-a-womans-hair-14993-large.mp4"
            },
            style: {
              overlay: "linear-gradient(to right, rgba(0, 0, 0, 0.85), rgba(88, 28, 135, 0.8))",
              headingColor: "#ffffff",
              textColor: "#ffffff",
              primaryButtonColor: "#a855f7",
              primaryButtonTextColor: "#ffffff",
              secondaryButtonColor: "transparent",
              secondaryButtonTextColor: "#ffffff",
              secondaryButtonBorderColor: "#a855f7",
              paddingTop: "140px",
              paddingBottom: "140px"
            }
          },
          {
            id: "services-section",
            type: "columns-3",
            content: {
              title: "SIGNATURE EXPERIENCES",
              subtitle: "Customized hair services tailored to your unique style and texture",
              column1Content: "<div class='p-6 border border-purple-200 rounded-lg transition-all hover:border-purple-500 hover:shadow-lg'><h3 class='text-xl font-bold mb-4 text-purple-900'>LUXE CUT & STYLE</h3><p class='mb-4 text-slate-700'>A transformative cut experience including in-depth consultation, precision cutting, and styling with premium products.</p><div class='text-sm font-medium text-purple-700'>From $95</div></div>",
              column2Content: "<div class='p-6 border border-purple-200 rounded-lg transition-all hover:border-purple-500 hover:shadow-lg'><h3 class='text-xl font-bold mb-4 text-purple-900'>COLOR EVOLUTION</h3><p class='mb-4 text-slate-700'>Personalized color services from subtle dimension to complete transformation using innovative techniques.</p><div class='text-sm font-medium text-purple-700'>From $120</div></div>",
              column3Content: "<div class='p-6 border border-purple-200 rounded-lg transition-all hover:border-purple-500 hover:shadow-lg'><h3 class='text-xl font-bold mb-4 text-purple-900'>HAIR TREATMENT RITUAL</h3><p class='mb-4 text-slate-700'>Restorative treatments that repair and rejuvenate damaged hair using our curated collection of luxury products.</p><div class='text-sm font-medium text-purple-700'>From $85</div></div>"
            },
            style: {
              backgroundColor: "#ffffff",
              titleColor: "#581c87",
              textColor: "#334155",
              padding: "80px"
            }
          },
          {
            id: "gallery-section",
            type: "carousel",
            content: {
              title: "OUR PORTFOLIO",
              description: "A selection of transformations created by our expert stylists",
              slides: [
                {
                  imageUrl: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
                  caption: "Modern Textured Bob"
                },
                {
                  imageUrl: "https://images.unsplash.com/photo-1618097426722-ff7667cc7c4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
                  caption: "Dimensional Balayage"
                },
                {
                  imageUrl: "https://images.unsplash.com/photo-1621786030484-4c855eed6974?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
                  caption: "Statement Color"
                },
                {
                  imageUrl: "https://images.unsplash.com/photo-1626954079747-4a0fda15cde7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
                  caption: "Effortless Waves"
                }
              ]
            },
            style: {
              backgroundColor: "#f8f9fa",
              titleColor: "#581c87",
              textColor: "#334155",
              padding: "80px"
            }
          },
          {
            id: "team-section",
            type: "feature-cards",
            content: {
              title: "MEET OUR MASTER STYLISTS",
              features: [
                {
                  title: "Sophia Laurent",
                  description: "Color specialist with 12+ years of experience and international training",
                  icon: "ri-scissors-2-line"
                },
                {
                  title: "Alexander Reed",
                  description: "Expert in precision cutting and editorial styling for all hair types",
                  icon: "ri-scissors-2-line"
                },
                {
                  title: "Isabella Chen",
                  description: "Texture specialist focusing on curls, waves, and creative styling",
                  icon: "ri-scissors-2-line"
                }
              ]
            },
            style: {
              backgroundColor: "#ffffff",
              headingColor: "#581c87",
              textColor: "#334155",
              padding: "80px"
            }
          },
          {
            id: "testimonial-section",
            type: "testimonial-carousel",
            content: {
              testimonials: [
                {
                  quote: "The level of attention and care I received at LuxeStyle was exceptional. My stylist took the time to understand exactly what I wanted and delivered beyond my expectations.",
                  author: "Madison Taylor",
                  role: "5-year client"
                },
                {
                  quote: "After years of disappointing salon experiences, I've finally found my forever salon. The stylists truly understand modern techniques while keeping hair health as the priority.",
                  author: "James Wilson",
                  role: "First-time client"
                },
                {
                  quote: "My color has never looked more natural and dimensional. The team's expertise and the tranquil environment make every visit feel like a luxury self-care retreat.",
                  author: "Olivia Chen",
                  role: "3-year client"
                }
              ]
            },
            style: {
              backgroundColor: "#0f172a",
              quoteColor: "#f8fafc",
              textColor: "#cbd5e1",
              padding: "80px"
            }
          },
          {
            id: "booking-section",
            type: "contact-details",
            content: {
              title: "RESERVE YOUR EXPERIENCE",
              description: "We recommend booking 2-3 weeks in advance to secure your preferred time with your stylist of choice.",
              email: "bookings@luxestyle.com",
              phone: "+1 (555) 789-4321",
              address: "520 Madison Avenue, Fashion District, New York, NY 10022",
              buttonText: "Book Online"
            },
            style: {
              backgroundColor: "#f1f5f9",
              headingColor: "#581c87",
              textColor: "#334155",
              buttonColor: "#a855f7",
              buttonTextColor: "#ffffff",
              padding: "80px"
            }
          },
          {
            id: "footer-section",
            type: "footer-columns",
            content: {
              logoText: "Luxe<span class='text-primary'>Style</span>",
              description: "Elevating the art of hair through technical excellence and personalized service",
              copyright: "© 2025 LuxeStyle. All rights reserved.",
              columns: [
                {
                  title: "Opening Hours",
                  links: [
                    { text: "Tuesday - Friday: 10am - 8pm", url: "#" },
                    { text: "Saturday: 9am - 6pm", url: "#" },
                    { text: "Sunday - Monday: Closed", url: "#" }
                  ]
                },
                {
                  title: "Connect",
                  links: [
                    { text: "Instagram", url: "#" },
                    { text: "Pinterest", url: "#" },
                    { text: "Vogue Features", url: "#" }
                  ]
                }
              ]
            },
            style: {
              backgroundColor: "#0f172a",
              textColor: "#e2e8f0",
              headingColor: "#f8fafc",
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
              logoText: "Elite<span class='text-primary'>Estates</span>",
              menuItems: [
                { text: "Featured Properties", url: "#featured" },
                { text: "Expertise", url: "#expertise" },
                { text: "Success Stories", url: "#success" },
                { text: "Work With Us", url: "#contact" }
              ]
            },
            style: {
              backgroundColor: "#ffffff",
              textColor: "#0F172A",
              accentColor: "#0284c7"
            }
          },
          {
            id: "hero-section",
            type: "hero-split",
            content: {
              heading: "Luxurious Homes, Exceptional Experience",
              description: "Exclusive properties and white-glove service for the most discerning buyers and sellers in the premium real estate market",
              primaryButtonText: "Explore Luxury Properties",
              secondaryButtonText: "Schedule Consultation",
              imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80"
            },
            style: {
              backgroundColor: "#f8fafc",
              headingColor: "#0c4a6e",
              textColor: "#334155",
              primaryButtonColor: "#0284c7",
              primaryButtonTextColor: "#ffffff",
              secondaryButtonColor: "transparent",
              secondaryButtonTextColor: "#0284c7",
              secondaryButtonBorderColor: "#0284c7",
              paddingTop: "80px",
              paddingBottom: "80px"
            }
          },
          {
            id: "featured-section",
            type: "gallery",
            content: {
              title: "FEATURED PROPERTIES",
              description: "Our handpicked selection of exceptional homes currently available",
              images: [
                {
                  src: "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                  alt: "Waterfront Modern Villa",
                  caption: "Waterfront Modern Villa • $4,250,000"
                },
                {
                  src: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                  alt: "Suburban Luxury Home",
                  caption: "Hillside Estate • $3,875,000"
                },
                {
                  src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                  alt: "Contemporary Masterpiece",
                  caption: "Contemporary Masterpiece • $5,200,000"
                },
                {
                  src: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                  alt: "Downtown Penthouse",
                  caption: "Downtown Penthouse • $7,800,000"
                }
              ]
            },
            style: {
              backgroundColor: "#ffffff",
              titleColor: "#0c4a6e",
              textColor: "#334155",
              padding: "80px"
            }
          },
          {
            id: "expertise-section",
            type: "columns-2",
            content: {
              title: "WHITE GLOVE REAL ESTATE SERVICES",
              subtitle: "Unparalleled expertise in the luxury property market",
              leftColumnContent: "<div class='space-y-6'><div class='p-6 bg-blue-50 rounded-lg'><h3 class='text-xl font-semibold mb-2 text-blue-900'>Seller Representation</h3><p class='text-slate-700'>Our comprehensive marketing strategy includes professional staging, architectural photography, cinematic video tours, and exclusive networking within our global high-net-worth client database.</p></div><div class='p-6 bg-blue-50 rounded-lg'><h3 class='text-xl font-semibold mb-2 text-blue-900'>Investment Advisory</h3><p class='text-slate-700'>Leverage our proprietary market analytics and investment expertise to identify high-performing properties with exceptional appreciation potential.</p></div></div>",
              rightColumnContent: "<div class='space-y-6'><div class='p-6 bg-blue-50 rounded-lg'><h3 class='text-xl font-semibold mb-2 text-blue-900'>Buyer Representation</h3><p class='text-slate-700'>Gain access to off-market properties, expert negotiations, and personalized property searches tailored to your unique lifestyle requirements and investment goals.</p></div><div class='p-6 bg-blue-50 rounded-lg'><h3 class='text-xl font-semibold mb-2 text-blue-900'>Relocation Concierge</h3><p class='text-slate-700'>Our full-service concierge handles every aspect of your relocation, from school placements to interior design services and local lifestyle integration.</p></div></div>"
            },
            style: {
              backgroundColor: "#f8fafc",
              titleColor: "#0c4a6e",
              textColor: "#334155",
              padding: "80px"
            }
          },
          {
            id: "stats-section",
            type: "stats-bar",
            content: {
              title: "PROVEN EXCELLENCE",
              stats: [
                { value: "$1.8B+", label: "Sales Volume (2024)" },
                { value: "42", label: "Average Days on Market" },
                { value: "99.2%", label: "Asking Price Achieved" },
                { value: "250+", label: "Luxury Transactions" }
              ]
            },
            style: {
              backgroundColor: "#0c4a6e",
              headingColor: "#f0f9ff",
              textColor: "#e0f2fe",
              padding: "64px"
            }
          },
          {
            id: "testimonial-section",
            type: "testimonial-carousel",
            content: {
              testimonials: [
                {
                  quote: "Elite Estates transformed what could have been a stressful selling process into a seamless experience. Their market insights and strategic approach resulted in multiple offers above asking price within the first week.",
                  author: "Jonathan & Sarah Reynolds",
                  role: "Sold their Waterfront Estate for $6.2M"
                },
                {
                  quote: "After searching for our dream home for over a year with another agency, Elite Estates found us the perfect property in just three weeks. Their network of off-market properties is truly impressive.",
                  author: "David Chen",
                  role: "Purchased Hillside Estate for $4.8M"
                },
                {
                  quote: "The level of service and attention to detail was impeccable. From the initial consultation to the closing and beyond, Elite Estates ensured every aspect of our transaction exceeded expectations.",
                  author: "Alexandra Martinez",
                  role: "Purchased Downtown Penthouse for $7.5M"
                }
              ]
            },
            style: {
              backgroundColor: "#ffffff",
              quoteColor: "#0c4a6e",
              textColor: "#475569",
              padding: "80px"
            }
          },
          {
            id: "agent-section",
            type: "columns-2",
            content: {
              title: "MEET YOUR ADVISOR",
              subtitle: "Expert guidance from our principal real estate consultant",
              leftColumnContent: "<div class='flex justify-center'><img src='https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80' alt='James Anderson' class='rounded-lg shadow-lg w-4/5 h-auto aspect-[3/4] object-cover' /></div>",
              rightColumnContent: "<div class='space-y-4'><h3 class='text-2xl font-semibold text-blue-900'>James Anderson</h3><p class='text-blue-700 font-medium'>Principal Agent & Luxury Property Specialist</p><ul class='space-y-2 text-slate-700'><li class='flex items-center'><span class='mr-2 text-blue-500'>•</span> Over $500M in luxury property transactions</li><li class='flex items-center'><span class='mr-2 text-blue-500'>•</span> Certified Luxury Home Marketing Specialist</li><li class='flex items-center'><span class='mr-2 text-blue-500'>•</span> Wall Street Journal Top 100 Agent</li><li class='flex items-center'><span class='mr-2 text-blue-500'>•</span> Former Investment Banker with Financial Expertise</li></ul><p class='mt-4 text-slate-700'>\"My approach combines deep market knowledge with an understanding of each client's unique lifestyle needs. Every property transaction should not only be financially sound but also enhance your quality of life.\"</p><div class='mt-6'><a href='#contact' class='inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors'><span>Schedule a Consultation</span></a></div></div>"
            },
            style: {
              backgroundColor: "#f0f9ff",
              titleColor: "#0c4a6e",
              textColor: "#334155",
              padding: "80px"
            }
          },
          {
            id: "cta-section",
            type: "email-signup",
            content: {
              heading: "GAIN EXCLUSIVE ACCESS",
              description: "Join our VIP client list for early access to off-market properties and exclusive market insights.",
              inputPlaceholder: "Your email address",
              buttonText: "Subscribe"
            },
            style: {
              backgroundColor: "#0284c7",
              headingColor: "#ffffff",
              textColor: "#f0f9ff",
              buttonColor: "#0c4a6e",
              buttonTextColor: "#ffffff",
              padding: "64px"
            }
          },
          {
            id: "footer-section",
            type: "footer-columns",
            content: {
              logoText: "Elite<span class='text-primary'>Estates</span>",
              description: "Exceptional properties for extraordinary lives",
              copyright: "© 2025 Elite Estates Luxury Properties. All rights reserved. DRE Lic# 01234567",
              columns: [
                {
                  title: "Visit Our Office",
                  links: [
                    { text: "One International Plaza, Suite 1500", url: "#" },
                    { text: "Financial District", url: "#" },
                    { text: "By appointment only", url: "#" }
                  ]
                },
                {
                  title: "Connect",
                  links: [
                    { text: "info@eliteestates.com", url: "#" },
                    { text: "(555) 987-6543", url: "#" },
                    { text: "LinkedIn & Instagram", url: "#" }
                  ]
                }
              ]
            },
            style: {
              backgroundColor: "#0f172a",
              textColor: "#e2e8f0",
              headingColor: "#f8fafc",
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