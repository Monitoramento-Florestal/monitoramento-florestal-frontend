import { DashboardPageHeader } from '@/components/features/dashboard'
import { ReadOnlyMapScreen } from '@/components/features/map/ReadOnlyMapScreen'

export default function CitizenMapPage() {
  return (
    <>
      <DashboardPageHeader
        title="Mapa"
        subtitle="Consulta autenticada das árvores monitoradas."
      />
      <div className="p-4 sm:p-6">
        <ReadOnlyMapScreen mapHeightClassName="h-[min(70dvh,32rem)] sm:h-[calc(100dvh-18rem)]" />
      </div>
    </>
  )
}
