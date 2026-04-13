export enum UserRole {
  CITIZEN = 'citizen',
  RESEARCHER = 'researcher',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.CITIZEN]: 'Cidadão',
  [UserRole.RESEARCHER]: 'Pesquisador',
  [UserRole.MANAGER]: 'Gestor',
  [UserRole.ADMIN]: 'Administrador',
}
