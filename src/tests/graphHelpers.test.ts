import { describe, expect, it } from 'vitest';
import { wouldCreateHierarchyCycle } from '../utils/graphHelpers';

const edges = [
  {
    id: 'e1',
    sourceId: 'a',
    targetId: 'b',
    direction: 'source-to-target',
    strength: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'e2',
    sourceId: 'b',
    targetId: 'c',
    direction: 'source-to-target',
    strength: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

describe('wouldCreateHierarchyCycle', () => {
  it('detects no cycle for a new child edge', () => {
    const proposedEdge = {
      id: 'e3',
      sourceId: 'a',
      targetId: 'd',
      direction: 'source-to-target' as const,
      strength: 1,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    };

    const result = wouldCreateHierarchyCycle(proposedEdge, edges);
    expect(result.createsCycle).toBe(false);
    expect(result.cycleNodeIds).toEqual([]);
    expect(result.cycleEdgeIds).toEqual([]);
  });

  it('detects a cycle for a back edge', () => {
    const proposedEdge = {
      id: 'e3',
      sourceId: 'c',
      targetId: 'a',
      direction: 'source-to-target' as const,
      strength: 1,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    };

    const result = wouldCreateHierarchyCycle(proposedEdge, edges);
    expect(result.createsCycle).toBe(true);
    expect(result.cycleNodeIds).toEqual(expect.arrayContaining(['a', 'b', 'c']));
    expect(result.cycleEdgeIds).toEqual(expect.arrayContaining(['e1', 'e2']));
  });
});
