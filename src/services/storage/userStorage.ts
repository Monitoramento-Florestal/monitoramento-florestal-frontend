import type { User } from '@/types/auth'

const USER_KEY = 'forest_user'

export function getStoredUser() {
  if (typeof window === 'undefined') {
    return null
  }

  const value = localStorage.getItem(USER_KEY)

  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as User
  } catch {
    return null
  }
}

export function setStoredUser(user: User) {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearStoredUser() {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(USER_KEY)
}
