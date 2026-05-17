import { DashboardCard, DashboardPageHeader } from "@/components/features/dashboard";

export default function ResearcherTreeRegisterPage() {
  return (
    <>
      <DashboardPageHeader
        title="Registrar arvore"
        subtitle="Formulario de registro para novas arvores e medicoes de pesquisa."
      />
      <div className="p-6">
        <DashboardCard>
          <h2 className="text-xl tracking-tight text-burgundy">
            Registrar arvore
          </h2>
          <p className="mt-2 text-sm leading-6 text-rosewood">
            Scaffold reservado para o futuro formulario de registro de arvores.
          </p>
        </DashboardCard>
      </div>
    </>
  );
}
