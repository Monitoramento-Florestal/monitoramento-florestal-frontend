import { DashboardPageHeader } from "@/components/features/dashboard";
import { TreeHistoryScreen } from "@/components/features/treeRecords/TreeHistoryScreen";
import { UserRole } from "@/constants/roles";
import { getMockTreeById } from "@/types/mockTrees";
import { getTreeHistorySummary } from "@/utils/treeRecords";

export default async function ManagerTreeHistoryPage({
  params,
}: {
  params: Promise<{ treeId: string }>;
}) {
  const { treeId } = await params;
  const tree = getMockTreeById(treeId);

  if (!tree) {
    return null;
  }

  return (
    <>
      <DashboardPageHeader title="Histórico da árvore" subtitle={getTreeHistorySummary(tree)} />
      <div className="p-6">
        <TreeHistoryScreen role={UserRole.MANAGER} tree={tree} />
      </div>
    </>
  );
}
