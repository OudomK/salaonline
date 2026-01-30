import React from "react";
import { Search, Bell, SlidersHorizontal, Star, PlayCircle, BookOpen, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 🟢 IMPORT SHADCN COMPONENTS
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// --- MOCK DATA ---
import { bannerImage } from "../../data/homeData";
import logo from "../../assets/logo.jpg";
import { useCourseHome } from "@/hooks/api";
import CourseCard from "@/components/ui/course-card";

export default function Home() {
    const navigate = useNavigate();

    const { data: courseHome } = useCourseHome()
    console.log(courseHome)

    // Mock User Status
    const userStatus = { isTested: true };

    const handleCourseClick = (courseId) => {
        if (userStatus.isTested) {
            navigate(`/course-detail/${courseId}`);
        } else {
            // ប្រើ Shadcn logic ឬ Alert ធម្មតាក៏បាន
            const confirm = window.confirm("សូមធ្វើតេស្តសមត្ថភាពជាមុនសិន ដើម្បីចូលរៀន!");
            if (confirm) navigate("/placement-test");
        }
    };


    return (
        <div className="min-h-screen bg-slate-50/50 pb-24 md:pb-10 font-khmer-os-battambang">

            {/* =========================================
          1. MOBILE HEADER (Show only on Mobile)
         ========================================= */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 md:hidden">
                <div className="px-4 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-blue-100 cursor-pointer">
                            <AvatarImage src={logo} alt="Logo" />
                            <AvatarFallback>SO</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-sm font-bold text-gray-800 leading-none">សួស្តី, ពិសិដ្ឋ 👋</h1>
                            <p className="text-[10px] text-gray-500 font-medium">តោះ! រៀនអ្វីថ្មីថ្ងៃនេះ?</p>
                        </div>
                    </div>

                    <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-gray-100">
                        <Bell size={22} className="text-gray-600" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </Button>
                </div>
            </div>

            {/* =========================================
          MAIN CONTENT CONTAINER
         ========================================= */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

                {/* 2. SEARCH BAR (Mobile View) */}
                {/* នៅ Desktop វាមាននៅ Navbar ធំហើយ ចឹងយើងលាក់វា */}
                <div className="flex gap-3 md:hidden">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            placeholder="ស្វែងរកមេរៀន..."
                            className="pl-10 bg-white border-gray-200 shadow-sm h-12 rounded-xl focus-visible:ring-[#00B4F6]"
                        />
                    </div>
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-gray-200 shadow-sm">
                        <SlidersHorizontal size={20} className="text-gray-600" />
                    </Button>
                </div>

                {/* 3. HERO BANNER (Modern Card) */}
                <div className="relative w-full h-48 md:h-[350px] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-xl shadow-blue-100 group cursor-pointer">
                    <img
                        src={bannerImage}
                        alt="Banner"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 md:p-10 flex flex-col justify-end">
                        <Badge className="w-fit bg-[#00B4F6] hover:bg-[#009bd1] text-white border-0 mb-3 px-3 py-1 text-xs md:text-sm">
                            ព្រឹត្តិការណ៍ថ្មី
                        </Badge>
                        <h2 className="text-white font-bold text-xl md:text-4xl mb-2 leading-tight">Outing Class 2029</h2>
                        <p className="text-white/80 text-sm md:text-lg line-clamp-2 max-w-2xl">
                            ចូលរួមកម្មវិធីសិក្សាក្រៅសាលា ដើម្បីស្វែងយល់ពីធម្មជាតិ និងការងារជាក្រុម។
                        </p>
                    </div>
                </div>

                {/* 4. DYNAMIC CATEGORY SECTIONS */}
                {courseHome?.data?.map((category) => (
                    category.courses && category.courses.length > 0 && (
                        <div key={category.id}>
                            <div className="flex justify-between items-end mb-5">
                                <div>
                                    <h3 className="font-bold text-lg md:text-2xl text-gray-800">{category.name}</h3>
                                    <p className="text-gray-500 text-xs md:text-sm mt-1 hidden md:block">{category.description}</p>
                                </div>
                                <Button variant="link" className="text-[#00B4F6] font-bold p-0 h-auto gap-1">
                                    មើលទាំងអស់ <ChevronRight size={16} />
                                </Button>
                            </div>

                            {/* Responsive Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {category.courses.map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        course={{ ...course, category: { name: category.name } }}
                                        handleCourseClick={() => handleCourseClick(course.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                ))}

                {/* 6. EXTRA SECTION: My Progress (Optional - Makes it look like an App) */}
                <div className="md:hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[24px] p-6 text-white shadow-lg shadow-indigo-200">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="font-bold text-lg">ការសិក្សារបស់ខ្ញុំ</h3>
                                <p className="text-indigo-100 text-xs">អ្នកមាន 2 មេរៀនដែលមិនទាន់ចប់</p>
                            </div>
                            <div className="bg-white/20 p-2 rounded-xl">
                                <BookOpen size={24} />
                            </div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-indigo-600 font-bold shrink-0">
                                65%
                            </div>
                            <div>
                                <p className="text-sm font-bold truncate">English Level 1: Grammar</p>
                                <p className="text-[10px] text-indigo-100">Lesson 4: Past Tense</p>
                            </div>
                            <Button size="sm" variant="secondary" className="ml-auto h-8 text-xs font-bold text-indigo-600">
                                បន្ត
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}