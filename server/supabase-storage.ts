import { supabase, supabaseAdmin } from './supabase';
import { 
  type Profile, type InsertProfile,
  type Product, type InsertProduct,
  type Content, type InsertContent,
  type ContactMessage, type InsertContactMessage,
  type Testimonial, type InsertTestimonial,
  type AdminUser, type InsertAdminUser
} from "@shared/schema";

export interface IStorage {
  // Profile methods
  getProfiles(): Promise<Profile[]>;
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByEmail(email: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Content methods
  getContent(): Promise<Content[]>;
  getContentByType(type: string): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: string, content: Partial<InsertContent>): Promise<Content | undefined>;
  deleteContent(id: string): Promise<boolean>;
  
  // Contact message methods
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  updateContactMessage(id: string, message: Partial<InsertContactMessage>): Promise<ContactMessage | undefined>;
  
  // Testimonial methods
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<boolean>;
  
  // Admin user methods
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
}

export class SupabaseStorage implements IStorage {
  
  // Profile methods
  async getProfiles(): Promise<Profile[]> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*');
    
    if (error) throw error;
    return data || [];
  }

  async getProfile(id: string): Promise<Profile | undefined> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || undefined;
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || undefined;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(profile)
      .eq('id', id)
      .select()
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || undefined;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*');
    
    if (error) throw error;
    return data || [];
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const { data, error } = await supabaseAdmin
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Content methods
  async getContent(): Promise<Content[]> {
    const { data, error } = await supabaseAdmin
      .from('content')
      .select('*');
    
    if (error) throw error;
    return data || [];
  }

  async getContentByType(type: string): Promise<Content[]> {
    const { data, error } = await supabaseAdmin
      .from('content')
      .select('*')
      .eq('type', type);
    
    if (error) throw error;
    return data || [];
  }

  async createContent(contentData: InsertContent): Promise<Content> {
    const { data, error } = await supabaseAdmin
      .from('content')
      .insert(contentData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateContent(id: string, contentData: Partial<InsertContent>): Promise<Content | undefined> {
    const { data, error } = await supabaseAdmin
      .from('content')
      .update(contentData)
      .eq('id', id)
      .select()
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || undefined;
  }

  async deleteContent(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('content')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Contact message methods
  async getContactMessages(): Promise<ContactMessage[]> {
    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .select('*');
    
    if (error) throw error;
    return data || [];
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .insert(message)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateContactMessage(id: string, message: Partial<InsertContactMessage>): Promise<ContactMessage | undefined> {
    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .update(message)
      .eq('id', id)
      .select()
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || undefined;
  }

  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .select('*');
    
    if (error) throw error;
    return data || [];
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert(testimonial)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .update(testimonial)
      .eq('id', id)
      .select()
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || undefined;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Admin user methods
  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    try {
      const { data, error } = await supabaseAdmin
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) {
        console.error('Supabase admin user query error:', error);
        if (error.code === 'PGRST116') {
          return undefined; // No rows returned
        }
        throw error;
      }
      return data || undefined;
    } catch (error) {
      console.error('Error in getAdminUserByEmail:', error);
      throw error;
    }
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

export const storage = new SupabaseStorage();