import React, { useState } from 'react';
import { CheckCircle, XCircle, Search, AlertTriangle, Check, X, Calendar, BookOpen } from "lucide-react";

// 🟢 IMPORT SHADCN COMPONENTS
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

// --- MOCK DATA ---
const initialRequests = [
  { id: 1, studentName: "Sok Dara", course: "English Level 1", requestDate: "2024-03-20", status: "pending" },
  { id: 2, studentName: "Chan Maly", course: "Korean Basic", requestDate: "2024-03-21", status: "pending" },
  { id: 3, studentName: "Keo Visal", course: "Chinese Level 2", requestDate: "2024-03-22", status: "pending" },
  { id: 4, studentName: "Ly Bopha", course: "English Level 2", requestDate: "2024-03-23", status: "pending" },
  { id: 5, studentName: "Vann Soth", course: "Korean Topik 1", requestDate: "2024-03-24", status: "pending" },
];

export default function ExamRequest() {
  const [requests, setRequests] = useState(initialRequests);
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- ALERT DIALOG STATE ---
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'pass' or 'fail'
  const [itemToProcess, setItemToProcess] = useState(null); 

  // Filter
  const filteredRequests = requests.filter(req =>
    req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 1. Open Alert
  const handleProcessClick = (request, type) => {
    setItemToProcess(request);
    setConfirmAction(type); 
    setIsAlertOpen(true); // Open Shadcn Alert
  };

  // 2. Confirm Action
  const confirmProcess = () => {
    // Logic: Remove from Pending List
    setRequests(requests.filter(r => r.id !== itemToProcess.id));
    setIsAlertOpen(false);
    setConfirmAction(null);
    setItemToProcess(null);
  };

  // Helper for Course Color
  const getBadgeVariant = (course) => {
    if (course.toLowerCase().includes('english')) return "default"; // Black/Dark
    if (course.toLowerCase().includes('korean')) return "secondary"; // Gray
    return "outline"; // White/Border
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in-up">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 font-khmer-os-battambang">សំណើរសុំប្រឡង (Exam Requests)</h1>
           <p className="text-sm text-gray-500 mt-1 font-khmer-os-battambang">ពិនិត្យ និងអនុម័តសំណើរដើម្បីអនុញ្ញាតឱ្យសិស្សឡើងកម្រិត។</p>
        </div>
        <Badge variant="orange" className="bg-orange-50 text-orange-600 border-orange-200 px-4 py-1.5 text-sm font-bold gap-2 hover:bg-orange-100">
           <AlertTriangle size={16} /> Pending: {filteredRequests.length}
        </Badge>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              type="text" 
              placeholder="ស្វែងរកឈ្មោះសិស្ស..." 
              className="pl-10 bg-gray-50 border-gray-200 focus-visible:ring-[#00B4F6] rounded-xl font-khmer-os-battambang"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      {/* SHADCN TABLE */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
           <TableHeader className="bg-gray-50/80">
              <TableRow>
                 <TableHead className="font-bold text-gray-600 font-khmer-os-battambang pl-6">សិស្ស (Student)</TableHead>
                 <TableHead className="font-bold text-gray-600 font-khmer-os-battambang">វគ្គសិក្សា (Course)</TableHead>
                 <TableHead className="font-bold text-gray-600 font-khmer-os-battambang">កាលបរិច្ឆេទ (Date)</TableHead>
                 <TableHead className="text-center font-bold text-gray-600 font-khmer-os-battambang">សកម្មភាព (Action)</TableHead>
              </TableRow>
           </TableHeader>
           <TableBody>
              {filteredRequests.map((req) => (
                <TableRow key={req.id} className="hover:bg-gray-50/50 transition-colors">
                   <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                         <Avatar className="h-9 w-9 bg-indigo-50 text-[#6366F1] border border-indigo-100">
                            <AvatarFallback className="font-bold">{req.studentName.charAt(0)}</AvatarFallback>
                         </Avatar>
                         <span className="font-bold text-gray-900 font-khmer-os-battambang">{req.studentName}</span>
                      </div>
                   </TableCell>
                   <TableCell>
                      <Badge variant="outline" className="font-medium bg-gray-50 gap-1.5 py-1">
                         <BookOpen size={12} className="text-gray-400"/> {req.course}
                      </Badge>
                   </TableCell>
                   <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                         <Calendar size={14} /> {req.requestDate}
                      </div>
                   </TableCell>
                   <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                         {/* PASS Button */}
                         <Button 
                           size="sm"
                           onClick={() => handleProcessClick(req, 'pass')}
                           className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-sm shadow-green-200 gap-1"
                         >
                            <Check size={16} strokeWidth={3} /> PASS
                         </Button>
                         
                         {/* FAIL Button */}
                         <Button 
                           size="sm"
                           variant="outline"
                           onClick={() => handleProcessClick(req, 'fail')}
                           className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold rounded-lg gap-1"
                         >
                            <X size={16} strokeWidth={3} /> FAIL
                         </Button>
                      </div>
                   </TableCell>
                </TableRow>
              ))}
              {filteredRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-gray-400 font-khmer-os-battambang">
                    មិនមានសំណើរសុំប្រឡងទេ (No Requests)
                  </TableCell>
                </TableRow>
              )}
           </TableBody>
        </Table>
      </div>

      {/* =========================================
          SHADCN ALERT DIALOG (Confirmation)
         ========================================= */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
         <AlertDialogContent className="bg-white rounded-2xl shadow-2xl border-0 max-w-sm">
            <AlertDialogHeader className="items-center text-center">
               <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                  confirmAction === 'pass' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
               }`}>
                  {confirmAction === 'pass' ? <CheckCircle size={32} /> : <XCircle size={32} />}
               </div>
               
               <AlertDialogTitle className="text-xl font-bold font-khmer-os-battambang">
                  {confirmAction === 'pass' ? 'អនុញ្ញាតឱ្យជាប់? (Confirm Pass)' : 'កំណត់ថាធ្លាក់? (Confirm Fail)'}
               </AlertDialogTitle>
               
               <AlertDialogDescription className="text-center font-khmer-os-battambang">
                  {confirmAction === 'pass' 
                     ? <span>System នឹង <b>Unlock Level បន្ទាប់</b> ឱ្យសិស្សឈ្មោះ <b className="text-gray-900">{itemToProcess?.studentName}</b> ភ្លាមៗ។</span>
                     : <span>សិស្សឈ្មោះ <b className="text-gray-900">{itemToProcess?.studentName}</b> នឹងត្រូវ <b>រៀនឡើងវិញ</b> នៅ Level ដដែល។</span>
                  }
               </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="sm:justify-center gap-2 mt-4">
               <AlertDialogCancel className="w-full sm:w-auto rounded-xl font-bold bg-gray-100 border-0 hover:bg-gray-200 text-gray-600">
                  បោះបង់ (Cancel)
               </AlertDialogCancel>
               <AlertDialogAction 
                  onClick={confirmProcess}
                  className={`w-full sm:w-auto rounded-xl font-bold text-white shadow-lg ${
                     confirmAction === 'pass' 
                        ? 'bg-green-500 hover:bg-green-600 shadow-green-200' 
                        : 'bg-red-500 hover:bg-red-600 shadow-red-200'
                  }`}
               >
                  យល់ព្រម (Confirm)
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}