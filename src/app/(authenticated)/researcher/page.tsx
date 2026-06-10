"use client";


import { useEffect, useState } from "react";
import {
  ListChecks,
  Map,
  PlusCircle,
  Trees,
  UserCircle,
} from "lucide-react";

import { APP_ROUTES } from "@/constants/routes";
import {
  DashboardCard,
  DashboardPageHeader,
} from "@/components/features/dashboard";
import { Button } from "@/components/ui/button";
import { fetchDashboardPesquisador, fetchRegistrosRecentes } from "@/services/dashboard/dashboardService";
import type { DashboardPesquisador, DashboardRegistroRecente } from "@/services/dashboard/dashboardService";

function getStatusLabel(estadoGeral: string) {
  const map: Record<string, string> = {
    otimo: "Saudável",
    bom: "Saudável",
    regular: "Regular",
    ruim: "Ruim",
    morta: "Cortada",
  };
  return map[estadoGeral.trim().toLowerCase()] ?? estadoGeral;
}

const QUICK_ACTIONS = [
  { key: "map", label: "Mapa", href: APP_ROUTES.RESEARCHER_MAP, icon: Map },
  { key: "register", label: "Registro", href: APP_ROUTES.RESEARCHER_TREES_NEW, icon: PlusCircle },
  { key: "management", label: "Gerenciamento", href: APP_ROUTES.RESEARCHER_TREES, icon: Trees },
  { key: "profile", label: "Perfil", href: APP_ROUTES.RESEARCHER_PROFILE, icon: UserCircle },
];

export default function ResearcherDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardPesquisador | null>(null);
  const [recentRecords, setRecentRecords] = useState<DashboardRegistroRecente[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const data = await fetchDashboardPesquisador();
        if (isMounted) setDashboard(data);
      } catch {
        // fallback
      }
    }

    async function loadRecentRecords() {
      try {
        const data = await fetchRegistrosRecentes();
        if (isMounted) setRecentRecords(data);
      } catch {
        // fallback
      }
    }

    void loadDashboard();
    void loadRecentRecords();
    return () => { isMounted = false };
  }, []);

  const stats = dashboard
    ? [
        { key: "my-records", label: "Meus registros", value: dashboard.registrosCriados, icon: Trees },
        { key: "pending", label: "Aguardando aprovação", value: dashboard.solicitacoesPendentes, icon: ListChecks },
        { key: "healthy", label: "Saudáveis (sistema)", value: dashboard.arvoresSaudaveis, icon: Trees },
        { key: "total", label: "Total no campus", value: dashboard.totalArvores, icon: Trees },
      ]
    : [];

  return (
    <>
      <DashboardPageHeader
        title="Painel do pesquisador"
        subtitle={dashboard ? `${dashboard.registrosCriados} registros sob sua responsabilidade` : "Carregando..."}
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
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-rosewood/70">
              Atividade recente
            </p>
            <div className="mt-3 overflow-hidden rounded-lg border border-rosewood/15 bg-white/55">
              {recentRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex flex-col gap-3 border-b border-rosewood/10 px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="text-sm font-medium text-burgundy">
                      {record.nomeComum || record.especie || "Sem nome"}
                    </div>
                    <div className="text-xs text-rosewood/70">
                      {record.codigo ?? "---"} - {record.alturaColetada}m - DAP {record.dapColetada}cm
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-sage">
                    <span className="size-1.5 rounded-full bg-sage" />
                    {getStatusLabel(record.estadoGeral)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 flex flex-wrap gap-3">
          <Button text="Abrir mapa" icon={Map} href={APP_ROUTES.RESEARCHER_MAP} variant="primary" />
          <Button
            text="Registrar árvore"
            icon={PlusCircle}
            href={APP_ROUTES.RESEARCHER_TREES_NEW}
            variant="outline"
          />
        </section>
      </div>
    </>
  );
}
