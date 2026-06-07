import axios, { AxiosError, AxiosHeaders } from 'axios'

import { API_ENDPOINTS } from '@/constants/api'
import {
  clearAuthTokens,
  getRefreshToken,
  getToken,
  setAuthTokens,
} from '@/services/storage/tokenStorage'
import {
  extractAccessToken,
  isAuthRequestWithoutSessionRecovery,
  isRefreshRequest,
  isUnauthorized,
  resolvePendingRequests,
  type RefreshResponse,
  type RetryableConfig,
} from '@/utils/apiFunctions'

type PendingRequest = {
  reject: (reason?: unknown) => void
  resolve: (token: string) => void
}

let isRefreshing = false
let pendingRequests: PendingRequest[] = []
let unauthorizedHandler: (() => void) | null = null
let sessionRefreshHandler:
  | ((payload: {
      accessToken: string
      refreshToken: string | null
      user?: RefreshResponse
    }) => void)
  | null = null

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
})

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    throw new Error('Refresh token indisponivel.')
  }

  const { data } = await api.post<RefreshResponse>(
    API_ENDPOINTS.AUTH_REFRESH,
    { refreshToken },
  )

  const nextToken = extractAccessToken(data)

  if (!nextToken) {
    throw new Error('Resposta de refresh sem access token.')
  }

  const nextRefreshToken = data.refreshToken ?? refreshToken

  setAuthTokens({
    token: nextToken,
    refreshToken: nextRefreshToken,
  })

  sessionRefreshHandler?.({
    accessToken: nextToken,
    refreshToken: nextRefreshToken,
    user: data,
  })

  return nextToken
}

export function setApiUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler
}

export function setApiSessionRefreshHandler(
  handler:
    | ((payload: {
        accessToken: string
        refreshToken: string | null
        user?: RefreshResponse
      }) => void)
    | null,
) {
  sessionRefreshHandler = handler
}

api.interceptors.request.use((config) => {
  const token = getToken()

  if (!token) {
    return config
  }

  const headers = AxiosHeaders.from(config.headers)
  headers.set('Authorization', `Bearer ${token}`)
  config.headers = headers

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const requestConfig = error.config as RetryableConfig | undefined

    if (!requestConfig || !isUnauthorized(error)) {
      return Promise.reject(error)
    }

    if (isAuthRequestWithoutSessionRecovery(requestConfig.url)) {
      return Promise.reject(error)
    }

    if (requestConfig._retry || isRefreshRequest(requestConfig.url)) {
      clearAuthTokens()
      unauthorizedHandler?.()
      return Promise.reject(error)
    }

    requestConfig._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({
          resolve: (token) => {
            const headers = AxiosHeaders.from(requestConfig.headers)
            headers.set('Authorization', `Bearer ${token}`)
            requestConfig.headers = headers
            resolve(api(requestConfig))
          },
          reject,
        })
      })
    }

    isRefreshing = true

    try {
      const nextToken = await refreshAccessToken()
      resolvePendingRequests(pendingRequests, null, nextToken)
      pendingRequests = []

      const headers = AxiosHeaders.from(requestConfig.headers)
      headers.set('Authorization', `Bearer ${nextToken}`)
      requestConfig.headers = headers

      return api(requestConfig)
    } catch (refreshError) {
      resolvePendingRequests(pendingRequests, refreshError)
      pendingRequests = []
      clearAuthTokens()
      unauthorizedHandler?.()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)
