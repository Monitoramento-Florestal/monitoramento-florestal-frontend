import type { TreeStatus, TreeVigor } from './trees'

export type MapTreeCollectionMode = 'trees' | 'cluster'

export interface MapTreeQueryParams {
  includeCut?: boolean
  limit?: number
  maxLat: number
  maxLng: number
  minLat: number
  minLng: number
  search?: string
  species?: string
  status?: string
  zoom?: number
}

export interface MapViewport {
  maxLat: number
  maxLng: number
  minLat: number
  minLng: number
  zoom: number
}

export interface MapTreePreview {
  id: string
  codigo: string
  nomeComum: string
  especie: string
  lat: number | null
  lng: number | null
  status: TreeStatus
  ultimaMedicao: string | null
}

export interface MapTreeCluster {
  lat: number
  lng: number
  count: number
}

export interface MapTreesResult {
  mode: MapTreeCollectionMode
  totalInView: number
  items: MapTreePreview[]
  clusters: MapTreeCluster[]
}

export interface MapTreeLocationDetail {
  bairro: string
  rua: string
  referencia?: string
}

export interface MapTreeDetail {
  id: string
  codigo: string
  nomeComum: string
  especie: string
  lat: number | null
  lng: number | null
  localizacao: MapTreeLocationDetail
  status: TreeStatus
  vigor: TreeVigor | null
  observacoes?: string
  currentRecord: unknown | null
}
