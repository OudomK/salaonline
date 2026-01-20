import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, MoreHorizontal, Play, Lock, FileBadge, CheckCircle, Clock, AlertCircle, X } from "lucide-react"; 
import { courseDetail } from "../data/courseData";

export default function CourseDetail() {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(courseDetail.lessons[0]);
  const [examStatus, setExamStatus] = useState("idle"); 
  
  // State សម្រាប់បើក/បិទ Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 1. ពេលចុចប៊ូតុង Request -> គ្រាន់តែបើក Modal
  const handleRequestClick = () => {
    setShowConfirmModal(true);
  };

  // 2. ពេលចុច Confirm ក្នុង Modal -> ទើបប្តូរ Status
  const confirmRequest = () => {
    setExamStatus("pending");
    setShowConfirmModal(false); // បិទ Modal វិញ
    // អាចដាក់ Toast Notification ស្អាតៗនៅទីនេះជំនួស alert
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-48 md:pb-8 relative"> 
      
      {/* --- CUSTOM CONFIRMATION MODAL (Professional) --- */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Background Overlay (Blur) */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={() => setShowConfirmModal(false)} // ចុចខាងក្រៅដើម្បីបិទ
            ></div>

            {/* Modal Content */}
            <div className="bg-white rounded-[32px] p-6 w-full max-w-sm shadow-2xl relative z-10 animate-[scale-in_0.2s_ease-out]">
                <button 
                    onClick={() => setShowConfirmModal(false)}
                    className="absolute top-4 right-4 p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-400"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <FileBadge size={40} className="text-[#00B4F6]" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">ស្នើសុំប្រឡង?</h3>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        តើអ្នកពិតជាចង់ស្នើសុំប្រឡងបញ្ចប់វគ្គមែនទេ? <br/>
                        លទ្ធផលនឹងត្រូវបានជូនដំណឹងក្នុងពេលឆាប់ៗ។
                    </p>

                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setShowConfirmModal(false)}
                            className="flex-1 py-3.5 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmRequest}
                            className="flex-1 py-3.5 rounded-2xl font-bold text-white bg-[#00B4F6] hover:bg-blue-500 shadow-lg shadow-blue-200 transition active:scale-95"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* ... (Mobile Header and Content ខាងក្រោមនៅដដែល) ... */}
      
      <div className="sticky top-0 z-30 flex justify-between items-center px-5 py-4 bg-white/90 backdrop-blur-md border-b border-gray-100 md:hidden">
        <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 bg-gray-50 rounded-full border border-gray-100 active:bg-gray-200 transition"
        >
          <ChevronLeft size={22} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 tracking-tight">Course Details</h1>
        <button className="p-2.5 bg-gray-50 rounded-full border border-gray-100 active:bg-gray-200 transition">
          <MoreHorizontal size={22} className="text-gray-700" />
        </button>
      </div>

      <div className="md:flex md:gap-8 md:p-6 md:max-w-6xl md:mx-auto">
          
          <div className="md:flex-1">
             <div className="px-5 mt-4 md:px-0 md:mt-0">
                <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-xl shadow-blue-100 relative group bg-black">
                    <img src={courseDetail.coverImage} className="w-full h-full object-cover opacity-90" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-[#00B4F6]/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl animate-pulse cursor-pointer hover:scale-110 transition-transform">
                            <Play size={32} fill="white" className="text-white ml-1" />
                        </div>
                    </div>
                </div>

                <div className="mt-5 space-y-2">
                    <div className="flex justify-between items-start">
                        <span className="inline-block px-3 py-1 bg-blue-50 text-[#00B4F6] text-xs font-extrabold rounded-lg uppercase tracking-wider">
                            Level 1
                        </span>
                        
                        {examStatus === "pending" && (
                            <span className="flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-600 text-xs font-bold rounded-lg border border-yellow-100">
                                <Clock size={12} /> Pending Exam
                            </span>
                        )}
                    </div>
                    
                    <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">{courseDetail.title}</h2>
                    <p className="text-gray-500 text-sm font-medium">
                        Now Playing: <span className="text-[#00B4F6]">{currentLesson.title}</span>
                    </p>
                </div>
             </div>
          </div>

          <div className="md:w-96 mt-8 md:mt-0">
            <div className="px-5 md:px-0">
                <div className="flex justify-between items-end mb-4">
                    <h3 className="font-bold text-lg text-gray-900">Lessons</h3>
                    <span className="text-xs text-gray-400 font-medium bg-white px-2 py-1 rounded-md border border-gray-100">
                        {courseDetail.lessons.length} Videos
                    </span>
                </div>
                
                <div className="space-y-3">
                {courseDetail.lessons.map((lesson, index) => {
                    const isActive = lesson.id === currentLesson.id;
                    return (
                        <div 
                            key={lesson.id} 
                            onClick={() => !lesson.isLocked && setCurrentLesson(lesson)}
                            className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer border ${
                                isActive ? "bg-white border-[#00B4F6] shadow-md shadow-blue-50 scale-[1.02]" : "bg-white border-gray-100 hover:border-blue-200"
                            }`}
                        >
                            <div className="flex gap-4 items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isActive ? "bg-[#00B4F6] text-white" : "bg-gray-50 text-gray-400"}`}>
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                                <div>
                                    <h4 className={`font-bold text-sm ${isActive ? "text-[#00B4F6]" : (lesson.isLocked ? "text-gray-400" : "text-gray-800")}`}>
                                        {lesson.title}
                                    </h4>
                                    <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{lesson.duration}</p>
                                </div>
                            </div>
                            <div className="text-gray-300">
                                {lesson.isLocked ? <Lock size={18} /> : isActive ? (
                                    <div className="flex gap-0.5 items-end h-4">
                                        <div className="w-1 bg-[#00B4F6] animate-[bounce_1s_infinite] h-2"></div>
                                        <div className="w-1 bg-[#00B4F6] animate-[bounce_1.2s_infinite] h-4"></div>
                                        <div className="w-1 bg-[#00B4F6] animate-[bounce_0.8s_infinite] h-3"></div>
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#00B4F6]">
                                        <Play size={14} fill="currentColor" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="fixed bottom-[80px] left-0 w-full px-5 z-20 md:static md:bg-transparent md:border-none md:p-0 md:mt-6">
                <div className="flex gap-3">
                    <Link to="/homework" className="flex-1">
                        <button className="w-full bg-white border-2 border-[#00B4F6] text-[#00B4F6] font-bold py-3.5 rounded-2xl hover:bg-blue-50 transition active:scale-95 flex items-center justify-center gap-2 shadow-sm">
                            <span>Homework</span>
                        </button>
                    </Link>

                    <button 
                        onClick={handleRequestClick} // ហៅ Modal ជំនួស window.confirm
                        disabled={examStatus === "pending"}
                        className={`flex-1 font-bold py-3.5 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-white
                            ${examStatus === "pending" 
                                ? "bg-yellow-500 cursor-not-allowed" 
                                : "bg-[#00B4F6] hover:bg-blue-500 shadow-blue-200"
                            }
                        `}
                    >
                        {examStatus === "pending" ? (
                            <>
                                <Clock size={20} />
                                <span>Pending...</span>
                            </>
                        ) : (
                            <>
                                <FileBadge size={20} />
                                <span>Request Exam</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
          </div>
      </div>

    </div>
  );
}