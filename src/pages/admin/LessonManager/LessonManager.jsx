import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  PlayCircle,
  BookOpen,
  Edit,
  Trash2,
  Plus,
  Filter,
  LayoutGrid,
  List,
  RefreshCw,
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VideoManagementModal from "./components/VideoManagementModal";
import { useVideoStore } from "@/hooks/useVideoStore";
import { useUploadStore } from "@/hooks/useUploadStore";
import { useCategories } from "@/hooks/api/useCategory";
import { useDebounce } from "@/hooks/useDebounce";
import { imgUrl } from "@/lib/helper/enviroment";
import { useDeleteVideo, useGetAllVideos } from "@/hooks/api/useVideo";

export default function LessonManager() {
  // const [lessons, setLessons] = useState(initialLessons); // Removed mock state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [viewMode, setViewMode] = useState("grid"); // "table" or "grid"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const queryClient = useQueryClient();
  const playVideo = useVideoStore(s => s.playVideo);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: categoriesData } = useCategories();
  const { data: getAllVideos, isLoading: getAllVideosLoading } =
    useGetAllVideos({
      category_id: selectedCategory === "all" ? undefined : selectedCategory,
      search: debouncedSearchTerm,
    });
  const { isUploading } = useUploadStore();

  const { mutateAsync: deleteVideo } = useDeleteVideo(); // Added delete hook

  // Refetch when all uploads complete
  useEffect(() => {
    if (!isUploading) {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    }
  }, [isUploading, queryClient]);

  const lessons = getAllVideos?.data || [];

  // Derived Courses List
  const COURSES = [
    "All Courses",
    ...new Set(lessons.map((l) => l.course?.title).filter(Boolean)),
  ];

  // Filter Logic (Course filter remains local as it's more specific)
  const filteredLessons = lessons.filter((lesson) => {
    const matchesCourse =
      selectedCourse === "All Courses" ||
      lesson.course?.title === selectedCourse;
    return matchesCourse;
  });

  const getCategoryColor = (cat) => {
    if (cat === "English") return "bg-blue-50 text-blue-600 border-blue-100";
    if (cat === "Chinese")
      return "bg-orange-50 text-orange-600 border-orange-100";
    return "bg-green-50 text-green-600 border-green-100";
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSaveLesson = (lessonData) => {
    // This is handled by the modal now
    setIsModalOpen(false);
    setSelectedLesson(null);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "តើអ្នកប្រាកដជាចង់លុបមេរៀននេះមែនទេ? (Are you sure you want to delete this lesson?)",
      )
    ) {
      try {
        await deleteVideo(id);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handlePreview = (lesson) => {
    playVideo({ id: lesson.id, title: lesson.title });
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
          <Button
            variant="outline"
            size="icon"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["videos"] })}
            className="hover:bg-gray-50 border-gray-200 rounded-xl transition-all"
            title="Refresh List"
          >
            <RefreshCw size={18} className="text-gray-400" />
          </Button>
        </div>
      </div>

      {/* 2. FILTERS */}
      <div className="bg-white shadow-sm p-4 border border-gray-100 rounded-2xl flex flex-col gap-4">
        <div className="flex md:flex-row flex-col gap-4">
          <div className="relative flex-1">
            <Search
              className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2"
              size={20}
            />
            <input
              type="text"
              placeholder="ស្វែងរកមេរៀន..."
              className="bg-gray-50 focus:bg-white py-2.5 md:w-96 pr-4 pl-10 border border-gray-100 rounded-xl outline-none focus:ring-[#00B4F6] focus:ring-2 w-full font-khmer-os-battambang font-bold text-gray-600 text-sm transition-all"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
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

        {/* CATEGORY CHIPS */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar no-scrollbar border-t border-gray-50 pt-4">
          <button
            onClick={() => {
              setSelectedCategory("all");
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${selectedCategory === "all"
              ? "bg-[#00B4F6] text-white border-[#00B4F6] shadow-md shadow-blue-100"
              : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
              }`}
          >
            All Categories
          </button>
          {categoriesData?.data?.data?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id.toString());
              }}
              className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${selectedCategory === cat.id.toString()
                ? "bg-[#00B4F6] text-white border-[#00B4F6] shadow-md shadow-blue-100"
                : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
                }`}
            >
              {cat.thumbnail && (
                <img
                  src={`${imgUrl}${cat.thumbnail}`}
                  alt=""
                  className="w-4 h-4 rounded-full object-cover border border-white/20"
                />
              )}
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <VideoManagementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveLesson}
        initialData={selectedLesson}
      />

      {/* 3. LESSON LIST (TABLE VIEW) */}
      {getAllVideosLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="border-[#00B4F6] border-4 border-t-transparent rounded-full w-8 h-8 animate-spin"></div>
            <p className="font-bold text-gray-400 text-sm">
              កំពុងទាញយកទិន្នន័យ...
            </p>
          </div>
        </div>
      ) : viewMode === "table" ? (
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
                      <div className="relative flex justify-center items-center bg-blue-50 rounded-xl w-10 h-10 overflow-hidden text-[#00B4F6] group-hover:scale-110 transition-transform">
                        {lesson.thumbnail_webp ? (
                          <img
                            src={`${lesson.thumbnail_webp}`}
                            className="hover:opacity-80 w-full h-full object-cover transition-opacity cursor-pointer"
                            onClick={() => handlePreview(lesson)}
                          />
                        ) : (
                          <PlayCircle
                            size={22}
                            className="cursor-pointer"
                            onClick={() => handlePreview(lesson)}
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {lesson.title}
                        </p>
                        <p className="font-bold text-[10px] text-gray-400">
                          {lesson.video_order
                            ? `Order: ${lesson.video_order}`
                            : "Video"}{" "}
                          • By {lesson.uploadedBy?.username}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-blue-50 text-blue-600 border-blue-100 underline decoration-dotted underline-offset-4`}
                    >
                      {lesson.course?.title}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-gray-600 text-sm truncate">
                    {formatDuration(lesson.duration)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`border-0 font-bold text-[10px] ${lesson.status === "ready" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                    >
                      {lesson.status === "ready" ? "Ready" : "Awaiting"}
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
                        onClick={() => handleDelete(lesson.id)}
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
              <div className="relative bg-gray-900 aspect-video overflow-hidden">
                {lesson.thumbnail_webp ? (
                  <img
                    src={`${lesson.thumbnail_webp}`}
                    className="absolute inset-0 opacity-60 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-slate-800" />
                )}
                <div className="z-10 absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="z-20 absolute inset-0 flex justify-center items-center">
                  <PlayCircle
                    size={40}
                    className="opacity-40 group-hover:opacity-100 text-white group-hover:scale-110 transition-all cursor-pointer"
                    onClick={() => handlePreview(lesson)}
                  />
                </div>
                <div className="top-2 right-2 z-30 absolute">
                  <Badge className="bg-black/50 backdrop-blur-md border-0 text-[10px] text-white">
                    {formatDuration(lesson.duration)}
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
                    {lesson.course?.title}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-gray-50 border-t">
                  <span className="font-bold text-[10px] text-gray-400 uppercase tracking-tight">
                    {lesson.video_order
                      ? `Order ${lesson.video_order}`
                      : "Video"}
                  </span>
                  <Badge
                    className={`border-0 text-[9px] ${lesson.status === "ready" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}
                  >
                    {lesson.status}
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
