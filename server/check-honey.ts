import { supabaseAdmin } from './supabase';

async function checkHoneyProducts() {
  try {
    console.log('Checking for honey products in inventory...');
    
    // Search for honey products
    const { data: honeyProducts, error } = await supabaseAdmin
      .from('inventory')
      .select('*')
      .or('plant_name.ilike.%honey%,category.ilike.%honey%,item_type.ilike.%honey%');
    
    if (error) {
      console.error('Error searching honey products:', error);
      return;
    }
    
    console.log(`Found ${honeyProducts?.length || 0} honey-related items:`);
    if (honeyProducts && honeyProducts.length > 0) {
      honeyProducts.forEach(item => {
        console.log(`- ${item.plant_name || item.name} | Category: ${item.category} | Item Type: ${item.item_type} | Ready for sale: ${item.ready_for_sale}`);
      });
    }
    
    // Also check all unique categories to see what's available
    const { data: categories, error: catError } = await supabaseAdmin
      .from('inventory')
      .select('category')
      .not('category', 'is', null);
    
    if (!catError && categories) {
      const uniqueCategories = [...new Set(categories.map(c => c.category))];
      console.log('\nAll categories in inventory:', uniqueCategories);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkHoneyProducts();