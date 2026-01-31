import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Video,
  Edit,
  Trash2,
  PlayCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  EyeOff,
  FolderOpen,
} from "lucide-react";
import {
  useAdminCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
  usePublishCourse,
  useHideCourse,
} from "@/hooks/api";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CrateForm from "./components/CrateForm";
import CourseDetail from "./components/CourseDetail";
import { useDebounce } from "@/hooks/useDebounce";
import { imgUrl } from "@/lib/helper/enviroment";
import { useCategories } from "@/hooks/api/useCategory";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CourseManager() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewDetail, setViewDetail] = useState(null); // New state for course detail
  const itemsPerPage = 12;

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: coursesData, isLoading: isLoadingCourses } = useAdminCourses({
    page: currentPage,
    size: itemsPerPage,
    search: debouncedSearchTerm,
    category_id: selectedCategory === "all" ? undefined : selectedCategory,
  });

  const courses = coursesData?.data || [];
  const totalPages = coursesData?.total_pages || 1;
  const totalItems = coursesData?.total_items || 0;

  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const deleteMutation = useDeleteCourse();
  const publishMutation = usePublishCourse();
  const hideMutation = useHideCourse();

  // --- MODAL STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Helper for pagination UI
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- ACTIONS ---
  const handleAddNew = () => {
    setCurrentCourse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (e, course) => {
    e.stopPropagation();
    setCurrentCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteId(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          toast.success("Course deleted successfully");
          setIsAlertOpen(false);
          queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to delete course",
          );
        },
      });
    }
  };

  const handleToggleStatus = (e, course) => {
    e.stopPropagation();
    const isPublished = course.status === "published";
    const mutation = isPublished ? hideMutation : publishMutation;

    mutation.mutate(course.id, {
      onSuccess: () => {
        toast.success(
          isPublished
            ? "Course hidden successfully"
            : "Course published successfully",
        );
        queryClient.invalidateQueries({ queryKey: ["courses"] });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Something went wrong");
      },
    });
  };

  const getCategoryName = (id) => {
    return categoriesData?.data?.find((c) => c.id === id)?.name || "N/A";
  };

  const getCategoryColor = (id) => {
    if (id === 1) return "bg-blue-100 text-blue-600";
    if (id === 2) return "bg-orange-100 text-orange-600";
    return "bg-green-100 text-green-600";
  };

  if (viewDetail) {
    return <CourseDetail course={viewDetail} onBack={() => setViewDetail(null)} />;
  }

  return (
    <div className="space-y-6 pb-20 animate-fade-in-up">
      {/* HEADER */}
      <div className="flex md:flex-row flex-col justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-[#00B4F6]/10 p-3 rounded-2xl text-[#00B4F6]">
            <FolderOpen size={28} />
          </div>
          <div>
            <h1 className="font-khmer-os-battambang font-bold text-gray-900 text-2xl">
              Course Manager
            </h1>
            <p className="mt-1 text-gray-500 text-sm">
              Manage your course contents and educational videos.
            </p>
          </div>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-[#00B4F6] hover:bg-[#00a3df] shadow-blue-100 shadow-lg px-6 py-3 rounded-xl font-bold text-white active:scale-95 transition-all text-sm"
        >
          <Plus size={20} /> Create New Course
        </button>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white shadow-sm p-4 border border-gray-100 rounded-2xl flex flex-col gap-6">
        <div className="flex md:flex-row flex-col gap-4">
          <div className="relative flex-1">
            <Search
              className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2"
              size={20}
            />
            <input
              type="text"
              placeholder="ស្វែងរក course ឬ ឈ្មោះគ្រូ..."
              className="bg-gray-50 focus:bg-white py-2.5 md:w-96 pr-4 pl-10 border border-gray-100 rounded-xl outline-none focus:ring-[#00B4F6] focus:ring-2 w-full font-khmer-os-battambang font-bold text-gray-600 text-sm transition-all"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* CATEGORY CHIPS */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
          <button
            onClick={() => {
              setSelectedCategory("all");
              setCurrentPage(1);
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${selectedCategory === "all"
              ? "bg-[#00B4F6] text-white border-[#00B4F6] shadow-md shadow-blue-100"
              : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
              }`}
          >
            All Libraries
          </button>
          {categoriesData?.data?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id.toString());
                setCurrentPage(1);
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

      {/* GRID CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoadingCourses ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm animate-pulse">
              <div className="bg-gray-200 rounded-xl aspect-video w-full mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : courses.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-khmer-os-battambang">រកមិនឃើញទិន្នន័យទេ</p>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              onClick={() => setViewDetail(course)}
              className="group cursor-pointer relative bg-white border border-gray-100 rounded-[24px] shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Folder Tab Effect */}
              <div className="absolute top-0 left-0 w-24 h-1 bg-[#00B4F6] rounded-tr-full"></div>

              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-gray-50">
                {course.thumbnail ? (
                  <img
                    src={imgUrl + course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                    <Video size={48} className="mb-2 opacity-20" />
                    <span className="text-xs font-medium uppercase tracking-widest text-gray-400">No Content</span>
                  </div>
                )}

                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase shadow-sm backdrop-blur-md border border-white/20 ${course.status === "published"
                    ? "bg-green-500/80 text-white"
                    : "bg-orange-500/80 text-white"
                    }`}>
                    {course.status || "Draft"}
                  </span>
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-bold text-[#00B4F6] text-xs flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <FolderOpen size={16} /> Enter Course (videos)
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-2 flex justify-between items-center">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${getCategoryColor(course.category.id || 1)}`}>
                    {getCategoryName(course.category.id || 1)}
                  </span>
                </div>


                <div className="flex flex-row justify-between">
                  <h3 className="font-bold text-gray-800 text-base line-clamp-2 mb-3 font-khmer-os-battambang group-hover:text-[#00B4F6] transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <span className="text-xs font-bold text-gray-600">
                    {course.video_amount || 0} videos
                  </span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="flex items-center justify-center text-[#00B4F6] shrink-0">
                      <Avatar className="w-8 h-8 border border-gray-100">
                        <AvatarImage src={imgUrl + course.teacher?.avatar} />
                        <AvatarFallback className="bg-transparent text-[#00B4F6]">{course.teacher?.first_name[0] + course.teacher?.last_name[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">Teacher</p>
                      <p className="text-[11px] font-bold text-gray-600 truncate">
                        {course.teacher?.first_name + " " + course.teacher?.last_name || course.teacher?.username || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleToggleStatus(e, course)}
                      className="p-1.5 text-gray-300 hover:text-[#00B4F6] transition-colors"
                      title="Update Status"
                    >
                      {course.status === "published" ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button
                      onClick={(e) => handleEdit(e, course)}
                      className="p-1.5 text-gray-300 hover:text-[#00B4F6] transition-colors"
                      title="Edit Info"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, course.id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🟢 PAGINATION FOOTER */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="font-khmer-os-battambang font-bold text-gray-500 text-xs text-center sm:text-left">
            បង្ហាញ {indexOfFirstItem + 1} ដល់ {indexOfLastItem} សរុប {totalItems}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-50 disabled:opacity-30 border border-gray-100 rounded-xl text-gray-600 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${currentPage === i + 1
                    ? "bg-[#00B4F6] text-white shadow-lg shadow-blue-100"
                    : "bg-white border border-gray-100 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-50 disabled:opacity-30 border border-gray-100 rounded-xl text-gray-600 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* SHADCN ALERT DIALOG */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-white shadow-2xl border-0 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-khmer-os-battambang font-bold text-gray-900 text-xl text-left">
              តើអ្នកប្រាកដទេ?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-khmer-os-battambang text-gray-500 text-left">
              សកម្មភាពនេះនឹងលុបវគ្គសិក្សានេះចេញពីប្រព័ន្ធជារៀងរហូត។
              វាមិនអាចត្រឡប់វិញបានទេ។
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:flex-col sm:gap-2">
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 rounded-xl font-bold text-white w-full h-12"
            >
              យល់ព្រមលុប (Delete)
            </AlertDialogAction>
            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 border-0 rounded-xl font-bold text-gray-700 w-full h-12">
              បោះបង់ (Cancel)
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CrateForm
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        currentCourse={currentCourse}
        categories={categoriesData?.data}
        defaultCategoryId={selectedCategory}
      />
    </div>
  );
}
