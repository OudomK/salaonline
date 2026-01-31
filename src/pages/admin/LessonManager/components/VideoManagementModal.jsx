import {
  X,
  Upload,
  Trash2,
  PlayCircle,
  Loader2,
  FileVideo,
  Save,
  Plus,
  Edit,
  GripVertical,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useAdminCourses } from "@/hooks/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { imgUrl } from "@/lib/helper/enviroment";
import { useEffect, useRef, useState } from "react";
import {
  useUploadVideos,
} from "@/hooks/api/useVideo";
import { uploadToBunny } from "@/lib/helper/bunny";
import { useUploadStore } from "@/hooks/useUploadStore";

const zodSchema = z.object({
  course_id: z.string().min(1, "Course is required"),
});

export default function VideoManagementModal({
  isOpen,
  onClose,
  course,
  initialData,
}) {
  const { data: coursesData } = useAdminCourses();
  const { mutateAsync: uploadVideos } = useUploadVideos();

  const [isDragging, setIsDragging] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const {
    setFiles: setGlobalUploadingFiles,
    updateFileProgress,
    setUploading: setGlobalUploading,
    isUploading,
  } = useUploadStore();
  const fileInputRef = useRef(null);

  const { formState, handleSubmit, setValue, watch, resetField } = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: initialData
      ? { course_id: initialData.course_id?.toString() }
      : {
        course_id: course?.id?.toString() || "",
      },
  });

  useEffect(() => {
    if (isOpen && course?.id) {
      setValue("course_id", course.id.toString());
    }
  }, [isOpen, course?.id, setValue]);

  const selectedCourseId = watch("course_id");

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
    const videoFiles = Array.from(files).filter((f) =>
      f.type.startsWith("video/"),
    );
    const mapped = await Promise.all(
      videoFiles.map(async (file) => ({
        id: generateId(),
        file,
        title: file.name.replace(/\.[^/.]+$/, ""),
        thumbnail: await generateVideoThumbnail(file),
      })),
    );
    setPendingFiles((prev) => [...prev, ...mapped]);
  };

  const removePendingFile = (id) =>
    setPendingFiles((prev) => prev.filter((f) => f.id !== id));
  const updatePendingTitle = (id, title) =>
    setPendingFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, title } : f)),
    );
  const clearAll = () => setPendingFiles([]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(pendingFiles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPendingFiles(items);
  };

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0)
      handleFiles(e.dataTransfer.files);
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
        files: pendingFiles.map((f) => ({ id: f.id, title: f.title })),
      });

      const uploadMap = new Map(res.data.map((v) => [v.clientId, v]));
      const filesWithUploadData = pendingFiles.map((f) => ({
        ...f,
        uploadData: uploadMap.get(f.id),
        progress: 0,
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
            onInstance: (instance) =>
              useUploadStore.getState().registerUpload(fileItem.id, instance),
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
      <div className="flex flex-col bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-[32px] w-full max-w-5xl max-h-[92vh] overflow-hidden animate-scale-in">
        {/* HEADER */}
        <div className="flex justify-between items-center bg-[#00a3df] p-4 text-white shrink-0">
          <div>
            <h3 className="flex items-center gap-3 font-bold text-xl tracking-tight">
              <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                {initialData ? <Edit size={22} /> : <Plus size={22} />}
              </div>
              <div>
                <span className="block leading-tight">
                  {initialData ? "Edit Lesson" : "Add Content"}
                </span>
                <span className="block opacity-70 font-medium text-[11px] uppercase tracking-[0.05em]">
                  {initialData
                    ? "Modify existing metadata"
                    : "Upload new educational videos"}
                </span>
              </div>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="bg-black/10 hover:bg-white/20 p-2 rounded-full text-white active:scale-95 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex md:flex-row flex-col flex-1 overflow-hidden">
            {/* LEFT: UPLOAD CONTROLS */}
            <div className="flex flex-col bg-white p-8 border-slate-100 border-r md:w-[42%] overflow-y-auto custom-scrollbar">
              <form className="flex flex-col flex-1 space-y-8">
                {/* SECTION: TARGET */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-1">
                    <div className="bg-[#00a3df]/20 p-1.5 rounded-lg text-[#00a3df]">
                      <Save size={14} />
                    </div>
                    <label className="font-bold text-[11px] text-slate-700 uppercase tracking-widest">
                      Course Destination
                    </label>
                  </div>
                  <div className="relative">
                    <FieldGroup className="flex flex-col gap-2">
                      <FieldContent>
                        {course ? (
                          <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-3 flex items-center gap-3">
                            <Avatar className="border border-slate-100 w-10 h-10">
                              <AvatarImage
                                src={`${imgUrl}${course.thumbnail}`}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-[#00a3df]/20 font-bold text-[#00a3df]">
                                {course.title?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 text-sm">
                                {course.title}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                                Selected Destination
                              </span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Select
                              value={watch("course_id")}
                              onValueChange={(val) => setValue("course_id", val)}
                            >
                              <SelectTrigger className="bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-2xl ring-0 focus:ring-0 h-12 transition-all">
                                <SelectValue placeholder="Select target course" />
                              </SelectTrigger>
                              <SelectContent className="shadow-xl p-1 border-slate-100 rounded-2xl">
                                {coursesData?.data?.map((c) => (
                                  <SelectItem
                                    key={c.id}
                                    value={c.id.toString()}
                                    className="hover:bg-slate-50 py-2.5 rounded-xl"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Avatar className="border border-slate-100 w-7 h-7">
                                        <AvatarImage
                                          src={`${imgUrl}${c.thumbnail}`}
                                          className="object-cover"
                                        />
                                        <AvatarFallback className="bg-indigo-100 font-bold text-[10px] text-indigo-600">
                                          {c.title?.[0]}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="font-semibold text-slate-700 text-sm">
                                        {c.title}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {formState.errors.course_id && (
                              <p className="mt-1.5 ml-1 font-medium text-[11px] text-rose-500">
                                {formState.errors.course_id.message}
                              </p>
                            )}
                          </>
                        )}
                      </FieldContent>
                    </FieldGroup>
                  </div>
                </div>

                {/* SECTION: DROPZONE */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 px-1">
                    <div className="bg-violet-50 p-1.5 rounded-lg text-violet-500">
                      <Upload size={14} />
                    </div>
                    <label className="font-bold text-[11px] text-slate-700 uppercase tracking-widest">
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
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={onFileChange}
                      className="hidden"
                    />

                    <div
                      className={`w-16 h-16 rounded-[24px] flex items-center justify-center mb-5 transition-all duration-300 ${isDragging ? "bg-indigo-600 text-white shadow-xl translate-y-[-8px]" : "bg-white text-indigo-600 shadow-sm group-hover:shadow-indigo-100 group-hover:scale-105"}`}
                    >
                      <Upload size={28} />
                    </div>

                    <h5 className="mb-1 font-bold text-slate-800 text-base">
                      Drag video lessons here
                    </h5>
                    <p className="max-w-[200px] text-slate-400 text-xs text-center leading-relaxed">
                      Quickly add multiple lessons to your course. Support for
                      MP4, MOV, AVI.
                    </p>

                    <div className="bg-slate-100 group-hover:bg-indigo-100 mt-6 px-4 py-1.5 rounded-full font-bold text-[10px] text-slate-500 group-hover:text-indigo-600 uppercase tracking-wider transition-colors">
                      Click to browse
                    </div>
                  </div>
                </div>

                {/* ACTION: UPLOAD */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={
                      isUploading || (pendingFiles.length === 0 && !initialData)
                    }
                    className={`
                    w-full py-4 rounded-[20px] font-bold text-white shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.97]
                    ${isUploading ? "bg-indigo-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:shadow-indigo-200 hover:translate-y-[-2px]"}
                    ${pendingFiles.length === 0 && !initialData ? "opacity-40 grayscale pointer-events-none" : ""}
                  `}
                  >
                    {isUploading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <div className="bg-white/20 p-1 rounded-lg">
                        <Plus size={16} />
                      </div>
                    )}
                    {isUploading
                      ? "Initializing..."
                      : `Publish ${pendingFiles.length} Lesson${pendingFiles.length !== 1 ? "s" : ""}`}
                  </button>
                  {isUploading && (
                    <p className="mt-4 font-bold text-[10px] text-indigo-500 text-center italic uppercase tracking-widest animate-pulse">
                      Pushing to background queue...
                    </p>
                  )}
                </div>
              </form>
            </div>

            {/* RIGHT: LISTS */}
            <div className="flex flex-col flex-1 bg-slate-50/50 p-8 overflow-hidden">
              <div className="flex flex-col flex-1 space-y-5 overflow-hidden">
                {/* SECTION: SELECTED */}
                <div className="space-y-5">
                  <div className="flex justify-between items-center bg-white/40 p-1 pr-3 rounded-full">
                    <div className="flex items-center gap-2 bg-white shadow-sm px-4 py-1.5 rounded-full">
                      <div className="bg-indigo-500 rounded-full w-1.5 h-1.5 animate-pulse"></div>
                      <span className="font-bold text-[10px] text-slate-700 uppercase tracking-wider">
                        Queue ({pendingFiles.length})
                      </span>
                    </div>
                    {pendingFiles.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="font-bold text-[10px] text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {pendingFiles.length === 0 ? (
                    <div className="flex flex-col justify-center items-center border-2 border-slate-200 border-dashed rounded-[28px] h-full border-opacity-50 text-slate-300">
                      <FileVideo size={32} className="opacity-30 mb-2" />
                      <p className="font-medium text-[11px] uppercase tracking-wider">
                        No lessons selected
                      </p>
                    </div>
                  ) : (
                    <Droppable droppableId="pending-files">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="gap-3 grid grid-cols-1 overflow-y-auto custom-scrollbar pr-2 max-h-full"
                        >
                          {pendingFiles.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`group flex items-center gap-4 bg-white shadow-sm p-3 border rounded-2xl transition-all ${snapshot.isDragging
                                    ? "shadow-lg ring-2 ring-indigo-500/20 border-indigo-200"
                                    : "hover:shadow-md border-white hover:border-indigo-100"
                                    }`}
                                >
                                  {/* Grip Handle */}
                                  <div
                                    {...provided.dragHandleProps}
                                    className="p-1 text-slate-300 hover:text-indigo-500 cursor-grab active:cursor-grabbing"
                                  >
                                    <GripVertical size={16} />
                                  </div>

                                  <div className="relative flex justify-center items-center bg-slate-900 shadow-inner rounded-xl w-16 h-10 overflow-hidden shrink-0">
                                    {item.thumbnail ? (
                                      <img
                                        src={item.thumbnail}
                                        className="opacity-80 w-full h-full object-cover"
                                      />
                                    ) : (
                                      <FileVideo
                                        className="opacity-40 text-white"
                                        size={16}
                                      />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <input
                                      className="bg-transparent border-none outline-none w-full font-bold text-slate-800 focus:text-indigo-600 text-sm transition-colors"
                                      value={item.title}
                                      onChange={(e) =>
                                        updatePendingTitle(item.id, e.target.value)
                                      }
                                    />
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="font-medium text-[10px] text-slate-400">
                                        Video File
                                      </span>
                                      <span className="bg-slate-200 rounded-full w-1 h-1"></span>
                                      <span className="font-medium text-[10px] text-slate-400 uppercase">
                                        {(item.file.size / (1024 * 1024)).toFixed(
                                          1,
                                        )}
                                        MB
                                      </span>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => removePendingFile(item.id)}
                                    className="bg-slate-50 hover:bg-rose-50 opacity-0 group-hover:opacity-100 p-2 rounded-xl text-slate-400 hover:text-rose-500 transition-all"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
