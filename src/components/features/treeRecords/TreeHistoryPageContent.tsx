"use client";

import { useEffect, useState } from "react";

import { DashboardCard, DashboardPageHeader } from "@/components/features/dashboard";
import { UserRole } from "@/constants/roles";
import { getManagedTree } from "@/services/trees/treeService";
import type { Tree } from "@/types/trees";
import { isSessionInvalidationError, normalizeApiError } from "@/utils/apiFunctions";
import { getTreeHistorySummary } from "@/utils/treeRecords";
import { TreeHistoryScreen } from "./TreeHistoryScreen";

interface TreeHistoryPageContentProps {
  role: UserRole.RESEARCHER | UserRole.MANAGER | UserRole.ADMIN;
  treeId: string;
}

export function TreeHistoryPageContent({
  role,
  treeId,
}: TreeHistoryPageContentProps) {
  const [tree, setTree] = useState<Tree | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTree() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const nextTree = await getManagedTree(treeId);

        if (!isMounted) {
          return;
        }

        setTree(nextTree);
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

    void loadTree();

    return () => {
      isMounted = false;
    };
  }, [treeId]);

  return (
    <>
      <DashboardPageHeader
        title="Histórico da árvore"
        subtitle={
          isLoading
            ? "Carregando histórico..."
            : tree
              ? getTreeHistorySummary(tree)
              : "Histórico indisponível"
        }
      />
      <div className="space-y-6 p-6">
        {errorMessage ? (
          <DashboardCard className="border-burgundy/15 bg-burgundy/5 text-rosewood">
            {errorMessage}
          </DashboardCard>
        ) : null}

        {!errorMessage && !isLoading && tree && tree.records.length === 0 ? (
          <DashboardCard className="text-rosewood">
            Nenhum registro foi encontrado para esta árvore.
          </DashboardCard>
        ) : null}

        {!errorMessage && tree && tree.records.length > 0 ? (
          <TreeHistoryScreen role={role} tree={tree} />
        ) : null}
      </div>
    </>
  );
}
