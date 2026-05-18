import { DashboardPageHeader } from "@/components/features/dashboard";
import { TreeHistoryScreen } from "@/components/features/treeRecords/TreeHistoryScreen";
import { UserRole } from "@/constants/roles";
import { mockApprovalRequests, mockTrees } from "@/types/mockTrees";
import { findTreeById } from "@/utils/treeQueries";
import { getTreeHistorySummary } from "@/utils/treeRecords";

export default async function AdminTreeHistoryPage({
  params,
}: {
  params: Promise<{ treeId: string }>;
}) {
  const { treeId } = await params;
  const tree = findTreeById(mockTrees, treeId);

  if (!tree) {
    return null;
  }

  return (
    <>
      <DashboardPageHeader
        title="Historico da arvore"
        subtitle={getTreeHistorySummary(tree)}
      />
      <div className="p-6">
        <TreeHistoryScreen
          approvalRequests={mockApprovalRequests}
          role={UserRole.ADMIN}
          tree={tree}
        />
      </div>
    </>
  );
}
