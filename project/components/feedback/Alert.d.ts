import type { ReactNode, CSSProperties } from 'react';
/**
 * Tinted inline alert with leading icon (success / warning / info / error).
 * Banner is the full-width solid strip used for impersonation / profiling notices.
 */
export interface AlertProps { variant?: 'success' | 'warning' | 'info' | 'error'; title?: string; children?: ReactNode; size?: 'small' | 'medium'; attached?: boolean; style?: CSSProperties; }
export declare function Alert(props: AlertProps): JSX.Element;
export interface BannerProps { children: ReactNode; variant?: 'default' | 'danger'; style?: CSSProperties; }
export declare function Banner(props: BannerProps): JSX.Element;
