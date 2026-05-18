import 'leaflet'

declare module 'leaflet.markercluster' {
  export {}
}

declare module 'leaflet' {
  class MarkerCluster extends Marker {
    getAllChildMarkers(): Marker[]
    getChildCount(): number
    zoomToBounds(options?: FitBoundsOptions): void
    getBounds(): LatLngBounds
    spiderfy(): void
    unspiderfy(): void
  }

  interface MarkerClusterGroupOptions extends LayerOptions {
    maxClusterRadius?: number | ((zoom: number) => number)
    iconCreateFunction?: (cluster: MarkerCluster) => Icon | DivIcon
    clusterPane?: string
    spiderfyOnEveryZoom?: boolean
    spiderfyOnMaxZoom?: boolean
    showCoverageOnHover?: boolean
    zoomToBoundsOnClick?: boolean
    singleMarkerMode?: boolean
    disableClusteringAtZoom?: number
    removeOutsideVisibleBounds?: boolean
    animate?: boolean
    animateAddingMarkers?: boolean
    spiderfyShapePositions?: (count: number, centerPoint: Point) => Point[]
    spiderfyDistanceMultiplier?: number
    spiderLegPolylineOptions?: PolylineOptions
    chunkedLoading?: boolean
    chunkDelay?: number
    chunkInterval?: number
    chunkProgress?: (
      processedMarkers: number,
      totalMarkers: number,
      elapsedTime: number
    ) => void
    polygonOptions?: PolylineOptions
  }

  class MarkerClusterGroup extends FeatureGroup {
    constructor(options?: MarkerClusterGroupOptions)
    addLayers(layers: Layer[], skipLayerAddEvent?: boolean): this
    removeLayers(layers: Layer[]): this
    clearLayers(): this
    getVisibleParent(marker: Marker): Marker
    refreshClusters(
      clusters?: Marker | Marker[] | LayerGroup | { [index: string]: Layer }
    ): this
    getChildCount(): number
    getAllChildMarkers(): Marker[]
    hasLayer(layer: Layer): boolean
    zoomToShowLayer(layer: Layer, callback?: () => void): void
  }

  function markerClusterGroup(
    options?: MarkerClusterGroupOptions
  ): MarkerClusterGroup
}
