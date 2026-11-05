import type { ReactNode, CSSProperties } from 'react';
export interface TabItem { id: string; label: string; /** Tabler icon */ Icon?: string; disabled?: boolean; pill?: ReactNode; }
/**
 * Show-page tab strip: 40px, active tab underlined with a 2px primary bar, optional "+3 More" overflow.
 */
export interface TabsProps { tabs: TabItem[]; activeId?: string; onChange?: (id: string) => void; overflowLabel?: string; style?: CSSProperties; }
export declare function Tabs(props: TabsProps): JSX.Element;
