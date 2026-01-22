import apiClient from "../client";

/**
 * Homework Service - Handle homework API calls
 */

export const homeworkService = {
  /**
   * Get all homework assignments
   */
  getAllHomework: (params) => apiClient.get("/homework", { params }),

  /**
   * Get homework by ID
   */
  getHomeworkById: (id) => apiClient.get(`/homework/${id}`),

  /**
   * Get my homework submissions
   */
  getMyHomework: () => apiClient.get("/homework/my"),

  /**
   * Create homework assignment (teacher/admin)
   */
  createHomework: (homeworkData) => apiClient.post("/homework", homeworkData),

  /**
   * Update homework
   */
  updateHomework: (id, homeworkData) =>
    apiClient.put(`/homework/${id}`, homeworkData),

  /**
   * Delete homework
   */
  deleteHomework: (id) => apiClient.delete(`/homework/${id}`),

  /**
   * Submit homework
   */
  submitHomework: (id, submissionData) =>
    apiClient.post(`/homework/${id}/submit`, submissionData),

  /**
   * Grade homework submission (teacher/admin)
   */
  gradeHomework: (id, submissionId, gradeData) =>
    apiClient.post(
      `/homework/${id}/submissions/${submissionId}/grade`,
      gradeData,
    ),
};
