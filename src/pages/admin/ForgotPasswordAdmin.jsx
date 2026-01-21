import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, ShieldCheck } from "lucide-react";
import logo from "../../assets/logo.jpg"; 

export default function ForgotPasswordAdmin() {
  const navigate = useNavigate();
  
  // States
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false); // សម្រាប់បង្ហាញផ្ទាំងជោគជ័យ
  const [error, setError] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // --- Mock API Logic ---
    setTimeout(() => {
      // ឧទាហរណ៍៖ ឆែកមើល Format អ៊ីមែល
      if (email.includes("@") && email.includes(".")) {
        setIsSent(true); // បង្ហាញផ្ទាំង Success
      } else {
        setError("សូមបញ្ចូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ!");
        setIsLoading(false);
      }
    }, 1500);
  };

  // 🟢 CSS Class សម្រាប់ Input (ដូច Login ដែរ)
  const inputBaseClass = "block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-[#00B4F6] outline-none transition-all font-bold text-gray-700 placeholder-transparent shadow-[0_0_0_30px_white_inset] supports-[-webkit-touch-callout:none]:bg-white";

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      
      <div className="bg-white w-full max-w-[400px] rounded-[32px] shadow-xl overflow-hidden animate-fade-in-up border border-gray-100">
        
        {/* Header (Logo) */}
        <div className="pt-10 pb-6 text-center">
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

        {/* Content Section */}
        <div className="px-8 pb-10">
          
          {/* 1. ករណីផ្ញើជោគជ័យ (Success View) */}
          {isSent ? (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 font-khmer-os-battambang mb-2">
                   បានផ្ញើជោគជ័យ!
                </h3>
                <p className="text-sm text-gray-500 font-khmer-os-battambang leading-relaxed">
                   យើងបានផ្ញើតំណភ្ជាប់សម្រាប់ប្តូរពាក្យសម្ងាត់ទៅកាន់អ៊ីមែល <b>{email}</b> រួចរាល់ហើយ។
                </p>
              </div>
              
              <Link to="/admin/login">
                <button className="w-full py-4 rounded-2xl font-bold text-[#00B4F6] bg-blue-50 hover:bg-blue-100 transition-colors font-khmer-os-battambang">
                   ត្រឡប់ទៅការចូលប្រើប្រាស់
                </button>
              </Link>
            </div>
          ) : (
            
            /* 2. ករណីបំពេញ Form (Form View) */
            <form onSubmit={handleReset} className="space-y-6">
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 font-khmer-os-battambang mb-2">
                  ភ្លេចពាក្យសម្ងាត់?
                </h3>
                <p className="text-xs text-gray-400 font-khmer-os-battambang">
                  បញ្ចូលអ៊ីមែលរបស់អ្នកដើម្បីទទួលបានតំណភ្ជាប់
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium animate-pulse">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              {/* --- Email Input (Floating Label) --- */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
                   <Mail size={22} className="text-gray-400 group-focus-within:text-[#00B4F6] transition-colors" />
                </div>
                
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputBaseClass} // ប្រើ Class ដូច Login
                  placeholder="email"
                  id="reset-email"
                />

                <label 
                  htmlFor="reset-email"
                  className="absolute -top-2.5 left-10 bg-white px-2 text-sm font-bold text-[#00B4F6] transition-all z-30 font-khmer-os-battambang leading-none"
                >
                  អ៊ីមែល (Email)
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-blue-200 text-lg font-bold text-white bg-[#00B4F6] hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-95 font-khmer-os-battambang ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "កំពុងដំណើរការ..." : "ស្នើសុំតំណភ្ជាប់ (Send Link)"}
              </button>

              {/* Back to Login */}
              <div className="text-center pt-2">
                <Link 
                  to="/admin/login" 
                  className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#00B4F6] transition-colors font-khmer-os-battambang"
                >
                  <ArrowLeft size={16} />
                  ត្រឡប់ក្រោយ (Back to Login)
                </Link>
              </div>

            </form>
          )}

        </div>

        {/* Footer */}
        <div className="bg-[#FAFAFA] px-8 py-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 font-khmer-os-battambang">
             Admin Portal &copy; 2026 Sala Online System
          </p>
        </div>
      </div>
    </div>
  );
}