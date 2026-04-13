import { apiClient } from '@/services/api/client'
import { API_ENDPOINTS } from '@/constants/api'
import type { User } from '@/types/auth'

interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: User
}

export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH_LOGIN, payload)
  return data
}
