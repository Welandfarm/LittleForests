import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, TreePine } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from '@/components/CartDrawer';
import AuthButton from '@/components/AuthButton';
import AdminAccessButton from '@/components/AdminAccessButton';

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <TreePine className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-green-800">LittleForest</h1>
                <p className="text-xs text-gray-600">Nurturing Nature</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-700 hover:text-green-600">About Us</a>
              <a href="#products" className="text-gray-700 hover:text-green-600">Products</a>
              <a href="#stories" className="text-gray-700 hover:text-green-600">Stories</a>
              <a href="#contact" className="text-gray-700 hover:text-green-600">Contact</a>
              <a href="/blog" className="text-gray-700 hover:text-green-600">Blog</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <AdminAccessButton />
              <AuthButton />
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
                <a href="#about" className="text-gray-700 hover:text-green-600 py-2">About Us</a>
                <a href="#products" className="text-gray-700 hover:text-green-600 py-2">Products</a>
                <a href="#stories" className="text-gray-700 hover:text-green-600 py-2">Stories</a>
                <a href="#contact" className="text-gray-700 hover:text-green-600 py-2">Contact</a>
                <a href="/blog" className="text-gray-700 hover:text-green-600 py-2">Blog</a>
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
              alt="Abstract background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold text-green-900 sm:text-5xl lg:text-6xl">
                Welcome to LittleForest
              </h2>
              <p className="mt-4 text-xl text-green-700">
                Nurturing Nature, Delivering Goodness.
              </p>
              <Button className="mt-8 bg-green-600 hover:bg-green-700 text-white">
                Explore Our Products
              </Button>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-3xl font-bold text-green-900 mb-4">
                  Our Story
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  LittleForest is dedicated to providing high-quality,
                  sustainable products that connect you with nature. We
                  believe in the power of nature to enhance well-being and
                  promote a healthier lifestyle.
                </p>
                <p className="text-lg text-gray-700">
                  From ethically sourced ingredients to eco-friendly packaging,
                  we are committed to making a positive impact on the planet.
                </p>
              </div>
              <div className="mt-5 md:mt-0">
                <img
                  src="/images/about-us.jpg"
                  alt="About Us"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-green-900 text-center mb-8">
              Our Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Product Card 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="/images/product1.jpg"
                  alt="Product 1"
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    Natural Honey
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Pure, raw honey from our own hives.
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Add to Cart
                  </Button>
                </div>
              </div>

              {/* Product Card 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="/images/product2.jpg"
                  alt="Product 2"
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    Organic Tea
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Hand-picked organic tea leaves for a refreshing brew.
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Add to Cart
                  </Button>
                </div>
              </div>

              {/* Product Card 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="/images/product3.jpg"
                  alt="Product 3"
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    Handmade Soap
                  </h3>
                  <p className="text-gray-600 mb-3">
                    All-natural, handmade soap with essential oils.
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stories Section */}
        <section id="stories" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-green-900 text-center mb-8">
              Our Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Story Card 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="/images/story1.jpg"
                  alt="Story 1"
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    The Beekeeper's Tale
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Learn about the journey of our beekeeper and the magic of
                    honey-making.
                  </p>
                  <a
                    href="#"
                    className="text-green-600 hover:text-green-700"
                  >
                    Read More
                  </a>
                </div>
              </div>

              {/* Story Card 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="/images/story2.jpg"
                  alt="Story 2"
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    From Seed to Cup
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Discover the process of growing and harvesting our organic
                    tea leaves.
                  </p>
                  <a
                    href="#"
                    className="text-green-600 hover:text-green-700"
                  >
                    Read More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-green-900 text-center mb-8">
              Contact Us
            </h2>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <p className="text-lg text-gray-700 mb-6">
                  Have questions or feedback? We'd love to hear from you!
                  Fill out the form below to get in touch with our team.
                </p>
                <img
                  src="/images/contact-us.jpg"
                  alt="Contact Us"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
              <div className="mt-5 md:mt-0">
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Submit
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white text-sm mb-2">
            &copy; {new Date().getFullYear()} LittleForest. All rights
            reserved.
          </p>
          <nav className="flex justify-center space-x-6">
            <a href="#" className="text-green-100 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-green-100 hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="text-green-100 hover:text-white">
              Contact Us
            </a>
          </nav>
        </div>
      </footer>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Index;
