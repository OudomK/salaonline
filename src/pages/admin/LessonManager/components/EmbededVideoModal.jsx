import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWatchVideoAdmin } from "@/hooks/api/useVideo";
import { Loader2, AlertCircle, Play } from "lucide-react";

const EmbededVideoModal = ({ isOpen, onClose, videoId, title }) => {
  const {
    data: videoData,
    isLoading,
    isError,
    error,
  } = useWatchVideoAdmin(videoId);
  const iframeRef = useRef(null);
  const playerRef = useRef(null);

  const video = videoData?.data;

  useEffect(() => {
    if (!video?.iframeUrl || !iframeRef.current || !isOpen) return;

    let isMounted = true;

    const initPlayer = () => {
      if (!iframeRef.current || !isMounted) return;

      try {
        if (
          playerRef.current &&
          typeof playerRef.current.destroy === "function"
        ) {
          playerRef.current.destroy();
        }

        playerRef.current = new window.playerjs.Player(iframeRef.current.id);

        playerRef.current.on("play", () => console.log("Video playing"));
        playerRef.current.on("pause", () => console.log("Video paused"));
        playerRef.current.on("ended", () => console.log("Video ended"));
      } catch (err) {
        console.error("PlayerJS initialization failed:", err);
      }
    };

    if (!window.playerjs) {
      const script = document.createElement("script");
      script.src = "//assets.mediadelivery.net/playerjs/playerjs-latest.min.js";
      script.async = true;
      script.onload = () => {
        if (isMounted) initPlayer();
      };
      document.body.appendChild(script);
    } else {
      initPlayer();
    }

    return () => {
      isMounted = false;
      if (
        playerRef.current &&
        typeof playerRef.current.destroy === "function"
      ) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [video?.iframeUrl, videoId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-950/95 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl p-0 border border-slate-800/50 rounded-[32px] sm:max-w-5xl overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-xl text-indigo-400">
              <Play size={18} fill="currentColor" />
            </div>
            <DialogTitle className="pr-8 font-bold text-white text-xl truncate">
              {title || "Video Preview"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="group relative bg-slate-900 mt-4 w-full aspect-video">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 bg-slate-950/40 backdrop-blur-sm transition-all">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
                <Loader2
                  className="relative text-indigo-500 animate-spin"
                  size={48}
                  strokeWidth={2.5}
                />
              </div>
              <p className="font-bold text-indigo-100 text-sm uppercase tracking-widest animate-pulse">
                Fetching Video...
              </p>
            </div>
          ) : isError || !videoId || !video ? (
            <div className="absolute inset-0 flex flex-col justify-center items-center gap-6 p-8 text-center">
              <div className="flex justify-center items-center bg-rose-500/10 shadow-2xl border border-rose-500/20 rounded-3xl w-20 h-20 text-rose-500">
                <AlertCircle size={40} strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <p className="font-bold text-slate-100 text-lg">
                  {isError
                    ? "Unable to load video"
                    : "Video configuration missing"}
                </p>
                <p className="max-w-[300px] text-slate-500 text-sm leading-relaxed">
                  {error?.response?.data?.message ||
                    "There was a problem connecting to the video server. Please try again later."}
                </p>
              </div>
            </div>
          ) : (
            <>
              <iframe
                id={`video-iframe-${videoId}`}
                ref={iframeRef}
                src={video.iframeUrl}
                loading="lazy"
                className="z-10 absolute inset-0 shadow-2xl border-none w-full h-full"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
              />
              {/* Subtle overlay when hovering header/footer */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none" />
            </>
          )}
        </div>

        <div className="flex justify-between items-center bg-slate-900/30 p-4 px-6 font-bold text-[10px] text-slate-500 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="bg-green-500 rounded-full w-1.5 h-1.5 animate-pulse" />
            Secure Stream
          </div>
          <span>Powered by Bunny.net</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmbededVideoModal;
