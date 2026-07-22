# wikiWeb Prototype Data Model

This document describes a recommended first-pass TypeScript model. Exact names may change during implementation, but the distinctions should remain.

## Node

```ts
type NodeId = string;
type EdgeId = string;
type NodeTypeId = string;

interface WikiNode {
  id: NodeId;
  title: string;
  typeId: NodeTypeId;
  summary: string;
  body: string;

  position: {
    x: number;
    y: number;
  };

  detailLevelOverride?: number;

  appearanceOverride?: {
    color?: string;
    size?: number;
    shape?: string;
  };

  createdAt: string;
  updatedAt: string;
}
```

## Connection

```ts
type EdgeDirection =
  | "source-to-target"
  | "target-to-source"
  | "bidirectional";

interface WikiEdge {
  id: EdgeId;
  sourceId: NodeId;
  targetId: NodeId;
  direction: EdgeDirection;

  articleOrder?: number;
  strength: number;
  colorOverride?: string;

  createdAt: string;
  updatedAt: string;
}
```

Interpretation:

- `source-to-target`: source is parent, target is child
- `target-to-source`: target is parent, source is child
- `bidirectional`: peers

`articleOrder` applies only when the edge is hierarchical.

## Node type configuration

```ts
interface NodeTypeConfig {
  id: NodeTypeId;
  label: string;

  color: string;
  size: number;
  shape?: string;

  titleDetailLevel: number;

  reveal: {
    bubbleOffset: number;
    summaryOffset: number;
    childrenOffset: number;
    articleOffset: number;
  };

  defaultArticleRank: number;
}
```

The exact meaning of offsets may be revised after testing. The important point is that reveal behavior is configurable by node type.

## Application configuration

```ts
type ZoomSpacingMode = "equal-stage" | "numeric-stage";

interface WikiWebConfig {
  schemaVersion: number;
  zoomSpacingMode: ZoomSpacingMode;
  nodeTypes: NodeTypeConfig[];
  defaultArticleOrder: NodeTypeId[];
  defaultEdgeStrength: number;
  neutralPeerEdgeColor: string;
}
```

## Persisted graph

```ts
interface WikiWebDocument {
  schemaVersion: number;
  config: WikiWebConfig;
  nodes: WikiNode[];
  edges: WikiEdge[];
}
```

## Derived helpers

The implementation will likely need helpers such as:

```ts
function getParentChild(edge: WikiEdge): {
  parentId: NodeId;
  childId: NodeId;
} | null;

function getParents(nodeId: NodeId, edges: WikiEdge[]): NodeId[];

function getChildren(nodeId: NodeId, edges: WikiEdge[]): NodeId[];

function getPeers(nodeId: NodeId, edges: WikiEdge[]): NodeId[];

function wouldCreateHierarchyCycle(
  proposedEdge: WikiEdge,
  edges: WikiEdge[]
): {
  createsCycle: boolean;
  cycleNodeIds: NodeId[];
  cycleEdgeIds: EdgeId[];
};

function getOrderedChildren(
  parentId: NodeId,
  nodes: WikiNode[],
  edges: WikiEdge[],
  config: WikiWebConfig
): WikiNode[];
```

## Ordering rules

1. Use a saved `articleOrder` on a parent-child edge when present.
2. Otherwise use the child node type's `defaultArticleRank`.
3. Use a deterministic tie-breaker such as title, creation time, or ID.
4. When the user reorders children within one article, update only the relevant parent-child edges.
5. Do not store one universal order on the child node.

## Cycle rules

- Build the hierarchy graph from unidirectional edges only.
- Bidirectional edges are excluded from hierarchy traversal.
- Before adding a unidirectional edge, test whether it creates a directed cycle.
- If it does, return the complete detected cycle so the UI can list affected nodes and edges.
- The UI may:
  - cancel
  - add the proposed edge as bidirectional
  - convert all edges in the cycle to bidirectional

## Article traversal rules

- Traverse hierarchical descendants only.
- Render peers separately in Related Nodes.
- Track the active traversal path to stop recursive loops.
- A shared descendant may be rendered in multiple authored branches.
- Mark repeated appearances as shared.

## Storage notes

Use IndexedDB for persistence.

Recommended stores:

- graph document
- application settings
- optional future media metadata

Use a schema version from the first implementation so migrations are possible later.
