
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Menu, TreePine, Instagram, Phone, Mail, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from '@/components/CartDrawer';
import { Link } from 'react-router-dom';

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems, addToCart } = useCart();

  // Sample product data
  const indigenousTrees = [
    { id: '1', name: 'Mukau Tree', price: '250', image: '/placeholder.svg', description: 'Fast-growing indigenous hardwood tree', inStock: true },
    { id: '2', name: 'Meru Oak', price: '300', image: '/placeholder.svg', description: 'Strong timber tree, drought resistant', inStock: true },
    { id: '3', name: 'Cedar Tree', price: '400', image: '/placeholder.svg', description: 'Premium timber with aromatic wood', inStock: false },
    { id: '4', name: 'Olive Tree', price: '350', image: '/placeholder.svg', description: 'Drought resistant with edible fruits', inStock: true },
  ];

  const fruitTrees = [
    { id: '5', name: 'Avocado Tree', price: '500', image: '/placeholder.svg', description: 'Hass variety, high yield potential', inStock: true },
    { id: '6', name: 'Mango Tree', price: '450', image: '/placeholder.svg', description: 'Sweet variety, disease resistant', inStock: true },
    { id: '7', name: 'Orange Tree', price: '400', image: '/placeholder.svg', description: 'Valencia oranges, juicy and sweet', inStock: true },
    { id: '8', name: 'Lemon Tree', price: '380', image: '/placeholder.svg', description: 'Year-round fruit production', inStock: false },
  ];

  const ornamentalTrees = [
    { id: '9', name: 'Jacaranda', price: '600', image: '/placeholder.svg', description: 'Beautiful purple flowering tree', inStock: true },
    { id: '10', name: 'Flame Tree', price: '550', image: '/placeholder.svg', description: 'Stunning red-orange blooms', inStock: true },
    { id: '11', name: 'Bougainvillea', price: '200', image: '/placeholder.svg', description: 'Colorful climbing shrub', inStock: true },
    { id: '12', name: 'Frangipani', price: '450', image: '/placeholder.svg', description: 'Fragrant tropical flowers', inStock: false },
  ];

  const handleWhatsAppContact = () => {
    const message = `Hello LittleForest!\n\nI'm reaching out to learn more about your nursery services. I'm interested in:\n- Indigenous trees\n- Fruit trees\n- Ornamental plants\n- Expert advice on planting and care\n\nCould we schedule a time to discuss my specific needs?\n\nThank you!`;
    const whatsappUrl = `https://wa.me/254108029407?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleProductOrder = (product: any) => {
    const message = `Hello LittleForest!\n\nI would like to order:\n- ${product.name} (KSh ${product.price})\n\nPlease confirm availability and delivery details.\n\nThank you!`;
    const whatsappUrl = `https://wa.me/254108029407?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Animation hook
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const ProductCard = ({ product }: { product: any }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 animate-on-scroll opacity-0">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <Badge 
          variant={product.inStock ? "default" : "secondary"}
          className={`absolute top-2 right-2 ${product.inStock ? 'bg-green-500' : 'bg-red-500'} text-white`}
        >
          {product.inStock ? 'In Stock' : 'Sold Out'}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-green-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-green-600">KSh {product.price}</span>
          <Button 
            onClick={() => handleProductOrder(product)}
            disabled={!product.inStock}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            Order on WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <TreePine className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-green-800">LittleForest</h1>
                <p className="text-xs text-gray-600">Nurturing Nature</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-green-600 font-medium">Shop With Us</Link>
              <Link to="/about" className="text-gray-700 hover:text-green-600 font-medium">About</Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-700 hover:text-green-600"
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsCartOpen(true)}
                className="relative"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t pt-4 pb-4">
              <nav className="flex flex-col space-y-2">
                <Link to="/" className="text-gray-700 hover:text-green-600 py-2 font-medium">Shop With Us</Link>
                <Link to="/about" className="text-gray-700 hover:text-green-600 py-2 font-medium">About</Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-24 bg-green-100 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img
              src="/images/hero-bg.jpg"
              alt="Nursery background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <h2 className="text-4xl font-bold text-green-900 sm:text-5xl lg:text-6xl mb-4">
              Welcome to LittleForest
            </h2>
            <p className="text-xl text-green-700 mb-8">
              Premium Tree Seedlings for Your Green Future
            </p>
            <Button 
              onClick={handleWhatsAppContact}
              className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3"
            >
              Get In Touch
            </Button>
          </div>
        </section>

        {/* Indigenous Trees Section */}
        <section className="py-16 bg-amber-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-on-scroll opacity-0">
              <h2 className="text-3xl font-bold text-green-900 mb-4">Indigenous Trees</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Native species perfectly adapted to our climate, supporting local ecosystems and biodiversity.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {indigenousTrees.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Fruit Trees Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-on-scroll opacity-0">
              <h2 className="text-3xl font-bold text-green-900 mb-4">Fruit Trees</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                High-quality fruit trees for fresh harvests and sustainable food production.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {fruitTrees.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Ornamental Trees Section */}
        <section className="py-16 bg-amber-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-on-scroll opacity-0">
              <h2 className="text-3xl font-bold text-green-900 mb-4">Ornamental Trees</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Beautiful flowering and decorative trees to enhance your landscape.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ornamentalTrees.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <TreePine className="h-8 w-8 text-white" />
              <h3 className="text-2xl font-bold text-white">LittleForest</h3>
            </div>
            <p className="text-green-100">Nurturing Nature, Growing Futures</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
            <a 
              href="https://wa.me/254108029407" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-green-100 hover:text-white transition-colors"
            >
              <Phone className="h-5 w-5 mr-2" />
              +254 108 029 407
            </a>
            <a 
              href="https://instagram.com/littleforest" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-green-100 hover:text-white transition-colors"
            >
              <Instagram className="h-5 w-5 mr-2" />
              @littleforest
            </a>
            <a 
              href="mailto:info@littleforest.co.ke"
              className="flex items-center text-green-100 hover:text-white transition-colors"
            >
              <Mail className="h-5 w-5 mr-2" />
              info@littleforest.co.ke
            </a>
          </div>
          
          <div className="text-center text-green-100 text-sm">
            <p>&copy; {new Date().getFullYear()} LittleForest. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Index;
