import { Search, Bell, SlidersHorizontal } from "lucide-react";
import { categories, recommendedCourses, bannerImage } from "../../data/homeData";
import logo from "../../assets/logo.jpg";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // Mock User Status
  const userStatus = {
    isTested: false, 
  };

  const handleCourseClick = () => {
    if (userStatus.isTested) {
      navigate("/course-detail");
    } else {
      const confirm = window.confirm("Please take the Placement Test first to unlock courses!");
      if (confirm) {
        navigate("/placement-test");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24 md:pb-8">
      
      {/* 1. MOBILE HEADER (សម្រាប់តែទូរស័ព្ទ) */}
      {/* ដាក់ className "md:hidden" ដើម្បីលាក់វានៅលើ Desktop */}
      <div className="bg-white sticky top-0 z-40 shadow-sm md:hidden">
        <div className="px-4 h-16 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <img src={logo} alt="Logo" className="w-10 h-10 object-contain rounded-full border border-gray-100" />
                <div>
                    <h1 className="text-lg font-bold text-[#00B4F6] leading-none">សាលាឌីជីថល</h1>
                    <p className="text-[10px] text-gray-500">រៀនបានគ្រប់ទីកន្លែង</p>
                </div>
            </div>
            
            <button className="p-2 bg-gray-50 rounded-full border border-gray-100 relative hover:bg-gray-100 transition">
                <Bell size={24} className="text-gray-600" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* 2. Banner Section */}
        <div className="w-full h-48 md:h-64 lg:h-80 rounded-[32px] overflow-hidden shadow-lg relative group">
           <img 
             src={bannerImage} 
             alt="Banner" 
             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-6 flex flex-col justify-end">
              <span className="bg-[#00B4F6] w-fit text-white text-xs font-bold px-3 py-1 rounded-full mb-2">NEW EVENT</span>
              <h2 className="text-white font-bold text-xl md:text-3xl lg:text-4xl mb-1">Outing Class 2029</h2>
              <p className="text-white/90 text-sm md:text-base">Join our special event and learn from nature!</p>
           </div>
        </div>

        {/* 3. Search Bar (Mobile Only - md:hidden) */}
        {/* Desktop មាន Search នៅលើ Header ធំហើយ */}
        <div className="flex gap-3 md:hidden">
            <div className="flex-1 flex items-center bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                <Search size={20} className="text-gray-400 mr-2" />
                <input 
                    type="text" 
                    placeholder="Search courses..." 
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                />
            </div>
            <button className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-gray-600">
                <SlidersHorizontal size={20} />
            </button>
        </div>

        {/* 4. Topics / Categories */}
        <div>
            <h3 className="font-bold text-lg md:text-xl text-gray-800 mb-4">Explore Topics</h3>
            {/* Mobile: Scroll | Desktop: Wrap */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap">
                {categories.map((cat, index) => (
                    <button 
                        key={cat.id}
                        className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm md:text-base font-bold transition-all hover:-translate-y-1 ${
                            index === 0 
                            ? "bg-[#00B4F6] text-white shadow-md shadow-blue-200" 
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-blue-300"
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>

        {/* 5. Recommended Section */}
        <div>
            <div className="flex justify-between items-end mb-4">
                <h3 className="font-bold text-lg md:text-xl text-gray-800">Recommended For You</h3>
                <button className="text-[#00B4F6] text-sm font-bold hover:underline">See All</button>
            </div>
            
            {/* RESPONSIVE LAYOUT MAGIC: */}
            {/* Mobile: Flex Row + Scroll */}
            {/* Desktop: Grid Layout */}
            <div className="
                flex gap-4 overflow-x-auto pb-4 scrollbar-hide 
                md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 md:overflow-visible
            ">
                {recommendedCourses.map((course) => (
                    <div 
                        key={course.id} 
                        onClick={handleCourseClick}
                        className="
                            min-w-[280px] md:min-w-0 
                            bg-white rounded-3xl p-3 shadow-sm border border-gray-100 
                            cursor-pointer transition-all duration-300 
                            hover:shadow-xl hover:-translate-y-1 group
                        "
                    >
                        <div className="w-full h-40 md:h-48 rounded-2xl overflow-hidden mb-3 relative">
                            <img 
                                src={course.image} 
                                alt={course.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-700 flex items-center gap-1 shadow-sm">
                                <span>⭐</span> 4.8
                            </div>
                        </div>
                        <div className="px-1">
                            <h4 className="font-bold text-gray-800 text-sm md:text-base line-clamp-2 mb-2 group-hover:text-[#00B4F6] transition-colors">
                                {course.title}
                            </h4>
                            <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.author}`} alt="Author" />
                                 </div>
                                 <span className="text-xs text-gray-500 font-medium">{course.author}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>

      {/* 6. REMOVED BOTTOM NAV FROM HERE */}
      {/* ព្រោះ MainLayout បានដាក់វារួចហើយ មិនបាច់ដាក់ទៀតទេ */}
      
    </div>
  );
}