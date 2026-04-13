export interface User {
  id: string
  email: string
  name: string
  role: 'citizen' | 'researcher' | 'manager' | 'admin'
}

export interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
}
