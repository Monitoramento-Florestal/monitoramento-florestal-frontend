import type { TreeRecordFormValues } from "@/utils/treeRecords";
import type {
  ExistingTreeRecordPayload,
  NewTreeRecordPayload,
} from "@/services/trees/treeService";

const VIGOR_MAP = {
  alto: "ALTO",
  medio: "MEDIO",
  baixo: "BAIXO",
} as const satisfies Record<string, string>;

const PROBLEMA_MAP = {
  pragas: "PRAGAS",
  fungos: "FUNGOS",
  podridao: "PODRIDAO",
  injuria: "INJURIA",
  nenhum: "NENHUM",
} as const satisfies Record<string, string>;

const ESTRUTURA_TRONCO_MAP = {
  "sem defeitos": "SEM_DEFEITOS",
  "fissuras longitudinais": "FISSURAS_LONGITUDINAIS",
  cavidades: "CAVIDADES",
  apodrecimento: "APODRECIMENTO",
  descascamento: "DESCACAMENTO",
} as const satisfies Record<string, string>;

const ESTRUTURA_BASE_MAP = {
  normal: "NORMAL",
  "raiz exposta": "RAIZ_EXPOSTA",
  "solo compactado": "SOLO_COMPACTADO",
  "levantamento de calcada": "LEVANTAMENTO_CALCADA",
  "inclinacao da base": "INCLINACAO_BASE",
} as const satisfies Record<string, string>;

const ESTRUTURA_COPA_MAP = {
  assimetrica: "ASSIMETRICA",
  "excesso de peso lateral": "EXCESSO_PESO_LATERAL",
  "galhos secos": "GALHOS_SECOS",
  "galhos codominantes": "GALHOS_CODOMINANTES",
} as const satisfies Record<string, string>;

const INCLINACAO_MAP = {
  ausente: "AUSENTE",
  leve: "LEVE",
  moderada: "MODERADA",
  critica: "CRITICA",
} as const satisfies Record<string, string>;

const ANCORAGEM_MAP = {
  estavel: "ESTAVEL",
  "parcialmente comprometida": "PARCIALMENTE_COMPROMETIDA",
  comprometida: "COMPROMETIDA",
} as const satisfies Record<string, string>;

const FLUXO_MAP = {
  baixo: "BAIXO",
  medio: "MEDIO",
  alto: "ALTO",
} as const satisfies Record<string, string>;

const TIPO_VIA_MAP = {
  residencial: "RESIDENCIAL",
  coletora: "COLETORA",
  arterial: "ARTERIAL",
  "comercial/central": "CENTRAL",
} as const satisfies Record<string, string>;

const ALVO_POTENCIAL_MAP = {
  pedestres: "PEDESTRES",
  veiculos: "VEICULOS",
  residencia: "RESIDENCIA",
  "equipamento publico": "EQUIPAMENTO_PUBLICO",
  "sem alvo relevante": "SEM_ALVO_RELEVANTE",
} as const satisfies Record<string, string>;

const ALVO_SENSIVEL_MAP = {
  escola: "ESCOLA",
  hospital: "HOSPITAL",
  "parada de onibus": "PARADA_ONIBUS",
  "praca/area de lazer": "AREA_LAZER",
  nenhum: "NENHUM",
} as const satisfies Record<string, string>;

const FIACAO_MAP = {
  ausente: "AUSENTE",
  potencial: "POTENCIAL",
  conflito: "OCORRIDO",
} as const satisfies Record<string, string>;

const CALCADA_MAP = {
  "sem dano": "SEM_DANO",
  leve: "LEVE",
  severo: "SEVERO",
} as const satisfies Record<string, string>;

const ILUMINACAO_MAP = {
  sem: "SEM_CONFLITO",
  parcial: "PARCIAL",
  bloqueio: "BLOQUEIO",
} as const satisfies Record<string, string>;

const EDIFICACAO_MAP = {
  sem: "AUSENTE",
  potencial: "POTENCIAL",
  conflito: "OCORRIDO",
} as const satisfies Record<string, string>;

const ACAO_MANEJO_MAP = {
  nenhuma: "NENHUMA",
  "poda leve": "PODA_LEVE",
  "poda conducao": "PODA_CONDUCAO",
  "poda pesada": "PODA_PESADA",
  "controle fitossanitario": "CONTROLE_FITOSSANITARIO",
  "ampliacao canteiro": "AMPLIACAO_CANTEIRO",
  substituicao: "SUBSTITUICAO",
  supressao: "SUPRESSAO",
} as const satisfies Record<string, string>;

const PRIORIDADE_MAP = {
  baixa: "BAIXA",
  media: "MEDIA",
  alta: "ALTA",
  emergencial: "EMERGENCIAL",
} as const satisfies Record<string, string>;

function mapFromRecord<T extends string>(
  field: string,
  value: string,
  mapping: Record<string, T>,
) {
  const mappedValue = mapping[value];

  if (!mappedValue) {
    throw new Error(`Valor invalido para ${field}: ${value}`);
  }

  return mappedValue;
}

