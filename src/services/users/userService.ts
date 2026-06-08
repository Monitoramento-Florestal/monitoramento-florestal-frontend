import { API_ENDPOINTS } from '@/constants/api'
import { UserRole } from '@/constants/roles'
import { api } from '@/services/api/api'
import {
  mapBackendUserToUser,
  mapRoleToBackendProfile,
} from '@/services/users/userMapper'
import type { BackendProfile, User } from '@/types/auth'

export interface UsersQueryParams {
  ativo?: boolean
  limit?: number
  page?: number
  perfilAcesso?: BackendProfile
  search?: string
}

export interface UsersPage {
  items: User[]
  limit: number
  page: number
  total: number
}

export interface CreateUserPayload {
  email: string
  nome: string
  role: UserRole
  senha: string
}

export interface UpdateUserPayload {
  ativo?: boolean
  email?: string
  nome?: string
  role?: UserRole
}

type BackendUserResponse = {
  ativo?: boolean | null
  email: string
  id?: string | null
  nome: string
  perfilAcesso?: BackendProfile
  role?: BackendProfile
}

type BackendUsersPage = {
  items: BackendUserResponse[]
  limit: number
  page: number
  total: number
}

function toRequestParams(params: UsersQueryParams) {
  return {
    ...params,
    search: params.search?.trim() || undefined,
  }
}

export async function listUsers(params: UsersQueryParams = {}) {
  const { data } = await api.get<BackendUsersPage>(API_ENDPOINTS.USERS, {
    params: toRequestParams(params),
  })

  return {
    ...data,
    items: data.items.map(mapBackendUserToUser),
  } satisfies UsersPage
}

export async function createUser(payload: CreateUserPayload) {
  const { data } = await api.post<BackendUserResponse>(API_ENDPOINTS.USERS, {
    email: payload.email.trim(),
    nome: payload.nome.trim(),
    perfilAcesso: mapRoleToBackendProfile(payload.role),
    senha: payload.senha,
  })

  return mapBackendUserToUser(data)
}

export async function updateUser(id: string, payload: UpdateUserPayload) {
  const { data } = await api.patch<BackendUserResponse>(
    `${API_ENDPOINTS.USERS}/${id}`,
    {
      ativo: payload.ativo,
      email: payload.email?.trim(),
      nome: payload.nome?.trim(),
      perfilAcesso: payload.role
        ? mapRoleToBackendProfile(payload.role)
        : undefined,
    },
  )

  return mapBackendUserToUser(data)
}

export async function deactivateUser(id: string) {
  await api.delete(`${API_ENDPOINTS.USERS}/${id}`)
}
