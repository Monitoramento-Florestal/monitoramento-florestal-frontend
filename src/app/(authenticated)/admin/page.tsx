"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList,
  Download,
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
import { fetchDashboardAdmin, fetchRegistrosRecentes } from "@/services/dashboard/dashboardService";
import { exportArvores } from "@/services/trees/treeService";
import type { DashboardAdministrativo, DashboardRegistroRecente } from "@/services/dashboard/dashboardService";

function getStatusTone(estadoGeral: string) {
  const normalized = estadoGeral.trim().toLowerCase();
  if (normalized === "otimo" || normalized === "bom") return "healthy";
  if (normalized === "regular" || normalized === "ruim") return "warning";
  if (normalized === "morta") return "critical";
  return "healthy";
}

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
  { key: "map", label: "Mapa", href: APP_ROUTES.ADMIN_MAP, icon: Map },
  { key: "register", label: "Registro", href: APP_ROUTES.ADMIN_TREES_NEW, icon: PlusCircle },
  { key: "management", label: "Gerenciamento", href: APP_ROUTES.ADMIN_MANAGEMENT, icon: Trees },
  { key: "users", label: "Usuários", href: APP_ROUTES.ADMIN_USERS, icon: Users },
  { key: "records", label: "Registros", href: APP_ROUTES.ADMIN_MANAGEMENT, icon: ClipboardList },
  { key: "profile", label: "Perfil", href: APP_ROUTES.ADMIN_PROFILE, icon: UserCircle },
];

function LabeledField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-rosewood/70">{label}</p>
      {children}
    </div>
  );
}

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

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardAdministrativo | null>(null);
  const [recentRecords, setRecentRecords] = useState<DashboardRegistroRecente[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const data = await fetchDashboardAdmin();
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
        { key: "total", label: "Total no campus", value: dashboard.totalArvores, icon: Trees },
        { key: "healthy", label: "Saudáveis", value: dashboard.arvoresSaudaveis, icon: Trees },
        { key: "injury", label: "Com injúria", value: dashboard.arvoresInjuriadas, icon: TriangleAlert },
        { key: "removed", label: "Cortadas", value: dashboard.arvoresCortadas, icon: Scissors },
      ]
    : [];

  const pendingCount = dashboard?.aprovacoesPendentes ?? 0;

  const [exportDataInicial, setExportDataInicial] = useState(
    () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  );
  const [exportDataFinal, setExportDataFinal] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [exportFormato, setExportFormato] = useState<"csv" | "xlsx">("csv");
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport() {
    if (!exportDataInicial || !exportDataFinal || isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      await exportArvores(exportDataInicial, exportDataFinal, exportFormato);
    } catch (err) {
      console.error("[export] Erro ao exportar árvores:", err);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <>
      <DashboardPageHeader
        title="Visão geral"
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
              <Button text="Ver fila" icon={ListChecks} href={APP_ROUTES.ADMIN_APPROVALS} variant="ghost" />
            </div>
          </DashboardCard>
        </section>

        <section className="mt-6">
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
                <StatusBadge status={getStatusLabel(record.estadoGeral)} tone={getStatusTone(record.estadoGeral)} />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <DashboardCard className="bg-white/55 shadow-none">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.2em] text-rosewood/70">
                  Exportar dados
                </p>
                <h2 className="mt-2 text-base font-medium text-burgundy">
                  Exportar árvores
                </h2>
                <p className="mt-1 text-sm text-rosewood">
                  Selecione o período e formato para download.
                </p>
              </div>
              <div className="flex flex-wrap items-end gap-4">
                <LabeledField label="Data inicial">
                  <input
                    type="date"
                    value={exportDataInicial}
                    onChange={(e) => setExportDataInicial(e.target.value)}
                    className="w-full rounded-md border border-rosewood/30 bg-white px-3 py-2 text-sm outline-none focus:border-sage"
                  />
                </LabeledField>
                <LabeledField label="Data final">
                  <input
                    type="date"
                    value={exportDataFinal}
                    onChange={(e) => setExportDataFinal(e.target.value)}
                    className="w-full rounded-md border border-rosewood/30 bg-white px-3 py-2 text-sm outline-none focus:border-sage"
                  />
                </LabeledField>
                <LabeledField label="Formato">
                  <select
                    value={exportFormato}
                    onChange={(e) => setExportFormato(e.target.value as "csv" | "xlsx")}
                    className="w-full rounded-md border border-rosewood/30 bg-white px-3 py-2 text-sm outline-none focus:border-sage"
                  >
                    <option value="csv">CSV</option>
                    <option value="xlsx">Excel (XLSX)</option>
                  </select>
                </LabeledField>
                <div className="flex items-end pb-0.5">
                  <Button
                    type="button"
                    variant="outline"
                    icon={Download}
                    iconSide="left"
                    disabled={isExporting || !exportDataInicial || !exportDataFinal}
                    onClick={handleExport}
                  >
                    {isExporting ? "Exportando..." : "Exportar"}
                  </Button>
                </div>
              </div>
            </div>
          </DashboardCard>
        </section>

        <section className="mt-6 flex flex-wrap gap-3">
          <Button text="Abrir mapa" icon={Map} href={APP_ROUTES.ADMIN_MAP} variant="primary" />
          <Button text="Registrar árvore" icon={PlusCircle} href={APP_ROUTES.ADMIN_TREES_NEW} variant="outline" />
        </section>
      </div>
    </>
  );
}
