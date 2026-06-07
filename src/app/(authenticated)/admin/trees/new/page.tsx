import { TreeRecordPageContent } from "@/components/features/treeRecords/TreeRecordPageContent";
import { UserRole } from "@/constants/roles";

export default function AdminTreeRegisterPage() {
  return (
    <TreeRecordPageContent
      mode="create-tree"
      role={UserRole.ADMIN}
    />
  );
}
