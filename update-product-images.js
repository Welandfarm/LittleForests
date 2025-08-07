// Script to update product images with proper seedling/tree photos
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

const treeImages = {
  'African Olive': 'https://images.unsplash.com/photo-1616587224482-0d4be3c0e75c?w=400&h=400&fit=crop&crop=center',
  'Blackstick wood': 'https://images.unsplash.com/photo-1520637836862-4d197d17c338?w=400&h=400&fit=crop&crop=center',
  'Honey': 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop&crop=center',
  'Croton megalocarpus': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=400&fit=crop&crop=center',
  'Cyprus': 'https://images.unsplash.com/photo-1616856395346-55e0f5ac9b52?w=400&h=400&fit=crop&crop=center',
  'Eucalyptus': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center',
  'Pine': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop&crop=center',
  'Fruit Trees': 'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=400&h=400&fit=crop&crop=center'
};

async function updateProductImages() {
  try {
    // Get all products
    const response = await fetch(`${API_BASE}/products`);
    const products = await response.json();
    
    console.log(`Found ${products.length} products to update...`);
    
    for (const product of products) {
      if (!product.image_url) {
        // Find appropriate image for this product
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
        
        // Update the product
        const updateResponse = await fetch(`${API_BASE}/products/${product.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image_url: imageUrl
          })
        });
        
        if (updateResponse.ok) {
          console.log(`✓ Updated ${product.name} with image`);
        } else {
          console.log(`✗ Failed to update ${product.name}`);
        }
      } else {
        console.log(`- ${product.name} already has an image`);
      }
    }
    
    console.log('Product image update completed!');
  } catch (error) {
    console.error('Error updating product images:', error);
  }
}

updateProductImages();