export const API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_REGISTER: '/auth/registrar',
  PASSWORD_RESET_REQUEST: '/recuperar-senha/solicitar',
  PASSWORD_RESET_VERIFY: '/recuperar-senha/verificar',
  PASSWORD_RESET_RESET: '/recuperar-senha/redefinir',
  PUBLIC_DASHBOARD: '/public/dashboard',
  CITIZEN_PROFILE: '/citizen/profile',
  TREES: '/arvores',
  TREE_RECORDS: '/registros',
  TREE_RECORDS_NEW_TREE: '/registros/nova-arvore',
} as const
