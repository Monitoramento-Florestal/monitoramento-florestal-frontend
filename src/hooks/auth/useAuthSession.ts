'use client'

import { useAuthContext } from '@/contexts/AuthContext'
import type { User } from '@/types/auth'

export function useAuthSession() {
  const { clearAuth, isAuthenticated, setAuth, token, user } = useAuthContext()

  function openSession(payload: { token: string; user: User }) {
    setAuth(payload.token, payload.user)
  }

  function closeSession() {
    clearAuth()
  }

  return {
    token,
    user,
    isAuthenticated,
    openSession,
    closeSession,
  }
}
