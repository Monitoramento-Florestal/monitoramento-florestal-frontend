import {
  DashboardCard,
  DashboardPageHeader,
} from '@/components/features/dashboard'

export default function CitizenMapPage() {
  return (
    <>
      <DashboardPageHeader
        title="Mapa"
        subtitle="Área autenticada de mapa para visualização do cidadão."
      />
      <div className="p-6">
        <DashboardCard>
          <h2 className="text-xl tracking-tight text-burgundy">Mapa</h2>
          <p className="mt-2 text-sm leading-6 text-rosewood">
            Scaffold reservado para a experiência autenticada de mapa do
            cidadão.
          </p>
        </DashboardCard>
      </div>
    </>
  )
}
