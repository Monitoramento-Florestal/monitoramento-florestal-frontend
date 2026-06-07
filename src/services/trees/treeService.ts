import { API_ENDPOINTS } from "@/constants/api";
import { api } from "@/services/api/api";
import type {
  Tree,
  TreeBaseIssue,
  TreeCanopyIssue,
  TreeConflicts,
  TreeFlowLevel,
  TreeManagement,
  TreeMeasurementRecord,
  TreePotentialTarget,
  TreePreview,
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
};

type BackendUsuarioResumo = {
  id?: string | null;
  nome?: string | null;
  email?: string | null;
};

type BackendRegistroResponse = {
  id: string;
  pesquisador?: BackendUsuarioResumo | null;
  dataColeta: string;
  arvore?: BackendArvoreResponse | null;
  administradorResponsavel?: BackendUsuarioResumo | null;
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

export interface ExistingTreeRecordPayload {
  arvoreId: string;
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

export interface NewTreeRecordPayload
  extends Omit<ExistingTreeRecordPayload, "arvoreId"> {
  especie: string;
  bairro: string;
  rua: string;
  referencia?: string;
}

function buildTreeCode(id: string) {
  return `ARB-${id.slice(0, 8).toUpperCase()}`;
}

function normalizeToken(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function toFrontendToken(value: string | null | undefined) {
  return normalizeToken(value).replaceAll("_", " ");
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

function toOptionalCoordinate() {
  return null;
}

function createTreePreview(tree: BackendArvoreResponse): TreePreview {
  return {
    id: tree.id,
    codigo: buildTreeCode(tree.id),
    especie: tree.especie,
    nomeComum: tree.especie,
    status: mapTreeStatus(tree.estadoGeral),
    lat: toOptionalCoordinate(),
    lng: toOptionalCoordinate(),
    localizacao: {
      bairro: tree.bairro,
      rua: tree.rua,
    },
    dimensoes: {
      alturaM: tree.alturaAtual,
      dapCm: tree.dapAtual,
      copaM: tree.copaAtual,
    },
    registro: {
      aprovacao: "aprovada",
      ultimaMedicao: "",
    },
  };
}

function createTreeRecord(
  record: BackendRegistroResponse,
  tree: BackendArvoreResponse,
  version: number,
  kind: "initial" | "measurement",
): TreeMeasurementRecord {
  const problems = extractProblems(record);

  return {
    id: record.id,
    treeId: tree.id,
    kind,
    version,
    status: mapTreeStatus(record.estadoGeral),
    localizacao: {
      bairro: tree.bairro,
      rua: tree.rua,
      dataColeta: record.dataColeta,
      equipe: "Não informado",
      referencia: tree.referencia ?? undefined,
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
      alvosPotenciais: (record.alvosPotenciais ?? []).map(
        toFrontendToken,
      ) as TreePotentialTarget[],
      fluxoVeiculos: toFrontendToken(record.fluxoAutomovel) as TreeFlowLevel,
      fluxoPedestres: toFrontendToken(record.fluxoPedestre) as TreeFlowLevel,
      tipoVia:
        normalizeToken(record.tipoVia) === "central"
          ? ("comercial/central" as TreeRoadType)
          : (toFrontendToken(record.tipoVia) as TreeRoadType),
      alvosSensiveis: (record.alvosSensiveis ?? []).map((value) =>
        normalizeToken(value) === "area_lazer"
          ? "praca/area de lazer"
          : toFrontendToken(value),
      ) as TreeSensitiveTarget[],
    },
    conflitos: mapConflitos(record.conflito),
    manejo: mapManejo(record.manejo),
    registro: {
      aprovacao: mapApprovalStatus(record.status),
      fotos: [],
      motivoRejeicao: record.motivoRecusa ?? undefined,
      registradoEm: record.dataColeta,
      registradoPor: record.pesquisador?.nome ?? "Não informado",
      ultimaMedicao: record.dataColeta,
      aprovadoEm: record.dataAnalise ?? undefined,
    },
    observacoes: record.observacoes ?? undefined,
  };
}

function createManagedTree(
  tree: BackendArvoreResponse,
  records: BackendRegistroResponse[],
): Tree {
  const orderedRecords = records
    .slice()
    .sort(
      (left, right) =>
        new Date(left.dataColeta).getTime() - new Date(right.dataColeta).getTime(),
    )
    .map((record, index) =>
      createTreeRecord(
        record,
        record.arvore ?? tree,
        index + 1,
        index === 0 ? "initial" : "measurement",
      ),
    );

  const latestRecord = orderedRecords[orderedRecords.length - 1];
  const latestProblems = extractProblems(tree);

  return {
    id: tree.id,
    codigo: buildTreeCode(tree.id),
    especie: tree.especie,
    nomeComum: tree.especie,
    status: mapTreeStatus(tree.estadoGeral),
    lat: toOptionalCoordinate(),
    lng: toOptionalCoordinate(),
    localizacao: {
      bairro: tree.bairro,
      rua: tree.rua,
      dataColeta: latestRecord?.localizacao.dataColeta ?? "",
      equipe: latestRecord?.localizacao.equipe ?? "Não informado",
      referencia: tree.referencia ?? undefined,
    },
    dimensoes: latestRecord?.dimensoes ?? {
      dapCm: tree.dapAtual,
      alturaM: tree.alturaAtual,
      copaM: tree.copaAtual,
      medidaEstimada: false,
    },
    condicao: latestRecord?.condicao ?? {
      estadoGeral: mapEstadoGeral(tree.estadoGeral),
      vigor: toFrontendToken(tree.vigor) as "alto" | "medio" | "baixo",
      problemas: latestProblems.values as TreeProblem[],
      posicaoProblema: latestProblems.position,
    },
    estruturaRisco: latestRecord?.estruturaRisco ?? {
      tronco: [toFrontendToken(tree.estruturaTronco) as TreeTrunkIssue],
      baseColo: [toFrontendToken(tree.estruturaBase) as TreeBaseIssue],
      copa: [toFrontendToken(tree.estruturaCopa) as TreeCanopyIssue],
      inclinacaoTronco: toFrontendToken(tree.inclinacao) as TreeTrunkLean,
      ancoragemRadicular: toFrontendToken(tree.ancoragem) as TreeRootAnchorage,
      alvosPotenciais: (tree.alvosPotenciais ?? []).map(
        toFrontendToken,
      ) as TreePotentialTarget[],
      fluxoVeiculos: toFrontendToken(tree.fluxoAutomovel) as TreeFlowLevel,
      fluxoPedestres: toFrontendToken(tree.fluxoPedestre) as TreeFlowLevel,
      tipoVia:
        normalizeToken(tree.tipoVia) === "central"
          ? ("comercial/central" as TreeRoadType)
          : (toFrontendToken(tree.tipoVia) as TreeRoadType),
      alvosSensiveis: (tree.alvosSensiveis ?? []).map((value) =>
        normalizeToken(value) === "area_lazer"
          ? "praca/area de lazer"
          : toFrontendToken(value),
      ) as TreeSensitiveTarget[],
    },
    conflitos: latestRecord?.conflitos ?? mapConflitos(tree.conflito),
    manejo: latestRecord?.manejo ?? mapManejo(tree.manejo),
    registro: latestRecord?.registro ?? {
      aprovacao: "aprovada",
      fotos: [],
      registradoEm: "",
      registradoPor: "Não informado",
      ultimaMedicao: "",
    },
    records: orderedRecords,
    observacoes: latestRecord?.observacoes ?? tree.observacoes ?? undefined,
  };
}

export async function listManagedTrees() {
  const { data } = await api.get<BackendArvoreResponse[]>(API_ENDPOINTS.TREES);
  return data.map(createTreePreview);
}

export async function getManagedTree(treeId: string) {
  const [treeResponse, recordsResponse] = await Promise.all([
    api.get<BackendArvoreResponse>(`${API_ENDPOINTS.TREES}/${treeId}`),
    api.get<BackendRegistroResponse[]>(`${API_ENDPOINTS.TREE_RECORDS}/arvore/${treeId}`),
  ]);

  return createManagedTree(treeResponse.data, recordsResponse.data);
}

export async function createExistingTreeRecord(payload: ExistingTreeRecordPayload) {
  const { data } = await api.post<BackendRegistroResponse>(
    API_ENDPOINTS.TREE_RECORDS,
    payload,
  );

  return data;
}

export async function createNewTreeRecord(payload: NewTreeRecordPayload) {
  const { data } = await api.post(
    API_ENDPOINTS.TREE_RECORDS_NEW_TREE,
    payload,
  );

  return data;
}

export async function deleteTreeRecord(recordId: string) {
  await api.delete(`${API_ENDPOINTS.TREE_RECORDS}/${recordId}`)
}
