import type { ReactNode, CSSProperties } from 'react';
/**
 * App frame primitives: AppLayout (gray3 canvas, drawer + main), PageBody (flush),
 * PagePanel (white, 1px medium left/top border, 8px top-left radius — every page's content surface; PageHeader renders inside it).
 */
export interface AppLayoutProps { drawer?: ReactNode; children: ReactNode; style?: CSSProperties; }
export declare function AppLayout(props: AppLayoutProps): JSX.Element;
export interface PageBodyProps { children: ReactNode; style?: CSSProperties; }
export declare function PageBody(props: PageBodyProps): JSX.Element;
export interface PagePanelProps { children: ReactNode; style?: CSSProperties; }
export declare function PagePanel(props: PagePanelProps): JSX.Element;
