import type { ReactNode, CSSProperties } from 'react';
export interface StatusBannerItem { tone: 'block' | 'warn' | 'info'; text: ReactNode; action?: string; onAction?: () => void; }
/** Stacked 28px tinted banners for screen/panel status (kill switch, AI down, stale data). Collapses beyond `max`. */
export interface StatusBannersProps { items: StatusBannerItem[]; pad?: string; max?: number; style?: CSSProperties; }
export declare function StatusBanners(props: StatusBannersProps): JSX.Element | null;
/** In-block state line: loading skeleton, or icon + tertiary text for error (with retry) / denied / empty. */
export interface BlockStateProps { state?: 'loading' | 'error' | 'denied' | 'empty'; note?: ReactNode; onRetry?: () => void; }
export declare function BlockState(props: BlockStateProps): JSX.Element;
/** 32px skeleton rows for a loading table. */
export interface TableSkeletonProps { rows?: number; columns?: number[]; }
export declare function TableSkeleton(props: TableSkeletonProps): JSX.Element;
