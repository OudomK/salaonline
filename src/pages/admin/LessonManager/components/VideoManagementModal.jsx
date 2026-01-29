import {
  X,
  Upload,
  Trash2,
  PlayCircle,
  Loader2,
  FileVideo,
  Save,
  Plus,
  Edit
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useAdminCourses } from "@/hooks/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { imgUrl } from "@/lib/helper/enviroment";
import { useRef, useState } from "react";
import { useUploadVideos, useVideos, useDeleteVideo } from "@/hooks/api/useVideo";
import { uploadToBunny } from "@/lib/helper/bunny";
import { useUploadStore } from "@/hooks/useUploadStore";

const zodSchema = z.object({
  course_id: z.string().min(1, "Course is required"),
})

export default function VideoManagementModal({
  isOpen,
  onClose,
  course,
  initialData,
}) {
  const { data: coursesData } = useAdminCourses()
  const { mutateAsync: uploadVideos } = useUploadVideos()

  const [isDragging, setIsDragging] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const { setFiles: setGlobalUploadingFiles, updateFileProgress, setUploading: setGlobalUploading, isUploading } = useUploadStore();
  const fileInputRef = useRef(null);

  const { formState, handleSubmit, setValue, watch, resetField } = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: initialData ? { course_id: initialData.course_id?.toString() } : {
      course_id: course?.id?.toString() || "",
    },
  })

  const selectedCourseId = watch("course_id");
  const { data: videosData = [], isLoading: videosLoading } = useVideos(selectedCourseId);
  const { mutateAsync: deleteVideo } = useDeleteVideo();

  const videos = videosData?.data

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await deleteVideo(id);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

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
    const videoFiles = Array.from(files).filter(f => f.type.startsWith("video/"));
    const mapped = await Promise.all(videoFiles.map(async (file) => ({
      id: generateId(),
      file,
      title: file.name.replace(/\.[^/.]+$/, ""),
      thumbnail: await generateVideoThumbnail(file),
    })));
    setPendingFiles(prev => [...prev, ...mapped]);
  };

  const removePendingFile = (id) => setPendingFiles(prev => prev.filter(f => f.id !== id));
  const updatePendingTitle = (id, title) => setPendingFiles(prev => prev.map(f => (f.id === id ? { ...f, title } : f)));
  const clearAll = () => setPendingFiles([]);

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  };

  const onSubmit = async (data) => {
    try {
      setGlobalUploading(true);
      const { course_id } = data;

      const res = await uploadVideos({
        course_id,
        files: pendingFiles.map(f => ({ id: f.id, title: f.title }))
      });

      const uploadMap = new Map(res.data.map(v => [v.clientId, v]));
      const filesWithUploadData = pendingFiles.map(f => ({
        ...f,
        uploadData: uploadMap.get(f.id),
        progress: 0
      }));

      setGlobalUploadingFiles(filesWithUploadData);
      setPendingFiles([]);
      onClose();

      filesWithUploadData.forEach(async (fileItem) => {
        if (!fileItem?.uploadData) return;
        try {
          await uploadToBunny({
            file: fileItem?.file,
            uploadData: fileItem?.uploadData?.upload,
            onProgress: (progress) => updateFileProgress(fileItem.id, progress),
            onInstance: (instance) => useUploadStore.getState().registerUpload(fileItem.id, instance),
          });
        } catch (err) {
          console.error(`Upload failed for ${fileItem.title}:`, err);
        }
      });

    } catch (err) {
      console.error("Initiating upload failed:", err);
      setGlobalUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-slate-900/60 backdrop-blur-[6px] p-4 animate-fade-in">
      <div className="bg-white w-full max-w-5xl rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] animate-scale-in overflow-hidden flex flex-col max-h-[92vh]">
        {/* HEADER */}
        <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white shrink-0">
          <div>
            <h3 className="flex items-center gap-3 font-bold text-xl tracking-tight">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                {initialData ? <Edit size={22} /> : <Plus size={22} />}
              </div>
              <div>
                <span className="block leading-tight">{initialData ? "Edit Lesson" : "Add Content"}</span>
                <span className="block opacity-70 font-medium text-[11px] uppercase tracking-[0.05em]">
                  {initialData ? "Modify existing metadata" : "Upload new educational videos"}
                </span>
              </div>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="bg-black/10 hover:bg-white/20 p-2 rounded-full text-white transition-all active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 md:flex-row flex-col overflow-hidden">
          {/* LEFT: UPLOAD CONTROLS */}
          <div className="md:w-[42%] p-8 bg-white border-r border-slate-100 overflow-y-auto custom-scrollbar flex flex-col">
            <form className="flex flex-col flex-1 space-y-8">
              {/* SECTION: TARGET */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="bg-indigo-50 p-1.5 rounded-lg text-indigo-500">
                    <Save size={14} />
                  </div>
                  <label className="font-bold text-slate-700 text-[11px] uppercase tracking-widest">
                    Course Destination
                  </label>
                </div>
                <div className="relative">
                  <FieldGroup className="flex flex-col gap-2">
                    <FieldContent>
                      <Select
                        value={watch("course_id")}
                        onValueChange={(val) => setValue("course_id", val)}
                      >
                        <SelectTrigger className="border-slate-200 focus:border-indigo-500 hover:border-slate-300 bg-slate-50/50 rounded-2xl h-12 transition-all ring-0 focus:ring-0">
                          <SelectValue placeholder="Select target course" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100 shadow-xl p-1">
                          {coursesData?.data?.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()} className="rounded-xl hover:bg-slate-50 py-2.5">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-7 h-7 border border-slate-100">
                                  <AvatarImage src={`${imgUrl}${c.thumbnail}`} className="object-cover" />
                                  <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold text-[10px]">{c.title?.[0]}</AvatarFallback>
                                </Avatar>
                                <span className="font-semibold text-slate-700 text-sm">{c.title}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formState.errors.course_id && (
                        <p className="text-rose-500 font-medium text-[11px] mt-1.5 ml-1">{formState.errors.course_id.message}</p>
                      )}
                    </FieldContent>
                  </FieldGroup>
                </div>
              </div>

              {/* SECTION: DROPZONE */}
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2 px-1">
                  <div className="bg-violet-50 p-1.5 rounded-lg text-violet-500">
                    <Upload size={14} />
                  </div>
                  <label className="font-bold text-slate-700 text-[11px] uppercase tracking-widest">
                    Media Selector
                  </label>
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={`
                    flex-1 min-h-[220px] border-2 border-dashed rounded-[32px] p-8 flex flex-col items-center justify-center transition-all cursor-pointer group relative
                    ${isDragging ? "border-indigo-500 bg-indigo-50/50 scale-[0.98]" : "border-slate-200 bg-slate-50/30 hover:border-indigo-300 hover:bg-indigo-50/10"}
                  `}
                >
                  <input ref={fileInputRef} type="file" multiple accept="video/*" onChange={onFileChange} className="hidden" />

                  <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center mb-5 transition-all duration-300 ${isDragging ? "bg-indigo-600 text-white shadow-xl translate-y-[-8px]" : "bg-white text-indigo-600 shadow-sm group-hover:shadow-indigo-100 group-hover:scale-105"}`}>
                    <Upload size={28} />
                  </div>

                  <h5 className="font-bold text-slate-800 text-base mb-1">Drag video lessons here</h5>
                  <p className="text-slate-400 text-xs text-center max-w-[200px] leading-relaxed">
                    Quickly add multiple lessons to your course. Support for MP4, MOV, AVI.
                  </p>

                  <div className="mt-6 px-4 py-1.5 bg-slate-100 group-hover:bg-indigo-100 rounded-full text-slate-500 group-hover:text-indigo-600 font-bold text-[10px] uppercase tracking-wider transition-colors">
                    Click to browse
                  </div>
                </div>
              </div>

              {/* ACTION: UPLOAD */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isUploading || (pendingFiles.length === 0 && !initialData)}
                  className={`
                    w-full py-4 rounded-[20px] font-bold text-white shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.97]
                    ${isUploading ? "bg-indigo-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:shadow-indigo-200 hover:translate-y-[-2px]"}
                    ${(pendingFiles.length === 0 && !initialData) ? "opacity-40 grayscale pointer-events-none" : ""}
                  `}
                >
                  {isUploading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <div className="bg-white/20 p-1 rounded-lg">
                      <Plus size={16} />
                    </div>
                  )}
                  {isUploading ? "Initializing..." : `Publish ${pendingFiles.length} Lesson${pendingFiles.length !== 1 ? "s" : ""}`}
                </button>
                {isUploading && (
                  <p className="mt-4 font-bold text-indigo-500 text-[10px] text-center uppercase tracking-widest animate-pulse italic">
                    Pushing to background queue...
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* RIGHT: LISTS */}
          <div className="flex-1 bg-slate-50/50 p-8 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-10 pr-2">

              {/* SECTION: SELECTED */}
              <div className="space-y-5">
                <div className="flex justify-between items-center bg-white/40 p-1 pr-3 rounded-full">
                  <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm">
                    <div className="bg-indigo-500 w-1.5 h-1.5 rounded-full animate-pulse"></div>
                    <span className="font-bold text-slate-700 text-[10px] uppercase tracking-wider">Queue ({pendingFiles.length})</span>
                  </div>
                  {pendingFiles.length > 0 && (
                    <button onClick={clearAll} className="font-bold text-slate-400 hover:text-rose-500 text-[10px] transition-colors">
                      Clear All
                    </button>
                  )}
                </div>

                {pendingFiles.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-slate-200 rounded-[28px] flex flex-col items-center justify-center text-slate-300">
                    <FileVideo size={32} className="opacity-30 mb-2" />
                    <p className="text-[11px] font-medium uppercase tracking-wider">No lessons selected</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {pendingFiles.map((item) => (
                      <div key={item.id} className="group bg-white p-3 rounded-2xl shadow-sm border border-white hover:border-indigo-100 hover:shadow-md transition-all flex items-center gap-4 animate-scale-in">
                        <div className="w-16 h-10 rounded-xl overflow-hidden bg-slate-900 shadow-inner shrink-0 relative flex items-center justify-center">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} className="w-full h-full object-cover opacity-80" />
                          ) : (
                            <FileVideo className="text-white opacity-40" size={16} />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <input
                            className="bg-transparent border-none outline-none w-full font-bold text-slate-800 text-sm focus:text-indigo-600 transition-colors"
                            value={item.title}
                            onChange={(e) => updatePendingTitle(item.id, e.target.value)}
                          />
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-slate-400 text-[10px] font-medium">Video File</span>
                            <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                            <span className="text-slate-400 text-[10px] font-medium uppercase">{(item.file.size / (1024 * 1024)).toFixed(1)} MB</span>
                          </div>
                        </div>

                        <button onClick={() => removePendingFile(item.id)} className="opacity-0 group-hover:opacity-100 bg-slate-50 hover:bg-rose-50 p-2 rounded-xl text-slate-400 hover:text-rose-500 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION: EXISTING */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 bg-indigo-50/50 w-fit px-4 py-1.5 rounded-full">
                  <PlayCircle size={14} className="text-indigo-500" />
                  <span className="font-bold text-slate-600 text-[10px] uppercase tracking-wider">existing videos in course ({videos?.length})</span>
                </div>

                {videosLoading ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-400" /></div>
                ) : videos?.length === 0 ? (
                  <div className="py-12 bg-white/30 border border-slate-100 rounded-[28px] text-center border-dashed">
                    <FileVideo className="mx-auto mb-3 text-slate-200" size={40} />
                    <p className="text-slate-400 text-xs font-medium">Course library is empty</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {videos?.map((video) => (
                      <div key={video.id} className="group bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-slate-50 hover:border-indigo-100 hover:bg-white transition-all flex justify-between items-center">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:from-indigo-50 group-hover:to-indigo-100 transition-all duration-300">
                            <PlayCircle size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 text-sm truncate leading-tight">{video.title}</p>
                            <p className="text-slate-400 text-[10px] mt-0.5 truncate uppercase tracking-wide font-medium">Ready to play</p>
                          </div>
                        </div>
                        <button onClick={() => handleDelete(video.id)} className="opacity-0 group-hover:opacity-100 bg-slate-50 hover:bg-rose-50 p-2.5 rounded-xl text-slate-300 hover:text-rose-500 transition-all active:scale-90">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
