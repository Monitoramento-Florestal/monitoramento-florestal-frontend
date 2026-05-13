"use client"

import { usePathname } from "next/navigation";

import { UserRole } from "@/constants/roles";
import { useAuthContext } from "@/contexts/AuthContext";
import { getDashboardNavigation } from "@/utils/dashboard";
import {
  DashboardCard,
  DashboardPageHeader,
  DashboardShell,
  DashboardSidebar,
} from "@/components/features/dashboard";

export default function TestDashboard (){
    const pathname = usePathname();

    const role = UserRole.CITIZEN;
    const items = getDashboardNavigation(role);

    return(
        <div className="relative flex min-h-screen">
            <DashboardShell
            sidebar={
                <DashboardSidebar
                    currentPath={pathname}
                    items={items}
                    userName={"Visitante"}
                    userRole={role}

                />
            }
            header={
                <DashboardPageHeader
                    title="Header Test"
                    subtitle="Test 2"
                />
            }
            >
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 w-screen">
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <DashboardCard>
                    Conteudo 1
                    </DashboardCard>

                    <DashboardCard>
                    Conteudo 2
                    </DashboardCard>

                    <DashboardCard>
                    Conteudo 3
                    </DashboardCard>
                    </div>
                </div>

            </DashboardShell>

        </div>
    )
}