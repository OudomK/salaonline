import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CloudUpload, Mic, Square, Trash2, CheckCircle, ChevronLeft, AlertCircle, X } from "lucide-react";
import logo from "../../assets/logo.jpg";

export default function Homework() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // --- States ---
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- NEW: Custom Alert State (ជំនួស alert ធម្មតា) ---
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "warning" // 'warning' or 'error'
  });

  // --- Functions ---
  
  // Helper to close modal
  const closeAlert = () => {
    setAlertModal(prev => ({ ...prev, isOpen: false }));
  };

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
      // 🔴 REPLACED alert() WITH CUSTOM MODAL
      setAlertModal({
        isOpen: true,
        title: "ត្រូវការការអនុញ្ញាត!",
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
    // 🔴 REPLACED alert() WITH CUSTOM MODAL
    if (!selectedImage && !audioUrl) {
      setAlertModal({
        isOpen: true,
        title: "ខ្វះឯកសារ!",
        message: "សូម Upload រូបភាព ឬ ថតសំឡេងចម្លើយ ជាមុនសិន។",
        type: "warning"
      });
      return;
    }
    
    // Fake Loading/Success logic
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  // --- Success View ---
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
           <CheckCircle size={48} className="text-green-500" />
        </div>
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Received!</h1>
           <p className="text-gray-500 mt-2">កិច្ចការរបស់អ្នកត្រូវបានដាក់បញ្ចូលជោគជ័យ។</p>
        </div>
        <button 
           onClick={() => navigate("/course-detail")} 
           className="w-full max-w-xs bg-[#00B4F6] text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-sky-500 transition"
        >
           Back to Lesson
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:py-10 relative">
      
      {/* 🟢 CUSTOM ALERT MODAL (The Improvement) */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Backdrop Blur */}
           <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              onClick={closeAlert}
           ></div>

           {/* Modal Content */}
           <div className="bg-white rounded-[32px] p-6 w-full max-w-sm shadow-2xl relative z-10 animate-[scale-in_0.2s_ease-out]">
              
              {/* Close Button */}
              <button 
                 onClick={closeAlert}
                 className="absolute top-4 right-4 p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-400 transition"
              >
                 <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                 {/* Icon based on type */}
                 <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                    alertModal.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-500'
                 }`}>
                    <AlertCircle size={40} />
                 </div>
                 
                 <h3 className="text-xl font-bold text-gray-900 mb-2">{alertModal.title}</h3>
                 <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    {alertModal.message}
                 </p>

                 {/* OK Button */}
                 <button 
                    onClick={closeAlert}
                    className="w-full py-3.5 rounded-2xl font-bold text-white bg-[#00B4F6] hover:bg-blue-500 shadow-lg shadow-blue-200 transition active:scale-95"
                 >
                    យល់ព្រម (OK)
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Header (Mobile Only - Hidden on Desktop) */}
      <div className="p-5 bg-white flex items-center gap-3 shadow-sm sticky top-0 z-10 md:hidden">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-50 rounded-full border border-gray-100">
           <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <div className="flex items-center gap-2">
           <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
           <span className="font-bold text-gray-800">Homework</span>
        </div>
      </div>

      <div className="flex-1 p-5 flex flex-col items-center justify-center space-y-6">
        
        <div className="text-center space-y-2">
           <h1 className="text-2xl font-bold text-gray-900">Please Upload Your <br/> Home Work</h1>
           <p className="text-gray-400 text-sm">Upload image or record your voice</p>
        </div>

        {/* Upload Container Grid for Desktop */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* --- 1. Image Upload Section --- */}
            <div 
            onClick={() => fileInputRef.current.click()}
            className="w-full bg-white border-2 border-dashed border-[#00B4F6] rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition relative overflow-hidden group min-h-[250px]"
            >
            {selectedImage ? (
                <img src={selectedImage} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
            ) : (
                <>
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                        <CloudUpload size={32} className="text-[#00B4F6]" />
                    </div>
                    <p className="font-bold text-gray-700">Choose a file</p>
                    <p className="text-xs text-gray-400 mt-1">JPEG, PNG only</p>
                </>
            )}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />
            </div>

            {/* --- 2. Voice Recorder Section --- */}
            <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-700">Voice Answer</h3>
                    {isRecording && <span className="text-red-500 text-xs font-bold animate-pulse">● Recording...</span>}
                </div>

                {!audioUrl ? (
                    <button 
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-full py-8 rounded-xl flex flex-col items-center justify-center gap-2 font-bold transition ${
                        isRecording 
                        ? "bg-red-50 text-red-500 border border-red-100" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    >
                    {isRecording ? <Square size={32} fill="currentColor" /> : <Mic size={32} />}
                    <span className="mt-2">{isRecording ? "Stop Recording" : "Tap to Record"}</span>
                    </button>
                ) : (
                    <div className="flex items-center gap-2 bg-blue-50 p-4 rounded-xl">
                        <audio src={audioUrl} controls className="w-full h-10" />
                        <button onClick={() => setAudioUrl(null)} className="p-3 bg-white rounded-full text-red-500 shadow-sm hover:bg-red-50">
                            <Trash2 size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>

      </div>

      {/* Footer Button */}
      <div className="p-5 bg-white border-t border-gray-100 md:bg-transparent md:border-none md:flex md:justify-center">
         <button 
            onClick={handleSubmit}
            className="w-full md:max-w-md bg-[#00B4F6] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-500 transition active:scale-95"
         >
            Upload Your Home Work
         </button>
      </div>

    </div>
  );
}