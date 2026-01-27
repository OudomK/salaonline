import apiClient from "../client";

/**
 * User Service - Handle user management API calls
 */

export const userService = {
  /**
   * Create new user (admin only)
   */
  createUser: (userData) => apiClient.post("/users", userData),

  /**
   * Get all users (admin only)
   */
  getAllUsers: (params) => apiClient.get("/users", { params }),

  /**
   * Get students only
   */
  getStudents: (params) => apiClient.get("/users/students", { params }),

  /**
   * Get non-admin students (for user management - teachers only)
   */
  getNonAdminStudents: (params) => apiClient.get("/users/non-admin-student", { params }),

  /**
   * Get user by ID
   */
  getUserById: (id) => apiClient.get(`/users/${id}`),

  /**
   * Update user profile
   */
  updateProfile: (userData) => apiClient.put("/users/profile", userData),

  /**
   * Update user by ID (admin)
   */
  updateUser: (id, userData) => apiClient.patch(`/users/${id}`, userData),

  /**
   * Delete user (admin)
   */
  deleteUser: (id) => apiClient.delete(`/users/${id}`),

  /**
   * Change password
   */
  changePassword: (oldPassword, newPassword) =>
    apiClient.post("/users/change-password", { oldPassword, newPassword }),

  getAllTeachers: (teacher_name) =>
    apiClient.get("/users/teachers", { params: { teacher_name } }),
};
