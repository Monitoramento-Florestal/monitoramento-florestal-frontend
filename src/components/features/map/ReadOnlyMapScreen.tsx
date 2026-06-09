"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { DashboardCard } from "@/components/features/dashboard";
import { getMapTreeDetail, listMapTrees } from "@/services/maps/mapService";
import type {
  MapTreeCluster,
  MapTreeCollectionMode,
  MapTreeDetail,
  MapTreePreview,
  MapViewport,
} from "@/types/map";
import {
  isSessionInvalidationError,
  normalizeApiError,
} from "@/utils/apiFunctions";
import { TREE_STATUS_COLORS } from "./mapIcons";
import { MapTreeDetailPanel } from "./treeDetail/MapTreeDetailPanel";

const MapView = dynamic(() => import("@/components/features/map/MapView"), {
  ssr: false,
  loading: () => <p className="p-6 text-rosewood">Carregando mapa...</p>,
});

interface ReadOnlyMapScreenProps {
  mapHeightClassName?: string;
  variant?: "dashboard" | "public";
}

export function ReadOnlyMapScreen({
  mapHeightClassName = "h-[min(70dvh,32rem)] sm:h-[calc(100dvh-16rem)]",
  variant = "dashboard",
}: ReadOnlyMapScreenProps) {
  const [trees, setTrees] = useState<MapTreePreview[]>([]);
  const [clusters, setClusters] = useState<MapTreeCluster[]>([]);
  const [mapMode, setMapMode] = useState<MapTreeCollectionMode>("trees");
  const [viewport, setViewport] = useState<MapViewport | null>(null);
  const [, setIsLoadingTrees] = useState(true);
  const [mapErrorMessage, setMapErrorMessage] = useState<string | null>(null);
  const [selectedTreePreview, setSelectedTreePreview] =
    useState<MapTreePreview | null>(null);
  const [selectedTree, setSelectedTree] = useState<MapTreeDetail | null>(null);
  const [, setIsLoadingSelectedTree] = useState(false);
  const isPublicVariant = variant === "public";
  const isClusterMode = mapMode === "cluster";

  useEffect(() => {
    if (!viewport) {
      return;
    }

    const currentViewport = viewport;

    async function loadTrees() {
      try {
        setIsLoadingTrees(true);
        setMapErrorMessage(null);
        const nextMapResult = await listMapTrees(currentViewport, {
          publicAccess: isPublicVariant,
        });

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
  }, [isPublicVariant, viewport]);

  useEffect(() => {
    if (!selectedTreePreview) {
      setSelectedTree(null);
      return;
    }

    let isMounted = true;
    const selectedTreeId = selectedTreePreview.id;

    async function loadSelectedTree() {
      try {
        setIsLoadingSelectedTree(true);
        const nextTree = await getMapTreeDetail(selectedTreeId, {
          publicAccess: isPublicVariant,
        });

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
  }, [isPublicVariant, selectedTreePreview]);

  return (
    <div className="space-y-4">
      {isPublicVariant ? (
        <div className="pointer-events-none absolute left-4 top-4 right-4 z-[800] flex items-start justify-end gap-3">
          <div className="pointer-events-auto flex max-w-xl flex-wrap items-center gap-4 rounded-lg border border-rosewood/20 bg-cream/95 px-4 py-3.5 text-xs text-burgundy/80 shadow-[0_8px_24px_rgb(9_30_5_/_0.12)] backdrop-blur">
            <Legend color={TREE_STATUS_COLORS.saudavel.fill} label="Saudável" />
            <Legend color={TREE_STATUS_COLORS.injuria.fill} label="Com injúria" />
            <Legend color={TREE_STATUS_COLORS.cortada.fill} label="Cortada" />
            <span className="text-rosewood/75">
              {viewport
                ? isClusterMode
                  ? "Vista agregada por clusters"
                  : trees.length > 0
                    ? `${trees.length} árvore(s) no viewport atual`
                    : null
                : "Carregando viewport..."}
            </span>
          </div>
        </div>
      ) : (
        <DashboardCard className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-5">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-4 text-xs text-burgundy/80">
              <Legend color={TREE_STATUS_COLORS.saudavel.fill} label="Saudável" />
              <Legend color={TREE_STATUS_COLORS.injuria.fill} label="Com injúria" />
              <Legend color={TREE_STATUS_COLORS.cortada.fill} label="Cortada" />
            </div>
            {!isClusterMode && trees.length === 0 ? null : (
              <p className="text-xs leading-5 text-rosewood/80">
                {isClusterMode
                  ? "O mapa agregou os exemplares em clusters neste zoom. Aproxime para visualizar os pontos individuais."
                  : `${trees.length} árvore(s) no viewport atual.`}
              </p>
            )}
          </div>

          {viewport && !isClusterMode && trees.length === 0 ? null : (
            <p className="text-xs text-rosewood/75">
              {viewport
                ? isClusterMode
                  ? `${clusters.length} cluster(es) no viewport`
                  : `${trees.length} árvore(s) no viewport`
                : "Carregando viewport..."}
            </p>
          )}
        </DashboardCard>
      )}

      <div className={`relative overflow-hidden ${mapHeightClassName}`}>
        {mapErrorMessage ? (
          <div className="absolute inset-x-4 top-4 z-[700] rounded-xl border border-burgundy/15 bg-cream/95 px-4 py-3 text-sm text-rosewood shadow-sm">
            {mapErrorMessage}
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
          tree={selectedTree}
          onClose={() => {
            setSelectedTreePreview(null);
            setSelectedTree(null);
          }}
        />
      </div>
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
