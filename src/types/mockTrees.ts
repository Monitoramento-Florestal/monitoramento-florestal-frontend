import { UserRole } from "@/constants/roles";
import type { User } from "./auth";
import type {
  Tree,
  TreeApprovalRequest,
  TreeBaseIssue,
  TreeCanopyIssue,
  TreeFlowLevel,
  TreeManagementAction,
  TreeManagementPriority,
  TreeMeasurementRecord,
  TreePotentialTarget,
  TreePreview,
  TreeProblem,
  TreeProblemPosition,
  TreeRootAnchorage,
  TreeRoadType,
  TreeSensitiveTarget,
  TreeStatus,
  TreeTrunkIssue,
  TreeTrunkLean,
  TreeVigor,
} from "./trees";

const TREE_COUNT = 24;
const CENTER = { lat: -8.0175, lng: -34.9447 };

const especies: Array<[string, string]> = [
  ["Tabebuia aurea", "Ipê-amarelo"],
  ["Handroanthus impetiginosus", "Ipê-roxo"],
  ["Caesalpinia echinata", "Pau-brasil"],
  ["Anacardium occidentale", "Cajueiro"],
  ["Mangifera indica", "Mangueira"],
  ["Cocos nucifera", "Coqueiro"],
  ["Licania tomentosa", "Oiti"],
  ["Clitoria fairchildiana", "Sombreiro"],
  ["Ficus benjamina", "Ficus"],
  ["Terminalia catappa", "Castanhola"],
  ["Spondias mombin", "Cajá"],
  ["Bauhinia forficata", "Pata-de-vaca"],
];

const bairros = ["Dois Irmãos", "Vila Acadêmica", "Cidade Universitária"];
const ruas = [
  "Rua do Horto",
  "Avenida da Botânica",
  "Rua dos Coqueiros",
  "Alameda Central",
  "Rua do Colégio Agrícola",
];
const equipes = ["Equipe Arbor 1", "Equipe Arbor 2", "Equipe Arbor 3"];
const pesquisadores = [
  "Dra. Helena Cavalcanti",
  "Prof. Ricardo Mendes",
  "Ana Beatriz Lima",
  "Pedro Soares",
];

const problemasPorStatus: Record<TreeStatus, TreeProblem[]> = {
  saudavel: ["nenhum"],
  injuria: ["injuria", "fungos"],
  cortada: ["podridao", "injuria"],
};

const posicoesProblema: TreeProblemPosition[] = ["tronco", "raiz", "copa"];
const vigores: TreeVigor[] = ["alto", "medio", "baixo"];
const troncoIssues: TreeTrunkIssue[] = [
  "sem defeitos",
  "fissuras longitudinais",
  "cavidades",
  "apodrecimento",
  "descascamento",
];
const baseIssues: TreeBaseIssue[] = [
  "normal",
  "raiz exposta",
  "solo compactado",
  "levantamento de calcada",
  "inclinacao da base",
];
const copaIssues: TreeCanopyIssue[] = [
  "assimetrica",
  "excesso de peso lateral",
  "galhos secos",
  "galhos codominantes",
];
const inclinacoes: TreeTrunkLean[] = ["ausente", "leve", "moderada", "critica"];
const ancoragens: TreeRootAnchorage[] = [
  "estavel",
  "parcialmente comprometida",
  "comprometida",
];
const alvos: TreePotentialTarget[] = [
  "pedestres",
  "veiculos",
  "residencia",
  "equipamento publico",
  "sem alvo relevante",
];
const fluxos: TreeFlowLevel[] = ["baixo", "medio", "alto"];
const tiposVia: TreeRoadType[] = [
  "residencial",
  "coletora",
  "arterial",
  "comercial/central",
];
const alvosSensiveis: TreeSensitiveTarget[] = [
  "escola",
  "hospital",
  "parada de onibus",
  "praca/area de lazer",
  "nenhum",
];
const acoesManejo: TreeManagementAction[] = [
  "nenhuma",
  "poda leve",
  "poda conducao",
  "poda pesada",
  "controle fitossanitario",
  "ampliacao canteiro",
  "substituicao",
  "supressao",
];
const prioridades: TreeManagementPriority[] = ["baixa", "media", "alta", "emergencial"];

