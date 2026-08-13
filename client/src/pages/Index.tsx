import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, TreePine, Sprout, Users, Award, Heart, ShoppingCart, UserCog, Settings, Search, Star } from "lucide-react";
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
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import FloatingLeaves from '@/components/FloatingLeaves';
import Footer from '@/components/Footer';

import nurseryImage from '@assets/For Front page_1751302445978.jpg';

const Index = () => {
  const { addToCart, getCartTotal, cartItems, clearCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, adminUser } = useAuth();

  // Initialize scroll animations
  useScrollAnimation();

  // Restore scroll position when returning from a product page
  useEffect(() => {
    const saved = sessionStorage.getItem('shopScrollY');
    if (!saved) return;
    sessionStorage.removeItem('shopScrollY');
    const y = parseInt(saved, 10);
    let attempts = 0;
    const tryScroll = () => {
      if (document.getElementById('products')) {
        window.scrollTo({ top: y, behavior: 'instant' });
      } else if (attempts++ < 60) {
        requestAnimationFrame(tryScroll);
      }
    };
    requestAnimationFrame(tryScroll);
  }, []);

  // Fetch testimonials
  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => apiClient.getTestimonials() as Promise<any[]>,
  });

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
      const whatsappUrl = `https://wa.me/2540143538080?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      clearCart();
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

  // Filter products based on selected category and search query
  const filteredProducts = useMemo(() => {
    let result = products as any[];

    if (selectedCategory !== 'all') {
      result = result.filter((p: any) =>
        p.category === selectedCategory ||
        p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p: any) =>
        (p.name || p.plant_name || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      );
    }

    return result;
  }, [selectedCategory, searchQuery, products]);

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
    const success = addToCart(product, quantity);

    if (success) {
      // Reset quantity to 1 after adding - don't auto-open cart
      setQuantities(prev => ({ ...prev, [product.id]: 1 }));
    } else {
      // Item already in cart - inform user but don't open cart
      alert(`"${product.name || product.plant_name}" is already in your cart. Please adjust the quantity in the cart view.`);
    }
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

              <Button onClick={handleOrder} className="bg-orange-500 hover:bg-orange-600 text-white hover:scale-105 transition-transform duration-200">
                Order Now
              </Button>
            </div>
          </div>
        </div>
      </header>



      {/* Navigation Menu - Fixed/Floating on left */}
      <div className="fixed top-20 left-4 z-40">
        <div className="scale-110">
          <NavigationDropdown />
        </div>
      </div>

      {/* Floating Cart Button - Fixed on right */}
      <div className="fixed top-20 right-4 z-40">
        <Button 
          onClick={() => setCartOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white relative shadow-lg hover:scale-105 transition-transform duration-200 scale-110"
          data-testid="button-floating-cart"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Cart
          {getCartTotal() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500 hover:bg-orange-600 border-2 border-white animate-pulse">
              {getCartTotal()}
            </Badge>
          )}
        </Button>
      </div>

      {/* Cart Sidebar - Slides from right */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transition-transform duration-300 ease-in-out z-50 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
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
            <h1 className="text-3xl md:text-4xl text-white mb-8 font-bold">
              Grow a Little Forest. Restore Land.
            </h1>

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

          {/* Search */}
          <div className="relative max-w-sm mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Search products…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
            />
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

      {/* Testimonials */}
      {(testimonials as any[]).length > 0 && (
        <section className="py-16 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 scroll-animate">
              <h2 className="text-3xl font-bold text-green-800 mb-3">What Our Customers Say</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Real feedback from farmers, schools, and communities we've worked with.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(testimonials as any[]).slice(0, 6).map((t: any) => (
                <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-3 scroll-animate">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < (t.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                      />
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">"{t.text || t.content}"</p>
                  {/* Attribution */}
                  <div className="pt-2 border-t border-gray-100">
                    <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                    {(t.location || t.project_tag) && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {[t.location, t.project_tag].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      {/* The CartSidebar component is now rendered within the floating div */}
    </div>
  );
};

export default Index;