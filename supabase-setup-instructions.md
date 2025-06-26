# Supabase Setup Instructions

## Create Admin Users Table

Please execute the following SQL in your Supabase dashboard (SQL Editor):

```sql
-- Create admin_users table
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert admin users with hashed passwords
INSERT INTO admin_users (email, password_hash) VALUES 
  ('wesleykoech2022@gmail.com', '$2b$10$WQ6tbWWW7dl97PQfnKPvY.FZikOAbGKA.r36m8pJ0Lqv3qC0.TaH2'),
  ('chepkoechjoan55@gmail.com', '$2b$10$WQ6tbWWW7dl97PQfnKPvY.FZikOAbGKA.r36m8pJ0Lqv3qC0.TaH2')
ON CONFLICT (email) DO NOTHING;
```

## Steps:
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the sidebar
3. Create a new query
4. Paste the SQL above
5. Click "Run" to execute

After executing this SQL, the admin authentication system will work with the hidden /admin-login page.

Default admin password: `LittleForest2025!`