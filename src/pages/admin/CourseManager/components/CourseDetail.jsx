import { useState } from "react";
import {
    ArrowLeft,
    Plus,
    PlayCircle,
    Clock,
    Trash2,
    Video,
    Search,
    MoreVertical,
    Edit2,
    ExternalLink,
    ChevronUp,
    ChevronDown,
    GripVertical,
    RefreshCw,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVideos, useDeleteVideo, useReorderVideos } from "@/hooks/api/useVideo";
import VideoManagementModal from "@/pages/admin/LessonManager/components/VideoManagementModal";
import { useVideoStore } from "@/hooks/useVideoStore";
import { useUploadStore } from "@/hooks/useUploadStore";
import { toast } from "sonner";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function CourseDetail({ course, onBack }) {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const playVideo = useVideoStore(s => s.playVideo);
    const { isUploading } = useUploadStore();

    const { data: videosData, isLoading } = useVideos(course.id);
    const { mutateAsync: deleteVideo } = useDeleteVideo();
    const { mutateAsync: reorderVideos } = useReorderVideos();

    const videos = videosData?.data || [];

    const filteredVideos = videos.filter((v) =>
        v.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (window.confirm("តើអ្នកប្រាកដជាចង់លុបវីដេអូនេះមែនទេ?")) {
            try {
                await deleteVideo(id);
                toast.success("លុបវីដេអូបានសម្រេច");
            } catch (err) {
                toast.error("ការលុបមិនបានសម្រេច");
            }
        }
    };

    const handlePreview = (video) => {
        playVideo({ id: video.id, title: video.title });
    };

    // Refetch when all uploads complete
    useEffect(() => {
        if (!isUploading) {
            queryClient.invalidateQueries({ queryKey: ["videos", "course", course.id] });
        }
    }, [isUploading, course.id, queryClient]);

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(videos);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update order field based on new array indices
        const updatedVideos = items.map((v, i) => ({
            id: v.id,
            video_order: i + 1
        }));

        try {
            await reorderVideos({
                items: updatedVideos
            });
            // We invalidate directly on success to show immediate state
            queryClient.invalidateQueries({ queryKey: ["videos", "course", course.id] });
            toast.success("លំដាប់វីដេអូត្រូវបានរក្សាទុក");
        } catch (err) {
            toast.error("ការរក្សាទុកលំដាប់វីដេអូមិនបានសម្រេច");
        }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 font-khmer-os-battambang">
                            {course.title}
                        </h1>
                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <Video size={14} /> {videos.length} Videos in Library
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => queryClient.invalidateQueries({ queryKey: ["videos", "course", course.id] })}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 border-gray-100"
                        title="Refresh List"
                    >
                        <RefreshCw size={18} />
                    </Button>
                    <Button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="bg-[#00B4F6] hover:bg-[#00a3df] text-white rounded-xl px-6 font-bold gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-all"
                    >
                        <Plus size={18} /> Upload Video
                    </Button>
                </div>
            </div>

            {/* SEARCH AND TOOLS */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="ស្វែងរកចំណងជើងវីដេអូ..."
                        className="w-full pl-10 pr-4 py-2 md:w-96 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#00B4F6] transition-all font-khmer-os-battambang"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* VIDEO LIST */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-20 text-center">
                        <div className="w-8 h-8 border-4 border-[#00B4F6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400 text-sm">Loading videos...</p>
                    </div>
                ) : filteredVideos.length === 0 ? (
                    <div className="p-20 text-center border-2 border-dashed border-gray-100 m-6 rounded-2xl">
                        <Video size={48} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="font-bold text-gray-900 mb-1">No videos found</h3>
                        <p className="text-gray-400 text-sm mb-6">Start by uploading your first educational video.</p>
                        <Button
                            onClick={() => setIsUploadModalOpen(true)}
                            variant="outline"
                            className="border-[#00B4F6] text-[#00B4F6] hover:bg-blue-50 rounded-xl font-bold"
                        >
                            Upload Now
                        </Button>
                    </div>
                ) : (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="videos">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="divide-y divide-gray-50"
                                >
                                    {videos.length > 0 && videos
                                        .filter(v => v.title.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((video, index) => (
                                            <Draggable key={video.id} draggableId={video.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`group flex items-center gap-4 p-4 transition-colors ${snapshot.isDragging ? 'bg-blue-50/50 shadow-md ring-1 ring-blue-100' : 'hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {/* Drag Handle */}
                                                        <div
                                                            {...provided.dragHandleProps}
                                                            className="p-1 text-gray-300 hover:text-gray-400 cursor-grab active:cursor-grabbing"
                                                        >
                                                            <GripVertical size={18} />
                                                        </div>

                                                        {/* Video Thumbnail/Icon */}
                                                        <div
                                                            className="relative w-32 aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer shrink-0"
                                                            onClick={() => handlePreview(video)}
                                                        >
                                                            {video.thumbnail_webp ? (
                                                                <img src={video.thumbnail_webp} className="w-full h-full object-cover opacity-80" alt="" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                                    <PlayCircle size={24} />
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                                                <PlayCircle size={32} className="text-white" />
                                                            </div>
                                                            <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] text-white font-bold">
                                                                {formatDuration(video.duration)}
                                                            </div>
                                                        </div>

                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-gray-900 text-sm truncate mb-1 font-khmer-os-battambang">
                                                                {video.title}
                                                            </h4>
                                                            <div className="flex items-center gap-3 text-[11px] text-gray-400">
                                                                <span className="flex items-center gap-1">
                                                                    <Clock size={12} /> {formatDuration(video.duration)}
                                                                </span>
                                                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                                <Badge className={`px-2 py-0 border-0 text-[10px] ${video.status === 'ready' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                                                    {video.status}
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-9 w-9 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={() => handleDelete(video.id)}
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
            </div>

            <VideoManagementModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                course={course}
            />
        </div>
    );
}
