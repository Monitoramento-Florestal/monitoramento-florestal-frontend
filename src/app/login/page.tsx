'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  loginSchema,
  type LoginFormValues,
} from '../../utils/validations/schema'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormValues) => {
    console.log('Dados prontos:', data)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-cream p-4">
      <div className="absolute left-6 top-6 sm:left-10 sm:top-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-rosewood hover:text-burgundy transition-colors"
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
        className="w-full max-w-100 rounded-xl border border-rosewood/25 p-8 bg-[#F9F1EB]"
      >
        <div className="mb-6">
          <label className="block text-xs font-normal text-burgundy mb-2 uppercase tracking-wider">
            E-mail
          </label>
          <input
            {...register('email')}
            className="w-full p-2.5 border border-rosewood/40 rounded-xl bg-cream focus:ring-1 focus:ring-sage outline-none placeholder:text-[#866969]/40 transition-all"
            placeholder="seu@email.com"
          />
          {errors.email && (
            <p className="text-[#940028] text-xs mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mb-8">
          <label className="block text-xs font-normal text-burgundy mb-2 uppercase tracking-wider">
            Senha
          </label>
          <input
            type="password"
            {...register('password')}
            className="w-full p-2.5 border border-[#866969]/40 rounded-xl bg-cream focus:ring-1 focus:ring-sage outline-none transition-all"
          />
          {errors.password && (
            <p className="text-[#940028] text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full py-3 bg-sage text-white rounded-xl font-normal hover:bg-sage transition-all shadow-sm mb-6"
        >
          Entrar
        </Button>

        <div className="text-center">
          <Link href="/password-reset" className="text-sm text-rosewood hover:underline">
            Esqueci minha senha
          </Link>
        </div>
      </form>

      <div className="mt-8">
        <p className="text-sm text-rosewood">
          Não tem conta?{' '}
          <a href="/cadastro" className="font-normal text-burgundy hover:underline">
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  )
}
