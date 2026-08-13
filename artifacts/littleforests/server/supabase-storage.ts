import { supabase, supabaseAdmin } from './supabase';
import { 
  type Profile, type InsertProfile,
  type Product, type InsertProduct,
  type Content, type InsertContent,
  type ContactMessage, type InsertContactMessage,
  type Testimonial, type InsertTestimonial,
  type AdminUser, type InsertAdminUser,
  type WaterSourceGallery, type InsertWaterSourceGallery,
  type GreenChampionsGallery, type InsertGreenChampionsGallery,
  type SocialPost, type InsertSocialPost,
  type SocialPostVersion, type InsertSocialPostVersion,
  type SocialPublishLog, type InsertSocialPublishLog
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
  getWaterSourceGalleryAll(): Promise<WaterSourceGallery[]>;
  createWaterSourceGallery(item: InsertWaterSourceGallery): Promise<WaterSourceGallery>;
  updateWaterSourceGallery(id: string, item: Partial<InsertWaterSourceGallery>): Promise<WaterSourceGallery | undefined>;
  deleteWaterSourceGallery(id: string): Promise<boolean>;
  getGreenChampionsGallery(): Promise<GreenChampionsGallery[]>;
  getGreenChampionsGalleryAll(): Promise<GreenChampionsGallery[]>;
  createGreenChampionsGallery(item: InsertGreenChampionsGallery): Promise<GreenChampionsGallery>;
  updateGreenChampionsGallery(id: string, item: Partial<InsertGreenChampionsGallery>): Promise<GreenChampionsGallery | undefined>;
  deleteGreenChampionsGallery(id: string): Promise<boolean>;

  // Content & Social — posts
  getSocialPosts(): Promise<SocialPost[]>;
  getSocialPost(id: string): Promise<SocialPost | undefined>;
  createSocialPost(post: InsertSocialPost): Promise<SocialPost>;
  updateSocialPost(id: string, post: Partial<InsertSocialPost>): Promise<SocialPost | undefined>;
  deleteSocialPost(id: string): Promise<boolean>;

  // Content & Social — per-channel versions
  getSocialPostVersions(postId: string): Promise<SocialPostVersion[]>;
  upsertSocialPostVersion(version: InsertSocialPostVersion): Promise<SocialPostVersion>;

  // Content & Social — publishing log
  getSocialPublishLog(): Promise<SocialPublishLog[]>;
  createSocialPublishLogEntry(entry: InsertSocialPublishLog): Promise<SocialPublishLog>;
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

  // Product methods - reading from (and now also writing to) the inventory
  // table managed by dashboard. This used to read from `inventory` but
  // write create/update/delete to a separate, unrelated `products` table —
  // meaning anything added, edited, or deleted through Admin > Products
  // never appeared (or disappeared) on the actual storefront, since the
  // storefront only ever reads from `inventory`. See toInventoryRow /
  // fromInventoryRow below for the field mapping between the public
  // Product shape (name, imageUrl, stock_quantity, price as a formatted
  // string) and the real inventory columns (plant_name, image_url,
  // quantity, price as a number).
  private toInventoryRow(product: Partial<InsertProduct> & Record<string, any>) {
    const row: Record<string, any> = {};
    if (product.name !== undefined) row.plant_name = product.name;
    if (product.category !== undefined) row.category = product.category;
    if (product.price !== undefined) {
      // Admin form allows "KSh 250", "$5.00", or a bare number — store the
      // numeric amount only, since that's what the inventory table holds
      // and what getProducts()/getProduct() prefix with "KSH " on the way out.
      const numericPrice = Number(String(product.price).replace(/[^0-9.]/g, ''));
      row.price = Number.isFinite(numericPrice) ? numericPrice : 0;
    }
    if (product.description !== undefined) row.description = product.description;
    if ((product as any).imageUrl !== undefined) row.image_url = (product as any).imageUrl;
    if ((product as any).image_url !== undefined) row.image_url = (product as any).image_url;
    if (product.stock_quantity !== undefined) row.quantity = product.stock_quantity;
    if (product.category !== undefined) {
      row.item_type = String(product.category).toLowerCase().includes('honey') ? 'Honey' : 'Plant';
    }
    return row;
  }

  private fromInventoryRow(item: any): Product {
    return {
      id: item.id,
      name: item.plant_name,
      category: item.category,
      price: `KSH ${item.price}`,
      description: item.description || `${item.scientific_name} - ${item.status} seedling`,
      imageUrl: item.image_url,
      image_url: item.image_url,
      status: item.ready_for_sale === false ? 'Out of Stock' : 'Available',
      featured: false,
      stock_quantity: item.quantity,
      created_at: item.created_at,
      updated_at: item.updated_at,
    } as unknown as Product;
  }

  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabaseAdmin
      .from('inventory')
      .select('*')
      .eq('ready_for_sale', true)
      .in('item_type', ['Plant', 'Honey']);
    
    if (error) throw error;
    return (data || []).map((item) => this.fromInventoryRow(item));
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
    return data ? this.fromInventoryRow(data) : undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const row = { ...this.toInventoryRow(product), ready_for_sale: true };
    const { data, error } = await supabaseAdmin
      .from('inventory')
      .insert(row)
      .select()
      .single();
    
    if (error) throw error;
    return this.fromInventoryRow(data);
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const row = this.toInventoryRow(product);
    const { data, error } = await supabaseAdmin
      .from('inventory')
      .update(row)
      .eq('id', id)
      .select()
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.fromInventoryRow(data) : undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    // Soft-delete: unpublish from the storefront rather than removing the
    // row outright. `inventory` is shared with the external dashboard
    // (stock counts, cost tracking, etc.) so a hard delete here could
    // destroy data the dashboard still needs. Unchecking ready_for_sale
    // has the same visible effect (product disappears from the site) and
    // is reversible.
    const { data, error } = await supabaseAdmin
      .from('inventory')
      .update({ ready_for_sale: false })
      .eq('id', id)
      .select('id')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
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

  // ── Content & Social row <-> object mapping ─────────────────────────────
  // supabaseAdmin sends/receives literal Postgres column names (snake_case);
  // it does NOT auto-convert camelCase. These helpers keep the rest of the
  // app working with camelCase objects while writing/reading the correct
  // snake_case columns defined in create_supabase_social_tables.sql.
  private toSocialPostRow(input: Partial<InsertSocialPost> & Record<string, any>) {
    const row: Record<string, any> = {};
    if (input.title !== undefined) row.title = input.title;
    if (input.source !== undefined) row.source = input.source;
    if (input.focus !== undefined) row.focus = input.focus;
    if (input.master !== undefined) row.master = input.master;
    if (input.story !== undefined) row.story = input.story;
    if (input.status !== undefined) row.status = input.status;
    if (input.scheduledFor !== undefined) row.scheduled_for = input.scheduledFor;
    if (input.createdBy !== undefined) row.created_by = input.createdBy;
    return row;
  }

  private fromSocialPostRow(row: any): SocialPost {
    return {
      id: row.id,
      title: row.title,
      source: row.source,
      focus: row.focus,
      master: row.master,
      story: row.story,
      status: row.status,
      scheduledFor: row.scheduled_for,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    } as SocialPost;
  }

  private fromSocialPostVersionRow(row: any): SocialPostVersion {
    return {
      id: row.id,
      postId: row.post_id,
      channel: row.channel,
      content: row.content,
      approved: row.approved,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    } as SocialPostVersion;
  }

  private fromSocialPublishLogRow(row: any): SocialPublishLog {
    return {
      id: row.id,
      postId: row.post_id,
      postTitle: row.post_title,
      channel: row.channel,
      status: row.status,
      detail: row.detail,
      externalId: row.external_id,
      createdAt: row.created_at,
    } as SocialPublishLog;
  }

  // Content & Social — posts
  async getSocialPosts(): Promise<SocialPost[]> {
    const { data, error } = await supabaseAdmin
      .from('social_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((row) => this.fromSocialPostRow(row));
  }

  async getSocialPost(id: string): Promise<SocialPost | undefined> {
    const { data, error } = await supabaseAdmin
      .from('social_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.fromSocialPostRow(data) : undefined;
  }

  async createSocialPost(post: InsertSocialPost): Promise<SocialPost> {
    const { data, error } = await supabaseAdmin
      .from('social_posts')
      .insert(this.toSocialPostRow(post))
      .select()
      .single();

    if (error) throw error;
    return this.fromSocialPostRow(data);
  }

  async updateSocialPost(id: string, post: Partial<InsertSocialPost>): Promise<SocialPost | undefined> {
    const { data, error } = await supabaseAdmin
      .from('social_posts')
      .update({ ...this.toSocialPostRow(post), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.fromSocialPostRow(data) : undefined;
  }

  async deleteSocialPost(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('social_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  // Content & Social — per-channel versions
  async getSocialPostVersions(postId: string): Promise<SocialPostVersion[]> {
    const { data, error } = await supabaseAdmin
      .from('social_post_versions')
      .select('*')
      .eq('post_id', postId);

    if (error) throw error;
    return (data || []).map((row) => this.fromSocialPostVersionRow(row));
  }

  async upsertSocialPostVersion(version: InsertSocialPostVersion): Promise<SocialPostVersion> {
    const row = {
      post_id: (version as any).postId,
      channel: version.channel,
      content: version.content,
      approved: version.approved ?? false,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabaseAdmin
      .from('social_post_versions')
      .upsert(row, { onConflict: 'post_id,channel' })
      .select()
      .single();

    if (error) throw error;
    return this.fromSocialPostVersionRow(data);
  }

  // Content & Social — publishing log
  async getSocialPublishLog(): Promise<SocialPublishLog[]> {
    const { data, error } = await supabaseAdmin
      .from('social_publish_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) throw error;
    return (data || []).map((row) => this.fromSocialPublishLogRow(row));
  }

  async createSocialPublishLogEntry(entry: InsertSocialPublishLog): Promise<SocialPublishLog> {
    const row = {
      post_id: (entry as any).postId,
      post_title: (entry as any).postTitle,
      channel: entry.channel,
      status: entry.status,
      detail: entry.detail,
      external_id: (entry as any).externalId,
    };
    const { data, error } = await supabaseAdmin
      .from('social_publish_log')
      .insert(row)
      .select()
      .single();

    if (error) throw error;
    return this.fromSocialPublishLogRow(data);
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

  async getWaterSourceGalleryAll(): Promise<WaterSourceGallery[]> {
    const { data, error } = await supabaseAdmin
      .from('water_source_gallery')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async createWaterSourceGallery(item: InsertWaterSourceGallery): Promise<WaterSourceGallery> {
    const { data, error } = await supabaseAdmin
      .from('water_source_gallery')
      .insert(item)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateWaterSourceGallery(id: string, item: Partial<InsertWaterSourceGallery>): Promise<WaterSourceGallery | undefined> {
    const { data, error } = await supabaseAdmin
      .from('water_source_gallery')
      .update(item)
      .eq('id', id)
      .select()
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || undefined;
  }

  async deleteWaterSourceGallery(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('water_source_gallery')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }

  async getGreenChampionsGalleryAll(): Promise<GreenChampionsGallery[]> {
    const { data, error } = await supabaseAdmin
      .from('green_champions_gallery')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async createGreenChampionsGallery(item: InsertGreenChampionsGallery): Promise<GreenChampionsGallery> {
    const { data, error } = await supabaseAdmin
      .from('green_champions_gallery')
      .insert(item)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateGreenChampionsGallery(id: string, item: Partial<InsertGreenChampionsGallery>): Promise<GreenChampionsGallery | undefined> {
    const { data, error } = await supabaseAdmin
      .from('green_champions_gallery')
      .update(item)
      .eq('id', id)
      .select()
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || undefined;
  }

  async deleteGreenChampionsGallery(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('green_champions_gallery')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
}

export const storage = new SupabaseStorage();