function rand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pick<T>(values: T[], seed: number) {
  return values[Math.floor(rand(seed) * values.length)];
}

function pickSome<T>(values: T[], seed: number, count: number) {
  const items: T[] = [];

  for (let i = 0; i < count; i += 1) {
    items.push(values[(Math.floor(rand(seed + i) * values.length) + i) % values.length]);
  }

  return Array.from(new Set(items));
}

function getTreeId(index: number) {
  return `tree-${String(index).padStart(3, "0")}`;
}

function getTreeIndexFromId(treeId: string) {
  const match = /^tree-(\d{3})$/.exec(treeId);

  if (!match) {
    return null;
  }

  const index = Number(match[1]);
  return index >= 1 && index <= TREE_COUNT ? index : null;
}

function getTreeSeed(index: number) {
  const r1 = rand(index * 1.7);
  const r2 = rand(index * 2.3);
  const r3 = rand(index * 3.1);
  const especie = especies[index % especies.length];
  const cluster = index % 5;
  const offsetLat = (cluster - 2) * 0.0015;
  const offsetLng = (cluster - 2) * 0.0012;
  const lat = CENTER.lat + offsetLat + (r1 - 0.5) * 0.006;
  const lng = CENTER.lng + offsetLng + (r2 - 0.5) * 0.006;
  const status: TreeStatus = r3 < 0.65 ? "saudavel" : r3 < 0.9 ? "injuria" : "cortada";

  return {
    codigo: `UFRPE-${String(1000 + index)}`,
    especie: especie[0],
    lat,
    lng,
    nomeComum: especie[1],
    status,
    treeId: getTreeId(index),
  };
}

function cloneRecord(record: TreeMeasurementRecord): TreeMeasurementRecord {
  return {
    ...record,
    localizacao: { ...record.localizacao },
    dimensoes: { ...record.dimensoes },
    condicao: {
      ...record.condicao,
      problemas: [...record.condicao.problemas],
    },
    estruturaRisco: {
      ...record.estruturaRisco,
      tronco: [...record.estruturaRisco.tronco],
      baseColo: [...record.estruturaRisco.baseColo],
      copa: [...record.estruturaRisco.copa],
      alvosPotenciais: [...record.estruturaRisco.alvosPotenciais],
      alvosSensiveis: [...record.estruturaRisco.alvosSensiveis],
    },
    conflitos: { ...record.conflitos },
    manejo: { ...record.manejo },
    registro: {
      ...record.registro,
      fotos: [...record.registro.fotos],
    },
  };
}

