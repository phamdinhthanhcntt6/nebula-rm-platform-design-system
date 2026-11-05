# Nebula RM Platform Design System

Design language of the Simplize tenant portal on branch `dev` of `simplize-frontend/simplize-tenant-portal`.
The portal is a vendored **Twenty CRM (v2.32)**: every screen runs Twenty's shell (`DefaultLayout` → navigation drawer + record index / show pages),
and every visual token comes from `packages/simplize-ui/src/theme`. This system reproduces that layer only; the older `src/shared/components/layout` portal shell is not shipped by `dev` and is not part of the system.

## Visual foundations

- **One font: Inter.** Root size is 13px; `--t-font-size-md` (1rem) is used for nearly all UI text. Weights 400 / 500 / 600 only.
- **Neutral, low-contrast chrome.** App canvas is `gray3`; the page is a white panel flush to the right/bottom with a 1px `border-color-medium` left/top border and an 8px top-left radius. The 48px page header and the record side panel (border-left column) live inside that panel. Borders are light gray, never dark. No colored sidebars.
- **Blue is the only action color** (Radix indigo 9, `--t-color-blue`). It appears on the primary page action ("+ New …"), checked checkboxes, toggles, focus rings and selected states (`accent-quaternary` row tint). Everything else is gray.
- **Hue is data, not decoration.** Tags (select values) use a step-3 background with step-11 text; letter avatars use step-4 / step-12, hue derived from the record name. Object icons in the drawer are colored per object.
- **Hover = transparent fills.** `background-transparent-light` on hover, `-medium` on active. Transitions 0.1s.
- **Dense rows.** 28px drawer items, 32px table rows / buttons / inputs / menu items, 24px small controls. Radius: 2px avatars, 4px chips/tags/cards/cells, 8px buttons/panels/menus.
- **Icons everywhere.** Tabler icons at 16px (stroke 2). Every object, field and view has one; table headers and card rows lead with the field-type icon.

## Content foundations

- Object names are plural nouns in the drawer and page header (`Customer segments`, `Leads / Opportunities`). The primary action is literally `New <Object singular>`.
- Field labels are short nouns; empty values show the label in `font-color-light` as placeholder.
- View bar: `<icon> <View name> · <count>` left; `Filter · Sort · Options` right.
- Copy is sentence case; no exclamation marks; system messages are one line.

## Components

Core: Button, IconButton, LightButton, Chip, Avatar, Tag, Pill, ValuePill, Label, H2Title, Icon.
Forms: TextInput, Select, Checkbox, Toggle, Radio, RadioGroup, RichTextEditor.
Navigation: NavigationDrawer, NavigationDrawerHeader, NavigationDrawerTabsRow, NavigationDrawerSection, NavigationDrawerSectionTitle, NavigationDrawerItem, Tabs.
Layout: AppLayout, PageBody, PagePanel, PageHeader, ViewBar, ViewPicker, ViewBarButton.
Data: RecordTable, RecordBoard, RecordBoardColumn, RecordGroupChip, RecordCard, FieldRow, FieldGroup.
Surfaces: DropdownMenu, MenuItem, MenuItemSeparator, Card, CardContent, BlockCard, Modal, ConfirmationModal, Dialog.
Feedback: Alert, Banner, SnackBar, EmptyState.

Panels (from Full Scope, frame = Customers record panel): SidePanel, PanelIdentityHeader, PanelTitle, PanelFootRow, PanelSection, PanelListRow, PanelItemRow, SuggestionCard, HugValue, AiMark, InlineNotice, KVRow, SectionFooter, QuoteBox, KpiTile, ObjectTile, StatusBanners, BlockState, TableSkeleton, SettingsSection, SaveBar. Dialog gained `footerAlign="end"` (both buttons right, 560px) for the Full Scope dialog format. UI kit: `ui_kits/full-scope/` — the Full Scope / RM-WF-01 app running its verbatim source (includes the Customers page; source of truth for the record panel and every repeating format). The panel primitives above mirror that source for new screens; when in doubt, that page wins.

Added from the Customers reference page (claude.ai/design project fc7367fa…, `rm-platform-mvp.jsx`): ValuePill, Radio / RadioGroup, RichTextEditor (long-form block editor), BlockCard, Dialog, SnackBar `compact`, Tag `size="sm"`, Select `sizeVariant="sm"`, TextInput `multiline`. Inputs follow that page: primary background, blue border on focus with no halo, 12px tertiary sentence-case labels. Dropdowns use the translucent primary surface + medium blur.

## Files

- `styles.css` → `tokens/fonts.css`, `tokens/theme-base.css` (`--t-*` colors, light + dark), `tokens/scale.css` (spacing, radius, type, icon, motion, layout constants)
- `components/<group>/` — one `.jsx` + `.d.ts` per component, one `<group>.card.html` specimen per folder
- `guidelines/` — foundation cards (gray scale, semantic colors, accent, tag hues, type, spacing, shadow, iconography, mark)
- `ui_kits/full-scope/` — the Full Scope / RM-WF-01 app running its verbatim source, one page per shared format: list + side panel (`index.html`), kanban (`board.html`), record detail (`record.html`), dashboard, inbox, settings (Governance). README maps every source screen to its format.
- `assets/` — Simplize logo, favicon
- `github.md` — source repo + screen map

## Composing a screen

```jsx
<AppLayout drawer={<NavigationDrawer header={<NavigationDrawerHeader workspaceName="Simplize" />}>…</NavigationDrawer>}>
  <PageBody><PagePanel>
    <PageHeader title="Customer segments" Icon="chart-pie" iconColor="var(--t-color-pink)">
      <Button title="New Customer segment" accent="blue" Icon="plus" />
      <IconButton Icon="dots-vertical" variant="light" accent="tertiary" ariaLabel="More" />
    </PageHeader>
    <ViewBar viewName="Customer segments" viewIcon="chart-pie" count={6} />
    <RecordTable columns={columns} rows={rows} renderCell={(r,c)=> c.id==='name' ? <Chip label={r.name}/> : r[c.id]} />
  </PagePanel></PageBody>
</AppLayout>
```
Icons: load `@tabler/icons-webfont` and pass Tabler names (`Icon="plus"`).
