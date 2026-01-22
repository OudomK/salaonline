import apiClient from '../client'

export const authService = {
  login: (credentials) => apiClient.post('/login', credentials),

  register: (userData) => apiClient.post('/register', userData),

  getMe: () => apiClient.get('/me'),

  changePassword: (data) => apiClient.post('/change-password', data),

  heartbeat: () => apiClient.post('/users/heartbeat'),

  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
}
