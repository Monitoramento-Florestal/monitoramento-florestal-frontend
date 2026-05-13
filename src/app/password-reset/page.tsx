'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/utils/validations/schema'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = (data: ForgotPasswordFormValues) => {
    router.push(`/password-reset/verify?email=${encodeURIComponent(data.email)}`)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-cream p-4">

      <div className="absolute left-6 top-6 sm:left-10 sm:top-10">
        <Link
          href="/login"
          className="flex items-center gap-2 text-sm text-rosewood hover:text-burgundy transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Voltar para entrar
        </Link>
      </div>

      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-6 flex justify-center">
          <Image src="/arbor-logo.png" alt="Arbor Logo" width={72} height={72}
            className="object-contain" priority />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-burgundy">
          Recuperar senha
        </h1>
        <p className="mt-2 max-w-xs text-sm text-rosewood leading-relaxed">
          Informe seu e‑mail para receber um código de verificação.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-xl border border-rosewood/25 bg-[#F9F1EB] p-8"
      >
        <div className="mb-6">
          <label htmlFor="email"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-burgundy">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            placeholder="seu.nome@exemplo.com"
            className="w-full rounded-xl border border-rosewood/40 bg-cream p-2.5 text-sm outline-none placeholder:text-rosewood/40 focus:ring-1 focus:ring-sage transition-all"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-[#940028]">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}
          className="w-full rounded-xl bg-sage py-3 text-sm font-medium text-cream hover:opacity-90 disabled:opacity-50 transition-all shadow-sm">
          {isSubmitting ? 'Enviando…' : 'Enviar código'}
        </Button>
      </form>
    </div>
  )
}
