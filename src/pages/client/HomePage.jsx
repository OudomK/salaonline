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
import { categories, recommendedCourses, bannerImage } from "../../data/homeData";
import logo from "../../assets/logo.jpg";
import { useCourse, useCourses } from "@/hooks/api";

export default function Home() {
    const navigate = useNavigate();

    // Mock User Status
    const userStatus = { isTested: true };

    const handleCourseClick = () => {
        if (userStatus.isTested) {
            navigate("/course-detail");
        } else {
            // ប្រើ Shadcn logic ឬ Alert ធម្មតាក៏បាន
            const confirm = window.confirm("សូមធ្វើតេស្តសមត្ថភាពជាមុនសិន ដើម្បីចូលរៀន!");
            if (confirm) navigate("/placement-test");
        }
    };

    const { data: coursesList } = useCourses()
    console.log(coursesList)

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

                {/* 4. CATEGORIES (Horizontal Scroll) */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg md:text-xl text-gray-800">ប្រធានបទ (Topics)</h3>
                    </div>

                    {/* Shadcn ScrollArea សម្រាប់ Mobile Scroll រលូន */}
                    <ScrollArea className="w-full whitespace-nowrap pb-4">
                        <div className="flex gap-3">
                            {categories.map((cat, index) => (
                                <Button
                                    key={cat.id}
                                    variant={index === 0 ? "default" : "outline"}
                                    className={`rounded-full px-6 h-10 font-bold transition-all ${index === 0
                                        ? "bg-[#00B4F6] hover:bg-[#009bd1] text-white shadow-md shadow-blue-200 border-0"
                                        : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#00B4F6] hover:border-blue-200"
                                        }`}
                                >
                                    {cat.name}
                                </Button>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" className="invisible" />
                    </ScrollArea>
                </div>

                {/* 5. RECOMMENDED COURSES (Grid System) */}
                <div>
                    <div className="flex justify-between items-end mb-5">
                        <div>
                            <h3 className="font-bold text-lg md:text-2xl text-gray-800">វគ្គសិក្សាពេញនិយម</h3>
                            <p className="text-gray-500 text-xs md:text-sm mt-1 hidden md:block">ជ្រើសរើសវគ្គសិក្សាដែលល្អបំផុតសម្រាប់អ្នក</p>
                        </div>
                        <Button variant="link" className="text-[#00B4F6] font-bold p-0 h-auto gap-1">
                            មើលទាំងអស់ <ChevronRight size={16} />
                        </Button>
                    </div>

                    {/* Responsive Grid: Mobile=1col/scroll, Tablet=2col, Desktop=4col */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {coursesList?.data?.map((course) => (
                            <Card
                                key={course?.id}
                                onClick={handleCourseClick}
                                className="group border-0 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[24px] overflow-hidden cursor-pointer bg-white"
                            >
                                {/* Image Section */}
                                <div className="relative h-48 w-full overflow-hidden">
                                    <img
                                        src={course?.thumbnail}
                                        alt={course?.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Overlay Play Icon on Hover */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                                            <PlayCircle className="text-white fill-white/20" size={32} />
                                        </div>
                                    </div>

                                    {/* Price / Category Badge */}
                                    <div className="absolute top-3 left-3">
                                        <Badge className="bg-white/90 text-gray-800 hover:bg-white backdrop-blur-sm shadow-sm border-0 font-bold uppercase">
                                            {course?.category?.name || "General"}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-1 text-orange-400 text-xs font-bold bg-orange-50 px-2 py-1 rounded-lg">
                                            <Star size={12} fill="currentColor" /> 4.8
                                        </div>
                                        <span className="text-[#00B4F6] font-extrabold text-lg">$25.00</span>
                                    </div>

                                    <h4 className="font-bold text-gray-800 text-base md:text-lg line-clamp-1 mb-3 group-hover:text-[#00B4F6] transition-colors">
                                        {course?.title}
                                    </h4>

                                    {/* Instructor Info */}
                                    <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                                        <Avatar className="h-8 w-8 border border-gray-100">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course?.teacher_name}`} />
                                            <AvatarFallback>IN</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 font-medium uppercase">បង្រៀនដោយ</span>
                                            <span className="text-xs font-bold text-gray-700">{course?.teacher_name}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

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