function makeCurrentRecord(index: number): TreeMeasurementRecord {
  const { treeId, status } = getTreeSeed(index);
  const r1 = rand(index * 1.7);
  const r2 = rand(index * 2.3);
  const r3 = rand(index * 3.1);
  const r4 = rand(index * 4.7);
  const coleta = new Date();
  coleta.setDate(coleta.getDate() - Math.floor(r1 * 180));

  const registro = new Date();
  registro.setDate(registro.getDate() - (Math.floor(r1 * 180) + Math.floor(r2 * 30)));

  const problemas = problemasPorStatus[status];
  const semProblema = problemas.includes("nenhum");
  const estadoGeral = status === "saudavel" ? 2 : status === "injuria" ? 3 : 5;
  const photosCount = r2 > 0.55 ? 1 + Math.floor(r3 * 3) : 0;
  const fotos = Array.from({ length: photosCount }, () => "/image.png");

  return {
    id: `${treeId}-record-current`,
    treeId,
    kind: "measurement",
    version: 1,
    status,
    localizacao: {
      bairro: pick(bairros, index * 5.1),
      rua: pick(ruas, index * 5.9),
      dataColeta: coleta.toISOString(),
      equipe: pick(equipes, index * 6.7),
      numeroResidencia: String(10 + (index % 80)),
      referencia: "Próximo ao acesso principal do campus",
    },
    dimensoes: {
      alturaM: Math.round((4 + r1 * 18) * 10) / 10,
      dapCm: Math.round((10 + r2 * 80) * 10) / 10,
      copaM: Math.round((2 + r3 * 9) * 10) / 10,
      medidaEstimada: r4 > 0.78,
    },
    condicao: {
      estadoGeral,
      vigor: status === "saudavel" ? "alto" : pick(vigores, index * 7.3),
      problemas,
      posicaoProblema: semProblema ? null : pick(posicoesProblema, index * 7.9),
    },
    estruturaRisco: {
      tronco: status === "saudavel" ? ["sem defeitos"] : pickSome(troncoIssues, index * 8.3, 2),
      baseColo: status === "saudavel" ? ["normal"] : pickSome(baseIssues, index * 8.9, 2),
      copa: status === "saudavel" ? ["assimetrica"] : pickSome(copaIssues, index * 9.7, 2),
      inclinacaoTronco: status === "cortada" ? "critica" : pick(inclinacoes, index * 10.1),
      ancoragemRadicular: status === "cortada" ? "comprometida" : pick(ancoragens, index * 10.7),
      alvosPotenciais: pickSome(alvos, index * 11.3, 2),
      fluxoVeiculos: pick(fluxos, index * 11.9),
      fluxoPedestres: pick(fluxos, index * 12.7),
      tipoVia: pick(tiposVia, index * 13.1),
      alvosSensiveis: pickSome(alvosSensiveis, index * 13.9, 2),
    },
    conflitos: {
      fiacao: status === "cortada" ? "conflito" : r1 > 0.6 ? "potencial" : "ausente",
      calcada: status === "saudavel" ? "sem dano" : r2 > 0.65 ? "severo" : "leve",
      iluminacao: r3 > 0.7 ? "bloqueio" : r3 > 0.35 ? "parcial" : "sem",
      edificacao: r4 > 0.65 ? "potencial" : "sem",
    },
    manejo: {
      acao:
        status === "saudavel"
          ? "nenhuma"
          : status === "injuria"
            ? pick(acoesManejo.slice(1, 6), index * 14.3)
            : pick(acoesManejo.slice(5), index * 14.9),
      prioridade:
        status === "saudavel"
          ? "baixa"
          : status === "injuria"
            ? pick(prioridades.slice(1, 3), index * 15.1)
            : pick(prioridades.slice(2), index * 15.7),
    },
    registro: {
      aprovacao: "aprovada",
      fotos,
      registradoEm: registro.toISOString(),
      registradoPor: pesquisadores[index % pesquisadores.length],
      ultimaMedicao: coleta.toISOString(),
      aprovadoEm: registro.toISOString(),
    },
    observacoes:
      status === "saudavel"
        ? "Exemplar estável, sem necessidade imediata de intervenção."
        : status === "injuria"
          ? "Recomenda-se monitoramento de rotina e avaliação de poda."
          : "Árvore classificada para substituição por risco estrutural.",
  };
}

function createRecordHistory(index: number, currentRecord: TreeMeasurementRecord) {
  const records: TreeMeasurementRecord[] = [];
  const totalRecords = 2 + Math.floor(rand(index * 2.1) * 3);

  for (let version = 1; version <= totalRecords; version += 1) {
    const record = cloneRecord(currentRecord);
    const offsetDays = (totalRecords - version) * 90;
    const collectedAt = new Date(currentRecord.registro.ultimaMedicao);
    collectedAt.setDate(collectedAt.getDate() - offsetDays);
    const submittedAt = new Date(collectedAt);
    submittedAt.setDate(submittedAt.getDate() + 2);
    const dimensionVariance = version === totalRecords ? 0 : totalRecords - version;

    record.id = `${currentRecord.treeId}-record-${version}`;
    record.kind = version === 1 ? "initial" : "measurement";
    record.version = version;
    record.dimensoes.alturaM = Math.max(2, Number((record.dimensoes.alturaM - dimensionVariance * 0.3).toFixed(1)));
    record.dimensoes.dapCm = Math.max(4, Number((record.dimensoes.dapCm - dimensionVariance * 1.1).toFixed(1)));
    record.dimensoes.copaM = Math.max(1, Number((record.dimensoes.copaM - dimensionVariance * 0.2).toFixed(1)));
    record.localizacao.dataColeta = collectedAt.toISOString();
    record.registro.registradoEm = submittedAt.toISOString();
    record.registro.ultimaMedicao = collectedAt.toISOString();
    record.registro.aprovacao = "aprovada";
    record.registro.aprovadoEm = submittedAt.toISOString();
    record.registro.registradoPor = pesquisadores[(index + version - 1) % pesquisadores.length];
    record.registro.motivoRejeicao = undefined;
    records.push(record);
  }

  return records;
}

