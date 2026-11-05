---
name: nebula-rm-platform-design
description: Use this skill to generate interfaces and assets in the design language of Nebula / RM Platform (Simplize tenant portal, a Twenty-CRM-based product) — for production or throwaway prototypes and mocks. Contains tokens, Inter type scale, Tabler iconography, and the record-table / kanban / drawer components the product is built from.
user-invocable: true
---

Read readme.md first: it states the rules (Inter 13px, gray3 canvas + white bordered panel, blue-only action color, tags/avatars carry hue, 32px rows, Tabler icons).
Then look at `ui_kits/full-scope/index.html` (the shipped Full Scope / RM-WF-01 app running its verbatim source) to see how real screens and the record side panel are composed; new screens use the exported components (AppLayout, NavigationDrawer, PageHeader, PagePanel, ViewBar, RecordTable, SidePanel, PanelSection, KVRow…).
For visual artifacts (mocks, prototypes), load `styles.css`, `_ds_bundle.js` and the Tabler webfont and build with the exported components; keep every value on a `--t-*` token.
For production code, map to the real components in `packages/simplize-ui` and `packages/simplize-front/src/modules/ui` (github.md names the source file each component was ported from).
If invoked without a brief, ask what screen or flow is needed and which object it is for.
