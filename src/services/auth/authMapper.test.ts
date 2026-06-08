import { describe, expect, it } from 'vitest'

import { UserRole } from '@/constants/roles'
import {
  hasSessionUserPayload,
  mapBackendProfileToRole,
  mapLoginResponseToAuthUser,
  mapUserProfileToAuthUser,
} from '@/services/auth/authMapper'

describe('authMapper', () => {
  it('maps backend profiles to frontend roles', () => {
    expect(mapBackendProfileToRole('ADMINISTRADOR')).toBe(UserRole.ADMIN)
    expect(mapBackendProfileToRole('GESTOR')).toBe(UserRole.MANAGER)
    expect(mapBackendProfileToRole('PESQUISADOR')).toBe(UserRole.RESEARCHER)
    expect(mapBackendProfileToRole('PUBLICO_GERAL')).toBe(UserRole.CITIZEN)
  })

  it('builds the authenticated user from login payloads', () => {
    const user = mapLoginResponseToAuthUser({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      usuario: {
        email: 'gestor@example.com',
        id: 'user-1',
        nome: 'Gestor Florestal',
        perfilAcesso: 'GESTOR',
      },
    })

    expect(user).toMatchObject({
      email: 'gestor@example.com',
      id: 'user-1',
      name: 'Gestor Florestal',
      nome: 'Gestor Florestal',
      perfilAcesso: 'GESTOR',
      role: UserRole.MANAGER,
    })
  })

  it('rejects profile responses without role data', () => {
    expect(() =>
      mapUserProfileToAuthUser({
        email: 'sem-role@example.com',
        nome: 'Sem Role',
      }),
    ).toThrow(/perfilAcesso\/role/)
  })

  it('validates refresh responses before updating the session user', () => {
    expect(
      hasSessionUserPayload({
        accessToken: 'token',
        usuario: {
          email: 'admin@example.com',
          nome: 'Admin',
          perfilAcesso: 'ADMINISTRADOR',
        },
      }),
    ).toBe(true)

    expect(
      hasSessionUserPayload({
        accessToken: 'token',
      }),
    ).toBe(false)
  })
})
