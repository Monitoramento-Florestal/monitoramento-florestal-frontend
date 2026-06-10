"use client";

import { API_ENDPOINTS } from "@/constants/api";
import { getStoredUser } from "@/services/storage/userStorage";
import { api } from "@/services/api/api";
import { getManagedTree } from "@/services/trees/treeService";
import type {
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
  TreeApprovalRequest,
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

type BackendPropostaArvore = {
  nomeComum?: string | null;
  especie: string;
  bairro: string;
  rua: string;
  referencia?: string | null;
  lat?: number | null;
  lng?: number | null;
} | null;

type BackendPropostaRegistro = {
  alturaColetada: number;
  dapColetada: number;
  copaColetada: number;
  estadoGeral: string;
  vigor: string;
  problemasCopa?: string[] | null;
  problemasTronco?: string[] | null;
  problemasRaiz?: string[] | null;
  estruturaTronco: string;
  estruturaBase: string;
  estruturaCopa: string;
  inclinacao?: string | null;
  ancoragem: string;
  fluxoPedestre: string;
  fluxoAutomovel: string;
  tipoVia: string;
  alvosPotenciais?: string[] | null;
  alvosSensiveis?: string[] | null;
  conflito?: BackendConflito;
  manejo?: BackendManejo;
  observacoes?: string | null;
};

type BackendApprovalListItem = {
  id: string;
  tipo: string;
  status: string;
  pesquisadorId: string;
  dataSubmissao: string;
};

type BackendApprovalDetail = {
  id: string;
  tipo: string;
  status: string;
  pesquisadorId: string;
  revisorId?: string | null;
  dataSubmissao: string;
  dataRevisao?: string | null;
  motivoRecusa?: string | null;
  arvoreId?: string | null;
  registroId?: string | null;
  propostaArvore?: BackendPropostaArvore;
  propostaRegistro: BackendPropostaRegistro;
};

type BackendApprovalActionResponse = {
  solicitacaoId: string;
  status: string;
  mensagem: string;
};

type HydratedTreeMeta = {
  id?: string;
  codigo: string;
  especie: string;
  nomeComum: string;
  lat: number | null;
  lng: number | null;
  localizacao: {
    bairro: string;
    rua: string;
    referencia?: string;
  };
};

export interface ApprovalRequestRecordPayload {
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
  inclinacao: string;
  ancoragem: string;
  fluxoPedestre: string;
  fluxoAutomovel: string;
  tipoVia: string;
  alvosPotenciais: string[];
  alvosSensiveis: string[];
  conflito: {
    fiacao: string;
    calcada: string;
    iluminacao: string;
    edificacao: string;
  };
  manejo: {
    acoes: string[];
    prioridade: string;
  };
  observacoes?: string;
}

export interface CreateTreeApprovalPayload {
  propostaArvore: {
    nomeComum?: string;
    especie: string;
    bairro: string;
    rua: string;
    referencia?: string;
    lat?: number;
    lng?: number;
  };
  propostaRegistro: ApprovalRequestRecordPayload;
}

export interface CreateRecordApprovalPayload {
  arvoreId: string;
  propostaRegistro: ApprovalRequestRecordPayload;
}

function normalizeToken(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function toFrontendToken(value: string | null | undefined) {
  return normalizeToken(value).replaceAll("_", " ");
}

function toOptionalCoordinate(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function buildDraftCode(id: string) {
  return `SOL-${id.slice(0, 8).toUpperCase()}`;
}

function buildTreeCode(id: string) {
  return `ARB-${id.slice(0, 8).toUpperCase()}`;
}

function mapRequestType(type: string) {
  const normalized = normalizeToken(type);

  if (normalized === "criacao_registro") {
    return "create_record" as const;
  }

  if (normalized === "edicao_registro") {
    return "edit_record" as const;
  }

  return "create_tree" as const;
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

function formatUserFallback(userId: string) {
  const storedUser = getStoredUser();

  if (storedUser?.id === userId) {
    return storedUser.nome;
  }

  return `Usuário ${userId.slice(0, 8)}`;
}

function createTreeMetaFromDraft(
  draft: BackendPropostaArvore | undefined,
  requestId: string,
): HydratedTreeMeta {
  return {
    codigo: buildDraftCode(requestId),
    especie: draft?.especie?.trim() || "Não informada",
    nomeComum: draft?.nomeComum?.trim() || draft?.especie?.trim() || "",
    lat: toOptionalCoordinate(draft?.lat),
    lng: toOptionalCoordinate(draft?.lng),
    localizacao: {
      bairro: draft?.bairro?.trim() || "Não informado",
      rua: draft?.rua?.trim() || "Não informado",
      referencia: draft?.referencia?.trim() || undefined,
    },
  };
}

async function hydrateTreeMeta(
  detail: BackendApprovalDetail,
): Promise<HydratedTreeMeta> {
  if (detail.arvoreId) {
    try {
      const tree = await getManagedTree(detail.arvoreId);

      return {
        id: tree.id,
        codigo: tree.codigo,
        especie: tree.especie,
        nomeComum: tree.nomeComum,
        lat: tree.lat,
        lng: tree.lng,
        localizacao: {
          bairro: tree.localizacao.bairro,
          rua: tree.localizacao.rua,
          referencia: tree.localizacao.referencia,
        },
      };
    } catch {
      if (detail.propostaArvore) {
        return {
          ...createTreeMetaFromDraft(detail.propostaArvore, detail.id),
          id: detail.arvoreId,
          codigo: buildTreeCode(detail.arvoreId),
        };
      }

      return {
        id: detail.arvoreId,
        codigo: buildTreeCode(detail.arvoreId),
        especie: "Não informada",
        nomeComum: "",
        lat: null,
        lng: null,
        localizacao: {
          bairro: "Não informado",
          rua: "Não informado",
        },
      };
    }
  }

  return createTreeMetaFromDraft(detail.propostaArvore, detail.id);
}

function createApprovalRecord(
  detail: BackendApprovalDetail,
  treeMeta: HydratedTreeMeta,
): TreeMeasurementRecord {
  const problems = extractProblems(detail.propostaRegistro);
  const fallbackTreeId = detail.arvoreId ?? `approval-request-${detail.id}`;

  return {
    id: detail.registroId ?? detail.id,
    treeId: treeMeta.id ?? fallbackTreeId,
    kind: detail.arvoreId ? "measurement" : "initial",
    version: 1,
    status: mapTreeStatus(detail.propostaRegistro.estadoGeral),
    localizacao: {
      bairro: detail.propostaArvore?.bairro?.trim() || treeMeta.localizacao.bairro,
      rua: detail.propostaArvore?.rua?.trim() || treeMeta.localizacao.rua,
      dataColeta: detail.dataSubmissao,
      equipe: "Não informado",
      referencia:
        detail.propostaArvore?.referencia?.trim() ||
        treeMeta.localizacao.referencia ||
        undefined,
    },
    dimensoes: {
      dapCm: detail.propostaRegistro.dapColetada,
      alturaM: detail.propostaRegistro.alturaColetada,
      copaM: detail.propostaRegistro.copaColetada,
      medidaEstimada: false,
    },
    condicao: {
      estadoGeral: mapEstadoGeral(detail.propostaRegistro.estadoGeral),
      vigor: toFrontendToken(detail.propostaRegistro.vigor) as
        | "alto"
        | "medio"
        | "baixo",
      problemas: problems.values as TreeProblem[],
      posicaoProblema: problems.position,
    },
    estruturaRisco: {
      tronco: detail.propostaRegistro.problemasTronco?.length
        ? (detail.propostaRegistro.problemasTronco.map(toFrontendToken) as TreeTrunkIssue[])
        : ([toFrontendToken(detail.propostaRegistro.estruturaTronco)] as TreeTrunkIssue[]),
      baseColo: [toFrontendToken(detail.propostaRegistro.estruturaBase) as TreeBaseIssue],
      copa: detail.propostaRegistro.problemasCopa?.length
        ? (detail.propostaRegistro.problemasCopa.map(toFrontendToken) as TreeCanopyIssue[])
        : ([toFrontendToken(detail.propostaRegistro.estruturaCopa)] as TreeCanopyIssue[]),
      inclinacaoTronco: toFrontendToken(
        detail.propostaRegistro.inclinacao ?? "ausente",
      ) as TreeTrunkLean,
      ancoragemRadicular: toFrontendToken(
        detail.propostaRegistro.ancoragem,
      ) as TreeRootAnchorage,
      alvosPotenciais: ((detail.propostaRegistro.alvosPotenciais ?? []).map(
        toFrontendToken,
      ) as TreePotentialTarget[]),
      fluxoVeiculos: toFrontendToken(detail.propostaRegistro.fluxoAutomovel) as TreeFlowLevel,
      fluxoPedestres: toFrontendToken(detail.propostaRegistro.fluxoPedestre) as TreeFlowLevel,
      tipoVia:
        normalizeToken(detail.propostaRegistro.tipoVia) === "central"
          ? ("comercial/central" as TreeRoadType)
          : (toFrontendToken(detail.propostaRegistro.tipoVia) as TreeRoadType),
      alvosSensiveis: (detail.propostaRegistro.alvosSensiveis ?? []).map((value) =>
        normalizeToken(value) === "area_lazer" ? "praca/area de lazer" : toFrontendToken(value),
      ) as TreeSensitiveTarget[],
    },
    conflitos: mapConflitos(detail.propostaRegistro.conflito),
    manejo: mapManejo(detail.propostaRegistro.manejo),
    registro: {
      aprovacao: mapApprovalStatus(detail.status),
      fotos: [],
      motivoRejeicao: detail.motivoRecusa ?? undefined,
      registradoEm: detail.dataSubmissao,
      registradoPor: formatUserFallback(detail.pesquisadorId),
      ultimaMedicao: detail.dataSubmissao,
      aprovadoEm: detail.dataRevisao ?? undefined,
    },
    observacoes: detail.propostaRegistro.observacoes ?? undefined,
  };
}

async function mapApprovalRequest(
  listItem: BackendApprovalListItem,
): Promise<TreeApprovalRequest> {
  const { data: detail } = await api.get<BackendApprovalDetail>(
    `${API_ENDPOINTS.APPROVAL_REQUESTS}/${listItem.id}`,
  );
  const treeMeta = await hydrateTreeMeta(detail);
  const type = mapRequestType(detail.tipo);

  return {
    id: detail.id,
    type,
    status: mapApprovalStatus(detail.status),
    submittedAt: detail.dataSubmissao,
    submittedBy: formatUserFallback(detail.pesquisadorId),
    targetRecordId: detail.registroId ?? undefined,
    treeId: detail.arvoreId ?? undefined,
    treeMeta: {
      codigo: treeMeta.codigo,
      especie: treeMeta.especie,
      nomeComum: treeMeta.nomeComum,
      lat: treeMeta.lat,
      lng: treeMeta.lng,
    },
    treeDraft: detail.propostaArvore
      ? {
          codigo: buildDraftCode(detail.id),
          especie: detail.propostaArvore.especie,
          nomeComum:
            detail.propostaArvore.nomeComum?.trim() ||
            detail.propostaArvore.especie,
          lat: toOptionalCoordinate(detail.propostaArvore.lat),
          lng: toOptionalCoordinate(detail.propostaArvore.lng),
        }
      : undefined,
    record: createApprovalRecord(detail, treeMeta),
    rejectionReason: detail.motivoRecusa ?? undefined,
  };
}

async function listApprovalRequests(params?: {
  pesquisadorId?: string;
  status?: string;
}) {
  const { data } = await api.get<BackendApprovalListItem[]>(
    API_ENDPOINTS.APPROVAL_REQUESTS,
    {
      params,
    },
  );

  return Promise.all(data.map(mapApprovalRequest));
}

export async function listPendingApprovalRequests() {
  return listApprovalRequests({ status: "PENDENTE" });
}

export async function listMyApprovalRequests() {
  return listApprovalRequests();
}

export async function createTreeApprovalRequest(
  payload: CreateTreeApprovalPayload,
) {
  const { data } = await api.post<string>(
    API_ENDPOINTS.APPROVAL_REQUESTS_CREATE_TREE,
    payload,
  );

  return data;
}

export async function createRecordApprovalRequest(
  payload: CreateRecordApprovalPayload,
) {
  const { data } = await api.post<string>(
    API_ENDPOINTS.APPROVAL_REQUESTS_CREATE_RECORD,
    payload,
  );

  return data;
}

export async function approvePendingRecord(recordId: string) {
  const { data } = await api.post<BackendApprovalActionResponse>(
    `${API_ENDPOINTS.APPROVAL_REQUESTS}/${recordId}/aprovar`,
    {},
  );

  return data;
}

export async function rejectPendingRecord(recordId: string, reason: string) {
  const { data } = await api.post<BackendApprovalActionResponse>(
    `${API_ENDPOINTS.APPROVAL_REQUESTS}/${recordId}/rejeitar`,
    { motivoRecusa: reason },
  );

  return data;
}
