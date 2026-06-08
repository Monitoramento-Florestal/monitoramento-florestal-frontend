"use client";

import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";

const NAV_ITEMS = [
  { href: "#how", label: "Como funciona" },
  { href: "/map", label: "Mapa publico" },
];

export function Topbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="relative z-20 border-b border-rosewood/15 bg-cream/85 backdrop-blur">
        <div className="app-safe-top app-shell-padding flex items-center justify-between gap-3 pb-3">
          <Link
            href="/"
            className="min-w-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            <div className="flex items-center gap-2 sm:hidden">
              <Logo size={38} />
              <span className="text-lg tracking-tight text-burgundy">Arbor</span>
            </div>

            <div className="hidden sm:block">
              <Logo size={44} withWordmark />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm text-burgundy/75">
            {NAV_ITEMS.map((item) =>
              item.href.startsWith("#") ? (
                <a key={item.href} href={item.href} className="transition-colors hover:text-burgundy">
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href} className="transition-colors hover:text-burgundy">
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button text="Entrar" variant="ghost" size="md" href="/login" />
            <Button
              text="Visualizar mapa"
              variant="primary"
              size="md"
              href="/map"
              icon={ArrowRight}
            />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Button text="Mapa" variant="outline" size="sm" href="/map" />

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="inline-flex size-10 items-center justify-center rounded-2xl border border-rosewood/20 bg-card/90 text-burgundy transition-colors hover:bg-secondary"
              aria-label="Abrir menu"
            >
              <Menu size={18} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Fechar menu"
          />

          <div className="absolute inset-x-4 top-4 rounded-[1.75rem] border border-rosewood/15 bg-cream shadow-overlay">
            <div className="app-safe-top flex items-center justify-between gap-3 px-5 pb-4">
              <div className="flex items-center gap-3">
                <Logo size={34} />
                <div>
                  <p className="text-sm tracking-tight text-burgundy">Arbor</p>
                  <p className="text-[0.625rem] uppercase tracking-[0.2em] text-rosewood/80">
                    Navegacao
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex size-10 items-center justify-center rounded-full bg-secondary text-burgundy transition-colors hover:bg-secondary/80"
                aria-label="Fechar menu"
              >
                <X size={18} strokeWidth={1.8} />
              </button>
            </div>

            <div className="space-y-2 px-4 pb-4">
              <a
                href="#how"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-2xl border border-rosewood/12 bg-card/80 px-4 py-3 text-sm text-burgundy"
              >
                Como funciona
              </a>
              <Link
                href="/map"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-2xl border border-rosewood/12 bg-card/80 px-4 py-3 text-sm text-burgundy"
              >
                Visualizar mapa
              </Link>
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-2xl border border-rosewood/12 bg-forest px-4 py-3 text-sm text-cream"
              >
                Entrar no sistema
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
