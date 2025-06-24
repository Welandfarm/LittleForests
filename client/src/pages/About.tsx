
import { Button } from "@/components/ui/button";
import { Leaf, Users, Award, Heart } from "lucide-react";
import AuthButton from '@/components/AuthButton';
import NavigationDropdown from '@/components/NavigationDropdown';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

const About = () => {
  // Fetch content from database
  const { data: content = {} } = useQuery({
    queryKey: ['about-content'],
    queryFn: async () => {
      const data = await apiClient.getContent();
      
      // Convert to object for easy access
      const contentObj: { [key: string]: { title: string; content: string } } = {};
      data?.forEach((item: any) => {
        const key = item.title?.toLowerCase().replace(/\s+/g, '_') || '';
        contentObj[key] = { title: item.title || '', content: item.content || '' };
      });
      return contentObj;
    },
  });

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
              <AuthButton />
              <Button onClick={() => window.location.href = '/'} className="bg-orange-500 hover:bg-orange-600 text-white">
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-start">
          <div className="scale-125">
            <NavigationDropdown />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 relative bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            About <span className="text-orange-500">Little</span><span className="text-green-400">Forest</span>
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Nature-inspired social enterprise restoring landscapes and empowering communities in Bomet County, Kenya
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-green-800 mb-6">About Little Forest Nursery</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Little Forest Nursery is a nature-inspired social-enterprise rooted in Bomet County, Kenya. We are passionate about restoring landscapes, conserving water sources, and greening spaces—one seedling at a time.
              </p>
              
              <h3 className="text-xl font-semibold text-green-700 mb-4">We specialize in the propagation and sale of:</h3>
              <ul className="text-gray-600 text-lg leading-relaxed mb-6 space-y-2">
                <li>🌳 Indigenous tree seedlings for reforestation and water source restoration.</li>
                <li>🍊 Fruit tree seedlings to support food security and livelihoods</li>
                <li>🌼 Ornamental plants and flowers for greening homes, institutions and beautification</li>
                <li>🍯 Organic forest honey, harvested from indigenous little forests.</li>
              </ul>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                We help you grow your own little forest at home with a variety of indigenous and ornamental trees, so you can contribute to a greener, healthier environment from your own compound.
              </p>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Our work is grounded in the belief that growing trees is not just about greening the land—it's about healing ecosystems, empowering communities, and securing a sustainable future.
              </p>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Whether you're a farmer, a conservationist, a hotel, or a homeowner, we're here to help you grow with purpose.
              </p>
              
              <p className="text-green-700 text-xl font-semibold mb-6">
                Little Forest Nursery — Restoring Water Resources, One Tree at a Time.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">🌳</div>
                  <div className="text-sm text-gray-600">Indigenous Trees</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">🍯</div>
                  <div className="text-sm text-gray-600">Organic Honey</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Water Source Restoration</h3>
                  <p className="text-gray-600">Indigenous tree seedlings specifically chosen for reforestation and water source conservation.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Food Security & Livelihoods</h3>
                  <p className="text-gray-600">Fruit tree seedlings and organic honey supporting sustainable livelihoods and food security.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Beautification & Greening</h3>
                  <p className="text-gray-600">Ornamental plants and flowers for greening homes, institutions, and community beautification projects.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-4">Ready to Grow Your Forest?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join us in creating a greener future. Whether you're looking for indigenous trees, fruit trees, or ornamental plants, we have the perfect seedlings for your project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => window.location.href = '/'} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
              Shop Now
            </Button>
            <Button 
              onClick={() => {
                const message = `Hello LittleForest! 🌱

I'd like to learn more about your nursery and how you can help with my project. Could we discuss:

- Available tree varieties
- Best planting practices for my area
- Bulk ordering options
- Expert consultation services

Looking forward to growing with you!`;
                
                const whatsappUrl = `https://wa.me/254108029407?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
              variant="outline" 
              className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3"
            >
              Contact Us
            </Button>
          </div>
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
    </div>
  );
};

export default About;
