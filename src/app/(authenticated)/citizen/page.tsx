import { DashboardCard, DashboardPageHeader } from "@/components/features/dashboard";

export default function CitizenDashboardPage() {
  return (
    <>
      <DashboardPageHeader
        title="Dashboard do cidadao"
        subtitle="Base pessoal para acompanhar mapa, perfil e registros relacionados."
      />
      <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <DashboardCard>
          <h2 className="text-xl tracking-tight text-burgundy">Area pessoal</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-rosewood">
            Estrutura inicial do dashboard do cidadao. As proximas features podem
            ocupar este espaco sem alterar o shell, a sidebar ou o header.
          </p>
        </DashboardCard>

        <DashboardCard>
          <h2 className="text-xl tracking-tight text-burgundy">
            Proximas secoes
          </h2>
          <p className="mt-2 text-sm leading-6 text-rosewood">
            Mapa, perfil e futuros acompanhamentos entram como paginas internas
            deste dashboard.
          </p>
        </DashboardCard>
      </div>
    </>
  );
}
