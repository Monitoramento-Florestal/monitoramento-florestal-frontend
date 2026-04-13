'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '@/types/auth'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  token: null,
  setAuth: () => {},
  clearAuth: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      setAuth: (nextToken, nextUser) => {
        setToken(nextToken)
        setUser(nextUser)
      },
      clearAuth: () => {
        setToken(null)
        setUser(null)
      },
    }),
    [token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  return useContext(AuthContext)
}
