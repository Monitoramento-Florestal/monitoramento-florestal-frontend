import { DashboardPageHeader } from "@/components/features/dashboard";
import { TreeManagementScreen } from "@/components/features/treeManagement/TreeManagementScreen";
import { UserRole } from "@/constants/roles";
import { mockTreePreviews } from "@/types/mockTrees";
import { getTreeManagementSummary } from "@/utils/treeManagement";

export default function ManagerManagementPage() {
  return (
    <>
      <DashboardPageHeader
        title="Gerenciamento de árvores"
        subtitle={getTreeManagementSummary(mockTreePreviews.length, mockTreePreviews.length)}
      />
      <div className="p-6">
        <TreeManagementScreen initialTrees={mockTreePreviews} role={UserRole.MANAGER} />
      </div>
    </>
  );
}
