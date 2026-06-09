'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  CheckCircle2,
  CircleSlash,
  Loader2,
  Mail,
  Pencil,
  Search,
  Shield,
  UserPlus,
  Users,
  X,
} from 'lucide-react'

import { DashboardCard } from '@/components/features/dashboard'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { ROLE_LABELS, UserRole } from '@/constants/roles'
import {
  createUser,
  deactivateUser,
  listUsers,
  updateUser,
} from '@/services/users/userService'
import { mapRoleToBackendProfile } from '@/services/users/userMapper'
import type { User } from '@/types/auth'
import { cn } from '@/utils/cn'
import {
  isSessionInvalidationError,
  normalizeApiError,
} from '@/utils/apiFunctions'

type UserStatusFilter = 'all' | 'active' | 'inactive'
type UserRoleFilter = 'all' | UserRole

interface UserManagementScreenProps {
  currentRole: UserRole.ADMIN | UserRole.MANAGER | UserRole.RESEARCHER
}

interface UserManagementPolicy {
  canCreate: boolean
  canEdit: boolean
  canListUsers: boolean
  canToggleStatus: boolean
  description: string
  manageableRoles: UserRole[]
}

interface UserFormState {
  email: string
  nome: string
  role: UserRole
  senha: string
}

const PAGE_SIZE = 20

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

const DEFAULT_FORM: UserFormState = {
  email: '',
  nome: '',
  role: UserRole.RESEARCHER,
  senha: '',
}

function getUserManagementPolicy(
  currentRole: UserManagementScreenProps['currentRole'],
): UserManagementPolicy {
  if (currentRole === UserRole.ADMIN) {
    return {
      canCreate: true,
      canEdit: true,
      canListUsers: true,
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
      canListUsers: true,
      canToggleStatus: true,
      description: '',
      manageableRoles: [UserRole.RESEARCHER, UserRole.CITIZEN],
    }
  }

  return {
    canCreate: false,
    canEdit: false,
    canListUsers: false,
    canToggleStatus: false,
    description:
      'O backend libera gerenciamento de usuários apenas para gestores e administradores.',
    manageableRoles: [],
  }
}

function canManageUser(user: User, policy: UserManagementPolicy) {
  return Boolean(user.id && policy.manageableRoles.includes(user.role))
}

function getActiveFilterValue(statusFilter: UserStatusFilter) {
  if (statusFilter === 'active') {
    return true
  }

  if (statusFilter === 'inactive') {
    return false
  }

  return undefined
}

function buildFormFromUser(user: User): UserFormState {
  return {
    email: user.email,
    nome: user.nome,
    role: user.role,
    senha: '',
  }
}

