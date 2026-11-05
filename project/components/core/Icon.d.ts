import type { CSSProperties } from 'react';
/** Tabler icon glyph by name (e.g. "plus", "dots-vertical"). Sizes: 14 sm, 16 md, 20 lg, 24 xl. */
export interface IconProps { name: string; size?: number; color?: string; style?: CSSProperties; className?: string; }
export declare function Icon(props: IconProps): JSX.Element;
