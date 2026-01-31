import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveTestResult, getTestResult } from "../../data/quizData";
import { useFirstTest } from "@/hooks/api";
import { ChevronLeft, Clock, CheckCircle2, Globe, Award, ArrowRight, RotateCcw, Check, Loader2 } from "lucide-react";

// 🟢 IMPORT SHADCN COMPONENTS
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { quizService } from "@/lib/api/services/quiz.service";
import { useCategories } from "@/hooks/api/useCategory";

// Category metadata mapping (flags, colors, Khmer names)
const CATEGORY_METADATA = {
   1: { nameKh: "ភាសាអង់គ្លេស", flag: "https://flagcdn.com/w160/gb.png", color: "border-[#00B4F6] hover:bg-blue-50/50 hover:border-[#00B4F6]", textColor: "text-[#00B4F6]" },
   2: { nameKh: "ភាសាចិន", flag: "https://flagcdn.com/w160/cn.png", color: "border-red-400 hover:bg-red-50/50 hover:border-red-400", textColor: "text-red-500" },
   3: { nameKh: "ភាសាជប៉ុន", flag: "https://flagcdn.com/w160/jp.png", color: "border-pink-500 hover:bg-pink-50/50 hover:border-pink-500", textColor: "text-pink-500" },
   4: { nameKh: "ភាសាកូរ៉េ", flag: "https://flagcdn.com/w160/kr.png", color: "border-purple-500 hover:bg-purple-50/50 hover:border-purple-500", textColor: "text-purple-500" },
   5: { nameKh: "ភាសាថៃ", flag: "https://flagcdn.com/w160/th.png", color: "border-blue-500 hover:bg-blue-50/50 hover:border-blue-500", textColor: "text-blue-500" },
};

