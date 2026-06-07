"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";

import { DashboardCard } from "@/components/features/dashboard";
import { getTreeHistoryRoute } from "@/constants/routes";
import { UserRole } from "@/constants/roles";
import { getManagedTree, listManagedTrees } from "@/services/trees/treeService";
import { Button } from "@/components/ui/button";
import type { Tree, TreePreview } from "@/types/trees";
import { isSessionInvalidationError, normalizeApiError } from "@/utils/apiFunctions";
import { TreeDetailPanel } from "./treeDetail/TreeDetailPanel";
import { TREE_STATUS_COLORS } from "./mapIcons";

const MapView = dynamic(() => import("@/components/features/map/MapView"), {
  ssr: false,
  loading: () => <p className="p-6 text-rosewood">Carregando mapa...</p>,
});

interface AuthenticatedMapScreenProps {
  registerHref: string;
  role: UserRole.RESEARCHER | UserRole.MANAGER | UserRole.ADMIN;
}

export function AuthenticatedMapScreen({
  registerHref,
  role,
}: AuthenticatedMapScreenProps) {
  const [trees, setTrees] = useState<TreePreview[]>([]);
  const [isLoadingTrees, setIsLoadingTrees] = useState(true);
  const [mapErrorMessage, setMapErrorMessage] = useState<string | null>(null);
  const [selectedTreePreview, setSelectedTreePreview] = useState<TreePreview | null>(null);
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [isLoadingSelectedTree, setIsLoadingSelectedTree] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadTrees() {
      try {
        setIsLoadingTrees(true);
        setMapErrorMessage(null);
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

        setMapErrorMessage(normalizeApiError(error).message);
      } finally {
        if (isMounted) {
          setIsLoadingTrees(false);
        }
      }
    }

    void loadTrees();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedTreePreview) {
      setSelectedTree(null);
      return;
    }

    let isMounted = true;
    const currentTreeId = selectedTreePreview.id;

    async function loadSelectedTree() {
      try {
        setIsLoadingSelectedTree(true);
        const nextTree = await getManagedTree(currentTreeId);

        if (!isMounted) {
          return;
        }

        setSelectedTree(nextTree);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (isSessionInvalidationError(error)) {
          return;
        }

        setMapErrorMessage(normalizeApiError(error).message);
        setSelectedTree(null);
      } finally {
        if (isMounted) {
          setIsLoadingSelectedTree(false);
        }
      }
    }

    void loadSelectedTree();

    return () => {
      isMounted = false;
    };
  }, [selectedTreePreview]);

  const historyHref = useMemo(
    () => (selectedTree ? getTreeHistoryRoute(role, selectedTree.id) : undefined),
    [role, selectedTree]
  );

  return (
    <div className="space-y-4">
      <DashboardCard className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div className="flex flex-wrap gap-4 text-xs text-burgundy/80">
          <Legend color={TREE_STATUS_COLORS.saudavel.fill} label="Saudável" />
          <Legend color={TREE_STATUS_COLORS.injuria.fill} label="Com injúria" />
          <Legend color={TREE_STATUS_COLORS.cortada.fill} label="Cortada" />
        </div>

        <Button href={registerHref} icon={Plus} iconSide="left" variant="outline">
          Registrar árvore
        </Button>
      </DashboardCard>

      <DashboardCard className="relative h-[calc(100dvh-14rem)] overflow-hidden p-0">
        {mapErrorMessage ? (
          <div className="absolute inset-x-4 top-4 z-[700] rounded-xl border border-burgundy/15 bg-cream/95 px-4 py-3 text-sm text-rosewood shadow-sm">
            {mapErrorMessage}
          </div>
        ) : null}

        {isLoadingTrees || isLoadingSelectedTree ? (
          <div className="absolute inset-x-4 top-4 z-[700] rounded-xl border border-rosewood/12 bg-cream/95 px-4 py-3 text-sm text-rosewood shadow-sm">
            Carregando dados do mapa...
          </div>
        ) : null}

        <MapView
          trees={trees}
          selectedTreeId={selectedTreePreview?.id ?? null}
          onSelect={setSelectedTreePreview}
          className="absolute inset-0"
        />
      </DashboardCard>

      <TreeDetailPanel
        historyHref={historyHref}
        tree={selectedTree}
        onClose={() => {
          setSelectedTreePreview(null);
          setSelectedTree(null);
        }}
      />
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}
