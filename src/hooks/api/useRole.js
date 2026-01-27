import { useMutation, useQuery } from "@tanstack/react-query";
import { roleService } from "@/lib/api/services";

/**
 * Role Hooks - React Query hooks for role management
 */

export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => roleService.getAllRoles().then((res) => res.data),
  });
};

export const useRole = (id) => {
  return useQuery({
    queryKey: ["roles", id],
    queryFn: () => roleService.getRoleById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const usePermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: () => roleService.getAllPermissions().then((res) => res.data),
  });
};

export const useCreateRole = () => {
  return useMutation({
    mutationFn: (roleData) => roleService.createRole(roleData),
  });
};

export const useUpdateRole = () => {
  return useMutation({
    mutationFn: ({ id, roleData }) => roleService.updateRole(id, roleData),
  });
};

export const useDeleteRole = () => {
  return useMutation({
    mutationFn: (id) => roleService.deleteRole(id),
  });
};

export const useAddPermission = () => {
  return useMutation({
    mutationFn: ({ id, permission }) => roleService.addPermissionToRole(id, permission),
  });
};

export const useRemovePermission = () => {
  return useMutation({
    mutationFn: ({ id, permission }) => roleService.removePermissionFromRole(id, permission),
  });
};
