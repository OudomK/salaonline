import { useState } from "react"; // Import useState
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Import Icons
import logo from "../../assets/logo.jpg";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false); // State សម្រាប់បិទបើកភ្នែក

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-sm border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-10">
          <img src={logo} alt="Logo" className="w-20 h-20 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-[#1E3A8A]">សាលា ONLINE</h1>
          <p className="text-gray-500 mt-1">ចុះឈ្មោះចូលរៀន</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
            
            {/* Phone Input (Improved Style) */}
            <div className="relative group">
                <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs font-bold text-[#00B4F6] z-10 transition-colors group-focus-within:text-[#00B4F6]">
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

            {/* Password Input (With Eye Icon) */}
            <div className="relative group">
                <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs font-bold text-[#00B4F6] z-10">
                    ពាក្យសម្ងាត់ (Password)
                </label>
                <div className="flex items-center w-full border border-gray-300 rounded-2xl px-4 py-3.5 focus-within:border-[#00B4F6] focus-within:ring-1 focus-within:ring-[#00B4F6] transition-all bg-white">
                    <input 
                        type={showPassword ? "text" : "password"} // ប្តូរ Type តាម State
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

            <div className="text-right">
                <Link to="/forgot-password" class="text-[#00B4F6] text-sm font-bold hover:underline">
                    ភ្លេចពាក្យសម្ងាត់?
                </Link>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-[#00B4F6] text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-500 transition-all active:scale-95">
                ចូលប្រើ (Sign In)
            </button>
            
            <p className="text-center text-gray-500 text-sm">
                មិនទាន់មានគណនី? <Link to="/register" className="text-[#00B4F6] font-bold hover:underline">ចុះឈ្មោះ (Sign Up)</Link>
            </p>

        </div>
      </div>
    </div>
  );
}