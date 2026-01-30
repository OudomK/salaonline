import { videoService } from "@/lib/api/services/video.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUploadVideos = () => {
  return useMutation({
    mutationFn: (videoData) => {
      return videoService.uploadVideos(videoData);
    },
    onSuccess: (response) => {
      console.log("Backend created videos, got Bunny upload info:");
    },
    onError: (err) => {
      console.error("Error creating videos:");
    },
  });
};

export const useVideos = (courseId) => {
  return useQuery({
    queryKey: ["videos", "course", courseId],
    queryFn: () =>
      videoService.getVideosByCourse(courseId).then((res) => res.data),
    enabled: !!courseId,
  });
};

export const useSaveVideosBulk = () => {
  return useMutation({
    mutationFn: (data) => videoService.saveVideosBulk(data),
  });
};

export const useReorderVideos = () => {
  return useMutation({
    mutationFn: (data) => videoService.reorderVideos(data),
  });
};

export const useGetAllVideos = (params = {}) => {
  return useQuery({
    queryKey: ["videos", params],
    queryFn: async () => {
      const res = await videoService.getAllVideos(params);
      console.log(res.data);
      return res.data;
    },
  });
};

export const useWatchVideoAdmin = (videoId) => {
  return useQuery({
    queryKey: ["watch-video-admin", videoId],
    queryFn: () =>
      videoService.watchVideoAdmin(videoId).then((res) => res.data),
    enabled: !!videoId,
  });
};

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => videoService.deleteVideo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
};
