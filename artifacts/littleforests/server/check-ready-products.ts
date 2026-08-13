import { supabaseAdmin } from './supabase';

async function checkReadyProducts() {
  try {
    console.log('Checking all ready-for-sale products by category...');
    
    const { data, error } = await supabaseAdmin
      .from('inventory')
      .select('category, plant_name, item_type')
      .eq('ready_for_sale', true)
      .in('item_type', ['Plant', 'Honey']);
    
    if (error) throw error;
    
    // Group by category
    const categoryMap = new Map();
    data?.forEach(item => {
      const category = item.category;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category).push({
        name: item.plant_name,
        type: item.item_type
      });
    });
    
    console.log('\nProducts by category:');
    for (const [category, products] of categoryMap.entries()) {
      console.log(`\n${category}:`);
      products.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} (${product.type})`);
      });
    }
    
    console.log(`\nTotal categories: ${categoryMap.size}`);
    console.log(`Total products: ${data?.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkReadyProducts();