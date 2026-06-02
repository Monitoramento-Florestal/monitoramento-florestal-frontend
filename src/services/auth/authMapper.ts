import { UserRole } from '@/constants/roles'
import type {
  AuthUser,
  BackendProfile,
  LoginResponse,
  UserProfileResponse,
} from '@/types/auth'
import type { RefreshResponse } from '@/utils/apiFunctions'

type SessionAuthPayload = Pick<LoginResponse, 'email' | 'nome' | 'role'>

function buildUserFromRolePayload(
  payload: SessionAuthPayload,
  currentUser?: AuthUser | null,
): AuthUser {
  return {
    id: currentUser?.id ?? null,
    nome: payload.nome,
    name: payload.nome,
    email: payload.email,
    perfilAcesso: payload.role,
    role: mapBackendProfileToRole(payload.role),
    ativo: currentUser?.ativo ?? null,
    matricula: currentUser?.matricula ?? null,
  }
}

export function hasSessionUserPayload(
  payload: RefreshResponse | null | undefined,
): payload is RefreshResponse & SessionAuthPayload {
  return Boolean(payload?.email && payload?.nome && payload?.role)
}

export function mapRefreshResponseToAuthUser(
  payload: RefreshResponse & SessionAuthPayload,
  currentUser?: AuthUser | null,
) {
  return buildUserFromRolePayload(payload, currentUser)
}

export function mapLoginResponseToAuthUser(
  payload: LoginResponse,
  currentUser?: AuthUser | null,
) {
  return buildUserFromRolePayload(payload, currentUser)
}

export function mapUserProfileToAuthUser(payload: UserProfileResponse): AuthUser {
  const profile = payload.perfilAcesso ?? payload.role

  if (!profile) {
    throw new Error('Resposta de usuário sem perfilAcesso/role.')
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

const PROFILE_ROLE_MAP: Record<BackendProfile, UserRole> = {
  ADMINISTRADOR: UserRole.ADMIN,
  GESTOR: UserRole.MANAGER,
  PESQUISADOR: UserRole.RESEARCHER,
  PUBLICO_GERAL: UserRole.CITIZEN,
}

export function mapBackendProfileToRole(profile: BackendProfile) {
  return PROFILE_ROLE_MAP[profile]
}
