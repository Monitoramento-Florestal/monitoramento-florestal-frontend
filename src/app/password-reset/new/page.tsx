'use client'

import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/utils/validations/schema'

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  )
}

function NewPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = (_data: ResetPasswordFormValues) => {
    router.push(`/password-reset/success?email=${encodeURIComponent(email)}`)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-cream p-4">
      <div className="absolute left-6 top-6 sm:left-10 sm:top-10">
        <Link
          href={`/password-reset/verify?email=${encodeURIComponent(email)}`}
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
          Voltar para entrar
        </Link>
      </div>

      <div className="mb-8 flex animate-fade-up flex-col items-center text-center">
        <div className="mb-5 flex justify-center">
          <Image
            src="/arbor-logo.png"
            alt="Arbor Logo"
            width={72}
            height={72}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-2xl font-normal tracking-tight text-burgundy">Crie uma nova senha</h1>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-rosewood">
          A senha deve ter pelo menos 6 caracteres.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm animate-fade-up rounded-xl border border-rosewood/25 bg-[#F9F1EB] p-8 [animation-delay:100ms]"
      >
        <div className="mb-5">
          <label
            htmlFor="password"
            className="mb-2 block text-xs font-normal uppercase tracking-wider text-burgundy"
          >
            Nova senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="senha"
              className="w-full rounded-xl border border-rosewood/40 bg-cream p-2.5 pr-10 text-sm outline-none transition-all placeholder:text-rosewood/40 focus:ring-1 focus:ring-sage"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-rosewood/50 transition-colors hover:text-rosewood"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-[#940028]">{errors.password.message}</p>
          )}
        </div>

        <div className="mb-7">
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-xs font-normal uppercase tracking-wider text-burgundy"
          >
            Confirmar nova senha
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder="senha"
              className="w-full rounded-xl border border-rosewood/40 bg-cream p-2.5 pr-10 text-sm outline-none transition-all placeholder:text-rosewood/40 focus:ring-1 focus:ring-sage"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-rosewood/50 transition-colors hover:text-rosewood"
              aria-label={showConfirm ? 'Ocultar confirmação' : 'Mostrar confirmação'}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-[#940028]">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-sage py-3 text-sm font-normal text-cream shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar nova senha'}
        </Button>
      </form>
    </div>
  )
}

export default function NewPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <NewPasswordContent />
    </Suspense>
  )
}
