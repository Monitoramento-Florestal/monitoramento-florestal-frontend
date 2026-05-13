import { Tree } from "./trees";
import { User } from "./auth";

// UFRPE Recife — Dois Irmãos. Centro aproximado: -8.0175, -34.9447
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

const injuriasPossiveis = [
  "Cupim no fuste",
  "Galho quebrado",
  "Casca descolada",
  "Liquens excessivos",
  "Raízes expostas",
  "Cavidade no tronco",
];

const pesquisadores = ["Dra. Helena Cavalcanti", "Prof. Ricardo Mendes", "Ana Beatriz Lima", "Pedro Soares"];

function rand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function makeTree(i: number): Tree {
  const r1 = rand(i * 1.7);
  const r2 = rand(i * 2.3);
  const r3 = rand(i * 3.1);
  const r4 = rand(i * 4.7);
  const especie = especies[i % especies.length];
  // distribuir num raio de ~600m com clusters naturais
  const cluster = i % 5;
  const offsetLat = (cluster - 2) * 0.0015;
  const offsetLng = (cluster - 2) * 0.0012;
  const lat = CENTER.lat + offsetLat + (r1 - 0.5) * 0.006;
  const lng = CENTER.lng + offsetLng + (r2 - 0.5) * 0.006;

  const statusRoll = r3;
  const status: Tree["status"] =
    statusRoll < 0.65 ? "saudavel" : statusRoll < 0.9 ? "injuria" : "cortada";

  const aprovacaoRoll = r4;
  const aprovacao: Tree["aprovacao"] =
    aprovacaoRoll < 0.82 ? "aprovada" : aprovacaoRoll < 0.95 ? "pendente" : "rejeitada";

  const injurias =
    status === "injuria"
      ? [injuriasPossiveis[i % injuriasPossiveis.length]]
      : status === "cortada"
      ? ["Cortada por risco estrutural"]
      : [];

  const daysAgo = Math.floor(r1 * 180);
  const ultima = new Date();
  ultima.setDate(ultima.getDate() - daysAgo);

  const regDays = daysAgo + Math.floor(r2 * 30);
  const reg = new Date();
  reg.setDate(reg.getDate() - regDays);

  return {
    id: `tree-${String(i).padStart(3, "0")}`,
    codigo: `UFRPE-${String(1000 + i)}`,
    especie: especie[0],
    nomeComum: especie[1],
    lat,
    lng,
    altura: Math.round((4 + r1 * 18) * 10) / 10,
    dap: Math.round((10 + r2 * 80) * 10) / 10,
    copaDiametro: Math.round((2 + r3 * 9) * 10) / 10,
    qualidadeFuste: r4 < 0.6 ? "boa" : r4 < 0.85 ? "regular" : "ruim",
    status,
    injurias,
    ultimaMedicao: ultima.toISOString(),
    registradoPor: pesquisadores[i % pesquisadores.length],
    registradoEm: reg.toISOString(),
    aprovacao,
    fotos: 1 + Math.floor(r2 * 4),
    observacoes:
      status === "saudavel"
        ? "Espécime em bom estado fitossanitário."
        : status === "injuria"
        ? "Recomenda-se acompanhamento mensal."
        : "Removida conforme parecer técnico.",
  };
}

export const mockTrees: Tree[] = Array.from({ length: 42 }, (_, i) => makeTree(i + 1));

export const mockUsers: User[] = [
  { id: "u1", name: "Visitante", email: "visitante@arbor.local", role: "citizen" },
  { id: "u2", name: "Marina Cidadã", email: "marina@email.com", role: "citizen" },
  { id: "u3", name: "Ana Beatriz Lima", email: "ana.lima@ufrpe.br", role: "researcher" },
  { id: "u4", name: "Prof. Ricardo Mendes", email: "ricardo.mendes@ufrpe.br", role: "manager" },
  { id: "u5", name: "Dra. Helena Cavalcanti", email: "helena.cavalcanti@ufrpe.br", role: "admin" },
];
