export type ZoomSpacingMode = 'equal-stage' | 'numeric-stage';

export interface RevealThresholds {
  hidden: number;
  bubble: number;
  title: number;
  summary: number;
  children: number;
  article: number;
}

export interface NodeTypeConfig {
  id: string;
  label: string;
  color: string;
  size: number;
  shape?: string;
  titleDetailLevel: number;
  reveal: RevealThresholds;
  defaultArticleRank: number;
}

export interface WikiWebConfig {
  schemaVersion: number;
  zoomSpacingMode: ZoomSpacingMode;
  nodeTypes: NodeTypeConfig[];
  defaultArticleOrder: string[];
  defaultEdgeStrength: number;
  neutralPeerEdgeColor: string;
}

export interface WikiWebDocument {
  schemaVersion: number;
  config: WikiWebConfig;
  nodes: unknown[];
  edges: unknown[];
}
