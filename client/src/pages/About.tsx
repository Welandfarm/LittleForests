
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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



      {/* About Section with Tabs */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
              About <span className="text-orange-500">Little</span><span className="text-green-600">Forest</span> Nursery
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
              Little Forest Nursery is a nature-inspired social-enterprise rooted in Bomet County, Kenya. We are passionate about restoring landscapes, conserving water sources, and greening spaces—one seedling at a time.
            </p>
          </div>

          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About Us</TabsTrigger>
              <TabsTrigger value="products">What We Offer</TabsTrigger>
              <TabsTrigger value="impact">Our Impact</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="mt-8">
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  We help you grow your own little forest at home with a variety of indigenous and ornamental trees, so you can contribute to a greener, healthier environment from your own compound.
                </p>
                
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Our work is grounded in the belief that growing trees is not just about greening the land—it's about healing ecosystems, empowering communities, and securing a sustainable future.
                </p>
                
                <div className="bg-green-50 p-8 rounded-2xl">
                  <p className="text-2xl font-semibold text-green-700 mb-4">
                    <span className="text-orange-500">Little</span><span className="text-green-600">Forest</span> Nursery — Restoring Water Resources, One Tree at a Time.
                  </p>
                  <p className="text-lg text-gray-600">
                    Whether you're a farmer, a conservationist, a hotel, or a homeowner, we're here to help you grow with purpose.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="products" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center p-6 bg-green-50 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="text-5xl mb-4">🌳</div>
                  <h4 className="text-xl font-semibold text-green-700 mb-3">Indigenous Trees</h4>
                  <p className="text-gray-600">Seedlings for reforestation and water source restoration</p>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="text-5xl mb-4">🍊</div>
                  <h4 className="text-xl font-semibold text-orange-600 mb-3">Fruit Trees</h4>
                  <p className="text-gray-600">Supporting food security and sustainable livelihoods</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="text-5xl mb-4">🌼</div>
                  <h4 className="text-xl font-semibold text-purple-600 mb-3">Ornamental Plants</h4>
                  <p className="text-gray-600">For greening homes, institutions and beautification</p>
                </div>
                <div className="text-center p-6 bg-yellow-50 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="text-5xl mb-4">🍯</div>
                  <h4 className="text-xl font-semibold text-yellow-600 mb-3">Organic Honey</h4>
                  <p className="text-gray-600">Harvested from indigenous little forests</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="impact" className="mt-8 space-y-12">
              {/* Water Source Restoration Section */}
              <div>
                <div className="text-center group mb-8">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <Leaf className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Restoring Springs and Streams</h3>
                  <div className="max-w-4xl mx-auto text-left">
                    <p className="text-gray-600 mb-4">
                      Springs act as a major source of water for many communities, yet these vital ecosystems face challenges arising from massive deforestation, farming, and contamination from direct contact with humans and animals.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Our focus is to bring back these water sources to life and secure high water quality for both the present and the next generation. We do this by:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                      <li>Growing indigenous trees to replenish lost vegetation</li>
                      <li>Constructing water points to avoid contamination</li>
                    </ul>
                  </div>
                </div>

                {/* Springs Accordion */}
                <div className="max-w-4xl mx-auto">
                  <Accordion type="single" collapsible className="space-y-4">
                    {/* Mumetet Spring - Complete Story */}
                    <AccordionItem value="mumetet" className="border border-green-200 rounded-lg">
                      <AccordionTrigger className="px-6 py-4 hover:bg-green-50">
                        <span className="text-lg font-semibold text-green-800">Mumetet Spring</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Story</h4>
                            <p className="text-gray-600">
                              Mumetet Spring had lost much of its surrounding vegetation due to deforestation and nearby farming. As a result, water flow reduced, and contamination from both animals and people was common. Together with the community, we planted indigenous trees to restore the catchment and constructed a protected water point to reduce direct contact with the spring.
                            </p>
                            <p className="text-gray-600">
                              Today, the spring flows more reliably, provides cleaner and safer water for over 70 households, and has new life around it through restored biodiversity.
                            </p>
                            <blockquote className="border-l-4 border-green-500 pl-4 italic text-gray-700">
                              "Now we have clean water close to our homes. Our children no longer suffer from waterborne diseases as before," shared one resident with joy.
                            </blockquote>
                          </div>
                          <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <div className="text-4xl mb-2">📷</div>
                              <p>Placeholder for 2–3 photos or a short video clip</p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Other Springs - Coming Soon */}
                    {['Masese', 'Choronok', 'Chebululu', 'Korabi', 'Tabet', 'Milimani', 'Bondet', 'Anabomoi', 'Chemeres', 'Kibochi'].map((springName) => (
                      <AccordionItem key={springName} value={springName.toLowerCase()} className="border border-green-200 rounded-lg">
                        <AccordionTrigger className="px-6 py-4 hover:bg-green-50">
                          <span className="text-lg font-semibold text-green-800">{springName} Spring</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-900">Story</h4>
                              <p className="text-gray-600">
                                Coming soon: We are preparing the story of {springName} Spring, highlighting the challenges faced, the actions taken, and the impact created with the community.
                              </p>
                            </div>
                            <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center">
                              <div className="text-center text-gray-500">
                                <div className="text-4xl mb-2">📷</div>
                                <p>Placeholder for photos or videos</p>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>

              {/* Food Security & Livelihoods Section */}
              <div>
                <div className="text-center group mb-8">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Promoting Food Security and Livelihoods</h3>
                  <div className="max-w-4xl mx-auto">
                    <p className="text-gray-600 mb-6">
                      We are working with communities to improve nutrition and income through sustainable practices. This includes introducing fruit trees, supporting small-scale farming, and exploring beekeeping and honey production.
                    </p>
                  </div>
                </div>
                
                {/* Empty accordion container for future projects */}
                <div className="max-w-4xl mx-auto">
                  <Accordion type="single" collapsible className="space-y-4">
                    {/* Future project stories will be added here */}
                  </Accordion>
                </div>
              </div>

              {/* Beautification & Greening Section */}
              <div>
                <div className="text-center group mb-8">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Beautification and Greening Communities</h3>
                  <div className="max-w-4xl mx-auto">
                    <p className="text-gray-600 mb-6">
                      We believe in the power of nature to make spaces healthier, more beautiful, and more livable. Our future work will include planting ornamental trees, greening schools and markets, and promoting community gardens.
                    </p>
                  </div>
                </div>
                
                {/* Empty accordion container for future projects */}
                <div className="max-w-4xl mx-auto">
                  <Accordion type="single" collapsible className="space-y-4">
                    {/* Future project stories will be added here */}
                  </Accordion>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
                const message = `Hi
I'd like to make inquiries about the seedlings and honey.
Thank you!`;
                
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
          <div className="grid md:grid-cols-3 gap-8">
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
                <li><a href="/" className="hover:text-white">Shop with us</a></li>
                <li><a href="/about" className="hover:text-white">About Us</a></li>
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
    </div>
  );
};

export default About;
