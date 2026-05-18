import { DashboardPageHeader } from "@/components/features/dashboard";
import { TreeRecordFormScreen } from "@/components/features/treeRecords/TreeRecordFormScreen";
import { UserRole } from "@/constants/roles";
import { mockTrees } from "@/types/mockTrees";
import { findTreeById } from "@/utils/treeQueries";
import { getTreeRecordFormSubtitle } from "@/utils/treeRecords";

export default async function AdminNewRecordPage({
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
        title="Adicionar registro"
        subtitle={getTreeRecordFormSubtitle(UserRole.ADMIN, "create-record")}
      />
      <div className="p-6">
        <TreeRecordFormScreen mode="create-record" role={UserRole.ADMIN} tree={tree} />
      </div>
    </>
  );
}
