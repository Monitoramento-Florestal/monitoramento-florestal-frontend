"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TREE_STATUS_COLORS } from "@/components/features/map/mapIcons";
import { formatDate } from "@/utils/format";
import {
  getTreeManagementStatusLabel,
  type TreeManagementPolicy,
} from "@/utils/treeManagement";
import type { Tree } from "@/types/trees";

interface TreeManagementTableProps {
  onDeleteTree?: (tree: Tree) => void;
  onEditTree?: (tree: Tree) => void;
  onSelectTree: (tree: Tree) => void;
  policy: TreeManagementPolicy;
  trees: Tree[];
}

export function TreeManagementTable({
  onDeleteTree,
  onEditTree,
  onSelectTree,
  policy,
  trees,
}: TreeManagementTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-rosewood/75">
            <th className="border-b border-rosewood/10 px-4 py-4 font-medium">
              Codigo
            </th>
            <th className="border-b border-rosewood/10 px-4 py-4 font-medium">
              Especie
            </th>
            <th className="border-b border-rosewood/10 px-4 py-4 font-medium">
              Altura
            </th>
            <th className="border-b border-rosewood/10 px-4 py-4 font-medium">
              DAP
            </th>
            <th className="border-b border-rosewood/10 px-4 py-4 font-medium">
              Copa
            </th>
            <th className="border-b border-rosewood/10 px-4 py-4 font-medium">
              Status
            </th>
            <th className="border-b border-rosewood/10 px-4 py-4 font-medium">
              Ultima medicao
            </th>
            <th className="border-b border-rosewood/10 px-4 py-4 text-right font-medium">
              Acoes
            </th>
          </tr>
        </thead>

        <tbody>
          {trees.map((tree) => {
            const statusColor = TREE_STATUS_COLORS[tree.status];

            return (
              <tr
                key={tree.id}
                className="transition-colors hover:bg-secondary/45"
              >
                <td className="border-b border-rosewood/8 px-4 py-5 text-sm text-rosewood">
                  {tree.codigo}
                </td>
                <td className="border-b border-rosewood/8 px-4 py-5">
                  <div className="text-base tracking-tight text-burgundy">
                    {tree.nomeComum}
                  </div>
                  <div className="mt-1 text-sm text-rosewood">
                    {tree.especie}
                  </div>
                </td>
                <td className="border-b border-rosewood/8 px-4 py-5 text-sm tabular-nums text-burgundy">
                  {tree.dimensoes.alturaM} m
                </td>
                <td className="border-b border-rosewood/8 px-4 py-5 text-sm tabular-nums text-burgundy">
                  {tree.dimensoes.dapCm} cm
                </td>
                <td className="border-b border-rosewood/8 px-4 py-5 text-sm tabular-nums text-burgundy">
                  {tree.dimensoes.copaM} m
                </td>
                <td className="border-b border-rosewood/8 px-4 py-5">
                  <span
                    className="inline-flex rounded-full border px-2.5 py-1 text-xs"
                    style={{
                      borderColor: `${statusColor.stroke}35`,
                      backgroundColor: `${statusColor.fill}18`,
                      color: statusColor.stroke,
                    }}
                  >
                    {getTreeManagementStatusLabel(tree.status)}
                  </span>
                </td>
                <td className="border-b border-rosewood/8 px-4 py-5 text-sm text-rosewood">
                  {formatDate(tree.registro.ultimaMedicao)}
                </td>
                <td className="border-b border-rosewood/8 px-4 py-5">
                  <div className="flex justify-end gap-2">
                    {policy.canOpenDetails ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        iconSide="left"
                        className="text-rosewood hover:bg-secondary"
                        onClick={() => onSelectTree(tree)}
                      >
                        Ver
                      </Button>
                    ) : null}

                    {policy.canDirectEdit ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon={Pencil}
                        iconSide="left"
                        className="text-rosewood hover:bg-secondary"
                        onClick={() => onEditTree?.(tree)}
                      >
                        Editar
                      </Button>
                    ) : null}

                    {policy.canDelete ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        iconSide="left"
                        className="text-burgundy hover:bg-burgundy/6"
                        onClick={() => onDeleteTree?.(tree)}
                      >
                        Excluir
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
