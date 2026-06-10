import axios from 'axios'

import { API_ENDPOINTS } from '@/constants/api'
import { api } from '@/services/api/api'
import type {
  MapTreeCluster,
  MapTreeDetail,
  MapTreePreview,
  MapTreeQueryParams,
  MapTreesResult,
} from '@/types/map'
import type { TreeStatus, TreeVigor } from '@/types/trees'

type BackendMapCollectionMode = 'trees' | 'cluster'

interface BackendMapTreePreview {
  id: string
  codigo: string
  nomeComum?: string | null
  especie: string
  lat?: number | null
  lng?: number | null
  status: string
  ultimaMedicao?: string | null
}

interface BackendMapTreeCluster {
  lat: number
  lng: number
  count: number
}

interface BackendMapTreesResponse {
  mode: BackendMapCollectionMode
  totalInView: number
  items: BackendMapTreePreview[]
  clusters: BackendMapTreeCluster[]
}

interface BackendMapTreeDetail {
  id: string
  codigo: string
  nomeComum?: string | null
  especie: string
  lat?: number | null
  lng?: number | null
  bairro: string
  rua: string
  referencia?: string | null
  status: string
  vigor?: string | null
  observacoes?: string | null
  currentRecord?: unknown | null
  fotoUrl?: string | null
}

interface MapServiceOptions {
  publicAccess?: boolean
}

const publicMapApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
})

function normalizeToken(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? ''
}

function toOptionalCoordinate(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function mapTreeStatus(status: string): TreeStatus {
  const normalized = normalizeToken(status)

  if (normalized === 'morta') {
    return 'cortada'
  }

  if (normalized === 'regular' || normalized === 'ruim') {
    return 'injuria'
  }

  return 'saudavel'
}

function mapTreeVigor(vigor: string | null | undefined): TreeVigor | null {
  const normalized = normalizeToken(vigor)

  if (normalized === 'alto' || normalized === 'medio' || normalized === 'baixo') {
    return normalized
  }

  return null
}

function mapTreePreview(tree: BackendMapTreePreview): MapTreePreview {
  return {
    id: tree.id,
    codigo: tree.codigo,
    nomeComum: tree.nomeComum?.trim() || tree.especie,
    especie: tree.especie,
    lat: toOptionalCoordinate(tree.lat),
    lng: toOptionalCoordinate(tree.lng),
    status: mapTreeStatus(tree.status),
    ultimaMedicao: tree.ultimaMedicao ?? null,
  }
}

function mapTreeCluster(cluster: BackendMapTreeCluster): MapTreeCluster {
  return {
    lat: cluster.lat,
    lng: cluster.lng,
    count: cluster.count,
  }
}

function mapTreeDetail(tree: BackendMapTreeDetail): MapTreeDetail {
  return {
    id: tree.id,
    codigo: tree.codigo,
    nomeComum: tree.nomeComum?.trim() || tree.especie,
    especie: tree.especie,
    lat: toOptionalCoordinate(tree.lat),
    lng: toOptionalCoordinate(tree.lng),
    localizacao: {
      bairro: tree.bairro,
      rua: tree.rua,
      referencia: tree.referencia ?? undefined,
    },
    status: mapTreeStatus(tree.status),
    vigor: mapTreeVigor(tree.vigor),
    observacoes: tree.observacoes ?? undefined,
    currentRecord: tree.currentRecord ?? null,
    fotoUrl: tree.fotoUrl
      ? `${process.env.NEXT_PUBLIC_API_URL || ''}${tree.fotoUrl.replace(/^\/api/, '')}`
      : null,
  }
}

function getMapClient(options?: MapServiceOptions) {
  return options?.publicAccess ? publicMapApi : api
}

export async function listMapTrees(
  params: MapTreeQueryParams,
  options?: MapServiceOptions,
): Promise<MapTreesResult> {
  const { data } = await getMapClient(options).get<BackendMapTreesResponse>(
    API_ENDPOINTS.MAP_TREES,
    {
    params: {
      ...params,
      includeCut: params.includeCut ?? false,
    },
    },
  )

  return {
    mode: data.mode,
    totalInView: data.totalInView,
    items: data.items.map(mapTreePreview),
    clusters: data.clusters.map(mapTreeCluster),
  }
}

export async function getMapTreeDetail(
  treeId: string,
  options?: MapServiceOptions,
): Promise<MapTreeDetail> {
  const { data } = await getMapClient(options).get<BackendMapTreeDetail>(
    `${API_ENDPOINTS.MAP_TREES}/${treeId}/detail`,
  )

  return mapTreeDetail(data)
}
