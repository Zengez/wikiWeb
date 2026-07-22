# wikiWeb Decision Log

## Product philosophy

- The web represents the author's personal conceptual organization of mathematics.
- It is not intended to enforce one absolute knowledge hierarchy.
- Manual control takes priority over automation.
- Automation may be added later as suggestions or optional layout behavior.

## Confirmed prototype decisions

### Application

- Local-first browser application.
- React and TypeScript are preferred.
- React Flow is the initial graph-canvas candidate.
- IndexedDB is the initial persistence choice.
- Future hosting and accounts are possible but deferred.

### Nodes

- One global visual position per underlying node.
- One manual summary field.
- One Markdown/LaTeX body document.
- Modular content blocks are deferred.
- Individual nodes may override type-level detail configuration.

### Node types

- Sub-concept is not a type.
- Sub-concept status is represented by a unidirectional parent-child connection.
- Organizational groupings such as Theorems and Definitions are ordinary Collection nodes.
- Example, Counterexample, Visualization, Source, Historical Note, Personal Annotation, and similar content are nodes rather than fixed fields.

### Connections

- Prototype connections are structural only.
- Unidirectional edges define parent and descendant.
- Bidirectional edges define peers.
- Multiple parents and multiple children are permitted.
- Edge labels and notes are not needed.
- Edge thickness is manually configured.
- Unidirectional edge color defaults to descendant node type color.
- Bidirectional edges use a neutral default unless overridden.

### Cycles

- Unresolved structural cycles are not allowed.
- When detected, list cycle nodes and edges.
- Offer Cancel.
- Offer Add proposed edge as bidirectional.
- Offer Convert all cycle edges to bidirectional.
- Do not offer Add Anyway.

### Zoom

- Mouse-wheel zoom is pointer-centered.
- Visibility does not depend on ancestors remaining onscreen.
- All visible nodes respond to the global zoom/detail state.
- Single-click focus exists as optional clutter control.
- Double-click opens the full article.
- Sparse numeric detail levels are allowed.
- Both equal-stage and numeric-stage spacing should be testable.

### Article

- Root body starts expanded but is collapsible.
- Descendant sections start collapsed.
- Recursive chapter -> section -> subsection structure.
- Expand All and Collapse All at top.
- X in upper-right closes article.
- Escape closes article.
- Mouse-wheel outward closes article.
- Preserve prior graph position and zoom.
- Peer nodes appear in collapsed Related Nodes.
- Shared descendants can appear more than once and are marked shared.

### Ordering

Initial global order:

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

- Per-node article order may be changed by drag and drop.
- Local ordering is saved.
- Ordering belongs to parent-child relationships.

### Content rendering

- Markdown supported.
- Inline and display LaTeX supported.
- TikZ blocks are preserved.
- TikZ renders only when a compatible local compiler exists.
- Otherwise show source and an unavailable-renderer message.

## Deferred decisions

- Final number and spacing of zoom stages.
- Final node shapes.
- Automatic layout algorithm.
- Connection-strength formula.
- Semantic search.
- Automatic grouping.
- Hosted architecture.
- Account model.
- Collaborative behavior.
