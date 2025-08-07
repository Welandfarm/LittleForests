import { supabaseAdmin } from './supabase';

// Update existing products with proper images
async function updateProductImages() {
  const treeImages = {
    'African Olive': 'https://images.unsplash.com/photo-1616587224482-0d4be3c0e75c?w=400&h=400&fit=crop&crop=center',
    'Blackstick wood': 'https://images.unsplash.com/photo-1520637836862-4d197d17c338?w=400&h=400&fit=crop&crop=center',
    'Honey': 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop&crop=center',
    'Croton megalocarpus': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=400&fit=crop&crop=center',
    'Cyprus': 'https://images.unsplash.com/photo-1616856395346-55e0f5ac9b52?w=400&h=400&fit=crop&crop=center'
  };

  try {
    // Get all products with null image_url
    const { data: products, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('*')
      .is('image_url', null);
    
    if (fetchError) {
      console.error('Error fetching products:', fetchError);
      return;
    }
    
    console.log(`Found ${products.length} products without images`);
    
    for (const product of products) {
      let imageUrl = treeImages[product.name];
      
      // Fallback based on category
      if (!imageUrl) {
        if (product.category === 'Indigenous Trees') {
          imageUrl = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=400&fit=crop&crop=center';
        } else if (product.category === 'Fruit Trees') {
          imageUrl = 'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=400&h=400&fit=crop&crop=center';
        } else if (product.category === 'Ornamental Trees') {
          imageUrl = 'https://images.unsplash.com/photo-1616856395346-55e0f5ac9b52?w=400&h=400&fit=crop&crop=center';
        } else if (product.category === 'Honey') {
          imageUrl = 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop&crop=center';
        } else {
          imageUrl = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop&crop=center';
        }
      }
      
      // Update the product directly in Supabase
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
    
    console.log('Product image update completed!');
  } catch (error) {
    console.error('Error updating product images:', error);
  }
}

// Run the update
updateProductImages();