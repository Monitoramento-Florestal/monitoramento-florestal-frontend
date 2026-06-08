import { describe, expect, it } from 'vitest'

import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '@/utils/validations/schema'

describe('validation schemas', () => {
  it('accepts valid login credentials', () => {
    expect(
      loginSchema.safeParse({
        email: 'usuario@example.com',
        password: '123456',
      }).success,
    ).toBe(true)
  })

  it('rejects invalid login e-mails', () => {
    expect(
      loginSchema.safeParse({
        email: 'usuario-invalido',
        password: '123456',
      }).success,
    ).toBe(false)
  })

  it('requires stronger registration passwords', () => {
    const result = registerSchema.safeParse({
      confirmPassword: 'abcdefgh',
      email: 'novo@example.com',
      name: 'Novo Usuario',
      password: 'abcdefgh',
    })

    expect(result.success).toBe(false)
  })

  it('rejects mismatched password confirmation during registration', () => {
    const result = registerSchema.safeParse({
      confirmPassword: 'Senha1234',
      email: 'novo@example.com',
      name: 'Novo Usuario',
      password: 'Senha123',
    })

    expect(result.success).toBe(false)
  })

  it('rejects mismatched password confirmation during password reset', () => {
    const result = resetPasswordSchema.safeParse({
      confirmPassword: 'Senha456',
      password: 'Senha123',
    })

    expect(result.success).toBe(false)
  })
})
