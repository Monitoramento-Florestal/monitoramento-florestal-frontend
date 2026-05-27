"use client";

import {
  Calendar,
  Camera,
  History,
  MapPin,
  Ruler,
  ShieldAlert,
  Sprout,
  TriangleAlert,
  User as UserIcon,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Tree } from "@/types/trees";
import {
  APPROVAL_LABEL,
  APPROVAL_TONE,
  formatTreeDate,
  formatTreeLabel,
  getTreeCoverPhoto,
  getTreeProblemLabels,
} from "@/utils/treeDetailPanel";
import { TREE_STATUS_COLORS, TREE_STATUS_LABEL } from "../mapIcons";
import { DetailGroup } from "./DetailGroup";
import { DetailNote } from "./DetailNote";
import { Metric } from "./Metric";
import { Section } from "./Section";
import { StatusPill } from "./StatusPill";
import { TagList } from "./TagList";

interface TreeDetailPanelProps {
  historyHref?: string;
  tree: Tree | null;
  onClose: () => void;
}

export function TreeDetailPanel({
  historyHref,
  tree,
  onClose,
}: TreeDetailPanelProps) {
  if (!tree) {
    return null;
  }

  const statusColor = TREE_STATUS_COLORS[tree.status];
  const problemas = getTreeProblemLabels(tree);
  const coverPhoto = getTreeCoverPhoto(tree);

  return (
    <>
      <button
        type="button"
        aria-label="Fechar detalhes"
        className="fixed inset-0 z-[880] bg-forest/24 backdrop-blur-[1px] sm:hidden"
        onClick={onClose}
      />

      <aside className="fixed top-0 right-0 z-[900] flex h-dvh w-full max-w-[440px] flex-col overflow-hidden border-l border-rosewood/20 bg-cream shadow-[0_0_36px_rgba(62,0,12,0.14)]">
        <div className="grain border-b border-rosewood/14 bg-card/96 px-5 pt-5 pb-4">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-rosewood/85">
                {tree.codigo}
              </p>
              <h2 className="text-[1.4rem] leading-tight text-burgundy">
                {tree.nomeComum}
              </h2>
              <p className="mt-1 text-sm italic text-rosewood">{tree.especie}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-rosewood transition-colors hover:bg-secondary hover:text-burgundy"
              aria-label="Fechar painel"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusPill
              label={TREE_STATUS_LABEL[tree.status]}
              className="border"
              style={{
                borderColor: `${statusColor.stroke}30`,
                backgroundColor: `${statusColor.fill}18`,
                color: statusColor.stroke,
              }}
            />
            <StatusPill
              label={APPROVAL_LABEL[tree.registro.aprovacao]}
              className={APPROVAL_TONE[tree.registro.aprovacao]}
            />
          </div>

          {coverPhoto ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-rosewood/12 bg-secondary/45">
              <img
                src={coverPhoto}
                alt={`Foto de ${tree.nomeComum}`}
                className="h-44 w-full object-cover"
              />
            </div>
          ) : null}
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <Section title="Medições">
            <Metric icon={Ruler} label="Altura" value={`${tree.dimensoes.alturaM} m`} />
            <Metric icon={Ruler} label="DAP" value={`${tree.dimensoes.dapCm} cm`} />
            <Metric icon={Ruler} label="Copa" value={`${tree.dimensoes.copaM} m`} />
            <Metric
              icon={Ruler}
              label="Coleta"
              value={tree.dimensoes.medidaEstimada ? "Medida estimada" : "Medida aferida"}
            />
          </Section>

          <Section title="Localização">
            <Metric icon={MapPin} label="Bairro" value={tree.localizacao.bairro} />
            <Metric icon={MapPin} label="Rua" value={tree.localizacao.rua} />
            {tree.localizacao.numeroResidencia ? (
              <Metric
                icon={MapPin}
                label="Número"
                value={tree.localizacao.numeroResidencia}
              />
            ) : null}
            {tree.localizacao.referencia ? (
              <Metric
                icon={MapPin}
                label="Referência"
                value={tree.localizacao.referencia}
                stacked
              />
            ) : null}
            <Metric
              icon={MapPin}
              label="Coordenadas"
              value={`${tree.lat.toFixed(5)}, ${tree.lng.toFixed(5)}`}
            />
            <Metric
              icon={Calendar}
              label="Data da coleta"
              value={formatTreeDate(tree.localizacao.dataColeta)}
            />
            <Metric icon={UserIcon} label="Equipe" value={tree.localizacao.equipe} />
          </Section>

          <Section title="Condição da árvore">
            <Metric
              icon={Sprout}
              label="Estado geral"
              value={`${tree.condicao.estadoGeral}/5`}
            />
            <Metric
              icon={Sprout}
              label="Vigor"
              value={formatTreeLabel(tree.condicao.vigor)}
            />
            <Metric
              icon={TriangleAlert}
              label="Posição do problema"
              value={
                tree.condicao.posicaoProblema
                  ? formatTreeLabel(tree.condicao.posicaoProblema)
                  : "Sem problema informado"
              }
            />
            <TagList items={problemas} />
          </Section>

          <Section title="Estrutura e risco">
            <Metric
              icon={ShieldAlert}
              label="Inclinação do tronco"
              value={formatTreeLabel(tree.estruturaRisco.inclinacaoTronco)}
            />
            <Metric
              icon={ShieldAlert}
              label="Ancoragem radicular"
              value={formatTreeLabel(tree.estruturaRisco.ancoragemRadicular)}
            />
            <Metric
              icon={ShieldAlert}
              label="Fluxo de veículos"
              value={formatTreeLabel(tree.estruturaRisco.fluxoVeiculos)}
            />
            <Metric
              icon={ShieldAlert}
              label="Fluxo de pedestres"
              value={formatTreeLabel(tree.estruturaRisco.fluxoPedestres)}
            />
            <Metric
              icon={ShieldAlert}
              label="Tipo de via"
              value={formatTreeLabel(tree.estruturaRisco.tipoVia)}
            />
            <DetailGroup label="Tronco" items={tree.estruturaRisco.tronco} />
            <DetailGroup label="Base / colo" items={tree.estruturaRisco.baseColo} />
            <DetailGroup label="Copa" items={tree.estruturaRisco.copa} />
            <DetailGroup
              label="Alvos potenciais"
              items={tree.estruturaRisco.alvosPotenciais}
            />
            <DetailGroup
              label="Alvos sensíveis"
              items={tree.estruturaRisco.alvosSensiveis}
            />
          </Section>

          <Section title="Conflitos">
            <Metric
              icon={TriangleAlert}
              label="Fiação"
              value={formatTreeLabel(tree.conflitos.fiacao)}
            />
            <Metric
              icon={TriangleAlert}
              label="Calçada"
              value={formatTreeLabel(tree.conflitos.calcada)}
            />
            <Metric
              icon={TriangleAlert}
              label="Iluminação"
              value={formatTreeLabel(tree.conflitos.iluminacao)}
            />
            <Metric
              icon={TriangleAlert}
              label="Edificação"
              value={formatTreeLabel(tree.conflitos.edificacao)}
            />
          </Section>

          <Section title="Manejo">
            <Metric icon={Sprout} label="Ação" value={formatTreeLabel(tree.manejo.acao)} />
            <Metric
              icon={Sprout}
              label="Prioridade"
              value={formatTreeLabel(tree.manejo.prioridade)}
            />
          </Section>

          <Section title="Registro atual">
            <Metric
              icon={Calendar}
              label="Última medição"
              value={formatTreeDate(tree.registro.ultimaMedicao)}
            />
            <Metric
              icon={Calendar}
              label="Registrado em"
              value={formatTreeDate(tree.registro.registradoEm)}
            />
            <Metric
              icon={UserIcon}
              label="Registrado por"
              value={tree.registro.registradoPor}
              stacked
            />
            <Metric
              icon={Camera}
              label="Fotos anexadas"
              value={String(tree.registro.fotos.length)}
            />
            {tree.registro.motivoRejeicao ? (
              <DetailNote title="Motivo da rejeição">
                {tree.registro.motivoRejeicao}
              </DetailNote>
            ) : null}
          </Section>

          {tree.observacoes ? (
            <Section title="Observações">
              <DetailNote>{tree.observacoes}</DetailNote>
            </Section>
          ) : null}
        </div>

        <div className="border-t border-rosewood/14 bg-card/95 px-5 py-4">
          <Button
            variant="outline"
            size="lg"
            icon={History}
            iconSide="left"
            className="w-full"
            disabled={!historyHref}
            href={historyHref}
          >
            {historyHref ? "Ver histórico" : "Histórico em breve"}
          </Button>
        </div>
      </aside>
    </>
  );
}
