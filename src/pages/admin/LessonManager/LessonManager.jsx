import React, { useState } from "react";
import {
  Search,
  PlayCircle,
  BookOpen,
  Edit,
  Trash2,
  Plus,
  Filter,
  LayoutGrid,
  List,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VideoManagementModal from "./components/VideoManagementModal";

// --- MOCK DATA ---
const initialLessons = [
  {
    id: 1,
    title: "Lesson 1: Introduction",
    course: "General English",
    category: "English",
    type: "Video",
    duration: "10:30",
    views: 450,
  },
  {
    id: 2,
    title: "Lesson 2: Tones & Pinyin",
    course: "Chinese Basic",
    category: "Chinese",
    type: "Video",
    duration: "15:20",
    views: 320,
  },
  {
    id: 3,
    title: "Lesson 3: Basic Grammar",
    course: "General English",
    category: "English",
    type: "Video",
    duration: "12:45",
    views: 280,
  },
  {
    id: 4,
    title: "Lesson 1: Alphabet",
    course: "Korean Level 1",
    category: "Korean",
    type: "Video",
    duration: "08:15",
    views: 600,
  },
  {
    id: 5,
    title: "Lesson 4: Vocabulary",
    course: "Chinese Basic",
    category: "Chinese",
    type: "Video",
    duration: "20:00",
    views: 150,
  },
];

const COURSES = [
  "All Courses",
  "General English",
  "Chinese Basic",
  "Korean Level 1",
];

export default function LessonManager() {
  const [lessons, setLessons] = useState(initialLessons);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Filter Logic
  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      selectedCourse === "All Courses" || lesson.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const getCategoryColor = (cat) => {
    if (cat === "English") return "bg-blue-50 text-blue-600 border-blue-100";
    if (cat === "Chinese")
      return "bg-orange-50 text-orange-600 border-orange-100";
    return "bg-green-50 text-green-600 border-green-100";
  };

  const handleSaveLesson = (lessonData) => {
    if (selectedLesson) {
      // Update existing lesson
      setLessons(
        lessons.map((l) =>
          l.id === selectedLesson.id ? { ...l, ...lessonData } : l,
        ),
      );
    } else {
      // Add new lesson
      const newLesson = {
        id: Date.now(),
        ...lessonData,
        views: 0,
      };
      setLessons([...lessons, newLesson]);
    }
    setIsModalOpen(false);
    setSelectedLesson(null);
  };

  return (
    <div className="space-y-6 pb-20 font-khmer-os-battambang animate-fade-in-up">
      {/* 1. HEADER */}
      <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-bold text-gray-900 text-2xl">
            គ្រប់គ្រងមេរៀនសរុប (Global Lesson Manager)
          </h1>
          <p className="mt-1 font-khmer-os-battambang text-gray-500 text-sm">
            គ្រប់គ្រង និងស្វែងរកមេរៀនពីគ្រប់វគ្គសិក្សាទាំងអស់។
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("table")}
            className={
              viewMode === "table" ? "bg-gray-100 border-[#00B4F6]" : ""
            }
          >
            <List
              size={20}
              className={
                viewMode === "table" ? "text-[#00B4F6]" : "text-gray-400"
              }
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={
              viewMode === "grid" ? "bg-gray-100 border-[#00B4F6]" : ""
            }
          >
            <LayoutGrid
              size={20}
              className={
                viewMode === "grid" ? "text-[#00B4F6]" : "text-gray-400"
              }
            />
          </Button>
          <Button
            onClick={() => {
              setSelectedLesson(null);
              setIsModalOpen(true);
            }}
            className="gap-2 bg-[#00B4F6] hover:bg-[#00a3df] shadow-blue-100 shadow-lg rounded-xl font-bold text-white"
          >
            <Plus size={20} /> បង្កើតមេរៀនថ្មី
          </Button>
        </div>
      </div>

      {/* 2. FILTERS */}
      <div className="flex md:flex-row flex-col gap-4 bg-white shadow-sm p-4 border border-gray-100 rounded-2xl">
        <div className="relative flex-1">
          <Search
            className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2"
            size={18}
          />
          <Input
            placeholder="ស្វែងរកតាមចំណងជើងមេរៀន..."
            className="bg-gray-50 pl-10 border-gray-200 rounded-xl focus-visible:ring-[#00B4F6] font-khmer-os-battambang"
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
            <SelectContent className="bg-white shadow-xl border-gray-100 rounded-xl">
              {COURSES.map((course) => (
                <SelectItem key={course} value={course} className="font-medium">
                  {course}
                </SelectItem>
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
      {viewMode === "table" ? (
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/80">
              <TableRow>
                <TableHead className="pl-6 h-12 font-extrabold text-[11px] text-gray-500 uppercase">
                  Lesson Information
                </TableHead>
                <TableHead className="font-extrabold text-[11px] text-gray-500 uppercase">
                  Course
                </TableHead>
                <TableHead className="font-extrabold text-[11px] text-gray-500 uppercase">
                  Duration
                </TableHead>
                <TableHead className="font-extrabold text-[11px] text-gray-500 uppercase">
                  Status
                </TableHead>
                <TableHead className="h-12 font-extrabold text-[11px] text-gray-500 text-center uppercase">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLessons.map((lesson) => (
                <TableRow
                  key={lesson.id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="flex justify-center items-center bg-blue-50 rounded-xl w-10 h-10 text-[#00B4F6] group-hover:scale-110 transition-transform">
                        <PlayCircle size={22} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {lesson.title}
                        </p>
                        <p className="font-bold text-[10px] text-gray-400">
                          {lesson.views} views • {lesson.type}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold ${getCategoryColor(lesson.category)} underline decoration-dotted underline-offset-4`}
                    >
                      {lesson.course}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-gray-600 text-sm truncate">
                    {lesson.duration}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 border-0 font-bold text-[10px] text-green-700">
                      Published
                    </Badge>
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
                        className="hover:bg-blue-50 rounded-lg w-8 h-8 hover:text-[#00B4F6]"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        onClick={() => {
                          if (window.confirm("Are you sure?")) {
                            setLessons(
                              lessons.filter((l) => l.id !== lesson.id),
                            );
                          }
                        }}
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-50 rounded-lg w-8 h-8 hover:text-red-500"
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
                    <div className="flex flex-col justify-center items-center text-gray-400">
                      <BookOpen size={40} className="opacity-20 mb-2" />
                      <p className="font-bold text-sm">
                        រកមិនឃើញមេរៀនដែលលោកអ្នកកំពុងស្វែងរកទេ
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        /* 4. GRID VIEW */
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="group bg-white shadow-sm hover:shadow-md border border-gray-100 rounded-2xl overflow-hidden transition-shadow"
            >
              <div className="relative flex justify-center items-center bg-gray-900 aspect-video overflow-hidden">
                <div className="z-10 absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <PlayCircle
                  size={40}
                  className="z-20 relative opacity-40 group-hover:opacity-100 text-white group-hover:scale-110 transition-all cursor-pointer"
                />
                <div className="top-2 right-2 z-20 absolute">
                  <Badge className="bg-black/50 backdrop-blur-md border-0 text-[10px] text-white">
                    {lesson.duration}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3 p-4">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug">
                    {lesson.title}
                  </h4>
                  <Button
                    onClick={() => {
                      setSelectedLesson(lesson);
                      setIsModalOpen(true);
                    }}
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-7 h-7 shrink-0"
                  >
                    <Edit size={14} />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex justify-center items-center bg-gray-100 rounded w-5 h-5 text-gray-400">
                    <BookOpen size={12} />
                  </div>
                  <span className="font-bold text-[11px] text-gray-500">
                    {lesson.course}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-gray-50 border-t">
                  <span className="font-bold text-[10px] text-gray-400 uppercase tracking-tight">
                    {lesson.views} Students watched
                  </span>
                  <Badge className="bg-blue-50 border-0 text-[#00B4F6] text-[9px]">
                    {lesson.category}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
