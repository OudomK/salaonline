import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import logo from "../../assets/logo.jpg"; 

export default function LoginAdmin() {
  const navigate = useNavigate();
  
  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      if (email === "admin@school.com" && password === "admin123") {
        localStorage.setItem("adminToken", "fake-jwt-token-123");
        localStorage.setItem("userRole", "admin");
        navigate("/admin/dashboard");
      } else {
        setError("អ៊ីមែល ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ!");
        setIsLoading(false);
      }
    }, 1500);
  };

  // 🟢 CSS Class សម្រាប់ដោះស្រាយបញ្ហា Autofill Background
  // វាប្រើ Shadow ពណ៌ស បាំងពីក្នុង ដើម្បីកុំឱ្យ Browser ប្តូរពណ៌ Background
  const inputBaseClass = "block w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:border-[#00B4F6] outline-none transition-all font-bold text-gray-700 placeholder-transparent shadow-[0_0_0_30px_white_inset] supports-[-webkit-touch-callout:none]:bg-white";

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      
      <div className="bg-white w-full max-w-[400px] rounded-[32px] shadow-xl overflow-hidden animate-fade-in-up border border-gray-100">
        
        {/* Header */}
        <div className="pt-10 pb-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
             <img src={logo} alt="Logo" className="w-14 h-14 object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-[#00B4F6] font-khmer-os-battambang">
            សាលា ONLINE
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2 text-gray-400">
             <ShieldCheck size={14} />
             <p className="text-xs font-medium font-khmer-os-battambang">Admin Portal</p>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 pb-10">
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium animate-pulse">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* --- Email Input --- */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
                 <Mail size={22} className="text-gray-400 group-focus-within:text-[#00B4F6] transition-colors" />
              </div>
              
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // 🟢 ប្រើ class ថ្មីដែលមាន fix autofill
                className={inputBaseClass}
                placeholder="email"
                id="email"
              />

              {/* Label (កាត់ Border) */}
              <label 
                htmlFor="email"
                // 🟢 ប្រើ -top-2.5 ដើម្បីឱ្យចំកណ្តាល Border 2px ជាងមុន
                className="absolute -top-2.5 left-10 bg-white px-2 text-sm font-bold text-[#00B4F6] transition-all z-30 font-khmer-os-battambang leading-none"
              >
                អ៊ីមែល (Email)
              </label>
            </div>


            {/* --- Password Input --- */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
                 <Lock size={22} className="text-gray-400 group-focus-within:text-[#00B4F6] transition-colors" />
              </div>

              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // 🟢 ប្រើ class ថ្មីដែលមាន fix autofill
                className={inputBaseClass}
                placeholder="password"
                id="password"
              />

              {/* Label (កាត់ Border) */}
              <label 
                htmlFor="password"
                // 🟢 ប្រើ -top-2.5
                className="absolute -top-2.5 left-10 bg-white px-2 text-sm font-bold text-[#00B4F6] transition-all z-30 font-khmer-os-battambang leading-none"
              >
                ពាក្យសម្ងាត់ (Password)
              </label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer z-20"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end pt-1">
              <a href="#" className="text-sm font-bold text-[#00B4F6] hover:text-blue-500 font-khmer-os-battambang">
                ភ្លេចពាក្យសម្ងាត់?
              </a>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-blue-200 text-lg font-bold text-white bg-[#00B4F6] hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-95 font-khmer-os-battambang ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "កំពុងចូល..." : "ចូលប្រើប្រាស់ (Login)"}
            </button>
          </form>
        </div>

        <div className="bg-[#FAFAFA] px-8 py-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 font-khmer-os-battambang">
             Admin Portal &copy; 2026 Sala Online System
          </p>
        </div>
      </div>
    </div>
  );
}   