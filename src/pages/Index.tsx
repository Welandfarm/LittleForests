
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, TreePine, Sprout, Users, Award, Heart } from "lucide-react";
import ContactForm from '@/components/ContactForm';
import AuthButton from '@/components/AuthButton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const handleOrder = () => {
    window.open("https://wa.me/254722973557", "_blank");
  };

  // Fetch products from database
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'Available')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
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
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-green-600 transition-colors">Home</a>
              <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">About Us</a>
              <a href="#products" className="text-gray-700 hover:text-green-600 transition-colors">Products</a>
              <a href="#testimonials" className="text-gray-700 hover:text-green-600 transition-colors">Stories</a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">Contact</a>
            </nav>
            <div className="flex items-center space-x-3">
              <AuthButton />
              <Button onClick={handleOrder} className="bg-orange-500 hover:bg-orange-600 text-white">
                Order
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Background Image */}
      <section 
        id="home" 
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
              <span className="text-green-800 font-medium">Reliable Tree Nursery</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Welcome to <span className="text-orange-500">Little</span>
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
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Why Choose Little Forest?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Leaf className="h-12 w-12 text-green-600" />, title: "Premium Quality", desc: "Hand-selected, healthy plants with guaranteed quality assurance." },
              { icon: <Users className="h-12 w-12 text-green-600" />, title: "Expert Support", desc: "Professional guidance from our experienced horticulturists." },
              { icon: <Heart className="h-12 w-12 text-green-600" />, title: "Eco-Friendly", desc: "Sustainable practices that help preserve our environment." }
            ].map((item, index) => (
              <div key={index} className="text-center p-6">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Our Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated selection of indigenous trees, fruit trees, and ornamental plants
            </p>
          </div>

          {productsLoading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={product.image_url || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={product.status === 'Available' ? "default" : "secondary"}>
                        {product.status}
                      </Badge>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="outline" className="bg-white">
                        {product.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-600">{product.price}</span>
                      <Button 
                        size="sm" 
                        disabled={product.status !== 'Available'}
                        onClick={handleOrder}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {product.status === 'Available' ? "Order Now" : "Notify Me"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Customer Stories</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Sarah Kimani", text: "The fruit trees I purchased are thriving! Excellent quality and fast delivery.", rating: 5 },
              { name: "John Mwangi", text: "Professional service and healthy plants. My garden looks amazing now!", rating: 5 },
              { name: "Grace Wanjiku", text: "Best nursery in the region. The indigenous trees are perfect for my project.", rating: 5 }
            ].map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Heart key={i} className="h-5 w-5 text-red-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <div className="font-semibold text-green-800">{testimonial.name}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Updated Contact Section */}
      <section id="contact" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Get In Touch</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Ready to start your green journey? Contact us for personalized plant recommendations and orders.
            </p>
            <div className="mb-8">
              <Button 
                onClick={handleOrder} 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                📱 Call us on WhatsApp: +254 722973557
              </Button>
              <p className="text-gray-500 mt-2">Or fill out the form below as option 2</p>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <ContactForm />
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
                <li><a href="#home" className="hover:text-white">Home</a></li>
                <li><a href="#about" className="hover:text-white">About Us</a></li>
                <li><a href="#products" className="hover:text-white">Products</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
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
                <li>📱 WhatsApp: +254 722973557</li>
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
    </div>
  );
};

export default Index;
