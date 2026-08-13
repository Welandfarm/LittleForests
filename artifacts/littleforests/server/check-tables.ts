import { supabaseAdmin } from './supabase';

async function checkTables() {
  try {
    console.log('Checking available tables in Supabase database...');
    
    // Check what tables exist
    const { data: tables, error: tablesError } = await supabaseAdmin
      .rpc('get_table_names');
    
    if (tablesError) {
      console.log('Cannot get table names via RPC, trying direct queries...');
      
      // Try checking specific table names that might exist
      const tablesToCheck = ['inventory', 'products', 'items', 'stock', 'catalog'];
      
      for (const tableName of tablesToCheck) {
        try {
          const { data, error } = await supabaseAdmin
            .from(tableName)
            .select('*')
            .limit(1);
          
          if (!error) {
            console.log(`✓ Found table: ${tableName}`);
            
            // Get full schema for this table
            const { data: fullData, error: fullError } = await supabaseAdmin
              .from(tableName)
              .select('*')
              .limit(5);
              
            if (!fullError && fullData) {
              console.log(`Sample data from ${tableName}:`, fullData);
            }
          } else {
            console.log(`✗ Table ${tableName} not found or no access`);
          }
        } catch (e) {
          console.log(`✗ Error checking ${tableName}:`, e.message);
        }
      }
    } else {
      console.log('Available tables:', tables);
    }
    
  } catch (error) {
    console.error('Error checking tables:', error);
  }
}

// Run the check
checkTables();