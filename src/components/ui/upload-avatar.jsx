import { PlusIcon } from "lucide-react";
import { useState } from "react";

export const UploadAvatar = ({ onChange, previewUrl, className }) => {

    const [file, setFile] = useState(null);

    return (
        <>
            <div className={`w-20 h-20 border-2 overflow-hidden rounded-lg border-dashed hover:cursor-pointer flex items-center justify-center relative ${className}`}>

                {file ? (
                    <img
                        src={file}
                        alt="Preview"
                        className="w-full h-full object-cover object-center"
                    />
                ) : previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover object-center"
                    />
                ) : (
                    <PlusIcon className="w-5 h-5 text-muted-foreground" />
                )}
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                setFile(e.target.result); // Base64 preview
                            };
                            reader.readAsDataURL(file);

                            // Pass file object to parent
                            onChange(file);
                        }
                    }}
                />

            </div>
        </>
    );
};