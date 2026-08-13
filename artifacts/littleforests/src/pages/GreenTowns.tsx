import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Droplets, GraduationCap, Heart } from "lucide-react";
import AuthButton from '@/components/AuthButton';
import NavigationDropdown from '@/components/NavigationDropdown';
import Footer from '@/components/Footer';
import DonateButton from '@/components/DonateButton';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import img1 from '@assets/IMG-20251007-WA0001_1759838217345.jpg';
import img2 from '@assets/IMG-20251007-WA0006_1759838217350.jpg';
import img3 from '@assets/WhatsApp Image 2025-09-19 at 15.27.03_c4519e73_1759838217351.jpg';
import img4 from '@assets/WhatsApp Image 2025-09-19 at 15.27.50_6eec7683_1759838217352.jpg';
import img5 from '@assets/WhatsApp Image 2025-09-22 at 22.31.52_2616492e_1759838217353.jpg';
import SEO from '@/components/SEO';
import BrandMark from '@/components/BrandMark';

const GreenTowns = () => {
  const [activeTab, setActiveTab] = useState<'water' | 'schools'>('water');
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [api]);

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

  // Gallery component for displaying media - only shows when items exist
  const MediaGallery = ({ items, type }: { items: any[], type: 'water' | 'school' }) => {
    // Don't render anything if no items
    if (!items || items.length === 0) {
      return null;
    }

    return (
      <div className="grid gap-4 mt-4">
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
      <SEO
        title="Green Towns Initiative — LittleForest Nursery Kenya"
        description="Discover LittleForest's Green Towns programme: planting indigenous trees in schools and communities across Kenya to restore water sources and build Green Champions."
        path="/green-towns"
      />
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <BrandMark />
            </div>
            <div className="flex items-center space-x-3">
              <AuthButton />
              <DonateButton variant="solid" alwaysShowLabel />
              <Button onClick={() => window.location.href = '/'} variant="outline" className="border-green-600 text-green-600 hover:bg-green-50" data-testid="button-shopnow">
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu - Fixed/Floating */}
      <div className="fixed top-20 left-4 z-40">
        <div className="scale-110">
          <NavigationDropdown />
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-6 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">{content?.['green_towns_initiative']?.title || 'Green Towns Initiative'}</h1>
          <p className="text-base md:text-xl max-w-3xl mx-auto leading-relaxed mb-6">
            {content?.['green_towns_initiative']?.content || 'Growing Little Forests in schools, communities, and urban spaces to restore our environment.'}
          </p>
          <Button
            onClick={() => window.location.href = '/donate'}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 hover:scale-105 transition-transform duration-200"
            data-testid="button-donate-hero"
          >
            <Heart className="h-4 w-4 mr-2" fill="currentColor" />
            Support This Initiative
          </Button>
        </div>
      </section>

      {/* Main Content - Tabbed Interface */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Impact Showcase Carousel */}
          <div className="mb-16">
            <Carousel 
              setApi={setApi}
              className="w-full max-w-5xl mx-auto"
              opts={{
                align: "center",
                loop: false,
              }}
            >
              <CarouselContent>
                <CarouselItem>
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src={img1} 
                      alt="Students and community at Green Towns Initiative event" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src={img2} 
                      alt="Tree planting activities with students" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src={img3} 
                      alt="Community member planting a tree" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src={img4} 
                      alt="Community members with tree seedlings" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src={img5} 
                      alt="Protected water source spring" 
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
                  
                  // Filter gallery items for this specific spring
                  const springMedia = waterSourceGallery.filter(
                    (item: any) => item.spring_name?.toLowerCase() === springName.toLowerCase()
                  );

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
                            <MediaGallery items={springMedia} type="water" />
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
                  
                  // Filter gallery items for this specific school
                  const schoolMedia = greenChampionsGallery.filter(
                    (item: any) => item.school_name?.toLowerCase() === schoolName.toLowerCase()
                  );

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
                            <MediaGallery items={schoolMedia} type="school" />
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
            Every donation funds real planting work — restoring degraded forest and establishing new ones in schools, communities, and urban spaces. If your school or institution wants to partner with us directly, reach out below.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <DonateButton variant="solid" size="lg" className="px-8 py-3" alwaysShowLabel label="Donate to This Initiative" />
            <Button 
              onClick={() => {
                const message = `Hi

I'd like to learn more about the Green Towns Initiative and how we can partner.

Thank you!`;

                const whatsappUrl = `https://wa.me/2540143538080?text=${encodeURIComponent(message)}`;
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

      <Footer />
    </div>
  );
};

export default GreenTowns;