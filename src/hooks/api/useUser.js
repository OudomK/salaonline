import { useMutation, useQuery } from '@tanstack/react-query'
import { userService } from '@/lib/api/services'

/**
 * User Hooks - React Query hooks for user management
 */

export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getAllUsers(params).then((res) => res.data),
  })
}

export const useUser = (id) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getUserById(id).then((res) => res.data),
    enabled: !!id,
  })
}

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (userData) => userService.updateProfile(userData),
  })
}

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: ({ id, userData }) => userService.updateUser(id, userData),
  })
}

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: (id) => userService.deleteUser(id),
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ oldPassword, newPassword }) =>
      userService.changePassword(oldPassword, newPassword),
  })
}
