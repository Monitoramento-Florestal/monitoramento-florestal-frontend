"use client";

import { useEffect, useState } from "react";

import { DashboardCard, DashboardPageHeader } from "@/components/features/dashboard";
import { useToast } from "@/components/ui/toast";
import { UserRole } from "@/constants/roles";
import {
  deleteTreeRecord,
  getManagedTree,
} from "@/services/trees/treeService";
import type { Tree, TreeMeasurementRecord } from "@/types/trees";
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
  const { showToast } = useToast();
  const [tree, setTree] = useState<Tree | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function syncTree() {
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

    void syncTree();

    return () => {
      isMounted = false;
    };
  }, [treeId]);

  async function handleDeleteRecord(record: TreeMeasurementRecord) {
    const confirmed = window.confirm(
      `Excluir o registro v${record.version}? Essa ação não pode ser desfeita.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingRecordId(record.id);
      await deleteTreeRecord(record.id);
      const nextTree = await getManagedTree(treeId);
      setTree(nextTree);
      setErrorMessage(null);
      showToast({
        title: "Registro excluído com sucesso",
        description: `O registro v${record.version} foi removido do histórico.`,
        variant: "success",
      });
    } catch (error) {
      if (isSessionInvalidationError(error)) {
        return;
      }

      showToast({
        title: "Não foi possível excluir o registro",
        description: normalizeApiError(error).message,
        variant: "error",
      });
    } finally {
      setDeletingRecordId(null);
    }
  }

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
          <TreeHistoryScreen
            role={role}
            tree={tree}
            deletingRecordId={deletingRecordId}
            onDeleteRecord={handleDeleteRecord}
          />
        ) : null}
      </div>
    </>
  );
}
