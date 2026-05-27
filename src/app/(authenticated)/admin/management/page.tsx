import { DashboardPageHeader } from "@/components/features/dashboard";
import { TreeManagementScreen } from "@/components/features/treeManagement/TreeManagementScreen";
import { UserRole } from "@/constants/roles";
import { mockTrees } from "@/types/mockTrees";
import { getTreeManagementSummary } from "@/utils/treeManagement";

export default function AdminManagementPage() {
  return (
    <>
      <DashboardPageHeader
        title="Gerenciamento de árvores"
        subtitle={getTreeManagementSummary(mockTrees.length, mockTrees.length)}
      />
      <div className="p-6">
        <TreeManagementScreen
          initialTrees={mockTrees}
          role={UserRole.ADMIN}
        />
      </div>
    </>
  );
}
