import type { CSSProperties } from 'react';
/** Dark inverted toast (296px, 8px radius) with variant icon and optional Undo. */
export interface SnackBarProps { variant?: 'info' | 'success' | 'error' | 'warning'; title?: string; message?: string; onCancel?: () => void; cancelLabel?: string; onClose?: () => void; /** Show the progress rail */ duration?: number; /** One-line confirmation toast (check icon + text), centered bottom on the Customers page */ compact?: boolean; style?: CSSProperties; }
export declare function SnackBar(props: SnackBarProps): JSX.Element;
