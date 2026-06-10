import { useEffect, useState } from "react";
import {
  ArrowRight,
  MapPin,
  TreeDeciduous,
  Sprout,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Topbar } from "@/components/features/landing/TopBar";
import { Logo } from "@/components/ui/Logo";
import { fetchDashboardPublico } from "@/services/dashboard/dashboardService";

const SPECIES_MOCK = 12;

export default function LandingPage() {
  const [total, setTotal] = useState(42);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const data = await fetchDashboardPublico();

        if (isMounted) {
          setTotal(data.totalArvores);
        }
      } catch {
        // Fallback silencioso para valores mockados
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-cream text-burgundy flex flex-col">

      <Topbar />

      {/* ── Initial Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 pt-12 sm:pt-20 pb-16 sm:pb-24 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">

          {/* Text column */}
          <div className="order-2 lg:order-1">
            <div className="eyebrow mb-6">
              UFRPE · Patrimônio arbóreo
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[64px] text-burgundy leading-[1.02] tracking-tight animate-fade-up">
              Cada árvore tem<br />uma história.<br />
              <span className="text-sage">Aqui ela é registrada.</span>
            </h1>

            <p className="mt-7 text-base sm:text-lg text-burgundy/70 max-w-xl leading-relaxed animate-fade-up [animation-delay:100ms]">
              Arbor é a plataforma científica que cataloga, monitora e preserva o
              patrimônio arbóreo do campus da UFRPE Recife — espécime por espécime,
              medição por medição.
            </p>

            <div className="mt-9 flex flex-wrap gap-3 animate-fade-up [animation-delay:180ms]">
              <Button text="Visualizar mapa"   icon={ArrowRight} variant="primary" size="lg" href="/map" />
              <Button text="Entrar" variant="outline" size="lg" href="/login" />
            </div>

            <p className="mt-4 text-sm text-rosewood animate-fade-up [animation-delay:240ms]">
              Novo por aqui?{" "}
              <a
                href="/register"
                className="text-burgundy hover:text-sage underline-offset-4 hover:underline transition-colors"
              >
                Criar conta
              </a>
            </p>

            {/* Inline stats */}
            <div className="mt-12 grid grid-cols-2 gap-6 max-w-sm border-t border-rosewood/20 pt-6 animate-fade-up [animation-delay:300ms]">
              <StatItem value={total}   label="espécimes" />
              <StatItem value={SPECIES_MOCK} label="espécies"  />
            </div>
          </div>

          {/* Visual column */}
          <div className="order-1 lg:order-2 relative animate-scale-in [animation-delay:200ms]">
            <div className="relative aspect-square max-w-[480px] mx-auto">

              {/* Decorative rings */}
              <div className="absolute inset-6  rounded-full bg-sage/10" />
              <div className="absolute inset-12 rounded-full border border-rosewood/25" />

              {/* Central illustration — replace with <Logo> when asset is ready */}
              <div className="absolute inset-0 flex items-center justify-center px-6">
                <div className="sm:hidden">
                  <Logo size={220} variant="light" />
                </div>
                <div className="hidden sm:block">
                  <Logo size={392} variant="light" />
                </div>
              </div>

              {/* Floating card — catalogued count */}
              <div className="grain-dark absolute right-0 bottom-5 bg-forest text-cream rounded-lg px-4 py-3 shadow-float sm:bottom-12 sm:-right-6">
                <div className="text-[10px] uppercase tracking-[0.2em] text-cream/60">
                  Catalogadas
                </div>
                <div className="text-2xl text-cream mt-0.5 tabular-nums">{total}</div>
              </div>

              {/* Floating card — location pin */}
              <div className="absolute right-3 bottom-[96px] bg-cream border border-rosewood/30 rounded-lg px-3 py-2 shadow-card sm:right-8 sm:bottom-[120px]">
                <div className="flex items-center gap-2">
                  <MapPin size={14} strokeWidth={1.6} className="text-sage" />
                  <span className="text-xs text-burgundy">UFRPE</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how" className="border-t border-rosewood/15 bg-cream">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 py-16 sm:py-24">

          <div className="max-w-2xl mb-12">
            <div className="eyebrow mb-3">Como funciona</div>
            <h2 className="text-3xl sm:text-4xl text-burgundy tracking-tight leading-tight">
              Três passos para preservar a memória viva do campus.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-rosewood/20 border border-rosewood/20 rounded-lg overflow-hidden">
            <StepCard n="01" icon={Sprout}         title="Registro"      text="Pesquisadores cadastram árvores com coordenadas GPS, medições dendrométricas e fotos." />
            <StepCard n="02" icon={ClipboardCheck} title="Aprovação"     text="Gestores revisam cada registro garantindo rigor científico antes de entrar no acervo." />
            <StepCard n="03" icon={TreeDeciduous}  title="Monitoramento" text="Acompanhe a evolução de cada espécime ao longo do tempo no mapa interativo." />
          </div>

        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────────────────────── */}
      <section className="border-t border-rosewood/15">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 sm:p-10 rounded-lg border border-rosewood/30 bg-secondary/40">
            <div>
              <h3 className="text-xl sm:text-2xl text-burgundy tracking-tight">
                Pronto para explorar o acervo?
              </h3>
              <p className="text-rosewood text-sm mt-1.5">
                Abra o mapa interativo — sem cadastro, sem barreiras.
              </p>
            </div>
            <Button text="Visualizar mapa" icon={ArrowRight} variant="primary" size="lg" href="/map" />
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-rosewood/20 px-5 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-rosewood">
        <span>Universidade Federal Rural de Pernambuco · Recife</span>
        <span>Arbor · {new Date().getFullYear()}</span>
      </footer>

    </div>
  );
}

// ── Page-scoped sub-components ────────────────────────────────────────────────

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="text-3xl text-burgundy tracking-tight tabular-nums">{value}</div>
      <div className="text-[11px] uppercase tracking-[0.18em] text-rosewood mt-1">{label}</div>
    </div>
  );
}

function StepCard({
  n,
  icon: Icon,
  title,
  text,
}: {
  n:     string;
  icon:  LucideIcon;
  title: string;
  text:  string;
}) {
  return (
    <div className="bg-cream p-7 sm:p-8">
      <div className="flex items-start justify-between mb-5">
        <Icon size={22} strokeWidth={1.5} className="text-sage" />
        <span className="text-xs text-rosewood tabular-nums">{n}</span>
      </div>
      <div className="text-burgundy text-lg tracking-tight">{title}</div>
      <div className="text-rosewood text-sm mt-2 leading-relaxed">{text}</div>
    </div>
  );
}
