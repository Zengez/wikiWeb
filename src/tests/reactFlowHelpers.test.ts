import { describe, expect, it } from 'vitest';
import {
  getBidirectionalMarkerOffsets,
  getMarkerCountForPathLength,
  getMarkerOffsets,
} from '../utils/reactFlowHelpers';

describe('reactFlowHelpers marker utilities', () => {
  it('returns a minimum of 2 markers for short edges', () => {
    expect(getMarkerCountForPathLength(0)).toBe(2);
    expect(getMarkerCountForPathLength(50)).toBe(2);
  });

  it('returns up to 4 markers for longer edges', () => {
    expect(getMarkerCountForPathLength(240)).toBe(2);
    expect(getMarkerCountForPathLength(360)).toBe(3);
    expect(getMarkerCountForPathLength(480)).toBe(4);
    expect(getMarkerCountForPathLength(1200)).toBe(4);
  });

  it('computes evenly spaced offsets within the visible path range', () => {
    const offsets = getMarkerOffsets(400, 3);
    expect(offsets).toHaveLength(3);
    expect(offsets[0]).toBeGreaterThan(0);
    expect(offsets[2]).toBeLessThan(400);
    expect(offsets[0]).toBeLessThan(offsets[1]);
    expect(offsets[1]).toBeLessThan(offsets[2]);
  });

  it('produces forward offsets before reverse offsets for bidirectional edges', () => {
    const length = 600;
    const { forward, reverse } = getBidirectionalMarkerOffsets(length);

    expect(forward.length).toBeGreaterThanOrEqual(2);
    expect(reverse.length).toBeGreaterThanOrEqual(2);
    expect(forward.every((offset) => offset < reverse[0])).toBe(true);
    expect(reverse[0]).toBeGreaterThan(forward[forward.length - 1]);
  });
});
