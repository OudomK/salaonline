import apiClient from '../client'

/**
 * Video Service - Handle video management API calls
 */

export const videoService = {
  /**
   * Get all videos (admin)
   */
  getAllVideos: () => apiClient.get('/videos'),

  /**
   * Get video by ID
   */
  getVideoById: (id) => apiClient.get(`/videos/${id}`),

  /**
   * Get videos by course ID
   */
  getVideosByCourse: (courseId) => apiClient.get(`/videos/course/${courseId}`),

  /**
   * Upload video to course (admin)
   */
  uploadVideo: (formData) => {
    const formDataInstance = new FormData()
    Object.keys(formData).forEach(key => {
      formDataInstance.append(key, formData[key])
    })
    return apiClient.post('/videos/upload', formDataInstance, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  /**
   * Upload video chunk by chunk (admin)
   */
  uploadVideoChunk: (formData) => {
    const formDataInstance = new FormData()
    Object.keys(formData).forEach(key => {
      formDataInstance.append(key, formData[key])
    })
    return apiClient.post('/videos/upload-chunk', formDataInstance, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  /**
   * Delete video (admin)
   */
  deleteVideo: (id) => apiClient.delete(`/videos/${id}`),

  /**
   * Get video library (admin/teacher)
   */
  getVideoLibrary: () => apiClient.get('/videos/library'),

  /**
   * Watch video (student)
   */
  watchVideo: (id) => apiClient.get(`/videos/${id}/watch`),
}
