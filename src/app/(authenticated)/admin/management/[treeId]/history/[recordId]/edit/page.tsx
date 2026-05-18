import { DashboardPageHeader } from "@/components/features/dashboard";
import { TreeRecordFormScreen } from "@/components/features/treeRecords/TreeRecordFormScreen";
import { UserRole } from "@/constants/roles";
import { mockTrees } from "@/types/mockTrees";
import { findTreeById, findTreeRecordById } from "@/utils/treeQueries";
import { getTreeRecordFormSubtitle } from "@/utils/treeRecords";

export default async function AdminEditRecordPage({
  params,
}: {
  params: Promise<{ treeId: string; recordId: string }>;
}) {
  const { treeId, recordId } = await params;
  const tree = findTreeById(mockTrees, treeId);
  const record = findTreeRecordById(tree, recordId);

  if (!tree || !record) {
    return null;
  }

  return (
    <>
      <DashboardPageHeader
        title="Editar registro"
        subtitle={getTreeRecordFormSubtitle(UserRole.ADMIN, "edit-record")}
      />
      <div className="p-6">
        <TreeRecordFormScreen mode="edit-record" role={UserRole.ADMIN} tree={tree} record={record} />
      </div>
    </>
  );
}
