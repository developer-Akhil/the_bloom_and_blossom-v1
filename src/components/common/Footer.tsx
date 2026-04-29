import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';

export function Footer() {
  return (
    <footer className="bg-white border-t pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-bloom-rose/20 group-hover:border-bloom-rose transition-all">
                <OptimizedImage 
                  src="/images/logo/logo.jpeg" 
                  alt="The Bloom and Blossom Logo" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className="font-serif text-2xl font-bold text-bloom-rose">
                The Bloom & Blossom
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Hand-crafted hair accessories designed to bring out the blooming beauty in every person. Delicate, elegant, and uniquely yours.
            </p>
            <div className="flex space-x-4">
              <SocialIcon href="https://www.instagram.com/bows_scrunchies.love/" icon={<Instagram size={20} />} />
              <SocialIcon href="https://www.youtube.com/@thebloomandblossom" icon={<Youtube size={20} />} />
              <SocialIcon href="https://www.facebook.com/share/1GMNfXQki9/" icon={<Facebook size={20} />} />
              <SocialIcon href="https://wa.me/message/6IMAWM55WUTII1" icon={<Phone size={20} />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><FooterLink to="/collections">All Collections</FooterLink></li>
              <li><FooterLink to="/collections?cat=Customised Name Bows">Customised Bows</FooterLink></li>
              <li><FooterLink to="/collections?cat=Scrunchies">Scrunchies</FooterLink></li>
              <li><FooterLink to="/new-arrivals">New Arrivals</FooterLink></li>
              <li><FooterLink to="/about">Our Story</FooterLink></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><FooterLink to="/contact">Contact Us</FooterLink></li>
              <li><FooterLink to="/terms">Terms & Conditions</FooterLink></li>
              <li><FooterLink to="/returns">Returns & Refunds</FooterLink></li>
              <li><FooterLink to="/faq">FAQs</FooterLink></li>
              <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="font-serif text-lg font-bold">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-sm text-gray-500">
                <MapPin size={18} className="text-bloom-rose shrink-0" />
                <span>Shivlok Colony Haridwar<br/>Uttarakhand 249403</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <Phone size={18} className="text-bloom-rose shrink-0" />
                <span>+91 8076323737</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <Mail size={18} className="text-bloom-rose shrink-0" />
                <span>info@bloomandblossom.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t text-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} The Bloom & Blossom. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="p-2 rounded-full bg-bloom-pink text-bloom-rose hover:bg-bloom-rose hover:text-white transition-all"
    >
      {icon}
    </a>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="hover:text-bloom-rose hover:pl-2 transition-all block">
      {children}
    </Link>
  );
}
