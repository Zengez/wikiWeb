import { describe, expect, it } from 'vitest';
import { searchNodes } from '../utils/search';

const nodes = [
  {
    id: 'a',
    title: 'Pythagoras',
    summary: 'Right triangles',
    body: 'a^2 + b^2 = c^2',
    position: { x: 0, y: 0 },
    typeId: 'theorem',
    detailLevelOverride: undefined,
    appearanceOverride: undefined,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'b',
    title: 'Circle',
    summary: 'Geometry of circles',
    body: 'circumference = 2πr',
    position: { x: 0, y: 0 },
    typeId: 'definition',
    detailLevelOverride: undefined,
    appearanceOverride: undefined,
    createdAt: '',
    updatedAt: '',
  },
];

describe('searchNodes', () => {
  it('matches title, summary, and body case-insensitively', () => {
    const results = searchNodes('pythagoras', nodes);
    expect(results).toHaveLength(1);
    expect(results[0].matches.title).toBe(true);
  });

  it('returns no results for nonmatching query', () => {
    const results = searchNodes('matrix', nodes);
    expect(results).toHaveLength(0);
  });
});
