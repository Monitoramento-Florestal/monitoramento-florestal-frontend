import axios from 'axios'
import { describe, expect, it, vi } from 'vitest'

import {
  extractAccessToken,
  isAuthRequestWithoutSessionRecovery,
  isRefreshRequest,
  isSessionInvalidationError,
  normalizeApiError,
  resolvePendingRequests,
} from '@/utils/apiFunctions'

describe('apiFunctions', () => {
  it('extracts access tokens from supported refresh payload shapes', () => {
    expect(extractAccessToken({ accessToken: 'alpha' })).toBe('alpha')
    expect(extractAccessToken({ token: 'beta' })).toBe('beta')
    expect(extractAccessToken({})).toBeNull()
  })

  it('detects refresh requests and auth routes that should not recover sessions', () => {
    expect(isRefreshRequest('/api/auth/refresh')).toBe(true)
    expect(isRefreshRequest('/api/arvores')).toBe(false)

    expect(isAuthRequestWithoutSessionRecovery('/api/auth/login')).toBe(true)
    expect(isAuthRequestWithoutSessionRecovery('/auth/registrar')).toBe(true)
    expect(isAuthRequestWithoutSessionRecovery('/usuarios/me')).toBe(false)
  })

  it('normalizes HTML responses without exposing markup to users', () => {
    const error = new axios.AxiosError(
      'Request failed',
      'ERR_BAD_RESPONSE',
      undefined,
      undefined,
      {
        config: { headers: new axios.AxiosHeaders() },
        data: '<!doctype html><html><body>Gateway error</body></html>',
        headers: { 'content-type': 'text/html' },
        status: 502,
        statusText: 'Bad Gateway',
      },
    )

    const normalized = normalizeApiError(error)

    expect(normalized.status).toBe(502)
    expect(normalized.message).toContain('resposta')
    expect(normalized.message).not.toContain('<html')
  })

  it('treats unauthorized responses as session invalidation', () => {
    const error = new axios.AxiosError(
      'Unauthorized',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        config: { headers: new axios.AxiosHeaders() },
        data: { message: 'Unauthorized' },
        headers: {},
        status: 401,
        statusText: 'Unauthorized',
      },
    )

    expect(isSessionInvalidationError(error)).toBe(true)
  })

  it('resolves or rejects queued refresh requests consistently', () => {
    const first = { reject: vi.fn(), resolve: vi.fn() }
    const second = { reject: vi.fn(), resolve: vi.fn() }

    resolvePendingRequests([first, second], null, 'gamma')

    expect(first.resolve).toHaveBeenCalledWith('gamma')
    expect(second.resolve).toHaveBeenCalledWith('gamma')
    expect(first.reject).not.toHaveBeenCalled()

    resolvePendingRequests([first], new Error('refresh failed'))

    expect(first.reject).toHaveBeenCalled()
  })
})
