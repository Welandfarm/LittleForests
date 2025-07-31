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

  // API Integration endpoints for Vercel app
  // These endpoints allow the Vercel dashboard to manage products on the public website

  // Inventory sync endpoint - allows Vercel app to update stock quantities
  app.put("/api/integration/inventory/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { stock_quantity, status } = req.body;
      
      const product = await storage.updateProduct(id, {
        stock_quantity,
        status: stock_quantity > 0 ? 'active' : 'out_of_stock'
      });
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json({ success: true, product });
    } catch (error) {
      console.error('Inventory sync error:', error);
      res.status(500).json({ error: "Failed to sync inventory" });
    }
  });

  // Bulk inventory sync
  app.post("/api/integration/inventory/bulk", async (req, res) => {
    try {
      const { products } = req.body; // Array of {id, stock_quantity, status}
      
      const results = [];
      for (const item of products) {
        try {
          const product = await storage.updateProduct(item.id, {
            stock_quantity: item.stock_quantity,
            status: item.stock_quantity > 0 ? 'active' : 'out_of_stock'
          });
          results.push({ id: item.id, success: true, product });
        } catch (error) {
          results.push({ id: item.id, success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
      }
      
      res.json({ success: true, results });
    } catch (error) {
      console.error('Bulk inventory sync error:', error);
      res.status(500).json({ error: "Failed to sync inventory" });
    }
  });

  // Product management for Vercel dashboard - fetch from external API
  app.get("/api/integration/products", async (req, res) => {
    try {
      console.log('Fetching products from Vercel dashboard...');
      // Add timestamp to prevent caching
      const timestamp = Date.now();
      const response = await fetch(`https://litteforest.vercel.app/api/products?_t=${timestamp}`);
      if (!response.ok) {
        throw new Error(`Vercel API responded with ${response.status}`);
      }
      const data = await response.json();
      const products = data.success ? data.products : data;
      console.log('Raw Vercel API response - total products:', products?.length);
      console.log('First product structure:', JSON.stringify(products?.[0], null, 2));
      console.log('Image fields in first product:', {
        image_url: products?.[0]?.image_url,
        imageUrl: products?.[0]?.imageUrl,
        image: products?.[0]?.image,
        photo: products?.[0]?.photo,
        productImage: products?.[0]?.productImage
      });
      console.log('Successfully fetched products from Vercel dashboard:', products?.length || 'unknown length');
      
      // Map Vercel format to expected format with enhanced availability logic
      const mappedProducts = products.map((product: any) => {
        console.log('Processing product:', JSON.stringify({
          name: product.name,
          quantity: product.quantity,
          inStock: product.inStock,
          price: product.price
        }, null, 2));
        
        const quantity = product.quantity || 0;
        // Since ready_for_sale is undefined in Vercel API, use inStock and quantity > 0 as availability criteria
        const isAvailable = quantity > 0 && product.inStock !== false;
        
        return {
          id: product.id,
          name: product.name,
          category: product.category || 'Indigenous Trees',
          price: `KSH ${product.price}`,
          description: product.description,
          status: isAvailable ? 'Available' : 'Out of Stock',
          stock_quantity: quantity,
          image_url: product.image_url || null,
          created_at: product.created_at,
          updated_at: product.updated_at,
          ready_for_sale: isAvailable // Set this based on stock and inStock status
        };
      }).filter((product: any) => {
        // Show products that have stock and are marked as in stock
        const hasStock = product.stock_quantity > 0;
        const isInStock = product.ready_for_sale === true;
        console.log(`Product ${product.name}: has_stock=${hasStock}, ready_for_sale=${product.ready_for_sale}, showing=${hasStock && isInStock}`);
        return hasStock && isInStock;
      });
      
      console.log('Mapped products:', JSON.stringify(mappedProducts.slice(0, 1), null, 2));
      res.json(mappedProducts);
    } catch (error) {
      console.error('Products integration error:', error);
      // Fallback to local data if Vercel API is unavailable
      try {
        const localProducts = await storage.getProducts();
        console.log('Using local fallback products:', localProducts.length);
        res.json(localProducts);
      } catch (localError) {
        console.error('Local fallback also failed:', localError);
        res.status(500).json({ error: "Failed to get products from both Vercel and local storage" });
      }
    }
  });

  // Sales reporting endpoint for analytics
  app.post("/api/integration/sales", async (req, res) => {
    try {
      const { productId, quantity, amount, date } = req.body;
      
      // Log sale in content table as sales record
      const sale = await storage.createContent({
        title: `Sale - ${productId}`,
        content: JSON.stringify({ productId, quantity, amount, date }),
        type: 'sale',
        status: 'published'
      });
      
      // Update product stock if available
      const product = await storage.getProduct(productId);
      if (product && product.stock_quantity) {
        await storage.updateProduct(productId, {
          stock_quantity: Math.max(0, product.stock_quantity - quantity)
        });
      }
      
      res.json({ success: true, sale });
    } catch (error) {
      console.error('Sales recording error:', error);
      res.status(500).json({ error: "Failed to record sale" });
    }
  });

  // Health check for integration
  app.get("/api/integration/health", async (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      database: "supabase"
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
