import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, PlayCircle, CheckCircle, Clock } from "lucide-react";

export default function MyLearning() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inprogress"); // 'inprogress' or 'completed'

  // Mock Data (ពេលមាន Backend យើងនឹងទាញពី API)
  const historyData = {
    inprogress: [
      {
        id: 1,
        title: "English for Beginners: Level 1",
        image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800",
        progress: 65, // ភាគរយដែលបានរៀន
        lastLesson: "Introduction to Grammar",
        totalLessons: 12,
        completedLessons: 8
      },
      {
        id: 2,
        title: "Basic Mathematics Grade 12",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
        progress: 30,
        lastLesson: "Calculus Part 1",
        totalLessons: 20,
        completedLessons: 6
      }
    ],
    completed: [
      {
        id: 3,
        title: "Introduction to History",
        image: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&q=80&w=800",
        completedDate: "20 Jan 2026",
        score: "95/100"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24 md:pb-12">
      
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 px-5 py-4 shadow-sm flex items-center gap-3 md:rounded-b-[32px] md:mx-4 md:mt-4 md:shadow-md">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition">
           <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">My Learning</h1>
      </div>

      {/* Tabs */}
      <div className="px-5 mt-6 md:px-0 md:max-w-4xl md:mx-auto">
        <div className="bg-white p-1.5 rounded-2xl flex shadow-sm border border-gray-100">
           <button 
             onClick={() => setActiveTab("inprogress")}
             className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === "inprogress" ? "bg-[#00B4F6] text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
             }`}
           >
             In Progress
           </button>
           <button 
             onClick={() => setActiveTab("completed")}
             className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === "completed" ? "bg-[#00B4F6] text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
             }`}
           >
             Completed
           </button>
        </div>
      </div>

      {/* Content List */}
      <div className="px-5 mt-6 space-y-4 md:px-0 md:max-w-4xl md:mx-auto md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
         
         {/* IN PROGRESS LIST */}
         {activeTab === "inprogress" && historyData.inprogress.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition group cursor-pointer" onClick={() => navigate('/course-detail')}>
               <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative">
                     <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition">
                        <PlayCircle size={32} className="text-white drop-shadow-md" />
                     </div>
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                     <div>
                        <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight">{item.title}</h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                           <Clock size={12} /> Last: {item.lastLesson}
                        </p>
                     </div>
                     
                     {/* Progress Bar */}
                     <div className="mt-2">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                           <span>{item.progress}%</span>
                           <span>{item.completedLessons}/{item.totalLessons}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-[#00B4F6] rounded-full" style={{ width: `${item.progress}%` }}></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         ))}

         {/* COMPLETED LIST */}
         {activeTab === "completed" && historyData.completed.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex gap-4 items-center">
               <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 grayscale opacity-80">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
               </div>
               <div className="flex-1">
                  <h3 className="font-bold text-gray-900 line-clamp-2">{item.title}</h3>
                  <div className="mt-2 flex items-center gap-3">
                     <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                        <CheckCircle size={12} /> Finished
                     </span>
                     <span className="text-xs text-gray-500 font-bold">Score: {item.score}</span>
                  </div>
               </div>
            </div>
         ))}

         {/* Empty State (បើអត់មានអីសោះ) */}
         {((activeTab === "inprogress" && historyData.inprogress.length === 0) || 
           (activeTab === "completed" && historyData.completed.length === 0)) && (
            <div className="text-center py-20 col-span-2">
               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={32} className="text-gray-400" />
               </div>
               <p className="text-gray-500 font-medium">No courses found.</p>
               <button onClick={() => navigate('/home')} className="mt-4 text-[#00B4F6] font-bold hover:underline">Start Learning</button>
            </div>
         )}

      </div>
    </div>
  );
}