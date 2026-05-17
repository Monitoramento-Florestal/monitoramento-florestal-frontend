import { DashboardCard, DashboardPageHeader } from "@/components/features/dashboard";

export default function CitizenProfilePage() {
  return (
    <>
      <DashboardPageHeader
        title="Perfil"
        subtitle="Dados da conta do cidadao e futuras acoes de sessao."
      />
      <div className="p-6">
        <DashboardCard>
          <h2 className="text-xl tracking-tight text-burgundy">Perfil</h2>
          <p className="mt-2 text-sm leading-6 text-rosewood">
            Scaffold reservado para a futura tela de perfil.
          </p>
        </DashboardCard>
      </div>
    </>
  );
}
