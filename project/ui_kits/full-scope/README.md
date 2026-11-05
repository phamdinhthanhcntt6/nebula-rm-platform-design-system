# Full Scope (bản gốc)

`rm-wf-01.build.src.txt` is `source/app/rm-wf-01.build.jsx` from the Full Scope project (claude.ai/design project `d6a4a49a…`, RM-WF-01.dc.html) copied verbatim — **not redrawn**. It runs on this design system's `_ds_bundle.js`. Stored as .txt so it is not compiled into the bundle; pages load it through Babel. `kit.css` = the page's helmet CSS; the review-only Demo switcher is hidden (not product UI).

## Format groups (every screen in the build, by shared layout)

| Kit page | Format | Screens in the source that share it |
|---|---|---|
| `index.html` | **Danh sách + panel phải** — PageHeader, ViewBar (view picker · Filter · Sort · Options), RecordTable 32px rows, SelectionActionBar, EmptyState, 400px side panel | ContactsScreen (Customers), MvpTasksScreen / TasksScreen, MvpAttentionListScreen (My Attention), MvpTeamScreen, CasesScreen (list), SegmentsScreen, ApprovalsScreen (6 views), AuditLogScreen, WfAutomationsScreen, WfRunsScreen |
| `board.html` | **Kanban** — same header + view bar, RecordBoard columns, RecordCard, side panel | PipelineScreen, CasesScreen (board view) |
| `record.html` | **Trang chi tiết bản ghi** — breadcrumb header + actions, left identity column (IdentityBlock full + C360LeftSection), right Tabs + C360Block grid, C360Kpi, C360Table | Customer360Screen, MvpCustomer360Screen, MvpWorkTab |
| `dashboard.html` | **Tổng quan** — status banners, stacked DashCards with attention rows, DashTiles | MvpDashboardScreen |
| `inbox.html` | **Chia đôi hội thoại** — status tabs list, thread, composer, customer panel | ConversationsScreen |
| `settings.html` | **Cấu hình nhiều tab** — header + danger action, Tabs, StatusBanners, GvSection cards, GvGrid, SaveBar with reason, confirm dialogs | GovernanceScreen and its 10 tabs (Ma trận, Dừng gửi khẩn, Mẫu tin, Giới hạn, Giờ liên hệ, Cụm từ, Giữ tin, Phù hợp, PDP, Bằng chứng) |

Shared across all of the above (not separate pages):
- **Side panels** — one frame (400px, 48px head or IdentityBlock, collapsible sections, KVRow, 40px footer): RecordSidePanel, MvpAttentionPanel, MvpTaskPanel, CasePanel, ApRequestPanel, ChainPanel, AuditPanel (440px), WfAutoPanel, WfRunPanel. Card: `components/panels/01-side-panel.card.html` mounts the real RecordSidePanel.
- **Dialogs** — MvpDialog (440, secondary left / primary right) and CaseDlgShell / WfModal / GvConfirmDlg (560, both right) → DS `Dialog` with `footerAlign`.
- **Full-page forms** — PanelActionPage, SegmentRulesPage, WfWizard (opened from panels/list actions).
- **Standalone** — LoginScreen, SettingsScreen (general).

## Changes to the source (search `Design-system addition`)
1. Wrapper exposes `window.RmPlatformApp` and `window.RmPlatformDefine()` → `window.RM_KIT` (RecordSidePanel, IdentityBlock, KVRow, …).
2. After `MODE_SCREENS`: `window.RM_KIT_EXTRA_SCREENS` lets a kit page open screens that exist in the build but are not in the customers route list (`st-governance`, `st-audit`, `pipeline`).

Each page seeds the app's own start keys (`rm-merged-role`, `rm-merged-screen-customers`, `rm-merged-record`) into a page-scoped in-memory store (a small Storage shim at the top of the page), so cards rendering in parallel never overwrite each other and the user's localStorage is untouched.

To refresh: copy the latest `rm-wf-01.build.jsx` over `rm-wf-01.build.src.txt` and re-apply the two additions.
