# wikiWeb Manual Prototype Specification

## 1. Purpose

wikiWeb is a personal, visual mathematics reference system.

It represents mathematical knowledge as a manually authored graph of typed nodes and directed or bidirectional connections. The graph is not intended to encode an absolute or universal hierarchy of mathematics. It represents the author's own conceptual organization.

The first prototype is intentionally manual. Automatic layout, inferred relationships, semantic search, connection-strength algorithms, hosted accounts, and collaborative features are deferred.

## 2. Application format

The prototype should be a local-first browser application.

Recommended baseline stack:

- React
- TypeScript
- Vite
- React Flow for the graph canvas
- IndexedDB for local persistence
- Markdown rendering
- MathJax or KaTeX for ordinary LaTeX rendering

The architecture should make a later transition to a hosted web application possible, but no server, account system, or cloud storage is required for the prototype.

## 3. Core graph behavior

The application displays a large pannable and zoomable canvas containing nodes and connections.

Required canvas interactions:

- Drag empty canvas space to pan.
- Mouse-wheel zoom is centered on the mouse pointer.
- Nodes have one global canvas position.
- Nodes remain visible according to viewport and zoom configuration even when their ancestors are outside the viewport.
- Double-clicking a node performs a quick full zoom and opens its article.
- Single-clicking a node focuses it.
- Clicking empty canvas or pressing Escape clears focus.
- Dragging a node moves it.
- Dragging from a node's outer border begins creation of a connection.
- Right-clicking a node may open a context menu for edit, delete, type, and appearance actions.

Focus is optional during normal navigation. It exists to reduce clutter.

Initial focus behavior:

- focused node and directly connected nodes remain fully emphasized
- unrelated nodes are dimmed rather than removed
- current zoom level is preserved

## 4. Node model

Each node contains:

- unique ID
- title
- node type
- manual summary
- one Markdown/LaTeX body document
- global x position
- global y position
- optional detail-level override
- optional appearance overrides
- creation timestamp
- modification timestamp

The body is initially one document rather than a modular block system.

Future possibility:

- split the body into configurable modular content blocks
- make each block independently collapsible
- allow blocks to participate in the same recursive hierarchy as nodes

This future possibility should not complicate the first implementation.

## 5. Initial node types

The initial node-type set should include:

- Major Concept
- Concept
- Collection
- Notation
- Visualization
- Proof
- Definition
- Example
- Counterexample
- Theorem
- Conjecture
- Question
- Historical Note
- Source
- Personal Annotation
- Other Collection

"Sub-concept" is not a node type. A Concept becomes a sub-concept by being the descendant of another node through a unidirectional connection.

"Theorems", "Definitions", and similar organizational groupings are ordinary Collection nodes, not renderer-generated virtual categories.

Node types should be configurable data rather than permanently hard-coded application constants.

Each node type may define:

- default color
- default size
- optional shape
- default detail level
- default reveal behavior
- default article-order rank

Individual nodes may optionally override their type defaults.

## 6. Default article ordering

The initial global default order is:

1. Notation
2. Direct Body Content
3. Visualizations
4. Proofs
5. Definitions
6. Examples
7. Counterexamples
8. Theorems
9. Conjectures
10. Questions
11. Historical Notes
12. Sources
13. Personal Annotations
14. Other Collections

This order is configurable.

Within any particular node article, the author may drag and drop immediate child sections into a custom order. The local order is saved and overrides the global default for that node.

Ordering belongs to the parent-child relationship because the same child may appear under multiple parents with a different order in each context.

## 7. Connections

The prototype uses structural connections only.

A connection may be:

- unidirectional from source to target
- unidirectional from target to source
- bidirectional

Interpretation:

- source -> target means source is the parent and target is the descendant
- target -> source means target is the parent and source is the descendant
- bidirectional means the nodes are peers

A node may have multiple parents and multiple descendants.

Each connection stores:

- unique ID
- source node ID
- target node ID
- direction mode
- child order within the parent article when hierarchical
- manual thickness or strength
- optional color override

Connections do not need labels or notes in the prototype.

Default edge coloring:

- a unidirectional edge defaults to the descendant node type's color
- a bidirectional edge defaults to a neutral color
- manual color override is allowed

The connection line should visually originate from the point on the source node boundary nearest the target node, not necessarily the exact pixel initially clicked.

## 8. Hierarchical cycles

Unidirectional connections must not create an unresolved structural cycle.

When a proposed connection would create a cycle, show a warning that lists the nodes and edges in the detected cycle.

Actions:

- Cancel
- Add the proposed new edge as bidirectional
- Convert every edge in the detected cycle to bidirectional

Do not provide an "add anyway" option in the prototype.

Non-hierarchical peer cycles are permitted because bidirectional edges do not participate in recursive parent-child article traversal.

## 9. Semantic zoom

Zoom uses configurable detail values rather than a required fixed count such as ten levels.

Example configuration:

- Major Concept: 1
- Concept: 4
- Definition: 5
- Theorem: 5
- Proof: 18

Only occupied detail values create meaningful semantic stages.

The prototype should support testing two interpretations:

### Equal stage spacing

The occupied levels `[1, 4, 5, 18]` behave as four equally spaced semantic stages.

### Numeric stage spacing

The numeric gaps influence the physical amount of zoom required between stages.

A settings toggle may switch between the two modes.

Node visibility is global rather than ancestor-dependent:

