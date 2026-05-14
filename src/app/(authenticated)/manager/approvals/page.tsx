import { DashboardCard } from "@/components/features/dashboard";

export default function ManagerApprovalsPage() {
  return (
    <DashboardCard>
      <h2 className="text-xl tracking-tight text-burgundy">
        Fila de aprovacao
      </h2>
      <p className="mt-2 text-sm leading-6 text-rosewood">
        Scaffold reservado para a futura rotina de aprovacoes.
      </p>
    </DashboardCard>
  );
}
