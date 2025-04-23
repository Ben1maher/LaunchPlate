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
      password: "2ce31fa0ed6b82c3d308ff0053a8eab5ea03fd7983eeafb515f309d68a2c65003ead206bf43603b3c99fe81b5945a7e46487afc4553d60a62361c428316cd052.4710b872e8ef405d69f17dbfe4fca4fe", // hashed "developer123"
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
    // Ensure all required fields are properly set with fallbacks
    const user: User = { 
      id,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      fullName: insertUser.fullName || null,
      createdAt: insertUser.createdAt || new Date().toISOString(),
      accountType: insertUser.accountType || "free",
      projectsLimit: insertUser.projectsLimit || 1,
      pagesLimit: insertUser.pagesLimit || 1,
      storage: insertUser.storage || 10,
      canDeploy: insertUser.canDeploy || false,
      canSaveTemplates: insertUser.canSaveTemplates || false,
      avatarUrl: insertUser.avatarUrl || null,
      isActive: insertUser.isActive ?? true,
      stripeCustomerId: insertUser.stripeCustomerId || null,
      stripeSubscriptionId: insertUser.stripeSubscriptionId || null
    };
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
    // Ensure all required fields are properly set with fallbacks
    const project: Project = { 
      id,
      name: insertProject.name,
      createdAt: insertProject.createdAt || new Date().toISOString(),
      userId: insertProject.userId || 0,
      description: insertProject.description || null,
      components: insertProject.components || [],
      additionalPages: insertProject.additionalPages || null,
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
        userId: 0,
        name: "Music Distribution",
        description: "A striking dark-themed template perfect for music distribution and media services",
        thumbnail: "",
        components: [
          {
            id: "header-dark",
            type: "header-1",
            content: {
              logo: "CDBaby",
              menuItems: [
                { text: "Home", url: "#" },
                { text: "Features", url: "#features" },
                { text: "Pricing", url: "#pricing" },
                { text: "Artists", url: "#artists" },
                { text: "Blog", url: "#blog" }
              ],
              ctaText: "Sign Up",
              ctaUrl: "#signup"
            },
            style: {
              backgroundColor: "#2D0A31",
              color: "#ffffff",
              padding: "16px 24px",
              fontFamily: "'Montserrat', sans-serif",
              borderBottom: "none",
              boxShadow: "none"
            }
          },
          {
            id: "hero-music",
            type: "hero-split",
            content: {
              heading: "Distribute your music on Spotify, Apple Music, Amazon, and more.",
              subheading: "Get your music on more than 150 of the most popular streaming sites worldwide. That's more than any other music distributor.",
              primaryButtonText: "Sign up for a free account",
              primaryButtonUrl: "#signup",
              imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819"
            },
            style: {
              backgroundColor: "#2D0A31",
              color: "#ffffff",
              padding: "80px 40px",
              minHeight: "600px",
              fontFamily: "'Montserrat', sans-serif",
              backgroundImage: "radial-gradient(circle at 70% 50%, rgba(252, 128, 25, 0.2), transparent 40%), radial-gradient(circle at 30% 70%, rgba(249, 78, 155, 0.2), transparent 40%)"
            }
          },
          {
            id: "features-columns",
            type: "text-block",
            content: {
              text: "<div class='bg-white py-16'><div class='max-w-6xl mx-auto px-4'><div class='grid md:grid-cols-3 gap-8'><div class='flex flex-col items-center text-center'><div class='mb-6 text-orange-500'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' class='w-12 h-12'><path d='M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z' /><path d='M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z' /></svg></div><h3 class='text-xl font-bold mb-3'>Your music everywhere for one price</h3><p class='text-gray-600'>Relax. Unlike some services, we don't charge you annually to keep your music online. Just a simple one-time fee. And whenever we add a partner, your music automatically gets delivered there too.</p></div><div class='flex flex-col items-center text-center'><div class='mb-6 text-orange-500'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' class='w-12 h-12'><path d='M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z' /><path fill-rule='evenodd' d='M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z' clip-rule='evenodd' /><path d='M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z' /></svg></div><h3 class='text-xl font-bold mb-3'>Collect all your royalties</h3><p class='text-gray-600'>Every stream generates money for you. We help you collect your mechanical royalties from hundreds of other sources for songwriting royalties around the world.</p></div><div class='flex flex-col items-center text-center'><div class='mb-6 text-orange-500'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' class='w-12 h-12'><path fill-rule='evenodd' d='M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z' clip-rule='evenodd' /></svg></div><h3 class='text-xl font-bold mb-3'>Monetize on social media</h3><p class='text-gray-600'>Collect money every time a video streams with your music. Social media platforms like TikTok and Instagram help you collect royalties where your music is used.</p></div></div></div></div>"
            },
            style: {
              margin: "0",
              padding: "0"
            }
          },
          {
            id: "pricing-section",
            type: "text-block",
            content: {
              text: "<div class='py-16 bg-gray-50'><div class='max-w-6xl mx-auto px-4'><h2 class='text-3xl font-bold text-center mb-12'>Simple, transparent pricing</h2><div class='grid md:grid-cols-3 gap-8'><div class='bg-white rounded-xl shadow-lg p-8 border-t-4 border-orange-500 hover:transform hover:scale-105 transition-all duration-300'><div class='text-center mb-6'><h3 class='text-2xl font-bold mb-2'>Single</h3><p class='text-gray-500 mb-4'>Perfect for a single release</p><div class='text-4xl font-bold'>$9.95</div><div class='text-sm text-gray-500'>one-time fee</div></div><ul class='space-y-3 mb-8'><li class='flex items-start'><svg class='h-6 w-6 mr-2 text-green-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg><span>Distribution to 150+ platforms</span></li><li class='flex items-start'><svg class='h-6 w-6 mr-2 text-green-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg><span>Keep 100% of your rights</span></li><li class='flex items-start'><svg class='h-6 w-6 mr-2 text-green-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg><span>Spotify & Apple Music Pre-save</span></li><li class='flex items-start'><svg class='h-6 w-6 mr-2 text-green-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg><span>Basic analytics</span></li></ul><a href='#signup' class='block text-center bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all'>Choose Plan</a></div><div class='bg-white rounded-xl shadow-xl p-8 border-t-4 border-pink-500 relative hover:transform hover:scale-105 transition-all duration-300'><div class='absolute -top-4 right-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium'>Most Popular</div><div class='text-center mb-6'><h3 class='text-2xl font-bold mb-2'>Album</h3><p class='text-gray-500 mb-4'>Perfect for a full album</p><div class='text-4xl font-bold'>$29.95</div><div class='text-sm text-gray-500'>one-time fee</div></div><ul class='space-y-3 mb-8'><li class='flex items-start'><svg class='h-6 w-6 mr-2 text-green-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg><span>Up to 10 tracks per album</span></li><li class='flex items-start'><svg class='h-6 w-6 mr-2 text-green-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg><span>Everything in the Single plan</span></li><li class='flex items-start'><svg class='h-6 w-6 mr-2 text-green-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg><span>Advanced analytics dashboard</span></li><li class='flex items-start'><svg class='h-6 w-6 mr-2 text-green-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg><span>Automatic royalty collection</span></li><li class='flex items-start'><svg class='h-6 w-6 mr-2 text-green-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg><span>Social media monetization</span></li></ul><a href='#signup' class='block text-center bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all'>Choose Plan</a></div><div class='bg-white rounded-xl shadow-lg p-8 border-t-4 border-purple-500 hover:transform hover:scale-105 transition-all duration-300'><div class='text-center mb-6'><h3 class='text-2xl font-bold mb-2'>Pro</h3><p class='text-gray-500 mb-4'>For serious musicians</p><div class='text-4xl font-bold'>$49.95</div><div class='text-sm text-gray-500'>one-time fee</div></div><ul class='space-y-3 mb-8'><li class='flex items-start'><svg class='h-6 w-6 mr-2 text-green-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg><span>Unlimited tracks</span></li><li class='flex items-start'><svg class='h-6 w-6 mr-2 text-green-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg><span>Everything in the Album plan</span></li><li class='flex items-start'><svg class='h-6 w-6 mr-2 text-green-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg><span>Priority support</span></li><li class='flex items-start'><svg class='h-6 w-6 mr-2 text-green-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg><span>Dedicated account manager</span></li><li class='flex items-start'><svg class='h-6 w-6 mr-2 text-green-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg><span>Promotional opportunities</span></li></ul><a href='#signup' class='block text-center bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all'>Choose Plan</a></div></div></div></div>"
            },
            style: {
              margin: "0",
              padding: "0"
            }
          },
          {
            id: "cta-section",
            type: "email-signup",
            content: {
              title: "Ready to share your music with the world?",
              description: "Join thousands of independent artists who trust us with their music distribution. Get started today and reach millions of listeners worldwide.",
              buttonText: "Sign up for free",
              placeholder: "Enter your email"
            },
            style: {
              backgroundType: "gradient",
              gradientDirection: "to right",
              gradientStartColor: "#FF5E3A",
              gradientEndColor: "#FF2A68",
              backgroundImage: "linear-gradient(to right, #FF5E3A, #FF2A68)",
              color: "#ffffff",
              padding: "80px 24px",
              borderRadius: "0",
              margin: "0",
              fontFamily: "'Montserrat', sans-serif",
              textAlign: "center"
            }
          },
          {
            id: "footer-simple",
            type: "text-block",
            content: {
              text: "<footer class='bg-gray-900 text-gray-400 py-16'><div class='max-w-6xl mx-auto px-4'><div class='grid md:grid-cols-4 gap-8'><div class='col-span-2 md:col-span-1'><img src='https://via.placeholder.com/120x40' alt='CDBaby Logo' class='mb-6'><p class='mb-4 text-sm'>The leading digital music distribution platform for independent artists.</p><div class='flex space-x-4'><a href='#' class='text-gray-400 hover:text-orange-500 transition-colors'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'><path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z'/></svg></a><a href='#' class='text-gray-400 hover:text-orange-500 transition-colors'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'><path d='M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z'/></svg></a><a href='#' class='text-gray-400 hover:text-orange-500 transition-colors'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/></svg></a></div></div><div><h3 class='text-lg font-semibold text-white mb-4'>Services</h3><ul class='space-y-2 text-sm'><li><a href='#' class='hover:text-orange-500 transition-colors'>Music Distribution</a></li><li><a href='#' class='hover:text-orange-500 transition-colors'>Royalty Collection</a></li><li><a href='#' class='hover:text-orange-500 transition-colors'>Promotion</a></li><li><a href='#' class='hover:text-orange-500 transition-colors'>Analytics</a></li></ul></div><div><h3 class='text-lg font-semibold text-white mb-4'>Resources</h3><ul class='space-y-2 text-sm'><li><a href='#' class='hover:text-orange-500 transition-colors'>Artist Resources</a></li><li><a href='#' class='hover:text-orange-500 transition-colors'>Blog</a></li><li><a href='#' class='hover:text-orange-500 transition-colors'>Help Center</a></li><li><a href='#' class='hover:text-orange-500 transition-colors'>Success Stories</a></li></ul></div><div><h3 class='text-lg font-semibold text-white mb-4'>Company</h3><ul class='space-y-2 text-sm'><li><a href='#' class='hover:text-orange-500 transition-colors'>About Us</a></li><li><a href='#' class='hover:text-orange-500 transition-colors'>Careers</a></li><li><a href='#' class='hover:text-orange-500 transition-colors'>Contact</a></li><li><a href='#' class='hover:text-orange-500 transition-colors'>Terms & Privacy</a></li></ul></div></div><div class='border-t border-gray-800 mt-12 pt-8 text-sm text-center'>© 2025 CDBaby. All rights reserved.</div></div></footer>"
            },
            style: {
              margin: "0",
              padding: "0"
            }
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString()
      },
      {
        userId: 0,
        name: "Premium Membership",
        description: "A professional, clean template ideal for premium subscription services and membership sites",
        thumbnail: "",
        components: [
          {
            id: "header-premium",
            type: "header-1",
            content: {
              logo: "LinkedIn Premium",
              menuItems: [
                { text: "Home", url: "#" },
                { text: "Features", url: "#features" },
                { text: "Pricing", url: "#pricing" },
                { text: "For Business", url: "#business" }
              ],
              ctaText: "Start My Free Trial",
              ctaUrl: "#trial"
            },
            style: {
              backgroundColor: "#ffffff",
              color: "#0077B5",
              padding: "16px 24px",
              fontFamily: "'Inter', sans-serif",
              borderBottom: "1px solid #f0f0f0",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
            }
          },
          {
            id: "hero-premium",
            type: "hero-split",
            content: {
              heading: "Discover how Premium can help you",
              subheading: "Unlock exclusive features and tools that will help you advance your career or grow your business.",
              primaryButtonText: "Upgrade for 1 month",
              primaryButtonUrl: "#upgrade",
              imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3"
            },
            style: {
              backgroundColor: "#f5f5f5",
              color: "#333333",
              padding: "80px 24px",
              minHeight: "500px",
              fontFamily: "'Inter', sans-serif"
            }
          },
          {
            id: "divider-premium",
            type: "text-block",
            content: {
              text: "<div class='max-w-4xl mx-auto px-4 py-8 text-center'><p class='text-sm text-gray-500'>*Free trial eligibility determined at sign-up.</p><p class='text-sm text-blue-600 hover:underline cursor-pointer'>Additional terms may apply.</p></div>"
            },
            style: {
              margin: "0",
              padding: "0",
              backgroundColor: "#f5f5f5"
            }
          },
          {
            id: "categories-section",
            type: "text-block",
            content: {
              text: "<div class='bg-white py-12'><div class='max-w-5xl mx-auto px-4'><div class='flex justify-center gap-12 mb-8'><button class='text-blue-600 font-semibold pb-2 border-b-2 border-blue-600'>Premium Career</button><button class='text-gray-500 font-semibold pb-2 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 transition-all'>Premium Business</button></div><div class='w-32 h-1 bg-gray-300 mx-auto mb-14 relative'><div class='absolute h-1 w-16 bg-blue-600 top-0 left-0'></div></div><h2 class='text-3xl font-light text-center mb-16'>Grow professionally with Premium Career</h2><div class='grid md:grid-cols-4 gap-12'><div class='flex flex-col items-center text-center'><div class='w-16 h-16 flex items-center justify-center mb-4'><svg xmlns='http://www.w3.org/2000/svg' class='w-12 h-12 text-blue-600' viewBox='0 0 24 24' fill='currentColor'><path d='M12 14l9-5-9-5-9 5 9 5z'/><path d='M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z'/><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222'/></svg></div><h3 class='font-semibold mb-3'>On-Demand Learning</h3><p class='text-gray-600 text-sm'>Access 16,000+ expert-led courses to develop your skills and advance your career.</p></div><div class='flex flex-col items-center text-center'><div class='w-16 h-16 flex items-center justify-center mb-4'><svg xmlns='http://www.w3.org/2000/svg' class='w-12 h-12 text-blue-600' viewBox='0 0 24 24' fill='currentColor'><path d='M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z'/></svg></div><h3 class='font-semibold mb-3'>Monthly InMail</h3><p class='text-gray-600 text-sm'>Send messages to anyone on LinkedIn, even if you're not connected to them.</p></div><div class='flex flex-col items-center text-center'><div class='w-16 h-16 flex items-center justify-center mb-4'><svg xmlns='http://www.w3.org/2000/svg' class='w-12 h-12 text-blue-600' viewBox='0 0 24 24' fill='currentColor'><path fill-rule='evenodd' d='M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.68zM3 10.5a.75.75 0 01.75-.75H6a.75.75 0 010 1.5H3.75A.75.75 0 013 10.5zm14.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H18a.75.75 0 01-.75-.75zm-8.962 3.712a.75.75 0 010 1.061l-1.591 1.591a.75.75 0 11-1.061-1.06l1.591-1.592a.75.75 0 011.06 0z' clip-rule='evenodd'/></svg></div><h3 class='font-semibold mb-3'>Who's Viewed Your Profile</h3><p class='text-gray-600 text-sm'>See everyone who's viewed your profile in the last 90 days and their company details.</p></div><div class='flex flex-col items-center text-center'><div class='w-16 h-16 flex items-center justify-center mb-4'><svg xmlns='http://www.w3.org/2000/svg' class='w-12 h-12 text-blue-600' viewBox='0 0 24 24' fill='currentColor'><path d='M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z'/></svg></div><h3 class='font-semibold mb-3'>Applicant Insights</h3><p class='text-gray-600 text-sm'>See how you compare to other job applicants, your skills match, and more when you apply on LinkedIn.</p></div></div></div></div>"
            },
            style: {
              margin: "0",
              padding: "0"
            }
          },
          {
            id: "testimonials-section",
            type: "text-block",
            content: {
              text: "<div class='bg-gray-50 py-16'><div class='max-w-5xl mx-auto px-4'><h2 class='text-2xl font-light text-center mb-12'>What members are saying about Premium</h2><div class='grid md:grid-cols-3 gap-8'><div class='bg-white p-6 rounded-lg shadow-sm'><div class='flex items-center mb-4'><img src='https://randomuser.me/api/portraits/women/45.jpg' alt='Testimonial' class='w-12 h-12 rounded-full mr-4'><div><h4 class='font-semibold'>Sarah Johnson</h4><p class='text-gray-500 text-sm'>Marketing Specialist</p></div></div><p class='text-gray-700 mb-4'>\"Premium helped me connect with the right people and land my dream job within just a few weeks!\"</p><div class='flex'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/></svg><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/></svg><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/></svg><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/></svg><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/></svg></div></div><div class='bg-white p-6 rounded-lg shadow-sm'><div class='flex items-center mb-4'><img src='https://randomuser.me/api/portraits/men/32.jpg' alt='Testimonial' class='w-12 h-12 rounded-full mr-4'><div><h4 class='font-semibold'>David Chen</h4><p class='text-gray-500 text-sm'>Software Engineer</p></div></div><p class='text-gray-700 mb-4'>\"The courses on Premium were exactly what I needed to transition into a leadership role. Highly recommend!\"</p><div class='flex'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/></svg><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/></svg><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/></svg><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/></svg><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/></svg></div></div><div class='bg-white p-6 rounded-lg shadow-sm'><div class='flex items-center mb-4'><img src='https://randomuser.me/api/portraits/women/68.jpg' alt='Testimonial' class='w-12 h-12 rounded-full mr-4'><div><h4 class='font-semibold'>Emma Rodriguez</h4><p class='text-gray-500 text-sm'>Business Consultant</p></div></div><p class='text-gray-700 mb-4'>\"The ability to send InMail messages to potential clients has completely transformed my business development process.\"</p><div class='flex'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/></svg><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/></svg><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/></svg><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/></svg><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/></svg></div></div></div></div></div>"
            },
            style: {
              margin: "0",
              padding: "0"
            }
          },
          {
            id: "pricing-premium",
            type: "text-block",
            content: {
              text: "<div class='bg-white py-16'><div class='max-w-5xl mx-auto px-4'><h2 class='text-3xl font-light text-center mb-12'>Choose the right Premium plan for you</h2><div class='grid md:grid-cols-3 gap-8'><div class='border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all'><div class='border-b pb-4 mb-4'><h3 class='text-xl font-semibold mb-1'>Premium Career</h3><p class='text-gray-500 text-sm mb-4'>For individuals looking to grow professionally</p><div class='flex items-baseline'><span class='text-3xl font-bold'>$29.99</span><span class='text-gray-500 ml-2'>/month</span></div></div><ul class='space-y-3 mb-6'><li class='flex items-start'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-blue-600 mr-2 mt-0.5' viewBox='0 0 20 20' fill='currentColor'><path fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/></svg><span>3 InMail messages per month</span></li><li class='flex items-start'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-blue-600 mr-2 mt-0.5' viewBox='0 0 20 20' fill='currentColor'><path fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/></svg><span>See who viewed your profile</span></li><li class='flex items-start'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-blue-600 mr-2 mt-0.5' viewBox='0 0 20 20' fill='currentColor'><path fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/></svg><span>Applicant insights</span></li><li class='flex items-start'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-blue-600 mr-2 mt-0.5' viewBox='0 0 20 20' fill='currentColor'><path fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/></svg><span>Access to on-demand learning</span></li></ul><a href='#' class='block w-full py-2 px-4 bg-blue-600 text-white text-center rounded font-medium hover:bg-blue-700 transition-colors'>Start my free month</a></div><div class='border-2 border-blue-600 rounded-lg p-6 shadow-lg relative'><div class='absolute top-0 right-6 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 text-sm font-medium rounded-full'>Most Popular</div><div class='border-b pb-4 mb-4'><h3 class='text-xl font-semibold mb-1'>Premium Business</h3><p class='text-gray-500 text-sm mb-4'>For business professionals and small teams</p><div class='flex items-baseline'><span class='text-3xl font-bold'>$59.99</span><span class='text-gray-500 ml-2'>/month</span></div></div><ul class='space-y-3 mb-6'><li class='flex items-start'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-blue-600 mr-2 mt-0.5' viewBox='0 0 20 20' fill='currentColor'><path fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/></svg><span>15 InMail messages per month</span></li><li class='flex items-start'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-blue-600 mr-2 mt-0.5' viewBox='0 0 20 20' fill='currentColor'><path fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/></svg><span>Advanced people search filters</span></li><li class='flex items-start'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-blue-600 mr-2 mt-0.5' viewBox='0 0 20 20' fill='currentColor'><path fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/></svg><span>Competitive intelligence data</span></li><li class='flex items-start'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-blue-600 mr-2 mt-0.5' viewBox='0 0 20 20' fill='currentColor'><path fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/></svg><span>Unlimited profile views</span></li><li class='flex items-start'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-blue-600 mr-2 mt-0.5' viewBox='0 0 20 20' fill='currentColor'><path fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/></svg><span>Business insights and analytics</span></li></ul><a href='#' class='block w-full py-2 px-4 bg-blue-600 text-white text-center rounded font-medium hover:bg-blue-700 transition-colors'>Start my free month</a></div><div class='border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all'><div class='border-b pb-4 mb-4'><h3 class='text-xl font-semibold mb-1'>Premium Executive</h3><p class='text-gray-500 text-sm mb-4'>For senior leaders and executives</p><div class='flex items-baseline'><span class='text-3xl font-bold'>$99.99</span><span class='text-gray-500 ml-2'>/month</span></div></div><ul class='space-y-3 mb-6'><li class='flex items-start'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-blue-600 mr-2 mt-0.5' viewBox='0 0 20 20' fill='currentColor'><path fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/></svg><span>30 InMail messages per month</span></li><li class='flex items-start'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-blue-600 mr-2 mt-0.5' viewBox='0 0 20 20' fill='currentColor'><path fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/></svg><span>Executive leadership content</span></li><li class='flex items-start'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-blue-600 mr-2 mt-0.5' viewBox='0 0 20 20' fill='currentColor'><path fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/></svg><span>Premium executive network</span></li><li class='flex items-start'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-blue-600 mr-2 mt-0.5' viewBox='0 0 20 20' fill='currentColor'><path fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/></svg><span>All Business features</span></li><li class='flex items-start'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-blue-600 mr-2 mt-0.5' viewBox='0 0 20 20' fill='currentColor'><path fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/></svg><span>Dedicated account manager</span></li></ul><a href='#' class='block w-full py-2 px-4 bg-blue-600 text-white text-center rounded font-medium hover:bg-blue-700 transition-colors'>Start my free month</a></div></div></div></div>"
            },
            style: {
              margin: "0",
              padding: "0"
            }
          },
          {
            id: "cta-premium",
            type: "text-block",
            content: {
              text: "<div class='bg-blue-600 py-12 text-center text-white'><div class='max-w-4xl mx-auto px-4'><h2 class='text-2xl font-semibold mb-6'>Ready to unlock your career potential?</h2><p class='text-lg mb-8 opacity-90'>Join millions of professionals who trust our platform to advance their careers.</p><a href='#' class='inline-block bg-white text-blue-600 font-medium px-6 py-3 rounded-md hover:bg-blue-50 transition-colors'>Start My Free Trial</a><p class='text-sm mt-4 opacity-75'>No credit card required for trial. Cancel anytime.</p></div></div>"
            },
            style: {
              margin: "0",
              padding: "0"
            }
          },
          {
            id: "footer-premium",
            type: "text-block",
            content: {
              text: "<footer class='bg-gray-100 py-12'><div class='max-w-6xl mx-auto px-4'><div class='grid md:grid-cols-4 gap-8 mb-8'><div><h3 class='font-semibold mb-4'>Premium</h3><ul class='space-y-2 text-sm text-gray-600'><li><a href='#' class='hover:text-blue-600'>Premium Career</a></li><li><a href='#' class='hover:text-blue-600'>Premium Business</a></li><li><a href='#' class='hover:text-blue-600'>Premium Executive</a></li><li><a href='#' class='hover:text-blue-600'>Pricing</a></li></ul></div><div><h3 class='font-semibold mb-4'>Resources</h3><ul class='space-y-2 text-sm text-gray-600'><li><a href='#' class='hover:text-blue-600'>Learning Center</a></li><li><a href='#' class='hover:text-blue-600'>Success Stories</a></li><li><a href='#' class='hover:text-blue-600'>FAQ</a></li><li><a href='#' class='hover:text-blue-600'>Blog</a></li></ul></div><div><h3 class='font-semibold mb-4'>Company</h3><ul class='space-y-2 text-sm text-gray-600'><li><a href='#' class='hover:text-blue-600'>About Us</a></li><li><a href='#' class='hover:text-blue-600'>Careers</a></li><li><a href='#' class='hover:text-blue-600'>Press</a></li><li><a href='#' class='hover:text-blue-600'>Contact</a></li></ul></div><div><h3 class='font-semibold mb-4'>Legal</h3><ul class='space-y-2 text-sm text-gray-600'><li><a href='#' class='hover:text-blue-600'>Privacy Policy</a></li><li><a href='#' class='hover:text-blue-600'>Terms of Service</a></li><li><a href='#' class='hover:text-blue-600'>Cookie Policy</a></li><li><a href='#' class='hover:text-blue-600'>Copyright</a></li></ul></div></div><div class='border-t border-gray-200 pt-8 text-sm text-gray-500 text-center'><p>© 2025 LinkedIn Premium. All rights reserved.</p></div></div></footer>"
            },
            style: {
              margin: "0",
              padding: "0"
            }
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString()
      },
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
        description: "A modern business template with professional styling and engaging sections",
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
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              color: "#333333",
              fontFamily: "Poppins, sans-serif"
            }
          },
          {
            id: "hero-gradient",
            type: "hero-gradient",
            content: {
              heading: "Innovative Business Solutions",
              subheading: "We help companies transform their operations and achieve sustainable growth in today's dynamic market.",
              buttonText: "Get Started",
              buttonUrl: "#contact",
              secondaryButtonText: "Learn More",
              secondaryButtonUrl: "#services"
            },
            style: {
              backgroundType: "gradient",
              gradientDirection: "to right",
              gradientStartColor: "#2563eb",
              gradientEndColor: "#4f46e5",
              backgroundImage: "linear-gradient(to right, #2563eb, #4f46e5)",
              color: "#ffffff",
              padding: "100px 24px",
              textAlign: "center",
              fontFamily: "Poppins, sans-serif",
              minHeight: "500px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
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
              margin: "84px 0 24px",
              color: "#1f2937",
              fontFamily: "Poppins, sans-serif"
            }
          },
          {
            id: "text-services",
            type: "text-block",
            content: {
              text: "We offer a comprehensive range of professional services designed to help your business grow and succeed. Our expert team delivers tailored solutions for your unique challenges."
            },
            style: {
              textAlign: "center",
              maxWidth: "800px",
              margin: "0 auto 48px",
              fontSize: "1.1rem",
              lineHeight: "1.6",
              color: "#4b5563",
              fontFamily: "Poppins, sans-serif"
            }
          },
          {
            id: "services-cards",
            type: "text-block",
            content: {
              text: "<div class='max-w-6xl mx-auto px-4'><div class='grid md:grid-cols-3 gap-8'><div class='bg-white p-8 rounded-lg shadow-lg border-l-4 border-blue-600 hover:transform hover:scale-105 transition-all duration-300'><div class='text-blue-600 mb-4'><svg xmlns='http://www.w3.org/2000/svg' class='h-10 w-10' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' /></svg></div><h3 class='text-xl font-bold mb-3'>Business Strategy</h3><p class='text-gray-600 mb-4'>Develop comprehensive business strategies to achieve long-term goals and maximize growth potential.</p><a href='#contact' class='text-blue-600 font-medium hover:text-blue-700'>Learn more →</a></div><div class='bg-white p-8 rounded-lg shadow-lg border-l-4 border-indigo-600 hover:transform hover:scale-105 transition-all duration-300'><div class='text-indigo-600 mb-4'><svg xmlns='http://www.w3.org/2000/svg' class='h-10 w-10' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /></svg></div><h3 class='text-xl font-bold mb-3'>Financial Consulting</h3><p class='text-gray-600 mb-4'>Expert financial analysis and guidance to optimize cash flow, reduce costs, and increase profitability.</p><a href='#contact' class='text-indigo-600 font-medium hover:text-indigo-700'>Learn more →</a></div><div class='bg-white p-8 rounded-lg shadow-lg border-l-4 border-purple-600 hover:transform hover:scale-105 transition-all duration-300'><div class='text-purple-600 mb-4'><svg xmlns='http://www.w3.org/2000/svg' class='h-10 w-10' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' /><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z' /></svg></div><h3 class='text-xl font-bold mb-3'>Market Analysis</h3><p class='text-gray-600 mb-4'>In-depth market research and competitor analysis to identify opportunities and inform strategic decisions.</p><a href='#contact' class='text-purple-600 font-medium hover:text-purple-700'>Learn more →</a></div></div></div>"
            },
            style: {
              margin: "0 auto 64px",
              padding: "0"
            }
          },
          {
            id: "about-section",
            type: "text-block",
            content: {
              text: "<div class='max-w-6xl mx-auto px-4 py-12'><div class='grid md:grid-cols-2 gap-12 items-center'><div><h2 class='text-3xl font-bold mb-6'>About Our Company</h2><p class='text-gray-600 mb-6'>Founded in 2020, Acme Inc. has quickly established itself as a leader in business consulting and technological innovation. Our team of experts brings decades of combined experience to help businesses of all sizes achieve their goals.</p><div class='grid grid-cols-2 gap-4 mb-6'><div class='flex items-center'><div class='bg-blue-100 rounded-full p-2 mr-3'><svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6 text-blue-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg></div><span class='text-gray-700'>Industry Expertise</span></div><div class='flex items-center'><div class='bg-blue-100 rounded-full p-2 mr-3'><svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6 text-blue-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg></div><span class='text-gray-700'>Innovative Solutions</span></div><div class='flex items-center'><div class='bg-blue-100 rounded-full p-2 mr-3'><svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6 text-blue-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg></div><span class='text-gray-700'>Client Success Focus</span></div><div class='flex items-center'><div class='bg-blue-100 rounded-full p-2 mr-3'><svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6 text-blue-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg></div><span class='text-gray-700'>Global Network</span></div></div><a href='#contact' class='inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md'>Learn More About Us</a></div><div class='relative h-full min-h-[400px] rounded-xl overflow-hidden shadow-xl'><img src='https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3' alt='Office building' class='absolute inset-0 w-full h-full object-cover'/></div></div></div>"
            },
            style: {
              backgroundColor: "#ffffff",
              margin: "40px 0 80px"
            }
          },
          {
            id: "form-contact",
            type: "form",
            content: {
              title: "Get in Touch",
              description: "Have questions about our services? Fill out the form below and our team will get back to you shortly.",
              fields: [
                { name: "name", label: "Your Name", type: "text", required: true },
                { name: "email", label: "Email Address", type: "email", required: true },
                { name: "company", label: "Company Name", type: "text", required: false },
                { name: "message", label: "Message", type: "textarea", required: true }
              ],
              submitText: "Send Message"
            },
            style: {
              backgroundType: "gradient",
              gradientDirection: "to right",
              gradientStartColor: "#2563eb",
              gradientEndColor: "#4f46e5",
              backgroundImage: "linear-gradient(to right, #2563eb, #4f46e5)",
              color: "#ffffff",
              padding: "64px 24px",
              margin: "64px 0",
              borderRadius: "16px",
              maxWidth: "960px",
              marginLeft: "auto",
              marginRight: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              fontFamily: "Poppins, sans-serif"
            }
          },
          {
            id: "footer-simple",
            type: "text-block",
            content: {
              text: "<footer class='bg-gray-900 text-gray-300 py-12'><div class='max-w-6xl mx-auto px-4'><div class='grid md:grid-cols-4 gap-8'><div class='col-span-2 md:col-span-1'><div class='text-xl font-bold text-white mb-4'>Acme Inc.</div><p class='mb-4 text-sm'>Transforming businesses through innovative solutions and strategic expertise.</p><div class='flex space-x-4'><a href='#' class='text-gray-400 hover:text-white transition-colors'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'><path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z'/></svg></a><a href='#' class='text-gray-400 hover:text-white transition-colors'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'><path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'/></svg></a><a href='#' class='text-gray-400 hover:text-white transition-colors'><svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'><path d='M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z'/></svg></a></div></div><div class='md:col-span-1'><h3 class='text-lg font-semibold text-white mb-4'>Services</h3><ul class='space-y-2 text-sm'><li><a href='#' class='hover:text-white transition-colors'>Business Strategy</a></li><li><a href='#' class='hover:text-white transition-colors'>Financial Consulting</a></li><li><a href='#' class='hover:text-white transition-colors'>Market Analysis</a></li><li><a href='#' class='hover:text-white transition-colors'>Digital Transformation</a></li></ul></div><div class='md:col-span-1'><h3 class='text-lg font-semibold text-white mb-4'>Company</h3><ul class='space-y-2 text-sm'><li><a href='#' class='hover:text-white transition-colors'>About Us</a></li><li><a href='#' class='hover:text-white transition-colors'>Careers</a></li><li><a href='#' class='hover:text-white transition-colors'>Blog</a></li><li><a href='#' class='hover:text-white transition-colors'>Contact</a></li></ul></div><div class='md:col-span-1'><h3 class='text-lg font-semibold text-white mb-4'>Contact Us</h3><address class='not-italic text-sm'><div class='mb-2'>123 Business Street<br/>Suite 100<br/>New York, NY 10001</div><div class='mb-2'>Email: <a href='mailto:info@example.com' class='hover:text-white transition-colors'>info@acmeinc.com</a></div><div>Phone: <a href='tel:+11234567890' class='hover:text-white transition-colors'>(123) 456-7890</a></div></address></div></div><div class='border-t border-gray-800 mt-8 pt-8 text-sm text-center'>© 2025 Acme Inc. All rights reserved.</div></div></footer>"
            },
            style: {
              margin: "0"
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
