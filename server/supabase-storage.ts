import { supabase, supabaseAdmin } from './supabase';
import { 
  type Profile, type InsertProfile,
  type Product, type InsertProduct,
  type Content, type InsertContent,
  type ContactMessage, type InsertContactMessage,
  type Testimonial, type InsertTestimonial,
  type AdminUser, type InsertAdminUser,
  type WaterSourceGallery, type InsertWaterSourceGallery,
  type GreenChampionsGallery, type InsertGreenChampionsGallery
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
  
  // Gallery methods
  getWaterSourceGallery(): Promise<WaterSourceGallery[]>;
  getGreenChampionsGallery(): Promise<GreenChampionsGallery[]>;
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

  // Product methods - reading from inventory table managed by dashboard
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabaseAdmin
      .from('inventory')
      .select('*')
      .eq('ready_for_sale', true)
      .in('item_type', ['Plant', 'Honey']);
    
    if (error) throw error;
    
    // Transform inventory data to Product format
    const products = data?.map(item => ({
      id: item.id,
      name: item.plant_name,
      category: item.category,
      price: `KSH ${item.price}`,
      description: item.description || `${item.scientific_name} - ${item.status} seedling`,
      imageUrl: item.image_url,
      image_url: item.image_url,
      status: 'Available',
      featured: false,
      stock_quantity: item.quantity,
      created_at: item.created_at,
      updated_at: item.updated_at
    })) || [];
    
    return products;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const { data, error } = await supabaseAdmin
      .from('inventory')
      .select('*')
      .eq('id', id)
      .eq('ready_for_sale', true)
      .in('item_type', ['Plant', 'Honey'])
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) return undefined;
    
    // Transform inventory item to Product format
    return {
      id: data.id,
      name: data.plant_name,
      category: data.category,
      price: `KSH ${data.price}`,
      description: data.description || `${data.scientific_name} - ${data.status} seedling`,
      imageUrl: data.image_url,
      status: 'Available',
      featured: false,
      stock_quantity: data.quantity,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
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
  
  // Gallery methods
  async getWaterSourceGallery(): Promise<WaterSourceGallery[]> {
    const { data, error } = await supabaseAdmin
      .from('water_source_gallery')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }
  
  async getGreenChampionsGallery(): Promise<GreenChampionsGallery[]> {
    const { data, error } = await supabaseAdmin
      .from('green_champions_gallery')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }
}

export const storage = new SupabaseStorage();