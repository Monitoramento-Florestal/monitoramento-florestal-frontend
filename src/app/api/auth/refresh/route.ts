import { NextRequest, NextResponse } from 'next/server'

import {
  BackendAuthError,
  refreshWithBackend,
} from '@/services/auth/backendAuthClient'
import {
  clearServerSessionCookies,
  readServerSessionCookies,
  setServerSessionCookies,
  toClientSessionResponse,
} from '@/services/auth/serverSession'

export async function POST(request: NextRequest) {
  const currentSession = readServerSessionCookies(request)

  if (!currentSession.refreshToken) {
    const response = NextResponse.json(
      { message: 'Refresh token indisponível.' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } },
    )
    clearServerSessionCookies(response)
    return response
  }

  try {
    const nextSession = await refreshWithBackend(currentSession.refreshToken)
    const usuario = nextSession.usuario ?? currentSession.usuario

    if (!usuario) {
      throw new Error('Resposta de refresh sem usuário.')
    }

    const response = NextResponse.json(
      toClientSessionResponse({
        accessToken: nextSession.accessToken,
        refreshToken: nextSession.refreshToken,
        usuario,
      }),
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    )

    setServerSessionCookies(response, {
      accessToken: nextSession.accessToken,
      refreshToken: nextSession.refreshToken,
      usuario,
    })

    return response
  } catch (error) {
    const response = NextResponse.json(
      {
        message:
          error instanceof BackendAuthError
            ? error.message
            : 'Falha inesperada ao renovar a sessão.',
      },
      {
        status: error instanceof BackendAuthError ? error.status : 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    )

    clearServerSessionCookies(response)
    return response
  }
}
