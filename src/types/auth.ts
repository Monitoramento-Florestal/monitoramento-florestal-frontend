import type { UserRole } from '@/constants/roles'

export type BackendProfile =
  | 'ADMINISTRADOR'
  | 'GESTOR'
  | 'PESQUISADOR'
  | 'PUBLICO_GERAL'

export interface LoginRequestPayload {
  email: string
  senha: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken?: string | null
  usuario: {
    id?: string | null
    nome: string
    email: string
    perfilAcesso: BackendProfile
  }
}

export interface BackendAuthResponse {
  accessToken: string
  refreshToken: string
  usuario: {
    id?: string | null
    nome: string
    email: string
    perfilAcesso: BackendProfile
  }
}

export interface RegisterCitizenPayload {
  nome: string
  email: string
  senha: string
  perfilAcesso: 'PUBLICO_GERAL'
}

export interface PasswordResetRequestPayload {
  email: string
}

export interface PasswordResetVerifyPayload {
  email: string
  codigo: string
}

export interface PasswordResetConfirmPayload {
  email: string
  codigo: string
  novaSenha: string
  confirmarSenha: string
}

export interface UserProfileResponse {
  id?: string | null
  nome: string
  email: string
  perfilAcesso?: BackendProfile
  role?: BackendProfile
  ativo?: boolean | null
  matricula?: string | null
}

export interface AuthUser {
  id: string | null
  nome: string
  name: string
  email: string
  perfilAcesso: BackendProfile
  role: UserRole
  ativo: boolean | null
  matricula?: string | null
}

export type User = AuthUser

export interface AuthSession {
  accessToken: string
  refreshToken: string | null
  user: AuthUser
}

export interface AuthState {
  session: AuthSession | null
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isBootstrapping: boolean
}
