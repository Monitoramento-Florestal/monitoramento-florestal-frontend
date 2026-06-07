'use client'

import { useMemo, useState } from 'react'
import {
  CheckCircle2,
  CircleSlash,
  Mail,
  Pencil,
  Search,
  Shield,
  UserPlus,
  Users,
} from 'lucide-react'

import { DashboardCard } from '@/components/features/dashboard'
import { Button } from '@/components/ui/button'
import { ROLE_LABELS, UserRole } from '@/constants/roles'
import type { User } from '@/types/auth'
import { cn } from '@/utils/cn'

type UserStatusFilter = 'all' | 'active' | 'inactive'
type UserRoleFilter = 'all' | UserRole

interface UserManagementScreenProps {
  currentRole: UserRole.ADMIN | UserRole.MANAGER | UserRole.RESEARCHER
  initialUsers: User[]
}

interface UserManagementPolicy {
  canCreate: boolean
  canEdit: boolean
  canToggleStatus: boolean
  description: string
  manageableRoles: UserRole[]
}

const STATUS_FILTERS: Array<{ label: string; value: UserStatusFilter }> = [
  { label: 'Todos', value: 'all' },
  { label: 'Ativos', value: 'active' },
  { label: 'Inativos', value: 'inactive' },
]

const ROLE_FILTERS: Array<{ label: string; value: UserRoleFilter }> = [
  { label: 'Todos os perfis', value: 'all' },
  { label: ROLE_LABELS[UserRole.ADMIN], value: UserRole.ADMIN },
  { label: ROLE_LABELS[UserRole.MANAGER], value: UserRole.MANAGER },
  { label: ROLE_LABELS[UserRole.RESEARCHER], value: UserRole.RESEARCHER },
  { label: ROLE_LABELS[UserRole.CITIZEN], value: UserRole.CITIZEN },
]

const ROLE_BADGE_STYLES: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'border-burgundy/20 bg-burgundy/8 text-burgundy',
  [UserRole.MANAGER]: 'border-sage/25 bg-sage/12 text-burgundy',
  [UserRole.RESEARCHER]: 'border-[#c47c2b]/25 bg-[#c47c2b]/10 text-[#8a5012]',
  [UserRole.CITIZEN]: 'border-rosewood/15 bg-card text-rosewood',
}

function getUserManagementPolicy(
  currentRole: UserManagementScreenProps['currentRole']
): UserManagementPolicy {
  if (currentRole === UserRole.ADMIN) {
    return {
      canCreate: true,
      canEdit: true,
      canToggleStatus: true,
      description: 'Administra todos os perfis e acessos cadastrados.',
      manageableRoles: [
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.RESEARCHER,
        UserRole.CITIZEN,
      ],
    }
  }

  if (currentRole === UserRole.MANAGER) {
    return {
      canCreate: true,
      canEdit: true,
      canToggleStatus: true,
      description: 'Gerencia perfis operacionais sem alterar administradores.',
      manageableRoles: [UserRole.RESEARCHER, UserRole.CITIZEN],
    }
  }

  return {
    canCreate: false,
    canEdit: false,
    canToggleStatus: false,
    description: 'Consulta perfis vinculados ao monitoramento.',
    manageableRoles: [UserRole.RESEARCHER, UserRole.CITIZEN],
  }
}

function canManageUser(user: User, policy: UserManagementPolicy) {
  return policy.manageableRoles.includes(user.role)
}

