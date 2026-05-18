import { DashboardCard, DashboardPageHeader } from "@/components/features/dashboard";

export default function AdminTreeRegisterPage() {
  return (
    <>
      <DashboardPageHeader
        title="Registrar arvore"
        subtitle="Fluxo administrativo de cadastro direto de arvores e medicoes."
      />
      <div className="p-6">
        <DashboardCard>
          <h2 className="text-xl tracking-tight text-burgundy">
            Registrar arvore
          </h2>
          <p className="mt-2 text-sm leading-6 text-rosewood">
            Scaffold reservado para o futuro fluxo administrativo de registro de
            arvores.
          </p>
        </DashboardCard>
      </div>
    </>
  );
}
