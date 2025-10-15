import axios from 'axios'
import { useAuthStore } from '@/store/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { refreshToken, updateTokens } = useAuthStore.getState()
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken,
          })
          
          const { accessToken } = response.data
          updateTokens(accessToken)
          
          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api
