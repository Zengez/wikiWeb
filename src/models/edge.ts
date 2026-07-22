export type EdgeId = string;

export type EdgeDirection = 'source-to-target' | 'target-to-source' | 'bidirectional';

export interface WikiEdge {
  id: EdgeId;
  sourceId: string;
  targetId: string;
  direction: EdgeDirection;
  articleOrder?: number;
  strength: number;
  colorOverride?: string;
  createdAt: string;
  updatedAt: string;
}
