import { API_ENDPOINTS } from '@/constants/api'
import { api } from '@/services/api/api'
import {
  mapLoginResponseToAuthUser,
  mapUserProfileToAuthUser,
} from '@/services/auth/authMapper'
import type {
  AuthUser,
  LoginRequestPayload,
  LoginResponse,
  PasswordResetConfirmPayload,
  PasswordResetRequestPayload,
  PasswordResetVerifyPayload,
  RegisterCitizenPayload,
  UserProfileResponse,
} from '@/types/auth'

export async function login(payload: LoginRequestPayload) {
  const { data } = await api.post<LoginResponse>(API_ENDPOINTS.AUTH_LOGIN, payload)
  return data
}

export async function registerCitizen(payload: Omit<RegisterCitizenPayload, 'perfilAcesso'>) {
  const { data } = await api.post(
    API_ENDPOINTS.AUTH_REGISTER,
    {
      ...payload,
      perfilAcesso: 'PUBLICO_GERAL',
    } satisfies RegisterCitizenPayload,
  )

  return data
}

export async function requestPasswordReset(payload: PasswordResetRequestPayload) {
  const { data } = await api.post<string>(API_ENDPOINTS.PASSWORD_RESET_REQUEST, payload)
  return data
}

export async function verifyPasswordResetCode(payload: PasswordResetVerifyPayload) {
  const { data } = await api.post<string>(API_ENDPOINTS.PASSWORD_RESET_VERIFY, payload)
  return data
}

export async function resetPassword(payload: PasswordResetConfirmPayload) {
  const { data } = await api.post<string>(API_ENDPOINTS.PASSWORD_RESET_RESET, payload)
  return data
}

export function buildSessionUserFromLogin(
  payload: LoginResponse,
  currentUser?: AuthUser | null,
) {
  return mapLoginResponseToAuthUser(payload, currentUser)
}

export function buildSessionUserFromProfile(payload: UserProfileResponse) {
  return mapUserProfileToAuthUser(payload)
}
