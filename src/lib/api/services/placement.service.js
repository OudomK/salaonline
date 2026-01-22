import apiClient from '../client'

/**
 * Placement Test Service - Handle placement test API calls
 */

export const placementService = {
  /**
   * Get all placement tests
   */
  getAllTests: (params) => apiClient.get('/placement-tests', { params }),

  /**
   * Get placement test by ID
   */
  getTestById: (id) => apiClient.get(`/placement-tests/${id}`),

  /**
   * Create placement test (admin)
   */
  createTest: (testData) => apiClient.post('/placement-tests', testData),

  /**
   * Update placement test
   */
  updateTest: (id, testData) => apiClient.put(`/placement-tests/${id}`, testData),

  /**
   * Delete placement test
   */
  deleteTest: (id) => apiClient.delete(`/placement-tests/${id}`),

  /**
   * Submit test answers
   */
  submitTest: (id, answers) => apiClient.post(`/placement-tests/${id}/submit`, { answers }),

  /**
   * Get test result
   */
  getTestResult: (id) => apiClient.get(`/placement-tests/${id}/result`),
}
