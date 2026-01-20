import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Import Icons
import logo from "../assets/logo.jpg"; 
import { districts, schools } from "../data/location";

export default function Register() {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State
  const kampongChamDistricts = districts.p1; 

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] flex items-center justify-center p-4 py-10">
      <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-sm border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="w-20 h-20 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-[#1E3A8A]">សាលា ONLINE</h1>
          <p className="text-gray-500 mt-1">ចុះឈ្មោះចូលរៀន</p>
        </div>

        {/* Form Inputs */}
        <div className="space-y-6">
          
          {/* Names */}
          <div className="grid grid-cols-2 gap-4">
             <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-2 text-[10px] font-bold text-gray-500">
                    ត្រកូល (First Name)
                </label>
                <input type="text" className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-[#00B4F6] focus:ring-1 focus:ring-[#00B4F6] text-sm font-bold text-gray-800" />
             </div>
             <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-2 text-[10px] font-bold text-gray-500">
                    ឈ្មោះ (Last Name)
                </label>
                <input type="text" className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-[#00B4F6] focus:ring-1 focus:ring-[#00B4F6] text-sm font-bold text-gray-800" />
             </div>
          </div>

          {/* Phone (Improved) */}
          <div className="relative group">
                <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs font-bold text-[#00B4F6] z-10">
                    លេខទូរស័ព្ទ (Phone)
                </label>
                <div className="flex items-center w-full border border-gray-300 rounded-2xl px-4 py-3.5 focus-within:border-[#00B4F6] focus-within:ring-1 focus-within:ring-[#00B4F6] transition-all bg-white">
                    <div className="flex items-center border-r border-gray-300 pr-3 mr-3 select-none">
                        <span className="text-lg mr-2">🇰🇭</span>
                        <span className="font-bold text-gray-700 text-sm">+855</span>
                    </div>
                    <input 
                        type="tel" 
                        placeholder="12 345 678" 
                        className="w-full outline-none text-gray-800 font-bold placeholder-gray-400 h-full bg-transparent text-lg tracking-wide"
                    />
                </div>
          </div>

          {/* Gender */}
          <div className="relative">
             <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs font-bold text-gray-500">
                ភេទ (Gender)
             </label>
             <select className="w-full border border-gray-300 rounded-2xl px-4 py-3.5 outline-none focus:border-[#00B4F6] focus:ring-1 focus:ring-[#00B4F6] bg-white appearance-none text-gray-700 font-bold">
                 <option value="">-- ជ្រើសរើស --</option>
                 <option value="M">ប្រុស (Male)</option>
                 <option value="F">ស្រី (Female)</option>
             </select>
             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
          </div>

          {/* Location Section */}
          <div className="space-y-5 pt-2">
            <div className="relative">
               <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs font-bold text-gray-400">
                  ខេត្ត (Province)
               </label>
               <div className="flex justify-between items-center w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3.5 text-gray-500 cursor-not-allowed">
                  <span className="font-bold">ខេត្តកំពង់ចាម</span>
                  <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-md font-bold">LOCKED</span>
               </div>
            </div>
            <div className="relative">
               <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs font-bold text-[#00B4F6]">
                  ស្រុក (District)
               </label>
               <select 
                 className="w-full border border-[#00B4F6] rounded-2xl px-4 py-3.5 outline-none focus:ring-1 focus:ring-[#00B4F6] bg-white appearance-none text-gray-800 font-bold"
                 value={selectedDistrict}
                 onChange={(e) => setSelectedDistrict(e.target.value)}
               >
                 <option value="">-- ជ្រើសរើសស្រុក --</option>
                 {kampongChamDistricts?.map((d) => (
                   <option key={d.id} value={d.id}>{d.name}</option>
                 ))}
               </select>
               <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
            </div>
          </div>

          {/* School */}
          <div className="relative">
                <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs font-bold text-gray-500">
                  សាលារៀន (School)
               </label>
                <select className="w-full border border-gray-300 rounded-2xl px-4 py-3.5 outline-none focus:border-[#00B4F6] focus:ring-1 focus:ring-[#00B4F6] bg-white appearance-none text-gray-700 font-bold">
                    <option value="">-- ជ្រើសរើសសាលារៀន --</option>
                    {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
          </div>

          {/* Password (With Eye Icon) */}
          <div className="relative group">
                <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs font-bold text-[#00B4F6] z-10">
                    ពាក្យសម្ងាត់ (Password)
                </label>
                <div className="flex items-center w-full border border-gray-300 rounded-2xl px-4 py-3.5 focus-within:border-[#00B4F6] focus-within:ring-1 focus-within:ring-[#00B4F6] transition-all bg-white">
                    <input 
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••" 
                        className="w-full outline-none text-gray-800 font-bold placeholder-gray-400 h-full bg-transparent tracking-widest"
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                </div>
          </div>

          {/* Submit Button */}
          <button className="w-full bg-[#00B4F6] text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-500 transition-all active:scale-95 mt-2">
             ចុះឈ្មោះ (Sign Up)
          </button>
          
          <p className="text-center text-gray-500 text-sm">
             មានគណនីរួចហើយ? <Link to="/login" className="text-[#00B4F6] font-bold hover:underline">ចូលប្រើ (Sign In)</Link>
          </p>

        </div>
      </div>
    </div>
  );
}