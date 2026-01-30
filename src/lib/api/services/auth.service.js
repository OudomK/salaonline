import apiClient from '../client'

export const authService = {
  login: (credentials) => apiClient.post('/auth/login', credentials),

  register: (userData) => apiClient.post('/auth/register', userData),

  getMe: () => apiClient.get('/auth/me'),

  changePassword: (data) => apiClient.post('/auth/change-password', data),

  heartbeat: () => apiClient.post('/users/heartbeat'),

  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
}
