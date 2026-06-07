import type {
  BackendAuthResponse,
  LoginRequestPayload,
} from '@/types/auth'

type BackendAuthErrorPayload = {
  erro?: string
  message?: string
}

export class BackendAuthError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'BackendAuthError'
    this.status = status
  }
}

function resolveBackendApiUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_API_URL ?? ''

  if (!rawUrl) {
    throw new Error('NEXT_PUBLIC_API_URL não configurado para auth server-side.')
  }

  return rawUrl.replace(/\/$/, '')
}

async function parseBackendResponse(response: Response) {
  const contentType = response.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')

  if (isJson) {
    return response.json()
  }

  const text = await response.text()

  return text
}

function extractBackendErrorMessage(payload: unknown) {
  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }

  if (payload && typeof payload === 'object') {
    const nextPayload = payload as BackendAuthErrorPayload
    if (typeof nextPayload.message === 'string' && nextPayload.message.trim()) {
      return nextPayload.message
    }

    if (typeof nextPayload.erro === 'string' && nextPayload.erro.trim()) {
      return nextPayload.erro
    }
  }

  return 'Falha ao comunicar com o backend de autenticação.'
}

async function postToBackend<T>(pathname: string, payload: unknown) {
  const response = await fetch(`${resolveBackendApiUrl()}${pathname}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  const data = await parseBackendResponse(response)

  if (!response.ok) {
    throw new BackendAuthError(
      extractBackendErrorMessage(data),
      response.status,
    )
  }

  return data as T
}

export function loginWithBackend(payload: LoginRequestPayload) {
  return postToBackend<BackendAuthResponse>('/auth/login', payload)
}

export function refreshWithBackend(refreshToken: string) {
  return postToBackend<BackendAuthResponse>('/auth/refresh', { refreshToken })
}
