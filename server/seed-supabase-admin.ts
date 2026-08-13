import bcrypt from "bcrypt";
import { supabaseAdmin } from "./supabase";

const ADMIN_EMAILS = [
  'wesleykoech2022@gmail.com',
  'chepkoechjoan55@gmail.com'
];

const DEFAULT_PASSWORD = 'LittleForest2025!';

async function seedSupabaseAdminUsers() {
  try {
    console.log('Seeding Supabase admin users...');
    
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    
    for (const email of ADMIN_EMAILS) {
      // Check if admin user exists
      const { data: existingUser } = await supabaseAdmin
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (!existingUser) {
        // Create admin user
        const { data, error } = await supabaseAdmin
          .from('admin_users')
          .insert({
            email,
            password_hash: hashedPassword
          })
          .select()
          .single();
        
        if (error) {
          console.error(`Error creating admin user ${email}:`, error);
        } else {
          console.log(`Admin user created: ${email}`);
        }
      } else {
        console.log(`Admin user already exists: ${email}`);
      }
    }
    
    console.log('Admin users seeding completed');
  } catch (error) {
    console.error('Error seeding admin users:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSupabaseAdminUsers().then(() => process.exit(0));
}

export { seedSupabaseAdminUsers };