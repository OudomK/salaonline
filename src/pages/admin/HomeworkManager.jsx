import React, { useState } from 'react';
import { Search, Eye, CheckCircle2, CircleDashed, FileText, Send, BookOpen, User } from "lucide-react";

// 🟢 IMPORT SHADCN COMPONENTS
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

// --- MOCK DATA ---
const initialSubmissions = [
  { id: 1, student: "Sok Dara", course: "English Level 1", lesson: "Lesson 3: Grammar", submittedDate: "2024-03-25", status: "pending", content: "https://drive.google.com/homework1" },
  { id: 2, student: "Chan Maly", course: "Chinese Beginner", lesson: "Lesson 1: Tones", submittedDate: "2024-03-24", status: "graded", score: 85, content: "https://drive.google.com/homework2" },
  { id: 3, student: "Keo Visal", course: "Korean Basic", lesson: "Lesson 5: Vocabulary", submittedDate: "2024-03-25", status: "pending", content: "image_homework.jpg" },
  { id: 4, student: "Ly Bopha", course: "English Level 2", lesson: "Lesson 2: Tenses", submittedDate: "2024-03-26", status: "pending", content: "doc_file.pdf" },
];

export default function HomeworkManager() {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [selectedWork, setSelectedWork] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");

  // Filter
  const filteredList = submissions.filter(item =>
    item.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- ACTIONS ---
  const handleOpenGrade = (work) => {
    setSelectedWork(work);
    setScore(work.score || "");
    setFeedback("");
    setIsDialogOpen(true);
  };

  const handleSubmitGrade = (e) => {
    e.preventDefault();
    setSubmissions(submissions.map(sub => 
        sub.id === selectedWork.id ? { ...sub, status: "graded", score: score } : sub
    ));
    setIsDialogOpen(false);
    setSelectedWork(null);
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-20">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 font-khmer-os-battambang">ត្រួតពិនិត្យកិច្ចការ (Homework)</h1>
           <p className="text-sm text-gray-500 mt-1 font-khmer-os-battambang">ដាក់ពិន្ទុ និងផ្តល់ Feedback ជូនសិស្ស។</p>
        </div>
        <Badge variant="outline" className="px-4 py-1.5 text-sm font-bold bg-blue-50 text-blue-600 border-blue-200 gap-2">
           <CircleDashed size={16} /> Total Pending: {submissions.filter(s => s.status === 'pending').length}
        </Badge>
      </div>

      {/* 2. SEARCH */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              type="text" 
              placeholder="ស្វែងរកតាមឈ្មោះសិស្ស..." 
              className="pl-10 bg-gray-50 border-gray-200 focus-visible:ring-[#00B4F6] rounded-xl font-khmer-os-battambang"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      {/* 3. SHADCN TABLE */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
           <TableHeader className="bg-gray-50/80">
              <TableRow>
                 <TableHead className="font-bold text-gray-600 font-khmer-os-battambang pl-6">សិស្ស (Student)</TableHead>
                 <TableHead className="font-bold text-gray-600 font-khmer-os-battambang">កិច្ចការ (Assignment)</TableHead>
                 <TableHead className="font-bold text-gray-600 font-khmer-os-battambang">កាលបរិច្ឆេទ</TableHead>
                 <TableHead className="font-bold text-gray-600 font-khmer-os-battambang">ស្ថានភាព</TableHead>
                 <TableHead className="text-center font-bold text-gray-600 font-khmer-os-battambang">សកម្មភាព</TableHead>
              </TableRow>
           </TableHeader>
           <TableBody>
              {filteredList.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                   <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                         <Avatar className="h-9 w-9 bg-indigo-50 text-[#6366F1] border border-indigo-100">
                            <AvatarFallback className="font-bold">{item.student.charAt(0)}</AvatarFallback>
                         </Avatar>
                         <span className="font-bold text-gray-900 font-khmer-os-battambang text-sm">{item.student}</span>
                      </div>
                   </TableCell>
                   <TableCell>
                      <div className="flex flex-col gap-1">
                         <Badge variant="secondary" className="w-fit font-normal text-xs text-gray-600">{item.course}</Badge>
                         <span className="text-sm font-bold text-gray-800">{item.lesson}</span>
                      </div>
                   </TableCell>
                   <TableCell className="text-gray-500 text-sm font-medium">
                      {item.submittedDate}
                   </TableCell>
                   <TableCell>
                      {item.status === 'graded' ? (
                         <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0 gap-1 font-bold">
                            <CheckCircle2 size={14} /> Score: {item.score}
                         </Badge>
                      ) : (
                         <Badge className="bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-200 gap-1 font-bold">
                            <CircleDashed size={14} /> Pending
                         </Badge>
                      )}
                   </TableCell>
                   <TableCell className="text-center">
                      <Button 
                        onClick={() => handleOpenGrade(item)}
                        variant="outline" 
                        size="sm" 
                        className="rounded-lg border-gray-200 hover:bg-[#00B4F6] hover:text-white hover:border-[#00B4F6] transition-all gap-2 font-bold"
                      >
                         <Eye size={16} /> ពិនិត្យ
                      </Button>
                   </TableCell>
                </TableRow>
              ))}
           </TableBody>
        </Table>
      </div>

      {/* =========================================
          🟢 GRADING DIALOG (MODAL)
         ========================================= */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
         <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl shadow-2xl border-0">
            <DialogHeader>
               <DialogTitle className="text-xl font-bold font-khmer-os-battambang flex items-center gap-2">
                  <FileText className="text-[#00B4F6]" /> ដាក់ពិន្ទុ (Grading)
               </DialogTitle>
               <DialogDescription className="font-khmer-os-battambang">
                  ពិនិត្យកិច្ចការ និងដាក់ពិន្ទុជូនសិស្ស <b>{selectedWork?.student}</b>
               </DialogDescription>
            </DialogHeader>

            {selectedWork && (
               <div className="grid gap-6 py-4">
                  {/* Submission Info */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-bold">Assignment:</span>
                        <span className="font-bold text-gray-900">{selectedWork.lesson}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-bold">Link/File:</span>
                        <a href="#" className="text-blue-600 hover:underline font-medium truncate max-w-[200px]">
                           {selectedWork.content}
                        </a>
                     </div>
                  </div>

                  {/* Form */}
                  <div className="grid gap-4">
                     <div className="grid gap-2">
                        <Label htmlFor="score" className="font-bold text-gray-700">ពិន្ទុ (Score 0-100)</Label>
                        <Input
                           id="score"
                           type="number"
                           max="100"
                           value={score}
                           onChange={(e) => setScore(e.target.value)}
                           className="rounded-xl font-bold text-lg"
                           placeholder="Ex: 85"
                        />
                     </div>
                     <div className="grid gap-2">
                        <Label htmlFor="feedback" className="font-bold text-gray-700">មតិយោបល់ (Feedback)</Label>
                        <Textarea
                           id="feedback"
                           value={feedback}
                           onChange={(e) => setFeedback(e.target.value)}
                           placeholder="សរសេរការណែនាំបន្ថែម..."
                           className="rounded-xl min-h-[100px]"
                        />
                     </div>
                  </div>
               </div>
            )}

            <DialogFooter>
               <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold border-0 bg-gray-100 hover:bg-gray-200 text-gray-600">
                  បោះបង់
               </Button>
               <Button onClick={handleSubmitGrade} className="bg-[#00B4F6] hover:bg-[#009bd1] text-white rounded-xl font-bold shadow-md shadow-blue-200 gap-2">
                  <Send size={16} /> ដាក់ពិន្ទុ (Submit)
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>

    </div>
  );
}