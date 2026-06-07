import type { NextRequest, NextResponse } from 'next/server'

import {
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_SESSION_KEY,
} from '@/constants/storage'
import type { BackendAuthResponse, LoginResponse } from '@/types/auth'

const FALLBACK_ACCESS_MAX_AGE = 60 * 15
const FALLBACK_REFRESH_MAX_AGE = 60 * 60 * 24 * 7

type ResponseWithCookies = NextResponse

function decodeJwtPayload(token: string) {
  try {
    const [, payload] = token.split('.')

    if (!payload) {
      return null
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '=',
    )
    const parsed = JSON.parse(Buffer.from(padded, 'base64').toString('utf8'))

    return parsed as { exp?: number }
  } catch {
    return null
  }
}

function resolveCookieMaxAge(token: string, fallback: number) {
  const payload = decodeJwtPayload(token)
  const expiresAt = payload?.exp

  if (!expiresAt) {
    return fallback
  }

  const maxAge = expiresAt - Math.floor(Date.now() / 1000)
  return maxAge > 0 ? maxAge : fallback
}

function buildBaseCookieOptions(maxAge: number) {
  return {
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge,
  }
}

export function toClientSessionResponse(payload: {
  accessToken: string
  refreshToken?: string | null
  usuario: BackendAuthResponse['usuario']
}): LoginResponse {
  return {
    accessToken: payload.accessToken,
    refreshToken: null,
    usuario: payload.usuario,
  }
}

export function setServerSessionCookies(
  response: ResponseWithCookies,
  payload: {
    accessToken: string
    refreshToken: string
    usuario: BackendAuthResponse['usuario']
  },
) {
  const accessMaxAge = resolveCookieMaxAge(
    payload.accessToken,
    FALLBACK_ACCESS_MAX_AGE,
  )
  const refreshMaxAge = resolveCookieMaxAge(
    payload.refreshToken,
    FALLBACK_REFRESH_MAX_AGE,
  )

  response.cookies.set(
    AUTH_TOKEN_KEY,
    payload.accessToken,
    buildBaseCookieOptions(accessMaxAge),
  )
  response.cookies.set(
    REFRESH_TOKEN_KEY,
    payload.refreshToken,
    buildBaseCookieOptions(refreshMaxAge),
  )
  response.cookies.set(
    USER_SESSION_KEY,
    JSON.stringify(payload.usuario),
    buildBaseCookieOptions(refreshMaxAge),
  )
}

export function clearServerSessionCookies(response: ResponseWithCookies) {
  for (const key of [AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_SESSION_KEY]) {
    response.cookies.set(key, '', {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 0,
    })
  }
}

export function readServerSessionCookies(request: NextRequest) {
  const accessToken = request.cookies.get(AUTH_TOKEN_KEY)?.value ?? null
  const refreshToken = request.cookies.get(REFRESH_TOKEN_KEY)?.value ?? null
  const rawUser = request.cookies.get(USER_SESSION_KEY)?.value ?? null

  if (!rawUser) {
    return {
      accessToken,
      refreshToken,
      usuario: null,
    }
  }

  try {
    return {
      accessToken,
      refreshToken,
      usuario: JSON.parse(rawUser) as BackendAuthResponse['usuario'],
    }
  } catch {
    return {
      accessToken,
      refreshToken,
      usuario: null,
    }
  }
}
