import {
  X,
  Upload,
  Trash2,
  PlayCircle,
  Loader2,
  FileVideo,
  Save,
  Plus
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useCourses } from "@/hooks/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { imgUrl } from "@/lib/helper/enviroment";
import { useRef, useState } from "react";
import { useSaveVideosBulk, useUploadVideos } from "@/hooks/api/useVideo";
import { uploadToBunny } from "@/lib/helper/bunny";

const zodSchema = z.object({
  course_id: z.string().min(1, "Course is required"),
})

export default function VideoManagementModal({
  isOpen,
  onClose,
  course,
  initialData,
}) {
  const videos = []
  const isLoading = false
  const uploading = false
  const { data: coursesData } = useCourses()
  const { mutateAsync: uploadVideos } = useUploadVideos()
  const { mutateAsync: saveVideosBulk } = useSaveVideosBulk()

  const [isDragging, setIsDragging] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const fileInputRef = useRef(null);




  const generateId = () => crypto.randomUUID();


  const generateVideoThumbnail = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      video.preload = "metadata";
      video.muted = true;
      video.src = URL.createObjectURL(file);

      video.onloadeddata = () => {
        video.currentTime = Math.min(1, video.duration || 1);
      };

      video.onseeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const thumbnail = canvas.toDataURL("image/jpeg", 0.8);

        URL.revokeObjectURL(video.src);
        resolve(thumbnail);
      };
    });
  };


  const handleFiles = async (files) => {
    const videoFiles = Array.from(files).filter(f =>
      f.type.startsWith("video/")
    );

    const mapped = await Promise.all(videoFiles.map(async (file) => ({
      id: generateId(),
      file,
      title: file.name.replace(/\.[^/.]+$/, ""),
      thumbnail: await generateVideoThumbnail(file),
    })));

    setPendingFiles(prev => [...prev, ...mapped]);
  };

  const removePendingFile = (id) => {
    setPendingFiles(prev => prev.filter(f => f.id !== id));
  };

  const updatePendingTitle = (id, title) => {
    setPendingFiles(prev =>
      prev.map(f => (f.id === id ? { ...f, title } : f))
    );
  };

  const clearAll = () => setPendingFiles([]);

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  };


  const { formState, handleSubmit, control, reset, setValue, watch } = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: initialData || {
      course_id: "",
    },
  })

  const onSubmit = async (data) => {
    try {
      const { course_id } = data;

      const res = await uploadVideos({
        course_id,
        files: pendingFiles.map(f => ({ id: f.id, title: f.title }))
      });
      const uploadMap = new Map(res.data.map(v => [v.clientId, v]));
      const filesWithUploadData = pendingFiles.map(f => ({
        ...f,
        uploadData: uploadMap.get(f.id)
      }));
      setPendingFiles(filesWithUploadData);

      for (const fileItem of filesWithUploadData) {
        if (!fileItem.uploadData) continue;

        console.log(fileItem.uploadData.upload)

        await uploadToBunny(fileItem.file, fileItem?.uploadData?.upload, progress => {
          setPendingFiles(prev =>
            prev.map(f =>
              f.id === fileItem.id ? { ...f, progress } : f
            )
          );
        });
      }

      // 4️⃣ Cleanup
      setPendingFiles([]);
      console.log("All videos uploaded successfully");
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };









  if (!isOpen) return null;

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div
        className={`bg-white w-full rounded-[24px] shadow-2xl animate-scale-in overflow-hidden flex flex-col max-h-[90vh] ${initialData ? "max-w-lg" : "max-w-4xl"}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center bg-[#6366f1] p-5 text-white shrink-0">
          <div>
            <h3 className="flex items-center gap-2 font-bold text-lg">
              {initialData ? (
                <Edit size={20} />
              ) : (
                <Plus size={20} />
              )}
              {initialData
                ? "Edit Lesson"
                : "Add New Lesson"}
            </h3>
            {!initialData && (
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
          {!initialData && (
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
            className={`p-6 bg-white shrink-0 overflow-y-auto ${initialData ? "w-full" : "w-full md:w-80"}`}
          >

            <form className="space-y-6">


              {/* 2. Course Selection */}
              <div>
                <label className="block mb-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                  Target Course
                </label>
                <div className="relative">
                  <FieldGroup className={"flex gap-1"}>
                    <FieldLabel htmlFor="course_id">Course</FieldLabel>
                    <FieldContent>
                      <Select
                        value={watch("course_id")}
                        onValueChange={(val) => setValue("course_id", val)}
                        className="text-sm"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {coursesData?.data?.map((course) => (
                            <SelectItem
                              key={`${course.id} ${course.title}`}
                              value={course.id.toString()}
                              className="flex items-center space-x-2"
                            >
                              <div className="flex justify-center items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage
                                    src={`${imgUrl}${course.thumbnail}`}
                                    alt={course.title}
                                    className="rounded-sm w-6 h-6"
                                  />
                                  <AvatarFallback>{course.title?.[0]}</AvatarFallback>
                                </Avatar>
                                <span>{course.title}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formState.errors.course_id && (
                        <p className="text-red-500 text-xs">
                          {formState.errors.course_id.message}
                        </p>
                      )}
                    </FieldContent>
                  </FieldGroup>

                </div>
              </div>

              {/* 3. MULTI-UPLOAD DROPZONE */}
              <div>
                <label className="block mb-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                  Upload Videos {initialData && "(Replace current)"}
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}

                  className={`
                                        relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group
                                        ${isDragging ? "border-[#6366f1] bg-indigo-50/50 scale-[0.99]" : "border-gray-200 bg-gray-50/30 hover:border-[#6366f1] hover:bg-indigo-50/20"}
                                    `}
                >
                  <input
                    ref={fileInputRef}
                    id="multi-video-input"
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={onFileChange}
                    className="hidden"
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
                        onClick={clearAll}
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
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-black">
                            {item.thumbnail ? (
                              <img
                                src={item.thumbnail}
                                alt="Video thumbnail"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FileVideo size={20} className="text-white mx-auto" />
                            )}
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
                  disabled={
                    uploading || (pendingFiles.length === 0 && !initialData)
                  }
                  onClick={handleSubmit(onSubmit)}
                  className={`
                                        w-full py-4 rounded-2xl font-bold text-white shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]
                                        ${uploading ? "bg-indigo-400" : "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:shadow-indigo-200"}
                                        ${pendingFiles.length === 0 && !initialData ? "opacity-50 grayscale cursor-not-allowed" : ""}
                                    `}
                >
                  {uploading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />{" "}
                      {initialData
                        ? "Saving Changes..."
                        : "Uploading Everything..."}
                    </>
                  ) : (
                    <>
                      {initialData ? <Save size={20} /> : <Upload size={20} />}{" "}
                      {initialData
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
