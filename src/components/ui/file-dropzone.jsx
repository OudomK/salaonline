import { useEffect, useRef, useState } from "react";
import { Upload, X, File as FileIcon, FileVideo, FileAudio, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export function FileDropzone({
    value,
    onChange,
    accept = "image/*",
    previewUrl,
    height = "h-48",
    label = "Drag & drop file",
    error,
    multiple = false,
    maxSize = 10 * 1024 * 1024, // 10MB default
    onUpload,
    uploadProgress = 0,
    isUploading = false,
}) {
    const inputRef = useRef(null);
    const [previews, setPreviews] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [fileErrors, setFileErrors] = useState([]);

    // Sync previews from value or previewUrl
    useEffect(() => {
        // Debug logging
        console.log('FileDropzone - value:', value, 'previewUrl:', previewUrl);

        // When editing with existing image, prioritize previewUrl (full URL) over value (path)
        if (previewUrl && (!value || typeof value === 'string')) {
            console.log('Using previewUrl:', previewUrl);
            setPreviews([previewUrl]);
            return;
        }

        if (!value) {
            console.log('No value, clearing previews');
            setPreviews([]);
            return;
        }

        if (multiple && Array.isArray(value)) {
            const urls = value.map((file) => {
                if (typeof file === 'string') return file;
                return URL.createObjectURL(file);
            });
            console.log('Multiple files previews:', urls);
            setPreviews(urls);
        } else if (!multiple) {
            if (value instanceof File) {
                const blobUrl = URL.createObjectURL(value);
                console.log('File object preview:', blobUrl);
                setPreviews([blobUrl]);
            } else if (typeof value === 'string') {
                console.log('String URL preview:', value);
                setPreviews([value]);
            }
        }
    }, [value, multiple, previewUrl]);

    const validateFile = (file) => {
        const errors = [];

        // Check file size
        if (file.size > maxSize) {
            errors.push(`${file.name} exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`);
        }

        // Check file type
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const isAccepted = acceptedTypes.some(type => {
            if (type.endsWith('/*')) {
                const baseType = type.split('/*')[0];
                return file.type.startsWith(baseType + '/');
            }
            return file.type === type;
        });

        if (!isAccepted) {
            errors.push(`${file.name} is not a supported file type`);
        }

        return errors;
    };

    const handleFiles = (files) => {
        if (!files || files.length === 0) return;

        const fileList = Array.from(files);
        const errors = [];
        const validFiles = fileList.filter(file => {
            const fileErrors = validateFile(file);
            if (fileErrors.length > 0) {
                errors.push(...fileErrors);
                return false;
            }
            return true;
        });

        setFileErrors(errors);

        if (validFiles.length === 0) return;

        const selected = multiple ? validFiles : validFiles[0];
        onChange(selected);
    };

    const removeFile = (index) => {
        if (!multiple) {
            onChange(null);
            setPreviews([]);
            setFileErrors([]);
            return;
        }

        const updated = value.filter((_, i) => i !== index);
        onChange(updated);
    };

    const getFileIcon = (fileName) => {
        const extension = fileName?.split('.').pop()?.toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'jfif'].includes(extension)) {
            return <ImageIcon className="h-6 w-6" />;
        }
        if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension)) {
            return <FileVideo className="h-6 w-6 text-blue-500" />;
        }
        if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) {
            return <FileAudio className="h-6 w-6 text-purple-500" />;
        }
        return <FileIcon className="h-6 w-6 text-gray-500" />;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="space-y-2">
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFiles(e.dataTransfer.files);
                }}
                onClick={() => !isUploading && inputRef.current?.click()}
                className={cn(
                    "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 transition-all duration-200 p-6",
                    previews.length > 0 ? "h-auto min-h-48" : height,
                    "hover:border-primary/50 hover:bg-primary/5",
                    isDragging && "border-primary bg-primary/10 scale-[1.02]",
                    error ? "border-destructive bg-destructive/5" : "border-border",
                    isUploading && "cursor-not-allowed opacity-60"
                )}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    hidden
                    disabled={isUploading}
                    onChange={(e) => handleFiles(e.target.files)}
                />

                {previews.length > 0 ? (
                    <div
                        className={cn(
                            "grid w-full gap-4",
                            multiple ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-2"
                        )}
                    >
                        {previews.map((src, index) => {
                            const file = multiple ? value[index] : value;
                            const fileName = file?.name || '';
                            const fileSize = file?.size ? formatFileSize(file.size) : '';
                            const isImage = src && (src.startsWith('blob:') || src.startsWith('data:') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(src));

                            return (
                                <div key={index} className={cn(
                                    "relative group rounded-lg border overflow-hidden",
                                    isImage ? "aspect-square" : "aspect-[4/3]"
                                )}>
                                    {isImage ? (
                                        <img
                                            src={src}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full bg-muted/30 p-4">
                                            {getFileIcon(fileName)}
                                            <p className="text-xs font-medium text-center mt-2 truncate w-full">
                                                {fileName || 'File'}
                                            </p>
                                            {fileSize && (
                                                <p className="text-[10px] text-muted-foreground">{fileSize}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Upload Progress Overlay */}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
                                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                                            <Progress value={uploadProgress} className="w-16 h-2" />
                                            <span className="text-white text-xs font-medium">{uploadProgress}%</span>
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        disabled={isUploading}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(index);
                                        }}
                                        className={cn(
                                            "absolute top-2 right-2 rounded-full bg-background/90 backdrop-blur-sm p-1.5 text-foreground shadow-lg transition-all",
                                            "hover:bg-destructive hover:text-destructive-foreground",
                                            "opacity-0 group-hover:opacity-100",
                                            isUploading && "opacity-0 cursor-not-allowed"
                                        )}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>

                                    {/* File info badge for images */}
                                    {isImage && fileName && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-[10px] truncate">{fileName}</p>
                                            {fileSize && (
                                                <p className="text-white/70 text-[9px]">{fileSize}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Add more button for multiple files */}
                        {multiple && !isUploading && (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    inputRef.current?.click();
                                }}
                                className="relative aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer flex items-center justify-center group"
                            >
                                <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
                                    <Upload className="h-8 w-8 mb-1" />
                                    <span className="text-xs font-medium">Add More</span>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className={cn(
                            "rounded-full p-4 mb-4 transition-all",
                            isDragging ? "bg-primary/20" : "bg-muted"
                        )}>
                            <Upload className={cn(
                                "h-10 w-10 transition-all",
                                isDragging ? "text-primary scale-110" : "text-muted-foreground/50"
                            )} />
                        </div>
                        <p className="text-sm font-semibold text-foreground mb-1">
                            {multiple ? "Drop files here or click to upload" : label}
                        </p>
                        <p className="text-xs text-muted-foreground text-center max-w-xs">
                            Supports: {accept.split(',').join(', ').replace(/\*/g, '')} • Max {Math.round(maxSize / 1024 / 1024)}MB
                        </p>
                    </div>
                )}
            </div>

            {/* Error Messages */}
            {(error || fileErrors.length > 0) && (
                <div className="space-y-1">
                    {error && (
                        <p className="text-xs text-destructive font-medium flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {error}
                        </p>
                    )}
                    {fileErrors.map((fileError, idx) => (
                        <p key={idx} className="text-xs text-destructive font-medium flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {fileError}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}
