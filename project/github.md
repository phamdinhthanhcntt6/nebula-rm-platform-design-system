repo: simplize-frontend/simplize-tenant-portal
branch: dev
path: packages/simplize-ui/src, packages/simplize-front/src/modules/ui, packages/simplize-front/src/modules/object-record

## Last sync
date: 2026-09-09T15:40:00Z
tree: 229c84d7006f

### Updated in this project
- Re-based the whole system on the Twenty shell that `dev` actually renders (DefaultLayout, NavigationDrawer, RecordTable, RecordBoard); removed the legacy portal shell components.
- Tokens: `--t-*` from simplize-ui theme constants (gray scale, accent indigo, tag hue pairs, spacing, radius, Inter scale).
- 40 components in 7 groups ported from simplize-ui and simplize-front/ui; UI kit rebuilt with 7 screens.

## Sync history
- 2026-09-09T08:43:30Z · tree 014142c3abe0 · first import (portal legacy shell — superseded)

## Screen map
| Project file | Repo source |
| --- | --- |
| tokens/theme-base.css | packages/simplize-ui/src/theme-constants/theme-light.css, theme-dark.css; src/theme/constants/{GrayScaleLight,AccentLight,MainColorsLight,TagLight}.ts |
| tokens/scale.css | packages/simplize-ui/src/theme/constants/{ThemeCommon,BorderCommon,FontCommon,Icon,Animation,Text}.ts |
| components/core/Button.jsx | packages/simplize-ui/src/input/Button/{Button.tsx,Button.module.scss} |
| components/core/IconButton.jsx | packages/simplize-ui/src/input/{IconButton,LightIconButton}/*.module.scss |
| components/core/Chip.jsx | packages/simplize-ui/src/data-display/Chip/{Chip.tsx,Chip.module.scss} |
| components/core/Avatar.jsx | packages/simplize-ui/src/data-display/Avatar/{Avatar.tsx,Avatar.module.scss} |
| components/core/Tag.jsx | packages/simplize-ui/src/data-display/Tag/{Tag.tsx,Tag.module.scss} |
| components/core/Pill.jsx, Label.jsx | packages/simplize-ui/src/data-display/Pill, typography/{Label,H2Title} |
| components/forms/Checkbox.jsx | packages/simplize-ui/src/input/Checkbox/{Checkbox.tsx,Checkbox.module.scss} |
| components/forms/Toggle.jsx | packages/simplize-ui/src/input/Toggle/{Toggle.tsx,Toggle.module.scss} |
| components/forms/TextInput.jsx, Select.jsx | packages/simplize-front/src/modules/ui/input/components/{TextInputV2,Select} |
| components/surfaces/DropdownMenu.jsx | packages/simplize-front/src/modules/ui/layout/dropdown; packages/simplize-ui/src/navigation/MenuItem |
| components/surfaces/Card.jsx, Modal.jsx | packages/simplize-ui/src/surfaces/Card; simplize-front ui/layout/modal |
| components/feedback/Alert.jsx, SnackBar.jsx | packages/simplize-ui/src/feedback/{Alert,Banner,SnackBar} |
| components/navigation/NavigationDrawer.jsx | packages/simplize-front/src/modules/ui/navigation/navigation-drawer/components/*, navigation/components/MainNavigationDrawer*.tsx |
| components/navigation/Tabs.jsx | packages/simplize-front/src/modules/ui/layout/tab |
| components/layout/PageHeader.jsx, PagePanel.jsx | packages/simplize-front/src/modules/ui/layout/page/components/{PageHeader,PageBody,PagePanel,DefaultLayout}.tsx |
| components/layout/ViewBar.jsx | packages/simplize-front/src/modules/ui/layout/top-bar/TopBar.tsx; views/components/ViewBar.tsx |
| components/data/RecordTable.jsx | packages/simplize-front/src/modules/object-record/record-table/** (HeaderCellContainer, ColumnHead, CellStyleWrapper) |
| components/data/RecordBoard.jsx | packages/simplize-front/src/modules/object-record/record-board/**, record-card/RecordCard.tsx |
| components/data/FieldRow.jsx | packages/simplize-front/src/modules/object-record/record-inline-cell/components/RecordInlineCellContainer.tsx |
