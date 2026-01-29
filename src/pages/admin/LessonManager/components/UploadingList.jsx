import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronUp, ChevronDown } from "lucide-react";
import * as tus from "tus-js-client";

export default function UploadList() {
  const [uploads, setUploads] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  const addFile = (file, uploadData) => {
    const id = crypto.randomUUID();
    const newUpload = {
      id,
      file,
      name: file.name,
      progress: 0,
      status: "uploading",
    };
    setUploads((prev) => [...prev, newUpload]);

    const upload = new tus.Upload(file, {
      endpoint: uploadData.endpoint,
      headers: uploadData.headers,
      metadata: { title: file.name, filetype: file.type },
      onProgress: (bytesUploaded, bytesTotal) => {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === id
              ? { ...u, progress: (bytesUploaded / bytesTotal) * 100 }
              : u,
          ),
        );
      },
      onSuccess: () => {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, progress: 100, status: "completed" } : u,
          ),
        );
      },
      onError: () => {
        setUploads((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status: "error" } : u)),
        );
      },
    });

    upload.findPreviousUploads().then((previousUploads) => {
      if (previousUploads.length)
        upload.resumeFromPreviousUpload(previousUploads[0]);
      upload.start();
    });
  };

  const handleAddDemo = () => {
    const file = new File([""], `video_${uploads.length + 1}.mp4`);
    const dummyUploadData = {
      endpoint: "https://video.bunnycdn.com/tusupload",
      headers: {
        AuthorizationSignature: "dummy",
        AuthorizationExpire: Date.now() + 3600,
        VideoId: crypto.randomUUID(),
        LibraryId: "588511",
      },
    };
    addFile(file, dummyUploadData);
  };

  return (
    <div className="right-4 bottom-4 z-50 fixed w-80">
      <Card className="bg-white shadow-lg rounded-lg">
        <CardHeader
          className="flex justify-between items-center p-2 cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        >
          <CardTitle className="font-semibold text-sm">Uploads</CardTitle>
          {collapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </CardHeader>
        {!collapsed && (
          <CardContent className="space-y-2 p-2 max-h-64 overflow-y-auto">
            {uploads.map((u) => (
              <div key={u.id} className="space-y-1">
                <div className="flex justify-between font-medium text-xs">
                  <span className="truncate">{u.name}</span>
                  <span>{Math.round(u.progress)}%</span>
                </div>
                <Progress
                  value={u.progress}
                  className={`h-2 ${
                    u.status === "completed" ? "bg-green-500" : ""
                  } ${u.status === "error" ? "bg-red-500" : ""}`}
                />
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      <Button size="sm" className="mt-2 w-full" onClick={handleAddDemo}>
        Add Demo File
      </Button>
    </div>
  );
}
