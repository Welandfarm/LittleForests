import { supabaseAdmin } from './supabase';

// Get unique categories from inventory for dynamic category filtering
export async function getUniqueCategories() {
  try {
    const { data, error } = await supabaseAdmin
      .from('inventory')
      .select('category')
      .eq('ready_for_sale', true)
      .in('item_type', ['Plant', 'Honey'])
      .not('category', 'is', null);
    
    if (error) throw error;
    
    // Get unique categories
    const uniqueCategories = [...new Set(data?.map(item => item.category) || [])];
    
    return uniqueCategories.sort();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}