import { DashboardPageHeader } from "@/components/features/dashboard";
import { TreeRecordFormScreen } from "@/components/features/treeRecords/TreeRecordFormScreen";
import { UserRole } from "@/constants/roles";
import { getTreeRecordFormSubtitle } from "@/utils/treeRecords";

export default function ManagerTreeRegisterPage() {
  return (
    <>
      <DashboardPageHeader
        title="Registrar árvore"
        subtitle={getTreeRecordFormSubtitle(UserRole.MANAGER, "create-tree")}
      />
      <div className="p-6">
        <TreeRecordFormScreen mode="create-tree" role={UserRole.MANAGER} />
      </div>
    </>
  );
}