- a node does not disappear merely because its parent is outside the viewport
- all visible nodes reveal content according to current zoom and their configuration
- focus may be used manually when nearby content becomes visually dense

## 10. Progressive reveal

The reveal sequence should be configurable, initially using a simple default such as:

1. hidden
2. bubble only
3. bubble and title
4. bubble, title, and manual summary
5. child nodes become visible
6. article access at maximal detail

The configured detail value for a node type corresponds to its title-view threshold.

The distant-view, summary-view, child-reveal, and article thresholds should be represented in configuration so they can be adjusted during experimentation.

The first prototype should favor configurability over premature hard-coding.

## 11. Article view

Double-clicking a node opens its full article.

Article behavior:

- preserve the previous graph position and zoom
- show the root node title
- show the root node's Direct Body Content expanded by default
- allow Direct Body Content to be collapsed
- show immediate descendants as collapsed sections
- expanding a child displays that child's body
- that child's descendants appear as collapsed subsections
- repeat recursively in chapter -> section -> subsection form
- provide Expand All and Collapse All controls at the top
- provide an X control in the upper-right
- pressing Escape returns to the graph
- mouse-wheel outward returns to the graph
- restore the preserved graph state when returning

Only descendants are recursively included in the main article.

Bidirectional peer nodes appear in a collapsed Related Nodes section at the bottom as links.

## 12. Shared descendants

A node may have multiple parents.

In article view, the same shared node may appear in every structurally authored location.

Repeated appearances should be marked as shared references so the reader understands they refer to one underlying node.

Traversal must prevent infinite recursion by tracking the current traversal path.

## 13. Node creation

Initial workflow:

1. Double-click empty canvas space.
2. Open a small creation form.
3. Enter title.
4. Choose node type.
5. Create the node at the clicked canvas coordinates.
6. Edit summary and body afterward.
7. Drag to reposition as needed.
8. Save the global position.

## 14. Connection creation

Initial workflow:

1. Drag from a node's thick outer border.
2. Show a preview line following the pointer.
3. Drop on another node.
4. Open a small connection configuration control.
5. Choose:
   - first node -> second node
   - second node -> first node
   - bidirectional
6. Choose manual thickness or strength.
7. Apply default color according to direction.
8. Run cycle detection before saving a unidirectional connection.

The border may remain subtle at rest and become more prominent on hover.

## 15. Article ordering

The global default order is defined in configuration.

Each parent-to-child connection stores local article order.

Within an article, immediate child sections can be reordered by drag and drop.

The custom order is saved when leaving the article and restored the next time it is opened.

New children should be inserted according to their node type's global default rank while preserving existing local custom ordering as much as practical.

## 16. Search

The first prototype should include basic search:

- search titles
- search summaries
- search body text
- case-insensitive matching
- dim nonmatching nodes
- preserve matching nodes at full emphasis
- clicking a result centers the graph on that node

Advanced fuzzy, synonym, semantic, and graph-structural search are deferred.

## 17. Content rendering

The node body accepts:

- Markdown headings
- paragraphs
- lists
- emphasis
- links
- images
- inline math using `$...$`
- display math using `$$...$$`

Ordinary LaTeX should render immediately through MathJax or KaTeX.

TikZ is not equivalent to ordinary browser LaTeX rendering.

Prototype TikZ behavior:

- recognize and preserve fenced TikZ blocks
- render TikZ only if a compatible local TeX compiler is configured
- otherwise display the source and a clear "TikZ renderer unavailable" message
- do not make a full TeX installation mandatory for the prototype

Example fenced block:

```tikz
\begin{tikzpicture}
...
\end{tikzpicture}
```

## 18. Persistence and portability

Required:

- local-first persistence
- autosave
- IndexedDB storage
- JSON export
- JSON import
- data model version field for future migrations

No account is required.

No cloud service is required.

The data should remain portable so that a future hosted implementation can migrate local data to server-backed storage.

## 19. Configuration

Configuration should initially include:

- node type definitions
- node type colors
- node type sizes
- optional shapes
- default detail levels
- reveal thresholds
- default article ordering
- equal-stage versus numeric-stage zoom behavior
- default edge colors
- default edge thickness

The configuration may initially be represented as TypeScript or JSON configuration data.

A full visual settings editor is not required in the earliest milestone, but the configuration should be easy to modify during prototype testing.

## 20. Explicitly deferred features

Do not implement these in the first manual prototype unless separately approved:

- automatic node positioning
- force-directed self-organization
- computed connection strength
- layout attraction separate from semantic strength
- automatic grouping or collection creation
- connection-count warnings
- fuzzy search
- semantic search
- synonym search
- automated connection suggestions
- automatic hierarchy suggestions
- modular content blocks
- video embeds
- animation embeds
- paper-management workflows
- multiple saved layouts
- online hosting
- user accounts
- collaboration
- knowledge-gap analysis
- AI-generated restructuring
- full TikZ installation management

## 21. Prototype success criteria

The prototype is successful when the author can:

- create a small mathematics graph manually
- place nodes visually
- create parent-child and peer connections
- navigate by panning and pointer-centered zoom
- see node detail change with zoom
- focus a node to reduce clutter
- open a recursive article by double-clicking
- expand and collapse descendant sections
- reorder article sections and preserve that order
- edit Markdown and LaTeX content
- close the application and restore saved data
- export and re-import the graph
