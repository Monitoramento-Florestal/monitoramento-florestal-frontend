'use client'

import { useAuthContext } from '@/contexts/AuthContext'
import type { AuthSession } from '@/types/auth'

export function useAuthSession() {
  const { clearAuth, isAuthenticated, setSession, session, token, user } = useAuthContext()

  function openSession(payload: AuthSession) {
    setSession(payload)
  }

  function closeSession() {
    clearAuth()
  }

  return {
    session,
    token,
    user,
    isAuthenticated,
    openSession,
    closeSession,
  }
}
