-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin_users (service role access only)
CREATE POLICY "Service role full access to admin_users" ON admin_users 
FOR ALL USING (auth.role() = 'service_role');

-- Ensure other tables have proper structure
ALTER TABLE products ADD COLUMN IF NOT EXISTS scientific_name TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE content ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS image_url TEXT;
