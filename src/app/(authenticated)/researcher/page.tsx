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

const STATS = [
  {
    key: "my-records",
    label: "Meus registros",
    value: 11,
    icon: Trees,
  },
  {
    key: "pending",
    label: "Aguardando aprovacao",
    value: 1,
    icon: ListChecks,
  },
  {
    key: "healthy",
    label: "Saudaveis (sistema)",
    value: 30,
    icon: Trees,
  },
  {
    key: "total",
    label: "Total no campus",
    value: 42,
    icon: Trees,
  },
];

const LAST_RECORDS = [
  {
    key: "pau-brasil-1",
    name: "Pau-brasil",
    details: "UFRPE-1002 - 14.6m - DAP 17.2cm",
    status: "Saudavel",
  },
  {
    key: "oiti-1",
    name: "Oiti",
    details: "UFRPE-1005 - 8.6m - DAP 86.5cm",
    status: "Saudavel",
  },
  {
    key: "caja-1",
    name: "Caja",
    details: "UFRPE-1010 - 4.5m - DAP 73.7cm",
    status: "Saudavel",
  },
  {
    key: "pau-brasil-2",
    name: "Pau-brasil",
    details: "UFRPE-1014 - 4.3m - DAP 65.6cm",
    status: "Saudavel",
  },
  {
    key: "oiti-2",
    name: "Oiti",
    details: "UFRPE-1018 - 11.1m - DAP 18.7cm",
    status: "Saudavel",
  },
];

const QUICK_ACTIONS = [
  { key: "map", label: "Mapa", href: APP_ROUTES.RESEARCHER_MAP, icon: Map },
  { key: "register", label: "Registro", href: APP_ROUTES.RESEARCHER_TREES_NEW, icon: PlusCircle },
  { key: "management", label: "Gerenciamento", href: APP_ROUTES.RESEARCHER_TREES, icon: Trees },
  { key: "profile", label: "Perfil", href: APP_ROUTES.RESEARCHER_PROFILE, icon: UserCircle },
];

export default function ResearcherDashboardPage() {
  return (
    <>
      <DashboardPageHeader
        title="Painel do pesquisador"
        subtitle="11 registros sob sua responsabilidade"
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
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-rosewood/70">
              Meus ultimos registros
            </p>
            <div className="mt-3 overflow-hidden rounded-lg border border-rosewood/15 bg-white/55">
              {LAST_RECORDS.map((record) => (
                <div
                  key={record.key}
                  className="flex flex-col gap-3 border-b border-rosewood/10 px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="text-sm font-medium text-burgundy">
                      {record.name}
                    </div>
                    <div className="text-xs text-rosewood/70">
                      {record.details}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-sage">
                    <span className="size-1.5 rounded-full bg-sage" />
                    {record.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 flex flex-wrap gap-3">
          <Button text="Abrir mapa" icon={Map} href={APP_ROUTES.RESEARCHER_MAP} variant="primary" />
          <Button
            text="Registrar arvore"
            icon={PlusCircle}
            href={APP_ROUTES.RESEARCHER_TREES_NEW}
            variant="outline"
          />
        </section>
      </div>
    </>
  );
}
