import Image from 'next/image'

export default function HomePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-cream p-6">
      <section className="w-full max-w-xl rounded-2xl border border-sage/40 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex justify-center">
          <Image
            src="/image.png"
            alt="Logo do projeto"
            width={160}
            height={160}
            priority
          />
        </div>
        <h1 className="text-2xl font-bold tracking-wide text-forest sm:text-3xl">
          PROJETO MONITORAMENTO FLORESTAL
        </h1>
      </section>
    </main>
  )
}
