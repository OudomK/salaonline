import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";
import logo from "../assets/logo.jpg";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-10 pb-6 mt-10">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="w-8 h-8 rounded-full border border-gray-100" />
              <span className="font-bold text-xl text-[#00B4F6]">SALA ONLINE</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              ប្រព័ន្ធគ្រប់គ្រងការសិក្សាតាមអនឡាញដំបូងគេនៅកម្ពុជា។ រៀនបានគ្រប់ទីកន្លែង គ្រប់ពេលវេលា។
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-pink-500 hover:bg-pink-50 transition">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/home" className="hover:text-[#00B4F6] transition">Home</Link></li>
              <li><Link to="/courses" className="hover:text-[#00B4F6] transition">All Courses</Link></li>
              <li><Link to="/placement-test" className="hover:text-[#00B4F6] transition">Placement Test</Link></li>
              <li><Link to="/profile" className="hover:text-[#00B4F6] transition">My Account</Link></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Popular Courses</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="#" className="hover:text-[#00B4F6] transition">General English</Link></li>
              <li><Link to="#" className="hover:text-[#00B4F6] transition">Chinese for Beginners</Link></li>
              <li><Link to="#" className="hover:text-[#00B4F6] transition">Mathematics Grade 12</Link></li>
              <li><Link to="#" className="hover:text-[#00B4F6] transition">Physics & Science</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#00B4F6] mt-0.5" />
                <span>Phnom Penh, Cambodia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#00B4F6]" />
                <span>+855 12 345 678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#00B4F6]" />
                <span>support@salaonline.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2026 Sala Online. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link to="#" className="hover:text-gray-600">Privacy Policy</Link>
            <Link to="#" className="hover:text-gray-600">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}