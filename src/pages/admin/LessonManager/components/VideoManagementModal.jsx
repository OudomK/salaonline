import {
  X,
  Upload,
  Trash2,
  PlayCircle,
  Loader2,
  FileVideo,
  Save,
  Plus,
  Filter,
} from "lucide-react";
import { videoService } from "../../../../lib/api/services/video.service";
import { courseService } from "../../../../lib/api/services/course.service";
import { useEffect, useState } from "react";
import * as tus from "tus-js-client";

export default function VideoManagementModal({
  isOpen,
  onClose,
  course,
  onSubmit,
  initialData,
}) {
  const isFormMode = !!onSubmit; // Detect if used in LessonManager (as a form)

  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [courses, setCourses] = useState([]); // For global mode
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [pendingFiles, setPendingFiles] = useState([]); // Array of { file, title, id }
  const [courseId, setCourseId] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isFormMode) {
        // Pre-fill form for LessonManager
        setTitle(initialData?.title || "");
        setCourseId(initialData?.courseId || initialData?.course_id || "");
        setPendingFiles([]); // Files can't be pre-filled usually
        fetchCourses();
      } else if (course?.id) {
        // Course Manager Mode: Fetch videos for this course
        setCourseId(course.id);
        fetchVideos();
      }
    }
  }, [isOpen, course, initialData, isFormMode]);

  const fetchCourses = async () => {
    if (!isFormMode) return;
    setLoadingCourses(true);
    try {
      const response = await courseService.getAllCourses();
      // Assuming response.data is the array of courses
      setCourses(response.data || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const response = await videoService.getVideosByCourse(course.id);
      setVideos(response.data || []);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (files) => {
    const newFiles = files.map((file) => ({
      file,
      title: file.name.split(".").slice(0, -1).join(".") || file.name,
      id: Math.random().toString(36).substr(2, 9),
    }));
    setPendingFiles((prev) => [...prev, ...newFiles]);
    // Reset single title if it was used for the first file
    if (pendingFiles.length === 0 && newFiles.length === 1) {
      setTitle(newFiles[0].title);
    }
  };

  const removePendingFile = (id) => {
    setPendingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const updatePendingTitle = (id, newTitle) => {
    setPendingFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, title: newTitle } : f)),
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("video/"),
    );
    addFiles(droppedFiles);
  };

  const handleUpload = async (e) => {};

  const handleDelete = async (videoId) => {};

  if (!isOpen) return null;

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div
        className={`bg-white w-full rounded-[24px] shadow-2xl animate-scale-in overflow-hidden flex flex-col max-h-[90vh] ${isFormMode ? "max-w-lg" : "max-w-4xl"}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center bg-[#6366f1] p-5 text-white shrink-0">
          <div>
            <h3 className="flex items-center gap-2 font-bold text-lg">
              {isFormMode ? (
                initialData ? (
                  <Edit size={20} />
                ) : (
                  <Plus size={20} />
                )
              ) : (
                <FileVideo size={20} />
              )}
              {isFormMode
                ? initialData
                  ? "Edit Lesson"
                  : "Add New Lesson"
                : "Upload Videos"}
            </h3>
            {!isFormMode && (
              <p className="opacity-90 text-indigo-100 text-xs">
                Course: {course?.title}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex md:flex-row flex-col h-full overflow-hidden">
          {/* LEFT: VIDEO LIST (Only in Course Manager mode) */}
          {!isFormMode && (
            <div className="flex-1 bg-gray-50/50 p-6 border-gray-100 border-r overflow-y-auto">
              <h4 className="flex items-center gap-2 mb-4 font-bold text-gray-700">
                Existing Videos
                <span className="bg-gray-200 px-2 py-0.5 rounded-full text-gray-600 text-xs">
                  {videos.length}
                </span>
              </h4>

              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="text-gray-400 animate-spin" />
                </div>
              ) : videos.length === 0 ? (
                <div className="py-10 border-2 border-gray-200 border-dashed rounded-xl text-gray-400 text-center">
                  <FileVideo size={40} className="opacity-20 mx-auto mb-2" />
                  <p className="text-sm">No videos found for this course.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="group flex justify-between items-center bg-white shadow-sm p-3 border border-gray-100 hover:border-indigo-100 rounded-xl transition-all"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex justify-center items-center bg-indigo-50 rounded-lg w-10 h-10 text-indigo-500 shrink-0">
                          <PlayCircle size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-800 text-sm truncate">
                            {video.title}
                          </p>
                          <p className="text-gray-400 text-xs truncate">
                            {video.fileName || "Video File"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="hover:bg-red-50 opacity-0 group-hover:opacity-100 p-2 rounded-lg text-gray-300 hover:text-red-500 transition-colors"
                        title="Delete Video"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RIGHT: UPLOAD FORM */}
          <div
            className={`p-6 bg-white shrink-0 overflow-y-auto ${isFormMode ? "w-full" : "w-full md:w-80"}`}
          >
            <h4 className="mb-1 font-bold text-gray-800">
              {isFormMode ? "Lesson Details" : "Upload New Video"}
            </h4>
            <p className="mb-6 text-gray-400 text-xs">
              {isFormMode
                ? "Fill in the information below."
                : "Add content to this course."}
            </p>

            <form onSubmit={handleUpload} className="space-y-6">
              {/* 1. Title (Only shown for single edit/add in LessonManager) */}
              {isFormMode && (
                <div>
                  <label className="block mb-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    Lesson Title
                  </label>
                  <input
                    required
                    placeholder="Ex: Introduction to Grammar"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-gray-50 p-4 border border-gray-200 focus:border-[#6366f1] rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 w-full font-bold text-gray-700 transition-all"
                  />
                </div>
              )}

              {/* 2. Course Selection */}
              <div>
                <label className="block mb-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                  Target Course
                </label>
                <div className="relative">
                  <select
                    required
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    disabled={!isFormMode && !!course}
                    className={`w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#6366f1] focus:ring-4 focus:ring-indigo-50 font-bold text-gray-700 transition-all appearance-none ${!isFormMode && !!course ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-gray-100/50"}`}
                  >
                    {isFormMode ? (
                      <>
                        <option value="">-- Select a Course --</option>
                        {loadingCourses ? (
                          <option disabled>Loading courses...</option>
                        ) : courses?.length > 0 ? (
                          courses?.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))
                        ) : (
                          <option disabled>No courses found</option>
                        )}
                      </>
                    ) : (
                      <option value={course?.id}>{course?.title}</option>
                    )}
                  </select>
                  <div className="top-1/2 right-4 absolute text-gray-400 -translate-y-1/2 pointer-events-none">
                    <Filter size={18} />
                  </div>
                </div>
              </div>

              {/* 3. MULTI-UPLOAD DROPZONE */}
              <div>
                <label className="block mb-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                  Upload Videos {initialData && "(Replace current)"}
                </label>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                                        relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group
                                        ${isDragging ? "border-[#6366f1] bg-indigo-50/50 scale-[0.99]" : "border-gray-200 bg-gray-50/30 hover:border-[#6366f1] hover:bg-indigo-50/20"}
                                    `}
                  onClick={() =>
                    document.getElementById("multi-video-input").click()
                  }
                >
                  <input
                    id="multi-video-input"
                    type="file"
                    multiple
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 ${isDragging ? "bg-indigo-500 text-white animate-bounce" : "bg-indigo-50 text-indigo-500"}`}
                  >
                    <Upload size={32} />
                  </div>
                  <h5 className="mb-1 font-bold text-gray-700">
                    Click or drag videos to upload
                  </h5>
                  <p className="text-gray-400 text-xs">
                    Support formats: MP4, MOV, AVI (Max 500MB each)
                  </p>
                </div>

                {/* 4. PENDING FILES GRID ("THE BOX OF VIDEOS") */}
                {pendingFiles.length > 0 && (
                  <div className="space-y-3 mt-6 pr-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-center px-1">
                      <p className="flex items-center gap-2 font-extrabold text-[#6366f1] text-xs uppercase tracking-widest">
                        <PlayCircle size={14} /> Selected Files (
                        {pendingFiles.length})
                      </p>
                      <button
                        type="button"
                        onClick={() => setPendingFiles([])}
                        className="font-bold text-[10px] text-red-400 hover:text-red-500"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="gap-3 grid grid-cols-1">
                      {pendingFiles.map((item) => (
                        <div
                          key={item.id}
                          className="group flex items-center gap-4 bg-white shadow-sm p-3 border border-gray-100 rounded-2xl animate-scale-in"
                        >
                          <div className="relative flex justify-center items-center bg-gray-900 rounded-xl w-12 h-12 overflow-hidden text-white shrink-0">
                            <FileVideo size={20} className="z-10 relative" />
                            <div className="absolute inset-0 bg-indigo-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <input
                              className="bg-transparent border-none outline-none w-full font-bold text-gray-800 focus:text-[#6366f1] text-sm"
                              value={item.title}
                              onChange={(e) =>
                                updatePendingTitle(item.id, e.target.value)
                              }
                              placeholder="Lesson Title"
                            />
                            <p className="font-medium text-[10px] text-gray-400 truncate">
                              {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removePendingFile(item.id)}
                            className="hover:bg-red-50 p-2 rounded-xl text-gray-300 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={
                    uploading || (pendingFiles.length === 0 && !initialData)
                  }
                  className={`
                                        w-full py-4 rounded-2xl font-bold text-white shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]
                                        ${uploading ? "bg-indigo-400" : "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:shadow-indigo-200"}
                                        ${pendingFiles.length === 0 && !initialData ? "opacity-50 grayscale cursor-not-allowed" : ""}
                                    `}
                >
                  {uploading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />{" "}
                      {isFormMode
                        ? "Saving Changes..."
                        : "Uploading Everything..."}
                    </>
                  ) : (
                    <>
                      {isFormMode ? <Save size={20} /> : <Upload size={20} />}{" "}
                      {isFormMode
                        ? "Apply Changes"
                        : `Upload ${pendingFiles.length} Video${pendingFiles.length !== 1 ? "s" : ""}`}
                    </>
                  )}
                </button>
                {uploading && (
                  <p className="mt-3 font-bold text-[10px] text-indigo-400 text-center animate-pulse">
                    Please do not close this window during upload...
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
