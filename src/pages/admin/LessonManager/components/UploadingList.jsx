import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronUp, ChevronDown, CheckCircle2, XCircle, Loader2, X, RotateCcw, FileUp } from "lucide-react";
import { useState, useRef } from "react";
import { useUploadStore } from "@/hooks/useUploadStore";
import { uploadToBunny } from "@/lib/helper/bunny";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function UploadingList() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {
    uploadingFiles: files,
    clearUploads,
    isUploading,
    updateFileProgress,
    updateFileObject,
    registerUpload,
    cancelUpload,
    setUploading
  } = useUploadStore();

  const fileInputRef = useRef(null);
  const [activeFileId, setActiveFileId] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null); // { id, title, type: 'single' | 'all' }

  if (!isUploading || !files || files.length === 0) return null;

  const totalFiles = files.length;
  const completedFiles = files.filter(f => f.progress === 100).length;

  const handleResume = (fileId) => {
    setActiveFileId(fileId);
    fileInputRef.current?.click();
  };

  const onFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeFileId) return;

    const fileItem = files.find(f => f.id === activeFileId);
    if (!fileItem) return;

    // Update store with the new file object
    updateFileObject(activeFileId, file);

    // Attempt to resume upload
    try {
      setUploading(true);
      await uploadToBunny({
        file: file,
        uploadData: fileItem.uploadData?.upload,
        onProgress: (progress) => {
          updateFileProgress(fileItem.id, progress);
        },
        onInstance: (instance) => {
          registerUpload(fileItem.id, instance);
        },
      });
    } catch (err) {
      console.error("Resumption failed:", err);
    } finally {
      setActiveFileId(null);
      e.target.value = '';
    }
  };

  return (
    <div className="right-6 bottom-6 z-[9999] fixed w-80 animate-in slide-in-from-bottom-5">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileSelect}
        className="hidden"
        accept="video/*"
      />

      <Card className="bg-white shadow-2xl border-none rounded-2xl overflow-hidden overflow-y-auto border-gray-100 border">
        <CardHeader
          className="flex flex-row justify-between items-center bg-[#6366f1] p-4 text-white cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="flex flex-col">
            <CardTitle className="font-bold text-sm tracking-tight text-white">
              Uploading {totalFiles} Lesson{totalFiles !== 1 ? 's' : ''}
            </CardTitle>
            <p className="opacity-80 text-[10px]">
              {completedFiles} of {totalFiles} completed
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isCollapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (completedFiles === totalFiles) {
                  clearUploads();
                } else {
                  setCancelTarget({ type: 'all', title: 'All ongoing uploads' });
                }
              }}
              className="hover:bg-white/20 p-1 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </CardHeader>

        <AlertDialog open={!!cancelTarget} onOpenChange={() => setCancelTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently stop the upload for{" "}
                <span className="font-bold text-indigo-600">
                  {cancelTarget?.title}
                </span>.
                This action cannot be undone and any progress will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCancelTarget(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => {
                  if (cancelTarget.type === 'all') {
                    clearUploads();
                  } else {
                    cancelUpload(cancelTarget.id);
                  }
                  setCancelTarget(null);
                }}
              >
                Yes, Stop Upload
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {!isCollapsed && (
          <CardContent className="space-y-4 p-4 max-h-80 overflow-y-auto custom-scrollbar">
            {files.map((file) => {
              const needsReattach = !file.file && file.progress < 100;

              return (
                <div key={file.id} className="space-y-2">
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {file.progress === 100 ? (
                        <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                      ) : needsReattach ? (
                        <RotateCcw size={14} className="text-amber-500 shrink-0 animate-pulse" />
                      ) : file.status === "error" ? (
                        <XCircle size={14} className="text-red-500 shrink-0" />
                      ) : (
                        <Loader2 size={14} className="text-indigo-500 animate-spin shrink-0" />
                      )}
                      <span className={`text-xs truncate font-medium ${needsReattach ? 'text-amber-600' : 'text-gray-700'}`}>
                        {file.title || "Untitled Video"}
                      </span>
                    </div>
                    {needsReattach ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleResume(file.id)}
                          className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-md font-bold text-[10px] text-amber-600 transition-colors"
                        >
                          <FileUp size={10} />
                          Resume
                        </button>
                        <button
                          onClick={() => setCancelTarget({ id: file.id, title: file.title, type: 'single' })}
                          className="hover:bg-red-50 p-1.5 rounded-lg text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[10px] text-gray-400">
                          {Math.round(file.progress || 0)}%
                        </span>
                        {file.progress < 100 && (
                          <button
                            onClick={() => setCancelTarget({ id: file.id, title: file.title, type: 'single' })}
                            className="hover:bg-red-50 p-1 rounded-lg text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`absolute inset-y-0 left-0 transition-all duration-300 ${file.progress === 100 ? 'bg-green-500' : needsReattach ? 'bg-amber-400 opacity-50' : 'bg-indigo-500'
                        }`}
                      style={{ width: `${file.progress || 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
