import { DashboardCard, DashboardPageHeader } from "@/components/features/dashboard";

export default function ManagerUsersPage() {
  return (
    <>
      <DashboardPageHeader
        title="Usuários"
        subtitle="Gestão operacional de perfis e acessos da plataforma."
      />
      <div className="p-6">
        <DashboardCard>
          <h2 className="text-xl tracking-tight text-burgundy">Usuários</h2>
          <p className="mt-2 text-sm leading-6 text-rosewood">
            Scaffold reservado para a futura gestão de usuários.
          </p>
        </DashboardCard>
      </div>
    </>
  );
}
