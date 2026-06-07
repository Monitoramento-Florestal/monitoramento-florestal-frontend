import { ManagedTreesPageContent } from "@/components/features/treeManagement/ManagedTreesPageContent";
import { UserRole } from "@/constants/roles";

export default function ResearcherTreeManagementPage() {
  return (
    <ManagedTreesPageContent
      role={UserRole.RESEARCHER}
      title="Gerenciamento de árvores"
    />
  );
}
