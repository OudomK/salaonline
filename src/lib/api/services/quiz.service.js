import apiClient from '../client'

/**
 * Quiz Service - Handle quiz/test API calls
 */

export const quizService = {
  /**
   * Get all quizzes (admin)
   */
  getAllQuizzes: (params) => apiClient.get('/quiz', { params }),

  /**
   * Get quiz by ID
   */
  getQuizById: (id) => apiClient.get(`/quiz/${id}`),

  /**
   * Get first test/placement quiz for new user by category
   */
  getFirstTest: (categoryId) => apiClient.get(`/quiz/category/${categoryId}/first-test`),

  /**
   * Create new quiz (admin)
   */
  createQuiz: (quizData) => apiClient.post('/quiz', quizData),

  /**
   * Update quiz (admin)
   */
  updateQuiz: (id, quizData) => apiClient.patch(`/quiz/${id}`, quizData),

  /**
   * Delete quiz (admin)
   */
  deleteQuiz: (id) => apiClient.delete(`/quiz/${id}`),

  /**
   * Submit quiz answers
   */
  submitQuiz: (quizData) => apiClient.post('/quiz/submit', quizData),

  /**
   * Get my quiz history
   */
  getMyQuizHistory: () => apiClient.get('/quiz/my-quiz-history'),

  /**
   * Get user quiz history (admin)
   */
  getUserQuizHistory: (userId) => apiClient.get(`/quiz/user/${userId}/history`),
}
