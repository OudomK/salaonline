import { 
  User, BookOpen, Award, Globe, 
  CreditCard, MapPin, Share2, Edit2, 
  ChevronRight, LogOut 
} from "lucide-react";

export default function Profile() {
  const user = {
    name: "Sun Vatanak",
    location: "St. Phnom Penh",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
  };

  const menuGroups = [
    {
      id: 1,
      title: "General", 
      items: [
        { icon: <User size={20} />, label: "Account", link: "/account" },
        { icon: <BookOpen size={20} />, label: "Tester", link: "/placement-test" },
        { icon: <Award size={20} />, label: "Certificate", link: "/certificate" },
      ]
    },
    // {
    //   id: 2,
    //   title: "Learning",
    //   items: [
    //     { icon: <BookOpen size={20} />, label: "Learning", link: "/courses" },
    //     { icon: <BookOpen size={20} />, label: "Home Work", link: "/homework" },
    //     { icon: <Globe size={20} />, label: "Language", link: "/language" },
    //   ]
    // },
    {
      id: 2,
      title: "Learning",
      items: [
        // កែពី link: "/courses" ទៅ link: "/my-learning"
        // កែ label ទៅ "My Learning" ឱ្យច្បាស់ជាងមុន
        { icon: <BookOpen size={20} />, label: "My Learning", link: "/my-learning" }, 
        
        { icon: <BookOpen size={20} />, label: "Home Work", link: "/homework" },
        { icon: <Globe size={20} />, label: "Language", link: "/language" },
      ]
    },
    {
      id: 3,
      title: "Billing & More",
      items: [
        { icon: <CreditCard size={20} />, label: "Payment", link: "/payment" },
        { icon: <Share2 size={20} />, label: "Refer & Get off", link: "/referral" },
        { icon: <MapPin size={20} />, label: "My Locations", link: "/location" },
      ]
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] pb-32 md:pb-12 overflow-y-auto">
      
      {/* 1. Header Section */}
      <div className="bg-white p-6 rounded-b-[40px] shadow-sm mb-6 md:bg-transparent md:shadow-none md:p-0 md:mb-8">
        
        {/* Mobile Title */}
        <div className="flex justify-between items-start mb-4 md:hidden">
           <h1 className="text-xl font-bold text-gray-900">Profile</h1>
           <button className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
              <span className="text-xl">•••</span>
           </button>
        </div>

        {/* User Info Card */}
        <div className="flex items-center gap-4 bg-white md:p-6 md:rounded-3xl md:shadow-sm md:border md:border-gray-100 transition hover:shadow-md">
           <div className="w-16 h-16 rounded-full bg-blue-100 p-1 shrink-0">
              <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
           </div>
           
           <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 truncate">{user.name}</h2>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                 <MapPin size={14} className="mr-1 text-[#00B4F6] shrink-0" />
                 <span className="truncate">{user.location}</span>
              </div>
           </div>

           <button className="shrink-0 flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-100 border border-gray-100 transition active:scale-95">
              <Edit2 size={16} />
              <span className="hidden md:inline">Edit Profile</span>
              <span className="md:hidden">Edit</span>
           </button>
        </div>
      </div>

      {/* 2. Menu Sections (Grid) */}
      <div className="px-5 space-y-5 md:px-0 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 items-start">
        
        {menuGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 h-fit">
            {group.items.map((item, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-2xl transition group ${
                  index !== group.items.length - 1 ? "border-b border-gray-50" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                   <div className="text-gray-900 group-hover:text-[#00B4F6] transition-colors">{item.icon}</div>
                   <span className="font-bold text-gray-700 text-sm group-hover:text-gray-900">{item.label}</span>
                </div>
                <ChevronRight size={20} className="text-gray-400 group-hover:text-[#00B4F6] transition-transform group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        ))}

        {/* 3. Logout Button (Compact & Clean) */}
        {/* កែត្រង់នេះ៖ ដាក់ h-fit និងដក min-h ចេញ */}
        <div className="h-fit">
            <button className="w-full bg-white border border-red-100 text-red-500 font-bold py-4 rounded-3xl hover:bg-red-50 hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-3 group shadow-sm">
                <div className="p-1.5 bg-red-50 rounded-full group-hover:bg-white transition-colors">
                    <LogOut size={20} className="text-red-500" />
                </div>
                <span>Sign Out</span>
            </button>
        </div>

      </div>

    </div>
  );
}