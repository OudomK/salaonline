import { create } from 'zustand';

export const useVideoStore = create((set) => ({
    activeVideo: null, // { videoId, title, iframeUrl }
    isMinimized: false,
    isOpen: false,

    playVideo: (video) => set({
        activeVideo: video,
        isOpen: true,
        isMinimized: false
    }),

    closeVideo: () => set({
        isOpen: false,
        activeVideo: null
    }),

    setMinimized: (minimized) => set({
        isMinimized: minimized
    }),

    toggleMinimized: () => set((state) => ({
        isMinimized: !state.isMinimized
    })),

    setOpen: (open) => set({
        isOpen: open
    }),
}));
