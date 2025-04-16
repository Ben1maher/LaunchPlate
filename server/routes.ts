import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertTemplateSchema, insertProjectSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add routes with /api prefix
  
  // Templates
  app.get("/api/templates", async (req: Request, res: Response) => {
    const templates = await storage.getPublicTemplates();
    res.json(templates);
  });

  app.get("/api/templates/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid template ID" });
    }
    
    const template = await storage.getTemplateById(id);
    
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    
    res.json(template);
  });

  app.post("/api/templates", async (req: Request, res: Response) => {
    try {
      const validData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate({
        ...validData,
        createdAt: new Date().toISOString()
      });
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid template data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  app.put("/api/templates/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid template ID" });
    }
    
    try {
      const validData = insertTemplateSchema.partial().parse(req.body);
      const updatedTemplate = await storage.updateTemplate(id, validData);
      
      if (!updatedTemplate) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json(updatedTemplate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid template data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  app.delete("/api/templates/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid template ID" });
    }
    
    const success = await storage.deleteTemplate(id);
    
    if (!success) {
      return res.status(404).json({ message: "Template not found" });
    }
    
    res.status(204).send();
  });

  // Projects
  app.get("/api/projects", async (req: Request, res: Response) => {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    
    if (userId !== undefined) {
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const projects = await storage.getUserProjects(userId);
      return res.json(projects);
    }
    
    const projects = await storage.getAllProjects();
    res.json(projects);
  });

  app.get("/api/projects/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    
    const project = await storage.getProjectById(id);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(project);
  });

  app.post("/api/projects", async (req: Request, res: Response) => {
    try {
      const now = new Date().toISOString();
      const validData = insertProjectSchema.parse({
        ...req.body,
        createdAt: now,
        updatedAt: now
      });
      
      const project = await storage.createProject(validData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    
    try {
      const validData = insertProjectSchema.partial().parse({
        ...req.body,
        updatedAt: new Date().toISOString()
      });
      
      const updatedProject = await storage.updateProject(id, validData);
      
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(updatedProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    
    const success = await storage.deleteProject(id);
    
    if (!success) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
