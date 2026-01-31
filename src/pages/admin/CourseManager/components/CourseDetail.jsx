import { useState, useEffect } from "react";
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
    Play,
    Eye,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVideos, useDeleteVideo, useReorderVideos } from "@/hooks/api/useVideo";
import VideoManagementModal from "@/pages/admin/LessonManager/components/VideoManagementModal";
import { useVideoStore } from "@/hooks/useVideoStore";
import { useUploadStore } from "@/hooks/useUploadStore";
import { toast } from "sonner";

export default function CourseDetail({ course, onBack }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const playVideo = useVideoStore(s => s.playVideo);
    const { isUploading } = useUploadStore();

    const { data: videosData, isLoading } = useVideos(course.id, {
        search: searchTerm,
        page,
        size: pageSize,
    });
    const { mutateAsync: deleteVideo } = useDeleteVideo();
    const { mutateAsync: reorderVideos } = useReorderVideos();

    const videos = videosData?.data || [];
    const pagination = videosData?.pagination || { page: 1, size: 10, total_items: 0, total_pages: 1 };

    console.log(pagination)

    // Reset to page 1 when search term changes
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

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
            setPage(1);
            // queryClient.invalidateQueries({ queryKey: ["videos", "course", course.id] });
        }
    }, [isUploading, course.id]);

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
                            <Video size={14} /> {pagination?.total_items} Videos in Library
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
                ) : videos.length === 0 ? (
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
                                    className="p-4 space-y-3"
                                >
                                    {videos.map((video, index) => (
                                        <Draggable draggableId={`video-${video.id}`} index={index}>
                                            {(provided, snapshot) => {
                                                const stats = video.bunnyStats;
                                                const watchPercent = stats
                                                    ? Math.min(
                                                        Math.round((stats.averageWatchTime / stats.length) * 100),
                                                        100
                                                    )
                                                    : 0;

                                                return (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`group relative p-5 rounded-2xl transition-all border-2
          ${snapshot.isDragging
                                                                ? "bg-blue-50/50 shadow-xl border-blue-200 scale-[1.02]"
                                                                : "bg-white border-gray-100 hover:border-blue-200 hover:shadow-lg"
                                                            }`}
                                                    >
                                                        {/* Drag Handle */}
                                                        <div
                                                            {...provided.dragHandleProps}
                                                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 p-1.5 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing bg-white rounded-lg shadow-sm border border-gray-100"
                                                        >
                                                            <GripVertical size={16} />
                                                        </div>

                                                        <div className="flex items-center gap-5 pl-6">
                                                            {/* Thumbnail */}
                                                            <div
                                                                className="relative w-40 aspect-video bg-gray-900 rounded-xl overflow-hidden shrink-0 cursor-pointer group/thumbnail shadow-md"
                                                                onClick={() => handlePreview(video)}
                                                            >
                                                                {video.thumbnail_webp ? (
                                                                    <img
                                                                        src={video.thumbnail_webp}
                                                                        alt={video.title}
                                                                        loading="lazy"
                                                                        className="w-full h-full object-cover opacity-90 group-hover/thumbnail:opacity-100 group-hover/thumbnail:scale-105 transition-all duration-300"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                                                                        <PlayCircle size={32} className="text-gray-600" />
                                                                    </div>
                                                                )}

                                                                {/* Play overlay */}
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumbnail:opacity-100 transition-opacity flex items-center justify-center">
                                                                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                                                        <Play size={16} className="text-[#00B4F6] ml-0.5" fill="currentColor" />
                                                                    </div>
                                                                </div>

                                                                {/* Duration Badge */}
                                                                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg text-[11px] text-white font-bold shadow-lg">
                                                                    {formatDuration(video.duration)}
                                                                </div>

                                                                {/* Status indicator */}
                                                                {stats?.status !== 4 && (
                                                                    <div className="absolute top-2 left-2 bg-orange-500 px-2 py-0.5 rounded-full">
                                                                        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Info */}
                                                            <div className="flex-1 min-w-0 space-y-2">
                                                                <div>
                                                                    <h4 className="font-bold text-gray-900 truncate text-base mb-1 group-hover:text-[#00B4F6] transition-colors">
                                                                        {video.title}
                                                                    </h4>
                                                                    <p className="text-xs text-gray-400 truncate">
                                                                        ID: {video.id.slice(0, 8)}...
                                                                    </p>
                                                                </div>

                                                                {/* Stats row */}
                                                                {stats && (
                                                                    <div className="flex flex-wrap items-center gap-3">
                                                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg">
                                                                            <Eye size={12} className="text-gray-400" />
                                                                            <span className="text-xs font-semibold text-gray-600">{stats.views}</span>
                                                                        </div>

                                                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg">
                                                                            <Clock size={12} className="text-gray-400" />
                                                                            <span className="text-xs font-semibold text-gray-600">{stats.averageWatchTime}s</span>
                                                                        </div>

                                                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg">
                                                                            <span className="text-xs font-semibold text-gray-600">{watchPercent}% avg watched</span>
                                                                        </div>

                                                                        <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-gray-200 text-gray-500">
                                                                            {stats.availableResolutions}
                                                                        </Badge>
                                                                    </div>
                                                                )}

                                                                {/* Engagement bar */}
                                                                {stats && (
                                                                    <div className="space-y-1">
                                                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                                                            <div
                                                                                className={`h-full transition-all duration-500 shadow-sm
                    ${watchPercent > 70
                                                                                        ? "bg-gradient-to-r from-green-400 to-green-500"
                                                                                        : watchPercent > 40
                                                                                            ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                                                                            : "bg-gradient-to-r from-red-400 to-red-500"
                                                                                    }`}
                                                                                style={{ width: `${watchPercent}%` }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Status + Actions */}
                                                            <div className="flex flex-col items-end gap-3 shrink-0">
                                                                <Badge
                                                                    className={`text-xs font-semibold px-3 py-1 shadow-sm
              ${stats?.status === 4
                                                                            ? "bg-green-50 text-green-700 border-green-200"
                                                                            : "bg-orange-50 text-orange-700 border-orange-200"
                                                                        }`}
                                                                >
                                                                    {stats?.status === 4 ? "✓ Ready" : "⏳ Processing"}
                                                                </Badge>

                                                                <div className="flex items-center gap-1">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-9 w-9 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-all"
                                                                        onClick={() => handleDelete(video.id)}
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }}
                                        </Draggable>

                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}

                {/* Pagination */}
                {pagination.total_pages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <div className="text-sm text-gray-600">
                            Showing {((pagination.page - 1) * pagination.size) + 1} to {Math.min(pagination.page * pagination.size, pagination.total_items)} of {pagination.total_items} videos
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={pagination.page === 1}
                                className="rounded-lg"
                            >
                                <ChevronLeft size={16} className="mr-1" /> Previous
                            </Button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((pageNum) => (
                                    <Button
                                        key={pageNum}
                                        variant={pagination.page === pageNum ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setPage(pageNum)}
                                        className={`w-9 h-9 rounded-lg ${pagination.page === pageNum ? "bg-[#00B4F6] hover:bg-[#009bd1]" : ""}`}
                                    >
                                        {pageNum}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(pagination.total_pages, p + 1))}
                                disabled={pagination.page === pagination.total_pages}
                                className="rounded-lg"
                            >
                                Next <ChevronRight size={16} className="ml-1" />
                            </Button>
                        </div>
                    </div>
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
