'use client'

import {
  Calendar,
  Camera,
  History,
  MapPin,
  PlusCircle,
  Ruler,
  ShieldAlert,
  Sprout,
  TriangleAlert,
  User as UserIcon,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { MapTreeDetail } from '@/types/map'
import type { Tree, TreeStatus } from '@/types/trees'
import type { TreeVigor } from '@/types/trees'
import {
  APPROVAL_LABEL,
  APPROVAL_TONE,
  formatTreeDate,
  formatTreeLabel,
  getTreeCoverPhoto,
  getTreeProblemLabels,
} from '@/utils/treeDetailPanel'
import { TREE_STATUS_COLORS, TREE_STATUS_LABEL } from '../mapIcons'
import { DetailGroup } from './DetailGroup'
import { DetailNote } from './DetailNote'
import { Metric } from './Metric'
import { Section } from './Section'
import { StatusPill } from './StatusPill'
import { TagList } from './TagList'

function toFullTree(detail: MapTreeDetail): Tree {
  return {
    id: detail.id,
    codigo: detail.codigo,
    nomeComum: detail.nomeComum,
    especie: detail.especie,
    status: detail.status as unknown as TreeStatus,
    lat: detail.lat,
    lng: detail.lng,
    localizacao: {
      bairro: detail.localizacao.bairro,
      rua: detail.localizacao.rua,
      referencia: detail.localizacao.referencia,
      dataColeta: '',
      equipe: 'Indisponivel',
    },
    dimensoes: {
      alturaM: 0,
      dapCm: 0,
      copaM: 0,
      medidaEstimada: false,
    },
    condicao: {
      estadoGeral: 3 as 1 | 2 | 3 | 4 | 5,
      vigor: (detail.vigor ?? 'medio') as TreeVigor,
      problemas: [],
      posicaoProblema: null,
    },
    estruturaRisco: {
      tronco: [],
      baseColo: [],
      copa: [],
      inclinacaoTronco: 'ausente' as const,
      ancoragemRadicular: 'estavel' as const,
      alvosPotenciais: [],
      fluxoVeiculos: 'baixo' as const,
      fluxoPedestres: 'baixo' as const,
      tipoVia: 'residencial' as const,
      alvosSensiveis: [],
    },
    conflitos: {
      fiacao: 'ausente' as const,
      calcada: 'sem dano' as const,
      iluminacao: 'sem' as const,
      edificacao: 'sem' as const,
    },
    manejo: {
      acao: 'nenhuma' as const,
      prioridade: 'baixa' as const,
    },
    registro: {
      aprovacao: 'pendente' as const,
      fotos: detail.fotoUrl ? [detail.fotoUrl] : [],
      registradoEm: new Date().toISOString(),
      registradoPor: 'Indisponivel',
      ultimaMedicao: new Date().toISOString(),
    },
    records: [],
    observacoes: detail.observacoes,
  }
}

interface MapTreeDetailPanelProps {
  historyHref?: string
  recordCreateHref?: string
  mode?: 'default' | 'readOnly'
  tree: MapTreeDetail | Tree | null
  onClose: () => void
}

function formatCoordinate(value: number | null) {
  return typeof value === 'number' && Number.isFinite(value)
    ? value.toFixed(5)
    : 'Indisponivel'
}

export function MapTreeDetailPanel({
  historyHref,
  recordCreateHref,
  mode = 'default',
  tree: rawTree,
  onClose,
}: MapTreeDetailPanelProps) {
  const tree: Tree | null = rawTree
    ? 'dimensoes' in rawTree
      ? rawTree
      : toFullTree(rawTree)
    : null

  if (!tree) {
    return null
  }

  const statusColor = TREE_STATUS_COLORS[tree.status]
  const problemas = getTreeProblemLabels(tree)
  const coverPhoto = getTreeCoverPhoto(tree)
  const isReadOnly = mode === 'readOnly'

  return (
    <>
      <button
        type="button"
        aria-label="Fechar detalhes"
        className="fixed inset-0 z-[880] bg-forest/24 backdrop-blur-[1px] sm:hidden"
        onClick={onClose}
      />

      <aside className="fixed sm:absolute top-0 right-0 z-[1100] flex h-dvh sm:h-full w-full max-w-[440px] flex-col overflow-hidden border-l border-rosewood/20 bg-cream shadow-[0_0_36px_rgba(62,0,12,0.14)]">
        <div className="grain border-b border-rosewood/14 bg-card/96 px-5 pt-5 pb-4">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-rosewood/85">
                {tree.codigo}
              </p>
              <h2 className="text-[1.4rem] leading-tight text-burgundy">
                {tree.nomeComum}
              </h2>
              <p className="mt-1 text-sm italic text-rosewood">
                {tree.especie}
              </p>
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
            {!isReadOnly ? (
              <StatusPill
                label={APPROVAL_LABEL[tree.registro.aprovacao]}
                className={APPROVAL_TONE[tree.registro.aprovacao]}
              />
            ) : null}
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
          <Section title="Medicoes">
            <Metric
              icon={Ruler}
              label="Altura"
              value={`${tree.dimensoes.alturaM} m`}
            />
            <Metric
              icon={Ruler}
              label="DAP"
              value={`${tree.dimensoes.dapCm} cm`}
            />
            <Metric
              icon={Ruler}
              label="Copa"
              value={`${tree.dimensoes.copaM} m`}
            />
            <Metric
              icon={Ruler}
              label="Coleta"
              value={
                tree.dimensoes.medidaEstimada
                  ? 'Medida estimada'
                  : 'Medida aferida'
              }
            />
          </Section>

          <Section title="Localizacao">
            <Metric
              icon={MapPin}
              label="Bairro"
              value={tree.localizacao.bairro}
            />
            <Metric icon={MapPin} label="Rua" value={tree.localizacao.rua} />
            {tree.localizacao.numeroResidencia ? (
              <Metric
                icon={MapPin}
                label="Numero"
                value={tree.localizacao.numeroResidencia}
              />
            ) : null}
            {tree.localizacao.referencia ? (
              <Metric
                icon={MapPin}
                label="Referencia"
                value={tree.localizacao.referencia}
                stacked
              />
            ) : null}
            <Metric
              icon={MapPin}
              label="Coordenadas"
              value={`${formatCoordinate(tree.lat)}, ${formatCoordinate(tree.lng)}`}
            />
            <Metric
              icon={Calendar}
              label="Data da coleta"
              value={formatTreeDate(tree.localizacao.dataColeta)}
            />
            <Metric
              icon={UserIcon}
              label="Equipe"
              value={tree.localizacao.equipe}
            />
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
              label="Posicao do problema"
              value={
                tree.condicao.posicaoProblema
                  ? formatTreeLabel(tree.condicao.posicaoProblema)
                  : 'Sem problema informado'
              }
            />
            <TagList items={problemas} />
          </Section>

          <Section title="Estrutura e risco">
            <Metric
              icon={ShieldAlert}
              label="Inclinacao do tronco"
              value={formatTreeLabel(tree.estruturaRisco.inclinacaoTronco)}
            />
            <Metric
              icon={ShieldAlert}
              label="Ancoragem radicular"
              value={formatTreeLabel(tree.estruturaRisco.ancoragemRadicular)}
            />
            <Metric
              icon={ShieldAlert}
              label="Fluxo de veiculos"
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
            <DetailGroup
              label="Base / colo"
              items={tree.estruturaRisco.baseColo}
            />
            <DetailGroup label="Copa" items={tree.estruturaRisco.copa} />
            <DetailGroup
              label="Alvos potenciais"
              items={tree.estruturaRisco.alvosPotenciais}
            />
            <DetailGroup
              label="Alvos sensiveis"
              items={tree.estruturaRisco.alvosSensiveis}
            />
          </Section>

          <Section title="Conflitos">
            <Metric
              icon={TriangleAlert}
              label="Fiacao"
              value={formatTreeLabel(tree.conflitos.fiacao)}
            />
            <Metric
              icon={TriangleAlert}
              label="Calcada"
              value={formatTreeLabel(tree.conflitos.calcada)}
            />
            <Metric
              icon={TriangleAlert}
              label="Iluminacao"
              value={formatTreeLabel(tree.conflitos.iluminacao)}
            />
            <Metric
              icon={TriangleAlert}
              label="Edificacao"
              value={formatTreeLabel(tree.conflitos.edificacao)}
            />
          </Section>

          <Section title="Manejo">
            <Metric
              icon={Sprout}
              label="Acao"
              value={formatTreeLabel(tree.manejo.acao)}
            />
            <Metric
              icon={Sprout}
              label="Prioridade"
              value={formatTreeLabel(tree.manejo.prioridade)}
            />
          </Section>

          <Section title={isReadOnly ? 'Acompanhamento' : 'Registro atual'}>
            <Metric
              icon={Calendar}
              label="Última medição"
              value={formatTreeDate(tree.registro.ultimaMedicao)}
            />
            {!isReadOnly ? (
              <>
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
              </>
            ) : null}
          </Section>

          {tree.observacoes ? (
            <Section title="Observacoes">
              <DetailNote>{tree.observacoes}</DetailNote>
            </Section>
          ) : null}
        </div>

        {(historyHref || recordCreateHref) && !isReadOnly ? (
          <div className="border-t border-rosewood/14 bg-card/95 px-5 py-4">
            <div className="flex flex-col gap-3">
              {recordCreateHref ? (
                <Button
                  variant="primary"
                  size="lg"
                  icon={PlusCircle}
                  iconSide="left"
                  className="w-full"
                  href={recordCreateHref}
                >
                  Adicionar registro
                </Button>
              ) : null}

              {historyHref ? (
                <Button
                  variant="outline"
                  size="lg"
                  icon={History}
                  iconSide="left"
                  className="w-full"
                  href={historyHref}
                >
                  Ver historico
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </aside>
    </>
  )
}
