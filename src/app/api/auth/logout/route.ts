import { NextResponse } from 'next/server'

import { clearServerSessionCookies } from '@/services/auth/serverSession'

export async function POST() {
  const response = NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )

  clearServerSessionCookies(response)

  return response
}
