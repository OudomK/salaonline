import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CloudUpload, Mic, Square, Trash2, CheckCircle2, ChevronLeft, AlertCircle, UploadCloud, X } from "lucide-react";
import logo from "../../assets/logo.jpg";

// 🟢 IMPORT SHADCN COMPONENTS
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Homework() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // --- States ---
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- Alert State (Shadcn Dialog) ---
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "warning" // 'warning' or 'error'
  });

  // --- Functions ---
  const closeAlert = () => setAlertModal(prev => ({ ...prev, isOpen: false }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        setAudioUrl(URL.createObjectURL(blob));
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      setAlertModal({
        isOpen: true,
        title: "ត្រូវការការអនុញ្ញាត! (Permission Denied)",
        message: "សូមអនុញ្ញាតឱ្យប្រើ Microphone នៅក្នុង Browser របស់អ្នកដើម្បីថតសំឡេង។",
        type: "error"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedImage && !audioUrl) {
      setAlertModal({
        isOpen: true,
        title: "ខ្វះឯកសារ! (Missing File)",
        message: "សូម Upload រូបភាព ឬ ថតសំឡេងចម្លើយ ជាមុនសិន។",
        type: "warning"
      });
      return;
    }
    
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  // --- Success View ---
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-khmer-os-battambang">
        <Card className="w-full max-w-sm rounded-[32px] border-0 shadow-xl p-8 animate-fade-in-up">
           <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle2 size={48} className="text-green-500" />
           </div>
           <h1 className="text-2xl font-extrabold text-gray-900 mb-2">ជោគជ័យ! (Success)</h1>
           <p className="text-gray-500 mb-8">កិច្ចការរបស់អ្នកត្រូវបានដាក់បញ្ចូលជោគជ័យ។</p>
           
           <Button 
              onClick={() => navigate("/course-detail")} 
              className="w-full h-12 rounded-xl font-bold bg-[#00B4F6] hover:bg-[#009bd1] text-white shadow-lg shadow-blue-200"
           >
              ត្រឡប់ទៅមេរៀនវិញ
           </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-khmer-os-battambang pb-24 md:pb-10">
      
      {/* 1. Header (Mobile Only) */}
      <div className="sticky top-0 z-10 px-4 py-3 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center gap-3 md:hidden">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ChevronLeft size={24} className="text-gray-700" />
        </Button>
        <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 border border-gray-100">
                <AvatarImage src={logo} />
                <AvatarFallback>HW</AvatarFallback>
            </Avatar>
            <span className="font-bold text-gray-900 text-sm">Homework Upload</span>
        </div>
      </div>

      {/* 2. Main Content */}
      <div className="flex-1 px-4 py-6 flex flex-col items-center max-w-4xl mx-auto w-full space-y-8">
        
        {/* Title Section */}
        <div className="text-center space-y-2 pt-4">
            <Badge variant="outline" className="bg-blue-50 text-[#00B4F6] border-blue-100 px-3 py-1 mb-2">
                កិច្ចការផ្ទះ (Homework)
            </Badge>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                ដាក់កិច្ចការផ្ទះរបស់អ្នក <br className="hidden md:block"/> នៅទីនេះ
            </h1>
            <p className="text-gray-400 text-sm font-medium">Upload រូបភាព ឬ ថតសំឡេងចម្លើយរបស់អ្នក</p>
        </div>

        {/* Upload Container Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* --- A. Image Upload Card --- */}
            <Card 
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-blue-200 bg-white hover:bg-blue-50/30 transition-colors cursor-pointer rounded-[24px] overflow-hidden group shadow-sm hover:shadow-md"
            >
                <CardContent className="p-0 h-64 flex flex-col items-center justify-center relative">
                    {selectedImage ? (
                        <>
                            <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white font-bold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">ប្តូររូបភាព (Change)</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                <UploadCloud size={32} className="text-[#00B4F6]" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-700">ចុចដើម្បីជ្រើសរើសរូបភាព</p>
                                <p className="text-xs text-gray-400">JPEG, PNG only</p>
                            </div>
                        </div>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                    />
                </CardContent>
            </Card>

            {/* --- B. Voice Recorder Card --- */}
            <Card className="bg-white border-0 shadow-sm rounded-[24px] overflow-hidden flex flex-col justify-center h-64">
                <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2">
                            <Mic size={18} className="text-gray-400"/> Voice Answer
                        </h3>
                        {isRecording && (
                            <Badge variant="destructive" className="animate-pulse">Recording...</Badge>
                        )}
                    </div>

                    {!audioUrl ? (
                        <Button 
                            variant="outline"
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`w-full h-32 rounded-2xl flex flex-col gap-2 border-2 border-dashed ${
                                isRecording 
                                ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100 hover:text-red-600" 
                                : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:border-gray-300"
                            }`}
                        >
                            {isRecording ? <Square size={32} fill="currentColor" /> : <Mic size={32} />}
                            <span className="font-bold">{isRecording ? "បញ្ឈប់ (Stop)" : "ចុចដើម្បីថត (Record)"}</span>
                        </Button>
                    ) : (
                        <div className="bg-blue-50 p-4 rounded-2xl space-y-3 border border-blue-100">
                            <div className="flex items-center gap-2">
                                <audio src={audioUrl} controls className="w-full h-8" />
                            </div>
                            <Button 
                                variant="ghost" 
                                onClick={() => setAudioUrl(null)} 
                                className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 h-10 rounded-xl font-bold"
                            >
                                <Trash2 size={16} className="mr-2"/> លុបសំឡេង (Delete)
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

        </div>

      </div>

      {/* 3. Footer Button (Sticky on Mobile) */}
      <div className="fixed bottom-[70px] left-0 right-0 p-4 bg-white border-t border-gray-100 md:static md:bg-transparent md:border-0 md:p-0 md:flex md:justify-center z-20">
         <Button 
            onClick={handleSubmit}
            className="w-full md:max-w-md h-14 text-lg rounded-xl font-bold bg-[#00B4F6] hover:bg-[#009bd1] text-white shadow-lg shadow-blue-200"
         >
            ដាក់កិច្ចការ (Upload Homework)
         </Button>
      </div>

      {/* 4. Alert Dialog (Shadcn) */}
      <Dialog open={alertModal.isOpen} onOpenChange={closeAlert}>
        <DialogContent className="sm:max-w-md rounded-[32px] p-6">
            <DialogHeader className="flex flex-col items-center text-center space-y-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    alertModal.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-500'
                }`}>
                    <AlertCircle size={40} />
                </div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                    {alertModal.title}
                </DialogTitle>
                <DialogDescription className="text-gray-500 font-medium text-base">
                    {alertModal.message}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
                <Button onClick={closeAlert} className="w-full h-12 rounded-xl font-bold bg-[#00B4F6] text-white hover:bg-[#009bd1]">
                    យល់ព្រម (OK)
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}