export default function PlacementTest() {
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();
   const categoryParam = searchParams.get('category');

   // State Management
   const [step, setStep] = useState(1); // 1=Choose Category, 2=Quiz, 3=Result
   const [categoryId, setCategoryId] = useState(null);
   const [currentQIndex, setCurrentQIndex] = useState(0);
   const [score, setScore] = useState(0);
   const [selectedAnswer, setSelectedAnswer] = useState("");
   const [quizData, setQuizData] = useState(null);
   const [allAnswers, setAllAnswers] = useState({}); // Track all answers: { questionId: optionId }

   // Fetch categories and quiz data from API
   const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories();
   const { data: quizResponse, isLoading: quizLoading, error: quizError } = useFirstTest(categoryId);


   // Transform API categories to include metadata
   const categories = categoriesResponse?.data?.map(cat => ({
      id: cat.id,
      name: cat.name,
      nameKh: CATEGORY_METADATA[cat.id]?.nameKh || cat.name,
      flag: CATEGORY_METADATA[cat.id]?.flag || "https://flagcdn.com/w160/un.png",
      color: CATEGORY_METADATA[cat.id]?.color || "border-gray-400 hover:bg-gray-50/50 hover:border-gray-400",
      textColor: CATEGORY_METADATA[cat.id]?.textColor || "text-gray-500",
      videoCount: cat.videoCount,
      comingSoon: !cat.videoCount || cat.videoCount === "0"
   })) || [];

   // Initialize category from URL param if available
   useEffect(() => {
      if (categoryParam) {
         const catId = parseInt(categoryParam, 10);
         setCategoryId(catId);
         setStep(2);
         setCurrentQIndex(0);
         setScore(0);
         setSelectedAnswer("");
         setAllAnswers({});
      }
   }, [categoryParam]);

   // Set quiz data when API response arrives
   useEffect(() => {
      if (quizResponse?.data) {
         setQuizData(quizResponse.data);
      }
   }, [quizResponse]);

   const handleStartQuiz = (catId) => {
      setCategoryId(catId);
      setStep(2);
      setCurrentQIndex(0);
      setScore(0);
      setSelectedAnswer("");
      setAllAnswers({});
   };

   const handleAnswer = (optionId) => {
      setSelectedAnswer(optionId);
      // Store answer for current question
      if (quizData?.questions[currentQIndex]) {
         setAllAnswers(prev => ({
            ...prev,
            [quizData.questions[currentQIndex].id]: optionId
         }));
      }
   };

   const handleNext = async () => {
      const currentQuestions = quizData.questions;
      const currentQuestion = currentQuestions[currentQIndex];

      // Save current answer before moving
      if (selectedAnswer && currentQuestion) {
         setAllAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: selectedAnswer
         }));
      }

      if (currentQIndex + 1 < currentQuestions.length) {
         setCurrentQIndex(currentQIndex + 1);
         // Check if we already have an answer for the next question
         const nextQuestion = currentQuestions[currentQIndex + 1];
         if (allAnswers[nextQuestion?.id]) {
            setSelectedAnswer(allAnswers[nextQuestion.id]);
         } else {
            setSelectedAnswer("");
         }
      } else {
         // Submit quiz to API
         await submitQuiz();
         setStep(3);
      }
   };

   const submitQuiz = async () => {
      try {
         // Save last answer before submitting
         const currentQuestion = quizData.questions[currentQIndex];
         const finalAnswers = { ...allAnswers };
         if (selectedAnswer && currentQuestion) {
            finalAnswers[currentQuestion.id] = selectedAnswer;
         }

         // Collect all answers
         const answers = quizData.questions.map((q) => ({
            question_id: q.id,
            selected_option_id: finalAnswers[q.id]
         }));

         const response = await quizService.submitQuiz({
            quiz_id: quizData.id,
            answers: answers
         });

         // Save result to localStorage
         if (response.data) {
            const finalScore = response.data.score || score;
            const totalQuestions = quizData.questions.length;
            let level = "កម្រិតដំបូង (Beginner)";

            if (finalScore > totalQuestions / 2) {
               level = "កម្រិតមធ្យម (Intermediate)";
            }
            if (finalScore === totalQuestions) {
               level = "កម្រិតខ្ពស់ (Advanced)";
            }

            saveTestResult(categoryId, finalScore, totalQuestions, level);
            setScore(finalScore);
         }
      } catch (error) {
         console.error("Failed to submit quiz:", error);
         // Fallback to localStorage only
         const totalQuestions = quizData.questions.length;
         let level = "កម្រិតដំបូង (Beginner)";

         if (score > totalQuestions / 2) {
            level = "កម្រិតមធ្យម (Intermediate)";
         }
         if (score === totalQuestions) {
            level = "កម្រិតខ្ពស់ (Advanced)";
         }

         saveTestResult(categoryId, score, totalQuestions, level);
      }
   };

   // Loading state for categories
   if (categoriesLoading && step === 1) {
      return (
         <div className="w-full flex items-center justify-center py-12 px-4 font-khmer-os-battambang">
            <Card className="w-full max-w-md border-0 shadow-2xl rounded-[32px] overflow-hidden text-center">
               <CardContent className="pt-12 pb-8 px-8">
                  <Loader2 size={48} className="animate-spin text-[#00B4F6] mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">កំពុងផ្ទុកប្រភេទ...</p>
               </CardContent>
            </Card>
         </div>
      );
   }

   // Loading state for quiz
   if (quizLoading && step === 2) {
      return (
         <div className="w-full flex items-center justify-center py-12 px-4 font-khmer-os-battambang">
            <Card className="w-full max-w-md border-0 shadow-2xl rounded-[32px] overflow-hidden text-center">
               <CardContent className="pt-12 pb-8 px-8">
                  <Loader2 size={48} className="animate-spin text-[#00B4F6] mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">កំពុងផ្ទុកតេស្ត...</p>
               </CardContent>
            </Card>
         </div>
      );
   }

   // Error state
   if (quizError && step === 2) {
      return (
         <div className="w-full flex items-center justify-center py-12 px-4 font-khmer-os-battambang">
            <Card className="w-full max-w-md border-0 shadow-2xl rounded-[32px] overflow-hidden text-center">
               <CardContent className="pt-12 pb-8 px-8">
                  <p className="text-red-500 font-medium mb-4">មិនអាចផ្ទុកតេស្តបានទេ</p>
                  <Button onClick={() => setStep(1)} variant="outline">
                     ត្រឡប់ក្រៅ
                  </Button>
               </CardContent>
            </Card>
         </div>
      );
   }

   // 1. Screen: Choose Category
   if (step === 1) {
      return (
         <div className="w-full flex items-center justify-center py-12 px-4 font-khmer-os-battambang">
            <Card className="w-full max-w-2xl border-0 shadow-xl rounded-[32px] overflow-hidden relative">
               {/* Decorative Background */}
               <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-white -z-10"></div>

               <CardHeader className="text-center pt-10 pb-2">
                  <div className="mx-auto bg-white p-4 rounded-full shadow-sm mb-4">
                     <Globe size={40} className="text-[#00B4F6] animate-pulse" />
                  </div>
                  <CardTitle className="text-2xl font-extrabold text-gray-900">តេស្តសមត្ថភាព</CardTitle>
                  <CardDescription className="text-gray-500 font-medium">ជ្រើសរើសភាសាដើម្បីចាប់ផ្តើមតេស្ត</CardDescription>
               </CardHeader>

               <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6 px-8">
                  {categories.map((cat) => {
                     const hasCompleted = getTestResult(cat.id);
                     return (
                        <Button
                           key={cat.id}
                           variant="outline"
                           disabled={cat.comingSoon}
                           className={`h-32 md:h-40 flex flex-col gap-2 rounded-3xl border-2 transition-all group shadow-sm hover:shadow-md relative ${cat.color}`}
                           onClick={() => handleStartQuiz(cat.id)}
                        >
                           {/* Completion Badge */}
                           {hasCompleted && (
                              <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                                 <Check size={12} />
                              </div>
                           )}

                           <div className="w-12 h-10 rounded-lg overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                              <img
                                 src={cat.flag}
                                 alt={cat.name}
                                 className="w-full h-full object-cover"
                              />
                           </div>
                           <span className={`font-bold text-sm ${cat.textColor} group-hover:scale-105 transition-transform`}>
                              {cat.nameKh}
                           </span>
                           <span className="text-xs text-gray-400">{cat.name}</span>
                           {cat.comingSoon && (
                              <Badge variant="secondary" className="text-[10px] px-2 py-0">Soon</Badge>
                           )}
                        </Button>
                     );
                  })}
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
   if (step === 2 && quizData) {
      const currentQ = quizData?.questions?.[currentQIndex];
      const progress = ((currentQIndex + 1) / quizData?.questions?.length) * 100;
      const categoryInfo = categories?.find(c => c.id === categoryId);

      return (
         <div className="w-full flex items-center justify-center py-12 px-4 font-khmer-os-battambang">
            <Card className="w-full max-w-md border-0 shadow-2xl rounded-[32px] overflow-hidden">
               {/* Header */}
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
                  <Button variant="ghost" size="icon" onClick={() => setStep(1)} className="rounded-full">
                     <ChevronLeft size={24} className="text-gray-600" />
                  </Button>
                  <div className="flex items-center gap-2">
                     {categoryInfo && (
                        <img src={categoryInfo.flag} alt={categoryInfo.name} className="w-9 h-6 border rounded" />
                     )}
                     {/* <Badge variant="secondary" className="bg-blue-50 text-[#00B4F6] hover:bg-blue-100 px-3 py-1 gap-1 text-xs">
                        <Clock size={14} /> 03:00
                     </Badge> */}
                  </div>
               </CardHeader>

               <CardContent className="px-6 space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                     <div className="flex justify-between text-xs font-bold text-gray-400">
                        <span>សំណួរទី {currentQIndex + 1}</span>
                        <span>នៃ {quizData?.questions?.length}</span>
                     </div>
                     <Progress value={progress} className="h-2 bg-gray-100 [&>div]:bg-[#00B4F6]" />
                  </div>

                  {/* Question */}
                  <div className="text-center space-y-4">
                     <h3 className="text-lg font-bold text-gray-800 leading-relaxed">
                        {currentQ?.title}
                     </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                     {currentQ?.question_options?.map((option) => (
                        <Button
                           key={option.id}
                           variant="outline"
                           onClick={() => handleAnswer(option.id)}
                           className={`w-full h-auto py-4 px-6 justify-start rounded-xl border-2 text-base font-medium transition-all text-left ${selectedAnswer === option.id
                              ? "border-[#00B4F6] bg-blue-50 text-[#00B4F6] shadow-md"
                              : "border-gray-100 text-gray-600 hover:border-blue-100 hover:bg-white"
                              }`}
                        >
                           <span>{option?.title}</span>
                           {selectedAnswer === option.id && <CheckCircle2 size={20} className="fill-[#00B4F6] text-white ml-auto" />}
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
                     {currentQIndex + 1 === quizData?.questions?.length ? "បញ្ចប់តេស្ត (Finish)" : "បន្ត (Next)"}
                     {selectedAnswer && <ArrowRight size={18} className="ml-2" />}
                  </Button>
               </CardFooter>
            </Card>
         </div>
      );
   }

   // 3. Screen: Result
   if (step === 3) {
      const totalQuestions = quizData?.questions?.length || 0;
      const finalScore = score;
      let level = "កម្រិតដំបូង (Beginner)";
      let color = "text-yellow-500 bg-yellow-50 border-yellow-100";

      if (finalScore > totalQuestions / 2) {
         level = "កម្រិតមធ្យម (Intermediate)";
         color = "text-blue-500 bg-blue-50 border-blue-100";
      }
      if (finalScore === totalQuestions) {
         level = "កម្រិតខ្ពស់ (Advanced)";
         color = "text-green-500 bg-green-50 border-green-100";
      }

      const categoryInfo = categories.find(c => c.id === categoryId);

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
                        {categoryInfo && (
                           <div className="flex items-center justify-center gap-2 mt-2">
                              <img src={categoryInfo.flag} alt={categoryInfo.name} className="w-5 h-3 rounded" />
                              <span className="text-sm font-medium text-gray-600">{categoryInfo.nameKh}</span>
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="bg-gray-50/80 p-6 rounded-3xl border border-gray-100 space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-bold text-sm">ពិន្ទុរបស់អ្នក</span>
                        <span className="text-2xl font-black text-gray-900">{finalScore} <span className="text-gray-400 text-base">/ {totalQuestions}</span></span>
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
                  <div className="flex gap-3 w-full">
                     <Button
                        variant="outline"
                        onClick={() => {
                           setStep(1);
                           setScore(0);
                           setCategoryId(null);
                        }}
                        className="flex-1 text-gray-500 hover:text-gray-700 border-2"
                     >
                        <RotateCcw size={16} className="mr-2" /> ប្តូរភាសា
                     </Button>
                     <Button
                        variant="outline"
                        onClick={() => {
                           setStep(2);
                           setCurrentQIndex(0);
                           setScore(0);
                           setSelectedAnswer("");
                           setAllAnswers({});
                        }}
                        className="flex-1 text-gray-500 hover:text-gray-700 border-2"
                     >
                        <RotateCcw size={16} className="mr-2" /> ធ្វើម្តងទៀត
                     </Button>
                  </div>
               </CardFooter>
            </Card>
         </div>
      );
   }
}