export function UserManagementScreen({
  currentRole,
}: UserManagementScreenProps) {
  const { showToast } = useToast()
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>('all')
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>('all')
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form, setForm] = useState<UserFormState>(DEFAULT_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [busyUserId, setBusyUserId] = useState<string | null>(null)
  const policy = useMemo(
    () => getUserManagementPolicy(currentRole),
    [currentRole],
  )
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const activeCount = users.filter((user) => user.ativo !== false).length
  const operationalCount = users.filter((user) =>
    [UserRole.RESEARCHER, UserRole.MANAGER, UserRole.ADMIN].includes(user.role),
  ).length
  const formRoleOptions = policy.manageableRoles

  const fetchUsers = useCallback(async () => {
    if (!policy.canListUsers) {
      return
    }

    try {
      setIsLoading(true)
      setErrorMessage(null)

      const response = await listUsers({
        ativo: getActiveFilterValue(statusFilter),
        limit: PAGE_SIZE,
        page,
        perfilAcesso:
          roleFilter === 'all'
            ? undefined
            : mapRoleToBackendProfile(roleFilter),
        search: query,
      })

      setUsers(response.items)
      setTotal(response.total)
    } catch (error) {
      if (isSessionInvalidationError(error)) {
        return
      }

      setErrorMessage(normalizeApiError(error).message)
    } finally {
      setIsLoading(false)
    }
  }, [page, policy.canListUsers, query, roleFilter, statusFilter])

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    setPage(0)
  }, [query, roleFilter, statusFilter])

  function openCreateForm() {
    setEditingUser(null)
    setForm({
      ...DEFAULT_FORM,
      role: formRoleOptions[0] ?? UserRole.RESEARCHER,
    })
    setIsFormOpen(true)
  }

  function openEditForm(user: User) {
    setEditingUser(user)
    setForm(buildFormFromUser(user))
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingUser(null)
    setForm(DEFAULT_FORM)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.nome.trim() || !form.email.trim()) {
      showToast({
        title: 'Preencha nome e e-mail',
        variant: 'error',
      })
      return
    }

    if (!editingUser && form.senha.length < 8) {
      showToast({
        title: 'Informe uma senha inicial',
        description: 'A senha deve ter pelo menos 8 caracteres.',
        variant: 'error',
      })
      return
    }

    try {
      setIsSubmitting(true)

      if (editingUser?.id) {
        await updateUser(editingUser.id, {
          email: form.email,
          nome: form.nome,
          role: form.role,
        })
        showToast({
          title: 'Usuário atualizado',
          variant: 'success',
        })
      } else {
        await createUser({
          email: form.email,
          nome: form.nome,
          role: form.role,
          senha: form.senha,
        })
        showToast({
          title: 'Usuário criado',
          variant: 'success',
        })
      }

      closeForm()
      await fetchUsers()
    } catch (error) {
      if (isSessionInvalidationError(error)) {
        return
      }

      showToast({
        title: editingUser
          ? 'Não foi possível atualizar o usuário'
          : 'Não foi possível criar o usuário',
        description: normalizeApiError(error).message,
        variant: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleToggleStatus(user: User) {
    if (!user.id) {
      return
    }

    const isActive = user.ativo !== false

    try {
      setBusyUserId(user.id)

      if (isActive) {
        await deactivateUser(user.id)
      } else {
        await updateUser(user.id, { ativo: true })
      }

      showToast({
        title: isActive ? 'Usuário desativado' : 'Usuário ativado',
        variant: 'success',
      })
      await fetchUsers()
    } catch (error) {
      if (isSessionInvalidationError(error)) {
        return
      }

      showToast({
        title: 'Não foi possível alterar o status',
        description: normalizeApiError(error).message,
        variant: 'error',
      })
    } finally {
      setBusyUserId(null)
    }
  }

  if (!policy.canListUsers) {
    return (
      <DashboardCard className="bg-white/55 shadow-none">
        <div className="max-w-2xl space-y-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-burgundy">
            <Shield size={18} strokeWidth={1.8} />
          </div>
          <h2 className="text-lg tracking-tight text-burgundy">
            Acesso restrito
          </h2>
          <p className="text-sm leading-6 text-rosewood">
            {policy.description} Pesquisadores continuam com acesso ao proprio
            perfil e aos fluxos de monitoramento.
          </p>
        </div>
      </DashboardCard>
    )
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          icon={Users}
          label="Usuarios exibidos"
          value={users.length}
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
              icon={isFormOpen ? X : UserPlus}
              iconSide="left"
              variant="burgundy"
              onClick={isFormOpen ? closeForm : openCreateForm}
            >
              {isFormOpen ? 'Fechar' : 'Novo usuário'}
            </Button>
          ) : null}
        </div>

        {isFormOpen ? (
          <form
            className="grid gap-3 rounded-md border border-rosewood/12 bg-card/70 p-4 lg:grid-cols-2"
            onSubmit={handleSubmit}
          >
            <UserFormField
              label="Nome completo"
              value={form.nome}
              onChange={(value) => setForm((current) => ({ ...current, nome: value }))}
            />
            <UserFormField
              label="E-mail"
              type="email"
              value={form.email}
              onChange={(value) => setForm((current) => ({ ...current, email: value }))}
            />
            <label className="block">
              <span className="text-[0.6875rem] uppercase tracking-[0.16em] text-rosewood">
                Perfil
              </span>
              <select
                value={form.role}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    role: event.target.value as UserRole,
                  }))
                }
                className="mt-2 h-10 w-full rounded-md border border-rosewood/20 bg-white px-3 text-sm text-burgundy outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
              >
                {formRoleOptions.map((role) => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
            </label>
            {!editingUser ? (
              <UserFormField
                label="Senha inicial"
                type="password"
                value={form.senha}
                onChange={(value) =>
                  setForm((current) => ({ ...current, senha: value }))
                }
              />
            ) : null}
            <div className="flex flex-wrap justify-end gap-3 lg:col-span-2">
              <Button type="button" variant="ghost" onClick={closeForm}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} variant="burgundy">
                {isSubmitting ? 'Salvando...' : 'Salvar usuário'}
              </Button>
            </div>
          </form>
        ) : null}

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
              placeholder="Buscar por nome ou e-mail"
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

          <div className="flex flex-wrap rounded-md border border-rosewood/20 bg-white p-1">
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
                      : 'text-rosewood hover:bg-secondary',
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
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-12 text-sm text-rosewood">
            <Loader2 size={16} className="animate-spin" />
            Carregando usuários...
          </div>
        ) : null}

        {!isLoading && errorMessage ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm font-medium text-burgundy">
              Não foi possível carregar usuários
            </p>
            <p className="mt-2 text-sm text-rosewood">{errorMessage}</p>
            <Button
              type="button"
              className="mt-4"
              variant="outline"
              onClick={() => void fetchUsers()}
            >
              Tentar novamente
            </Button>
          </div>
        ) : null}

        {!isLoading && !errorMessage ? (
          <>
            <div className="divide-y divide-rosewood/8 md:hidden">
              {users.map((user) => (
                <UserCard
                  key={user.id ?? user.email}
                  busyUserId={busyUserId}
                  onEdit={openEditForm}
                  onToggleStatus={(selectedUser) =>
                    void handleToggleStatus(selectedUser)
                  }
                  policy={policy}
                  user={user}
                />
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-rosewood/75">
                    <th className="border-b border-rosewood/10 px-4 py-4 font-medium">
                      Usuario
                    </th>
                    <th className="border-b border-rosewood/10 px-4 py-4 font-medium">
                      Perfil
                    </th>
                    <th className="border-b border-rosewood/10 px-4 py-4 font-medium">
                      Status
                    </th>
                    <th className="border-b border-rosewood/10 px-4 py-4 text-right font-medium">
                      Acoes
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <UserTableRow
                      key={user.id ?? user.email}
                      busyUserId={busyUserId}
                      onEdit={openEditForm}
                      onToggleStatus={(selectedUser) =>
                        void handleToggleStatus(selectedUser)
                      }
                      policy={policy}
                      user={user}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm font-medium text-burgundy">
                  Nenhum usuário encontrado
                </p>
                <p className="mt-2 text-sm text-rosewood">
                  Ajuste a busca ou os filtros para localizar outros perfis.
                </p>
              </div>
            ) : null}
          </>
        ) : null}
      </DashboardCard>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-rosewood">
        <span>
          Página {page + 1} de {pageCount} - {total} usuário(s)
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page === 0 || isLoading}
            onClick={() => setPage((current) => Math.max(0, current - 1))}
          >
            Anterior
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page + 1 >= pageCount || isLoading}
            onClick={() =>
              setPage((current) => Math.min(pageCount - 1, current + 1))
            }
          >
            Proxima
          </Button>
        </div>
      </div>
    </div>
  )
}

