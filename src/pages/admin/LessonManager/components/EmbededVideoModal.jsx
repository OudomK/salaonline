import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWatchVideoAdmin } from "@/hooks/api/useVideo";
import { Loader2, AlertCircle, Play, Minimize2, X, Maximize2 } from "lucide-react";
import { useVideoStore } from "@/hooks/useVideoStore";

const EmbededVideoModal = () => {
  const { activeVideo, isOpen, setOpen, closeVideo, isMinimized, setMinimized } = useVideoStore();
  const {
    data: videoData,
    isLoading,
    isError,
    error,
  } = useWatchVideoAdmin(activeVideo?.id, {
    enabled: !!activeVideo?.id
  });

  const iframeRef = useRef(null);
  const playerRef = useRef(null);

  const video = videoData?.data;

  useEffect(() => {
    // We keep the iframe mounted as long as activeVideo exists
    if (!video?.iframeUrl || !iframeRef.current) return;

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
  }, [video?.iframeUrl, activeVideo?.id]);

  if (!activeVideo) return null;

  return (
    <>
      {/* FULL MODAL VIEW */}
      <Dialog open={isOpen && !isMinimized} onOpenChange={(val) => setOpen(val)}>
        <DialogContent className="bg-slate-950/95 shadow-[0_0_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-0 border border-slate-800/50 rounded-[32px] sm:max-w-5xl overflow-hidden [&>button]:text-white [&>button]:opacity-100 [&>button]:hover:bg-white/10 [&>button]:p-2 [&>button]:rounded-full [&>button]:transition-all [&>button]:z-[70] [&>button]:right-4 [&>button]:top-4">

          <div className="group relative bg-slate-900 w-full aspect-video overflow-hidden">
            {/* Header Overlay (Floating) */}
            <div className="absolute top-0 left-0 right-0 p-6 z-[60] flex justify-between items-start bg-gradient-to-b from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="flex items-center gap-3 mt-1">
                <div className="bg-indigo-500/20 p-2 rounded-xl text-indigo-400">
                  <Play size={16} fill="currentColor" />
                </div>
                <div className="flex flex-col">
                  <DialogTitle className="font-bold text-white text-lg truncate max-w-[400px]">
                    {activeVideo.title || "Video Preview"}
                  </DialogTitle>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Previewing Library Content</span>
                </div>
              </div>

              {/* Action Buttons Area (Top Right) */}
              <div className="flex items-center gap-2 pointer-events-auto mr-10 mt-1">
                <button
                  onClick={() => setMinimized(true)}
                  className="text-white bg-white/5 hover:bg-white/20 p-2 rounded-full transition-all backdrop-blur-md border border-white/10"
                  title="Minimize"
                >
                  <Minimize2 size={16} />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 bg-slate-950/40 backdrop-blur-sm transition-all">
                <Loader2 className="text-indigo-500 animate-spin" size={48} />
              </div>
            ) : isError || !video ? (
              <div className="absolute inset-0 flex flex-col justify-center items-center gap-6 p-8 text-center">
                <AlertCircle size={40} className="text-rose-500" />
                <p className="text-white font-bold">{error?.response?.data?.message || "Error loading video"}</p>
              </div>
            ) : (
              <iframe
                id={`video-iframe-${activeVideo.id}`}
                ref={iframeRef}
                src={video.iframeUrl}
                loading="lazy"
                className="absolute inset-0 w-full h-full border-none z-10"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
              />
            )}

            {/* Click-through protection / Overlay for interactions */}
            <div className="absolute inset-0 z-20 pointer-events-none group-hover:bg-black/5 transition-colors" />
          </div>
        </DialogContent>
      </Dialog>

      {/* PERSISTENT HIDDEN / MINI PLAYER (To keep PiP alive when modal closed) */}
      {isMinimized && (
        <div className="fixed bottom-6 right-6 z-[60] group">
          <div className="relative bg-black border border-slate-800 shadow-2xl rounded-2xl overflow-hidden w-80 aspect-video transition-all">
            <iframe
              id={`video-iframe-mini-${activeVideo.id}`}
              src={video?.iframeUrl}
              className="w-full h-full border-none pointer-events-auto"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            />

            {/* Mini Player Controls - Minimalist style at top right */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <button
                onClick={() => setMinimized(false)}
                className="bg-black/60 hover:bg-indigo-500 text-white p-1.5 rounded-lg transition-all backdrop-blur-md border border-white/10 pointer-events-auto shadow-lg"
                title="Restore"
              >
                <Maximize2 size={14} />
              </button>
              <button
                onClick={closeVideo}
                className="bg-black/60 hover:bg-rose-500 text-white p-1.5 rounded-lg transition-all backdrop-blur-md border border-white/10 pointer-events-auto shadow-lg"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HIDDEN PERSISTENCE (If closed but we want PiP to maybe stay? usually unmounting is final though) */}
      {/* We use isMinimized for visual background play. If user closes completely, we kill it. */}
    </>
  );
};

export default EmbededVideoModal;
