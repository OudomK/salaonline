import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
  Venus,
  Mars,
  MarsIcon,
} from "lucide-react";
import { useUsers, useDeleteUser } from "@/hooks/api";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import CreateUserForm from "./components/CreateUserForm";
import { imgUrl } from "@/lib/helper/enviroment";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function UserManager() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const itemsPerPage = 10;

  const { data: usersData, isLoading: isLoadingUsers } = useUsers({
    params: {
      page: currentPage,
      size: itemsPerPage,
      search: debouncedSearch,
    },
    enabled: true,
  });

  const users = usersData?.data || [];
  const totalPages = usersData?.total_pages || 1;
  const totalItems = usersData?.total_items || users?.length || 0;

  const deleteMutation = useDeleteUser();

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Open modal for create/edit
  const handleOpenModal = (user) => {
    setIsModalOpen(true);
    setCurrentUser(user);
  };

  // Handle delete
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          toast.success("User deleted successfully");
          setIsAlertOpen(false);
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to delete user");
        },
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="mb-2 font-bold text-gray-900 text-2xl">
          User Management
        </h1>
        <p className="text-gray-500 text-sm">
          Manage users, roles and permissions
        </p>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex sm:flex-row flex-col justify-between items-center gap-4 bg-gray-50 p-4 border-gray-100 border-b">
          <div className="relative flex-1 max-w-md">
            <Search
              className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2 transform"
              size={18}
            />
            <Input
              placeholder="Search users by name "
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white pl-10 border-gray-200 focus:border-blue-500 h-10"
            />
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-[#00B4F6] hover:bg-[#0099D6] text-white"
          >
            <Plus size={18} className="mr-2" />
            Add User
          </Button>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 border-gray-100 border-b">
              <TableHead className="px-6 py-4 font-extrabold text-gray-400 text-xs uppercase tracking-wider">
                User
              </TableHead>
              <TableHead className="px-6 py-4 font-extrabold text-gray-400 text-xs uppercase tracking-wider">
                Gender
              </TableHead>
              <TableHead className="px-6 py-4 font-extrabold text-gray-400 text-xs uppercase tracking-wider">
                Role
              </TableHead>
              <TableHead className="px-6 py-4 font-extrabold text-gray-400 text-xs uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 font-extrabold text-gray-400 text-xs text-center uppercase tracking-wider">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingUsers ? (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center">
                  <Loader2
                    className="mx-auto text-[#00B4F6] animate-spin"
                    size={32}
                  />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-gray-400 text-center"
                >
                  {searchTerm
                    ? "No users found matching your search"
                    : "No users found"}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="flex justify-center items-center rounded-full w-10 h-10 overflow-hidden font-bold text-white text-sm">
                        <AvatarImage
                          className="object-cover"
                          src={imgUrl + user.avatar}
                        />
                        <AvatarFallback>
                          {user.first_name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {user?.first_name || user?.last_name ? (
                            <span>
                              {user.first_name} {user.last_name}
                            </span>
                          ) : (
                            <span>{user.username}</span>
                          )}
                        </p>
                        <p className="text-gray-400 text-xs">ID: {user.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="secondary" className="gap-2">
                      {" "}
                      {user?.gender === "male" ? (
                        <MarsIcon size={16} color="blue" />
                      ) : (
                        <Venus size={16} color="pink" />
                      )}{" "}
                      {user?.gender}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={
                        user?.role?.name === "teacher"
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-[#10B981]"
                      }
                    >
                      {user?.role?.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="bg-gray-100 hover:bg-blue-500 p-2 rounded-lg text-gray-600 hover:text-white transition-all"
                        title="Edit User"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user.id)}
                        className="bg-red-50 hover:bg-red-500 p-2 rounded-lg text-red-500 hover:text-white transition-all"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {!isLoadingUsers && (totalItems > 0 || users.length > 0) && (
          <div className="flex md:flex-row flex-col justify-between items-center gap-4 bg-gray-50/50 p-4 border-gray-100 border-t">
            <p className="text-gray-500 text-xs">
              Showing{" "}
              {users.length > 0
                ? currentPage === 1
                  ? 1
                  : (currentPage - 1) * itemsPerPage + 1
                : 0}{" "}
              to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems || users.length)}{" "}
              of {totalItems || users.length} users
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || users.length === 0}
                className="px-3 h-8"
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {totalPages > 1 &&
                  Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-8 w-8 p-0 ${
                          currentPage === pageNum
                            ? "bg-[#00B4F6] text-white hover:bg-[#0099D6]"
                            : ""
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage >= totalPages || users.length === 0}
                className="px-3 h-8"
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <CreateUserForm
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        currentUser={currentUser}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
