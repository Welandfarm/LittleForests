import { storage } from './server/storage';

async function checkStorage() {
  console.log('Checking storage implementation...');
  console.log('Storage type:', storage.constructor.name);
  
  console.log('\nEnvironment variables:');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'NOT SET');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
  
  console.log('\nFetching products...');
  const products = await storage.getProducts();
  console.log('Products count:', products.length);
  if (products.length > 0) {
    console.log('First product:', products[0]);
  }
}

checkStorage().then(() => process.exit(0)).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
