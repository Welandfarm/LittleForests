import { storage } from './supabase-storage';

async function testCurrentProducts() {
  try {
    console.log('Testing current products API...');
    const products = await storage.getProducts();
    
    console.log(`Found ${products.length} products`);
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} | Category: ${product.category} | Price: ${product.price}`);
      if (product.name === 'Honey' || product.category.includes('Honey')) {
        console.log('   → This is the honey product!');
        console.log(`   → Description: ${product.description}`);
        console.log(`   → Image: ${product.image_url ? 'Has image' : 'No image'}`);
      }
    });
    
  } catch (error) {
    console.error('Error testing products:', error);
  }
}

testCurrentProducts();