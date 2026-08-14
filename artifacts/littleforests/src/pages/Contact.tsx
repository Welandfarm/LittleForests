import ContactForm from '@/components/ContactForm';
import NavigationDropdown from '@/components/NavigationDropdown';
import Footer from '@/components/Footer';
import AuthButton from '@/components/AuthButton';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, ExternalLink, Instagram, Facebook } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import SEO from '@/components/SEO';
import BrandMark from '@/components/BrandMark';

const DEFAULTS = {
  whatsapp_number: '2540143538080',
  whatsapp_display: '+254 143 538 080',
  location: 'Bomet County, Kenya',
  maps_url: 'https://maps.app.goo.gl/NQzgNAjcRYWzFNjy7',
};

const INSTAGRAM_URL = 'https://www.instagram.com/little_forestnursery?igsh=NzloYjNveHVybTZo&utm_source=qr';
const FACEBOOK_URL = '';

const Contact = () => {
  const { data: settingsContent = [] } = useQuery({
    queryKey: ['settings'],
    queryFn: () => apiClient.getContent('settings'),
    staleTime: 5 * 60 * 1000,
  });

  const settings: Record<string, string> = { ...DEFAULTS };
  if (Array.isArray(settingsContent)) {
    (settingsContent as any[]).forEach((item: any) => {
      if (item.title && item.content) settings[item.title] = item.content;
    });
  }

  const waNumber  = settings.whatsapp_number;
  const waDisplay = settings.whatsapp_display;
  const location  = settings.location;
  const mapsUrl   = settings.maps_url;

  // Build an embeddable iframe src from any Google Maps URL / short link
  // Falls back to a text search embed if it's a short link
  const iframeSrc = mapsUrl.includes('maps.app.goo.gl')
    ? `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`
    : mapsUrl.replace('/place/', '/embed/v1/place?key=&q=').replace('https://www.google.com/maps/', 'https://www.google.com/maps/embed/v1/place?q=') || mapsUrl;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <SEO
        title="Contact Us — LittleForest Nursery | Bomet County, Kenya"
        description="Get in touch with LittleForest Nursery in Bomet County, Kenya. Order trees, fruit trees, and honey via WhatsApp, or visit us directly."
        path="/contact"
      />
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <BrandMark />
            </Link>
            <div className="flex items-center space-x-3">
              <AuthButton />
              <Link
                to="/"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="fixed top-20 left-4 z-40">
        <div className="scale-110">
          <NavigationDropdown />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-green-200 max-w-2xl mx-auto text-lg">
            Have a question about our seedlings or want to place a bulk order? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact details + form */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">

            {/* Contact Details */}
            <div>
              <h3 className="text-2xl font-bold text-green-800 mb-6">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Phone className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Phone / WhatsApp</p>
                    <a href={`tel:+${waNumber}`} className="text-green-600 hover:text-green-700 transition-colors">
                      {waDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <MessageCircle className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">WhatsApp Chat</p>
                    <a
                      href={`https://wa.me/${waNumber}?text=Hello%20LittleForest!%20I'm%20interested%20in%20your%20seedlings.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 underline transition-colors"
                    >
                      Chat with us on WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <MapPin className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Location</p>
                    <p className="text-gray-600">{location}</p>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1 text-sm text-green-600 hover:text-green-700 underline transition-colors"
                    >
                      Open in Google Maps <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="mt-8 rounded-2xl border border-green-200 bg-white p-4 shadow-sm sm:p-5">
                <h4 className="font-semibold text-green-800">Follow us</h4>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LittleForest Nursery on Instagram"
                    title="Instagram"
                    className="flex min-h-16 items-center gap-2 rounded-xl bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#515BD4] px-3 py-2.5 text-left text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                  >
                    <Instagram className="h-5 w-5 shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">Instagram</span>
                      <span className="block text-[11px] text-white/85">Visit profile</span>
                    </span>
                  </a>
                  {FACEBOOK_URL ? (
                    <a
                      href={FACEBOOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LittleForest Nursery on Facebook"
                      title="Facebook"
                      className="flex min-h-16 items-center gap-2 rounded-xl bg-[#1877F2] px-3 py-2.5 text-left text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                    >
                      <Facebook className="h-5 w-5 shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">Facebook</span>
                        <span className="block text-[11px] text-white/85">Visit page</span>
                      </span>
                    </a>
                  ) : (
                    <span
                      role="img"
                      aria-disabled="true"
                      aria-label="Facebook link coming soon"
                      title="Facebook link coming soon"
                      className="flex min-h-16 items-center gap-2 rounded-xl bg-[#1877F2] px-3 py-2.5 text-left text-white shadow-sm"
                    >
                      <Facebook className="h-5 w-5 shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">Facebook</span>
                        <span className="block text-[11px] text-white/85">Link coming soon</span>
                      </span>
                    </span>
                  )}
                </div>
                <p className="mt-3 text-xs text-gray-500">Instagram is live now. Facebook link will be added when the page URL is available.</p>
              </div>

              {/* Ordering tip */}
              <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-5">
                <h4 className="font-semibold text-green-800 mb-2">Ordering by WhatsApp</h4>
                <p className="text-sm text-gray-600">
                  The fastest way to order is through our shop — add items to your cart and click "Order Now" to send us your full order via WhatsApp directly.
                </p>
                <Link
                  to="/"
                  className="inline-block mt-3 text-sm text-green-700 font-medium underline hover:text-green-800"
                >
                  Browse the shop →
                </Link>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="text-2xl font-bold text-green-800 mb-6">Send a Message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden border border-green-200 shadow-md">
            <div className="bg-green-800 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-semibold">
                <MapPin className="h-4 w-4 text-green-300" />
                Find Us
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-green-300 hover:text-white transition-colors"
              >
                Open in Google Maps <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <iframe
              title="LittleForest Nursery location"
              src={`https://maps.google.com/maps?q=${encodeURIComponent('LittleForest Nursery ' + location)}&output=embed`}
              width="100%"
              height="380"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
