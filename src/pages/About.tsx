
import React from 'react';
import { Button } from "@/components/ui/button";
import { TreePine, ArrowLeft, Instagram, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <TreePine className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-green-800">LittleForest</h1>
                <p className="text-xs text-gray-600">Nurturing Nature</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-green-600 font-medium">Shop With Us</Link>
              <Link to="/about" className="text-green-600 font-medium">About</Link>
            </nav>
            
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shop
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-16 bg-amber-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-green-900 mb-8">About LittleForest</h1>
            <div className="prose prose-lg mx-auto text-gray-700">
              <p className="text-xl leading-relaxed mb-8">
                [Your content will go here. You can edit this section to tell your story, 
                mission, values, and what makes LittleForest special.]
              </p>
              
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold text-green-800 mb-4">Content Area</h2>
                <p className="text-gray-600">
                  This is where you can add your detailed about content, including:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2 text-left">
                  <li>Your nursery's history and background</li>
                  <li>Mission and vision statements</li>
                  <li>Services offered</li>
                  <li>Team information</li>
                  <li>Sustainability practices</li>
                  <li>Contact information and location</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <TreePine className="h-8 w-8 text-white" />
              <h3 className="text-2xl font-bold text-white">LittleForest</h3>
            </div>
            <p className="text-green-100">Nurturing Nature, Growing Futures</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
            <a 
              href="https://wa.me/254108029407" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-green-100 hover:text-white transition-colors"
            >
              <Phone className="h-5 w-5 mr-2" />
              +254 108 029 407
            </a>
            <a 
              href="https://instagram.com/littleforest" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-green-100 hover:text-white transition-colors"
            >
              <Instagram className="h-5 w-5 mr-2" />
              @littleforest
            </a>
            <a 
              href="mailto:info@littleforest.co.ke"
              className="flex items-center text-green-100 hover:text-white transition-colors"
            >
              <Mail className="h-5 w-5 mr-2" />
              info@littleforest.co.ke
            </a>
          </div>
          
          <div className="text-center text-green-100 text-sm">
            <p>&copy; {new Date().getFullYear()} LittleForest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
