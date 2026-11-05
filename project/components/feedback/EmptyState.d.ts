import type { CSSProperties } from 'react';
/** Centered empty placeholder: 40px icon tile, 16px title, tertiary subtitle, optional default Button. */
export interface EmptyStateProps { Icon?: string; title: string; subtitle?: string; actionLabel?: string; onAction?: () => void; style?: CSSProperties; }
export declare function EmptyState(props: EmptyStateProps): JSX.Element;
