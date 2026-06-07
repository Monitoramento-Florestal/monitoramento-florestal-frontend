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
import { usePathname, useRouter } from 'next/navigation'

import { APP_ROUTES } from '@/constants/routes'
import {
  setApiSessionRefreshHandler,
  setApiUnauthorizedHandler,
} from '@/services/api/api'
import {
  mapLoginResponseToAuthUser,
  hasSessionUserPayload,
  mapRefreshResponseToAuthUser,
} from '@/services/auth/authMapper'
import {
  getSessionSnapshot,
  login as loginRequest,
  logout as logoutRequest,
} from '@/services/auth/authService'
import {
  clearAuthTokens,
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
  hydrateSession: () => Promise<void>
  login: (credentials: LoginRequestPayload) => Promise<AuthUser>
  logout: () => Promise<void>
  setSession: (session: AuthSession) => void
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  token: null,
  isAuthenticated: false,
  isBootstrapping: true,
  clearAuth: () => {},
  hydrateSession: async () => {},
  login: async () => {
    throw new Error('AuthProvider não inicializado.')
  },
  logout: async () => {},
  setSession: () => {},
})

function readStoredSession(): AuthSession | null {
  const accessToken = getToken()
  const user = getStoredUser()

  if (!accessToken || !user) {
    return null
  }

  return {
    accessToken,
    refreshToken: null,
    user,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [session, setSessionState] = useState<AuthSession | null>(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [shouldRedirectToLogin, setShouldRedirectToLogin] = useState(false)

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
    setShouldRedirectToLogin(false)
  }, [])

  const hydrateSession = useCallback(async () => {
    const cachedSession = readStoredSession()

    if (cachedSession) {
      setSessionState(cachedSession)
    }

    try {
      const response = await getSessionSnapshot()
      const user = mapLoginResponseToAuthUser(response, cachedSession?.user)

      setSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken ?? null,
        user,
      })
    } catch {
      clearAuth()
    } finally {
      setIsBootstrapping(false)
    }
  }, [clearAuth, setSession])

  const login = useCallback(
    async (credentials: LoginRequestPayload) => {
      const response = await loginRequest(credentials)
      const user = mapLoginResponseToAuthUser(response)

      setSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken ?? null,
        user,
      })

      return user
    },
    [setSession],
  )

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } finally {
      clearAuth()
      setIsBootstrapping(false)
      setShouldRedirectToLogin(true)
    }
  }, [clearAuth])

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
      setShouldRedirectToLogin(true)
    })

    return () => {
      setApiSessionRefreshHandler(null)
      setApiUnauthorizedHandler(null)
    }
  }, [clearAuth])

  useEffect(() => {
    void hydrateSession()
  }, [hydrateSession])

  useEffect(() => {
    if (!shouldRedirectToLogin) {
      return
    }

    if (pathname === APP_ROUTES.LOGIN) {
      setShouldRedirectToLogin(false)
      return
    }

    router.replace(APP_ROUTES.LOGIN)
  }, [pathname, router, shouldRedirectToLogin])

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
      logout,
      setSession,
    }),
    [clearAuth, hydrateSession, isBootstrapping, login, logout, session, setSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  return useContext(AuthContext)
}
