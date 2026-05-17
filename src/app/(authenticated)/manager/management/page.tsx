import { DashboardCard, DashboardPageHeader } from "@/components/features/dashboard";

export default function ManagerManagementPage() {
  return (
    <>
      <DashboardPageHeader
        title="Gerenciamento"
        subtitle="Base de operacao para futuras rotinas de acompanhamento do acervo."
      />
      <div className="p-6">
        <DashboardCard>
          <h2 className="text-xl tracking-tight text-burgundy">Gerenciamento</h2>
          <p className="mt-2 text-sm leading-6 text-rosewood">
            Scaffold reservado para as futuras telas de gerenciamento.
          </p>
        </DashboardCard>
      </div>
    </>
  );
}
