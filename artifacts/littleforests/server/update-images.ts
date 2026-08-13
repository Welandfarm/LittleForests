
import { supabaseAdmin } from './supabase';

// Comprehensive tree images mapping
const treeImages: Record<string, string> = {
  'African Olive': 'https://images.unsplash.com/photo-1616587224482-0d4be3c0e75c?w=400&h=400&fit=crop&crop=center',
  'Blackstick wood': 'https://images.unsplash.com/photo-1520637836862-4d197d17c338?w=400&h=400&fit=crop&crop=center',
  'Honey': 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop&crop=center',
  'Croton megalocarpus': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=400&fit=crop&crop=center',
  'Cyprus': 'https://images.unsplash.com/photo-1616856395346-55e0f5ac9b52?w=400&h=400&fit=crop&crop=center'
};

// Category fallback images
const categoryImages: Record<string, string> = {
  'Indigenous Trees': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=400&fit=crop&crop=center',
  'Fruit Trees': 'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=400&h=400&fit=crop&crop=center',
  'Ornamental Trees': 'https://images.unsplash.com/photo-1616856395346-55e0f5ac9b52?w=400&h=400&fit=crop&crop=center',
  'Honey': 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop&crop=center'
};

async function updateProductImages() {
  try {
    console.log('Starting product image update...');
    
    // Get all products with null image_url
    const { data: products, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('*')
      .is('image_url', null);
    
    if (fetchError) {
      console.error('Error fetching products:', fetchError);
      return;
    }
    
    if (!products || products.length === 0) {
      console.log('No products found with missing images');
      return;
    }
    
    console.log(`Found ${products.length} products without images`);
    
    for (const product of products) {
      let imageUrl = treeImages[product.name];
      
      // Fallback to category-based image
      if (!imageUrl && product.category) {
        imageUrl = categoryImages[product.category] || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop&crop=center';
      }
      
      // Update the product
      const { error: updateError } = await supabaseAdmin
        .from('products')
        .update({
          image_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);
      
      if (updateError) {
        console.error(`Error updating ${product.name}:`, updateError);
      } else {
        console.log(`✓ Updated ${product.name} with image`);
      }
    }
    
    console.log('Product image update completed successfully!');
  } catch (error) {
    console.error('Error updating product images:', error);
  }
}

// Run if executed directly
if (require.main === module) {
  updateProductImages().then(() => process.exit(0));
}

export { updateProductImages };
