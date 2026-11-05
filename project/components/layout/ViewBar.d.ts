import type { ReactNode, CSSProperties } from 'react';
/**
 * View bar under the page header: "▤ View name · count ▾" left, Filter / Sort / Options text buttons right. 39px, light bottom border.
 */
export interface ViewBarProps { viewName: string; /** Tabler icon */ viewIcon?: string; count?: number; actions?: string[]; onAction?: (action: string) => void; bottomComponent?: ReactNode; style?: CSSProperties; }
export declare function ViewBar(props: ViewBarProps): JSX.Element;
export declare function ViewPicker(props: { name: string; icon?: string; count?: number }): JSX.Element;
export declare function ViewBarButton(props: { label: string; Icon?: string; onClick?: () => void; active?: boolean }): JSX.Element;
