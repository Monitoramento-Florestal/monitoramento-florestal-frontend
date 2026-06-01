import { DashboardPageHeader } from "@/components/features/dashboard";
import { AuthenticatedMapScreen } from "@/components/features/map/AuthenticatedMapScreen";
import { APP_ROUTES } from "@/constants/routes";
import { UserRole } from "@/constants/roles";

export default function ManagerMapPage() {
  return (
    <>
      <DashboardPageHeader
        title="Mapa"
        subtitle="Area autenticada de mapa para o gestor."
      />
      <div className="p-6">
        <AuthenticatedMapScreen
          registerHref={APP_ROUTES.MANAGER_TREES_NEW}
          role={UserRole.MANAGER}
        />
      </div>
    </>
  );
}
