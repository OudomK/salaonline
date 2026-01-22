import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { useLogin } from "@/hooks/api"
import logo from "../../assets/logo.jpg"

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")

  const login = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault()
    login.mutate(
      { phone_number: phoneNumber, password },
      {
        onSuccess: () => {
          navigate("/")
        },
      }
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-sm border border-gray-100">

        <div className="text-center mb-10">
          <img src={logo} alt="Logo" className="w-20 h-20 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-[#1E3A8A]">សាលា ONLINE</h1>
          <p className="text-gray-500 mt-1">ចុះឈ្មោះចូលរៀន</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {login.error && (
            <div className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
              <AlertCircle size={18} />
              {login.error.response?.data?.message || "លេខទូរស័ព្ទ ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ!"}
            </div>
          )}

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
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full outline-none text-gray-800 font-bold placeholder-gray-400 h-full bg-transparent text-lg tracking-wide"
              />
            </div>
          </div>

          <div className="relative group">
            <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs font-bold text-[#00B4F6] z-10">
              ពាក្យសម្ងាត់ (Password)
            </label>
            <div className="flex items-center w-full border border-gray-300 rounded-2xl px-4 py-3.5 focus-within:border-[#00B4F6] focus-within:ring-1 focus-within:ring-[#00B4F6] transition-all bg-white">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
            <Link to="/forgot-password" className="text-[#00B4F6] text-sm font-bold hover:underline">
              ភ្លេចពាក្យសម្ងាត់?
            </Link>
          </div>

          <button
            type="submit"
            disabled={login.isPending}
            className={`w-full bg-[#00B4F6] text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-500 transition-all active:scale-95 ${
              login.isPending ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {login.isPending ? "កំពុងចូល..." : "ចូលប្រើ (Sign In)"}
          </button>

          <p className="text-center text-gray-500 text-sm">
            មិនទាន់មានគណនី? <Link to="/register" className="text-[#00B4F6] font-bold hover:underline">ចុះឈ្មោះ (Sign Up)</Link>
          </p>

        </form>
      </div>
    </div>
  )
}
