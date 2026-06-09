"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";

import { DashboardCard } from "@/components/features/dashboard";
import { getTreeHistoryRoute, getTreeRecordCreateRoute } from "@/constants/routes";
import { UserRole } from "@/constants/roles";
import { getMapTreeDetail, listMapTrees } from "@/services/maps/mapService";
import { Button } from "@/components/ui/button";
import type {
  MapTreeCluster,
  MapTreeCollectionMode,
  MapTreeDetail,
  MapTreePreview,
  MapViewport,
} from "@/types/map";
import { isSessionInvalidationError, normalizeApiError } from "@/utils/apiFunctions";
import { MapTreeDetailPanel } from "./treeDetail/MapTreeDetailPanel";
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
  const [trees, setTrees] = useState<MapTreePreview[]>([]);
  const [clusters, setClusters] = useState<MapTreeCluster[]>([]);
  const [mapMode, setMapMode] = useState<MapTreeCollectionMode>("trees");
  const [viewport, setViewport] = useState<MapViewport | null>(null);
  const [isLoadingTrees, setIsLoadingTrees] = useState(true);
  const [mapErrorMessage, setMapErrorMessage] = useState<string | null>(null);
  const [selectedTreePreview, setSelectedTreePreview] = useState<MapTreePreview | null>(null);
  const [selectedTree, setSelectedTree] = useState<MapTreeDetail | null>(null);
  const [, setIsLoadingSelectedTree] = useState(false);

  useEffect(() => {
    if (!viewport) {
      return;
    }

    const currentViewport = viewport;

    async function loadTrees() {
      try {
        setIsLoadingTrees(true);
        setMapErrorMessage(null);
        const nextMapResult = await listMapTrees(currentViewport);

        setMapMode(nextMapResult.mode);
        setTrees(nextMapResult.items);
        setClusters(nextMapResult.clusters);
      } catch (error) {
        if (isSessionInvalidationError(error)) {
          return;
        }

        setMapErrorMessage(normalizeApiError(error).message);
        setTrees([]);
        setClusters([]);
      } finally {
        setIsLoadingTrees(false);
      }
    }

    void loadTrees();
  }, [viewport]);

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
        const nextTree = await getMapTreeDetail(currentTreeId);

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
  const recordCreateHref = useMemo(
    () => (selectedTree ? getTreeRecordCreateRoute(role, selectedTree.id) : undefined),
    [role, selectedTree]
  );

  return (
    <div className="space-y-4">
      <DashboardCard className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-5">
        <div className="flex flex-wrap gap-4 text-xs text-burgundy/80">
          <Legend color={TREE_STATUS_COLORS.saudavel.fill} label="Saudável" />
          <Legend color={TREE_STATUS_COLORS.injuria.fill} label="Com injúria" />
          <Legend color={TREE_STATUS_COLORS.cortada.fill} label="Cortada" />
        </div>

        <Button href={registerHref} icon={Plus} iconSide="left" variant="outline" className="w-full sm:w-auto">
          Registrar árvore
        </Button>
      </DashboardCard>

      <DashboardCard className="relative h-[min(70dvh,32rem)] overflow-hidden p-0 sm:h-[calc(100dvh-14rem)]">
        {mapErrorMessage ? (
          <div className="absolute inset-x-4 top-4 z-[700] rounded-xl border border-burgundy/15 bg-cream/95 px-4 py-3 text-sm text-rosewood shadow-sm">
            {mapErrorMessage}
          </div>
        ) : null}

        {mapMode === "cluster" && !isLoadingTrees ? (
          <div className="absolute inset-x-4 top-4 z-[700] rounded-xl border border-sage/20 bg-cream/95 px-4 py-3 text-sm text-rosewood shadow-sm">
            O viewport atual está agregado em clusters. Aproxime o mapa para inspecionar e selecionar árvores individuais.
          </div>
        ) : null}

        <MapView
          mode={mapMode}
          clusters={clusters}
          trees={trees}
          selectedTreeId={selectedTreePreview?.id ?? null}
          onSelect={setSelectedTreePreview}
          onViewportChange={setViewport}
          className="absolute inset-0"
        />

        <MapTreeDetailPanel
          historyHref={historyHref}
          recordCreateHref={recordCreateHref}
          tree={selectedTree}
          onClose={() => {
            setSelectedTreePreview(null);
            setSelectedTree(null);
          }}
        />
      </DashboardCard>
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
