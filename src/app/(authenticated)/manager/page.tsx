import { DashboardCard } from "@/components/features/dashboard";

export default function ManagerDashboardPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <DashboardCard>
        <h2 className="text-xl tracking-tight text-burgundy">
          Area de gestao
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-rosewood">
          Estrutura inicial do dashboard do gestor. As telas de operacao podem
          crescer aqui mantendo o mesmo shell, sidebar e header.
        </p>
      </DashboardCard>

      <DashboardCard>
        <h2 className="text-xl tracking-tight text-burgundy">
          Proximas secoes
        </h2>
        <p className="mt-2 text-sm leading-6 text-rosewood">
          Aprovacoes, usuarios, gerenciamento e perfil entram como paginas
          internas deste dashboard.
        </p>
      </DashboardCard>
    </div>
  );
}
