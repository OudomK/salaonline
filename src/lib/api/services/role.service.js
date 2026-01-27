import apiClient from "../client";

/**
 * Role Service - Handle role management API calls
 */

export const roleService = {
  /**
   * Get all roles
   */
  getAllRoles: () => apiClient.get("/roles"),

  /**
   * Get role by ID
   */
  getRoleById: (id) => apiClient.get(`/roles/${id}`),

  /**
   * Create new role (admin only)
   */
  createRole: (roleData) => apiClient.post("/roles", roleData),

  /**
   * Update role
   */
  updateRole: (id, roleData) => apiClient.patch(`/roles/${id}`, roleData),

  /**
   * Delete role
   */
  deleteRole: (id) => apiClient.delete(`/roles/${id}`),

  /**
   * Get all permissions (for assigning to roles)
   */
  getAllPermissions: () => apiClient.get("/settings/permissions"),

  /**
   * Add permission to role
   */
  addPermissionToRole: (id, permission) =>
    apiClient.put(`/roles/${id}/permissions`, { permission }),

  /**
   * Remove permission from role
   */
  removePermissionFromRole: (id, permission) =>
    apiClient.patch(`/roles/${id}/permissions`, { permission }),
};