function buildTree(index: number): Tree {
  const seed = getTreeSeed(index);
  const currentRecord = makeCurrentRecord(index);
  const records = createRecordHistory(index, currentRecord);
  const latestRecord = records[records.length - 1];

  return {
    id: seed.treeId,
    codigo: seed.codigo,
    especie: seed.especie,
    nomeComum: seed.nomeComum,
    status: latestRecord.status,
    lat: seed.lat,
    lng: seed.lng,
    localizacao: latestRecord.localizacao,
    dimensoes: latestRecord.dimensoes,
    condicao: latestRecord.condicao,
    estruturaRisco: latestRecord.estruturaRisco,
    conflitos: latestRecord.conflitos,
    manejo: latestRecord.manejo,
    registro: latestRecord.registro,
    observacoes: latestRecord.observacoes,
    records,
  };
}

function buildTreePreview(index: number): TreePreview {
  const seed = getTreeSeed(index);
  const currentRecord = makeCurrentRecord(index);

  return {
    id: seed.treeId,
    codigo: seed.codigo,
    especie: seed.especie,
    nomeComum: seed.nomeComum,
    status: currentRecord.status,
    lat: seed.lat,
    lng: seed.lng,
    localizacao: {
      bairro: currentRecord.localizacao.bairro,
      rua: currentRecord.localizacao.rua,
    },
    dimensoes: {
      alturaM: currentRecord.dimensoes.alturaM,
      dapCm: currentRecord.dimensoes.dapCm,
      copaM: currentRecord.dimensoes.copaM,
    },
    registro: {
      aprovacao: currentRecord.registro.aprovacao,
      ultimaMedicao: currentRecord.registro.ultimaMedicao,
    },
  };
}

export const mockTreePreviews: TreePreview[] = Array.from(
  { length: TREE_COUNT },
  (_, index) => buildTreePreview(index + 1)
);

export function getMockTreeById(treeId: string) {
  const index = getTreeIndexFromId(treeId);
  return index ? buildTree(index) : null;
}

export function getMockTreeRecordById(treeId: string, recordId: string) {
  const tree = getMockTreeById(treeId);

  if (!tree) {
    return null;
  }

  return tree.records.find((record) => record.id === recordId) ?? null;
}

const previewTreeFive = getMockTreeById("tree-005");
const previewTreeTwo = getMockTreeById("tree-002");
const draftTreeRecord = makeCurrentRecord(90);

function makeRequestRecord(tree: Tree, versionOffset: number, submittedBy: string): TreeMeasurementRecord {
  const baseRecord = cloneRecord(tree.records[Math.max(0, tree.records.length - 1 - versionOffset)]);
  const submittedAt = new Date(baseRecord.registro.registradoEm);
  submittedAt.setDate(submittedAt.getDate() + 7);
  baseRecord.id = `${baseRecord.id}-request`;
  baseRecord.version = baseRecord.version + 1;
  baseRecord.registro.aprovacao = "pendente";
  baseRecord.registro.registradoEm = submittedAt.toISOString();
  baseRecord.registro.registradoPor = submittedBy;
  baseRecord.registro.aprovadoEm = undefined;
  return baseRecord;
}

const createTreeRequest: TreeApprovalRequest = {
  id: "request-create-tree-001",
  type: "create_tree",
  status: "pendente",
  submittedAt: new Date("2026-05-16T12:20:00.000Z").toISOString(),
  submittedBy: "Ana Beatriz Lima",
  treeMeta: {
    codigo: "UFRPE-PEND-01",
    especie: "Tabebuia roseoalba",
    nomeComum: "Ipê-branco",
    lat: -8.01691,
    lng: -34.94518,
  },
  treeDraft: {
    codigo: "UFRPE-PEND-01",
    especie: "Tabebuia roseoalba",
    nomeComum: "Ipê-branco",
    lat: -8.01691,
    lng: -34.94518,
  },
  record: {
    ...draftTreeRecord,
    id: "draft-tree-001-record-1",
    kind: "initial",
    version: 1,
    registro: {
      ...draftTreeRecord.registro,
      aprovacao: "pendente",
      registradoPor: "Ana Beatriz Lima",
    },
  },
};

