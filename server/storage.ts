import { 
  users, type User, type InsertUser,
  templates, type Template, type InsertTemplate,
  projects, type Project, type InsertProject,
  type Component
} from "../client/src/components/shared/schema";

// Storage interface for CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private templates: Map<number, Template>;
  private projects: Map<number, Project>;
  private userId: number;
  private templateId: number;
  private projectId: number;

  constructor() {
    this.users = new Map();
    this.templates = new Map();
    this.projects = new Map();
    this.userId = 1;
    this.templateId = 1;
    this.projectId = 1;

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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
                { text: "Testimonials", url: "#testimonials" }
              ],
              ctaText: "Early Access",
              ctaUrl: "#signup"
            },
            style: {
              backgroundColor: "#7c3aed",
              color: "#ffffff",
              padding: "16px 24px"
            }
          },
          {
            id: "hero-split",
            type: "hero-split",
            content: {
              heading: "Launch Your Idea Faster",
              subheading: "The all-in-one platform for modern startups. Build, launch, and grow with tools designed for today's entrepreneurs.",
              primaryButtonText: "Get Early Access",
              primaryButtonUrl: "#signup",
              secondaryButtonText: "Watch Demo",
              secondaryButtonUrl: "#demo",
              imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"
            },
            style: {
              backgroundColor: "#8b5cf6",
              color: "#ffffff",
              padding: "80px 24px"
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
              color: "#1f2937"
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
              color: "#4b5563"
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
            id: "email-signup",
            type: "email-signup",
            content: {
              title: "Join the Waitlist",
              description: "Be the first to know when we launch. Get exclusive early access and special offers.",
              buttonText: "Join Now"
            },
            style: {
              backgroundColor: "#7c3aed",
              color: "#ffffff",
              padding: "64px 24px",
              borderRadius: "12px",
              maxWidth: "720px",
              margin: "0 auto 80px"
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
              logo: "John Doe",
              menuItems: [
                { text: "Home", url: "#" },
                { text: "Work", url: "#work" },
                { text: "About", url: "#about" },
                { text: "Contact", url: "#contact" }
              ]
            },
            style: {
              backgroundColor: "#ffffff",
              padding: "24px",
              fontFamily: "Georgia, serif"
            }
          },
          {
            id: "hero-centered",
            type: "hero-centered",
            content: {
              heading: "Creative Designer & Developer",
              subheading: "I create beautiful, functional digital experiences that help businesses connect with their audience.",
              buttonText: "View My Work",
              buttonUrl: "#work"
            },
            style: {
              backgroundColor: "#f3f4f6",
              padding: "120px 24px",
              textAlign: "center",
              fontFamily: "Georgia, serif"
            }
          },
          {
            id: "spacer-1",
            type: "spacer",
            content: {
              height: 80
            },
            style: {}
          },
          {
            id: "heading-about",
            type: "heading",
            content: {
              text: "About Me",
              level: "h2"
            },
            style: {
              fontSize: "2rem",
              fontWeight: "normal",
              margin: "0 0 24px",
              color: "#1f2937",
              fontFamily: "Georgia, serif",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "8px"
            }
          },
          {
            id: "text-about",
            type: "text-block",
            content: {
              text: "With over 10 years of experience in design and development, I've helped dozens of clients achieve their digital goals. My work focuses on clean, minimal aesthetics combined with intuitive functionality."
            },
            style: {
              maxWidth: "720px",
              margin: "0 0 48px",
              fontSize: "1.1rem",
              lineHeight: "1.8",
              color: "#4b5563",
              fontFamily: "Georgia, serif"
            }
          },
          {
            id: "image-portrait",
            type: "image",
            content: {
              url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
              alt: "Portrait photo",
              caption: "Photo by Mark Williams"
            },
            style: {
              maxWidth: "400px",
              margin: "0 auto 64px",
              borderRadius: "4px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
            }
          },
          {
            id: "form-contact",
            type: "form",
            content: {
              title: "Get In Touch",
              fields: [
                { name: "name", label: "Your Name", type: "text", required: true },
                { name: "email", label: "Email Address", type: "email", required: true },
                { name: "project", label: "Project Description", type: "textarea", required: true }
              ],
              submitText: "Send Message"
            },
            style: {
              backgroundColor: "#ffffff",
              padding: "48px 32px",
              margin: "64px 0",
              borderRadius: "4px",
              maxWidth: "720px",
              marginLeft: "auto",
              marginRight: "auto",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb"
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
