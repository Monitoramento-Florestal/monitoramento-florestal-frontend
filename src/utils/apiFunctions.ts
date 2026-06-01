import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { API_ENDPOINTS } from '@/constants/api'
import type { BackendProfile } from '@/types/auth'

export type RefreshResponse = {
  refreshToken?: string
  token?: string
  accessToken?: string
  email?: string
  nome?: string
  role?: BackendProfile
}

export type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

export function resolvePendingRequests<T extends { reject: (reason?: unknown) => void; resolve: (token: string) => void }>(
  pendingRequests: T[],
  error: unknown,
  token?: string
) {
  pendingRequests.forEach((request) => {
    if (error || !token) {
      request.reject(error)
      return
    }

    request.resolve(token)
  })
}

export function isUnauthorized(error: AxiosError) {
  return error.response?.status === 401
}

export function extractAccessToken(payload: RefreshResponse) {
  return payload.accessToken ?? payload.token ?? null
}

export function isRefreshRequest(url: string | undefined) {
  if (!url) {
    return false
  }

  return url.includes(API_ENDPOINTS.AUTH_REFRESH)
}

export function normalizeApiError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return {
      status: 500,
      message: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
    }
  }

  const payload = error.response?.data
  let message = error.message

  if (typeof payload === 'string') {
    message = payload
  } else if (payload && typeof payload === 'object') {
    if ('message' in payload && typeof payload.message === 'string') {
      message = payload.message
    } else if ('erro' in payload && typeof payload.erro === 'string') {
      message = payload.erro
    }
  }

  return {
    status: error.response?.status ?? 500,
    message,
  }
}