const createRecordRequest: TreeApprovalRequest | null = previewTreeFive
  ? {
      id: "request-create-record-002",
      type: "create_record",
      status: "pendente",
      submittedAt: new Date("2026-05-15T09:10:00.000Z").toISOString(),
      submittedBy: "Pedro Soares",
      treeId: previewTreeFive.id,
      treeMeta: {
        codigo: previewTreeFive.codigo,
        especie: previewTreeFive.especie,
        nomeComum: previewTreeFive.nomeComum,
        lat: previewTreeFive.lat,
        lng: previewTreeFive.lng,
      },
      record: makeRequestRecord(previewTreeFive, 0, "Pedro Soares"),
    }
  : null;

const editRecordRequest: TreeApprovalRequest | null = previewTreeTwo
  ? (() => {
      const editedRecord = cloneRecord(previewTreeTwo.records[0]);
      editedRecord.id = `${previewTreeTwo.records[0].id}-edit-request`;
      editedRecord.dimensoes = {
        ...previewTreeTwo.records[0].dimensoes,
        alturaM: Number((previewTreeTwo.records[0].dimensoes.alturaM + 0.4).toFixed(1)),
      };
      editedRecord.observacoes =
        "Pesquisadora solicitou correção da medida de altura após revisão de campo.";
      editedRecord.registro = {
        ...previewTreeTwo.records[0].registro,
        aprovacao: "pendente",
        registradoPor: "Ana Beatriz Lima",
        registradoEm: new Date("2026-05-14T15:45:00.000Z").toISOString(),
      };

      return {
        id: "request-edit-record-003",
        type: "edit_record",
        status: "pendente",
        submittedAt: new Date("2026-05-14T15:45:00.000Z").toISOString(),
        submittedBy: "Ana Beatriz Lima",
        treeId: previewTreeTwo.id,
        targetRecordId: previewTreeTwo.records[0].id,
        treeMeta: {
          codigo: previewTreeTwo.codigo,
          especie: previewTreeTwo.especie,
          nomeComum: previewTreeTwo.nomeComum,
          lat: previewTreeTwo.lat,
          lng: previewTreeTwo.lng,
        },
        record: editedRecord,
      };
    })()
  : null;

export const mockApprovalRequests: TreeApprovalRequest[] = [
  createTreeRequest,
  createRecordRequest,
  editRecordRequest,
].filter((request): request is TreeApprovalRequest => request !== null);

export const mockUsers: User[] = [
  {
    id: "u1",
    nome: "Visitante",
    name: "Visitante",
    email: "visitante@arbor.local",
    perfilAcesso: "PUBLICO_GERAL",
    role: UserRole.CITIZEN,
    ativo: true,
    matricula: null,
  },
  {
    id: "u2",
    nome: "Marina Silva",
    name: "Marina Silva",
    email: "marina@email.com",
    perfilAcesso: "PUBLICO_GERAL",
    role: UserRole.CITIZEN,
    ativo: true,
    matricula: null,
  },
  {
    id: "u3",
    nome: "Ana Beatriz Lima",
    name: "Ana Beatriz Lima",
    email: "ana.lima@ufrpe.br",
    perfilAcesso: "PESQUISADOR",
    role: UserRole.RESEARCHER,
    ativo: true,
    matricula: "2024001",
  },
  {
    id: "u4",
    nome: "Prof. Ricardo Mendes",
    name: "Prof. Ricardo Mendes",
    email: "ricardo.mendes@ufrpe.br",
    perfilAcesso: "GESTOR",
    role: UserRole.MANAGER,
    ativo: true,
    matricula: "GEST001",
  },
  {
    id: "u5",
    nome: "Dra. Helena Cavalcanti",
    name: "Dra. Helena Cavalcanti",
    email: "helena.cavalcanti@ufrpe.br",
    perfilAcesso: "ADMINISTRADOR",
    role: UserRole.ADMIN,
    ativo: true,
    matricula: "ADM001",
  },
];
