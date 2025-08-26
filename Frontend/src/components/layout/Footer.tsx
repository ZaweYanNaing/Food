import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Salad } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/foodfusion', color: 'hover:text-blue-500' },
    { name: 'X', icon: Twitter, href: 'https://twitter.com/foodfusion', color: 'hover:text-emerald-500' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/foodfusion', color: 'hover:text-[#FF9B2F]' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/foodfusion', color: 'hover:text-[#FB4141]' },
    { name: 'Email', icon: Mail, href: 'mailto:contact@foodfusion.com', color: 'hover:text-[#78C841]' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-300 to-gray-200 ">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                <Salad className="w-5 h-5 " />
              </div>
              <span className="text-xl font-bold ">FoodFusion</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed max-w-md">
              A culinary platform dedicated to promoting home cooking and culinary 
              creativity among food enthusiasts. Share recipes, learn techniques, 
              and connect with fellow cooking enthusiasts.
            </p>
            
            {/* Social Media Links */}
            <div className="mt-6">
              <h4 className="text-gray-700 font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-900/80 transition-all duration-300 hover:scale-110 ${social.color}`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-gray-950 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-900/80 hover:text-white transition-colors hover:translate-x-1 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/recipe-management" className="text-gray-900/80 hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Recipe Collection
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-900/80 hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Community Cookbook
                </Link>
              </li>
              <li>
                <Link to="/culinary-resources" className="text-gray-900/80 hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Culinary Resources
                </Link>
              </li>
              <li>
                <Link to="/educational-resources" className="text-gray-900/80 hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Educational Resources
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support & Legal */}
          <div>
            <h4 className="text-gray-950 font-semibold mb-4">Support & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-gray-900/80 hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="/privacy-policy" className="text-gray-900/80 hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="text-gray-900/80 hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/cookie-policy" className="text-gray-900/80 hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="/help" className="text-gray-900/80 hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Help & FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-900/80 text-sm">
              &copy; 2025 FoodFusion. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="/sitemap" className="text-gray-900/80 hover:text-white transition-colors">
                Sitemap
              </a>
              <a href="/accessibility" className="text-gray-900/80 hover:text-white transition-colors">
                Accessibility
              </a>
              <a href="/sustainability" className="text-gray-900/80 hover:text-white transition-colors">
                Sustainability
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
