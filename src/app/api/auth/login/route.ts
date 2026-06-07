import { NextResponse } from 'next/server'

import { loginWithBackend, BackendAuthError } from '@/services/auth/backendAuthClient'
import {
  setServerSessionCookies,
  toClientSessionResponse,
} from '@/services/auth/serverSession'
import type { LoginRequestPayload } from '@/types/auth'

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LoginRequestPayload
    const session = await loginWithBackend(payload)

    const response = NextResponse.json(
      toClientSessionResponse(session),
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    )

    setServerSessionCookies(response, session)

    return response
  } catch (error) {
    if (error instanceof BackendAuthError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    return NextResponse.json(
      { message: 'Falha inesperada ao iniciar sessão.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
