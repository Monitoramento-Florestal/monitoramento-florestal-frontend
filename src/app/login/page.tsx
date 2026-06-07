'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { APP_ROUTES } from '@/constants/routes'
import { useAuthContext } from '@/contexts/AuthContext'
import { getHomeRouteForRole } from '@/services/auth/authRoutes'
import { normalizeApiError } from '@/utils/apiFunctions'
import {
  loginSchema,
  type LoginFormValues,
} from '@/utils/validations/schema'

export default function LoginForm() {
  const router = useRouter()
  const { isAuthenticated, isBootstrapping, login, user } = useAuthContext()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!isBootstrapping && isAuthenticated && user) {
      router.replace(getHomeRouteForRole(user.role) || APP_ROUTES.CITIZEN_HOME)
    }
  }, [isAuthenticated, isBootstrapping, router, user])

  async function onSubmit(data: LoginFormValues) {
    setSubmitError(null)

    try {
      const nextUser = await login({
        email: data.email,
        senha: data.password,
      })

      router.replace(getHomeRouteForRole(nextUser.role) || APP_ROUTES.CITIZEN_HOME)
    } catch (error) {
      const normalizedError = normalizeApiError(error)

      setSubmitError(
        normalizedError.status === 401
          ? 'E-mail ou senha inválidos.'
          : normalizedError.message,
      )
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-cream p-4">
      <div className="absolute left-6 top-6 sm:left-10 sm:top-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-rosewood transition-colors hover:text-burgundy"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Voltar
        </Link>
      </div>

      <div className="mb-8 flex flex-col items-center">
        <div className="mb-6 flex justify-center">
          <Image
            src="/arbor-logo.png"
            alt="Arbor Logo"
            width={160}
            height={160}
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-[24px] font-normal leading-8 text-burgundy">
          Entrar no Arbor
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-100 rounded-xl border border-rosewood/25 bg-[#F9F1EB] p-8"
      >
        <div className="mb-6">
          <label className="mb-2 block text-xs font-normal uppercase tracking-wider text-burgundy">
            E-mail
          </label>
          <input
            {...register('email')}
            className="w-full rounded-xl border border-rosewood/40 bg-cream p-2.5 outline-none transition-all placeholder:text-[#866969]/40 focus:ring-1 focus:ring-sage"
            placeholder="seu@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-[#940028]">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-xs font-normal uppercase tracking-wider text-burgundy">
            Senha
          </label>
          <input
            type="password"
            {...register('password')}
            className="w-full rounded-xl border border-rosewood/40 bg-cream p-2.5 outline-none transition-all focus:ring-1 focus:ring-sage"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-[#940028]">
              {errors.password.message}
            </p>
          )}
        </div>

        {submitError && (
          <p className="mb-6 rounded-xl border border-[#940028]/20 bg-[#940028]/5 px-3 py-2 text-sm text-[#940028]">
            {submitError}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || (hasMounted && isBootstrapping)}
          className="mb-6 w-full rounded-xl bg-sage py-3 text-white shadow-sm transition-all hover:bg-sage"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>

        <div className="text-center">
          <Link
            href="/password-reset"
            className="text-sm text-rosewood hover:underline"
          >
            Esqueci minha senha
          </Link>
        </div>
      </form>

      <div className="mt-8">
        <p className="text-sm text-rosewood">
          Não tem conta?{' '}
          <Link href="/cadastro" className="font-normal text-burgundy hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
