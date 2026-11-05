import type { ReactNode, CSSProperties } from 'react';
/**
 * Page top bar (48px, inside PagePanel, light bottom divider): colored object icon + 13px/500 title left, actions ("+ New …" blue Button, ⋮) right.
 */
export interface PageHeaderProps { title: ReactNode; /** Tabler icon */ Icon?: string; iconColor?: string; icon?: ReactNode; children?: ReactNode; hasClosePageButton?: boolean; onClosePage?: () => void; showCollapseButton?: boolean; onExpandDrawer?: () => void; /** 1px light bottom border (default true) */ divider?: boolean; style?: CSSProperties; }
export declare function PageHeader(props: PageHeaderProps): JSX.Element;
