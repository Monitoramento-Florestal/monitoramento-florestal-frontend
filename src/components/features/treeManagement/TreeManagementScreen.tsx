"use client";

import { useMemo, useState } from "react";

import { DashboardCard } from "@/components/features/dashboard";
import { UserRole } from "@/constants/roles";
import { TreeDetailPanel } from "@/components/features/map/treeDetail/TreeDetailPanel";
import type { Tree } from "@/types/trees";
import {
  filterManagedTrees,
  getTreeManagementPolicy,
  TREE_MANAGEMENT_FILTERS,
  type TreeManagementStatusFilter,
} from "@/utils/treeManagement";
import { TreeManagementEmptyState } from "./TreeManagementEmptyState";
import { TreeManagementFilters } from "./TreeManagementFilters";
import { TreeManagementLoadingState } from "./TreeManagementLoadingState";
import { TreeManagementTable } from "./TreeManagementTable";

interface TreeManagementScreenProps {
  initialTrees: Tree[];
  loading?: boolean;
  role: UserRole;
}

interface TreeManagementFeedback {
  description: string;
  title: string;
}

export function TreeManagementScreen({
  initialTrees,
  loading = false,
  role,
}: TreeManagementScreenProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TreeManagementStatusFilter>("all");
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [feedback, setFeedback] = useState<TreeManagementFeedback | null>(null);

  const filteredTrees = useMemo(
    () => filterManagedTrees(initialTrees, query, status),
    [initialTrees, query, status]
  );
  const policy = useMemo(() => getTreeManagementPolicy(role), [role]);
  const hasFilters = query.trim().length > 0 || status !== "all";

  return (
    <>
      <div className="space-y-6">
        <DashboardCard className="px-4 py-4 sm:px-5">
          <TreeManagementFilters
            activeStatus={status}
            filters={TREE_MANAGEMENT_FILTERS}
            query={query}
            onQueryChange={setQuery}
            onStatusChange={setStatus}
          />
        </DashboardCard>

        {loading ? <TreeManagementLoadingState /> : null}

        {!loading && filteredTrees.length === 0 ? (
          <TreeManagementEmptyState hasFilters={hasFilters} />
        ) : null}

        {!loading && filteredTrees.length > 0 ? (
          <DashboardCard className="overflow-hidden p-0">
            <TreeManagementTable
              trees={filteredTrees}
              policy={policy}
              onSelectTree={setSelectedTree}
            />
          </DashboardCard>
        ) : null}
      </div>

      <TreeDetailPanel
        tree={selectedTree}
        onClose={() => setSelectedTree(null)}
      />
    </>
  );
}
