import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Droplets, GraduationCap } from "lucide-react";
import AuthButton from '@/components/AuthButton';
import NavigationDropdown from '@/components/NavigationDropdown';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

const GreenTowns = () => {
  const [activeTab, setActiveTab] = useState<'water' | 'schools'>('water');
  
  const { data: content = {} } = useQuery({
    queryKey: ['greentowns-content'],
    queryFn: async () => {
      const data = await apiClient.getContent();
      
      const contentObj: { [key: string]: { title: string; content: string; type: string } } = {};
      if (Array.isArray(data)) {
        data.forEach((item: any) => {
          const key = item.title?.toLowerCase().replace(/\s+/g, '_') || '';
          contentObj[key] = { title: item.title || '', content: item.content || '', type: item.type || 'page' };
        });
      }
      return contentObj;
    },
  });

  const { data: waterSourceGallery = [] } = useQuery<any[]>({
    queryKey: ['/api/gallery/water-source'],
    queryFn: async () => {
      const response = await fetch('/api/gallery/water-source');
      if (!response.ok) throw new Error('Failed to fetch water source gallery');
      return response.json();
    },
  });

  const { data: greenChampionsGallery = [] } = useQuery<any[]>({
    queryKey: ['/api/gallery/green-champions'],
    queryFn: async () => {
      const response = await fetch('/api/gallery/green-champions');
      if (!response.ok) throw new Error('Failed to fetch green champions gallery');
      return response.json();
    },
  });

  const allSprings = ['Mumetet', 'Masese', 'Choronok', 'Chebululu', 'Korabi', 'Tabet', 'Milimani', 'Bondet', 'Anabomoi', 'Chemeres', 'Kibochi'];

  const schools = [
    'Komolwet',
    'Kaplong Girls',
    'Kapchemibei',
    'Kaptumaitaa',
    'Sasita',
    'Kimase',
    'Kapchepkoro',
    'Kamungei',
    'Kesenge',
    'Chebirbelek',
    'Bomet Primary',
    'Kyogong',
    'Kapsimbiri',
    'Chemomul'
  ];

  // Gallery component for displaying media
  const MediaGallery = ({ items, type }: { items: any[], type: 'water' | 'school' }) => {
    if (!items || items.length === 0) {
      return (
        <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📷</div>
            <p>Placeholder for {type === 'water' ? '2–3 photos or a short video clip' : 'photos showing the greening activities and student participation'}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {items.map((item: any, idx: number) => (
          <div key={idx} className="rounded-lg overflow-hidden">
            {item.media_type === 'video' ? (
              <div>
                <video 
                  controls 
                  className="w-full h-auto rounded-lg"
                  data-testid={`video-${type}-${idx}`}
                >
                  <source src={item.media_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {item.caption && (
                  <p className="text-sm text-gray-600 mt-2 italic">{item.caption}</p>
                )}
              </div>
            ) : (
              <div>
                <img 
                  src={item.media_url} 
                  alt={item.caption || `${type} media ${idx + 1}`}
                  className="w-full h-auto rounded-lg object-cover"
                  data-testid={`img-${type}-${idx}`}
                />
                {item.caption && (
                  <p className="text-sm text-gray-600 mt-2 italic">{item.caption}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
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
              <AuthButton />
              <Button onClick={() => window.location.href = '/'} className="bg-orange-500 hover:bg-orange-600 text-white" data-testid="button-shopnow">
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
      <section className="py-8 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-pagetitle">
            Green Towns Initiative
          </h1>
          <p className="text-xl md:text-2xl text-green-100 max-w-4xl mx-auto" data-testid="text-pagesubtitle">
            Showcasing the Impact of Our Work in Communities
          </p>
        </div>
      </section>

      {/* Main Content - Tabbed Interface */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Impact Showcase Carousel */}
          <div className="mb-16">
            <Carousel 
              className="w-full max-w-4xl mx-auto"
              opts={{
                align: "center",
                loop: true,
              }}
              plugins={[
                {
                  name: 'autoplay',
                  options: { delay: 4000 },
                  init: (embla: any) => {
                    let timer: NodeJS.Timeout;
                    
                    const play = () => {
                      timer = setTimeout(() => {
                        embla.scrollNext();
                        play();
                      }, 4000);
                    };
                    
                    embla.on('init', play);
                    embla.on('destroy', () => clearTimeout(timer));
                  }
                }
              ]}
            >
              <CarouselContent>
                <CarouselItem>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src="/lovable-uploads/82ebeeb5-b8dd-4161-9668-d9077f5da34d.png" 
                      alt="Green Champions - Students and community members" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src="/lovable-uploads/bd17ddd8-8af4-40c1-8b3b-4234a074ae9b.png" 
                      alt="Tree planting at school compound" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=500&fit=crop" 
                      alt="Student planting seedling" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=500&fit=crop" 
                      alt="Unprotected water source" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop" 
                      alt="Protected water point with tap" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop" 
                      alt="Community member planting tree" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=500&fit=crop" 
                      alt="Community members with seedlings" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
          
          {/* Tabs Navigation */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('water')}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'water'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5" />
                  <span>Water Source Protection</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('schools')}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'schools'
                    ? 'bg-white text-green-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Green Champions</span>
                </div>
              </button>
            </div>
          </div>

          {/* Water Source Protection Tab */}
          {activeTab === 'water' && (
            <div>
              <div className="text-center group mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-watersection">
                  Water Source Protection and Restoration
                </h2>
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

              {/* Springs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                {allSprings.map((springName) => {
                  const storyKey = `${springName.toLowerCase()}_spring_story`;
                  const story = content[storyKey];
                  const hasStory = story && story.content && story.content.trim().length > 0;
                  
                  return (
                    <Accordion key={springName} type="single" collapsible>
                      <AccordionItem value={springName.toLowerCase()} className="border-none">
                        <AccordionTrigger 
                          className="border border-blue-200 rounded-lg px-4 py-3 hover:bg-blue-50 hover:border-blue-300 transition-all data-[state=open]:bg-blue-50 data-[state=open]:border-blue-300" 
                          data-testid={`button-spring-${springName.toLowerCase()}`}
                        >
                          <span className="text-base font-semibold text-blue-800">{springName} Spring</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-4">
                          <div className="space-y-4">
                            {hasStory ? (
                              <div dangerouslySetInnerHTML={{ __html: story.content.replace(/\n/g, '<br />') }} className="text-sm text-gray-600" />
                            ) : (
                              <p className="text-sm text-gray-600">
                                Coming soon: We are preparing the story of {springName} Spring, highlighting the challenges faced, the actions taken, and the impact created with the community.
                              </p>
                            )}
                            <MediaGallery items={waterSourceGallery} type="water" />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                })}
              </div>
            </div>
          )}

          {/* Green Champions Tab */}
          {activeTab === 'schools' && (
            <div>
              <div className="text-center group mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-greenchampions">
                  Green Champions
                </h2>
                <div className="max-w-4xl mx-auto text-left">
                  <p className="text-gray-600 mb-6">
                    This is a school greening initiative where kids in primary schools are nurtured to become champions of the environment. We do this by growing trees and fruits in schools to promote green spaces in schools and improve learning among students.
                  </p>
                </div>
              </div>

              {/* Schools Grid */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                {schools.map((schoolName, index) => {
                  const schoolKey = `${schoolName.toLowerCase().replace(/\s+/g, '_')}_story`;
                  const schoolStory = content[schoolKey];
                  const hasStory = schoolStory && schoolStory.content && schoolStory.content.trim().length > 0;
                  
                  return (
                    <Accordion key={index} type="single" collapsible>
                      <AccordionItem value={schoolName.toLowerCase()} className="border-none">
                        <AccordionTrigger 
                          className="border border-green-200 rounded-lg px-4 py-3 hover:bg-green-50 hover:border-green-300 transition-all data-[state=open]:bg-green-50 data-[state=open]:border-green-300" 
                          data-testid={`button-school-${index}`}
                        >
                          <span className="text-base font-semibold text-green-800">{schoolName}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-4">
                          <div className="space-y-4">
                            {hasStory ? (
                              <div dangerouslySetInnerHTML={{ __html: schoolStory.content.replace(/\n/g, '<br />') }} className="text-sm text-gray-600" />
                            ) : (
                              <p className="text-sm text-gray-600">
                                {schoolName} has a unique story of environmental transformation. We are preparing detailed information about the impact created with students and the community.
                              </p>
                            )}
                            <MediaGallery items={greenChampionsGallery} type="school" />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-4">Join Our Green Movement</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Partner with us to create green spaces in your community, school, or institution. Together, we can nurture environmental champions and restore our ecosystems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => window.location.href = '/'} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3" data-testid="button-shopnow-cta">
              Shop Now
            </Button>
            <Button 
              onClick={() => {
                const message = `Hi

I'd like to learn more about the Green Towns Initiative and how we can partner.

Thank you!`;
                
                const whatsappUrl = `https://wa.me/254108029407?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
              variant="outline" 
              className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3"
              data-testid="button-contact"
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
                <li><a href="/green-towns" className="hover:text-white">Green Towns Initiative</a></li>
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

export default GreenTowns;
