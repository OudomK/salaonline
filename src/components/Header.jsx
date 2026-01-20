import { Link } from "react-router-dom";
import { Bell, Search, User } from "lucide-react";
import logo from "../assets/logo.jpg";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-8 h-8 rounded-full" />
          <span className="font-bold text-xl text-[#00B4F6]">SALA ONLINE</span>
        </Link>

        {/* Desktop Menu (លាក់លើ Mobile, បង្ហាញលើ Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/home" className="font-medium text-gray-700 hover:text-[#00B4F6]">Home</Link>
          <Link to="/courses" className="font-medium text-gray-700 hover:text-[#00B4F6]">Courses</Link>
          <Link to="/about" className="font-medium text-gray-700 hover:text-[#00B4F6]">About Us</Link>
          <Link to="/contact" className="font-medium text-gray-700 hover:text-[#00B4F6]">Contact</Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-gray-100 rounded-full px-3 py-1.5 items-center">
            <Search size={18} className="text-gray-400" />
            <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm ml-2 w-32 lg:w-64" />
          </div>
          <button className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <Link to="/profile" className="hidden md:block">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-[#00B4F6]">
                <User size={18} />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}