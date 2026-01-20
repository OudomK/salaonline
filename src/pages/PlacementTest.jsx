import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { quizData } from "../data/quizData";
import { ChevronLeft, Clock, CheckCircle, Globe, Award, ArrowRight } from "lucide-react";

export default function PlacementTest() {
  const navigate = useNavigate();

  // State Management
  const [step, setStep] = useState(1); // 1=Choose Lang, 2=Quiz, 3=Result
  const [language, setLanguage] = useState("english");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  // Functions
  const handleStartQuiz = (lang) => {
    // Safety Check: ពិនិត្យមើលថាមានសំណួរឬអត់
    if (!quizData[lang]) {
        alert("Comming Soon!"); // បើអត់មានទិន្នន័យ
        return;
    }
    setLanguage(lang);
    setStep(2);
    setCurrentQIndex(0);
    setScore(0);
  };

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
  };

  const handleNext = () => {
    const currentQuestions = quizData[language];
    // Check answer logic
    if (selectedAnswer === currentQuestions[currentQIndex].correct) {
      setScore(score + 1);
    }

    if (currentQIndex + 1 < currentQuestions.length) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedAnswer(""); 
    } else {
      setStep(3); 
    }
  };

  // --- UI COMPONENTS ---

  // 1. Screen: Choose Language
  if (step === 1) {
    return (
      // Update: ដក min-h-screen ចេញ ប្រើ py-12 ជំនួស ដើម្បីកុំឱ្យជាន់ Header/Footer
      <div className="w-full flex items-center justify-center py-10 px-4">
        <div className="bg-white w-full max-w-md rounded-[40px] shadow-xl p-8 text-center relative overflow-hidden border border-gray-100">
          
          {/* Decorative Blob */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative z-10 space-y-6">
            <div>
                 <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <Globe size={40} className="text-[#00B4F6]" />
                 </div>
                 <h1 className="text-2xl font-extrabold text-gray-900">Placement Test</h1>
                 <p className="text-gray-500 text-sm mt-2">Select a language to check your proficiency level.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <button 
                  onClick={() => handleStartQuiz("english")}
                  className="group relative overflow-hidden bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-5xl mb-3 drop-shadow-sm">🇬🇧</span>
                    <span className="font-bold text-gray-700 group-hover:text-[#00B4F6]">English</span>
                  </div>
                </button>

                <button 
                  onClick={() => handleStartQuiz("chinese")}
                  className="group relative overflow-hidden bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-5xl mb-3 drop-shadow-sm">🇨🇳</span>
                    <span className="font-bold text-gray-700 group-hover:text-red-500">Chinese</span>
                  </div>
                </button>
            </div>

            <button onClick={() => navigate(-1)} className="text-sm text-gray-400 font-bold hover:text-gray-600 mt-4">
                Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Screen: Quiz UI
  if (step === 2) {
    const questions = quizData[language];
    const currentQ = questions[currentQIndex];
    const progress = ((currentQIndex + 1) / questions.length) * 100;

    return (
      <div className="w-full flex items-center justify-center py-10 px-4">
        <div className="bg-white w-full max-w-md rounded-[32px] shadow-xl p-6 space-y-6 relative border border-gray-100">
          
          {/* Header Bar */}
          <div className="flex justify-between items-center">
            <button 
                onClick={() => setStep(1)} 
                className="p-2 hover:bg-gray-100 rounded-full transition"
            >
                <ChevronLeft size={24} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                <Clock size={16} className="text-[#00B4F6]" />
                <span className="text-[#00B4F6] text-sm font-bold">03:31</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-gray-400">
                <span>Question {currentQIndex + 1} of {questions.length}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                    className="bg-[#00B4F6] h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_#00B4F6]" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
          </div>

          {/* Question */}
          <div className="text-center py-2">
             <div className="w-full h-40 bg-gray-50 rounded-2xl mb-4 flex items-center justify-center overflow-hidden border border-gray-100">
                 <img src={currentQ.image} alt="Question" className="h-full object-contain mix-blend-multiply" />
             </div>
             <h3 className="text-xl font-bold text-gray-800 leading-snug">
                {currentQ.question}
             </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
             {currentQ.options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={`w-full py-4 px-6 rounded-2xl text-left font-bold border-2 transition-all duration-200 flex justify-between items-center group ${
                        selectedAnswer === option 
                        ? "bg-[#00B4F6] text-white border-[#00B4F6] shadow-lg scale-[1.02]" 
                        : "bg-white text-gray-600 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50"
                    }`}
                >
                    <span>{option}</span>
                    {selectedAnswer === option && <CheckCircle size={20} fill="white" className="text-[#00B4F6]" />}
                </button>
             ))}
          </div>

          {/* Next Button */}
          <div className="pt-4">
            <button 
                onClick={handleNext}
                disabled={!selectedAnswer}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    selectedAnswer 
                    ? "bg-[#00B4F6] text-white shadow-lg hover:bg-blue-500 hover:shadow-xl active:scale-95" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
                {currentQIndex + 1 === questions.length ? "See Result" : "Next Question"}
                {selectedAnswer && <ArrowRight size={20} />}
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 3. Screen: Result
  if (step === 3) {
    const questions = quizData[language];
    let level = "Beginner";
    let color = "text-yellow-500";
    if (score > questions.length / 2) { level = "Intermediate"; color = "text-blue-500"; }
    if (score === questions.length) { level = "Advanced"; color = "text-green-500"; }

    return (
      <div className="w-full flex items-center justify-center py-10 px-4">
        <div className="bg-white w-full max-w-md rounded-[40px] shadow-xl p-8 text-center space-y-8 relative overflow-hidden border border-gray-100">
           
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>

           <div className="space-y-2">
               <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                  <Award size={48} className="text-yellow-500" />
               </div>
               <h1 className="text-3xl font-extrabold text-gray-900">Completed!</h1>
               <p className="text-gray-500">You have successfully finished the test.</p>
           </div>

           <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                  <span className="text-gray-500 font-bold">Your Score</span>
                  <span className="text-2xl font-black text-gray-900">{score} <span className="text-gray-400 text-lg">/ {questions.length}</span></span>
              </div>
              <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold">Level</span>
                  <span className={`text-xl font-bold ${color}`}>{level}</span>
              </div>
           </div>

           <button 
             onClick={() => navigate("/home")} 
             className="w-full bg-[#00B4F6] text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:bg-blue-500 transition-all hover:shadow-blue-200 active:scale-95"
           >
             Go to Dashboard
           </button>
        </div>
      </div>
    );
  }
}