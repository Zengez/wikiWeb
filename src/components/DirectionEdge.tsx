import { memo } from 'react';
import { getSmoothStepPath } from '@reactflow/core';
import type { EdgeProps } from '@reactflow/core';
import type { EdgeDirection } from '../models/edge';
import {
  getBidirectionalMarkerOffsets,
  getMarkerCountForPathLength,
  getMarkerOffsets,
} from '../utils/reactFlowHelpers';

interface DirectionEdgeData {
  direction: EdgeDirection;
  sourcePoint?: { x: number; y: number };
  targetPoint?: { x: number; y: number };
  sourceSide?: 'left' | 'right' | 'top' | 'bottom';
  targetSide?: 'left' | 'right' | 'top' | 'bottom';
  sourcePoint?: { x: number; y: number };
  targetPoint?: { x: number; y: number };
  sourceSide?: 'left' | 'right' | 'top' | 'bottom';
  targetSide?: 'left' | 'right' | 'top' | 'bottom';
}

type DirectionEdgeProps = EdgeProps<DirectionEdgeData>;

function getPointAndAngle(path: SVGPathElement, length: number) {
  const point = path.getPointAtLength(length);
  const delta = 0.5;
  const before = path.getPointAtLength(Math.max(0, length - delta));
  const after = path.getPointAtLength(Math.min(path.getTotalLength(), length + delta));
  const angle = Math.atan2(after.y - before.y, after.x - before.x) * (180 / Math.PI);

  return { x: point.x, y: point.y, angle };
}

function markerPath() {
  return 'M -8 -6 L 0 0 L -8 6';
}

function DirectionEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  data,
}: DirectionEdgeProps) {
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 10,
    offset: 24,
  });

  const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  svgPath.setAttribute('d', path);
  const totalPathLength = svgPath.getTotalLength();
  const color = style?.stroke ? String(style.stroke) : '#264653';
  const markerCount = getMarkerCountForPathLength(totalPathLength);
  const hasBidirectional = data?.direction === 'bidirectional';
  const isForward = data?.direction === 'source-to-target';
  const isBackward = data?.direction === 'target-to-source';

  return (
    <g>
      <path d={path} fill="none" stroke={color} strokeWidth={4} />
      {hasBidirectional && (
        <>
          {getBidirectionalMarkerOffsets(totalPathLength).forward.map((offset, index) => {
            const { x, y, angle } = getPointAndAngle(svgPath, offset);
            return (
              <g key={`forward-${index}`} transform={`translate(${x},${y}) rotate(${angle})`}>
                <path
                  d={markerPath()}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}
          {getBidirectionalMarkerOffsets(totalPathLength).reverse.map((offset, index) => {
            const { x, y, angle } = getPointAndAngle(svgPath, offset);
            return (
              <g key={`reverse-${index}`} transform={`translate(${x},${y}) rotate(${angle + 180})`}>
                <path
                  d={markerPath()}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}
        </>
      )}
      {!hasBidirectional &&
        (isForward || isBackward) &&
        getMarkerOffsets(totalPathLength, markerCount).map((offset, index) => {
          const { x, y, angle } = getPointAndAngle(svgPath, offset);
          const rotation = isForward ? angle : angle + 180;
          return (
            <g key={`marker-${index}`} transform={`translate(${x},${y}) rotate(${rotation})`}>
              <path
                d={markerPath()}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}
    </g>
  );
}

export default memo(DirectionEdge);
