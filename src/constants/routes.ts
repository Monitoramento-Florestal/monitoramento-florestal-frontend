export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PUBLIC_DASHBOARD: '/public',
  CITIZEN_HOME: '/citizen',
  CITIZEN_PROFILE: '/citizen/profile',
  CITIZEN_REPORTS: '/citizen/reports',
  CITIZEN_MAP: '/citizen/map',
  RESEARCHER_HOME: '/researcher',
  RESEARCHER_PROFILE: '/researcher/profile',
  RESEARCHER_TREES: '/researcher/trees',
  RESEARCHER_TREES_NEW: '/researcher/trees/new',
  RESEARCHER_MEASUREMENTS: '/researcher/measurements',
  RESEARCHER_MEASUREMENTS_NEW: '/researcher/measurements/new',
  RESEARCHER_REPORTS: '/researcher/reports',
  RESEARCHER_USERS: '/researcher/users',
  RESEARCHER_MAP: '/researcher/map',
  RESEARCHER_APPROVALS: '/researcher/approvals',
  MANAGER_HOME: '/manager',
  MANAGER_PROFILE: '/manager/profile',
  MANAGER_TREES_NEW: '/manager/trees/new',
  MANAGER_APPROVALS: '/manager/approvals',
  MANAGER_MANAGEMENT: '/manager/management',
  MANAGER_USERS: '/manager/users',
  MANAGER_EXPORT: '/manager/export',
  MANAGER_MAP: '/manager/map',
  ADMIN_HOME: '/admin',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_TREES_NEW: '/admin/trees/new',
  ADMIN_APPROVALS: '/admin/approvals',
  ADMIN_MANAGEMENT: '/admin/management',
  ADMIN_USERS: '/admin/users',
  ADMIN_MAP: '/admin/map',
} as const

export function getTreeHistoryRoute(
  role: 'researcher' | 'manager' | 'admin',
  treeId: string
) {
  if (role === 'researcher') {
    return `/researcher/trees/${treeId}/history`
  }

  if (role === 'manager') {
    return `/manager/management/${treeId}/history`
  }

  return `/admin/management/${treeId}/history`
}

export function getTreeRecordCreateRoute(
  role: 'researcher' | 'manager' | 'admin',
  treeId: string
) {
  if (role === 'researcher') {
    return `/researcher/trees/${treeId}/records/new`
  }

  if (role === 'manager') {
    return `/manager/management/${treeId}/records/new`
  }

  return `/admin/management/${treeId}/records/new`
}

export function getTreeManagementEditRoute(
  role: 'manager' | 'admin',
  treeId: string
) {
  if (role === 'manager') {
    return `/manager/management/${treeId}/edit`
  }

  return `/admin/management/${treeId}/edit`
}
