import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Non-persistent map for browser-only upload instances
const activeUploads = new Map();

export const useUploadStore = create(
    persist(
        (set, get) => ({
            uploadingFiles: [],
            isUploading: false,

            setFiles: (files) => set({
                uploadingFiles: files,
                isUploading: files.length > 0
            }),

            addFiles: (newFiles) => set((state) => {
                const updatedFiles = [...state.uploadingFiles, ...newFiles];
                return {
                    uploadingFiles: updatedFiles,
                    isUploading: updatedFiles.length > 0
                };
            }),

            updateFileProgress: (id, progress) => set((state) => ({
                uploadingFiles: state.uploadingFiles.map((f) =>
                    f.id === id ? { ...f, progress } : f
                ),
            })),

            updateFileObject: (id, fileObject) => set((state) => ({
                uploadingFiles: state.uploadingFiles.map((f) =>
                    f.id === id ? { ...f, file: fileObject } : f
                ),
            })),

            registerUpload: (id, uploadInstance) => {
                activeUploads.set(id, uploadInstance);
            },

            cancelUpload: (id) => {
                const upload = activeUploads.get(id);
                if (upload) {
                    upload.abort();
                    activeUploads.delete(id);
                }
                set((state) => ({
                    uploadingFiles: state.uploadingFiles.filter(f => f.id !== id),
                    isUploading: state.uploadingFiles.length > 1 // Adjust isUploading
                }));
            },

            setUploading: (status) => set({ isUploading: status }),

            clearUploads: () => {
                // Abort all active uploads
                activeUploads.forEach((upload) => upload.abort());
                activeUploads.clear();
                set({ uploadingFiles: [], isUploading: false });
            },
        }),
        {
            name: 'upload-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                ...state,
                uploadingFiles: state.uploadingFiles.map(({ file, ...rest }) => rest),
            }),
        }
    )
);
