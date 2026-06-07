"use client";

import { API_ENDPOINTS } from "@/constants/api";
import { api } from "@/services/api/api";
import { getManagedTree } from "@/services/trees/treeService";
import type {
  Tree,
  TreeApprovalRequest,
  TreeBaseIssue,
  TreeCanopyIssue,
  TreeConflicts,
  TreeFlowLevel,
  TreeManagement,
  TreeMeasurementRecord,
  TreePotentialTarget,
  TreeProblem,
  TreeRoadType,
  TreeRootAnchorage,
  TreeSensitiveTarget,
  TreeTrunkIssue,
  TreeTrunkLean,
} from "@/types/trees";

type BackendConflito = {
  fiacao?: string | null;
  calcada?: string | null;
  iluminacao?: string | null;
  edificacao?: string | null;
} | null;

type BackendManejo = {
  acoes?: string[] | null;
  prioridade?: string | null;
} | null;

type BackendArvoreResponse = {
  id: string;
  especie: string;
  bairro: string;
  rua: string;
  referencia?: string | null;
  alturaAtual: number;
  dapAtual: number;
  copaAtual: number;
  estadoGeral: string;
  vigor: string;
  problemasCopa: string[];
  problemasTronco: string[];
  problemasRaiz: string[];
  estruturaTronco: string;
  estruturaBase: string;
  estruturaCopa: string;
  inclinacao: string;
  ancoragem: string;
  fluxoPedestre: string;
  fluxoAutomovel: string;
  tipoVia: string;
  alvosPotenciais: string[];
  alvosSensiveis: string[];
  conflito?: BackendConflito;
  manejo?: BackendManejo;
  observacoes?: string | null;
} | null;

type BackendUsuarioResumo = {
  id?: string | null;
  nome?: string | null;
  email?: string | null;
} | null;

type BackendRegistroResponse = {
  id: string;
  pesquisador?: BackendUsuarioResumo;
  dataColeta: string;
  arvore?: BackendArvoreResponse;
  administradorResponsavel?: BackendUsuarioResumo;
  dataAnalise?: string | null;
  motivoRecusa?: string | null;
  status: string;
  alturaColetada: number;
  dapColetada: number;
  copaColetada: number;
  estadoGeral: string;
  vigor: string;
  problemasCopa: string[];
  problemasTronco: string[];
  problemasRaiz: string[];
  estruturaTronco: string;
  estruturaBase: string;
  estruturaCopa: string;
  inclinacaoTronco: string;
  ancoragem: string;
  fluxoPedestre: string;
  fluxoAutomovel: string;
  tipoVia: string;
  alvosPotenciais: string[];
  alvosSensiveis: string[];
  conflito?: BackendConflito;
  manejo?: BackendManejo;
  observacoes?: string | null;
};

