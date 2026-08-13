import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mjsuwlpixcregiikiusd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qc3V3bHBpeGNyZWdpaWtpdXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0Njc0NzcsImV4cCI6MjA2NTA0MzQ3N30.Anz7mqQLkGIMGcvPtfT1ELORA2DqEIHLsIge5DfQYxc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);