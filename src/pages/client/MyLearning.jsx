import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, PlayCircle, CheckCircle2, Play, BookOpen } from "lucide-react";

// 🟢 IMPORT SHADCN COMPONENTS
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function MyLearning() {
  const navigate = useNavigate();

  // Mock Data
  const historyData = {
    inprogress: [
      {
        id: 1,
        title: "English for Beginners: Level 1",
        image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800",
        progress: 65,
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
    <div className="min-h-screen bg-slate-50/50 pb-24 md:pb-12 font-khmer-os-battambang">
      
      {/* 1. Header (Mobile) */}
      <div className="bg-white sticky top-0 z-10 px-4 py-3 shadow-sm border-b border-gray-100 flex items-center gap-3 md:hidden">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ChevronLeft size={24} className="text-gray-700" />
        </Button>
        <h1 className="text-lg font-bold text-gray-900">ការសិក្សារបស់ខ្ញុំ</h1>
      </div>

      <div className="max-w-4xl mx-auto md:py-8 md:px-4">
        
        {/* Desktop Header */}
        <div className="hidden md:flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-full border-gray-200">
                <ChevronLeft size={24} />
            </Button>
            <div>
                <h1 className="text-2xl font-extrabold text-gray-900">My Learning</h1>
                <p className="text-gray-500 text-sm">តាមដានវឌ្ឍនភាពនៃការសិក្សារបស់អ្នក</p>
            </div>
        </div>

        {/* 2. TABS SECTION */}
        <Tabs defaultValue="inprogress" className="w-full px-4 md:px-0">
            
            <TabsList className="grid w-full grid-cols-2 h-14 bg-white p-1.5 rounded-[20px] shadow-sm border border-gray-100 mb-6">
                <TabsTrigger 
                    value="inprogress" 
                    className="rounded-2xl font-bold text-gray-500 data-[state=active]:bg-[#00B4F6] data-[state=active]:text-white h-full transition-all"
                >
                    កំពុងរៀន (In Progress)
                </TabsTrigger>
                <TabsTrigger 
                    value="completed" 
                    className="rounded-2xl font-bold text-gray-500 data-[state=active]:bg-[#00B4F6] data-[state=active]:text-white h-full transition-all"
                >
                    បញ្ចប់ហើយ (Completed)
                </TabsTrigger>
            </TabsList>

            {/* --- TAB CONTENT: IN PROGRESS --- */}
            <TabsContent value="inprogress" className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 animate-fade-in-up">
                {historyData.inprogress.length > 0 ? (
                    historyData.inprogress.map((item) => (
                        <Card 
                            key={item.id} 
                            onClick={() => navigate('/course-detail')}
                            className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer rounded-[24px] overflow-hidden group bg-white"
                        >
                            <CardContent className="p-4 flex gap-4">
                                {/* Image */}
                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden shrink-0 relative">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayCircle size={32} className="text-white drop-shadow-md" />
                                    </div>
                                </div>
                                
                                {/* Info */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="font-bold text-gray-900 line-clamp-2 text-sm md:text-base leading-tight group-hover:text-[#00B4F6] transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-[10px] md:text-xs text-gray-400 mt-1.5 flex items-center gap-1 font-medium">
                                            <Play size={10} className="fill-gray-400" /> 
                                            <span className="truncate">{item.lastLesson}</span>
                                        </p>
                                    </div>
                                    
                                    {/* Progress */}
                                    <div className="space-y-1.5 mt-2">
                                        <div className="flex justify-between text-[10px] font-bold text-gray-400">
                                            <span className="text-[#00B4F6]">{item.progress}%</span>
                                            <span>{item.completedLessons}/{item.totalLessons}</span>
                                        </div>
                                        <Progress value={item.progress} className="h-1.5 bg-gray-100 [&>div]:bg-[#00B4F6]" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <EmptyState />
                )}
            </TabsContent>

            {/* --- TAB CONTENT: COMPLETED --- */}
            <TabsContent value="completed" className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 animate-fade-in-up">
                {historyData.completed.length > 0 ? (
                    historyData.completed.map((item) => (
                        <Card key={item.id} className="border-0 shadow-sm rounded-[24px] overflow-hidden bg-white">
                            <CardContent className="p-4 flex gap-4 items-center">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 grayscale opacity-70 relative">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-green-500/20"></div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <h3 className="font-bold text-gray-900 line-clamp-2 text-sm">{item.title}</h3>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge className="bg-green-100 text-green-600 hover:bg-green-100 border-0 text-[10px] px-2 py-0.5 gap-1">
                                            <CheckCircle2 size={12} /> បញ្ចប់
                                        </Badge>
                                        <span className="text-[10px] font-bold text-gray-500 border border-gray-100 px-2 py-0.5 rounded-md">
                                            ពិន្ទុ: {item.score}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <EmptyState />
                )}
            </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}

// Helper Component for Empty State
function EmptyState() {
    const navigate = useNavigate();
    return (
        <div className="col-span-2 flex flex-col items-center justify-center py-16 bg-white rounded-[32px] border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <BookOpen size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium text-sm">មិនមានវគ្គសិក្សាទេ (No courses found)</p>
            <Button 
                variant="link" 
                onClick={() => navigate('/home')} 
                className="text-[#00B4F6] font-bold mt-2"
            >
                ស្វែងរកមេរៀន (Start Learning)
            </Button>
        </div>
    );
}