import { useMutation, useQuery } from "@tanstack/react-query";
import { userService } from "@/lib/api/services";

/**
 * User Hooks - React Query hooks for user management
 */

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (userData) => userService.createUser(userData),
  });
};

export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userService.getAllUsers(params).then((res) => res.data),
  });
};

export const useStudents = (params = {}) => {
  return useQuery({
    queryKey: ["users", "students", params],
    queryFn: () => userService.getStudents(params).then((res) => res.data),
  });
};

export const useNonAdminStudents = (params = {}) => {
  return useQuery({
    queryKey: ["users", "non-admin-student", params],
    queryFn: () => userService.getNonAdminStudents(params).then((res) => res.data),
  });
};

export const useUser = (id) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => userService.getUserById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (userData) => userService.updateProfile(userData),
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: ({ id, userData }) => userService.updateUser(id, userData),
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: (id) => userService.deleteUser(id),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ oldPassword, newPassword }) =>
      userService.changePassword(oldPassword, newPassword),
  });
};

export const useGetTeachers = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: () => userService.getAllTeachers().then((res) => res.data),
  });
};
