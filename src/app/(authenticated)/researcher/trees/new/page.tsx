import { DashboardPageHeader } from "@/components/features/dashboard";
import { TreeRecordFormScreen } from "@/components/features/treeRecords/TreeRecordFormScreen";
import { UserRole } from "@/constants/roles";
import { getTreeRecordFormSubtitle } from "@/utils/treeRecords";

export default function ResearcherTreeRegisterPage() {
  return (
    <>
      <DashboardPageHeader
        title="Registrar arvore"
        subtitle={getTreeRecordFormSubtitle(UserRole.RESEARCHER, "create-tree")}
      />
      <div className="p-6">
        <TreeRecordFormScreen mode="create-tree" role={UserRole.RESEARCHER} />
      </div>
    </>
  );
}
