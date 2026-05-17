import { UserRole } from "@/constants/roles";
import { DashboardProfilePage } from "@/components/features/dashboard";

export default function AdminProfilePage() {
  return (
    <DashboardProfilePage
      defaultCpf="987.654.321-00"
      defaultEmail="helena.cavalcanti@ufrpe.br"
      defaultName="Dra. Helena Cavalcanti"
      role={UserRole.ADMIN}
    />
  );
}
