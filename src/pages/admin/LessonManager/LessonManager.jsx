import React, { useState } from 'react';
import { Search, PlayCircle, BookOpen, Edit, Trash2, Plus, Filter, LayoutGrid, List } from "lucide-react";

// 🟢 IMPORT SHADCN COMPONENTS
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import VideoManagementModal from './components/VideoManagementModal';

// --- MOCK DATA ---
const initialLessons = [
    { id: 1, title: "Lesson 1: Introduction", course: "General English", category: "English", type: "Video", duration: "10:30", views: 450 },
    { id: 2, title: "Lesson 2: Tones & Pinyin", course: "Chinese Basic", category: "Chinese", type: "Video", duration: "15:20", views: 320 },
    { id: 3, title: "Lesson 3: Basic Grammar", course: "General English", category: "English", type: "Video", duration: "12:45", views: 280 },
    { id: 4, title: "Lesson 1: Alphabet", course: "Korean Level 1", category: "Korean", type: "Video", duration: "08:15", views: 600 },
    { id: 5, title: "Lesson 4: Vocabulary", course: "Chinese Basic", category: "Chinese", type: "Video", duration: "20:00", views: 150 },
];

const COURSES = ["All Courses", "General English", "Chinese Basic", "Korean Level 1"];

export default function LessonManager() {
    const [lessons, setLessons] = useState(initialLessons);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("All Courses");
    const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);

    // Filter Logic
    const filteredLessons = lessons.filter(lesson => {
        const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lesson.course.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCourse = selectedCourse === "All Courses" || lesson.course === selectedCourse;
        return matchesSearch && matchesCourse;
    });

    const getCategoryColor = (cat) => {
        if (cat === "English") return "bg-blue-50 text-blue-600 border-blue-100";
        if (cat === "Chinese") return "bg-orange-50 text-orange-600 border-orange-100";
        return "bg-green-50 text-green-600 border-green-100";
    };

    const handleSaveLesson = (lessonData) => {
        if (selectedLesson) {
            // Update existing lesson
            setLessons(lessons.map(l => l.id === selectedLesson.id ? { ...l, ...lessonData } : l));
        } else {
            // Add new lesson
            const newLesson = {
                id: Date.now(),
                ...lessonData,
                views: 0
            };
            setLessons([...lessons, newLesson]);
        }
        setIsModalOpen(false);
        setSelectedLesson(null);
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-20 font-khmer-os-battambang">

            {/* 1. HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">គ្រប់គ្រងមេរៀនសរុប (Global Lesson Manager)</h1>
                    <p className="text-sm text-gray-500 mt-1 font-khmer-os-battambang">គ្រប់គ្រង និងស្វែងរកមេរៀនពីគ្រប់វគ្គសិក្សាទាំងអស់។</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setViewMode('table')} className={viewMode === 'table' ? "bg-gray-100 border-[#00B4F6]" : ""}>
                        <List size={20} className={viewMode === 'table' ? "text-[#00B4F6]" : "text-gray-400"} />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? "bg-gray-100 border-[#00B4F6]" : ""}>
                        <LayoutGrid size={20} className={viewMode === 'grid' ? "text-[#00B4F6]" : "text-gray-400"} />
                    </Button>
                    <Button onClick={() => {
                        setSelectedLesson(null);
                        setIsModalOpen(true);
                    }} className="bg-[#00B4F6] hover:bg-[#00a3df] text-white rounded-xl font-bold shadow-lg shadow-blue-100 gap-2">
                        <Plus size={20} /> បង្កើតមេរៀនថ្មី
                    </Button>
                </div>
            </div>

            {/* 2. FILTERS */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="ស្វែងរកតាមចំណងជើងមេរៀន..."
                        className="pl-10 bg-gray-50 border-gray-200 focus-visible:ring-[#00B4F6] rounded-xl font-khmer-os-battambang"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64">
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-xl font-bold text-gray-700">
                            <div className="flex items-center gap-2">
                                <Filter size={16} className="text-gray-400" />
                                <SelectValue placeholder="Select Course" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-xl border-gray-100 shadow-xl">
                            {COURSES.map(course => (
                                <SelectItem key={course} value={course} className="font-medium">{course}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <VideoManagementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSaveLesson}
                initialData={selectedLesson}
            />

            {/* 3. LESSON LIST (TABLE VIEW) */}
            {viewMode === 'table' ? (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50/80">
                            <TableRow>
                                <TableHead className="font-extrabold text-gray-500 uppercase text-[11px] pl-6 h-12">Lesson Information</TableHead>
                                <TableHead className="font-extrabold text-gray-500 uppercase text-[11px]">Course</TableHead>
                                <TableHead className="font-extrabold text-gray-500 uppercase text-[11px]">Duration</TableHead>
                                <TableHead className="font-extrabold text-gray-500 uppercase text-[11px]">Status</TableHead>
                                <TableHead className="text-center font-extrabold text-gray-500 uppercase text-[11px] h-12">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLessons.map((lesson) => (
                                <TableRow key={lesson.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#00B4F6] transition-transform group-hover:scale-110">
                                                <PlayCircle size={22} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{lesson.title}</p>
                                                <p className="text-[10px] text-gray-400 font-bold">{lesson.views} views • {lesson.type}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold ${getCategoryColor(lesson.category)} underline decoration-dotted underline-offset-4`}>
                                            {lesson.course}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-600 text-sm font-bold truncate">
                                        {lesson.duration}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="bg-green-100 text-green-700 border-0 text-[10px] font-bold">Published</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                onClick={() => {
                                                    setSelectedLesson(lesson);
                                                    setIsModalOpen(true);
                                                }}
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-lg hover:bg-blue-50 hover:text-[#00B4F6]"
                                            >
                                                <Edit size={16} />
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    if (window.confirm("Are you sure?")) {
                                                        setLessons(lessons.filter(l => l.id !== lesson.id));
                                                    }
                                                }}
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-500"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredLessons.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-40 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <BookOpen size={40} className="mb-2 opacity-20" />
                                            <p className="text-sm font-bold">រកមិនឃើញមេរៀនដែលលោកអ្នកកំពុងស្វែងរកទេ</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                /* 4. GRID VIEW */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredLessons.map((lesson) => (
                        <div key={lesson.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                            <div className="aspect-video bg-gray-900 relative flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <PlayCircle size={40} className="text-white relative z-20 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all cursor-pointer" />
                                <div className="absolute top-2 right-2 z-20">
                                    <Badge className="bg-black/50 backdrop-blur-md text-white text-[10px] border-0">{lesson.duration}</Badge>
                                </div>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className="font-bold text-gray-900 line-clamp-2 text-sm leading-snug">{lesson.title}</h4>
                                    <Button
                                        onClick={() => {
                                            setSelectedLesson(lesson);
                                            setIsModalOpen(true);
                                        }}
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 rounded-full shrink-0"
                                    >
                                        <Edit size={14} />
                                    </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                                        <BookOpen size={12} />
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-500">{lesson.course}</span>
                                </div>
                                <div className="pt-2 flex items-center justify-between border-t border-gray-50">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{lesson.views} Students watched</span>
                                    <Badge className="bg-blue-50 text-[#00B4F6] text-[9px] border-0">{lesson.category}</Badge>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
