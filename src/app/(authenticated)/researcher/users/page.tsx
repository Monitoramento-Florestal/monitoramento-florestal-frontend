import { DashboardPageHeader } from '@/components/features/dashboard'
import { UserManagementScreen } from '@/components/features/userManagement/UserManagementScreen'
import { UserRole } from '@/constants/roles'

export default function ResearcherUsersPage() {
  return (
    <>
      <DashboardPageHeader
        title="Usuários"
        subtitle="Consulta de perfis vinculados ao monitoramento."
      />
      <div className="p-4 sm:p-6">
        <UserManagementScreen currentRole={UserRole.RESEARCHER} />
      </div>
    </>
  )
}
