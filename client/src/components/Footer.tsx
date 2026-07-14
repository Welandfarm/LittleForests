import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
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
              <li><Link to="/" className="hover:text-white transition-colors">Shop with us</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/green-towns" className="hover:text-white transition-colors">Green Towns Initiative</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-sm text-green-200">
              <p>
                📱 WhatsApp:{' '}
                <a
                  href="https://wa.me/2540143538080?text=Hello%20LittleForest!%20I'm%20interested%20in%20your%20seedlings%20and%20would%20like%20to%20learn%20more."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 hover:text-white underline ml-1"
                >
                  +254 143 538 080
                </a>
              </p>
              <p>📍 Bomet County, Kenya</p>
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 text-center">
          <p className="text-green-200 text-sm">
            © {currentYear} Little Forest. All rights reserved. | Restoring Water Resources, One Tree at a Time.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
