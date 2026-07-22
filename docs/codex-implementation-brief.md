# Codex Implementation Brief

## First instruction to Codex

Read these files completely before making changes:

- `README.md`
- `docs/prototype-specification.md`
- `docs/data-model.md`
- `docs/decision-log.md`

Treat `docs/prototype-specification.md` as the primary source of truth.

Before writing code:

1. Inspect the repository.
2. Propose the project structure.
3. Propose the implementation milestones.
4. Identify technical risks or ambiguities.
5. Recommend whether to use React Flow and justify the choice.
6. Wait for approval before creating files.

## Recommended implementation milestones

### Milestone 1: Project foundation

- Initialize Vite + React + TypeScript.
- Add linting and formatting.
- Add tests.
- Add basic application shell.
- Define TypeScript data model.
- Define configuration data.

### Milestone 2: Static graph canvas

- Add React Flow.
- Render sample typed nodes.
- Render directed and bidirectional edges.
- Implement pointer-centered zoom and pan.
- Implement manual node dragging.

### Milestone 3: Editing

- Create nodes at double-clicked canvas coordinates.
- Edit title, type, summary, and body.
- Delete nodes.
- Create connections from node border.
- Configure direction, thickness, and color.
- Detect cycles.

### Milestone 4: Persistence

- Add IndexedDB.
- Autosave nodes, edges, config, and positions.
- Restore on startup.
- Add JSON export/import.

### Milestone 5: Semantic zoom and focus

- Implement configurable detail thresholds.
- Implement equal-stage and numeric-stage spacing.
- Implement node reveal progression.
- Implement single-click focus and background/Escape clearing.

### Milestone 6: Article view

- Open article on double-click.
- Render root body.
- Recursively render descendants.
- Add collapse/expand behavior.
- Add Related Nodes.
- Add shared-node indicators.
- Preserve graph state when closing.
- Add local drag-and-drop article ordering.

### Milestone 7: Search and content rendering

- Add title, summary, and body search.
- Dim nonmatches.
- Add Markdown and LaTeX rendering.
- Preserve TikZ blocks and show fallback.

## Working rules for Codex

- Make small, reviewable changes.
- Run tests after each meaningful step.
- Do not implement deferred features without approval.
- Keep configuration separate from core rendering logic.
- Preserve schema versioning from the beginning.
- Prefer clear types and pure graph helper functions.
- Add tests for cycle detection, ordering, and recursive traversal.
- Update documentation when implementation decisions change.
