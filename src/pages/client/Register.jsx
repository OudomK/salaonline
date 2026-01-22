import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import logo from "../../assets/logo.jpg";

// 🟢 Import Data
import { provinces, districts, schools, grades } from "../../data/location";

// 🟢 Import Shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  
  // State for Location
  const [selectedProvince, setSelectedProvince] = useState("p1"); 
  const [districtList, setDistrictList] = useState(districts.p1 || []);

  const handleProvinceChange = (provinceId) => {
    setSelectedProvince(provinceId);
    setDistrictList(districts[provinceId] || []);
  };

  const handleRegister = () => {
    navigate("/otp-verification");
  };

  return (
    <div className="min-h-screen w-full bg-white md:bg-[#f8f9fa] flex items-center justify-center font-khmer-os-battambang">
      
      {/* 🟢 Main Card Container */}
      <div className="w-full h-full md:h-auto md:max-w-lg md:bg-white md:rounded-[32px] md:p-10 md:shadow-xl md:border md:border-gray-100 flex flex-col">
        
        {/* 🟢 1. Header (Back Button) - ចេញតែនៅលើ Mobile (md:hidden) */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center md:hidden">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full -ml-2 text-gray-600 hover:bg-gray-100">
                <ChevronLeft size={28} />
            </Button>
            <span className="font-bold text-lg ml-2 text-gray-800">ត្រឡប់ក្រោយ</span>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 pb-10 pt-4 md:px-0 md:pt-0">
            
            {/* Logo & Title */}
            <div className="text-center mb-8">
                <img src={logo} alt="Logo" className="w-24 h-24 mb-4 mx-auto object-contain" />
                <h1 className="text-2xl font-extrabold text-[#1E3A8A]">ចុះឈ្មោះសិស្សថ្មី</h1>
                <p className="text-gray-500 text-sm mt-2">បំពេញព័ត៌មានដើម្បីបង្កើតគណនីសិក្សា</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
            
            {/* Names (2 Columns) */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-gray-500">ត្រកូល (First Name)</label>
                    <Input className="rounded-xl bg-gray-50 border-gray-200 h-12 font-bold focus-visible:ring-[#00B4F6]" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-gray-500">ឈ្មោះ (Last Name)</label>
                    <Input className="rounded-xl bg-gray-50 border-gray-200 h-12 font-bold focus-visible:ring-[#00B4F6]" />
                </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#00B4F6]">លេខទូរស័ព្ទ (Phone)</label>
                <div className="flex items-center rounded-xl bg-white border border-[#00B4F6] h-12 px-3 focus-within:ring-2 focus-within:ring-[#00B4F6] focus-within:ring-offset-0 shadow-sm">
                    <span className="mr-3 font-bold text-gray-500 text-sm border-r pr-3 py-1">🇰🇭 +855</span>
                    <input 
                        type="tel" 
                        className="flex-1 outline-none font-bold text-gray-900 bg-transparent h-full text-lg tracking-wide placeholder:text-gray-300" 
                        placeholder="12 345 678" 
                    />
                </div>
            </div>

            {/* Gender & Grade (2 Columns) */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-gray-500">ភេទ (Gender)</label>
                    <Select>
                        <SelectTrigger className="w-full rounded-xl h-12 bg-gray-50 border-gray-200 font-bold text-gray-600 focus:ring-[#00B4F6]">
                            <SelectValue placeholder="ភេទ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="M">ប្រុស (Male)</SelectItem>
                            <SelectItem value="F">ស្រី (Female)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-gray-500">ថ្នាក់ទី (Grade)</label>
                    <Select>
                        <SelectTrigger className="w-full rounded-xl h-12 bg-gray-50 border-gray-200 font-bold text-gray-600 focus:ring-[#00B4F6]">
                            <SelectValue placeholder="ថ្នាក់" />
                        </SelectTrigger>
                        <SelectContent>
                            {grades && grades.map((g) => (
                                <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Location Section */}
            <div className="space-y-4 pt-1">
                <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-gray-500">ខេត្ត (Province)</label>
                    <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                        <SelectTrigger className="w-full rounded-xl h-12 bg-gray-50 border-gray-200 font-bold text-gray-600 focus:ring-[#00B4F6]">
                            <SelectValue placeholder="ជ្រើសរើសខេត្ត" />
                        </SelectTrigger>
                        <SelectContent>
                            {provinces.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-[#00B4F6]">ស្រុក (District)</label>
                    <Select>
                        <SelectTrigger className="w-full rounded-xl h-12 bg-white border-[#00B4F6] font-bold text-gray-800 ring-1 ring-[#00B4F6] focus:ring-2">
                            <SelectValue placeholder="ជ្រើសរើសស្រុក" />
                        </SelectTrigger>
                        <SelectContent>
                            {districtList.map((d) => (
                                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* School */}
            <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500">សាលារៀន (School)</label>
                <Select>
                    <SelectTrigger className="w-full rounded-xl h-12 bg-gray-50 border-gray-200 font-bold text-gray-600 focus:ring-[#00B4F6]">
                        <SelectValue placeholder="ជ្រើសរើសសាលារៀន" />
                    </SelectTrigger>
                    <SelectContent>
                        {schools && schools.map(s => (
                            <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#00B4F6]">ពាក្យសម្ងាត់ (Password)</label>
                <div className="relative">
                    <Input 
                        type={showPassword ? "text" : "password"} 
                        className="rounded-xl bg-white border-[#00B4F6] h-12 font-bold pr-10 text-lg tracking-widest focus-visible:ring-[#00B4F6]" 
                        placeholder="••••••••" 
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 p-1"
                    >
                        {showPassword ? <Eye size={20}/> : <EyeOff size={20}/>}
                    </button>
                </div>
            </div>

            {/* Submit Button */}
            <Button 
                onClick={handleRegister} 
                className="w-full h-14 text-lg rounded-xl bg-[#00B4F6] hover:bg-[#009bd1] text-white font-bold shadow-lg shadow-blue-200 mt-6 active:scale-95 transition-all"
            >
                ចុះឈ្មោះ (Sign Up)
            </Button>

            <p className="text-center text-sm text-gray-500 pt-2 font-medium">
                មានគណនីរួចហើយ? <Link to="/login" className="text-[#00B4F6] font-bold hover:underline ml-1">ចូលប្រើ (Sign In)</Link>
            </p>

            </div>
        </div>
      </div>
    </div>
  );
}