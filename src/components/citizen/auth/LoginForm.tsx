'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { login } from '@/services/citizen/authService'
import { useAuthContext } from '@/contexts/AuthContext'

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

type LoginSchema = z.infer<typeof loginSchema>

export function LoginForm() {
  const { setAuth } = useAuthContext()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginSchema>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginSchema) => {
    const parsed = loginSchema.safeParse(values)
    if (!parsed.success) {
      setError('Preencha e-mail e senha válidos.')
      return
    }

    setError(null)
    try {
      const response = await login(parsed.data)
      setAuth(response.token, response.user)
    } catch (submitError) {
      if (submitError instanceof Error) {
        setError(submitError.message)
        return
      }
      setError('Não foi possível autenticar.')
    }
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
      <input
        className="rounded-md border border-rosewood/30 px-3 py-2"
        placeholder="E-mail"
        type="email"
        {...register('email')}
      />
      <input
        className="rounded-md border border-rosewood/30 px-3 py-2"
        placeholder="Senha"
        type="password"
        {...register('password')}
      />
      {error ? <p className="text-sm text-burgundy">{error}</p> : null}
      <button
        className="rounded-md bg-forest px-4 py-2 text-cream disabled:opacity-50"
        disabled={isSubmitting}
        type="submit"
      >
        Entrar
      </button>
    </form>
  )
}
