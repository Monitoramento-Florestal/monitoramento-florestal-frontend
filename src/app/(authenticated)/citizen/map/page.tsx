import { DashboardPageHeader } from '@/components/features/dashboard'
import { ReadOnlyMapScreen } from '@/components/features/map/ReadOnlyMapScreen'

export default function CitizenMapPage() {
  return (
    <>
      <DashboardPageHeader
        title="Mapa"
        subtitle="Consulta autenticada das arvores monitoradas."
      />
      <div className="p-6">
        <ReadOnlyMapScreen mapHeightClassName="h-[calc(100dvh-18rem)]" />
      </div>
    </>
  )
}
