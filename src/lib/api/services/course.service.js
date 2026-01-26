import apiClient from '../client'

/**
 * Course Service - Handle course management API calls
 */

export const courseService = {
  /**
   * Get all courses
   */
  getAllCourses: (params) => apiClient.get('/courses', { params }),

  /**
   * Get all courses for admin (with pagination and search)
   */
  getAdminCourses: (params) => apiClient.get('/courses/admin', { params }),

  /**
   * Get course by ID
   */
  getCourseById: (id) => apiClient.get(`/courses/${id}`),

  /**
   * Get published courses (student view)
   */
  getPublishedCourses: (params) => apiClient.get('/courses', { params }),

  /**
   * Get enrolled courses for current user
   */
  getMyCourses: () => apiClient.get('/courses/my-courses'),

  /**
   * Create new course (admin/teacher)
   */
  createCourse: (courseData) => apiClient.post('/courses', courseData),

  /**
   * Update course
   */
  updateCourse: (id, courseData) => apiClient.put(`/courses/${id}`, courseData),

  /**
   * Delete course
   */
  deleteCourse: (id) => apiClient.delete(`/courses/${id}`),

  /**
   * Enroll in course
   */
  enrollCourse: (courseId) => apiClient.post(`/courses/${courseId}/enroll`),

  /**
   * Get course lessons
   */
  getCourseLessons: (courseId) => apiClient.get(`/courses/${courseId}/lessons`),

  /**
   * Get lesson by ID
   */
  getLessonById: (courseId, lessonId) =>
    apiClient.get(`/courses/${courseId}/lessons/${lessonId}`),

  /**
   * Publish course
   */
  publishCourse: (id) => apiClient.patch(`/courses/${id}/publish`),

  /**
   * Hide course
   */
  hideCourse: (id) => apiClient.patch(`/courses/${id}/hide`),
}
