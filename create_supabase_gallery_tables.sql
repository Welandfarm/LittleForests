

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for water_source_gallery" ON water_source_gallery;
DROP POLICY IF EXISTS "Public read access for green_champions_gallery" ON green_champions_gallery;
DROP POLICY IF EXISTS "Service role full access to water_source_gallery" ON water_source_gallery;
DROP POLICY IF EXISTS "Service role full access to green_champions_gallery" ON green_champions_gallery;

-- Create water_source_gallery table
CREATE TABLE IF NOT EXISTS water_source_gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    spring_name TEXT,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create green_champions_gallery table
CREATE TABLE IF NOT EXISTS green_champions_gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_name TEXT,
    media_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE water_source_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE green_champions_gallery ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for water_source_gallery" ON water_source_gallery FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for green_champions_gallery" ON green_champions_gallery FOR SELECT USING (is_active = true);

-- Admin policies (service role has full access)
CREATE POLICY "Service role full access to water_source_gallery" ON water_source_gallery FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to green_champions_gallery" ON green_champions_gallery FOR ALL USING (auth.role() = 'service_role');

