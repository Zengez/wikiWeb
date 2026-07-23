import './App.css';
import 'reactflow/dist/style.css';
import { useMemo } from 'react';
import ReactFlow, { Background, Controls, useEdgesState, useNodesState } from 'reactflow';
import type { Node as FlowNode, Edge as FlowEdge } from 'reactflow';
import type { NodeTypeConfig } from './models/config';
import type { WikiEdge } from './models/edge';
import type { WikiNode } from './models/node';
import { defaultConfig } from './config/defaultConfig';
import { flowEdgeFromWikiEdge, nodeStyleForType } from './utils/reactFlowHelpers';
import DirectionEdge from './components/DirectionEdge';

const sampleNodes: WikiNode[] = [
  {
    id: 'a',
    title: 'Major Concept',
    typeId: 'major-concept',
    summary: 'A high-level idea',
    body: '',
    position: { x: 0, y: 0 },
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'b',
    title: 'Definition',
    typeId: 'definition',
    summary: 'A supporting definition',
    body: '',
    position: { x: 260, y: -120 },
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'c',
    title: 'Proof',
    typeId: 'proof',
    summary: 'Proof relationship',
    body: '',
    position: { x: 260, y: 120 },
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'd',
    title: 'Related Concept',
    typeId: 'concept',
    summary: 'A closely related idea',
    body: '',
    position: { x: 520, y: 0 },
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

const sampleEdges: WikiEdge[] = [
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
    sourceId: 'a',
    targetId: 'c',
    direction: 'source-to-target',
    strength: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'e3',
    sourceId: 'b',
    targetId: 'c',
    direction: 'bidirectional',
    strength: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'e4',
    sourceId: 'c',
    targetId: 'd',
    direction: 'source-to-target',
    strength: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

const nodeTypeMap = Object.fromEntries(
  defaultConfig.nodeTypes.map((nodeType) => [nodeType.id, nodeType])
) as Record<string, NodeTypeConfig>;

const initialNodes: FlowNode[] = sampleNodes.map((node) => {
  const nodeType = nodeTypeMap[node.typeId] ?? nodeTypeMap['concept'];

  return {
    id: node.id,
    data: { label: node.title },
    position: node.position,
    style: nodeStyleForType(nodeType),
    draggable: true,
  };
});

const initialEdges: FlowEdge[] = sampleEdges.map((edge) => ({
  ...flowEdgeFromWikiEdge(edge),
  source: edge.sourceId,
  target: edge.targetId,
})) as FlowEdge[];

function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const defaultViewport = useMemo(() => ({ x: 0, y: 0, zoom: 0.8 }), []);

  const edgeTypes = useMemo(
    () => ({
      direction: DirectionEdge,
    }),
    []
  );

  // Deferred issue: Multiple edges currently share React Flow attachment handles and may overlap near
  // nodes. Distinct boundary attachment and advanced edge routing are deferred until the graph
  // renderer architecture is reconsidered.
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>wikiWeb</h1>
        <p>Milestone 2 graph prototype</p>
      </header>
      <main className="graph-shell">
        <div className="graph-legend">
          <h2>Legend</h2>
          <div className="legend-items">
            {defaultConfig.nodeTypes.slice(0, 4).map((nodeType) => (
              <div key={nodeType.id} className="legend-item">
                <span className="legend-color" style={{ background: nodeType.color }} />
                <span>{nodeType.label}</span>
                <span className="legend-size">{nodeType.size}px</span>
              </div>
            ))}
            <div className="legend-item">
              <svg className="legend-edge-svg" viewBox="0 0 72 20" aria-hidden="true">
                <path d="M 6 10 L 66 10" stroke="#264653" strokeWidth="4" fill="none" />
                <path
                  d="M 24 10 L 18 6 L 18 14"
                  stroke="#264653"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 40 10 L 34 6 L 34 14"
                  stroke="#264653"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 56 10 L 50 6 L 50 14"
                  stroke="#264653"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Directed parent → child</span>
            </div>
            <div className="legend-item">
              <svg className="legend-edge-svg" viewBox="0 0 72 20" aria-hidden="true">
                <path d="M 6 10 L 66 10" stroke="#e76f51" strokeWidth="4" fill="none" />
                <path
                  d="M 18 10 L 24 6 L 24 14"
                  stroke="#e76f51"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 54 10 L 48 6 L 48 14"
                  stroke="#e76f51"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Bidirectional peer ↔</span>
            </div>
          </div>
        </div>
        <div className="reactflow-wrapper">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            defaultViewport={defaultViewport}
            panOnDrag
            panOnScroll={false}
            zoomOnScroll
            zoomOnPinch
            zoomOnDoubleClick={false}
            zoomActivationKeyCode={null}
            nodesDraggable
            nodesConnectable={false}
            edgesConnectable={false}
            preventScrolling={true}
            attributionPosition="bottom-left"
          >
            <Background gap={20} size={1} color="#d1d5db" />
            <Controls showZoom={true} showInteractive={false} />
          </ReactFlow>
        </div>
      </main>
    </div>
  );
}

export default App;
