import { UserRole } from '@/constants/roles'
import { APP_ROUTES } from '@/constants/routes'

const HOME_ROUTE_BY_ROLE: Record<UserRole, string> = {
  [UserRole.CITIZEN]: APP_ROUTES.CITIZEN_HOME,
  [UserRole.RESEARCHER]: APP_ROUTES.RESEARCHER_HOME,
  [UserRole.MANAGER]: APP_ROUTES.MANAGER_HOME,
  [UserRole.ADMIN]: APP_ROUTES.ADMIN_HOME,
}

export function getHomeRouteForRole(role: UserRole) {
  return HOME_ROUTE_BY_ROLE[role] ?? APP_ROUTES.CITIZEN_HOME
}
