import { supabaseAdmin } from './supabase';
import bcrypt from 'bcrypt';

async function setupSupabaseDatabase() {
  try {
    console.log('Setting up Supabase database...');
    
    // Check if tables exist by trying to query them
    const tables = ['profiles', 'products', 'content', 'contact_messages', 'testimonials', 'admin_users'];
    
    for (const table of tables) {
      try {
        const { error } = await supabaseAdmin
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`Table ${table} needs to be created in Supabase dashboard`);
        } else {
          console.log(`✓ Table ${table} exists`);
        }
      } catch (e) {
        console.log(`Table ${table} needs to be created`);
      }
    }
    
    // Seed admin users
    console.log('Seeding admin users...');
    const adminEmails = ['wesleykoech2022@gmail.com', 'chepkoechjoan55@gmail.com'];
    const defaultPassword = 'LittleForest2025!';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    for (const email of adminEmails) {
      try {
        const { data: existing } = await supabaseAdmin
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .single();
        
        if (!existing) {
          const { error } = await supabaseAdmin
            .from('admin_users')
            .insert({
              email,
              password_hash: hashedPassword
            });
          
          if (error) {
            console.error(`Error creating admin user ${email}:`, error);
          } else {
            console.log(`✓ Admin user created: ${email}`);
          }
        } else {
          console.log(`✓ Admin user exists: ${email}`);
        }
      } catch (error) {
        console.error(`Error with admin user ${email}:`, error);
      }
    }
    
    console.log('Supabase setup completed');
  } catch (error) {
    console.error('Setup error:', error);
  }
}

setupSupabaseDatabase();