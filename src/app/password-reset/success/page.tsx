'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function PasswordSuccessPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-cream p-4">
      <div className="absolute left-6 top-6 sm:left-10 sm:top-10">
        <Link
          href="/login"
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

      <div className="mb-6 flex justify-center animate-fade-up">
        <Image
          src="/arbor-logo.png"
          alt="Arbor Logo"
          width={72}
          height={72}
          className="object-contain"
          priority
        />
      </div>

      <div className="w-full max-w-sm animate-fade-up rounded-xl border border-rosewood/25 bg-[#F9F1EB] p-8 text-center [animation-delay:100ms]">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-sage/40 bg-sage/10">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-sage"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1 className="mb-2 text-xl font-normal tracking-tight text-burgundy">Senha redefinida</h1>
        <p className="mb-6 text-sm leading-relaxed text-rosewood">
          Sua senha foi alterada com sucesso. Já pode entrar com as novas credenciais.
        </p>

        <Button
          href="/login"
          className="w-full rounded-xl bg-sage py-3 text-sm font-normal text-cream shadow-sm transition-all hover:opacity-90"
        >
          Voltar para entrar
        </Button>
      </div>
    </div>
  )
}
