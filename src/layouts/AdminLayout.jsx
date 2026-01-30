// import { useState } from "react";
// import { Outlet, Link, useLocation } from "react-router-dom";
// import { LayoutDashboard, Users, Menu, X, LogOut, FileCheck } from "lucide-react";

// export default function AdminLayout() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const location = useLocation();

//   const menuItems = [
//     { path: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20}/> },
//     { path: "/admin/students", label: "Students", icon: <Users size={20}/> },
//     { path: "/admin/requests", label: "Exam Requests", icon: <FileCheck size={20}/> },
//   ];

//   return (
//     <div className="flex bg-gray-100 h-screen">

//       {/* Mobile Header */}
//       <div className="md:hidden top-0 z-50 fixed flex justify-between items-center bg-[#1a1f2c] p-4 w-full text-white">
//          <span className="font-bold">SALA ADMIN</span>
//          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
//            {isMobileMenuOpen ? <X /> : <Menu />}
//          </button>
//       </div>

//       {/* Sidebar */}
//       <aside className={`
//           bg-[#1a1f2c] text-white w-64 flex flex-col fixed h-full z-40 transition-transform duration-300
//           ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
//           md:translate-x-0 md:static
//       `}>
//         <div className="hidden md:block p-6 border-gray-700 border-b font-bold text-[#00B4F6]">
//           SALA ADMIN
//         </div>

//         <nav className="flex-1 space-y-2 mt-16 md:mt-0 p-4">
//           {menuItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               onClick={() => setIsMobileMenuOpen(false)}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                 location.pathname === item.path
//                   ? "bg-[#00B4F6] text-white"
//                   : "text-slate-400 hover:bg-slate-800"
//               }`}
//             >
//               {item.icon}
//               <span>{item.label}</span>
//             </Link>
//           ))}
//         </nav>

//         <div className="p-4 border-slate-700 border-t">
//            <button className="flex items-center gap-3 px-4 py-2 w-full text-red-400 hover:text-red-300">
//              <LogOut size={20} />
//              <span>Logout</span>
//            </button>
//         </div>
//       </aside>

//       {/* Content */}
//       <div className="flex flex-col flex-1 w-full">
//          <main className="mt-16 md:mt-0 p-4 md:p-8 h-full overflow-y-auto">
//             <Outlet />
//          </main>
//       </div>

//     </div>
//   );
// }

import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Menu,
  X,
  LogOut,
  FileCheck,
  BookOpen,
  BookCheck,
  Settings,
  UserStarIcon,
} from "lucide-react";
import { useMe } from "@/hooks/api";
import UploadingList from "@/pages/admin/LessonManager/components/UploadingList";
import EmbededVideoModal from "@/pages/admin/LessonManager/components/EmbededVideoModal";

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { } = useMe();

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { path: "/admin/students", label: "Students", icon: <Users size={20} /> },
    {
      path: "/admin/requests",
      label: "Exam Requests",
      icon: <FileCheck size={20} />,
    },

    {
      path: "/admin/homework",
      label: "Homework",
      icon: <BookCheck size={20} />,
    },
    // { path: "/admin/lesson", label: "Lesson", icon: <BookCheck size={20} /> },
    {
      path: "/admin/courses",
      label: "Course Manager",
      icon: <BookOpen size={20} />,
    },
    {
      path: "/admin/user",
      label: "User Manager",
      icon: <UserStarIcon size={20} />,
    },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    // 🟢 1. ប្រើ h-screen និង overflow-hidden ដើម្បីកុំឱ្យ Page ទាំងមូល Scroll (Scroll តែ Content ខាងក្នុង)
    <div className="flex bg-gray-100 h-screen overflow-hidden">
      {/* 🟢 2. OVERLAY (ផ្ទាំងខ្មៅស្រអាប់ពេលបើក Menu លើទូរស័ព្ទ) */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden z-40 fixed inset-0 bg-black/50 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 🟢 3. MOBILE HEADER (Fixed Top) */}
      <div className="md:hidden top-0 z-30 fixed flex justify-between items-center bg-[#1a1f2c] shadow-md p-4 w-full h-16 text-white">
        <span className="font-khmer-os-battambang font-bold tracking-wide">
          SALA ADMIN
        </span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="hover:bg-white/10 p-1 rounded-md"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 🟢 4. SIDEBAR (Fixed Z-Index to 50 ដើម្បីឱ្យនៅលើគេបង្អស់ពេលបើក) */}
      <aside
        className={`
          bg-[#1a1f2c] text-white w-64 flex flex-col fixed h-full z-50 transition-transform duration-300 ease-in-out shadow-2xl
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:shadow-none
      `}
      >
        {/* Sidebar Header */}
        <div className="hidden md:flex justify-center items-center border-gray-700 border-b h-16 font-bold text-[#00B4F6] text-xl tracking-wider">
          SALA ADMIN
        </div>

        {/* Close Button for Mobile inside Sidebar (Optional UX improvement) */}
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${location.pathname === item.path
                ? "bg-[#00B4F6] text-white shadow-lg shadow-blue-900/50"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              {item.icon}
              <span className="font-sans">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="bg-[#151922] p-4 border-gray-700 border-t">
          <button className="flex items-center gap-3 hover:bg-red-400/10 px-4 py-3 rounded-xl w-full font-medium text-red-400 hover:text-red-300 transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 🟢 5. MAIN CONTENT AREA (Scrollable) */}
      <div className="relative flex flex-col flex-1 w-full h-full">
        {/* pt-16 សម្រាប់ទូរស័ព្ទ (ការពារកុំឱ្យ Header បាំង) និង md:pt-0 សម្រាប់ Desktop */}
        <main className="flex-1 bg-gray-50 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
          <Outlet />
        </main>
        <UploadingList />
        <EmbededVideoModal />
      </div>
    </div>
  );
}
