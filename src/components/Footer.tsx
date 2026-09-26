import { Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import Logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-silver/30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img 
                src={Logo} 
                alt="Smart Photography Logo" 
                className="h-20 w-auto"
              />
            </div>
            <p className="font-poppins text-sm text-text-secondary mb-6">
              Capturing moments, creating memories with passion and creativity.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Youtube].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="p-3 bg-dark-surface hover:bg-gold transition-all duration-300"
                >
                  <Icon className="w-5 h-5 text-gold hover:text-black transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-playfair text-lg font-semibold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                'Home',
                'Portfolio',
                'Services',
                'Packages',
                'About',
                'Contact',
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={`#${link.toLowerCase().replace(' ', '')}`}
                    className="font-poppins text-sm text-text-secondary hover:text-gold transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-playfair text-lg font-semibold text-white mb-6">
              Services
            </h3>
            <ul className="space-y-3">
              {[
                'Wedding Photography',
                'Pre Wedding',
                'Videography',
                'Drone Coverage',
                'Album Design',
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href="#services"
                    className="font-poppins text-sm text-text-secondary hover:text-gold transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-playfair text-lg font-semibold text-white mb-6">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold" />
                <span className="font-poppins text-sm text-text-secondary">
                  +91 98765 43210
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold" />
                <span className="font-poppins text-sm text-text-secondary">
                  info@smartphotography.com
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-1" />
                <span className="font-poppins text-sm text-text-secondary">
                  123 Premium Street, Mumbai, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-silver/30 pt-8 text-center">
          <p className="font-poppins text-sm text-text-secondary">
            © {new Date().getFullYear()} Smart Photography. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
