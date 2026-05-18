import { DashboardPageHeader } from "@/components/features/dashboard";
import { AuthenticatedMapScreen } from "@/components/features/map/AuthenticatedMapScreen";
import { APP_ROUTES } from "@/constants/routes";
import { UserRole } from "@/constants/roles";

export default function AdminMapPage() {
  return (
    <>
      <DashboardPageHeader
        title="Mapa"
        subtitle="Area autenticada de mapa para o administrador."
      />
      <div className="p-6">
        <AuthenticatedMapScreen
          registerHref={APP_ROUTES.ADMIN_TREES_NEW}
          role={UserRole.ADMIN}
        />
      </div>
    </>
  );
}
