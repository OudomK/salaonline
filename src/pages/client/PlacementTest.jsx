import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { quizData } from "../../data/quizData";
import { ChevronLeft, Clock, CheckCircle2, Globe, Award, ArrowRight, RotateCcw } from "lucide-react";

// 🟢 IMPORT SHADCN COMPONENTS
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
    if (!quizData[lang]) {
        alert("Comming Soon!"); 
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



// ... (រក្សាកូដដើមខាងលើដដែល)

  // 1. Screen: Choose Language
  if (step === 1) {
    return (
      <div className="w-full flex items-center justify-center py-12 px-4 font-khmer-os-battambang">
        <Card className="w-full max-w-md border-0 shadow-xl rounded-[32px] overflow-hidden relative">
          
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-white -z-10"></div>

          <CardHeader className="text-center pt-10 pb-2">
             <div className="mx-auto bg-white p-4 rounded-full shadow-sm mb-4">
                <Globe size={40} className="text-[#00B4F6] animate-pulse" />
             </div>
             <CardTitle className="text-2xl font-extrabold text-gray-900">តេស្តសមត្ថភាព</CardTitle>
             <CardDescription className="text-gray-500 font-medium">ជ្រើសរើសភាសាដើម្បីចាប់ផ្តើមតេស្ត</CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-2 gap-4 py-6 px-8">
             
             {/* 🇺🇸/🇬🇧 English Button */}
             <Button 
                variant="outline" 
                className="h-40 flex flex-col gap-3 rounded-3xl border-2 hover:border-[#00B4F6] hover:bg-blue-50/50 transition-all group shadow-sm hover:shadow-md"
                onClick={() => handleStartQuiz("english")}
             >
                {/* ប្រើរូបភាពទង់ជាតិជំនួស Emoji */}
                <div className="w-16 h-12 rounded-lg overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                    <img 
                        src="https://flagcdn.com/w160/gb.png" 
                        alt="English" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <span className="font-bold text-gray-700 text-lg group-hover:text-[#00B4F6]">English</span>
             </Button>

             {/* 🇨🇳 Chinese Button */}
             <Button 
                variant="outline" 
                className="h-40 flex flex-col gap-3 rounded-3xl border-2 hover:border-red-400 hover:bg-red-50/50 transition-all group shadow-sm hover:shadow-md"
                onClick={() => handleStartQuiz("chinese")}
             >
                {/* ប្រើរូបភាពទង់ជាតិជំនួស Emoji */}
                <div className="w-16 h-12 rounded-lg overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                    <img 
                        src="https://flagcdn.com/w160/cn.png" 
                        alt="Chinese" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <span className="font-bold text-gray-700 text-lg group-hover:text-red-500">Chinese</span>
             </Button>

          </CardContent>

          <CardFooter className="justify-center pb-8">
             <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 rounded-xl">
                បោះបង់ (Cancel)
             </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }



  // 2. Screen: Quiz UI
  if (step === 2) {
    const questions = quizData[language];
    const currentQ = questions[currentQIndex];
    const progress = ((currentQIndex + 1) / questions.length) * 100;

    return (
      <div className="w-full flex items-center justify-center py-12 px-4 font-khmer-os-battambang">
        <Card className="w-full max-w-md border-0 shadow-2xl rounded-[32px] overflow-hidden">
          
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
             <Button variant="ghost" size="icon" onClick={() => setStep(1)} className="rounded-full">
                <ChevronLeft size={24} className="text-gray-600" />
             </Button>
             <Badge variant="secondary" className="bg-blue-50 text-[#00B4F6] hover:bg-blue-100 px-3 py-1 gap-1 text-xs">
                <Clock size={14} /> 03:00
             </Badge>
          </CardHeader>

          <CardContent className="px-6 space-y-6">
             {/* Progress Bar */}
             <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-400">
                   <span>សំណួរទី {currentQIndex + 1}</span>
                   <span>នៃ {questions.length}</span>
                </div>
                <Progress value={progress} className="h-2 bg-gray-100 [&>div]:bg-[#00B4F6]" />
             </div>

             {/* Question Image & Text */}
             <div className="text-center space-y-4">
                {currentQ.image && (
                    <div className="w-full h-40 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100">
                        <img src={currentQ.image} alt="Question" className="h-full object-contain mix-blend-multiply" />
                    </div>
                )}
                <h3 className="text-lg font-bold text-gray-800 leading-relaxed">
                   {currentQ.question}
                </h3>
             </div>

             {/* Options */}
             <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                   <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleAnswer(option)}
                      className={`w-full h-auto py-4 px-6 justify-between rounded-xl border-2 text-base font-medium transition-all ${
                         selectedAnswer === option 
                         ? "border-[#00B4F6] bg-blue-50 text-[#00B4F6] shadow-md" 
                         : "border-gray-100 text-gray-600 hover:border-blue-100 hover:bg-white"
                      }`}
                   >
                      <span>{option}</span>
                      {selectedAnswer === option && <CheckCircle2 size={20} className="fill-[#00B4F6] text-white" />}
                   </Button>
                ))}
             </div>
          </CardContent>

          <CardFooter className="pt-2 pb-8 px-6">
             <Button 
                onClick={handleNext}
                disabled={!selectedAnswer}
                className="w-full h-12 text-md font-bold rounded-xl bg-[#00B4F6] hover:bg-[#009bd1] text-white shadow-lg shadow-blue-200"
             >
                {currentQIndex + 1 === questions.length ? "បញ្ចប់តេស្ត (Finish)" : "បន្ត (Next)"}
                {selectedAnswer && <ArrowRight size={18} className="ml-2" />}
             </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // 3. Screen: Result
  if (step === 3) {
    const questions = quizData[language];
    let level = "កម្រិតដំបូង (Beginner)";
    let color = "text-yellow-500 bg-yellow-50 border-yellow-100";
    
    if (score > questions.length / 2) { 
        level = "កម្រិតមធ្យម (Intermediate)"; 
        color = "text-blue-500 bg-blue-50 border-blue-100"; 
    }
    if (score === questions.length) { 
        level = "កម្រិតខ្ពស់ (Advanced)"; 
        color = "text-green-500 bg-green-50 border-green-100"; 
    }

    return (
      <div className="w-full flex items-center justify-center py-12 px-4 font-khmer-os-battambang">
        <Card className="w-full max-w-md border-0 shadow-2xl rounded-[32px] overflow-hidden text-center relative">
           {/* Confetti / Decoration Background */}
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>

           <CardContent className="pt-12 pb-8 px-8 space-y-8">
              <div className="space-y-4">
                 <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl animate-bounce">
                    <Award size={48} className="text-yellow-500" />
                 </div>
                 <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">ការធ្វើតេស្តជោគជ័យ!</h1>
                    <p className="text-gray-500 text-sm">អ្នកបានបញ្ចប់ការធ្វើតេស្តសមត្ថភាព។</p>
                 </div>
              </div>

              <div className="bg-gray-50/80 p-6 rounded-3xl border border-gray-100 space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-bold text-sm">ពិន្ទុរបស់អ្នក</span>
                    <span className="text-2xl font-black text-gray-900">{score} <span className="text-gray-400 text-base">/ {questions.length}</span></span>
                 </div>
                 <Separator />
                 <div className="space-y-2">
                    <span className="text-gray-500 font-bold text-sm block">កម្រិតបច្ចុប្បន្ន</span>
                    <Badge variant="outline" className={`text-base py-1 px-4 rounded-lg border ${color}`}>
                        {level}
                    </Badge>
                 </div>
              </div>
           </CardContent>

           <CardFooter className="flex flex-col gap-3 pb-10 px-8">
              <Button 
                 onClick={() => navigate("/home")} 
                 className="w-full h-12 rounded-xl text-md font-bold bg-[#00B4F6] hover:bg-[#009bd1] text-white shadow-lg shadow-blue-200"
              >
                 ទៅកាន់ទំព័រដើម
              </Button>
              <Button 
                 variant="ghost" 
                 onClick={() => { setStep(1); setScore(0); }} 
                 className="w-full text-gray-500 hover:text-gray-700"
              >
                 <RotateCcw size={16} className="mr-2"/> ធ្វើតេស្តម្តងទៀត
              </Button>
           </CardFooter>
        </Card>
      </div>
    );
  }
}