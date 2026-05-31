import type { Tree } from "@/types/trees";

export function findTreeById(trees: Tree[], treeId: string) {
  return trees.find((tree) => tree.id === treeId) ?? null;
}

export function findTreeRecordById(tree: Tree | null, recordId: string) {
  if (!tree) {
    return null;
  }

  return tree.records.find((record) => record.id === recordId) ?? null;
}
