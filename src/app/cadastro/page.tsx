'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { registerCitizen } from '@/services/auth/authService'
import { normalizeApiError } from '@/utils/apiFunctions'
import {
  registerSchema,
  type RegisterFormValues,
} from '@/utils/validations/schema'

export default function RegisterForm() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterFormValues) {
    setSubmitError(null)

    try {
      await registerCitizen({
        nome: data.name,
        email: data.email,
        senha: data.password,
      })
      router.push('/login')
    } catch (error) {
      setSubmitError(normalizeApiError(error).message)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-cream/60 p-4 font-sans">
      <Link
        href="/login"
        className="absolute left-8 top-8 flex items-center gap-2 text-sm font-normal text-burgundy transition-all hover:opacity-70"
      >
        <ArrowLeft size={18} />
        Voltar
      </Link>

      <div className="mb-6 flex flex-col items-center text-center">
        <Image
          src="/arbor-logo.png"
          alt="Arbor Logo"
          width={120}
          height={120}
          className="mb-4 object-contain"
          priority
        />
        <h1 className="text-[24px] font-normal leading-8 text-burgundy">
          Criar conta no Arbor
        </h1>
        <p className="mt-1 text-sm font-normal text-rosewood">
          Cadastro aberto a cidadãos interessados no patrimônio arbóreo
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-2xl border border-rosewood/20 bg-white/40 p-8 shadow-sm"
      >
        <div className="mb-5">
          <label className="mb-2 block text-xs font-normal uppercase tracking-wider text-burgundy">
            Nome completo
          </label>
          <input
            {...register('name')}
            className="w-full rounded-xl border border-rosewood/40 bg-cream p-2.5 outline-none transition-all placeholder:text-[#866969]/40 focus:ring-1 focus:ring-sage"
            placeholder="Seu nome completo"
          />
          {errors.name && (
            <p className="mt-1 text-xs font-normal text-[#940028]">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-xs font-normal uppercase tracking-wider text-burgundy">
            E-mail
          </label>
          <input
            {...register('email')}
            className="w-full rounded-xl border border-rosewood/40 bg-cream p-2.5 outline-none transition-all placeholder:text-[#866969]/40 focus:ring-1 focus:ring-sage"
            placeholder="seu@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs font-normal text-[#940028]">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-xs font-normal uppercase tracking-wider text-burgundy">
            Senha
          </label>
          <input
            type="password"
            {...register('password')}
            className="w-full rounded-xl border border-rosewood/40 bg-cream p-2.5 outline-none transition-all placeholder:text-[#866969]/40 focus:ring-1 focus:ring-sage"
          />
          <p className="mt-1 text-[11px] font-normal text-rosewood">
            Mínimo 8 caracteres, com letra e número
          </p>
          {errors.password && (
            <p className="mt-1 text-xs font-normal text-[#940028]">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-xs font-normal uppercase tracking-wider text-burgundy">
            Confirmar senha
          </label>
          <input
            type="password"
            {...register('confirmPassword')}
            className="w-full rounded-xl border border-rosewood/40 bg-cream p-2.5 outline-none transition-all placeholder:text-[#866969]/40 focus:ring-1 focus:ring-sage"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs font-normal text-[#940028]">
              {errors.confirmPassword.message}
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
          disabled={isSubmitting}
          className="h-[48px] w-full rounded-xl bg-sage text-cream shadow-none transition-all hover:opacity-90"
        >
          {isSubmitting ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>

      <div className="mt-6 max-w-xs text-center">
        <p className="mb-4 text-xs font-normal leading-relaxed text-rosewood">
          Cadastros de pesquisadores e gestores são realizados internamente pela
          administração.
        </p>
        <p className="text-sm font-normal text-rosewood">
          Já tem conta?{' '}
          <Link href="/login" className="font-normal text-burgundy hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
