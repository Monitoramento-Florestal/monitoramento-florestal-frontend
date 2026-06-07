"use client";

import { useEffect, useState } from "react";

import { DashboardCard, DashboardPageHeader } from "@/components/features/dashboard";
import { UserRole } from "@/constants/roles";
import { getManagedTree } from "@/services/trees/treeService";
import type { Tree } from "@/types/trees";
import { isSessionInvalidationError, normalizeApiError } from "@/utils/apiFunctions";
import { getTreeRecordFormSubtitle } from "@/utils/treeRecords";
import { TreeRecordFormScreen } from "./TreeRecordFormScreen";

interface TreeRecordPageContentProps {
  mode: "create-tree" | "create-record";
  role: UserRole.RESEARCHER | UserRole.MANAGER | UserRole.ADMIN;
  treeId?: string;
}

export function TreeRecordPageContent({
  mode,
  role,
  treeId,
}: TreeRecordPageContentProps) {
  const [tree, setTree] = useState<Tree | null>(null);
  const [isLoading, setIsLoading] = useState(mode === "create-record");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "create-record" || !treeId) {
      return;
    }

    let isMounted = true;

    async function loadTree() {
      const currentTreeId = treeId;

      if (!currentTreeId) {
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);
        const nextTree = await getManagedTree(currentTreeId);

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
  }, [mode, treeId]);

  return (
    <>
      <DashboardPageHeader
        title={mode === "create-tree" ? "Registrar árvore" : "Adicionar Registro"}
        subtitle={getTreeRecordFormSubtitle(role, mode)}
      />
      <div className="space-y-6 p-6">
        {errorMessage ? (
          <DashboardCard className="border-burgundy/15 bg-burgundy/5 text-rosewood">
            {errorMessage}
          </DashboardCard>
        ) : null}

        {!errorMessage && (mode === "create-tree" || tree) ? (
          <TreeRecordFormScreen mode={mode} role={role} tree={tree} />
        ) : null}

        {!errorMessage && isLoading ? (
          <DashboardCard className="text-rosewood">
            Carregando árvore...
          </DashboardCard>
        ) : null}
      </div>
    </>
  );
}
