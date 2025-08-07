import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./supabase-storage";
import bcrypt from "bcrypt";
import { insertProductSchema, insertContentSchema, insertContactMessageSchema, insertTestimonialSchema, insertProfileSchema, insertAdminUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Profile routes
  app.get("/api/profiles", async (req, res) => {
    try {
      const profiles = await storage.getProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ error: "Failed to get profiles" });
    }
  });

  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to get profile" });
    }
  });

  app.get("/api/profiles/email/:email", async (req, res) => {
    try {
      const profile = await storage.getProfileByEmail(decodeURIComponent(req.params.email));
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to get profile" });
    }
  });

  app.post("/api/profiles", async (req, res) => {
    try {
      const validatedData = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ error: "Failed to create profile" });
    }
  });

  app.patch("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.updateProfile(req.params.id, req.body);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Products API error:", error);
      res.status(500).json({ error: "Failed to get products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to get product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      console.error('Product creation error:', error);
      res.status(400).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Content routes
  app.get("/api/content", async (req, res) => {
    try {
      const { type } = req.query;
      const content = type 
        ? await storage.getContentByType(type as string)
        : await storage.getContent();
      res.json(content);
    } catch (error) {
      console.error("Content API error:", error);
      res.status(500).json({ error: "Failed to get content" });
    }
  });

  app.post("/api/content", async (req, res) => {
    try {
      const validatedData = insertContentSchema.parse(req.body);
      const content = await storage.createContent(validatedData);
      res.status(201).json(content);
    } catch (error) {
      res.status(400).json({ error: "Failed to create content" });
    }
  });

  app.put("/api/content/:id", async (req, res) => {
    try {
      const content = await storage.updateContent(req.params.id, req.body);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to update content" });
    }
  });

  app.delete("/api/content/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteContent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete content" });
    }
  });

  // Contact message routes
  app.get("/api/contact-messages", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get contact messages" });
    }
  });

  app.post("/api/contact-messages", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: "Failed to create contact message" });
    }
  });

  app.put("/api/contact-messages/:id", async (req, res) => {
    try {
      const message = await storage.updateContactMessage(req.params.id, req.body);
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to update contact message" });
    }
  });

  // Testimonial routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ error: "Failed to get testimonials" });
    }
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      res.status(400).json({ error: "Failed to create testimonial" });
    }
  });

  app.put("/api/testimonials/:id", async (req, res) => {
    try {
      const testimonial = await storage.updateTestimonial(req.params.id, req.body);
      if (!testimonial) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ error: "Failed to update testimonial" });
    }
  });

  app.delete("/api/testimonials/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTestimonial(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete testimonial" });
    }
  });

  // Admin authentication routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Check if email is authorized
      const authorizedEmails = ['wesleykoech2022@gmail.com', 'chepkoechjoan55@gmail.com'];
      if (!authorizedEmails.includes(email)) {
        return res.status(401).json({ error: "Unauthorized email" });
      }

      // Get admin user from database
      const adminUser = await storage.getAdminUserByEmail(email);
      if (!adminUser) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password - use the database field name since Supabase returns raw field names
      const passwordHash = (adminUser as any).password_hash || adminUser.passwordHash;
      const isValidPassword = await bcrypt.compare(password, passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Store admin session (simplified - in production use proper session management)
      res.json({ 
        success: true, 
        user: { 
          id: adminUser.id, 
          email: adminUser.email 
        },
        token: Buffer.from(`${adminUser.id}:${adminUser.email}`).toString('base64')
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/verify", async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      // Decode token (simplified - in production use proper JWT)
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [userId, email] = decoded.split(':');
      
      // Verify user exists and is authorized
      const authorizedEmails = ['wesleykoech2022@gmail.com', 'chepkoechjoan55@gmail.com'];
      if (!authorizedEmails.includes(email)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const adminUser = await storage.getAdminUserByEmail(email);
      if (!adminUser || adminUser.id !== userId) {
        return res.status(401).json({ error: "Invalid token" });
      }

      res.json({ 
        success: true, 
        user: { 
          id: adminUser.id, 
          email: adminUser.email 
        }
      });
    } catch (error) {
      console.error('Admin verify error:', error);
      res.status(401).json({ error: "Invalid token" });
    }
  });

  app.post("/api/admin/logout", async (req, res) => {
    res.json({ success: true });
  });

  // Regular user authentication routes (simplified for demo)
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, fullName } = req.body;
      
      // Create profile in database
      const profile = await storage.createProfile({
        email,
        fullName,
        role: 'user'
      });
      
      res.json({ 
        user: profile,
        token: 'demo-token'
      });
    } catch (error) {
      res.status(400).json({ error: "Signup failed" });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Get profile from database
      const profile = await storage.getProfileByEmail(email);
      if (!profile) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      res.json({ 
        user: profile,
        token: 'demo-token'
      });
    } catch (error) {
      res.status(500).json({ error: "Signin failed" });
    }
  });

  app.post("/api/auth/signout", async (req, res) => {
    res.json({ success: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}
