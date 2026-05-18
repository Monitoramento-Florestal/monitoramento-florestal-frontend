import { DashboardCard, DashboardPageHeader } from "@/components/features/dashboard";

export default function ManagerTreeRegisterPage() {
  return (
    <>
      <DashboardPageHeader
        title="Registrar arvore"
        subtitle="Fluxo de cadastro de arvores e medicoes para o gestor."
      />
      <div className="p-6">
        <DashboardCard>
          <h2 className="text-xl tracking-tight text-burgundy">
            Registrar arvore
          </h2>
          <p className="mt-2 text-sm leading-6 text-rosewood">
            Scaffold reservado para o futuro fluxo de registro de arvores do
            gestor.
          </p>
        </DashboardCard>
      </div>
    </>
  );
}
