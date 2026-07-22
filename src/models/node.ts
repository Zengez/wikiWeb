export type NodeId = string;
export type NodeTypeId = string;

export interface Position {
  x: number;
  y: number;
}

export interface AppearanceOverride {
  color?: string;
  size?: number;
  shape?: string;
}

export interface WikiNode {
  id: NodeId;
  title: string;
  typeId: NodeTypeId;
  summary: string;
  body: string;
  position: Position;
  detailLevelOverride?: number;
  appearanceOverride?: AppearanceOverride;
  createdAt: string;
  updatedAt: string;
}
