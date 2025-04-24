import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base schemas for authentication
// Define valid subscription tiers
export const SubscriptionTiers = {
  GUEST: 'guest',     // Can create but not save
  FREE: 'free',       // Can save but not deploy
  PAID: 'paid',       // Can save and deploy
  PREMIUM: 'premium'  // Can create multiple pages
} as const;

export type SubscriptionTier = typeof SubscriptionTiers[keyof typeof SubscriptionTiers];

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  createdAt: text("created_at").notNull(), // ISO date string
  accountType: text("account_type").default(SubscriptionTiers.FREE), // guest, free, paid, premium
  projectsLimit: integer("projects_limit").default(3), // Limit based on account type
  pagesLimit: integer("pages_limit").default(1), // Number of pages allowed (premium gets more)
  storage: integer("storage").default(10), // Storage in MB based on account type
  canDeploy: boolean("can_deploy").default(false), // Whether user can deploy sites
  canSaveTemplates: boolean("can_save_templates").default(false), // Whether user can save custom templates
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").default(true),
  stripeCustomerId: text("stripe_customer_id"), // For paid subscriptions
  stripeSubscriptionId: text("stripe_subscription_id"), // For paid subscriptions
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  fullName: true,
  createdAt: true,
  accountType: true,
  projectsLimit: true,
  pagesLimit: true,
  storage: true,
  canDeploy: true,
  canSaveTemplates: true,
  avatarUrl: true,
  isActive: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
});

// Landing page templates
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  components: jsonb("components").notNull(), // Stores the entire page structure
  isPublic: boolean("is_public").default(false),
  createdAt: text("created_at").notNull(), // ISO date string
});

export const insertTemplateSchema = createInsertSchema(templates).pick({
  userId: true,
  name: true,
  description: true,
  thumbnail: true,
  components: true,
  isPublic: true,
  createdAt: true,
});

// User projects (saved landing pages)
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  components: jsonb("components").notNull(), // Stores the main page structure
  additionalPages: jsonb("additional_pages").default([]), // For premium users - stores additional pages
  createdAt: text("created_at").notNull(), // ISO date string
  updatedAt: text("updated_at").notNull(), // ISO date string
  published: boolean("published").default(false),
  publishedUrl: text("published_url"),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  userId: true,
  name: true,
  description: true,
  components: true,
  additionalPages: true,
  createdAt: true,
  updatedAt: true,
  published: true,
  publishedUrl: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Component type definitions for TypeScript
export type ComponentType = 
  // Headers
  | 'header-1' 
  | 'header-2' 
  | 'header-transparent'
  
  // Hero sections
  | 'hero-split' 
  | 'hero-centered'
  | 'hero-video'
  | 'hero-gradient'
  
  // Text elements
  | 'heading' 
  | 'text-block' 
  | 'button' 
  | 'list-item'
  | 'blockquote'
  
  // Media elements
  | 'image' 
  | 'gallery'
  | 'video'
  | 'carousel'
  
  // Layout elements
  | 'spacer' 
  | 'divider'
  | 'columns-2'
  | 'columns-3'
  | 'columns-4'
  
  // Forms and CTAs
  | 'form' 
  | 'email-signup'
  | 'contact-details'
  
  // Feature sections
  | 'feature-grid'
  | 'feature-list'
  | 'feature-cards'
  
  // Testimonial sections
  | 'testimonial-single'
  | 'testimonial-carousel'
  
  // Statistics and pricing
  | 'stats-bar'
  | 'pricing-cards'
  
  // Footers
  | 'footer-simple'
  | 'footer-columns'
  
  // Custom templates
  | 'custom-business-template'
  | 'custom-ecommerce-template'
  | 'custom-membership-template'
  | 'custom-startup-template';

export interface Component {
  id: string;
  type: ComponentType;
  content: Record<string, any>;
  style: Record<string, any>;
}

export interface PageSettings {
  background: {
    type: 'color' | 'gradient' | 'image';
    color?: string;
    gradientStart?: string;
    gradientEnd?: string;
    imageUrl?: string;
    overlay?: string;
    overlayOpacity?: number;
  };
  width?: 'full' | 'contained';
  maxWidth?: number;
  fontFamily?: string;
  customStyles?: Record<string, any>;
}

export interface PageComponent {
  id: string;
  components: Component[];
  settings?: PageSettings;
}
