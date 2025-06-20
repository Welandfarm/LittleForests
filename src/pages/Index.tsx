import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, TreePine, Sprout, Users, Award, Heart, ShoppingCart, UserCog } from "lucide-react";
import ContactForm from '@/components/ContactForm';
import CartSidebar from '@/components/CartSidebar';
import ProductCarousel from '@/components/ProductCarousel';
import CategoryFilter from '@/components/CategoryFilter';
import NavigationDropdown from '@/components/NavigationDropdown';
import { useCart } from '@/contexts/CartContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { addToCart, getCartTotal, cartItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showContactForm, setShowContactForm] = useState(false);
  const navigate = useNavigate();

  const handleOrder = () => {
    // If there are items in cart, create order message, otherwise general inquiry
    if (cartItems.length > 0) {
      const orderItems = cartItems.map(item => 
        `- ${item.quantity} x ${item.name} (${item.price} each)`
      ).join('\n');

      const message = `Hello LittleForest! 🌱

I would like to place an order for the following seedlings:

${orderItems}

Please confirm availability and let me know:
- Total cost including any delivery charges
- Delivery timeline to my location
- Payment options available

Thank you!`;
      
      const whatsappUrl = `https://wa.me/254108029407?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      // General order inquiry
      const message = `Hello LittleForest! 🌱

I'm interested in ordering some seedlings from your nursery. Could you please share:
- Available products and current prices
- Delivery options to my area
- Payment methods accepted

Looking forward to hearing from you!`;
      
      const whatsappUrl = `https://wa.me/254108029407?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  // Fetch products from database
  const { data: products = [], isLoading: productsLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching products from database...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'Available')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      console.log('Fetched products:', data);
      return data;
    },
  });

  // Categorize products - Updated to match actual database categories
  const categorizedProducts = useMemo(() => {
    console.log('Categorizing products...');
    const indigenous = products.filter(p => 
      p.category === 'Indigenous' || 
      p.category === 'Indigenous Trees' ||
      p.category.toLowerCase().includes('indigenous')
    );
    const ornamental = products.filter(p => 
      p.category === 'Ornamental' || 
      p.category === 'Ornamental Trees' ||
      p.category.toLowerCase().includes('ornamental')
    );
    const fruit = products.filter(p => 
      p.category === 'Fruit' || 
      p.category === 'Fruit Trees' ||
      p.category.toLowerCase().includes('fruit')
    );
    
    console.log('Indigenous trees:', indigenous);
    console.log('Ornamental trees:', ornamental);
    console.log('Fruit trees:', fruit);
    
    return { indigenous, ornamental, fruit };
  }, [products]);

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    console.log('Filtering products for category:', selectedCategory);
    
    if (selectedCategory === 'all') {
      return categorizedProducts;
    }
    
    // Return only the selected category with products
    const filtered = {
      indigenous: selectedCategory === 'Indigenous Trees' ? categorizedProducts.indigenous : [],
      ornamental: selectedCategory === 'Ornamental Trees' ? categorizedProducts.ornamental : [],
      fruit: selectedCategory === 'Fruit Trees' ? categorizedProducts.fruit : [],
    };
    
    console.log('Filtered products:', filtered);
    return filtered;
  }, [selectedCategory, categorizedProducts]);

  const updateQuantity = (productId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change)
    }));
  };

  const handleAddToCart = (product: any) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-2xl font-bold">
                  <span className="text-orange-500">Little</span>
                  <span className="text-green-600">Forest</span>
                </h1>
                <p className="text-sm text-gray-600">Nurturing Nature</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin')}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <UserCog className="h-4 w-4 mr-1" />
                Admin Login
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCartOpen(true)}
                className="relative"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Cart
                {getCartTotal() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {getCartTotal()}
                  </Badge>
                )}
              </Button>
              <Button onClick={handleOrder} className="bg-orange-500 hover:bg-orange-600 text-white">
                Order Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu - Larger and positioned on left */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-start">
          <div className="scale-125">
            <NavigationDropdown />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section 
        className="py-20 relative"
        style={{
          backgroundImage: 'url(/lovable-uploads/82ebeeb5-b8dd-4161-9668-d9077f5da34d.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-6">
              <TreePine className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">15 little forests created!</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Shop with <span className="text-orange-500">Little</span>
              <span className="text-green-400">Forest</span>
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto mb-8">
              Indigenous trees, fruit trees, and ornamental plants delivered to your doorstep. 
              Transform your space with nature's finest offerings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleOrder} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                Order Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Shop With Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Discover our carefully curated selection of indigenous trees, fruit trees, and ornamental plants
            </p>
          </div>

          {/* Category Filter */}
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {productsLoading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              Error loading products: {error.message}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Show all categories when 'all' is selected or show only the filtered categories */}
              {filteredProducts.indigenous.length > 0 && (
                <ProductCarousel
                  products={filteredProducts.indigenous}
                  categoryName="Indigenous Trees"
                  quantities={quantities}
                  onUpdateQuantity={updateQuantity}
                  onAddToCart={handleAddToCart}
                />
              )}
              {filteredProducts.ornamental.length > 0 && (
                <ProductCarousel
                  products={filteredProducts.ornamental}
                  categoryName="Ornamental Trees"
                  quantities={quantities}
                  onUpdateQuantity={updateQuantity}
                  onAddToCart={handleAddToCart}
                />
              )}
              {filteredProducts.fruit.length > 0 && (
                <ProductCarousel
                  products={filteredProducts.fruit}
                  categoryName="Fruit Trees"
                  quantities={quantities}
                  onUpdateQuantity={updateQuantity}
                  onAddToCart={handleAddToCart}
                />
              )}
              
              {/* Show message if no products available */}
              {!productsLoading && 
               filteredProducts.indigenous.length === 0 && 
               filteredProducts.ornamental.length === 0 && 
               filteredProducts.fruit.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No products available in this category.</p>
                  <p className="text-sm text-gray-500 mt-2">Total products in database: {products.length}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Get In Touch</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Ready to start your green journey? Contact us for personalized plant recommendations and orders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => {
                  const message = `Hello LittleForest! 🌱

I'm reaching out to learn more about your nursery services. I'm interested in:
- Indigenous trees
- Fruit trees  
- Ornamental plants
- Expert advice on planting and care

Could we schedule a time to discuss my specific needs?

Thank you!`;
                  
                  const whatsappUrl = `https://wa.me/254108029407?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                📱 Call us on WhatsApp: +254 108 029 407
              </Button>
              <Button 
                onClick={() => setShowContactForm(!showContactForm)}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg"
              >
                ✉️ Enter Email
              </Button>
            </div>
          </div>

          {showContactForm && (
            <div className="max-w-md mx-auto">
              <ContactForm />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl font-bold">
                  <span className="text-orange-500">Little</span>
                  <span className="text-green-400">Forest</span>
                </span>
              </div>
              <p className="text-green-200 text-sm">
                Nurturing nature, growing futures. Your trusted partner for indigenous trees, fruit trees, and ornamental plants.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-green-200">
                <li><a href="/" className="hover:text-white">Shop with us</a></li>
                <li><a href="/about" className="hover:text-white">About Us</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-sm text-green-200">
                <li><a href="#" className="hover:text-white">Indigenous Trees</a></li>
                <li><a href="#" className="hover:text-white">Fruit Trees</a></li>
                <li><a href="#" className="hover:text-white">Ornamental Plants</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-sm text-green-200">
                <li>📱 WhatsApp: +254 108 029 407</li>
                <li>🌐 littleforest.co.ke</li>
                <li>📍 Kamureito Bomet</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-green-700 mt-8 pt-8 text-center">
            <p className="text-green-200 text-sm">
              © 2024 Little Forest. All rights reserved. | Nurturing nature, growing futures.
            </p>
          </div>
        </div>
      </footer>

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default Index;
