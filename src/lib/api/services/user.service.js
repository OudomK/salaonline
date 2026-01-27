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
  updateUser: (id, userData) => apiClient.put(`/users/${id}`, userData),

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
