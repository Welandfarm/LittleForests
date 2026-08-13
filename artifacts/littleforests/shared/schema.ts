import { pgTable, text, serial, integer, boolean, timestamp, uuid, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Profiles table for user authentication
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  role: text("role").default("user"), // 'admin', 'user'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Products table
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: text("price").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  status: text("status").default("active"),
  featured: boolean("featured").default(false),
  stock_quantity: integer("stock_quantity").default(0),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Content table for blog posts and static content
export const content = pgTable("content", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // 'blog', 'page', 'about'
  status: text("status").default("draft"), // 'published', 'draft'
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  status: text("status").default("new"), // 'new', 'read', 'replied'
  createdAt: timestamp("created_at").defaultNow(),
});

// Testimonials table
export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  text: text("text").notNull(),
  project: text("project"),
  rating: integer("rating"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin users table for secure authentication
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Water Source Protection Gallery table
export const waterSourceGallery = pgTable("water_source_gallery", {
  id: uuid("id").primaryKey().defaultRandom(),
  springName: text("spring_name"), // Optional: link to specific spring
  mediaUrl: text("media_url").notNull(), // URL to photo or video
  mediaType: text("media_type").notNull(), // 'photo' or 'video'
  caption: text("caption"), // Optional caption/description
  displayOrder: integer("display_order").default(0), // For ordering media
  isActive: boolean("is_active").default(true), // Show/hide toggle
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Green Champions Gallery table
export const greenChampionsGallery = pgTable("green_champions_gallery", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolName: text("school_name"), // Optional: link to specific school
  mediaUrl: text("media_url").notNull(), // URL to photo
  caption: text("caption"), // Optional caption/description
  displayOrder: integer("display_order").default(0), // For ordering media
  isActive: boolean("is_active").default(true), // Show/hide toggle
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Social posts table — the "master story" an admin composes once
export const socialPosts = pgTable("social_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  source: text("source").default("scratch"), // 'scratch' | 'product' | 'website'
  focus: text("focus"),
  master: text("master").notNull(), // the master story text
  story: text("story"), // supporting context used when generating channel copy
  status: text("status").default("draft"), // 'draft' | 'ready' | 'approved' | 'scheduled' | 'published'
  scheduledFor: timestamp("scheduled_for"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// One row per channel per post — Blog / Instagram / Facebook / WhatsApp / Email
export const socialPostVersions = pgTable("social_post_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull(),
  channel: text("channel").notNull(), // 'Blog' | 'Instagram' | 'Facebook' | 'WhatsApp' | 'Email'
  content: text("content").notNull(),
  approved: boolean("approved").default(false),
  channels: text("channels"), // reserved
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Every publish attempt (success or failure) is logged here — this is the
// "Publishing Log" called for in the Content & Social plan.
export const socialPublishLog = pgTable("social_publish_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull(),
  postTitle: text("post_title").notNull(),
  channel: text("channel").notNull(),
  status: text("status").notNull(), // 'published' | 'failed' | 'scheduled' | 'not_configured'
  detail: text("detail"), // success message, error reason, or "not configured" note
  externalId: text("external_id"), // id returned by the provider (Meta post id, message id, etc.)
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema exports
export const insertProfileSchema = createInsertSchema(profiles);
export const selectProfileSchema = createSelectSchema(profiles);
export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);
export const insertContentSchema = createInsertSchema(content);
export const selectContentSchema = createSelectSchema(content);
export const insertContactMessageSchema = createInsertSchema(contactMessages);
export const selectContactMessageSchema = createSelectSchema(contactMessages);
export const insertTestimonialSchema = createInsertSchema(testimonials);
export const selectTestimonialSchema = createSelectSchema(testimonials);
export const insertAdminUserSchema = createInsertSchema(adminUsers);
export const selectAdminUserSchema = createSelectSchema(adminUsers);
export const insertWaterSourceGallerySchema = createInsertSchema(waterSourceGallery);
export const selectWaterSourceGallerySchema = createSelectSchema(waterSourceGallery);
export const insertGreenChampionsGallerySchema = createInsertSchema(greenChampionsGallery);
export const selectGreenChampionsGallerySchema = createSelectSchema(greenChampionsGallery);
export const insertSocialPostSchema = createInsertSchema(socialPosts);
export const selectSocialPostSchema = createSelectSchema(socialPosts);
export const insertSocialPostVersionSchema = createInsertSchema(socialPostVersions);
export const selectSocialPostVersionSchema = createSelectSchema(socialPostVersions);
export const insertSocialPublishLogSchema = createInsertSchema(socialPublishLog);
export const selectSocialPublishLogSchema = createSelectSchema(socialPublishLog);

// Type exports
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type Content = typeof content.$inferSelect;
export type InsertContent = typeof content.$inferInsert;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;
export type WaterSourceGallery = typeof waterSourceGallery.$inferSelect;
export type InsertWaterSourceGallery = typeof waterSourceGallery.$inferInsert;
export type GreenChampionsGallery = typeof greenChampionsGallery.$inferSelect;
export type InsertGreenChampionsGallery = typeof greenChampionsGallery.$inferInsert;
export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = typeof socialPosts.$inferInsert;
export type SocialPostVersion = typeof socialPostVersions.$inferSelect;
export type InsertSocialPostVersion = typeof socialPostVersions.$inferInsert;
export type SocialPublishLog = typeof socialPublishLog.$inferSelect;
export type InsertSocialPublishLog = typeof socialPublishLog.$inferInsert;
