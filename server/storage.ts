import { 
  users, type User, type InsertUser,
  templates, type Template, type InsertTemplate,
  projects, type Project, type InsertProject,
  type PageComponent, type Component
} from "@shared/schema";

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
    const template: Template = { ...insertTemplate, id };
    this.templates.set(id, template);
    return template;
  }

  async updateTemplate(id: number, templateUpdate: Partial<InsertTemplate>): Promise<Template | undefined> {
    const existingTemplate = this.templates.get(id);
    if (!existingTemplate) return undefined;

    const updatedTemplate = { ...existingTemplate, ...templateUpdate };
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
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<InsertProject>): Promise<Project | undefined> {
    const existingProject = this.projects.get(id);
    if (!existingProject) return undefined;

    const updatedProject = { ...existingProject, ...projectUpdate };
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
        description: "A simple landing page with header, hero, and call-to-action",
        thumbnail: "",
        components: [
          {
            id: "header-1",
            type: "header-1",
            content: {
              logo: "Your Logo",
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
              imageUrl: ""
            },
            style: {
              backgroundColor: "#f9fafb",
              padding: "64px 16px"
            }
          }
        ],
        isPublic: true,
        createdAt: new Date().toISOString()
      }
    ];

    defaultTemplates.forEach(template => {
      const id = this.templateId++;
      this.templates.set(id, { ...template, id });
    });
  }
}

export const storage = new MemStorage();
