// src/components/BottomNav.jsx
import { Home, BookOpen, GraduationCap, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  // មុខងារសម្រាប់កំណត់ថា Tab មួយណា Active
  const isActive = (route) => path === route;

  const navItems = [
    { name: "Home", icon: <Home size={24} />, route: "/home" },
    { name: "Courses", icon: <BookOpen size={24} />, route: "/courses" },
    { name: "My Learning", icon: <GraduationCap size={24} />, route: "/my-learning" },
    { name: "Profile", icon: <User size={24} />, route: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <Link to={item.route} key={item.name}>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                isActive(item.route)
                  ? "bg-[#00B4F6] text-white font-bold shadow-md"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {item.icon}
              {/* បង្ហាញឈ្មោះតែពេល Active (ដូចក្នុង Design) */}
              {isActive(item.route) && <span className="text-sm">{item.name}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}