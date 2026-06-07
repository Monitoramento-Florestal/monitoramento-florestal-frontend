import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { API_ENDPOINTS } from '@/constants/api'
import type { BackendProfile } from '@/types/auth'

export type RefreshResponse = {
  refreshToken?: string
  token?: string
  accessToken?: string
  usuario?: {
    id?: string | null
    nome: string
    email: string
    perfilAcesso: BackendProfile
  }
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

export function isAuthRequestWithoutSessionRecovery(url: string | undefined) {
  if (!url) {
    return false
  }

  return [
    API_ENDPOINTS.AUTH_LOGIN,
    API_ENDPOINTS.AUTH_REGISTER,
    API_ENDPOINTS.PASSWORD_RESET_REQUEST,
    API_ENDPOINTS.PASSWORD_RESET_VERIFY,
    API_ENDPOINTS.PASSWORD_RESET_RESET,
  ].some((endpoint) => url.includes(endpoint))
}

function looksLikeHtml(value: string) {
  const normalized = value.trim().toLowerCase()

  return (
    normalized.startsWith('<!doctype html') ||
    normalized.startsWith('<html') ||
    normalized.includes('<body') ||
    normalized.includes('</html>')
  )
}

export function normalizeApiError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return {
      status: 500,
      message: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
    }
  }

  const payload = error.response?.data
  const contentType = error.response?.headers?.['content-type']
  let message = error.message

  if (error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout')) {
    message = 'A API demorou mais do que o esperado para responder.'
  }

  if (typeof payload === 'string') {
    message = looksLikeHtml(payload)
      ? 'A aplicação recebeu uma resposta inválida do servidor.'
      : payload
  } else if (payload && typeof payload === 'object') {
    if ('message' in payload && typeof payload.message === 'string') {
      message = payload.message
    } else if ('erro' in payload && typeof payload.erro === 'string') {
      message = payload.erro
    }
  }

  if (typeof contentType === 'string' && contentType.includes('text/html')) {
    message = 'A aplicação recebeu uma resposta inválida do servidor.'
  }

  return {
    status: error.response?.status ?? 500,
    message,
  }
}

const SESSION_INVALIDATION_MESSAGES = [
  'refresh token indisponivel.',
  'refresh token inválido.',
  'refresh token invalido.',
  'resposta de refresh sem access token.',
]

export function isSessionInvalidationError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return true
    }

    return SESSION_INVALIDATION_MESSAGES.includes(
      normalizeApiError(error).message.trim().toLowerCase(),
    )
  }

  if (error instanceof Error) {
    return SESSION_INVALIDATION_MESSAGES.includes(
      error.message.trim().toLowerCase(),
    )
  }

  return false
}
