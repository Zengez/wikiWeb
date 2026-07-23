import { MarkerType } from 'reactflow';
import type { FlowEdge } from 'reactflow';
import type { NodeTypeConfig } from '../models/config';
import type { WikiEdge } from '../models/edge';

export function nodeStyleForType(type: NodeTypeConfig) {
  return {
    width: type.size,
    height: type.size,
    background: type.color,
    color: '#fff',
    border: '2px solid rgba(255,255,255,0.85)',
    borderRadius: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    padding: '12px',
    boxSizing: 'border-box' as const,
  };
}

export function getMarkerCountForPathLength(pathLength: number) {
  return Math.min(4, Math.max(2, Math.floor(pathLength / 120)));
}

export function getMarkerOffsets(
  pathLength: number,
  markerCount: number,
  minFraction = 0.12,
  maxFraction = 0.88
) {
  if (markerCount <= 0 || pathLength <= 0) {
    return [];
  }

  const start = Math.max(0, Math.min(pathLength, pathLength * minFraction));
  const end = Math.max(start, Math.min(pathLength, pathLength * maxFraction));
  const usableDistance = end - start;
  const step = usableDistance / (markerCount + 1);

  return Array.from({ length: markerCount }, (_, index) => start + step * (index + 1));
}

export function getBidirectionalMarkerOffsets(pathLength: number) {
  const countPerSide = Math.min(3, Math.max(2, Math.floor(pathLength / 180)));

  return {
    forward: getMarkerOffsets(pathLength, countPerSide, 0.12, 0.48),
    reverse: getMarkerOffsets(pathLength, countPerSide, 0.52, 0.88),
  };
}

export function flowEdgeFromWikiEdge(edge: WikiEdge): Partial<FlowEdge> {
  const isSourceToTarget = edge.direction === 'source-to-target';
  const isTargetToSource = edge.direction === 'target-to-source';
  const isBidirectional = edge.direction === 'bidirectional';

  return {
    id: edge.id,
    source: edge.sourceId,
    target: edge.targetId,
    type: 'direction',
    data: {
      direction: edge.direction,
    },
    markerEnd: isSourceToTarget || isBidirectional ? MarkerType.ArrowClosed : undefined,
    markerStart: isTargetToSource || isBidirectional ? MarkerType.ArrowClosed : undefined,
    style: {
      stroke: isBidirectional ? '#e76f51' : '#264653',
      strokeWidth: 4,
    },
    animated: false,
  };
}
