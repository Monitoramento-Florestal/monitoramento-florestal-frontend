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

const STATS = [
  {
    key: "total",
    label: "Total no campus",
    value: 42,
    icon: Trees,
  },
  {
    key: "healthy",
    label: "Saudaveis",
    value: 30,
    icon: Trees,
  },
  {
    key: "injury",
    label: "Com injuria",
    value: 7,
    icon: TriangleAlert,
  },
  {
    key: "removed",
    label: "Cortadas",
    value: 5,
    icon: Scissors,
  },
];

const RECENT_RECORDS = [
  {
    key: "ipe-roxo",
    name: "Ipe-roxo",
    details: "UFRPE-1001 - 15.7m - DAP 24.2cm",
    status: "Com injuria",
    tone: "warning",
  },
  {
    key: "pau-brasil",
    name: "Pau-brasil",
    details: "UFRPE-1002 - 14.6m - DAP 17.2cm",
    status: "Saudavel",
    tone: "healthy",
  },
  {
    key: "cajueiro",
    name: "Cajueiro",
    details: "UFRPE-1003 - 7.2m - DAP 44.8cm",
    status: "Saudavel",
    tone: "healthy",
  },
  {
    key: "mangueira",
    name: "Mangueira",
    details: "UFRPE-1004 - 10.4m - DAP 81.8cm",
    status: "Cortada",
    tone: "critical",
  },
  {
    key: "cajueiro-2",
    name: "Cajueiro",
    details: "UFRPE-1005 - 9.7m - DAP 54.5cm",
    status: "Com injuria",
    tone: "warning",
  },
];

const QUICK_ACTIONS = [
  { key: "map", label: "Mapa", href: APP_ROUTES.ADMIN_MAP, icon: Map },
  { key: "register", label: "Registro", href: APP_ROUTES.ADMIN_TREES_NEW, icon: PlusCircle },
  { key: "management", label: "Gerenciamento", href: APP_ROUTES.ADMIN_MANAGEMENT, icon: Trees },
  { key: "users", label: "Usuarios", href: APP_ROUTES.ADMIN_USERS, icon: Users },
  { key: "records", label: "Registros", href: APP_ROUTES.ADMIN_MANAGEMENT, icon: ClipboardList },
  { key: "profile", label: "Perfil", href: APP_ROUTES.ADMIN_PROFILE, icon: UserCircle },
];

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
  return (
    <>
      <DashboardPageHeader
        title="Visao geral"
        subtitle="42 arvores monitoradas"
      />
      <div className="p-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STATS.map(({ key, label, value, icon: Icon }) => (
            <DashboardCard key={key} className="flex flex-col gap-4 bg-white/55 shadow-none">
              <div className="flex items-start justify-between text-xs uppercase tracking-[0.18em] text-rosewood/70">
                <span>{label}</span>
                <Icon size={16} strokeWidth={1.6} className="text-sage" />
              </div>
              <div className="text-2xl font-semibold text-burgundy">{value}</div>
            </DashboardCard>
          ))}
        </section>

        <section className="mt-6 grid gap-4">
          <DashboardCard className="bg-white/55 shadow-none">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.2em] text-rosewood/70">
                  Pendencias
                </p>
                <h2 className="mt-3 text-base font-medium text-burgundy">
                  Aguardando sua revisao
                </h2>
                <p className="mt-2 text-3xl font-semibold text-burgundy">3</p>
                <p className="mt-2 text-sm text-rosewood">
                  Registros precisam de aprovacao ou correcao.
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
            {RECENT_RECORDS.map((record) => (
              <div
                key={record.key}
                className="flex flex-col gap-3 border-b border-rosewood/10 px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="text-sm font-medium text-burgundy">{record.name}</div>
                  <div className="text-xs text-rosewood/70">{record.details}</div>
                </div>
                <StatusBadge status={record.status} tone={record.tone} />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 flex flex-wrap gap-3">
          <Button text="Abrir mapa" icon={Map} href={APP_ROUTES.ADMIN_MAP} variant="primary" />
          <Button text="Registrar arvore" icon={PlusCircle} href={APP_ROUTES.ADMIN_TREES_NEW} variant="outline" />
        </section>
      </div>
    </>
  );
}
