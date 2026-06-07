import { ManagedTreesPageContent } from "@/components/features/treeManagement/ManagedTreesPageContent";
import { UserRole } from "@/constants/roles";

export default function ManagerManagementPage() {
  return (
    <ManagedTreesPageContent
      role={UserRole.MANAGER}
      title="Gerenciamento de árvores"
    />
  );
}
