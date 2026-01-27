import React, { useState } from "react";
import {
  Search,
  FileSpreadsheet,
  FileText,
  Trash2,
  UserPen,
  Calendar,
  Signal,
  Filter,
  Check,
  Plus,
} from "lucide-react";
import * as XLSX from "xlsx";

// 🟢 IMPORT SHADCN COMPONENTS
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
// 🟢 បន្ថែម Dropdown សម្រាប់ Filter
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useUsers } from "@/hooks/api";

// ... (រក្សាទុក Helper Functions និង Mock Data នៅដដែល) ...
// --- HELPER: Phone Color ---
const getPhoneStyle = (phone) => {
  const p = phone.replace(/\s/g, "");
  if (/^(010|015|016|069|070|081|086|087|093|096|098)/.test(p))
    return { bg: "bg-[#00C853]", icon: "S" };
  if (/^(011|012|014|017|061|076|077|078|085|089|092|095|099)/.test(p))
    return { bg: "bg-[#FF9800]", icon: "C" };
  return { bg: "bg-blue-500", icon: "M" };
};

const getCourseColor = (course) => {
  if (course.includes("English"))
    return "bg-pink-50 text-pink-600 border-pink-100";
  if (course.includes("Korean"))
    return "bg-indigo-50 text-indigo-600 border-indigo-100";
  if (course.includes("Chinese"))
    return "bg-orange-50 text-orange-600 border-orange-100";
  return "bg-gray-50 text-gray-600";
};

