
import React from 'react';
import NavigationDropdown from '@/components/NavigationDropdown';
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from '@/contexts/CartContext';
import { Badge } from "@/components/ui/badge";
import CartSidebar from '@/components/CartSidebar';
import { useState } from 'react';

const About = () => {
  const { getCartTotal } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  const handleOrder = () => {
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <NavigationDropdown />
              <img 
                src="/lovable-uploads/bd17ddd8-8af4-40c1-8b3b-4234a074ae9b.png" 
                alt="LittleForest Logo" 
                className="h-12 w-auto"
              />
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

      {/* About Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-green-800 mb-8">About Little Forest</h1>
            <div className="prose prose-lg mx-auto text-gray-700">
              <p className="text-lg leading-relaxed">
                At LittleForest Nursery, we grow and supply high-quality seedlings to help farmers thrive. 
                From grafted avocados to tree tomatoes, passion fruit, ornamental plants, and indigenous trees, 
                every seedling is nurtured with expert care and soil health in mind.
              </p>
              <p className="text-lg leading-relaxed mt-6">
                Whether you're planting a few trees or starting a full orchard, we're here to guide you—offering 
                not just seedlings, but agronomic advice and dependable service trusted by farmers across the region.
              </p>
              <p className="text-lg leading-relaxed mt-6">
                Our mission is to help create sustainable green spaces that benefit both people and the environment. 
                With over 15 little forests created through our work, we're proud to be part of Kenya's reforestation 
                and agricultural development efforts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/lovable-uploads/bd17ddd8-8af4-40c1-8b3b-4234a074ae9b.png" 
                  alt="LittleForest Logo" 
                  className="h-8 w-auto"
                />
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

export default About;
