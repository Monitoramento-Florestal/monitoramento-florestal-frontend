import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

import { API_ENDPOINTS } from '@/constants/api'

export type RefreshResponse = {
  refreshToken?: string
  token?: string
  accessToken?: string
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

export function normalizeApiError(error: AxiosError) {
  return {
    status: error.response?.status ?? 500,
    message: error.response?.data ?? error.message,
  }
}