// --- MOCK DATA ---
export default function StudentList() {
  const { data: studentss } = useUsers({
    role_id: 5,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("All"); // 🟢 New State for Filter
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Edit
  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditOpen(true);
  };

  const isOnline = (lastActive) =>
    new Date().getTime() - lastActive < 5 * 60 * 1000;

  // 🟢 Export Excel Function
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredStudents); // Export only filtered data
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "Students_List.xlsx");
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-khmer-os-battambang">
            គ្រប់គ្រងសិស្ស (User Management)
          </h1>
          <p className="text-sm text-gray-500 font-khmer-os-battambang">
            គ្រប់គ្រងព័ត៌មានសិស្ស និងការទំនាក់ទំនង
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6">
        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="ស្វែងរកតាមឈ្មោះ ឬ លេខទូរស័ព្ទ..."
              className="pl-10 bg-gray-50 border-gray-200 rounded-xl h-11 focus-visible:ring-[#00B4F6] font-khmer-os-battambang"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            {/* 🟢 FILTER BUTTON (With Dropdown) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-lg gap-2 text-gray-600 border-dashed border-gray-300 h-11"
                >
                  <Filter size={16} />
                  Filter:{" "}
                  <span className="font-bold text-gray-900">
                    {filterCourse}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white">
                <DropdownMenuLabel>Filter by Course</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setFilterCourse("All")}
                  className="cursor-pointer justify-between"
                >
                  All Courses {filterCourse === "All" && <Check size={14} />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterCourse("English")}
                  className="cursor-pointer justify-between"
                >
                  English {filterCourse === "English" && <Check size={14} />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterCourse("Chinese")}
                  className="cursor-pointer justify-between"
                >
                  Chinese {filterCourse === "Chinese" && <Check size={14} />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterCourse("Korean")}
                  className="cursor-pointer justify-between"
                >
                  Korean {filterCourse === "Korean" && <Check size={14} />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 🟢 EXPORT BUTTON (Fixed onClick) */}
            <Button
              onClick={exportToExcel} // ដាក់ Function ត្រង់នេះ
              className="bg-[#10B981] hover:bg-[#059669] text-white rounded-lg gap-2 font-bold shadow-sm shadow-green-200 h-11"
            >
              <FileSpreadsheet size={18} /> Export Excel
            </Button>
          </div>
        </div>

        {/* ... (TABLE CODE នៅដដែល) ... */}
        {/* សូមដាក់កូដ Table ពីចម្លើយមុននៅទីនេះ... */}
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-b-gray-100">
                <TableHead className="font-bold text-gray-400 text-xs uppercase tracking-wider pl-6 font-khmer-os-battambang">
                  សិស្ស (Student)
                </TableHead>
                <TableHead className="font-bold text-gray-400 text-xs uppercase tracking-wider font-khmer-os-battambang">
                  លេខទូរស័ព្ទ (Phone)
                </TableHead>
                <TableHead className="font-bold text-gray-400 text-xs uppercase tracking-wider font-khmer-os-battambang">
                  វគ្គសិក្សា (Course)
                </TableHead>
                <TableHead className="font-bold text-gray-400 text-xs uppercase tracking-wider font-khmer-os-battambang">
                  ថ្ងៃចូលរៀន
                </TableHead>
                <TableHead className="font-bold text-gray-400 text-xs uppercase tracking-wider text-center font-khmer-os-battambang">
                  ស្ថានភាព
                </TableHead>
                <TableHead className="font-bold text-gray-400 text-xs uppercase tracking-wider text-center font-khmer-os-battambang">
                  សកម្មភាព
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentss?.data.map((student) => {
                const carrier = getPhoneStyle(student.phone);
                const online = isOnline(student.lastActive);

                return (
                  <TableRow
                    key={student.id}
                    className="border-b-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* 1. STUDENT (Name + ID) */}
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 bg-blue-50 text-[#00B4F6] border border-blue-100">
                          <AvatarFallback className="font-bold text-sm">
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-sm font-khmer-os-battambang">
                            {student.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold tracking-wide">
                            {student.studentId}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* 2. PHONE BADGE */}
                    <TableCell>
                      <div
                        className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-white font-bold text-[11px] shadow-sm w-fit ${carrier.bg}`}
                      >
                        <div className="bg-white/20 p-0.5 rounded-md">
                          <Signal size={10} strokeWidth={3} />
                        </div>
                        <span className="pr-1 tracking-wide font-mono">
                          {student.phone}
                        </span>
                      </div>
                    </TableCell>

                    {/* 3. COURSE BADGE */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-lg px-3 py-1 text-[10px] font-bold shadow-none ${getCourseColor(student.course)}`}
                      >
                        {student.course}
                      </Badge>
                    </TableCell>

                    {/* 4. JOINED DATE */}
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                        <Calendar size={14} className="text-gray-300" />{" "}
                        {student.joinedDate}
                      </div>
                    </TableCell>

                    {/* 5. STATUS */}
                    <TableCell className="text-center">
                      {online ? (
                        <Badge className="bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 rounded-full px-3 text-[10px] font-bold shadow-none border-0">
                          ● Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-gray-400 border-gray-200 rounded-full px-3 text-[10px] font-bold bg-gray-50"
                        >
                          Offline
                        </Badge>
                      )}
                    </TableCell>

                    {/* 6. ACTIONS */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all shadow-sm"
                        >
                          <UserPen size={14} />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-sm">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* ... (PAGINATION CODE នៅដដែល) ... */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
          <span className="text-xs text-gray-400 font-khmer-os-battambang">
            បង្ហាញ 1- នៃ {studentss?.data.length}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 text-xs border-gray-200 text-gray-500 rounded-lg"
            >
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(
                    Math.ceil(filteredStudents.length / itemsPerPage),
                    p + 1,
                  ),
                )
              }
              className="h-8 text-xs border-gray-200 text-gray-500 rounded-lg"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL (No Email) */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white rounded-2xl sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="font-bold text-lg font-khmer-os-battambang">
              កែប្រែព័ត៌មាន (Edit Student)
            </DialogTitle>
            <DialogDescription>
              ID: {selectedStudent?.studentId}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 font-khmer-os-battambang">
                ឈ្មោះសិស្ស
              </label>
              <Input
                defaultValue={selectedStudent?.name}
                className="rounded-xl h-11 font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 font-khmer-os-battambang">
                លេខទូរស័ព្ទ
              </label>
              <Input
                defaultValue={selectedStudent?.phone}
                className="rounded-xl h-11 font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 font-khmer-os-battambang">
                វគ្គសិក្សា
              </label>
              <Input
                defaultValue={selectedStudent?.course}
                className="rounded-xl h-11"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsEditOpen(false)}
              className="w-full bg-[#00B4F6] hover:bg-[#009bd1] text-white rounded-xl font-bold font-khmer-os-battambang h-11"
            >
              រក្សាទុក (Save Changes)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* <CreateForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} /> */}
    </div>
  );
}
