import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-green-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">Islamic Community Hub</h3>
            <p className="text-green-200 text-sm">
              Connecting Muslim communities through technology, Zakat distribution, and Islamic services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-green-200 text-sm">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/masjids" className="hover:text-white transition">Masjids</a></li>
              <li><a href="/jobs" className="hover:text-white transition">Jobs</a></li>
              <li><a href="/matrimony" className="hover:text-white transition">Matrimony</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-green-200 text-sm">
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+91-XXXX-XXXX-XX</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span>info@islamichub.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>India</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gold transition"><Facebook size={24} /></a>
              <a href="#" className="hover:text-gold transition"><Twitter size={24} /></a>
              <a href="#" className="hover:text-gold transition"><Instagram size={24} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-green-800 pt-8 text-center text-green-200 text-sm">
          <p>&copy; {currentYear} Islamic Community Hub. All rights reserved.</p>
          <p className="mt-2">Built with ❤️ for Muslim Communities</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