function normalizeToken(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function toFrontendToken(value: string | null | undefined) {
  return normalizeToken(value).replaceAll("_", " ");
}

function buildTreeCode(id: string) {
  return `ARB-${id.slice(0, 8).toUpperCase()}`;
}

function mapTreeStatus(estadoGeral: string) {
  const normalized = normalizeToken(estadoGeral);

  if (normalized === "morta") {
    return "cortada" as const;
  }

  if (normalized === "regular" || normalized === "ruim") {
    return "injuria" as const;
  }

  return "saudavel" as const;
}

function mapApprovalStatus(status: string) {
  const normalized = normalizeToken(status);

  if (normalized === "pendente") {
    return "pendente" as const;
  }

  if (normalized === "recusado") {
    return "rejeitada" as const;
  }

  return "aprovada" as const;
}

function mapEstadoGeral(estadoGeral: string) {
  switch (normalizeToken(estadoGeral)) {
    case "otimo":
      return 1 as const;
    case "bom":
      return 2 as const;
    case "regular":
      return 3 as const;
    case "ruim":
      return 4 as const;
    case "morta":
      return 5 as const;
    default:
      return 3 as const;
  }
}

function extractProblems(record: {
  problemasCopa?: string[] | null;
  problemasTronco?: string[] | null;
  problemasRaiz?: string[] | null;
}) {
  const groups = [
    {
      position: "copa" as const,
      values: (record.problemasCopa ?? []).map(toFrontendToken).filter(Boolean),
    },
    {
      position: "tronco" as const,
      values: (record.problemasTronco ?? []).map(toFrontendToken).filter(Boolean),
    },
    {
      position: "raiz" as const,
      values: (record.problemasRaiz ?? []).map(toFrontendToken).filter(Boolean),
    },
  ];

  const firstGroupWithValues = groups.find((group) => group.values.length > 0);

  if (!firstGroupWithValues) {
    return {
      position: null,
      values: ["nenhum"],
    };
  }

  return {
    position: firstGroupWithValues.position,
    values: firstGroupWithValues.values,
  };
}

function mapConflitos(conflito?: BackendConflito) {
  return {
    fiacao:
      normalizeToken(conflito?.fiacao) === "ocorrido"
        ? "conflito"
        : toFrontendToken(conflito?.fiacao) || "ausente",
    calcada: toFrontendToken(conflito?.calcada) || "sem dano",
    iluminacao:
      normalizeToken(conflito?.iluminacao) === "sem_conflito"
        ? "sem"
        : toFrontendToken(conflito?.iluminacao) || "sem",
    edificacao:
      normalizeToken(conflito?.edificacao) === "ocorrido"
        ? "conflito"
        : toFrontendToken(conflito?.edificacao) || "sem",
  } as TreeConflicts;
}

function mapManejo(manejo?: BackendManejo) {
  return {
    acao: toFrontendToken(manejo?.acoes?.[0]) || "nenhuma",
    prioridade: toFrontendToken(manejo?.prioridade) || "baixa",
  } as TreeManagement;
}

function createApprovalRecord(
  record: BackendRegistroResponse,
  tree: Pick<Tree, "id" | "codigo" | "especie" | "nomeComum" | "lat" | "lng" | "localizacao">,
): TreeMeasurementRecord {
  const problems = extractProblems(record);

  return {
    id: record.id,
    treeId: tree.id,
    kind: record.arvore ? "measurement" : "initial",
    version: 1,
    status: mapTreeStatus(record.estadoGeral),
    localizacao: {
      bairro: tree.localizacao.bairro || "Nao informado",
      rua: tree.localizacao.rua || "Nao informado",
      dataColeta: record.dataColeta,
      equipe: "Nao informado",
      referencia: tree.localizacao.referencia ?? undefined,
    },
    dimensoes: {
      dapCm: record.dapColetada,
      alturaM: record.alturaColetada,
      copaM: record.copaColetada,
      medidaEstimada: false,
    },
    condicao: {
      estadoGeral: mapEstadoGeral(record.estadoGeral),
      vigor: toFrontendToken(record.vigor) as "alto" | "medio" | "baixo",
      problemas: problems.values as TreeProblem[],
      posicaoProblema: problems.position,
    },
    estruturaRisco: {
      tronco: record.problemasTronco?.length
        ? (record.problemasTronco.map(toFrontendToken) as TreeTrunkIssue[])
        : ([toFrontendToken(record.estruturaTronco)] as TreeTrunkIssue[]),
      baseColo: [toFrontendToken(record.estruturaBase) as TreeBaseIssue],
      copa: record.problemasCopa?.length
        ? (record.problemasCopa.map(toFrontendToken) as TreeCanopyIssue[])
        : ([toFrontendToken(record.estruturaCopa)] as TreeCanopyIssue[]),
      inclinacaoTronco: toFrontendToken(record.inclinacaoTronco) as TreeTrunkLean,
      ancoragemRadicular: toFrontendToken(record.ancoragem) as TreeRootAnchorage,
      alvosPotenciais: ((record.alvosPotenciais ?? []).map(
        toFrontendToken,
      ) as TreePotentialTarget[]),
      fluxoVeiculos: toFrontendToken(record.fluxoAutomovel) as TreeFlowLevel,
      fluxoPedestres: toFrontendToken(record.fluxoPedestre) as TreeFlowLevel,
      tipoVia:
        normalizeToken(record.tipoVia) === "central"
          ? ("comercial/central" as TreeRoadType)
          : (toFrontendToken(record.tipoVia) as TreeRoadType),
      alvosSensiveis: (record.alvosSensiveis ?? []).map((value) =>
        normalizeToken(value) === "area_lazer" ? "praca/area de lazer" : toFrontendToken(value),
      ) as TreeSensitiveTarget[],
    },
    conflitos: mapConflitos(record.conflito),
    manejo: mapManejo(record.manejo),
    registro: {
      aprovacao: mapApprovalStatus(record.status),
      fotos: [],
      motivoRejeicao: record.motivoRecusa ?? undefined,
      registradoEm: record.dataColeta,
      registradoPor: record.pesquisador?.nome ?? "Nao informado",
      ultimaMedicao: record.dataColeta,
      aprovadoEm: record.dataAnalise ?? undefined,
    },
    observacoes: record.observacoes ?? undefined,
  };
}

function buildFallbackTreeMeta(record: BackendRegistroResponse) {
  const syntheticId = `pending-tree-${record.id}`;

  return {
    id: syntheticId,
    codigo: buildTreeCode(record.id),
    especie: "Nao informado",
    nomeComum: "Nova Arvore Pendente",
    lat: null,
    lng: null,
    localizacao: {
      bairro: "Nao informado",
      rua: "Nao informado",
      dataColeta: record.dataColeta,
      equipe: "Nao informado",
      referencia: undefined,
    },
  };
}

async function hydrateTreeMeta(record: BackendRegistroResponse) {
  const treeId = record.arvore?.id;

  if (!treeId) {
    return buildFallbackTreeMeta(record);
  }

  try {
    const tree = await getManagedTree(treeId);

    return {
      id: tree.id,
      codigo: tree.codigo,
      especie: tree.especie,
      nomeComum: tree.nomeComum,
      lat: tree.lat,
      lng: tree.lng,
      localizacao: tree.localizacao,
    };
  } catch {
    return {
      id: treeId,
      codigo: buildTreeCode(treeId),
      especie: record.arvore?.especie ?? "Nao informado",
      nomeComum: record.arvore?.especie ?? "Arvore do Sistema",
      lat: null,
      lng: null,
      localizacao: {
        bairro: record.arvore?.bairro ?? "Nao informado",
        rua: record.arvore?.rua ?? "Nao informado",
        dataColeta: record.dataColeta,
        equipe: "Nao informado",
        referencia: record.arvore?.referencia ?? undefined,
      },
    };
  }
}

async function mapApprovalRequest(record: BackendRegistroResponse): Promise<TreeApprovalRequest> {
  const treeMeta = await hydrateTreeMeta(record);
  const type = record.arvore ? "create_record" : "create_tree";
  const approvalRecord = createApprovalRecord(record, treeMeta);

  return {
    id: record.id,
    type,
    status: mapApprovalStatus(record.status),
    submittedAt: record.dataColeta,
    submittedBy: record.pesquisador?.nome ?? "Nao informado",
    treeId: record.arvore?.id ?? undefined,
    treeMeta: {
      codigo: treeMeta.codigo,
      especie: treeMeta.especie,
      nomeComum: treeMeta.nomeComum,
      lat: treeMeta.lat,
      lng: treeMeta.lng,
    },
    record: approvalRecord,
    rejectionReason: record.motivoRecusa ?? undefined,
  };
}

export async function listPendingApprovalRequests() {
  const { data } = await api.get<BackendRegistroResponse[]>(
    `${API_ENDPOINTS.TREE_RECORDS}/status/PENDENTE`,
  );

  const requests = await Promise.all(data.map(mapApprovalRequest));
  return requests;
}

export async function approvePendingRecord(recordId: string) {
  const { data } = await api.put<BackendRegistroResponse>(
    `${API_ENDPOINTS.TREE_RECORDS}/${recordId}/aprovar`,
    {},
  );

  return data;
}

export async function rejectPendingRecord(recordId: string, reason: string) {
  const { data } = await api.put<BackendRegistroResponse>(
    `${API_ENDPOINTS.TREE_RECORDS}/${recordId}/recusar`,
    { motivoRecusa: reason },
  );

  return data;
}
