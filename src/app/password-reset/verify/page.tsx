'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'

const CODE_LENGTH = 6
const RESEND_SECONDS = 30

function VerifyCodeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [countdown, setCountdown] = useState(RESEND_SECONDS)
  const [showToast, setShowToast] = useState(true)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown((current) => current - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  useEffect(() => {
    const timer = setTimeout(() => setShowToast(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  function handleChange(index: number, value: string) {
    const char = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = char
    setDigits(next)

    if (char && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
    const next = [...digits]

    pasted.split('').forEach((char, index) => {
      next[index] = char
    })

    setDigits(next)
    inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus()
  }

  function handleResend() {
    if (!canResend) return
    setDigits(Array(CODE_LENGTH).fill(''))
    setCountdown(RESEND_SECONDS)
    setShowToast(true)
    inputRefs.current[0]?.focus()
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (digits.join('').length < CODE_LENGTH) {
      return
    }

    router.push(`/password-reset/new?email=${encodeURIComponent(email)}`)
  }

  const isComplete = digits.every((digit) => digit !== '')
  const canResend = countdown <= 0
  const displayEmail = email || 'seu e-mail'

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-cream p-4">
      <div className="absolute left-6 top-6 sm:left-10 sm:top-10">
        <Link
          href="/password-reset"
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
        <h1 className="text-2xl font-normal tracking-tight text-burgundy">Verifique seu e-mail</h1>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-rosewood">
          Enviamos um código de 6 dígitos para{' '}
          <span className="font-normal text-burgundy">{displayEmail}</span>.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm animate-fade-up rounded-xl border border-rosewood/25 bg-[#F9F1EB] p-8 [animation-delay:100ms]"
      >
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage/15">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-sage"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-xs font-normal uppercase tracking-wider text-burgundy">
              Código de verificação
            </p>
            <p className="mt-1 text-xs text-rosewood/70">Digite os 6 dígitos enviados</p>
          </div>
        </div>

        <div className="mb-6 flex justify-center gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              ref={(element) => {
                inputRefs.current[index] = element
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={handlePaste}
              className="h-12 w-11 rounded-lg border border-rosewood/35 bg-cream text-center text-lg font-normal text-burgundy caret-sage outline-none transition-all focus:border-sage focus:ring-1 focus:ring-sage"
              aria-label={`Dígito ${index + 1} do código`}
            />
          ))}
        </div>

        <Button
          type="submit"
          disabled={!isComplete}
          className="w-full rounded-xl bg-sage py-3 text-sm font-normal text-cream shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
        >
          Verificar código
        </Button>

        <div className="mt-4 text-center">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm font-normal text-sage transition-colors hover:underline"
            >
              Reenviar código
            </button>
          ) : (
            <p className="text-sm text-rosewood/60">Reenviar código em {countdown}s</p>
          )}
        </div>
      </form>

      <div
        className={`fixed bottom-6 right-6 max-w-xs rounded-xl border border-rosewood/20 bg-[#F9F1EB] p-4 shadow-overlay transition-all duration-500 ${
          showToast ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
        role="status"
        aria-live="polite"
      >
        <p className="mb-1 text-xs font-normal text-burgundy">Verifique seu e-mail</p>
        <p className="text-xs leading-relaxed text-rosewood">
          Se este e-mail estiver cadastrado, você receberá um código de verificação em
          instantes.
        </p>
      </div>
    </div>
  )
}

export default function VerifyCodePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <VerifyCodeContent />
    </Suspense>
  )
}
