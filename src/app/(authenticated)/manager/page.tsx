"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList,
  ListChecks,
  Map,
  PlusCircle,
  Scissors,
  Trees,
  TriangleAlert,
  UserCircle,
  Users,
} from "lucide-react";

import { APP_ROUTES } from "@/constants/routes";
import {
  DashboardCard,
  DashboardPageHeader,
} from "@/components/features/dashboard";
import { Button } from "@/components/ui/button";
import { fetchDashboardGestor } from "@/services/dashboard/dashboardService";
import type { DashboardAdministrativo } from "@/services/dashboard/dashboardService";

function StatusBadge({ status, tone }: { status: string; tone: string }) {
  const classes = {
    healthy: "bg-sage/10 text-sage",
    warning: "bg-[#c47c2b]/10 text-[#9b5d18]",
    critical: "bg-burgundy/10 text-burgundy",
  }[tone] ?? "bg-rosewood/10 text-rosewood";

  return (
    <span className={`inline-flex items-center gap-2 rounded px-2 py-1 text-xs ${classes}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export default function ManagerDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardAdministrativo | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const data = await fetchDashboardGestor();
        if (isMounted) setDashboard(data);
      } catch {
        // fallback silencioso
      }
    }

    void loadDashboard();
    return () => { isMounted = false };
  }, []);

  const stats = dashboard
    ? [
        { key: "total", label: "Total no campus", value: dashboard.totalArvores, icon: Trees },
        { key: "healthy", label: "Saudáveis", value: dashboard.arvoresSaudaveis, icon: Trees },
        { key: "injury", label: "Com injúria", value: dashboard.arvoresInjuriadas, icon: TriangleAlert },
        { key: "removed", label: "Cortadas", value: dashboard.arvoresCortadas, icon: Scissors },
      ]
    : [];

  const pendingCount = dashboard?.aprovacoesPendentes ?? 0;

  return (
    <>
      <DashboardPageHeader
        title="Dashboard do gestor"
        subtitle={dashboard ? `${dashboard.totalArvores} árvores monitoradas` : "Carregando..."}
      />
      <div className="p-6">
        {stats.length > 0 ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ key, label, value, icon: Icon }) => (
              <DashboardCard key={key} className="flex flex-col gap-4 bg-white/55 shadow-none">
                <div className="flex items-start justify-between text-xs uppercase tracking-[0.18em] text-rosewood/70">
                  <span>{label}</span>
                  <Icon size={16} strokeWidth={1.6} className="text-sage" />
                </div>
                <div className="text-2xl font-semibold text-burgundy">{value}</div>
              </DashboardCard>
            ))}
          </section>
        ) : null}

        <section className="mt-6 grid gap-4">
          <DashboardCard className="bg-white/55 shadow-none">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.2em] text-rosewood/70">
                  Pendências
                </p>
                <h2 className="mt-3 text-base font-medium text-burgundy">
                  Aguardando sua revisão
                </h2>
                <p className="mt-2 text-3xl font-semibold text-burgundy">{pendingCount}</p>
                <p className="mt-2 text-sm text-rosewood">
                  {pendingCount > 0
                    ? "Solicitações precisam de aprovação ou correção."
                    : "Nenhuma pendência no momento."}
                </p>
              </div>
              <Button text="Ver fila" icon={ListChecks} href={APP_ROUTES.MANAGER_APPROVALS} variant="ghost" />
            </div>
          </DashboardCard>
        </section>

        <section className="mt-6 flex flex-wrap gap-3">
          <Button text="Abrir mapa" icon={Map} href={APP_ROUTES.MANAGER_MAP} variant="primary" />
          <Button text="Registrar árvore" icon={PlusCircle} href={APP_ROUTES.MANAGER_TREES_NEW} variant="outline" />
        </section>
      </div>
    </>
  );
}