function mapEstadoGeral(value: TreeRecordFormValues["estadoGeral"]) {
  switch (value) {
    case "1":
      return "OTIMO";
    case "2":
      return "BOM";
    case "3":
      return "REGULAR";
    case "4":
      return "RUIM";
    case "5":
      return "MORTA";
    default:
      return "REGULAR";
  }
}

function mapCollection(values: string[], mapper: (value: string) => string) {
  return values.filter(Boolean).map(mapper);
}

function buildProblemGroups(values: TreeRecordFormValues) {
  const selectedProblems = mapCollection(
    values.problemas.filter((value) => value !== "nenhum"),
    (value) => mapFromRecord("problema", value, PROBLEMA_MAP),
  );

  if (selectedProblems.length === 0 || !values.posicaoProblema) {
    return {
      problemasCopa: [],
      problemasTronco: [],
      problemasRaiz: [],
    };
  }

  if (values.posicaoProblema === "copa") {
    return {
      problemasCopa: selectedProblems,
      problemasTronco: [],
      problemasRaiz: [],
    };
  }

  if (values.posicaoProblema === "tronco") {
    return {
      problemasCopa: [],
      problemasTronco: selectedProblems,
      problemasRaiz: [],
    };
  }

  return {
    problemasCopa: [],
    problemasTronco: [],
    problemasRaiz: selectedProblems,
  };
}

function buildSharedPayload(values: TreeRecordFormValues) {
  const problemGroups = buildProblemGroups(values);

  return {
    alturaColetada: Number(values.alturaM),
    dapColetada: Number(values.dapCm),
    copaColetada: Number(values.copaM),
    estadoGeral: mapEstadoGeral(values.estadoGeral),
    vigor: mapFromRecord("vigor", values.vigor, VIGOR_MAP),
    problemasCopa: problemGroups.problemasCopa,
    problemasTronco: problemGroups.problemasTronco,
    problemasRaiz: problemGroups.problemasRaiz,
    estruturaTronco:
      mapCollection(values.tronco, (value) =>
        mapFromRecord("estrutura do tronco", value, ESTRUTURA_TRONCO_MAP),
      )[0] ?? "SEM_DEFEITOS",
    estruturaBase:
      mapCollection(values.baseColo, (value) =>
        mapFromRecord("estrutura da base", value, ESTRUTURA_BASE_MAP),
      )[0] ?? "NORMAL",
    estruturaCopa:
      mapCollection(values.copa, (value) =>
        mapFromRecord("estrutura da copa", value, ESTRUTURA_COPA_MAP),
      )[0] ?? "ASSIMETRICA",
    inclinacaoTronco: mapFromRecord(
      "inclinacao do tronco",
      values.inclinacaoTronco,
      INCLINACAO_MAP,
    ),
    ancoragem: mapFromRecord(
      "ancoragem radicular",
      values.ancoragemRadicular,
      ANCORAGEM_MAP,
    ),
    fluxoPedestre: mapFromRecord("fluxo de pedestres", values.fluxoPedestres, FLUXO_MAP),
    fluxoAutomovel: mapFromRecord("fluxo de veiculos", values.fluxoVeiculos, FLUXO_MAP),
    tipoVia: mapFromRecord("tipo de via", values.tipoVia, TIPO_VIA_MAP),
    alvosPotenciais: mapCollection(values.alvosPotenciais, (value) =>
      mapFromRecord("alvo potencial", value, ALVO_POTENCIAL_MAP),
    ),
    alvosSensiveis: mapCollection(values.alvosSensiveis, (value) =>
      mapFromRecord("alvo sensivel", value, ALVO_SENSIVEL_MAP),
    ),
    conflito: {
      fiacao: mapFromRecord("fiacao", values.fiacao, FIACAO_MAP),
      calcada: mapFromRecord("calcada", values.calcada, CALCADA_MAP),
      iluminacao: mapFromRecord("iluminacao", values.iluminacao, ILUMINACAO_MAP),
      edificacao: mapFromRecord("edificacao", values.edificacao, EDIFICACAO_MAP),
    },
    manejo: {
      acoes: [mapFromRecord("acao de manejo", values.manejoAcao, ACAO_MANEJO_MAP)],
      prioridade: mapFromRecord(
        "prioridade de manejo",
        values.manejoPrioridade,
        PRIORIDADE_MAP,
      ),
    },
    observacoes: values.observacoes.trim() || undefined,
  };
}

export function mapFormValuesToExistingTreeRecordPayload(
  treeId: string,
  values: TreeRecordFormValues,
): ExistingTreeRecordPayload {
  return {
    arvoreId: treeId,
    ...buildSharedPayload(values),
  };
}

export function mapFormValuesToNewTreeRecordPayload(
  values: TreeRecordFormValues,
): NewTreeRecordPayload {
  return {
    especie: values.especie.trim(),
    bairro: values.bairro.trim(),
    rua: values.rua.trim(),
    referencia: values.referencia.trim() || undefined,
    ...buildSharedPayload(values),
  };
}
