import ContactForm from '@/components/ContactForm';
import NavigationDropdown from '@/components/NavigationDropdown';
import Footer from '@/components/Footer';
import AuthButton from '@/components/AuthButton';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, Mail } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <div>
                <h1 className="text-2xl font-bold">
                  <span className="text-orange-500">Little</span>
                  <span className="text-green-600">Forest</span>
                </h1>
                <p className="text-sm text-gray-600">Nurturing Nature</p>
              </div>
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

      {/* Content */}
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
                    <a href="tel:+2540143538080" className="text-green-600 hover:text-green-700 transition-colors">
                      +254 143 538 080
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
                      href="https://wa.me/2540143538080?text=Hello%20LittleForest!%20I'm%20interested%20in%20your%20seedlings."
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
                    <p className="text-gray-600">Bomet County, Kenya</p>
                  </div>
                </div>
              </div>

              {/* Business hours or extra info */}
              <div className="mt-10 bg-green-50 border border-green-200 rounded-lg p-5">
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

      <Footer />
    </div>
  );
};

export default Contact;
