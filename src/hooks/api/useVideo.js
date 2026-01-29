import { videoService } from "@/lib/api/services/video.service"
import { useMutation } from "@tanstack/react-query"


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

export const useSaveVideosBulk = () => {
    return useMutation({
        mutationFn: (data) => videoService.saveVideosBulk(data),
    })
}