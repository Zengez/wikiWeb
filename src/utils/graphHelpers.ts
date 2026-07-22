import type { WikiEdge } from '../models/edge';
import type { NodeId } from '../models/node';

export function getParentChild(edge: WikiEdge): { parentId: NodeId; childId: NodeId } | null {
  switch (edge.direction) {
    case 'source-to-target':
      return { parentId: edge.sourceId, childId: edge.targetId };
    case 'target-to-source':
      return { parentId: edge.targetId, childId: edge.sourceId };
    default:
      return null;
  }
}

export function getParents(nodeId: NodeId, edges: WikiEdge[]): NodeId[] {
  return edges
    .map(getParentChild)
    .filter((pair): pair is { parentId: NodeId; childId: NodeId } => pair !== null)
    .filter((pair) => pair.childId === nodeId)
    .map((pair) => pair.parentId);
}

export function getChildren(nodeId: NodeId, edges: WikiEdge[]): NodeId[] {
  return edges
    .map(getParentChild)
    .filter((pair): pair is { parentId: NodeId; childId: NodeId } => pair !== null)
    .filter((pair) => pair.parentId === nodeId)
    .map((pair) => pair.childId);
}

export function getPeers(nodeId: NodeId, edges: WikiEdge[]): NodeId[] {
  return edges
    .filter((edge) => edge.direction === 'bidirectional')
    .filter((edge) => edge.sourceId === nodeId || edge.targetId === nodeId)
    .map((edge) => (edge.sourceId === nodeId ? edge.targetId : edge.sourceId));
}

export function wouldCreateHierarchyCycle(
  proposedEdge: WikiEdge,
  edges: WikiEdge[]
): { createsCycle: boolean; cycleNodeIds: NodeId[]; cycleEdgeIds: string[] } {
  if (proposedEdge.direction === 'bidirectional') {
    return { createsCycle: false, cycleNodeIds: [], cycleEdgeIds: [] };
  }

  const graph = new Map<NodeId, Set<NodeId>>();
  const addEdge = (parent: NodeId, child: NodeId) => {
    if (!graph.has(parent)) {
      graph.set(parent, new Set());
    }
    graph.get(parent)!.add(child);
  };

  edges.forEach((edge) => {
    const relation = getParentChild(edge);
    if (relation) {
      addEdge(relation.parentId, relation.childId);
    }
  });

  const relation = getParentChild(proposedEdge);
  if (!relation) {
    return { createsCycle: false, cycleNodeIds: [], cycleEdgeIds: [] };
  }
  addEdge(relation.parentId, relation.childId);

  const visited = new Set<NodeId>();
  const stack = new Set<NodeId>();
  const cycleNodeIds: NodeId[] = [];

  const dfs = (nodeId: NodeId): boolean => {
    visited.add(nodeId);
    stack.add(nodeId);

    const children = graph.get(nodeId);
    if (children) {
      for (const child of children) {
        if (!visited.has(child)) {
          if (dfs(child)) {
            if (!cycleNodeIds.includes(nodeId)) {
              cycleNodeIds.push(nodeId);
            }
            return true;
          }
        } else if (stack.has(child)) {
          cycleNodeIds.push(child);
          cycleNodeIds.push(nodeId);
          return true;
        }
      }
    }

    stack.delete(nodeId);
    return false;
  };

  for (const nodeId of graph.keys()) {
    if (!visited.has(nodeId) && dfs(nodeId)) {
      break;
    }
  }

  if (cycleNodeIds.length === 0) {
    return { createsCycle: false, cycleNodeIds: [], cycleEdgeIds: [] };
  }

  const cycleSet = new Set(cycleNodeIds);
  const cycleEdgeIds = edges
    .filter((edge) => {
      const relation = getParentChild(edge);
      if (!relation) {
        return false;
      }
      return cycleSet.has(relation.parentId) && cycleSet.has(relation.childId);
    })
    .map((edge) => edge.id);

  return { createsCycle: true, cycleNodeIds, cycleEdgeIds };
}
