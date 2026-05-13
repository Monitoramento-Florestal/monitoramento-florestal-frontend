import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";

export function Topbar() {
  return (
    <header className="relative z-20 flex items-center justify-between px-5 sm:px-10 py-5 border-b border-rosewood/15">

      <Link
        href="/"
        className="outline-none focus-visible:ring-2 focus-visible:ring-sage rounded-md"
      >
        <Logo size={48} withWordmark />
      </Link>

      <nav className="hidden md:flex items-center gap-7 text-sm text-burgundy/75">
        <a href="#about" className="hover:text-burgundy transition-colors">Sobre</a>
        <a href="#how"   className="hover:text-burgundy transition-colors">Como funciona</a>
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button text="Entrar"          variant="ghost"   size="md" href="/login" />
        <Button text="Visualizar mapa" variant="primary" size="md" href="/public/mapa" icon={ArrowRight} />
      </div>

    </header>
  );
}