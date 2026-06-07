import { ManagedTreesPageContent } from "@/components/features/treeManagement/ManagedTreesPageContent";
import { UserRole } from "@/constants/roles";

export default function AdminManagementPage() {
  return (
    <ManagedTreesPageContent
      role={UserRole.ADMIN}
      title="Gerenciamento de árvores"
    />
  );
}
