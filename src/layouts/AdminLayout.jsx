import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Menu, X, LogOut } from "lucide-react";

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20}/> },
    { path: "/admin/students", label: "Students", icon: <Users size={20}/> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-[#1a1f2c] text-white p-4 flex justify-between items-center z-50">
         <span className="font-bold">SALA ADMIN</span>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
           {isMobileMenuOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* Sidebar */}
      <aside className={`
          bg-[#1a1f2c] text-white w-64 flex flex-col fixed h-full z-40 transition-transform duration-300
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static
      `}>
        <div className="hidden md:block p-6 font-bold text-[#00B4F6] border-b border-gray-700">
          SALA ADMIN
        </div>
        
        <nav className="flex-1 p-4 mt-16 md:mt-0 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path 
                  ? "bg-[#00B4F6] text-white" 
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
           <button className="flex items-center gap-3 text-red-400 hover:text-red-300 w-full px-4 py-2">
             <LogOut size={20} />
             <span>Logout</span>
           </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col w-full">
         <main className="p-4 md:p-8 mt-16 md:mt-0 overflow-y-auto h-full">
            <Outlet />
         </main>
      </div>
      
    </div>
  );
}