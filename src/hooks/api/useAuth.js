import { useMutation, useQuery } from '@tanstack/react-query'
import { authService } from '@/lib/api/services'

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (response) => {
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      if (response.data.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data))
      }
    },
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData) => authService.register(userData),
    onSuccess: (response) => {
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
    },
  })
}

export const useMe = (options = {}) => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await authService.getMe()
      return response.data.data
    },
    retry: false,
    ...options,
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data) => authService.changePassword(data),
  })
}

export const useHeartbeat = (options = {}) => {
  return useQuery({
    queryKey: ['auth', 'heartbeat'],
    queryFn: () => authService.heartbeat(),
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
    ...options,
  })
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}
