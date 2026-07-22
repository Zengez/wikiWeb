import type { WikiNode } from '../models/node';

export interface SearchResult {
  nodeId: string;
  score: number;
  matches: {
    title: boolean;
    summary: boolean;
    body: boolean;
  };
}

export function searchNodes(query: string, nodes: WikiNode[]): SearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  return nodes
    .map((node) => {
      const title = node.title.toLowerCase();
      const summary = node.summary.toLowerCase();
      const body = node.body.toLowerCase();
      const matches = {
        title: title.includes(normalized),
        summary: summary.includes(normalized),
        body: body.includes(normalized),
      };
      const score = Number(matches.title) * 3 + Number(matches.summary) * 2 + Number(matches.body);
      return { nodeId: node.id, score, matches };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);
}
