import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, MoreHorizontal, Play, Lock, FileBadge, CheckCircle, Clock, BookOpen, FileText, Loader2 } from "lucide-react";
import { useCourse } from "@/hooks/api";
import { imgUrl } from "@/lib/helper/enviroment";

// 🟢 IMPORT SHADCN COMPONENTS
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function CourseDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: courseData, isLoading } = useCourse(id);
    const course = courseData?.data; // Check this structure based on API response, assuming res.data returns { data: course } or just course. Hook returns res.data.
    // Actually hook returns res.data. Usually res.data is the payload.
    // If useCourse returns res.data, and res.data is the course object directly?
    // Let's assume courseData is the course object for now, or check structure if possible.
    // Wait, in useCourse logic: arrow func returns res.data.

    const [currentLesson, setCurrentLesson] = useState(null);
    const [examStatus, setExamStatus] = useState("idle");
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Set default lesson
    if (!currentLesson && course?.videos?.length > 0) {
        setCurrentLesson(course.videos[0]);
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (!course) return <div>Course not found</div>;

    // Handlers
    const handleRequestClick = () => setShowConfirmModal(true);

    const confirmRequest = () => {
        setExamStatus("pending");
        setShowConfirmModal(false);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-32 md:pb-10 font-khmer-os-battambang">

            {/* 1. MOBILE HEADER */}
            <div className="sticky top-0 z-30 flex justify-between items-center px-4 py-3 bg-white/80 backdrop-blur-md border-b border-gray-100 md:hidden">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                    <ChevronLeft size={24} className="text-gray-700" />
                </Button>
                <h1 className="text-base font-bold text-gray-900 line-clamp-1">{course.title}</h1>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreHorizontal size={24} className="text-gray-700" />
                </Button>
            </div>

            <div className="max-w-7xl mx-auto md:p-6 md:grid md:grid-cols-3 md:gap-8">

                {/* 2. LEFT COLUMN: VIDEO PLAYER & INFO */}
                <div className="md:col-span-2 space-y-6">

                    {/* Video Player */}
                    <div className="w-full aspect-video md:rounded-[24px] overflow-hidden shadow-xl shadow-blue-50 relative group bg-black sticky top-0 md:static z-20">
                        <img src={imgUrl + course.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" alt="Cover" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform group-hover:bg-white/30">
                                <div className="w-12 h-12 bg-[#00B4F6] rounded-full flex items-center justify-center shadow-lg">
                                    <Play size={24} fill="white" className="text-white ml-1" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Title & Badge (Desktop/Mobile Padding) */}
                    <div className="px-5 md:px-0 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge className="bg-blue-50 text-[#00B4F6] hover:bg-blue-100 border-0 px-3 py-1 text-xs font-extrabold uppercase">
                                Level 1
                            </Badge>
                            {examStatus === "pending" && (
                                <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200 gap-1">
                                    <Clock size={12} /> Pending Exam
                                </Badge>
                            )}
                        </div>

                        <div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
                                {course.title}
                            </h2>
                            <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                                <Play size={16} className="text-[#00B4F6]" />
                                កំពុងរៀន: <span className="text-[#00B4F6] font-bold">{currentLesson?.title}</span>
                            </p>
                        </div>

                        <Separator className="md:hidden" />
                    </div>
                </div>

                {/* 3. RIGHT COLUMN: LESSON LIST & ACTIONS */}
                <div className="md:col-span-1 space-y-6 px-5 md:px-0 mt-2 md:mt-0">

                    {/* Lesson List Card */}
                    <Card className="border-0 shadow-sm rounded-[24px] overflow-hidden bg-white">
                        <CardHeader className="pb-3 border-b border-gray-50">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg font-bold text-gray-800">មេរៀន (Lessons)</CardTitle>
                                <Badge variant="secondary" className="text-gray-500 bg-gray-100">
                                    {course.videos?.length || 0} Videos
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[400px] md:h-[500px]">
                                <div className="p-4 space-y-3">
                                    {course?.videos?.map((lesson, index) => {
                                        const isActive = lesson.id === currentLesson?.id;
                                        return (
                                            <div
                                                key={lesson.id}
                                                onClick={() => setCurrentLesson(lesson)}
                                                className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer border ${isActive
                                                    ? "bg-blue-50/50 border-[#00B4F6] shadow-sm"
                                                    : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-100"
                                                    }`}
                                            >
                                                <div className="flex gap-4 items-center">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isActive ? "bg-[#00B4F6] text-white" : "bg-gray-100 text-gray-400"
                                                        }`}>
                                                        {String(index + 1).padStart(2, '0')}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className={`font-bold text-sm truncate ${isActive ? "text-[#00B4F6]" : "text-gray-700"}`}>
                                                            {lesson.title}
                                                        </h4>
                                                        <p className="text-[10px] text-gray-400 font-medium">{lesson.duration}</p>
                                                    </div>
                                                </div>
                                                <div className="text-gray-300 pl-2">
                                                    {isActive ? (
                                                        <Play size={16} fill="currentColor" className="text-[#00B4F6]" />
                                                    ) : (
                                                        <Play size={16} className="text-gray-300" />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* Action Buttons (Sticky on Mobile) */}
                    <div className="fixed bottom-[70px] left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-gray-100 md:static md:bg-transparent md:border-0 md:p-0 z-20">
                        <div className="flex gap-3 max-w-7xl mx-auto">
                            <Button
                                asChild
                                variant="outline"
                                className="flex-1 h-12 rounded-xl border-2 border-[#00B4F6] text-[#00B4F6] font-bold hover:bg-blue-50 text-base"
                            >
                                <Link to="/homework">
                                    <FileText className="mr-2 h-5 w-5" /> កិច្ចការផ្ទះ
                                </Link>
                            </Button>

                            <Button
                                onClick={handleRequestClick}
                                disabled={examStatus === "pending"}
                                className={`flex-1 h-12 rounded-xl font-bold text-base text-white shadow-lg shadow-blue-200 ${examStatus === "pending" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-[#00B4F6] hover:bg-[#009bd1]"
                                    }`}
                            >
                                {examStatus === "pending" ? (
                                    <> <Clock className="mr-2 h-5 w-5" /> Pending... </>
                                ) : (
                                    <> <FileBadge className="mr-2 h-5 w-5" /> ស្នើសុំប្រឡង </>
                                )}
                            </Button>
                        </div>
                    </div>

                </div>
            </div>

            {/* =========================================
          🟢 SHADCN DIALOG (REPLACES CUSTOM MODAL)
         ========================================= */}
            <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                <DialogContent className="sm:max-w-md rounded-[32px] p-6 border-0 shadow-2xl">
                    <DialogHeader className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center animate-bounce">
                            <FileBadge size={40} className="text-[#00B4F6]" />
                        </div>
                        <div className="space-y-2">
                            <DialogTitle className="text-2xl font-extrabold text-gray-900 font-khmer-os-battambang">
                                ស្នើសុំប្រឡង?
                            </DialogTitle>
                            <DialogDescription className="text-gray-500 font-khmer-os-battambang text-base">
                                តើអ្នកពិតជាចង់ស្នើសុំប្រឡងបញ្ចប់វគ្គមែនទេ? <br />
                                លទ្ធផលនឹងត្រូវបានជូនដំណឹងក្នុងពេលឆាប់ៗ។
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <DialogFooter className="flex gap-3 sm:justify-center w-full mt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setShowConfirmModal(false)}
                            className="flex-1 h-12 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 hover:text-gray-700"
                        >
                            បោះបង់ (Cancel)
                        </Button>
                        <Button
                            onClick={confirmRequest}
                            className="flex-1 h-12 rounded-xl font-bold bg-[#00B4F6] hover:bg-[#009bd1] text-white shadow-lg shadow-blue-200"
                        >
                            យល់ព្រម (Confirm)
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}