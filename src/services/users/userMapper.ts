import { UserRole } from '@/constants/roles'
import { mapBackendProfileToRole } from '@/services/auth/authMapper'
import type { BackendProfile, User } from '@/types/auth'

export const ROLE_PROFILE_MAP: Record<UserRole, BackendProfile> = {
  [UserRole.ADMIN]: 'ADMINISTRADOR',
  [UserRole.MANAGER]: 'GESTOR',
  [UserRole.RESEARCHER]: 'PESQUISADOR',
  [UserRole.CITIZEN]: 'PUBLICO_GERAL',
}

export function mapRoleToBackendProfile(role: UserRole) {
  return ROLE_PROFILE_MAP[role]
}

export function mapBackendUserToUser(payload: {
  ativo?: boolean | null
  email: string
  id?: string | null
  matricula?: string | null
  nome: string
  perfilAcesso?: BackendProfile
  role?: BackendProfile
}): User {
  const profile = payload.perfilAcesso ?? payload.role

  if (!profile) {
    throw new Error('Resposta de usuario sem perfilAcesso/role.')
  }

  return {
    id: payload.id ?? null,
    nome: payload.nome,
    name: payload.nome,
    email: payload.email,
    perfilAcesso: profile,
    role: mapBackendProfileToRole(profile),
    ativo: payload.ativo ?? null,
    matricula: payload.matricula ?? null,
  }
}
