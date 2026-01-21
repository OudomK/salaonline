import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import Header from "../components/client/Header";
import Footer from "../components/client/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      
      {/* 1. Header: បង្ហាញតែលើ Desktop (hidden on mobile) */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* 2. Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto md:px-4 md:py-6">
        <Outlet />
      </main>

      {/* 3. Footer: បង្ហាញតែលើ Desktop (hidden on mobile) */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* 4. Bottom Nav: បង្ហាញតែលើ Mobile (md:hidden) */}
      <div className="md:hidden fixed bottom-0 w-full z-50">
        <BottomNav />
      </div>

    </div>
  );
}