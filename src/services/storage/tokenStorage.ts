import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/constants/storage'

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

function setCookie(name: string, value: string, maxAge = COOKIE_MAX_AGE) {
  if (typeof document === 'undefined') {
    return
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`
}

function clearCookie(name: string) {
  if (typeof document === 'undefined') {
    return
  }

  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`
}

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
  setCookie(AUTH_TOKEN_KEY, token)
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
  setCookie(REFRESH_TOKEN_KEY, token)
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
  clearCookie(AUTH_TOKEN_KEY)
}

export function clearRefreshToken() {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(REFRESH_TOKEN_KEY)
  clearCookie(REFRESH_TOKEN_KEY)
}

export function clearAuthTokens() {
  clearToken()
  clearRefreshToken()
}
