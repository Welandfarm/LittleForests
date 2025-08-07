import { supabaseAdmin } from './supabase';

async function checkReadyProducts() {
  try {
    console.log('Checking products ready for sale...');
    
    // Check products marked as ready for sale
    const { data: readyProducts, error } = await supabaseAdmin
      .from('inventory')
      .select('*')
      .eq('ready_for_sale', true)
      .eq('item_type', 'Plant');
    
    if (error) {
      console.error('Error fetching ready products:', error);
      return;
    }
    
    console.log(`Found ${readyProducts?.length || 0} products ready for sale`);
    
    if (readyProducts && readyProducts.length > 0) {
      console.log('Ready products:', readyProducts);
    } else {
      console.log('No products are marked as ready_for_sale: true');
      console.log('Checking first few inventory items to see their status...');
      
      const { data: allItems, error: allError } = await supabaseAdmin
        .from('inventory')
        .select('plant_name, ready_for_sale, image_url, price, category')
        .eq('item_type', 'Plant')
        .limit(10);
        
      if (!allError && allItems) {
        console.log('Sample inventory items:', allItems);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the check
checkReadyProducts();