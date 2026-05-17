import { DashboardCard, DashboardPageHeader } from "@/components/features/dashboard";

export default function AdminManagementPage() {
  return (
    <>
      <DashboardPageHeader
        title="Gerenciamento"
        subtitle="Base administrativa para futuras rotinas de gerenciamento do acervo."
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
