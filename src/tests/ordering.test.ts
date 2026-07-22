import { describe, expect, it } from 'vitest';
import { compareChildren } from '../utils/ordering';
import { defaultConfig } from '../config/defaultConfig';

const nodes = [
  {
    id: 'a',
    title: 'Alpha',
    typeId: 'definition',
    summary: '',
    body: '',
    position: { x: 0, y: 0 },
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'b',
    title: 'Beta',
    typeId: 'lemma',
    summary: '',
    body: '',
    position: { x: 0, y: 0 },
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'c',
    title: 'Gamma',
    typeId: 'proof',
    summary: '',
    body: '',
    position: { x: 0, y: 0 },
    createdAt: '',
    updatedAt: '',
  },
];

const edges = [
  {
    id: 'e1',
    sourceId: 'root',
    targetId: 'a',
    direction: 'source-to-target' as const,
    articleOrder: 2,
    strength: 1,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'e2',
    sourceId: 'root',
    targetId: 'c',
    direction: 'source-to-target' as const,
    strength: 1,
    createdAt: '',
    updatedAt: '',
  },
];

describe('compareChildren', () => {
  it('orders by explicit articleOrder first', () => {
    const sorted = [nodes[0], nodes[2]].sort((left, right) =>
      compareChildren(left, right, defaultConfig, edges, 'root')
    );
    expect(sorted[0].id).toBe('a');
  });

  it('falls back to default type rank when no articleOrder exists', () => {
    const sorted = [nodes[1], nodes[2]].sort((left, right) =>
      compareChildren(left, right, defaultConfig, edges, 'root')
    );
    expect(sorted[0].id).toBe('c');
  });
});
