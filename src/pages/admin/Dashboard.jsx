import React from 'react';
import { Users, UserPlus, Zap, BookOpen, TrendingUp, ArrowUpRight, MoreHorizontal } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- MOCK DATA ---
const chartData = [
  { name: 'Mon', students: 12 },
  { name: 'Tue', students: 19 },
  { name: 'Wed', students: 15 },
  { name: 'Thu', students: 25 },
  { name: 'Fri', students: 32 },
  { name: 'Sat', students: 40 },
  { name: 'Sun', students: 45 },
];

const topLanguages = [
  { name: 'English', students: 650, color: '#00B4F6' },
  { name: 'Chinese', students: 420, color: '#F59E0B' },
  { name: 'Korean', students: 180, color: '#10B981' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      
      {/* 1. Header Section (Responsive: Mobile Stack / Desktop Row) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 font-khmer-os-battambang">
            ផ្ទាំងគ្រប់គ្រង (Dashboard)
          </h1>
          <p className="text-xs md:text-sm text-gray-500 font-khmer-os-battambang mt-1">
            សួស្តី! នេះជារបាយការណ៍សង្ខេបសម្រាប់ថ្ងៃនេះ។
          </p>
        </div>
        
        {/* Date Badge */}
        <div className="bg-white border border-gray-200 text-xs md:text-sm px-4 py-2 rounded-xl shadow-sm font-medium text-gray-600 w-full md:w-auto text-center md:text-left">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* 2. STATS CARDS GRID (Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Card 1: Total Students */}
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
           <div>
              <p className="text-gray-500 text-[10px] md:text-xs font-bold font-khmer-os-battambang uppercase tracking-wider">សិស្សសរុប</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">1,250</h3>
              <span className="text-[10px] md:text-xs font-bold text-green-500 flex items-center gap-1 mt-1 bg-green-50 w-fit px-2 py-0.5 rounded-full">
                <TrendingUp size={12} /> +12%
              </span>
           </div>
           <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#00B4F6] group-hover:scale-110 transition-transform">
              <Users size={20} className="md:w-6 md:h-6" />
           </div>
        </div>

        {/* Card 2: New Students */}
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
           <div>
              <p className="text-gray-500 text-[10px] md:text-xs font-bold font-khmer-os-battambang uppercase tracking-wider">សិស្សថ្មីថ្ងៃនេះ</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">15</h3>
              <span className="text-[10px] md:text-xs font-bold text-blue-500 flex items-center gap-1 mt-1 bg-blue-50 w-fit px-2 py-0.5 rounded-full">
                <ArrowUpRight size={12} /> New
              </span>
           </div>
           <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
              <UserPlus size={20} className="md:w-6 md:h-6" />
           </div>
        </div>

        {/* Card 3: Top Language */}
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
           <div>
              <p className="text-gray-500 text-[10px] md:text-xs font-bold font-khmer-os-battambang uppercase tracking-wider">ពេញនិយម</p>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-2">English</h3>
              <p className="text-[10px] md:text-xs text-gray-400 font-khmer-os-battambang mt-1">Level 1</p>
           </div>
           <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
              <BookOpen size={20} className="md:w-6 md:h-6" />
           </div>
        </div>

        {/* Card 4: Active Now (Gradient) */}
        <div className="bg-gradient-to-br from-[#00B4F6] to-blue-500 p-5 md:p-6 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-between text-white relative overflow-hidden">
           <div className="relative z-10">
              <p className="text-blue-100 text-[10px] md:text-xs font-bold font-khmer-os-battambang uppercase tracking-wider">Online ឥឡូវនេះ</p>
              <div className="flex items-end gap-2 mt-2">
                 <h3 className="text-3xl md:text-4xl font-bold">42</h3>
                 <span className="mb-1.5 text-xs md:text-sm font-medium opacity-80 font-khmer-os-battambang">នាក់</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                 <span className="relative flex h-2.5 w-2.5">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400 border-2 border-blue-500"></span>
                 </span>
                 <span className="text-[10px] md:text-xs font-bold">Live System</span>
              </div>
           </div>
           <div className="absolute -right-4 -bottom-4 text-white/20">
              <Zap size={80} className="md:w-[100px] md:h-[100px]" />
           </div>
        </div>
      </div>

      {/* 3. CHARTS SECTION (Mobile: Stacked, Desktop: Side-by-Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Chart (Mobile: Full Width) */}
        <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 text-sm md:text-base font-khmer-os-battambang">កំណើនសិស្ស (Growth)</h3>
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                 <MoreHorizontal size={20} />
              </button>
           </div>
           
           {/* Responsive Container ជួយឱ្យ Chart បត់បែនតាមទំហំប្រអប់ */}
           <div className="h-[250px] md:h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00B4F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00B4F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area type="monotone" dataKey="students" stroke="#00B4F6" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Right Section (Mobile: Full Width) */}
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="font-bold text-gray-800 text-sm md:text-base font-khmer-os-battambang mb-6">ភាសាពេញនិយម</h3>
           
           <div className="space-y-6">
              {topLanguages.map((lang, index) => (
                <div key={index}>
                   <div className="flex justify-between text-xs md:text-sm mb-2 font-medium">
                      <span className="text-gray-700">{lang.name}</span>
                      <span className="text-gray-900 font-bold">{lang.students}</span>
                   </div>
                   <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-2 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${(lang.students / 1250) * 100}%`, backgroundColor: lang.color }}
                      ></div>
                   </div>
                </div>
              ))}
           </div>

           {/* Mobile-Friendly Banner */}
           <div className="mt-8 bg-orange-50 rounded-xl p-4 border border-orange-100 flex items-start gap-3">
              <div className="bg-orange-100 p-2 rounded-lg text-orange-500 shrink-0">
                 <BookOpen size={18} />
              </div>
              <div>
                 <h4 className="text-sm font-bold text-gray-800 font-khmer-os-battambang">English L1</h4>
                 <p className="text-[11px] text-gray-500 mt-1 font-khmer-os-battambang leading-relaxed">
                   វគ្គសិក្សានេះមានសន្ទុះខ្លាំងជាងគេប្រចាំសប្តាហ៍។
                 </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}