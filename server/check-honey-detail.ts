import { supabaseAdmin } from './supabase';

async function checkHoneyDetail() {
  try {
    // Get the honey product details
    const { data: honey, error } = await supabaseAdmin
      .from('inventory')
      .select('*')
      .eq('item_type', 'Honey')
      .single();
    
    if (error) {
      console.error('Error fetching honey:', error);
      return;
    }
    
    console.log('Honey product details:');
    console.log(JSON.stringify(honey, null, 2));
    
    // Check if it has an image
    console.log(`\nImage URL: ${honey.image_url || 'No image'}`);
    console.log(`Ready for sale: ${honey.ready_for_sale}`);
    console.log(`Category: ${honey.category}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkHoneyDetail();