import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base schemas for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
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
  components: jsonb("components").notNull(), // Stores the entire page structure
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
  | 'header-1' 
  | 'header-2' 
  | 'hero-split' 
  | 'hero-centered' 
  | 'heading' 
  | 'text-block' 
  | 'button' 
  | 'image' 
  | 'spacer' 
  | 'divider' 
  | 'form' 
  | 'email-signup';

export interface Component {
  id: string;
  type: ComponentType;
  content: Record<string, any>;
  style: Record<string, any>;
}

export interface PageComponent {
  id: string;
  components: Component[];
}
