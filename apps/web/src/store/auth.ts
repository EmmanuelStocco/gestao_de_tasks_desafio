import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthResponse } from '@gestao-tarefas/types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  login: (authResponse: AuthResponse) => void
  logout: () => void
  updateTokens: (accessToken: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (authResponse: AuthResponse) => {
        set({
          user: authResponse.user,
          accessToken: authResponse.accessToken,
          refreshToken: authResponse.refreshToken,
          isAuthenticated: true,
        })
      },
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })
      },
      updateTokens: (accessToken: string) => {
        set({ accessToken })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
