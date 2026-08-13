import { supabaseAdmin } from './supabase';
import bcrypt from 'bcrypt';

async function createAdminTable() {
  try {
    console.log('Creating admin_users table...');
    
    // First, let's try to create the table using a stored procedure approach
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    // Try to execute via RPC if available, otherwise we'll use direct insertion
    try {
      const { error: rpcError } = await supabaseAdmin.rpc('exec', { sql: createTableSQL });
      if (rpcError) {
        console.log('RPC method not available, trying direct table creation...');
      } else {
        console.log('Table created via RPC');
      }
    } catch (e) {
      console.log('Creating table via direct method...');
    }
    
    // Try to insert test data to see if table exists
    const testEmail = 'test@example.com';
    const { error: insertError } = await supabaseAdmin
      .from('admin_users')
      .insert({
        email: testEmail,
        password_hash: 'test'
      });
    
    if (insertError) {
      if (insertError.message.includes('relation "admin_users" does not exist')) {
        console.log('❌ admin_users table does not exist in Supabase');
        console.log('Please execute this SQL in your Supabase dashboard:');
        console.log('='.repeat(50));
        console.log(createTableSQL);
        console.log('ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;');
        console.log('CREATE POLICY "Service role access" ON admin_users FOR ALL USING (auth.role() = \'service_role\');');
        console.log('='.repeat(50));
        return false;
      } else {
        console.log('Table exists but insert failed:', insertError.message);
      }
    } else {
      // Delete test record
      await supabaseAdmin
        .from('admin_users')
        .delete()
        .eq('email', testEmail);
      console.log('✓ admin_users table exists and is accessible');
    }
    
    // Now seed the admin users
    console.log('Seeding admin users...');
    const adminEmails = ['wesleykoech2022@gmail.com', 'chepkoechjoan55@gmail.com'];
    const defaultPassword = 'LittleForest2025!';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    for (const email of adminEmails) {
      const { data: existing } = await supabaseAdmin
        .from('admin_users')
        .select('email')
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
          console.error(`Error creating admin user ${email}:`, error.message);
        } else {
          console.log(`✓ Admin user created: ${email}`);
        }
      } else {
        console.log(`✓ Admin user already exists: ${email}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in createAdminTable:', error);
    return false;
  }
}

createAdminTable();