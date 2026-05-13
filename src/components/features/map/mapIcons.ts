import type { TreeStatus } from "@/types/trees";

type LeafletModule = typeof import("leaflet");

export const TREE_STATUS_COLORS: Record<
  TreeStatus,
  { fill: string; stroke: string; shadow: string }
> = {
  saudavel: { fill: "#1e3d22", stroke: "#122616", shadow: "#0a1a0c" },
  injuria: { fill: "#5a3a3a", stroke: "#2e1b1b", shadow: "#1a0e0e" },
  cortada: { fill: "#3e000c", stroke: "#1f0006", shadow: "#0d0003" },
};

const STATUS_ICON_URL: Record<TreeStatus, string> = {
  saudavel: "/arbor_pin.png",
  injuria: "/arbor_pin2.png",
  cortada: "/arbor_pin3.png",
};

export const TREE_STATUS_LABEL: Record<TreeStatus, string> = {
  saudavel: "Saudável",
  injuria: "Com injúria",
  cortada: "Cortada",
};

export function makeTreeImageIcon(
  leaflet: LeafletModule,
  status: TreeStatus,
  options: { focused?: boolean } = {}
) {
  const focused = Boolean(options.focused);
  const iconSize: [number, number] = focused ? [68, 60] : [60, 54];
  const iconAnchor: [number, number] = focused ? [34, 60] : [30, 54];

  return leaflet.icon({
    iconUrl: STATUS_ICON_URL[status],
    iconSize,
    iconAnchor,
    popupAnchor: [0, -50],
  });
}

export function makeClusterIcon(
  leaflet: LeafletModule,
  cluster: import("leaflet").MarkerCluster
) {
  const count = cluster.getChildCount();
  const size = count < 10 ? 40 : count < 50 ? 48 : 56;

  return leaflet.divIcon({
    className: "arbor-cluster-wrap",
    html: `
      <div
        class="flex items-center justify-center rounded-full border-2 border-cream bg-forest text-cream font-sans font-medium shadow-[0_10px_24px_rgb(9_30_5_/_0.18)]"
        style="width:${size}px;height:${size}px;"
      >
        <span class="text-[13px] leading-none">${count}</span>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [Math.round(size / 2), Math.round(size / 2)],
  });
}
