import React, { useState } from 'react';
import { Search, FileSpreadsheet, FileText, Smartphone, Eye, ChevronLeft, ChevronRight, X, Trash2 } from "lucide-react";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // 🟢 វិធី Import ដែលត្រឹមត្រូវបំផុត

// --- MOCK DATA ---
const currentTime = new Date().getTime();
const initialStudents = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1, 
  studentId: `STU${String(i + 1).padStart(3, '0')}`,
  name: i % 2 === 0 ? `Sok Dara ${i + 1}` : `Chan Maly ${i + 1}`,
  email: `student${i + 1}@school.com`,
  phone: `012 999 ${String(i).padStart(3, '0')}`,
  course: i % 3 === 0 ? "English L1" : i % 3 === 1 ? "Korean Basic" : "Chinese L2",
  joinedDate: "2024-01-15",
  lastActive: i % 4 === 0 ? currentTime : currentTime - (60 * 60 * 1000), // Online/Offline
}));

export default function StudentList() {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [selectedStudent, setSelectedStudent] = useState(null);

  // --- FILTER & PAGINATION ---
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone.includes(searchTerm)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const isOnline = (lastActive) => (new Date().getTime() - lastActive) < 5 * 60 * 1000;

  // --- EXPORT PDF (FIXED & TESTED) 🟢 ---
  const exportToPDF = () => {
    try {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(18);
        doc.text("Student List Report", 14, 20);
        
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

        // Columns & Rows
        const tableColumn = ["#", "Name", "Email", "Phone", "Course", "Status"];
        const tableRows = filteredStudents.map(student => [
          student.id,
          student.name,
          student.email,
          student.phone,
          student.course,
          isOnline(student.lastActive) ? "Online" : "Offline"
        ]);

        // Generate Table using autoTable function
        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 35,
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] }, // Blue Header
          styles: { fontSize: 10, cellPadding: 3 },
        });

        doc.save("Student_List_Report.pdf");

    } catch (error) {
        console.error("Error exporting PDF:", error);
        alert("មានបញ្ហាក្នុងការ Export PDF! សូមព្យាយាមម្តងទៀត។");
    }
  };

  // --- EXPORT EXCEL ---
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredStudents);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "Students.xlsx");
  };

  // --- HELPER: Badge Color ---
  const getCourseBadgeStyle = (course) => {
    if (course.includes("English")) return "bg-pink-100 text-pink-600 border-pink-200";
    if (course.includes("Korean")) return "bg-purple-100 text-purple-600 border-purple-200";
    return "bg-blue-100 text-blue-600 border-blue-200";
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-20">
      
      {/* 1. HEADER (No Create Button) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 font-khmer-os-battambang">គ្រប់គ្រងសិស្ស (User Management)</h1>
           <p className="text-sm text-gray-500 mt-1">Manage all students and their information</p>
        </div>
        {/* ❌ Removed Create Button */}
      </div>

      {/* 2. ACTIONS BAR (Search & Export) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
         {/* Search Box */}
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#6366F1] outline-none transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>

         {/* Export Buttons */}
         <div className="flex gap-3">
             <button onClick={exportToExcel} className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2.5 rounded-lg font-bold text-sm shadow-md shadow-green-100 transition-all">
               <FileSpreadsheet size={18} /> Excel
             </button>
             <button onClick={exportToPDF} className="flex items-center gap-2 bg-[#EF4444] hover:bg-[#DC2626] text-white px-4 py-2.5 rounded-lg font-bold text-sm shadow-md shadow-red-100 transition-all">
               <FileText size={18} /> PDF
             </button>
         </div>
      </div>

      {/* 3. TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">EMAIL</th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">NAME</th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">COURSE</th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">PHONE</th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">JOINED</th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-4 text-center text-xs font-extrabold text-gray-400 uppercase tracking-wider">ACTION</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-50">
              {currentItems.map((student) => {
                 const online = isOnline(student.lastActive);
                 return (
                  <tr key={student.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-500">{student.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{student.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-bold text-gray-900">{student.name}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-lg text-xs font-extrabold border ${getCourseBadgeStyle(student.course)}`}>
                        {student.course}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center text-orange-600"><Smartphone size={14} /></div>
                          <span className="text-sm font-bold text-gray-700">{student.phone}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.joinedDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {online ? (
                         <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">Active</span>
                      ) : (
                         <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-400">Offline</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                       <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setSelectedStudent(student)} className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all"><Eye size={18} /></button>
                          <button className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all"><Trash2 size={18} /></button>
                       </div>
                    </td>
                  </tr>
                 );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
           <span className="text-xs text-gray-500 font-medium">Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length} entries</span>
           <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-50 text-gray-600"><ChevronLeft size={16} /></button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-50 text-gray-600"><ChevronRight size={16} /></button>
           </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full max-w-md rounded-[20px] shadow-2xl overflow-hidden animate-scale-in">
              <div className="bg-[#6366F1] p-4 flex justify-between items-center text-white">
                 <h3 className="font-bold">Student Details</h3>
                 <button onClick={() => setSelectedStudent(null)} className="hover:bg-white/20 p-1 rounded-full transition"><X size={20}/></button>
              </div>
              <div className="p-6">
                 <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 bg-indigo-50 text-[#6366F1] rounded-full flex items-center justify-center text-3xl font-bold mb-3 border-4 border-white shadow-lg">{selectedStudent.name.charAt(0)}</div>
                    <h2 className="text-xl font-bold text-gray-800">{selectedStudent.name}</h2>
                    <p className="text-gray-500 text-sm">{selectedStudent.email}</p>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"><span className="text-sm text-gray-500">Phone</span><span className="text-sm font-bold text-gray-800">{selectedStudent.phone}</span></div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"><span className="text-sm text-gray-500">Course</span><span className="text-sm font-bold text-[#6366F1]">{selectedStudent.course}</span></div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"><span className="text-sm text-gray-500">Status</span><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isOnline(selectedStudent.lastActive) ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>{isOnline(selectedStudent.lastActive) ? 'Active Now' : 'Offline'}</span></div>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}