export function UserManagementScreen({
  currentRole,
  initialUsers,
}: UserManagementScreenProps) {
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>('all')
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>('all')
  const policy = useMemo(
    () => getUserManagementPolicy(currentRole),
    [currentRole]
  )
  const visibleUsers = useMemo(
    () =>
      initialUsers.filter((user) => {
        const normalizedQuery = query.trim().toLowerCase()
        const matchesQuery =
          normalizedQuery.length === 0 ||
          [user.nome, user.email, user.matricula ?? ''].some((value) =>
            value.toLowerCase().includes(normalizedQuery)
          )
        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'active' && user.ativo !== false) ||
          (statusFilter === 'inactive' && user.ativo === false)

        return matchesQuery && matchesRole && matchesStatus
      }),
    [initialUsers, query, roleFilter, statusFilter]
  )
  const activeCount = initialUsers.filter((user) => user.ativo !== false).length
  const operationalCount = initialUsers.filter((user) =>
    [UserRole.RESEARCHER, UserRole.MANAGER, UserRole.ADMIN].includes(user.role)
  ).length

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          icon={Users}
          label="Usuários cadastrados"
          value={initialUsers.length}
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Acessos ativos"
          value={activeCount}
        />
        <SummaryCard
          icon={Shield}
          label="Perfis operacionais"
          value={operationalCount}
        />
      </section>

      <DashboardCard className="space-y-4 bg-white/55 shadow-none">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg tracking-tight text-burgundy">
              Gerenciamento de usuários
            </h2>
            <p className="mt-1 text-sm leading-6 text-rosewood">
              {policy.description}
            </p>
          </div>

          {policy.canCreate ? (
            <Button
              type="button"
              icon={UserPlus}
              iconSide="left"
              variant="burgundy"
            >
              Novo usuário
            </Button>
          ) : null}
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(16rem,1fr)_auto_auto]">
          <label className="relative block">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-rosewood/65"
              size={16}
              strokeWidth={1.7}
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nome, e-mail ou matrícula"
              className="h-10 w-full rounded-md border border-rosewood/20 bg-white px-9 text-sm text-burgundy outline-none transition-colors placeholder:text-rosewood/55 focus:border-sage focus:ring-2 focus:ring-sage/20"
            />
          </label>

          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value as UserRoleFilter)
            }
            className="h-10 rounded-md border border-rosewood/20 bg-white px-3 text-sm text-burgundy outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
          >
            {ROLE_FILTERS.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>

          <div className="flex rounded-md border border-rosewood/20 bg-white p-1">
            {STATUS_FILTERS.map((filter) => {
              const isActive = statusFilter === filter.value

              return (
                <button
                  key={filter.value}
                  type="button"
                  className={cn(
                    'h-8 rounded px-3 text-xs transition-colors',
                    isActive
                      ? 'bg-sage text-cream'
                      : 'text-rosewood hover:bg-secondary'
                  )}
                  onClick={() => setStatusFilter(filter.value)}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>
        </div>
      </DashboardCard>

      <DashboardCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-rosewood/75">
                <th className="border-b border-rosewood/10 px-4 py-4 font-medium">
                  Usuário
                </th>
                <th className="border-b border-rosewood/10 px-4 py-4 font-medium">
                  Perfil
                </th>
                <th className="border-b border-rosewood/10 px-4 py-4 font-medium">
                  Matrícula
                </th>
                <th className="border-b border-rosewood/10 px-4 py-4 font-medium">
                  Status
                </th>
                <th className="border-b border-rosewood/10 px-4 py-4 text-right font-medium">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {visibleUsers.map((user) => {
                const isActive = user.ativo !== false
                const isManageable = canManageUser(user, policy)

                return (
                  <tr
                    key={user.id ?? user.email}
                    className="hover:bg-secondary/45"
                  >
                    <td className="border-b border-rosewood/8 px-4 py-5">
                      <div className="text-sm font-medium text-burgundy">
                        {user.nome}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-rosewood">
                        <Mail size={13} strokeWidth={1.7} />
                        {user.email}
                      </div>
                    </td>
                    <td className="border-b border-rosewood/8 px-4 py-5">
                      <span
                        className={cn(
                          'inline-flex rounded-full border px-2.5 py-1 text-xs',
                          ROLE_BADGE_STYLES[user.role]
                        )}
                      >
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>
                    <td className="border-b border-rosewood/8 px-4 py-5 text-sm text-rosewood">
                      {user.matricula ?? 'Não informada'}
                    </td>
                    <td className="border-b border-rosewood/8 px-4 py-5">
                      <span
                        className={cn(
                          'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs',
                          isActive
                            ? 'border-sage/20 bg-sage/10 text-burgundy'
                            : 'border-rosewood/15 bg-card text-rosewood'
                        )}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="border-b border-rosewood/8 px-4 py-5">
                      <div className="flex justify-end gap-2">
                        {policy.canEdit && isManageable ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            icon={Pencil}
                            iconSide="left"
                          >
                            Editar
                          </Button>
                        ) : null}
                        {policy.canToggleStatus && isManageable ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            icon={CircleSlash}
                            iconSide="left"
                            className="text-burgundy hover:bg-burgundy/6"
                          >
                            {isActive ? 'Desativar' : 'Ativar'}
                          </Button>
                        ) : (
                          <span className="text-xs text-rosewood/65">
                            Somente leitura
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {visibleUsers.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm font-medium text-burgundy">
              Nenhum usuário encontrado
            </p>
            <p className="mt-2 text-sm text-rosewood">
              Ajuste a busca ou os filtros para localizar outros perfis.
            </p>
          </div>
        ) : null}
      </DashboardCard>
    </div>
  )
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users
  label: string
  value: number
}) {
  return (
    <DashboardCard className="flex flex-col gap-4 bg-white/55 shadow-none">
      <div className="flex items-start justify-between text-xs uppercase tracking-[0.18em] text-rosewood/70">
        <span>{label}</span>
        <Icon size={16} strokeWidth={1.6} className="text-sage" />
      </div>
      <div className="text-2xl font-semibold text-burgundy">{value}</div>
    </DashboardCard>
  )
}
