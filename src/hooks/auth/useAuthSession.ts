'use client'

import { useAuthContext } from '@/contexts/AuthContext'
import type { AuthSession } from '@/types/auth'

export function useAuthSession() {
  const { isAuthenticated, logout, setSession, session, token, user } = useAuthContext()

  function openSession(payload: AuthSession) {
    setSession(payload)
  }

  function closeSession() {
    void logout()
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
