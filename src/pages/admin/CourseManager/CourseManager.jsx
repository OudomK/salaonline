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
import { useDebounce } from "@/hooks/useDebounce";
import { imgUrl } from "@/lib/helper/enviroment";
import { useCategories } from "@/hooks/api/useCategory";

export default function CourseManager() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories();

  const { data: coursesData, isLoading: isLoadingCourses } = useAdminCourses({
    page: currentPage,
    size: itemsPerPage,
    search: searchTerm,
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

  const [teacherSearch, setTeacherSearch] = useState("");
  const debouncedTeacherSearch = useDebounce(teacherSearch, 500);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    category_id: 1,
    teacher_id: "",
  });

  // Helper for pagination UI
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Server-side pagination uses data from hooks directly

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- ACTIONS ---
  const handleAddNew = () => {
    setCurrentCourse(null);
    setFormData({
      title: "",
      description: "",
      thumbnail: "",
      category_id: 1,
      teacher_id: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (course) => {
    setCurrentCourse(course);
    setFormData({
      title: course.title || "",
      description: course.description || "",
      thumbnail: course.thumbnail || "",
      category_id: course.category_id || 1,
      teacher_id: course.teacher_id || course.teacher?.id || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          toast.success("Course deleted successfully");
          setIsAlertOpen(false);
          queryClient.invalidateQueries({ queryKey: ["courses", "admin"] });
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to delete course",
          );
        },
      });
    }
  };

  const handleToggleStatus = (course) => {
    const isPublished = course.status === "published";
    const mutation = isPublished ? hideMutation : publishMutation;

    mutation.mutate(course.id, {
      onSuccess: () => {
        toast("Course has been created");
        queryClient.invalidateQueries(["courses", "admin"]);
      },
      onError: (error) => {
        toast("Event has been created", {
          description: error.response?.data?.message || "Something went wrong",
        });
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

  return (
    <div className="space-y-6 pb-20 animate-fade-in-up">
      {/* HEADER */}
      <div className="flex md:flex-row flex-col justify-between items-center gap-4">
        <div>
          <h1 className="font-khmer-os-battambang font-bold text-gray-900 text-2xl">
            គ្រប់គ្រងមេរៀន (Course Manager)
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            Create courses, levels, and upload videos.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-[#00B4F6] hover:bg-[#00a3df] shadow-blue-200 shadow-lg px-5 py-2.5 rounded-xl font-bold text-white active:scale-95 transition-all"
        >
          <Plus size={20} /> បង្កើតវគ្គថ្មី (New Course)
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white shadow-sm p-4 border border-gray-100 rounded-2xl">
        <div className="relative w-full md:w-96">
          <Search
            className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2"
            size={20}
          />
          <input
            type="text"
            placeholder="ស្វែងរកតាមឈ្មោះគ្រូ ឬ ចំណងជើង..."
            className="bg-gray-50 focus:bg-white py-2.5 pr-4 pl-10 border border-gray-200 rounded-xl outline-none focus:ring-[#00B4F6] focus:ring-2 w-full font-khmer-os-battambang font-bold text-gray-700 text-sm transition-all"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }} // Reset to page 1 on search
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 border-gray-100 border-b">
              <TableHead className="px-6 py-4 font-extrabold text-gray-400 text-xs uppercase tracking-wider">
                THUMBNAIL
              </TableHead>
              <TableHead className="px-6 py-4 font-extrabold text-gray-400 text-xs uppercase tracking-wider">
                COURSE NAME
              </TableHead>
              <TableHead className="px-6 py-4 font-extrabold text-gray-400 text-xs uppercase tracking-wider">
                CATEGORY
              </TableHead>
              <TableHead className="px-6 py-4 font-extrabold text-gray-400 text-xs uppercase tracking-wider">
                STATUS
              </TableHead>

              <TableHead className="px-6 py-4 font-extrabold text-gray-400 text-xs text-center uppercase tracking-wider">
                ACTION
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingCourses ? (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center">
                  <Loader2
                    className="mx-auto text-[#00B4F6] animate-spin"
                    size={32}
                  />
                </TableCell>
              </TableRow>
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-gray-400 text-center"
                >
                  រកមិនឃើញទិន្នន័យទេ
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow
                  key={course.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {course.thumbnail ? (
                        <img
                          src={imgUrl + course.thumbnail}
                          alt="Thumbnail"
                          className="border border-border rounded-md w-12 h-12 object-cover"
                        />
                      ) : (
                        <div className="flex justify-center items-center bg-muted border border-border rounded-md w-12 h-12 font-medium text-muted-foreground text-xs">
                          No Thumbnail
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg text-gray-500">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {course.title}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {course.teacher_name ||
                            course.teacher?.username ||
                            "No Teacher"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${getCategoryColor(course.category_id || 1)}`}
                    >
                      {getCategoryName(course.category_id || 1)}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-full font-bold text-gray-700 text-sm">
                      {course.status || "N/A"}
                    </span>
                  </TableCell>

                  <TableCell className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(course)}
                        className={`p-2 rounded-lg transition-all ${course.status === "published" ? "bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white" : "bg-green-50 text-green-500 hover:bg-green-500 hover:text-white"}`}
                        title={
                          course.status === "published"
                            ? "Hide Course"
                            : "Publish Course"
                        }
                      >
                        {course.status === "published" ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(course)}
                        className="bg-gray-100 hover:bg-[#00B4F6] p-2 rounded-lg text-gray-600 hover:text-white transition-all"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(course.id)}
                        className="bg-red-50 hover:bg-red-500 p-2 rounded-lg text-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* 🟢 PAGINATION FOOTER */}
        {totalItems > 0 && (
          <div className="flex md:flex-row flex-col justify-between items-center gap-4 bg-gray-50/50 p-4 border-gray-100 border-t">
            <span className="font-khmer-os-battambang font-bold text-gray-500 text-xs">
              បង្ហាញ {indexOfFirstItem + 1} ដល់ {indexOfLastItem} នៃ{" "}
              {totalItems} វគ្គសិក្សា
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-white hover:bg-gray-100 disabled:opacity-50 p-2 border border-gray-200 rounded-lg text-gray-600 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === i + 1
                      ? "bg-[#00B4F6] text-white shadow-md shadow-blue-200"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-white hover:bg-gray-100 disabled:opacity-50 p-2 border border-gray-200 rounded-lg text-gray-600 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SHADCN ALERT DIALOG */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-white shadow-2xl border-0 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-khmer-os-battambang font-bold text-gray-900 text-xl">
              តើអ្នកប្រាកដទេ?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-khmer-os-battambang text-gray-500">
              សកម្មភាពនេះនឹងលុបវគ្គសិក្សានេះចេញពីប្រព័ន្ធជារៀងរហូត។
              វាមិនអាចត្រឡប់វិញបានទេ។
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 border-0 rounded-xl font-bold text-gray-700">
              បោះបង់ (Cancel)
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 rounded-xl font-bold text-white"
            >
              យល់ព្រមលុប (Delete)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CrateForm
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        currentCourse={currentCourse}
      />
    </div>
  );
}
