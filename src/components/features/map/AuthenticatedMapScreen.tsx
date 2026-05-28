"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";

import { DashboardCard } from "@/components/features/dashboard";
import { getTreeHistoryRoute } from "@/constants/routes";
import { UserRole } from "@/constants/roles";
import { Button } from "@/components/ui/button";
import { getMockTreeById, mockTreePreviews } from "@/types/mockTrees";
import type { Tree, TreePreview } from "@/types/trees";
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
  const [selectedTreePreview, setSelectedTreePreview] = useState<TreePreview | null>(null);
  const selectedTree = useMemo<Tree | null>(
    () => (selectedTreePreview ? getMockTreeById(selectedTreePreview.id) : null),
    [selectedTreePreview]
  );
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
        <MapView
          trees={mockTreePreviews}
          selectedTreeId={selectedTreePreview?.id ?? null}
          onSelect={setSelectedTreePreview}
          className="absolute inset-0"
        />
      </DashboardCard>

      <TreeDetailPanel
        historyHref={historyHref}
        tree={selectedTree}
        onClose={() => setSelectedTreePreview(null)}
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
