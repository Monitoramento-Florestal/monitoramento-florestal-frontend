import axios from 'axios'

import { API_ENDPOINTS, AUTH_ROUTE_ENDPOINTS } from '@/constants/api'
import { api } from '@/services/api/api'
import {
  mapLoginResponseToAuthUser,
  mapUserProfileToAuthUser,
} from '@/services/auth/authMapper'
import type {
  AuthUser,
  ChangeMyPasswordPayload,
  LoginRequestPayload,
  LoginResponse,
  PasswordResetConfirmPayload,
  PasswordResetRequestPayload,
  PasswordResetVerifyPayload,
  RegisterCitizenPayload,
  UpdateMyProfilePayload,
  UserProfileResponse,
} from '@/types/auth'

async function postInternalAuth<T>(url: string, payload?: unknown) {
  const { data } = await axios.post<T>(url, payload)
  return data
}

async function getInternalAuth<T>(url: string) {
  const { data } = await axios.get<T>(url)
  return data
}

export async function login(payload: LoginRequestPayload) {
  return postInternalAuth<LoginResponse>(AUTH_ROUTE_ENDPOINTS.LOGIN, payload)
}

export async function logout() {
  await postInternalAuth(AUTH_ROUTE_ENDPOINTS.LOGOUT)
}

export async function getSessionSnapshot() {
  return getInternalAuth<LoginResponse>(AUTH_ROUTE_ENDPOINTS.SESSION)
}

export async function getMyProfile() {
  const { data } = await api.get<UserProfileResponse>(API_ENDPOINTS.USER_PROFILE_ME)
  return data
}

export async function updateMyProfile(payload: UpdateMyProfilePayload) {
  const { data } = await api.patch<UserProfileResponse>(
    API_ENDPOINTS.USER_PROFILE_ME,
    payload,
  )

  return data
}

export async function changeMyPassword(payload: ChangeMyPasswordPayload) {
  await api.post(API_ENDPOINTS.USER_PROFILE_CHANGE_PASSWORD, payload)
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
