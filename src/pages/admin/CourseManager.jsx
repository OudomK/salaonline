import React, { useState } from 'react';
import { Search, Plus, Video, Edit, Trash2, X, Save, PlayCircle, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

// 🟢 IMPORT SHADCN COMPONENTS
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

// --- MOCK DATA (បន្ថែមទិន្នន័យឱ្យច្រើនដើម្បីតេស្ត Pagination) ---
const initialCourses = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  title: i % 2 === 0 ? `General English ${i+1}` : `Chinese Basic ${i+1}`,
  level: `Level ${Math.floor(i / 3) + 1}`,
  category: i % 2 === 0 ? "English" : "Chinese",
  videoUrl: `https://bunny.net/video${i+1}`,
  lessons: 10 + i
}));

const CATEGORIES = ["English", "Chinese", "Korean"];

export default function CourseManager() {
  const [courses, setCourses] = useState(initialCourses);
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- PAGINATION STATE 🟢 ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // បង្ហាញ 6 វគ្គក្នុងមួយទំព័រ

  // --- MODAL STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null); 
  const [deleteId, setDeleteId] = useState(null); 
  const [isAlertOpen, setIsAlertOpen] = useState(false); 

  // Form State
  const [formData, setFormData] = useState({
    title: "", level: "", category: "English", videoUrl: "", lessons: 0
  });

  // Filter Logic
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- PAGINATION CALCULATION 🟢 ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- ACTIONS ---
  const handleAddNew = () => {
    setCurrentCourse(null);
    setFormData({ title: "", level: "", category: "English", videoUrl: "", lessons: 0 });
    setIsModalOpen(true);
  };

  const handleEdit = (course) => {
    setCurrentCourse(course);
    setFormData(course);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setCourses(courses.filter(c => c.id !== deleteId));
      setDeleteId(null);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (currentCourse) {
      setCourses(courses.map(c => c.id === currentCourse.id ? { ...formData, id: c.id } : c));
    } else {
      setCourses([...courses, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const getCategoryColor = (cat) => {
    if(cat === "English") return "bg-blue-100 text-blue-600";
    if(cat === "Chinese") return "bg-orange-100 text-orange-600";
    return "bg-green-100 text-green-600";
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 font-khmer-os-battambang">គ្រប់គ្រងមេរៀន (Course Manager)</h1>
           <p className="text-sm text-gray-500 mt-1">Create courses, levels, and upload videos.</p>
        </div>
        <button onClick={handleAddNew} className="flex items-center gap-2 bg-[#00B4F6] hover:bg-[#00a3df] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
           <Plus size={20} /> បង្កើតវគ្គថ្មី (New Course)
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="ស្វែងរកវគ្គសិក្សា..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4F6] outline-none transition-all text-sm font-bold text-gray-700 font-khmer-os-battambang"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} // Reset to page 1 on search
            />
         </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
           <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                 <tr>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">COURSE NAME</th>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">CATEGORY</th>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">LEVEL</th>
                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-400 uppercase tracking-wider">VIDEO LINK</th>
                    <th className="px-6 py-4 text-center text-xs font-extrabold text-gray-400 uppercase tracking-wider">ACTION</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {currentItems.map((course) => ( // 🟢 Use currentItems instead of filteredCourses
                   <tr key={course.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg text-gray-500"><BookOpen size={20} /></div>
                            <div>
                               <p className="text-sm font-bold text-gray-900">{course.title}</p>
                               <p className="text-xs text-gray-400">{course.lessons} Lessons</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getCategoryColor(course.category)}`}>{course.category}</span>
                      </td>
                      <td className="px-6 py-4">
                         <span className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">{course.level}</span>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2 text-blue-500 cursor-pointer hover:underline">
                            <PlayCircle size={16} />
                            <span className="text-xs font-medium truncate max-w-[150px]">{course.videoUrl}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex justify-center gap-2">
                            <button onClick={() => handleEdit(course)} className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-[#00B4F6] hover:text-white transition-all"><Edit size={16} /></button>
                            <button onClick={() => handleDeleteClick(course.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                         </div>
                      </td>
                   </tr>
                 ))}
                 {currentItems.length === 0 && (
                    <tr><td colSpan="5" className="text-center py-10 text-gray-400">រកមិនឃើញទិន្នន័យទេ</td></tr>
                 )}
              </tbody>
           </table>
        </div>

        {/* 🟢 PAGINATION FOOTER */}
        {filteredCourses.length > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t border-gray-100 bg-gray-50/50 gap-4">
                <span className="text-xs font-bold text-gray-500 font-khmer-os-battambang">
                    បង្ហាញ {indexOfFirstItem + 1} ដល់ {Math.min(indexOfLastItem, filteredCourses.length)} នៃ {filteredCourses.length} វគ្គសិក្សា
                </span>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => paginate(currentPage - 1)} 
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                currentPage === i + 1 
                                ? "bg-[#00B4F6] text-white shadow-md shadow-blue-200" 
                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button 
                        onClick={() => paginate(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* SHADCN ALERT DIALOG */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-white rounded-2xl border-0 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-xl text-gray-900 font-khmer-os-battambang">
              តើអ្នកប្រាកដទេ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 font-khmer-os-battambang">
              សកម្មភាពនេះនឹងលុបវគ្គសិក្សានេះចេញពីប្រព័ន្ធជារៀងរហូត។ វាមិនអាចត្រឡប់វិញបានទេ។
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-0 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold">
              បោះបង់ (Cancel)
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold">
              យល់ព្រមលុប (Delete)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full max-w-lg rounded-[24px] shadow-2xl animate-scale-in overflow-hidden">
              <div className="bg-[#00B4F6] p-5 flex justify-between items-center text-white">
                 <h3 className="font-bold text-lg flex items-center gap-2">
                    {currentCourse ? <Edit size={20}/> : <Plus size={20}/>} 
                    {currentCourse ? "កែប្រែវគ្គសិក្សា (Edit Course)" : "បង្កើតវគ្គសិក្សាថ្មី (New Course)"}
                 </h3>
                 <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><X size={24}/></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                 <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Category (ភាសា)</label>
                    <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00B4F6] font-bold text-gray-700">
                       {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-xs font-bold text-gray-500 mb-1 block">Course Name</label>
                       <input required placeholder="Ex: General English" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00B4F6] font-bold text-gray-700"/>
                    </div>
                    <div>
                       <label className="text-xs font-bold text-gray-500 mb-1 block">Level</label>
                       <input required placeholder="Ex: Level 1" value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00B4F6] font-bold text-gray-700"/>
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block flex items-center gap-1"><Video size={14}/> Video URL (Bunny.net)</label>
                    <input required placeholder="https://video.bunnycdn.com/..." value={formData.videoUrl} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00B4F6] text-blue-600 font-medium"/>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Total Lessons</label>
                    <input type="number" placeholder="0" value={formData.lessons} onChange={(e) => setFormData({...formData, lessons: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00B4F6] font-bold text-gray-700"/>
                 </div>
                 <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-2">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#00B4F6] hover:bg-[#00a3df] shadow-lg shadow-blue-200 flex items-center gap-2"><Save size={18} /> Save Course</button>
                 </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}