function UserFormField({
  label,
  onChange,
  type = 'text',
  value,
}: {
  label: string
  onChange: (value: string) => void
  type?: string
  value: string
}) {
  return (
    <label className="block">
      <span className="text-[0.6875rem] uppercase tracking-[0.16em] text-rosewood">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-md border border-rosewood/20 bg-white px-3 text-sm text-burgundy outline-none transition-colors focus:border-sage focus:ring-2 focus:ring-sage/20"
      />
    </label>
  )
}

function UserCard({
  busyUserId,
  onEdit,
  onToggleStatus,
  policy,
  user,
}: {
  busyUserId: string | null
  onEdit: (user: User) => void
  onToggleStatus: (user: User) => void
  policy: UserManagementPolicy
  user: User
}) {
  const isActive = user.ativo !== false
  const isManageable = canManageUser(user, policy)
  const isBusy = busyUserId === user.id

  return (
    <article className="space-y-4 px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-burgundy">{user.nome}</h3>
          <div className="mt-1 flex items-start gap-2 text-xs text-rosewood">
            <Mail size={13} strokeWidth={1.7} className="mt-0.5 shrink-0" />
            <span className="break-all">{user.email}</span>
          </div>
        </div>

        <RoleBadge role={user.role} />
      </div>

      <StatusBadge isActive={isActive} />

      <UserActions
        isActive={isActive}
        isBusy={isBusy}
        isManageable={isManageable}
        onEdit={() => onEdit(user)}
        onToggleStatus={() => onToggleStatus(user)}
        policy={policy}
      />
    </article>
  )
}

