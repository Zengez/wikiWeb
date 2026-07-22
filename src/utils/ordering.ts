import type { NodeTypeConfig, WikiWebConfig } from '../models/config';
import type { WikiEdge } from '../models/edge';
import type { WikiNode } from '../models/node';

export function compareChildren(
  a: WikiNode,
  b: WikiNode,
  config: WikiWebConfig,
  edges: WikiEdge[],
  parentId: string
): number {
  const edgeA = edges.find(
    (edge) =>
      edge.articleOrder !== undefined &&
      ((edge.sourceId === parentId && edge.targetId === a.id) ||
        (edge.targetId === parentId && edge.sourceId === a.id))
  );
  const edgeB = edges.find(
    (edge) =>
      edge.articleOrder !== undefined &&
      ((edge.sourceId === parentId && edge.targetId === b.id) ||
        (edge.targetId === parentId && edge.sourceId === b.id))
  );

  if (edgeA && edgeB) {
    return edgeA.articleOrder! - edgeB.articleOrder!;
  }

  if (edgeA) {
    return -1;
  }
  if (edgeB) {
    return 1;
  }

  const rankA = getDefaultRank(a.typeId, config.nodeTypes);
  const rankB = getDefaultRank(b.typeId, config.nodeTypes);

  if (rankA !== rankB) {
    return rankA - rankB;
  }

  return a.title.localeCompare(b.title);
}

function getDefaultRank(typeId: string, nodeTypes: NodeTypeConfig[]): number {
  const type = nodeTypes.find((candidate) => candidate.id === typeId);
  return type?.defaultArticleRank ?? Number.MAX_SAFE_INTEGER;
}
