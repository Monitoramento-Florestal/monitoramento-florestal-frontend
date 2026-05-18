import { DashboardPageHeader } from "@/components/features/dashboard";
import { AuthenticatedMapScreen } from "@/components/features/map/AuthenticatedMapScreen";
import { APP_ROUTES } from "@/constants/routes";
import { UserRole } from "@/constants/roles";

export default function ResearcherMapPage() {
  return (
    <>
      <DashboardPageHeader
        title="Mapa"
        subtitle="Area autenticada de mapa para consulta e acompanhamento da pesquisa."
      />
      <div className="p-6">
        <AuthenticatedMapScreen
          registerHref={APP_ROUTES.RESEARCHER_TREES_NEW}
          role={UserRole.RESEARCHER}
        />
      </div>
    </>
  );
}
