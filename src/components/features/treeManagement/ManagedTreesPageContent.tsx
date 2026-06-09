"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { DashboardCard, DashboardPageHeader } from "@/components/features/dashboard";
import { useToast } from "@/components/ui/toast";
import { UserRole } from "@/constants/roles";
import { getTreeManagementEditRoute } from "@/constants/routes";
import { deleteManagedTree, listManagedTrees } from "@/services/trees/treeService";
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
  const router = useRouter();
  const { showToast } = useToast();
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

  function handleEditTree(tree: TreePreview) {
    if (role !== UserRole.MANAGER && role !== UserRole.ADMIN) {
      return;
    }

    router.push(getTreeManagementEditRoute(role, tree.id));
  }

  async function handleDeleteTree(tree: TreePreview) {
    const confirmed = window.confirm(
      `Excluir a árvore ${tree.codigo}? Essa ação não pode ser desfeita.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteManagedTree(tree.id);
      setTrees((current) => current.filter((item) => item.id !== tree.id));
      setErrorMessage(null);
      showToast({
        title: "Arvore excluida com sucesso",
        description: `${tree.codigo} foi removida do gerenciamento.`,
        variant: "success",
      });
    } catch (error) {
      if (isSessionInvalidationError(error)) {
        return;
      }

      showToast({
        title: "Não foi possível excluir a árvore",
        description: normalizeApiError(error).message,
        variant: "error",
      });
    }
  }

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
      <div className="space-y-6 p-4 sm:p-6">
        {errorMessage ? (
          <DashboardCard className="border-burgundy/15 bg-burgundy/5 text-rosewood">
            {errorMessage}
          </DashboardCard>
        ) : null}

        <TreeManagementScreen
          initialTrees={trees}
          loading={isLoading}
          role={role}
          onDeleteTree={handleDeleteTree}
          onEditTree={handleEditTree}
        />
      </div>
    </>
  );
}
