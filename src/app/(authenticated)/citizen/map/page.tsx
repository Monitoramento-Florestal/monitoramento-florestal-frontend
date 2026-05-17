import { DashboardCard, DashboardPageHeader } from "@/components/features/dashboard";

export default function CitizenMapPage() {
  return (
    <>
      <DashboardPageHeader
        title="Mapa"
        subtitle="Area autenticada de mapa para visualizacao do cidadao."
      />
      <div className="p-6">
        <DashboardCard>
          <h2 className="text-xl tracking-tight text-burgundy">Mapa</h2>
          <p className="mt-2 text-sm leading-6 text-rosewood">
            Scaffold reservado para a experiencia autenticada de mapa do cidadao.
          </p>
        </DashboardCard>
      </div>
    </>
  );
}
