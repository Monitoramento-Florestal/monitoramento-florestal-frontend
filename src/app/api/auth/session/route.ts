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

export async function GET(request: NextRequest) {
  const session = readServerSessionCookies(request)

  if (session.accessToken && session.usuario) {
    return NextResponse.json(
      toClientSessionResponse({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        usuario: session.usuario,
      }),
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    )
  }

  if (!session.refreshToken || !session.usuario) {
    const response = NextResponse.json(
      { message: 'Sessão indisponível.' },
      {
        status: 401,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    )
    clearServerSessionCookies(response)
    return response
  }

  try {
    const nextSession = await refreshWithBackend(session.refreshToken)
    const usuario = nextSession.usuario ?? session.usuario

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
            : 'Não foi possível restaurar a sessão.',
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