function UserTableRow({
  busyUserId,
  onEdit,
  onToggleStatus,
  policy,
  user,
}: {
  busyUserId: string | null
  onEdit: (user: User) => void
  onToggleStatus: (user: User) => void
  policy: UserManagementPolicy
  user: User
}) {
  const isActive = user.ativo !== false
  const isManageable = canManageUser(user, policy)
  const isBusy = busyUserId === user.id

  return (
    <tr className="hover:bg-secondary/45">
      <td className="border-b border-rosewood/8 px-4 py-5">
        <div className="text-sm font-medium text-burgundy">{user.nome}</div>
        <div className="mt-1 flex items-center gap-2 text-xs text-rosewood">
          <Mail size={13} strokeWidth={1.7} />
          {user.email}
        </div>
      </td>
      <td className="border-b border-rosewood/8 px-4 py-5">
        <RoleBadge role={user.role} />
      </td>
      <td className="border-b border-rosewood/8 px-4 py-5">
        <StatusBadge isActive={isActive} />
      </td>
      <td className="border-b border-rosewood/8 px-4 py-5">
        <div className="flex justify-end gap-2">
          <UserActions
            isActive={isActive}
            isBusy={isBusy}
            isManageable={isManageable}
            onEdit={() => onEdit(user)}
            onToggleStatus={() => onToggleStatus(user)}
            policy={policy}
          />
        </div>
      </td>
    </tr>
  )
}

function UserActions({
  isActive,
  isBusy,
  isManageable,
  onEdit,
  onToggleStatus,
  policy,
}: {
  isActive: boolean
  isBusy: boolean
  isManageable: boolean
  onEdit: () => void
  onToggleStatus: () => void
  policy: UserManagementPolicy
}) {
  if (!policy.canEdit || !policy.canToggleStatus || !isManageable) {
    return <span className="text-xs text-rosewood/65">Somente leitura</span>
  }

  return (
    <>
      <Button type="button" variant="ghost" size="sm" icon={Pencil} onClick={onEdit}>
        Editar
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        icon={isBusy ? Loader2 : CircleSlash}
        className={cn(
          'text-burgundy hover:bg-burgundy/6',
          isBusy ? '[&_svg]:animate-spin' : '',
        )}
        disabled={isBusy}
        onClick={onToggleStatus}
      >
        {isActive ? 'Desativar' : 'Ativar'}
      </Button>
    </>
  )
}

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 rounded-full border px-2.5 py-1 text-xs',
        ROLE_BADGE_STYLES[role],
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  )
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs',
        isActive
          ? 'border-sage/20 bg-sage/10 text-burgundy'
          : 'border-rosewood/15 bg-card text-rosewood',
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {isActive ? 'Ativo' : 'Inativo'}
    </span>
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
