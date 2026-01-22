import React from 'react';
import { Construction, ArrowLeft, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

// ទទួល Props 'title' ដើម្បីដូរឈ្មោះតាម Page នីមួយៗ
export default function ComingSoon({ title = "មុខងារនេះ" }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center font-khmer-os-battambang">
      
      <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-sm border border-gray-100 max-w-md w-full flex flex-col items-center animate-fade-in-up">
        
        {/* Icon Animation Bubble */}
        <div className="relative mb-6">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center relative z-10">
                <Rocket size={48} className="text-orange-500" />
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-orange-200 rounded-full animate-ping opacity-20"></div>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">កំពុងអភិវឌ្ឍ! 🚧</h1>
        
        <p className="text-gray-500 mb-8 leading-relaxed text-sm md:text-base">
           សូមអធ្យាស្រ័យ! ផ្នែក <b>"{title}"</b> នេះគឺស្ថិតនៅក្នុងដំណាក់កាលអភិវឌ្ឍនៅឡើយ។ យើងនឹងដាក់ឱ្យប្រើប្រាស់ក្នុងពេលឆាប់ៗនេះ។
        </p>

        {/* Back Button */}
        <Button 
            onClick={() => navigate(-1)} 
            className="rounded-[16px] bg-gray-900 hover:bg-gray-800 text-white font-bold gap-2 w-full h-12 shadow-lg shadow-gray-200 active:scale-95 transition-all"
        >
            <ArrowLeft size={20} /> ត្រឡប់ក្រោយ (Go Back)
        </Button>
      </div>

      <p className="mt-8 text-xs text-gray-400 font-medium">
        Sala Digital • Version 1.0.0 (MVP)
      </p>

    </div>
  );
}