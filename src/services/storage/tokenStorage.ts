import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/constants/storage'

export function getToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setToken(token: string) {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function getRefreshToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setRefreshToken(token: string) {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export function setAuthTokens(payload: { token: string; refreshToken?: string | null }) {
  setToken(payload.token)

  if (payload.refreshToken) {
    setRefreshToken(payload.refreshToken)
  }
}

export function clearToken() {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function clearRefreshToken() {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function clearAuthTokens() {
  clearToken()
  clearRefreshToken()
}
