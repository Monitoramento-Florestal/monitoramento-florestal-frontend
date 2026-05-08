'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  registerSchema,
  type RegisterFormValues,
} from '@/utils/validations/schema'
import { Button } from '@/components/ui/button'

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterFormValues) => {
    console.log('Cadastro enviado:', data)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-cream/60 p-4 font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      {/* BOTÃO VOLTAR - CANTO SUPERIOR ESQUERDO */}
      <Link
        href="/login"
        className="absolute top-8 left-8 flex items-center gap-2 text-burgundy hover:opacity-70 transition-all text-sm font-normal"
      >
        <ArrowLeft size={18} />
        Voltar
      </Link>

      {/* CABEÇALHO */}
      <div className="mb-6 flex flex-col items-center text-center">
        <Image
          src="/arbor-logo.png"
          alt="Arbor Logo"
          width={120}
          height={120}
          className="object-contain mb-4"
          priority
        />
        <h1 className="text-[24px] font-semibold leading-8 text-burgundy">
          Criar conta no Arbor
        </h1>
        <p className="text-rosewood text-sm mt-1 font-normal">
          Cadastro aberto a cidadãos interessados no patrimônio arbóreo
        </p>
      </div>

      {/* FORMULÁRIO */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-2xl border border-rosewood/20 p-8 bg-white/40 shadow-sm"
      >
        {/* NOME */}
        <div className="mb-5">
          <label className="block text-xs font-normal text-burgundy mb-2 uppercase tracking-wider">
            Nome Completo
          </label>
          <input
            {...register('name')}
            className="w-full p-2.5 border border-rosewood/40 rounded-xl bg-cream focus:ring-1 focus:ring-sage outline-none placeholder:text-[#866969]/40 transition-all"
            placeholder="Seu nome completo"
          />
          {errors.name && (
            <p className="text-[#940028] text-xs mt-1 font-normal">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* E-MAIL */}
        <div className="mb-5">
          <label className="block text-xs font-normal text-burgundy mb-2 uppercase tracking-wider">
            E-mail
          </label>
          <input
            {...register('email')}
            className="w-full p-2.5 border border-rosewood/40 rounded-xl bg-cream focus:ring-1 focus:ring-sage outline-none placeholder:text-[#866969]/40 transition-all"
            placeholder="seu@email.com"
          />
          {errors.email && (
            <p className="text-[#940028] text-xs mt-1 font-normal">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* SENHA */}
        <div className="mb-5">
          <label className="block text-xs font-normal text-burgundy mb-2 uppercase tracking-wider">
            Senha
          </label>
          <input
            type="password"
            {...register('password')}
            className="w-full p-2.5 border border-rosewood/40 rounded-xl bg-cream focus:ring-1 focus:ring-sage outline-none placeholder:text-[#866969]/40 transition-all"
          />
          <p className="text-rosewood text-[11px] mt-1 font-normal">
            Mínimo 8 caracteres, com letra e número
          </p>
          {errors.password && (
            <p className="text-[#940028] text-xs mt-1 font-normal">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* CONFIRMAR SENHA */}
        <div className="mb-8">
          <label className="block text-xs font-normal text-burgundy mb-2 uppercase tracking-wider">
            Confirmar Senha
          </label>
          <input
            type="password"
            {...register('confirmPassword')}
            className="w-full p-2.5 border border-rosewood/40 rounded-xl bg-cream focus:ring-1 focus:ring-sage outline-none placeholder:text-[#866969]/40 transition-all"
          />
          {errors.confirmPassword && (
            <p className="text-[#940028] text-xs mt-1 font-normal">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* BOTÃO CRIAR CONTA COMPONENTIZADO */}
        <Button
          type="submit"
          className="w-full h-[48px] bg-sage text-cream rounded-xl font-normal hover:opacity-90 transition-all shadow-none"
        >
          Criar conta
        </Button>
      </form>

      {/* RODAPÉ */}
      <div className="mt-6 text-center max-w-xs">
        <p className="text-xs text-rosewood mb-4 font-normal leading-relaxed">
          Cadastros de pesquisadores e gestores são realizados internamente pela
          administração.
        </p>
        <p className="text-sm text-rosewood font-normal">
          Já tem conta?{' '}
          <Link
            href="/login"
            className="font-semibold text-burgundy hover:underline"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
