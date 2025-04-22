import express, { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertTemplateSchema, insertProjectSchema, SubscriptionTiers, SubscriptionTier } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { setupAuth, configureTierPermissions } from "./auth";
import { 
  createSubscriptionCheckoutSession,
  getUserSubscription,
  cancelUserSubscription, 
  handleStripeWebhook
} from "./stripe";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
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
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  // Configure multer for image uploads
  const multerStorage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function(req, file, cb) {
      // Create unique filename with original extension
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, 'image-' + uniqueSuffix + ext);
    }
  });
  
  // File filter to only allow image files
  const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({ 
    storage: multerStorage, 
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    }
  });
  
  // Image upload endpoint
  app.post("/api/upload/image", upload.single('image'), (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded or file type not allowed" });
    }
    
    // Return the URL for the uploaded file
    const imageUrl = `/uploads/${req.file.filename}`;
    return res.status(201).json({ url: imageUrl });
  });

  // Serve static files from the 'public' directory
  app.use('/uploads', (req: Request, res: Response, next: NextFunction) => {
    const filePath = path.join(process.cwd(), 'public', 'uploads', req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      next();
    }
  });

  // Subscription Related Routes
  // Required user to be authenticated
  app.use('/api/subscription', (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  });

  // Get subscription information for the current user
  app.get('/api/subscription', async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const userId = req.user.id;
      const subscription = await getUserSubscription(userId);
      
      // Also get user's subscription tier info from the database
      const user = await storage.getUser(userId);
      
      res.json({
        subscription,
        tier: user?.accountType || 'free',
        hasActiveSubscription: subscription ? subscription.hasActiveSubscription : false,
      });
    } catch (error) {
      console.error('Error fetching subscription:', error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  // Create a checkout session for upgrading to a paid tier
  app.post('/api/subscription/checkout', async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const { tier } = req.body;
      
      // Validate tier
      if (!tier || !Object.values(SubscriptionTiers).includes(tier as SubscriptionTier)) {
        return res.status(400).json({ message: "Invalid subscription tier" });
      }
      
      // Only allow paid tiers
      if (tier !== SubscriptionTiers.PAID && tier !== SubscriptionTiers.PREMIUM) {
        return res.status(400).json({ message: "Cannot create a checkout session for a free tier" });
      }
      
      // Get origin for success/cancel URLs
      const origin = req.get('origin') || `${req.protocol}://${req.get('host')}`;
      const successUrl = `${origin}/account?checkout_success=true`;
      const cancelUrl = `${origin}/pricing?checkout_canceled=true`;
      
      // Create checkout session
      const checkoutSession = await createSubscriptionCheckoutSession(
        req.user.id,
        req.user.email,
        req.user.fullName,
        tier as SubscriptionTier
      );
      
      if (!checkoutSession || !checkoutSession.url) {
        return res.status(500).json({ message: "Failed to create checkout session" });
      }
      
      res.json({ url: checkoutSession.url });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  // Cancel the current subscription
  app.post('/api/subscription/cancel', async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const success = await cancelUserSubscription(req.user.id);
      
      if (!success) {
        return res.status(400).json({ message: "No active subscription found or cancellation failed" });
      }
      
      res.json({ message: "Subscription canceled successfully" });
    } catch (error) {
      console.error('Error canceling subscription:', error);
      res.status(500).json({ message: "Failed to cancel subscription" });
    }
  });

  // Special developer route to upgrade the current user to premium status
  // This is ONLY for development purposes and would be removed in production
  app.post('/api/dev/upgrade-to-premium', async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Get the premium tier permissions
      const tierType = SubscriptionTiers.PREMIUM;
      const tierPermissions = configureTierPermissions(tierType);
      
      // Update the user with premium permissions
      const updatedUser = await storage.updateUser(req.user.id, {
        accountType: tierType,
        projectsLimit: tierPermissions.projectsLimit,
        pagesLimit: tierPermissions.pagesLimit,
        storage: tierPermissions.storage,
        canDeploy: tierPermissions.canDeploy,
        canSaveTemplates: tierPermissions.canSaveTemplates,
        // This simulates an active subscription
        stripeCustomerId: 'dev_customer_id',
        stripeSubscriptionId: 'dev_subscription_id'
      });
      
      if (!updatedUser) {
        return res.status(400).json({ message: "Failed to upgrade user" });
      }
      
      // Return the updated user (without password)
      const { password, ...userWithoutPassword } = updatedUser;
      res.json({
        ...userWithoutPassword,
        message: "Developer account upgraded to premium tier successfully"
      });
    } catch (error) {
      console.error('Error upgrading developer account:', error);
      res.status(500).json({ message: "Failed to upgrade developer account" });
    }
  });
  
  app.post('/api/webhook/stripe', express.raw({type: 'application/json'}), async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    
    try {
      // For security, we would normally verify the webhook signature here
      // const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
      
      // But for simplicity in this demo, we'll just parse and use the event as is
      const event = JSON.parse(req.body.toString());
      
      // Handle the webhook event
      const success = await handleStripeWebhook(event);
      
      if (success) {
        res.json({received: true});
      } else {
        res.status(400).json({received: false, error: 'Webhook handling failed'});
      }
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).json({received: false, error: 'Webhook error'});
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
