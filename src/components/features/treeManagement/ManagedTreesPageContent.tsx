"use client";

import { useEffect, useState } from "react";

import { DashboardCard, DashboardPageHeader } from "@/components/features/dashboard";
import { UserRole } from "@/constants/roles";
import { listManagedTrees } from "@/services/trees/treeService";
import type { TreePreview } from "@/types/trees";
import { isSessionInvalidationError, normalizeApiError } from "@/utils/apiFunctions";
import { getTreeManagementSummary } from "@/utils/treeManagement";
import { TreeManagementScreen } from "./TreeManagementScreen";

interface ManagedTreesPageContentProps {
  role: UserRole;
  title: string;
}

export function ManagedTreesPageContent({
  role,
  title,
}: ManagedTreesPageContentProps) {
  const [trees, setTrees] = useState<TreePreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTrees() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const nextTrees = await listManagedTrees();

        if (!isMounted) {
          return;
        }

        setTrees(nextTrees);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (isSessionInvalidationError(error)) {
          return;
        }

        setErrorMessage(normalizeApiError(error).message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadTrees();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <DashboardPageHeader
        title={title}
        subtitle={
          isLoading
            ? "Carregando árvores..."
            : getTreeManagementSummary(trees.length, trees.length)
        }
      />
      <div className="space-y-6 p-6">
        {errorMessage ? (
          <DashboardCard className="border-burgundy/15 bg-burgundy/5 text-rosewood">
            {errorMessage}
          </DashboardCard>
        ) : null}

        <TreeManagementScreen initialTrees={trees} loading={isLoading} role={role} />
      </div>
    </>
  );
}
