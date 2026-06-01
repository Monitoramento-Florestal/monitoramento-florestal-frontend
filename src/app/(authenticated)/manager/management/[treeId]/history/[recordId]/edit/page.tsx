import { DashboardPageHeader } from "@/components/features/dashboard";
import { TreeRecordFormScreen } from "@/components/features/treeRecords/TreeRecordFormScreen";
import { UserRole } from "@/constants/roles";
import { getMockTreeById, getMockTreeRecordById } from "@/types/mockTrees";
import { getTreeRecordFormSubtitle } from "@/utils/treeRecords";

export default async function ManagerEditRecordPage({
  params,
}: {
  params: Promise<{ treeId: string; recordId: string }>;
}) {
  const { treeId, recordId } = await params;
  const tree = getMockTreeById(treeId);
  const record = getMockTreeRecordById(treeId, recordId);

  if (!tree || !record) {
    return null;
  }

  return (
    <>
      <DashboardPageHeader
        title="Editar registro"
        subtitle={getTreeRecordFormSubtitle(UserRole.MANAGER, "edit-record")}
      />
      <div className="p-6">
        <TreeRecordFormScreen
          mode="edit-record"
          role={UserRole.MANAGER}
          tree={tree}
          record={record}
        />
      </div>
    </>
  );
}
