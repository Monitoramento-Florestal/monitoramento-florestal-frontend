'use client'

import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { setApiUnauthorizedHandler } from '@/services/api/api'
import { clearAuthTokens, getToken, setAuthTokens } from '@/services/storage/tokenStorage'
import { clearStoredUser, getStoredUser, setStoredUser } from '@/services/storage/userStorage'
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

  useEffect(() => {
    const storedToken = getToken()
    const storedUser = getStoredUser()

    if (storedToken) {
      setToken(storedToken)
    }

    if (storedUser) {
      setUser(storedUser)
    }
  }, [])

  useEffect(() => {
    setApiUnauthorizedHandler(() => {
      setToken(null)
      setUser(null)
      clearAuthTokens()
      clearStoredUser()
    })

    return () => {
      setApiUnauthorizedHandler(null)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      setAuth: (nextToken, nextUser) => {
        setAuthTokens({ token: nextToken })
        setStoredUser(nextUser)
        setToken(nextToken)
        setUser(nextUser)
      },
      clearAuth: () => {
        clearAuthTokens()
        clearStoredUser()
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
