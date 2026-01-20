import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg"; 

export default function ForgotPassword() {
  return (
    // 1. Container ដូច Login ដែរ (Background ប្រផេះ)
    <div className="min-h-screen w-full bg-[#f3f4f6] flex items-center justify-center p-4">
      
      {/* 2. Card កណ្តាល */}
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <img 
            src={logo} 
            alt="School Logo" 
            className="w-24 h-24 mx-auto mb-4 object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
          <p className="text-gray-500 text-sm mt-2">
            Don't worry! It happens. Please enter the phone number associated with your account.
          </p>
        </div>

        {/* Form Section */}
        <div className="space-y-6">
          
          {/* Phone Input (រចនាប័ទ្មដូច Login) */}
          <div>
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 block">
                លេខទូរស័ព្ទ (Phone Number)
            </label>
            <div className="flex bg-gray-50 rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <div className="bg-gray-100 px-4 py-3 flex items-center border-r border-gray-200">
                <span className="text-lg">🇰🇭</span>
                <span className="text-gray-600 font-medium ml-2">+855</span>
                </div>
                <input 
                type="tel" 
                placeholder="12 345 678" 
                className="w-full bg-transparent px-4 py-3 text-gray-800 font-medium outline-none placeholder-gray-400"
                />
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            {/* Send Code Button */}
            <button className="w-full bg-[#00B4F6] text-white font-bold text-lg py-3.5 rounded-xl shadow-lg hover:bg-blue-500 transition active:scale-95">
              Send OTP Code
            </button>

            {/* Back to Login */}
            <Link 
              to="/login" 
              className="block w-full text-center text-gray-500 font-bold py-3 hover:text-gray-800 transition"
            >
              ← Back to Login
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}