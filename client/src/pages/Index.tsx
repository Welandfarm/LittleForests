import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, TreePine, Sprout, Users, Award, Heart, ShoppingCart, UserCog, Settings } from "lucide-react";
import ContactForm from '@/components/ContactForm';
import CartSidebar from '@/components/CartSidebar';
import ProductGrid from '@/components/ProductGrid';
import CategoryFilter from '@/components/CategoryFilter';
import NavigationDropdown from '@/components/NavigationDropdown';
import AuthButton from '@/components/AuthButton';
import AdminAccessButton from '@/components/AdminAccessButton';
import { useCart } from '@/contexts/CartContext';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import FloatingLeaves from '@/components/FloatingLeaves';

import nurseryImage from '@assets/For Front page_1751302445978.jpg';

const Index = () => {
  const { addToCart, getCartTotal, cartItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const { user, adminUser } = useAuth();

  // Initialize scroll animations
  useScrollAnimation();

  // Fetch content from database
  const { data: content = [] } = useQuery({
    queryKey: ['content'],
    queryFn: async () => {
      return await apiClient.getContent();
    },
  });

  // Helper function to get content by title
  const getContent = (titleKey: string) => {
    const item = (content as any[]).find((c: any) => c.title === titleKey);
    return item || { title: '', content: '' };
  };

  const handleOrder = () => {
    // If there are items in cart, create order message and send to WhatsApp
    if (cartItems.length > 0) {
      const orderItems = cartItems.map(item => 
        `- ${item.quantity} x ${item.name} (${item.price} each)`
      ).join('\n');

      const message = `Hi

I would like to place an order for the following seedlings:

${orderItems}

Please confirm availability and let me know`;

      const whatsappUrl = `https://wa.me/254108029407?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      // If cart is empty, scroll to products section to let them select items first
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Fetch products from database
  const { data: products = [], isLoading: productsLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const data = await apiClient.getProducts();
      // Include all products (available and out of stock) for better customer experience
      return data;
    },
  });

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    const productList = products as any[];

    if (selectedCategory === 'all') {
      return productList;
    }

    // Dynamic filtering for any category
    return productList.filter((p: any) => 
      p.category === selectedCategory ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [selectedCategory, products]);

  const updateQuantity = (productId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change)
    }));
  };

  const setQuantity = (productId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, quantity)
    }));
  };

  const handleAddToCart = (product: any) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white relative overflow-x-hidden">
      {/* Floating leaves background */}
      <FloatingLeaves />

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
              <AuthButton />

              {/* Admin Dashboard Button - Only visible for authorized admin users */}
              {adminUser && (
                <Button 
                  onClick={() => navigate('/admin')}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin Dashboard</span>
                  <span className="sm:hidden">Admin</span>
                </Button>
              )}

              <Button 
                variant="outline" 
                onClick={() => setCartOpen(true)}
                className="relative hover:scale-105 transition-transform duration-200"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Cart
                {getCartTotal() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {getCartTotal()}
                  </Badge>
                )}
              </Button>
              <Button onClick={handleOrder} className="bg-orange-500 hover:bg-orange-600 text-white hover:scale-105 transition-transform duration-200">
                Order Now
              </Button>
            </div>
          </div>
        </div>
      </header>



      {/* Navigation Menu - Larger and positioned on left */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-50">
        <div className="flex justify-start">
          <div className="scale-125">
            <NavigationDropdown />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section 
        className="py-12 relative"
        style={{
          backgroundImage: `url(${nurseryImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-slide-up">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Grow your own <span className="text-orange-500">Little</span>
              <span className="text-green-400">Forest</span>
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto mb-8">
              Grow a Little Forest. Restore water. Restore land.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleOrder} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 animate-bounce-gentle hover:scale-105 transition-transform duration-200">
                Order Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 scroll-animate">
            <h2 className="text-4xl font-bold text-green-800 mb-4">
              {getContent('Shop With Us').title || 'Shop With Us'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              {getContent('Shop With Us').content || 'Explore our unique collection of indigenous trees, fruit trees, and ornamental plants and flowers, alongside pure, organic honey sourced from our thriving Little Forests.'}
            </p>

            {/* Admin Quick Add Products Notice */}
            {Array.isArray(products) && products.length === 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 max-w-2xl mx-auto mb-8">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Settings className="h-5 w-5 text-orange-600" />
                  <span className="text-orange-800 font-semibold">No Products Yet</span>
                </div>
                <p className="text-orange-700 mb-4">
                  Get started by adding your first products to the shop. Use the admin dashboard to add indigenous trees, fruit trees, ornamental plants, and honey products.
                </p>
                <Button 
                  onClick={() => navigate('/admin')}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Add Products Now
                </Button>
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div className="scroll-animate-right">
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {productsLoading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              Error loading products: {error.message}
            </div>
          ) : (
            <ProductGrid
              products={filteredProducts}
              quantities={quantities}
              onUpdateQuantity={updateQuantity}
              onSetQuantity={setQuantity}
              onAddToCart={handleAddToCart}
            />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 scroll-animate">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl font-bold">
                  <span className="text-orange-500">Little</span>
                  <span className="text-green-400">Forest</span>
                </span>
              </div>
              <p className="text-green-200 text-sm">
                Restoring Water Resources, One Tree at a Time.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-green-200">
                <li><button onClick={() => window.location.href = '/'} className="hover:text-white">Shop with us</button></li>
                <li><button onClick={() => window.location.href = '/about'} className="hover:text-white">About Us</button></li>
                <li><button onClick={() => window.location.href = '/green-towns'} className="hover:text-white">Green Towns Initiative</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-sm text-green-200 mb-4">
                <p>📱 WhatsApp: 
                  <a 
                    href="https://wa.me/254108029407?text=Hello%20LittleForest!%20I'm%20interested%20in%20your%20seedlings%20and%20would%20like%20to%20learn%20more." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-300 hover:text-white underline ml-1"
                  >
                    +254 108 029 407
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-green-700 mt-8 pt-8 text-center">
            <p className="text-green-200 text-sm">
              © 2024 Little Forest. All rights reserved. | Restoring Water Resources, One Tree at a Time.
            </p>
          </div>
        </div>
      </footer>

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default Index;