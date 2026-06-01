'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  setApiSessionRefreshHandler,
  setApiUnauthorizedHandler,
} from '@/services/api/api'
import {
  hasSessionUserPayload,
  mapRefreshResponseToAuthUser,
} from '@/services/auth/authMapper'
import {
  buildSessionUserFromLogin,
  login as loginRequest,
} from '@/services/auth/authService'
import {
  clearAuthTokens,
  getRefreshToken,
  getToken,
  setAuthTokens,
} from '@/services/storage/tokenStorage'
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '@/services/storage/userStorage'
import type {
  AuthSession,
  AuthState,
  AuthUser,
  LoginRequestPayload,
} from '@/types/auth'

interface AuthContextValue extends AuthState {
  clearAuth: () => void
  hydrateSession: () => void
  login: (credentials: LoginRequestPayload) => Promise<AuthUser>
  logout: () => void
  setSession: (session: AuthSession) => void
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  token: null,
  isAuthenticated: false,
  isBootstrapping: true,
  clearAuth: () => {},
  hydrateSession: () => {},
  login: async () => {
    throw new Error('AuthProvider não inicializado.')
  },
  logout: () => {},
  setSession: () => {},
})

function readStoredSession(): AuthSession | null {
  const accessToken = getToken()
  const refreshToken = getRefreshToken()
  const user = getStoredUser()

  if (!accessToken || !user) {
    return null
  }

  return {
    accessToken,
    refreshToken,
    user,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(() => readStoredSession())
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  const clearAuth = useCallback(() => {
    clearAuthTokens()
    clearStoredUser()
    setSessionState(null)
  }, [])

  const setSession = useCallback((nextSession: AuthSession) => {
    setAuthTokens({
      token: nextSession.accessToken,
      refreshToken: nextSession.refreshToken,
    })
    setStoredUser(nextSession.user)
    setSessionState(nextSession)
  }, [])

  const hydrateSession = useCallback(() => {
    setSessionState(readStoredSession())
    setIsBootstrapping(false)
  }, [])

  const login = useCallback(
    async (credentials: LoginRequestPayload) => {
      const response = await loginRequest(credentials)
      const user = buildSessionUserFromLogin(response)

      setSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user,
      })

      return user
    },
    [setSession],
  )

  useEffect(() => {
    setApiSessionRefreshHandler((payload) => {
      setSessionState((currentSession) => {
        if (!currentSession) {
          return currentSession
        }

        const nextUser = hasSessionUserPayload(payload.user)
          ? mapRefreshResponseToAuthUser(payload.user, currentSession.user)
          : currentSession.user

        const nextSession = {
          ...currentSession,
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          user: nextUser,
        }

        setStoredUser(nextUser)
        return nextSession
      })
    })

    setApiUnauthorizedHandler(() => {
      clearAuth()
      setIsBootstrapping(false)
    })

    return () => {
      setApiSessionRefreshHandler(null)
      setApiUnauthorizedHandler(null)
    }
  }, [clearAuth])

  useEffect(() => {
    hydrateSession()
  }, [hydrateSession])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      token: session?.accessToken ?? null,
      isAuthenticated: Boolean(session?.accessToken && session?.user),
      isBootstrapping,
      clearAuth,
      hydrateSession,
      login,
      logout: clearAuth,
      setSession,
    }),
    [clearAuth, hydrateSession, isBootstrapping, login, session, setSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  return useContext(AuthContext)
}
