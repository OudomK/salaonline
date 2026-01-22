import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ShieldCheck, Loader2 } from "lucide-react";

// Shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function OtpVerification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60); // 60 seconds countdown

  // Timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = () => {
    if (otp.length < 4) return;

    setIsLoading(true);
    
    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      // 🟢 ជោគជ័យ -> Auto Login -> ទៅ Home
      navigate("/home"); 
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 font-khmer-os-battambang">
      
      <Card className="w-full max-w-md rounded-[32px] p-8 shadow-xl border-gray-100 bg-white relative">
        
        {/* Back Button */}
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)} 
            className="absolute left-4 top-4 rounded-full hover:bg-gray-50"
        >
            <ChevronLeft size={28} className="text-gray-600" />
        </Button>

        <div className="flex flex-col items-center text-center mt-4">
            
            {/* Icon */}
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <ShieldCheck size={40} className="text-[#00B4F6]" />
            </div>

            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">ផ្ទៀងផ្ទាត់លេខទូរស័ព្ទ</h1>
            <p className="text-gray-500 text-sm mb-8">
                យើងបានផ្ញើលេខកូដ 6 ខ្ទង់ទៅកាន់លេខ <br/>
                <span className="font-bold text-gray-800">+855 12 345 678</span>
            </p>

            {/* OTP Input */}
            <div className="w-full space-y-6">
                <Input 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="text-center text-3xl font-bold tracking-[1em] h-16 rounded-2xl border-gray-200 focus-visible:ring-[#00B4F6] text-gray-800" 
                    maxLength={6}
                    placeholder="••••••"
                />

                <Button 
                    onClick={handleVerify} 
                    disabled={isLoading || otp.length < 4}
                    className="w-full h-14 text-lg rounded-2xl bg-[#00B4F6] hover:bg-[#009bd1] text-white font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : "ផ្ទៀងផ្ទាត់ (Verify)"}
                </Button>
            </div>

            {/* Resend Timer */}
            <div className="mt-8 text-sm text-gray-500">
                មិនទទួលបានលេខកូដ?{" "}
                {timer > 0 ? (
                    <span className="text-orange-500 font-bold">រង់ចាំ {timer}s</span>
                ) : (
                    <button 
                        onClick={() => setTimer(60)} 
                        className="text-[#00B4F6] font-bold hover:underline"
                    >
                        ផ្ញើម្ដងទៀត (Resend)
                    </button>
                )}
            </div>

        </div>
      </Card>
    </div>
  );
}