import React from "react";
import { Bus, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Shield, FileText, Home, CreditCard, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="text-white">
      {/* Main Footer */}
      <div className="bg-[#295A55]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Bus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">BUS VARA</h3>
                  <p className="text-sm text-white/80">Your Journey, Our Priority</p>
                </div>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Bus Vara is your trusted partner for safe and comfortable bus travel across Bangladesh. 
                We provide the best routes with reliable service and affordable prices.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-white/80" />
                  <span className="text-white/80 text-sm">+880 1234-567890</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-white/80" />
                  <span className="text-white/80 text-sm">support@busvara.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-white/80" />
                  <span className="text-white/80 text-sm">Dhaka, Bangladesh</span>
                </div>
              </div>
            </div>

            {/* Policies */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Policies
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-white/80 hover:text-white flex items-center gap-2 transition-colors">
                    <FileText className="w-4 h-4" />
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white flex items-center gap-2 transition-colors">
                    <Shield className="w-4 h-4" />
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white flex items-center gap-2 transition-colors">
                    <FileText className="w-4 h-4" />
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white flex items-center gap-2 transition-colors">
                    <Heart className="w-4 h-4" />
                    Advertisement
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-white/80 hover:text-white flex items-center gap-2 transition-colors">
                    <Home className="w-4 h-4" />
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white flex items-center gap-2 transition-colors">
                    <FileText className="w-4 h-4" />
                    My Tickets
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white flex items-center gap-2 transition-colors">
                    <Phone className="w-4 h-4" />
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white flex items-center gap-2 transition-colors">
                    <Heart className="w-4 h-4" />
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Payment Methods & Social */}
            <div className="space-y-6">
              {/* Payment Methods */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Pay With
                </h3>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-white/10 rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/20 transition-colors cursor-pointer">
                    Bkash
                  </div>
                  <div className="bg-white/10 rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/20 transition-colors cursor-pointer">
                    Nagad
                  </div>
                  <div className="bg-white/10 rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/20 transition-colors cursor-pointer">
                    Rocket
                  </div>
                  <div className="bg-white/10 rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/20 transition-colors cursor-pointer">
                    Card
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Newsletter */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <button className="px-4 py-2 bg-white text-[#295A55] rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-[#1F4945] py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/70 text-sm">
              <p>© 2025 busvara.com. All rights reserved.</p>
            </div>
            
            <div className="flex items-center gap-6 text-white/70 text-sm">
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
              <a href="#" className="hover:text-white transition-colors">FAQ</a>
              <a href="#" className="hover:text-white transition-colors">Help Center</a>
              <a href="#" className="hover:text-white transition-colors">Careers</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;